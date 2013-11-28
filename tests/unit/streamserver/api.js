Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"echo/api",
	"echo/utils",
	"echo/events",
	"echo/streamserver/api",
	"echo/user-session"
], function($, API, Utils, Events, StreamServerAPI, UserSession) {

"use strict";

var suite = Echo.Tests.Unit.StreamServerAPI = function() {};

suite.prototype.info = {
	"className": "Echo.StreamServer.API",
	"suiteName": "StreamServer.API",
	"functions": [
		"Request._AS2KVL",
		"Request._changeLiveUpdatesTimeout",
		"Request._search",
		"Request._submit",
		"Request._count",
		"Request._mux",
		"Request.abort",
		"Request.send",
		"request",
		"Polling.init",
		"Polling.getRequestObject",
		"Polling.stop",
		"Polling.start",
		//"Polling.on",
		"WebSockets.init",
		"WebSockets.getRequestObject",
		"WebSockets.on",
		"WebSockets.start",
		"WebSockets.connected",
		"WebSockets.stop",
		"WebSockets.subscribe"
	]
};

suite.prototype.params = {
	"appkey": "echo.jssdk.tests.aboutecho.com",
	"q": "childrenof:http://example.com/sdk/test-target/" + Utils.getUniqueString() + " children:1"
};

suite.prototype.cases = {};

suite.prototype.cases.simpleSearchRequest = function(callback) {
	StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onOpen": function() {
			QUnit.ok(true, "Checking if the \"onOpen\" callback was executed before data sending");
		},
		"onData": function(data) {
			QUnit.ok(data && data.entries,
				"Checking if the \"onData\" callback was executed after the regular request.");
			callback();
		}
	}).send();
};

suite.prototype.cases.simpleMuxRequest = function(callback) {
	var params = $.extend(true, {}, this.params);
	params.requests = [{
		"id": "count",
		"method": "count",
		"q": params.q
	}, {
		"id": "search",
		"method": "search",
		"q": "wrong query"
	}];
	delete params.q;
	StreamServerAPI.request({
		"endpoint": "mux",
		"data": params,
		"onOpen": function() {
			QUnit.ok(true, "Checking if the \"onOpen\" callback was executed before data sending in case of using mux request");
		},
		"onData": function(data) {
			QUnit.ok(data.count && data.search, "Checking if the \"onData\" callback was executed after the regular mux request.");
			QUnit.strictEqual(data.search.result, "error", "Checking if the \"search\" respond with error.");
			callback();
		}
	}).send();
};

suite.prototype.cases.simpleWhoamiRequest = function(callback) {
	var user = UserSession({"appkey": "echo.jssdk.tests.aboutecho.com"});
	StreamServerAPI.request({
		"endpoint": "whoami",
		"apiBaseURL": "https:{%=baseURLs.api.streamserver%}/v1/users/",
		"data": {
			"appkey": user.config.get("appkey"),
			"sessionID": user.get("sessionID")
		},
		"onOpen": function() {
			QUnit.ok(true, "Checking if the \"onOpen\" callback was executed before data sending");
		},
		"onData": function(data) {
			QUnit.ok(data && data.result !== "error",
				"Checking if the \"onData\" callback was executed after the regular request.");
			callback();
		}
	}).send();
};

suite.prototype.cases.simpleUserUpdateRequest = function(callback) {
	var user = UserSession({"appkey": "echo.jssdk.tests.aboutecho.com"});
	var states = ["Untouched", "ModeratorApproved", "ModeratorBanned", "ModeratorDeleted"];
	var identityURL = "http://example.com/some_path/test-user/";
	var state = states[Math.floor(Math.random() * states.length)];
	var updateRequest = StreamServerAPI.request({
		"endpoint": "users/update",
		"apiBaseURL": "https:{%=baseURLs.api.streamserver%}/v1/users/",
		"data": {
			"content": {
				"field": "state",
				"value": state,
				"identityURL": identityURL,
				"username": "TestUserName"
			},
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"sessionID": user.get("sessionID")
		},
		"onData": function(response) {
			QUnit.ok(
				response && response.echo && response.echo.state === state
				&& response.poco && response.poco.entry && response.poco.entry.accounts
				&& response.poco.entry.accounts.length
				&& response.poco.entry.accounts[0].identityUrl === identityURL
				&& response.poco.entry.accounts[0].username === "TestUserName",
				"Checking if the \"onData\" callback executed after the update request"
			);
			callback();
		}
	});
	this.loginTestUser({"status": "logged"}, function(args) {
		updateRequest.send();
	});
};

suite.prototype.cases.skipInitialRequest = function(callback) {
	var skipped = true;
	var request = StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"skipInitialRequest": true,
		"onData": function(data, options) {
			skipped = false;
		},
		"liveUpdatesTimeout": 2,
		"liveUpdates": {
			"enabled": true,
			"onData": function() {
				QUnit.ok(skipped, "Check if the \"onData\" handler wasn't executed in the \"skipInitialRequest\" case");
				QUnit.strictEqual(request.requestType, "secondary", "Check if the request type switched to the secondary in case of using \"skipInitialRequest\"");
				request.liveUpdates.stop();
				callback();
			}
		}
	});
	request.send();
};

suite.prototype.cases.searchRequestWithError = function(callback) {
	StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend({}, this.params, {"q": "unknown:predicate"}),
		"onError": function(data) {
			QUnit.ok(data && data.result === "error",
				"Checking if the \"onError\" callback was executed when the search query was defined incorrectly.");
			callback();
		}
	}).send();
};

suite.prototype.cases.requestWithAbort = function(callback) {
	var req = StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onError": function(data) {
			QUnit.ok(data && data.result === "error" && data.errorCode === "connection_aborted",
				"Checking if the \"onError\" callback was executed when the request aborted");
		},
		"onClose": function() {
			QUnit.ok(true,
				"Checking if the \"onClose\" callback was executed when the request aborted");
			callback();
		}
	});
	req.send();
	req.abort();
};

suite.prototype.cases.checkLiveUpdate = function(callback) {
	var self = this;
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var target = this.params.q.replace(/^childrenof:(http:\/\/\S+).*$/, "$1");
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var countReq = StreamServerAPI.request({
		"endpoint": "count",
		"onData": function(response) {
			if (response && response.count) {
				QUnit.equal(1, response.count, "Checking if live updates mechanism by count works correctly after posting");
				countReq.abort();
				callback();
			}
		},
		"data": $.extend({}, params)
	});
	var submitReq = StreamServerAPI.request({
		"endpoint": "submit",
		"data": $.extend({}, params, {
			content: item,
			targetURL: target
		})
	});
	var liveUpdateReq = StreamServerAPI.request({
		"endpoint": "search",
		"onData": function(response) {
			submitReq.send();
		},
		"liveUpdatesTimeout": 2,
		"liveUpdates": {
			"enabled": true,
			"onData": function(response) {
				if (response && response.entries && response.entries.length) {
					QUnit.equal(response.entries[0].object.content, self.items.post.object.content,
						"Checking if the live update mechanism by search works correctly after posting");
					countReq.send({force: true});
					liveUpdateReq.abort();
				}
			}
		},
		"data": $.extend({}, params)
	});
	liveUpdateReq.send();
};

suite.prototype.cases.simpleLiveUpdatesRequest = function(callback) {
	var maxCounts = 4, currentCount = 0;
	var req = StreamServerAPI.request({
		"endpoint": "search",
		"data": this.params,
		"liveUpdates": {
			"enabled": true,
			"polling": {
				"timeout": 1
			},
			"onData": function(data) {
				if (maxCounts === ++currentCount) {
					QUnit.ok(data && data.entries,
						"Checking if the \"onData\" callback was executed after the live update request.");
					req.abort();
					callback();
				}
			}
		}
	});
	req.send();
};

suite.prototype.cases.backwardCompatibility = function(callback) {
	var req = StreamServerAPI.request({
		"endpoint": "search",
		"data": this.params,
		"liveUpdatesTimeout": 2,
		"recurring": true,
		"onData": function(response, extra) {
			if (extra.requestType === "secondary") {
				QUnit.ok(true, "Check if liveUpdates handlers are not provided then original will be used");
				req.abort();
				callback();
				return;
			}
			QUnit.ok(req.config.get("liveUpdates.enabled"), "Check that \"recurring\" config parameter mapped to the \"liveUpdates.enabled\"");
			QUnit.strictEqual(req.config.get("liveUpdates.polling.timeout"), 2, "Check that \"liveUpdatesTimeout\" mapped to the \"liveUpdates.polling.timeout\"");
			QUnit.ok("requestType" in extra, "Check that \"requestType\" provided as extra");
		}
	});
	req.send();
};

suite.prototype.cases.websockets = function(callback) {
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var q = params.q.replace(/\s+children:\d+$/, "") + "/11111"
	var target = q.replace(/^childrenof:(http:\/\/\S+).*$/, "$1");
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var req = StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend(params, {"q": q}),
		"liveUpdates": {
			"enabled": true,
			"transport": "websockets",
			"websockets": {
				"maxConnectRetries": 2,
				"serverPingInterval": 10
			},
			"onData": function(data) {
				QUnit.deepEqual([
					req.liveUpdates.requestObject.config.get("settings.maxConnectRetries"),
					req.liveUpdates.requestObject.config.get("settings.serverPingInterval")
				], [2, 10], "Check that config parameters for WS mapped");
				QUnit.strictEqual(req.liveUpdates.config.get("request.data.since"), data.nextSince, "Check that since parameter was updated (WS usage)");
				QUnit.ok(req.liveUpdates instanceof StreamServerAPI.WebSockets, "Check that liveUpdates switched to WS after its opened");
				Events.subscribe({
					"topic": "Echo.API.Transports.WebSockets.onClose",
					"once": true,
					"context": "live.echoenabled.com-v1-ws",
					"handler": callback
				});
				req.abort();
			}
		}
	});
	var submitReq = StreamServerAPI.request({
		"endpoint": "submit",
		"data": $.extend({}, params, {
			content: item,
			targetURL: target
		})
	});
	req.send().done(function() {
		Events.subscribe({
			"topic": "Echo.API.Transports.WebSockets.onOpen",
			"once": true,
			"context": "live.echoenabled.com-v1-ws",
			"handler": function() {
				submitReq.send();
			}
		});
		// Opening a socket does require some time so we first initiate polling and switch
		// to socket when it's initiated. But at this particular moment live updates must
		// use polling mechanism.
		QUnit.ok(req.liveUpdates instanceof StreamServerAPI.Polling, "Check that live updates instantiated with polling");
	});
};

suite.prototype.cases.webSocketSinceCase = function(callback) {
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var q = params.q.replace(/\s+children:\d+$/, "") + "/11111"
	var target = q.replace(/^childrenof:(http:\/\/\S+).*$/, "$1");
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var subscribe = StreamServerAPI.WebSockets.prototype.subscribe;
	StreamServerAPI.WebSockets.prototype.subscribe = function() {
		var self = this;
		setTimeout(function() {
			subscribe.call(self);
		}, 6000);
	};
	var request = StreamServerAPI.request({
		"endpoint": "search",
		"data": $.extend(params, {"q": q}),
		"liveUpdates": {
			"enabled": true,
			"transport": "websockets",
			"onData": function(data) {
				QUnit.ok(data, "Check that we recieve data through the WS protocol in case of since");
				QUnit.strictEqual(data.entries.length, 1, "Check that we recieve exactly one item through the WS protocol in case of since");
				StreamServerAPI.WebSockets.prototype.subscribe = subscribe;
				callback();
				request.abort();
			}
		}
	});
	var submit = StreamServerAPI.request({
		"endpoint": "submit",
		"data": $.extend({}, params, {
			content: item,
			targetURL: target
		})
	});
	request.send().done(function() {
		submit.send();
	});
};

suite.prototype.cases.multipleWebsocketRequests = function(callback) {
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var q = params.q.replace(/\s+children:\d+$/, "") + "/222"
	var target = q.replace(/^childrenof:(http:\/\/\S+).*$/, "$1");
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var requests = [], def = [];
	var getRequest = function(i) {
		return StreamServerAPI.request({
			"endpoint": "search",
			"data": $.extend(params, {"q": q}),
			"liveUpdates": {
				"enabled": true,
				"transport": "websockets",
				"onData": function() {
					def[i].resolve();
				},
				"onError": function() {
					def[i].resolve();
				}
			}
		});
	};
	var submit = StreamServerAPI.request({
		"endpoint": "submit",
		"data": $.extend({}, params, {
			content: item,
			targetURL: target
		})
	});
	// 21 is a euristic non documented number
	// The server allows to subscribe to no more than 20 subscriptions per connect.
	for (var i = 0; i < 21; i++) {
		(function(i) {
			def.push($.Deferred());
			requests.push(
				getRequest(i)
			);
		})(i);
	}
	var chained = function chain(i, r) {
		if (requests[i + 1]) {
			return chain(i + 1, r.pipe(function() {
				return requests[i + 1].send();
			}));
		}
		return r;
	}(0, requests[0].send());
	Events.subscribe({
		"topic": "Echo.API.Transports.WebSockets.onOpen",
		"context": "live.echoenabled.com-v1-ws",
		"once": true,
		"handler": function() {
			$.when(chained).done(function() {
				submit.send();
			});
		}
	});
	$.when.apply($, def).then(function() {
		var fallback = $.grep(requests, function(req) {
			return !req.liveUpdates.subscribed;
		});
		QUnit.strictEqual(fallback.length, 1, "Check that quota exceeded requests are fallbacks to the polling (WS cases)");
		Events.subscribe({
			"topic": "Echo.API.Transports.WebSockets.onClose",
			"once": true,
			"context": "live.echoenabled.com-v1-ws",
			"handler": function() {
				callback();
			}
		});
		$.map(requests, function(req) {
			req.abort();
		});
	});
};

suite.prototype.tests = {};

suite.prototype.tests.PublicInterfaceTests = {
	 "config": {
		 "async": true,
		 "testTimeout": 60000 // 60 secs
	},
	"check": function() {
		var sequentialTests = [
			"simpleSearchRequest",
			"simpleMuxRequest",
			"simpleWhoamiRequest",
			// FIXME: test fails with fake data
			//"simpleUserUpdateRequest"
			"skipInitialRequest",
			"requestWithAbort",
			"checkLiveUpdate",
			"simpleLiveUpdatesRequest",
			"backwardCompatibility"
		];
		// FIXME: when server will support XDomainRequest handling
		if (!API.Transports.XDomainRequest.available({
				"secure": window.location.prototcol === "https:",
				"method": "GET"
			})
		) {
			sequentialTests.push("searchRequestWithError");
		}
		// WebSocket specific tests
		if (API.Transports.WebSockets.available()) {
			sequentialTests = sequentialTests.concat(["websockets", "multipleWebsocketRequests", "webSocketSinceCase"]);
		}
		this.sequentialAsyncTests(sequentialTests, "cases");
	}
};

suite.prototype.tests.PrivateFunctionsTests = {
	"check": function() {
		var req = StreamServerAPI.request({
			"endpoint": "search",
			"data": $.extend({}, this.params)
		});
		QUnit.ok(req._isWaitingForData({"result": "error", "errorCode": "view_limit", "extra": {}}), "Checking if error responsed JSON contains waiting error code");
		QUnit.deepEqual(req._AS2KVL(this.items.post), {
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square",
			"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora.",
			"markers": undefined,
			"name": "TheNext_MrsBass",
			"source": {
				"name": "aboutecho.com",
				"uri": "http://aboutecho.com/"
			},
			"tags": undefined,
			"title": undefined,
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"verb": "post",
			"type": "http://activitystrea.ms/schema/1.0/comment",
			"itemURIPattern": undefined,
			"author": undefined
		}, "Check decompiler from AS to KVL");
		QUnit.deepEqual(req._AS2KVL(this.items.postWithMetadata), {
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square",
			"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora.",
			"markers": "marker1,marker2,marker3",
			"name": "TheNext_MrsBass",
			"source": {
				"name": "aboutecho.com",
				"uri": "http://aboutecho.com/"
			},
			"tags": "tag1,tag2,tag3",
			"title": undefined,
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"verb": "post",
			"type": "http://activitystrea.ms/schema/1.0/comment",
			"itemURIPattern": undefined,
			"author": undefined
		}, "Check decompiler from AS to KVL with post and metadata");
		QUnit.deepEqual(req._AS2KVL(this.items.postWithMetadata.slice(1)), [
		{
			"tags": "tag1,tag2,tag3",
			"verb": "tag",
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html"
		},
		{
			"tags": "marker1,marker2,marker3",
			"verb": "tag",
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html"
		}
		], "Check decompiler from AS to KVL with metadata only");
	}
};

// test data for checking AS -> KVL transformation

suite.prototype.items = {};

suite.prototype.items.post = {
	"id": "http://js-kit.com/activities/post/d71cb5f6239dfd7ebf66ac794125acee",
	"actor": {
		"objectTypes": [
			"http://activitystrea.ms/schema/1.0/person"
		],
		"id": "http://my.nymag.com/thenext_mrsbass",
		"title": "TheNext_MrsBass",
		"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square"
	},
	"object": {
		"objectTypes": [
			"http://activitystrea.ms/schema/1.0/comment"
		],
		"context": [{
			"uri": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"title": "Nora Ephron, 1941-2012"
		}],
		"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora."
	},
	"source": {
		"name": "aboutecho.com",
		"uri": "http://aboutecho.com/"
	},
	"provider": {
		"name": "echo",
		"uri": "http://aboutecho.com/",
		"icon": "http://cdn.js-kit.com/images/echo.png"
	},
	"verbs": [
		"http://activitystrea.ms/schema/1.0/post"
	],
	"targets": [{
		"id": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
		"conversationID": "http://nymag.com/ECHO/item/1340804828-788-121"
	}]
};

suite.prototype.items.postWithMetadata = [
	suite.prototype.items.post, {
		"id": "http://js-kit.com/activities/post/adshg5f6239dfd7ebf66ac794125acee",
		"actor": {
			"id": "http://my.nymag.com/thenext_mrsbass",
			"title": "TheNext_MrsBass",
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square"
		},
		"object": {
			"id": "http://nymag.com/ECHO/item/121231340804828-788-121",
			"objectTypes": [
				"http://activitystrea.ms/schema/1.0/tag"
			],
			"content": "tag1,tag2,tag3"
		},
		"verbs": [
			"http://activitystrea.ms/schema/1.0/tag"
		],
		"targets": [{
			"id": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"conversationID": "http://nymag.com/ECHO/item/1340804828-788-121"
		}]
	}, {
		"id": "http://js-kit.com/activities/post/adshg5f6239dfd7ebf66ac794125acee",
		"actor": {
			"id": "http://my.nymag.com/thenext_mrsbass",
			"title": "TheNext_MrsBass",
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square"
		},
		"object": {
			"id": "http://nymag.com/ECHO/item/121231340804828-788-121",
			"objectTypes": [
				"http://activitystrea.ms/schema/1.0/marker"
			],
			"content": "marker1,marker2,marker3"
		},
		"verbs": [
			"http://activitystrea.ms/schema/1.0/tag"
		],
		"targets": [{
			"id": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"conversationID": "http://nymag.com/ECHO/item/1340804828-788-121"
		}]
	}
];
callback();
});
});
