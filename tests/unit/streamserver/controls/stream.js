(function($) {

var suite = Echo.Tests.Unit.Stream = function() {
	this.constructRenderersTest({
		"instance": {
			"name": "Echo.StreamServer.Controls.Stream",
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
	"className": "Echo.StreamServer.Controls.Stream",
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
		new Echo.StreamServer.Controls.Stream({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"liveUpdates": {
				"timeout": 3
			},
			"query": "childrenof: " + this.config.dataBaseLocation + " -state:ModeratorDeleted itemsPerPage:1",
			"ready": function() {
				var target = this.config.get("target");
				suite.stream = this;
				QUnit.ok($(target).hasClass("echo-streamserver-controls-stream"),
					"Checking the common container rendering");
				QUnit.equal($(".echo-streamserver-controls-stream-item-depth-0", target).length, 1,
					"Checking initial items count");
				self.sequentialAsyncTests([
					"addRootItem",
					"queueActivityTesting",
					"addChildItem",
					"moreButton"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.asyncRenderers = {
	"config": {
		"async"       : true,
		"testTimeout" : 10000
	},
	"check": function() {
		var self = this;
		new Echo.StreamServer.Controls.Stream({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"liveUpdates": {
				"timeout": 3
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
		"topic": "Echo.StreamServer.Controls.Stream.onItemReceive",
		"once": true,
		"handler": function() {
			QUnit.equal(stream.getState(), "paused",
				"Checking state of stream (setState() + getState() methods)");
			stream.setState('live');
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			QUnit.equal($(".echo-streamserver-controls-stream-item-depth-0", target).length, 2,
				"Checking items count after posting");
			var newItem = $(".echo-streamserver-controls-stream-item-depth-0", target).get(0);
			QUnit.equal($(".echo-streamserver-controls-stream-item-authorName", newItem).html(), "john.doe",
				"Checking author name of newly posted item");
			QUnit.equal($(".echo-streamserver-controls-stream-item-text", newItem).html(), "TestContent",
				"Checking text of newly posted item");
			callback();
		}
	});
	stream.setState("paused");
	var request = Echo.StreamServer.API.request({
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
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRender",
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
	Echo.StreamServer.API.request({
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
		"topic": "Echo.StreamServer.Controls.Stream.onItemReceive",
		"once": true,
		"handler": function(topic, args) {
			var data = args.item.data;
			QUnit.equal(data.target.conversationID, parentItem.get("data.object.id"),
				"Checking that newly posted child item is received (onItemReceive event)");
			callback();
		}
	});
	var request = new Echo.StreamServer.API.request({
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
		"topic": "Echo.StreamServer.Controls.Stream.onItemsRenderingComplete",
		"once": true,
		"handler": function() {
			self._testElementsConsistencyAfterRendering("body", oldElement, stream.view.get("body"));
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
	var itemsCount = $.map(stream.items, function(_, i) { return i; }).length;

	stream.config.set("asyncItemsRendering", true);

	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRender",
		"once": true,
		"handler": function(topic, args) {
			QUnit.ok(!itemsCount, "Check if item that was received via LiveUpdate is rendered after complete rendering of body");
			stream.config.set("asyncItemsRendering", false);
			callback();
		}
	});
	var handlerId = stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"handler": function(topic, args) {
			if (--itemsCount === 0) {
				stream.events.unsubscribe({
					"handlerId": handlerId
				});
			}
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.onDataReceive",
		"once": true,
		"handler": function(topic, args) {
			stream.view.render({"name": "body"});
		}
	});
	var request = Echo.StreamServer.API.request({
		"endpoint": "submit",
		"data": entry
	});
	request.send();
};

suite.prototype.cases.moreButton = function(callback) {
	var stream = suite.stream;
	var target = this.config.target;
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.onDataReceive",
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
	$(".echo-streamserver-controls-stream-more", target).click();
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
				"objectTypes": [ "http://activitystrea.ms/schema/1.0/person" ],
				"name": params.username
			},
			"object": {
				"objectTypes": [ "http://activitystrea.ms/schema/1.0/comment"],
				"content": params.content
			},
			"source": {},
			"verbs": [ "http://activitystrea.ms/schema/1.0/post" ],
			"targets": [{
				"id": params.targetId
			}]
		}]
	};
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Stream", function(config) {
	return new Echo.StreamServer.Controls.Stream($.extend({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"liveUpdates": {
			"enabled": false
		},
		"appkey": config.appkey,
		"query": "childrenof:" + config.dataBaseLocation + " sortOrder:repliesDescending"
	}, config));
});

})(Echo.jQuery);
