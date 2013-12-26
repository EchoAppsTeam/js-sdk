(function($) {
"use strict";

Echo.Tests.Stats.root = {
	"object": Echo,
	"namespace": "Echo."
};

var ignoreList = [
	"Echo.Tests",
	"Echo.Variables",
	"Echo.jQuery",
	"Echo.require",
	"Echo.requirejs",
	"Echo.define"
];
// let's ignore some functions for now as we hardly can write test to check them
ignoreList.push("Echo.StreamServer.API.Polling.on", "Echo.StreamServer.API.Polling.connected", "Echo.isDebug");
// browser-specific ignore
var isNotLteIE7 = !(Echo.Tests.browser && Echo.Tests.browser.version <= 7);
$.map(["AJAX", "XDomainRequest", "JSONP"], function(transport) {
	if (!Echo.API.Transports[transport].available() || isNotLteIE7 && transport === "JSONP") {
		ignoreList.push("Echo.API.Transports." + transport);
	}
});

Echo.Tests.Stats.isValidForTesting = function(parentObject, prefix, name, value) {
	return $.inArray(prefix + name, ignoreList) < 0 &&
		parentObject.hasOwnProperty(name) &&
		typeof value !== "string" &&
		typeof value !== "undefined" &&
		!$.isArray(value) &&
		name !== "cache" &&
		name !== "definition" &&
		name !== "constructor" &&
		name !== "parent" &&
		// hide inherited properties
		!/(?:ClientWidget|Base)\.(?:isDefined|create)/.test(prefix + name);
};

QUnit.done(function() {
	// stop Backplane requests
	Backplane.initialized = false;
});

// collection of component initializers
var _initializers = {};

Echo.Tests.baseURL = "{%=baseURLs.tests%}/";

Echo.Tests.getComponentInitializer = function(name) {
	return _initializers[name];
};

Echo.Tests.defineComponentInitializer = function(name, initializer) {
	_initializers[name] = initializer;
};

})(Echo.jQuery);
