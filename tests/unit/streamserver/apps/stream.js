Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"echo/streamserver/apps/stream",
	"echo/utils",
	"echo/streamserver/api",
	"echo/api"
], function($, Stream, Utils, StreamServerAPI, API) {

"use strict";

Echo.Tests.module("Echo.StreamServer.Apps.Stream", {
	"meta": {
		"className" : "Echo.StreamServer.Apps.Stream",
		"functions": []
	}
});

Echo.Tests.asyncTest("more button", function() {
	// This test doesn't work in the "real server requests" mode
	// because if we want to use real requests we need to prepare
	// a stream with three items. It will create a different logic
	// for the test with the enabled requests mocking and without it.
	// TODO: we need to accumulate more similar use cases and develop
	// a general approach, should be doable after rewriting all tests
	if (!Echo.Tests.Utils.isServerMocked()) {
		QUnit.ok(true, "Not going to test with real requests");
		QUnit.start();
		return;
	}

	var cases = [{
		"itemsPerPage": 1,
		"check": function() {
			QUnit.ok(this.view.get("more").is(":visible"), "Check if more button is visible when itemsPerPage less than count items in a stream");
		}
	}, {
		"itemsPerPage": 2,
		"check": function() {
			QUnit.ok(this.view.get("more").not(":visible"), "Check if more button is hidden when itemsPerPage equal to count items in a stream");
		}
	}, {
		"itemsPerPage": 3,
		"check": function() {
			QUnit.ok(this.view.get("more").not(":visible"), "Check if more button is hidden when itemsPerPage more than count items in a stream");
		}
	}, {
		"query": "childrenof:http://example.com/sdk/stream/more-button-empty-stream",
		"check": function() {
			QUnit.ok(this.view.get("more").not(":visible"), "Check if more button is hidden when stream is empty");
		}
	}];

	Utils.sequentialCall($.map(cases, function(test) {
		return function(callback) {
			new Stream({
				"target": $("#qunit-fixture"),
				"appkey": "echo.jssdk.tests.aboutecho.com",
				"query": test.query || "childrenof:http://example.com/sdk/stream/more-button itemsPerPage:" + test.itemsPerPage,
				"ready": function() {
					test.check.call(this);
					callback();
				}
			});
		};
	}), function() {
		QUnit.start();
	});
});

var suite = Echo.Tests.Unit.Stream = function() {
	this.constructRenderersTest({
		"instance": {
			"name": "Echo.StreamServer.Apps.Stream",
			"config": {
				"liveUpdates": {
					"enabled" :false
				},
				"query": "childrenof: " + this.config.dataBaseLocation
			}
		},
		"config": {
			"async": true,
			"testTimeout": 10000
		}
	});
};

suite.prototype.info = {
	"className": "Echo.StreamServer.Apps.Stream",
	"functions": [
		"getState",
		"setState",
		"queueActivity"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async"       : true,
		"testTimeout" : 20000
	},
	"check": function() {
		var self = this;
		new Stream({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"liveUpdates": {
				"timeout": 3
			},
			"query": "childrenof: " + this.config.dataBaseLocation + " -state:ModeratorDeleted itemsPerPage:1",
			"ready": function() {
				var target = this.config.get("target");
				suite.stream = this;
				QUnit.equal(suite.stream.config.get("liveUpdates.polling.timeout"), 3,
					"Check that \"liveUpdates.timeout\" mapped to the \"liveUpdates.polling.timeout\"");
				QUnit.ok($(target).hasClass("echo-streamserver-apps-stream"),
					"Checking the common container rendering");
				QUnit.equal($(".echo-streamserver-apps-stream-item-depth-0", target).length, 1,
					"Checking initial items count");
				self.sequentialAsyncTests([
					"addRootItem",
					"queueActivityTesting",
					"addChildItem",
					"moreButton",
					"predefinedData",
					"liveUpdateEmptyStream"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.asyncRenderers = {
	"config": {
		"async": true,
		"testTimeout": 10000
	},
	"check": function() {
		var self = this;
		new Stream({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"liveUpdates": {
				"polling": {
					"timeout": 3
				}
			},
			"query": "childrenof: " + this.config.dataBaseLocation + " -state:ModeratorDeleted itemsPerPage:10",
			"ready": function() {
				var target = this.config.get("target");
				suite.stream = this;
				self.sequentialAsyncTests([
					"asyncItemsRendering",
					"asyncItemsAndLiveUpdate"
				], "cases");
			}
		});
	}
};
suite.prototype.cases = {};

suite.prototype.cases.addRootItem = function(callback) {
	var stream = suite.stream;
	var target = this.config.target;
	var entry = this._preparePostEntry({
		"username": "john.doe",
		"content": "TestContent",
		"targetId": this.config.dataBaseLocation
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onItemReceive",
		"once": true,
		"handler": function() {
			QUnit.equal(stream.getState(), "paused",
				"Checking state of stream (setState() + getState() methods)");
			stream.setState('live');
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			QUnit.equal($(".echo-streamserver-apps-stream-item-depth-0", target).length, 2,
				"Checking items count after posting");
			var newItem = $(".echo-streamserver-apps-stream-item-depth-0", target).get(0);
			QUnit.equal($(".echo-streamserver-apps-stream-item-authorName", newItem).html(), "john.doe",
				"Checking author name of newly posted item");
			QUnit.equal($(".echo-streamserver-apps-stream-item-text", newItem).html(), "TestContent",
				"Checking text of newly posted item");
			callback();
		}
	});
	stream.setState("paused");
	var request = StreamServerAPI.request({
		"endpoint": "submit",
		"data": entry
	});
	request.send();
};

suite.prototype.cases.queueActivityTesting = function(callback) {
	var self = this;
	var stream = suite.stream;
	var target = this.config.target;
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			var item = stream.threads[stream.threads.length - 1];
			var currentQueue = $.extend(true, [], stream.activities.queue);
			stream.activities.queue = [];
			var activities = [{
				"action": "action1",
				"priority": "lowest",
				"item": item
			}, {
				"action": "action2",
				"priority": "highest",
				"item": item
			}, {
				"action": "replace",
				"priority": "lowest",
				"item": item
			}, {
				"action": "action3",
				"priority": "lowest",
				"item": stream.items[args.item.data.unique]
			}];
			stream.items[args.item.data.unique].blocked = true;
			$.map(activities, $.proxy(stream.queueActivity, stream));
			stream.activities.queue = $.map(stream.activities.queue, function(activity) {
				delete activity.item;
				return activity;
			});
			QUnit.deepEqual(
				stream.activities.queue,
				[{
					"action": "action2",
					"affectCounter": false,
					"priority": "highest",
					"byCurrentUser": false,
					"handler": undefined
				}, {
					"action": "action3",
					"affectCounter": false,
					"priority": "high",
					"byCurrentUser": true,
					"handler": undefined
				}, {
					"action": "replace",
					"affectCounter": false,
					"priority": "medium",
					"byCurrentUser": false,
					"handler": undefined
				}, {
					"action": "action1",
					"affectCounter": false,
					"priority": "lowest",
					"byCurrentUser": false,
					"handler": undefined
				}],
				"Checking queueActivity functionality"
			);
			stream.activities.queue = currentQueue;
			callback();
		}
	});
	StreamServerAPI.request({
		"endpoint": "submit",
		"data": this._preparePostEntry({
			"username": "another.john.doe",
			"content": "TestContent by another.john.doe",
			"targetId": this.config.dataBaseLocation
		})
	}).send();
};

suite.prototype.cases.addChildItem = function(callback) {
	var stream = suite.stream;
	var target = this.config.target;
	var parentItem;
	$.each(stream.items, function(key, item) {
		if (item.isRoot()) {
			parentItem = item;
			return false;
		}
	});
	var entry = this._preparePostEntry({
		"username": "john.doe",
		"content": "ChildContent",
		"targetId": parentItem.get("data.object.id")
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onItemReceive",
		"once": true,
		"handler": function(topic, args) {
			var data = args.item.data;
			QUnit.equal(data.target.conversationID, parentItem.get("data.object.id"),
				"Checking that newly posted child item is received (onItemReceive event)");
			callback();
		}
	});
	var request = new StreamServerAPI.request({
		"endpoint": "submit",
		"data": entry
	});
	request.send();
};

suite.prototype.cases.asyncItemsRendering = function(callback) {
	var stream = suite.stream;
	var self = this;
	var oldElement = stream.view.get("body").clone(true, true);
	stream.config.set("asyncItemsRendering", true);
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onItemsRenderingComplete",
		"once": true,
		"handler": function() {
			Echo.Tests._testElementsConsistencyAfterRendering("body", oldElement, stream.view.get("body"));
			QUnit.ok(stream.view.get("more").is(":visible"),
				"Checking if \"more\" button is showed after complete render of items");
			stream.config.set("asyncItemsRendering", false);
			callback();
		}
	});
	stream.render();
};

suite.prototype.cases.asyncItemsAndLiveUpdate = function(callback) {
	var stream = suite.stream;
	var entry = this._preparePostEntry({
		"username": "john.doe",
		"content": "TestContent",
		"targetId": this.config.dataBaseLocation
	});
	var itemsCount = stream.threads.length;

	stream.config.set("asyncItemsRendering", true);

	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			QUnit.ok(!itemsCount, "Check if item that was received via LiveUpdate is rendered after complete rendering of body");
			stream.config.set("asyncItemsRendering", false);
			callback();
		}
	});
	var handlerId = stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.Item.onRerender",
		"handler": function(topic, args) {
			if (--itemsCount === 0) {
				stream.events.unsubscribe({
					"handlerId": handlerId
				});
			}
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onDataReceive",
		"once": true,
		"handler": function(topic, args) {
			stream.view.render({"name": "body"});
		}
	});
	var request = StreamServerAPI.request({
		"endpoint": "submit",
		"data": entry
	});
	request.send();
};

suite.prototype.cases.liveUpdateEmptyStream = function(callback) {
	var stream = suite.stream;
	var newTarget = this.config.dataBaseLocation + Utils.getUniqueString();
	var entry = this._preparePostEntry({
		"username": "john.doe",
		"content": "TestContent",
		"targetId": newTarget
	});

	stream.config.set("query", "childrenof: " + newTarget);
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onRefresh",
		"once": true,
		"handler": function() {
			QUnit.ok(stream.threads.length === 0, "Check if Stream is empty");
			var request = StreamServerAPI.request({
				"endpoint": "submit",
				"data": entry
			});
			request.send();
		}
	});

	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			QUnit.ok(ok, "Check if item was rendered for empty Stream");
			callback();
		}
	});

	stream.refresh();
};

suite.prototype.cases.moreButton = function(callback) {
	var stream = suite.stream;
	var target = this.config.target;
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Apps.Stream.onDataReceive",
		"once": true,
		"handler": function(topic, args) {
			var count = 0;
			$.each(args.entries, function(key, entry) {
				if (entry.object.id == entry.targets[0].conversationID) {
					count++;
				}
			}); 
			QUnit.equal(count, 1,
				"Checking that new item was received after more button click(onDataReceive event)");
			callback();
		}
	});
	$(".echo-streamserver-apps-stream-more", target).click();
};

suite.prototype.cases.predefinedData = function(callback) {
	new Stream({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"liveUpdates": {
			"enabled": false
		},
		"query": "childrenof:http://example.com/js-sdk/ itemsPerPage:1 children:0",
		"data": {
			"id": "http://api.echoenabled.com/v1/search?q=childrenof:http://example.com/js-sdk/%20itemsPerPage:1%20children:0",
			"updated": "2013-04-18T17:32:18Z",
			"hasMoreChildren": "true",
			"sortOrder": "reverseChronological",
			"showFlags": "on",
			"safeHTML": "aggressive",
			"itemsPerPage": "1",
			"children": {
				"maxDepth": "0",
				"sortOrder": "reverseChronological",
				"itemsPerPage": "2",
				"filter": "()"
			},
			"nextPageAfter": "1366306330.049437",
			"nextSince": "1366306549.849118",
			"liveUpdatesTimeout": "0",
			"entries": [
				{
					"id": "http://js-kit.com/activities/post/b126c90795f59b805db2cd73a62761c3",
					"actor": {
						"links": [],
						"objectTypes": [
							"http://activitystrea.ms/schema/1.0/person"
						],
						"id": "http://js-kit.com/ECHO/user/fake_user",
						"title": "another.john.doe",
						"status": "ModeratorBanned",
						"markers": [],
						"roles": [
							"administrator",
							"moderator"
						]
					},
					"object": {
						"id": "http://example.com/ECHO/item/1366306330-580-88",
						"objectTypes": [
							"http://activitystrea.ms/schema/1.0/comment"
						],
						"permalink": "",
						"context": [
							{
								"uri": "http://example.com/js-sdk/"
							}
						],
						"content": "TestContent by another.john.doe",
						"content_type": "html",
						"status": "SystemFlagged",
						"markers": [
							"spam.impermium"
						],
						"published": "2013-04-18T17:32:10Z"
					},
					"source": {
						"name": "jskit",
						"uri": "http://aboutecho.com/",
						"icon": "http://cdn.js-kit.com/images/echo.png"
					},
					"provider": {
						"name": "echo",
						"uri": "http://aboutecho.com/",
						"icon": "http://cdn.js-kit.com/images/echo.png"
					},
					"verbs": [
						"http://activitystrea.ms/schema/1.0/post"
					],
					"postedTime": "2013-04-18T17:32:10Z",
					"targets": [
						{
							"id": "http://example.com/js-sdk/",
							"conversationID": "http://example.com/ECHO/item/1366306330-580-88"
						}
					],
					"pageAfter": "1366306330.049437",
					"hasMoreChildren": "false"
				}
			]
			},
		"ready": function() {
			var self = this;
			QUnit.ok(this.request instanceof API.Request, "Check that stream initializing with the pre-defined data inits a request object as well");
			QUnit.strictEqual(this.request.config.get("liveUpdates.enabled"), this.config.get("liveUpdates.enabled"), "Check that stream initializing with the pre-defined data inits a request object with the proper options");
			callback();
		}
	});
};

suite.prototype.cases.destroy = function(callback) {
	if (suite.stream) suite.stream.destroy();
	callback();
};

suite.prototype._preparePostEntry = function(params) {
	return {
		"appkey": this.config.appkey,
		"sessionID": Backplane.getChannelID(),
		"content": [{
			"actor": {
				"objectTypes": ["http://activitystrea.ms/schema/1.0/person"],
				"name": params.username
			},
			"object": {
				"objectTypes": ["http://activitystrea.ms/schema/1.0/comment"],
				"content": params.content
			},
			"source": {},
			"verbs": ["http://activitystrea.ms/schema/1.0/post"],
			"targets": [{
				"id": params.targetId
			}]
		}]
	};
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Apps.Stream", function(config) {
	return new Stream($.extend({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"liveUpdates": {
			"enabled": false
		},
		"appkey": config.appkey,
		"query": "childrenof:" + config.dataBaseLocation + " sortOrder:repliesDescending"
	}, config));
});
callback();
});
});
