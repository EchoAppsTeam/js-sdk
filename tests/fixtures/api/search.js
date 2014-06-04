(function($) {
"use strict";

 var entry = {
	"id": "http://js-kit.com/activities/post/b126c90795f59b805db2cd73a62761c3",
	"actor": {
		"links": [
			"https://twitter.com/someUser"
		],
		"objectTypes": [
			"http://activitystrea.ms/schema/1.0/person"
		],
		"id": "http://twitter.com/someUser",
		"title": "Test User",
		"status": "Untouched",
		"markers": [],
		"roles": []
	},
	"object": {
		"id": "http://example.com/ECHO/item/1366306330-580-88",
		"objectTypes": [
			"http://activitystrea.ms/schema/1.0/comment"
		],
		"content": "TestContent by another.john.doe",
		"published": "2013-04-18T17:32:10Z"
	},
	"provider": {
		"icon": "http://example.com/icon.ico",
		"name": "example.com",
		"uri": "http://example.com"
	},
	"verbs": [
		"http://activitystrea.ms/schema/1.0/post"
	],
	"targets": [{
		"id": "http://example.com/js-sdk/",
		"conversationID": "http://example.com/ECHO/item/1366306330-580-88"
	}]
};

Echo.Tests.Fixtures.api.search = {
	"childrenof:http://example.com/sdk/loader/canvases/search/1": {
		"itemsPerPage": "2",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": "2"},
		"entries": []
	},
	"childrenof:http://example.com/sdk/stream/more-button+itemsPerPage:1": {
		"hasMoreChildren": "true",
		"itemsPerPage": "1",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": "2"},
		"entries": [entry]
	},
	"childrenof:http://example.com/sdk/stream/more-button+itemsPerPage:2": {
		"hasMoreChildren": "false",
		"itemsPerPage": "1",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": "2"},
		"entries": [entry, entry]
	},
	"childrenof:http://example.com/sdk/stream/more-button+itemsPerPage:3": {
		"hasMoreChildren": "false",
		"itemsPerPage": "1",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": "2"},
		"entries": [entry, entry]
	},
	"childrenof:http://example.com/sdk/stream/more-button-empty-stream": {
		"hasMoreChildren": "false",
		"itemsPerPage": "5",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": "2"},
		"entries": []
	},
	"childrenof:http://example.com/js-sdk/tests/facepile+sortOrder:chronological+itemsPerPage:+2+-user.id:http://js-kit.com/ECHO/user/fake_user": {
		"hasMoreChildren": "false",
		"itemsPerPage": "2",
		"nextPageAfter": "1397960999.0508101",
		"nextSince": "1401350677.307007",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": 2},
		"entries": [entry, $.extend(true, {}, entry, {
			"actor": {
				"links": [
					"https://twitter.com/someUser2"
				],
				"objectTypes": [
					"http://activitystrea.ms/schema/1.0/person"
				],
				"id": "http://twitter.com/someUser2",
				"title": "Test User 2"
			}
		})]
	},
	"pageAfter:\"1397960999.0508101\"+childrenof:http://example.com/js-sdk/tests/facepile+sortOrder:chronological+itemsPerPage:+2+-user.id:http://js-kit.com/ECHO/user/fake_user": {
		"hasMoreChildren": "false",
		"itemsPerPage": "2",
		"nextPageAfter": "1397960999.0508101",
		"nextSince": "1401350677.307007",
		"children": {"maxDepth": "2", "sortOrder": "reverseChronological", "itemsPerPage": 2},
		"entries": [$.extend(true, {}, entry, {
			"actor": {
				"links": [
					"https://twitter.com/someuser3"
				],
				"objecttypes": [
					"http://activitystrea.ms/schema/1.0/person"
				],
				"id": "http://twitter.com/someuser3",
				"title": "test user 3"
			}
		})]
	}
};

})(Echo.jQuery);
