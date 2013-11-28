Echo.define("echo/streamserver/plugins/reply", [
	"echo/streamserver/plugins/streamItemReply",
	"echo/streamserver/plugins/streamReply",
	"echo/streamserver/plugins/submitReply"
], function() {});

Echo.define("echo/streamserver/plugins/streamItemReply", [
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/variables",
	"echo/streamserver/bundled-apps/submit/client-widget"
], function($, Plugin, Utils, Variables, Submit) {

"use strict";


/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply
 * Adds extra “Reply” button to each item in the Echo Stream application.
 * Integrates Echo Submit application and provides the ability to submit
 * replies to the posted items.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Reply"
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
var plugin = Plugin.definition("Reply", "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate("insertAsLastChild", "content", plugin.templates.form);
	var form = Utils.get(Variables, this._getSubmitKey());
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
	 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
	 * 		"target": document.getElementById("echo-stream"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"plugins": [{
	 * 			"name": "Reply",
	 * 			"actionString": "Type your comment here..."
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

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Reply.onFormExpand": function(topic, args) {
		var item = this.component;
		var context = item.config.get("context");
		if (this.get("expanded") && context && context !== args.context) {
			this._hideSubmit();
		}
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostComplete": function(topic, args) {
		this._hideSubmit();
	},
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRender": function(topic, args) {
		if (this.get("expanded")) {
			this._showSubmit();
		}
	}
};

/**
 * @echo_template
 */
plugin.templates.form =
	'<div class="{plugin.class:replyForm}">' +
		'<div class="{plugin.class:submitForm}"></div>' +
		'<div class="{plugin.class:compactForm}">' +
			'<div class="{plugin.class:compactContent} {plugin.class:compactBorder}">' +
				'<input type="text" class="{plugin.class:compactField} echo-primaryFont echo-secondaryColor">' +
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
		Utils.set(Variables, this._getSubmitKey(), {
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
		"appkey": item.config.get("parent.appkey"),
		"targetURL": item.get("data.object.id"),
		"parent": item.config.getAsHash(),
		"data": plugin.get("data") || {},
		"targetQuery": item.config.get("parent.query", ""),
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
	new Submit(config);
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
	 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onCollapse
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
	 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onExpand
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
	".{plugin.class:compactContent} input.{plugin.class:compactField}[type='text'].echo-secondaryColor { color: #C6C6C6 }" +
	".{plugin.class:compactContent} input.{plugin.class:compactField}[type='text'].echo-primaryFont { font-size: 12px; line-height: 16px; }" +
	".{plugin.class:compactContent} input.{plugin.class:compactField}[type='text'] { width: 100%; height: 16px; border: none; margin: 0px; padding: 0px; box-shadow: none; vertical-align: middle; }" +
	".{plugin.class:compactContent} input.{plugin.class:compactField}[type='text']:focus { outline: 0; box-shadow: none; }";

return Plugin.create(plugin);
});

Echo.define("echo/streamserver/plugins/streamReply", [
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/variables",
	"echo/streamserver/bundled-apps/submit/client-widget"
], function($, Plugin, Utils, Variables, Submit) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Reply
 * Proxies the "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onExpand"
 * event on the Stream application level.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Reply"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.definition("Reply", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onExpand": function(topic, args) {
		/**
		 * @echo_event Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Reply.onFormExpand
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

return Plugin.create(plugin);
});

Echo.define("echo/streamserver/plugins/submitReply", [
	"jquery",
	"echo/plugin"
], function($, Plugin) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Reply
 * Adds internal data field "inReplyTo" for correct reply workflow.
 *
 * 	new Echo.StreamServer.BundledApps.Submit.ClientWidget({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Reply",
 * 			"inReplyTo": data 
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.definition("Reply", "Echo.StreamServer.BundledApps.Submit.ClientWidget");

if (Plugin.isDefined(plugin)) return;

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
	plugin.events["Echo.StreamServer.BundledApps.Submit.ClientWidget." + topic] = function() {
		var submit = this.component;
		submit.config.get("target").show();
		submit.view.get("text").focus();
	};
});

return Plugin.create(plugin);
});
