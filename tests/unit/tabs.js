Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"loadFrom![echo/gui.pack]echo/gui/tabs"
	], function($, GUITabs) {

	"use strict";

	Echo.Tests.module("Echo.GUI.Tabs", {
		"meta": {
			"className": "Echo.GUI.Tabs",
			"functions": ["getPanels", "disable", "enable", "remove", "add", "get", "has", "update", "show", "refresh", "destroy"]
		}
	});

	Echo.Tests.test("common workflow", function() {
		var target = $("#qunit-fixture");
		var element = $("<div>").appendTo(target);
		var entry1 = {
			"id": "tab1",
			"label": "Test tab1",
			"extraClass": "extra-class",
			"panel": $("<div><b>Tab1 content</b></div>")
		};
		var entry2 = {
			"id": "tab2",
			"label": "Test tab2",
			"disabled": true,
			"panel": $("<div><i>Tab2 content</i></div>"),
			"data": {
				"key": "value"
			}
		};
		var config = {
			"target": element,
			"entries": [entry1],
			"idPrefix": "test-tabs-",
			"classPrefix": "test-tabs-",
			"show": sinon.spy(),
			"shown": sinon.spy()
		};

		QUnit.expect(26);

		var tabs = new GUITabs(config);

		QUnit.ok($(".tab-content", element).length, "Check that panels container created");
		QUnit.ok($(".tab-content", element).hasClass(config.classPrefix + "panels"), "Check that panels container has appropriate class");
		QUnit.ok($(".nav-tabs", element).hasClass(config.classPrefix + "header"), "Check that tabs container has appropriate class");
		QUnit.equal($("a", element).length, 1, "Check that there is only one tab after instantiation");

		tabs.add(entry2);
		var tab1 = $("a:first", element);
		var tab2 = $("a:last", element);
		QUnit.equal($("a", element).length, 2, "Check that there are two tabs after adding one more");
		QUnit.equal(tab1.attr("href"), "#" + tabs._getTabFullId(entry1.id), "Check that 'idPrefix' configuration option works (tab)");

		var panel1 = tabs._getPanel(entry1.id);
		var panel2 = tabs._getPanel(entry2.id);
		QUnit.equal(panel1.attr("id"), tabs._getTabFullId(entry1.id), "Check that 'idPrefix' configuration option works (panel)");
		Echo.Tests.jqueryObjectsEqual(panel1, entry1.panel,	"Check that first panel has been added properly");
		Echo.Tests.jqueryObjectsEqual(panel2, entry2.panel, "Check that second panel has been added properly");

		QUnit.ok(
			tab1.html() === entry1.label && tab2.html() === entry2.label,
			"Check that tab labels are displayed"
		);

		QUnit.ok(
			tab1.parent().hasClass("extra-class") && !tab2.parent().hasClass("extra-class"),
			"Check that extraClass has been added"
		);

		QUnit.ok(!!tabs.getPanels().length, "Check getPanels() method");

		QUnit.ok(
			!tab1.parent().hasClass("disabled") && tab2.parent().hasClass("disabled"),
			"Check that disabled class has been added"
		);
		tabs.enable("tab2");

		tabs.disable(entry1.id);
		QUnit.ok(
			tab1.parent().hasClass("disabled") && !tab2.parent().hasClass("disabled"),
			"Check disable() method"
		);

		tabs.enable(entry1.id);
		QUnit.ok(
			!tab1.parent().hasClass("disabled") && !tab2.parent().hasClass("disabled"),
			"Check enable() method"
		);

		tabs.remove(entry1.id);
		QUnit.equal($("a", element).length, 1, "Check remove() method");

		QUnit.ok(
			!tabs.get(entry1.id).length && tabs.get(entry2.id).length,
			"Check get() method"
		);

		QUnit.ok(
			!tabs.has(entry1.id) && tabs.has(entry2.id),
			"Check has() method"
		);

		var counts = {
			"show": config.show.callCount,
			"shown": config.shown.callCount
		};
		tabs.show(entry2.id);
		QUnit.ok(tab2.parent().hasClass("active"), "Check show() method (tab)");
		QUnit.ok(panel2.hasClass("active"), "Check show() method (panel)");
		QUnit.equal(config.shown.callCount, config.show.callCount, "Check that 'shown' event was fired after 'show'");

		QUnit.equal(config.show.callCount, counts.show + 1, "Check that 'show' handler was called");
		QUnit.equal(config.shown.callCount, counts.shown + 1, "Check that 'shown' handler was called");

		tabs.update(entry2.id, {"label": "New label", "extraClass": "echo-hide", "content": "New content"});
		QUnit.ok(
			tab2.html() === "New label" && tab2.hasClass("echo-hide") &&
				tabs._getPanel(entry2.id).html() === "New content",
			"Check update() method"
		);

		$("a[data-item='tab2']", element).html("Some label");
		tabs.refresh();
		QUnit.ok(
			$("a[data-item='tab2']", element).html() === entry2.label,
			"Check refresh() method"
		);

		tabs.destroy();
		QUnit.ok(element.is(":empty"), "Check destroy() method");
	});
	callback();
	});
});
