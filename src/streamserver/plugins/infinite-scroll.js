(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * Echo Stream plugin automatically loads the next page full of items
 * when the end of the stream is displayed in the browser.
 * This produces the 'Infinite Scroll' Effect.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "InfiniteScroll"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("InfiniteScroll", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this;
	$(window).on("scroll", function(event) {
		var element = plugin.component.view.get("more");
		if (element && !plugin.get("requestInProgress") &&
			$.inviewport(element, {"threshold": 0})) {
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

})(Echo.jQuery);
