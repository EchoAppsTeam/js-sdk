(function($) {

var suite = Echo.Tests.Unit.Button = function() {};

suite.prototype.info = {
	"className": "Echo.Button",
	"functions": ["set"]
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"check": function() {
		var target = document.getElementById("qunit-fixture");
		$(target).empty();
		
		var element = $("<button>").appendTo(target);
		var button = new Echo.Button(element, {
			"label": "MyButton"
		});
		QUnit.ok($(target).html().match(/MyButton/), "Checking that label is displayed");
		QUnit.ok(!element.attr('disabled'), "Checking that button is enabled by default");
		
		var css = ".ui-test-icon { background: url(//cdn.echoenabled.com/images/loading.gif); height: 16px; width: 16px; }";
		Echo.Utils.addCSS(css, "echo-button-test")
		button.set({
			"label": "NewButton",
			"disabled": true,
			"icon": "ui-test-icon"
		});
		QUnit.ok(!$(target).html().match(/MyButton/) && $(target).html().match(/NewButton/),
			"Checking that label is changed");
		QUnit.ok(element.attr('disabled'),
			"Checking that button is disabled");
		QUnit.ok($(target).html().match(/icon/) && $(target).html().match(/ui-test-icon/),
			"Checking that icon CSS class is added to element");
	}
};

})(jQuery);
