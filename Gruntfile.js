module.exports = function(grunt) {
	"use strict";

	var shared = require("./tools/grunt/lib.js").init(grunt);
	var _ = require("lodash");
	var url = require("url");

	grunt.loadTasks("tools/grunt/tasks");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-express");
	grunt.loadNpmTasks("grunt-recess");
	grunt.loadNpmTasks("grunt-saucelabs");
	grunt.loadNpmTasks("sphere");

	grunt.registerTask("default", ["check-environment:" + shared.config("env"), "jshint", "clean:all", "build:sdk"]);

	grunt.registerTask("test", "Execute tests", function() {
		grunt.option("test-build", true);
		assembleEnvConfig();
		var parts = url.parse(grunt.config("envConfig.baseURLs.tests") + "/", false, true);
		parts.protocol = "http";
		parts.query = grunt.option("number")
			? {"testNumber": grunt.option("number")}
			: grunt.option("module")
				? {"module": grunt.option("module")}
				: {};
		grunt.config("saucelabs-qunit.options.urls", [url.format(parts)]);
		if (grunt.config("envConfig.saucelabs")) {
			grunt.config("saucelabs-qunit.options.username", grunt.config("envConfig.saucelabs.name"));
			grunt.config("saucelabs-qunit.options.key", grunt.config("envConfig.saucelabs.key"));
		}
		grunt.task.run([
			"default",
			"express",
			"saucelabs-qunit:" + (process.env["CI"] ? "travis" : "local")
		]);
	});

	var dirs = {
		"build": "build",
		"src": "src",
		"dest": "web/sdk",
		"dist": "web"
	};

	var sources = {
		"sdk": {
			"third-party-js": [
				"third-party/**/*.js"
			],
			"own-js": [
				"**/*.js",
				"!third-party/**/*.js"
			],
			"css": [
				"**/*.css",
				"!third-party/**/*.css"
			],
			"bootstrap": [
				"third-party/bootstrap/**/*.js",
				"third-party/bootstrap/**/*.css",
				"third-party/bootstrap/**/*.less"
			],
			"images": [
				"**/*.png",
				"**/*.jpg",
				"**/*.jpeg",
				"**/*.gif"
			]
		},
		"third-party-html": [
			"third-party/**/*.html"
		],
		"demo": ["**/*"],
		"tests": ["**/*"],
		"apps": ["**/*"]
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
				"third-party/yepnope/yepnope.css.patched.js",
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
				"api.pack.js",
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
				"third-party/jquery/jquery.ihint.js",
				"third-party/jquery/jquery.viewport.js"
			],
			"dest": "third-party/jquery.pack.js"
		},
		"third-party/jquery/jquery.isotope.min.js": {
			"src": [
				"third-party/jquery/jquery.isotope.min.js"
			],
			"dest": "third-party/jquery/jquery.isotope.min.js"
		},
		"third-party/bootstrap": {
			"src": [
				"third-party/bootstrap/js/bootstrap-transition.js",
				"third-party/bootstrap/js/bootstrap-affix.js",
				"third-party/bootstrap/js/bootstrap-alert.js",
				"third-party/bootstrap/js/bootstrap-button.js",
				"third-party/bootstrap/js/bootstrap-modal.js",
				"third-party/bootstrap/js/bootstrap-carousel.js",
				"third-party/bootstrap/js/bootstrap-collapse.js",
				"third-party/bootstrap/js/bootstrap-dropdown.js",
				"third-party/bootstrap/js/bootstrap-tooltip.js",
				"third-party/bootstrap/js/bootstrap-popover.js",
				"third-party/bootstrap/js/bootstrap-scrollspy.js",
				"third-party/bootstrap/js/bootstrap-tab.js",
				"third-party/bootstrap/js/bootstrap-typeahead.js",
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
				"tests/sinon/sinon-1.7.3.js",
				"tests/harness/runner.js",
				"tests/harness/api.js",
				"tests/harness/utils.js",
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
				name + "/controls.pack.js",
				name + "/plugins.pack.js"
			],
			"dest": name + ".pack.js"
		};
	});

	var testPlatforms = {
		"firefox": {
			"browserName": "firefox",
			"version": "25",
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

	var config = {
		"dirs": dirs,
		"sources": sources,
		"destinations": destinations,
		"packs": packs,
		"pkg": grunt.file.readJSON("package.json"),
		"banner":
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
			" */\n",
		"clean": {
			"build": [
				"<%= dirs.build %>"
			],
			"third-party": {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": [
						"third-party/**",
						// remove everything except packs and folders they are in
						"!third-party",
						"!third-party/janrain",
						"!third-party/janrain/*",
						"!third-party/jquery",
						"!third-party/jquery.pack.js",
						"!third-party/jquery/jquery.isotope.min.js"
					]
				}]
			},
			"all": [
				"<%= dirs.dist %>",
				"<%= clean.build %>"
			]
		},
		"cssmin": {
			"gui": {
				"options": {
					"report": grunt.option("verbose") ? "gzip" : "min"
				},
				"files": [{
					"src": ["<%= dirs.build %>/gui.pack.css"],
					"dest": "<%= dirs.build %>/gui.pack.css"
				}]
			}
		},
		"recess": {
			"bootstrap": {
				"options": {
					"compile": true
				},
				"files": {
					"<%= dirs.build %>/gui.pack.css": [
						"<%= dirs.build %>/third-party/bootstrap/less/bootstrap.less",
						"<%= dirs.build %>/third-party/bootstrap/plugins/*.css"
					]
				}
			}
		},
		"copy": {},
		"concat": {
			"options": {
				"stripBanners": true,
				"banner": "<%= banner %>"
			}
		},
		"uglify": {
			"options": {
				"report": grunt.option("verbose") ? "gzip" : "min"
			}
		},
		"jshint": {
			"options": {
				"jshintrc": ".jshintrc"
			},
			"grunt": ["Gruntfile.js", "tools/grunt/**/*.js"]
		},
		"wrap": {
			"echo-jquery": {
				"options": {
					"header": [
						"(function(jQuery) {",
						"var $ = jQuery;",
						""
					],
					"footer": [
						"})(Echo.jQuery);"
					]
				},
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": [
						"third-party/jquery/jquery.ihint.js",
						"third-party/jquery/jquery.isotope.min.js",
						"third-party/jquery/jquery.viewport.mini.js"
					]
				}]
			},
			"echo-yepnope": {
				"options": {
					"header": [
						"if (!window.Echo) window.Echo = {};",
						"Echo._yepnope = window.yepnope;",
						"if (!Echo.yepnope) {"
					],
					"footer": [
						"Echo.yepnope = window.yepnope;",
						"Echo.yepnope.injectCss = undefined;",
						"window.yepnope = Echo._yepnope;",
						"delete Echo._yepnope;",
						"}",
						""
					]
				},
				"files": [{
					"src": ["<%= dirs.build %>/third-party/yepnope/yepnope.1.5.4*js"]
				}]
			},
			"echo-yepnope-css": {
				"options": {
					"header": [
						"(function(yepnope) {",
						"if (!yepnope.injectCss) {"
					],
					"footer": [
						"}",
						"})(Echo.yepnope);",
						""
					]
				},
				"files": [{
					"src": ["<%= dirs.build %>/third-party/yepnope/yepnope.css.patched.js"]
				}]
			},
			"bootstrap-less": {
				"options": {
					"header": [".echo-sdk-ui {"],
					"footer": ["}"]
				},
				"files": [{
					"src": ["<%= dirs.build %>/third-party/bootstrap/less/bootstrap.less"]
				}]
			}
		},
		"patch": {
			"jquery-source-map": {
				"options": {
					"patcher": function(text) {
						return text.replace(/\/\/[#@]\s*sourceMappingURL=.*[\r\n]+/i, "");
					}
				},
				"files": [{
					"src": ["<%= dirs.build %>/third-party/jquery/jquery.min.js"]
				}]
			},
			"gui-css": {
				"options": {
					"patcher": function(text) {
						return text.replace(/(url\(")\.\.([/a-z-.]+"\))/ig, "$1" + ((shared.config("build.stage") === "dev") ? "../" : "") + "third-party/bootstrap$2");
					}
				},
				"files": [{
					"src": ["<%= dirs.build %>/gui.pack.css"]
				}]
			},
			"loader-build": {
				"options": {
					"patcher": function(text, filepath, flags) {
						var version = grunt.config("pkg." + (flags.stable ? "version" : "majorVersion")) + (flags.beta ? ".beta" : "");
						text = text.replace(/("?version"?: ?").*?(",)/, '$1' + version + '$2');
						if (shared.config("build")) {
							// patch debug field only when we are building files
							// and do not patch already built ones during release
							text = text.replace(/("?debug"?: ?).*?(,)/, '$1' + (shared.config("build.stage") === "dev") + '$2');
						}
						return text;
					}
				},
				"files": [{
					"src": [
						"<%= dirs.build %>/loader.js"
					]
				}]
			},
			"loader-release": {
				"options": {
					"patcher": function(text, filepath, flags) {
						var version = grunt.config("pkg." + (flags.stable ? "version" : "majorVersion")) + (flags.beta ? ".beta" : "");
						return text.replace(/("?version"?: ?").*?(",)/, '$1' + version + '$2');
					}
				},
				"files": [{
					"src": [
						"<%= destinations.sdk.dev %>/loader.js",
						"<%= destinations.sdk.min %>/loader.js"
					]
				}]
			}
		},
		"express": {
			"options": {
				"port": 9001,
				"bases": ["<%= dirs.dist %>"]
			},
			"test": {}
		},
		"release": {
			"options": {
				"environment": shared.config("env"),
				"debug": shared.config("debug"),
				"configFile": "config/release.json",
				"location": shared.config("env") === "staging" ? "sandbox" : "cdn",
				"remoteRoot": shared.config("env") === "staging" ? "/staging" : ""
			},
			"regular": {
				"options": {
					"deployTargets": {
						"code:latest": {
							"src": "**",
							"cwd": "<%= dirs.dest %>/v<%= pkg.majorVersion %>/",
							"dest": "<%= release.options.remoteRoot %>/sdk/v<%= pkg.majorVersion %>/"
						},
						"code:stable": {
							"src": "**",
							"cwd": "<%= dirs.dest %>/v<%= pkg.majorVersion %>/",
							"dest": "<%= release.options.remoteRoot %>/sdk/v<%= pkg.version %>/"
						},
						"apps": {
							"src": "**",
							"cwd": "<%= dirs.dist %>/apps/",
							"dest": "<%= release.options.remoteRoot %>/apps/"
						}
					},
					"purgeTitle": "SDK",
					"purgePaths": [
						"/sdk/v<%= pkg.majorVersion %>/",
						"/sdk/v<%= pkg.version %>/",
						"/apps/"
					],
					"beforeDeploy": ["patch:loader-release:stable"],
					"afterDeploy": shared.config("env") === "staging" ? [] : ["docs", "docs-release"]
				}
			},
			"beta": {
				"options": {
					"deployTargets": {
						"code:beta": {
							"src": "**",
							"cwd": "<%= dirs.dest %>/v<%= pkg.majorVersion %>/",
							"dest": "<%= release.options.remoteRoot %>/sdk/v<%= pkg.majorVersion %>.beta/"
						}
					},
					"purgeTitle": "SDK BETA",
					"purgePaths": [
						"/sdk/v<%= pkg.majorVersion %>.beta/"
					],
					"beforeDeploy": ["patch:loader-release:beta"]
				}
			},
			"purge": {
				"options": {
					"skipBuild": true,
					"purgePaths": ["/sdk/", "/apps/"]
				}
			},
			"pages": {
				"options": {
					"skipBuild": true,
					"skipPurge": true,
					"afterDeploy": ["docs", "docs-release"]
				}
			}
		},
		"saucelabs-qunit": {
			"options": {
				"concurrency": 3
			},
			"local": {
				"options": {
					"detailedError": true,
					"tags": ["local"],
					"build": "local-" + (new Date()).getTime(),
					"browsers": typeof grunt.option("browser") === "string"
						? grunt.option("browser").split("|").map(function(b) { return testPlatforms[b]; })
						: [testPlatforms.firefox, testPlatforms.chrome, testPlatforms.ie9]
				}
			},
			"travis": {
				"options": {
					"tags": ["branch=" + process.env["TRAVIS_BRANCH"], "node=" + process.env["TRAVIS_NODE_VERSION"]],
					"build": "travis-" + process.env["TRAVIS_BUILD_NUMBER"],
					"identifier": process.env["TRAVIS_JOB_NUMBER"],
					"browsers": [testPlatforms.firefox, testPlatforms.chrome, testPlatforms.safari, testPlatforms.ie8, testPlatforms.ie9, testPlatforms.ie10]
				}
			}
		},
                "watch": {
                        "src": {
                                "files": ["apps/**/*", "demo/**/*", "config/**/*", "src/**/*", "tools/**/*", "tests/**/*"],
                                "tasks": ["default"],
                                "options": {
                                        "interrupt": true
                                }
                        }
                },
		"check-environment": {
			"options": {
				"list": shared.config("environments")
			}
                },
		"init-environment": {
			"options": {
				"list": shared.config("environments"),
				"cleanup": function(cfg, env) {
					if (env === "ci") {
						delete cfg.saucelabs;
					}
					return cfg;
				}
			}
		}
	};

	grunt.initConfig(config);
	grunt.config("pkg.majorVersion", grunt.config("pkg.version").split(".")[0]);

	function assembleEnvConfig() {
		var env = shared.config("env");
		if (!grunt.config("envConfigRaw")) {
			var envFilename = "config/environments/" + env + ".json";
			if (!grunt.file.exists(envFilename)) return;
			grunt.config("envConfigRaw", grunt.file.readJSON(envFilename));
		}
		// we might have different configuration if we made several builds
		// in a single run so we have raw and processed versions of envConfig
		var data = _.cloneDeep(grunt.config("envConfigRaw"));
		if (grunt.option("test-build")) {
			var host = "localhost:" + grunt.config("express.options.port");
			_.each(["tests", "cdn", "sdk", "docs"], function(k) {
				var parts = url.parse(data.baseURLs[k], false, true);
				parts.host = host;
				if (k === "docs" || k === "tests") {
					// docs and tests are located right in the web folder locally
					parts.pathname = parts.path = k;
				}
				data.baseURLs[k] = url.format(parts);
			});
		}
		(function normalizeURLs(obj) {
			_.each(obj, function(v, k) {
				if (!_.isObject(v)) {
					// remove last slash and scheme
					obj[k] = v.replace(/\/$/, "").replace(/^(?:http|ws)s?:/, "");
					if (obj[k].charAt(0) !== "/") {
						obj[k] = "//" + obj[k];
					}
				} else {
					normalizeURLs(v);
				}
			});
		})(data.baseURLs);
		if (env === "development") {
			data.baseURLs.sdk += "/dev";
		}
		// TODO: (?) properly calculate "packageVersion" placeholder value and use it in Echo.Loader.version
		data.packageVersion = grunt.config("pkg.majorVersion");
		grunt.config("envConfig", data);
	}

	assembleEnvConfig();
};
