module.exports = function(grunt) {
	"use strict";

	var shared = require("../lib.js").init(grunt);
	var FtpUploader = require("../lib/ftp-uploader");
	var http = require("http");
	var _ = require("lodash");

	grunt.registerInitTask("release", "Release", function() {
		var tasks = [];
		var envConfig = grunt.config("envConfig");
		if (!_.contains(["production", "staging"], shared.config("env"))) {
			grunt.fail.fatal("Release can be performed only in \"production\" and \"staging\" environment.");
		}
		if (!envConfig || !envConfig.release) {
			grunt.fail.fatal("No release configuration for this task.");
		}
		var target = this.args[0];
		// TODO: check if we have modified files, we must not release this
		if (!this.args.length) {
			tasks = [
				"default",
				// XXX: this step does nothing, it's just needed to remove build info so that next step could patch correct loader files
				"release:build-completed",
				"patch:loader-release:stable",
				"release:sdk:latest",
				"release:sdk:stable",
				"release:apps",
				"release:purge:SDK.latest,SDK.stable",
				"release:pages"
			];
			shared.config("release", true);
			grunt.task.run(tasks);
			return;
		} else if (target === "beta") {
			tasks = [
				"default",
				// XXX: this step does nothing, it's just needed to remove build info so that next step could patch correct loader files
				"release:build-completed",
				"patch:loader-release:beta",
				"release:sdk:beta",
				"release:purge:SDK.beta"
			];
			shared.config("release", true);
			grunt.task.run(tasks);
			return;
		}

		if (!shared.config("release")) {
			grunt.fail.warn("Release steps shouldn't be executed separately but only as a part of whole release process.");
		}

		// release step can't be build step at the same time
		shared.config("build", null);
		shared.config("release", true);
		console.time(target.yellow);

		var _complete = this.async();
		var done = function(result) {
			console.timeEnd(target.yellow);
			_complete(result);
		};
		console.log(target);
		switch (target) {
			case "purge":
				purgeCDN(this.args.slice(1).join(), envConfig.release.purger, done);
				break;
			case "pages":
				pushPages(done);
				break;
			default:
				var uploads = envConfig.release.targets;
				_.each(this.args, function(arg) {
					uploads = uploads[arg];
				});
				if (!uploads || !uploads.length) {
					grunt.log.writeln("Nothing to upload for target ".yellow + target);
					done();
					return;
				}
				uploads = uploads.map(function(upload) {
					upload.baseSrcPath = grunt.template.process(upload.baseSrcPath);
					upload.dest = "/tests/release" + grunt.template.process(upload.dest);
					upload.src = grunt.file.expand({"filter": "isFile"}, upload.baseSrcPath + upload.src);
					return upload;
				});
				// let's suppose that all elements in the upload array have the same location
				var location = uploads[0].location;
				grunt.log.writeln((shared.config("debug") ? "[simulation] ".cyan : "") + "Releasing to " + location.cyan);
				var ftp = new FtpUploader({
					"complete": done,
					"auth": envConfig.release.auth[location],
					"uploads": uploads,
					"debug": shared.config("debug"),
					"logger": {
						"log": _.bind(grunt.log.writeln, grunt.log),
						"error": _.bind(grunt.log.error, grunt.log)
					}
				});
				ftp.start();
				break;
		}
	});

	function purgeCDN(labels, config, done) {
		if (!config || !config.target.paths.length) {
			grunt.log.writeln("Nothing to purge");
			done();
			return;
		}
		if (shared.config("debug")) {
			console.log(labels, config.target.paths);
			done();
			return;
		}
		var xml =
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
				'<soap:Header>' +
					'<AuthHeader xmlns="http://www.llnw.com/Purge">' +
						'<Username>' + config.user + '</Username>' +
						'<Password>' + config.password + '</Password>' +
					'</AuthHeader>' +
				'</soap:Header>' +
				'<soap:Body>' +
					'<CreatePurgeRequest xmlns="http://www.llnw.com/Purge">' +
					'<request>' +
						'<EmailType>detail</EmailType>' +
						'<EmailSubject>[JS SDK] [Limelight] Code pushed to CDN (' + (labels || "manual purge") + ')</EmailSubject>' +
						'<EmailTo>' + config.emailTo + '</EmailTo>' +
						'<EmailCc>' + (config.emailCC || "") + '</EmailCc>' +
						'<EmailBcc></EmailBcc>' +
						'<Entries>' +
							config.target.paths.map(function(path) {
								return '<PurgeRequestEntry>' +
									'<Shortname>' + config.target.name + '</Shortname>' +
									'<Url>' + config.target.url.replace("{path}", path) + '</Url>' +
									'<Regex>true</Regex>' +
								'</PurgeRequestEntry>';
							}).join("") +
						'</Entries>' +
					'</request>' +
					'</CreatePurgeRequest>' +
				'</soap:Body>' +
			'</soap:Envelope>';
		var req = http.request({
			"host": config.host,
			"path": config.path,
			"method": "POST",
			"headers": {
				"Content-Type": "text/xml"
			}
		}, function(response) {
			if (response.statusCode === 200) {
				grunt.log.ok();
				done();
			} else if (response.statusCode === 500) {
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
	}

	function pushPages(done) {
		grunt.task.run(["docs"]);
		done();
	}
};
