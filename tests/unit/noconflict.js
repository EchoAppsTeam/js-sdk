(function($) {

	var suite = Echo.Tests.Unit.NoConflict = function() {};

	suite.prototype.info = {
		"suiteName": "Echo jQuery"
	};

	suite.prototype.tests = {};

	suite.prototype.tests.compatibilityTest = {
		"config": {
			"async": true,
			"testTimeout": 20000 // 20 secs
		},
		"check": function() {
			var testVersion = "1.4.1";

			QUnit.ok(!(window.$ || window.jQuery),
				"Checking if jQuery is not defined in the window namespace");

			Echo.Loader.download({
				"scripts" : [{"url": "https://ajax.googleapis.com/ajax/libs/jquery/" + testVersion + "/jquery.min.js"}],
				"callback": function () {
					QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Checking if Echo jQuery lib wasn't overridden after another jQuery version inclusion into the page");

					Echo.Loader.download({
						"scripts": [{"url": "../third-party/jquery.pack.js"}],
						"callback": function () {
							QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Checking if the native jQuery lib on the page is not overridden after Echo jQuery inclusion");
							window.jQuery.noConflict(true);
							QUnit.start();
						}
					});
				}
			});
		}
	};

})(Echo.jQuery);
