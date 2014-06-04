(function($) {
"use strict";

var plugin = "Echo.StreamServer.Controls.Stream.Item.Plugins.TweetDisplay";

Echo.Tests.module(plugin, {
	"meta": {
		"className": plugin
	}
});

// TODO: replace with mocked "/v1/search" request
var _streamData = {
	"id": "http://api.echoenabled.com/v1/search?q=childrenof:http://aboutecho.com/*%20itemsPerPage:2",
	"updated": "2012-08-14T06:15:10Z",
	"hasMoreChildren": "true",
	"sortOrder": "reverseChronological",
	"safeHTML": "aggressive",
	"itemsPerPage": "2",
	"children": {
		"maxDepth": "2",
		"sortOrder": "reverseChronological",
		"itemsPerPage": "2",
		"filter": ""
	},
	"entries": [{
		"id": "http://js-kit.com/activities/post/" + Echo.Utils.getUniqueString(),
		"actor": {
			"links": [],
			"objectTypes": ["http://activitystrea.ms/schema/1.0/person"],
			"id": "http://twitter.com/user-name",
			"title": "user name",
			"status": "Untouched",
			"markers": [],
			"roles": [],
			"avatar": Echo.Loader.getURL("images/avatar-default.png", false)
		},
		"object": {
			"id": "http://twitter.com/user-name/statuses/" + Echo.Utils.getUniqueString(),
			"objectTypes": ["http://activitystrea.ms/schema/1.0/article"],
			"title": "some title",
			"permalink": "",
			"context": [{"uri": "http://aboutecho.com/e2/tweets/e2launch"}],
			"content": "some content",
			"content_type": "text",
			"status": "Untouched",
			"markers": ["arktan-reply-tweet"],
			"published": "2012-08-14T04:57:53Z"
		},
		"source": {
			"name": "Twitter",
			"uri": "",
			"icon": ""
		},
		"provider": {
			"name": "Arktan",
			"uri": "",
			"icon": ""
		},
		"verbs": ["http://activitystrea.ms/schema/1.0/post"],
		"postedTime": "2012-08-14T04:57:53Z",
		"targets": []
	}, {
		"id": "http://js-kit.com/activities/post/" + Echo.Utils.getUniqueString(),
		"actor": {
			"links": [],
			"objectTypes": ["http://activitystrea.ms/schema/1.0/person"],
			"id": "http://twitter.com/user-name",
			"title": "user name",
			"status": "Untouched",
			"markers": [],
			"roles": [],
			"avatar": Echo.Loader.getURL("images/avatar-default.png", false)
		},
		"object": {
			"id": "http://twitter.com/user-name/statuses/" + Echo.Utils.getUniqueString(),
			"objectTypes": ["http://activitystrea.ms/schema/1.0/article"],
			"title": "some title",
			"permalink": "",
			"context": [{"uri": "http://aboutecho.com/e2/tweets/e2launch"}],
			"content": "some content",
			"content_type": "text",
			"status": "Untouched",
			"markers": ["arktan-reply-tweet"],
			"published": "2012-08-14T04:57:53Z"
		},
		"source": {
			"name": "jskit",
			"uri": "",
			"icon": ""
		},
		"provider": {
			"name": "Arktan",
			"uri": "",
			"icon": ""
		},
		"verbs": ["http://activitystrea.ms/schema/1.0/post"],
		"postedTime": "2012-08-14T04:57:53Z",
		"targets": []
	}]
};

Echo.Tests.pluginRenderersTest(plugin, {
	"query": "childrenof:http://example.com/js-sdk/",
	"data": _streamData,
	"liveUpdates": {
		"enabled": false
	}
});

Echo.Tests.asyncTest("disabled Like and Reply plugins", function() {
	new Echo.StreamServer.Controls.Stream({
		"target": $("<div>"),
		"appkey": "test.js-kit.com",
		"data": _streamData,
		"plugins": [{
			"name": "TweetDisplay"
		}, {
			"name": "Reply"
		}, {
			"name": "Like"
		}],
		"ready": function() {
			$.map(this.items, function(item) {
				if (item.data.source.name === "Twitter") {
					QUnit.ok(item.plugins["TweetDisplay"] && !item.plugins["Reply"] && !item.plugins["Like"],
						"Plugins Reply and Like are disabled for tweet");
				} else {
					QUnit.ok(!item.plugins["TweetDisplay"] && item.plugins["Reply"] && item.plugins["Like"],
						"Plugin TweetDisplay is disabled for non-tweet");
				}
			});
			this.destroy();
			QUnit.start();
		}
	});
});

})(Echo.jQuery);
