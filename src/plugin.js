Echo.define("echo/plugin", [
	"jquery",
	"echo/utils",
	"echo/labels",
	"echo/configuration",
	"echo/events",
	"require"
], function($, Utils, Labels, Configuration, Events, require) {

"use strict";

/**
 * @class Echo.Plugin
 * Foundation class implementing core logic to create plugins and manipulate with them.
 *
 * Please visit [this page](#!/guide/how_to_develop_plugin) to learn more about developing plugins
 *
 * @package environment.pack.js
 */
var Plugin = function() {};

/**
 * @static
 * Function which creates a plugin JS class using its definition declaration.
 *
 * @param {Object} definition
 * Specifies the plugin interface in the predefined way.
 *
 * @param {String} definition.name
 * Specifies the Plugin name.
 *
 * @param {Object} [definition.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [definition.labels]
 * Specifies the list of language labels used in the particular plugin UI.
 *
 * @param {Object} [definition.events]
 * Specifies the list of external events used by plugin.
 *
 * @param {Object} [definition.methods]
 * Specifies the list of plugin methods.
 *
 * @param {Object} [definition.renderers]
 * Specifies the list of plugin renderers.
 *
 * @param {Object} [definition.templates]
 * Specifies the list of plugin templates.
 *
 * @param {Function} [definition.init]
 * Function called during plugin initialization.
 *
 * @param {String} [definition.css]
 * Specifies the CSS rules for the plugin.
 *
 * @return {Object}
 * Generated plugin class.
 */
Plugin.create = function(definition) {
	var plugin = Plugin.getClass(definition.name, definition.component.name);

	// prevent multiple re-definitions
	if (plugin) return plugin;

	var constructor = Utils.inherit(Plugin, function(config) {
		if (!config || !config.component) {
			Utils.log({
				"type": "error",
				"component": definition.name,
				"message": "Unable to initialize plugin, config is invalid",
				"args": {"config": config}
			});
			return;
		}
		this.name = definition.name;
		this.component = config.component;
		this.cssClass = this.component.get("cssPrefix") + "plugin-" + definition.name;
		this.cssPrefix = this.cssClass + "-";

		// define extra css class for the application target
		this.component.config.get("target").addClass(this.cssClass);

		this._init([{
			"name": "config",
			"type": "sync",
			"init": this._initializers.config
		}]);
	});
	var namespace = Plugin._getClassName(definition.name, definition.component.name);

	constructor.definition = definition;
	constructor.prototype.namespace = namespace;

	// define default language var values with the lowest priority available
	Labels.set($.extend({}, definition.labels), namespace, true);

	if (definition.methods) {
		$.extend(constructor.prototype, definition.methods);
	}

	Utils.set(window, namespace, constructor);
	return constructor;
};

/**
 * @static
 * This method returns common definition structure.
 *
 * @param {String} name
 * Specifies plugin name.
 *
 * @param {String} component
 * Specifies the component name to be extended.
 *
 * @return {Object}
 * Basic plugin definition declaration.
 */
Plugin.definition = function(name, component) {
	return {
		"name": name,
		"component": {
			"name": component,
			"renderers": {}
		},
		"config": {},
		"labels": {},
		"events": {},
		"methods": {},
		"renderers": {},
		"templates": {},
		"enabled": function() { return true; },
		"init": function() {},
		"destroy": function() {}
	};
};

/**
 * @static
 * Checks if the plugin is already defined.
 *
 * @param {Object|String} definition
 * Plugin definition or plugin name.
 *
 * @return {Boolean}
 */
Plugin.isDefined = function(definition) {
	if (typeof definition === "string") {
		var component = Utils.get(window, definition);
		return !!(component && component.definition);
	}
	return !!Plugin.getClass(definition.name, definition.component.name);
};

/**
 * @static
 * Returns the corresponding plugin by its name and parent component name.
 *
 * @param {String} name
 * Plugin name.
 *
 * @param {String} component
 * Extended component name.
 *
 * @return {Object}
 * Plugin class.
 */
Plugin.getClass = function(name, component) {
	return Utils.get(window, Plugin._getClassName(name, component));
};

/**
 * Initializes the plugin.
 */
Plugin.prototype.init = function() {
	var self = this;
	this._init(
		$.map([
			"css",
			"events",
			"subscriptions",
			"labels",
			"renderers",
			"view",
			"launcher"
		], function(name) {
			return {
				"name": name,
				"type": "sync",
				"init": self._initializers[name]
			};
		})
	);
};

/**
 * Checks if the plugin is enabled.
 */
Plugin.prototype.enabled = function() {
	if (typeof this._enabled === "undefined") {
		var enabled = this.config.get("enabled", true);
		switch ($.type(enabled)) {
			case "string":
				enabled = enabled === "true";
				break;
			case "function":
				enabled = enabled.call(this);
				break;
		}
		this._enabled = enabled && !!this._definition("enabled").call(this);
	}
	return this._enabled;
};

/**
 * @inheritdoc Echo.App#set
 */
Plugin.prototype.set = function(key, value) {
	return Utils.set(this, key, value);
};

/**
 * @inheritdoc Echo.App#get
 */
Plugin.prototype.get = function(key, defaults) {
	return Utils.get(this, key, defaults);
};

/**
 * @inheritdoc Echo.App#remove
 */
Plugin.prototype.remove = function(key) {
	return Utils.remove(this, key);
};

/**
 * @inheritdoc Echo.Utils#invoke
 */
Plugin.prototype.invoke = function(mixed, context) {
	return Utils.invoke(mixed, context || this);
};

/**
 * Method to enable the plugin.
 * The plugin becomes enabled for the current application instance and
 * the update can also be reflected in the config (if the "global"
 * flag is defined during the function invocation) to enable it
 * for other applications which use the same config parameters.
 *
 * @param {Boolean} [global]
 * Specifies if the plugin should be enabled in the config. By default
 * the function enables the plugin for the current application instance only.
 */
Plugin.prototype.enable = function(global) {
	global && this.config.set("enabled", true);
	this._enabled = true;
};

/**
 * Method to disable the plugin.
 * The plugin becomes disabled for the current application instance and
 * the update can also be reflected in the config (if the "global"
 * flag is defined during the function invocation) to disable it
 * for other applications which use the same config parameters.
 *
 * @param {Boolean} [global]
 * Specifies if the plugin should be disabled in the config. By default
 * the function disables the plugin for the current application instance only.
 */
Plugin.prototype.disable = function(global) {
	global && this.config.set("enabled", false);
	this._enabled = false;
};

/**
 * Method to extend the template of particular component.
 *
 * @param {String} action
 * The following actions are available:
 *
 * + "insertBefore"
 * + "insertAfter"
 * + "insertAsFirstChild"
 * + "insertAsLastChild"
 * + "replace"
 * + "remove"
 *
 * @param {String} anchor
 * Element name which is a subject of a transformation application.
 *
 * @param {String|Function} [html]
 * The content of a transformation to be applied. Can be defined as a
 * HTML string or a transformer function. This param is required for all
 * actions except "remove".
 */
Plugin.prototype.extendTemplate = function(action, anchor, html) {
	if (html) {
		html = this.substitute({"template": this.invoke(html)});
	}
	this.component.extendTemplate.call(this.component, action, anchor, html);
};

/**
 * @inheritdoc Echo.App#parentRenderer
 */
Plugin.prototype.parentRenderer = function() {
	return this.component.parentRenderer.apply(this.component, arguments);
};

/**
 * Templater function which compiles given template using the provided data.
 * Function can be used widely for html templates processing or any other
 * action requiring string interspersion.
 *
 * @param {Object} args
 * Specifies substitution process, contains application parameters.
 *
 * @param {String} args.template
 * Template containing placeholders used for data interspersion.
 *
 * @param {Object} [args.data]
 * Data used in the template compilation.
 *
 * @param {Boolean} [args.strict]
 * Specifies whether the template should be replaced with the corresponding
 * value, preserving replacement value type.
 *
 * @param {Object} [args.instructions]
 * Object containing the list of extra instructions to be applied during
 * template compilation.
 *
 * @return {String}
 * Compiled string value.
 */
Plugin.prototype.substitute = function(args) {
	var plugin = this;
	var instructions = this._getSubstitutionInstructions();
	args.instructions = args.instructions
		? $.extend(instructions, args.instructions)
		: instructions;
	return plugin.component.substitute(args);
};

/**
 * Method publishes the internal event to make the current state invalid.
 * It triggers the data refresh.
 */
Plugin.prototype.requestDataRefresh = function() {
	Events.publish({
		"topic": "Echo.App.onDataInvalidate",
		"context": this.component.config.get("context"),
		"global": false,
		"propagation": false,
		"data": {}
	});
};

/**
 * @inheritdoc Echo.Utils#log
 */
Plugin.prototype.log = function(data) {
	Utils.log($.extend(data, {"component": this.namespace}));
};

Plugin._defineNestedClass = function(name) {
	Plugin[name] = function(config) {
		this.plugin = config.plugin;
	};
};

Plugin.prototype._init = function() {
	var App = Echo.require("echo/app");
	App.prototype._init.apply(this, arguments);
};

Plugin.prototype._definition = function(key) {
	var plugin = Plugin.getClass(this.name, this.component.name);
	return plugin
		? key ? plugin.definition[key] : plugin.definition
		: undefined;
};

Plugin.prototype._initializers = {};

Plugin.prototype._initializers.css = function() {
	if (!this._definition("css") || Utils.hasCSS(this.namespace)) return;
	Utils.addCSS(this.substitute({"template": this._definition("css")}), this.namespace);
};

Plugin.prototype._initializers.labels = function() {
	return new Labels(this.config.get("labels", {}), this.namespace);
};

Plugin.prototype._initializers.config = function() {
	return new Plugin.Config({"plugin": this});
};

Plugin.prototype._initializers.events = function() {
	return new Plugin.Events({"plugin": this});
};

Plugin.prototype._initializers.subscriptions = function() {
	var self = this;
	$.each(this._definition("events"), function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		self.events.subscribe($.extend({"topic": topic}, data));
	});
};

Plugin.prototype._initializers.renderers = function() {
	var self = this;
	$.each(this._definition("renderers"), function(name, renderer) {
		self.component.extendRenderer.call(self.component, "plugin-" + self.name + "-" + name, $.proxy(renderer, self));
	});
	$.each(this._definition("component").renderers, function(name, renderer) {
		self.component.extendRenderer.call(self.component, name, $.proxy(renderer, self));
	});
};

Plugin.prototype._initializers.view = function() {
	var plugin = this;
	var prefix = "plugin-" + this.name + "-";
	var action = function(name, args) {
		var view = plugin.component.get("view");
		return view[name].apply(view, args);
	};
	return {
		"set": function(name, element) {
			action("set", [prefix + name, element]);
		},
		"get": function(name) {
			return action("get", [prefix + name]);
		},
		"remove": function(element) {
			if (typeof element === "string") {
				element = prefix + element;
			}
			action("remove", [element]);
		},
		"render": function(args) {
			if (args && args.name) {
				args.name = prefix + args.name;
			}
			action("render", [args]);
		}
	};
};

Plugin.prototype._initializers.launcher = function() {
	this._definition("init").call(this);
};

Plugin.prototype._getSubstitutionInstructions = function() {
	var plugin = this;
	return {
		"plugin.label": function(key) {
			return plugin.labels.get(key, "");
		},
		"plugin.class": function(key) {
			return key ? plugin.cssPrefix + key : plugin.cssClass;
		},
		"plugin.data": function(key) {
			return "{self:plugins." + plugin.name + ".data." + key + "}";
		},
		"plugin.self": function(key) {
			return "{self:plugins." + plugin.name + "." + key + "}";
		},
		"plugin.config": function(key) {
			return plugin.config.get(key, "");
		}
	};
};

Plugin._getClassName = function(name, component) {
	return name && component ? component + ".Plugins." + name : undefined;
};

/**
 * @class Echo.Plugin.Config
 * Echo Plugin interlayer for Configuration utilization.
 *
 * @private
 * @package environment.pack.js
 */
Plugin._defineNestedClass("Config");

/**
 * Setter method to define specific config field value.
 *
 * @param {String} key
 * Defines the key where the given data should be stored.
 *
 * @param {Mixed} value
 * The corresponding value which should be defined for the key.
 */
Plugin.Config.prototype.set = function(key, value) {
	this.plugin.component.config.set(this._normalize(key), value);
};

/**
 * Accessor method to get specific config field.
 *
 * @param {String} key
 * Defines the key for data extraction.
 *
 * @param {Object} [defaults]
 * Default value if no corresponding key was found in the config.
 * Note: only the `undefined` JS statement triggers the default
 * value usage. The `false`, `null`, `0`, `[]` are considered
 * as a proper value.
 *
 * @param {Boolean} [askParent]
 * Flag to call parent config if the value was not found in the particular instance.
 *
 * @return {Mixed}
 * Corresponding value found in the config.
 */
Plugin.Config.prototype.get = function(key, defaults, askParent) {
	var component = this.plugin.component;
	var value = component.config.get(
		this._normalize(key),
		this.plugin._definition("config")[key]);
	return typeof value === "undefined"
		? askParent
			? component.config.get(key, defaults)
			: defaults
		: value;
};

/**
 * Method to remove specific config field.
 *
 * @param {String} key
 * Defines the key which should be removed from the configuration.
 */
Plugin.Config.prototype.remove = function(key) {
	this.plugin.component.config.remove(this._normalize(key));
};

/**
 * Method to assemble config for nested application based on the parent application config.
 *
 * @param {Object} data
 * Configuration data to be merged with the parent config.
 *
 * @return {Object}
 * Configuration instance.
 */
Plugin.Config.prototype.assemble = function(data) {
	var config = this.plugin.component.config;
	var defaults = this.plugin.component._definition("config");
	data = data || {};
	data.user = this.plugin.component.user;
	data.parent = config.getAsHash();
	data.plugins = (data.plugins || []).concat(this.plugin.config.get("nestedPlugins", []));

	// copy default field values from parent application
	Utils.foldl(data, defaults, function(value, acc, key) {
		// do not override existing values in data
		if (typeof data[key] === "undefined") {
			acc[key] = config.get(key);
		}
	});
	var keepRefsFor = {"data": true, "parent": true};
	var instance = new Configuration(data, this.plugin.config.get(), undefined, keepRefsFor);
	return instance.getAsHash();
};

Plugin.Config.prototype._normalize = function(key) {
	return (["plugins", this.plugin.name].concat(key ? key : [])).join(".");
};

/**
 * @class Plugin.Events
 * Echo Plugin interlayer for Events utilization
 *
 * @private
 * @package environment.pack.js
 */
Plugin._defineNestedClass("Events");

/**
 * @inheritdoc Echo.Events#publish
*/
Plugin.Events.prototype.publish = function(params) {
	params.topic = ["Plugins", this.plugin.name, params.topic].join(".");
	return this.plugin.component.events.publish(params);
};

/**
 * @inheritdoc Echo.Events#subscribe
*/
Plugin.Events.prototype.subscribe = function(params) {
	params.handler = $.proxy(params.handler, this.plugin);
	return this.plugin.component.events.subscribe(params);
};

/**
 * @inheritdoc Echo.Events#unsubscribe
*/
Plugin.Events.prototype.unsubscribe = function(params) {
	this.plugin.component.events.unsubscribe(params);
};

return Plugin;

});
