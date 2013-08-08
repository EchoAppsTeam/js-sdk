(function(jQuery) {
"use strict";

var $ = jQuery;

Echo.Tests.Utils = {};

QUnit.done(function() {
	Echo.Tests.server.restore();
});

Echo.Tests.Utils.log = function() {
	Echo.Tests.logs.push(arguments);
};

Echo.Tests.Utils.initServer = function() {
	// We use XDomainRequest for MSIE in Standards mode but sinon.js can't fake it up.
	// As we use sinon fake server that replaces real XMLHttpRequest object,
	// let's consider that we always support CORS to trick jQuery
	if (Echo.Tests.browser.msie) {
		// TODO: uncomment when every cross-domain request is mocked
		// $.support.cors = true;
	}

	Echo.Tests.server = sinon.fakeServer.create();
	Echo.Tests.server.autoRespond = true;

	$.each(_URLMocks, function(k, mock) {
		Echo.Tests.server.respondWith(mock.url, mock.response);
	});

	sinon.FakeXMLHttpRequest.useFilters = true;
	sinon.FakeXMLHttpRequest.addFilter(function() {
		var url = arguments[1];
		var fake = false;
		// check if the url is in the mocked list
		$.each(_URLMocks, function(name, mock) {
			var matches = url.match(mock.url);
			if (!matches) return;
			// not every canvas is mocked, some are real
			if (name === "canvases" && !Echo.Tests.Fixtures.canvases[matches[1]]) return;
			fake = true;
			return false;
		});
		Echo.Utils.log({
			"component": "Tests",
			"message": "[" + (fake && "FAKE" || "REAL") + " request] " + url
		});
		return !fake;
	});
};

var _URLMocks = {
	// group of URLs http://s3.amazonaws.com/echo-canvases/<canvas-id>
	"canvases": {
		// TODO: (?) mock URLs depending on mode (now it mocks _only_ dev mode)
		"url": new RegExp("^" + Echo.Loader.config.storageURL.dev + "(.*?)\\?"),
		"response": function(request, canvasId) {
			request.respond(
				200,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				JSON.stringify(Echo.Tests.Fixtures.canvases[canvasId])
			);
		}
	},
	// single URL http://api.echoenabled.com/v1/users/whoami?...
	"whoami": {
		// TODO: api.echoenabled.com should go from some variable
		"url": /^http:\/\/api\.echoenabled\.com\/v1\/users\/whoami\?/,
		"response": function(request) {
			request.respond(
				200,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				JSON.stringify(Echo.Tests.Fixtures.whoami[Echo.Tests.current.user.status])
			);
		}
	}
};

})(Echo.jQuery);
