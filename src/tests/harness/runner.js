(function(jQuery) {
"use strict";

var $ = jQuery;

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {};
if (!Echo.Tests.Fixtures) Echo.Tests.Fixtures = {};

// tests will run in the order they were added
QUnit.config.reorder = false;

// don't execute tests automatically, we will do it manually later
QUnit.config.autostart = false;

Echo.Tests.init = function(config) {
	$(function() {
		$("#qunit-header").html(config.title);

		config.backplane && Backplane.init(config.backplane);

		//// hack for tests of Loader
		//window.onerror = function( message, file, line ) {
		//	return /non-existing/.test(file);
		//};

		Echo.Loader.download([{"url": "tests/qunit/qunit.css"}], function() {
			QUnit.start();
		});
	});
};

Echo.Tests.log = function() {
	if (typeof Echo.Variables.testLogs === "undefined") {
		Echo.Variables.testLogs = [];
	}
	Echo.Variables.testLogs.push(arguments);
};

})(Echo.jQuery);
