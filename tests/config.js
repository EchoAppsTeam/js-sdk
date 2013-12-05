(function($) {
"use strict";

Echo.Tests.Stats.root = {
	"object": Echo,
	"namespace": "Echo."
};

// browser-specific ignore
var ignoreList = [
	"Echo.Tests",
	"Echo.Variables",
	"Echo.jQuery",
	"Echo.require",
	"Echo.requirejs",
	"Echo.define",
];
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
		name !== "parent";
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
