(function(jQuery) {
"use strict";

var $ = jQuery;

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
 * @param {Object} manifest
 * Specifies the control interface in the predefined way.
 *
 * @param {String} manifest.name
 * Specifies the control name including namespace (ex. "Echo.StreamServer.Controls.Submit")
 *
 * @param {Object} [manifest.vars]
 * Specifies internal control variables.
 *
 * @param {Object} [manifest.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [manifest.labels]
 * Specifies the list of language labels used in the particular control UI.
 *
 * @param {Object} [manifest.events]
 * Specifies the list of external events used by control.
 *
 * @param {Object} [manifest.methods]
 * Specifies the list of control methods.
 *
 * @param {Object} [manifest.renderers]
 * Specifies the list of control renderers.
 *
 * @param {Object} [manifest.templates]
 * Specifies the list of control templates.
 *
 * @param {Function} [manifest.init]
 * Function called during control initialization.
 *
 * @param {String} [manifest.css]
 * Specifies the CSS rules for the control.
 *
 * @return {Object}
 * Reference to the generated control class.
 */
Echo.Control.create = function(manifest) {
	var control = Echo.Utils.getComponent(manifest.name);

	// prevent multiple re-definitions
	if (Echo.Control.isDefined(manifest)) return control;

	var _manifest = this._merge(manifest, manifest.inherits && manifest.inherits._manifest);

	var constructor = Echo.Utils.inherit(this, function(config) {

		// perform basic validation of incoming params
		if (!config || !config.target) {
			Echo.Utils.log({
				"type": "error",
				"component": _manifest.name,
				"message": "Unable to initialize control, config is invalid",
				"args": {"config": config}
			});
			return {};
		}

		this.data = config.data || {};
		this.config = config;
		this._init(this._initializers.get("init"));
	});

	var prototype = constructor.prototype;
	if (_manifest.methods) {
		$.extend(prototype, _manifest.methods);
	}
	prototype.templates = _manifest.templates;
	prototype.renderers = _manifest.renderers;
	prototype.name = _manifest.name;
	constructor._manifest = _manifest;
	if (manifest.inherits) {
		constructor.parent = manifest.inherits.prototype;
	}

	// define default language var values with the lowest priority available
	Echo.Labels.set(_manifest.labels, _manifest.name, true);

	// define CSS class and prefix for the class
	prototype.cssClass = _manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
	prototype.cssPrefix = prototype.cssClass + "-";

	Echo.Utils.set(window, _manifest.name, $.extend(constructor, control));
	return constructor;
};

/**
 * @static
 * Method returning common manifest structure.
 *
 * @param {String} name
 * Specifies control name.
 *
 * @return {Object}
 * Basic control manifest declaration.
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
			this.render();
			this.ready();
		},
		"destroy": function() {}
	};
};

/**
 * @static
 * Checks if control is already defined.
 *
 * @param {Mixed} manifest
 * Control manifest or control name.
 *
 * @return {Boolean}
 */
Echo.Control.isDefined = function(manifest) {
	var name = typeof manifest === "string"
		? manifest
		: manifest.name;
	var component = Echo.Utils.get(window, name);
	return !!(component && component._manifest);
};

Echo.Control.prototype.templates = {"message": {}};

Echo.Control.prototype.templates.message.compact =
	'<span class="echo-control-message echo-control-message-icon echo-control-message-{data:type} {class:messageIcon} {class:messageText}" title="{data:message}"></span>';

Echo.Control.prototype.templates.message.full =
	'<div class="echo-control-message {class:messageText}">' +
		'<span class="echo-control-message-icon echo-control-message-{data:type} {class:messageIcon}">' +
			'{data:message}' +
		'</span>' +
	'</div>';

/**
 * Accessor method to get specific field.
 *
 * This function returns the corresponding value of the given key
 * or the default value if specified in the second argument.
 *
 * @param {String} key
 * Defines the key for data extraction.
 *
 * @param {Object} [defaults]
 * Default value if no corresponding key was found in the config.
 * Note: only the 'undefined' JS statement triggers the default value usage.
 * The false, null, 0, [] are considered as a proper value.
 *
 * @return {Mixed}
 * The corresponding value found in the object.
 */
Echo.Control.prototype.get = function(key, defaults) {
	return Echo.Utils.get(this, key, defaults);
};

/**
 * Setter method to define specific object value.
 *
 * This function allows to define the value for the corresponding object field.
 *
 * @param {String} key
 * Defines the key where the given data should be stored.
 *
 * @param {Mixed} value
 * The corresponding value which should be defined for the key.
 */
Echo.Control.prototype.set = function(key, value) {
	return Echo.Utils.set(this, key, value);
};

/**
 * Method to remove a specific object field.
 *
 * This function allows to remove the value associated with the given key.
 * If the key contains a complex structure (such as objects or arrays),
 * it will be removed as well.
 *
 * @param {String} key
 * Specifies the key which should be removed from the object.
 *
 * @return {Boolean}
 * Indicates that the value associated with the given key was removed.
 */
Echo.Control.prototype.remove = function(key) {
	return Echo.Utils.remove(this, key);
};

/**
 * Rendering function which prepares the DOM representation of the control
 * and appends it to the control target element. This function is also used to
 * re-render the control.
 *
 * @return {Object}
 * Control DOM representation
 */
Echo.Control.prototype.render = function() {
	var view = this.view;
	var topic = view.rendered() ? "onRerender" : "onRender";
	if (!this.dependent() && !view.rendered()) {
		this.config.get("target").addClass("echo-sdk-ui");
	}
	var content = view.render({
		"template": this._compileTemplate()
	});
	this.config.get("target").empty().append(content);
	this.events.publish({"topic": topic});
	return content;
};

/**
 * @inheritdoc Echo.Utils#substitute
 */
Echo.Control.prototype.substitute = function(args) {
	var instructions = this._getSubstitutionInstructions();
	args.data = args.data || this.get("data");
	args.instructions = args.instructions
		? $.extend(instructions, args.instructions)
		: instructions;
	return Echo.Utils.substitute(args);
};

/**
 * @inheritdoc Echo.Utils#invoke
 */
Echo.Control.prototype.invoke = function(mixed, context) {
	return Echo.Utils.invoke(mixed, context || this);
};

/**
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
 * @method ready
 * Should be called in the "init" function of the control manifest to
 * show that the control was initialized. Basically it is the indicator
 * of the control to be ready and operable.
 */

/**
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
 * Method checks if the control was initialized from another control.
 *
 * @return {Boolean}
 */
Echo.Control.prototype.dependent = function() {
	return !!this.config.get("parent");
};

/**
 * Renders info message in the target container.
 *
 * @param {Object} data
 * Object containing info message information.
 *
 * @param {String} [data.layout]
 * Specifies the type of message layout. Can be set to "compact" or "full".
 *
 * @param {HTMLElement} [data.target]
 * Specifies the target container.
 */
Echo.Control.prototype.showMessage = function(data) {
	if (!this.config.get("infoMessages.enabled")) return;
	var target = data.target || this.config.get("target");
	var layout = data.layout || this.config.get("infoMessages.layout");
	var view = this.view.fork();
	target.empty().append(view.render({
		"data": data,
		"template": this.templates.message[layout]
	}));
};

/**
 * Renders error message in the target container.
 *
 * @param {Object} data
 * Object containing error message information.
 *
 * @param {Object} options
 * Object containing display options.
 */
Echo.Control.prototype.showError = function(data, options) {
	var self = this;
	if (typeof options.retryIn === "undefined") {
		var label = this.labels.get("error_" + data.errorCode);
		var message = label === "error_" + data.errorCode
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
 * Accessor function allowing to obtain the plugin by its name.
 *
 * @param {String} name
 * Specifies plugin name.
 *
 * @return {Object}
 * Instance of the corresponding plugin.
 */
Echo.Control.prototype.getPlugin = function(name) {
	return this.plugins[name];
};

/**
 * Method to get the control template during rendering procedure. Can be overriden.
 */
Echo.Control.prototype.template = function() {
	return this.invoke(this.templates.main);
};

/**
 * Method to call the parent renderer function, which was extended using
 * the Echo.Control.extendRenderer function.
 *
 * @param {String} name
 * Renderer name.
 *
 * @param {Object} args
 * Arguments to be proxied to the parent renderer from the overriden one.
 *
 * @return {HTMLElement}
 * Result of parent renderer function call.
 */
Echo.Control.prototype.parentRenderer = function(name, args) {
	var renderer = this.parentRenderers[name];
	return renderer
		? renderer.apply(this, args)
		: args[0]; // return DOM element
};

/**
 * Method to extend the template of the particular control.
 *
 * @param {String} action
 * One of the following actions:
 *
 * + "insertBefore"
 * + "insertAfter"
 * + "insertAsFirstChild"
 * + "insertAsLastChild"
 * + "replace"
 * + "remove"
 *
 * @param {String} anchor
 * Element name which is a subject of a transformation application.
 *
 * @param {String} [html]
 * The content of a transformation to be applied.
 * This param is required for all actions except "remove".
 */
Echo.Control.prototype.extendTemplate = function(action, anchor, html) {
	this.extension.template.push({"action": action, "anchor": anchor, "html": html});
};

/*
 * Method extending the paticular renderer with defined function.
 *
 * @param {String} name
 * Renderer name to be extended.
 *
 * @param {Function} renderer
 * Renderer function to be applied.
 */
Echo.Control.prototype.extendRenderer = function(name, renderer) {
	var control = this;
	var extension = this.extension.renderers;
	var _renderer = extension[name] || this.renderers[name];
	extension[name] = function() {
		control.parentRenderers[name] = _renderer;
		return renderer.apply(control, arguments);
	};
};

/**
 * @inheritdoc Echo.Utils#log
 */
Echo.Control.prototype.log = function(data) {
	Echo.Utils.log($.extend(data, {"component": this.name}));
};

/**
 * Method to calculate the relative time passed since the given date and time.
 *
 * @param {Mixed} datetime
 * The date to calculate how much time passed since that moment. The function recognizes
 * the date in W3CDFT or UNIX timestamp formats.
 *
 * @return {String}
 * String which represents the date and time in the relative format.
 */
Echo.Control.prototype.getRelativeTime = function(datetime) {
	if (!datetime) return;
	var self = this;
	var ts = typeof datetime === "string"
		? Echo.Utils.timestampFromW3CDTF(datetime)
		: datetime;
	if (!ts) return;
	var d = new Date(ts * 1000);
	var now = (new Date()).getTime();
	var when;
	var diff = Math.floor((now - d.getTime()) / 1000);
	var dayDiff = Math.floor(diff / 86400);
	var getAgo = function(ago, period) {
		return self.labels.get(period + (ago === 1 ? "" : "s") + "Ago", {"number": ago});
	};

	if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 365) {
		when = d.toLocaleDateString() + ', ' + d.toLocaleTimeString();
	} else if (diff < 60) {
		when = getAgo(diff, 'second');
	} else if (diff < 60 * 60) {
		diff = Math.floor(diff / 60);
		when = getAgo(diff, 'minute');
	} else if (diff < 60 * 60 * 24) {
		diff = Math.floor(diff / (60 * 60));
		when = getAgo(diff, 'hour');
	} else if (diff < 60 * 60 * 48) {
		when = this.labels.get("yesterday");
	} else if (dayDiff < 7) {
		when = getAgo(dayDiff, 'day');
	} else if (dayDiff < 14) {
		when = this.labels.get("lastWeek");
	} else if (dayDiff < 30) {
		diff =  Math.floor(dayDiff / 7);
		when = getAgo(diff, 'week');
	} else if (dayDiff < 60) {
		when = this.labels.get("lastMonth");
	} else if (dayDiff < 365) {
		diff =  Math.floor(dayDiff / 31);
		when = getAgo(diff, 'month');
	}
	return when;
};

/**
 * Method to place an image inside the container.
 * 
 * This method removes any container's content and creates a new image HTML element 
 * inside the container. If the image is not available on the given URL then this function
 * loads the default image that is passed as a defaultImage argument.
 * 
 * The method adds special classes to the container, and implements some
 * workaround for IE in quirks mode.
 * 
 * @param {Object} args
 * The object which contains attributes for the image.
 * 
 * @param {HTMLElement} args.container
 * Specifies the target container.
 *
 * @param {String} args.image
 * The URL of the image to be loaded.
 *
 * @param {String} [args.defaultImage]
 * The URL of the default image.
 *
 * @param {Function} [args.onload]
 * The callback which fires when image is loaded.
 *
 * @param {Function} [args.onerror]
 * The callback which fires when loading image fails.
 * 
 * @param {String} [args.position="fill"]
 * The position of an image inside the container. The only "fill" is implemented now. 
*/
Echo.Control.prototype.placeImage = function(args) {
	var position = args.position || "fill";
	
	args.container.addClass("echo-image-container");
	if (position === "fill") {
		args.container.addClass("echo-image-position-fill");
	}
	
	var image = Echo.Utils.loadImage({
		"image": args.image,
		"defaultImage": args.defaultImage,
		"onerror": args.onerror,
		"onload": function () {
			if (document.compatMode !== "CSS1Compat") {
				$(this).addClass(this.width < this.height 
						? "echo-image-stretched-vertically" 
						: "echo-image-stretched-horizontally");
			}
			$.isFunction(args.onload) && args.onload.apply(this, arguments);
		}
	});
	args.container.empty().append(image);
};

/**
 * Method to check the presense of the "appkey" configuration parameter and render
 * the error message (inside the element specified as the "target" in the control
 * configuration) in case the "appkey" is missing in the config.
 *
 * @return {Boolean}
 * The boolean result of the "appkey" config parameter check.
 */
Echo.Control.prototype.checkAppKey = function() {
	if (!this.config.get("appkey")) {
		this.showError({"errorCode": "incorrect_appkey"}, {"critical": true});
		return false;
	}
	return true;
};

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
	if (subsystem.type === "sync") {
		var result = subsystem.init.call(control);
		if (typeof result !== "undefined") {
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

Echo.Control.prototype._initializers.list = [
	["vars",               ["init", "refresh"]],
	["config",             ["init"]],
	["css",                ["init"]],
	["events",             ["init"]],
	["subscriptions",      ["init"]],
	["labels",             ["init"]],
	["view",               ["init"]],
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

Echo.Control.prototype._initializers.vars = function() {
	// we need to apply default field values to the control,
	// but we need to avoid any references to the default var objects,
	// thus we copy and recursively merge default values separately
	// and apply default values to the given instance non-recursively
	$.extend(this, $.extend(true, {}, this._manifest("vars")));
};

Echo.Control.prototype._initializers.config = function() {
	var control = this;
	var config = this._manifest("config");
	return new Echo.Configuration(this.config, config,
		function(key, value) {
			return config.normalizer && config.normalizer[key]
				? config.normalizer[key].call(this, value, control)
				: value;
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
			var parent = control.constructor.parent;
			var names = function get(parent, acc) {
				if (parent && parent.name) {
					acc.unshift(parent.name);
					get(parent.constructor.parent, acc);
				}
				return acc;
			}(parent, []);

			params.data = params.data || {};

			// process data through the normalization function if defined
			if (control._prepareEventParams) {
				params.data = control._prepareEventParams(params.data);
			}
			$.map(names, function(name) {
				Echo.Events.publish({
					"topic": name + "." + params.topic,
					"data": params.data,
					"context": control.config.get("context")
				});
			});
			params.topic = control.name + "." + params.topic;
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
	$.each(control._manifest("events"), function subscribe(topic, data) {
		if ($.isArray(data) && data.length) {
			subscribe(topic, data.shift());
			data.length && subscribe(topic, data);
		} else {
			data = $.isFunction(data) ? {"handler": data} : data;
			control.events.subscribe($.extend({"topic": topic}, data));
		}
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
		"handler": function(topic, data) {
			var isProducer = control.config.get("context") ===
						data.producer.config.get("context");
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

			// a. keep subscriptions in case of refresh (if "self" is false)
			// b. unsubscribe from all events when:
			//     - we want to destroy the whole control
			//     - the control is a dependent one
			if (data.self || !isProducer) {
				$.each(control.subscriptionIDs, function(handlerId) {
					control.events.unsubscribe({"handlerId": handlerId});
				});
			}

			// cleanup the target element of the control
			// which produced the current "destroy" action
			if (isProducer) {
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
			"handler": control.refresh
		});
	}
};

Echo.Control.prototype._initializers.labels = function() {
	return new Echo.Labels(this.config.get("labels"), this.name);
};

Echo.Control.prototype._initializers.css = function() {
	var self = this;
	this.config.get("target").addClass(this.cssClass);
	$.map(this._manifest("css"), function(spec) {
		if (!spec.id || !spec.code || Echo.Utils.hasCSS(spec.id)) return;
		if (spec.id !== self.name) {
			var component = Echo.Utils.getComponent(spec.id);
			if (component) {
				Echo.Utils.addCSS(
					self.substitute({
						"template": spec.code,
						"instructions": {
							"class": function(key) {
								return component.prototype.cssPrefix + key;
							}
						}
					})
				, spec.id);
			}
		} else {
			Echo.Utils.addCSS(self.substitute({"template": spec.code}), spec.id);
		}
	});
};

Echo.Control.prototype._initializers.view = function() {
	var control = this;
	return new Echo.View({
		"data": this.get("data"),
		"cssPrefix": this.get("cssPrefix"),
		"renderer": function(args) {
			var renderer = control.extension.renderers[args.name] ||
					control.renderers[args.name];
			return renderer
				? renderer.call(control, args.target, args.extra)
				: args.target;
		},
		"substitutions": this._getSubstitutionInstructions()
	});
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
	if (!this.config.get("appkey")) {
		callback.call(control);
		return;
	}
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
			var Plugin = Echo.Plugin.getClass(name, control.name);
			if (Plugin) {
				var instance = new Plugin({"component": control});
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

Echo.Control._merge = function(manifest, parentManifest) {
	var self = this;
	parentManifest = parentManifest || $.extend(true, Echo.Control.manifest(this._manifest.name), this._manifest);
	// normalize CSS definition before merging to have the same format
	var normalizeCSS = function(manifest) {
		manifest.css = manifest.css || "";
		return $.isArray(manifest.css) ? manifest.css : [{"id": manifest.name, "code": manifest.css}];
	};
	manifest.css = normalizeCSS(manifest);
	parentManifest.css = normalizeCSS(parentManifest);
	var merged = Echo.Utils.foldl({}, manifest, function(val, acc, name) {
		acc[name] = name in parentManifest && self._merge[name]
			? self._merge[name](parentManifest[name], val)
			: val;
	});
	return $.extend(true, {}, parentManifest, merged);
};

var _wrapper = function(parent, own) {
	return function() {
		var tmp = this.parent;
		this.parent = parent;
		var ret = own.apply(this, arguments);
		this.parent = tmp;
		return ret;
	};
};

Echo.Control._merge.methods = function(parent, own) {
	return Echo.Utils.foldl({}, own, function(method, acc, name) {
		acc[name] = name in parent
			? _wrapper(parent[name], method)
			: method;
	});
};

Echo.Control._merge.dependencies = function(parent, own) {
	return parent.concat(own);
};

Echo.Control._merge.css = function(parent, own) {
	return parent.concat(own);
};

Echo.Control._merge.events = function(parent, own) {
	return Echo.Utils.foldl({}, own, function(data, acc, topic) {
		acc[topic] = topic in parent
			? [data, parent[topic]]
			: data;
	});
};

$.map(["init", "destroy"], function(name) {
	Echo.Control._merge[name] = _wrapper;
});

Echo.Control.prototype._getSubstitutionInstructions = function() {
	var control = this;
	return {
		"class": function(key) {
			return key ? control.cssPrefix + key : control.cssClass;
		},
		"inherited.class": function(key) {
			var value, parent;
			if (key) {
				parent = control.constructor.parent;
				value = function get(parent, acc) {
					if (parent && parent.cssPrefix) {
						acc.unshift(parent.cssPrefix + key);
						get(parent.constructor.parent, acc);
					}
					return acc;
				}(parent, []).join(" ");
			} else {
				value = control.cssClass;
			}
			return value;
		},
		"label": function(key, defaults) {
			return control.labels.get(key, defaults);
		},
		"self": function(key, defaults) {
			var value = control.invoke(Echo.Utils.get(control, key));
			return typeof value === "undefined"
				? Echo.Utils.get(control.data, key, defaults)
				: value;
		},
		"config": function(key, defaults) {
			return control.invoke(control.config.get(key, defaults));
		}
	};
};

Echo.Control.prototype._manifest = function(key) {
	var component = Echo.Utils.getComponent(this.name);
	return component
		? key ? component._manifest[key] : component._manifest
		: undefined;
};

Echo.Control.prototype._loadScripts = function(resources, callback) {
	var control = this;
	if (!resources || !resources.length) {
		callback.call(control);
		return;
	}
	resources = $.map(resources, function(resource) {
		if (!resource.loaded) {
			var key = resource.app && "App" ||
				resource.control && "Control" ||
				resource.plugin && "Plugin";

			if (key) {
				resource.loaded = function() {
					return Echo[key].isDefined(resource[key.toLowerCase()]);
				};
			}
		}
		return $.extend(resource, {
			"url": control.substitute({"template": resource.url})
		});
	});
	Echo.Loader.download(resources, function() {
		callback.call(control);
	}, {
		"errorTimeout": control.config.get("scriptLoadErrorTimeout")
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

Echo.Control.prototype._compileTemplate = function() {
	var control = this;
	var data = this.get("data", {});
	var transformations = this.extension.template;
	var processed = control.substitute({
		"data": data,
		"template": this.invoke(this.template)
	});
	var dom = $("<div/>").html(processed);
	if (transformations && transformations.length) {
		$.map(transformations, function(transformation) {
			dom = control._domTransformer({
				"dom": dom,
				"data": data,
				"transformation": transformation
			});
		});
	}
	return $(dom.html());
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
	var anchor = "." + this.get("cssPrefix") + args.transformation.anchor;
	if (html) {
		content = this.substitute({
			"data": args.data,
			"template": html
		});
	}
	$(anchor, args.dom)[action](content);
	return args.dom;
};

})(Echo.jQuery);

// default manifest declaration

(function(jQuery) {
"use strict";

var $ = jQuery, manifest = {};

manifest.name = "Echo.Control";

manifest.vars = {
	"plugins": {},
	"extension": {"template": [], "renderers": {}},
	"parentRenderers": {},
	"subscriptionIDs": {},
	"parent": function() {}
};

manifest.config = {
	/**
	 * @cfg {String} target(required)
	 * Specifies the DOM element where the control will be displayed.
	 */
	"target": undefined,

	/**
	 * @cfg {String} appkey
	 * Specifies the customer application key. You should specify this parameter
	 * if your control uses StreamServer or IdentityServer API requests.
	 * You can use the "test.echoenabled.com" appkey for testing purposes.
	 */
	"appkey": "",

	/**
	 * @cfg {Object} labels
	 * Specifies the set of language variables defined for this particular control.
	 */
	"labels": {},

	/**
	 * @cfg {String} [apiBaseURL="api.echoenabled.com/v1/"]
	 * URL prefix for all API requests
	 */
	"apiBaseURL": "api.echoenabled.com/v1/",

	/**
	 * @cfg {String} [submissionProxyURL="apps.echoenabled.com/v2/esp/activity/"]
	 * URL prefix for requests to Echo Submission Proxy
	 */
	"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity/",

	/**
	 * @cfg {Object} [infoMessages]
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 *
	 * @cfg {Boolean} [infoMessages.enabled=true]
	 * Specifies if info messages should be rendered.
	 *
	 * @cfg {String} [infoMessages.layout="full"]
	 * Specifies the layout of the info message. By default can be set to "compact" or "full".
	 *
	 *     "infoMessages": {
	 *         "enabled": true,
	 *         "layout": "full"
	 *     }
	 */
	"infoMessages": {
		"enabled": true,
		"layout": "full"
	},

	/**
	 * @cfg {Object} [cdnBaseURL]
	 * A set of the key/value pairs to define CDN base URLs for different components.
	 * The values are used as the URL prefixes for all static files, such as scripts,
	 * stylesheets, images etc. You can add your own CDN base URL and use it anywhere
	 * when the configuration object is available.
	 *
	 * @cfg {String} [cdnBaseURL.sdk]
	 * Base URL of the SDK CDN location used for the main SDK resources.
	 *
	 * @cfg {String} [cdnBaseURL.apps]
	 * Base URL of the Echo apps built on top of the JS SDK.
	 */
	"cdnBaseURL": {
		"sdk": Echo.Loader.getURL(""),
		"sdk-assets": Echo.Loader.getURL("", false),
		"apps": Echo.Loader.config.cdnBaseURL + "apps"
	},

	/**
	 * @cfg {Array} [plugins]
	 * The list of the plugins to be added to the control instance.
	 * Each plugin is represented as the JS object with the "name" field.
	 * Other plugin parameters should be added to the same JS object.
	 */
	"plugins": {},

	"context": "",
	"scriptLoadErrorTimeout": 5000, // 5 sec
	"query": "",

	/**
	 * @cfg {String} [defaultAvatar]
	 * Default avatar URL which will be used for the user in
	 * case there is no avatar information defined in the user
	 * profile. Also used for anonymous users.
	 */
	"defaultAvatar": Echo.Loader.getURL("images/avatar-default.png", false)
};

manifest.config.normalizer = {
	"target": $,
	"plugins": function(list) {
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
	},

	// the context normalizer takes the context which is passed
	// from the outside and treats it as the parent context by passing
	// it into the Echo.Events.newContextId function, which generates
	// the nested context out of it. Note: the parent "context" for the control
	// is defined within the Echo.Plugin.Config.prototype.assemble and
	// Echo.App.prototype._normalizeComponentConfig functions.
	"context": Echo.Events.newContextId,

	"defaultAvatar": Echo.Loader.getURL
};

manifest.labels = {
	/**
	 * @echo_label
	 */
	"loading": "Loading...",
	/**
	 * @echo_label
	 */
	"retrying": "Retrying...",
	/**
	 * @echo_label
	 */
	"error_busy": "Loading. Please wait...",
	/**
	 * @echo_label
	 */
	"error_timeout": "Loading. Please wait...",
	/**
	 * @echo_label
	 */
	"error_waiting": "Loading. Please wait...",
	/**
	 * @echo_label
	 */
	"error_view_limit": "View creation rate limit has been exceeded. Retrying in {seconds} seconds...",
	/**
	 * @echo_label
	 */
	"error_view_update_capacity_exceeded": "This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...",
	/**
	 * @echo_label
	 */
	"error_result_too_large": "(result_too_large) The search result is too large.",
	/**
	 * @echo_label
	 */
	"error_wrong_query": "(wrong_query) Incorrect or missing query parameter.",
	/**
	 * @echo_label
	 */
	"error_incorrect_appkey": "(incorrect_appkey) Incorrect or missing appkey.",
	/**
	 * @echo_label
	 */
	"error_internal_error": "(internal_error) Unknown server error.",
	/**
	 * @echo_label
	 */
	"error_quota_exceeded": "(quota_exceeded) Required more quota than is available.",
	/**
	 * @echo_label
	 */
	"error_incorrect_user_id": "(incorrect_user_id) Incorrect user specified in User ID predicate.",
	/**
	 * @echo_label
	 */
	"error_unknown": "(unknown) Unknown error.",
	/**
	 * @echo_label
	 */
	"today": "Today",
	/**
	 * @echo_label
	 */
	"yesterday": "Yesterday",
	/**
	 * @echo_label
	 */
	"lastWeek": "Last Week",
	/**
	 * @echo_label
	 */
	"lastMonth": "Last Month",
	/**
	 * @echo_label
	 */
	"secondAgo": "{number} Second Ago",
	/**
	 * @echo_label
	 */
	"secondsAgo": "{number} Seconds Ago",
	/**
	 * @echo_label
	 */
	"minuteAgo": "{number} Minute Ago",
	/**
	 * @echo_label
	 */
	"minutesAgo": "{number} Minutes Ago",
	/**
	 * @echo_label
	 */
	"hourAgo": "{number} Hour Ago",
	/**
	 * @echo_label
	 */
	"hoursAgo": "{number} Hours Ago",
	/**
	 * @echo_label
	 */
	"dayAgo": "{number} Day Ago",
	/**
	 * @echo_label
	 */
	"daysAgo": "{number} Days Ago",
	/**
	 * @echo_label
	 */
	"weekAgo": "{number} Week Ago",
	/**
	 * @echo_label
	 */
	"weeksAgo": "{number} Weeks Ago",
	/**
	 * @echo_label
	 */
	"monthAgo": "{number} Month Ago",
	/**
	 * @echo_label
	 */
	"monthsAgo": "{number} Months Ago"
};

manifest.inherits = Echo.Control;

manifest.templates = {"message": {}};

manifest.templates.message.compact =
	'<span class="echo-control-message echo-control-message-icon echo-control-message-{data:type} {class:messageIcon} {class:messageText}" title="{data:message}"></span>';

manifest.templates.message.full =
	'<div class="echo-control-message {class:messageText}">' +
		'<span class="echo-control-message-icon echo-control-message-{data:type} {class:messageIcon}">' +
			'{data:message}' +
		'</span>' +
	'</div>';

manifest.css = '.echo-secondaryBackgroundColor { background-color: #F4F4F4; }' +
		'.echo-trinaryBackgroundColor { background-color: #ECEFF5; }' +
		'.echo-primaryColor { color: #3A3A3A; }' +
		'.echo-secondaryColor { color: #C6C6C6; }' +
		'.echo-primaryFont { font-family: Arial, sans-serif; font-size: 12px; font-weight: normal; line-height: 16px; }' +
		'.echo-secondaryFont { font-family: Arial, sans-serif; font-size: 11px; }' +
		'.echo-linkColor, .echo-linkColor a { color: #476CB8; }' +
		'.echo-clickable { cursor: pointer; }' +
		'.echo-relative { position: relative; }' +
		'.echo-clear { clear: both; }' +
		'.echo-image-container.echo-image-position-fill { text-align: center; overflow: hidden; }' +
		'.echo-image-container.echo-image-position-fill img { max-width: 100%; max-height: 100%; width: auto; height: auto; vertical-align: top; }' + 
		'.echo-image-container.echo-image-position-fill img.echo-image-stretched-horizontally { width: 100%; height: auto; }' +
		'.echo-image-container.echo-image-position-fill img.echo-image-stretched-vertically { width: auto; height: 100%; }' +

		// message classes
		'.echo-control-message { padding: 15px 0px; text-align: center; }' +
		'.echo-control-message-icon { height: 16px; padding-left: 16px; background: no-repeat left center; }' +
		'.echo-control-message .echo-control-message-icon { padding-left: 21px; height: auto; }' +
		'.echo-control-message-info { background-image: url({config:cdnBaseURL.sdk-assets}/images/information.png); }' +
		'.echo-control-message-loading { background-image: url({config:cdnBaseURL.sdk-assets}/images/loading.gif); }' +
		'.echo-control-message-error { background-image: url({config:cdnBaseURL.sdk-assets}/images/warning.gif); }';

Echo.Control._manifest = manifest;

})(Echo.jQuery);
