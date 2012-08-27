(function($) {

var suite = Echo.Tests.Unit.Item = function() {
	this.constructRenderersTest({
		"instance" : {
			"name" : "Echo.StreamServer.Controls.Stream.Item",
			"config": {
				"render": true,
				"data": suite._itemData,
				"parent": suite._streamConfigData
			}
		},
		"config": {
			"async"       : true,
			"testTimeout" : 10000
		}
	});
};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item",
	"functions": [
		"isRoot",
		"block",
		"unblock",
		"traverse",
		"getAccumulator",
		"hasMoreChildren",
		"getNextPageAfter",
		"addButtonSpec"
	]
};

suite.prototype.tests = {};

suite.prototype.cases = {};

suite.prototype.tests.commonWorkflow = {
	"config" : {
		"async"       : true,
		"testTimeout" : 20000, // 20 secs
	},
	"check": function() {
		var self = this;
		new Echo.StreamServer.Controls.Stream.Item({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"parent": suite._streamConfigData,
			"data": _normalizeEntry(suite._itemData),
			"render": true,
			"buttonsOrder": undefined,
			"ready": function() {
				var item = suite.item = this;
				
				QUnit.ok(item.isRoot(), "Checking isRoot() method");
				item.set("data.target.conversationID", "http://example.com/ECHO/item/1311856366-373-938");
				QUnit.ok(!item.isRoot(), "Checking isRoot() method");
				
				QUnit.equal(item.getAccumulator("likesCount"), 2, "Checking getAccumulator method");
				
				item.set("data.hasMoreChildren", "false");
				QUnit.ok(!item.hasMoreChildren(), "Checking hasMoreChildren() method");
				item.set("data.hasMoreChildren", "true");
				QUnit.ok(item.hasMoreChildren(), "Checking that hasMoreChildren() method");
				item.set("data.hasMoreChildren", true);
				QUnit.ok(!item.hasMoreChildren(), "Checking that hasMoreChildren() method");
				
				item.block("TestMessage");
				QUnit.ok(item.get("blocked"),
					"Checking that field 'blocked' is true (block() method)");
				QUnit.equal($("." + item.cssPrefix + "blocker-message", item.dom.get("container")).html(),
					"TestMessage", "Checking the block message (block() method)");
				QUnit.ok($("." + item.cssPrefix + "blocker-backdrop", item.dom.get("container")).length,
					"Checking that block backdrop is apperead (block() method)");
				
				item.unblock();
				QUnit.ok(!item.get("blocked"),
					"Checking that field 'blocked' is false (unblock() method)");
				QUnit.ok(!$("." + item.cssPrefix + "blocker-message", item.dom.get("container")).length,
					"Checking that block message was removed (unblock() method)");
				QUnit.ok(!$("." + item.cssPrefix + "blocker-backdrop", item.dom.get("container")).length,
					"Checking that block backdrop was removed (unblock() method)");
				
				var children = [
					new Echo.StreamServer.Controls.Stream.Item({
						"target": $("<div>"),
						"appkey": self.config.appkey,
						"parent": suite._streamConfigData,
						"data":  _normalizeEntry($.extend(true, {}, suite._itemData, {
							"object": {
								"content": "123"
							},
							"pageAfter": "1346051873.088351"
						})),
						"live": false
					}),
					new Echo.StreamServer.Controls.Stream.Item({
						"target": $("<div>"),
						"appkey": self.config.appkey,
						"parent": suite._streamConfigData,
						"data":  _normalizeEntry($.extend(true, {}, suite._itemData, {
							"object": {
								"content": "456"
							},
							"pageAfter": "1346051873.088352" 
						})),
						"live": false
					}),
					new Echo.StreamServer.Controls.Stream.Item({
						"target": $("<div>"),
						"appkey": self.config.appkey,
						"parent": suite._streamConfigData,
						"data":  _normalizeEntry($.extend(true, {}, suite._itemData, {
							"object": {
								"content": "789"
							},
							"pageAfter":  "1346051873.088353"
						})),
						"live": true
					})
				];
				suite.item.set("children", children);
				self.sequentialAsyncTests([
					"traverse",
					"expand",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases.traverse = function(callback) {
	var item = suite.item;
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"once": true,
		"handler": function() {
			var content = "";
			item.traverse(item.get("children"), function(child) {
				content += child.get("data.object.content");
			});
			QUnit.equal("123456789", content, "Checking traverse() method");
			QUnit.equal(item.getNextPageAfter(), "1346051873.088351",
				"Checking getNextPageAfter() method");
			item.config.set("parent.children.sortOrder", "chronological");
			QUnit.equal(item.getNextPageAfter(), "1346051873.088352",
				"Checking getNextPageAfter() method");
			item.traverse(item.get("children"), function(child) {
				child.config.set("live", true);
			});
			QUnit.equal(item.getNextPageAfter(), undefined,
				"Checking that getNextPageAfter() method returns undefined if all children are live");
			callback();
		}
	});
	item.dom.render();
};

suite.prototype.cases.expand = function(callback) {
	var item = suite.item;
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onChildrenExpand",
		"once": true,
		"handler": function() {
			QUnit.ok(true, "Checking onChildrenExpand() event");
			callback();
		}
	});
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"once": true,
		"handler": function() {
			item.dom.get("expandChildren").click();
		}
	});
	console.log(item.get("children"));
	item.set("data.hasMoreChildren", "true");
	item.dom.render();
};

suite.prototype.tests.testItemButtons = {
	"config" : {
		"async"       : true,
		"testTimeout" : 20000, // 20 secs
	},
	"check": function() {
		var self = this;
		new Echo.StreamServer.Controls.Stream.Item({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"parent": suite._streamConfigData,
			"data": _normalizeEntry(suite._itemData),
			"render": true,
			"buttonsOrder": undefined,
			"ready": function() {
				suite.item = this;
				self.sequentialAsyncTests([
					"visibility",
					"order",
					"click",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases.visibility = function(callback) {
	var item = suite.item;
	var buttons =[{
		"name": "button1",
		"label": "Button1",
		"visible": true,
		"plugin": "Plugin1"
	}, {
		"name": "button2",
		"label": "Button2",
		"visible": false,
		"plugin": "Plugin2"
	}, {
		"name": "button3",
		"label": "Button3",
		"visible": function() { return false; },
		"plugin": "Plugin3"
	}];
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"once": true,
		"handler": function() {
			var element = item.dom.get("buttons");
			QUnit.ok($(element).html().match(buttons[0].label),
				"Checking visible button");
			QUnit.ok(!$(element).html().match(buttons[1].label),
				"Checking hidden button");
			QUnit.ok(!$(element).html().match(buttons[2].label),
				"Checking button with visible parameter as function");
			callback();
		}
	});
	item.buttonSpecs = {};
	item.buttonsOrder = [];
	item.config.set("buttonsOrder", undefined);
	$.map(buttons, function(button) {
		item.addButtonSpec(button.plugin, button);
	});
	item.dom.render();
};

suite.prototype.cases.order = function(callback) {
	var item = suite.item;
	var buttons =[{
		"name": "button1",
		"label": "Button1",
		"visible": true,
		"plugin": "Plugin1"
	}, {
		"name": "button2",
		"label": "Button2",
		"visible": true,
		"plugin": "Plugin2"
	}, {
		"name": "button3",
		"label": "Button3",
		"visible": true,
		"plugin": "Plugin3"
	}];
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"once": true,
		"handler": function() {
			var element = item.dom.get("buttons");
			var isOrderCorrect = true;
			$.each(buttonsOrder, function(i, plugin) {
				var index = 1 + 2 * i;
				var label;
				$.each(buttons, function(key, button) {
					if (button.plugin === plugin) {
						label = button.label || button.name;
						return false;
					}
				});
				isOrderCorrect = isOrderCorrect && $(element.children().get(index)).html().match(label); 
				return isOrderCorrect;
			});
			QUnit.ok(isOrderCorrect, "Checking correct buttons order");
			callback();
		}
	});
	item.buttonSpecs = {};
	item.buttonsOrder = [];
	var buttonsOrder = ["Plugin3", "Plugin2", "Plugin1"];
	item.config.set("buttonsOrder", buttonsOrder);
	$.map(buttons, function(button) {
		item.addButtonSpec(button.plugin, button);
	});
	item.dom.render();
};

suite.prototype.cases.click = function(callback) {
	var item = suite.item;
	var button = {
		"name": "newButton",
		"label": "NewButton",
		"visible": true,
		"plugin": "NewPlugin",
		"callback": function() {
			item.set("key", "value");
		}
	};
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onButtonClick",
		"once": true,
		"handler": function(topic, args) {
			QUnit.equal(item.get("key"), "value",
				"Checking callback function after button click");
			QUnit.equal(args.plugin, button.plugin, 
				"Checking plugin name after button click");
			callback();
		}
	});
	item.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onRerender",
		"once": true,
		"handler": function() {
			$(item.dom.get("buttons").children().get(1)).click();
		}
	});
	item.buttonSpecs = {};
	item.buttonsOrder = [];
	item.config.set("buttonsOrder", undefined);
	item.addButtonSpec(button.plugin, button);
	item.dom.render();
};

suite.prototype.cases.destroy = function(callback) {
	if (suite.item) suite.item.destroy();
	callback();
};

suite.prototype.tests.bodyRendererTest = {
	"check": function() {
		var contentTransform = '1 :) <b>$$<u>DD</u>$$<i>#88</i></b> 5#\n<a href="http://">#asd</a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\nhttp://google.com/#qwerty';
		var contentLimits = '1234567890 <span>qwertyuiop</span> https://encrypted.google.com/#sclient=psy&hl=en&source=hp&q=something&pbx=1&oq=something&aq=f&aqi=g5&aql=1&gs_sm=e&gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&bav=on.2,or.r_gc.r_pw.&fp=d31248080af7dd23&biw=1440&bih=788 #12345678901234567890';
		this._runBodyCases([{
			"description": "source: Twitter, aggressiveSanitization: true",
			"config": {
				"aggressiveSanitization": true
			},
			"data": {
				"object": {
					"content": "http://example.com"
				},
				"source": {
					"name": "Twitter"
				}
			},
			"expect": "I shared this on Twitter..."
		}, {
			"description": "source: Reuters, removing target.id",
			"data": {
				"object": {
					"content": "http://example.com"
				},
				"source": {
					"name": "Reuters"
				}
			},
			"expect": "I shared this on Reuters..."
		}, {
			"description": "source: Reuters, removing permalink",
			"data": {
				"object": {
					"permalink": "http://google.com",
					"content": "http://example.com http://google.com 2"
				},
				"source": {
					"name": "Reuters"
				}
			},
			"expect": '<a href="http://example.com">http://example.com</a>  2'
		}, {
			"description": "source: Reuters, reTag: false",
			"config": {
				"reTag": false
			},
			"data": {
				"object": {
					"permalink": "http://google.com",
					"content": "http://example.com http://google.com 2"
				},
				"source": {
					"name": "Reuters"
				}
			},
			"expect": '<a href="http://example.com">http://example.com</a> <a href="http://google.com">http://google.com</a> 2'
		}, {
			"description": "[newlines]",
			"config": {
				"contentTransformations": {
					"text": ["newlines"],
					"html": ["newlines"],
					"xhtml": []
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
			"expect": '1 :) <b>$$<u>DD</u>$$<i>#88</i></b> 5#&nbsp;<br><a href="http://">#asd</a>&nbsp;<br><a href="http://ya.ru">http://ya.ru</a>&nbsp;<br>&nbsp;<br>http://google.com/#qwerty'
		}, {
			"description": "[smileys, urls]",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "urls"],
					"html": ["smileys", "urls"],
					"xhtml": ["smileys", "urls"]
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
				"expect": '1 <img class="echo-streamserver-controls-stream-item-smiley-icon" src="//cdn.echoenabled.com/images/smileys/emoticon_smile.png" title="Smile" alt="Smile"> <b>$$<u>DD</u>$$<i>#88</i></b> 5#\n<a href="http://">#asd</a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\n<a href="http://google.com/#qwerty">http://google.com/#qwerty</a>'
		}, {
			"description": "[hashtags]",
			"config": {
				"contentTransformations": {
					"text": ["hashtags"],
					"html": ["hashtags"],
					"xhtml": ["hashtags"]
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
			"expect": '1 :) <b>$$<u>DD</u>$$<i><span class="echo-streamserver-controls-stream-item-tag">88</span></i></b> 5#\n<a href="http://"><span class="echo-streamserver-controls-stream-item-tag">asd</span></a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\nhttp://google.com/#qwerty'
		}, {
			"description": "[smileys, hashtags]",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags"],
					"html": ["smileys", "hashtags"],
					"xhtml": ["smileys", "hashtags"]
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
			"expect": '1 <img class="echo-streamserver-controls-stream-item-smiley-icon" src="//cdn.echoenabled.com/images/smileys/emoticon_smile.png" title="Smile" alt="Smile"> <b>$$<u>DD</u>$$<i><span class="echo-streamserver-controls-stream-item-tag">88</span></i></b> 5#\n<a href="http://"><span class="echo-streamserver-controls-stream-item-tag">asd</span></a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\nhttp://google.com/#qwerty'
		}, {
			"description": "[hashtags, urls]",
			"config": {
				"contentTransformations": {
					"text": ["hashtags", "urls"],
					"html": ["hashtags", "urls"],
					"xhtml": ["hashtags", "urls"]
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
			"expect": '1 :) <b>$$<u>DD</u>$$<i><span class="echo-streamserver-controls-stream-item-tag">88</span></i></b> 5#\n<a href="http://"><span class="echo-streamserver-controls-stream-item-tag">asd</span></a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\n<a href="http://google.com/#qwerty">http://google.com/#qwerty</a>'
		}, {
			"description": "[smileys, hashtags, urls, newlines]",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags", "urls", "newlines"],
					"html": ["smileys", "hashtags", "urls", "newlines"],
					"xhtml": ["smileys", "hashtags", "urls"]
				}
			},
			"data": {
				"object": {
					"content": contentTransform
				}
			},
			"expect": '1 <img class="echo-streamserver-controls-stream-item-smiley-icon" src="//cdn.echoenabled.com/images/smileys/emoticon_smile.png" title="Smile" alt="Smile"> <b>$$<u>DD</u>$$<i><span class="echo-streamserver-controls-stream-item-tag">88</span></i></b> 5#&nbsp;<br><a href="http://"><span class="echo-streamserver-controls-stream-item-tag">asd</span></a>&nbsp;<br><a href="http://ya.ru">http://ya.ru</a>&nbsp;<br>&nbsp;<br><a href="http://google.com/#qwerty">http://google.com/#qwerty</a>'
		}, {
			"description": "very high limits",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags", "urls", "newlines"],
					"html": ["smileys", "hashtags", "urls", "newlines"],
					"xhtml": ["smileys", "hashtags", "urls"]
				},
				"limits": {
					"maxBodyLinkLength": 500,
					"maxBodyCharacters": undefined,
					"maxTagLength": 160
				}
			},
			"data": {
				"object": {
					"content": contentLimits
				},
				"source": {
					"name": "Twitter"
				}
			},
			"expect": '1234567890 <span>qwertyuiop</span> <a href="https://encrypted.google.com/#sclient=psy&amp;hl=en&amp;source=hp&amp;q=something&amp;pbx=1&amp;oq=something&amp;aq=f&amp;aqi=g5&amp;aql=1&amp;gs_sm=e&amp;gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&amp;bav=on.2,or.r_gc.r_pw.&amp;fp=d31248080af7dd23&amp;biw=1440&amp;bih=788">https://encrypted.google.com/#sclient=psy&amp;hl=en&amp;source=hp&amp;q=something&amp;pbx=1&amp;oq=something&amp;aq=f&amp;aqi=g5&amp;aql=1&amp;gs_sm=e&amp;gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&amp;bav=on.2,or.r_gc.r_pw.&amp;fp=d31248080af7dd23&amp;biw=1440&amp;bih=788</a> <span class="echo-streamserver-controls-stream-item-tag">12345678901234567890</span>'
		}, {
			"description": "bodyLink: 20, tag: 10, body: no limit",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags", "urls", "newlines"],
					"html": ["smileys", "hashtags", "urls", "newlines"],
					"xhtml": ["smileys", "hashtags", "urls"]
				},
				"limits": {
					"maxBodyLinkLength": 20,
					"maxBodyCharacters": undefined,
					"maxTagLength": 10
				}
			},
			"data": {
				"object": {
					"content": contentLimits
				}
			},
			"expect": '1234567890 <span>qwertyuiop</span> <a href="https://encrypted.google.com/#sclient=psy&amp;hl=en&amp;source=hp&amp;q=something&amp;pbx=1&amp;oq=something&amp;aq=f&amp;aqi=g5&amp;aql=1&amp;gs_sm=e&amp;gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&amp;bav=on.2,or.r_gc.r_pw.&amp;fp=d31248080af7dd23&amp;biw=1440&amp;bih=788">https://encrypted.go...</a> <span class="echo-streamserver-controls-stream-item-tag" title="12345678901234567890">1234567890...</span>'
		}, {
			"description": "bodyLink: 20, tag: 10, body: 50",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags", "urls", "newlines"],
					"html": ["smileys", "hashtags", "urls", "newlines"],
					"xhtml": ["smileys", "hashtags", "urls"]
				},
				"limits": {
					"maxBodyLinkLength": 20,
					"maxBodyCharacters": 50,
					"maxTagLength": 10
				}
			},
			"data": {
				"object": {
					"content": contentLimits
				}
			},
			"expect": '1234567890 <span>qwertyuiop</span> <a href="https://encrypted.google.com/#sclient=psy&amp;hl=en&amp;source=hp&amp;q=something&amp;pbx=1&amp;oq=something&amp;aq=f&amp;aqi=g5&amp;aql=1&amp;gs_sm=e&amp;gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&amp;bav=on.2,or.r_gc.r_pw.&amp;fp=d31248080af7dd23&amp;biw=1440&amp;bih=788">https://encrypted.go...</a> <span class="echo-streamserver-controls-stream-item-tag" title="12345678901234567890">1234</span>'
		}, {
			"description": "bodyLink: 10, tag: 10, body: 20",
			"config": {
				"contentTransformations": {
					"text": ["smileys", "hashtags", "urls", "newlines"],
					"html": ["smileys", "hashtags", "urls", "newlines"],
					"xhtml": ["smileys", "hashtags", "urls"]
				},
				"limits": {
					"maxBodyLinkLength": 10,
					"maxBodyCharacters": 20,
					"maxTagLength": 10
				}
			},
			"data": {
				"object": {
					"content": contentLimits
				}
			},
			"expect": '1234567890 <span>qwertyuio</span>'
		}]);
	}
};

suite.prototype._runBodyCases = function(cases) {
	var self = this;
	var template =
		'<div class="echo-streamserver-controls-stream-item-body">' +
			'<span class="echo-streamserver-controls-stream-item-text"></span>' +
			'<span class="echo-streamserver-controls-stream-item-textEllipses">...</span>' +
			'<span class="echo-streamserver-controls-stream-item-textToggleTruncated"></span>' +
		+ '</div>';	
	$.each(cases, function(i, params) {
		new Echo.StreamServer.Controls.Stream.Item($.extend({
			"target": self.config.target,
			"appkey": self.config.appkey,
			"parent": suite._streamConfigData,
			"render": true,
			"ready": function() {
				var element = $(".echo-streamserver-controls-stream-item-body", self.config.target);
				QUnit.equal(element.find(".echo-streamserver-controls-stream-item-text").html(),
					params.expect, params.description);
			},
			"data": _normalizeEntry($.extend(true, {}, suite._itemData, params.data))
		}, params.config));
	});
};

// almost copy of Echo.StreamServer.Controls.Stream.prototype._normalizeEntry()
var _normalizeEntry = function(entry) {
	entry.normalized = true;
	// detecting actual target
	$.each(entry.targets || [], function(i, target) {
		if (target.id === target.conversationID || target.id === entry.object.id) {
			entry.target = target;
			return false;
		}
	});
	entry.object.content_type = entry.object.content_type || "text";
	entry.object.accumulators = entry.object.accumulators || {};
	$.each(["repliesCount", "flagsCount", "likesCount"], function(i, name) {
		entry.object.accumulators[name] = parseInt(entry.object.accumulators[name] || "0");
	});
	entry.object.context = entry.object.context || [];
	entry.object.flags = entry.object.flags || [];
	entry.object.likes = entry.object.likes || [];
	entry.target = entry.target || entry.targets[0] || {};
	entry.target.conversationID = entry.target.conversationID || entry.object.id;
	entry.source = entry.source || {};
	entry.provider = entry.provider || {};
	entry.unique = entry.object.id + entry.target.conversationID;
	entry.parentUnique = entry.target.id + entry.target.conversationID;
	return entry;
};

suite._itemData = {
	"id": "http://js-kit.com/activities/post/6b6850f9daf17d40d55661ce2dc24f14",
	"actor": {
		"objectTypes": ["http://activitystrea.ms/schema/1.0/person"],
		"id": "http://twitter.com/12345",
		"title": "Somebody",
		"status": "Untouched",
		"avatar": "http://cdn.echoenabled.com/images/info70.png"
	},
	"object": {
		"id": "http://example.com/ECHO/item/1311856366-373-937",
		"objectTypes": ["http://activitystrea.ms/schema/1.0/comment"],
		"permalink": "",
		"context": [{"uri": "http://example.com"}],
		"content": "1",
		"content_type": "html",
		"status": "Untouched",
		"published": "2011-07-28T12:32:46Z",
		"likes": [{
			"actor": {
				"links": [],
				"objectTypes": [
					"http://activitystrea.ms/schema/1.0/person"
				],
				"id": "http://facebook.com/1650421227",
				"title": "Tester",
				"avatar": "https://graph.facebook.com/1650421227/picture?type=large"
			},
			"published": "2012-08-27T07:52:35Z"
		}, {
			"actor": {
				"links": [],
				"objectTypes": [
					"http://activitystrea.ms/schema/1.0/person"
				],
				"id": "http://twitter.com/175752608",
				"title": "Tester2",
				"avatar": "http://a0.twimg.com/profile_images/2107898907/x_368e1249_normal.jpg"
			},
			"published": "2012-08-27T07:50:03Z"
		}],
		"accumulators": {
			"likesCount": "2"
		}
	},
	"source": {
		"name": "jskit",
		"uri": "http://js-kit.com/",
		"icon": "http://js-kit.com/favicon.ico"
	},
	"provider": {
		"name": "jskit",
		"uri": "http://aboutecho.com/",
		"icon": "http://cdn.js-kit.com/images/echo.png"
	},
	"verbs": ["http://activitystrea.ms/schema/1.0/post"],
	"postedTime": "2011-07-28T12:32:46Z",
	"targets": [{
		"id": "http://example.com",
		"conversationID": "http://example.com/ECHO/item/1311856366-373-937"
	}],
	"hasMoreChildren": "false"
};

suite._streamConfigData = {
	"children": {
		"additionalItemsPerPage": 5,
		"displaySortOrder": "chronological",
		"sortOrder": "reverseChronological",
		"moreButtonSlideTimeout": 600,
		"itemsSlideTimeout": 600,
		"maxDepth": 1
	},
	"fadeTimeout": 2800,
	"flashColor": "#ffff99",
	"itemsPerPage": 15,
	"liveUpdates": true,
	"liveUpdatesTimeout": 10,
	"liveUpdatesTimeoutMin": 3,
	"openLinksInNewWindow": false,
	"providerIcon": "//cdn.echoenabled.com/images/favicons/comments.png",
	"slideTimeout": 700,
	"sortOrder": "reverseChronological",
	"streamStateLabel": {
		"icon": true,
		"text": true
	},
	"streamStateToggleBy": "mouseover", // mouseover | button | none
	"submissionProxyURL": window.location.protocol + "//apps.echoenabled.com/v2/esp/activity",
	"query": "query_string",
	"target": $("<div>")
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Stream.Item", function(config) {
	var stream = Echo.Tests.getComponentInitializer("Echo.StreamServer.Controls.Stream");
	var ready = config.ready || function() {};
	// remove ready from the config, because we override it below
	delete config.ready;
	stream($.extend({"ready": function() {
		var item = this.threads[0];
		if (!item) return;
		ready.call(item);
	}}, config));
	return stream;
});

})(Echo.jQuery);
