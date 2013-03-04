(function(jQuery) {
"use strict";

var $ = jQuery;

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {"Unit": {}};

// No reordering tests, they will run one by one
QUnit.config.reorder = false;

Echo.Tests.init = function(config) {
	$(function() {
		$("#qunit-header").html(config.title);

		config.backplane && Backplane.init(config.backplane);

		// hack for tests of Loader
		window.onerror = function( message, file, line ) {
			return /non-existing/.test(file);
		};

		Echo.Loader.download([{"url": "tests/qunit/qunit.css"}], function() {
			Echo.Tests.runTests();
		});
	});
};

Echo.Tests.runTests = function() {
	$.each(this.Unit, function(name, suiteClass) {
		$.extend(suiteClass.prototype, new Echo.Tests.Suite());
		suiteClass.prototype.tests = suiteClass.prototype.tests || {};
		var suite = new suiteClass();
		var normalizedName = suite.info.suiteName || suite.normalizeName(name, true);
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

(function(){
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
