(function($) {

var suite = Echo.Tests.Unit.Dropdown = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Dropdown",
	"functions": []
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
		
		var check = function() {
			var target = document.getElementById("qunit-fixture");
			$(target).empty();

			var element = $("<div>").appendTo(target);
			dropdownParams.target = element;
			Echo.GUI.Dropdown(dropdownParams);

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

			Echo.GUI.Dropdown("setTitle", {"target": element, "title": "newTitle"});
			dropdownTitle = element.find(".dropdown-toggle").html();
			QUnit.ok(dropdownTitle === "newTitle", "Check that title is changed after setTitle() method called");

			$(target).empty();
			QUnit.start();
		};
		
		Echo.Loader.download([{
			"url": "gui.pack.js"
		}], check);
	}
};

})(Echo.jQuery);
