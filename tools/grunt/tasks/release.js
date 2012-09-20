module.exports = function(grunt) {
	var Ftp = require("ftp");
	var fs = require("fs");
	var http = require("http");
	var _ = grunt.utils._;

	var FtpUploader = function(config) {
		var self = this;
		this.config = config;
		this.client = new Ftp({
			host: config.auth.host,
			port: config.auth.port,
			connTimeout: 600000 // 10 minutes
		});
		this.client.on("connect", function() { self.start(); });
		this.client.connect();
	};

	FtpUploader.prototype.start = function() {
		var self = this;
		this.client.auth(this.config.auth.user, this.config.auth.password, function(err) {
			if (err) {
				self._error(err);
				return;
			}

			self.queue = [];
			_.each(self.config.upload, function(upload) {
				var dir = "";
				// substring(1) because variable starts from slash symbol
				_.each(upload.to.substring(1).split("/"), function(name) {
					dir += "/" + name;
					self.enqueue("makeDir", dir);
				});
				self.enqueueDir("", self.config.rootDir + upload.from, upload.to);
			});
			grunt.verbose.writeln("Starting upload");
			self.currentStep = 1;
			self.totalSteps = self.queue.length;
			self._next();
		});
	};

	FtpUploader.prototype.enqueueDir = function(dir, fromPrefix, toPrefix) {
		var self = this;
		var names = fs.readdirSync(fromPrefix + dir);
		_.each(names, function(name) {
			// skip hidden files
			if (/^\./.test(name)) {
				return;
			}

			name = dir + "/" + name;
			var stats = fs.statSync(fromPrefix + name);
			if (stats.isFile()) {
				self.enqueue("uploadFile", name, fromPrefix, toPrefix);
			} else if (stats.isDirectory()) {
				self.enqueue("makeDir", toPrefix + name);
				self.enqueueDir(name, fromPrefix, toPrefix);
			}
		});
	};

	FtpUploader.prototype.enqueue = function() {
		var args = _.toArray(arguments);
		var name = args.shift();
		this.queue.push(function() {
			this["_" + name].apply(this, args);
		});
	};

	FtpUploader.prototype._uploadFile = function(name, fromPrefix, toPrefix) {
		var self = this;
		this.client.put(fs.createReadStream(fromPrefix + name), toPrefix + name, function(err) {
			self._log(toPrefix + name);
			if (err) {
				self._error(err);
			} else {
				self._next();
			}
		});
	};

	FtpUploader.prototype._makeDir = function(name) {
		var self = this;
		this.client.mkdir(name, function() {
			self._log(name);
			self._next();
		});
	};

	FtpUploader.prototype._next = function() {
		if (!this.queue.length) {
			this.config.complete();
			return;
		}
		this.queue.shift().call(this);
	};

	FtpUploader.prototype._log = function(name) {
		grunt.log.writeln(this.currentStep++ + "/" + this.totalSteps + ": " + name);
	};

	FtpUploader.prototype._error = function(text) {
		grunt.log.error(text);
		this.client.end();
		this.config.complete(false);
	};

	grunt.registerInitTask("release", "Release", function(target) {
		var config = grunt.config("local");
		if (!config || !config.release) {
			grunt.fail.fatal("No configuration for this task.");
		}
		if (config.domain) {
			grunt.fail.fatal("Can't release files from dev environment");
		}
		// TODO: check if we have modified files, we must not release this
		// TODO: execute `grunt` before releasing anything
		if (!target) {
			grunt.task.run([
				"release:sdk",
				"release:apps"
			]);
			return;
		}
		// Tell grunt this task is asynchronous.
		var done = this.async();
		var version = grunt.config("pkg.version");
		var majorVersion = version.split(".")[0];
		switch (target) {
			case "sdk":
				_.each(config.release[target].upload, function(upload) {
					upload.from = upload.from
						.replace("{majorVersion}", majorVersion)
						.replace("{version}", version);
					upload.to = upload.to
						.replace("{majorVersion}", majorVersion)
						.replace("{version}", version);
				});
				// no break statement!
			case "apps":
				new FtpUploader(_.extend({
					"complete": done,
					"rootDir": grunt.config("dirs.dest") + "/"
				}, config.release[target]));
				grunt.task.run("release:purge:" + target);
				break;
			case "purge":
				// TODO: purge all paths in one request
				grunt.helper("cdn_purge", [arguments[1]], config.release, done);
				break;
		}
	});

	grunt.registerHelper("cdn_purge", function(paths, config, done) {
		var xml =
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
				'<soap:Header>' +
					'<AuthHeader xmlns="http://www.llnw.com/Purge">' +
						'<Username>' + config.soap.user + '</Username>' +
						'<Password>' + config.soap.password + '</Password>' +
					'</AuthHeader>' +
				'</soap:Header>' +
				'<soap:Body>' +
					'<CreatePurgeRequest xmlns="http://www.llnw.com/Purge">' +
					'<request>' +
						'<EmailType>detail</EmailType>' +
						'<EmailSubject>[JS-SDK] [Limelight] Code pushed to CDN</EmailSubject>' +
						'<EmailTo>' + config.email + '</EmailTo>' +
						'<EmailCc>' + (config.emailCC || "") + '</EmailCc>' +
						'<EmailBcc></EmailBcc>' +
						'<Entries>' +
							paths.map(function(path) {
								return '<PurgeRequestEntry>' +
									'<Shortname>' + config.soap.target.name + '</Shortname>' +
									'<Url>' + config.soap.target.url.replace("{path}", path) + '</Url>' +
									'<Regex>true</Regex>' +
								'</PurgeRequestEntry>';
							}).join("") +
						'</Entries>' +
					'</request>' +
					'</CreatePurgeRequest>' +
				'</soap:Body>' +
			'</soap:Envelope>';
		var req = http.request({
			"host": config.soap.host,
			"path": config.soap.path,
			"method": "POST",
			"headers": {
				"Content-Type": "text/xml"
			}
		}, function(response) {
			if (response.statusCode == 200) {
				grunt.log.ok();
				done();
			} else if (response.statusCode == 500) {
				response.on("data", function (text) {
					grunt.log.writeln(text);
					grunt.fail.fatal("Can't purge");
				});
			} else {
				grunt.fail.fatal("Can't purge: " + response.statusCode + " error");
			}
		});
		req.on("error", function(e) {
			grunt.fail.fatal("Problem with request: " + e.message);
		});
		req.write(xml);
		req.end();
	});
};
