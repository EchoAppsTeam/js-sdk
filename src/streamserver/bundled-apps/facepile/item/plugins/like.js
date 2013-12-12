Echo.define([
	"jquery",
	"echo/plugin"
], function($, Plugin) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.Plugins.Like
 * Adds extra controls to items in the Echo FacePile application.
 *
 * @extends Echo.Plugin
 * @private
 */
var plugin = Plugin.definition("Like", "Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	this.extendTemplate("insertAsLastChild", "container", plugin.templates.main);
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"unlikeOnBehalf": "Unlike on behalf of this user"
};

plugin.templates.main = '<img class="{plugin.class:adminUnlike}" src="' + Echo.require.toUrl("echo-assets/images/container/closeWindow.png") + '" title="{plugin.label:unlikeOnBehalf}" width="10" height="9">';

/**
 * @echo_renderer
 */
plugin.component.renderers.container = function(element) {
	this.parentRenderer("container", arguments);
	if (this.component.user.is("admin")) {
		element.addClass(this.cssPrefix + "highlight");
	}
};

/**
 * @echo_renderer
 */
plugin.renderers.adminUnlike = function(element) {
	var plugin = this;
	var item = this.component;
	if (!item.user.is("admin")) {
		return element.remove();
	}
	return element.one("click", function() {
		item.view.get("container").css("opacity", 0.3);
		/**
		 * @echo_event Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.Plugins.Like.onUnlike
		 * Triggered when the item is "unliked" by admin on behalf of a user.
		 */
		plugin.events.publish({
			"topic": "onUnlike",
			"data": {
				"actor": item.get("data"),
				"target": item.config.get("parent.target").get(0)
			},
			"global": false,
			"propagation": false
		});
	});
};

plugin.css =
	'.{plugin.class:adminUnlike} { cursor: pointer; margin-left: 3px; }' +
	'.{plugin.class:highlight} { display: inline-block; line-height: 16px; background-color: #EEEEEE; padding: 1px 3px; border: 1px solid #D2D2D2; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 0px 2px; }';

return Plugin.create(plugin);

});
