(function($) {

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
		this.data = config.data || {};
		delete config.data;
		this.manifest = manifest;
		this.init([
			"vars",
			"extension",
			["config", config],
			"events",
			"labels",
			"css",
			"renderers",
			"loading",
			["user", function() {
				self.init([["plugins", manifest.constructor]]);
			}]
		]);
	};
	Echo.Utils.inherit(_constructor, manifest.inherits || Echo.Control);
	if (manifest.methods) {
		$.extend(_constructor.prototype, manifest.methods);
	}
	if (manifest.templates) {
		_constructor.prototype.templates =
			$.extend({}, _constructor.prototype.templates, manifest.templates);
	}
	_constructor.prototype.cssPrefix = manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
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

Echo.Control.prototype.templates = {"message": {}};

Echo.Control.prototype.templates.message.compact =
	'<span class="echo-control-message echo-control-message-icon echo-control-message-{data:type} {class:messageIcon} {class:messageText}" title="{data:message}"></span>';

Echo.Control.prototype.templates.message.full =
	'<div class="echo-control-message {class:messageText}">' +
		'<span class="echo-control-message-icon echo-control-message-{data:type} {class:messageIcon}">' +
			'{data:message}' +
		'</span>' +
	'</div>';

Echo.Control.prototype.defaults = {};

Echo.Control.prototype.defaults.config = {
	"appkey": "",
	"apiBaseURL": "api.echoenabled.com",
	"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity/",
	"infoMessages": {
		"enabled": true,
		"layout": "full"
	}
};

Echo.Control.prototype.defaults.labels = {
	"loading": "Loading..."
};

Echo.Control.prototype.get = function(field, defaults) {
	return Echo.Utils.getNestedValue(this, field, defaults);
};

Echo.Control.prototype.set = function(field, value) {
	Echo.Utils.setNestedValue(this, field, value);
};

Echo.Control.prototype.remove = function(field) {
	this.set(field, undefined);
};

Echo.Control.prototype.substitute = function(template, data, instructions) {
	var control = this;
	data = data || {};
	instructions = $.extend({
		"class": function(value) {
			return control.cssPrefix + "-" + value;
		},
		"data": function(key) {
			return Echo.Utils.getNestedValue(data || control.data, key, "");
		},
		"label": function(key) {
			return control.labels.get(key, "");
		},
		"self": function(key) {
			var value = Echo.Utils.getNestedValue(control, key);
			return typeof value == "undefined"
				? Echo.Utils.getNestedValue(control.data, key, "")
				: value;
		},
		"config": function(key) {
			return control.config.get(key, "");
		}
	}, instructions || {});
	var processor = function(match, key, value) {
		return instructions[key] ? instructions[key](value) : match;
	};
	return template.replace(Echo.Vars.regexps.templateSubstitution, processor);
};

Echo.Control.prototype.compileTemplate = function(template, data, transformations) {
	var control = this, templates = {};
	templates.raw = $.isFunction(template) ? template.call(this) : template;
	templates.processed = this.substitute(templates.raw, data || {});
	if (transformations) {
		templates.dom = $("<div/>").html(templates.processed);
		$.map(transformations, function(transformation) {
			templates.dom = control._templateTransformer.call(control, {
				"data": data || {},
				"template": templates.dom,
				"transformation": transformation
			});
		});
		templates.processed = templates.dom.html();
	}
	return Echo.Utils.toDOM(templates.processed, this.cssPrefix + "-",
		function(element, target, dom) {
			control.render.call(control, {
				"element": element,
				"target": target,
				"dom": dom
			});
		}
	);
};

Echo.Control.prototype.render = function(args) {
	args = args || {};
	var dom = args.dom || this.dom;
	var data = args.data || this.data;
	var target = args.target ||
			(args.element && dom.get(args.element)) ||
			this.config.get("target");

	// render specific element
	if (args.element && !args.recursive) {
		var renderer = this.extension.renderers[args.element];
		if (renderer) {
			var iteration = 0;
			renderer.next = function() {
				iteration++;
				return renderer.functions.length > iteration
					? renderer.functions[iteration].apply(this, arguments)
					: target;
			};
			return renderer.functions[iteration].call(this, target, dom, args.extra);
		}
		return target;
	}

	// render element including its content recursively
	if (args.element && args.recursive) {
		var template = $.isFunction(this.template) ? this.template() : this.template;
		var html = this.substitute(template, data);
		var newNode = $("." + cssPrefix + name, $(html));
		var oldNode = this.dom.get(name);
		newNode = Echo.Utils.toDOM(newNode, this.cssPrefix + "-",
			function(element, target, dom) {
				control.render.call(control, {
					"element": element,
					"target": target,
					"dom": dom,
					"extra": extra
				});
			}
		).content;
		oldNode.replaceWith(newNode);
		return newNode;
	}

	// render template
	if (args.template) {
		var dom = this.compileTemplate(args.template, args.data);
		target.empty().append(dom.content);
		return dom.content;
	}

	// render the whole control
	var topic = this.dom ? "onRerender" : "onRender";
	this.dom = this.compileTemplate(this.template, this.data, this.extension.template);
	target.empty().append(this.dom.content);
	this.events.publish({"topic": topic});
	return this.dom.content;
};

Echo.Control.prototype.parentRenderer = function(name, args) {
	var renderer = this.extension.renderers[name];
	if (!renderer || !renderer.next) return args[0]; // return DOM element
	return renderer.next.apply(this, args);
};

Echo.Control.prototype.refresh = function() {
	this.events.publish({"topic": "onRefresh"});
};

Echo.Control.prototype.dependent = function() {
	return !!this.config.get("parent");
};

Echo.Control.prototype.extendTemplate = function(html, action, anchor) {
	this.extension.template.push({"html": html, "action": action, "anchor": anchor});
};

Echo.Control.prototype.extendRenderer = function() {
	this.init.renderer.apply(this, arguments);
};

Echo.Control.prototype.template = function() {
	return this.templates.main;
};

Echo.Control.prototype.init = function(subsystems) {
	var control = this;
	$.map(subsystems, function(args) {
		if (!$.isArray(args)) {
			args = [args];
		}
		var name = args.shift();
		var result = control.init[name].apply(control, args);
		if (typeof result != "undefined") {
			control[name] = result;
		}
	});
};

Echo.Control.prototype.showMessage = function(data) {
	if (!this.config.get("infoMessages.enabled")) return;
	// TODO: check if we need a parameter to hide error, but show loading messages
	//       (if data.type == "error")
	var layout = data.layout || this.config.get("infoMessages.layout");
	this.render({
		"template": this.templates.message[layout],
		"data": data,
		"target": data.target
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
	if (this.manifest.vars) {
		$.extend(this, {"cache": {}}, this.manifest.vars);
	}
};

Echo.Control.prototype.init.extension = function() {
	return {"renderers": {}, "template": []};
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
	var defaults = $.extend(true, {}, this.get("defaults.config"), {
		"context": (data.parent ? data.parent.context + "/" : "") + Echo.Utils.getUniqueString()
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
	var prepare = function(params) {
		params.context = params.context || control.config.get("context");
		params.handler = $.proxy(params.handler, control);
		return params;
	};
	var events = {
		"publish": function(params) {
			params.topic = control.manifest.name + "." + params.topic;
			Echo.Events.publish(prepare(params));
		},
		"subscribe": function(params) {
			Echo.Events.subscribe(prepare(params));
		},
		"unsubscribe": Echo.Events.unsubscribe
	};
	$.each(control.manifest.events, function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		events.subscribe($.extend({"topic": topic}, data));
	});
	// subscribe all root level controls to the user login/logout event
	// and call "refresh" control method
	if (!this.dependent()) {
		events.subscribe({
			"topic": "Echo.UserSession.onInvalidate",
			"context": "global",
			"handler": control.refresh
		});
	}
	return events;
};

Echo.Control.prototype.init.labels = function() {
	var labels = $.extend({}, this.get("defaults.labels"), this.manifest.labels);
	return new Echo.Labels(labels, this.name);
};

Echo.Control.prototype.init.css = function() {
	Echo.Utils.addCSS(this.baseCSS, "control");
	this.config.get("target").addClass(this.cssPrefix);
	if (!this.manifest.css) return;
	Echo.Utils.addCSS(this.substitute(this.manifest.css), this.manifest.name);
};

Echo.Control.prototype.init.renderer = function(name, renderer) {
	var renderers = this.extension.renderers;
	renderers[name] = renderers[name] || {"functions": []};
	renderers[name].functions.unshift(renderer);
};

Echo.Control.prototype.init.renderers = function() {
	var control = this;
	$.each(this.manifest.renderers, function() {
		control.init.renderer.apply(control, arguments);
	});
};

Echo.Control.prototype.init.loading = function() {
	this.showMessage({
		"type": "loading",
		"message": this.labels.get("loading")
	});
};

Echo.Control.prototype.init.user = function(callback) {
	var control = this;
	if (this.config.get("user")) {
		this.user = this.config.get("user");
		callback.call(control);
	} else {
		Echo.UserSession({
			"appkey": this.config.get("appkey"),
			"ready": function() {
				control.user = this;
				callback.call(control);
			}
		});
	}
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
// TODO: load dependencies for the nested controls, ex: Stream.Item, i.e. Stream.*
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

Echo.Control.prototype._templateTransformer = function(args) {
	var classify = {
		"insertBefore": "before",
		"insertAfter": "after",
		"insertAsFirstChild": "prepend",
		"insertAsLastChild": "append",
		"replace": "replaceWith"
	};
	var action = classify[args.transformation.action];
	if (!action) return args.template;
	var html = args.transformation.html;
	var anchor = "." + this.cssPrefix + "-" + args.transformation.anchor;
	var content = $.isFunction(html) ? html() : html;
	$(anchor, args.template)[action](this.substitute(content, args.data));
	return args.template;
};

Echo.Control.prototype.baseCSS =
	'.echo-primaryBackgroundColor {  }' +
	'.echo-secondaryBackgroundColor { background-color: #F4F4F4; }' +
	'.echo-trinaryBackgroundColor { background-color: #ECEFF5; }' +
	'.echo-primaryColor { color: #3A3A3A; }' +
	'.echo-secondaryColor { color: #C6C6C6; }' +
	'.echo-primaryFont { font-family: Arial, sans-serif; font-size: 12px; font-weight: normal; line-height: 16px; }' +
	'.echo-secondaryFont { font-family: Arial, sans-serif; font-size: 11px; }' +
	'.echo-linkColor, .echo-linkColor a { color: #476CB8; }' +
	'.echo-clickable { cursor: pointer; }' +
	'.echo-relative { position: relative; }' +
	'.echo-clear { clear: both; }' +

	// message classes
	'.echo-control-message { padding: 15px 0px; text-align: center; }' +
	'.echo-control-message-icon { height: 16px; padding-left: 16px; background: no-repeat left center; }' +
	'.echo-control-message .echo-control-message-icon { padding-left: 21px; height: auto; }' +
	'.echo-control-message-empty { background-image: url(//cdn.echoenabled.com/images/information.png); }' +
	'.echo-control-message-loading { background-image: url(//cdn.echoenabled.com/images/loading.gif); }' +
	'.echo-control-message-error { background-image: url(//cdn.echoenabled.com/images/warning.gif); }';

})(jQuery);
