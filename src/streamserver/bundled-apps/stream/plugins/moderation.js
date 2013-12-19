Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/plugin",
	"echo/streamserver/bundled-apps/stream/item/plugins/moderation"
], function($, Plugin) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Moderation
 * Adds several moderation controls to change item status. Besides
 * it provides the opportunity to ban specific user or change his privileges.
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver.sdk.js
 */
var plugin = Plugin.definition("Moderation", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Moderation.onUserUpdate": function(topic, args) {
		this.events.publish({
			"topic": "onUserUpdate",
			"data": args,
			"global": false
		});
		return {"stop": ["bubble"]};
	}
};

return Plugin.create(plugin);

});
