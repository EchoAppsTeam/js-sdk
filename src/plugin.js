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
		this.name = config.name;
		this.manifest = manifest; // TODO: avoid this, pass via param to "renderer"...
		this.component = config.component;
		this.init(["renderers", "events", "labels", "config"]);
		manifest.init.call(this);
	};
	_constructor.manifest = manifest;
	Echo.Utils.inherit(_constructor, Echo.Plugin);
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
	Echo.Utils.setNestedValue(this.component.vars[this.name], key, value);
};

Echo.Plugin.prototype.get = function(key, defaults) {
	Echo.Utils.getNestedValue(this.component.vars[this.name], key, defaults);
};

Echo.Plugin.prototype.addCSS = function(text) {
	Echo.Utils.addCSS(text, "plugins-" + this.name);
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

Echo.Plugin.prototype.extendTemplate = function() {
	this.component.extendTemplate.apply(this.component, arguments);
};

Echo.Plugin.prototype.parentRenderer = function() {
	return this.component.parentRenderer.apply(this.component, arguments);
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

Echo.Plugin.prototype.init.renderers = function() {
	var plugin = this;
};

Echo.Plugin.prototype.init.labels = function() {
	// TODO: append all labels...
	var plugin = this;
	return {
		"set": function(labels) {
			Echo.Lables.set(labels, "Plugins." + plugin.name, true);
		},
		"get": function(label) {
			return Echo.Lables.get(label, "Plugins." + plugin.name);
		}
	};
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
			var value = component.config.get(normalize(key));
			return typeof value == undefined
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
			Echo.Utils.foldl(data, plugin.component.getDefaultConfig(),
				function(value, acc, key) {
					acc[key] = config.get(key);
				}
			);
			return (new Echo.Configuration(data, plugin.config.get())).getAsHash();
		}
	};
};

Echo.Plugin.prototype.init.events = function() {
	// TODO: subscribe to all events...
	var plugin = this, component = plugin.component;
	var normalize = function(prefix, action) {
		var name = [this.component.name, this.name, action];
		return (prefix ? [prefix] : []).concat(name).join(".");
	};
	return {
		"publish": function(params) {
			params.topic = normalize(params.topic);
			return component.events.publish(params);
		},
		"subscribe": function(params) {
			params.topic = normalize(params.topic);
			return component.events.subscribe(params);
		},
		"unsubscribe": function(params) {
			component.events.unsubscribe(params);
		}
	};
};

})(jQuery);
