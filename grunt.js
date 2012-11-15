module.exports = function(grunt) {
	"use strict";

	var shared = require("./tools/grunt/lib.js").init(grunt);

	var _ = grunt.utils._;
	var path = require("path");

	var dirs = {
		"build": "build",
		"src": "src",
		"dest": "web/sdk",
		"dist": "web"
	};

	var sources = {
		"sdk": {
			"third-party-js": [
				"<%= dirs.src %>/third-party/**/*.js"
			],
			"own-js": [
				"<%= dirs.src %>/*.js",
				"<%= dirs.src %>/!(third-party)/**/*.js"
			],
			"css": [
				"<%= dirs.src %>/**/*.css"
			],
			"images": [
				"<%= dirs.src %>/**/*.png",
				"<%= dirs.src %>/**/*.jpg",
				"<%= dirs.src %>/**/*.gif"
			]
		},
		"demo": ["demo/**/*"],
		"tests": ["tests/**/*"],
		"apps": ["apps/**/*"]
	};

	var destinations = {
		"sdk": {
			"min": "<%= dirs.dest %>/v<%= pkg.majorVersion %>",
			"dev": "<%= dirs.dest %>/v<%= pkg.majorVersion %>/dev",
			"final": "<%= dirs.dest %>/v<%= pkg.majorVersion %>"
		}
	};

	var packs = {
		"loader": {
			"src": [
				"third-party/yepnope/yepnope.1.5.4.js",
				"third-party/yepnope/yepnope.css.js",
				"loader.js"
			],
			"dest": "loader.js"
		},
		"api": {
			"src": [
				"api.js",
				"streamserver/api.js",
				"identityserver/api.js"
			],
			"dest": "api.pack.js"
		},
		"environment": {
			"src": [
				"utils.js",
				"events.js",
				"labels.js",
				"configuration.js",
				"<file_strip_banner:api.pack.js>",
				"user-session.js",
				"view.js",
				"control.js",
				"app.js",
				"plugin.js"
			],
			"dest": "environment.pack.js"
		},
		"third-party/jquery": {
			"src": [
				"third-party/jquery/jquery.js",
				"third-party/jquery/echo.jquery.noconflict.js",
				"<echo_wrapper:third-party/jquery/jquery.ihint.js>",
				"<echo_wrapper:third-party/jquery/jquery.viewport.js>",
				"<echo_wrapper:third-party/jquery/jquery.isotope.js>"
			],
			"dest": "third-party/jquery.pack.js"
		},
		"third-party/bootstrap": {
			"src": [
				"third-party/bootstrap/*.js"
			],
			"dest": "third-party/bootstrap.pack.js"
		}
	};

	_.each(["streamserver", "identityserver", "appserver"], function(name) {
		packs[name + "/controls"] = {
			"src": [name + "/controls/*.js"],
			"dest": name + "/controls.pack.js"
		};
		packs[name + "/plugins"] = {
			"src": [name + "/plugins/*.js"],
			"dest": name + "/plugins.pack.js"
		};
		packs[name] = {
			"src": [
				"<file_strip_banner:" + name + "/controls.pack.js>",
				"<file_strip_banner:" + name + "/plugins.pack.js>"
			],
			"dest": name + ".pack.js"
		};
	});

	var _config = {
		dirs: dirs,
		sources: sources,
		destinations: destinations,
		packs: packs,
		pkg: "<json:package.json>",
		local: shared.readOptionalJSON("config/local.json"),
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
			build: [
				"<%= dirs.build %>"
			],
			"third-party": [
				"<%= dirs.build %>/third-party/yepnope",
				"<%= dirs.build %>/third-party/jquery",
				"<%= dirs.build %>/third-party/bootstrap/!(echo-)*.js"
			],
			all: [
				"<%= dirs.dist %>",
				"<config:clean.build>"
			]
		},
		patch: {
			"loader": {
				files: {
					"build": ["<%= dirs.build %>/loader.js"],
					"release": [
						"<%= destinations.sdk.dev %>/loader.js",
						"<%= destinations.sdk.min %>/loader.js"
					]
				},
				patcher: "loader"
			},
			"html": {
				files: [
					"<%= dirs.dist %>/demo/**/*.html",
					"<%= dirs.dist %>/tests/**/*.html"
				],
				patcher: "url"
			}
		},
		assemble_bootstrap: {
			"third-party/bootstrap/css": [
				"<%= dirs.src %>/third-party/bootstrap/less/variables.less",
				"<%= dirs.src %>/third-party/bootstrap/less/mixins.less"
			]
		},
		copy: {},
		min: {},
		concat: {},
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
		uglify: {
			codegen: {
				ascii_only: true
			}
		}
	};

	grunt.initConfig(_config);
	grunt.config("pkg.majorVersion", grunt.config("pkg.version").split(".")[0]);

	// tasks

	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadTasks("tools/grunt/tasks");

	grunt.registerTask("default", "check:versions clean:all build:sdk");

	grunt.registerTask("build", "Go through all stages of building some target/system", function(target, stage) {
		if (!stage) {
			var tasks = ["build:" + target + ":dev"];
			if (shared.config("env") !== "dev") {
				tasks.push("build:" + target + ":min");
			}
			tasks.push("build:" + target + ":final");
			grunt.task.run(tasks);
			return;
		}
		grunt.config("copy", {});
		grunt.config("min", {});
		grunt.config("concat", {});
		shared.config("build", {
			"target": target,
			"stage": stage
		});
		_assignThirdPartyFilesVersion();
		_makeCopySpec();
		var tasks = "";
		switch (stage) {
			case "dev":
				_makeConcatSpec();
				tasks = "copy:own-js copy:third-party-js assemble_bootstrap patch:loader concat clean:third-party copy:build";
				break;
			case "min":
				_makeMinSpec();
				_makeConcatSpec();
				tasks = "copy:own-js copy:third-party-js assemble_bootstrap patch:loader min concat clean:third-party copy:build";
				break;
			case "final":
				tasks = "copy:css copy:images copy:build copy:demo copy:tests copy:apps patch:html";
				break;
		}
		grunt.task.run(tasks + " clean:build");
	});

	grunt.registerMultiTask("patch", "Patching files", function(version) {
		var self = this;
		var files = this.data.files;
		if (this.target === "loader") {
			files = files[shared.config("release") && !shared.config("build") ? "release" : "build"];
		}
		var config = grunt.config("local");
		grunt.file.expandFiles(files).map(function(file) {
			grunt.log.write("Patching \"" + file + "\"...");
			var src = grunt.file.read(file);
			src = patchers[self.data.patcher](
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
		if (this.target === "versions") {
			shared.checkVersions(this.data, done);
		}
	});

	grunt.registerMultiTask("assemble_bootstrap", "Assemble bootstrap files", function() {
		grunt.log.write("Assembling \"" + this.target + "\"...");

		var inputPath = grunt.config.process("dirs.src") + "/third-party/bootstrap/";
		var outputPath = grunt.config.process("dirs.build") + "/third-party/bootstrap/";
		var eol = grunt.utils.normalizelf(grunt.utils.linefeed);
		var config = grunt.file.readJSON("config/grunt/config.ui.json");

		var makeCSS = function(arLess, callback) {
			var output = arguments[2] || [];
			if (arLess.length) {
				var item = arLess.shift();
				grunt.helper("less", item.less, {}, function(css) {
					output.push(grunt.helper("bootstrap_css_wrapper", css, item.key));
					makeCSS(arLess, callback, output);
				});
			} else {
				callback && callback(output);
			}
		};

		var files = grunt.file.expandFiles(this.file.src);
		var baseLess = files.map(function(control) {
			return grunt.task.directive(control, grunt.file.read);
		}).join(eol);

		config.controls.map(function(control) {
			var outputFile = outputPath + control.output;
			var js = [];
			var less = [];

			control.input.map(function(inputFile) {
				if (_.isArray(inputFile)) {
					var params = inputFile[1];
					inputFile = inputFile[0];
					js.push([
						'(function(){',
						'if (Echo.Utils.get(Echo.jQuery, "' + params.check + '")) return;',
						grunt.task.directive(inputPath + inputFile, grunt.file.read).replace("window.jQuery", "Echo.jQuery"),
						'})();'
					].join(eol));
				} else {
					var type = (inputFile.match(/\.([a-z]+)$/) || [])[1];
					if (type === "less") {
						less.push({
							"key": inputFile,
							"less": [
								".echo-sdk-ui {",
								baseLess,
								grunt.task.directive(inputPath + inputFile, grunt.file.read),
								"}"
							].join(eol)
						});
					} else if (type === "js") {
						js.push(
							grunt.task.directive(inputPath + inputFile, grunt.file.read)
						);
					}
				}
			});

			makeCSS(less, function(css) {
				grunt.file.write(outputFile, js.join(eol) + css.join(eol));
			});
		});

		if (this.errorCount) {
			return false;
		}
		grunt.log.ok();
	});

	// shared

	grunt.registerHelper("bootstrap_css_wrapper", function(css, id) {
		css = grunt.helper("mincss", css)
				.replace(/'/g, "\\'")
				.replace(/(url\(")\.\.([/a-z-.]+)("\))/ig, "$1' + Echo.Loader.getURL('{sdk-assets}/third-party/bootstrap$2') + '$3");

		return "Echo.Utils.addCSS('" + css + "', '" + id + "');\n";
	});

	grunt.registerHelper("echo_wrapper", function(filepath) {
		var lines = [
			"(function(jQuery) {",
			"var $ = jQuery;",
			"",
			grunt.helper("strip_banner", grunt.task.directive(filepath, grunt.file.read)),
			"})(Echo.jQuery);"
		];
		return lines.join(shared.config("build.stage") === "min" ? "" : "\n");
	});

	grunt.registerHelper("make_docs", function(callback) {
		var path = grunt.config("dirs.dist") + "/docs";
		shared.exec("rm -rf " + path + " && mkdir -p " + path, function() {
			shared.exec("jsduck --config=config/jsduck/config.json", function() {
				// copy Echo specific images and CSS to documentation directory
				shared.exec("cp -r docs/patch/* " + path, callback);
			});
		});
	});

	var patchers = {
		"url": function(src, config, version) {
			var env = shared.config("env");
			if ((env === "dev" || env === "test") && config && config.domain) {
				src = src.replace(
					/cdn\.echoenabled\.com(\/sdk\/v[\d\.]+\/)(?!dev)/g,
					config.domain + "$1" + (env === "dev" ? "dev/" : "")
				).replace(
					/cdn\.echoenabled\.com(\/apps\/|\/")/g,
					config.domain + "$1"
				);
			}
			return src;
		},
		"loader": function(src, config, version) {
			src = patchers.url(src, config)
				.replace(/("?version"?: ?").*?(",)/, '$1' + version + '$2');
			if (shared.config("build")) {
				// patch debug field only when we are building files
				// and not patching already built ones during release
				src = src.replace(/("?debug"?: ?).*?(,)/, '$1' + (shared.config("build.stage") === "dev") + '$2');
			}
			return src;
		}
	};

	var reMinified = /[-.]mini?(?=\.)/;
	var reRelative = new RegExp(dirs.src + "/");
	var thirdPartyFileVersions = {};
	var thirdPartySrc = [];

	// private stuff

	function _assignThirdPartyFilesVersion() {
		var target = shared.config("build.target");
		if (thirdPartyFileVersions[target]) return;
		var versions = thirdPartyFileVersions[target] = {};
		var files = grunt.file.expandFiles(grunt.config("sources." + target + ".third-party-js"));
		var name, isMinified;
		_.each(files, function(filename) {
			filename = filename.replace(reRelative, "");
			name = filename.replace(reMinified, "");
			isMinified = name !== filename;
			if (!versions[name]) {
				versions[name] = {};
			}
			versions[name][isMinified ? "min" : "dev"] = filename;
		});
		thirdPartySrc = _.keys(versions);
		thirdPartySrc = _.reject(thirdPartySrc, function(name) {
			return /bootstrap/.test(name);
		});
	};

	function _chooseFile(name, dir, target, stage) {
		var versions = thirdPartyFileVersions[target];
		var parts = name.split(/[:>]/);
		if (parts.length > 1) {
			name = parts[1];
		}
		var file = name;
		if (versions[name]) {
			file = versions[name][stage];
			if (!file) {
				file = versions[name][stage === "dev" ? "min" : "dev"];
			}
		}
		file = dir + "/" + file;
		if (parts.length > 1) {
			parts[1] = file;
			file = parts.slice(0, -1).join(":") + ">";
		}
		return file;
	};

	function _makeCopySpec() {
		var target = shared.config("build.target");
		var stage = shared.config("build.stage");
		var spec = {};
		if (stage === "final") {
			_.each(["css", "images"], function(type) {
				spec[type] = {
					"files": {
						"<%= dirs.build %>": grunt.config("sources." + target + "." + type)
					},
					"options": {
						"basePath": "<config:dirs.src>"
					}
				};
			});
			_.each(["demo", "tests", "apps"], function(type) {
				spec[type] = {
					"files": {
						"<%= dirs.dist %>": grunt.config("sources." + type)
					},
					"options": {
						"basePath": "."
					}
				};
			});
		} else {
			spec["own-js"] = {
				"files": {
					"<%= dirs.build %>": grunt.config("sources." + target + ".own-js")
				},
				"options": {
					"basePath": "<config:dirs.src>"
				}
			};
			spec["third-party-js"] = {
				"files": {
					"<%= dirs.build %>": thirdPartySrc.map(function(name) {
						return _chooseFile(name, "<%= dirs.src %>", target, stage);
					})
				},
				"options": {
					"basePath": "<config:dirs.src>"
				}
			};
		}
		spec["build"] = {
			"files": {},
			"options": {
				"basePath": "<config:dirs.build>"
			}
		};
		spec["build"].files[grunt.config("destinations." + target + "." + stage)] = ["<%= dirs.build %>/**"];
		grunt.config("copy", spec);
	};

	function _makeMinSpec() {
		var spec = {};
		var copy = grunt.config("copy");
		_.each(["own-js", "third-party-js"], function(type) {
			_.each(copy[type].files, function(src, dest) {
				grunt.file.expandFiles(src).map(function(name) {
					// exclude already minified files
					if (reMinified.test(name)) return;
					name = name.replace(reRelative, "");
					spec[name] = {
						"src": "<%= dirs.build %>/" + name,
						"dest": "<%= dirs.build %>/" + name
					};
				});
			});
		});
		grunt.config("min", spec);
	};

	function _makeConcatSpec() {
		var target = shared.config("build.target");
		var stage = shared.config("build.stage");
		var spec = {};
		var choose = function(name) {
			return _chooseFile(name, "<%= dirs.build %>", target, stage);
		};
		_.each(grunt.config("packs"), function(pack, key) {
			spec[key] = {
				"src": ["<banner>"].concat(pack.src.map(choose)),
				"dest": "<%= dirs.build %>/" + pack.dest
			};
		});
		grunt.config("concat", spec);
	};
};
