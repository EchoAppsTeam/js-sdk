(function(jQuery) {
"use strict";

var $ = jQuery;

Echo.Tests.Stats.root = {
	"object": Echo,
	"namespace": "Echo."
};

Echo.Tests.Stats.isValidForTesting = function(parentObject, prefix, name, value) {
	var ignoreList = ["Echo.Tests", "Echo.Variables", "Echo.jQuery", "Echo.yepnope"];
	var isNotLteIE7 = !(Echo.Tests.browser && Echo.Tests.browser.version <= 7);
	// browser-specific ignore
	$.map(["AJAX", "XDomainRequest", "JSONP"], function(transport) {
		if (!Echo.API.Transports[transport].available() || isNotLteIE7 && transport === "JSONP") {
			ignoreList.push("Echo.API.Transports." + transport);
		}
	});
	return $.inArray(prefix + name, ignoreList) < 0 &&
		parentObject.hasOwnProperty(name) &&
		typeof value !== "string" &&
		typeof value !== "undefined" &&
		!$.isArray(value) &&
		name !== "cache" &&
		name !== "manifest" &&
		name !== "constructor" &&
		name !== "parent";
};

QUnit.done(function() {
	// stop Backplane requests
	Backplane.initialized = false;
});


// collection of component initializers
var _initializers = {};

Echo.Tests.baseURL = "http://echoappsteam.github.com/js-sdk/";

Echo.Tests.getComponentInitializer = function(name) {
	return _initializers[name];
};

Echo.Tests.defineComponentInitializer = function(name, initializer) {
	_initializers[name] = initializer;
};

})(Echo.jQuery);
