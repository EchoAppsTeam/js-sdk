Echo.define([
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/variables",
	"echo/streamserver/bundled-apps/submit/client-widget",
	"echo/streamserver/bundled-apps/stream/item/plugins/reply",
	"echo/streamserver/bundled-apps/submit/plugins/reply"
], function($, Plugin, Utils, Variables, Submit) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Reply
 * Proxies the "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onExpand"
 * event on the Stream application level.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Reply"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.definition("Reply", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onExpand": function(topic, args) {
		/**
		 * @echo_event Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Reply.onFormExpand
		 * Triggered if reply form is expanded.
		 */
		this.events.publish({
			"topic": "onFormExpand",
			"data": {
			    "context": args.context
			}
		});
	}
};

return Plugin.create(plugin);

});
