(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.Edit
 * Adds extra Button Edit to each item in the Echo Stream control which allows to edit the content and some metadata of the item. This button will appear either for the users with the administrative privileges or for editing personal comments.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Edit"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.skeleton("Edit", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var component = this.component;
	var button = this.assembleButton();
	component.addButtonSpec("Edit", button);
};

$.map(["Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onEdit" + action] = function(topic, args) {
		this.component.render();
	}
});

plugin.labels = {
	"editControl": "Edit"
};

plugin.methods.submitConfig = function(item, target) {
	return this.config.assemble({
		"target": target,
		"data": item.data,
		"targetURL": item.id
	});
};

plugin.methods.assembleButton = function() {
	var plugin = this;
	return function() {
		var item = this;
		return {
			"name": "Edit",
			"label": plugin.labels.get("editControl"),
			"visible": item.user.is("admin") || item.user.has("identity", item.data.actor.id),
			"callback": function() {
				var config = plugin.submitConfig(item, item.dom.get("subcontainer"));
				config["parent"] = plugin.component.config.getAsHash(),
				config["targetQuery"] = plugin.config.get("query", "");
				config.plugins.push({"name": "Edit"});
				new Echo.StreamServer.Controls.Submit(config);
				item.dom.content.get(0).scrollIntoView(true);
			}
		};
	};
};

Echo.Plugin.create(plugin);

})(jQuery);

(function($) {

var plugin = Echo.Plugin.skeleton("Edit", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this;
	this.extendTemplate("insertAfter", "postContainer", plugin.templates.cancel);
	this.extendTemplate("replace", "header", plugin.templates.header);
	this.extendRenderer("author", plugin.renderers.Submit.author);
	this.extendRenderer("metaFields", plugin.renderers.Submit.metaFields);
	this.extendRenderer("editedDate", plugin.renderers.Submit.editedDate);
	this.extendRenderer("cancelButton", plugin.renderers.Submit.cancelButton);
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
 * Echo.StreamServer.Controls.Submit.onEdit
 * is triggered if edit operation was started
 */

/**
 * @event onEditComplete
 * Echo.StreamServer.Controls.Submit.onEditComplete
 * is triggered when the submit operation is finished
 */

/**
 * @event onEditError
 * Echo.StreamServer.Controls.Submit.onPostError
 * is triggered if edit operation failed
 */

$.map(["Init", "Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onPost" + action] = function(topic, args) {
		var component = this.component;
		if (action === "Init") {
			args.postData.content = this.prepareContent();
		}
		component.events.publish({
			"topic": "onEdit" + action,
			"context": component.config.get("parent.context")
		});
	};
});

plugin.templates.header =
	'<div class="{class:header} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{plugin.label:createdBy} ' +
		'<span class="{class:author}"></span> ' +
		'{plugin.label:on} <span class="{class:editedDate}"></span>' +
	'</div>';

plugin.templates.cancel =
	'<div class="{class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">{plugin.label:cancel}</a>' +
	'</div>';

plugin.renderers.Submit ={};

plugin.renderers.Submit.metaFields = function(element, dom, extra) {
	var data = this.component.get("data.object." + extra.type) || [];
	var value = $.trim(Echo.Utils.stripTags(data.join(", ")));
	element.val(value);
	return this.parentRenderer("metaFields", arguments);
};

plugin.renderers.Submit.author = function(element) {
	var component = this.component;
	return element.text(component.get("data.actor.title") || component.labels.get("guest"));
};

plugin.renderers.Submit.editedDate = function(element) {
	var published = this.component.get("data.object.published");
	var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

plugin.renderers.Submit.cancelButton = function(element) {
	var plugin = this;
	var component = plugin.component;
	element.click(function() {
		component.events.publish({
			"topic": "onEditError",
			"context": component.config.get("parent.context")
		});
	});
};

plugin.methods.prepareContent = function() {
	var component = this.component;
	return [].concat(this.getMetaDataUpdates("tag", "tag", component.dom.get("tags").val()),
			 this.getMetaDataUpdates("mark", "marker", component.dom.get("markers").val()),
			 this.prepareActivity("update", "comment", component.dom.get("text").val()));
};

plugin.methods.prepareActivity = function(verb, type, data) {
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

plugin.methods.getMetaDataUpdates = function(verb, type, data) {
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
				updates.push(plugin.prepareActivity(verb, type, item));
			}
		});
	};
	diff(items.current, items.modified, "un" + verb);
	diff(items.modified, items.current, verb);
	return updates;
};

plugin.css = 
	'.{class:cancelButtonContainer} { float: right; margin: 6px 15px 0px 0px; }';

Echo.Plugin.create(plugin);

})(jQuery);
