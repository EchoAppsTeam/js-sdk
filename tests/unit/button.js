(function($) {

var suite = Echo.Tests.Unit.Button = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Button",
	"functions": [
		"refresh",
		"update",
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

		var element = $("<button>").appendTo(target);
		var button = new Echo.GUI.Button({
			"target": element,
			"label": "FirstLabel"
		});
		QUnit.ok($(target).html().match(/FirstLabel/),
			 "Checking that label is displayed");
		QUnit.ok(!element.attr('disabled'),
			"Checking that button is enabled by default");
		QUnit.ok(!$(target).html().match(/icon/),
			"Checking that icon CSS class is not added by default");

		var loadingIcon = Echo.Loader.getURL("images/loading.gif", false);
		button.config.set("label", "SecondLabel");
		button.config.set("disabled", true);
		button.config.set("icon", loadingIcon);
		button.refresh();

		QUnit.ok(!$(target).html().match(/FirstLabel/) && $(target).html().match(/SecondLabel/),
			"Checking that label is changed after set() method call");
		QUnit.ok(element.attr('disabled'),
			"Checking that button is disabledi after set() method call");

		$(".echo-label", element).html("NewLabel");
		button.refresh();
		QUnit.ok($(".echo-label", element).html() === "SecondLabel",
			"Checking refresh() method");

		var backgroundRegExp = new RegExp(".*background(-image)?:.*" + loadingIcon, "i");

		QUnit.ok($(target).html().match(/icon/) && $(target).html().match(backgroundRegExp),
			"Checking that background icon is added to element after set() method call");

		button.setState({"label": "ThirdLabel"});
		QUnit.ok(!$(target).html().match(/SecondLabel/) && $(target).html().match(/ThirdLabel/),
			"Checking that label is changed after updating 'label' field");

		button.config.set("disabled", false);
		button.refresh();
		QUnit.ok(!element.attr('disabled'),
			"Checking that button is enabled after updating 'disabled' field");

		button.config.set("icon", false);
		button.refresh();
		QUnit.ok(!$(target).html().match(/icon/) && !$(target).html().match(backgroundRegExp),
			"Checking that background icon is not added to element after updating 'icon' field");
		$(target).empty();

		element = $('<button disabled="disabled">ClickMe</button>').appendTo(target);
		button = new Echo.GUI.Button({"target": element});
		QUnit.ok($(target).html().match(/ClickMe/),
			 "Checking that label value is taken from the element");

		QUnit.ok(element.attr('disabled'),
			"Checking that disabled value is taken from the element");

		button.destroy();
		QUnit.ok(element.is(":empty"), "Checking destroy() method");

		$(target).empty();
		QUnit.start();
		
	}
};

})(Echo.jQuery);
