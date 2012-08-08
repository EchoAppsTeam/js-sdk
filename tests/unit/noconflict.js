(function($) {

	var suite = Echo.Tests.Unit.NoConflict = function() {};

	suite.prototype.info = {
//		"className": "Echo.NoConflict",
//		"functions": [
//		]
	};

	suite.prototype.tests = {};

	suite.prototype.tests.jqueryVersion = {
		"config": {
		"async": true,
		"testTimeout": 20000 // 20 secs
		},
		"check": function() {
			var testVersion = "1.4.1";

			QUnit.ok(!(window.$ || window.jQuery), "jQuery not defined in window namespace");

			Echo.Loader.download({
				"scripts" : [{"url": "https://ajax.googleapis.com/ajax/libs/jquery/" + testVersion + "/jquery.min.js"}],
				"callback": function () {
				QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Echo jQuery not overridden");

				Echo.Loader.download({
					"scripts": [{"url": "../third-party/jquery.pack.js"}],
					"callback": function () {
					QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Default jQuery at page not overridden");
					window.jQuery.noConflict(true);
					QUnit.start();
				}});
			}});
		}
	};

})(Echo.jQuery);
