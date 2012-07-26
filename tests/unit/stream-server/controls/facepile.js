(function($) {

var data = {
	"instance": {
		"name": "Echo.StreamServer.Controls.FacePile"
	},
	"config": {
		"async": true,
		"testTimeout": 10000
	}
};

var suite = Echo.Tests.Unit.FacePile = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className" : "Echo.FacePile",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.staticWorkflow = {
	"config" : {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data defined explicitly"
	},
	"check" : function() {
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		var data = { "entries": [] };
		var i = 0;
		while (i++ < 50) {
			data.entries.push({
				"actor": {
					"id": i,
					"avatar": "http://c0.echoenabled.com/images/avatar-default.png",
					"title": "TestActor" + i
				}
			});
		}
		suite.pile = new Echo.StreamServer.Controls.FacePile({
			"target": suite.target,
			"appkey": this.config.appkey,
			"data"  : data,
			"initialUsersCount": 5,
			"suffixText": " commented on aboutecho.com"
		});
		this.sequentialAsyncTests([
			"common",
			"more"
		], "staticCases");
	}
};

suite.prototype.staticCases = {};

suite.prototype.staticCases.common = function(callback) {
	var target = suite.target, pile = suite.pile;
	var handlerId = pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRerender",
		"handler": function(topic, params) {
			pile.events.unsubscribe({
				"handlerId" : handlerId
			});
			var html = $(target).html();
			QUnit.ok(html.match(/echo-streamserver-controls-facepile-container/),
				"Checking the common container rendering");
			QUnit.equal(html.match(/echo-streamserver-controls-facepile-item-container/g).length, 5,
				"Checking initial users count");
			QUnit.equal(html.match(/echo-streamserver-controls-facepile-item-avatar/g).length, 5,
				"Checking that user avatars are displayed by default");
			QUnit.equal(html.match(/echo-streamserver-controls-facepile-item-title/g).length, 5,
				"Checking that user names are displayed by default");
			QUnit.equal(pile.dom.get("suffixText").html(), " commented on aboutecho.com", "Checking suffix text");
			callback();
		}
	});
	pile.refresh();
};

suite.prototype.staticCases.more = function(callback) {
	var target = suite.target, pile = suite.pile;
	var handlerId = pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRerender",
		"handler": function(topic, params) {
			pile.events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.equal($(target).html().match(/echo-streamserver-controls-facepile-item-container/g).length, 7,
				"Checking users count after more button click");
			callback();
		}
	});
	$(":first-child", pile.dom.get("more")).click();
};

suite.prototype.tests.dynamicWorkflow = {
	"config" : {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data taken from API endpoint",
		"user": {"status": "logged"}
	},
	"check" : function() {
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		suite.pile = new Echo.StreamServer.Controls.FacePile({
			"target": suite.target,
			"appkey": this.config.appkey,
			"query": "scope:" + this.config.dataBaseLocation + "tests/facepile sortOrder:chronological " +
				 "itemsPerPage: 1 -user.id:http://js-kit.com/ECHO/user/fake_user",
			"suffixText": " commented on facepile test page",
			"item": {"avatar": true, "text": true}
		});
		this.sequentialAsyncTests([
			"common",
			"more",
			"isYou"
		], "dynamicCases");
	}
};

suite.prototype.dynamicCases = {};

suite.prototype.dynamicCases.common = function(callback) {
	var target = suite.target, pile = suite.pile;
	var handlerId = pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRender",
		"handler": function(topic, params) {
			pile.events.unsubscribe({
				"handlerId" : handlerId
			});
			var html = $(target).html();
			QUnit.ok(html.match(/echo-streamserver-controls-facepile-container/),
				"Checking the common container rendering");
			QUnit.equal(html.match(/echo-streamserver-controls-facepile-item-container/g).length, 2,
				"Checking initial users count");
			QUnit.equal(pile.dom.get("suffixText").html(), " commented on facepile test page", "Checking suffix text");
			callback();
		}
	});
};

suite.prototype.dynamicCases.more = function(callback) {
	var target = suite.target, pile = suite.pile;
	var handlerId = pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRerender",
		"handler": function(topic, params) {
			pile.events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.equal($(target).html().match(/echo-streamserver-controls-facepile-item-container/g).length, 3,
				"Checking users count after more button click");
			callback();
		}
	});
	$(":first-child", pile.dom.get("more")).click();
};

suite.prototype.dynamicCases.isYou = function(callback) {
	var target = suite.target, pile = suite.pile;
	var entry = {
		"appkey": "test.js-kit.com",
		"sessionID": Backplane.getChannelID(),
		"content": [{
			"actor": {
				"objectTypes": [ "http://activitystrea.ms/schema/1.0/person" ],
				"name": "john.doe"
			},
			"object": {
				"objectTypes": [ "http://activitystrea.ms/schema/1.0/comment"],
				"content": "TestContent",
			},
			"source": {},
			"verbs": [ "http://activitystrea.ms/schema/1.0/post" ],
			"targets": [{
				"id": this.config.dataBaseLocation + "/tests/facepile"
			}]
		}]
	};
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"data": entry
	}).send();
	var handlerId = pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRerender",
		"handler": function(topic, params) {
			pile.events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.ok($(target).html().match(/You/), "Checking that 'You' item is displayed after posting");
			callback();
		}
	});
	pile.config.set("query", "scope:" + this.config.dataBaseLocation + "tests/facepile itemsPerPage:1");
	pile.refresh();
};

suite.prototype.tests.actorsView = {
	"config" : {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
	},
	"check" : function() {
		this.sequentialAsyncTests([
			"onlyAvatars",
			"onlyNames"
		], "viewCases");
	}
};

suite.prototype.viewCases = {};

suite.prototype.viewCases.onlyAvatars = function(callback) {
	this._checkActorsView({"avatar": true, "text": false}, callback);
};

suite.prototype.viewCases.onlyNames = function(callback) {
	this._checkActorsView({"avatar": false, "text": true}, callback);
};

suite.prototype._checkActorsView = function(item, callback) {
	var target = document.getElementById("qunit-fixture");
	$(target).empty();
	var handler = function(topic, params) {
		Echo.Events.unsubscribe({
			"handlerId" : handlerId
		});
		$.each(item, function(key, value) {
			var postfix = (key === "text") ? "title" : key;
			var element = $(".echo-streamserver-controls-facepile-item-" + postfix, target).get(0);
			QUnit.ok(value ? $(element).is(":visible") : $(element).is(":hidden"),
				"Checking the visibility of " + postfix + "s depending on the config");
		});
		callback();
	};
	var handlerId = Echo.Events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRender",
		"handler": handler
	});
	var pile = new Echo.StreamServer.Controls.FacePile({
		"target": target,
		"appkey": this.config.appkey,
		"query": "scope:" + this.config.dataBaseLocation + "tests/facepile",
		"initialUsersCount": 5,
		"suffixText": " commented on aboutecho.com",
		"item": item
	});
};

})(jQuery);
