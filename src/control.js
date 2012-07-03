(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.Control")) return;

Echo.Control = function() {};

// static interface

Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getNestedValue(window, manifest.name);
	// prevent multiple re-definitions
	if (control) return control;
	var _constructor = function(config) {
		if (!config || !config.target) return;
		this.manifest = manifest;
		this.init([
			"vars",
			["config", [config]],
			"events",
			"labels",
			"css",
			"renderers",
			["user", [manifest.constructor]]
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
		"methods": {},
		"renderers": {},
		"templates": {},
		"constructor": function(){ this.render(); }
	};
};

// dynamic interface (available for class instances)

// TODO: revisit function location and contract...
Echo.Control.prototype.substitute = function(template, data) {
	var self = this;
	template = template.replace(Echo.Vars.regexps.matchSelf, function($0, $1) {
		// FIXME: incorrect condition if 0, "", false or [] passed on purpose
		return Echo.Utils.getNestedValue(self, $1) ||
			Echo.Utils.getNestedValue(self.data || {}, $1) ||
			self.config.get($1, "");
	});
	template = template.replace(Echo.Vars.regexps.matchLabel, function($0, $1) {
		return self.labels.get($1, "");
	});
	template = template.replace(Echo.Vars.regexps.matchData, function($0, $1) {
		return Echo.Utils.getNestedValue(data, $1, "");
	});
	return template;
};

Echo.Control.prototype.render = function(config) {
	var control = this;
	config = config || {};
	// render template
	if (config.template) {
		var templates = {};
		templates.raw = $.isFunction(config.template)
			? config.template.call(control)
			: config.template;
		templates.processed = $(control.substitute(templates.raw, config.data || {}));
		templates.processed.find("*").andSelf().each(function(i, element) {
			element = $(element);
			var renderer = element.data("renderer");
			if (renderer && control.renderers[renderer]) {
				control.renderers[renderer][0].apply(control, [element]);
			}
		});
		return templates.processed;
	}
	// render the whole control
	var output = this.render({"template": this.template});
	this.config.get("target")
		.addClass(this._cssClassFromControlName())
		.empty()
		.append(output);
	return output;
};

Echo.Control.prototype.rerender = function() {};

Echo.Control.prototype.extend = function(what, arg) {
	if (!what) return;
	var control = this;
	var handler = control["_" + what.charAt(0).toUpperCase() + what.slice(1)];
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

Echo.Control.prototype.init.events = function() {
	var control = this;
	var events = {
		"prepare": function(params) {
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
	Echo.Utils.addCSS(
		this.manifest.css.replace(/{prefix}/g, "." + this._cssClassFromControlName()),
		this.manifest.name
	);
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

Echo.Control.prototype._cssClassFromControlName = function() {
	return this.manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
};

Echo.Control.prototype._extendTemplate = function(config) {};

Echo.Control.prototype._extendRenderer = function(config) {};

})(jQuery);
