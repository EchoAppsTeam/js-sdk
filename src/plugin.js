(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Plugin")) return;

/**
 * @class Echo.Plugin
 * Foundation class implementing core logic to create plugins and manipulate with them.
 */
Echo.Plugin = function() {};

/**
 * @static
 * Function which creates a plugin object using it manifest declaration.
 * 
 * @param {Object} manifest
 * Specifies the plugin interface in the predefined way.
 *
 * @param {String} manifest.name
 * Specifies the Plugin name.
 *
 * @param {Object} [manifest.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [manifest.labels]
 * Specifies the list of language labels used in the particular plugin UI.
 *
 * @param {Object} [manifest.events]
 * Specifies the list of external events used by plugin.
 *
 * @param {Object} [manifest.methods]
 * Specifies the list of plugin methods.
 *
 * @param {Object} [manifest.renderers]
 * Specifies the list of plugin renderers.
 *
 * @param {Object} [manifest.templates]
 * Specifies the list of plugin templates.
 *
 * @param {Function} [manifest.init]
 * Function called during plugin initialization.
 *
 * @param {String} [manifest.css]
 * Specifies the CSS rules for the plugin.
 *
 * @return {Object}
 * Generated plugin class.
 */
Echo.Plugin.create = function(manifest) {
	var plugin = Echo.Plugin.getClass(manifest.name, manifest.component.name);

	// prevent multiple re-definitions
	if (plugin) return plugin;

	var constructor = function(config) {
		if (!config || !config.component) return;
		var self = this;
		this.name = manifest.name;
		this.component = config.component;
		this.cssClass = this.component.get("cssPrefix") + "plugin-" + manifest.name;
		this.cssPrefix = this.cssClass + "-";

		// define extra css class for the control target
		this.component.config.get("target").addClass(this.cssClass);

		this._init(["config"]);
	};
	constructor.manifest = manifest;
	constructor.dependencies = manifest.dependencies;

	Echo.Utils.inherit(constructor, Echo.Plugin);

	if (manifest.methods) {
		$.extend(constructor.prototype, manifest.methods);
	}
	Echo.Utils.setNestedValue(
		window,
		Echo.Plugin._getClassName(manifest.name, manifest.component.name),
		constructor
	);
	return constructor;
};

/**
 * @static
 * Method returning common manifest structure.
 *
 * @param {String} name
 * Specifies plugin name.
 *
 * @param {String} component
 * Specifies component name to be extended.
 *
 * @return {Object}
 * Basic plugin manifest declaration.
 */
Echo.Plugin.manifest = function(name, component) {
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
		"dependencies": [],
		"enabled": function() { return true; },
		"init": function(){},
		"destroy": undefined
	};
};

/**
 * @static
 * Checks if plugin is already defined.
 *
 * @param {Object} manifest
 * Plugin manifest.
 * 
 * @return {Boolean}
 */
Echo.Plugin.isDefined = function(manifest) {
	return !!Echo.Plugin.getClass(manifest.name, manifest.component.name);
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
Echo.Plugin.getClass = function(name, component) {
	return Echo.Utils.getNestedValue(window, Echo.Plugin._getClassName(name, component));
};

/**
 * Initializes the plugin.
 */
Echo.Plugin.prototype.init = function() {
	this._init([
		"css",
		"events",
		"subscriptions",
		"labels",
		"renderers",
		"view",
		"launcher"
	]);
};

/**
 * Checks if the plugin is enabled.
 */
Echo.Plugin.prototype.enabled = function() {
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
		this._enabled = enabled && !!this._manifest("enabled").call(this);
	}
	return this._enabled;
};

/**
 * @inheritdoc Echo.Control#set
 */
Echo.Plugin.prototype.set = function(key, value) {
	Echo.Utils.setNestedValue(this, key, value);
};

/**
 * @inheritdoc Echo.Control#get
 */
Echo.Plugin.prototype.get = function(key, defaults) {
	return Echo.Utils.getNestedValue(this, key, defaults);
};

/**
 * @inheritdoc Echo.Control#remove
 */
Echo.Plugin.prototype.remove = function(key) {
	this.set(key, undefined);
};

/**
 * @inheritdoc Echo.Utils#invoke
 */
Echo.Plugin.prototype.invoke = function(mixed, context) {
	return Echo.Utils.invoke(mixed, context || this);
};

/**
 * Enables the plugin.
 */
Echo.Plugin.prototype.enable = function(global) {
	global && this.config.set("enabled", true);
	this._enabled = true;
};

/**
 * Disables the plugin.
 */
Echo.Plugin.prototype.disable = function(global) {
	global && this.config.set("enabled", false);
	this._enabled = false;
};

/**
 * Method to extend the template of particular component.
 *
 * @param {String} action
 * One of the following actions:
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
Echo.Plugin.prototype.extendTemplate = function(action, anchor, html) {
	if (html) {
		html = this.substitute({"template": this.invoke(html)});
	}
	this.component.extendTemplate.call(this.component, action, anchor, html);
};

/**
 * @inheritdoc Echo.Control#parentRenderer
 */
Echo.Plugin.prototype.parentRenderer = function() {
	return this.component.parentRenderer.apply(this.component, arguments);
};

/**
 * Templater function which compiles given template using the provided data.
 * Function can be used widely for html templates processing or any other
 * action requiring string interspersion.
 *
 * @param {Object} args
 * Specifies substitution process, contains control parameters.
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
Echo.Plugin.prototype.substitute = function(args) {
	var plugin = this;
	return plugin.component.substitute($.extend(args, {
		"instructions": {
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
		}
	}));
};

/**
 * Method publishes the internal event to make current state invalid.
 * It triggers data refresh.
 */
Echo.Plugin.prototype.requestDataRefresh = function() {
	Echo.Events.publish({
		"topic": "Echo.Control.onDataInvalidate",
		"context": this.component.config.get("context"),
		"global": false,
		"propagation": false,
		"data": {}
	});
};

/**
 * @inheritdoc Echo.Utils#log
 */
Echo.Plugin.prototype.log = function(data) {
	Echo.Utils.log($.extend(data, {"component": this.component.name + ".Plugins." + this.name}));
};

Echo.Plugin._defineNestedClass = function(name) {
	Echo.Plugin[name] = function(config) {
		this.plugin = config.plugin;
	};
};

Echo.Plugin.prototype._init = function() {
	Echo.Control.prototype._init.apply(this, arguments);
};

Echo.Plugin.prototype._manifest = function(key) {
	var plugin = Echo.Plugin.getClass(this.name, this.component.name);
	return plugin
		? key ? plugin.manifest[key] : plugin.manifest
		: undefined;
};

Echo.Plugin.prototype._initializers = {};

Echo.Plugin.prototype._initializers.css = function() {
	if (!this._manifest("css")) return;
	var parts = [this.component.get("name"), "Plugins", this.name];
	Echo.Utils.addCSS(this.substitute({"template": this._manifest("css")}), parts.join("."));
};

Echo.Plugin.prototype._initializers.labels = function() {
	var namespace = this.component.get("name") + ".Plugins." + this.name;

	// define default language var values with the lowest priority available
	Echo.Labels.set($.extend({}, this._manifest("labels")), namespace, true);

	// define language var values passed within the config with the highest priority
	return new Echo.Labels(this.config.get("labels", {}), namespace);
};

Echo.Plugin.prototype._initializers.config = function() {
	return new Echo.Plugin.Config({"plugin": this});
};

Echo.Plugin.prototype._initializers.events = function() {
	return new Echo.Plugin.Events({"plugin": this});
};

Echo.Plugin.prototype._initializers.subscriptions = function() {
	var self = this;
	$.each(this._manifest("events"), function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		self.events.subscribe($.extend({"topic": topic}, data));
	});
};

Echo.Plugin.prototype._initializers.renderers = function() {
	var self = this;
	$.each(this._manifest("renderers"), function(name, renderer) {
		self.component.extendRenderer.call(self.component, "plugin-" + self.name + "-" + name, $.proxy(renderer, self));
	});
	$.each(this._manifest("component").renderers, function(name, renderer) {
		self.component.extendRenderer.call(self.component, name, $.proxy(renderer, self));
	});
};

Echo.Plugin.prototype._initializers.view = function() {
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

Echo.Plugin.prototype._initializers.launcher = function() {
	this._manifest("init").call(this);
};

Echo.Plugin._getClassName = function(name, component) {
	return name && component ? component + ".Plugins." + name : undefined;
};

/**
 * @class Echo.Plugin.config
 * Echo Plugin interlayer for Echo.Configuration utilization.
 */
Echo.Plugin._defineNestedClass("Config");

/**
 * Setter method to define specific config field value.
 *
 * @param {String} key
 * Defines the key where the given data should be stored.
 *
 * @param {Mixed} value
 * The corresponding value which should be defined for the key.
 */
Echo.Plugin.Config.prototype.set = function(key, value) {
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
Echo.Plugin.Config.prototype.get = function(key, defaults, askParent) {
	var component = this.plugin.component;
	var value = component.config.get(
		this._normalize(key),
		this.plugin._manifest("config")[key]);
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
Echo.Plugin.Config.prototype.remove = function(key) {
	this.plugin.component.config.remove(this._normalize(key));
};

/**
 * Method to assemble config for nested control based on the parent control config.
 *
 * @param {Object} data
 * Configuration data to be merged with the parent config.
 *
 * @return {Object}
 * Echo.Configuration instance.
 */
Echo.Plugin.Config.prototype.assemble = function(data) {
	var config = this.plugin.component.config;
	var defaults = this.plugin.component.get("defaults.config");
	data = data || {};
	data.plugins = this.plugin.config.get("nestedPlugins", []);
	data.parent = config.getAsHash();

	// copy default field values from parent control
	Echo.Utils.foldl(data, defaults, function(value, acc, key) {
		// do not override existing values in data
		if (typeof data[key] === "undefined") {
			acc[key] = config.get(key);
		}
	});
	return (new Echo.Configuration(data, this.plugin.config.get())).getAsHash();
};

Echo.Plugin.Config.prototype._normalize = function(key) {
	return (["plugins", this.plugin.name].concat(key ? key : [])).join(".");
};

/**
 * @class Echo.Plugin.events
 * Echo Plugin interlayer for Echo.Events utilization
 */
Echo.Plugin._defineNestedClass("Events");

/**
 * @inheritdoc Echo.Events#publish
*/
Echo.Plugin.Events.prototype.publish = function(params) {
	params.topic = ["Plugins", this.plugin.name, params.topic].join(".");
	return this.plugin.component.events.publish(params);
};

/**
 * @inheritdoc Echo.Events#subscribe
*/
Echo.Plugin.Events.prototype.subscribe = function(params) {
	params.handler = $.proxy(params.handler, this.plugin);
	return this.plugin.component.events.subscribe(params);
};

/**
 * @inheritdoc Echo.Events#unsubscribe
*/
Echo.Plugin.Events.prototype.unsubscribe = function(params) {
	this.plugin.component.events.unsubscribe(params);
};

})(Echo.jQuery);
