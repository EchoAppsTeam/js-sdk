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
	"q": "childrenof:http://example.com/sdk/test-target state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved"
};

suites.StreamServerAPI.prototype.cases = {};

suites.StreamServerAPI.prototype.cases.simpleSearchRequest = function(callback) {
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": $.extend({}, this.params),
		"onData": function(data) {
			data = $.parseJSON(data);
			QUnit.ok(data && data.entries,
				"Checking if the \"onData\" callback was executed after the regular request.");
			callback();
		}
	});
	request.send();
};

suites.StreamServerAPI.prototype.cases.searchRequestWithError = function(callback) {
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": $.extend({}, this.params, {"q": "unknown:predicate"}),
		"onData": function(data) {
			data = $.parseJSON(data);
			QUnit.ok(data && !!data.error,
				"Checking if the \"onError\" callback was executed when the search query was defined incorrectly.");
			callback();
		}
	}).send();
};

suites.StreamServerAPI.prototype.cases.simpleLiveUpdatesRequest = function(callback) {
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": this.params,
		"recurring": true,
		"onData": function(data) {
			data = $.parseJSON(data);
			QUnit.ok(data && data.entries,
				"Checking if the \"onData\" callback was executed after the live update request.");
			callback();
		}
	}).send();
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
			"simpleLiveUpdatesRequest"
		], "cases");
	}
};

suites.StreamServerAPI.prototype.tests.PrivateFunctionsTests = {
	"check": function() {
// TODO: check input and output of the _AS2KVL function
//		console.log(Echo.StreamServer.API.Request.prototype._AS2KVL(this.items.post));
//		console.log(Echo.StreamServer.API.Request.prototype._AS2KVL(this.items.postWithMetdadata));
		QUnit.ok(true, "OK");
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
		"name": "nymag.com"
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

suites.StreamServerAPI.prototype.items.postWithMetdadata = [
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
				"http://activitystrea.ms/schema/1.0/tag"
			],
			"content": "tag1,tag2,tag3"
		},
		"verbs": [
			"http://activitystrea.ms/schema/1.0/tag"
		]
	}
];

})(jQuery);
