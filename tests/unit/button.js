Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/gui"
	], function($, GUI) {

	"use strict";

	Echo.Tests.module("Echo.GUI.Button", {
		"meta": {
			"className": "Echo.GUI.Button",
			"functions": [
				"refresh",
				"setState",
				"destroy"
			]
		}
	});

	Echo.Tests.test("common workflow", function() {
		var target = $("#qunit-fixture");
		var element = $("<button>").appendTo(target);
		var button = new GUI.Button({
			"target": element,
			"label": "FirstLabel"
		});
		QUnit.ok(target.html().match(/>FirstLabel</),
			"Checking that label is displayed");
		QUnit.ok(!element.is(":disabled"),
			"Checking that button is enabled by default");
		QUnit.ok(!target.html().match(/icon/),
			"Checking that icon CSS class is not added by default");

		var loadingIcon = Echo.Loader.getURL("images/loading.gif", false);
		button.setState({
			"target": element,
			"icon": loadingIcon,
			"disabled": true,
			"label": "SecondLabel"
		});
		button.refresh();

		QUnit.ok(!target.html().match(/>FirstLabel</) && target.html().match(/>SecondLabel</),
			"Checking that label is changed after setState() method call");
		QUnit.ok(element.is(":disabled"),
			"Checking that button is disabled after setState() method call");
		var backgroundRegExp = new RegExp(".*background(-image)?:.*" + loadingIcon, "i");
		QUnit.ok(target.html().match(/icon/) && target.html().match(backgroundRegExp),
			"Checking that background icon is added to element after setState() method call");

		$(".echo-label", element).html("NewLabel");
		QUnit.ok(target.html().match(/>NewLabel</),
			"Checking that new label is there after direct change of the element HTML");
		button.refresh();
		QUnit.ok(!target.html().match(/>NewLabel</) && target.html().match(/SecondLabel</),
			"Checking that refresh() call restores the button state");

		button.setState({"label": "ThirdLabel"});
		QUnit.ok(!target.html().match(/>SecondLabel</) && target.html().match(/>ThirdLabel</),
			"Checking that label is changed after updating 'label' field");

		QUnit.ok(element.is(":disabled"),
			"Checking that button is still disabled");
		button.config.set("disabled", false);
		button.refresh();
		QUnit.ok(!element.is(":disabled"),
			"Checking that button is enabled after updating 'disabled' field");

		QUnit.ok(target.html().match(/icon/),
			"Checking that icon CSS class is still there");
		button.config.set("icon", false);
		button.refresh();
		QUnit.ok(!target.html().match(/icon/) && !target.html().match(backgroundRegExp),
			"Checking that background icon is not added to element after updating 'icon' field");
		button.destroy();
		QUnit.ok(element.is(":empty"), "Checking destroy() method");
	});

	Echo.Tests.test("taking data from HTML", function() {
		var target = $("#qunit-fixture");
		var element = $('<button disabled="disabled">ClickMe</button>').appendTo(target);
		var button = new GUI.Button({"target": element});
		QUnit.ok(target.html().match(/>ClickMe</),
			"Checking that label value is taken from the element");
		QUnit.ok(element.is(":disabled"),
			"Checking that disabled value is taken from the element");
	});
	callback();
	});
});
