define("echo/app", [
	"jquery",
	"echo/utils",
	"echo/configuration",
	"echo/events",
	"echo/view",
	"echo/labels",
	"echo/user-session",
	"echo/plugin",
	"require"
], function($, utils, Configuration, events, View, Labels, UserSession, Plugin, require) {
"use strict";

/**
 * @class Echo.App
 * Foundation class implementing core logic to create applications and manipulate them.
 * This is a base class for Echo.App class. You can find instructions on how to create
 * your App in the ["How to develop an App"](#!/guide/how_to_develop_app) guide.
 *
 * @package environment.pack.js
 */
App = function() {};

// static interface

/**
 * @static
 * @method
 * Function which creates a application object using it manifest declaration.
 *
 * @param {Object} manifest
 * Specifies the application interface in the predefined way.
 *
 * @param {String} manifest.name
 * Specifies the application name including namespace (ex. "Echo.StreamServer.Apps.Submit")
 *
 * @param {Object} [manifest.vars]
 * Specifies internal application variables.
 *
 * @param {Object} [manifest.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [manifest.labels]
 * Specifies the list of language labels used in the particular application UI.
 *
 * @param {Object} [manifest.events]
 * Specifies the list of external events used by application.
 *
 * @param {Object} [manifest.methods]
 * Specifies the list of application methods.
 *
 * @param {Object} [manifest.renderers]
 * Specifies the list of application renderers.
 *
 * @param {Object} [manifest.templates]
 * Specifies the list of application templates.
 *
 * @param {Function} [manifest.init]
 * Function called during application initialization.
 *
 * @param {String} [manifest.css]
 * Specifies the CSS rules for the application.
 *
 * @return {Object}
 * Reference to the generated application class.
 */
App.create = function(manifest) {
	var app = utils.getComponent(manifest.name);

	// prevent multiple re-definitions
	//if (App.isDefined(manifest)) return app;

	var _manifest = this._merge(manifest, manifest.inherits && manifest.inherits._manifest);

	var constructor = utils.inherit(this, function(config) {
		console.log(config);
		// perform basic validation of incoming params
		if (!config || !config.target) {
			utils.log({
				"type": "error",
				"component": _manifest.name,
				"message": "Unable to initialize application, config is invalid",
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
	Labels.set(_manifest.labels, _manifest.name, true);

	// define CSS class and prefix for the class
	prototype.cssClass = _manifest.name.toLowerCase().replace(/-/g, "").replace(/\./g, "-");
	prototype.cssPrefix = prototype.cssClass + "-";

	utils.set(window, _manifest.name, $.extend(constructor, app));
	return constructor;
};

/**
 * @static
 * Method returning common manifest structure.
 *
 * @param {String} name
 * Specifies application name.
 *
 * @return {Object}
 * Basic application manifest declaration.
 */
App.manifest = function(name) {
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
 * Checks if application is already defined.
 *
 * @param {Mixed} manifest
 * Application manifest or application name.
 *
 * @return {Boolean}
 */
App.isDefined = function(manifest) {
	var name = typeof manifest === "string"
		? manifest
		: manifest.name;
	var component = utils.get(window, name);
	return !!(component && component._manifest);
};

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
App.prototype.get = function(key, defaults) {
	return utils.get(this, key, defaults);
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
App.prototype.set = function(key, value) {
	return utils.set(this, key, value);
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
App.prototype.remove = function(key) {
	return utils.remove(this, key);
};

/**
 * Rendering function which prepares the DOM representation of the application
 * and appends it to the application target element. This function is also used to
 * re-render the application.
 *
 * @return {Object}
 * Application DOM representation
 */
App.prototype.render = function() {
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
App.prototype.substitute = function(args) {
	var instructions = this._getSubstitutionInstructions();
	args.data = args.data || this.get("data");
	args.instructions = args.instructions
		? $.extend(instructions, args.instructions)
		: instructions;
	return utils.substitute(args);
};

/**
 * @inheritdoc Echo.Utils#invoke
 */
App.prototype.invoke = function(mixed, context) {
	return utils.invoke(mixed, context || this);
};

/**
 * Basic method to reinitialize application.
 *
 * Function can be overriden by class descendants implying specific logic.
 */
App.prototype.refresh = function() {

	// destroy all nested applications, but preserve self
	this.destroy({"self": false});

	// restore originally defined data
	this.set("data", this.config.get("data", {}));

	this._init(this._initializers.get("refresh"));
};

/**
 * @method ready
 * Should be called in the "init" function of the application manifest to
 * show that the application was initialized. Basically it is the indicator
 * of the application to be ready and operable.
 */

/**
 * Unified method to destroy application.
 */
App.prototype.destroy = function(config) {
	events.publish({
		"topic": "Echo.App.onDestroy",
		"bubble": false,
		"context": this.config.get("context"),
		"data": $.extend({"producer": this, "self": true}, config)
	});
};

/**
 * Method checks if the application was initialized from another application.
 *
 * @return {Boolean}
 */
App.prototype.dependent = function() {
	return !!this.config.get("parent");
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
App.prototype.getPlugin = function(name) {
	return this.plugins[name];
};

/**
 * Method to get the application template during rendering procedure. Can be overriden.
 */
App.prototype.template = function() {
	return this.invoke(this.templates.main);
};

/**
 * Method to call the parent renderer function, which was extended using
 * the Echo.App.extendRenderer function.
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
App.prototype.parentRenderer = function(name, args) {
	var renderer = this.parentRenderers[name];
	return renderer
		? renderer.apply(this, args)
		: args[0]; // return DOM element
};

/**
 * Method to extend the template of the particular application.
 *
 * @param {String} action
 * The following actions are available:
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
App.prototype.extendTemplate = function(action, anchor, html) {
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
App.prototype.extendRenderer = function(name, renderer) {
	var app = this;
	var extension = this.extension.renderers;
	var _renderer = extension[name] || this.renderers[name];
	extension[name] = function() {
		app.parentRenderers[name] = _renderer;
		return renderer.apply(app, arguments);
	};
};

/**
 * @inheritdoc Echo.Utils#log
 */
App.prototype.log = function(data) {
	utils.log($.extend(data, {"component": this.name}));
};

/**
 * Method to add and initialize nested application.
 *
 * This function allows to initialize nested application. Application configuration object
 * is constructed by merging the following 2 objects:
 *
 * + this instance config
 * + spec parameter if it's provided
 *
 * @param {Object} spec
 *
 * @param {String} spec.id
 * Nested application id.
 *
 * @param {String} spec.app
 * Constructor name for the nested app like "Echo.StreamServer.App.Stream".
 *
 * @param {Object} [spec.config]
 * Configuration object for the nested application.
 */
App.prototype.initApp = function(spec) {
	this.destroyApp(spec.id);
	spec.config = spec.config || {};
	if (this.user) {
		spec.config.user = this.user;
	}
	spec.config.parent = spec.config.parent || this.config.getAsHash();
	if (spec.config.parent.dependencies) {
		delete spec.config.parent.dependencies;
	}
	spec.config.plugins = this._mergeSpecsByName(
		$.extend(true, [], this.config.get("apps." + spec.id + ".plugins", [])),
		spec.config.plugins || []
	);
	spec.config = this._normalizeAppConfig(
		$.extend(true, {}, this.config.get("apps." + spec.id, {}), spec.config)
	);
	//FIXME there is no getApp in src/utils.js (just getComponent)
	console.log("spec", spec);
	var App = require("echo/app");//utils.getApp(spec.app);
	this.set("apps." + spec.id, new App(spec.config));
	return this.getApp(spec.id);
};

/**
 * Method to retrieve the initialized application by id.
 *
 * @param {String} id
 * Id of the application to be retrieved.
 *
 * @return {Object}
 * The link to the corresponding application or 'undefined'
 * in case no application with the given id was found.
 */
App.prototype.getApp = function(id) {
	return this.get("apps." + id);
};

/**
 * Method to destroy a nested app by id. If the app is defined,
 * then the "destroy" method of the nested app is called
 * and the reference is removed from the inner "apps" container.
 *
 * @param {String} id
 * Id of the app to be removed.
 */
App.prototype.destroyApp = function(id) {
	var app = this.getApp(id);
	if (app) {
		app.destroy();
		this.remove("apps." + id);
	}
};

/**
 * Method to destroy all defined nested applications by their ids in the exception list.
 *
 * Method can accept one parameter which specifies the nested exception
 * application ids list. If the list is omitted or empty, then the method destroys
 * all defined nested applications.
 *
 * @param {Array} [exceptions]
 * List of nested applications to be kept.
 */
App.prototype.destroyApps = function(exceptions) {
	var self = this;
	exceptions = exceptions || [];
	var inExceptionList = function(id) {
		var inList = false;
		$.each(exceptions, function(_id, exception) {
			if (exception === id) {
				inList = true;
				return false; // break
			}
		});
		return inList;
	};
	$.each(this.apps, function(id) {
		if (!inExceptionList(id)) {
			self.destroyApp(id);
		}
	});
};

App.prototype._init = function(subsystems) {
	var app = this;
	if (!subsystems || !subsystems.length) return;
	var func = subsystems.shift();
	var parts = func.split(":");
	var subsystem = {
		"name": parts[0],
		"init": app._initializers[parts[0]],
		"type": parts[1] || "sync"
	};
	if (subsystem.type === "sync") {
		var result = subsystem.init.call(app);
		if (typeof result !== "undefined") {
			app[subsystem.name] = result;
		}
		app._init(subsystems);
	} else {
		subsystem.init.call(app, function() {
			app._init(subsystems);
		});
	}
};

App.prototype._initializers = {};

App.prototype._initializers.list = [
	["vars",               ["init", "refresh"]],
	["config",             ["init"]],
	["css",                ["init"]],
	["events",             ["init"]],
	["subscriptions",      ["init"]],
	["labels",             ["init"]],
	["view",               ["init"]],
	["backplane:async",    ["init"]],
	["user:async",         ["init", "refresh"]],
	["plugins:async",      ["init", "refresh"]],
	["init:async",         ["init", "refresh"]],
	["ready",              ["init"]],
	["refresh",            ["refresh"]]
];

App.prototype._initializers.get = function(action) {
	return utils.foldl([], this.list, function(initializer, acc) {
		if (~$.inArray(action, initializer[1])) {
			acc.push(initializer[0]);
		}
	});
};

App.prototype._initializers.vars = function() {
	// we need to apply default field values to the application,
	// but we need to avoid any references to the default var objects,
	// thus we copy and recursively merge default values separately
	// and apply default values to the given instance non-recursively
	$.extend(this, $.extend(true, {}, this._manifest("vars")));
};

App.prototype._initializers.config = function() {
	var app = this;
	var config = this._manifest("config");
	var normalizer = function(key, value) {
		return config.normalizer && config.normalizer[key]
			? config.normalizer[key].call(this, value, app)
			: value;
	};
	return new Configuration(this.config, config, normalizer, {"data": true, "parent": true});
};

App.prototype._initializers.events = function() {
	var app = this;
	var prepare = function(params) {
		params.context = params.context || app.config.get("context");
		if (params.handler) {
			params.handler = $.proxy(params.handler, app);
		}
		return params;
	};
	return {
		"publish": function(params) {
			var parent, names;

			params.data = params.data || {};

			// process data through the normalization function if defined
			if (app._prepareEventParams) {
				params.data = app._prepareEventParams(params.data);
			}
			params = prepare(params);
			// publish events with parents prefixes if appropriate flag provided
			if (params.inherited) {
				parent = app.constructor.parent;
				names = function get(parent, acc) {
					if (parent && parent.name) {
						acc.unshift(parent.name);
						get(parent.constructor.parent, acc);
					}
					return acc;
				}(parent, []);
				$.map(names, function(name) {
					events.publish(
						$.extend({}, params, {
							"topic": name + "." + params.topic,
							"global": false
						})
					);
				});
			}
			params.topic = app.name + "." + params.topic;
			events.publish(params);
		},
		"subscribe": function(params) {
			var handlerId = events.subscribe(prepare(params));
			app.subscriptionIDs[handlerId] = true;
			return handlerId;
		},
		"unsubscribe": function(params) {
			if (params && params.handlerId) {
				delete app.subscriptionIDs[params.handlerId];
			}
			events.unsubscribe(prepare(params));
		}
	};
};

App.prototype._initializers.subscriptions = function() {
	var app = this;
	$.each(app._manifest("events"), function subscribe(topic, data) {
		if ($.isArray(data) && data.length) {
			subscribe(topic, data.shift());
			data.length && subscribe(topic, data);
		} else {
			data = $.isFunction(data) ? {"handler": data} : data;
			app.events.subscribe($.extend({"topic": topic}, data));
		}
	});

	// register destroy handlers
	app.events.subscribe({
		"topic": "Echo.App.onDestroy",
		"handler": function(topic, data) {
			var isProducer = app.config.get("context") ===
						data.producer.config.get("context");
			// destroy plugins
			$.map(app.config.get("pluginsOrder"), function(name) {
				var plugin = app.plugins[name];
				if (plugin && plugin.destroy) {
					plugin.destroy();
				}
			});

			// apply application-specific logic
			if (app._manifest("destroy")) {
				app._manifest("destroy").call(app, data.producer);
			}

			// a. keep subscriptions in case of refresh (if "self" is false)
			// b. unsubscribe from all events when:
			//     - we want to destroy the whole application
			//     - the application is a dependent one
			if (data.self || !isProducer) {
				$.each(app.subscriptionIDs, function(handlerId) {
					app.events.unsubscribe({"handlerId": handlerId});
				});
			}

			// cleanup the target element of the application
			// which produced the current "destroy" action
			if (isProducer) {
				app.config.get("target").empty();
			}
		}
	});

	// subscribe all root level applications to the user login/logout event
	// and call the "refresh" application method
	if (!app.dependent()) {
		app.events.subscribe({
			"topic": "Echo.UserSession.onInvalidate",
			"context": "global",
			"handler": app.refresh
		});
	}
};

App.prototype._initializers.labels = function() {
	return new Labels(this.config.get("labels"), this.name);
};

App.prototype._initializers.css = function() {
	var self = this;
	this.config.get("target").addClass(this.cssClass);
	$.map(this._manifest("css"), function(spec) {
		if (!spec.id || !spec.code || utils.hasCSS(spec.id)) return;
		if (spec.id !== self.name) {
			var css, component = self.constructor;
			if (component) {
				css = self.substitute({
					"template": spec.code,
					"instructions": {
						"class": function(key) {
							return component.prototype.cssPrefix + key;
						}
					}
				});
				utils.addCSS(css, spec.id);
			}
		} else {
			utils.addCSS(self.substitute({"template": spec.code}), spec.id);
		}
	});
};

App.prototype._initializers.view = function() {
	var app = this;
	return new View({
		"data": this.get("data"),
		"cssPrefix": this.get("cssPrefix"),
		"renderer": function(args) {
			var renderer = app.extension.renderers[args.name] ||
					app.renderers[args.name];
			return renderer
				? renderer.call(app, args.target, args.extra)
				: args.target;
		},
		"substitutions": this._getSubstitutionInstructions()
	});
};

App.prototype._initializers.backplane = function(callback) {
	var app = this;
	var config = this.config.get("backplane");

	if (config.serverBaseURL && config.busName) {
		require(["echo/backplane"], function(backplane) {
			backplane.init(config);
			callback.call(app);
		});
	} else {
		callback.call(app);
	}
};


App.prototype._initializers.user = function(callback) {
	var app = this;
	if (!this.config.get("appkey")) {
		callback.call(app);
		return;
	}
	if (this.config.get("user")) {
		this.user = this.config.get("user");
		callback.call(app);
	} else {
		var generateURL = function(baseURL, path) {
			if (!baseURL) return;
			var urlInfo = utils.parseURL(baseURL);
			return (urlInfo.scheme || "https") + "://" + urlInfo.domain + path;
		};
		UserSession({
			"appkey": this.config.get("appkey"),
			"useSecureAPI": this.config.get("useSecureAPI"),
			"endpoints": {
				"logout": generateURL(this.config.get("submissionProxyURL"), "/v2/"),
				"whoami": generateURL(this.config.get("apiBaseURL"), "/v1/users/")
			},
			"ready": function() {
				app.user = this;
				callback.call(app);
			}
		});
	}
};

App.prototype._initializers.plugins = function(callback) {
	var app = this;
	this._loadPluginScripts(function() {
		$.map(app.config.get("pluginsOrder"), function(name) {
			var Constructor = Plugin.getClass(name, app.name);
			if (Constructor) {
				var instance = new Constructor({"component": app});
				if (instance.enabled()) {
					instance.init();
					app.plugins[name] = instance;
				}
			}
		});
		callback.call(app);
	});
};

App.prototype._initializers.init = function(callback) {
	// this function should be called inside the "init" function
	// to indicate that the application was initialized and is now ready
	this.ready = callback;

	this._manifest("init").call(this);
};

App.prototype._initializers.ready = function() {
	if (this.config.get("ready")) {
		this.config.get("ready").call(this);
		// "ready" callback must be executed only once
		this.config.remove("ready");
	}
	this.events.publish({"topic": "onReady"});
};

App.prototype._initializers.refresh = function() {
	this.events.publish({"topic": "onRefresh"});
};

App._merge = function(manifest, parentManifest) {
	var self = this;
	parentManifest = parentManifest || $.extend(true, App.manifest(this._manifest.name), this._manifest);
	// normalize CSS definition before merging to have the same format
	var normalizeCSS = function(manifest) {
		manifest.css = manifest.css || "";
		return $.isArray(manifest.css) ? manifest.css : [{"id": manifest.name, "code": manifest.css}];
	};
	manifest.css = normalizeCSS(manifest);
	parentManifest.css = normalizeCSS(parentManifest);
	var merged = utils.foldl({}, manifest, function(val, acc, name) {
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

App._merge.methods = function(parent, own) {
	return utils.foldl({}, own, function(method, acc, name) {
		acc[name] = name in parent
			? _wrapper(parent[name], method)
			: method;
	});
};

App._merge.dependencies = function(parent, own) {
	return parent.concat(own);
};

App._merge.css = function(parent, own) {
	return parent.concat(own);
};

App._merge.events = function(parent, own) {
	return utils.foldl({}, own, function(data, acc, topic) {
		acc[topic] = topic in parent
			? [data, parent[topic]]
			: data;
	});
};

$.map(["init", "destroy"], function(name) {
	App._merge[name] = _wrapper;
});

App.prototype._getSubstitutionInstructions = function() {
	var app = this;
	return {
		"class": function(key) {
			return key ? app.cssPrefix + key : app.cssClass;
		},
		"inherited.class": function(key) {
			var value, parent;
			if (key) {
				parent = app.constructor.parent;
				value = function get(parent, acc) {
					if (parent && parent.cssPrefix) {
						acc.unshift(parent.cssPrefix + key);
						get(parent.constructor.parent, acc);
					}
					return acc;
				}(parent, []).join(" ");
			} else {
				value = app.cssClass;
			}
			return value;
		},
		"label": function(key, defaults) {
			return app.labels.get(key, defaults);
		},
		"self": function(key, defaults) {
			var value = app.invoke(utils.get(app, key));
			return typeof value === "undefined"
				? utils.get(app.data, key, defaults)
				: value;
		},
		"config": function(key, defaults) {
			return app.invoke(app.config.get(key, defaults));
		}
	};
};

App.prototype._manifest = function(key) {
	var component = utils.getComponent(this.name);
	return component
		? key ? component._manifest[key] : component._manifest
		: undefined;
};

App.prototype._loadScripts = function(resources, callback) {
	var app = this;
	if (!resources || !resources.length) {
		callback.call(app);
		return;
	}
	resources = $.map(resources, function(resource) {
		return app.substitute({"template": resource})
	});
	
	require(resources, $.proxy(callback, app));
	/*require(resources, function() {
		callback.call(app);
	});*/
};

App.prototype._loadPluginScripts = function(callback) {
	var app = this;
	var plugins = this.config.get("pluginsOrder");

	var scripts = utils.foldl([], plugins, function(name, acc) {
		var plugin = Plugin.getClass(name, app.name);
		// check if a script URL is defined for the plugin
		var url = "plugins." + name + ".url";
		if (!plugin && app.config.get(url)) {
			acc.push(app.config.get(url));
		}
	});

	app._loadScripts(scripts, function() {
		callback.call(app);
	});
};

App.prototype._compileTemplate = function() {
	var app = this;
	var data = this.get("data", {});
	var transformations = this.extension.template;
	var processed = app.substitute({
		"data": data,
		"template": this.invoke(this.template)
	});
	var dom = $("<div/>").html(processed);
	if (transformations && transformations.length) {
		$.map(transformations, function(transformation) {
			dom = app._domTransformer({
				"dom": dom,
				"data": data,
				"transformation": transformation
			});
		});
	}
	return $(dom.html());
};

App.prototype._domTransformer = function(args) {
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

App.prototype._mergeSpecsByName = function(specs) {
	var self = this;
	var getSpecIndex = function(spec, specs) {
		var idx = -1;
		$.each(specs, function(i, _spec) {
			if (spec.name === _spec.name) {
				idx = i;
				return false;
			}
		});
		return idx;
	};
	// flatten update specs list
	var updateSpecs = $.map(Array.prototype.slice.call(arguments, 1) || [], function(spec) {
		return spec;
	});
	return utils.foldl(specs, updateSpecs, function(extender) {
		var id = getSpecIndex(extender, specs);
		if (!~id) {
			specs.push(extender);
			return;
		}
		if (extender.name === specs[id].name) {
			if (extender.nestedPlugins) {
				specs[id].nestedPlugins = specs[id].nestedPlugins || [];
				self._mergeSpecsByName(specs[id].nestedPlugins, extender.nestedPlugins);
				// delete nested plugins in the extender to avoid override effect after extend below
				delete extender.nestedPlugins;
			}
		}
		specs[id] = $.extend(true, {}, specs[id], extender);
	});
};

App.prototype._normalizeAppConfig = function(config) {
	var self = this;
	// extend the config with the default fields from manifest
	return utils.foldl(config, this._manifest("config"), function(value, acc, key) {
		// do not override existing values in data
		if (typeof acc[key] === "undefined") {
			acc[key] = self.config.get(key);
		}
	});
};

// default manifest declaration

var manifest = {};

manifest.name = "Echo.App";

manifest.vars = {
	"plugins": {},
	"extension": {"template": [], "renderers": {}},
	"parentRenderers": {},
	"subscriptionIDs": {},
	"parent": function() {}
};

manifest.config = {
	/**
	 * @cfg {String} target (required)
	 * Specifies the DOM element where the application will be displayed.
	 */
	"target": undefined,

	/**
	 * @cfg {Object} labels
	 * Specifies the set of language variables defined for this particular application.
	 */
	"labels": {},

	/**
	 * @cfg {Object} infoMessages
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 *
	 * @cfg {Boolean} infoMessages.enabled=true
	 * Specifies if info messages should be rendered.
	 *
	 * @cfg {String} infoMessages.layout="full"
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
	 * @cfg {Object} cdnBaseURL
	 * A set of the key/value pairs to define CDN base URLs for different components.
	 * The values are used as the URL prefixes for all static files, such as scripts,
	 * stylesheets, images etc. You can add your own CDN base URL and use it anywhere
	 * when the configuration object is available.
	 *
	 * @cfg {String} cdnBaseURL.sdk
	 * Base URL of the SDK CDN location used for the main SDK resources.
	 *
	 * @cfg {String} cdnBaseURL.apps
	 * Base URL of the Echo apps built on top of the JS SDK.
	 */
	"cdnBaseURL": {
		"sdk": require.toUrl("echo"),
		"sdk-assets": require.toUrl("echo-assets"),
		"apps": require.toUrl("echo/apps")
	},

	/**
	 * @cfg {Array} plugins
	 * The list of the plugins to be added to the application instance.
	 * Each plugin is represented as the JS object with the "name" field.
	 * Other plugin parameters should be added to the same JS object.
	 */
	"plugins": {},

	"context": "",
	"scriptLoadErrorTimeout": 5000, // 5 sec

	/**
	 * @cfg {Object} backplane
	 */
	"backplane": {}
};

manifest.config.normalizer = {
	"target": $,
	"plugins": function(list) {
		var data = utils.foldl({"hash": {}, "order": []}, list || [],
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
	// the nested context out of it. Note: the parent "context" for the application
	// is defined within the Echo.Plugin.Config.prototype.assemble and
	// Echo.App.prototype._normalizeAppConfig functions.
	"context": events.newContextId
};

manifest.inherits = App;

manifest.css = '.echo-secondaryBackgroundColor { background-color: #F4F4F4; }' +
	'.echo-trinaryBackgroundColor { background-color: #ECEFF5; }' +
	'.echo-primaryColor { color: #3A3A3A; }' +
	'.echo-secondaryColor { color: #C6C6C6; }' +
	'.echo-primaryFont { font-family: Arial, sans-serif; font-size: 12px; font-weight: normal; line-height: 16px; }' +
	'.echo-secondaryFont { font-family: Arial, sans-serif; font-size: 11px; }' +
	'.echo-linkColor, .echo-linkColor a { color: #476CB8; }' +
	'.echo-clickable { cursor: pointer; }' +
	'.echo-relative { position: relative; }' +
	'.echo-clear { clear: both; }';

App._manifest = manifest;

return App;

});
