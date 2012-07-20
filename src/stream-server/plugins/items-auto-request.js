(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.ItemsAutorequest
 * Echo Stream plugin automatically loads the next page full of items when the end of the stream is displayed on the browser screen. This produces an 'Infinite Scroll' Effect.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "ItemsAutoRequest"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.skeleton("ItemsAutoRequest", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this;
	$(window).bind("scroll", function(event) {
		var element = plugin.component.dom && plugin.component.dom.get("more");
		if (element && !plugin.get("requestInProgress") && $.inviewport(element, {"threshold": 0})) {
			plugin.set("requestInProgress", true);
			element.click();
		}
	});	
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.onDataReceive": function(topic, args) {
		this.set("requestInProgress", false);
	}
};

Echo.Plugin.create(plugin);

})(jQuery);
