Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/streamserver/plugins/communityFlag"
	], function($) {

	"use strict";

	var plugin = "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.CommunityFlag";

	Echo.Tests.module(plugin, {
		"meta": {
			"className": plugin
		}
	});

	Echo.Tests.pluginRenderersTest(plugin, {
		"query": "childrenof:http://example.com/js-sdk/",
		"liveUpdates": {
			"enabled": false
		}
	});
	callback();
	});
});
