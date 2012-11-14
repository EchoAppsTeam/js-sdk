var environment = {
	"initialized": false,
	// if this value is true no actual release will be performed,
	// to enable debug mode execute `grunt release -d=1`
	"debug": false,
	// execute `grunt release --production` for actual release
	"production": false,
	"release": false
};
var child_process = require("child_process");

exports.init = function(grunt) {
	"use strict";

	var exports = {};
	var _ = grunt.utils._;

	exports.config = function(key, value) {
		if (typeof arguments[1] !== "undefined") {
			return grunt.utils.namespace.set(environment, key, value);
		} else {
			return grunt.utils.namespace.get(environment, key);
		}
	};

	// readOptionalJSON by Ben Alman (https://gist.github.com/2876125)
	exports.readOptionalJSON = function(filepath) {
		var data = {};
		try {
			data = grunt.file.readJSON(filepath);
			grunt.log.write("Reading data from " + filepath + "...").ok();
		} catch(e) {}
		return data;
	};

	exports.exec = function(command, callback) {
		grunt.log.subhead(command.yellow);
		child_process.exec(command, function(err, stdout, stderr) {
			if (err) {
				grunt.fail.fatal(err);
			}
			if (stderr) {
				grunt.log.writeln(stderr);
			}
			callback(stdout, stderr);
		});
	};

	exports.checkVersions = function(versions, done) {
		var self = this;
		var failed = false;
		this.exec("grunt --version | awk '{ print $2; }'", function(version) {
			version = _.trim(version);
			if (version < versions.grunt) {
				failed = true;
				grunt.log.writeln("grunt version is " + version.red + " but must be at least " + versions.grunt.green + ". Update it by running command `" + "sudo npm update -g grunt".yellow + "`.");
			} else {
				grunt.log.ok();
			}
			self.exec("jsduck --version | awk '{ print $2; }'", function(version) {
				version = _.trim(version);
				if (version < versions.jsduck) {
					failed = true;
					grunt.log.writeln("jsduck version is " + version.red + " but must be at least " + versions.jsduck.green + ". Update it by running command `" + "sudo gem update jsduck".yellow + "`.").cyan;
				} else {
					grunt.log.ok();
				}
				done(!failed);
			});
		});
	};

	if (!exports.config("initialized")) {
		exports.config("initialized", true);
		exports.config("debug", !!grunt.option("debug"));
		exports.config("production", !!grunt.option("production"));
		grunt.log.writeln("");
		grunt.log.writeln("DEBUG mode is " + (exports.config("debug") ? "ON".green : "OFF".red));
		grunt.log.writeln("Working with " + (exports.config("production") ? "PRODUCTION".red : "SANDBOX".green) + " environment");
		grunt.log.writeln("");
	}

	return exports;
};
