Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/plugin",
	"echo/streamserver/bundled-apps/stream/item/plugins/pinboard-visualization",
	"isotope"
], function($, Plugin) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.PinboardVisualization
 * The PinboardVisualization plugin transforms Echo Stream Client visualization
 * into a pinboard-style representation. The plugin extracts all media (such as
 * images, videos, etc) from the item content and assembles the mini media
 * gallery inside the item UI. You can find UI example of the plugin
 * <a href="http://echoappsteam.github.io/js-sdk/demo/pinboard.html">here</a>.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "PinboardVisualization"
 * 		}]
 * 	});
 *
 * __Note__: the "PinboardVisualization" plugin is not included into the
 * StreamServer JS package (streamserver.sdk.js). Please include the
 * scripts below (production and development versions respectively) to
 * load the "PinboardVisualization" plugin:
 *
 * + http://cdn.echoenabled.com/sdk/v3.1/streamserver/bundled-apps/stream/plugins/pinboard-visualization.js
 * + http://cdn.echoenabled.com/sdk/v3.1/dev/streamserver/bundled-apps/stream/plugins/pinboard-visualization.js
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/bundled-apps/stream/plugins/pinboard-visualization.js
 * @module
 */
var plugin = Plugin.definition("PinboardVisualization", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

var ua = navigator.userAgent.toLowerCase();
var isMozillaBrowser = !!(
		!~ua.indexOf("chrome")
		&& !~ua.indexOf("webkit")
		&& !~ua.indexOf("opera")
		&& (
			/(msie) ([\w.]+)/.exec(ua)
			|| ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		)
	);

plugin.config = {
	/**
	 * @cfg {Object} isotope
	 * Allows to configure the Isotope jQuery plugin, used by the plugin as the
	 * rendering engine. The possible config values can be found at the Isotope
	 * plugin homepage ([http://isotope.metafizzy.co/](http://isotope.metafizzy.co/)). It's NOT recommended to
	 * change the settings of the Isotope unless it's really required.
	 *
	 *__Note__: the Isotope JS library doesn't work in IE <a href="http://en.wikipedia.org/wiki/Quirks_mode">quirks mode</a>.
	 * Due to this fact you should declare the necessary <a href="http://en.wikipedia.org/wiki/DOCTYPE"><DOCTYPE\></a>
	 * on the page. We recommend to use a
	 * <a href="http://en.wikipedia.org/wiki/DOCTYPE#HTML5_DTD-less_DOCTYPE">HTML5 DOCTYPE</a> declaration.
	 */
	"isotope": {
		"animationOptions": {
			// change duration for mozilla browsers
			"duration": isMozillaBrowser ? 0 : 2750,
			"easing": "linear",
			"queue": false
		},
		// use only jQuery engine for animation in mozilla browsers
		// due to the issues with video display with CSS transitions
		"animationEngine": isMozillaBrowser ? "jquery" : "best-available"
	}
};

plugin.init = function() {
	// display an item immediately (cancel the slide down animation)
	// to let the Isotope library work with the final state of the DOM element
	// representing the item, to avoid its incorrect positioning in the grid
	this.component.config.set("slideTimeout", 0);
};

plugin.enabled = function() {
	return document.compatMode !== "BackCompat"
};

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRender": function(topic, args) {
		this._refreshView();
	},
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRefresh": function(topic, args) {
		this._refreshView();
	},
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.PinboardVisualization.onChangeView": function(topic, args) {
		var plugin = this;
		if (args.force) {
			plugin._refreshView();
		} else {
			plugin.component.queueActivity({
				"action": "rerender",
				"item": plugin.component.items[args.item.data.unique],
				"priority": "high",
				"handler": function() {
					plugin._refreshView();
					plugin.component._executeNextActivity();
				}
			});
		}
	}
};

plugin.methods._refreshView = function() {
	var plugin = this, stream = this.component;
	var body = stream.view.get("body");
	var hasEntries = stream.threads.length;
	body.data("isotope")
		? (hasEntries
			? body.isotope("reloadItems").isotope({"sortBy": "original-order"})
			: body.isotope("destroy"))
		: hasEntries && body.isotope(
			plugin.config.get("isotope")
		);
};

plugin.css = 
	'.{plugin.class} .isotope { -webkit-transition-property: height, width; -moz-transition-property: height, width; -o-transition-property: height, width; transition-property: height, width;  -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }' +
	'.{plugin.class} .isotope .isotope-item { -webkit-transition-property: -webkit-transform, opacity; -moz-transition-property: -moz-transform, opacity; -o-transition-property: top, left, opacity; transition-property:transform, opacity; -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }';

return Plugin.create(plugin);

});
