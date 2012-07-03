(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.Control")) return;

Echo.Control = function() {};

// static interface

Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getNestedValue(manifest.name, window);
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
	Echo.Utils.setNestedValue(manifest.name, window, _constructor);
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
		return Echo.Utils.getNestedValue($1, self) ||
			Echo.Utils.getNestedValue($1, self.data || {}) ||
			self.config.get($1, "");
	});
	template = template.replace(Echo.Vars.regexps.matchLabel, function($0, $1) {
		return self.labels.get($1, "");
	});
	template = template.replace(Echo.Vars.regexps.matchData, function($0, $1) {
		return Echo.Utils.getNestedValue($1, data, "");
	});
	return template;
};

Echo.Control.prototype.render = function() {
	// TODO: provide the ability to render 1 specific element
	var control = this;
	var target = $(this.config.get("target"));
	// TODO: set specific CSS class...
	var templates = {};
	templates.raw = $.isFunction(this.template) ? this.template() : this.template;
	templates.processed = $(this.substitute(templates.raw, this.data || {}));
	templates.processed.find("*").andSelf().each(function(i, element) {
		element = $(element);
		var renderer = element.data("renderer");
		if (renderer && control.renderers[renderer]) {
			control.renderers[renderer][0].apply(control, [element]);
		}
	});
	target.empty().append(templates.processed);
};

Echo.Control.prototype.rerender = function() {};

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

Echo.Control.prototype.init.vars = function() {
	return {"cache": {}};
};

Echo.Control.prototype.init.config = function(config) {
	// TODO: copy init config function from Echo.Application
	// TODO: need to assign proper events context for the instance via getUniqueString!
	//       get parent context and add extra value!
	//this.config.set("context", Echo.Utils.getUniqueString());
	return new Echo.Configuration(config, this.manifest.config);
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
	Echo.Utils.addCSS(this.manifest.css, this.manifest.name);
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

})(jQuery);
