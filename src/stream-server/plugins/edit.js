(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.Edit")) return;

var plugin = Echo.Plugin.skeleton("Edit");

plugin.applications = ["Echo.StreamServer.Controls.Submit", "Echo.StreamServer.Controls.Stream"];

plugin.init = function() {
	var component = this.component;
	if (component instanceof Echo.StreamServer.Controls.Stream) {
		this.addItemButton(this.assembleButton(this.component));
	} else if (component instanceof Echo.StreamServer.Controls.Submit) {
		this.extendTemplate(plugin.templates.cancel,"insertAfter", "postContainer");
		this.extendTemplate(plugin.templates.header, "replace", "header");
		
		this.extendRenderer("cancelButton", plugin.renderers.Submit.cancelButton);
		this.extendRenderer("author", plugin.renderers.Submit.author);
		this.extendRenderer("editedDate", plugin.renderers.Submit.editedDate);
		
		component.labels.set({
			"post": this.labels.get("post"),
			"posting": this.labels.get("posting")
		});
	}
};

plugin.labels = {
	"createdBy": "Created by",
	"edit": "Edit",
	"editControl": "Edit",
	"on": "on",
	"post": "Update",
	"posting": "Updating...",
	"cancel": "cancel"
};

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostInit": function(topic, args) {
		this.events.publish({
			"topic": "onEditInit",
			"data": args
		});
	},
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.events.publish({
			"topic": "onEditComplete",
			"data": args
		});
	},
	"Echo.StreamServer.Controls.Submit.onPostError": function(topic, args) {
		this.events.publish({
			"topic": "onEditError",
			"data": args
		});
	},
	"Echo.StreamServer.Controls.Submit.Plugins.Edit.onEditComplete": function(topic, args) {
		//TODO: item rerendering
		//this.component.items[args.data.unique].rerender();
	},
	"Echo.StreamServer.Controls.Submit.Plugins.Edit.onEditError": function(topic, args) {
		//TODO: item rerendering
		//this.component.items[args.data.unique].rerender();
	}
};

plugin.templates.header =
	'<div class="{class:header} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{plugin.label:createdBy} ' +
		'<span class="{class:author}"></span> ' +
		'{plugin.label:on} <span class="{class:editedDate}"></span>' +
	'</div>';

plugin.templates.cancel =
	'<div class="{plugin.class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{plugin.class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">{plugin.label:cancel}</a>' +
	'</div>';

plugin.renderers.Submit ={};
	
plugin.renderers.Submit.cancelButton = function(element) {
	var component = this.component;
	element.click(function() {
		component.events.publish({
			"topic": "onEditError",
			"data": component.prepareBroadcastParams()
		});
	});
};

plugin.renderers.Submit.author = function(element) {
	var component = this.component;
	return element.text(this.config.get("data.actor.title") || component.labels.get("guest"));
};

plugin.renderers.Submit.editedDate = function(element) {
	var component = this.component;
	//TODO: get published from item's config
	//var published = this.config.get("data.object.published");
	var published = "1994-11-05T08:15:30Z";
	var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

plugin.methods.submitConfig = function(item, target) {
	return plugin.config.assemble({
		"target": target,
		"data": item.data,
		"targetURL": item.id
	});
};

plugin.methods.assembleButton = function(component) {
	var self = this;
	return function() {
		var item = this;
		return {
			"name": "Edit",
			"label": self.labels.get("editControl"),
			"visible": item.user.any("roles", ["administrator", "moderator"]) || user.has("identity", item.data.actor.id),
			"callback": function() {
				var config = component.submitConfig(item, item.dom.get("subcontainer"));
				//TODO: uncomment this if necessary
				//config.plugins.push({"name": "Edit"});
				plugin.config.set("targetQuery", component.config.get("query", ""));
				new Echo.StreamServer.Controls.Submit(config);
				//TODO: fix it when item is ready
				//item.dom.content.get(0).scrollIntoView(true);
			}
		};
	};
};

plugin.css = 
	//'.echo-edit-item-container .echo-submit-container { margin: 10px; }' +
	'.{plugin.class:cancelButton} { float: right; margin: 6px 15px 0px 0px; }';

Echo.Plugin.create(plugin);

})(jQuery);
