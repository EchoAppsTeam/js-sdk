var entry = {
	"id": "http://js-kit.com/activities/post/b126c90795f59b805db2cd73a62761c3",
	"object": {
		"id": "http://example.com/ECHO/item/1366306330-580-88",
		"objectTypes": [
			"http://activitystrea.ms/schema/1.0/comment"
		],
		"content": "TestContent by another.john.doe",
		"published": "2013-04-18T17:32:10Z"
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
	}
};
