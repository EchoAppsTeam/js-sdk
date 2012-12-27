(function($) {

var suite = Echo.Tests.Unit.Button = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Button",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true
	},
	"check": function() {
		
		var check = function() {
			var target = document.getElementById("qunit-fixture");
			$(target).empty();

			var element = $("<button>").appendTo(target);
			Echo.GUI.button({
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
			Echo.GUI.button("update", {
				"target": element,
				"label": "SecondLabel",
				"disabled": true,
				"icon": loadingIcon
			});
			QUnit.ok(!$(target).html().match(/FirstLabel/) && $(target).html().match(/SecondLabel/),
				"Checking that label is changed after update() method");
			QUnit.ok(element.attr('disabled'),
				"Checking that button is disabled after update() method");

			var backgroundRegExp = new RegExp(".*background(-image)?:.*" + loadingIcon, "i");

			QUnit.ok($(target).html().match(/icon/) && $(target).html().match(backgroundRegExp),
				"Checking that background icon is added to element after update() method");

			Echo.GUI.button("update", {"target": element, "label": "ThirdLabel"});
			QUnit.ok(!$(target).html().match(/SecondLabel/) && $(target).html().match(/ThirdLabel/),
				"Checking that label is changed after updating 'label' field");
			Echo.GUI.button("update", {"target": element, "disabled": false});
			QUnit.ok(!element.attr('disabled'),
				"Checking that button is enabled after updating 'disabled' field");
			Echo.GUI.button("update", {"target": element, "icon": false});
			QUnit.ok(!$(target).html().match(/icon/) && !$(target).html().match(backgroundRegExp),
				"Checking that background icon is not added to element after updating 'icon' field");
			$(target).empty();

			element = $('<button disabled="disabled">ClickMe</button>').appendTo(target);
			Echo.GUI.button({"target": element});
			QUnit.ok($(target).html().match(/ClickMe/),
				 "Checking that label value is taken from the element");
			QUnit.ok(element.attr('disabled'),
				"Checking that disabled value is taken from the element");

			$(target).empty();
			QUnit.start();
		};
		
		Echo.Loader.download([{
			"url": "third-party/bootstrap.pack.js"
		}], check);
	}
};

})(Echo.jQuery);
