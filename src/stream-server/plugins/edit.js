(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.Edit")) return;

var plugin = Echo.Plugin.skeleton("Edit");

plugin.applications = ["Echo.StreamServer.Controls.Submit", "Echo.StreamServer.Controls.Stream"];

plugin.init = function() {
	if (this.component instanceof Echo.StreamServer.Controls.Stream) {
		this.addCSS(this.css);
		this.listenEvents();
		//TODO: addItemControl
	} else if (this.component instanceof Echo.StreamServer.Controls.Submit) {
		this.extendTemplate(plugin.templates.cancel,
			"insertAfter", "echo-streamserver-controls-submit-postContainer");
		this.extendTemplate(plugin.templates.header,
			"replace", "echo-streamserver-controls-submit-header");
		this.extendRenderer("cancelButton", plugin.renderers.Submit.cancelButton);
		this.extendRenderer("author", plugin.renderers.Submit.author);
		this.extendRenderer("editedDate", plugin.renderers.Submit.editedDate);
		this.component.labels.set({
			"post": this.labels.get("post"),
			"posting": this.labels.get("posting")
		});
	}
	
};

plugin.labels = {
	"createdBy": "Created by",
	"edit": "Edit",
	"editControl": "Edit",
	"post": "Update",
	"posting": "Updating...",
	"cancel": "cancel"
};

plugin.templates.header =
	'<div class="{class:editHeader} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{label:createdBy} ' +
		'<span class="{class:author}"></span> ' +
		'{label:on} <span class="{class:editedDate}"></span>' +
	'</div>';

plugin.templates.cancel =
	'<div class="{class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">{label:cancel}</a>' +
	'</div>';

plugin.renderers.Submit ={};
	
plugin.renderers.Submit.cancelButton = function(element) {
	var component = this.component;
	element.click(function() {
		component.events.publish({
			"topic": "onEditError",
			"data": application.prepareBroadcastParams()
		});
	});
};

plugin.renderers.Submit.author = function(element) {
	var component = this.component;
	return element.text(this.config.get("data.actor.title") || component.labels.get("guest"));
};

plugin.renderers.Submit.editedDate = function(element) {
	var component = this.component;
	// TODO: get published from item's config
	var published = "1994-11-05T08:15:30Z";
	var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

plugin.callbacks = {
	"control": function(component) {
		var item = this;
		var config = this.submitConfig(component, item, item.dom.get("subcontainer"));
		//TODO: change it if necessary
		//config.plugins.push({"name": "Edit"});
		config.targetQuery = application.config.get("query", "");
		new Echo.StreamServer.Controls.Submit(config);
		item.dom.content.get(0).scrollIntoView(true);
	},
	"events": {
		"complete": function(item) {
			item.rerender();
		}
	}
};

plugin.listenEvents = function() {
	var component = this.component;
	var callbacks = this.callbacks.events;
	$.each(["Init", "Complete", "Error"], function(i, stage) {
		this.events.subscribe({
			"topic": "onEdit" + stage,
			"handler": function(topic, args) {
				var item = component.items[args.data.unique];
				var handler = callbacks[stage.toLowerCase()];
				if (item && handler) handler(item);
			}
		});
		this.events.subscribe({
			"topic": "onPost" + stage,
			"handler": function(topic, args) {
				this.events.publish({
					"topic": "onEdit" + stage,
					"data": args
				})
			}
		})
	});
};

plugin.submitConfig = function(component, item, target) {
	return this.assembleConfig(application, {
		"target": target,
		"data": item.data,
		"targetURL": item.id
	});
};

plugin.assembleControl = function(component) {
	return function() {
		var item = this;
		return {
			"name": "Edit",
			"label": component.labels.get("editControl"),
			"visible": item.user.any("roles", ["administrator", "moderator"]) || user.has("identity", item.data.actor.id),
			"callback": function() {
				plugin.callbacks.control.call(item, component);
			} 
		};
	};
};

plugin.css = 
	//'.echo-edit-item-container .echo-submit-container { margin: 10px; }' +
	'.{class:cancelButton} { float: right; margin: 6px 15px 0px 0px; }';

Echo.Plugin.create(plugin);

})(jQuery);
