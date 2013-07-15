(function($) {

var suite = Echo.Tests.Unit.Canvas = function() {
	this.constructRenderersTest({
		"instance": {
			"name": "Echo.Canvas",
			"config": {
				"data": {
					"apps": []
				},
				"ready": $.noop
			}
		},
		"config": {
			"async": false,
			"testTimeout": 10000
		}
	});
};

suite.prototype.info = {
	"className" : "Echo.Canvas"
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true,
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var target = $("#qunit-fixture");
		target.append($('<div id="echo-canvas" data-canvas-appkey="echo.jssdk.tests.aboutecho.com" data-canvas-id="js-sdk-tests/test-canvas-001"></div>'));
		new Echo.Canvas({
			"target": $("#echo-canvas"),
			"ready": function() {
				QUnit.ok(true, "Check that component initialization");
				QUnit.ok(this.apps.length === 2, "Check that all apps were initialized");
				QUnit.ok(this.config.get("target").data("echo-canvas-initialized"), "Check that target marked as initialized canvas");
				this.destroy();
				QUnit.ok(!this.config.get("target").data("echo-canvas-initialized"), "Check that target unmarked as initialized canvas");
				QUnit.ok($.grep(this.apps, function(app) { return $.isEmptyObject(app.subscriptionIDs); }).length === 2, "Check all apps unsubscribed from all events after destroy canvas");
				QUnit.start();
			}
		});
	}
};

suite.prototype.tests.getAppScript = {
	"config": {
		"async": true,
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var target = $("#qunit-fixture");
		target.append($('<div id="echo-canvas" data-canvas-appkey="echo.jssdk.tests.aboutecho.com" data-canvas-id="js-sdk-tests/test-canvas-001"></div>'));
		new Echo.Canvas({
			"target": $("#echo-canvas"),
			"ready": function() {
				var debug = Echo.Loader.debug;
				QUnit.strictEqual(this._getAppScriptURL({}), undefined, "Check that incoming object is empty");
				QUnit.strictEqual(this._getAppScriptURL({"script": "some-url"}), "some-url", "Check if \"scripts\" field ommited, then \"script\" field will be used");
				QUnit.strictEqual(this._getAppScriptURL({
					"script": "some-url",
					"scripts": {
						"dev": "some-dev-url"
					}
				}), "some-dev-url", "Check if \"scripts\" field provided only \"dev\" URL, then it will be used for production too");
				Echo.Loader.debug = true;
				QUnit.strictEqual(this._getAppScriptURL({
					"script": "some-url",
					"scripts": {
						"prod": "some-prod-url"
					}
				}), "some-prod-url", "Check if \"scripts\" field provided only \"prod\" URL, then it will be used for development too");
				QUnit.strictEqual(this._getAppScriptURL({
					"script": "some-url",
					"scripts": {
						"dev": "some-dev-url",
						"prod": "some-prod-url"
					}
				}), "some-dev-url", "Check that returns dev URL in the dev environment");
				Echo.Loader.debug = false;
				QUnit.strictEqual(this._getAppScriptURL({
					"script": "some-url",
					"scripts": {
						"dev": "some-dev-url"
					}
				}), "some-dev-url", "Check if \"scripts\" field provided only \"dev\" URL, then it will be used for production too");
				QUnit.strictEqual(this._getAppScriptURL({
					"script": "some-url",
					"scripts": {
						"dev": "some-dev-url",
						"prod": "some-prod-url"
					}
				}), "some-prod-url", "Check that returns dev URL in the dev environment");
				if (window.location.protocol === "https:") {
					QUnit.strictEqual(this._getAppScriptURL({
						"scripts": {
							"prod": {
								"secure": "some-secure-url",
								"regular": "some-regular-url"
							}
						}
					}), "some-secure-url", "Check that in the secure zone returns a secure URL");
				} else {
					QUnit.strictEqual(this._getAppScriptURL({
						"scripts": {
							"prod": {
								"secure": "some-secure-url",
								"regular": "some-regular-url"
							}
						}
					}), "some-regular-url", "Check that in the regular zone returns a regular URL");
				}
				Echo.Loader.debug = debug;
				QUnit.start();
			}
		});
	}
};

})(Echo.jQuery);
