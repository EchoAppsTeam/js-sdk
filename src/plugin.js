(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugin")) return;

Echo.Plugin = function() {};

// static interface

Echo.Plugin.create = function(manifest) {
	var plugin = Echo.Plugin.getClass(manifest.name, manifest.component);
	// prevent multiple re-definitions
	if (plugin) return plugin;
	var _constructor = function(config) {
		if (!config || !config.component) return;
		var self = this;
		this.name = manifest.name;
		this.manifest = manifest; // TODO: avoid this, pass via param to "renderer"...
		this.component = config.component;
		this.cssPrefix = this.component.cssPrefix + "-plugin-" + manifest.name;
		// define extra css class for the control target
		this.component.config.get("target").addClass(this.cssPrefix);
		this._init([
			"css",
			"events",
			"labels",
			"config"
		]);
		// define plugin labels
		if (manifest.labels) {
			self.labels.set(manifest.labels);
		}
		// subscribe to the events defined in the plugin
		$.each(manifest.events, function(topic, data) {
			data = $.isFunction(data) ? {"handler": data} : data;
			self.events.subscribe($.extend({"topic": topic}, data));
		});
		// we treat "false" as an indication that the plugin was not initialized
		if (manifest.init.call(this) === false) {
			this.disable();
		}
	};
	_constructor.manifest = manifest;
	Echo.Utils.inherit(_constructor, Echo.Plugin);
	if (manifest.methods) {
		$.extend(_constructor.prototype, manifest.methods);
	}
	Echo.Utils.setNestedValue(
		window,
		Echo.Plugin.getClassName(manifest.name, manifest.component),
		_constructor
	);
	return _constructor;
};

Echo.Plugin.skeleton = function(name, component) {
	return {
		"name": name,
		"component": component,
		"config": {},
		"labels": {},
		"events": {},
		"methods": {},
		"renderers": {},
		"templates": {},
		"init": function(){}
	};
};

Echo.Plugin.isDefined = function(manifest) {
	return !!Echo.Plugin.getClass(manifest.name, manifest.component);
};

Echo.Plugin.getClass = function(name, component) {
	return Echo.Utils.getNestedValue(window, Echo.Plugin.getClassName(name, component));
};

Echo.Plugin.getClassName = function(name, component) {
	return component + ".Plugins." + name;
};

Echo.Plugin.prototype.set = function(key, value) {
	Echo.Utils.setNestedValue(this, key, value);
};

Echo.Plugin.prototype.get = function(key, defaults) {
	return Echo.Utils.getNestedValue(this, key, defaults);
};
		
Echo.Plugin.prototype.enable = function() {
	this.config.set("enabled", true);
};

Echo.Plugin.prototype.disable = function() {
	this.config.set("enabled", false);
};

Echo.Plugin.prototype.enabled = function(name) {
	return this.config.get("enabled", true);
};

Echo.Plugin.prototype.extendRenderer = function(name, renderer) {
	this.component.extendRenderer.call(this.component, name, $.proxy(renderer, this));
};

Echo.Plugin.prototype.extendTemplate = function(html, action, anchor) {
	html = this.substitute($.isFunction(html) ? html() : html);
	this.component.extendTemplate.call(this.component, html, action, anchor);
};

Echo.Plugin.prototype.parentRenderer = function() {
	return this.component.parentRenderer.apply(this.component, arguments);
};

Echo.Plugin.prototype.substitute = function(template) {
	var plugin = this;
	return plugin.component.substitute(template, {}, {
		"plugin.label": function(key) {
			return plugin.labels.get(key, "");
		},
		"plugin.class": function(value) {
			return plugin.cssPrefix + "-" + value;
		},
		"plugin.data": function(key) {
			return "{self:plugins." + plugin.name + ".data." + key + "}";
		},
		"plugin.self": function(key) {
			return "{self:plugins." + plugin.name + "." + key + "}";
		},
		"plugin.config": function(key) {
			return "{config:plugins." + plugin.name + "." + key + "}";
		}
	});
};

Echo.Plugin.prototype.requestDataRefresh = function() {
	Echo.Events.publish({
		"topic": "internal.Echo.Control.onDataInvalidate",
		"bubble": true,
		"context": this.component.config.get("context")
	});
};

Echo.Plugin.prototype.destroy = function() {};

// internal functions

Echo.Plugin._defineNestedClass = function(name) {
	Echo.Plugin[name] = function(config) {
		this.plugin = config.plugin;
	};
};

Echo.Plugin.prototype._init = function() {
	Echo.Control.prototype._init.apply(this, arguments);
};

Echo.Plugin.prototype._init.css = function() {
	var manifest = this.manifest;
	if (!manifest.css) return;
	var parts = [this.component.manifest.name, "Plugins", manifest.name];
	Echo.Utils.addCSS(this.substitute(manifest.css), parts.join("."));
};

Echo.Plugin.prototype._init.labels = function() {
	return new Echo.Plugin.Labels({"plugin": this});
};

Echo.Plugin.prototype._init.config = function() {
	return new Echo.Plugin.Config({"plugin": this});
};

Echo.Plugin.prototype._init.events = function() {
	return new Echo.Plugin.Events({"plugin": this});
};

// Plugin Labels class

Echo.Plugin._defineNestedClass("Labels");

Echo.Plugin.Labels.prototype.set = function(labels) {
	Echo.Labels.set(labels, "Plugins." + this.plugin.name, true);
};

Echo.Plugin.Labels.prototype.get = function(label, data) {
	return Echo.Labels.get(label, "Plugins." + this.plugin.name, data);
};

// Plugin Config class

Echo.Plugin._defineNestedClass("Config");

Echo.Plugin.Config.prototype.normalize = function(key) {
	return (["plugins", this.plugin.manifest.name].concat(key ? key : [])).join(".");
};

Echo.Plugin.Config.prototype.set = function(key, value) {
	this.plugin.component.config.set(this.normalize(key), value);
};

Echo.Plugin.Config.prototype.get = function(key, defaults, askParent) {
	var component = this.plugin.component;
	var value = component.config.get(this.normalize(key), this.plugin.manifest.config[key]);
	return typeof value == "undefined"
		? askParent
			? component.config.get(key, defaults)
			: defaults
		: value;
};

Echo.Plugin.Config.prototype.remove = function(key) {
	this.plugin.component.config.remove(this.normalize(key));
};

Echo.Plugin.Config.prototype.assemble = function(data) {
	var config = this.plugin.component.config;
	var defaults = this.plugin.component.get("defaults.config");
	data.plugins = config.get("nestedPlugins", []);
	data.parent = config.getAsHash();

	// copy default field values from parent control
	Echo.Utils.foldl(data, defaults, function(value, acc, key) {
		acc[key] = config.get(key);
	});
	return (new Echo.Configuration(data, this.plugin.config.get())).getAsHash();
};

// Plugin Events class

Echo.Plugin._defineNestedClass("Events");

Echo.Plugin.Events.prototype.publish = function(params) {
	params.topic = ["Plugins", this.plugin.name, params.topic].join(".");
	return this.plugin.component.events.publish(params);
};

Echo.Plugin.Events.prototype.subscribe = function(params) {
	var self = this;
	var handler = params.handler;
	params.handler = function() {
		if (!self.plugin.enabled()) return;
		return handler.apply(self.plugin, arguments);
	};
	return this.plugin.component.events.subscribe(params);
};

Echo.Plugin.Events.prototype.unsubscribe = function(params) {
	this.plugin.component.events.unsubscribe(params);
};

})(jQuery);
