var initialized = false;
var data = {
	// if this value is true no actual release will be performed,
	// to enable debug mode execute `grunt release -d=1`
	"debug": false,
	// execute `grunt release --env=production` for actual release
	"env": "dev",
	// flag is set to true when we execute release task
	"release": false
};
var child_process = require("child_process");

exports.init = function(grunt) {
	"use strict";

	var exports = {};
	var _ = grunt.utils._;

	exports.config = function(key, value) {
		if (typeof arguments[1] !== "undefined") {
			return grunt.utils.namespace.set(data, key, value);
		} else {
			return grunt.utils.namespace.get(data, key);
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

	if (!initialized) {
		initialized = true;

		grunt.cli.optlist.env = {
			"info": "Specify working environment. Some actions might be skipped or added during build process. Possible values are: \"production\", \"staging\", \"test\", \"dev\".",
			"type": String
		};


		exports.config("debug", !!grunt.option("debug"));
		var env = grunt.option("env");
		if (!_.contains(["production", "staging", "test", "dev"], env)) {
			env = "dev";
		}
		exports.config("env", env);
		grunt.log.writeln("");
		grunt.log.writeln("DEBUG mode is " + (exports.config("debug") ? "ON".green : "OFF".red));
		grunt.log.writeln("Working in the " + (env === "production" ? "PRODUCTION".red : env.toUpperCase().green) + " environment");
		grunt.log.writeln("");
	}

	return exports;
};
