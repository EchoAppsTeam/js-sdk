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
	var _config = {
		dirs: {
			src: "src",
			dest: "web",
			sdk: "web/sdk/v<%= pkg.majorVersion %>"
		},
		pkg: "<json:package.json>",
		local: readOptionalJSON("config.local.json"),
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
		clean: {
			docs: ["<%= dirs.dest %>/docs"],
			all: [
				"<%= dirs.sdk %>",
				"<%= dirs.dest %>/products",
				"<%= dirs.dest %>/tests",
				"<config:clean:docs>"
			]
		},
		exec: {
			docs: {
				command: "jsduck --config=tools/jsduck/config.json"
			}
		},
		copy: {
			js: {
				files: {
					"<%= dirs.sdk %>": ["<%= dirs.src %>/**/*.js"]
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
			products: {
				files: {
					"<%= dirs.dest %>": ["products/**/*"]
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
			}
		},
		concat: {
			loader: {
				src: [
					"<%= dirs.src %>/thirdparty/yepnope/yepnope.1.5.4-min.js",
					"<%= dirs.src %>/loader.js"
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
					"<%= dirs.src %>/product.js",
					"<%= dirs.src %>/plugin.js",
					"<%= dirs.src %>/button.js",
					"<%= dirs.src %>/tabs.js"
				],
				dest: "<%= dirs.sdk %>/environment.pack.js"
			},
			"thirdparty/jquery": {
				src: [
					"<%= dirs.src %>/thirdparty/jquery/jquery.js",
					"<%= dirs.src %>/thirdparty/jquery/echo.jquery.noconflict.js",
					"<echo_wrapper:<%= dirs.src %>/thirdparty/jquery/jquery.ihint.js>",
					"<echo_wrapper:<%= dirs.src %>/thirdparty/jquery/jquery.viewport.mini.js>",
					"<echo_wrapper:<%= dirs.src %>/thirdparty/jquery/jquery.easing-1.3.min.js>",
					"<echo_wrapper:<%= dirs.sdk %>/thirdparty/jquery/jquery.fancybox-1.3.4.min.js>",
					"<echo_wrapper:<%= dirs.src %>/thirdparty/jquery/jquery.isotope.min.js>"
				],
				dest: "<%= dirs.sdk %>/thirdparty/jquery.pack.js"
			}
		},
		patch: {
			"loader": {
				files: ["<%= dirs.sdk %>/loader.js"],
				patcher: "loader"
			},
			"fancybox-css": {
				files: ["<%= dirs.sdk %>/thirdparty/jquery/css/fancybox.css"],
				patcher: "fancybox_css"
			},
			"fancybox-js": {
				files: ["<%= dirs.sdk %>/thirdparty/jquery/jquery.fancybox-1.3.4.min.js"],
				patcher: "fancybox_js"
			//},
			// TODO: move demo out of web folder so that patching couldn't modify versioned files
			//"html": {
			//	files: ["<%= dirs.dest %>/demo/**/*.html", "<%= dirs.dest %>/tests/**/*.html"],
			//	patcher: "url"
			}
		},
		mincss: {
			"echo-button": {
				src: "<%= dirs.sdk %>/thirdparty/bootstrap/plugins/echo-button/echo-button.css",
				dest: "<%= dirs.sdk %>/thirdparty/bootstrap/plugins/echo-button/echo-button.min.css"
			}
		},
		//min: {
		//	all: ["**/*.pack.js"]
		//},
		//qunit: {
		//	files: ["test/**/*.html"]
		//},
		lint: {
			// TODO: exclude thirdparty and qunit from linting
			// TODO: lint dest dir cause all files there are properly wrapped
			files: [
				"grunt.js",
				"<%= dirs.sdk %>/**/*.js",
				"<%= dirs.dest %>/tests/**/*.js"
			]
		},
		assemble_css: {
			"thirdparty/bootstrap/css": [
				"<%= dirs.src %>/thirdparty/bootstrap/less/variables.less",
				"<%= dirs.src %>/thirdparty/bootstrap/less/mixins.less"
			]
		},
		//watch: {
		//	files: "<config:lint.files>",
		//	tasks: "lint qunit"
		//},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				Echo: true,
				jQuery: true,
				QUnit: true
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

	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadTasks("tools/grunt/tasks");

	grunt.registerMultiTask("assemble_css", "Assemble css files", function() {
		var target = this.target;
		grunt.log.write("Assembling \"" + this.target + "\"...");

		var files = grunt.file.expandFiles(this.file.src);
		var baseCSS = files.map(function(control) {
			return grunt.task.directive(control, grunt.file.read);
		}).join(grunt.utils.normalizelf(grunt.utils.linefeed));

		var config = grunt.file.readJSON("tools/grunt/config.ui.json");
		config.controls.map(function(control) {
			var filepaths = {
				"less": grunt.config("dirs.src") + "/thirdparty/bootstrap/less/" + control.less + ".less",
				"css": grunt.config.process("dirs.sdk") + "/thirdparty/bootstrap/plugins/" + control.css +
					"/" + control.css + ".css"
			};
			var less = [
				".echo-sdk-ui {",
				baseCSS,
				grunt.task.directive(filepaths["less"], grunt.file.read),
				"}"
			].join(grunt.utils.normalizelf(grunt.utils.linefeed));
			grunt.helper("less", less, {}, function(css) {
				grunt.file.write(filepaths["css"], css);
			});
		});

		if (this.errorCount) {
			return false;
		}
		grunt.log.ok();
	});

	grunt.registerMultiTask("patch", "Patching files", function() {
		var self = this;
		var files = grunt.file.expandFiles(this.data.files);
		var config = grunt.config("local");
		files.map(function(file) {
			grunt.log.write("Patching \"" + file + "\"...");
			var src = grunt.file.read(file);
			src = grunt.helper("patch_" + self.data.patcher, src, config);
			grunt.file.write(file, src);
			grunt.log.ok();
		});
	});

	grunt.registerTask("docs", "clean:docs exec:docs");

	// Default task
	grunt.registerTask("default", "clean:all copy assemble_css concat patch mincss");

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper("patch_url", function(src, config) {
		if (config && config.domain) {
			src = src.replace(/cdn\.echoenabled\.com/ig, config.domain);
		}
		return src;
	});

	grunt.registerHelper("patch_loader", function(src, config) {
		src = grunt.helper("patch_url", src, config);
		return src.replace(': "{version}"', ': "' + grunt.config("pkg.majorVersion") + '"');
	});

	grunt.registerHelper("patch_fancybox_css", function(src, config) {
		var domainPrefix =
			"//"  + (config && config.domain ? config.domain : "cdn.echoenabled.com") +
			"/sdk/v" + grunt.config("pkg.majorVersion") + "/thirdparty/jquery/img/fancybox/";
		src = src.replace(/\n\#fancybox/g, "\n#fancybox-echo")
			.replace(/\n\.fancybox/g, "\n.fancybox-echo")
			.replace(/url\(\'(.*)\'\)/g, "url('" + domainPrefix + "$1')")
			.replace(/src=\'fancybox\/(.*)\'/g, "src='" + domainPrefix + "$1')");
		return src;
	});

	grunt.registerHelper("patch_fancybox_js", function(src, config) {
		return src.replace(/(["'][.#]?)fancybox([a-z0-9-]*["'])/gi, "$1fancybox-echo$2");
	});

	grunt.registerHelper("echo_wrapper", function(filepath) {
		return "(function(jQuery) {\nvar $ = jQuery;\n\n" +
			grunt.helper("strip_banner", grunt.task.directive(filepath, grunt.file.read)) +
			"\n})(Echo.jQuery);\n";
	});
};
