define("echo/streamserver/plugins/streamItemEdit", [
	"jquery",
	"echo/plugin",
	"echo/streamserver/apps/submit"
], function($, Plugin, Submit) {
"use strict";

/**
 * @class Echo.StreamServer.Apps.Stream.Item.Plugins.Edit
 * Adds extra “Edit” button to each item in the Echo Stream application
 * which allows to edit the content and some metadata of the item.
 * This button will appear either for the users with
 * administrative privileges or for editing of personal comments.
 *
 * 	new Echo.StreamServer.Apps.Stream({
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
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.manifest("Edit", "Echo.StreamServer.Apps.Stream.Item");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	this.component.addButtonSpec("Edit", this._assembleButton());
};

$.map(["Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Apps.Submit.Plugins.Edit.onEdit" + action] =
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

plugin.dependencies = [{
	"app": "Echo.StreamServer.Apps.Submit",
	"url": "{config:cdnBaseURL.sdk}/streamserver.pack.js"
}];

plugin.methods._submitConfig = function(item, target) {
	return this.config.assemble({
		"target": target,
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
				config["targetQuery"] = plugin.config.get("query", "");
				config.plugins.push({"name": "Edit"});
				new Submit(config);
				item.config.get("target").get(0).scrollIntoView(true);
			}
		};
	};
};

return Plugin.create(plugin);

});

define("echo/streamserver/plugins/submitEdit", [
	"jquery",
	"echo/plugin",
	"echo/utils"
], function($, Plugin, Utils) {
"use strict";

/**
 * @class Echo.StreamServer.Apps.Submit.Plugins.Edit
 * Adds new mode to the Echo Submit application which allows
 * to edit the content and some metadata of the item.
 *
 * 	new Echo.StreamServer.Apps.Submit({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Edit"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.manifest("Edit", "Echo.StreamServer.Apps.Submit");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	this.extendTemplate("insertAfter", "postContainer", plugin.templates.cancel);
	this.extendTemplate("replace", "header", plugin.templates.header);
	this.component.labels.set({
		"post": this.labels.get("post"),
		"posting": this.labels.get("posting")
	});
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"createdBy": "Created by",
	/**
	 * @echo_label
	 */
	"edit": "Edit",
	/**
	 * @echo_label
	 */
	"on": "on",
	/**
	 * @echo_label
	 */
	"post": "Update",
	/**
	 * @echo_label
	 */
	"posting": "Updating...",
	/**
	 * @echo_label
	 */
	"cancel": "cancel"
};

/**
 * @echo_event Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditInit
 * Triggered when edit operation was started
 */
/**
 * @echo_event Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditComplete
 * Triggered when edit operation is finished
 */
/**
 * @echo_event Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditError
 * Triggered if edit operation failed
 */
$.map(["Init", "Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Apps.Submit.onPost" + action] = function(topic, args) {
		if (action === "Init") {
			args.postData.content = this._prepareContent();
		}
		this.events.publish({
			"data": args,
			"topic": "onEdit" + action
		});
	};
});

/**
 * @echo_template
 */
plugin.templates.header =
	'<div class="{plugin.class:header} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{plugin.label:createdBy} <span class="{plugin.class:author}"></span> ' +
		'{plugin.label:on} <span class="{plugin.class:editedDate}"></span>' +
	'</div>';

/**
 * @echo_template
 */
plugin.templates.cancel =
	'<div class="{plugin.class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{plugin.class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">' +
			'{plugin.label:cancel}' +
		'</a>' +
	'</div>';

/**
 * @echo_renderer
 */
plugin.renderers.author = function(element) {
	var component = this.component;
	return element.text(component.get("data.actor.title") || component.labels.get("guest"));
};

/**
 * @echo_renderer
 */
plugin.renderers.editedDate = function(element) {
	var published = this.component.get("data.object.published");
	if (!published) return element.empty();

	var date = new Date(Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

/**
 * @echo_renderer
 */
plugin.renderers.cancelButton = function(element) {
	var plugin = this;
	return element.click(function() {
		plugin.events.publish({"topic": "onEditError"});
	});
};

plugin.methods._prepareContent = function() {
	var submit = this.component;
	var get = function(name){
		return submit.view.get(name).val();
	};
	return [].concat(this._getMetaDataUpdates("tag", "tag", get("tags")),
			 this._getMetaDataUpdates("mark", "marker", get("markers")),
			 this._prepareActivity("update", "comment", get("text")));
};

plugin.methods._prepareActivity = function(verb, type, data) {
	return (!data) ? [] : {
		"object": {
			"objectTypes": ["http://activitystrea.ms/schema/1.0/" + type],
			"content": data
		},
		"source": this.component.config.get("source"),
		"verbs": ["http://activitystrea.ms/schema/1.0/" + verb],
		"targets": [{
			"id": this.component.get("data.object.id")
		}]
	};
};

plugin.methods._getMetaDataUpdates = function(verb, type, data) {
	var plugin = this, component = this.component;
	var extract = function(value) {
		return $.map(value || [], function(item) { return $.trim(item); });
	};
	var items = {
		"modified": extract(data.split(",")),
		"current": extract(component.get("data.object." + type + "s"))
	};
	var updates = [];
	var diff = function(a, b, verb) {
		$.map(a, function(item) {
			if (item && !~$.inArray(item, b)) {
				updates.push(plugin._prepareActivity(verb, type, item));
			}
		});
	};
	diff(items.current, items.modified, "un" + verb);
	diff(items.modified, items.current, verb);
	return updates;
};

plugin.css = 
	'.{plugin.class:cancelButtonContainer} { float: right; margin: 6px 15px 0px 0px; }';

return Plugin.create(plugin);

});
