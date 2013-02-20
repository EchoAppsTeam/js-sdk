(function($) {

var suite = Echo.Tests.Unit.Dropdown = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Dropdown",
	"functions": ["setTitle", "refresh", "update", "destroy", "updateEntries"]
};

suite.prototype.tests = {};

var testIconUrl = "images/loading.gif";
var dropdownParams = {
	"title": "TestTitle",
	"icon": Echo.Loader.getURL(testIconUrl, false),
	"entries": [{
		"title": "entry1",
		"handler": function() {
			Echo.Tests.Unit.Dropdown._testHandler1 = true;
		},
		"icon": Echo.Loader.getURL(testIconUrl, false),
		"entries": [{
			"title": "entry1.1",
			"handler": function() {
				Echo.Tests.Unit.Dropdown._testHandler11 = true;
			}
		}, {
			"title": "entry2.2",
			"handler": function() {
				Echo.Tests.Unit.Dropdown._testHandler12 = true;
			}
		}]
	}, {
		"title": "entry2",
		"handler": function() {
			Echo.Tests.Unit.Dropdown._testHandler2 = true;
		},
		"icon": undefined
	}]
};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true
	},
	"check": function() {
		
		var target = document.getElementById("qunit-fixture");
		$(target).empty();

		var element = $("<div>").appendTo(target);
		dropdownParams.target = element;
		var dropdown = new Echo.GUI.Dropdown(dropdownParams);

		var dropdownTitle = element.find(".dropdown-toggle").html();
		var dropdownEntries = element.find("li.dropdown > ul.dropdown-menu > li > a");
		var firstEntry = $(dropdownEntries[0]);
		var secondEntry = $(dropdownEntries[1]);
		var nestedEntries = firstEntry.parent().find("ul li a");

		QUnit.ok(dropdownTitle === dropdownParams.title, "Check that title is displayed");

		QUnit.ok(dropdownEntries.length === dropdownParams.entries.length, "Check entries count");

		QUnit.ok(firstEntry.html() === dropdownParams.entries[0].title
				&& secondEntry.html() === dropdownParams.entries[1].title, "Check entries title");

		QUnit.ok(nestedEntries.length === dropdownParams.entries[0].entries.length, "Check nested entries count");

		QUnit.ok(element.find("ul > li.dropdown > a").css("background-image").indexOf(testIconUrl) >= 0, "Check that dropdown icon added");

		$(nestedEntries[0]).click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler11 && !Echo.Tests.Unit.Dropdown._testHandler22, "Check first nested entry handler");

		$(nestedEntries[1]).click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler11 && Echo.Tests.Unit.Dropdown._testHandler12, "Check second nested entry handler");

		QUnit.ok($(nestedEntries[0]).html() === dropdownParams.entries[0].entries[0].title
				&& $(nestedEntries[1]).html() === dropdownParams.entries[0].entries[1].title, "Check nested entries title");

		QUnit.ok(firstEntry.css("background-image").indexOf(testIconUrl) >= 0, "Check that entry icon added");

		firstEntry.click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler1 && !Echo.Tests.Unit.Dropdown._testHandler2, "Check first entry handler");

		secondEntry.click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler1 && Echo.Tests.Unit.Dropdown._testHandler2, "Check second entry handler");

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
		QUnit.ok(isEntriesUpdated , "Check updateEntries() method");

		dropdown.destroy();
		QUnit.ok(element.is(":empty"), "Check destroy() method");

		$(target).empty();
		QUnit.start();
		
	}
};

})(Echo.jQuery);
