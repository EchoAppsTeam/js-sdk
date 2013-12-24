Echo.Tests.Units.push(function(callback) {
	"use strict";

	Echo.require([
		"jquery",
		"loadFrom![echo/streamserver.sdk]echo/streamserver/bundled-apps/stream/item/plugins/reply"
	], function($) {

	var plugin = "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply";

	Echo.Tests.module(plugin, {
		"meta": {
			"className": plugin,
			"functions": [
				"destroy"
			]
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
