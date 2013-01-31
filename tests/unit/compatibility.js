(function($) {

	var suite = Echo.Tests.Unit.compatibilityTest = function() {};

	suite.prototype.info = {
		"suiteName": "Compatibility tests"
	};

	suite.prototype.tests = {};

	suite.prototype.tests.JqueryNoConflict = {
		"config": {
			"async": true,
			"testTimeout": 20000 // 20 secs
		},
		"check": function() {
			var testVersion = "1.4.1";

			QUnit.ok(!(window.$ || window.jQuery),
				"Checking if jQuery is not defined in the window namespace");

			Echo.Loader.download([{"url": "https://ajax.googleapis.com/ajax/libs/jquery/" + testVersion + "/jquery.min.js"}], function () {
				QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Checking if Echo jQuery lib wasn't overridden after another jQuery version inclusion into the page");
				Echo.Loader.download([{"url": "third-party/jquery.pack.js"}], function () {
					QUnit.ok(window.$.fn.jquery === testVersion && $.fn.jquery !== window.$.fn.jquery, "Checking if the native jQuery lib on the page is not overridden after Echo jQuery inclusion");
					window.jQuery.noConflict(true);
					QUnit.start();
				});
			});
		}
	};

	suite.prototype.tests.V2V3CompatibilityCheck = {
		"config": {
			"async": true,
			"testTimeout": 20000 // 20 secs
		},
		"check": function() {
			var self = this;
			var ids = {
				"v2": "echo-apps-v2",
				"v3": "echo-apps-v3"
			};

			var Stack = function(callback) {
				var counter = 0;
				var state = {};
				this.init = function(id) {
					if( !state.hasOwnProperty(id) ) {
						state[id] = false;
						counter++;
					}
				};
				this.done = function(id) {
					if (state[id] === false) {
						state[id] = true;
						--counter == 0 && callback();
					}
				}
			};

			Echo.Variables.V2V3Test = new Stack(function() {
				var res = !$.map(window[ids.v3].Echo, function(val, key) {
					return window[ids.v2].Echo[key];
				}).length;

				QUnit.ok(res, "Check if v3 Echo keys  don't match with v2 Echo keys");
				QUnit.start();
			});

			$.each(ids, function(key, val) {
				self.config.target.append('<iframe src="unit/compatibility/' + key + '.html" name="' + val + '"></iframe>');
			});
		}
	};

	suite.prototype.tests.YepnopeNoConflict = {
		"config": {
			"async": true,
			"testTimeout": 20000 // 20 secs
		},
		"check": function() {
			var origYepnope = window.yepnope;
			
			QUnit.ok(!!Echo.yepnope, "Check if Echo's yepnope is loaded");
			
			Echo.Loader.download([{"url": "https://cdnjs.cloudflare.com/ajax/libs/yepnope/1.5.4/yepnope.min.js"}], function () {
				var globalYepnope = window.yepnope;
				
				QUnit.ok(!!window.yepnope, "Check if global yepnope has been loaded");
				
				QUnit.ok(Echo.yepnope !== window.yepnope,
					"Check if global yepnope and Echo's yepnope are different objects");
				
				Echo.Loader.download([{"url": "loader.js"}], function () {
					
					QUnit.ok(globalYepnope === window.yepnope, 
						"Check if global yepnope is not overwritten after Echo's yepnope has been loaded");
					
					window.yepnope = origYepnope;
					QUnit.start();
				});
			});
		}
	};

})(Echo.jQuery);
