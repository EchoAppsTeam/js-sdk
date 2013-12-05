Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/gui/dropdown"
	], function($, GUIDropdown) {

	"use strict";

	Echo.Tests.module("Echo.GUI.Dropdown", {
		"meta": {
			"className": "Echo.GUI.Dropdown",
			"functions": ["setTitle", "refresh", "update", "destroy", "updateEntries"]
		}
	});

	Echo.Tests.test("common workflow", function() {
		var target = $("#qunit-fixture");
		var element = $("<div>").appendTo(target);
		var testIconUrl = "images/loading.gif";
		var dropdownParams = {
			"title": "TestTitle",
			"target": element,
			"icon": Echo.Loader.getURL(testIconUrl, false),
			"entries": [{
				"title": "entry1",
				"handler": sinon.spy(),
				"icon": Echo.Loader.getURL(testIconUrl, false),
				"entries": [{
					"title": "entry1.1",
					"handler": sinon.spy()
				}, {
					"title": "entry2.2",
					"handler": sinon.spy()
				}]
			}, {
				"title": "entry2",
				"handler": sinon.spy(),
				"icon": undefined
			}]
		};

		var dropdown = new GUIDropdown(dropdownParams);

		var dropdownTitle = element.find(".dropdown-toggle").html();
		var dropdownEntries = element.find("li.dropdown > ul.dropdown-menu > li > a");
		var firstEntry = $(dropdownEntries[0]);
		var secondEntry = $(dropdownEntries[1]);
		var nestedEntries = firstEntry.parent().find("ul li a");
		var entry1 = dropdownParams.entries[0];
		var entry2 = dropdownParams.entries[1];
		var entry11 = dropdownParams.entries[0].entries[0];
		var entry12 = dropdownParams.entries[0].entries[1];

		QUnit.equal(dropdownTitle, dropdownParams.title, "Check that title is displayed");

		QUnit.equal(dropdownEntries.length, dropdownParams.entries.length, "Check entries count");

		QUnit.ok(firstEntry.html() === entry1.title
			&& secondEntry.html() === entry2.title, "Check entries title");

		QUnit.ok(nestedEntries.length === entry1.entries.length, "Check nested entries count");

		QUnit.ok(element.find("ul > li.dropdown > a").css("background-image").indexOf(testIconUrl) >= 0, "Check that dropdown icon added");

		$(nestedEntries[0]).click();
		QUnit.ok(entry11.handler.calledOnce && !entry12.handler.called, "Check first nested entry handler");

		$(nestedEntries[1]).click();
		QUnit.ok(!entry11.handler.calledTwice && entry12.handler.calledOnce, "Check second nested entry handler");

		QUnit.ok($(nestedEntries[0]).html() === entry11.title
			&& $(nestedEntries[1]).html() === entry12.title, "Check nested entries title");

		QUnit.ok(firstEntry.css("background-image").indexOf(testIconUrl) >= 0, "Check that entry icon added");

		firstEntry.click();
		QUnit.ok(entry1.handler.calledOnce && !entry2.handler.called, "Check first entry handler");

		secondEntry.click();
		QUnit.ok(!entry1.handler.calledTwice && entry2.handler.calledOnce, "Check second entry handler");

		QUnit.ok(!entry11.handler.calledTwice && !entry12.handler.calledTwice, "Check that nested handlers were not called");

		dropdown.setTitle("newTitle");
		dropdownTitle = element.find(".dropdown-toggle").html();
		QUnit.ok(dropdownTitle === "newTitle", "Check that title is changed after setTitle() method called");

		$("a.dropdown-toggle", element).html("Some title");
		dropdown.refresh();
		QUnit.ok($("a.dropdown-toggle", element).html() === dropdownParams.title, "Check refresh() method");

		dropdown.config.set("extraClass", "upd-extra-class");
		dropdown.config.set("title", "upd-title");
		dropdown.config.set("entries", [{"title": "upd-title1"}, {"title": "upd-title2"}]);
		dropdown.refresh();
		QUnit.ok($(".dropdown-toggle", element).html() === "upd-title"
			&& $(".upd-extra-class", element).length
			&& $(".echo-clickable:first", element).html() === "upd-title1"
			&& $(".echo-clickable:last", element).html() === "upd-title2", "Check update() method");

		var updatedEntries = [{
			"title": "Updated entry 1"
		}, {
			"title": "Updated entry 2"
		}, {
			"title": "Updated entry 3"
		}];
		dropdown.updateEntries(updatedEntries);
		var entries = element.find("li.dropdown > ul.dropdown-menu > li > a");

		var isEntriesUpdated = entries.length === updatedEntries.length;
		isEntriesUpdated && $.each(updatedEntries, function(entry, k) {
			if (entry.title !== $(entries[k]).html()) isEntriesUpdated = false;
		});
		QUnit.ok(isEntriesUpdated, "Check updateEntries() method");

		dropdown.destroy();
		QUnit.ok(element.is(":empty"), "Check destroy() method");
	});
	callback();
	});
});
