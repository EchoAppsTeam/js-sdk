module.exports = function(grunt) {
	"use strict";

	var shared = require("../lib.js").init(grunt);
	var _ = require("lodash");

	grunt.registerMultiTask("wrap", "Wrap project files with Echo related classes", function() {
		var stage = shared.config("build.stage");
		var options = this.options();
		this.filesSrc.forEach(function(filepath) {
			var lines = _.flatten([
				options.header,
				grunt.file.read(filepath),
				options.footer
			]);
			grunt.file.write(filepath, lines.join(stage === "dev" ? grunt.util.linefeed : ""));
			grunt.verbose.writeln("Wrapped file " + filepath.cyan);
		});
		grunt.log.writeln("Wrapped " + this.filesSrc.length.toString().cyan + " files");
	});
};
