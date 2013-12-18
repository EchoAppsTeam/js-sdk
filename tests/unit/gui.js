Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"loadFrom![echo/gui.pack]echo/gui"
	], function($, GUI) {

	"use strict";

	Echo.Tests.module("Echo.GUI", {
		"meta": {
			"className": "Echo.GUI",
			"functions": [
				"refresh",
				"destroy"
			]
		}
	});

	Echo.Tests.test("public workflow", function() {
		var target = $("#qunit-fixture");
		var element = $("<div>some_content</div>").appendTo(target);

		var component = new GUI({
			"target": element,
			"param1": "value1",
			"param2": "value2"
		}, {
			"param2": "value22",
			"param3": "value3"
		});
		QUnit.ok(
			component.config.get("target").html() === "some_content",
			"Checking target parameter"
		);
		QUnit.ok(
			component.config.get("param1") === "value1"
				&& component.config.get("param2") === "value2"
				&& component.config.get("param3") === "value3",
			"Checking other config parameters"
		);
		component.destroy();
		QUnit.ok(
			!component.config.get("target") && element.is(":empty"),
			"Checking destroy() method"
		);
	});
	callback();
	});
});
