Echo.define([
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/streamserver/bundled-apps/auth/client-widget",
	"require"
], function($, Plugin, Utils, Auth, require) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.JanrainSharing
 * Plugin provides the ability to load Janrain sharing dialog after
 * the item has been posted using the Echo Submit application.
 *
 * 	new Echo.StreamServer.BundledApps.Submit.ClientWidget({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "JanrainSharing",
 * 			"appId": "echo"
 * 		}]
 * 	});
 *
 * The plugin implementation employs the
 * <a href="http://developers.janrain.com/documentation/widgets/social-sharing-widget/users-guide/hosting-multiple-widgets/" target="_blank">Janrain recommendation</a>
 * of hosting multiple widgets to make sure that the Janrain widget initialized
 * within the plugin doesn't interfere with other Janrain Sharing widgets on the
 * same page. If you have other Janrain widgets installed on the page, please take
 * <a href="http://developers.janrain.com/documentation/widgets/social-sharing-widget/users-guide/hosting-multiple-widgets/" target="_blank">the recommendation</a>
 * into account as well.
 *
 * More information regarding the plugins installation can be found
 * in the ["How to initialize Echo components"](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver.pack.js
 * @module
 */
var plugin = Plugin.definition("JanrainSharing", "Echo.StreamServer.BundledApps.Submit.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	if (!this.config.get("alwaysShare")) {
		this.extendTemplate("insertBefore", "postButton", plugin.templates.share);
	}
};

plugin.config = {
	/**
	 * @cfg {String} appId (required)
	 * A string that identifies the application.
	 * Available from Janrain Dashboard home page under "Application info"
	 * (part of the app domain before rpxnow.com).
	 * For example in https://echo.rpxnow.com appId is "echo"
	 */
	"appId": "",

	/**
	 * @cfg {Boolean} [alwaysShare]
	 * Specifies if the "Share this" checkbox should be visible so that users
	 * could decide themselves if they want to share the posted content or not.
	 * If this parameter value is set to *true* checkbox is hidden and
	 * sharing popup always appears.
	 */
	"alwaysShare": false,

	/**
	 * @cfg {Object} [sharingWidgetConfig]
	 * Container for the options specific to Janrain Sharing widget.
	 * Full list of available options can be found in the
	 * <a href="http://developers.janrain.com/documentation/widgets/social-sharing-widget/sharing-widget-js-api/settings/" target="_blank">Sharing widget documentation</a>
	 *
	 * Example:
	 * 	{
	 * 		"shortenUrl": true
	 * 		"title": "Some page title",
	 * 		"description": "Some page description",
	 * 		"image": "http://example.com/image.png"
	 * 		// ...
	 * 	}
	 */
	"sharingWidgetConfig": {},
	"reducedLength": 30,
	"maxImagesCount": 5
};

plugin.enabled = function() {
	return this.config.get("appId");
};

plugin.events = {
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostInit": function(topic, args) {
		this.set("needShare", this.config.get("alwaysShare") || this.view.get("shareCheckbox").prop("checked"));
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostComplete": function(topic, args) {
		if (!this.get("needShare")) return;
		this._share(this._prepareData(args));
	}
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"share": "Share this comment"
};

/**
 * @echo_template
 */
plugin.templates.share =
	'<div class="echo-secondaryFont {plugin.class:shareContainer}">' +
		'<input type="checkbox" class="{plugin.class:shareCheckbox}">' +
		'<span class="{plugin.class:shareLabel}">{plugin.label:share}</span>' +
	'</div>';

plugin.methods._share = function(data) {
	var url, plugin = this;
	var callback = function() {
		plugin.set("foreignConfig", $.extend(true, {}, janrain.engage.share.getState()));
		plugin._showPopup(data);
	};
	if (window.janrain && janrain.engage && janrain.engage.share || plugin.get("janrainInitialized")) {
		callback();
		return;
	}
	plugin.set("janrainInitialized", true);

	if (typeof window.janrain !== "object") window.janrain = {};
	if (typeof janrain.settings !== "object") janrain.settings = {};
	if (typeof janrain.settings.share !== "object") janrain.settings.share = {};
	if (typeof janrain.settings.packages !== "object") janrain.settings.packages = [];
	janrain.settings.packages.push("share");
	// we can reach this line only after DOM is loaded so no need to use "onload" event
	janrain.ready = true;

	var foreignOnload = window.janrainShareOnload;
	window.janrainShareOnload = function() {
		// let the previous onload handler do its stuff first
		if (foreignOnload) {
			foreignOnload();
			window.janrainShareOnload = foreignOnload;
		}
		callback();
	};

	url = "https:" === document.location.protocol
		? "https://rpxnow.com/js/lib/" + plugin.config.get("appId") + "/widget.js"
		: "http://widget-cdn.rpxnow.com/js/lib/" + plugin.config.get("appId") + "/widget.js";
	require([url]); 
};

plugin.methods._showPopup = function(data) {
	var image, plugin = this;
	var share = janrain.engage.share;
	var idx = janrain.events.onModalClose.addHandler(function() {
		janrain.events.onModalClose.removeHandler(idx);
		share.reset();
		share.setState(plugin.get("foreignConfig"));
		plugin.remove("foreignConfig");
	});
	var config = plugin.config.get("sharingWidgetConfig");
	share.reset();
	share.setState(config);
	share.setTitle(config.title || $("meta[property=\"og:title\"]").attr("content") || document.title);
	share.setDescription(config.description || $("meta[property=\"og:description\"]").attr("content") || "");
	share.setMessage(config.message || Utils.stripTags(data.object.content));
	share.setUrl(config.url || $("meta[property=\"og:url\"]").attr("content") || location.href.replace(/([#\?][^#\?]*)+$/, ""));
	image = config.image || $("meta[property=\"og:image\"]").attr("content") || "";
	image && share.setImage(image);
	share.show();
};

plugin.methods._prepareData = function(data) {
	var item = data.postData.content[0];
	return {
		"origin": "submit",
		"actor": {
			"id": this.component.user.get("identityUrl"),
			"name": item.actor.name,
			"avatar": item.actor.avatar
		},
		"object": {
			"id": data.request.response.objectID,
			"content": item.object.content
		},
		"source": item.source,
		"target": data.targetURL
	};
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

plugin.css =
	'.{plugin.class:shareContainer} { display: inline-block; margin: 0px 15px 0px 0px; }' +
	'.echo-sdk-ui .{plugin.class:shareContainer} input.{plugin.class:shareCheckbox} { margin: 0px; margin-right: 3px; padding: 0px; }';

return Plugin.create(plugin);

});
