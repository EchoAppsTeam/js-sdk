(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugin")) return;

// TODO: replace "Plugins" with different name to avoid conflict with e2 scripts
if (!Echo.Plugins) Echo.Plugins = {};

Echo.Plugin = function() {};

// static interface

Echo.Plugin.create = function(manifest) {
	var plugin = Echo.Utils.getNestedValue(window, manifest.name);
	// prevent multiple re-definitions
	if (plugin) return plugin;
	var _constructor = function(config) {
		if (!config || !config.component) return;
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
		// we treat "false" as an indication that the plugin was not initialized
		if (manifest.init.call(this) === false) {
			this.disable();
		} else {
			this.enable();
		}
	};
	_constructor.manifest = manifest;
	Echo.Utils.inherit(_constructor, Echo.Plugin);
	if (manifest.methods) {
		$.extend(_constructor.prototype, manifest.methods);
	}
	Echo.Utils.setNestedValue(Echo.Plugins, manifest.name, _constructor);
	return _constructor;
};

Echo.Plugin.skeleton = function(name) {
	return {
		"name": name,
		"config": {},
		"labels": {},
		"events": {},
		"methods": {},
		"renderers": {},
		"templates": {},
		"init": function(){}
	};
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
	return this.config.get("enabled");
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

Echo.Plugin.prototype.addItemButton = function(button) {
	var buttons = this.component.config.get("itemButtons." + name, []);
	this.component.config.set("itemButtons." + name, buttons.concat(button));
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

Echo.Plugin.prototype.destroy = function() {};

// internal functions

Echo.Plugin.prototype.init = function(subsystems) {
	var plugin = this;
	$.map(subsystems, function(system) {
		if (plugin[system]) return;
		plugin.constructor.prototype[system] = plugin.init[system].call(plugin);
	});
};

Echo.Plugin.prototype.init.css = function() {
	var manifest = this.manifest;
	if (!manifest.css) return;
	Echo.Utils.addCSS(this.substitute(manifest.css), "plugins-" + manifest.name);
};

Echo.Plugin.prototype.init.renderers = function() {
	var plugin = this;
};

Echo.Plugin.prototype.init.labels = function() {
	var plugin = this;
	var labels = {
		"set": function(labels) {
			Echo.Labels.set(labels, "Plugins." + plugin.name, true);
		},
		"get": function(label, data) {
			return Echo.Labels.get(label, "Plugins." + plugin.name, data);
		}
	};
	if (plugin.manifest.labels) {
		labels.set(plugin.manifest.labels);
	}
	return labels;
};

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
	var plugin = this, component = plugin.component;
	var events = {
		"publish": function(params) {
			var parts = ["Plugins", plugin.name, params.topic];
			params.topic = (params.prefix ? [params.prefix] : []).concat(parts).join(".");
			return component.events.publish(params);
		},
		"subscribe": function(params) {
			var handler = params.handler;
			params.handler = function() {
				if (!plugin.enabled()) return;
				return handler.apply(plugin, arguments);
			}
			return component.events.subscribe(params);
		},
		"unsubscribe": function(params) {
			component.events.unsubscribe(params);
		}
	};
	$.each(this.manifest.events, function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		events.subscribe($.extend({"topic": topic}, data));
	});
	return events;
};

})(jQuery);
