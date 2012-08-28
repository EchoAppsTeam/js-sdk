(function() {

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.Edit
 * Adds extra Button Edit to each item in the Echo Stream control which allows to edit the content and some metadata of the item. This button will appear either for the users with the administrative privileges or for editing personal comments.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Edit"
 *         }]
 *     });
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Edit", "Echo.StreamServer.Controls.Stream.Item");

plugin.init = function() {
	var component = this.component;
	var button = this._assembleButton();
	component.addButtonSpec("Edit", button);
};

$.map(["Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onEdit" + action] = function(topic, args) {
		this.dom.render();
	}
});

plugin.labels = {
	"editControl": "Edit"
};

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
			"label": plugin.labels.get("editControl"),
			"visible": item.user.is("admin") || item.user.has("identity", item.get("data.actor.id")),
			"callback": function() {
				var config = plugin._submitConfig(item, item.dom.get("subcontainer"));
				config["parent"] = plugin.component.config.getAsHash();
				config["targetQuery"] = plugin.config.get("query", "");
				config.plugins.push({"name": "Edit"});
				new Echo.StreamServer.Controls.Submit(config);
				item.config.get("target").get(0).scrollIntoView(true);
			}
		};
	};
};

Echo.Plugin.create(plugin);

})();

(function() {

var plugin = Echo.Plugin.manifest("Edit", "Echo.StreamServer.Controls.Submit");

plugin.init = function() {
	var self = this;
	this.extendTemplate("insertAfter", "postContainer", plugin.templates.cancel);
	this.extendTemplate("replace", "header", plugin.templates.header);
	this.component.labels.set({
		"post": this.labels.get("post"),
		"posting": this.labels.get("posting")
	});
};

plugin.labels = {
	"createdBy": "Created by",
	"edit": "Edit",
	"on": "on",
	"post": "Update",
	"posting": "Updating...",
	"cancel": "cancel"
};

/**
 * @event onEditInit
 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Edit.onEditInit
 * Triggered if edit operation was started
 */
/**
 * @event onEditComplete
 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Edit.onEditComplete
 * Triggered when the submit operation is finished
 */
/**
 * @event onEditError
 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Edit.onEditError
 * Triggered if edit operation failed
 */
$.map(["Init", "Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onPost" + action] = function(topic, args) {
		var component = this.component;
		if (action === "Init") {
			args.postData.content = this._prepareContent();
		}
		component.events.publish({
			"data": args,
			"topic": "onEdit" + action,
			"context": component.config.get("parent.context")
		});
	};
});

plugin.templates.header =
	'<div class="{plugin.class:header} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{plugin.label:createdBy} ' +
		'<span class="{plugin.class:author}"></span> ' +
		'{plugin.label:on} <span class="{plugin.class:editedDate}"></span>' +
	'</div>';

plugin.templates.cancel =
	'<div class="{plugin.class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{plugin.class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">{plugin.label:cancel}</a>' +
	'</div>';

plugin.renderers.author = function(element) {
	var component = this.component;
	return element.text(component.get("data.actor.title") || component.labels.get("guest"));
};

plugin.renderers.editedDate = function(element) {
	var published = this.component.get("data.object.published");
	if (!published) return element.empty();
	var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

plugin.renderers.cancelButton = function(element) {
	var plugin = this;
	var component = plugin.component;
	var handler = function() {
		component.events.publish({
			"topic": "onEditError",
			"context": component.config.get("parent.context")
		});
	};
	return element.click(handler);
};

plugin.methods._prepareContent = function() {
	var component = this.component;
	return [].concat(this._getMetaDataUpdates("tag", "tag", component.dom.get("tags").val()),
			 this._getMetaDataUpdates("mark", "marker", component.dom.get("markers").val()),
			 this._prepareActivity("update", "comment", component.dom.get("text").val()));
};

plugin.methods._prepareActivity = function(verb, type, data) {
	return (!data) ? [] : {
		"object": {
			"objectTypes": [ "http://activitystrea.ms/schema/1.0/" + type ],
			"content": data
		},
		"source": this.component.config.get("source"),
		"verbs": [ "http://activitystrea.ms/schema/1.0/" + verb ],
		"targets": [{
			"id": this.component.get("data.object.id")
		}]
	};
};

plugin.methods._getMetaDataUpdates = function(verb, type, data) {
	var plugin = this;
	var component = this.component;
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
			if (item && $.inArray(item, b) == -1) {
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

Echo.Plugin.create(plugin);

})();