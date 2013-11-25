module.exports = function(grunt) {
	"use strict";

	var shared = require("../lib.js").init(grunt);
	var _ = require("lodash");

	grunt.registerTask("build", "Go through all stages of building some target/system", function(target, stage) {
		var tasks = [];
		if (!stage) {
			tasks = ["build:" + target + ":dev"];
			if (shared.config("env") !== "development") {
				tasks.push("build:" + target + ":min");
			}
			tasks.push("build:" + target + ":final");
			grunt.task.run(tasks);
			return;
		}
		shared.config("build", {
			"target": target,
			"stage": stage
		});
		assignThirdPartyFilesVersion();
		makeCopySpec();
		switch (stage) {
			case "dev":
				makeConcatSpec();
				tasks = [
					//"copy:css",
					//"copy:own-js",
					//"copy:third-party-js",
					//"copy:third-party-html",
					//"copy:bootstrap",
					//"wrap",
					"requirejs",
					"wrap",
					"concat:gui-pack",
					"concat:tests/harness",
					"recess:bootstrap",
					"patch:gui-css",
					"patch:loader-build",
					"concat",
					"clean:third-party",
					"copy:build"
				];
				break;
			case "min":
				makeMinSpec();
				makeConcatSpec();
				tasks = [
					//"copy:css",
					//"copy:own-js",
					//"copy:third-party-js",
					//"copy:third-party-html",
					//"copy:bootstrap",
					//"wrap",
					//"recess:bootstrap",
					//"patch:jquery-source-map",
					//"patch:gui-css",
					//"patch:loader-build",
					//"uglify",
					//"cssmin:gui",
					//"concat",
					//"clean:third-party",
					//"copy:build"
					"requirejs",
					"wrap",
					"concat:gui-pack",
					"concat:tests/harness",
					"recess:bootstrap",
					//"uglify",
					"patch:gui-css",
					"patch:loader-build",
					"cssmin:gui",
					"concat",
					"clean:third-party",
					"copy:build"
				];
				break;
			case "final":
				tasks = [
					"copy:images",
					"copy:build",
					"copy:demo",
					"copy:tests",
					"copy:apps"
				];
				break;
		}
		tasks.push("clean:build");
		grunt.task.run(tasks);
	});

	var reMinified = /[-.]mini?(?=\.)/;
	var thirdPartyFileVersions = {};
	var thirdPartySrc = [];

	function assignThirdPartyFilesVersion() {
		var target = shared.config("build.target");
		if (thirdPartyFileVersions[target]) return;
		var versions = thirdPartyFileVersions[target] = {};
		var files = grunt.file.expand(
			{"cwd": grunt.config("dirs.src")},
			grunt.config("sources." + target + ".third-party-js")
		);
		var name, isMinified;
		_.each(files, function(filename) {
			name = filename.replace(reMinified, "");
			isMinified = name !== filename;
			if (!versions[name]) {
				versions[name] = {};
			}
			versions[name][isMinified ? "min" : "dev"] = filename;
		});
		thirdPartySrc = _.keys(versions);
	}

	function chooseFile(name, target, stage) {
		var versions = thirdPartyFileVersions[target];
		var file = name;
		if (versions[name]) {
			file = versions[name][stage];
			if (!file) {
				file = versions[name][stage === "dev" ? "min" : "dev"];
			}
		}
		return file;
	}

	function makeCopySpec() {
		var spec = cleanupSpec("copy");
		var target = shared.config("build.target");
		var stage = shared.config("build.stage");
		if (stage === "final") {
			spec["images"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": grunt.config("sources." + target + ".images"),
					"dest": "<%= dirs.build %>"
				}]
			};
			_.each(["demo", "tests", "apps"], function(type) {
				spec[type] = {
					"files": [{
						"expand": true,
						"cwd": type,
						"src": grunt.config("sources." + type),
						"dest": "<%= dirs.dist %>/" + type
					}],
					"options": {
						"processContent": shared.replacePlaceholdersOnCopy,
						"processContentExclude": "**/*.{png,jpg,jpeg,gif}"
					}
				};
			});
		} else {
			spec["css"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": grunt.config("sources." + target + ".css"),
					"dest": "<%= dirs.build %>"
				}]
			};
			spec["own-js"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": grunt.config("sources." + target + ".own-js"),
					"dest": "<%= dirs.build %>"
				}]
			};
			spec["third-party-js"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": thirdPartySrc.map(function(name) {
						return chooseFile(name, target, stage);
					}),
					"dest": "<%= dirs.build %>"
				}]
			};
			spec["third-party-html"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": grunt.config("sources.third-party-html"),
					"dest": "<%= dirs.build %>"
				}]
			};
			spec["bootstrap"] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.src %>",
					"src": grunt.config("sources." + target + ".bootstrap"),
					"dest": "<%= dirs.build %>"
				}]
			};
		}
		spec["build"] = {
			"files": [{
				"expand": true,
				"cwd": "<%= dirs.build %>",
				"src": ["**"],
				"dest": grunt.config("destinations." + target + "." + stage)
			}],
			"options": {
				"processContent": function(text, filename) {
					text = shared.replacePlaceholdersOnCopy(text, filename);
					return text.replace(/\(window\.jQuery\)/g, "(jQuery)");
				},
				"processContentExclude": "**/*.{png,jpg,jpeg,gif}"
			}
		};
		grunt.config("copy", spec);
	}

	function makeMinSpec() {
		var spec = cleanupSpec("uglify");
		var target = shared.config("build.target");
		_.each(["own-js", "third-party-js"], function(type) {
			spec[type] = {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": grunt.config("sources." + target + "." + type),
					"dest": "<%= dirs.build %>",
					"filter": function(filepath) {
						// exclude already minified files
						return !reMinified.test(filepath);
					}
				}]
			};
		});
		grunt.config("uglify", spec);
	}

	function makeConcatSpec() {
		var spec = cleanupSpec("concat");
		var target = shared.config("build.target");
		var stage = shared.config("build.stage");
		var choose = function(name) {
			return "<%= dirs.build %>/" + chooseFile(name, target, stage);
		};
		_.each(grunt.config("packs"), function(pack, key) {
			spec[key] = {
				"src": pack.src.map(choose),
				"dest": "<%= dirs.build %>/" + pack.dest
			};
		});
		grunt.config("concat", spec);
	}

	function cleanupSpec(task) {
		// save only global options for this task and remove all other stuff
		var spec = {
			"options": grunt.config(task).options
		};
		grunt.config(task, spec);
		return spec;
	}
};
