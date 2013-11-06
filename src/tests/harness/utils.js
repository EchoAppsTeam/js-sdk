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

// let's save original function to be able to use it while it's mocked
var storeCanvasConfig = Echo.Loader._storeCanvasConfig;
// mocks for canvases are absolutely the same as in production
// so we have to mock _storeCanvasConfig method to save canvases
// to fixtures but not to real data object
sinon.stub(Echo.Loader, "_storeCanvasConfig", function(id, data) {
	if (Echo.Tests.Utils.isServerMocked()) {
		Echo.Tests.Fixtures.canvases[id] = data;
	} else {
		storeCanvasConfig(id, data);
	}
});
// once we loaded all the fixtures we restore _storeCanvasConfig
QUnit.begin(function() {
	Echo.Loader._storeCanvasConfig.restore();
});

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
		!fake && Echo.Utils.log({
			"component": "Tests",
			"message": "[REAL request] " + url
		});
		return !fake;
	});

	var ajax = $.ajax;
	sinon.stub($, "ajax", function(options) {
		var self = this;
		var matches = options.url && options.url.match(_URLMocks.canvases.url);
		if (matches && (Echo.Tests.Fixtures.canvases[matches[1]] || /nonexistent/.test(matches[1]))) {
			var req = ajax.call(this, {"beforeSend": function() { return false; }});
			// asynchronously respond to request
			setTimeout(function() {
				storeCanvasConfig(matches[1], Echo.Tests.Fixtures.canvases[matches[1]]);
				if (Echo.Tests.Fixtures.canvases[matches[1]]) {
					options.success.call(self);
				} else {
					options.error.call(self);
				}
			}, 10);
			return req;
		}
		return ajax.apply(this, arguments);
	});

	// FIXME: we should have used usual urlMocks filtering like "whoami" and other
	// but we can't because "logout" endpoint supports only JSONP but sinon can't
	// mock it. So we have to replace the whole functions
	sinon.stub(Echo.UserSession, "_logoutRequest", function(data, callback) {
		Echo.Tests.Utils.actualizeTestUser({"status": "anonymous"}, function() {
			sinon.stub(Echo.UserSession, "_onInit", function(callback) {
				callback();
			});
			callback("{\"result\": \"success\"}");
			Echo.UserSession._onInit.restore();
		});
	});
};

Echo.Tests.Utils.actualizeTestUser = function(config, callback) {
	var isMocked = Echo.Tests.Utils.isServerMocked();
	Echo.UserSession({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {
			var user = this;
			var isLogged = user.is("logged");
			if (isMocked) {
				Echo.Tests.current.user = config;
			}
			if (isLogged && config.status === "anonymous") {
				if (isMocked) {
					user._init(callback);
				} else {
					user.logout(callback);
				}
			} else if (!isLogged && config.status === "logged") {
				if (isMocked) {
					user._init(callback);
				} else {
					$.get("http://echosandbox.com/js-sdk/auth/", {
						"action": "login",
						"channel": Backplane.getChannelID(),
						"identityUrl": "http://somedomain.com/users/fake_user"
					}, function() {
						Echo.UserSession._onInit(callback);
						Backplane.expectMessages("identity/ack");
					}, "jsonp");
				}
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
		"url": new RegExp(Echo.Loader.config.storageURL.dev + "(.*?)(?:\\?|$)"),
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
		"url": new RegExp("{%=baseURLs.api.streamserver%}/v1/count\\?q=(.*?)&"),
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
		"url": new RegExp("{%=baseURLs.api.streamserver%}/v1/search\\?q=(.*?)&"),
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
		"url": new RegExp("{%=baseURLs.api.streamserver%}/v1/users/whoami\\?"),
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
