(function($) {

var suite = Echo.Tests.Unit.Tabs = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.tabs",
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
		
		var check = function() {
			var target = document.getElementById("qunit-fixture");
			$(target).empty();

			var element = $("<div>").appendTo(target);
			tabsParams.target = element;
			Echo.GUI.tabs(tabsParams);
			var echoTabs = element.data("echoTabs");

			var testTabs = [{
				"id": "tab1",
				"label": "Test tab1"
			}, {
				"id": "tab2",
				"label": "Test tab2"
			}];
			for (var i in testTabs) {
				echoTabs.add(testTabs[i], "panel");
			}

			var tab1 = $($("a:first", element)[0]);
			var tab2 = $($("a:last", element)[0]);
			QUnit.ok(tab1 && tab2, "Check add() method");

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

			echoTabs.update(testTabs[1].id, {"label": "New label", "class": "echo-hide"});
			QUnit.ok(tab2.html() === "New label"
					&& tab2.hasClass("echo-hide"), "Check update() method");

			$(target).empty();
			QUnit.start();
		};
		
		Echo.Loader.download([{
			"url": "third-party/bootstrap.pack.js"
		}], check);
	}
};

})(Echo.jQuery);
