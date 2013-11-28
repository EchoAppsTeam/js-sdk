Echo.require([
	"jquery",
	"echo/streamserver/plugins/textCounter"
], function($) {

"use strict";

var plugin = "Echo.StreamServer.Apps.Submit.Plugins.TextCounter";

Echo.Tests.module(plugin, {
	"meta": {
		"className": plugin
	}
});

Echo.Tests.pluginRenderersTest(plugin, {
	"targetURL": "http://example.com/js-sdk/"
});

});
