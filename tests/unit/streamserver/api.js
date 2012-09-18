(function($) {

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
		"Request.abort",
		"Request.send",
		"request"
	]
};

suite.prototype.params = {
	"appkey": "test.aboutecho.com",
	"q": "childrenof:http://example.com/sdk/test-target/" + Echo.Utils.getUniqueString() + " children:1"
};

suite.prototype.cases = {};

suite.prototype.cases.simpleSearchRequest = function(callback) {
	Echo.StreamServer.API.request({
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

suite.prototype.cases.searchRequestWithError = function(callback) {
	Echo.StreamServer.API.request({
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
	var req = Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onError": function(data) {
			QUnit.ok(data && data.result === "error" && data.errorCode === "connection_failure", 
				"Checking if the \"onError\" callback was executed when the request aborted");
			callback();
		},
		"onClose": function() {
			QUnit.ok(true,
				"Checking if the \"onClose\" callback was executed when the request aborted");
		}
	});
	req.send();
	setTimeout(function() {
		req.abort();
	}, 50);
};

suite.prototype.cases.checkLiveUpdate = function(callback) {
	var self = this;
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var target = this.params.q.replace(/childrenof:(http:\/\/\S+).*/, function($0, $1) {
		return $1;
	});
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var cuReq = Echo.StreamServer.API.request({
		"endpoint": "count",
		"recurring": "true",
		"onData": function(response) {
			if (response && response.count) {
				QUnit.equal(1, response.count, "Checking if live updates mecahnism by count works correctly after posting");
				callback();
			}
			cuReq.abort();
		},
		"data": $.extend({}, params)
	});
	var luReq = Echo.StreamServer.API.request({
		"endpoint": "search",
		"recurring": true,
		"onData": function(response) {
			if (response && response.entries && response.entries.length) {
				QUnit.equal(response.entries[0].object.content, self.items.post.object.content, 
					"Checking if the live update mechanism by search works correctly after posting");
				cuReq.send({force: true});
				luReq.abort();
			}
		},
		"data": $.extend({}, params)
	});
	var sReq = Echo.StreamServer.API.request({
		"endpoint": "submit",
		"onData": function(response) {
			luReq.send({force: true});
		},
		"data": $.extend({}, params, {
			content: item,
			targetURL: target
		})
	});
	sReq.send();
};

suite.prototype.cases.simpleLiveUpdatesRequest = function(callback) {
	var maxCounts = 4, currentCount = 0;
	var req = Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": this.params,
		"liveUpdatesTimeout": 1,
		"recurring": true,
		"onData": function(data) {
			if (maxCounts === ++currentCount) {
				QUnit.ok(data && data.entries,
					"Checking if the \"onData\" callback was executed after the live update request.");
				req.abort();
				callback();
			}
		}
	});
	req.send();
};

suite.prototype.tests = {};

suite.prototype.tests.PublicInterfaceTests = {
	 "config": {
		 "async": true,
		 "testTimeout": 20000 // 20 secs
	},
	"check": function() {
		this.sequentialAsyncTests([
			"simpleSearchRequest",
			"searchRequestWithError",
			"requestWithAbort",
			"checkLiveUpdate",
			"simpleLiveUpdatesRequest"
		], "cases");
	}
};

suite.prototype.tests.PrivateFunctionsTests = {
	"check": function() {
		var req = Echo.StreamServer.API.request({
			"endpoint": "search",
			"data": $.extend({}, this.params)
		});
		QUnit.ok(req._isWaitingForData({"result": "error", "errorCode": "view_limit", "extra": {}}), "Checking if error responsed JSON contains waiting error code");
		QUnit.ok(req._isErrorWithTimer({"result": "error", "errorCode": "view_update_capacity_exceeded", "extra": {}}), "Checking if error responsed JSON contains error timer code");
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
		req._changeLiveUpdatesTimeout({
			"liveUpdatesTimeout": 4
		});
		QUnit.equal(5, req.config.get("liveUpdatesTimeout"), "Checking liveUpdatesTimeout when server responsed less value than default");
		req._changeLiveUpdatesTimeout({
			"liveUpdatesTimeout": 6
		});
		QUnit.equal(6, req.config.get("liveUpdatesTimeout"), "Checking liveUpdatesTimeout when server responsed more value than default");
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
		"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora.",
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
	suite.prototype.items.post,
	{
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

})(Echo.jQuery);
