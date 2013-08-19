(function($) {

Echo.Tests.module("Echo.Canvas", {
	"meta": {
		"className": "Echo.Canvas"
	}
});

Echo.Tests.renderersTest("Echo.Canvas", {
	"data": {
		"apps": []
	}
});

Echo.Tests.asyncTest("common workflow", function() {
	var target = $("#qunit-fixture");
	target.append('<div id="echo-canvas" data-canvas-appkey="echo.jssdk.tests.aboutecho.com" data-canvas-id="js-sdk-tests/test-canvas-001#some-id_001"></div>');
	new Echo.Canvas({
		"target": $("#echo-canvas"),
		"ready": function() {
			QUnit.ok(true, "Check that component is initialized");
			QUnit.ok(this.apps.length === 2, "Check that all apps are initialized");
			QUnit.ok(
				this.config.get("target").is(".echo-canvas-js-sdk-tests-test-canvas-001"),
				"Check that target is marked with CSS class based on canvas ID"
			);
			QUnit.ok(
				this.config.get("target").is(".echo-canvas-js-sdk-tests-test-canvas-001-some-id-001"),
				"Check that target is marked with CSS class based on canvas ID and additional ID separated with #"
			);
			QUnit.ok(
				$.grep(this.apps, function(app) {
					return app.config.get("canvasId") === "js-sdk-tests/test-canvas-001#some-id_001";
				}).length === 2,
				"Check that all apps received the canvas ID"
			);
			QUnit.ok(
				$.grep(this.apps, function(app) {
					return !!~app.config.get("target").attr("class").indexOf("echo-canvas-appId-");
				}).length === 2,
				"Check that all apps marked with appId"
			);
			QUnit.ok(
				this.config.get("target").data("echo-canvas-initialized"),
				"Check that target marked as initialized canvas"
			);
			this.destroy();
			QUnit.ok(
				!this.config.get("target").data("echo-canvas-initialized"),
				"Check that target is not marked as initialized canvas"
			);
			QUnit.ok(
				$.grep(this.apps, function(app) {
					return $.isEmptyObject(app.subscriptionIDs);
				}).length === 2,
				"Check all apps unsubscribed from all events after destroy canvas"
			);
			QUnit.start();
		}
	});
});

Echo.Tests.asyncTest("select app script url", function() {
	var target = $("#qunit-fixture");
	target.append($('<div id="echo-canvas" data-canvas-appkey="echo.jssdk.tests.aboutecho.com" data-canvas-id="js-sdk-tests/test-canvas-001"></div>'));
	new Echo.Canvas({
		"target": $("#echo-canvas"),
		"ready": function() {
			var debug = Echo.Loader.debug;
			QUnit.strictEqual(this._getAppScriptURL({}), undefined, "If incoming object is empty, no url is returned");
			QUnit.strictEqual(this._getAppScriptURL({"script": "some-url"}), "some-url", "If \"scripts\" field is omitted, then \"script\" field will be used");
			Echo.Loader.debug = true;
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"prod": "some-prod-url"
				}
			}), "some-prod-url", "If \"scripts\" field provides only \"prod\" URL, then it will be used for development too");
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url",
					"prod": "some-prod-url"
				}
			}), "some-dev-url", "Returns \"dev\" URL in the \"dev\" environment");
			Echo.Loader.debug = false;
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url"
				}
			}), "some-dev-url", "If \"scripts\" field provides only \"dev\" URL, then it will be used for production too");
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url",
					"prod": "some-prod-url"
				}
			}), "some-prod-url", "Returns \"prod\" URL in the \"prod\" environment");
			if (window.location.protocol === "https:") {
				QUnit.strictEqual(this._getAppScriptURL({
					"scripts": {
						"prod": {
							"secure": "some-secure-url",
							"regular": "some-regular-url"
						}
					}
				}), "some-secure-url", "For the secure zone it returns a secure URL");
			} else {
				QUnit.strictEqual(this._getAppScriptURL({
					"scripts": {
						"prod": {
							"secure": "some-secure-url",
							"regular": "some-regular-url"
						}
					}
				}), "some-regular-url", "For the regular zone it returns a regular URL");
			}
			Echo.Loader.debug = debug;
			QUnit.start();
		}
	});
});

suite.prototype.tests.canvasContract = {
	"check": function() {
		var target = $("<div>").data("canvas-id", "js-sdk-test").appendTo("#qunit-fixture");

		window.CanvasAdapter = function(config) {
			QUnit.equal(config.id, 256, "Check if canvas adapter was initialized with valid custom param in config");
			QUnit.ok(config.target instanceof Echo.jQuery, "Check if canvas adapter was initialized with valid target");
			QUnit.equal(config.canvasId, "js-sdk-test", "Check if canvas adapter was initialized with valid canvasId")
		};

		var canvas = new Echo.Canvas({
			"target": target,
			"data": {
				"apps": [{
					"component": "CanvasAdapter",
					"config": {"id": 256}
				}],
			}
		});
		canvas.destroy();
		delete window.CanvasAdapter;
	}
};

suite.prototype.tests.canvasDestroy = {
	"check": function() {
		window.TestCanvases = {
			"destroyIsAFunction": function(config) {
				return {
					"destroy": $.noop
				};
			},
			"destroyIsUndefined": function(config) {
				return {};
			},
			"destroyIsNotAFunction": function(config) {
				return {
					"destroy": "destroy"
				};
			}
		};

		$.each(TestCanvases, function(component) {
			var result;
			var canvas = new Echo.Canvas({
				"target": $("#qunit-fixture"),
				"data": {
					"apps": [{
						"component": "TestCanvases." + component
					}],
				}
			});
			try {
				canvas.destroy();
				result = true;
			} catch(e) {
				result = false;
			}
			QUnit.ok(result, "Check if canvas adapter was destroyed successfully (" +
							 component.replace(/([A-Z])/g, " $1").toLowerCase() + ")");
		});
		delete window.TestCanvases;
	}
};

})(Echo.jQuery);
