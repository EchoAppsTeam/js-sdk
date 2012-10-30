module.exports = function(grunt) {

	// readOptionalJSON by Ben Alman (https://gist.github.com/2876125)
	function readOptionalJSON(filepath) {
		var data = {};
		try {
			data = grunt.file.readJSON(filepath);
			grunt.log.write("Reading data from " + filepath + "...").ok();
		} catch(e) {}
		return data;
	}

	var _ = grunt.utils._;
	var child_process = require("child_process");
	var _config = {
		dirs: {
			src: "src",
			dest: "web",
			sdk: "web/sdk/v<%= pkg.majorVersion %>"
		},
		pkg: "<json:package.json>",
		local: readOptionalJSON("config/local.json"),
		meta: {
			banner:
				"/**\n" +
				" * Copyright (c) 2006-<%= grunt.template.today(\"UTC:yyyy\") %> <%= pkg.author.name %> <<%= pkg.author.email %>>. All rights reserved.\n" +
				" * You may copy and modify this script as long as the above copyright notice,\n" +
				" * this condition and the following disclaimer is left intact.\n" +
				" * This software is provided by the author \"AS IS\" and no warranties are\n" +
				" * implied, including fitness for a particular purpose. In no event shall\n" +
				" * the author be liable for any damages arising in any way out of the use\n" +
				" * of this software, even if advised of the possibility of such damage.\n" +
				" *\n" +
				" * Version: <%= pkg.version %> (<%= grunt.template.today(\"UTC:yyyy-mm-dd HH:MM:ss Z\") %>)\n" +
				" */"
		},
		check: {
			versions: {
				jsduck: "4.2.0",
				grunt: "v0.3.16"
			}
		},
		clean: {
			all: [
				"<%= dirs.dest %>"
			]
		},
		copy: {
			js: {
				files: {
					"<%= dirs.sdk %>": [
						"<%= dirs.src %>/*.js",
						"<%= dirs.src %>/!(third-party)/**/*.js",
						"<%= dirs.src %>/third-party/!(bootstrap)/**/*.js"
					]
				},
				options: {
					basePath: "<config:dirs.src>"
				}
			},
			"images-css": {
				files: {
					"<%= dirs.sdk %>": [
						"<%= dirs.src %>/**/*.css",
						"<%= dirs.src %>/**/*.png",
						"<%= dirs.src %>/**/*.jpg",
						"<%= dirs.src %>/**/*.gif"
					]
				},
				options: {
					basePath: "<config:dirs.src>"
				}
			},
			apps: {
				files: {
					"<%= dirs.dest %>": ["apps/**/*"]
				},
				options: {
					basePath: "."
				}
			},
			tests: {
				files: {
					"<%= dirs.dest %>": ["tests/**/*"]
				},
				options: {
					basePath: "."
				}
			},
			demo: {
				files: {
					"<%= dirs.dest %>": ["demo/**/*"]
				},
				options: {
					basePath: "."
				}
			}
		},
		concat: {
			loader: {
				src: [
					"<%= dirs.src %>/third-party/yepnope/yepnope.1.5.4-min.js",
					"<%= dirs.src %>/third-party/yepnope/yepnope.css.js",
					"<%= dirs.sdk %>/loader.js"
				],
				dest: "<%= dirs.sdk %>/loader.js"
			},
			"api": {
				src: [
					"<%= dirs.src %>/api.js",
					"<%= dirs.src %>/streamserver/api.js",
					"<%= dirs.src %>/identityserver/api.js"
				],
				dest: "<%= dirs.sdk %>/api.pack.js"
			},
			"environment": {
				src: [
					"<%= dirs.src %>/utils.js",
					"<%= dirs.src %>/events.js",
					"<%= dirs.src %>/labels.js",
					"<%= dirs.src %>/configuration.js",
					"<file_strip_banner:<%= dirs.sdk %>/api.pack.js>",
					"<%= dirs.src %>/user-session.js",
					"<%= dirs.src %>/view.js",
					"<%= dirs.src %>/control.js",
					"<%= dirs.src %>/app.js",
					"<%= dirs.src %>/plugin.js",
					"<%= dirs.src %>/button.js",
					"<%= dirs.src %>/tabs.js"
				],
				dest: "<%= dirs.sdk %>/environment.pack.js"
			},
			"third-party/jquery": {
				src: [
					"<%= dirs.src %>/third-party/jquery/jquery.js",
					"<%= dirs.src %>/third-party/jquery/echo.jquery.noconflict.js",
					"<echo_wrapper:<%= dirs.src %>/third-party/jquery/jquery.ihint.js>",
					"<echo_wrapper:<%= dirs.src %>/third-party/jquery/jquery.viewport.mini.js>",
					"<echo_wrapper:<%= dirs.src %>/third-party/jquery/jquery.easing-1.3.min.js>",
					"<echo_wrapper:<%= dirs.sdk %>/third-party/jquery/jquery.fancybox-1.3.4.min.js>",
					"<echo_wrapper:<%= dirs.src %>/third-party/jquery/jquery.isotope.min.js>"
				],
				dest: "<%= dirs.sdk %>/third-party/jquery.pack.js"
			},
			"third-party/bootstrap": {
				src: [
					"<%= dirs.sdk %>/third-party/bootstrap/*.js"
				],
				dest: "<%= dirs.sdk %>/third-party/bootstrap.pack.js"
			}
		},
		patch: {
			"loader": {
				files: ["<%= dirs.sdk %>/loader.js"],
				patcher: "loader"
			},
			"fancybox-css": {
				files: ["<%= dirs.sdk %>/third-party/jquery/css/fancybox.css"],
				patcher: "fancybox_css"
			},
			"fancybox-js": {
				files: ["<%= dirs.sdk %>/third-party/jquery/jquery.fancybox-1.3.4.min.js"],
				patcher: "fancybox_js"
			},

			"html": {
				files: ["<%= dirs.dest %>/demo/**/*.html", "<%= dirs.dest %>/tests/**/*.html"],
				patcher: "url"
			}
		},
		mincss: {
			"echo-button": {
				src: "<%= dirs.sdk %>/third-party/bootstrap/plugins/echo-button/echo-button.css",
				dest: "<%= dirs.sdk %>/third-party/bootstrap/plugins/echo-button/echo-button.min.css"
			}
		},
		//min: {
		//	all: ["**/*.pack.js"]
		//},
		//qunit: {
		//	files: ["test/**/*.html"]
		//},
		lint: {
			// TODO: exclude third-party and qunit from linting
			// TODO: lint dest dir cause all files there are properly wrapped
			files: [
				"grunt.js",
				"<%= dirs.sdk %>/**/*.js",
				"<%= dirs.dest %>/tests/**/*.js"
			]
		},
		assemble_bootstrap: {
			"third-party/bootstrap/css": [
				"<%= dirs.src %>/third-party/bootstrap/less/variables.less",
				"<%= dirs.src %>/third-party/bootstrap/less/mixins.less"
			]
		},
		//watch: {
		//	files: "<config:lint.files>",
		//	tasks: "lint qunit"
		//},
		jshint: {
			options: {
				//curly: true,
				eqeqeq: true,
				expr: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				nonew: true,
				smarttabs: true,
				strict: true,
				sub: true,
				trailing: true,
				undef: true,
				unused: true,
				//boss: true,
				//eqnull: true,
				browser: true,
				scripturl: true,
				jquery: true,
				devel: true,
				laxbreak: true
			},
			globals: {
				Backplane: true,
				Echo: true,
				QUnit: true,
				yepnope: true
			}
		},
		uglify: {}
	};

	_.each(["streamserver", "identityserver", "appserver"], function(name) {
		_config.concat[name + "/controls"] = {
			src: ["<%= dirs.src %>/" + name + "/controls/*.js"],
			dest: "<%= dirs.sdk %>/" + name + "/controls.pack.js"
		};
		_config.concat[name + "/plugins"] = {
			src: ["<%= dirs.src %>/" + name + "/plugins/*.js"],
			dest: "<%= dirs.sdk %>/" + name + "/plugins.pack.js"
		};
		_config.concat[name] = {
			src: [
				"<file_strip_banner:<%= dirs.sdk %>/" + name + "/controls.pack.js>",
				"<file_strip_banner:<%= dirs.sdk %>/" + name + "/plugins.pack.js>"
			],
			dest: "<%= dirs.sdk %>/" + name + ".pack.js"
		}
	});

	_.each(_config.concat, function(file) {
		file.src.unshift("<banner>");
	});

	grunt.initConfig(_config);
	grunt.config("pkg.majorVersion",  grunt.config("pkg.version").split(".")[0]);

	// ==========================================================================
	// TASKS
	// ==========================================================================

	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadTasks("tools/grunt/tasks");

	grunt.registerMultiTask("assemble_bootstrap", "Assemble bootstrap files", function() {
		var target = this.target;
		grunt.log.write("Assembling \"" + this.target + "\"...");

		var files = grunt.file.expandFiles(this.file.src);
		var baseCSS = files.map(function(control) {
			return grunt.task.directive(control, grunt.file.read);
		}).join(grunt.utils.normalizelf(grunt.utils.linefeed));

		var config = grunt.file.readJSON("config/grunt/config.ui.json");
		config.controls.map(function(control) {
			var pluginName = control.name;
			var targetFile = grunt.config.process("dirs.sdk") + "/third-party/bootstrap/" + pluginName + ".js";
			var sources = [];
			var mainCSS;

			if (control.js) {
				sources.push(
					grunt.task.directive(grunt.config("dirs.src") + "/third-party/bootstrap/js/" + control.js + ".js", grunt.file.read)
						.replace("window.jQuery", "Echo.jQuery")
				);
			}
			if (control.plugin) {
				sources.push(
					grunt.task.directive(grunt.config("dirs.src") + "/third-party/bootstrap/plugins/" + control.plugin + ".js", grunt.file.read)
				);
			}

			mainCSS = control.less.map(function(less) {
				return grunt.task.directive(grunt.config("dirs.src") + "/third-party/bootstrap/less/" + less + ".less", grunt.file.read);
			}).join(grunt.utils.normalizelf(grunt.utils.linefeed));

			var less = [
				".echo-sdk-ui {",
				baseCSS,
				mainCSS,
				"}"
			].join(grunt.utils.normalizelf(grunt.utils.linefeed));

			grunt.helper("less", less, {}, function(css) {
				sources.push(grunt.helper("bootstrap_css_wrapper", css, pluginName));
				grunt.file.write(targetFile, sources.join(grunt.utils.normalizelf(grunt.utils.linefeed)));
			});
		});

		if (this.errorCount) {
			return false;
		}
		grunt.log.ok();
	});

	grunt.registerMultiTask("patch", "Patching files", function(version) {
		var self = this;
		var files = grunt.file.expandFiles(this.data.files);
		var config = grunt.config("local");
		files.map(function(file) {
			grunt.log.write("Patching \"" + file + "\"...");
			var src = grunt.file.read(file);
			src = grunt.helper(
				"patch_" + self.data.patcher,
				src,
				config,
				grunt.config("pkg." + (version === "stable" ? "version" : "majorVersion"))
			);
			grunt.file.write(file, src);
			grunt.log.ok();
		});
	});

	grunt.registerTask("docs", function() {
		var done = this.async();
		grunt.helper("make_docs", done);
	});

	grunt.registerMultiTask("check", "Different checks (versions, pre-release, post-release, ...)", function() {
		var done = this.async();
		if (this.target == "versions") {
			grunt.helper("check_versions", this.data, done);
		}
	});

	// Default task
	grunt.registerTask("default", "check:versions clean:all copy assemble_bootstrap patch concat mincss");

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper("patch_url", function(src, config, version) {
		if (config && config.domain) {
			src = src.replace(/cdn\.echoenabled\.com\/(?=sdk\/|apps\/|")/g, config.domain + "/");
		}
		return src;
	});

	grunt.registerHelper("patch_loader", function(src, config, version) {
		src = grunt.helper("patch_url", src, config);
		return src.replace(/("version": ").*?(",)/, '$1' + version + '$2');
	});

	grunt.registerHelper("patch_fancybox_css", function(src, config, version) {
		var domainPrefix =
			"//"  + (config && config.domain ? config.domain : "cdn.echoenabled.com") +
			"/sdk/v" + version + "/third-party/jquery/img/fancybox/";
		src = src.replace(/\n\#fancybox/g, "\n#fancybox-echo")
			.replace(/\n\.fancybox/g, "\n.fancybox-echo")
			.replace(/url\(\'(.*)\'\)/g, "url('" + domainPrefix + "$1')")
			.replace(/src=\'fancybox\/(.*)\'/g, "src='" + domainPrefix + "$1')");
		return src;
	});

	grunt.registerHelper("patch_fancybox_js", function(src, config, version) {
		return src.replace(/(["'][.#]?)fancybox([a-z0-9-]*["'])/gi, "$1fancybox-echo$2");
	});

	grunt.registerHelper("echo_wrapper", function(filepath) {
		return "(function(jQuery) {\nvar $ = jQuery;\n\n" +
			grunt.helper("strip_banner", grunt.task.directive(filepath, grunt.file.read)) +
			"\n})(Echo.jQuery);\n";
	});

	grunt.registerHelper("bootstrap_css_wrapper", function(css, id) {
		css = grunt.helper("mincss", css)
				.replace(/'/g, "\\'")
				.replace(/(url\(")\.\.([/a-z-.]+)("\))/ig, "$1' + Echo.Loader.getURL('{sdk}/third-party/bootstrap$2') + '$3");

		return "Echo.Utils.addCSS('" + css + "', '" + id + "');\n";
	});

	grunt.registerHelper("exec", function(command, callback) {
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
	});

	grunt.registerHelper("make_docs", function(callback) {
		var path = grunt.config("dirs.dest") + "/docs";
		grunt.helper("exec", "rm -rf " + path + " && mkdir -p " + path, function() {
			grunt.helper("exec", "jsduck --config=config/jsduck/config.json", function() {
				// copy Echo specific images and CSS to documentation directory
				grunt.helper("exec", "cp -r docs/patch/* " + path, callback);
			});
		});
	});

	grunt.registerHelper("check_versions", function(versions, done) {
		var failed = false;
		grunt.helper("exec", "grunt --version | awk '{ print $2; }'", function(version) {
			version = _.trim(version);
			if (version < versions.grunt) {
				failed = true;
				grunt.log.writeln("grunt version is " + version.red + " but must be at least " + versions.grunt.green + ". Update it by running command `" + "sudo npm update -g grunt".yellow + "`.");
			} else {
				grunt.log.ok();
			}
			grunt.helper("exec", "jsduck --version | awk '{ print $2; }'", function(version) {
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
	});
};
