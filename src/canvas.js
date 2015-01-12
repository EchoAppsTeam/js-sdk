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
/** @hide @echo_label justNow */
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

/**
 * @echo_event Echo.Canvas.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.Canvas.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.Canvas.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.Canvas.onRerender
 * Triggered when the app is rerendered.
 */

canvas.init = function() {
	var ids, cssClass;
	var self = this, target = this.config.get("target");

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
	var overrides = this._getOverrides(target, [
		"id",
		"mode",
		"provider",
		"useSecureAPI",
		"appsInit",
		"maxConfigFetchingRetries"
	]);
	if (!$.isEmptyObject(overrides)) {
		this.config.extend(overrides);
	}

	if (Echo.Loader.isDebug()) this.config.set("mode", "dev");

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
		cssClass = Echo.Utils.foldl("", ["main", "unique"], function(type, acc) {
			return (acc += ids[type] ? self.get("cssPrefix") + ids[type] + " " : "");
		});
		target.addClass(cssClass);
	}

	// fetch canvas config from remote storage
	this._fetchConfig(function() {
		/**
		 * @echo_event Echo.Canvas.onDataReceive
		 * Event which is triggered when data received from the storage.
		 *
		 * @param {String} topic
		 * Name of the event produced.
		 *
		 * @param {Object} data
		 *
		 * @param {String} id
		 * Unique ID of the Canvas.
		 *
		 * @param {Object} config
		 * Object which contains received config.
		 */
		self.events.publish({
			"topic": "onDataReceive",
			"data": {
				"id": self.config.get("id"),
				"config": self.get("data")
			}
		});
		var backplane = self.get("data.backplane");
		if (backplane) {
			Backplane.init(backplane);
		}
		self.updateLayout(this.get("data.apps"), this.get("data.layout")).then(function() {
			self.ready();
		});
	});
};

canvas.config = {
	/**
	 * @cfg {String} [appsInit]
	 * This parameter specifies the mode in which applications will be initialized.
	 * There are two possible values for this parameter:
	 *
	 * + "async" - in this case applications initialize simultaneously
	 * + "sync" - in this case applications initialize synchronously one-by-one
	 *
	 * The value of this parameter can be overridden by specifying the "data-canvas-appsInit"
	 * target DOM element attribute.
	 * More information about HTML attributes of the target DOM element can be found [here](#!/guide/how_to_deploy_an_app_using_a_canvas)
	 */
	"appsInit": "async",

	/**
	 * @cfg {Number} [appInitTimeout]
	 * This parameter specifies the interval in milliseconds in which
	 * each application can be executed during initialization process.
	 *
	 * The value of this parameter can be overridden by specifying the "data-canvas-appInitTimeout"
	 * target DOM element attribute.
	 * More information about HTML attributes of the target DOM element can be found [here](#!/guide/how_to_deploy_an_app_using_a_canvas)
	 */
	"appInitTimeout": 5000,

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
	 * via Echo.Loader.override function call.
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
	"mode": "prod",

	/**
	 * @cfg {Number} [maxConfigFetchingRetries]
	 * The number of retries attempts to fetch canvas config.
	 *
	 * The value of this parameter can be overridden by specifying the "data-canvas-maxConfigFetchingRetries"
	 * target DOM element attribute.
	 * More information about HTML attributes of the target DOM element can be found [here](#!/guide/how_to_deploy_an_app_using_a_canvas)
	 */
	"maxConfigFetchingRetries": 2,

	"provider": "aws", // "aws" | "fastly"

	/**
	 * @cfg {Boolean} refreshOnUserInvalidate=false
	 * @inheritdoc
	 */
	"refreshOnUserInvalidate": false
};

canvas.vars = {
	"apps": {}
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

canvas.templates.row =
	'<div class="echo-canvas-row" data-type="row"></div>';

canvas.templates.column =
	'<div class="echo-canvas-column" data-type="column"></div>';

/**
 * @echo_template
 */
canvas.templates.app =
	'<div class="{class:appContainer}">' +
		'<div class="{class:appHeader}"></div>' +
		'<div class="{class:appBody}"></div>' +
	'</div>';

canvas.destroy = function() {
	$.map(this.get("apps"), $.proxy(this._destroyApp, this));
	this.config.get("target").data("echo-canvas-initialized", false);
	// remove cached canvas config
	Echo.Utils.remove(Echo.Loader.canvasesConfigById, this._getIds().unique);
};

/**
 * @echo_renderer
 */
canvas.renderers.container = function(element) {
	return this._buildGrid(this.get("data.apps", []), this.get("data.layout", []), element);
};

/**
 * Canvas layout granular update logic without full refresh.
 *
 * This function performs the following actions:
 *
 * - inits an app if it was added to the Canvas
 * - re-inits an app if the config of that app was changed
 * - destroys an app in case it was deleted from a Canvas
 * - re-arranges target elements in a Canvas if app locations/sizes
 *   were changed
 *
 * @param {Array} apps
 * App list in the format used within the Canvas storage
 *
 * For example:
 *
 * 	[{
 * 		"id": "appId",
 * 		"script": "http://appurl/app.js",
 * 		"component": "App.Class",
 * 		"config": {
 * 			"key1": "value1"
 * 		}
 * 	}, {
 * 		"id": "anotherAppId",
 * 		"script": "http://anotherappurl/app.js",
 * 		"component": "AnotherApp.Class",
 * 		"config": {
 * 			"key2": "value2"
 * 		}
 * 	}]
 *
 * @param {Array} layout
 * Layout configuration in the format used within the Canvas storage.
 *
 * For example:
 *
 * 	[
 * 		{"col": 1, "row": 1, "size_x": 4, "app": "appId"},
 * 		{"col": 2, "row": 1, "size_x": 8, "app": "anotherAppId"}
 * 	]
 *
 * @return {jQuery Deferred's promise}
 * The Promise object resolves when all apps are initialized and new
 * layout is built
 */
canvas.methods.updateLayout = function(apps, layout) {
	var render = function(apps) {
		this.render();
		return apps;
	};
	this.set("data.apps", apps);
	this.set("data.layout", layout || []);
	return Echo.Utils.pipe([
		$.proxy(this._loadAppResources, this, apps),
		$.proxy(this._destroyOutdatedApps, this),
		$.proxy(this._prepareAppsView, this),
		$.proxy(render, this),
		$.proxy(this._sortAppsByLayout, this),
		$.proxy(this._initApps, this)
	]);
};

// destroy apps which are initialized but not specified in apps.
canvas.methods._destroyOutdatedApps = function(apps) {
	var self = this;
	$.each(this.apps, function(appId, app) {
		var found = self._indexOfApp(appId, apps) > -1;
		if (!found) self._destroyApp(app);
	});
	return apps;
};

canvas.methods._indexOfApp = function(id, apps) {
	var index = -1;
	$.each(apps, function(i, app) {
		if (id === app.id) {
			index = i;
			return false;
		}
	});
	return index;
};

// since applications can be placed in a row, we want to sort them
// in the order they need to be initialized and visually displayed,
// i.e. left -> right, top -> bottom
canvas.methods._sortAppsByLayout = function(apps) {
	var self = this;
	var layout = this.get("data.layout", [])
		.sort(function(a, b) { return a.row - b.row || a.col - b.col; });
	var sorted = Echo.Utils.foldl([], layout, function(item, acc, i) {
		var appId = item.app;
		var index = self._indexOfApp(appId, apps);
		if (index === -1) return acc;
		if (i > 0 && acc[i - 1]) {
			acc[i] = apps[index];
		} else {
			acc.push(apps[index]);
		}
		apps.splice(index, 1);
		return acc;
	});
	return sorted.concat(apps);
};

canvas.methods._isAppInitRequired = function(app) {
	return !this.apps[app.id] || !this.apps[app.id].instance;
};

canvas.methods._isAppReInitRequired = function(app) {
	return !Echo.Utils.deepEqual(app, this.apps[app.id].data);
};

canvas.methods._initApps = function(apps) {
	var self = this;
	var appsObject = this.apps;
	var initApp = $.proxy(this._initApp, this);
	var reInitApp = $.proxy(this._reInitApp, this);
	var isSyncAppsInit = this.config.get("appsInit") === "sync";

	var iterator = function(init, app) {
		appsObject[app.id].data = $.extend(true, {}, app);
		var wrapper = function() {
			return init(app).done(function(instance) {
				appsObject[app.id].instance = instance;
				return instance;
			});
		};
		return isSyncAppsInit ? wrapper : wrapper();
	};
	var promises = $.map(apps, function(app) {
		if (self._isAppInitRequired(app)) {
			return iterator(initApp, app);
		} else if (self._isAppReInitRequired(app)) {
			return iterator(reInitApp, app);
		}
		return iterator(function() {
			return $.Deferred()
				.resolve(appsObject[app.id].instance)
				.promise();
		}, app);
	});
	return isSyncAppsInit
		? Echo.Utils.pipe(promises)
		: $.when.apply($, promises);
};

canvas.methods._reInitApp = function(app) {
	var obj = {};
	var appContainer = this.apps[app.id];
	obj.view = appContainer.view;
	obj.data = appContainer.data;
	this._destroyApp(this.apps[app.id]);
	this.apps[app.id] = obj;
	return this._initApp(app);
};

canvas.methods._initApp = function(app) {
	var deferred = $.Deferred();
	var Application = Echo.Utils.getComponent(app.component);
	if (!Application) {
		this._error({
			"args": {"app": app},
			"code": "no_suitable_app_class"
		});
		deferred.reject(app);
		return deferred.promise();
	}

	var overrides = this.config.get("overrides")[app.id];

	app.config.target = this.apps[app.id].view.get("appBody");

	var config = overrides
		? $.extend(true, app.config, overrides)
		: app.config;
	var ready = config.ready || $.noop;
	var timeoutId;
	var resolve = function(instance) {
		clearTimeout(timeoutId);
		return deferred.resolve(instance);
	};

	// determine if Application is the Echo specific
	if (Application._manifest) {
		var instance = new Application(
			$.extend(config, {
				"ready": function() {
					ready.apply(this, arguments);
					resolve(this);
				}
			})
		);
		timeoutId = setTimeout(function() {
			resolve(instance);
		}, this.config.get("appInitTimeout"));
	} else {
		resolve(new Application(config));
	}

	return deferred.promise();
};

canvas.methods._normalizeApp = function(app) {
	return $.extend(true, {
		"id": Echo.Utils.getUniqueString(),
		"config": {
			"canvasId": this.config.get("id")
		}
	}, app);
};

canvas.methods._prepareAppsView = function(apps) {
	var self = this;
	return $.map(apps, function(app) {
		app = self._normalizeApp(app);
		if (self._isAppInitRequired(app) || self._isAppReInitRequired(app)) {
			var appClassName = self.get("cssPrefix") + "appId-" + app.id;
			var view = self.view.fork({
				"renderer": null,
				"renderers": {
					"appHeader": function(element) {
						return app.caption
							? element.text(Echo.Utils.sanitize(app.caption, "plainText")).show()
							: element.hide();
					},
					"appBody": function(element) {
						return element.addClass(appClassName);
					}
				}
			});

			view.render({
				"data": app,
				"template": self.templates.app
			});

			self.apps[app.id] = self.apps[app.id] || {};
			self.apps[app.id].view = view;
		}
		return app;
	});
};

canvas.methods._buildGrid = function(apps, grid, container) {
	var self = this;
	var totalColumns = Math.max.apply(null, $.map(grid, function(item) {
		return item.col + item.size_x - 1;
	}).concat(0));
	var toMatrix = function(grid) {
		return Echo.Utils.foldl([], grid, function(item, acc, k) {
			if (!acc[item.row - 1]) acc[item.row - 1] = [];
			acc[item.row - 1][item.col - 1] = $.extend({}, item, {
				"row": item.row - 1,
				"col": item.col - 1
			});
		});
	};

	var getItemsBelow = function(matrix, cell) {
		var result = [];
		var itemBelow = matrix[cell.row + 1] && matrix[cell.row + 1][cell.col];
		if (itemBelow && itemBelow.size_x === cell.size_x) {
			result = result
				.concat(itemBelow)
				.concat(getItemsBelow(matrix, itemBelow));
		}
		return result;
	};

	var rows = [];
	var matrix = toMatrix(grid);

	$.each(matrix, function(rowIndex, row) {
		var tmpRow = {"type": "row", "items": []};
		var usedColumns = 0;
		$.each(row || [], function(cellIndex, cell) {
			if (!cell || cell.processed) return true;

			// insert column before current if there is free space
			if (cell.col > usedColumns) {
				tmpRow.items.push({"type": "column", "size_x": cell.col - usedColumns});
				usedColumns = cell.col;
			}

			var itemsBelow = getItemsBelow(matrix, cell);
			$.each(itemsBelow, function(k, item) {
				item.processed = true;
			});
			tmpRow.items.push({
				"type": "column",
				"items": [].concat(cell).concat(itemsBelow),
				"size_x": cell.size_x
			});

			usedColumns = Math.max(usedColumns, cell.col + cell.size_x);
		});
		// insert column at the end of row if there is free space left
		if (totalColumns > usedColumns) {
			tmpRow.items.push({
				"type": "column",
				"size_x": totalColumns - usedColumns
			});
		}
		rows.push(tmpRow);
	});

	var appsObject = $.extend({}, this.apps);

	(function buildDom(items, container, depth) {
		depth = depth || 0;
		$.each(items || [], function(k, item) {
			if (item.app && appsObject[item.app]) {
				container.append(appsObject[item.app].view.get("appContainer"));
				delete appsObject[item.app];
			} else if (item.type) {
				var template = self.templates[item.type];
				var element = $(self.substitute({"template": template}));
				if (item.size_x) element.addClass(self.cssPrefix + "column-" + item.size_x + "-" + totalColumns);
				if (item.items) buildDom(item.items, element, depth + 1);
				container.append(element);
			}
		});
		if (!depth && !$.isEmptyObject(appsObject)) {
			// Put all apps from the canvas that were not mentioned in layout to the very end of container.
			// Useful for backwards complatibility and apps added to canvas through API call.
			$.each(appsObject, function(k, app) {
				container.append(app.view.get("appContainer"));
			});
		}
	})(rows, container);
	return container;
};

canvas.methods._destroyApp = function(app) {
	if (app && app.instance && $.isFunction(app.instance.destroy)) app.instance.destroy();
	return (delete this.apps[app.data.id]);
};

canvas.methods._isManuallyConfigured = function() {
	return !$.isEmptyObject(this.get("data"));
};

canvas.methods._getAppScriptURL = function(config) {
	if (!config.scripts) return config.script;
	var isSecure, script = {
		"dev": config.scripts.dev || config.scripts.prod,
		"prod": config.scripts.prod || config.scripts.dev
	}[Echo.Loader.isDebug() ? "dev" : "prod"];
	if (typeof script === "string") return script;
	isSecure = /^https/.test(window.location.protocol);
	return script[isSecure ? "secure" : "regular"];
};

canvas.methods._loadAppResources = function(apps) {
	var self = this;
	var resources = [];
	var isManual = this._isManuallyConfigured();
	var deferred = $.Deferred();
	$.map(apps, function(app) {
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
	Echo.Loader.download(resources, function() { deferred.resolve(apps); });
	return deferred.promise();
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
	var provider = this.config.get("provider");
	var isProviderFastly = provider === "fastly";
	var getConfig = function() {
		return Echo.Loader.canvasesConfigById[self._getIds().unique];
	};
	var parts = Echo.Utils.parseURL(Echo.Loader.config.storageURL[provider][mode]);
	var URL = this.substitute({
		"template": "{data:scheme}://{data:domain}{data:path}{data:endpoint}",
		"data": $.extend(parts, {
			// taking care of the Canvas unique identifier on the page,
			// specified as "#XXX" in the Canvas ID. We don't need to send this
			// unique page identifier, we send only the primary Canvas ID.
			"endpoint": this._getIds().main,
			"scheme": this.config.get("useSecureAPI") ? "https" : parts.scheme || "http"
		})
	}) + (isProviderFastly ? ".json" : "");

	// We rely on asynchronous behavior of the $.ajax method call
	// to implement store/fetch mechanics. But it can occasionally
	// be synchronous while fetching cached response. In order to
	// avoid this issue, we always make $.ajax call asynchronously.
	setTimeout(function() {
		Echo.Utils.retry(function() {
			return $.ajax({
				"url": URL,
				"crossDomain": true,
				"cache": mode !== "dev",
				"dataType": isProviderFastly ? "json" : "script",
				"timeout": Echo.Loader.config.errorTimeout,
				"success": function() {
					var config = isProviderFastly ? arguments[0] : getConfig();
					if (!config || !config.apps || !config.apps.length) {
						var message = self.labels.get("error_no_" + (config ? "apps" : "config"));
						// clean up the target element to hide "Loading..." message
						self.config.get("target").empty();
						self._error({
							"args": {"config": config, "target": target},
							"code": "invalid_canvas_config",
							"message": message
						});
						return;
					}
					self.set("data", config); // store Canvas data into the instance
					callback.call(self);
				}
			});
		}, {"ratio": 1, "times": self.config.get("maxConfigFetchingRetries")})
		.fail(function() {
			self._error({
				"args": {"target": self.config.get("target"), "network": arguments},
				"code": "unable_to_retrieve_app_config",
				"renderError": true
			});
		});
	}, 0);
};

var columnWidth = [];
for (var totalColumns = 1; totalColumns <= 8; totalColumns++) {
	for (var columnSize = 1; columnSize <= totalColumns; columnSize++ ) {
		columnWidth.push('.{class:column-' + columnSize + '-' + totalColumns + '} { width: ' + columnSize/totalColumns*100 + '%; }');
	}
}

canvas.css =
	'.{class:appHeader} { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
	'@media (min-width: 400px) {' +
		'.{class:row} { display: table; table-layout: fixed; width: 100%; }' +
		'.{class:column} { display: table-cell; vertical-align: top; }' +
		columnWidth.join(" ") +
	'}';

Echo.Control.create(canvas);

})(Echo.jQuery);
