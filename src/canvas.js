Echo.define("echo/canvas", [
	"jquery",
	"echo/app",
	"echo/utils",
	"echo/loader",
	"echo/events"
], function($, App, Utils, Loader, Events) {

"use strict";

var canvas = App.definition("Canvas");

if (App.isDefined(canvas)) return;

/**
 * @class Canvas
 * Class which implements Canvas mechanics on the client side.
 * The instance of this class is created for each Canvas found on the page by
 * the Loader. The instance of the class can also be created manually in
 * case the Canvas data already exists on the page.
 *
 * @package environment.pack.js
 *
 * @extends App
 *
 * @constructor
 * Canvas object constructor to initialize the Canvas instance
 *
 * @param {Object} config
 * Configuration options
 */

/** @hide @echo_label loading */
/** @hide @echo_label retrying */
/** @hide @echo_label error_busy */
/** @hide @echo_label error_timeout */
/** @hide @echo_label error_waiting */
/** @hide @echo_label error_view_limit */
/** @hide @echo_label error_view_update_capacity_exceeded */
/** @hide @echo_label error_result_too_large */
/** @hide @echo_label error_wrong_query */
/** @hide @echo_label error_incorrect_appkey */
/** @hide @echo_label error_internal_error */
/** @hide @echo_label error_quota_exceeded */
/** @hide @echo_label error_incorrect_user_id */
/** @hide @echo_label error_unknown */

/**
 * @echo_event Canvas.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Canvas.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Canvas.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Canvas.onRerender
 * Triggered when the app is rerendered.
 */

canvas.init = function() {
	var ids, cssClass;
	var self = this, target = this.config.get("target");
	// parent init function takes care about init finalization (rendering
	// and the "onReady" event firing)
	var parent = $.proxy(this.parent, this);

	// check if the canvas was already initialized
	if (target.data("echo-canvas-initialized")) {
		this._error({
			"args": {"target": target},
			"code": "canvas_already_initialized"
		});
		return;
	}

	// define initialized state for the canvas
	// to prevent multiple initialization of the same canvas
	target.data("echo-canvas-initialized", true);

	// extending Canvas config with the parameters defined in the target
	var overrides = this._getOverrides(target, ["id", "useSecureAPI", "mode"]);
	if (!$.isEmptyObject(overrides)) {
		this.config.extend(overrides);
	}

	if (Loader.isDebug()) this.config.set("mode", "dev");

	// exit if no "id" is defined for the canvas,
	// skip this validation in case the "data" is defined explicitly in the config
	if (!this._isManuallyConfigured() && !this.config.get("id")) {
		this._error({
			"args": {"target": target},
			"code": "invalid_canvas_config"
		});
		return;
	}

	// apply our canvas id as a CSS class if we aren't manually configured
	if (this.config.get("id")) {
		ids = this._getIds().normalized;
		// adding a primary canvas ID and unique page identifier
		// as a CSS class if provided
		cssClass = Utils.foldl("", ["main", "unique"], function(type, acc) {
			return (acc += ids[type] ? self.get("cssPrefix") + ids[type] + " " : "");
		});
		target.addClass(cssClass);
	}

	// fetch canvas config from remote storage
	this._fetchConfig(function() {
		var backplane = self.get("data.backplane");
		if (backplane) {
			Backplane.init(backplane);
		}
		self._loadAppResources(parent);
	});
};

canvas.config = {
	/**
	 * @cfg {String} [id]
	 * Unique ID of the Canvas, used by the Canvas instance
	 * to retrieve the data from the Canvases data storage.
	 */
	"id": "",

	/**
	 * @cfg {Object} [data]
	 * Object which contains the Canvas data in the format
	 * used to store the Canvas config in the Canvas storage.
	 */
	"data": {},

	/**
	 * @cfg {String} target(required)
	 * Specifies the DOM element where the application will be displayed.
	 *
	 * Note: if only the "target" config parameter is defined, the target DOM element
	 * should contain the following HTML attribute:
	 *
	 * + "data-canvas-id" with the unique Canvas ID which should be initialized
	 *
	 * The values of the HTML parameters override the "id" parameter value
	 * (respectively) passed via the Canvas config.
	 */

	/**
	 * @cfg {Object} [overrides]
	 * Object which contains the overrides applied for this Canvas on the page
	 * via Loader.override function call.
	 */
	"overrides": {},

	/**
	 * @cfg {String} [mode]
	 * This parameter specifies the mode in which Canvas works.
	 * There are two possible values for this parameter:
	 *
	 * + "dev" - in this case the Canvas works with the development configuration storage
	 * + "prod" - in this case the Canvas works with the production configuration storage
	 *
	 * More information about defference between production and development configuration
	 * storages can be found in the ["How to deploy an App using a Canvas guide"](#!/guide/how_to_deploy_an_app_using_a_canvas)
	 *
	 * The value of this parameter can be overridden by specifying the "data-canvas-mode"
	 * target DOM element attribute.
	 * More information about HTML attributes of the target DOM element can be found [here](#!/guide/how_to_deploy_an_app_using_a_canvas)
	 */
	"mode": "prod"
};

canvas.vars = {
	"apps": []
};

canvas.labels = {
	/**
	 * @echo_label
	 */
	"error_no_apps": "No applications defined for this canvas",
	/**
	 * @echo_label
	 */
	"error_no_config": "Unable to retrieve Canvas config",
	/**
	 * @echo_label
	 */
	"error_no_suitable_app_class": "Unable to init an app, no suitable JS class found",
	/**
	 * @echo_label
	 */
	"error_unable_to_retrieve_app_config": "Unable to retrieve Canvas config from the storage",
	/**
	 * @echo_label
	 */
	"error_incomplete_app_config": "Unable to init an app, config is incomplete",
	/**
	 * @echo_label
	 */
	"error_canvas_already_initialized": "Canvas has been initialized already",
	/**
	 * @echo_label
	 */
	"error_invalid_canvas_config": "Canvas with invalid configuration found"
};

/**
 * @echo_template
 */
canvas.templates.main =
	'<div class="{class:container}"></div>';

/**
 * @echo_template
 */
canvas.templates.app =
	'<div class="{class:appContainer}">' +
		'<div class="{class:appHeader}">{data:caption}</div>' +
		'<div class="{class:appBody}"></div>' +
	'</div>';

canvas.destroy = function() {
	$.map(this.get("apps"), $.proxy(this._destroyApp, this));
	this.config.get("target").data("echo-canvas-initialized", false);
	// remove cached canvas config
	Utils.remove(Loader.canvasesConfigById, this._getIds().unique);
};

/**
 * @echo_renderer
 */
canvas.renderers.container = function(element) {
	var self = this;
	$.map(this.get("data.apps"), function(app, id) {
		self._initApp(app, element, id);
	});
	return element;
};

canvas.methods._initApp = function(app, element, id) {
	var self = this;
	var Application = Utils.getComponent(app.component);
	if (!Application) {
		this._error({
			"args": {"app": app},
			"code": "no_suitable_app_class"
		});
		return;
	}

	app.id = app.id || id;  // define app position in array as id if not specified
	app.config = app.config || {};
	app.config.canvasId = this.config.get('id');

	var view = this.view.fork({
		"renderer": null,
		"renderers": {
			"appHeader": function(element) {
				// show|hide app header depending on the caption existance
				return element[app.caption ? "show" : "hide"]();
			},
			"appBody": function(element) {
				var className = self.get("cssPrefix") + "appId-" + app.id;
				return element.addClass(className);
			}
		}
	});
	element.append(view.render({
		"data": app,
		"template": this.templates.app
	}));

	app.config.target = view.get("appBody");

	var overrides = this.config.get("overrides")[app.id];
	var config = overrides
		? $.extend(true, app.config, overrides)
		: app.config;
	this.apps.push(new Application(config));
};

canvas.methods._destroyApp = function(app) {
	if (app && $.isFunction(app.destroy)) app.destroy();
};

canvas.methods._isManuallyConfigured = function() {
	return !$.isEmptyObject(this.get("data"));
};

canvas.methods._getAppScriptURL = function(config) {
	if (!config.scripts) return config.script;
	var isSecure, script = {
		"dev": config.scripts.dev || config.scripts.prod,
		"prod": config.scripts.prod || config.scripts.dev
	}[Loader.isDebug() ? "dev" : "prod"];
	if (typeof script === "string") return script;
	isSecure = /^https/.test(window.location.protocol);
	return script[isSecure ? "secure" : "regular"];
};

canvas.methods._loadAppResources = function(callback) {
	var self = this, resources = [], isManual = this._isManuallyConfigured();
	$.map(this.get("data.apps"), function(app) {
		var script = self._getAppScriptURL(app);
		if (!app.component || !script || !(isManual || app.id)) {
			self._error({
				"args": {"app": app},
				"code": "incomplete_app_config"
			});
			return;
		}
		resources.push({
			"url": script,
			"loaded": function() {
				return App.isDefined(app.component);
			}
		});
	});
	Loader.download(resources, callback);
};

canvas.methods._getOverrides = function(target, spec) {
	return Utils.foldl({}, spec || [], function(item, acc) {
		// We should convert spec item to lower case because of jQuery
		// HTML5 data attributes implementation http://api.jquery.com/data/#data-html5
		// Since we have config keys in camel case representation like "useSecureAPI",
		// we should follow to these rules.
		var key = "canvas-" + item.toLowerCase();
		var value = target.data(key);
		if (typeof value !== "undefined") {
			acc[item] = value;
		}
	});
};

canvas.methods._error = function(args) {
	args.message = args.message || this.labels.get("error_" + args.code);

	/**
	 * @echo_event Canvas.onError
	 * Event which is triggered in case of errors such as invalid configuration,
	 * problems fetching the data from the server side, etc.
	 *
	 * @param {String} topic
	 * Name of the event produced.
	 *
	 * @param {Object} data
	 * Object which contains debug information regarding the error.
	 */
	Events.publish({
		"topic": "Echo.Canvas.onError",
		"data": args
	});

	Utils.log($.extend(args, {"type": "error", "component": "Canvas"}));
	if (args.renderError) {
		this.showMessage({
			"type": "error",
			"message": args.message
		});
	}
};

canvas.methods._getIds = function() {
	var id = this.config.get("id");
	var parts = id.split("#");
	var normalize = function(s) { return s.replace(/[^a-z\d]/ig, "-"); };
	return {
		"unique": id,
		"main": parts[0],
		"normalized": {
			"unique": normalize(id),
			"main": normalize(parts[0])
		}
	};
};

canvas.methods._fetchConfig = function(callback) {
	var self = this, target = this.config.get("target");
	var isManual = this._isManuallyConfigured();
	// no need to perform server side request in case
	// we already have all the data on the client side
	if (isManual) {
		callback.call(this);
		return;
	}
	var mode = this.config.get("mode");
	var getConfig = function() {
		return Loader.canvasesConfigById[self._getIds().unique];
	};
	var parts = Utils.parseURL(Loader.config.storageURL[mode]);
	var URL = this.substitute({
		"template": "{data:scheme}://{data:domain}{data:path}{data:endpoint}",
		"data": $.extend(parts, {
			// taking care of the Canvas unique identifier on the page,
			// specified as "#XXX" in the Canvas ID. We don't need to send this
			// unique page identifier, we send only the primary Canvas ID.
			"endpoint": this._getIds().main,
			"scheme": this.config.get("useSecureAPI") ? "https" : parts.scheme || "http"
		})
	});

	$.ajax({
		"url": URL,
		"crossDomain": true,
		"dataType": "script",
		"cache": mode !== "dev",
		"timeout": Loader.config.errorTimeout,
		"success": function() {
			var config = getConfig();
			if (!config || !config.apps || !config.apps.length) {
				var message = self.labels.get("error_no_" + (config ? "apps" : "config"));
				self._error({
					"args": {"config": config, "target": target},
					"code": "invalid_canvas_config",
					"message": message
				});
				return;
			}
			self.set("data", config); // store Canvas data into the instance
			callback.call(self);
		},
		"error": function() {
			self._error({
				"args": arguments,
				"code": "unable_to_retrieve_app_config",
				"renderError": true
			});
		}
	});
};

return App.create(canvas);
});
