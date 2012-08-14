(function() {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.TwitterIntents
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "TwitterIntents"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("TwitterIntents", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.config = {
};

plugin.labels = {
	"tweet": "Reply",
	"retweet": "Retweet",
	"favorite": "Favorite",
	"comment": "Comment"
};

plugin.dependencies = [{
	"loaded": function() { return !!window.twttr; },
	"url": "http://platform.twitter.com/widgets.js"
}];

plugin.init = function() {
	var item = this.component;

	var config = item.config.get("contentTransformations");
	$.map(["text", "html", "xhtml"], function(contentType) {
		config[contentType].hashtags = false;
	});

	item.config.set("contentTransformations", config);
	item.config.set("plugins.Like.enabled", false);
	item.config.set("plugins.Reply.enabled", false);

	this.extendTemplate("insertBefore", "authorName", plugin.templates.usernameTemplate);
	this.extendTemplate("insertBefore", "date", plugin.templates.twitterIcon);

	item.addButtonSpec(this.name, this._assembleButton("tweet"));
	item.addButtonSpec(this.name, this._assembleButton("retweet"));
	item.addButtonSpec(this.name, this._assembleButton("favorite"));
};

plugin.enabled = function() {
	var item = this.component;
	return this.isTweet(item);
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.onRender": function(topic, args) {
		var activeClass = this.cssPrefix + "activeButton";
		var item = this.component;
		if( this.isTweet(item) ) {
			$.map(item.buttons[this.name], function(name) {
				name.element.unbind("click").unbind("mouseover mouseout")
					.hover(
						function() { name.element.addClass(activeClass); },
						function() { name.element.removeClass(activeClass); }
					);
			});
			window.twttr.widgets.load();
		}
	}
};

plugin.templates = {
	"usernameTemplate": '<div class="{plugin.class:tweetUserName} echo-linkColor"></div>',
	"twitterIcon": '<div class="{plugin.class:twitterIcon}"></div>'
};

plugin.component.renderers.authorName = function(element) {
	var item = this.component;
	return element.append(item.data.actor.title).removeClass("echo-linkColor").addClass(this.cssPrefix + "tweetScreenName echo-secondaryColor");
};

plugin.component.renderers._buttonsDelimiter = function(element) {
	var item = this.component;
	var result = item.parentRenderer("_buttonsDelimiter", arguments);
	var posDelimiter = item.buttonSpecs[this.name].length;

	element.find("span[class*='button-delim']").eq(posDelimiter).text(" | ");

	return result;
};

plugin.component.renderers.via = function(element) {
	var item = this.component;
	var provider = Echo.Utils.hyperlink({
		"href": item.data.provider.uri,
		"caption": item.data.provider.name
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	});
	element.html('&nbsp;' + item.labels.get("viaLabel") + '&nbsp;' + provider);
	return item.parentRenderer("via", arguments);
};

plugin.component.renderers.from = function(element) {
	var item = this.component;
	var source = Echo.Utils.hyperlink({
		"href": item.data.source.uri,
		"caption": item.data.source.name
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	});
	element.html('&nbsp;' + item.labels.get("fromLabel") + '&nbsp;' + source);
	return item.parentRenderer("from", arguments);
};

plugin.component.renderers.date = function(element) {
	var item = this.component;
	item._calcAge();

	var date = Echo.Utils.hyperlink({
		"caption": item.age,
		"href": item.data.object.id,
		"class": this.cssPrefix + "date"
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	});

	return element.html(date);
};

plugin.renderers.twitterIcon = function(element) {
	var item = this.component;
	var icon = Echo.Utils.hyperlink({
		"caption": '<img src="'+ item.data.source.icon+ '"/>',
		"href": item.data.source.uri,
		"class": ""
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	});
	return element.html(icon);
};

plugin.renderers.tweetUserName = function(element) {
	var item = this.component;
	return element.html(Echo.Utils.hyperlink({
		"href": item.data.actor.id,
		"caption": this.extractTwitterID(item)
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	}));
};

plugin.methods._assembleButton = function(name) {
	var plugin = this, item = this.component;
	var match = item.data.object.id.match(/\/(\d+)$/);
	var id = match && match[1];
	return function() {
		return {
			"name": name,
			"label": plugin.labels.get(name),
			"template": Echo.Utils.hyperlink({
				"href": "https://twitter.com/intent/" + name + "?in_reply_to=" + id + "&tweet_id=" + id,
				"class": "echo-clickable " + plugin.cssPrefix + "intentControl echo-secondaryColor",
				"caption":
					'<span class="' + plugin.cssPrefix + 'icon ' + plugin.cssPrefix + 'icon-{data:name}">&nbsp;</span>' +
					'<span>{data:label}</span>'
			}, {
				"openInNewWindow": item.config.get("openLinksInNewWindow"),
				"skipEscaping": true
			}),
			"visible": id && plugin.isTweet(item)
		};
	};
};

plugin.methods.isTweet = function(item) {
	return item.data.source.name == "Twitter";
};

plugin.methods.extractTwitterID = function(item) {
	var match = item.data.actor.id.match(/twitter.com\/(.*)/);
	return match ? match[1] : item.data.actor.id;
};

plugin.css =
	".{class:avatar} a img { border: 0px; }" +
	".{plugin.class:userName} { float: left; font-size: 15px; font-weight: bold; }" +
	".{plugin.css:screenName} { margin-left: 4px; font-size: 11px; font-weight: normal; padding-top: 1px; }" +
	".{plugin.class:userName} a, .{plugin.class:tweetUserName} a, .{plugin.class:intentControl} { text-decoration: none; }" +
	".{plugin.class:icon} { width: 15px; height: 15px; display: inline-block; margin-right: 3px; background: url(https://si0.twimg.com/images/dev/cms/intents/icons/sprites/everything-spritev2.png) no-repeat; }" +
	".{plugin.class:icon-tweet} { background-position: 0px -2px; }" +
	".{plugin.class:icon-retweet} { background-position: -80px -2px; }" +
	".{plugin.class:icon-favorite} { background-position: -32px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:icon-tweet} { background-position: -16px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:icon-retweet} { background-position: -96px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:icon-favorite} { background-position: -48px -2px; }" +
	".{plugin.class:tweetUserName} { float: left; font-size: 15px; font-weight: bold; }" +
	".{plugin.class:twitterIcon} { float: left; margin-right: 3px; }" +
	".{plugin.class:date} { text-decoration: none; color: #C6C6C6; }" +
	".{plugin.class:date}:hover { color: #476CB8; }" +
	".{plugin.class:tweetScreenName} { font-size: 11px; font-weight: normal; margin-left: 4px; padding-top: 1px; }";

Echo.Plugin.create(plugin);

})();