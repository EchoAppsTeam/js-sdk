(function($) {

var data = {
	"instance" : {
		"name" : "Echo.StreamServer.Controls.FacePile"
	},
	"config": {
		"async"       : true,
		"testTimeout" : 10000
	}
};

var suite = Echo.Tests.Unit.FacePile = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className" : data.instance.name,
	"functions" : [
		"getVisibleUsersCount",
		"Item.isYou"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.staticWorkflow = {
	"config" : {
		"async"       : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data defined explicitly"
	},
	"check" : function() {
		var self = this;
		var data = { "entries": [] };
		var i = 0;
		while (i++ < 50) {
			data.entries.push({
				"actor" : {
					"id"     : i,
					"avatar" : "http://c0.echoenabled.com/images/avatar-default.png",
					"title"  : "TestActor" + i
				}
			});
		}
		new Echo.StreamServer.Controls.FacePile({
			"initialUsersCount" : 5,
			"suffixText" : " commented on aboutecho.com",
			"target" : this.config.target,
			"appkey" : this.config.appkey,
			"data"   : data,
			"ready"  : function() {
				suite.pile = this;
				self.sequentialAsyncTests([
					"staticCommon",
					"staticMore",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases = {};

suite.prototype.cases.destroy = function(callback) {
	suite.pile.destroy();
	callback();
};

suite.prototype.cases.staticCommon = function(callback) {
	var self = this, pile = suite.pile;
	pile.events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.FacePile.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			var html = self.config.target.html();
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

suite.prototype.cases.staticMore = function(callback) {
	var self = this, pile = suite.pile;
	pile.events.subscribe({
		"topic"  : "Echo.StreamServer.Controls.FacePile.onRefresh",
		"once"   : true,
		"handler": function(topic, params) {
			QUnit.equal(self.config.target.html().match(/echo-streamserver-controls-facepile-item-container/g).length, 7,
				"Checking users count after more button click");
			callback();
		}
	});
	$(":first-child", pile.dom.get("more")).click();
};

suite.prototype.tests.dynamicWorkflow = {
	"config" : {
		"async"       : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data taken from API endpoint",
		"user"        : {"status": "logged"}
	},
	"check" : function() {
		var self = this;
		new Echo.StreamServer.Controls.FacePile({
			"suffixText" : " commented on facepile test page",
			"target" : this.config.target,
			"appkey" : this.config.appkey,
			"query"  : "scope:" + this.config.dataBaseLocation + "tests/facepile sortOrder:chronological " +
				 "itemsPerPage: 1 -user.id:http://js-kit.com/ECHO/user/fake_user",
			"item"   : {"avatar": true, "text": true},
			"ready"  : function() {
				suite.pile = this;
				var html = self.config.target.html();
				QUnit.ok(html.match(/echo-streamserver-controls-facepile-container/),
					"Checking the common container rendering");
				QUnit.equal(html.match(/echo-streamserver-controls-facepile-item-container/g).length, 2,
					"Checking initial users count");
				QUnit.equal(suite.pile.dom.get("suffixText").html(), suite.pile.config.get("suffixText"), "Checking suffix text");
				self.sequentialAsyncTests([
					"dynamicMore",
					"dynamicIsYou",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases.dynamicMore = function(callback) {
	var self = this, pile = suite.pile;
	pile.events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.FacePile.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.equal(self.config.target.html().match(/echo-streamserver-controls-facepile-item-container/g).length, 3,
				"Checking users count after more button click");
			callback();
		}
	});
	$(":first-child", pile.dom.get("more")).click();
};

suite.prototype.cases.dynamicIsYou = function(callback) {
	var self = this, pile = suite.pile;
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
	pile.events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.FacePile.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.ok(self.config.target.html().match(/You/), "Checking that 'You' item is displayed after posting");
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
		], "cases");
	}
};

suite.prototype.cases.onlyAvatars = function(callback) {
	this._checkActorsView({"avatar": true, "text": false}, callback);
};

suite.prototype.cases.onlyNames = function(callback) {
	this._checkActorsView({"avatar": false, "text": true}, callback);
};

suite.prototype._checkActorsView = function(item, callback) {
	var cfg = this.config;
	new Echo.StreamServer.Controls.FacePile({
		"target" : cfg.target,
		"appkey" : cfg.appkey,
		"query"  : "scope:" + cfg.dataBaseLocation + "tests/facepile",
		"initialUsersCount": 5,
		"suffixText" : " commented on aboutecho.com",
		"item"  : item,
		"ready" : function() {
			$.each(item, function(key, value) {
				var postfix = (key === "text") ? "title" : key;
				var element = $(".echo-streamserver-controls-facepile-item-" + postfix, cfg.target).get(0);
				QUnit.ok(value ? $(element).is(":visible") : $(element).is(":hidden"),
					"Checking the visibility of " + postfix + "s depending on the config");
			});
			this.destroy();
			callback();
		}
	});
};

})(jQuery);
