var initialized = false;
var data = {
	// if this value is true no actual release will be performed,
	// to enable debug mode execute `grunt release -d=1`
	"debug": false,
	// execute `grunt release --env=production` for actual release
	"env": "development",
	"environments": ["development", "test", "staging", "production", "ci"],
	// flag is set to true when we execute release task
	"release": false
};
var child_process = require("child_process");
var _ = require("lodash");

exports.init = function(grunt) {
	"use strict";

	var exports = {};

	exports.config = function(key, value) {
		if (typeof arguments[1] !== "undefined") {
			return grunt.util.namespace.set(data, key, value);
		} else {
			return grunt.util.namespace.get(data, key);
		}
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

	grunt.template.addDelimiters("configPlaceholder", "{%", "%}");
	exports.replacePlaceholdersOnCopy = function(text, filename) {
		// return text as is if there are no placeholders
		if (!/{%=/.test(text)) return text;
		// we set the last parameter value to "init" because we want different
		// placeholders not to mix up with default ones ( {%=x%} instead of <%=x%> )
		return grunt.template.process(text, {
			"data": grunt.config("envConfig"),
			"delimiters": "configPlaceholder"
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
		if (!_.contains(exports.config("environments"), env)) {
			env = "development";
		}
		exports.config("env", env);
		grunt.log.writeln("");
		grunt.log.writeln("DEBUG mode is " + (exports.config("debug") ? "ON".green : "OFF".red));
		grunt.log.writeln("Working in the " + (env === "production" ? "PRODUCTION".red : env.toUpperCase().green) + " environment");
		grunt.log.writeln("");
	}

	return exports;
};
