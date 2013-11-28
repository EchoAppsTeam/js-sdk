Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"echo/streamserver/plugins/reply"
], function($) {

"use strict";

var plugin = "Echo.StreamServer.Apps.Stream.Item.Plugins.Reply";

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
