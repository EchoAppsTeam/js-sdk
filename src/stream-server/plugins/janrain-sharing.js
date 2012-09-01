(function(){

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing
 * Plugin provides the ability to load JanRain sharing dialog after
 * the item has been posted using the Echo Submit control.
 * Installation procedure also includes actions on Janrain side.
 *
 * Download the "rpx_xdcomm.html" file from the JanRain application
 * dashboard (the "Deployment" -> "Social Sharing" section) and
 * place it in the root directory of your website.
 *
 * Configure the list of the necessary social sharing providers
 * in the JanRain application dashboard
 * (the "Deployment" -> "Social Sharing" -> "Choose providers" section).
 *
 * 	var identityManager = {
 * 		"width": 400,
 * 		"height": 240,
 * 		"url": "http://example.com/auth"
 * 	};
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("echo-submit"),
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
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("JanrainSharing", "Echo.StreamServer.Controls.Submit");

plugin.config = {
	/**
	 * @cfg {String} appId
	 * JanRain application ID. You can find the application ID
	 *  in the JanRain application dashboard.
	 */
	/**
	 * @cfg {String} xdReceiver
	 * Full URL of the "rpx_xdcomm.html" file, downloaded from
	 * the JanRain application dashboard.
	 */
	/**
	 * @cfg {Object} activity
	 * Configures the sharing dialog.
	 *
	 * @cfg {String} activity.sharePrompt
	 * Caption of the textarea in the sharing dialog
	 *
	 * @cfg {String} activity.shareContent
	 * Content of the message which will be shared.
	 * The following pseudo-tags can be used:
	 *
	 * + {content} - tag is replaced with the content of the item;
	 * + {domain} - tag is replaced with the current page domain.
	 *
	 * If value of shareContent parameter is not provided then
	 * the following message will be used:
	 *
	 * + "{content}" for ordinary item;
	 * + "@{author} {content}" if this is reply to tweet.
	 *
	 * @cfg {String} activity.itemURL
	 * The url where the item was posted initially.
	 *
	 * @cfg {String} activity.pageTitle
	 * The page title where this activity is taking place.
	 * This information will be displayed in the Sharing dialog
	 * if at least one of the following providers is active: 
	 * Yahoo!, Facebook or LinkedIn. If this value is not provided
	 * then the original page title will be used.
	 *
	 * @cfg {String} activity.pageDescription
	 * The page description where this activity is taking place.
	 * This information will be displayed in the Sharing dialog
	 * if at least one of the following providers is active:
	 * Facebook or LinkedIn.
	 *
	 * @cfg {Array} activity.pageImages
	 * The list of up to five images. These images are displayed
	 * as thumbnails by Facebook and LinkedIn. Facebook uses all 
	 * five images. LinkedIn uses only the first image.
	 *
	 * @cfg {String} activity.pageImages.src
	 * The absolute URL of the image.
	 *
	 * @cfg {String} activity.pageImages.href
	 * The absolute URL to which the image links.
	 */
	// actual limit is 140, reserving some space
	// for ellipses and shortened link to the page
	"maxLength": 120,
	"reducedLength": 30,
	"maxImagesCount": 5
};

plugin.enabled = function() {
	return (this.config.get("appId") && this.config.get("xdReceiver"));
};

plugin.dependencies = [{
	"loaded": function() { return !!window.RPXNOW; },
	"url": ("https:" === document.location.protocol) ?
		"https://" : "http://static." + "rpxnow.com/js/lib/rpx.js"
}];

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		var plugin = this;
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

plugin.labels = {
	/**
	 * @echo_label
	 */
	"sharePrompt": "Share your comment:"
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
	// if a reply to a tweet was posted
	var data = args.inReplyTo;
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

})();
