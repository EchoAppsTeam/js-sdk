(function(jQuery) {
var $ = jQuery;

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

Echo.Tests.test("URL conversion", function() {
	var cdnBaseURL = Echo.Loader.config.cdnBaseURL;
	var version = Echo.Loader.version;
	var debug = Echo.Loader.debug;
	function checkURLs(urls) {
		$.each(urls, function(i, spec) {
			QUnit.ok(spec.expect === Echo.Loader.getURL(spec.data), "Checking URL conversion: '" + spec.data + "'");
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
	Echo.Loader.debug = false;
	QUnit.ok(!Echo.Loader.isDebug(), "Checking if debug mode is off");
	checkURLs(urls.relative);
	Echo.Loader.debug = true;
	QUnit.ok(Echo.Loader.isDebug(), "Checking if debug mode is on");
	checkURLs(urls.relativeDev);
	QUnit.equal(
		Echo.Loader.getURL("web/image.png", false),
		cdnBaseURL + "sdk/v" + version + "/web/image.png",
		"Checking URL conversion: /web/image.png, no dev version"
	);
	Echo.Loader.debug = debug;
});

Echo.Tests.asyncTest("resource downloading", function() {
	var base = Echo.Tests.baseURL + "fixtures/resources/loader/";
	var emptyResourceArray = function(callback) {
		Echo.Loader.download([], function() {
			QUnit.ok(true, "Checking if the callback is fired even if the list of the scripts to load is empty (empty array)");
			callback();
		});
	};
	var missingResourceArray = function(callback) {
		Echo.Loader.download(undefined, function() {
			QUnit.ok(true, "Checking if the callback is fired even if the scripts list is undefined");
			callback();
		});
	};
	var callbackCheck = function(callback) {
		try {
			Echo.Loader.download([]);
			QUnit.ok(true, "Checking if the callback is an optional parameter (no JS error expected)");
		} catch(e) {
			QUnit.ok(false, "Received JS error when trying to launch \"download\" function without a \"callback\" function");
		}
		callback();
	};
	var nonExistingScripts = function(callback) {
		Echo.Loader.download([{
			"url": base + "non-existing-folder/1.js"
		}, {
			"url": base + "nonexisting-file.js"
		}], function() {
			QUnit.ok(true, "Checking if the callback is executed when non-existing scripts were passed as a function arguments");
			callback();
		}, {
			"errorTimeout": 1000 // 1 sec
		});
	};
	var alreadyDownloadedScripts = function(callback) {
		Echo.Loader.download([{
			"url": "events.js"
		}, {
			"url": "labels.js",
			"loaded": function() { return !!Echo.Labels; }
		}, {
			"url": "plugin.js"
		}], function() {
			QUnit.ok(true, "Checking if the callback is executed when the scripts loaded previously are loaded again");
			callback();
		});
	};
	var equalUrlsPerSingleCall = function(callback) {
		Echo.Loader.download([
			{"url": base + "dup1.js"},
			{"url": base + "dup1.js"},
			{"url": base + "dup1.css"},
			{"url": base + "dup1.css"}
		], function() {
			QUnit.ok(!!Echo.Tests.Fixtures.loader.duplicate1, "Checking if the callback is executed when equal URLs of js/css was loaded per single call");
			callback();
		});
	};
	var equalUrlsPerSequentialCalls = function(callback) {
		Echo.Loader.download([
			{"url": base + "dup2.js"},
			{"url": base + "dup2.css"}
		], function() {
			Echo.Loader.download([
				{"url": base + "dup2.js"},
				{"url": base + "dup2.css"}
			], function() {
				QUnit.ok(!!Echo.Tests.Fixtures.loader.duplicate2, "Checking if the callback is executed when equal URLs of js/css was loaded per sequential call");
				callback();
			});
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
		Echo.Loader.download([
			{"url": base + "dup3.js"},
			{"url": base + "dup3.css"}
		], commonCallback);
		Echo.Loader.download([
			{"url": base + "dup3.js"},
			{"url": base + "dup3.css"}
		], commonCallback);
	};
	var _scriptsLoading = function(callback, description, count) {
		var existingScriptsCount = 3;
		count = count || existingScriptsCount;
		var resources = [];
		for (var i = 1; i <= count; i++) {
			resources.push({
				"url": base + (count > existingScriptsCount ? "non-existing" : i) + ".js",
				"loaded": function() { return !!Echo.Tests.Fixtures.loader["object" + i]; }
			});
		}
		Echo.Loader.download(resources, function() {
			var success = true;
			// check only existing scripts
			for (var i = 1; i <= existingScriptsCount; i++) {
				if (success) {
					success = !!Echo.Tests.Fixtures.loader["object" + i];
				}
			}
			QUnit.ok(success, description);
			callback();
		}, {
			"errorTimeout": 1000 // 1 sec
		});
	};
	var validScripts = function(callback) {
		_scriptsLoading(callback, "Checking if all the test scripts were loaded successfully");
	};
	var validAndInvalidScriptsMix = function(callback) {
		_scriptsLoading(callback, "Checking if the mix of valid and invalid scripts is handled by the loader correctly", 4);
	};
	var loadingSameScriptMultipleTimes = function(callback) {
		delete Echo.Tests.Fixtures.loader.object1;
		var resources = [];
		for (var i = 1; i <= 5; i++) {
			resources.push({
				"url": base + "1.js"
			});
		}
		Echo.Loader.download(resources, function() {
			QUnit.ok(true, "Checking the situation when the same script is loaded multiple times (checking if the callback is executed)");
			callback();
		});
	};
	var fireSameScriptLoadingMultipleTimes = function(callback) {
		var resources = [{
			"url": base + "check-multiple-downloads.js"
		}];
		var count = 0;
		var check = function() {
			return Echo.App.isDefined("Echo.Tests.Apps.TestMultipleDownloads");
		};
		var maybeExecuteCallback = function() {
			if (++count === 3) callback();
		};
		Echo.Loader.download(resources, function() {
			QUnit.ok(check(), "Checking if the application is defined after the first download");
			maybeExecuteCallback();
		});
		Echo.Loader.download(resources, function() {
			QUnit.ok(check(), "Checking if the application is defined after the second (parallel) download");
			maybeExecuteCallback();
		});
		Echo.Loader.download(resources, function() {
			Echo.Loader.download(resources, function() {
				Echo.Loader.download(resources, function() {
					QUnit.ok(check(),
						"Checking if the 'download' functions can be executed within the previous 'download' function calls");
					maybeExecuteCallback();
				});
			});
		});
	};

	QUnit.expect(14);
	Echo.Utils.sequentialCall([
		emptyResourceArray,
		missingResourceArray,
		callbackCheck,
		nonExistingScripts,
		alreadyDownloadedScripts,
		equalUrlsPerSingleCall,
		equalUrlsPerSequentialCalls,
		equalUrlsPerParallelCalls,
		validScripts,
		validAndInvalidScriptsMix,
		loadingSameScriptMultipleTimes,
		fireSameScriptLoadingMultipleTimes
	], function() {
		QUnit.start();
	});
}, {
	"timeout": 10000
});

Echo.Tests.asyncTest("yepnope corner cases", function() {
	// This code reproduces the issue described here:
	// https://github.com/SlexAxton/yepnope.js/issues/113
	//
	// Test case: load a file via Echo.Loader.download and in its callback function
	// load some more files, one synchronously and one asynchronously
	// (or maybe more than one).
	//
	// Yepnope uses two-phase script loading mechanism: first preloads and then
	// executes it. The issue appears when asynchronous script is pushed to the stack
	// of scripts to be loaded and then synchronous script is preloaded but not
	// executed yet. In this test case yepnope tries to execute synchronous script
	// before it's fully preloaded.
	var raceConditions = function(callback) {
		var base = Echo.Tests.baseURL + "fixtures/resources/loader";
		Echo.Loader.download([{"url": base + "/yepnope-base.js"}], function() {
			QUnit.ok(!!Echo.Tests.Fixtures.loader.yepnope, "Check if base script is loaded");
			// we override injectJs function to be sure that
			// preloading is finished before executing the script
			var injectJs = Echo.yepnope.injectJs;
			Echo.yepnope.injectJs = function () {
				var self = this;
				var arg = arguments;
				setTimeout(function() {
					injectJs.apply(self, arg);
				}, 5000);
			};
			Echo.Loader.download([{"url": base + "/yepnope-first.js"}], function() {
				QUnit.ok(Echo.Tests.Fixtures.loader.yepnope.first,
					"Check if first callback is executed after complete loading of first script");
			});
			// asynchronous loading of this script affects internal state of yepnope
			setTimeout(function() {
				Echo.Loader.download([{"url": base + "/yepnope-second.js"}], function() {
					QUnit.ok(Echo.Tests.Fixtures.loader.yepnope.second,
						"Check if second callback is executed after complete loading of second script");
					Echo.yepnope.injectJs = injectJs;
					callback();
				});
			}, 10);
		});
	};
	var removingFirstNode = Echo.Tests.isolate(function(callback) {
		var script = $("<script>");
		var head = $("head", this.document);
		head.prepend(script);
		$("<script>").on("load readystatechange", function() {
			$(this).off("load readystatechange");
			script.remove();
			Echo.Loader.download([{
				"url": Echo.Tests.baseURL +
					"fixtures/resources/loader/check-removing-first-script.js"
			}], function() {
				QUnit.ok(Echo.Tests.Fixtures.loader.firstScriptRemoved,
					"Check if removing of firstNode doesn't cause side effects");
				callback();
			});
		}).appendTo(head).attr({
			"type": "text/javascript",
			"src": "http://cdn.echoenabled.com/sdk/v3/loader.js"
		});
	});
	QUnit.expect(4);
	Echo.Utils.sequentialCall([
		raceConditions,
		removingFirstNode
	], function() {
		QUnit.start();
	});
}, {
	"timeout": 20000
});

Echo.Tests.asyncTest("environment initialization", function() {
	var emptyCallback = function(callback) {
		try {
			Echo.Loader.initEnvironment();
			QUnit.ok(true, "Checking if the 'callback' param is optional (no errors produced)");
		} catch(e) {
			QUnit.ok(false, "Calling 'initEnvironment' with no callback produced JS error...");
		}
		callback();
	};
	var environmentCheck = function(callback) {
		Echo.Loader.initEnvironment(function() {
			QUnit.ok(true, "Checking if the callback is being fired as soon as the environment is ready.");
			QUnit.ok(!!window.Backplane && !!Echo.App && Echo.jQuery,
				"Checking if the callback is being fired as soon as the environment is ready.");
			var state = $.extend(true, {}, Echo.Loader.vars.state);
			Echo.Loader.initEnvironment();
			QUnit.deepEqual(state, Echo.Loader.vars.state,
				"Checking if the second 'initEnvironment' function call doesn't produce any downloading requests");
			callback();
		});
	};
	QUnit.expect(4);
	Echo.Utils.sequentialCall([
		emptyCallback,
		environmentCheck
	], function() {
		QUnit.start();
	});
});

Echo.Tests.asyncTest("application initialization", function() {
	var initCounterApplication = function(callback) {
		$("qunit-fixture").empty();
		Echo.Loader.initApplication({
			"script": "streamserver.pack.js",
			"component": "Echo.StreamServer.Apps.Counter",
			"config": {
				"target": $("qunit-fixture"),
				"data": {"count": 5},
				"appkey": "echo.jssdk.tests.aboutecho.com",
				"liveUpdates": {"enabled": false},
				"ready": function() {
					QUnit.ok(this.config.get("data.count") === 5, "Checking if the Counter application was initialized");
					this.destroy();
					callback();
				}
			}
		});
	};
	var initForeignApplication = function(callback) {
		$("qunit-fixture").empty();
		Echo.Loader.initApplication({
			"script": Echo.Tests.baseURL + "fixtures/resources/loader/foreign-class.js",
			"component": "SomeForeignClass",
			"config": {
				"target": $("qunit-fixture")
			}
		});
		// initApplication pushes data to canvases object so let's use it
		var canvas = Echo.Loader.canvases.pop();
		Echo.Events.subscribe({
			"topic": "Echo.Canvas.onReady",
			"context": canvas.config.get("context"),
			"once": true,
			"handler": function() {
				QUnit.ok(!!window.SomeForeignClass, "Check that foreign class was loaded");
				callback();
			}
		});
	};
	QUnit.expect(2);
	Echo.Utils.sequentialCall([
		initCounterApplication,
		initForeignApplication
	], function() {
		QUnit.start();
	});
});

Echo.Tests.asyncTest("getting canvas elements", function() {
	var defaultInit = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')

		Echo.Loader._lookupCanvases({
			"target": this.document.body
		}, function(canvases) {
			QUnit.equal(canvases.length, 2, "Check if Echo.Loader.init successfully handles a config without canvases");
			callback();
		});
	});

	var nativeElements = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');

		Echo.Loader._lookupCanvases({
			"target": this.document.body,
			"canvases": this.document.querySelectorAll
				? this.document.querySelectorAll(".echo-canvas-test")
				: this.document.getElementsByTagName("div") // for IE < 8
		}, function(canvases) {
			QUnit.equal(canvases.length, 3, "Check if Echo.Loader.init successfully handles a config with native DOM elements");
			callback();
		});
	});

	var nativeSingleElement = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div id="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');

		Echo.Loader._lookupCanvases({
			"target": this.document.body,
			"canvases": this.document.getElementById("echo-canvas-test")
		}, function(canvases) {
			QUnit.equal(canvases.length, 1, "Check if Echo.Loader.init successfully handles a config with native DOM elements");
			callback();
		});
	});

	var jQueryElements = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');

		Echo.Loader._lookupCanvases({
			"target": $("body", this.document),
			"canvases": $(".echo-canvas-test", this.document)
		}, function(canvases) {
			QUnit.equal(canvases.length, 3, "Check if Echo.Loader.init successfully handles a config with jQuery elements");
			callback();
		});
	});

	QUnit.expect(4);
	Echo.Utils.sequentialCall([
		defaultInit,
		nativeElements,
		nativeSingleElement,
		jQueryElements
	], function() {
		QUnit.start();
	});
});

Echo.Tests.asyncTest("canvases initialization", function() {
	var _eventsCountCheck = function(events) {
		var success = true;
		$.each(events, function(id, event) {
			if (event[0] != event[1]) {
				success = false;
				return false; // break
			}
		});
		return success;
	};
	var simpleValidCanvas = Echo.Tests.isolate(function(callback) {
		$(this.document.body).append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');
		var expecting = 2;
		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				QUnit.ok(true, "[simple valid canvas] Checking if " + appID + " application is initialized correctly after a page canvases lookup");
				this.destroy();
				expecting--;
				if (!expecting) {
					callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/test-canvas-001", "submit");
		waitForCompletion("js-sdk-tests/test-canvas-001", "stream");
		Echo.Loader.init({"target": this.document.body});
	});
	var validAndInvalidCanvases = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		// all mandatory fields are missing -->
		body.append('<div class="echo-canvas"></div>');
		body.append('<div class="echo-canvas" id="echo-canvas"></div>');
		// missing canvas id
		body.append('<div class="echo-canvas" data-appkey="canvas.003"></div>');
		// all fields defined, but no config available for the canvas id specified
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/nonexistent-canvas-001"></div>');
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/nonexistent-canvas-002"></div>');
		// canvas with empty app list
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-004"></div>');
		// canvas with no app list and no Backplane config
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-005"></div>');
		// canvas with no configuration at all (empty JSON object)
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-006"></div>');
		// valid canvas with existing configuration
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');

		var count = {
			"valid": 2,
			"invalid": 8
		};
		var errors = {
			"invalid_canvas_config": [0, 6],
			"unable_to_retrieve_app_config": [0, 2]
		};
		// check invalid canvases
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.Canvas.onError",
			"handler": function(topic, args) {
				count.invalid--;
				errors[args.code][0]++;
				if (!count.invalid) {
					Echo.Events.unsubscribe({"handlerId": handlerId});
					QUnit.ok(_eventsCountCheck(errors), "[valid and invalid canvases] Checking if the canvases on the page were analyzed correctly by the Loader");
					if (!count.valid) callback();
				}
			}
		});
		// check valid canvas
		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				this.destroy();
				count.valid--;
				if (!count.valid) {
					QUnit.ok(true, "[valid and invalid canvases] Checking if both applications (Stream and Submit) were initialized correctly after a page canvases lookup");
					if (!count.invalid) callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/test-canvas-001", "submit");
		waitForCompletion("js-sdk-tests/test-canvas-001", "stream");
		Echo.Loader.init({"target": body});
	});
	var doubleInitializationPrevention = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" id="canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>');
		var count = {
			"valid": 2,
			"invalid": 3
		};
		var errors = {
			"canvas_already_initialized": [0, 3]
		};
		// check invalid canvases
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.Canvas.onError",
			"handler": function(topic, args) {
				count.invalid--;
				errors[args.code][0]++;
				if (!count.invalid) {
					Echo.Events.unsubscribe({"handlerId": handlerId});
					QUnit.ok(_eventsCountCheck(errors), "[double initialization prevention] Checking if the Loader indicated multiple initialization attempts");
					if (!count.valid) callback();
				}
			}
		});
		// check valid canvas
		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				this.destroy();
				count.valid--;
				if (!count.valid) {
					QUnit.ok(true, "[double initialization prevention] Checking if both applications (Stream and Submit) were initialized correctly after a page canvases lookup");
					if (!count.invalid) callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/test-canvas-001", "submit");
		waitForCompletion("js-sdk-tests/test-canvas-001", "stream");
		// multiple initialization attempts,
		// we expect each canvas to be initialized only once
		Echo.Loader.init({"target": body});
		Echo.Loader.init({"canvases": this.document.getElementById("canvas")});
		Echo.Loader.init({"canvases": $("#canvas", body)});
		Echo.Loader.init({"canvases": $(".echo-canvas", body)});
	});
	var differentInitializationSchemas = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" id="testcanvas" data-canvas-id="js-sdk-tests/test-canvas-002-1"></div>');
		body.append('<div class="echo-canvas" id="js-sdk-tests/test-canvas-002-2" data-canvas-id="js-sdk-tests/test-canvas-002-2"></div>');
		body.append('<div class="some-class echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-002-3"></div>');
		body.append('<div class="canvases-container"><div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-002-4"></div></div>');
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-002-5"></div>');

		var count = {
			"valid": 5,
			"invalid": 4
		};
		var errors = {
			"canvas_already_initialized": [0, 4]
		};

		// check multiple initialization
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.Canvas.onError",
			"handler": function(topic, args) {
				count.invalid--;
				errors[args.code][0]++;
				if (!count.invalid) {
					Echo.Events.unsubscribe({"handlerId": handlerId});
					QUnit.ok(_eventsCountCheck(errors), "[different initialization schemas] Checking if the Loader indicated multiple initialization attmpts");
					if (!count.valid) callback();
				}
			}
		});

		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				this.destroy();
				count.valid--;
				if (!count.valid) {
					QUnit.ok(true, "[different initialization schemas] Checking if Auth applications were initialized correctly using different initialization schemas");
					if (!count.invalid) callback();
				}
			}});
		};
		for (var i = 0; i < 6; i++) {
			waitForCompletion("js-sdk-tests/test-canvas-002-" + i, "auth");
		}

		// canvases lookup in a given target
		Echo.Loader.init({
			"target": $(".canvases-container", body)
		});
		// passing HTML element as a canvas
		Echo.Loader.init({
			"canvases": this.document.getElementById("js-sdk-tests/test-canvas-002-2")
		});
		// passing jQuery object (id lookup) as a canvas
		Echo.Loader.init({
			"canvases": $("#testcanvas", body)
		});
		// passing jQuery object (class lookup) as a canvas
		Echo.Loader.init({
			"canvases": $(".some-class", body)
		});
		// Echo Loader call with no arguments (global lookup)
		Echo.Loader.init({"target": body});
	});
	var multipleAppsCanvas = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-003"></div>');
		var expecting = 15;
		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				// destroy counter instance
				this.destroy();
				expecting--;
				if (!expecting) {
					QUnit.ok(true, "[multiple apps canvas] Checking if an expected amount of Counter applications were initialized");
					callback();
				}
			}});
		};
		for (var i = 1; i <= expecting; i++) {
			waitForCompletion("js-sdk-tests/test-canvas-003", "test.counter." + i);
		}
		Echo.Loader.init({"target": body});
	});
	var overridesSameCanvases = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-008#foo"></div>');
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-008#bar"></div>');
		var getCanvasById = function(canvasId) {
			for (var i = 0; i < Echo.Loader.canvases.length; i++) {
				if (Echo.Loader.canvases[i].config.get("id") === canvasId) {
					return Echo.Loader.canvases[i];
				}
			}
		};
		var ids = [
			"js-sdk-tests/test-canvas-008#foo",
			"js-sdk-tests/test-canvas-008#bar"
		];
		var count = ids.length;
		Echo.jQuery.map(ids, function(canvasId) {
			Echo.Loader.override(canvasId, "auth", {
				"canvasId": canvasId,
				"ready": function() {
					QUnit.equal(this.config.get("canvasId"), canvasId,
						"[overrides same canvases] Check if the config value was updated by the \"override\" function call");
					this.destroy();
					if (!--count) {
						var first = getCanvasById(ids[0]);
						var second = getCanvasById(ids[1]);
						QUnit.notEqual(first.config.get("id"), second.config.get("id"),
							"[overrides same canvases] Check if canvas instances have different canvas ids");
						QUnit.equal(first.get("data.id"), second.get("data.id"),
							"[overrides same canvases] Check if canvas instances have the same canvas config that was downloaded from storage");
						callback();
					}
				}
			});
		});
		Echo.Loader.init({"target": body});
	});
	var appConfigOverrides = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-008"></div>');
		Echo.Loader.override("js-sdk-tests/test-canvas-008", "auth", {
			"appkey": "test.js-kit.com",
			"identityManager": {"logout": "test"},
			"ready": function() {
				var auth = this;
				QUnit.equal(auth.config.get("appkey"), "test.js-kit.com",
					"[app config overrides] Checking if the config value (string) was updated by the \"override\" function call");
				QUnit.deepEqual(auth.config.get("identityManager.logout"), "test",
					"[app config overrides] Checking if the config value (object) was updated by the \"override\" function call");
				this.destroy();
				callback();
			}
		});
		Echo.Loader.init({"target": body});
	});
	var clearCanvasConfigOnDestroy = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		var id = "js-sdk-tests/test-canvas-001";
		var inCache = function(hash) {
			return ((id + "#" + hash) in Echo.Loader.canvasesConfigById);
		};
		var deferred = Echo.Utils.foldl([], ["#foo", "#bar"], function(extra, acc) {
			body.append('<div class="echo-canvas" data-canvas-id="' + id + extra + '"></div>');
			$.map(["stream", "submit"], function(app) {
				var def = Echo.jQuery.Deferred();
				Echo.Loader.override(id + extra, app, {
					"ready": function() {
						def.resolve();
					}
				});
				acc.push(def);
			});
		});
		Echo.jQuery.when.apply(Echo.jQuery, deferred).done(function() {
			var canvases = Echo.Loader.canvases;
			QUnit.ok(inCache("foo") && inCache("bar"), "Checking that canvas config stored to the cache");
			var handlerId = Echo.Events.subscribe({
				"topic": "Echo.Canvas.onRefresh",
				"handler": function() {
					QUnit.ok(inCache("foo") && inCache("bar"), "Checking that canvas config cache includes both instances");
					canvases[0].destroy();
					QUnit.ok(!inCache("foo") && inCache("bar"), "Checking that canvas config was removed from the cache after destroy the canvas");
					canvases[1].destroy();
					QUnit.ok(Echo.jQuery.isEmptyObject(Echo.Loader.canvasesConfigById), "Checking that cache is empty after destroy all canvases");
					callback();
					Echo.Events.unsubscribe({"handlerId": handlerId});
				}
			});
			canvases[0].refresh();
		});
		Echo.Loader.init({"target": body});
	});
	var tests = [
		simpleValidCanvas,
		validAndInvalidCanvases,
		doubleInitializationPrevention,
		differentInitializationSchemas,
		multipleAppsCanvas,
		overridesSameCanvases,
		appConfigOverrides
	];
	var expected = 15;
	if (!Echo.Tests.Utils.isServerMocked()) {
		tests.unshift(clearCanvasConfigOnDestroy);
		expected = 19;
	}
	QUnit.expect(expected);
	Echo.Utils.sequentialCall(tests, function() {
		QUnit.start();
	});
}, {
	"timeout": 20000
});

/*
 * TODO fix relative URLs in tests/unit/loader/canvases/test.canvas.007.json
 * TODO: update it to new test infrastructure
suite.prototype.tests.canvasesScriptsLoadingTest = {
	"config": {
		"async": true,
		"testTimeout": 5000
	},
	"check": function() {
		var self = this;
		var debug = Echo.Loader.debug;

		$("#qunit-fixture").append("<div class=\"echo-canvas\" data-canvas-id=\"js-sdk-tests/test.canvas.007\"></div>");

		Echo.Loader.override("test.canvas.007", "test.apps.scripts", {"ready": function() {
			this.destroy();
			QUnit.ok(Echo.Variables.TestApp === "development", "Check if development version of application script was loaded");

			Echo.Loader.debug = false;
			delete window.Echo.Tests.Apps.TestApp;
			$("#qunit-fixture").empty().append("<div class=\"echo-canvas\" data-canvas-id=\"js-sdk-tests/test.canvas.007\"></div>");
			Echo.Loader.override("test.canvas.007", "test.apps.scripts", {"ready": function() {
				this.destroy();
				QUnit.ok(Echo.Variables.TestApp === "production", "Check if production version of application script was loaded");

				Echo.Loader.debug = debug;
				delete window.Echo.Tests.Apps.TestApp;

				QUnit.start();
			}});
			Echo.Loader.init({ "target": $("#qunit-fixture") });
		}});
		Echo.Loader.init({ "target": $("#qunit-fixture") });
	}
};
*/

})(Echo.jQuery);
