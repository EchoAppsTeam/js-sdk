(function($) {

var suite = Echo.Tests.Unit.Stream = function() {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream",
	"functions": [
		"getState",
		"setState"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async"       : true,
		"testTimeout" : 20000, // 20 secs
	},
	"check": function() {
		var self = this;
		new Echo.StreamServer.Controls.Stream({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"liveUpdatesTimeout": 5,
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
					"addChildItem",
					"moreButton",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases = {};

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
				"Checking onDataReceive event");
		}
	});

	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRender",
		"once": true,
		"handler": function() {
			QUnit.equal($(".echo-streamserver-controls-stream-item-depth-0", target).length, 2,
				"Checking items count after more button click");
			callback();
		}
	});
	$(".echo-streamserver-controls-stream-more", target).click();
};

suite.prototype.cases.addRootItem = function(callback) {
	var stream = suite.stream;
	var target = this.config.target;
	var entry = this._preparePostEntry({
		"username": "john.doe",
		"content": "TestContent",
		"targetId": this.config.dataBaseLocation
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onReceive",
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
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"data": entry
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
		"topic": "Echo.StreamServer.Controls.Stream.Item.onReceive",
		"once": true,
		"handler": function(topic, args) {
			var data = args.item.data;
			QUnit.equal(data.target.conversationID, parentItem.get("data.object.id"),
				"Checking that newly posted child item is received");
			callback();
		}
	});
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"data": entry
	}).send();
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
				"content": params.content,
			},
			"source": {},
			"verbs": [ "http://activitystrea.ms/schema/1.0/post" ],
			"targets": [{
				"id": params.targetId
			}]
		}]
	};
};

suite.prototype._prepareUpdateEntry = function(params) {
	return {
		"appkey": this.config.appkey,
		"sessionID": Backplane.getChannelID(),
		"content": [{
			"object": {
				"objectTypes": [ "http://activitystrea.ms/schema/1.0/comment"],
				"content": params.content,
			},
			"source": {},
			"verbs": [ "http://activitystrea.ms/schema/1.0/update" ],
			"targets": [{
				"id": params.targetId
			}]
		}]
	};
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Stream", function(config) {
	return new Echo.StreamServer.Controls.Stream($.extend({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"appkey": config.appkey,
		"query": "childrenof:" + config.dataBaseLocation + " sortOrder:repliesDescending"
	}, config));
});


})(Echo.jQuery);
