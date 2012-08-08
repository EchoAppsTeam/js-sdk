(function($) {

var suite = Echo.Tests.Unit.Stream = function() {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.bodyRendererTest = {
	"check": function() {
		var contentTransform = '1 :) <b>$$<u>DD</u>$$<i>#88</i></b> 5#\n<a href="http://">#asd</a>\n<a href="http://ya.ru">http://ya.ru</a>\n\n\nhttp://google.com/#qwerty';
		var contentLimits = '1234567890 <span>qwertyuiop</span> https://encrypted.google.com/#sclient=psy&hl=en&source=hp&q=something&pbx=1&oq=something&aq=f&aqi=g5&aql=1&gs_sm=e&gs_upl=1515l3259l0l4927l9l7l0l4l4l0l277l913l0.1.3l4l0&bav=on.2,or.r_gc.r_pw.&fp=d31248080af7dd23&biw=1440&bih=788 #12345678901234567890';
		_runTestCases([{
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

var _createItem = function(data, config) {
	return new Echo.StreamServer.Controls.Stream.Item($.extend({
		"target": $("<div>"),
		"appkey": "test.js-kit.com",
		"parent": _streamConfigData,
		"data": _normalizeEntry($.extend(true, {}, _itemData, data))
	}, config));
};

var _runTestCases = function(cases) {
	var template =
		'<div class="echo-streamserver-controls-stream-item-body">' +
			'<span class="echo-streamserver-controls-stream-item-text"></span>' +
			'<span class="echo-streamserver-controls-stream-item-textEllipses">...</span>' +
			'<span class="echo-streamserver-controls-stream-item-textToggleTruncated"></span>' +
		+ '</div>';
	$.each(cases, function(i, params) {
		var item = _createItem(params.data, params.config);
		var element = item.dom.render({"template": template});
		QUnit.equal(element.find(".echo-streamserver-controls-stream-item-text").html(), params.expect, params.description);
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

var _itemData = {
	"id": "http://js-kit.com/activities/post/6b6850f9daf17d40d55661ce2dc24f14",
	"actor": {
		"objectTypes": ["http://activitystrea.ms/schema/1.0/person"],
		"id": "http://twitter.com/12345",
		"title": "Somebody",
		"status": "Untouched"
	},
	"object": {
		"id": "http://example.com/ECHO/item/1311856366-373-937",
		"objectTypes": ["http://activitystrea.ms/schema/1.0/comment"],
		"permalink": "",
		"context": [{"uri": "http://example.com"}],
		"content": "1",
		"content_type": "html",
		"status": "Untouched",
		"published": "2011-07-28T12:32:46Z"
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
	}]
};

var _streamConfigData = {
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

var _itemConfigData = {
	"aggressiveSanitization": false,
	"buttonsOrder": undefined,
	"contentTransformations": {
		"text": ["smileys", "hashtags", "urls", "newlines"],
		"html": ["smileys", "hashtags", "urls", "newlines"],
		"xhtml": ["smileys", "hashtags", "urls"]
	},
	"limits": {
		"maxBodyCharacters": undefined,
		"maxBodyLines": undefined,
		"maxBodyLinkLength": 50,
		"maxMarkerLength": 16,
		"maxReLinkLength": 30,
		"maxReTitleLength": 143,
		"maxTagLength": 16
	},
	"optimizedContext": true,
	"reTag": true,
	"viaLabel": {
		"icon": false,
		"text": false
	}
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Stream", function(config) {
	return new Echo.StreamServer.Controls.Stream($.extend({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"appkey": config.appkey,
		"query": "childrenof:" + config.dataBaseLocation + " sortOrder:repliesDescending"
	}, config));
});

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
