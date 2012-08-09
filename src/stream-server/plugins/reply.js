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
	var form = Echo.Utils.getNestedValue(Echo.Global, this._getFormKey());
	$.each(form || {}, function(key, value) {
	    self.set(key, value);
	});
	item.addButtonSpec("Reply", this._assembleButton());
	this.set("documentClickHandler", this._getClickHandler());
	$(document).on('click', this.get("documentClickHandler"));
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
		var plugin = this, item = this.component;
		var context = item.config.get("context");
		if (plugin.get("expanded") && context && context !== args.context) {
			plugin.set("expanded", false);
			plugin._hideSubmit();
			plugin.events.publish({
				"topic": "onCollapse"
			});
		}
	},
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.set("expanded", false);
		this._hideSubmit();
		this.events.publish({
			"topic": "onCollapse"
		});
	},
	"Echo.StreamServer.Controls.Submit.onPostInit": function(topic, args) {
		args.postData.inReplyTo = this.component.get("data");
	}
};

plugin.templates.form =
	'<div class="{plugin.class:replyForm}">' +
		'<div class="{plugin.class:submitForm}"></div>' +
		'<div class="{plugin.class:compactForm}">' +
			'<div class="{plugin.class:compactContent} {plugin.class:compactBorder}">' +
				'<input class="{plugin.class:compactField} echo-primaryFont echo-secondaryColor">' +
			'</div>' +
		'</div>' +
	'</div>';

plugin.component.renderers.container = function(element) {
	var plugin = this, item = plugin.component;
	var threading = item.threading;
	if (plugin.get("expanded")) {
		item.threading = true;
	}
	item.parentRenderer("container", arguments);
	item.threading = threading;
	return element;
};

plugin.component.renderers.children = function(element) {
	var plugin = this, item = plugin.component;
	// perform reply form rerendering *only* when we have exactly 1 item
	// (the first item is being added or the last one is being deleted)
	if (item.get("children").length == 1) {
		var child = item.get("children")[0];
		if (child.get("added") || child.get("deleted")) {
			plugin._itemCSS("remove", item, plugin.dom.get("replyForm"));
			plugin.dom.render({"name": "compactForm"});
		}
	}
	return item.parentRenderer("children", arguments);
};

plugin.renderers.submitForm = function(element) {
	var plugin = this;
	if (plugin.get("expanded")) {
		return plugin._showSubmit();
	}
	return element;
};

plugin.renderers.compactForm = function(element) {
	var plugin = this, item = plugin.component;
	var hasChildren = !!item.children.length;
	if (!item.get("depth") && hasChildren && !plugin.get("expanded") && !item.get("children")[0].get("deleted")) {
		plugin._itemCSS("add", item, element.parent());
		return element.show();
	}
	return element.hide();
};

plugin.renderers.compactField = function(element) {
	var plugin = this, item = plugin.component;
	return element.focus(function() {
		plugin.set("expanded", true);
		plugin._showSubmit();
		/**
		 * @event onExpand
		 * Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand
		 * is triggered when the reply form is opened
		 */
		plugin.events.publish({
			"topic": "onExpand",
			"data": {
				"context": item.config.get("context")
			},
			"context": item.config.get("parent.context")
		});
	}).val(plugin.config.get("actionString"));
};

plugin.methods.destroy = function() {
	var plugin = this, item = this.component;
	Echo.Utils.setNestedValue(Echo.Global, plugin._getFormKey(), {
		"submit": plugin.get("submit"),
		"expanded": plugin.get("expanded")
	});
	$(document).off('click', plugin.get("documentClickHandler"));
};

plugin.methods._showSubmit = function() {
	var plugin = this, item = plugin.component;
	var submit;
	var target = plugin.dom.get("submitForm").empty();
	if (!plugin.get("submit")) {
		var config = plugin.config.assemble({
			"target": target,
			"data": { "unique": item.get("data.unique") },
			"targetURL": item.get("data.object.id"),
			"parent": item.config.getAsHash(),
			"targetQuery": item.config.get("query", ""),
			"context": item.config.get("context")
		});
		submit = new Echo.StreamServer.Controls.Submit(config);
		plugin.set("submit", submit);
	} else {
		submit = plugin.get("submit");
		var text = submit.dom.get("text").val();
		target.append(submit.dom.render());
		if (text) {
			submit.dom.get("text").val(text);
		}
	}
	plugin._itemCSS("add", item, plugin.dom.get("replyForm"));
	submit.dom.get("text").focus();
	target.click(function(event) {
		event.stopPropagation();
	});
	plugin.dom.render({"name": "compactForm"});
	item.dom.render({"name": "container"});
	return target;
};

plugin.methods._hideSubmit = function() {
	var plugin = this, item = plugin.component;
	plugin.dom.get("submitForm").empty();
	plugin._itemCSS("remove", item, plugin.dom.get("replyForm"));
	plugin.dom.render({"name": "compactForm"});
	item.dom.render({"name": "container"});
};

plugin.methods._getClickHandler = function() {
	var plugin = this;
	return function() {
	    var submit = plugin.get("submit");
	    if (plugin.get("expanded") && submit && !submit.dom.get("text").val()) {
		    plugin.set("expanded", false);
		    plugin._hideSubmit();
		    /**
		     * @event onCollapse
		     * Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse
		     * is triggered when the reply form is closed
		     */
		    plugin.events.publish({
			    "topic": "onCollapse"
		    });
	    }
	};
};

plugin.methods._assembleButton = function() {
	var plugin = this, item = this.component;
	var callback = function() {
		plugin.set("expanded", true);
		plugin._showSubmit();
		plugin.events.publish({
			"topic": "onExpand",
			"data": {
				"context": item.config.get("context")
			},
			"context": item.config.get("parent.context")
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
		element[action + "Class"](item.get("cssPrefix") + css);
	});
	element[action + "Class"]('echo-trinaryBackgroundColor');
};

plugin.methods._getFormKey = function() {
	var item = this.component;
	var applicationContext = item.config.get("context").split("/")[0];
	return "forms." + item.data.unique + "-" + applicationContext;
};

plugin.css = 
	".{plugin.class:compactContent} { padding: 5px 5px 5px 6px; background-color: #fff; }" +
	".{plugin.class:compactBorder} { border: 1px solid #d2d2d2; }" +
	".{plugin.class:compactField} { width: 100%; border: none; }";

Echo.Plugin.create(plugin);