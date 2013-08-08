(function(jQuery) {
"use strict";

var $ = jQuery;

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {"Unit": {}};

// tests will run in the order they were added
QUnit.config.reorder = false;

// don't execute tests automatically, we will do it manually later
QUnit.config.autostart = false;

// common storage for the information about the current test
// (at the moment only user configuration is stored here)
Echo.Tests.current = {};

// logs are pushed here by Echo.Tests.Utils.log function
// (they can be used by the saucelabs or developer/tester)
Echo.Tests.logs = [];

var _initialized = false;
Echo.Tests.init = function(config) {
	if (_initialized) return;
	_initialized = true;
	$(function() {
		$("#qunit-header").html(config.title);

		config.backplane && Backplane.init(config.backplane);

		Echo.Loader.download([{"url": "tests/qunit/qunit.css"}], function() {
			Echo.Tests.Utils.initServer();
			_runLegacyTests();
			QUnit.start();
		});
	});
};

// TODO: get rid of this function when all tests use new format
function _runLegacyTests() {
	$.each(Echo.Tests.Unit, function(name, suiteClass) {
		$.extend(suiteClass.prototype, new Echo.Tests.Suite());
		suiteClass.prototype.tests = suiteClass.prototype.tests || {};
		var suite = new suiteClass();
		var normalizedName = suite.info.suiteName || suite.normalizeName(name, true);
		// specially mark modules which use the old format of tests
		normalizedName = "[*] " + normalizedName;
		QUnit.module(normalizedName);
		// TODO: register single callback for all test framework
		// (now one callback for each suite so they are called all after each test is finished)
		QUnit.testDone(function(data) {
			if (data.module !== normalizedName) return;
			$.each(suite.info.functions, function(i, name) {
				Echo.Tests.Stats.markFunctionTested(suite.info.className + "." + name);
			});
		});
		suite.run();
	});
};

(function() {
	var ua = navigator.userAgent.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec(ua)
		|| /(webkit)[ \/]([\w.]+)/.exec( ua )
		|| /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)
		|| /(msie) ([\w.]+)/.exec(ua)
		|| ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		|| [];

	var matched = {
		browser: match[1] || "",
		version: match[2] || "0"
	};
	var browser = {};

	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if (browser.chrome) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}

	Echo.Tests.browser = browser;
})();

})(Echo.jQuery);
