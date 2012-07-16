(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.Edit")) return;

var plugin = Echo.Plugin.skeleton("Edit");

plugin.applications = ["Echo.StreamServer.Controls.Stream.Item"];

plugin.init = function() {
	var component = this.component;
	var button = this.assembleButton();
	component.addButtonSpec("Edit", button);
};

$.map(["Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onEdit" + action] = function(topic, args) {
		// item rerendering
		console.log("args: ");
		console.log(args);
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
			"visible":  item.user.is("admin") || item.user.has("identity", item.data.actor.id),
			"callback": function() {
				var config = plugin.submitConfig(item, item.dom.get("subcontainer"));
				config["targetQuery"] = plugin.config.get("query", "");
				config.plugins.push({"name": "EditSubmit"});
				new Echo.StreamServer.Controls.Submit(config);
				item.dom.content.get(0).scrollIntoView(true);
			}
		};
	};
};

Echo.Plugin.create(plugin);

})(jQuery);

(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.EditSubmit")) return;

var plugin = Echo.Plugin.skeleton("EditSubmit");

plugin.applications = ["Echo.StreamServer.Controls.Submit"];

plugin.init = function() {
	var component = this.component;
	
	this.extendTemplate(plugin.templates.cancel,"insertAfter", "postContainer");
	this.extendTemplate(plugin.templates.header, "replace", "header");
		
	this.extendRenderer("text", plugin.renderers.Submit.text);
	this.extendRenderer("author", plugin.renderers.Submit.author);
	this.extendRenderer("editedDate", plugin.renderers.Submit.editedDate);
	this.extendRenderer("cancelButton", plugin.renderers.Submit.cancelButton);
		
	component.labels.set({
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

$.map(["Init", "Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.Controls.Submit.onPost" + action] = function(topic, args) {
		this.events.publish({
			"topic": "onEdit" + action,
			"data": args
		});
	}
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

plugin.renderers.Submit.text = function(element) {
	var content = this.component.data.object.content;
	if (content) element.val(content);
	return this.parentRenderer("text", arguments);
};

plugin.renderers.Submit.author = function(element) {
	var component = this.component;
	return element.text(component.data.actor.title || component.labels.get("guest"));
};

plugin.renderers.Submit.editedDate = function(element) {
	var component = this.component;
	var published = component.data.object.published;
	var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

plugin.renderers.Submit.cancelButton = function(element) {
	var self = this;
	var component = self.component;
	element.click(function() {
		component.events.publish({
			"topic": "onEditError",
			"data": component.prepareBroadcastParams(),
			"context": component.config.get("parent.context")
		});
	});
};

plugin.css = 
	'.{class:cancelButtonContainer} { float: right; margin: 6px 15px 0px 0px; }';

Echo.Plugin.create(plugin);

})(jQuery);