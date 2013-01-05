(function($) {

var suite = Echo.Tests.Unit.Dropdown = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Dropdown",
	"functions": ["setTitle", "refresh", "update"]
};

suite.prototype.tests = {};

var testIconUrl = "images/loading.gif";
var dropdownParams = {
	"title": "TestTitle",
	"entries": [{
		"title": "entry1",
		"handler": function() {
			Echo.Tests.Unit.Dropdown._testHandler1 = true;
		},
		"icon": Echo.Loader.getURL(testIconUrl, false)
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
		var dropdownEntries =  element.find(".dropdown-menu li a");
		var firstEntry = $(element.find(".dropdown-menu li a")[0]);
		var secondEntry = $(element.find(".dropdown-menu li a")[1]);

		QUnit.ok(dropdownTitle === dropdownParams.title, "Check that title is displayed");

		QUnit.ok(dropdownEntries.length === dropdownParams.entries.length, "Check entries count");

		QUnit.ok(firstEntry.html() === dropdownParams.entries[0].title
				&& secondEntry.html() === dropdownParams.entries[1].title, "Check entries title");

		QUnit.ok(firstEntry.css("background-image").indexOf(testIconUrl) >= 0, "Check that icon added");

		firstEntry.click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler1 && !Echo.Tests.Unit.Dropdown._testHandler2, "Check first entry handler");

		secondEntry.click();
		QUnit.ok(Echo.Tests.Unit.Dropdown._testHandler1 && Echo.Tests.Unit.Dropdown._testHandler2, "Check second entry handler");

		dropdown.setTitle("newTitle");
		dropdownTitle = element.find(".dropdown-toggle").html();
		QUnit.ok(dropdownTitle === "newTitle", "Check that title is changed after setTitle() method called");

		$("a.dropdown-toggle", element).html("Some title");
		dropdown.refresh();
		QUnit.ok($("a.dropdown-toggle", element).html() === "newTitle", "Check refresh() method");

		dropdown.update({
				"extraClass": "upd-extra-class",
				"title": "upd-title",
				"entries": [{"title": "upd-title1"}, {"title": "upd-title2"}]
			});
		QUnit.ok($(".dropdown-toggle", element).html() === "upd-title"
				&& $(".upd-extra-class", element).length
				&& $(".echo-clickable:first", element).html() === "upd-title1"
				&& $(".echo-clickable:last", element).html() === "upd-title2", "Check update() method");

		$(target).empty();
		QUnit.start();
		
	}
};

})(Echo.jQuery);
