module.exports = function(grunt) {

	var shared = require("../lib.js").init(grunt);
	var trim = require("underscore.string").trim;
	var desiredJSDuckVersion = "5.0.0";

	grunt.registerInitTask("docs", "Generate and push docs to Github Pages", function(target) {
		if (!target) {
			var tasks = [
				"docs:prepare",
				"copy:docs",
				"docs:generate",
				"clean:build"
			];
			if (shared.config("release")) {
				tasks.push("docs:release");
			}
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
					done();
				});
				break;
			case "generate":
				generate(this.async());
				break;
			case "release":
				release(this.async());
				break;
		}
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
		var cmd = "jsduck --config=config/jsduck/config.json";
		if (shared.config("debug")) {
			console.log(cmd);
			done();
			return;
		}
		var path = grunt.config("dirs.dist") + "/docs";
		shared.exec("rm -rf " + path + " && mkdir -p " + path, function() {
			shared.exec(cmd, function() {
				// copy Echo specific images and CSS to documentation directory
				shared.exec("cp -r docs/patch/* " + path, done);
			});
		});
	}

	function release(done) {
		var cmd = [
			"git checkout gh-pages",
			"git pull",
			"cp -r " + grunt.config("dirs.dist") + "/docs/* docs",
			"cp -r " + grunt.config("dirs.dist") + "/tests/* tests",
			"cp -r " + grunt.config("dirs.dist") + "/demo/* demo",
			"git add docs/ tests/ demo/",
			"git commit -m \"up to v" + grunt.config("pkg.version") + "\"",
			"git push origin gh-pages",
			"git checkout master"
		].join(" && ");
		if (shared.config("debug") || shared.config("env") !== "production") {
			console.log(cmd);
			done();
			return;
		}
		shared.exec(cmd, function() {
			grunt.log.ok();
			done();
		});
	}
};
