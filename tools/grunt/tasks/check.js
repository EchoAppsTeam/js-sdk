module.exports = function(grunt) {
	"use strict";

	var shared = require("../lib.js").init(grunt);
	var _ = require("lodash");
	var http = require("http");
	var async = require("async");
	var url = require("url");

	grunt.registerInitTask("check", "Different checks (versions, pre-release, post-release, ...)", function(target) {
		var done = this.async();
		if (target === "uploaded") {
			checkUploadedFiles(done);
		} else if (target === "docs") {
			checkDocs(done);
		}
	});

	function checkUploadedFiles(done) {
		if (shared.config("env") !== "production") {
			grunt.fail.fatal("This check can be performed only in \"production\" environment.");
		}
		var i = 0, URLs = [];
		var headersByType = {
			"js": {
				"content-type": "application/javascript; charset=utf-8",
				"content-encoding": "gzip"
			},
			"css": {
				"content-type": "text/css",
				"content-encoding": "gzip"
			},
			"html": {
				"content-type": "text/html",
				"content-encoding": "gzip"
			},
			"png": {
				"content-type": "image/png"
			},
			"gif": {
				"content-type": "image/gif"
			},
			"jpg": {
				"content-type": "image/jpeg"
			}
		};
		var expectedHeaders = function(type, URL) {
			var headers = headersByType[type];
			if (!headers) {
				grunt.fail.fatal("Expected headers are not specified for " + type + " files");
			}
			headers["cache-control"] = "max-age=7776000";
			// we might want to check the URL to set different headers for different files
			if (/\/apps\/|\/sdk\/v\d(?:\.beta)?\//.test(URL)) {
				headers["cache-control"] = "max-age=86400";
			}
			return headers;
		};
		URLs = _(grunt.config("release"))
			.chain()
			.reduce(function(acc, config, key) {
				if (key !== "options") {
					acc = acc.concat(_.values(config.options.deployTargets));
				}
				return acc;
			}, [])
			.map(function(upload) {
				var files = grunt.file.expand({
					"cwd": upload.cwd,
					"filter": "isFile"
				}, upload.src);
				return _.map(files, function(name) {
					return "http:" + grunt.config("envConfig.baseURLs.cdn") + upload.dest + name;
				});
			})
			.flatten()
			.value();
		URLs.sort();
		async.eachSeries(URLs, function(URL, next) {
			var type = URL.match(/\.([^\.]+)$/)[1];
			var urlOptions = url.parse(URL);
			urlOptions.headers = {
				"Accept-Encoding": "gzip,deflate"
			};
			i++;
			grunt.log.write("[" + i + "/" + URLs.length + "] " + URL.yellow + " ... ");
			if (shared.config("debug")) {
				grunt.log.writeln("skipped");
				next();
				return;
			}
			http.get(urlOptions, function(response) {
				var headers = {};
				if (response.statusCode === 404) {
					grunt.log.writeln("missing".red);
					next();
					return;
				}
				_.each(expectedHeaders(type, URL), function(expected, name) {
					var received = response.headers[name];
					if (!received || received !== expected) {
						headers[name] = {
							"expected": expected,
							"received": received || "[UNDEFINED]"
						};
					}
				});
				if (!_.isEmpty(headers)) {
					grunt.log.writeln("wrong headers".red);
					grunt.log.writeln(JSON.stringify(headers, null, "\t"));
					next();
					return;
				}
				grunt.log.ok();
				next();
			}).on("error", function(e) {
				grunt.log.writeln("download error: ".red + e.message);
				next();
			});
		}, function(err) {
			err && grunt.warn(err);
			done();
		});
	}

	function checkDocs(done) {
		grunt.log.subhead("Searching for dead wiki links");
		shared.exec("grep -roZE 'https?://wiki.aboutecho.com[^\")]+' src/ docs/", function(stdout) {
			var lines = stdout.trim().split(/[\r\n]+/);
			async.eachSeries(lines, function(line, next) {
				var parts = line.split("\0");
				var urlOptions = url.parse(parts[1]);
				urlOptions.method = "HEAD";
				grunt.log.write("Checking link " + parts[1].yellow + " from the file " + parts[0].yellow + " ... ");
				http.get(urlOptions, function(response) {
					if (response.statusCode === 200) {
						grunt.log.writeln("OK".green);
					} else {
						grunt.log.writeln("bad status code: ".red + response.statusCode);
					}
					next();
				}).on("error", function(e) {
					grunt.log.writeln("error requesting headers: ".red + e.message);
					next();
				});
			}, function(err) {
				err && grunt.warn(err);
				done();
			});
		});
	}
};
