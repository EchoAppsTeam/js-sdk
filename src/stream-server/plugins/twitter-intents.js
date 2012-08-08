(function($) {

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

plugin.init = function() {
	var self = this;
	var item = this.component;
	this.extendTemplate("insertBefore", "authorName", plugin.usernameTemplate);



	//item.addButtonSpec("Moderation", self._assembleButton(capitalize(action)));
	//this.events.subscribe({
	//	"topic": "internal.Echo.StreamServer.Controls.Stream.Item.Plugin.Moderation.onUserUpdate",
	//	"handler": function(topic, args) {
	//		if (args.item.data.actor.id !== item.data.actor.id) return;
	//		item.data.actor[args.data.field] = args.data.value;
	//		item.render();
	//		return {"stop": ["bubble"]};
	//	}
	//});
};

plugin.usernameTemplate = '<span class="{plugin.class}tweetUserName echo-linkColor"></span>';

plugin.labels = {
	"reply": "Reply",
	"retweet": "Retweet",
	"favorite": "Favorite",
	"comment": "Comment"
};

plugin.renderers.status = function(element) {
};

plugin.methods._assembleButton = function(name) {
};

plugin.css =
	".{class:avatar} a img { border: 0px; }" +
	".{plugin.class:userName} { float: left; font-size: 15px; font-weight: bold; }" +
	".{plugin.css:screenName} { margin-left: 4px; font-size: 11px; font-weight: normal; padding-top: 1px; }" +
	".{plugin.class:userName} a, .{plugin.class:intentControl} { text-decoration: none; }" +
	".{plugin.class:permalink} { float: left; text-decoration: none; }" +
	".{plugin.class:permalink} .{class:item-date} { float: none; }" +
	".{plugin.class:icon} { width: 15px; height: 15px; display: inline-block; margin-right: 3px; background: url(https://si0.twimg.com/images/dev/cms/intents/icons/sprites/everything-spritev2.png) no-repeat; }" +
	".{plugin.class:iconReply} { background-position: 0px -2px; }" +
	".{plugin.class:iconRetweet} { background-position: -80px -2px; }" +
	".{plugin.class:iconFavorite} { background-position: -32px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:iconReply} { background-position: -16px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:iconRetweet} { background-position: -96px -2px; }" +
	".{plugin.class:activeButton} .{plugin.class:iconFavorite} { background-position: -48px -2px; }";

Echo.Plugin.create(plugin);

})(jQuery);
