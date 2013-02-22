(function($) {

var suite = Echo.Tests.Unit.GUI = function() {};

suite.prototype.info = {
	"className": "Echo.GUI",
	"suiteName": "GUI",
	"functions": [
		"refresh",
		"destroy"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true
	},
	"check": function() {

		var target = document.getElementById("qunit-fixture");
		$(target).empty();
		var element = $("<div>some_content</div>").appendTo(target);

		var component = new Echo.GUI({
			"target": element,
			"param1": "value1",
			"param2": "value2"
		}, {
			"param2": "value22",
			"param3": "value3"
		});

		QUnit.ok(component.config.get("target").html() === "some_content", "Checking target parameter");

		QUnit.ok(component.config.get("param1") === "value1"
			&& component.config.get("param2") === "value2"
			&& component.config.get("param3") === "value3"
				, "Checking other config parameters");

		component.destroy();
		QUnit.ok(!component.config.get("target")
			&& element.is(":empty"), "Checking destroy() method.");

		$(target).empty();
		QUnit.start();
		
	}
};

})(Echo.jQuery);
