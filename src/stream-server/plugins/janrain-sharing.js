(function($) {

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing
 * Plugin provides the ability to load JanRain sharing dialog after the item has been posted using the Echo Submit control.
 * Installation procedure also includes actions on Janrain side.
 *
 * Download the "rpx_xdcomm.html" file from the JanRain application dashboard (the "Deployment" -> "Social Sharing" section) and place it in the root directory of your website.
 *
 * Configure the list of the necessary social sharing providers in the JanRain application dashboard (the "Deployment" -> "Social Sharing" -> "Choose providers" section).
 *
 * 	var identityManager = {"width": 400, "height": 240, "url": "http://example.com/auth"};
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "JanrainSharing",
 * 			"appId": "yourJanRainAppId",
 * 			"xdReceiver": "http://your-domain.com/rpx_xdcomm.html",
 * 			"activity": {
 * 				"sharePrompt": "Share your comment:",
 * 				"shareContent": "I just commented '{content}' on {domain}",
 * 				"itemURL": "http://your-domain.com/this-page.html"
 * 			}
 * 		}]
 * 	});
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("JanrainSharing", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	if (!this.config.get("appId") || !this.config.get("xdReceiver")) return false;
};

plugin.labels = {
	"sharePrompt": "Share your comment:"
};

plugin.config = {
	"maxLength": 120, // actual limit is 140, reserving some space for ellipses and shortened link to the page
	"reducedLength": 30,
	"maxImagesCount": 5
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

plugin.methods.prepareActivity = function(act) {
	var plugin = this;
	var activity = act;
	var handlers = {
		"activity.pageDescription": function(content) {
			activity.setDescription(content);
		},
		"activity.pageTitle": function(content) {
			activity.setTitle(content);
		},
		"activity.pageImages": function(content) {
			var count = 0;
			var maxCount = plugin.config.get("maxImagesCount");
			var collection = new RPXNOW.Social.ImageMediaCollection();
			$.each(content, function(key, image) {
				if (count === maxCount) return false;
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
	var messagePattern = plugin.config.get("activity.shareContent");
	if (messagePattern) {
		return plugin.labels.get(messagePattern, {
			"domain": window.location.host,
			"content": plugin.truncate(text, plugin.config.get("reducedLength"))
		});
	}
	//TODO: fix it when plugin Reply is ready
	//if a reply to a tweet was posted
	var maxLength = plugin.config.get("maxLength");
	if (plugin.isReplyToTweet(args.inReplyTo)) {
		var author = plugin.getTweetAuthor(args.inReplyTo);
		return plugin.labels.get("@{author} {content}", {
			"author": author,
			"content": plugin.truncate(text, maxLength - author.length - 2)
		});
	}
	return plugin.truncate(text, maxLength);
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
