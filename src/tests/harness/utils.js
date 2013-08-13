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

// XXX: remove when the "cors" line in Echo.Tests.Utils.initServer is uncommented
if (Echo.Tests.browser.msie && +Echo.Tests.browser.version < 10) {
	QUnit.urlParams.noMockRequests = "true";
	// this is temporary hack, let it be
	setTimeout(function() {
		$("#qunit-urlconfig-noMockRequests").attr("disabled", true);
	}, 3000);
}

Echo.Tests.Utils.initServer = function() {
	if (!Echo.Tests.Utils.isServerMocked()) {
		Echo.Tests.server = {
			"restore": $.noop
		};
		return;
	}

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
			// XXX: these checks shouldn't be here because they all should be mocked
			// not every canvas is mocked, some are real
			if (name === "canvases" && !Echo.Tests.Fixtures.canvases[matches[1]] && !/nonexistent/.test(matches[1])) return;
			// not every count request is mocked, some are real
			if (name === "api/count" && !Echo.Tests.Fixtures.api.count[decodeURIComponent(matches[1])]) return;
			// not every search request is mocked, some are real
			if (name === "api/search" && !Echo.Tests.Fixtures.api.search[decodeURIComponent(matches[1])]) return;
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

Echo.Tests.Utils.actualizeTestUser = function(config, callback) {
	Echo.Tests.current.user = config;
	if (Echo.Tests.Utils.isServerMocked()) {
		callback();
		return;
	}
	var user = Echo.UserSession({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {
			var user = this;
			var isLogged = user.is("logged");
			if (isLogged && config.status === "anonymous") {
				user.logout(callback);
			} else if (!isLogged && config.status === "logged") {
				$.get("http://echosandbox.com/js-sdk/auth", {
					"action": "login",
					"channel": Backplane.getChannelID(),
					"identityUrl": "http://somedomain.com/users/fake_user"
				}, function() {
					Echo.UserSession._onInit(callback);
					Backplane.expectMessages("identity/ack");
				}, "jsonp");
			} else {
				callback();
			}
		}
	});
};

Echo.Tests.Utils.isServerMocked = function() {
	return QUnit.urlParams.noMockRequests !== "true";
};

var _URLMocks = {
	// group of URLs http://s3.amazonaws.com/echo-canvases/<canvas-id>
	"canvases": {
		// TODO: (?) mock URLs depending on mode (now it mocks _only_ dev mode)
		"url": new RegExp("^" + Echo.Loader.config.storageURL.dev + "(.*?)\\?"),
		"response": function(request, canvasId) {
			var status = 200, text = "";
			if (/nonexistent/.test(canvasId)) {
				status = 404;
			} else {
				text = JSON.stringify(Echo.Tests.Fixtures.canvases[canvasId]);
			}
			request.respond(
				status,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				text
			);
		}
	},
	// mocks for /v1/count API
	"api/count": {
		// TODO: api.echoenabled.com should go from some variable
		"url": /^http:\/\/api\.echoenabled\.com\/v1\/count\?q=(.*?)&/,
		"response": function(request, query) {
			request.respond(
				200,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				JSON.stringify(Echo.Tests.Fixtures.api.count[decodeURIComponent(query)])
			);
		}
	},
	// mocks for /v1/search API
	"api/search": {
		// TODO: api.echoenabled.com should go from some variable
		"url": /^http:\/\/api\.echoenabled\.com\/v1\/search\?.*?q=(.*?)&/,
		"response": function(request, query) {
			request.respond(
				200,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				JSON.stringify(Echo.Tests.Fixtures.api.search[decodeURIComponent(query)])
			);
		}
	},
	// single URL http://api.echoenabled.com/v1/users/whoami?...
	"api/whoami": {
		// TODO: api.echoenabled.com should go from some variable
		"url": /^http:\/\/api\.echoenabled\.com\/v1\/users\/whoami\?/,
		"response": function(request) {
			request.respond(
				200,
				{"Content-Type": "application/x-javascript; charset=\"utf-8\""},
				JSON.stringify(Echo.Tests.Fixtures.api.whoami[Echo.Tests.current.user.status])
			);
		}
	}
};

})(Echo.jQuery);
