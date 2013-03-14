(function(jQuery) {
"use strict";

var $ = jQuery;

var canvas = Echo.Control.manifest("Echo.Canvas");

if (Echo.Control.isDefined(canvas)) return;

canvas.init = function() {
	var self = this, target = this.config.get("target");

	// check if the canvas was already initialized
	if (target.data("initialized")) {
		this._error({
			"args": {"target": target},
			"code": "canvas_already_initialized",
			"message": "Canvas has been initialized already"
		});
		return;
	}

	// extending Canvas config with the "id" and "appkey" defined in the target
	var overrides = this._getOverrides(target, [["id", "canvas-id"], "appkey"]);
	if (!$.isEmptyObject(overrides)) {
		this.config.extend(overrides);
	}

	// exit if no "id" or "appkey" is defined for the canvas,
	// skip this validation in case the "data" is defined explicitly in the config
	if (!this._isManuallyConfigured() &&
		!(this.config.get("id") && this.config.get("appkey"))) {
			this._error({
				"args": {"target": target},
				"code": "invalid_canvas_config",
				"message": "Canvas with invalid configuration found"
			});
			return;
	}

	// define initialized state for the canvas
	// to prevent multiple initalization of the same canvas
	target.data("initialized", true);

	this._fetchConfig(function(config) {
		if (!config || !config.apps || !config.apps.length) {
			var message = self.labels.get("error_no_" + (config ? "apps" : "config"));
			self._error({
				"args": {"config": config, "target": target},
				"code": "invalid_canvas_config",
				"message": message
			});
			self.showMessage({
				"type": "error",
				"message": message
			});
			return;
		}
		self.set("data", config); // store Canvas data into the instance
		self._initBackplane(function() {
			self._initUser(function(user) {
				self.config.set("user", user);
				self._loadAppResources(function() {
					self.render();
					self.ready();
				});
			});
		});
	});
};

// TODO: add docs for the config params
canvas.config = {
	"id": undefined,
	"data": undefined,
	"target": undefined, // TODO: need to describe "data-appkey" & "data-canvas-id" in docs
	"appkey": undefined,
	"overrides": {},
	"storageURL": Echo.Loader.config.storageURL
};

canvas.vars = {
	"apps": []
};

canvas.labels = {
	"error_no_apps": "No applications defined for this canvas",
	"error_no_config": "Unable to retrieve Canvas config"
};

canvas.events = {
	"Echo.Canvas.onRefresh": function() {
		this.config.get("target").data("initialized", false);
	}
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
	this.config.get("target").data("initialized", false);
};

canvas.renderers.container = function(element) {
	var self = this;
	$.map(this.get("data.apps"), function(app, id) {
		self._initApp(app, element, id);
	});
	return element;
};

canvas.methods._initApp = function(app, element, id) {
	var Application = Echo.Utils.getComponent(app.component);
	if (!Application) {
		this._error({
			"args": {"app": app},
			"code": "no_suitable_app_class",
			"message": "Unable to init an app, no suitable JS class found"
		});
		return;
	}

	var view = this.view.fork();
	element.append(view.render({
		"data": app,
		"template": this.templates.app
	}));

	// show|hide app header depending on the caption existance
	view.get("appHeader")[app.caption ? "show" : "hide"]();

	app.id = app.id || id;  // define app position in array as id if not specified
	app.config = app.config || {};
	app.config.user = this.config.get("user");
	app.config.target = view.get("appBody");

	var overrides = this.config.get("overrides", {})[app.id];
	var config = overrides
		? $.extend(true, app.config, overrides)
		: app.config;
	this.apps.push(new Application(config));
};

canvas.methods._destroyApp = function(app) {
	if (app) app.destroy();
};

canvas.methods._fetchConfig = function(callback) {
	var self = this;

	// no need to perform server side request in case
	// we already have all the data on the client side
	if (this._isManuallyConfigured()) {
		callback(this.get("data"));
		return;
	}
	(new Echo.API.Request({
		"apiBaseURL": this.config.get("storageURL"),
		"endpoint": this.config.get("id"),
		"onData": $.proxy(callback, this),
		"onError": function(response) {
			self._error({
				"args": response,
				"code": "unable_to_retrieve_app_config",
				"message": "Unable to retrieve Canvas config from the storage"
			});
			callback.call(self);
		}
	})).request();
};

canvas.methods._initBackplane = function(callback) {
	// Note: Backplane.init in v2 will be async,
	// so we need a callback to execute after Backplane init
	Backplane.init(this.get("data.backplane"));
	callback && callback();
};

canvas.methods._initUser = function(callback) {
	var user = this.config.get("user");

	// do not init user if the instance already
	// exists or the appkey is undefined
	if (user || !this.config.get("appkey")) {
		callback && callback(user);
		return;
	}

	Echo.UserSession({
		"appkey": this.config.get("appkey"),
		"ready": function() {
			callback && callback(this);
		}
	});
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
				"code": "incomplete_app_config",
				"message": "Unable to init an app, config is incomplete"
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
	var overrides = {};
	if (target && spec && spec.length) {
		Echo.Utils.foldl(overrides, spec, function(item, acc) {
			var complex = $.isArray(item);
			var key = complex ? item[0] : item;
			var value = target.data(complex ? item[1] : item);
			if (typeof value !== "undefined") {
				acc[key] = value;
			}
		});
	}
	return overrides;
};

canvas.methods._error = Echo.Loader._error;

Echo.Control.create(canvas);

})(Echo.jQuery);
