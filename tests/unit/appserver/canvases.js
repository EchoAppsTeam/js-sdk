Echo.Tests.Units.push(function(callback) {

"use strict";

Echo.require([
	"jquery",
	"echo/appserver/canvases"
], function($, Canvases) {

var requireJSLoad;
var reCanvasURL = new RegExp("(?:{%=baseURLs.canvases.dev%}|{%=baseURLs.canvases.prod%})/js-sdk-tests/(.*)$");

Echo.Tests.module("Echo.AppServer.Canvases", {
	"meta": {
		"className": "Echo.AppServer.Canvases"
	},
	"setup": function() {
		requireJSLoad = Echo.require.load;
		Echo.require.load = function(context, moduleId, url) {
			var matches = url.match(reCanvasURL);
			if (matches) {
				url = Echo.Tests.baseURL + "fixtures/canvases/" + matches[1] + ".js";
			}
			return requireJSLoad(context, moduleId, url);
		};

	},
	"teardown": function() {
		Echo.require.load = requireJSLoad;
		requireJSLoad = null;
		Canvases.destroy();
	}
});

Echo.Tests.asyncTest("canvas contract", function() {
	Echo.Tests.isolate(function() {
		var savedCanvas, count = 2;
		var target = $("#qunit-fixture");
		target.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/stream-and-submit#unique-id"></div>');
		$.each(["Stream", "Submit"], function(i, app) {
			Echo.Events.subscribe({
				"topic": "Echo.StreamServer.BundledApps." + app + ".ClientWidget.onReady",
				"handler": function(topic) {
					var app = topic.indexOf("Submit") < 0 ? "Stream" : "Submit";
					QUnit.ok(true, app + " app is initialized successfully");
					if (!--count) {
						QUnit.equal(
							$.grep(savedCanvas.apps, function(app) {
								return !$.isEmptyObject(app.subscriptionIDs);
							}).length,
							2,
							"all apps have some subscriptions"
						);
						QUnit.strictEqual(
							Echo.require.specified(savedCanvas.dataURL),
							true,
							"canvas data URL is known to requireJS"
						);
						Canvases.destroy(savedCanvas.ids.unique);
						QUnit.strictEqual(
							savedCanvas.target.getAttribute("data-canvas-initialized"),
							"false",
							"canvas target is not marked as initialized"
						);
						QUnit.equal(
							$.grep(savedCanvas.apps, function(app) {
								return $.isEmptyObject(app.subscriptionIDs);
							}).length,
							2,
							"all apps are unsubscribed from all events"
						);
						QUnit.strictEqual(
							Echo.require.specified(savedCanvas.dataURL),
							false,
							"requireJS doesn't remember this canvas anymore"
						);
						QUnit.start();
					}
				}
			});
		});
		Canvases.init({
			"target": target,
			"onCanvasReady": function(canvas) {
				savedCanvas = canvas;
				var target = $(canvas.target);
				QUnit.equal(
					canvas.ids.unique,
					"js-sdk-tests/stream-and-submit#unique-id",
					"canvas id is correct"
				);
				QUnit.equal(canvas.apps.length, 2, "all apps are initialized");
				QUnit.ok(
					target.is(".echo-canvas-js-sdk-tests-stream-and-submit"),
					"target is marked with CSS class based on canvas main Id"
				);
				QUnit.ok(
					target.is(".echo-canvas-js-sdk-tests-stream-and-submit-unique-id"),
					"target is marked with CSS class based on canvas unique Id"
				);
				QUnit.equal(
					$.grep(canvas.apps, function(app) {
						return app.config.get("canvasId") === "js-sdk-tests/stream-and-submit#unique-id";
					}).length,
					2,
					"all apps received the canvas Id"
				);
				QUnit.equal(
					$.grep(canvas.apps, function(app) {
						return app.config.get("target").attr("class").indexOf("echo-canvas-appId-") >=0;
					}).length,
					2,
					"all apps are marked with appId"
				);
				QUnit.strictEqual(
					canvas.target.getAttribute("data-canvas-initialized"),
					"true",
					"target is marked as initialized canvas"
				);
			}
		});
	})();
});

/*Echo.Tests.asyncTest("getting canvas elements", function() {
	var defaultInit = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-004"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-004"></div>');
		Canvases.init({
			"target": this.document.body,
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 2, "auto discovering initializes expected number of canvases");
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				callback();
			}
		});
	});

	var nativeElements = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": this.document.querySelectorAll(".echo-canvas-test"),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.failed, 0, "passing an array of DOM elements initializes expected number of canvases");
				callback();
			}
		});
	});

	var nativeSingleElement = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div id="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": this.document.getElementById("echo-canvas-test"),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.failed, 0, "passing single DOM element initializes expected number of canvases");
				callback();
			}
		});
	});

	var jQueryElements = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": $(".echo-canvas-test", this.document),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.failed, 0, "passing an array of jQuery element initializes expected number of canvases");
				callback();
			}
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
			if (event[0] !== event[1]) {
				success = false;
				return false; // break
			}
		});
		return success;
	};
	var simpleValidCanvas = Echo.Tests.isolate(function(callback) {
		$(this.document.body).append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');
		var expecting = 2;
		var waitForCompletion = function(canvasID, appID) {
			Echo.Loader.override(canvasID, appID, {"ready": function() {
				QUnit.ok(true, "[simple valid canvas] Checking if " + appID + " control is initialized correctly after a page canvases lookup");
				this.destroy();
				expecting--;
				if (!expecting) {
					callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/stream-and-submit", "submit");
		waitForCompletion("js-sdk-tests/stream-and-submit", "stream");
		Canvases.init({"target": this.document.body});
	});
	var validAndInvalidCanvases = Echo.Tests.isolate(function(callback) {
		Echo.Loader.canvases = [];
		Echo.Loader.canvasesConfigById = {};
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
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');

		var count = {
			"valid": 2,
			"invalid": 8
		};
		// check invalid canvases
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.Canvas.onError",
			"handler": function() {
				count.invalid--;
				if (!count.invalid) {
					Echo.Events.unsubscribe({"handlerId": handlerId});
					QUnit.ok(true, "[valid and invalid canvases] Checking the number of invalid canvases");
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
					QUnit.ok(true, "[valid and invalid canvases] Checking if both controls (Stream and Submit) were initialized correctly after a page canvases lookup");
					if (!count.invalid) callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/stream-and-submit", "submit");
		waitForCompletion("js-sdk-tests/stream-and-submit", "stream");
		Canvases.init({"target": body});
	});
	var doubleInitializationPrevention = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" id="canvas" data-canvas-id="js-sdk-tests/stream-and-submit"></div>');
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
					QUnit.ok(true, "[double initialization prevention] Checking if both controls (Stream and Submit) were initialized correctly after a page canvases lookup");
					if (!count.invalid) callback();
				}
			}});
		};
		waitForCompletion("js-sdk-tests/stream-and-submit", "submit");
		waitForCompletion("js-sdk-tests/stream-and-submit", "stream");
		// multiple initialization attempts,
		// we expect each canvas to be initialized only once
		Canvases.init({"target": body});
		Canvases.init({"canvases": this.document.getElementById("canvas")});
		Canvases.init({"canvases": $("#canvas", body)});
		Canvases.init({"canvases": $(".echo-canvas", body)});
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
					QUnit.ok(true, "[different initialization schemas] Checking if Auth controls were initialized correctly using different initialization schemas");
					if (!count.invalid) callback();
				}
			}});
		};
		for (var i = 0; i < 6; i++) {
			waitForCompletion("js-sdk-tests/test-canvas-002-" + i, "auth");
		}

		// canvases lookup in a given target
		Canvases.init({
			"target": $(".canvases-container", body)
		});
		// passing HTML element as a canvas
		Canvases.init({
			"canvases": this.document.getElementById("js-sdk-tests/test-canvas-002-2")
		});
		// passing jQuery object (id lookup) as a canvas
		Canvases.init({
			"canvases": $("#testcanvas", body)
		});
		// passing jQuery object (class lookup) as a canvas
		Canvases.init({
			"canvases": $(".some-class", body)
		});
		// Echo Loader call with no arguments (global lookup)
		Canvases.init({"target": body});
	});
	var multipleAppsCanvas = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-003"></div>');
		var expecting = 15;
		var waitForCompletion = function(canvasID, appID) {
			Canvases.override(canvasID, appID, {"ready": function() {
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
		Canvases.init({"target": body});
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
			Canvases.override(canvasId, "auth", {
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
		Canvases.init({"target": body});
	});
	var appConfigOverrides = Echo.Tests.isolate(function(callback) {
		var body = $(this.document.body);
		body.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-008"></div>');
		Canvases.override("js-sdk-tests/test-canvas-008", "auth", {
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
		Canvases.init({"target": body});
	});
	var clearCanvasConfigOnDestroy = Echo.Tests.isolate(function(callback) {
		Echo.Loader.canvases = [];
		Echo.Loader.canvasesConfigById = {};
		var body = $(this.document.body);
		var id = "js-sdk-tests/stream-and-submit";
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
		appConfigOverrides//,
		//clearCanvasConfigOnDestroy
	];
	QUnit.expect(19);
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
			QUnit.ok(Echo.Variables.TestControl === "development", "Check if development version of application script was loaded");

			Echo.Loader.debug = false;
			delete window.Echo.Tests.Controls.TestControl;
			$("#qunit-fixture").empty().append("<div class=\"echo-canvas\" data-canvas-id=\"js-sdk-tests/test.canvas.007\"></div>");
			Echo.Loader.override("test.canvas.007", "test.apps.scripts", {"ready": function() {
				this.destroy();
				QUnit.ok(Echo.Variables.TestControl === "production", "Check if production version of application script was loaded");

				Echo.Loader.debug = debug;
				delete window.Echo.Tests.Controls.TestControl;

				QUnit.start();
			}});
			Echo.Loader.init({ "target": $("#qunit-fixture") });
		}});
		Echo.Loader.init({ "target": $("#qunit-fixture") });
	}
};
*/

callback();

});

});
