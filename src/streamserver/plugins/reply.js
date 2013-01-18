(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.Reply
 * Adds extra “Reply” button to each root item in the Echo Stream control.
 * Integrates Echo Submit control and provides the ability to submit
 * replies to the posted items.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Reply"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Reply", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate("insertAsLastChild", "content", plugin.templates.form);
	var form = Echo.Utils.get(Echo.Variables, this._getSubmitKey());
	$.each(form || {}, function(key, value) {
	    self.set(key, value);
	});
	item.addButtonSpec("Reply", this._assembleButton());
	this.set("documentClickHandler", this._getClickHandler());
	$(document).on('click', this.get("documentClickHandler"));
};

plugin.config = {
	/**
	 * @cfg {String} actionString
	 * Specifies the hint placed in the empty text area.
	 *
	 * 	new Echo.StreamServer.Controls.Stream({
	 * 		"target": document.getElementById("echo-stream"),
	 * 		"appkey": "test.echoenabled.com",
	 * 		"plugins": [{
	 * 			"name": "Reply"
	 * 			"actionString": "Type your comment here...",
	 * 		}]
	 * 	});
	 */
	"actionString": "Write a reply..."
};

plugin.labels = {
	/**
	 * @echo_label
	 * Label for the button in the item
	 */
	"replyControl": "Reply"
};

plugin.dependencies = [{
	"control": "Echo.StreamServer.Controls.Submit",
	"url": "{config:cdnBaseURL.sdk}/streamserver.pack.js"
}];

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Plugins.Reply.onFormExpand": function(topic, args) {
		var item = this.component;
		var context = item.config.get("context");
		if (this.get("expanded") && context && context !== args.context) {
			this._hideSubmit();
		}
	},
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this._hideSubmit();
	},
	"Echo.StreamServer.Controls.Stream.Item.onRender": function(topic, args) {
		if (this.get("expanded")) {
			this._showSubmit();
		}
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

/**
 * @echo_renderer
 */
plugin.component.renderers.container = function(element) {
	var item = this.component;
	var threading = item.threading;
	if (this.get("expanded")) {
		item.threading = true;
	}
	item.parentRenderer("container", arguments);
	item.threading = threading;
	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.children = function(element) {
	var item = this.component;
	// perform reply form rerendering *only* when we have exactly 1 item
	// (the first item is being added or the last one is being deleted)
	if (item.get("children").length === 1) {
		var child = item.get("children")[0];
		if (child.get("added") || child.get("deleted")) {
			this._itemCSS("remove", item, this.view.get("compactForm"));
			this.view.render({"name": "compactForm"});
		}
	}
	return item.parentRenderer("children", arguments);
};

/**
 * @echo_renderer
 */
plugin.renderers.submitForm = function(element) {
	element.click(function(event) {
		event.stopPropagation();
	});
	return this.get("expanded") ? element.show() : element.empty().hide();
};

/**
 * @echo_renderer
 */
plugin.renderers.compactForm = function(element) {
	var item = this.component;
	var hasChildren = !!item.children.length;
	if (!item.get("depth") && hasChildren && !this.get("expanded") && !item.get("children")[0].get("deleted")) {
		this._itemCSS("add", item, element);
		return element.show();
	}
	this._itemCSS("remove", item, this.view.get("compactForm"));
	return element.hide();
};

/**
 * @echo_renderer
 */
plugin.renderers.compactField = function(element) {
	var plugin = this, item = this.component;
	return element.focus(function() {
		plugin._showSubmit();
	}).val(this.config.get("actionString"));
};

/**
 * Method to destroy the plugin.
 */
plugin.methods.destroy = function() {
	if (this.get("submit")) {
		Echo.Utils.set(Echo.Variables, this._getSubmitKey(), {
			"expanded": this.get("expanded"),
			"data": {
				"object": this._getSubmitData()
			}
		});
	}
	$(document).off('click', this.get("documentClickHandler"));
};

plugin.methods._submitConfig = function(target) {
	var plugin = this, item = this.component;
	return plugin.config.assemble({
		"target": target,
		"targetURL": item.get("data.object.id"),
		"parent": item.config.getAsHash(),
		"data": plugin.get("data") || {},
		"targetQuery": item.config.get("query", ""),
		"ready": function() {
			plugin.set("submit", this);
			plugin._expand();
		}
	});
};

plugin.methods._showSubmit = function() {
	var item = this.component;
	var target = this.view.get("submitForm");
	this._itemCSS("add", item, this.view.get("submitForm"));
	var submit = this.get("submit");
	if (submit) {
		submit.config.set("target", target);
		submit.render();
		this._expand();
		return target;
	}
	var config = this._submitConfig(target);
	config.plugins.push({
		"name": "Reply",
		"inReplyTo": item.get("data")
	});
	new Echo.StreamServer.Controls.Submit(config);
	return target;
};

plugin.methods._hideSubmit = function() {
	var item = this.component;
	var submit = this.get("submit");
	if (submit) {
		submit.set("data", undefined);
	}
	this.set("expanded", false);
	this._itemCSS("remove", item, this.view.get("submitForm"));
	this.view.get("submitForm").empty();
	this.view.render({"name": "compactForm"});
	item.view.render({"name": "container"});
	/**
	 * @event onCollapse
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse
	 * Triggered when the reply form is closed.
	 */
	this.events.publish({
		"topic": "onCollapse"
	});
};

plugin.methods._expand = function() {
	var item = this.component;
	this.set("expanded", true);
	this.view.render({"name": "submitForm"});
	this.view.render({"name": "compactForm"});
	/**
	 * @event onExpand
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand
	 * Triggered when the reply form is expanded.
	 */
	this.events.publish({
		"topic": "onExpand",
		"data": {
			"context": item.config.get("context")
		}
	});
	item.view.render({"name": "container"});
};

plugin.methods._getClickHandler = function() {
	var plugin = this;
	return function() {
	    var submit = plugin.get("submit");
	    if (plugin.get("expanded") && submit && !submit.view.get("text").val()) {
		    plugin._hideSubmit();
	    }
	};
};

plugin.methods._assembleButton = function() {
	var plugin = this, item = this.component;
	var callback = function() {
		plugin._showSubmit();
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

plugin.methods._getSubmitKey = function() {
	var item = this.component;
	var applicationContext = item.config.get("context").split("/")[0];
	return "forms." + item.data.unique + "-" + applicationContext;
};

plugin.methods._getSubmitData = function() {
	var data = {};
	var submit = this.get("submit");
	data["content"] = submit.view.get("text").val();
	$.map(["tags", "markers"], function(field) {
		var elements = submit.view.get(field).val().split(", ");
		data[field] = elements || [];
	});
	return data;
};

plugin.css = 
	".{plugin.class:compactContent} { padding: 5px 5px 5px 6px; background-color: #fff; }" +
	".{plugin.class:compactBorder} { border: 1px solid #d2d2d2; }" +
	".{plugin.class:compactContent} input.{plugin.class:compactField} { width: 100%; border: none; }" +
	'.{plugin.class:compactContent} input.{plugin.class:compactField}[type="text"] { width: 100%; border: none; margin: 0px; padding: 0px; }' +
	(Echo.Utils._browser().webkit ?
		'.{plugin.class:compactContent} input.{plugin.class:compactField} { outline: none; width: 100%;}' : '');

Echo.Plugin.create(plugin);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.Reply
 * Proxies the "Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand"
 * event on the Stream control level.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Reply"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Reply", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand": function(topic, args) {
		/**
		 * @event onFormExpand
		 * @echo_event Echo.StreamServer.Controls.Stream.Plugins.Reply.onFormExpand
		 * Triggered if reply form is expanded.
		 */
		this.events.publish({
			"topic": "onFormExpand",
			"data": {
			    "context": args.context
			}
		});
	}
};

Echo.Plugin.create(plugin);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.Reply
 * Adds internal data field "inReplyTo" for correct reply workflow.
 *
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Reply",
 * 			"inReplyTo": data 
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Reply", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this, submit = plugin.component;
	var _prepareEventParams = submit._prepareEventParams;
	submit._prepareEventParams = function(params) {
		var _params = _prepareEventParams.call(submit, params);
		_params.inReplyTo = plugin.config.get("inReplyTo");
		return _params;
	};
};

/**
 * @cfg {Object} inReplyTo
 * Entry which is the parent for the current reply.
 */

$.map(["onRender", "onRerender"], function(topic) {
	plugin.events["Echo.StreamServer.Controls.Submit." + topic] = function() {
		var submit = this.component;
		submit.config.get("target").show();
		submit.view.get("text").focus();
	};
});

Echo.Plugin.create(plugin);

})(Echo.jQuery);
