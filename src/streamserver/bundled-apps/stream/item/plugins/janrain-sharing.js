Echo.define([
	"jquery",
	"echo/plugin",
	"echo/gui",
	"echo/streamserver/bundled-apps/submit/client-widget",
	"echo/streamserver/bundled-apps/submit/plugins/janrain-sharing"
], function($, Plugin, GUI, Submit) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.JanrainSharing
 * Plugin provides the ability to load JanRain sharing dialog clicking
 * the "Share" button in the item.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
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
var plugin = Plugin.definition("JanrainSharing", "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget");

plugin.init = function() {
	this.component.addButtonSpec("Share", this._assembleButton());
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
	 * @cfg {Object} [sharingWidgetConfig]
	 * Container for the options specific to Janrain Sharing widget.
	 * Full list of available options can be found in the
	 * <a href="http://developers.janrain.com/documentation/widgets/social-sharing-widget/sharing-widget-js-api/settings/" target="_blank">Sharing widget documentation</a>
	 *
	 * Example:
	 * 	{
	 * 		"shortenUrl": true,
	 * 		"title": "Some page title",
	 * 		"description": "Some page description",
	 * 		"image": "http://example.com/image.png"
	 * 		// ...
	 * 	}
	 */
	"sharingWidgetConfig": {}
};

plugin.enabled = function() {
	return this.config.get("appId");
};

plugin.labels = {
	"shareButton": "Share"
};

// let's copy these functions from the related plugin for Submit Application
plugin.methods._share = Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.JanrainSharing.prototype._share;
plugin.methods._showPopup = Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.JanrainSharing.prototype._showPopup;

plugin.methods._prepareData = function(item) {
	return {
		"origin": "item",
		"actor": {
			"id": item.actor.id,
			"name": item.actor.title,
			"avatar": item.actor.avatar
		},
		"object": {
			"id": item.object.id,
			"content": item.object.content
		},
		"source": item.source,
		"target": item.target.id
	};
};

plugin.methods._assembleButton = function() {
	var plugin = this, item = this.component;
	var callback = function() {
		plugin._share(plugin._prepareData(item.get("data")));
	};
	return function() {
		var item = this;
		return {
			"name": "Share",
			"label": plugin.labels.get("shareButton"),
			"callback": callback
		};
	};
};

return Plugin.create(plugin);

});

