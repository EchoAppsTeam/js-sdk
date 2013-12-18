Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/plugin",
	"echo/streamserver/bundled-apps/stream/item/plugins/moderation"
], function($, Plugin) {

"use strict";

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
