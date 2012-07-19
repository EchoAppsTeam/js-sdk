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
		this.init([
			"css",
			"renderers",
			"events",
			"labels",
			"config"
		]);
		if (manifest.labels) {
			self.labels.set(manifest.labels);
		}
		// we treat "false" as an indication that the plugin was not initialized
		if (manifest.init.call(this) === false) {
			this.disable();
		}
		$.each(manifest.events, function(topic, data) {
			data = $.isFunction(data) ? {"handler": data} : data;
			self.events.subscribe($.extend({"topic": topic}, data));
		});
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
		"topic": "local.Echo.Control.onDataInvalidate",
		"bubble": true,
		"context": this.component.config.get("context")
	});
};

Echo.Plugin.prototype.destroy = function() {};

// internal functions

Echo.Plugin.prototype.init = function(subsystems) {
	var plugin = this;
	$.map(subsystems, function(system) {
		plugin[system] = plugin.init[system].call(plugin);
	});
};

Echo.Plugin.prototype.init.css = function() {
	var manifest = this.manifest;
	if (!manifest.css) return;
	var parts = [this.component.manifest.name, "Plugins", manifest.name];
	Echo.Utils.addCSS(this.substitute(manifest.css), parts.join("."));
};

Echo.Plugin.prototype.init.renderers = function() {
	var plugin = this;
};

Echo.Plugin.prototype.init.labels = function() {
	var plugin = this;
	return {
		"set": function(labels) {
			Echo.Labels.set(labels, "Plugins." + plugin.name, true);
		},
		"get": function(label, data) {
			return Echo.Labels.get(label, "Plugins." + plugin.name, data);
		}
	};
};

//TODO: rework this function in Events style
Echo.Plugin.prototype.init.config = function() {
	var plugin = this, component = plugin.component;
	var normalize = function(key) {
		return (["plugins", plugin.manifest.name].concat(key ? key : [])).join(".");
	};
	return {
		"set": function(key, value) {
			component.config.set(normalize(key), value);
		},
		"get": function(key, defaults, askParent) {
			var value = component.config.get(
				normalize(key),
				plugin.manifest.config[key]
			);
			return typeof value == "undefined"
				? askParent
					? component.config.get(key, defaults)
					: defaults
				: value;
		},
		"remove": function(key) {
			component.config.remove(normalize(key));
		},
		"assemble": function(data) {
			var config = plugin.component.config;
			data.plugins = config.get("nestedPlugins", []);
			data.parent = config.getAsHash();

			// copy default field values from parent control
			Echo.Utils.foldl(data, plugin.component.get("defaults.config"),
				function(value, acc, key) {
					acc[key] = config.get(key);
				}
			);
			return (new Echo.Configuration(data, plugin.config.get())).getAsHash();
		}
	};
};

Echo.Plugin.prototype.init.events = function() {
	return new Echo.Plugin.Events({"plugin": this});
};

Echo.Plugin.Events = function(config) {
	this.plugin = config.plugin;
};

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
