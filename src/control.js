/**
 * @class Echo.Control
 * Foundation class implementing core logic to create controls and manipulate with them.
 */
Echo.Control = function() {};

// static interface

/**
 * @static
 * @method
 * Function which creates a control object using it manifest declaration.
 *
 * @param {Object} manifest (required) Specifies the control interface in the predefined way.
 * @param {String} manifest.name (required) Specifies the control name including namespace (ex. "Echo.StreamServer.Controls.Submit")
 * @param {Object} [manifest.vars] Specifies internal control variables.
 * @param {Object} [manifest.config] Specifies the configuration data with the ability to define default values.
 * @param {Object} [manifest.labels] Specifies the list of language labels used in the particular control UI.
 * @param {Object} [manifest.events] Specifies the list of external events used by control.
 * @param {Object} [manifest.methods] Specifies the list of control methods.
 * @param {Object} [manifest.renderers] Specifies the list of control renderers.
 * @param {Object} [manifest.templates] Specifies the list of control templates
 * @param {Function} [manifest.init] Function called during control initialization.
 * @param {String} [manifest.css] Specifies the CSS rules for the control.
 * @return {Object} generated control class
 */
Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getNestedValue(window, manifest.name);

	// prevent multiple re-definitions
	if (control) return control;

	var constructor = function(config) {
		var self = this;

		// perform basic validation of incoming params
		if (!config || !config.target || !config.appkey) return {};

		this.data = config.data || {};
		this.name = manifest.name;
		this.config = config;
		this._init(this._initializers.get("init"));
	};

	Echo.Utils.inherit(constructor, manifest.inherits || Echo.Control);

	var prototype = constructor.prototype;
	constructor.manifest = manifest;
	if (manifest.methods) {
		$.extend(prototype, manifest.methods);
	}
	if (manifest.templates) {
		prototype.templates = $.extend({}, prototype.templates, manifest.templates);
	}

	// define CSS class and prefix for the class
	prototype.cssClass = manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
	prototype.cssPrefix = prototype.cssClass + "-";

	Echo.Utils.setNestedValue(window, manifest.name, constructor);
	return constructor;
};

/**
 * @static
 * @method
 * Method returning common manifest structure.
 * @param {String} name (required) Specifies control name.
 * @return {Object} Basic control manifest declaration.
 */
Echo.Control.manifest = function(name) {
	return {
		"name": name,
		"vars": {},
		"config": {},
		"labels": {},
		"events": {},
		"methods": {},
		"renderers": {},
		"templates": {},
		"dependencies": [],
		"init": function() {
			this.dom.render();
			this.ready();
		},
		"destroy": undefined
	};
};

/**
 * @static
 * @method
 * Method which add new initializer schema to the control (or control extender) prototype. Initializer function must be defined.
 * @param {Object} klass (required) Specifies control (Echo.Control or extender) object.
 * @param {Array} schema (required) Initializer schema which declare name and executed step.
 * @param {Object} rule Rule object which contains action as key and target as value. Target is a defined initializer name. If this parameter omit then initializer will be pushed to the end of the list. Possible actions are:
 * + "after"
 * + "before"
 */
Echo.Control.addInitializer = function(klass, definition, rule) {
	rule = rule || {};
	var list = klass.prototype._initializers.list.slice(0);
	var hasRule = !!(rule.after || rule.before);
	var getInitializerIndex = function(name) {
		var index = -1;
		$.each(list, function(i, initializer) {
			if (initializer[0] === name) {
				index = i;
				return false;
			}
		});
		return index;
	};
	var index = hasRule
		? function(_index) {
			return ~_index
				? (!_index ? 0 : rule.after ? ++_index : --_index)
				: _index;
		}(getInitializerIndex(rule.after || rule.before))
		: list.length;
	list.splice(index, 0, definition);
	klass.prototype._initializers = $.extend({}, klass.prototype._initializers);
	klass.prototype._initializers.list = list;
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

Echo.Control.prototype.defaults.vars = {
	"cache": {},
	"plugins": {},
	"subscriptionIDs": {}
};

Echo.Control.prototype.defaults.config = {
/**
 * @cfg {String} target (required) Specifies the DOM element where the control will be displayed.
 */
	"target": undefined,
/**
 * @cfg {String} appkey (required) Specifies the customer application key. You can use the "test.echoenabled.com" appkey for testing purposes.
 */
	"appkey": "",
/**
 * @cfg {Object} labels Specifies the set of language variables defined for this particular control.
 */
	"labels": {},
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
 *     "infoMessages" : {
 *         "enabled" : true,
 *         "layout" : "full"
 *     }
 */
	"infoMessages": {
		"enabled": true,
		"layout": "full"
	},
	"scriptLoadErrorTimeout": 5000, // 5 sec
	"query": ""
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

/**
 * @method
 * Accessor method to get specific field.
 *
 * This function returns the corresponding value of the given key or the default value if specified in the second argument.
 *
 * @param {String} key Defines the key for data extraction.
 * @param {Object} [defaults] Default value if no corresponding key was found in the config. Note: only the 'undefined' JS statement triggers the default value usage. The false, null, 0, [] are considered as a proper value.
 * @return {Mixed} Returns the corresponding value found in the object.
 */
Echo.Control.prototype.get = function(key, defaults) {
	return Echo.Utils.getNestedValue(this, key, defaults);
};

/**
 * @method
 * Setter method to define specific object value.
 *
 * This function allows to define the value for the corresponding object field.
 *
 * @param {String} key Defines the key where the given data should be stored.
 * @param {Mixed} value The corresponding value which should be defined for the key.
 */
Echo.Control.prototype.set = function(key, value) {
	Echo.Utils.setNestedValue(this, key, value);
};

/**
 * @method
 * Method to remove specific object field.
 *
 * This function allows to remove the value associated with the given key.
 * If the key contains a complex structure (such as objects or arrays), it will be removed as well.
 *
 * @param {String} key Defines the key which should be removed from the object.
 */
Echo.Control.prototype.remove = function(key) {
	this.set(key, undefined);
};

/**
 * @method
 * Templater function which compiles given template using the provided data.
 *
 * Function can be used widely for html templates processing or any other action requiring string interspersion.
 * @param {Object} args (required) Specifies substitution process, contains control parameters.
 * @param {String} args.template (required) Template containing placeholders used for data interspersion.
 * @param {Object} [args.data] Data used in the template compilation.
 * @param {Boolean} [args.strict] Specifies whether the template should be replaced with the corresponding value, preserving replacement value type.
 * @param {Object} [args.instructions] Object containing the list of extra instructions to be applied during template compilation.
 * @return {String} Compiled string value.
 */
Echo.Control.prototype.substitute = function(args) {
	var instructions = $.extend(this._getSubstitutionInstructions(args.data), args.instructions || {});
	var regex = Echo.Utils.regexps.templateSubstitution;
	var template = args.template;

	// checking if we need to execute in a strict mode,
	// i.e. whether to keep the substitution value type or not
	if (args.strict && (new RegExp("^" + regex + "$", "i")).test(template)) {
		var match = new RegExp(regex, "i").exec(template);
		if (match && match[1] && instructions[match[1]]) {
			return instructions[match[1]](match[2]);
		}
	}

	// perform regular string sustitution
	return template.replace(new RegExp(regex, "ig"), function(match, key, value) {
		if (!instructions[key]) return match;
		var result = instructions[key].call(this, value, "");
		var allowedTypes = ["number", "string", "boolean"];
		return ~$.inArray(typeof result, allowedTypes) ? result : "";
	});
};

/**
 * @method
 * Basic method to reinitialize control.
 *
 * Function can be overriden by class descendants implying specific logic.
 */
Echo.Control.prototype.refresh = function() {

	// destroy all nested controls, but preserve self
	this.destroy({"self": false});

	// restore originally defined data
	this.set("data", this.config.get("data", {}));

	this._init(this._initializers.get("refresh"));
};

/**
 * @method
 * Unified method to destroy control.
 */
Echo.Control.prototype.destroy = function(config) {
	Echo.Events.publish({
		"topic": "Echo.Control.onDestroy",
		"bubble": false,
		"context": this.config.get("context"),
		"data": $.extend({"producer": this, "self": true}, config)
	});
};

/**
 * @method
 * Checks if control was initialized from another control.
 * return {Boolean}
 */
Echo.Control.prototype.dependent = function() {
	return !!this.config.get("parent");
};

/**
 * @method
 * Renders info message in the target container.
 *
 * @param {Object} data (required) Object containing info message information.
 * @param {String} [data.layout] Specifies the type of message layout. Can be set to "compact" or "full".
 * @param {HTMLElement} [data.target] Specifies the target container.
 */
Echo.Control.prototype.showMessage = function(data) {
	if (!this.config.get("infoMessages.enabled")) return;
	// TODO: check if we need a parameter to hide error, but show loading messages
	//       (if data.type == "error")
	var layout = data.layout || this.config.get("infoMessages.layout");
	this.dom.render({
		"template": this.templates.message[layout],
		"data": data,
		"target": data.target || this.config.get("target")
	});
};

/**
 * @method
 * Renders error message in the target container.
 *
 * @param {Object} data (required) Object containing error message information.
 * @param {Object} options (required) Object containing display options.
 */
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

/**
 * @method
 * Accessor function allowing to obtain the plugin by its name.
 *
 * @param {String} name (required) Specifies plugin name.
 * @return {Object} Instance of the corresponding plugin.
 */
Echo.Control.prototype.getPlugin = function(name) {
	return this.plugins[name];
};

Echo.Control.prototype.template = function() {
	return this.templates.main;
};

// plugin-specific interface
/**
 * @method
 * Method to call parent renderer function, which was extended using Echo.Control.extendRenderer function.
 * @param {String} name (required) Renderer name.
 * @param {Object} args (required) Arguments to be proxied to the parent renderer from the overriden one.
 * @return {HTMLElement} Result of parent renderer function call.
 */
Echo.Control.prototype.parentRenderer = function(name, args) {
	var renderer = this._getRenderer(name);
	if (!renderer || !renderer.next) return args[0]; // return DOM element
	return renderer.next.apply(this, args);
};

/**
 * @method
 * Method to extend the template of particular control.
 * @param {String} action (required) One of the following actions:
 *
 * + "insertBefore"
 * + "insertAfter"
 * + "insertAsFirstChild"
 * + "insertAsLastChild"
 * + "replace"
 * + "remove"
 * @param {String} anchor (required) Element name which is a subject of a transformation application.
 * @param {String} [html] The content of a transformation to be applied. This param is required for all actions except "remove".
 */
Echo.Control.prototype.extendTemplate = function(action, anchor, html) {
	this.extension.template.push({"action": action, "anchor": anchor, "html": html});
};

/*
 * @method
 * Method extending the paticular renderer with defined function.
 *
 * @param {String} name (required) Renderer name to be extended.
 * @param {Function} renderer (required) Renderer function to apply.
 */
Echo.Control.prototype.extendRenderer = function(name, renderer) {
	var renderers = this.extension.renderers;
	renderers[name] = renderers[name] || {"functions": []};
	renderers[name].functions.unshift(renderer);
};

/**
 * @method
 * @inheritdoc Echo.Utils#log
 */
Echo.Control.prototype.log = function(data) {
	Echo.Utils.log($.extend(data, {"component": this.name}));
};

// internal functions

Echo.Control.prototype._init = function(subsystems) {
	var control = this;
	if (!subsystems || !subsystems.length) return;
	var func = subsystems.shift();
	var parts = func.split(":");
	var subsystem = {
		"name": parts[0],
		"init": control._initializers[parts[0]],
		"type": parts[1] || "sync"
	};
	if (subsystem.type == "sync") {
		var result = subsystem.init.call(control);
		if (typeof result != "undefined") {
			control[subsystem.name] = result;
		}
		control._init(subsystems);
	} else {
		subsystem.init.call(control, function() {
			control._init(subsystems);
		});
	}
};

Echo.Control.prototype._initializers = {};

// initializer helpers

Echo.Control.prototype._initializers.list = [
	["vars",               ["init", "refresh"]],
	["extension",          ["init", "refresh"]],
	["config",             ["init"]],
	["events",             ["init"]],
	["subscriptions",      ["init", "refresh"]],
	["labels",             ["init"]],
	["css",                ["init"]],
	["renderers",          ["init", "refresh"]],
	["dom",                ["init"]],
	["loading",            ["init", "refresh"]],
	["dependencies:async", ["init"]],
	["user:async",         ["init", "refresh"]],
	["plugins:async",      ["init", "refresh"]],
	["init:async",         ["init", "refresh"]],
	["ready",              ["init"]],
	["refresh",            ["refresh"]]
];

Echo.Control.prototype._initializers.get = function(action) {
	return Echo.Utils.foldl([], this.list, function(initializer, acc) {
		if (~$.inArray(action, initializer[1])) {
			acc.push(initializer[0]);
		}
	});
};

// initializer functions

Echo.Control.prototype._initializers.vars = function() {
	// we need to apply default field values to the control,
	// but we need to avoid any references to the default var objects,
	// thus we copy and recursively merge default values separately
	// and apply default values to the given instance non-recursively
	$.extend(this, $.extend(true, {}, this.defaults.vars, this._manifest("vars")));
};

Echo.Control.prototype._initializers.extension = function() {
	return {"renderers": {}, "template": []};
};

Echo.Control.prototype._initializers.config = function() {
	var control = this;
	var _normalizer = {};
	var data = this.config;
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
	}, this._manifest("config") || {});
	// TODO: find better home for normalizer...
	var normalizer = this._manifest("config").normalizer;
	return new Echo.Configuration(data, defaults, function(key, value) {
		var handler = normalizer && normalizer[key] || _normalizer && _normalizer[key];
		return handler ? handler.call(this, value, control) : value;
	});
};

Echo.Control.prototype._initializers.events = function() {
	var control = this;
	var prepare = function(params) {
		params.context = params.context || control.config.get("context");
		if (params.handler) {
			params.handler = $.proxy(params.handler, control);
		}
		return params;
	};
	return {
		"publish": function(params) {
			params.topic = control.name + "." + params.topic;
			params.data = params.data || {};

			// process data through the normalization function if defined
			if (control._prepareEventParams) {
				params.data = control._prepareEventParams(params.data);
			}

			Echo.Events.publish(prepare(params));
		},
		"subscribe": function(params) {
			var handlerId = Echo.Events.subscribe(prepare(params));
			control.subscriptionIDs[handlerId] = true;
			return handlerId;
		},
		"unsubscribe": function(params) {
			if (params && params.handlerId) {
				delete control.subscriptionIDs[params.handlerId];
			}
			Echo.Events.unsubscribe(prepare(params));
		}
	};
};

Echo.Control.prototype._initializers.subscriptions = function() {
	var control = this;
	$.each(control._manifest("events"), function(topic, data) {
		data = $.isFunction(data) ? {"handler": data} : data;
		control.events.subscribe($.extend({"topic": topic}, data));
	});

	// we need two subscriptions here, because the "Echo.Control.onDataInvalidate" event
	// may be published by the nested controls (in this case the event is not broadcasted
	// to the "global" context) and by the standalone control to notify other controls
	// (not related directly) about the need to invalidate the data (in this case
	// the "global" context is used)
	$.map(["global", control.config.get("context")], function(context) {
		control.events.subscribe({
			"topic": "Echo.Control.onDataInvalidate",
			"context": context,
			"handler": function() {
				if (control.get("request")) {
					control.get("request").send({"force": true});
				}
			}
		});
	});

	// call "ready" callback after the control was rendered
	// note: "ready" callback is executed only once!
	if (control.config.get("ready")) {
		control.events.subscribe({
			"topic": control.name + ".onReady",
			"once": true,
			"handler": function() {
				control.config.get("ready").call(control);
			}
		});
	}

	// register destroy handlers
	control.events.subscribe({
		"topic": "Echo.Control.onDestroy",
		"once": true,
		"handler": function(topic, data) {
			// destroy plugins
			$.map(control.config.get("pluginsOrder"), function(name) {
				var plugin = control.plugins[name];
				if (plugin && plugin.destroy) {
					plugin.destroy();
				}
			});

			// apply control-specific logic
			if (control._manifest("destroy")) {
				control._manifest("destroy").call(control, data.producer);
			}

			// abort and cleanup data request machinery
			var request = control.get("request");
			if (request) {
				request.abort();
				control.remove("request");
			}

			// unsubscribe from all events when:
			//  - we want to destroy the whole control
			//  - the control is a dependent one
			var ctx = function(obj) { return obj.config.get("context"); };
			if (data.self || ctx(control) != ctx(data.producer)) {
				$.each(control.subscriptionIDs, function(handlerId) {
					control.events.unsubscribe({"handlerId": handlerId});
				});
			}

			// cleanup target element for top level control
			if (!control.dependent()) {
				control.config.get("target").empty();
			}
		}
	});

	// subscribe all root level controls to the user login/logout event
	// and call the "refresh" control method
	if (!control.dependent()) {
		control.events.subscribe({
			"topic": "Echo.UserSession.onInvalidate",
			"context": "global",
			"once": true,
			"handler": control.refresh
		});
	}
};

Echo.Control.prototype._initializers.labels = function() {
	var labels = $.extend({}, this.get("defaults.labels"), this._manifest("labels"));

	// define default language var values with the lowest priority available
	Echo.Labels.set(labels, this.name, true);

	// define language var values passed within the config with the highest priority
	return new Echo.Labels(this.config.get("labels"), this.name);
};

Echo.Control.prototype._initializers.css = function() {
	Echo.Utils.addCSS(this.baseCSS, "control");
	this.config.get("target").addClass(this.cssClass);
	if (this._manifest("css")) {
		Echo.Utils.addCSS(this.substitute({"template": this._manifest("css")}), this.name);
	}
};

Echo.Control.prototype._initializers.renderers = function() {
	var control = this;
	$.each(this._manifest("renderers"), function() {
		control.extendRenderer.apply(control, arguments);
	});
};

Echo.Control.prototype._initializers.dom = function() {
	var self = this;
	this.dom = {
		"rendered": false,
		"elements": {},
		"clear": function() {
			this.elements = {};
		},
		"set": function(name, element) {
			this.elements[self.cssPrefix + name] = $(element);
		},
		"get": function(name, ignorePrefix) {
			return this.elements[(ignorePrefix ? "" : self.cssPrefix) + name];
		},
		"remove": function(element) {
			var name = typeof element === "string"
				? self.cssPrefix + element
				: element.echo.name;
			this.elements[name].remove();
			delete this.elements[name];
		},
		"render": function(args) {

			// render the whole control when no extra config was passed
			if (!args) {
				self.dom.clear();
				var topic = this.rendered ? "onRerender" : "onRender";
				var dom = self._render.template.call(self, {
					"template": self.template,
					"data": self.data
				});
				self.config.get("target").empty().append(dom);
				this.rendered = true;
				self.events.publish({"topic": topic});
				return dom;
			}

			args = args || {};
			args.data = args.data || self.data;
			args.template = args.template || self.template;

			// render specific element (recursively if specified)
			if (args.name) {
				var processor = args.recursive ? "recursive" : "element";
				return self._render[processor].call(self, args);
			}

			// render template
			if (args.template) {
				var dom = self._render.template.call(self, args);
				if (args.target) {
					args.target.empty().append(dom);
				}
				return dom;
			}

		}
	};
};

Echo.Control.prototype._initializers.loading = function() {
	this.showMessage({
		"type": "loading",
		"message": this.labels.get("loading")
	});
};

Echo.Control.prototype._initializers.dependencies = function(callback) {
	this._loadScripts(this._manifest("dependencies"), callback);
};

Echo.Control.prototype._initializers.user = function(callback) {
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

Echo.Control.prototype._initializers.plugins = function(callback) {
	var control = this;
	this._loadPluginScripts(function() {
		$.map(control.config.get("pluginsOrder"), function(name) {
			var plugin = Echo.Plugin.getClass(name, control.name);
			if (plugin) {
				var instance = new plugin({"component": control});
				if (instance.enabled()) {
					instance.init();
					control.plugins[name] = instance;
				}
			}
		});
		callback.call(control);
	});
};

Echo.Control.prototype._initializers.init = function(callback) {

	// this function should be called inside the "init" function
	// to indicate that the control was initialized and is now ready
	this.ready = callback;

	this._manifest("init").call(this);
};

Echo.Control.prototype._initializers.ready = function() {
	this.events.publish({"topic": "onReady"});
};

Echo.Control.prototype._initializers.refresh = function() {
	this.events.publish({"topic": "onRefresh"});
};

Echo.Control.prototype._getSubstitutionInstructions = function(data) {
	var control = this;
	return {
		"class": function(key) {
			return key ? control.cssPrefix + key : control.cssClass
		},
		"data": function(key, defaults) {
			return Echo.Utils.getNestedValue(data || control.data, key, defaults);
		},
		"label": function(key, defaults) {
			return control.labels.get(key, defaults);
		},
		"self": function(key, defaults) {
			var value = Echo.Utils.getNestedValue(control, key);
			value = $.isFunction(value) ? value.call(control) : value;
			return typeof value == "undefined"
				? Echo.Utils.getNestedValue(control.data, key, defaults)
				: value;
		},
		"config": function(key, defaults) {
			var value = control.config.get(key, defaults);
			return $.isFunction(value) ? value.call(control) : value;
		}
	};
};

Echo.Control.prototype._manifest = function(key) {
	var component = Echo.Utils.getComponent(this.name);
	return component
		? key ? component.manifest[key] : component.manifest
		: undefined;
};

Echo.Control.prototype._loadScripts = function(scripts, callback) {
	var control = this;
	Echo.Loader.download({
		"scripts": scripts,
		"errorTimeout": control.config.get("scriptLoadErrorTimeout"),
		"callback": function() {
			callback.call(control);
		}
	});
};

Echo.Control.prototype._loadPluginScripts = function(callback) {
	var control = this;
	var plugins = this.config.get("pluginsOrder");

	var iterators = {
		"plugins": function(name, plugin) {
			// check if a script URL is defined for the plugin
			var url = "plugins." + name + ".url";
			if (!plugin && control.config.get(url)) {
				return [{
					"url": control.config.get(url),
					"loaded": function() {
						return !!Echo.Plugin.getClass(name, control.name);
					}
				}];
			}
		},
		"dependencies": function(name, plugin) {
			return plugin && plugin.dependencies;
		}
	};
	var get = function(type) {
		return Echo.Utils.foldl([], plugins, function(name, acc) {
			var plugin = Echo.Plugin.getClass(name, control.name);
			var scripts = iterators[type](name, plugin);
			if ($.isArray(scripts) && scripts.length) {
				return acc.concat(scripts);
			}
		});
	};

	control._loadScripts(get("plugins"), function() {
		control._loadScripts(get("dependencies"), callback);
	});
};

Echo.Control.prototype._render = {};

Echo.Control.prototype._render.element = function(args) {
	var target = args.target ||
		(args.name && this.dom.get(args.name)) ||
		this.config.get("target");

	if (!this._hasRenderer(args.name)) return target;

	var renderer = this._getRenderer(args.name);
	var iteration = 0;
	renderer.next = function() {
		iteration++;
		return renderer.functions.length > iteration
			? renderer.functions[iteration].apply(this, arguments)
			: target;
	};
	return renderer.functions[iteration].call(this, target, args.extra);
};

Echo.Control.prototype._render.recursive = function(args) {
	var oldNode = this.dom.get(args.name);
	var template = this._compileTemplate(args.template, args.data, this.extension.template);
	template = $("." + this.cssPrefix + args.name, $(template));
	this._applyRenderers(template);
	var newNode = this.dom.get(args.name);
	oldNode.replaceWith(newNode);
	return newNode;
};

Echo.Control.prototype._render.template = function(args) {
	var template = this._compileTemplate(args.template, args.data, this.extension.template);
	return this._applyRenderers(template);
};

Echo.Control.prototype._compileTemplate = function(template, data, transformations) {
	var control = this;
	var raw = $.isFunction(template) ? template.call(this) : template;
	var processed = this.substitute({
		"template": raw,
		"data": data || {}
	});
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

Echo.Control.prototype._applyRenderers = function(template) {
	var self = this;
	var dom = $(template);
	var elements = this._getRenderableElements(dom);
	$.each(elements, function(name, element) {

		// prevent "renderer" function call
		// in case no suitable renderer found
		if (!self._hasRenderer(name)) return;

		self.dom.render({
			"name": name,
			"target": element
		});
	});
	return dom;
};

Echo.Control.prototype._domTransformer = function(args) {
	var classify = {
		"insertBefore": "before",
		"insertAfter": "after",
		"insertAsFirstChild": "prepend",
		"insertAsLastChild": "append",
		"replace": "replaceWith",
		"remove": "remove"
	};
	var action = classify[args.transformation.action];
	if (!action) {
		return args.dom;
	}
	var content;
	var html = args.transformation.html;
	var anchor = "." + this.cssPrefix + args.transformation.anchor;
	if (html) {
		content = this.substitute({
			"template": $.isFunction(html) ? html() : html,
			"data": args.data
		});
	}
	$(anchor, args.dom)[action](content);
	return args.dom;
};

Echo.Control.prototype._getRenderer = function(name) {
	return this.extension.renderers[name];
};

Echo.Control.prototype._hasRenderer = function(name) {
	return !!this._getRenderer(name);
};

Echo.Control.prototype._getRenderableElements = function(container) {
	var self = this, elements = {};
	var isRenderer = new RegExp(this.cssPrefix + "(.*)$");
	container.find("*").andSelf().each(function(i, element) {
		if (!element.className) {
			return;
		}
		var classes = element.className.split(/[ ]+/);
		$.each(classes, function(j, className) {
			var pattern = className.match(isRenderer);
			var name = pattern ? pattern[1] : undefined;
			if (name) {
				self.dom.set(name, element);
				element = $(element);
				element.echo = element.echo || {};
				element.echo.name = className;
				elements[name] = element;
			}
		});
	});
	return elements;
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
