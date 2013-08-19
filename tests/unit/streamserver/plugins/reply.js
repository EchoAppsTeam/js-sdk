(function($) {

var plugin = "Echo.StreamServer.Controls.Stream.Item.Plugins.Reply";

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

})(Echo.jQuery);
