Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/app",
		"echo/utils",
		"echo/events"
	], function($, App, Utils, Events) {

	"use strict";

	Echo.Tests.module("Echo.Loader", {
		"meta": {
			"className": "Echo.Loader",
			"functions": [
				"init",
				"initApplication",
				"initEnvironment",
				"isDebug",
				"download",
				"override",
				"getURL",
				"_lookupCanvases"
			]
		},
		"setup": function() {
			Echo.Tests.Fixtures.loader = {};
		}
	});

	//FIXME: this test shoud be rewriten
	Echo.Tests._test("URL conversion", function() {
		QUnit.ok(true, "This test should be rewriten");
		var cdnBaseURL = Echo.require.toUrl("echo");
		var version = Echo.version;
		var debug = Echo.debug;
		function checkURLs(urls) {
			$.each(urls, function(i, spec) {
				QUnit.ok(spec.expect === Echo.require.toUrl(spec.data), "Checking URL conversion: '" + spec.data + "'");
			});
		}
		var urls = {
			"absolute": [{
				"data": "//cdn.echoenabled.com/image.png",
				"expect": "//cdn.echoenabled.com/image.png"
			}, {
				"data": "http://echoenabled.com/image.png",
				"expect": "http://echoenabled.com/image.png"
			}, {
				"data": "https://echoenabled.com/image.png",
				"expect": "https://echoenabled.com/image.png"
			}],
			"relative": [{
				"data": "/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "",
				"expect": cdnBaseURL + "sdk/v" + version
			}],
			"relativeDev": [{
				"data": "/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev/web/image.png"
			}, {
				"data": "web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev/web/image.png"
			}, {
				"data": "",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev"
			}]
		};
		checkURLs(urls.absolute);
		Echo.debug = false;
		QUnit.ok(!Echo.Loader.isDebug(), "Checking if debug mode is off");
		checkURLs(urls.relative);
		Echo.debug = true;
		QUnit.ok(Echo.Loader.isDebug(), "Checking if debug mode is on");
		checkURLs(urls.relativeDev);
		QUnit.equal(
			Echo.require.toUrl("web/image.png", false),
			cdnBaseURL + "sdk/v" + version + "/web/image.png",
			"Checking URL conversion: /web/image.png, no dev version"
		);
		Echo.Loader.debug = debug;
	});

	Echo.Tests._asyncTest("resource downloading", function() {
		var base = Echo.Tests.baseURL + "fixtures/resources/loader/";
		var emptyResourceArray = function(callback) {
			Echo.require([], function() {
				QUnit.ok(true, "Checking if the callback is fired even if the list of the scripts to load is empty (empty array)");
				callback();
			});
		};
		var missingResourceArray = function(callback) {
			Echo.require(undefined, function() {
				QUnit.ok(true, "Checking if the callback is fired even if the scripts list is undefined");
				callback();
			});
		};
		var callbackCheck = function(callback) {
			try {
				Echo.require([]);
				QUnit.ok(true, "Checking if the callback is an optional parameter (no JS error expected)");
			} catch(e) {
				QUnit.ok(false, "Received JS error when trying to launch \"download\" function without a \"callback\" function");
			}
			callback();
		};
		var nonExistingScripts = function(callback) {
			
			if (navigator.userAgent.search(/MSIE/) > 0) {
				/**
				 *  In case of MSIE we can`t simply override requirejs.onError
				 * becose of troubles that make it difficult to detect this event
				 *
				 * To override it in MSIE you can use option enforceDefine
				 * but in this case you have no ability to load non AMD modules
				 * without using shim correctly.
				 *
				 * To learn more you can read out this links:
				 * IE errors handling: http://requirejs.ru/docs/api.html#ieloadfail
				 * enforceDefine option: http://requirejs.ru/docs/api.html#config-enforceDefine
				 *
				**/
				QUnit.ok(true, "Checking if the error callback is executed when non-existing script was passed as a function arguments");
				callback();
			} else {
				var customRJSErrorCallback = Echo.require.onError;
				Echo.require.onError = function(err) {
					QUnit.ok(true, "Checking if the error callback is executed when non-existing script was passed as a function arguments");
					Echo.require.onError = customRJSErrorCallback;
					callback();
				};
				Echo.require([
					base + "nonexisting-file.js"
				], function() {
					QUnit.ok(false, "Checking if the error callback is executed when non-existing script was passed as a function arguments");
					callback();
				});
			}
		};
		var alreadyDownloadedScripts = function(callback) {
			Echo.require([
				"echo/events",
				"echo/utils"
			], function(Events, Utils) { 
				QUnit.ok(!!Events, "Checking if the callback is executed when the scripts loaded previously are required again");
				QUnit.ok(!!Utils, "Checking if the callback is executed when the scripts loaded previously are required again");
				callback();
			});
		};
		var checkSyncRequire = function(callback) {
			var customRJSErrorCallback = Echo.require.onError;
			Echo.require.onError = function(err) {
				QUnit.ok(true, "Check if Echo.require(\"\") works in the same way as require(\"\") function does");
				Echo.require.onError = customRJSErrorCallback;
				callback();
			}
			var unrequiredModule = Echo.require("fixtures/resources/loader/test-module");
			var requiredModule = Echo.require("jquery");
			QUnit.ok(!!requiredModule, "Check if Echo.require(\"\") works in the same way as require(\"\") function does");
		};
		var equalUrlsPerSingleCall = function(callback) {
			Echo.require([
			base + "dup1.js",
			base + "dup1.js",
			"css!" + base + "dup1.css",
			"css!" + base + "dup1.css"
			], function() {
				QUnit.ok(!!Echo.Tests.Fixtures.loader.duplicate1, "Checking if the callback is executed when equal URLs of js/css was loaded per single call");
				callback();
			});
		};
		var equalUrlsPerParallelCalls = function(callback) {
			var k = 2;
			var commonCallback = function() {
				if (!--k) {
					QUnit.ok(!!Echo.Tests.Fixtures.loader.duplicate3, "Checking if the callback is executed when equal URLs of js/css was loaded per parallel call");
					callback();
				}
			};
			Echo.require([
				base + "dup3.js",
				"css!" + base + "dup3.css"
			], commonCallback);
			Echo.require([
				base + "dup3.js",
				"css!" + base + "dup3.css"
			], commonCallback);
		};
		
		var mixedRequireTest = function(callback) {
			if (navigator.userAgent.search(/MSIE/) > 0) {
				/**
				 *  In case of MSIE we can`t simply override requirejs.onError
				 * becose of troubles that make it difficult to detect this event
				 *
				 * To override it in MSIE you can use option enforceDefine
				 * but in this case you have no ability to load non AMD modules
				 * without using shim correctly.
				 *
				 * To learn more you can read out this links:
				 * IE errors handling: http://requirejs.ru/docs/api.html#ieloadfail
				 * enforceDefine option: http://requirejs.ru/docs/api.html#config-enforceDefine
				 *
				**/
				QUnit.ok(true, "Check if Echo.require(\"\") works in the same way as require(\"\") function does");
				QUnit.ok(true, "Check if Echo.require(\"\") works in the same way as require(\"\") function does");
				callback();
			} else {
				var customRJSErrorCallback = Echo.require.onError,
					onErrorCallsCounter = 0,
					fakeScripts = [
						"fixtures/resources/loader/fakeTestModule3",
						base + "fakeTestModule.js"
					],
					existingScripts = [
						"fixtures/resources/loader/test-module3",
						base + "test-module2.js"
					];
				Echo.require.onError = function(err) {
					onErrorCallsCounter += 1;
					QUnit.ok(true, "Check if Echo.require(\"\") works in the same way as require(\"\") function does");
					if (onErrorCallsCounter == fakeScripts.length) {
						Echo.require.onError = customRJSErrorCallback;
						callback();
					}
				}
				Echo.require(fakeScripts.concat(existingScripts), function() {
					QUnit.ok(false, "Checking Echo.require using mixed paths");
					callback();
				})
			}
		};
		
		QUnit.expect(12);
		Utils.sequentialCall([
			emptyResourceArray,
			missingResourceArray,
			callbackCheck,
			nonExistingScripts,
			alreadyDownloadedScripts,
			checkSyncRequire,
			equalUrlsPerSingleCall,
			equalUrlsPerParallelCalls,
			mixedRequireTest
		], function() {
			QUnit.start();
		});
	}, {
		"timeout": 10000
	});

	Echo.Tests.asyncTest("environment initialization", function() {
		var environmentCheck = function(callback) {
			Echo.require([
				"jquery",
				"echo/events",
				"echo/utils",
				"echo/labels",
				"echo/configuration",
				"echo/api",
				"echo/streamserver/api",
				"echo/streamserver/user",
				"echo/view",
				"echo/app",
				"echo/plugin",
				"echo/backplane"
			], function($, App) {
				for (var arg in arguments) {
					if (!arguments[arg]) {			
						QUnit.ok(false, "Calling 'initEnvironment' with no callback produced JS error...");
						return;
					}
				}
				QUnit.ok(true, "Checking if the 'callback' param is optional (no errors produced)");
				QUnit.ok(!!window.Backplane && !!App && $,
					"Checking if the callback is being fired as soon as the environment is ready.");
				callback();
			});
		};
		QUnit.expect(2);
		Utils.sequentialCall([
			environmentCheck
		], function() {
			QUnit.start();
		});
	});

	Echo.Tests.asyncTest("application initialization", function() {
		var initCounterApplication = function(callback) {
			$("qunit-fixture").empty();
			Echo.require([
				"echo/streamserver/bundled-apps/counter/client-widget"
			], function(Counter) {
				new Counter({
				//"component": "Echo.StreamServer.BundledApps.Counter.ClientWidget",
					"target": $("qunit-fixture"),
					"data": {"count": 5},
					"appkey": "echo.jssdk.tests.aboutecho.com",
					"liveUpdates": {"enabled": false},
					"ready": function() {
						QUnit.ok(this.config.get("data.count") === 5, "Checking if the Counter application was initialized");
						this.destroy();
						callback();
					}
				});
			});
		};
		var initForeignApplication = function(callback) {
			$("qunit-fixture").empty();
			Echo.require([
				"fixtures/resources/loader/foreign-class"
			], function() {
				new SomeForeignClass({
					"target": $("qunit-fixture"),
				});
				QUnit.ok(!!window.SomeForeignClass, "Checking if the Counter application was initialized");
				callback();
			});
		};
		var initForeignAmdModule = function(callback) {
			$("qunit-fixture").empty();
			Echo.require([
				"fixtures/resources/apps/test-app"
			], function(TestApp) {
				new TestApp({
					"target": $("qunit-fixture"),
					"ready": function() {
						QUnit.ok(true, "Checking if foreign AMD application onReady event was triggered");
						callback();
					}
				});
			});
		};
		QUnit.expect(3);
		Utils.sequentialCall([
			initCounterApplication,
			initForeignApplication,
			initForeignAmdModule 
		], function() {
			QUnit.start();
		});
	});
	callback();
	});
});
