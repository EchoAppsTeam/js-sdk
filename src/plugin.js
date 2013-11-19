define("echo/plugin", [
	"jquery",
	"echo/control",
	"echo/utils",
	"echo/labels",
	"echo/configuration",
	"echo/events",
	"require"
], function($, Control, utils, Labels, Configuration, Events, require) {
	
	"use strict";

	/**
	 * @class Plugin
	 * Foundation class implementing core logic to create plugins and manipulate with them.
	 *
	 * Please visit [this page](#!/guide/how_to_develop_plugin) to learn more about developing plugins
	 *
	 * @package environment.pack.js
	 */
	var Plugin = function() {};

	/**
	 * @static
	 * Function which creates a plugin JS class using its manifest declaration.
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
	Plugin.create = function(manifest) {
		var plugin = Plugin.getClass(manifest.name, manifest.component.name);

		// prevent multiple re-definitions
		if (plugin) return plugin;

		var constructor = utils.inherit(Plugin, function(config) {
			if (!config || !config.component) {
				utils.log({
					"type": "error",
					"component": manifest.name,
					"message": "Unable to initialize plugin, config is invalid",
					"args": {"config": config}
				});
				return;
			}
			this.name = manifest.name;
			this.component = config.component;
			this.cssClass = this.component.get("cssPrefix") + "plugin-" + manifest.name;
			this.cssPrefix = this.cssClass + "-";

			// define extra css class for the control target
			this.component.config.get("target").addClass(this.cssClass);

			this._init(["config"]);
		});
		var namespace = Plugin._getClassName(manifest.name, manifest.component.name);

		constructor.manifest = manifest;
		constructor.prototype.namespace = namespace;

		// define default language var values with the lowest priority available
		Labels.set($.extend({}, manifest.labels), namespace, true);

		if (manifest.methods) {
			$.extend(constructor.prototype, manifest.methods);
		}

		utils.set(window, namespace, constructor);
		return constructor;
	};

	/**
	 * @static
	 * This method returns common manifest structure.
	 *
	 * @param {String} name
	 * Specifies plugin name.
	 *
	 * @param {String} component
	 * Specifies the component name to be extended.
	 *
	 * @return {Object}
	 * Basic plugin manifest declaration.
	 */
	Plugin.manifest = function(name, component) {
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
	 * @param {Object|String} manifest
	 * Plugin manifest or plugin name.
	 *
	 * @return {Boolean}
	 */
	Plugin.isDefined = function(manifest) {
		if (typeof manifest === "string") {
			var component = utils.get(window, manifest);
			return !!(component && component.manifest);
		}
		return !!Plugin.getClass(manifest.name, manifest.component.name);
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
		return utils.get(window, Plugin._getClassName(name, component));
	};

	/**
	 * Initializes the plugin.
	 */
	Plugin.prototype.init = function() {
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
			this._enabled = enabled && !!this._manifest("enabled").call(this);
		}
		return this._enabled;
	};

	/**
	 * @inheritdoc Control#set
	 */
	Plugin.prototype.set = function(key, value) {
		return utils.set(this, key, value);
	};

	/**
	 * @inheritdoc Control#get
	 */
	Plugin.prototype.get = function(key, defaults) {
		return utils.get(this, key, defaults);
	};

	/**
	 * @inheritdoc Control#remove
	 */
	Plugin.prototype.remove = function(key) {
		return utils.remove(this, key);
	};

	/**
	 * @inheritdoc utils#invoke
	 */
	Plugin.prototype.invoke = function(mixed, context) {
		return utils.invoke(mixed, context || this);
	};

	/**
	 * Method to enable the plugin.
	 * The plugin becomes enabled for the current control instance and
	 * the update can also be reflected in the config (if the "global"
	 * flag is defined during the function invocation) to enable it
	 * for other controls which use the same config parameters.
	 *
	 * @param {Boolean} [global]
	 * Specifies if the plugin should be enabled in the config. By default
	 * the function enables the plugin for the current control instance only.
	 */
	Plugin.prototype.enable = function(global) {
		global && this.config.set("enabled", true);
		this._enabled = true;
	};

	/**
	 * Method to disable the plugin.
	 * The plugin becomes disabled for the current control instance and
	 * the update can also be reflected in the config (if the "global"
	 * flag is defined during the function invocation) to disable it
	 * for other controls which use the same config parameters.
	 *
	 * @param {Boolean} [global]
	 * Specifies if the plugin should be disabled in the config. By default
	 * the function disables the plugin for the current control instance only.
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
	 * @inheritdoc Control#parentRenderer
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
			"topic": "Control.onDataInvalidate",
			"context": this.component.config.get("context"),
			"global": false,
			"propagation": false,
			"data": {}
		});
	};

	/**
	 * @inheritdoc utils#log
	 */
	Plugin.prototype.log = function(data) {
		utils.log($.extend(data, {"component": this.namespace}));
	};

	Plugin._defineNestedClass = function(name) {
		Plugin[name] = function(config) {
			this.plugin = config.plugin;
		};
	};

	Plugin.prototype._init = function() {
		var Control = require("echo/control");
		Control.prototype._init.apply(this, arguments);
	};

	Plugin.prototype._manifest = function(key) {
		var plugin = Plugin.getClass(this.name, this.component.name);
		return plugin
			? key ? plugin.manifest[key] : plugin.manifest
			: undefined;
	};

	Plugin.prototype._initializers = {};

	Plugin.prototype._initializers.css = function() {
		if (!this._manifest("css") || utils.hasCSS(this.namespace)) return;
		utils.addCSS(this.substitute({"template": this._manifest("css")}), this.namespace);
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
		$.each(this._manifest("events"), function(topic, data) {
			data = $.isFunction(data) ? {"handler": data} : data;
			self.events.subscribe($.extend({"topic": topic}, data));
		});
	};

	Plugin.prototype._initializers.renderers = function() {
		var self = this;
		$.each(this._manifest("renderers"), function(name, renderer) {
			self.component.extendRenderer.call(self.component, "plugin-" + self.name + "-" + name, $.proxy(renderer, self));
		});
		$.each(this._manifest("component").renderers, function(name, renderer) {
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
		this._manifest("init").call(this);
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
	 * @class Plugin.Config
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
	Plugin.Config.prototype.remove = function(key) {
		this.plugin.component.config.remove(this._normalize(key));
	};

	/**
	 * Method to assemble config for nested control based on the parent control config.
	 *
	 * @param {Object} data
	 * Configuration data to be merged with the parent config.
	 *
	 * @return {Object}
	 * Configuration instance.
	 */
	Plugin.Config.prototype.assemble = function(data) {
		var config = this.plugin.component.config;
		var defaults = this.plugin.component._manifest("config");
		data = data || {};
		data.user = this.plugin.component.user;
		data.parent = config.getAsHash();
		data.plugins = (data.plugins || []).concat(this.plugin.config.get("nestedPlugins", []));

		// copy default field values from parent control
		utils.foldl(data, defaults, function(value, acc, key) {
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
	 * @inheritdoc Events#publish
	*/
	Plugin.Events.prototype.publish = function(params) {
		params.topic = ["Plugins", this.plugin.name, params.topic].join(".");
		return this.plugin.component.events.publish(params);
	};

	/**
	 * @inheritdoc Events#subscribe
	*/
	Plugin.Events.prototype.subscribe = function(params) {
		params.handler = $.proxy(params.handler, this.plugin);
		return this.plugin.component.events.subscribe(params);
	};

	/**
	 * @inheritdoc Events#unsubscribe
	*/
	Plugin.Events.prototype.unsubscribe = function(params) {
		this.plugin.component.events.unsubscribe(params);
	};

	return Plugin;
});
