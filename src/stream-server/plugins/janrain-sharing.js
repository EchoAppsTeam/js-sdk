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

plugin.enabled = function() {
	return (this.config.get("appId") && this.config.get("xdReceiver"));
};

plugin.labels = {
	"sharePrompt": "Share your comment:"
};

plugin.config = {
	// actual limit is 140, reserving some space
	// for ellipses and shortened link to the page
	"maxLength": 120,
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
				plugin._prepareContent(args),
				plugin.config.get("activity.itemURL", args.targetURL)
			);
			RPXNOW.Social.publishActivity(plugin._prepareActivity(activity));
		});
	}
};

plugin.methods._prepareActivity = function(act) {
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

plugin.methods._prepareContent = function(args) {
	var plugin = this;
	var text = Echo.Utils.stripTags(args.postData.content[0].object.content);
	var messagePattern = plugin.config.get("activity.shareContent");
	if (messagePattern) {
		return plugin.labels.get(messagePattern, {
			"domain": window.location.host,
			"content": plugin._truncate(text, plugin.config.get("reducedLength"))
		});
	}
	//if a reply to a tweet was posted
	var data = args.postData.inReplyTo;
	var maxLength = plugin.config.get("maxLength");
	if (plugin._isReplyToTweet(data)) {
		var author = plugin._getTweetAuthor(data);
		return plugin.labels.get("@{author} {content}", {
			"author": author,
			"content": plugin._truncate(text, maxLength - author.length - 2)
		});
	}
	return plugin._truncate(text, maxLength);
};

plugin.methods._truncate = function(text, limit) {
	return (limit > 0 && text.length > limit) ? text.substring(0, limit) + "..." : text;
};

plugin.methods._isReplyToTweet = function(data) {
	return !!(data && data.source && data.source.name === "Twitter");
};

plugin.methods._getTweetAuthor = function(data) {
	return data.actor.id.replace(/https?\:\/\/twitter\.com\//, "");
};

Echo.Plugin.create(plugin);