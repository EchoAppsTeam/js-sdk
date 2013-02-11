(function($) {

var suite = Echo.Tests.Unit.Tabs = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Tabs",
	"functions": ["getPanels", "disable", "enable", "remove", "add", "get", "has", "update", "show", "refresh", "destroy"]
};

suite.prototype.tests = {};

var tabsParams = {
	"entries": [{
			"id": "tab1",
			"label": "Test tab1",
			"extraClass": "extra-class",
			"panel": $("<div><b>Tab1 content</b></div>")
		}, {
			"id": "tab2",
			"label": "Test tab2",
			"disabled": true,
			"panel": $("<div><i>Tab2 content</i></div>")
	}],
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

		var tab1 = $("a:first", element);
		var tab2 = $("a:last", element);
		QUnit.ok(tab1.length && tab2.length, "Check add() method");

		var panel1 = echoTabs.getPanels().find("div[id='" + tabsParams.entries[0].id + "']");
		var panel2 = echoTabs.getPanels().find("div[id='" + tabsParams.entries[1].id + "']");
		this.jqueryObjectsEqual(
			$(panel1.html()),
			$(tabsParams.entries[0].panel.html()),
			"Check than first panel has been added properly"
		);
		this.jqueryObjectsEqual(
			$(panel2.html()),
			$(tabsParams.entries[1].panel.html()),
			"Check than second panel has been added properly"
		);

		QUnit.ok(
			tab1.html() === tabsParams.entries[0].label	&& tab2.html() === tabsParams.entries[1].label,
			"Check that tab labels are displayed"
		);

		QUnit.ok(
			tab1.hasClass("extra-class") && !tab2.hasClass("extra-class"),
			"Check that extraClass has been added"
		);

		QUnit.ok(echoTabs.getPanels().length, "Check getPanels() method");

		QUnit.ok(
			tab2.hasClass("disabled") && !tab1.hasClass("disabled"),
			"Check that disabled class has been added"
		);
		echoTabs.enable("tab2");

		echoTabs.disable(tabsParams.entries[0].id);
		QUnit.ok(
			tab1.hasClass("disabled") && !tab2.hasClass("disabled"),
			"Check disable() method"
		);

		echoTabs.enable(tabsParams.entries[0].id);
		QUnit.ok(
			!tab1.hasClass("disabled") && !tab2.hasClass("disabled"),
			"Check enable() method"
		);

		echoTabs.remove(tabsParams.entries[0].id);
		var tabs = $("a", element);
		QUnit.ok(tabs.length === 1, "Check remove() method");

		QUnit.ok(!echoTabs.get(
			tabsParams.entries[0].id).length && echoTabs.get(tabsParams.entries[1].id).length,
			"Check get() method"
		);

		QUnit.ok(
			!echoTabs.has(tabsParams.entries[0].id) && echoTabs.has(tabsParams.entries[1].id),
			"Check has() method"
		);

		echoTabs.show(tabsParams.entries[1].id);
		QUnit.ok(tab2.parent().hasClass("active"), "Check show() method");

		QUnit.ok(Echo.Tests.Unit.Tabs._showHandler, "Check 'show' event handler");

		echoTabs.update(tabsParams.entries[1].id, {"label": "New label", "extraClass": "echo-hide", "content": "New content"});
		QUnit.ok(
			tab2.html() === "New label" && tab2.hasClass("echo-hide") &&
				echoTabs.getPanels().find("div[id='" + tabsParams.entries[1].id  + "']").html() === "New content",
			"Check update() method"
		);

		$("a[data-item='tab2']", element).html("Some label");
		echoTabs.refresh();
		QUnit.ok(
			$("a[data-item='tab2']", element).html() === tabsParams.entries[1].label,
			"Check refresh() method"
		);

		echoTabs.destroy();
		QUnit.ok(element.is(":empty"), "Check destroy() method");

		$(target).empty();
		QUnit.start();
	}
};

})(Echo.jQuery);
