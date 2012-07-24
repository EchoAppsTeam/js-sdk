(function($) {

if (Echo.Utils.isComponentDefined("Echo.Control")) return;

/**
 * @class Echo.Control
 */
Echo.Control = function() {};

// static interface

Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getNestedValue(window, manifest.name);
	// prevent multiple re-definitions
	if (control) return control;
	var _constructor = function(config) {
		var self = this;
		// perform basic validation of incoming params
		if (!config || !config.target || !config.appkey) return {};
		this.data = config.data || {};
		delete config.data;
		this.name = manifest.name;
		this.manifest = manifest;
		this._init([
			"vars",
			"extension",
			["config", config],
			"events",
			"subscriptions",
			"labels",
			"css",
			"renderers",
			"loading",
			["user", function() {
				self._init([["plugins", manifest.init]]);
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
		"init": function(){ this.render(); }
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
/**
 * @cfg {String} target (required) Specifies the DOM element where the control will be displayed.
 */
/**
 * @cfg {String} appkey (required) Specifies the customer application key. You can use the "test.echoenabled.com" appkey for testing purposes.
 */
	"appkey": "",
/**
 * @cfg {String} query (required) Specifies the search query to generate the necessary data set. It must be constructed according to the <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">"search" API</a> method specification.
 *     new Echo.StreamServer.Controls.Counter({
 *         "target": document.getElementById("container"),
 *         "appkey": "test.aboutecho.com",
 *         "query" : "childrenof:http://example.com/test/*"
 *     });
 */
	"query": "",
/**
 * @cfg {String} [apiBaseURL="api.echoenabled.com/v1/"] URL prefix for all API requests
 */
	"apiBaseURL": "api.echoenabled.com/v1/",
/**
 * @cfg {String} [submissionProxyURL="apps.echoenabled.com/v2/esp/activity/"] URL prefix for requests to Echo Submission Proxy
 */
	"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity/",
/**
 * @cfg {Object} [infoMessages] Customizes the look and feel of info messages, for example "loading" and "error".
 * @cfg {Boolean} [infoMessages.enabled=true] Specifies if info messages should be rendered.
 * @cfg {String} [infoMessages.layout="full"] Specifies the layout of the info message. By default can be set to "compact" or "full".
 *     new Echo.StreamServer.Controls.Counter({
 *         ...
 *         "infoMessages" : {
 *             "enabled" : true,
 *             "layout" : "full"
 *         }
 *     });
 */
	"infoMessages": {
		"enabled": true,
		"layout": "full"
	}
};

Echo.Control.prototype.defaults.labels = {
	"loading": "Loading...",
	"retrying": "Retrying...",
	"error_busy": "Loading. Please wait...",
	"error_timeout": "Loading. Please wait...",
	"error_waiting": "Loading. Please wait...",
	"error_view_limit": "View creation rate limit has been exceeded. Retrying in {seconds} seconds...",
	"error_view_update_capacity_exceeded": "This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...",
	"error_result_too_large": "(result_too_large) The search result is too large.",
	"error_wrong_query": "(wrong_query) Incorrect or missing query parameter.",
	"error_incorrect_appkey": "(incorrect_appkey) Incorrect or missing appkey.",
	"error_internal_error": "(internal_error) Unknown server error.",
	"error_quota_exceeded": "(quota_exceeded) Required more quota than is available.",
	"error_incorrect_user_id": "(incorrect_user_id) Incorrect user specified in User ID predicate.",
	"error_unknown": "(unknown) Unknown error."
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
		if (!instructions[key]) return;
		var result = instructions[key](value);
		var allowedTypes = ["number", "string", "boolean"];
		return ~$.inArray(typeof result, allowedTypes) ? result.toString() : "";
	};
	return template.replace(Echo.Vars.regexps.templateSubstitution, processor);
};

Echo.Control.prototype.render = function(args) {
	var self = this;
	var template;
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
		var oldNode = this.dom.get(args.element);
		template = this._compileTemplate(this.template, this.data, this.extension.template);
		template = $("." + this.cssPrefix + "-" + args.element, $(template));
		var _dom = this._applyRenderers(template, true);
		var newNode = _dom.get(args.element);
		oldNode.replaceWith(newNode);
		return newNode;
	}

	// render template
	if (args.template) {
		template = this._compileTemplate(args.template, args.data);
		var _dom = this._applyRenderers(template);
		target.empty().append(_dom.content);
		return _dom.content;
	}

	// render the whole control
	var topic = this.dom ? "onRerender" : "onRender";
	template = this._compileTemplate(this.template, this.data, this.extension.template);
	this.dom = this._applyRenderers(template);
	target.empty().append(this.dom.content);
	this.events.publish({"topic": topic});
	return this.dom.content;
};

Echo.Control.prototype.refresh = function() {
	this.events.publish({"topic": "onRefresh"});
};

Echo.Control.prototype.dependent = function() {
	return !!this.config.get("parent");
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

Echo.Control.prototype.showError = function(data, options) {
	var self = this;
	if (typeof options.retryIn === "undefined") {
		var label = this.labels.get("error_" + data.errorCode);
		var message = label == "error_" + data.errorCode
			? "(" + data.errorCode + ") " + (data.errorMessage || "")
			: label;
		this.showMessage({
			"type": options.critical ? "error" : "loading",
			"message": message,
			"target": options.target
		});
	} else if (!options.retryIn && options.request.retryTimer) {
		this.showMessage({
			"type": "loading",
			"message": this.labels.get("retrying"),
			"target": options.target
		});
	} else {
		var secondsLeft = options.retryIn / 1000;
		var ticker = function() {
			if (!secondsLeft) {
				return;
			}
			var label = self.labels.get("error_" + data.errorCode, {"seconds": secondsLeft--});
			self.showMessage({
				"type": "loading",
				"message": label,
				"target": options.target
			});
		};
		options.request.retryTimer = setInterval(ticker, 1000);
		ticker();
	}
};

Echo.Control.prototype.getPlugin = function(name) {
	return this.plugins[name];
};

// TODO: do not expose this function in documentation
Echo.Control.prototype.template = function() {
	return this.templates.main;
};

// plugin-specific interface

Echo.Control.prototype.parentRenderer = function(name, args) {
	var renderer = this.extension.renderers[name];
	if (!renderer || !renderer.next) return args[0]; // return DOM element
	return renderer.next.apply(this, args);
};

Echo.Control.prototype.extendTemplate = function(html, action, anchor) {
	this.extension.template.push({"html": html, "action": action, "anchor": anchor});
};

Echo.Control.prototype.extendRenderer = function() {
	this._init.renderer.apply(this, arguments);
};

// internal functions

Echo.Control.prototype._init = function(subsystems) {
	var control = this;
	$.map(subsystems, function(args) {
		if (!$.isArray(args)) {
			args = [args];
		}
		var name = args.shift();
		var result = control._init[name].apply(control, args);
		if (typeof result != "undefined") {
			control[name] = result;
		}
	});
};

Echo.Control.prototype._init.vars = function() {
	$.extend(true, this, {"cache": {}, "plugins": {}}, this.manifest.vars || {});
};

Echo.Control.prototype._init.extension = function() {
	return {"renderers": {}, "template": []};
};

Echo.Control.prototype._init.config = function(data) {
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

Echo.Control.prototype._init.events = function() {
	var control = this;
	var prepare = function(params) {
		params.context = params.context || control.config.get("context");
		params.handler = $.proxy(params.handler, control);
		return params;
	};
	return {
		"publish": function(params) {
			var prefix = params.prefix ? params.prefix + "." : "";
			params.topic = prefix + control.manifest.name + "." + params.topic;
			params.data = params.data || {};
			// process data through the normalization function if defined
			if (control._prepareEventParams) {
				params.data = control._prepareEventParams(params.data);
			}
			Echo.Events.publish(prepare(params));
		},
		"subscribe": function(params) {
			return Echo.Events.subscribe(prepare(params));
		},
		"unsubscribe": Echo.Events.unsubscribe
	};
};

Echo.Control.prototype._init.subscriptions = function() {
	var control = this;
	$.each(control.manifest.events, function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		control.events.subscribe($.extend({"topic": topic}, data));
	});

	if (this.dependent()) return;

	// subscribe all root level controls to the user login/logout event
	// and call "refresh" control method
	control.events.subscribe({
		"topic": "Echo.UserSession.onInvalidate",
		"context": "global",
		"handler": control.refresh
	});
	var requestUpdates = function() {
		if (control.get("request")) {
			control.get("request").send({"force": true});
		}
	};
	// subscribe to inner data invalidation events
	control.events.subscribe({
		"topic": "internal.Echo.Control.onDataInvalidate",
		"handler": requestUpdates
	});
	// subscribe to outer data invalidation events
	control.events.subscribe({
		"topic": "Echo.Control.onDataInvalidate",
		"context": "global",
		"handler": requestUpdates
	});
	// call "ready" callback after the control was rendered
	if (control.config.get("ready")) {
		control.events.subscribe({
			"topic": control.name + ".onRender",
			"handler": function() {
				control.config.get("ready").call(control);
			}
		});
	}
};

Echo.Control.prototype._init.labels = function() {
	var labels = $.extend({}, this.get("defaults.labels"), this.manifest.labels);
	return new Echo.Labels(labels, this.name);
};

Echo.Control.prototype._init.css = function() {
	Echo.Utils.addCSS(this.baseCSS, "control");
	this.config.get("target").addClass(this.cssPrefix);
	if (!this.manifest.css) return;
	Echo.Utils.addCSS(this.substitute(this.manifest.css), this.manifest.name);
};

Echo.Control.prototype._init.renderer = function(name, renderer) {
	var renderers = this.extension.renderers;
	renderers[name] = renderers[name] || {"functions": []};
	renderers[name].functions.unshift(renderer);
};

Echo.Control.prototype._init.renderers = function() {
	var control = this;
	$.each(this.manifest.renderers, function() {
		control._init.renderer.apply(control, arguments);
	});
};

Echo.Control.prototype._init.loading = function() {
	this.showMessage({
		"type": "loading",
		"message": this.labels.get("loading")
	});
};

Echo.Control.prototype._init.user = function(callback) {
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

Echo.Control.prototype._init.plugins = function(callback) {
	var control = this;
	this._loadPluginsDependencies(function() {
		$.map(control.config.get("pluginsOrder"), function(name) {
			var plugin = Echo.Plugin.getClass(name, control.name);
			if (plugin && control._isPluginEnabled(name)) {
				control.plugins[name] = new plugin({
					"component": control
				});
			}
		});		
		callback && callback.call(this);
	});
};

Echo.Control.prototype._isPluginEnabled = function(plugin) {
	var enabled = this.config.get("plugins." + name + ".enabled", true);
	return $.isFunction(enabled) ? enabled.call(control) : enabled;
};

// TODO: define this function later, need to select loader first
// TODO: load dependencies for the nested controls, ex: Stream.Item, i.e. Stream.*
Echo.Control.prototype._loadPluginsDependencies = function(callback) {
	var control = this;
	var plugins = this.config.get("pluginsOrder");
	var scripts = Echo.Utils.foldl([], plugins, function(name, acc) {
		var plugin = Echo.Plugin.getClass(name, control.name);
		if (plugin && plugin.dependencies && plugin.dependencies.length) {
			return acc.concat(plugin.dependencies);
		}
	});
	// TODO: need to load "scripts" and execute callback after that
	callback && callback.call(this);
};

Echo.Control.prototype._compileTemplate = function(template, data, transformations) {
	var control = this;
	var raw = $.isFunction(template) ? template.call(this) : template;
	var processed = this.substitute(raw, data || {});
	if (transformations && transformations.length) {
		var dom = $("<div/>").html(processed);
		$.map(transformations, function(transformation) {
			dom = control._domTransformer({
				"data": data || {},
				"dom": dom,
				"transformation": transformation
			});
		});
		processed = dom.html();
	}
	return processed;
};

Echo.Control.prototype._applyRenderers = function(template, updateDOM) {
	var control = this;
	return Echo.Utils.toDOM(template, this.cssPrefix + "-", function(element, target, dom) {
		if (updateDOM) {
			control.dom.set(element, target);
		}
		return control.render({
			"element": element,
			"target": target,
			"dom": dom
		});
	});
};

Echo.Control.prototype._domTransformer = function(args) {
	var classify = {
		"insertBefore": "before",
		"insertAfter": "after",
		"insertAsFirstChild": "prepend",
		"insertAsLastChild": "append",
		"replace": "replaceWith"
	};
	var action = classify[args.transformation.action];
	if (!action) {
		return args.dom;
	}
	var html = args.transformation.html;
	var anchor = "." + this.cssPrefix + "-" + args.transformation.anchor;
	var content = $.isFunction(html) ? html() : html;
	$(anchor, args.dom)[action](this.substitute(content, args.data));
	return args.dom;
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
