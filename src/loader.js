(function() {

if (!window.Echo) window.Echo = {};

if (Echo.Loader) return;

/**
 * @class Echo.Loader
 * Static class implements common methods of loading canvas.
 */

Echo.Loader = {
	"config": {
		"cdnBaseURL": "http://cdn.echoenabled.com/",
		"errorTimeout": 5000 // 5 sec
	},
	"overrides": {}
};

// public interface

/**
 * @static
 * @method
 * Function initialize canvases on the page.
 *
 * @param {Mixed} [canvases] Array of jQuery objects or single jQuery
 * if param not specified then there will be initialized by all objects on the page.
*/
Echo.Loader.init = function(canvases) {
	Echo.Loader._initEnvironment(function() {
		if (canvases && !Echo.jQuery.isArray(canvases)) {
			canvases = [canvases];
		}
		// if no canvases defined during initialization,
		// we look for all canvases in the document
		canvases = canvases || Echo.jQuery(".echo-canvas");
		Echo.Loader._initCanvases(canvases);
	});
};

/**
 * @static
 * @method
 * Function asynchronous loading javascript or stylesheet files.
 *
 * @param {Object} params Object with properties:
 * @param {Array} params.scripts Array of objects with properties:
 * @param {String} params.scripts.url URL of javascript or stylesheet file.
 * @param {Function} params.scripts.loaded Function for check if script was loaded.
 * @param {Function} params.callback Callback function is called after all files have been downloaded.
 */
Echo.Loader.download = function(params) {
	var scripts = params.scripts, urls = [];
	var callback = params.callback || function() {};
	if (params.scripts && params.scripts.length) {
		for (var i = 0; i < scripts.length; i++) {
			var script = scripts[i];
			if (!script.loaded || !script.loaded()) {
				urls.push(script.url);
			}
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
 * @method
 * Function overriding parameters of config.
 *
 * @param {String} canvasID String with id of canvas on the page.
 * @param {String} appID String with application id to override config.
 * @param {Object} config Configuration of application.
 */
Echo.Loader.override = function(canvasID, appID, config) {
	var overrides = Echo.Loader.overrides;
	overrides[canvasID] = overrides[canvasID] || {};
	overrides[canvasID][appID] = config;
};

// internal functions

Echo.Loader._initEnvironment = function(callback) {
	var scripts = [{
		"url": Echo.Loader.config.cdnBaseURL + "sdk/backplane.js",
		"loaded": function() { return !!window.Backplane; }
	}, {
		"url": Echo.Loader.config.cdnBaseURL + "sdk/third-party/jquery.pack.js",
		"loaded": function() { return !!Echo.jQuery; }
	}, {
		"url": Echo.Loader.config.cdnBaseURL + "sdk/environment.pack.js",
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
		var id = target.attr("data-canvas-id");
		var appkey = target.attr("data-appkey");

		if (!id || !appkey) {
			Echo.Loader._log({
				"type": "error",
				"message": "Canvas with invalid configuration found",
				"args": {"target": target}
			});
			return;
		}

		collection.push({"id": id, "appkey": appkey, "target": target});
	});

	if (!collection.length) {
		Echo.Loader._log({
			"type": "warning",
			"description": "No canvases found on the page..."
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
		Echo.Loader._log({
			"type": "warning",
			"message": "Canvas with no applications",
			"args": {"canvas": canvas}
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
			Echo.Loader._log({
				"type": "error",
				"message": "Unable to init an app, config is incomplete",
				"args": {"app": app}
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
					Echo.Loader._log({
						"type": "error",
						"message": "Unable to init an app, no suitable class found",
						"args": {"app": app}
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
			Echo.Loader._log({
				"type": "error",
				"message": "Unable to retrieve Canvas configs from AppServer",
				"args": response
			});
			return;
		}
		var configs = Echo.Utils.foldl({}, response, function(data, acc, id) {
			if (!data || data.result === "error") {
				Echo.Loader._log({
					"type": "error",
					"message": "Unable to retrieve Canvas config from AppServer",
					"args": data
				});
				return;
			}
			var config;
			try {
				config = Echo.jQuery.parseJSON(data.value);
			} catch(exception) {
				Echo.Loader._log({
					"type": "error",
					"message": "Unable to parse JSON config",
					"args": [data, exception]
				});
			}
			if (config) {
				acc[id] = config;
			}
		});
		callback(configs);
	}, "jsonp");
};

Echo.Loader._log = function(data) {
	Echo.Utils.log(Echo.jQuery.extend(data, {"component": "Echo.Loader"}));
};

})();
