module.exports = function(grunt) {

	var shared = require("../lib.js").init(grunt);
	var _ = grunt.utils._;

	grunt.registerInitTask("check", "Different checks (versions, pre-release, post-release, ...)", function(target) {
		if (!target) target = "config";
		if (target === "config") {
			checkConfigVersion(this.args[1] === "all");
		}
	});

	function checkConfigVersion(checkAll) {
		var cfg = grunt.config("envConfig");
		if (_.isEmpty(cfg)) {
			grunt.fail.fatal("Environment config files are absent. Execute `" + "grunt generate:config".cyan + "`");
		}
		var sample = grunt.file.readJSON("config/environments/sample.json");
		if (sample.version > cfg.version) {
			grunt.fail.fatal("Environment config files are outdated. Execute `" + "grunt generate:config".cyan + "`");
		}
		var check = function(env) {
			var filename = "config/environments/" + env + ".json";
			var content = grunt.file.read(filename);
			if (content.indexOf("[PLACEHOLDER]") !== -1) {
				grunt.fail.fatal("There are unfilled fields in the file " + filename.cyan + " . Find [PLACEHOLDER] string and replace it with the corresponding value.".yellow);
			}
		};
		if (!checkAll) {
			check(shared.config("env"));
		} else {
			_.each(shared.config("environments"), check);
		}
		grunt.log.ok("Environment config files are good.");
	}
};
