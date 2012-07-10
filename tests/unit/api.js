(function($) {

var suites = {"API": {}, "StreamServerAPI": {}};

// tests for the API basic lib

suites.API = Echo.Tests.Unit.API = function() {};

suites.API.prototype.info = {
	"className": "Echo.API",
	"suiteName": "API",
	"functions": []
};

suites.API.prototype.tests = {};

suites.API.prototype.tests.PublicInterfaceTests = {
        "config": {
                "async": true,
                "testTimeout": 20000 // 20 secs
        },
	"check": function() {
		QUnit.ok(true, "OK");
		QUnit.start();
	}
};

// tests for the StreamServer API lib

suites.StreamServerAPI = Echo.Tests.Unit.StreamServerAPI = function() {};

suites.StreamServerAPI.prototype.info = {
	"className": "Echo.StreamServer.API",
	"suiteName": "StreamServer.API",
	"functions": []
};

suites.StreamServerAPI.prototype.params = {
	"appkey": "test.aboutecho.com",
	"q": "childrenof:http://example.com/sdk/test-target/" + Math.random() + " state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved"
};

suites.StreamServerAPI.prototype.cases = {};

suites.StreamServerAPI.prototype.cases.simpleSearchRequest = function(callback) {
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onData": function(data) {
			QUnit.ok(data && data.entries,
				"Checking if the \"onData\" callback was executed after the regular request.");
			callback();
		}
	}).send();
};

suites.StreamServerAPI.prototype.cases.searchRequestWithError = function(callback) {
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

suites.StreamServerAPI.prototype.cases.requestWithAbort = function(callback) {
	var req = Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onError": function(data) {
			QUnit.ok(data && data.result === "error" && data.errorCode === "connection_failure", 
				"Checking if the \"onError\" callback was executed when the request aborted");
			callback();
		}
	});
	req.send();
	setTimeout(function() {
		req.abort();
	}, 50);
};

suites.StreamServerAPI.prototype.cases.checkLiveUpdate = function(callback) {
	var self = this;
	var item = $.extend(true, {}, this.items.post);
	var params = $.extend({}, this.params);
	var target = this.params.q.replace(/childrenof:(http:\/\/\S+).*/, function($0, $1) {
		return $1;
	});
	item.targets[0].id = target;
	item.targets[0].conversationID = target;
	item.object.id = target;
	var luReq = Echo.StreamServer.API.request({
		"endpoint": "search",
		"recurring": true,
		"onData": function(response) {
			if (response && response.entries && response.entries.length) {
				QUnit.equal(response.entries[0].object.content, self.items.post.object.content, 
					"checking if the live update mechanism works correctly after posting");
				luReq.abort();
				callback();
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

suites.StreamServerAPI.prototype.cases.simpleLiveUpdatesRequest = function(callback) {
	var req = Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": this.params,
		"recurring": true,
		"onData": function(data) {
			QUnit.ok(data && data.entries,
				"Checking if the \"onData\" callback was executed after the live update request.");
			req.abort();
			callback();
		}
	});
	req.send();
};

suites.StreamServerAPI.prototype.tests = {};

suites.StreamServerAPI.prototype.tests.PublicInterfaceTests = {
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

suites.StreamServerAPI.prototype.tests.PrivateFunctionsTests = {
	"check": function() {
		var req = Echo.StreamServer.API.request({
			"endpoint": "search",
			"data": $.extend({}, this.params)
		});

		QUnit.deepEqual(req._AS2KVL(this.items.post), {
			"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora.",
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square",
			"markers": undefined,
			"name": "TheNext_MrsBass",
			"source": {
				"name": "aboutecho.com",
				"uri": "http://aboutecho.com/"
			},
			"tags": undefined,
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"verb": "post",
			"type": "comment",
			"itemURIPattern": ""
		}, "Check decompiler from AS to KVL");
		QUnit.deepEqual(req._AS2KVL(this.items.postWithMetadata), {
			"content": "For the record, I think your neck looked just fine.\n\nPeace out, Nora.",
			"avatar": "http://my.nymag.com/thenext_mrsbass/picture?type=square",
			"markers": "marker1,marker2,marker3",
			"name": "TheNext_MrsBass",
			"source": {
				"name": "aboutecho.com",
				"uri": "http://aboutecho.com/"
			},
			"tags": "tag1,tag2,tag3",
			"target": "http://nymag.com/daily/intel/2012/06/nora-ephron-1941-2012.html",
			"verb": "post",
			"type": "comment",
			"itemURIPattern": ""
		}, "Check decompiler from AS to KVL with metadata");
	}
};

// test data for checking AS -> KVL transformation

suites.StreamServerAPI.prototype.items = {};

suites.StreamServerAPI.prototype.items.post = {
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

suites.StreamServerAPI.prototype.items.postWithMetadata = [
	suites.StreamServerAPI.prototype.items.post,
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
		]
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
		]
	}
];

})(jQuery);
