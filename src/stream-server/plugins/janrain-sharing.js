(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.JanrainSharing")) return;

var plugin = Echo.Plugin.skeleton("JanrainSharing");

plugin.applications = ["Echo.StreamServer.Controls.Submit"];

plugin.init = function() {
	if (!this.config.get("appId") || !this.config.get("xdReceiver")) return;
};

plugin.labels = {
	"sharePrompt": "Share your comment:"
};

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		var plugin = this;
		//TODO: using Echo.Loader when it's ready
		RPXNOW.init({
			"appId": plugin.config.get("appId"),
			"xdReceiver": plugin.config.get("xdReceiver")
		});
		RPXNOW.loadAndRun(["Social"], function () {
			var activity = new RPXNOW.Social.Activity(
				plugin.config.get("activity.sharePrompt", plugin.labels.get("sharePrompt")),
				plugin.prepareContent(args),
				plugin.config.get("activity.itemURL", args.targetURL)
			);
			RPXNOW.Social.publishActivity(plugin.prepareActivity(activity));
		});
	}
};

plugin.methods.prepareActivity = function(activity) {
	var plugin = this;
	var handlers = {
		"activity.pageDescription": function(content) {
			activity.setDescription(content);
		},
		"activity.pageTitle": function(content) {
			activity.setTitle(content);
		},
		"activity.pageImages": function(content) {
			var count = 0;
			var collection = new RPXNOW.Social.ImageMediaCollection();
			$.each(content, function(key, image) {
				if (count == 5) return false;
				if (image.src && image.href) {
					collection.addImage(image.src, image.href);
					count++;
				}
			});
			activity.setMediaItem(collection);
		}
	};
	$.each(handlers, function(key, handler){
		if (plugin.config.get(key)) {
			handler(plugin.config.get(key));
		}
	});
	return activity;
};

plugin.methods.prepareContent = function(args) {
	var plugin = this;
	var text = Echo.Utils.stripTags(args.postData[0].object.content);
	var customShareMessagePattern = plugin.config.get("activity.shareContent");
	if (customShareMessagePattern) {
		return plugin.labels.get(customShareMessagePattern, {
			"domain": window.location.host,
			"content": plugin.truncate(text, 30)
		});
	}
	//TODO: fix it when plugin Reply is ready
	//if a reply to a tweet was posted
	if (plugin.isReplyToTweet(args.inReplyTo)) {
		var author = plugin.getTweetAuthor(args.inReplyTo);
		return plugin.labels.get("@{author} {content}", {
			"author": author,
			"content": plugin.truncate(text, plugin.contentMaxLength - author.length - 2)
		});
	}
	return plugin.truncate(text, plugin.contentMaxLength);
};

plugin.methods.truncate = function(text, limit) {
	return (limit > 0 && text.length > limit) ? text.substring(0, limit) + "..." : text;
};

plugin.methods.isReplyToTweet = function(item) {
	return !!(item && item.source && item.source.name == "Twitter");
};

plugin.methods.getTweetAuthor = function(item) {
	return item.actor.id.replace(/https?\:\/\/twitter\.com\//, "");
};

Echo.Plugin.create(plugin);

})(jQuery);
