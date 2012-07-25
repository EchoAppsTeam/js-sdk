(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.Reply
 * Adds extra button Reply to each root item in the Echo Stream control. Integrates Echo Submit control and provides the ability to submit replies to the posted items.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Reply"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Reply", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate("insertAsLastChild", "content", plugin.templates.form);
	this.extendRenderer("children", plugin.renderers.Item.children);
	this.extendRenderer("container", plugin.renderers.Item.container);
	this.extendRenderer("compactForm", plugin.renderers.Item.compactForm);
	this.extendRenderer("compactField", plugin.renderers.Item.compactField);
	item.addButtonSpec("Reply", this._assembleButton());
	$(document).click(function() {
		var submit = self.get("submit");
		if (submit && !submit.dom.get("text").val()) {
			/**
			 * @event onCollapse
			 * Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse
			 * is triggered when the reply form is closed 
			 */
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
/**
 * @cfg {String} actionString Is used to define the default call to action phrase.
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Reply"
 * 			"actionString": "Type your comment here...",
 * 		}]
 * 	});
 */
	"actionString": "Write reply here..."
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand": function(topic, args) {
		this._showSubmit();
	},
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse": function(topic, args) {
		this._hideSubmit();
	},
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.events.publish({
			"topic": "onCollapse"
		});
	},
	"Echo.StreamServer.Controls.Submit.onPostInit": function(topic, args) {
		args.postData.inReplyTo = this.component.get("data");
	}
};

plugin.templates.form =
	'<div class="{class:replyForm}">' +
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
			plugin._itemCSS("remove", item, item.dom.get("replyForm"));
			item.render({"element": "compactForm"});
		}
	}
	return item.parentRenderer("children", arguments);
};

plugin.renderers.Item.compactForm = function(element) {
	var plugin = this, item = plugin.component;
	var hasChildren = !!item.children.length;
	if (!item.get("depth") && hasChildren && !plugin.get("submit") && !item.children[0].get("deleted")) {
		plugin._itemCSS("add", item, element.parent());
		return element.show();
	}
	return element.hide();
};

plugin.renderers.Item.container = function(element) {
	var plugin = this, item = plugin.component;
	var threading = item.threading;
	if (plugin.get("submit")) {
		item.threading = true;
	}
	item.parentRenderer("container", arguments);
	item.threading = threading;
	return element;
};

plugin.renderers.Item.compactField = function(element) {
	var plugin = this, item = plugin.component;
	return element.focus(function() {
		/**
		 * @event onExpand
		 * Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand
		 * is triggered when the reply form is opened
		 */
		plugin.events.publish({
			"topic": "onExpand"
		});
	}).val(plugin.config.get("actionString"));
};

plugin.methods._showSubmit = function() {
	var plugin = this, item = plugin.component;
	
	var target = item.dom.get("submitForm");
	target.empty();
	plugin._itemCSS("add", item, item.dom.get("replyForm"));
	
	var config = plugin.config.assemble({
		"target": target,
		"data": { "unique": item.get("data.unique") },
		"targetURL": item.get("data.object.id"),
		"parent": item.config.getAsHash(),
		"targetQuery": item.config.get("query", ""),
		"context": item.config.get("context")
	});
	var submit = new Echo.StreamServer.Controls.Submit(config);
	plugin.set("submit", submit);
	submit.dom.get("text").focus();
	target.click(function(event) {
		event.stopPropagation();
	});
	item.render({"element": "compactForm"});
	item.render({"element": "container"});
};

plugin.methods._hideSubmit = function() {
	var plugin = this, item = plugin.component;
	item.dom.get("submitForm").empty();
	plugin.set("submit", false);
	plugin._itemCSS("remove", item, item.dom.get("replyForm"));
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

plugin.methods._itemCSS = function(action, item, element) {
	$.each(["container", "container-child", "depth-" + (item.get("depth") + 1)], function(i, css) {
		element[action + "Class"](item.cssPrefix + "-" + css);
	});
	element[action + "Class"]('echo-trinaryBackgroundColor');
};

plugin.css = 
	".{class:compactContent} { padding: 5px 5px 5px 6px; background-color: #fff; }" +
	".{class:compactBorder} { border: 1px solid #d2d2d2; }" +
	".{class:compactField} { width: 100%; border: none; }";

Echo.Plugin.create(plugin);

})(jQuery);
