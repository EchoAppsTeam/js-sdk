(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.Control")) return;

// TODO: replace "Plugins" with different name to avoid conflict with e2 scripts
if (!Echo.Plugins) Echo.Plugins = {};

Echo.Control = function() {};

// static interface

Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getNestedValue(window, manifest.name);
	// prevent multiple re-definitions
	if (control) return control;
	var _constructor = function(config) {
		var self = this;
		if (!config || !config.target) return;
		this.manifest = manifest;
		this.init([
			"vars",
			["config", [config]],
			"dom",
			"events",
			"labels",
			"css",
			"renderers",
			["user", [function() {
				self.init([["plugins", [manifest.constructor]]]);
			}]]
		]);
	};
	Echo.Utils.inherit(_constructor, manifest.inherits || Echo.Control);
	if (manifest.methods) {
		$.extend(_constructor.prototype, manifest.methods);
	}
	_constructor.prototype.templates = manifest.templates;
	Echo.Utils.setNestedValue(window, manifest.name, _constructor);
	return _constructor;
};

Echo.Control.skeleton = function(name) {
	return {
		"name": name,
		"config": {},
		"labels": {},
		"events": {},
		"methods": {},
		"renderers": {},
		"templates": {},
		"constructor": function(){ this.render(); }
	};
};

// dynamic interface (available for class instances)

Echo.Control.prototype.substitute = function(template, data) {
	var control = this;
	var name = control._cssClassFromControlName();
	var extract = function(value) {
		return $.isFunction(value) ? value() : value;
	};
	var instructions = {
		"class": function(value) {
			return name + "-" + value;
		},
		"data": function(key) {
			return Echo.Utils.getNestedValue(data, key, "");
		},
		"label": function(key) {
			return control.labels.get(key, "");
		},
		"self": function(key) {
			var value = Echo.Utils.getNestedValue(control, key, function() {
				var _value = Echo.Utils.getNestedValue(control.data, key,
					function() { return control.config.get(key, ""); });
				return extract(_value);
			});
			return extract(value);
		}
	};
	var processor = function(match, key, value) {
		return instructions[key] ? instructions[key](value) : match;
	};
	return template.replace(Echo.Vars.regexps.templateSubstitution, processor);
};

Echo.Control.prototype.render = function(config) {
	var control = this;
	var cssClass = this._cssClassFromControlName();
	config = config || {};

	// render template
	if (config.template) {
		var templates = {};
		templates.raw = $.isFunction(config.template)
			? config.template.call(control)
			: config.template;
		templates.processed = control.substitute(templates.raw, config.data || {});
		return Echo.Utils.toDOM(templates.processed, cssClass + "-",
			function(renderer, element, dom, extra) {
				control.render.apply(control, [{
					"element": arguments[0],
					"args": [element, dom, extra]
				}]);
			}
		);
	}

	// render specific element
	if (config.element) {
		if (control.renderers[config.element]) {
			control.renderers[config.element][0].apply(control, config.args);
		}
		return;
	}

	// render the whole control
	this.dom = this.render({"template": this.template, "data": config.data || {}});
	this.config.get("target")
		.addClass(cssClass)
		.empty()
		.append(this.dom.content);
	this.events.publish({"topic": "onRender"});
	return this.dom;
};

Echo.Control.prototype.rerender = function(config) {
	var control = this;
	config = config || {};

	// no DOM available yet, nothing to rerender -> exit
	if (!this.dom) return;

	// rerender the whole control
	if ($.isEmptyObject(config)) {
		if (this.dom) {
			this.dom.content.replaceWith(this.render());
			this.events.publish({"topic": "onRerender"});
		}
		return;
	}

	// if the list of elements passed, call rerender for each element
	if (config.elements) {
		$.map(config.elements, function(element) {
			var _config = $.extend({}, config, {"element": element, "elements": null});
			control.rerender(_config);
		});
		return;
	}

	// exit if no element found or we have unexpected type of argument
	if (!config.element || !this.dom.get(config.element)) return;

	if (config.recursive) {
		var cssPrefix = this._cssClassFromControlName() + "-";
		var template = $.isFunction(this.template) ? this.template() : this.template;
		var html = this.substitute(template, this.data || {});
		var newNode = $("." + cssPrefix + config.element, $(html));
		var oldNode = this.dom.get(config.element);
		newNode = Echo.Utils.toDOM(newNode, cssPrefix, function(name, element, dom) {
			control.render.apply(control, [{
				"element": name,
				"args": [element, dom]
			}]);
		}).content;
		oldNode.replaceWith(newNode);
	} else {
		this.render.apply(control, [{
			"element": name,
			"args": [this.dom.get(name), this.dom]
		}]);
	}
};

Echo.Control.prototype.refresh = function() {
	// TODO: develop unified refresh mechanism
	this.events.publish({"topic": "onRefresh"});
};

Echo.Control.prototype.extend = function(what, arg) {
	if (!what) return;
	var control = this;
	var handler = control["_extend" + what.charAt(0).toUpperCase() + what.slice(1)];
	return handler && handler.call(control, arg || []);
};

Echo.Control.prototype.template = function() {
	return this.templates.main;
};

Echo.Control.prototype.init = function(subsystems) {
	var control = this;
	$.map(subsystems, function(arg) {
		var name = $.isArray(arg) ? arg.shift() : arg;
		var args = $.isArray(arg) ? arg.shift() : [];
		var result = control.init[name].apply(control, args);
		if (typeof result != "undefined") {
			control[name] = result;
		}
	});
};

// plugins-related functions

Echo.Control.prototype.enablePlugin = function(name) {
	this.config.set("plugins." + name + ".enabled", true);
};

Echo.Control.prototype.disablePlugin = function(name) {
	this.config.set("plugins." + name + ".enabled", false);
};

Echo.Control.prototype.isPluginEnabled = function(name) {
	return this.config.get("plugins." + name + ".enabled", true);
};

Echo.Control.prototype.isPluginApplicable = function(plugin) {
	var self = this, applicable = false;
	$.each(plugin.manifest.applications || [], function(i, application) {
		var component = Echo.Utils.getNestedValue(window, application);
		if (component && self instanceof component) {
			applicable = true;
			return false; // break
		}
	});
	return applicable;
};

Echo.Control.prototype.destroy = function() {};

// internal functions

Echo.Control.prototype.init.vars = function() {
	return {"cache": {}};
};

Echo.Control.prototype.init.config = function(data) {
	var _normalizer = {};
	_normalizer.target = $;
	_normalizer.plugins = function(list) {
		var data = Echo.Utils.foldl({"hash": {}, "order": []}, list || [],
			function(plugin, acc) {
				var pos = $.inArray(plugin.name, acc.order);
				if (pos >= 0) {
					acc.order.splice(pos, 1);
				}
				acc.order.push(plugin.name);
				acc.hash[plugin.name] = plugin;
			});
		this.set("pluginsOrder", data.order);
		return data.hash;
	};
	data = $.extend({"plugins": []}, data || {});
	var protocol = window.location.protocol == "http:" ? "http:" : "https:";
	var defaults = $.extend({
		"appkey": "",
		"apiBaseURL": protocol + "//api.echoenabled.com",
		"debug": false,
		// TODO: need to handle the situation when the app
		//       was initialized from another app, the context should
		//       be constructed in a special way in this case
		"context": Echo.Utils.getUniqueString()
	}, this.manifest.config || {});
	// TODO: find better home for normalizer...
	var normalizer = this.manifest.config.normalizer;
	return new Echo.Configuration(data, defaults, function(key, value) {
		var handler = normalizer && normalizer[key] || _normalizer && _normalizer[key];
		return handler ? handler.call(this, value) : value;
	});
};

Echo.Control.prototype.init.dom = function() {
	return this.config.get("target");
};

Echo.Control.prototype.init.events = function() {
	var control = this;
	var events = {
		"prepare": function(params) {
			params.topic = control.manifest.name + "." + params.topic;
			params.context = control.config.get("context");
			params.callback = $.proxy(params.callback, control);
			return params;
		},
		"publish": function(params) {
			Echo.Events.publish(events.prepare(params));
		},
		"subscribe": function(params) {
			Echo.Events.subscribe(events.prepare(params));
		},
		"unsubscribe": Echo.Events.unsubscribe
	};
	$.each(control.manifest.events, function(topic, callback) {
		events.subscribe({
			"topic": topic,
			"handler": $.proxy(callback, control)
		});
	});
	return events;
};

Echo.Control.prototype.init.labels = function() {
	return new Echo.Labels(this.manifest.labels, this.name);
};

Echo.Control.prototype.init.css = function() {
	if (!this.manifest.css) return;
	Echo.Utils.addCSS(this.substitute(this.manifest.css), this.manifest.name);
};

Echo.Control.prototype.init.renderers = function() {
	return Echo.Utils.foldl({}, this.manifest.renderers, function(renderer, acc, name) {
		acc[name] = [renderer];
	});
};

Echo.Control.prototype.init.user = function(callback) {
	var control = this;
	return Echo.UserSession({
		"appkey": this.config.get("appkey"),
		"ready": $.proxy(callback, control)
	});
};

Echo.Control.prototype.init.plugins = function(callback) {
	var control = this;
	control.plugins = {};
	this._loadPluginsDependencies(function() {
		$.map(control.config.get("pluginsOrder"), function(name) {
			var plugin = Echo.Plugins[name];
			if (plugin && control.isPluginApplicable(plugin)) {
				control.plugins[name] = new plugin({
					"component": control
				});
			}
		});		
		callback && callback.call(this);
	});
};

// TODO: define this function later, need to select loader first
Echo.Control.prototype._loadPluginsDependencies = function(callback) {
	var plugins = this.config.get("pluginsOrder");
	var scripts = Echo.Utils.foldl([], plugins, function(name, acc) {
		var plugin = Echo.Plugins[name];
		if (plugin && plugin.dependencies && plugin.dependencies.length) {
			return acc.concat(plugin.dependencies);
		}
	});
	// TODO: need to load "scripts" and execute callback after that
	callback && callback.call(this);
};

Echo.Control.prototype._cssClassFromControlName = function() {
	return this.manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
};

Echo.Control.prototype._extendTemplate = function(config) {};

Echo.Control.prototype._extendRenderer = function(config) {
	if (!config || !config.name || !config.extension) return;
	this.renderers[config.name] = this.renderers[config.name] || [];
	this.renderers[config.name].unshift(config.extension);
};

})(jQuery);
