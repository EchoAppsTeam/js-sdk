Echo.Tests.Units.push(function(callback) {
	"use strict";

	Echo.require([
		"jquery",
		"loadFrom![echo/streamserver.sdk]echo/streamserver/bundled-apps/submit/plugins/edit"
	], function($) {

	var plugin = "Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit";

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
