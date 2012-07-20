(function($) {

var plugin = Echo.Plugin.skeleton("Reply", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate(plugin.templates.form, "insertAsLastChild", "content");
	this.extendRenderer("children", plugin.renderers.Item.children);
	this.extendRenderer("container", plugin.renderers.Item.container);
	this.extendRenderer("compactForm", plugin.renderers.Item.compactForm);
	this.extendRenderer("compactField", plugin.renderers.Item.compactField);
	item.addButtonSpec("Reply", this._assembleButton());
	$(document).click(function() {
		if (self.get("expand")) {
			 self.events.publish({
				"topic": "onCollapse"
			});
		}
	});
};

plugin.labels = {
	"replyControl": "Reply"
};

plugin.config = {
	"actionString": "Write reply here..."
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand": function(topic, args) {
		this.set("expand", 1);
		this._showSubmit();
	},
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse": function(topic, args) {
		this.set("expand", 0);
		this._hideSubmit();
	},
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.events.publish({
			"topic": "onCollapse"
		});
	}
};

plugin.templates.form = '<div class="{class:replyForm}">' +
				'<div class="{class:submitForm}"></div>' +
				'<div class="{class:compactForm}">' +
					'<div class="{class:compactContent} {class:compactBorder}">' +
						'<input class="{class:compactField} echo-primaryFont echo-secondaryColor">' +
					'</div>' +
				'</div>' +
			'</div>';

plugin.renderers.Item = {};

plugin.renderers.Item.children = function(element) {
	var plugin = this, item = plugin.component;
	// perform reply form rerendering *only* when we have exactly 1 item
	// (the first item is being added or the last one is being deleted)
	if (item.children.length == 1) {
		var child = item.children[0];
		if (child.get("added") || child.get("deleted")) {
			plugin._removeCSS(item, item.dom.get("replyForm"));
			item.render({"element": "compactForm"});
		}
	}
	return item.parentRenderer("children", arguments);
};

plugin.renderers.Item.compactForm = function(element) {
	var plugin = this, item = plugin.component;
	var hasChildren = !!item.children.length;
	if (!item.depth && hasChildren) {
		if (!plugin.get("expand") && !item.children[0].get("deleted")) {
			plugin._addCSS(item, element.parent());
			return element.show();
		}
		return element.hide();
	}
	return element.hide();
};

plugin.renderers.Item.container = function(element) {
	var plugin = this, item = plugin.component;
	var threading = item.threading;
	if (plugin.get("expand")) {
		item.threading = true;
	}
	item.parentRenderer("container", arguments);
	item.threading = threading;
};

plugin.renderers.Item.compactField = function(element) {
	var plugin = this, item = plugin.component;
	return element.focus(function() {
		plugin.events.publish({
			"topic": "onExpand"
		});
	}).val(plugin.config.get("actionString"));
};

plugin.methods._showSubmit = function() {
	var plugin = this, item = plugin.component;
	
	var target = item.dom.get("submitForm");
	target.empty();
	plugin._addCSS(item, item.dom.get("replyForm"));
	
	var config = plugin.config.assemble({
		"target": target,
		"data": { "unique": item.get("data.unique") },
		"targetURL": item.get("data.object.id"),
		"parent": item.config.getAsHash(),
		"targetQuery": item.config.get("query", "")
	});
	new Echo.StreamServer.Controls.Submit(config);
	target.click(function(event) {
		event.stopPropagation();
	});
	item.render({"element": "compactForm"});
	item.render({"element": "container"});
};

plugin.methods._hideSubmit = function() {
	var plugin = this, item = plugin.component;
	item.dom.get("submitForm").empty();
	plugin._removeCSS(item, item.dom.get("replyForm"));
	item.render({"element": "compactForm"});
	item.render({"element": "container"});
};

plugin.methods._assembleButton = function() {
	var plugin = this;
	var callback = function() {
		plugin.events.publish({
			"topic": "onExpand"
		});
	};
	return function() {
		var item = this;
		return {
			"name": "Reply",
			"label": plugin.labels.get("replyControl"),
			"visible": item.get("depth") < item.config.get("parent.children.maxDepth"),
			"callback": callback
		};
	};
};

plugin.methods._addCSS = function(item, element) {
	if (!element.hasClass(item.cssPrefix + "-container")) {
	    $.each(["container", "container-child", "depth-" + (item.depth + 1)], function(i, css) {
		    element.addClass(item.cssPrefix + "-" + css);
	    });
	    element.addClass('echo-trinaryBackgroundColor');
	}
};

plugin.methods._removeCSS = function(item, element) {
	if (element.hasClass(item.cssPrefix + "-container")) {
	    $.each(["container", "container-child", "depth-" + (item.depth + 1)], function(i, css) {
		    element.removeClass(item.cssPrefix + "-" + css);
	    });
	    element.removeClass('echo-trinaryBackgroundColor');
	}
};

plugin.css = 
	".{class:compactContent} { padding: 5px 5px 5px 6px; background-color: #fff; }" +
	".{class:compactBorder} { border: 1px solid #d2d2d2; }" +
	".{class:compactField} { width: 100%; border: none; }";

Echo.Plugin.create(plugin);

})(jQuery);
