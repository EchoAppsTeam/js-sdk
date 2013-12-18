Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"loadFrom![echo/streamserver.pack]echo/streamserver/bundled-apps/stream/item/plugins/item-accumulator-display"
	], function($) {

	"use strict";

	var plugin = "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.ItemAccumulatorDisplay";

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
