module.exports = function(grunt) {
	"use strict";

	var shared = require("../lib.js").init(grunt);
	var trim = require("underscore.string").trim;
	var desiredJSDuckVersion = "5.0.0";

	grunt.registerInitTask("docs", "Generate docs", function(target) {
		if (!target) {
			var tasks = [
				"docs:prepare",
				"copy:docs",
				"docs:generate",
				"clean:build"
			];
			grunt.task.run(tasks);
			return;
		}
		switch (target) {
			case "prepare":
				var done = this.async();
				checkJSDuckVersion(function(success) {
					if (success === false) {
						done(false);
						return;
					}
					grunt.config("copy.docs", {
						"files": [{
							"expand": true,
							"src": [
								"<%= dirs.src %>/!(backplane).js",
								"<%= dirs.src %>/!(tests|third-party)/**/*.js",
								"<%= dirs.src %>/tests/!(qunit|sinon)/**/*.js",
								"<%= dirs.src %>/third-party/bootstrap/plugins/echo-*.js"
							],
							"dest": "<%= dirs.build %>"
						}],
						"options": {
							"basePath": "<%= dirs.src %>",
							"processContent": shared.replacePlaceholdersOnCopy
						}
					});
					var docsURL = "http:" + shared.replacePlaceholdersOnCopy(grunt.config("envConfig.baseURLs.docs"));
					var examplesConfig = grunt.file.read("docs/examples.json").replace(/\[EXAMPLES-URL\]/g, docsURL);
					grunt.file.write("build/examples.json", examplesConfig);
					done();
				});
				break;
			case "generate":
				generate(this.async());
				break;
		}
	});

	grunt.registerInitTask("docs-release", "Push docs to Github Pages", function() {
		this.requires("docs");
		var done = this.async();
		var cmd = [
			"git checkout gh-pages",
			"git pull",
			"cp -r <%=dirs.dist%>/docs/v<%=pkg.versions.main%> docs/",
			"cp -r <%=dirs.dist%>/tests/v<%=pkg.versions.main%> tests/",
			"cp -r <%=dirs.dist%>/demo/v<%=pkg.versions.main%> demo/",
			"git add docs/ tests/ demo/",
			"git commit -m \"up to v<%=pkg.versions.full%>\"",
			"git push origin gh-pages",
			"git checkout master"
		].join(" && ");
		cmd = grunt.template.process(cmd);
		if (shared.config("debug") || shared.config("env") !== "production") {
			console.log(cmd);
			done();
			return;
		}
		shared.exec(cmd, function() {
			grunt.log.ok();
			done();
		});
	});

	function checkJSDuckVersion(done) {
		shared.exec("jsduck --version | awk '{ print $2; }'", function(version) {
			var failed = false;
			version = trim(version);
			if (!version) {
				failed = true;
				grunt.log.writeln("jsduck is not installed. Install it by running command `" + ("gem install jsduck -v " + desiredJSDuckVersion).yellow + "`.").cyan;
			} else if (version !== desiredJSDuckVersion) {
				failed = true;
				grunt.log.writeln("jsduck version is " + version.red + " but must be " + desiredJSDuckVersion.green + ". Update it by running command `" + ("gem install jsduck -v " + desiredJSDuckVersion).yellow + "`.").cyan;
			} else {
				grunt.log.ok();
			}
			done(!failed);
		});
	}

	function generate(done) {
		var configFile = "build/jsduck_config.json";
		var cmd = "jsduck --config=" + configFile;
		if (shared.config("debug")) {
			console.log(cmd);
			done();
			return;
		}
		var config = grunt.file.read("config/jsduck/config.json")
			.replace(/\[VERSION\]/g, "v" + grunt.config("pkg.versions.main"));
		grunt.file.write(configFile, config);
		var path = grunt.template.process("<%= dirs.dist %>/docs/v<%= pkg.versions.main %>");
		shared.exec("rm -rf " + path + " && mkdir -p " + path, function() {
			shared.exec(cmd, function() {
				var cmd2 = "cp <%= dirs.src %>/version-redirect.html <%= dirs.dist %>/docs/index.html";
				shared.exec(grunt.template.process(cmd2), function() {
					// copy Echo specific images and CSS to documentation directory
					shared.exec("cp -r docs/patch/* " + path, done);
				});
			});
		});
	}
};
