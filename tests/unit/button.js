(function($) {

var suite = Echo.Tests.Unit.Button = function() {};

suite.prototype.info = {
	"className": "Echo.Button",
	"functions": [
		"update",
		"render"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"check": function() {
		var target = document.getElementById("qunit-fixture");
		$(target).empty();
		
		var element = $("<button>").appendTo(target);
		var button = new Echo.Button(element, {
			"label": "FirstLabel"
		});
		QUnit.ok($(target).html().match(/FirstLabel/),
			 "Checking that label is displayed");
		QUnit.ok(!element.attr('disabled'),
			"Checking that button is enabled by default");
		QUnit.ok(!$(target).html().match(/icon/),
			"Checking that icon CSS class is not added by default");
		
		var css = ".ui-test-icon { background: url(//cdn.echoenabled.com/images/loading.gif); height: 16px; width: 16px; }";
		Echo.Utils.addCSS(css, "echo-button-test");
		button.update({
			"label": "SecondLabel",
			"disabled": true,
			"icon": "ui-test-icon"
		});
		QUnit.ok(!$(target).html().match(/FirstLabel/) && $(target).html().match(/SecondLabel/),
			"Checking that label is changed after update() method");
		QUnit.ok(element.attr('disabled'),
			"Checking that button is disabled after update() method");
		QUnit.ok($(target).html().match(/icon/) && $(target).html().match(/ui-test-icon/),
			"Checking that icon CSS class is added to element after update() method");
		
		button.label = "ThirdLabel";
		button.render();
		QUnit.ok(!$(target).html().match(/SecondLabel/) && $(target).html().match(/ThirdLabel/),
			"Checking that label is changed after field updating and rerendering");
		button.disabled = false;
		button.render();
		QUnit.ok(!element.attr('disabled'),
			"Checking that button is enabled after field updating and rerendering");
		button.icon = false;
		button.render();
		QUnit.ok(!$(target).html().match(/icon/) && !$(target).html().match(/ui-test-icon/),
			"Checking that icon CSS class is not added to element after field updating and rerendering");
		
		$(target).empty();
		var element = $('<button disabled="disabled">ClickMe</button>').appendTo(target);
		button = new Echo.Button(element);
		QUnit.ok($(target).html().match(/ClickMe/),
			 "Checking that label value is taken from the element");
		QUnit.ok(element.attr('disabled'),
			"Checking that disabled value is taken from the element");
	}
};

})(jQuery);
