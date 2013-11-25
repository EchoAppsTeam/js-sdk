(function($) {

var plugin = "Echo.StreamServer.Apps.Submit.Plugins.Edit";

Echo.Tests.module(plugin, {
	"meta": {
		"className": plugin
	}
});

Echo.Tests.pluginRenderersTest(plugin, {
	"targetURL": "http://example.com/js-sdk/"
});

})(Echo.jQuery);
