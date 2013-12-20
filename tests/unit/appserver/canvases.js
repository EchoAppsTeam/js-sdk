Echo.Tests.Units.push(function(callback) {

"use strict";

Echo.require([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/utils",
	"loadFrom![echo/appserver.sdk]echo/appserver/canvases"
], function($, Utils, Canvases) {

var requireJSLoad;
var reCanvasURL = new RegExp("(?:{%=baseURLs.canvases.dev%}|{%=baseURLs.canvases.prod%})/js-sdk-tests/(.*)$");

Echo.Tests.Fixtures.canvases = {};

Echo.Tests.module("Echo.AppServer.Canvases", {
	"meta": {
		"className": "Echo.AppServer.Canvases",
		"functions": ["init", "destroy", "override"]
	},
	"setup": function() {
		// let's always mock canvases
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
		Echo.Tests.Fixtures.canvases = {};
		// these URLs are copied from the "sdk-app" and "third-party-app" canvases
		Echo.require.undef("{%=baseURLs.tests%}/fixtures/resources/apps/sdk-app.js");
		Echo.require.undef("{%=baseURLs.tests%}/fixtures/resources/apps/third-party-app.js");
	}
});

Echo.Tests.asyncTest("canvas internal contract", function() {
	Echo.Tests.isolate(function() {
		var savedCanvas, count = 2;
		var target = $("#qunit-fixture");
		target.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/stream-and-submit#unique-id"></div>');
		$.each(["Stream", "Submit"], function(i, app) {
			Echo.Events.subscribe({
				"topic": "Echo.StreamServer.BundledApps." + app + ".ClientWidget.onReady",
				"once": true,
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

Echo.Tests.asyncTest("init(): working with elements", function() {
	var defaultInit = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/sdk-app"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/third-party-app"></div>');
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
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/sdk-app"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/third-party-app"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": this.document.querySelectorAll(".echo-canvas-test"),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 2, "passing an array of DOM elements initializes expected number of canvases");
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				callback();
			}
		});
	});

	var nativeSingleElement = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div id="echo-canvas-test" data-canvas-id="js-sdk-tests/sdk-app"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": this.document.getElementById("echo-canvas-test"),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 1, "passing single DOM element initializes expected number of canvases");
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				callback();
			}
		});
	});

	var jQueryElements = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/sdk-app"></div>')
			.append('<div class="echo-canvas-test" data-canvas-id="js-sdk-tests/third-party-app"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": $(".echo-canvas-test", this.document),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 2, "passing an array of jQuery elements initializes expected number of canvases");
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				callback();
			}
		});
	});

	var jQuerySingleElement = Echo.Tests.isolate(function(callback) {
		$(this.document.body)
			.append('<div id="echo-canvas-test" data-canvas-id="js-sdk-tests/sdk-app"></div>');
		Canvases.init({
			"target": this.document.body,
			"canvases": $("#echo-canvas-test", this.document),
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 1, "passing single jQuery element initializes expected number of canvases");
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				callback();
			}
		});
	});

	QUnit.expect(10);
	Echo.Utils.sequentialCall([
		defaultInit,
		nativeElements,
		nativeSingleElement,
		jQueryElements,
		jQuerySingleElement
	], function() {
		QUnit.start();
	});
});

Echo.Tests.asyncTest("init(): valid and invalid canvases", function() {
	Echo.Tests.isolate(function(callback) {
		var self = this;
		var expectedErrors = {
			"no_apps": 2,
			"no_config": 1,
			"canvas_already_initialized": 1,
			"invalid_canvas_config": 1
		};
		var actualErrors = {};
		var valid = 0;
		$(this.document.body)
			// all mandatory fields are missing -->
			.append('<div class="echo-canvas"></div>')
			// all fields defined, but no config available for the canvas id specified
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/nonexistent"></div>')
			// canvas with empty app list
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/no-apps"></div>')
			// canvas with no configuration at all (empty JSON object)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/empty-config"></div>')
			// canvas with several incompletely configurated apps
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/incomplete-app-config"></div>')
			// valid canvas with existing configuration
			.append('<div class="echo-canvas reinit" data-canvas-id="js-sdk-tests/third-party-app"></div>');

		Canvases.init({
			"target": this.document.body,
			"onCanvasReady": function(canvas) {
				valid++;
			},
			"onCanvasError": function(data) {
				actualErrors[data.code] = actualErrors[data.code] || 0;
				actualErrors[data.code]++;
			},
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.total, 6, "expected number of canvases is processed");
				QUnit.strictEqual(stats.failed, 4, "expected number of canvases is failed");
				Canvases.init({
					"target": self.document.body,
					"canvases": $(".reinit", self.document),
					"onCanvasError": function(data) {
						actualErrors[data.code] = actualErrors[data.code] || 0;
						actualErrors[data.code]++;
					},
					"onComplete": function(stats) {
						// TODO: verify triggering of incomplete error configs
						QUnit.deepEqual(actualErrors, expectedErrors, "got all expected errors");
						callback();
					}
				});
			}
		});
	})(function() {
		QUnit.start();
	});
});

Echo.Tests.asyncTest("destroy()", function() {
	Echo.Tests.isolate(function() {
		var canvases = {};
		$(this.document.body)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/sdk-app"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/third-party-app#1"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/third-party-app#2"></div>');
		Canvases.init({
			"target": this.document.body,
			"onCanvasReady": function(canvas) {
				canvases[canvas.ids.unique] = canvas;
			},
			"onComplete": function(stats) {
				QUnit.strictEqual(stats.failed, 0, "no canvases are failed");
				var initialized = function(id) {
					return canvases["js-sdk-tests/" + id].target.getAttribute("data-canvas-initialized") === "true";
				};
				QUnit.ok(
					initialized("sdk-app") &&
					initialized("third-party-app#1") &&
					initialized("third-party-app#2"),
					"all canvases are initialized"
				);
				Canvases.destroy("js-sdk-tests/sdk-app");
				QUnit.ok(
					!initialized("sdk-app") &&
					initialized("third-party-app#1") &&
					initialized("third-party-app#2"),
					"destroying one canvas leaves the others initialized"
				);
				Canvases.destroy();
				QUnit.ok(
					!initialized("sdk-app") &&
					!initialized("third-party-app#1") &&
					!initialized("third-party-app#2"),
					"destroying all canvas make them not initialized"
				);
				QUnit.start();
			}
		});
	})();
});

Echo.Tests.asyncTest("override()", function() {
	Echo.Tests.isolate(function() {
		$(this.document.body)
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/sdk-app#foo"></div>')
			.append('<div class="echo-canvas" data-canvas-id="js-sdk-tests/sdk-app#bar"></div>');
		var count = 2;
		var maybeComplete = function() {
			if (!--count) {
				QUnit.start();
			}
		};
		Canvases.override("js-sdk-tests/sdk-app#foo", "app", {
			"key": "value2",
			"ready": function() {
				QUnit.strictEqual(
					this.config.get("key"),
					"value2",
					"app config parameter is overridden"
				);
				maybeComplete();
			}
		});
		Canvases.override("js-sdk-tests/sdk-app#bar", "app", {
			"ready": function() {
				QUnit.strictEqual(
					this.config.get("key"),
					"value1",
					"app config parameter is not overridden"
				);
				maybeComplete();
			}
		});
		Canvases.init({
			"target": this.document.body
		});
	})();
});

callback();

});

});
