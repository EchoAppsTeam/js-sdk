(function() {

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.TwitterIntents
 * Adds the Twitter intents controls into the item UI and updates the item UI to look and behave like a Twitter item. The item UI update includes:
 *
 * + by clicking on the avatar or the user name - the user account on Twitter will be opened;
 * + the item timestamp transforms from a static field to a permanent item link on Twitter.
 *
 * More information about Twitter Intents is available on the page <https://dev.twitter.com/docs/intents>.
 *
 * #### How to use
 * To enable this plugin should be taken add the corresponding section into the Echo Stream configuration parameter plugins:
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "TwitterIntents"
 *         }]
 *     });
 *
 * <b>Note</b>: plugin must be at the very beginning of the plugin list to work correctly.
 *
 * <b>Note</b>: if TwitterIntents plugin is added to the stream then Reply and Like plugins will be disabled for tweet items. Moreover Reply control is renamed with Comment on non-tweet items to avoid possible confusion.
 *
 * #### Configuration
 * The TwitterIntents plugin configuration options include the following:
 *
 * + enabled <br/>
 *   This parameter specifies if plugin is enabled during application initialization.
 *   See more [here](http://wiki.aboutecho.com/Client-Extensions-Framework#Enabling/disablingpluginsinrealtime).
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("TwitterIntents", "Echo.StreamServer.Controls.Stream.Item");

plugin.init = function() {
	var item = this.component;

	var config = item.config.get("contentTransformations");
	$.map(["text", "html", "xhtml"], function(contentType) {
		config[contentType].hashtags = false;
	});

	item.config.set("contentTransformations", config);
	item.config.set("plugins.Like.enabled", false);
	item.config.set("plugins.Reply.enabled", false);

	this.extendTemplate("insertBefore", "authorName", plugin.templates.username);

	item.addButtonSpec(this.name, this._assembleButton("tweet"));
	item.addButtonSpec(this.name, this._assembleButton("retweet"));
	item.addButtonSpec(this.name, this._assembleButton("favorite"));
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"tweet": "Reply",
	/**
	 * @echo_label
	 */
	"retweet": "Retweet",
	/**
	 * @echo_label
	 */
	"favorite": "Favorite",
	/**
	 * @echo_label
	 */
	"comment": "Comment"
};

plugin.dependencies = [{
	"loaded": function() { return !!window.twttr; },
	"url": "http://platform.twitter.com/widgets.js"
}];

plugin.enabled = function() {
	return this._isTweet();
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.onRender": function(topic, args) {
		var activeClass = this.cssPrefix + "activeButton";
		var item = this.component;
		$.map(item.buttons[this.name], function(name) {
			name.element.unbind("click").unbind("mouseover mouseout")
				.hover(
					function() { name.element.addClass(activeClass); },
					function() { name.element.removeClass(activeClass); }
				);
		});
		window.twttr && window.twttr.widgets.load();
	}
};

plugin.templates.username = '<div class="{plugin.class:tweetUserName} echo-linkColor"></div>';

/**
 * @echo_renderer
 */
plugin.component.renderers.authorName = function(element) {
	var item = this.component;
	return item.parentRenderer("authorName", arguments)
		.removeClass("echo-linkColor")
		.addClass(this.cssPrefix + "tweetScreenName echo-secondaryColor");
};

/**
 * @echo_renderer
 */
plugin.component.renderers.avatar = function(element) {
	var item = this.component;
	return item.parentRenderer("avatar", arguments).wrap(
		Echo.Utils.hyperlink({
			"href": item.get("data.actor.id"),
			"caption": ""
		}, {
			"openInNewWindow": item.config.get("openLinksInNewWindow"),
			"skipEscaping": true
		})
	);
};

/**
 * @echo_renderer
 */
plugin.component.renderers.date = function(element) {
	var item = this.component;
	return item.parentRenderer("date", arguments).wrap(
		Echo.Utils.hyperlink({
			"caption": "",
			"href": item.get("data.object.id"),
			"class": this.cssPrefix + "date"
		}, {
			"openInNewWindow": item.config.get("openLinksInNewWindow"),
			"skipEscaping": true
		})
	);
};

plugin.component.renderers._buttonsDelimiter = function(element) {
	var item = this.component;
	var posDelimiter = item.buttonSpecs[this.name].length;

	return item.parentRenderer("_buttonsDelimiter", arguments)
		.find("span[class*='button-delim']").eq(posDelimiter).text(" | ");
};

/**
 * @echo_renderer
 */
plugin.renderers.tweetUserName = function(element) {
	var item = this.component;
	return element.html(Echo.Utils.hyperlink({
		"href": item.get("data.actor.id"),
		"caption": this._extractTwitterID()
	}, {
		"openInNewWindow": item.config.get("openLinksInNewWindow"),
		"skipEscaping": true
	}));
};

plugin.methods._assembleButton = function(name) {
	var plugin = this, item = this.component;
	var match = item.get("data.object.id").match(/\/(\d+)$/);
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
			"visible": id && plugin._isTweet()
		};
	};
};

plugin.methods._isTweet = function() {
	var item = this.component;
	return item.get("data.source.name") === "Twitter";
};

plugin.methods._extractTwitterID = function() {
	var item = this.component;
	var match = item.get("data.actor.id").match(/twitter.com\/(.*)/);
	return match ? match[1] : item.get("data.actor.id");
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
