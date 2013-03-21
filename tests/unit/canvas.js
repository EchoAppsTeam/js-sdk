(function($) {

var suite = Echo.Tests.Unit.Canvas = function() {
	this.constructRenderersTest({
		"instance": {
			"name": "Echo.Canvas",
			"config": {
				"data": {
					"apps": []
				}
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
		var self = this;
		var target = $("#qunit-fixture");
		target.append($('<div id="echo-canvas" data-canvas-appkey="test.aboutecho.com" data-canvas-id="js-sdk-tests/test-canvas-001"></div>'));
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

})(Echo.jQuery);
