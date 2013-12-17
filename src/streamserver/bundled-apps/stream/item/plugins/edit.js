Echo.define([
	"jquery",
	"echo/plugin",
	"echo/streamserver/bundled-apps/submit/client-widget",
	"echo/streamserver/bundled-apps/submit/plugins/edit"
], function($, Plugin, Submit) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Edit
 * Adds extra “Edit” button to each item in the Echo Stream application
 * which allows to edit the content and some metadata of the item.
 * This button will appear either for the users with
 * administrative privileges or for editing of personal comments.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Edit"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver.pack.js
 * @module
 */
var plugin = Plugin.definition("Edit", "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget");

plugin.init = function() {
	this.component.addButtonSpec("Edit", this._assembleButton());
};

$.map(["Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEdit" + action] =
		function(topic, args) {
			this.component.render();
		}
});

plugin.labels = {
	/**
	 * @echo_label
	 * Label for the button in the item
	 */
	"editButton": "Edit"
};

plugin.methods._submitConfig = function(item, target) {
	return this.config.assemble({
		"target": target,
		"appkey": this.component.config.get("parent.appkey"),
		"data": item.get("data"),
		"targetURL": item.get("data.object.id")
	});
};

plugin.methods._assembleButton = function() {
	var plugin = this;
	return function() {
		var item = this;
		return {
			"name": "Edit",
			"label": plugin.labels.get("editButton"),
			"visible": item.user.is("admin") || item.user.has("identity", item.get("data.actor.id")),
			"callback": function() {
				var config = plugin._submitConfig(item, item.view.get("subcontainer"));
				config["parent"] = plugin.component.config.getAsHash();
				config["targetQuery"] = item.config.get("parent.query", "");
				config.plugins.push({"name": "Edit"});
				new Submit(config);
				item.config.get("target").get(0).scrollIntoView(true);
			}
		};
	};
};

return Plugin.create(plugin);

});
