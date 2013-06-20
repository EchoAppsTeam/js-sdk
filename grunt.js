module.exports = function(grunt) {
	"use strict";

	var shared = require("./tools/grunt/lib.js").init(grunt);
	var recess = require('recess');

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
				"<%= dirs.src %>/*.css",
				"<%= dirs.src %>/!(third-party)/**/*.css"
			],
			"bootstrap": [
				"<%= dirs.src %>/third-party/bootstrap/**/*.js",
				"<%= dirs.src %>/third-party/bootstrap/**/*.css",
				"<%= dirs.src %>/third-party/bootstrap/**/*.less"
			],
			"images": [
				"<%= dirs.src %>/**/*.png",
				"<%= dirs.src %>/**/*.jpg",
				"<%= dirs.src %>/**/*.gif"
			]
		},
		"third-party-html": [
			"<%= dirs.src %>/third-party/**/*.html"
		],
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
				"<echo_yepnope_wrapper:third-party/yepnope/yepnope.1.5.4.js>",
				"<echo_yepnope_injectcss_wrapper:third-party/yepnope/yepnope.css.patched.js>",
				"cookie.js",
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
				"plugin.js",
				"canvas.js"
			],
			"dest": "environment.pack.js"
		},
		"third-party/jquery": {
			"src": [
				"third-party/jquery/jquery.js",
				"third-party/jquery/echo.jquery.noconflict.js",
				"<echo_wrapper:third-party/jquery/jquery.ihint.js>",
				"<echo_wrapper:third-party/jquery/jquery.viewport.js>"
			],
			"dest": "third-party/jquery.pack.js"
		},
		"third-party/jquery/jquery.isotope.min.js": {
			"src": [
				"<echo_wrapper:third-party/jquery/jquery.isotope.min.js>"
			],
			"dest": "third-party/jquery/jquery.isotope.min.js"
		},
		"third-party/bootstrap": {
			"src": [
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-transition.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-affix.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-alert.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-button.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-modal.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-carousel.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-collapse.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-dropdown.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-tooltip.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-popover.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-scrollspy.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-tab.js>",
				"<bootstrap_js_wrapper:third-party/bootstrap/js/bootstrap-typeahead.js>",
				"gui.js",
				"third-party/bootstrap/plugins/echo-modal.js",
				"third-party/bootstrap/plugins/echo-button.js",
				"third-party/bootstrap/plugins/echo-dropdown.js",
				"third-party/bootstrap/plugins/echo-tabs.js"
			],
			"dest": "gui.pack.js"
		},
		"tests/harness": {
			"src": [
				"tests/qunit/qunit.js",
				"tests/harness/runner.js",
				"tests/harness/stats.js"
			],
			"dest": "tests/harness.js"
		}
	};

	_.each(["streamserver", "identityserver"], function(name) {
		packs[name + "/controls"] = {
			"src": [name + "/controls/*.js"],
			"dest": name + "/controls.pack.js"
		};
		packs[name + "/plugins"] = {
			"src": [name + "/plugins/!(pinboard-visualization).js"],
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

	var testPlatforms = {
		"firefox": {
			"browserName": "firefox",
			"version": "21",
			"platform": "Windows 7"
		},
		"chrome": {
			"browserName": "chrome",
			"version": "27",
			"platform": "Windows 7"
		},
		"safari": {
			"browserName": "safari",
			"version": "6",
			"platform": "OS X 10.8"
		},
		"ie8": {
			"browserName": "internet explorer",
			"version": "8",
			"platform": "Windows 7"
		},
		"ie9": {
			"browserName": "internet explorer",
			"version": "9",
			"platform": "Windows 7"
		},
		"ie10": {
			"browserName": "internet explorer",
			"version": "10",
			"platform": "Windows 8"
		},
		"iphone": {
			"browserName": "iphone",
			"version": "6.0",
			"platform": "OS X 10.8"
		},
		"ipad": {
			"browserName": "ipad",
			"version": "6.0",
			"platform": "OS X 10.8"
		},
		"android": {
			"browserName": "android",
			"version": "4",
			"platform": "Linux"
		}
	};

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
				" * Copyright 2012-<%= grunt.template.today(\"UTC:yyyy\") %> <%= pkg.author.name %>.\n" +
				" * Licensed under the Apache License, Version 2.0 (the \"License\");\n" +
				" * you may not use this file except in compliance with the License.\n" +
				" * You may obtain a copy of the License at\n" +
				" *\n" +
				" * http://www.apache.org/licenses/LICENSE-2.0\n" +
				" *\n" +
				" * Unless required by applicable law or agreed to in writing, software\n" +
				" * distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
				" * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
				" * See the License for the specific language governing permissions and\n" +
				" * limitations under the License.\n" +
				" *\n" +
				" * Version: <%= pkg.version %> (<%= grunt.template.today(\"UTC:yyyy-mm-dd HH:MM:ss Z\") %>)\n" +
				" */"
		},
		check: {
			versions: {
				jsduck: "5.0.0.beta2",
				grunt: "v0.3.17"
			}
		},
		clean: {
			build: [
				"<%= dirs.build %>"
			],
			"third-party": [
				"<%= dirs.build %>/third-party/yepnope",
				"<%= dirs.build %>/third-party/bootstrap",
				"<%= dirs.build %>/third-party/jquery/!(jquery.isotope.min).js"
			],
			all: [
				"<%= dirs.dist %>",
				"<config:clean.build>"
			]
		},
		mincss: {
			bootstrap: {
				src: ["<%= dirs.build %>/gui.pack.css"],
				dest: "<%= dirs.build %>/gui.pack.css"
			}
		},
		recess: {
			bootstrap: {
				options: {
					paths: [dirs.build + "/third-party/bootstrap/less"]
				},
				files: {
					"<%= dirs.build %>/gui.pack.css": ["<%= dirs.build %>/third-party/bootstrap/less/bootstrap.less", "<%= dirs.build %>/third-party/bootstrap/plugins/*.css"]
				}
			}
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
			"testlib": {
				files: [
					"<%= dirs.dist %>/tests/config.js"
				],
				patcher: "testurl"
			},
			"html": {
				files: [
					"<%= dirs.dist %>/demo/**/*.html",
					"<%= dirs.dist %>/tests/**/*.html"
				],
				patcher: "url"
			},
			"bootstrap-less": {
				files: [
					"<%= dirs.build %>/third-party/bootstrap/less/bootstrap.less"
				],
				patcher: "bootstrap-less"
			},
			"bootstrap-css": {
				files: [
					"<%= dirs.build %>/gui.pack.css"
				],
				patcher: "bootstrap-css"
			}
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
		},
		server: {
			port: 9001,
			base: dirs.dist
		},
		saucelabs: {
			local: {
				options: {
					meta: {
						build: "local#" + Math.round(Math.random() * 5000),
						name: "Local tests",
						tags: ["local"]
					},
					timeouts: {
						total: 1000 * 60 * 5, // 5min
						checking: 5000
					},
					concurrency: 3, // SauceLabs provides 3 Parallel VMs for simultaneous tests
					defaultPlatforms: ["firefox", "chrome", "ie9"],
					platforms: testPlatforms
				}
			},
			travis: {
				options: {
					meta: {
						build: process.env["TRAVIS_BUILD_NUMBER"],
						name: "Echo JS SDK",
						tags: [process.env["TRAVIS_BRANCH"], "node.js v" + process.env["TRAVIS_NODE_VERSION"], "CI"]
					},
					timeouts: {
						total: 1000 * 60 * 5, // 5min
						checking: 5000
					},
					concurrency: 3, // SauceLabs provides 3 Parallel VMs for simultaneous tests
					defaultPlatforms: ["firefox", "chrome", "safari", "ie8", "ie9", "ie10"],
					platforms: testPlatforms
				}
			}
		}
	};

	grunt.initConfig(_config);
	grunt.config("pkg.majorVersion", grunt.config("pkg.version").split(".")[0]);

	// tasks

	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadTasks("tools/grunt/tasks");

	grunt.registerTask("default", "check:versions clean:all build:sdk");
	grunt.registerTask("test", "Execute tests", function() {
		grunt.task.run(process.env["CI"] ? "server saucelabs:travis" : "saucelabs:local");
	});

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
				tasks = "copy:css copy:own-js copy:third-party-js copy:third-party-html copy:bootstrap patch:bootstrap-less recess:bootstrap patch:bootstrap-css patch:loader concat clean:third-party copy:build";
				break;
			case "min":
				_makeMinSpec();
				_makeConcatSpec();
				tasks = "copy:css copy:own-js copy:third-party-js copy:third-party-html copy:bootstrap patch:bootstrap-less recess:bootstrap patch:bootstrap-css patch:loader min mincss:bootstrap concat clean:third-party copy:build";
				break;
			case "final":
				tasks = "copy:images copy:build copy:demo copy:tests copy:apps patch:testlib patch:html";
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
				grunt.config("pkg." + (version === "stable" ? "version" : "majorVersion")) + (version === "beta" ? ".beta" : "")
			);
			grunt.file.write(file, src);
			grunt.log.ok();
		});
	});

	grunt.registerTask("docs", function() {
		var done = this.async();
		grunt.helper("make_docs", done);
	});

	grunt.registerMultiTask("recess", "Compile LESS files to CSS through Twitter Recess tool", function(task) {
		var async = grunt.util.async;
		var done = this.async();
		var options = grunt.helper("options", this);
		this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

		var srcFiles;

		async.forEachSeries(this.files, function(file, next) {
			srcFiles = grunt.file.expandFiles(file.src);
			async.concatSeries(srcFiles, function(srcFile, nextConcat) {
				recess(srcFile, { compile: true }, function (err, res) {
					nextConcat(null, res[0].output[0]);
				});
			}, function(err, css) {
				grunt.file.write(file.dest, css.join("\n") || "");
				grunt.log.writeln("File '" + file.dest + "' created.");
				next();
			});
		}, function() {
			done();
		});
	});

	grunt.registerMultiTask("check", "Different checks (versions, pre-release, post-release, ...)", function() {
		var done = this.async();
		if (this.target === "versions") {
			shared.checkVersions(this.data, done);
		}
	});

	// shared

	grunt.registerHelper("bootstrap_js_wrapper", function(filepath) {
		var component = filepath.match(/bootstrap-([\w]+)\.js/);
		var lines = [grunt.helper("strip_banner", grunt.task.directive(filepath, grunt.file.read)).replace("window.jQuery", "Echo.jQuery")];
		if (component) {
			lines = ['(function(){',
				'if (Echo.Utils.get(Echo.jQuery, "fn.' + component[1] + '")) return;']
				.concat(lines, ['})();']);
		}
		return lines.join(shared.config("build.stage") === "min" ? "" : "\n");
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

	grunt.registerHelper("echo_yepnope_wrapper", function(filepath) {
		var lines = [
			"if (!window.Echo) window.Echo = {};",
			"Echo._yepnope = window.yepnope;",
			"if (!Echo.yepnope) {",
			grunt.task.directive(filepath, grunt.file.read),
			"Echo.yepnope = window.yepnope;",
			"Echo.yepnope.injectCss = undefined;",
			"window.yepnope = Echo._yepnope;",
			"delete Echo._yepnope;",
			"}",
			""
		];
		return lines.join(shared.config("build.stage") === "min" ? "" : "\n");
	});

	grunt.registerHelper("echo_yepnope_injectcss_wrapper", function(filepath) {
		var lines = [
			"(function(yepnope) {",
			"if (!yepnope.injectCss) {",
			grunt.task.directive(filepath, grunt.file.read),
			"}",
			"})(Echo.yepnope);",
			""
		];
		return lines.join(shared.config("build.stage") === "min" ? "" : "\n");
	});

	grunt.registerHelper("make_docs", function(callback) {
		var path = grunt.config("dirs.dist") + "/docs";
		shared.exec("rm -rf " + path + " && mkdir -p " + path, function() {
			// run jsduck without multi-processing because multi-processing
			// can cause this issue: https://github.com/senchalabs/jsduck/issues/353
			shared.exec("jsduck --config=config/jsduck/config.json --processes=0", function() {
				// copy Echo specific images and CSS to documentation directory
				shared.exec("cp -r docs/patch/* " + path, callback);
			});
		});
	});

	var patchers = {
		"url": function(src, config, version) {
			var env = shared.config("env");
			var domain = process.env["CI"]
				? "localhost:" + grunt.config("server.port")
				: config && config.domain;
			if ((env === "dev" || env === "test") && domain) {
				src = src.replace(
					/cdn\.echoenabled\.com(\/sdk\/v[\d\.]+\/)(?!dev)/g,
					domain + "$1" + (env === "dev" ? "dev/" : "")
				).replace(
					/cdn\.echoenabled\.com(\/apps\/|\/")/g,
					domain + "$1"
				);
			}
			return src;
		},
		"testurl": function(src, config, version) {
			var env = shared.config("env");
			var domain = process.env["CI"]
				? "localhost:" + grunt.config("server.port")
				: config && (config.domainTests || config.domain);
			if ((env === "dev" || env === "test") && domain) {
				src = src.replace(/echoappsteam\.github\.com\/js-sdk/, domain);
			}
			return src;
		},
		"loader": function(src, config, version) {
			src = patchers.url(src, config)
				.replace(/("?version"?: ?").*?(",)/, '$1' + version + '$2');
			if (shared.config("build")) {
				// patch debug field only when we are building files
				// and do not patch already built ones during release
				src = src.replace(/("?debug"?: ?).*?(,)/, '$1' + (shared.config("build.stage") === "dev") + '$2');
			}
			return src;
		},
		"bootstrap-css": function(src, config) {
			var env = shared.config("env");
			return src.replace(/(url\(")\.\.([/a-z-.]+"\))/ig, "$1" + ((shared.config("build.stage") === "dev") ? "../" : "") + "third-party/bootstrap$2");
		},
		"bootstrap-less": function(src) {
			var eol = grunt.utils.normalizelf(grunt.utils.linefeed);
			src = src.replace(/(\*\/)/, "$1" + eol + ".echo-sdk-ui {" + eol);
			src += eol + "}";
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
			spec["images"] = {
				"files": {
					"<%= dirs.build %>": grunt.config("sources." + target + ".images")
				},
				"options": {
					"basePath": "<config:dirs.src>"
				}
			};
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
			spec["css"] = {
				"files": {
					"<%= dirs.build %>": grunt.config("sources." + target + ".css")
				},
				"options": {
					"basePath": "<config:dirs.src>"
				}
			};
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
			spec["third-party-html"] = {
				"files": {
					"<%= dirs.build %>": grunt.config("sources.third-party-html")
				},
				"options": {
					"basePath": "<config:dirs.src>"
				}
			};
			spec["bootstrap"] = {
				"files": {
					"<%= dirs.build %>": grunt.config("sources." + target + ".bootstrap")
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
