Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/streamserver/plugins/textCounter"
	], function($) {

	"use strict";

	var plugin = "Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.TextCounter";

	Echo.Tests.module(plugin, {
		"meta": {
			"className": plugin
		}
	});

	Echo.Tests.pluginRenderersTest(plugin, {
		"targetURL": "http://example.com/js-sdk/"
	});
	callback();
	});
});
