(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.InfiniteScroll
 * Echo Stream plugin automatically loads the next page full of items
 * when the end of the stream is displayed in the browser.
 * This produces the 'Infinite Scroll' Effect.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "InfiniteScroll"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Echo.Plugin.manifest("InfiniteScroll", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this;
	var handler = function(event) {
		var element = plugin.component.view.get("more");
		if (element && !plugin.get("requestInProgress") &&
			$.inviewport(element, {"threshold": 0})) {
				plugin.set("requestInProgress", true);
				element.click();
		}
	};
	plugin.set("scrollHandler", handler);
	$(window).on("scroll", handler);
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.onDataReceive": function(topic, args) {
		this.set("requestInProgress", false);
	}
};

plugin.methods.destroy = function() {
	$(window).off("scroll", this.get("scrollHandler"));
};

Echo.Plugin.create(plugin);

})(Echo.jQuery);
