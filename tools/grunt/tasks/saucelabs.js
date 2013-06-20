module.exports = function(grunt) {
	var shared = require("../lib.js").init(grunt),
		wd = require("wd"),
		Q = require("q"),
		request = require("request"),
		child_process = require("child_process"),
		url = require("url"),
		async = require("async"),
		path = require("path"),
		_ = grunt.utils._,
		util = require("util");


	// general REST call helper function using promises
	var api = function(auth, url, method, data) {
		var deferred = Q.defer();
		request({
			"method": method,
			"uri": ["https://", auth.name, ":", auth.key, "@saucelabs.com/rest", url].join(""),
			"headers": {
				"Content-Type": "application/json"
			},
			"body": JSON.stringify(data)
		}, function(error, response, body) {
			deferred.resolve(response.body);
		});
		return deferred.promise;
	};

	var printResults = function(batch, results) {
		grunt.log.subhead(getPlatformInfo(batch).blue);
		grunt.log.writeln(_.map(results.qunit, function(value, key) {
			return key + ": " + value;
		}).join(" ")[results.qunit.failed ? "red" : "green" ]);

		results.detail.map(function(info) {
			grunt.log.write("[ " + info.testNumber + " ] " + (info.module || "global") + " " + info.name + ": ");
			grunt.log.writeln(info.message.yellow);
			grunt.log.writeln("Restart test via: " + ("grunt test --browser " + batch.id + " --number " + info.testNumber).magenta);
			info.source && grunt.log.writeln("Source:\n" + info.source.grey);
		});
		if (results.logs.length) {
			grunt.log.subhead("Logs:".yellow);
			results.logs.forEach(function(item) {
				grunt.log.writeln(util.inspect(item, false, 5, true));
			});
		}
	};

	// preparing data for saucelabs
	var prepareData = function(testResult) {
		return {
			"custom-data": {
				"qunit": testResult.qunit
			},
			"passed": !testResult.qunit.failed
		};
	};

	var getPlatformInfo = function(batch) {
		return [batch.id, "[", batch.platform, batch.browserName, batch.version, "] "].join(" ");
	};

	var startBrowserTests = function(opt, batch, callback) {
		var result = {
			"batch": batch,
			"qunit": null,
			"error": null
		};
		var browser = wd.promiseRemote("ondemand.saucelabs.com", 80, opt.name, opt.key);

		grunt.log.writeln(getPlatformInfo(batch).yellow + "is starting".grey);

		browser.init(batch).then(function(sessionId) {
			grunt.log.writeln(getPlatformInfo(batch).yellow + "started".green);
		}).then(function() {
			return browser.get(opt.page);
		}).then(function() {
			return browser.eval("typeof Echo.Tests.init === \"function\"");
		}).then(function(result) {
			if (!result) {
				throw new Error("Requested page doesn't include Echo JS SDK tests");
			}
			return browser.waitForCondition("!!window.testResults", opt.timeouts.total, opt.timeouts.checking);
		}).then(function() {
			return browser.eval("window.testResults");
		}).then(function(testResults) {
			// getting summary qUnit results
			result.qunit = testResults.qunit;
			// showing all information about tests
			printResults(batch, testResults);
			return api(opt, ["/v1/", opt.name, "/jobs/", browser.sessionID].join(""), "PUT", prepareData(testResults));
		}).fail(function(err) {
			result.error = err;
			return api(opt, ["/v1/", opt.name, "/jobs/", browser.sessionID].join(""), "PUT", {"error": err});
		}).fin(function() {
			// trying to close SauceLab session
			return browser.quit();
		}).done(function(err) {
			callback(null, result);
		}, function(err) {
			// this function will be called if function fin throw error
			callback(null, result);
		});
	};


	var SauceTunnel = function(options) {
		this.libraryPath = "tools/Sauce-Connect.jar";
		this.options = options || {};
		this.state = "initialized"; // initialized | opened | closed
	};

	SauceTunnel.prototype = {
		"start": function(callback) {
			var self = this;
			this._download(function() {
				grunt.log.write("SauceLabs tunnel is opening...");
				self._open(function() {
					grunt.log.ok();
					callback();
				})
			});
		},
		"stop": function(callback) {
			grunt.log.write("SauceLabs tunnel is closing...");
			if (this.proc) {
				this.state = "closed";
				this.proc.once("close", function(code) {
					grunt.log.ok();
					callback();
				});
				try {
					this.proc.kill();
				} catch (e) {
					grunt.log.error();
					grunt.log.error(e);
					callback();
				}
			} else {
				grunt.log.error();
				callback();
			}
		},
		"_download": function(callback) {
			if (!grunt.file.exists(this.libraryPath)) {
				var cmd = [
					"curl -O http://saucelabs.com/downloads/Sauce-Connect-latest.zip",
					"unzip Sauce-Connect-latest.zip " + path.basename(this.libraryPath) + " -d " + path.dirname(this.libraryPath),
					"rm Sauce-Connect-latest.zip"
				].join(" && ");
				grunt.log.write("Start downloading Sauce-Connect.jar...");
				shared.exec(cmd, function(stdout, stderr) {
					grunt.log.ok();
					callback();
				});
			} else {
				callback();
			}
		},
		"_open": function(callback) {
			var args = [
				"-jar",
				this.libraryPath,
				this.options.name,
				this.options.key,
				"--tunnel-identifier",
				this.options.identifier
			];
			var errors = [];
			var self = this;
			this.proc = child_process.spawn("java", args);
			this.proc.stdout.on("data", function(data) {
				data = data.toString();
				if (data.match(/Connected\! You may start your tests/)) {
					this.state = "opened";
					callback();
				}
			});
			this.proc.stderr.on("data", function(data) {
				errors.push(data);
			});
			this.proc.on("close", function(code) {
				if (self.state !== "closed") {
					grunt.log.writeln("SauceLab tunnel was closed with errors:".red);
					grunt.log.writeln(errors.join("\n"));
				}
			});
		}
	};

	grunt.registerTask("saucelabs", "Running tests via SauceLabs", function(target) {
		var options = grunt.helper("options", this);
		// TODO: we must add default options after update grunt to 0.4
		options.url = url.format({
			"protocol": "http",
			"hostname": grunt.config.get("local.domainTests") || grunt.config.get("local.domain") || "localhost",
			"port": !grunt.config.get("local.domain") && grunt.config("server.port"),
			"pathname": "tests/index.html",
			"query": grunt.option("number")
				? {"testNumber": grunt.option("number")}
				: grunt.option("module")
					? {"module": grunt.option("module")}
					: {}
		});

		var browserList = null;
		if (typeof grunt.option("browser") === "string") {
			browserList = grunt.option("browser").split("|");
		} else {
			browserList = options.defaultPlatforms;
		}

		var initialData = {
			"name": process.env["SAUCE_USERNAME"] || grunt.config("local.saucelabs.name"),
			"key": process.env["SAUCE_ACCESS_KEY"] || grunt.config("local.saucelabs.key"),
			"identifier": process.env["TRAVIS_JOB_NUMBER"] || (new Date()).getTime() + "." + Math.ceil(Math.random() * 100)
		};

		if (!initialData.name || !initialData.key) {
			grunt.fail.warn("Sauce username or access key not found.");
		} else {
			grunt.log.writeln("Start testing URL: ".bold + options.url.yellow);

			var done = this.async();
			var tunnel = new SauceTunnel(initialData);

			tunnel.start(function() {
				async.mapLimit(browserList, options.concurrency, function(browser, callback) {
					if (typeof options.platforms[browser] === "undefined") {
						grunt.log.write("browser " + browser + " is undefined ").error();
						callback();
					} else {
						var batch = _.extend(options.platforms[browser], options.meta, {
							"tunnel-identifier": initialData.identifier,
							"id": browser
						});
						startBrowserTests({
							"name": initialData.name,
							"key": initialData.key,
							"page": options.url,
							"timeouts": options.timeouts
						}, batch, callback);
					}
				}, function(err, results) {
					var fail = false;
					results.forEach(function(res) {
						if (res.error) {
							fail = true;
							grunt.log.error(getPlatformInfo(res.batch).yellow + "Error: " + util.inspect(res.error, false, 5, true));
						} else if (res.qunit && res.qunit.failed) {
							fail = true;
						}
					});
					tunnel.stop(function() {
						done(!fail);
					});
				});
			});
		}
	});
};
