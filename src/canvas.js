(function(jQuery) {
"use strict";

var $ = jQuery;

var canvas = Echo.Control.manifest("Echo.Canvas");

if (Echo.Control.isDefined(canvas)) return;

/**
 * @class Echo.Canvas
 * Class which implements Canvas mechanics on the client side.
 * The instance of this class is created for each Canvas found on the page by
 * the Echo.Loader. The instance of the class can also be created manually in
 * case the Canvas data already exists on the page.
 *
 * @package environment.pack.js
 *
 * @extends Echo.Control
 *
 * @constructor
 * Canvas object constructor to initialize the Echo.Canvas instance
 *
 * @param {Object} config
 * Configuration options
 */

/** @hide @method getRelativeTime */
/** @hide @echo_label today */
/** @hide @echo_label yesterday */
/** @hide @echo_label lastWeek */
/** @hide @echo_label lastMonth */
/** @hide @echo_label secondAgo */
/** @hide @echo_label secondsAgo */
/** @hide @echo_label minuteAgo */
/** @hide @echo_label minutesAgo */
/** @hide @echo_label hourAgo */
/** @hide @echo_label hoursAgo */
/** @hide @echo_label dayAgo */
/** @hide @echo_label daysAgo */
/** @hide @echo_label weekAgo */
/** @hide @echo_label weeksAgo */
/** @hide @echo_label monthAgo */
/** @hide @echo_label monthsAgo */
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

canvas.init = function() {
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
	target.data("echo-canvas-initialized", true)
		.addClass(this.get("cssPrefix") + "id-" + this.config.get("id").replace("/", "-"));
	this._loadAppResources(parent);
};

canvas.config = {
	/**
	 * @cfg {String} [id]
	 * Unique ID of the Canvas, used by the Echo.Canvas instance
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
	 * Specifies the DOM element where the control will be displayed.
	 *
	 * Note: if only the "target" config parameter is defined, the target DOM element
	 * should contain the following HTML attributes:
	 *
	 * + "data-appkey" with the necessary appkey value
	 * + "data-canvas-id" with the unique Canvas ID which should be initialized
	 *
	 * The values of the HTML parameters override the "appkey" and "id" parameter values
	 * (respectively) passed via the Canvas config.
	 */

	/**
	 * @cfg {String} appkey
	 * @inheritdoc
	 */

	/**
	 * @cfg {Object} [overrides]
	 * Object which contains the overrides applied for this Canvas on the page
	 * via Echo.Loader.override function call.
	 */
	"overrides": {},

	/**
	 * @ignore
	 */
	"storageURL": Echo.Loader.config.storageURL  // no docs, not supposed
						     // to be changed by the publishers
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

canvas.templates.main =
	'<div class="{class:container}"></div>';

canvas.templates.app =
	'<div class="{class:appContainer}">' +
		'<div class="{class:appHeader}">{data:caption}</div>' +
		'<div class="{class:appBody}"></div>' +
	'</div>';

canvas.destroy = function() {
	$.map(this.get("apps"), $.proxy(this._destroyApp, this));
	this.config.get("target").data("echo-canvas-initialized", false);
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
	var Application = Echo.Utils.getComponent(app.component);
	if (!Application) {
		this._error({
			"args": {"app": app},
			"code": "no_suitable_app_class"
		});
		return;
	}

	app.id = app.id || id;  // define app position in array as id if not specified
	app.config = app.config || {};
	app.config.user = this.config.get("user");
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
	if (app) app.destroy();
};

canvas.methods._isManuallyConfigured = function() {
	return !$.isEmptyObject(this.get("data"));
};

canvas.methods._getAppScriptURL = function(config) {
	return config.scripts && config.scripts.dev && config.scripts.prod
		? config.scripts[Echo.Loader.isDebug() ? "dev" : "prod"]
		: config.script;
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
				return Echo.Control.isDefined(app.component);
			}
		});
	});
	Echo.Loader.download(resources, callback);
};

canvas.methods._getOverrides = function(target, spec) {
	return Echo.Utils.foldl({}, spec || [], function(item, acc) {
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
	 * @echo_event Echo.Canvas.onError
	 * Event which is triggered in case of errors such as invalid configuration,
	 * problems fetching the data from the server side, etc.
	 *
	 * @param {String} topic
	 * Name of the event produced.
	 *
	 * @param {Object} data
	 * Object which contains debug information regarding the error.
	 */
	Echo.Events.publish({
		"topic": "Echo.Canvas.onError",
		"data": args
	});

	Echo.Utils.log($.extend(args, {"type": "error", "component": "Echo.Canvas"}));
	if (args.renderError) {
		this.showMessage({
			"type": "error",
			"message": args.message
		});
	}
};

Echo.Control.create(canvas);

// Echo.Canvas class initialization logic requires additional initializers.
// Before user initialization we should fetch canvas config from the server
// and init a backplane mechanism. According to it we should extend default
// control initializers list with own ones.
var initializers = $.extend(true, {}, Echo.Canvas.prototype._initializers);

var list = initializers.list;

$.each(list, function(i, spec) {
	if (spec[0] === "user:async") {
		list.splice(i, 0, ["fetchConfig:async", ["init", "refresh"]]);
		list.splice(i + 1, 0, ["initBackplane:async", ["init", "refresh"]]);
		return false;
	}
});

initializers.fetchConfig = function(callback) {
	var self = this, target = this.config.get("target");
	var isManual = this._isManuallyConfigured();

	// extending Canvas config with the "id" and "appkey" defined in the target
	var overrides = this._getOverrides(target, ["id", "appkey", "useSecureAPI"]);
	if (!$.isEmptyObject(overrides)) {
		this.config.extend(overrides);
	}

	// exit if no "id" or "appkey" is defined for the canvas,
	// skip this validation in case the "data" is defined explicitly in the config
	if (!isManual &&
		!(this.config.get("id") && this.config.get("appkey"))) {
			this._error({
				"args": {"target": target},
				"code": "invalid_canvas_config"
			});
			return;
	}

	// no need to perform server side request in case
	// we already have all the data on the client side
	if (isManual) {
		callback.call(this);
		return;
	}
	(new Echo.API.Request({
		"apiBaseURL": this.config.get("storageURL"),
		"secure": this.config.get("useSecureAPI"),
		"endpoint": this.config.get("id"),
		"data": { "_": Math.random() },
		"onData": function(config) {
			if (!config || !config.apps || !config.apps.length) {
				var message = self.labels.get("error_no_" + (config ? "apps" : "config"));
				self._error({
					"args": {"config": config, "target": target},
					"code": "invalid_canvas_config",
					"renderError": true,
					"message": message
				});
				return;
			}
			self.set("data", config); // store Canvas data into the instance
			callback.call(self);
		},
		"onError": function(response) {
			self._error({
				"args": response,
				"code": "unable_to_retrieve_app_config",
				"renderError": true
			});
		}
	})).request();
};

initializers.initBackplane = function(callback) {
	// Note: Backplane.init in v2 will be async,
	// so we need a callback to execute after Backplane init
	Backplane.init(this.get("data.backplane"));
	callback.call(this);
};

Echo.Canvas.prototype._initializers = initializers;

})(Echo.jQuery);
