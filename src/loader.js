(function() {
"use strict";

if (!window.Echo) window.Echo = {};

if (Echo.Loader) return;

/**
 * @class Echo.Loader
 * Static class which implements common mechanics for canvases loading.
 */
Echo.Loader = {
	"version": "",
	"debug": false,
	"config": {
		"cdnBaseURL": "http://cdn.echoenabled.com/",
		"errorTimeout": 5000 // 5 sec
	},
	"overrides": {},
	"vars": {
		"state": {"resources": {}, "queue": []}
	}
};

/**
 * @static
 * Function to get normalized URL.
 *
 * @param {String} url
 * JavaScript or CSS stylesheet file URL.
 *
 * @param {Boolean} [devVersion=true]
 * Specifies whether function should return dev version of the file or not,
 * <em>false</em> value is useful when we want to get URL to image because
 * images don't have dev versions
 */
Echo.Loader.getURL = function(url, devVersion) {
	if (typeof devVersion === "undefined") devVersion = true;
	return /^https?:\/\/|^\/\//.test(url)
		? url
		: Echo.Loader.config.cdnBaseURL + "sdk/v" + Echo.Loader.version +
			(devVersion && Echo.Loader.isDebug() ? "/dev" : "") +
			(!url || url.charAt(0) === "/" ? "" : "/") + url;
};
/**
 * @static
 * Function to initialize canvases on the page.
 *
 * @param {Object} [config]
 * Object which defines the initialization of config parameters
 *
 * @param {Mixed} [config.canvases]
 * Array of jQuery elements or a single jQuery element, which represents a
 * canvas target. If this param is omitted, Echo Loader will look for the
 * canvases in the DOM structure.
 *
 * @param {Object} [config.target]
 * Target element where Echo Loader should look for the canvases if no
 * canvases were passed in the "config.canvases" field.
 */
Echo.Loader.init = function(config) {
	config = config || {};
	Echo.Loader.initEnvironment(function() {
		var canvases = config.canvases;

		// convert a single canvas to the 1-element array
		// to keep the same contract below in the code
		if (canvases && !Echo.jQuery.isArray(canvases) &&
			!(canvases instanceof Echo.jQuery)) {
				canvases = [canvases];
		}

		// if no canvases defined during initialization,
		// we look for all canvases in the target ('document' by default)
		canvases = canvases || Echo.jQuery(".echo-canvas", config.target);

		Echo.Loader._initCanvases(canvases);
	});
};

/**
 * @static
 * Function to load the JavaScript or CSS stylesheet files in async mode.
 *
 * @param {Array} resources
 * Array of objects with the properties described below:
 *
 * @param {String} resources.url
 * JavaScript or CSS stylesheet file URL.
 *
 * @param {Function} resources.loaded
 * Function used to check whether the script was loaded. This function must return
 * the boolean value which indicates whether the resource was already loaded on the
 * page or not. If the resource has already been loaded - no download is performed
 * and the callback is called immediately.
 *
 * @param {Function} [callback]
 * Callback function which should be called as soon as all requested files
 * were downloaded.
 *
 * @param {Object} [config]
 * Object with configuration parameters
 *
 * @param {Number} config.errorTimeout
 * Timeout loading of resources in milliseconds, use as yepnope.errorTimeout
 *
 */
Echo.Loader.download = function(resources, callback, config) {
	config = config || {};
	callback = callback || function() {};
	resources = resources || [];

	var state = Echo.Loader.vars.state;
	var invokeCallbacks = function() {
		var callbacks = [];
		// Important note: we should *not* execute callbacks
		// while iterating through the queue. We need to update
		// the queue first and only after that execute the callbacks,
		// because there might be calls to "Echo.Loader.download" function
		// which can interfere with the current queue state.
		state.queue = Echo.Loader._map(state.queue, function(item) {
			if (Echo.Loader._areResourcesReady(item.resources)) {
				callbacks.push(item.callback);
				return; // do *not* put this resource back into the queue
			}
			return item;
		});
		Echo.Loader._map(callbacks, function(_callback) { _callback(); });
	};

	state.queue.push({"resources": resources, "callback": callback});

	var urls = Echo.Loader._map(resources, function(resource) {
		var url = Echo.Loader.getURL(resource.url);
		if (!Echo.Loader._areResourcesReady([resource]) &&
			state.resources[url] !== "loading") {
				state.resources[url] = "loading";
				return url;
		}
	});

	// invoke queued handler in case all requested resources
	// are ready by the time the "download" function is called
	if (!urls.length) {
		invokeCallbacks();
		return;
	}

	var prefix = "timeout=" + (config.errorTimeout || Echo.Loader.config.errorTimeout) + "!";
	Echo.yepnope({
		"load": Echo.Loader._map(urls, function(url) { return prefix + url; }),
		"complete": function() {
			// mark all loaded scripts as "ready"
			Echo.Loader._map(urls, function(url) {
				state.resources[url] = "ready";
			});
			invokeCallbacks();
		}
	});
};

/**
 * @static
 * Function which provides an ability to override config parameters of the
 * specific application within the canvas.
 *
 * @param {String} canvasID
 * Canvas ID.
 *
 * @param {String} appID
 * Application ID inside the canvas.
 *
 * @param {Object} config
 * Object with the application config overrides.
 */
Echo.Loader.override = function(canvasID, appID, config) {
	var overrides = Echo.Loader.overrides;
	overrides[canvasID] = overrides[canvasID] || {};
	overrides[canvasID][appID] = config;
};

/**
 * @static
 * Allows to identify if the debug mode is enabled for Echo environment
 * on the page (i.e whether the logs should be printed in console,
 * non-minified versions of scripts should be used)
 *
 * @return {Boolean}
 */
Echo.Loader.isDebug = function() {
	return Echo.Loader.debug;
};

(function() {
	if (Echo.Loader.debug) return;

	var debug;
	var _debugCookieName = "echo-debug";
	var options = {"path": "/"};
	var hashParts = window.location.hash.match(/echo.debug:(true|false)/);
	if (hashParts && hashParts.length) {
		debug = hashParts[1];
	}
	if (typeof debug !== "undefined") {
		if (debug === "true") {
			Echo.Loader.debug = true;
			Echo.Cookie.set(_debugCookieName, true, options);
		} else {
			Echo.Loader.debug = false;
			Echo.Cookie.remove(_debugCookieName, options);
		}
		return;
	}
	Echo.Loader.debug = !!Echo.Cookie.get(_debugCookieName);
})();

/**
 * @static
 * Function to initialize application on the page. The function performs the following actions:
 *
 * + initializes Echo JavaScript environment (if it was not initialized yet)
 * + establishes the Backplane connection (if app.backplane is defined)
 * + establishes Echo User session on the page (if app.config.appkey is defined)
 * + downloads the application script
 * + calls the app JavaScript class constructor which handles further application initialization
 *
 * @param {Object} app
 * Object which defines the base app configuration.
 *
 * @param {String} app.component
 * The name of the JavaScript app class which should be initialized.
 *
 * @param {String} app.script
 * Appliction JavaScript class script URL.
 *
 * @param {Object} [app.scripts]
 * Object which specifies the location (URL) of the production (minified) and development
 * (non-minified) versions of the app JavaScript class code. The "prod" and "dev" keys
 * should be used in order to specify the production and development URLs respectively.
 *
 * @param {Object} [app.backplane]
 * Object which contains the data to be passed into the Backplane.init call.
 *
 * @param {Object} [app.config]
 * Parameters to be passed into the application constructor during its initialization.
 */
Echo.Loader.initApplication = function(app) {
	app = app || {};
	app.config = app.config || {};
	var script = Echo.Loader._getAppScriptURL(app);

	if (!script || !app.component) {
		Echo.Loader._error({
			"args": {"app": app},
			"code": "invalid_app_config",
			"message": "Invalid config passed into the initApplication function"
		});
		return;
	}

	var initUser = function(callback) {
		if (!app.config.appkey) {
			callback();
			return;
		}
		Echo.Loader._initUser(app.config, function() { callback && callback(this); });
	};
	Echo.Loader.initEnvironment(function() {
		Echo.Loader._initBackplane(app.backplane, function() {
			initUser(function(user) {
				Echo.Loader.download([{
					"url": script,
					"loaded": function() {
						return Echo.Control.isDefined(app.component);
					}
				}], function() {
					var Application = Echo.Utils.getComponent(app.component);
					if (!Application) {
						Echo.Loader._error({
							"args": {"app": app},
							"code": "no_suitable_app_class",
							"message": "Unable to init an app, " +
									"no suitable class found"
						});
						return;
					}
					app.config.user = user;
					new Application(app.config);
				}, {"errorTimeout": Echo.Loader.config.errorTimeout});
			});
		});
	});
};

/**
 * @static
 * Function to initialize Echo environment on the page by downloading Backplane lib,
 * jQuery library with the necessary dependencies and the base Echo classes.
 *
 * @param {Function} [callback]
 * Callback function which should be called as soon as Echo environment is ready.
 */
Echo.Loader.initEnvironment = function(callback) {
	var resources = [{
		"url": "backplane.js",
		"loaded": function() { return !!window.Backplane; }
	}, {
		"url": "third-party/jquery.pack.js",
		"loaded": function() { return !!Echo.jQuery; }
	}, {
		"url": "environment.pack.js",
		"loaded": function() { return !!Echo.Utils; }
	}];
	if (Echo.Loader._areResourcesReady(resources)) {
		callback && callback();
		return;
	}
	Echo.Loader.download(resources, callback);
};

// implementation of the "map" function for the cases when jQuery is not loaded yet
Echo.Loader._map = function(list, iterator) {
	var result = [];
	if (list && list.length && iterator) {
		for (var i = 0; i < list.length; i++) {
			var value = iterator(list[i], i);
			if (value === false) break; // jQuery-like convention
			if (typeof value !== "undefined") result.push(value);
		}
	}
	return result;
};

Echo.Loader._areResourcesReady = function(resources) {
	var state = Echo.Loader.vars.state;
	var readyResources = Echo.Loader._map(resources, function(resource) {
		var url = Echo.Loader.getURL(resource.url);
		return (resource.loaded && resource.loaded()) ||
			(state.resources[url] && state.resources[url] === "ready");
	});
	return resources.length === readyResources.length;
};

Echo.Loader._initCanvases = function(canvases) {
	var collection = [];
	Echo.jQuery.map(canvases, function(target) {
		target = Echo.jQuery(target);

		// check if the canvas was already initialized
		if (target.data("initialized")) {
			Echo.Loader._error({
				"args": {"target": target},
				"code": "canvas_already_initialized",
				"message": "Canvas has been initialized already"
			});
			return;
		}

		var id = target.data("canvas-id");
		var appkey = target.data("appkey");

		if (!id || !appkey) {
			Echo.Loader._error({
				"args": {"target": target},
				"code": "invalid_canvas_config",
				"message": "Canvas with invalid configuration found"
			});
			return;
		}

		// define initialized state for the canvas
		// to prevent multiple initalization of the same canvas
		target.data("initialized", true);

		collection.push({"id": id, "appkey": appkey, "target": target});
	});

	if (!collection.length) {
		Echo.Loader._error({
			"code": "no_canvases_found",
			"message": "No canvases found on the page..."
		});
		return;
	}

	Echo.Loader._fetchCanvasConfigs(collection, function(configs) {
		Echo.jQuery.each(collection, function(id, canvas) {
			var config = configs[canvas.id];
			if (!config) return;

			// copy config object to prevent the same object
			// sharing across multiple canvas instances
			canvas.config = Echo.jQuery.extend(true, {}, configs[canvas.id]);

			Echo.Loader._initCanvas(canvas);
		});
	});
};

Echo.Loader._initCanvas = function(canvas) {
	if (!canvas.config.apps || !canvas.config.apps.length) {
		Echo.Loader._error({
			"args": {"canvas": canvas},
			"code": "canvas_with_no_apps",
			"message": "Canvas with no applications"
		});
		return;
	}
	Echo.Loader._initBackplane(canvas.config.backplane, function() {
		Echo.Loader._initUser(canvas, function() {
			canvas.config.user = this;
			Echo.Loader._initApplications(canvas);
		});
	});
};

Echo.Loader._initBackplane = function(config, callback) {
	// note: Backplane.init in v2 will be async,
	//       so we need a callback to execute after Backplane init
	callback = callback || function(){};
	if (!config) {
		callback();
		return;
	}
	Backplane.init(config);
	callback();
};

Echo.Loader._initUser = function(canvas, callback) {
	Echo.UserSession({
		"appkey": canvas.appkey,
		"ready": callback
	});
};

Echo.Loader._initApplications = function(canvas) {
	var resources = [];
	Echo.jQuery.each(canvas.config.apps, function(id, app) {
		var script = Echo.Loader._getAppScriptURL(app);
		if (!app.component || !script || !app.id) {
			Echo.Loader._error({
				"args": {"app": app},
				"code": "incomplete_app_config",
				"message": "Unable to init an app, config is incomplete"
			});
			return;
		}

		app.config = app.config || {};
		app.config.user = canvas.config.user;
		app.config.target = Echo.Loader._createApplicationTarget(app);
		resources.push({
			"url": script,
			"loaded": function() {
				return Echo.Utils.isComponentDefined(app.component);
			}
		});
	});

	Echo.Loader.download(resources, function() {
		Echo.jQuery.each(canvas.config.apps, function(id, app) {
			var Application = Echo.Utils.getComponent(app.component);
			if (!Application) {
				Echo.Loader._error({
					"args": {"app": app},
					"code": "no_suitable_app_class",
					"message": "Unable to init an app, no suitable class found"
				});
				return;
			}
			var overrides = (Echo.Loader.overrides[canvas.id] || {})[app.id] || {};
			var config = Echo.jQuery.extend(true, app.config, overrides);
			app.ref = new Application(config);
			canvas.target.append(app.config.target);
		});
	}, {
		"errorTimeout": Echo.Loader.config.errorTimeout
	});
};

Echo.Loader._getAppScriptURL = function(config) {
	return config.scripts && config.scripts.dev && config.scripts.prod
		? config.scripts[Echo.Loader.isDebug() ? "dev" : "prod"]
		: config.script;
};

Echo.Loader._createApplicationTarget = function(config) {
	// TODO: add more specific classname and may be id from canvas?
	return Echo.jQuery('<div class="echo-application"></div>');
};

Echo.Loader._fetchCanvasConfigs = function(canvases, callback) {
	if (!canvases.length) return callback();
	var processed = {};
	var requests = Echo.Utils.foldl([], canvases, function(canvas, acc) {

		// do not request config twice
		if (processed[canvas.id]) return;

		processed[canvas.id] = true;
		acc.push({
			"id": canvas.id,
			"key": canvas.id,
			"public": true,
			"method": "kvs/get"
		});
	});
	Echo.jQuery.get("http://api.echoenabled.com/v1/mux", {
		"appkey": canvases[0].appkey,
		"requests": Echo.Utils.objectToJSON(requests)
	}, function(response) {
		if (!response || response.result === "error") {
			Echo.Loader._error({
				"args": response,
				"code": "unable_to_retrieve_app_config",
				"message": "Unable to retrieve Canvas configs from AppServer"
			});
			return;
		}
		var configs = Echo.Utils.foldl({}, response, function(data, acc, id) {
			if (!data || data.result === "error") {
				Echo.Loader._error({
					"args": data,
					"code": "unable_to_retrieve_app_config",
					"message": "Unable to retrieve Canvas config from AppServer"
				});
				return;
			}
			var config;
			try {
				config = Echo.jQuery.parseJSON(data.value);
			} catch(exception) {
				Echo.Loader._error({
					"args": [data, exception],
					"code": "unable_to_parse_app_config",
					"message": "Unable to parse JSON config"
				});
			}
			if (config) {
				acc[id] = config;
			}
		});
		callback(configs);
	}, "jsonp");
};

Echo.Loader._error = function(data) {
	Echo.Events.publish({
		"topic": "Echo.Loader.onError",
		"data": data
	});
	Echo.Utils.log(Echo.jQuery.extend(data, {"type": "error", "component": "Echo.Loader"}));
};

})();
