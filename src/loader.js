(function() {

if (!window.Echo) window.Echo = {};

if (Echo.Loader) return;

/**
 * @class Echo.Loader
 * Static class which implements common mechanics for canvases loading.
 */
Echo.Loader = {
	"config": {
		"cdnBaseURL": "http://cdn.echoenabled.com/",
		"errorTimeout": 5000 // 5 sec
	},
	"overrides": {}
};

/**
 * @static
 * Function to get absolute URL.
 *
 * @param {String} url
 * JavaScript or CSS stylesheet file URL.
 */
Echo.Loader.getURL = function(url) {
	return /^https?:\/\/|^\/\//.test(url)
		? url
		: Echo.Loader.config.cdnBaseURL + url;
};
/**
 * @static
 * Function to initialize canvases on the page.
 *
 * @param {Object} [config]
 * Object which defines an initialization config parameters
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
	Echo.Loader._initEnvironment(function() {
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
 * @param {Object} params
 * Object with the following properties:
 *
 * @param {Array} params.scripts
 * Array of objects with the properties described below:
 *
 * @param {String} params.scripts.url
 * JavaScript or CSS stylesheet file URL.
 *
 * @param {Function} params.scripts.loaded
 * Function for check whether the script was loaded. This function must return
 * boolean value which indicates whether the resource was already loaded on the
 * page or not. If the resource was already loaded - no download is performed
 * and the callback is called immediately.
 *
 * @param {Function} params.callback
 * Callback function which should be called as soon as all requested files
 * were downloaded.
 */
Echo.Loader.download = function(params) {
	var scripts = params.scripts || [], urls = [];
	var callback = params.callback || function() {};
	for (var i = 0; i < scripts.length; i++) {
		var script = scripts[i];
		if (!script.loaded || !script.loaded()) {
			urls.push(Echo.Loader.getURL(script.url));
		}
	}
	if (!urls.length) {
		callback();
		return false;
	}
	if (params.errorTimeout) {
		yepnope.errorTimeout = params.errorTimeout;
	}
	yepnope({
		"load": urls,
		"complete": callback
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

Echo.Loader._initEnvironment = function(callback) {
	var scripts = [{
		"url": "sdk/backplane.js",
		"loaded": function() { return !!window.Backplane; }
	}, {
		"url": "sdk/third-party/jquery.pack.js",
		"loaded": function() { return !!Echo.jQuery; }
	}, {
		"url": "sdk/environment.pack.js",
		"loaded": function() { return !!Echo.Utils; }
	}];
	Echo.Loader.download({
		"scripts": scripts,
		"callback": callback
	});
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
	var scripts = [];
	Echo.jQuery.each(canvas.config.apps, function(id, app) {
		app.config = app.config || {};
		if (!app.component || !app.script || !app.id) {
			Echo.Loader._error({
				"args": {"app": app},
				"code": "incomplete_app_config",
				"message": "Unable to init an app, config is incomplete"
			});
			return;
		}

		app.config.user = canvas.config.user;
		app.config.target = Echo.Loader._createApplicationTarget(app);
		scripts.push({
			"url": app.script,
			"loaded": function() {
				return Echo.Utils.isComponentDefined(app.component);
			}
		});
	});

	Echo.Loader.download({
		"scripts": scripts,
		"errorTimeout": Echo.Loader.config.errorTimeout,
		"callback": function() {
			Echo.jQuery.each(canvas.config.apps, function(id, app) {
				var application = Echo.Utils.getComponent(app.component);
				if (!application) {
					Echo.Loader._error({
						"args": {"app": app},
						"code": "no_suitable_app_class",
						"message": "Unable to init an app, no suitable class found"
					});
					return;
				}
				var overrides = (Echo.Loader.overrides[canvas.id] || {})[app.id] || {};
				var config = Echo.jQuery.extend(true, app.config, overrides);
				app.ref = new application(config);
				canvas.target.append(app.config.target);
			});
		}
	});
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
		"requests": Echo.Utils.object2JSON(requests)
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
