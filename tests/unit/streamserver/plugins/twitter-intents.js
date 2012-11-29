(function($) {

	var suite = Echo.Tests.Unit.PluginsTwitterIntents = function() {
		this.constructPluginRenderersTest({
			"data": _streamData
		});
	};

	suite.prototype.tests = {};

	suite.prototype.info = {
		"className": "Echo.StreamServer.Controls.Stream.Item.Plugins.TwitterIntents",
		"suiteName": "TwitterIntents plugin",
		"functions": []
	};

	suite.prototype.tests.PluginLikeAndReplyDisabled = {
		"config": {
			"async": true
		},
		"check": function() {
			new Echo.StreamServer.Controls.Stream({
				"target": $("<div>"),
				"appkey": "test.js-kit.com",
				"data": _streamData,
				"plugins": [{
					"name": "TwitterIntents"
				}, {
					"name": "Reply"
				}, {
					"name": "Like"
				}],
				"ready": function() {
					$.map(this.items, function(item) {
						if (item.data.source.name == "Twitter") {
							QUnit.ok(item.plugins["TwitterIntents"] && !item.plugins["Reply"] && !item.plugins["Like"],
								"PluginReply and PluginLike disabled for tweet");
						} else {
							QUnit.ok(!item.plugins["TwitterIntents"] && item.plugins["Reply"] && item.plugins["Like"],
								"TwitterIntents disabled for not tweet");
						}
					});
					this.destroy();
					QUnit.start();
				}
			});
		}
	};

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

})(Echo.jQuery);
