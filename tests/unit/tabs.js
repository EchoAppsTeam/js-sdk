(function($) {

var suite = Echo.Tests.Unit.Tabs = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Tabs",
	"functions": []
};

suite.prototype.tests = {};

var tabsParams = {
	"show": function(t) {
		Echo.Tests.Unit.Tabs._showHandler = true;
	}
};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true
	},
	"check": function() {
		
		var target = document.getElementById("qunit-fixture");
		$(target).empty();

		var element = $("<div>").appendTo(target);
		tabsParams.target = element;
		var echoTabs = new Echo.GUI.Tabs(tabsParams);

		QUnit.ok($(".tab-content", element).length, "Check that panels container created");

		var testTabs = [{
			"id": "tab1",
			"label": "Test tab1",
			"panel": $("<div><b>Tab1 content</b></div>")
		}, {
			"id": "tab2",
			"label": "Test tab2",
			"panel": $("<div><i>Tab2 content</i></div>")
		}];
		for (var i in testTabs) {
			echoTabs.add(testTabs[i], testTabs[i].panel);
		}

		var tab1 = $("a:first", element);
		var tab2 = $("a:last", element);
		QUnit.ok(tab1.length && tab2.length, "Check add() method");

		var panel1 = echoTabs.getPanels().find("div[id='" + testTabs[0]['id'] + "']");
		var panel2 = echoTabs.getPanels().find("div[id='" + testTabs[1]['id'] + "']");
		this.jqueryObjectsEqual($(panel1.html()), $(testTabs[0].panel.html()), "Check than first panel has been added properly");
		this.jqueryObjectsEqual($(panel2.html()), $(testTabs[1].panel.html()), "Check than second panel has been added properly");

		QUnit.ok(tab1.html() === testTabs[0].label
				&& tab2.html() === testTabs[1].label, "Check that tab labels are displayed");

		QUnit.ok(echoTabs.getPanels().length, "Check getPanels() method");

		echoTabs.disable(testTabs[0].id);
		QUnit.ok(tab1.hasClass("disabled")
				&& !tab2.hasClass("disabled"), "Check disable() method");

		echoTabs.enable(testTabs[0].id);
		QUnit.ok(!tab1.hasClass("disabled")
				&& !tab2.hasClass("disabled"), "Check enable() method");

		echoTabs.remove(testTabs[0].id);
		var tabs = $("a", element);
		QUnit.ok(tabs.length === 1, "Check remove() method");

		QUnit.ok(!echoTabs.get(testTabs[0].id).length
				&& echoTabs.get(testTabs[1].id).length, "Check get() method");

		QUnit.ok(!echoTabs.has(testTabs[0].id)
				&& echoTabs.has(testTabs[1].id), "Check has() method");

		echoTabs.show(testTabs[1].id);
		QUnit.ok(tab2.parent().hasClass("active"), "Check show() method");

		QUnit.ok(Echo.Tests.Unit.Tabs._showHandler, "Check 'show' event handler");

		echoTabs.update(testTabs[1].id, {"label": "New label", "class": "echo-hide", "content": "New content"});
		QUnit.ok(tab2.html() === "New label"
				&& tab2.hasClass("echo-hide")
				&& echoTabs.getPanels().find("div[id='" + testTabs[1].id  + "']").html() === "New content", "Check update() method");

		$(target).empty();
		QUnit.start();
		
	}
};

})(Echo.jQuery);
