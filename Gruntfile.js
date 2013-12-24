module.exports = function(grunt) {
	"use strict";

	require("time-grunt")(grunt);

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
	grunt.loadNpmTasks("grunt-contrib-requirejs");
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
			"min": "<%= dirs.dest %>/v<%= pkg.mainVersion %>",
			"dev": "<%= dirs.dest %>/v<%= pkg.mainVersion %>/dev",
			"final": "<%= dirs.dest %>/v<%= pkg.mainVersion %>"
		}
	};

	var packs = {
		"gui-pack": {
			"src": [
				"third-party/bootstrap/js/bootstrap-tooltip.js",
				"third-party/bootstrap/js/bootstrap-*.js",
				"gui.pack.js"
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
		},
		"tests/units": {
			"src": [
				"unit/*.js",
				"unit/appserver/*.js",
				"unit/streamserver/*.js",
				"unit/streamserver/apps/*.js",
				"unit/streamserver/plugins/*.js"
				
			],
			"dest": "v<%=pkg.mainVersion%>/unit/unit.pack.js"
		}
	};

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

	var requirejsPacks = [{
		"name": "loader",
		"create": false,
		"include": [
			"third-party/requirejs/require",
			"third-party/requirejs/css",
			"third-party/requirejs/loadFrom"
		]
	}, {
		"name": "third-party/jquery.pack",
		"create": true,
		"include": [
			"third-party/jquery/jquery",
			"third-party/jquery/jquery-noconflict",
			"third-party/jquery/jquery.ihint",
			"third-party/jquery/jquery.viewport.mini"
		]
	}, {
		"name": "apps.sdk",
		"create": true,
		"include": [
			"utils",
			"events",
			"labels",
			"configuration",
			"api",
			"view",
			"app",
			"app-client-widget",
			"plugin",
			"variables"
		]
	}, {
		"name": "appserver.sdk",
		"create": true,
		"include": [
			"appserver/canvases",
			"appserver/cookie"
		]
	}, {
		"name": "streamserver.sdk",
		"create": true,
		"include": [
			"streamserver/api",
			"streamserver/user",
			"streamserver/base",
			"streamserver/bundled-apps/counter/client-widget",
			"streamserver/bundled-apps/stream/item/client-widget",
			"streamserver/bundled-apps/stream/client-widget",
			"streamserver/bundled-apps/facepile/item/client-widget",
			"streamserver/bundled-apps/facepile/client-widget",
			"streamserver/bundled-apps/submit/client-widget",
			"streamserver/bundled-apps/auth/client-widget",
			"streamserver/bundled-apps/stream/item/plugins/community-flag",
			"streamserver/bundled-apps/submit/plugins/form-auth",
			"streamserver/bundled-apps/stream/item/plugins/item-accumulator-display",
			"streamserver/bundled-apps/auth/plugins/janrain-connector",
			"streamserver/bundled-apps/stream/item/plugins/janrain-sharing",
			"streamserver/bundled-apps/submit/plugins/janrain-sharing",
			"streamserver/bundled-apps/stream/item/plugins/metadata-manager",
			"streamserver/bundled-apps/submit/plugins/text-counter",
			"streamserver/bundled-apps/stream/item/plugins/edit",
			"streamserver/bundled-apps/submit/plugins/edit",
			"streamserver/bundled-apps/stream/plugins/infinite-scroll",
			"streamserver/bundled-apps/submit/plugins/janrain-auth",
			"streamserver/bundled-apps/stream/item/plugins/like",
			"streamserver/bundled-apps/facepile/item/plugins/like",
			"streamserver/bundled-apps/stream/plugins/moderation",
			"streamserver/bundled-apps/stream/item/plugins/moderation",
			"streamserver/bundled-apps/stream/plugins/reply",
			"streamserver/bundled-apps/stream/item/plugins/reply",
			"streamserver/bundled-apps/submit/plugins/reply",
			"streamserver/bundled-apps/stream/item/plugins/tweet-display"
		]
	}, {
		"name": "streamserver/bundled-apps/stream/plugins/pinboard-visualization",
		"create": true,
		"include": [
			"streamserver/bundled-apps/stream/item/media-gallery/client-widget",
			"streamserver/bundled-apps/stream/item/plugins/pinboard-visualization",
			"streamserver/bundled-apps/stream/plugins/pinboard-visualization"
		]
	}, {
		"name": "gui.pack",
		"create": true,
		"include": [
			"gui",
			"gui/button",
			"gui/modal",
			"gui/dropdown",
			"gui/tabs"
		]
	}];

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
				"<%= dirs.build %>/*"
			],
			"third-party": {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": [
						"third-party/*",
						"!third-party/janrain",
						"!third-party/jquery",
						"!third-party/jquery.pack.js",
						"!third-party/jquery/jquery.isotope.min.js"
					]
				}]
			},
			"all": [
				"<%= dirs.dist %>/*",
				"<%= clean.build %>"
			],
			"tests/units": [
				"<%= dirs.dist %>/tests/unit/!(unit.pack.js)"
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
			"grunt": ["Gruntfile.js", "tools/grunt/**/*.js"],
			"source": [
				"<%= dirs.src %>/!(backplane).js",
				"<%= dirs.src %>/third-party/requirejs/loadFrom.js",
				"<%= dirs.src %>/gui/*.js",
				"<%= dirs.src %>/appserver/*.js",
				"<%= dirs.src %>/streamserver/*.js",
				"<%= dirs.src %>/tests/harness/*.js"
			],
			"tests": [
				"tests/unit/**/*.js"
			]
		},
		"wrap": {
			"options": {
				"header": [
					"Echo.require([\"jquery\"], function(jQuery) {",
					"var $ = jQuery;",
					""
				],
				"footer": [
					"});"
				]
			},
			"jquery-isotope": {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": [
						"third-party/jquery/jquery.isotope.min.js"
					]
				}]
			},
			"bootstrap-plugins": {
				"files": [{
					"expand": true,
					"cwd": "<%= dirs.build %>",
					"src": [
						"third-party/bootstrap/js/bootstrap-tooltip.js",
						"third-party/bootstrap/js/bootstrap-*.js"
					]
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
			"bootstrap-plugins": {
				"options": {
					"patcher": function(text) {
						return text.replace(/\(window\.jQuery\)/g, "(jQuery)");
					}
				},
				"files": [{
					"src": ["<%= dirs.build %>/gui.pack.js"]
				}]
			},

			"loader-build": {
				"options": {
					"patcher": function(text, filepath, flags) {
						var version = grunt.config("pkg." + (flags.stable ? "version" : "mainVersion")) + (flags.beta ? ".beta" : "");
						text = text.replace(/("?version"?: ?").*?(",)/, '$1' + version + '$2');
						if (shared.config("build")) {
							// patch debug field only when we are building files
							// and do not patch already built ones during release
							text = text.replace(/("?debug"?: ?).*/, '$1' + (shared.config("build.stage") === "dev"));
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
						var version = grunt.config("pkg." + (flags.stable ? "version" : "mainVersion")) + (flags.beta ? ".beta" : "");
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
							"cwd": "<%= dirs.dest %>/v<%= pkg.mainVersion %>/",
							"dest": "<%= release.options.remoteRoot %>/sdk/v<%= pkg.mainVersion %>/"
						},
						"code:stable": {
							"src": "**",
							"cwd": "<%= dirs.dest %>/v<%= pkg.mainVersion %>/",
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
						"/sdk/v<%= pkg.mainVersion %>/",
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
							"cwd": "<%= dirs.dest %>/v<%= pkg.mainVersion %>/",
							"dest": "<%= release.options.remoteRoot %>/sdk/v<%= pkg.mainVersion %>.beta/"
						}
					},
					"purgeTitle": "SDK BETA",
					"purgePaths": [
						"/sdk/v<%= pkg.mainVersion %>.beta/"
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
			"all": {
				"files": [
					"Gruntfile.js",
					"src/**",
					"demo/**",
					"tests/**",
					"apps/**",
					"config/**",
					"tools/**"
				],
				"tasks": ["default"],
				"options": {
					"interrupt": true
				}
			}
		},
		"requirejs": {
			"options": {
				"appDir": "<%= dirs.src %>",
				"baseUrl": "./",
				"dir": "<%= dirs.build %>",
				"optimize": "none",
				"wrap": false,
				"namespace": "Echo",
				"removeCombined": true,
				"useStrict": true,
				"skipDirOptimize": true,
				"normalizeDirDefines": true
			},
			"common": {
				"options": {
					"modules": requirejsPacks,
					"onBuildWrite": function(moduleName, path, contents) {
						contents = contents.replace("Echo.define(\'", "Echo.define(\'echo/");
						return contents;
					},
					"fileExclusionRegExp": /\/images\//
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
	var versionParts = grunt.config("pkg.version").split(".");
	grunt.config("pkg.mainVersion", versionParts[0] + "." + versionParts[1]);
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
		// TODO: (?) properly calculate "packageVersion" placeholder value and use it in the source code
		data.packageVersion = grunt.config("pkg.mainVersion");
		grunt.config("envConfig", data);
	}
	assembleEnvConfig();
};
