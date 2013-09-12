(function() {
"use strict";

if (!window.Echo) window.Echo = {};

if (Echo.Loader) return;

var protocol = /^https?/.test(window.location.protocol) ? window.location.protocol : "http:";

/**
 * @class Echo.Loader
 * Static class which implements common mechanics for resources loading,
 * Echo environment establishing and Canvases initialization mechanics.
 *
 * @package loader.js
 */
Echo.Loader = {
	/** @private @readonly */
	"version": "",
	/** @ignore */
	"debug": false,
	/** @private */
	"config": {
		"cdnBaseURL": protocol + "{%=baseURLs.cdn%}/",
		"storageURL": {
			"prod": protocol + "{%=baseURLs.canvases.prod%}/",
			"dev": protocol + "{%=baseURLs.canvases.dev%}/"
		},
		"errorTimeout": 5000 // 5 sec
	},
	/** @ignore */
	"canvases": [],  // Canvases list initialized on the page
	/** @ignore */
	"overrides": {},  // Canvas Apps overrides object
	/** @ignore */
	"vars": {
		"state": {"resources": {}, "queue": []},
		"processing": false,
		"syncQueue": []
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

	if (!resources || !resources.length) {
		callback();
		return;
	}

	var state = Echo.Loader.vars.state;
	var syncQueue = Echo.Loader.vars.syncQueue;
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

	// Important note: we should *not* execute another
	// Echo.yepnope until last one is completed.
	// See more information about the issue on Github:
	// https://github.com/SlexAxton/yepnope.js/issues/113
	var checkSyncQueue = function() {
		if (!Echo.Loader.vars.processing && syncQueue.length) {
			Echo.Loader.vars.processing = true;
			Echo.yepnope(syncQueue.shift());
		}
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
	syncQueue.push({
		"load": Echo.Loader._map(urls, function(url) { return prefix + url; }),
		"complete": function() {
			// mark all loaded scripts as "ready"
			Echo.Loader._map(urls, function(url) {
				state.resources[url] = "ready";
			});
			invokeCallbacks();
			Echo.Loader.vars.processing = false;
			checkSyncQueue();
		}
	});
	checkSyncQueue();
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

/**
 * @static
 * Function which provides an ability to override config parameters of the
 * specific application within the canvas.
 *
 * @param {String} canvasID
 * Canvas ID. Canvas ID may consist of two parts separated by "#":
 * the main mandatory Canvas identifier (located before the "#" char)
 * and the optional unique identifier of the Canvas on a page
 * (located after the "#" char). The unique page identifier (after the "#")
 * is used in case you have multiple Canavses with the same primary ID on a page.
 * In this case in order to have an ability to perform local overrides
 * using the Echo.Loader.override function, you specify the unique id
 * after the "#" char and use the full ID to perform the override.
 * Here is an example of the Canvas ID without the unique part:
 *
 *     <div class="echo-canvas"
 *         data-canvas-id="jskit/comments-sample"></div>
 *
 * If you'd like to put multiple instances of the same Canvas on a page
 * and you want to have an ability to perform local overrides using the
 * Echo.Loader.override function, the Canvas ID should contain the unique part,
 * for example:
 *
 *     <div class="echo-canvas"
 *         data-canvas-id="jskit/comments-sample#left-side"></div>
 *     <div class="echo-canvas"
 *         data-canvas-id="jskit/comments-sample#right-side"></div>
 *
 * Where the "#left-side" and "#right-side" are the unique parts for
 * the Canvases within this page. Now you can override the Canvas app
 * settings using the following constructions:
 *
 *     Echo.Loader.override("jskit/comments-sample#left-side",
 *         "AppInstanceID", { ... });
 *     Echo.Loader.override("jskit/comments-sample#right-side",
 *         "AppInstanceID", { ... });
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
	Echo.Loader._lookupCanvases(config, function(canvases) {
		Echo.Loader._map(canvases, function(canvas) {
			var isActive = canvas.getAttribute("data-canvas-init") !== "when-visible"
				|| Echo.Loader._isInViewport(canvas);

			if (!isActive) {
				onViewportChange("subscribe", function init() {
					if (Echo.Loader._isInViewport(canvas)) {
						Echo.Loader._initCanvas(canvas);
						onViewportChange("unsubscribe", init);
					}
				});
			} else {
				Echo.Loader._initCanvas(canvas);
			}
		});
	});
};

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
 * @param {String|Object} [app.scripts.prod]
 * Location of the production (minified) version of the app
 * JavaScript class code. The value might be just a String or an Object with the "regular"
 * and "secure" key. If the value has the String type - the value is returned as is.
 * If the value is represented using the Object type - the SDK engine
 * uses either the "regular" key value in case the page was requested using the HTTP
 * protocol or the "secure" key value if the page was served via HTTPS protocol.
 *
 * @param {String|Object} [app.scripts.dev]
 * Location of the development (non-minified) version of the app JavaScript class code.
 * The value might be just a String or an Object with the "regular"
 * and "secure" key. If the value has the String type - the value is returned as is.
 * If the value is represented using the Object type - the SDK engine
 * uses either the "regular" key value in case the page was requested using the HTTP
 * protocol or the "secure" key value if the page was served via HTTPS protocol.
 *
 * @param {Object} [app.backplane]
 * Object which contains the data to be passed into the Backplane.init call.
 *
 * @param {Object} [app.config]
 * Parameters to be passed into the application constructor during its initialization.
 */
Echo.Loader.initApplication = function(app) {
	Echo.Loader.initEnvironment(function() {
		var instance = new Echo.Canvas({
			"target": app.config.target,
			"useSecureAPI": !!app.config.useSecureAPI,
			"data": { // as we receive if from the Canvas Storage
				"apps": [app],
				"backplane": app.backplane
			}
		});
		Echo.Loader.canvases.push(instance);
	});
};

Echo.Loader._lookupCanvases = function(config, callback) {
	config = config || {};

	var canvases = config.canvases;
	var target = config.target
		? (config.target.length ? config.target[0] : config.target)
		: document;

	// convert a single canvas to the 1-element array
	// to keep the same contract below in the code
	if (canvases && !canvases.length) {
		canvases = [canvases];
	}

	// if no canvases defined during initialization,
	// we look for all canvases in the target ('document' by default)
	if (canvases) {
		callback(canvases);
	} else if (target.querySelectorAll) {
		callback(target.querySelectorAll(".echo-canvas"));
	} else {
		// Fallback uses Echo.jQuery if IE < 8
		Echo.Loader.initEnvironment(function() {
			callback(Echo.jQuery(".echo-canvas", target));
		});
	}
};

Echo.Loader._initCanvas = function(canvas) {
	Echo.Loader.initEnvironment(function() {
		var instance = new Echo.Canvas({
			"target": canvas,
			"overrides": Echo.Loader.overrides[canvas.getAttribute("data-canvas-id")] || {}
		});
		Echo.Loader.canvases.push(instance);
	});
};

Echo.Loader._isInViewport = function(canvas) {
	var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	return scrollTop + viewportHeight >= canvas.offsetTop;
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
	var resourceReadyFlags = Echo.Loader._map(resources, function(resource) {
		var url = Echo.Loader.getURL(resource.url);
		// the 'true' flag will be added into the
		// result array only when resource is ready
		return (resource.loaded && resource.loaded()) ||
			(state.resources[url] && state.resources[url] === "ready");
	});
	return resources.length === resourceReadyFlags.length;
};

function getEventName(name) {
	return window.addEventListener ? name : "on" + name;
}

function onViewportChange(action, handler) {
	var addEvent = window.addEventListener || window.attachEvent;
	var removeEvent = window.removeEventListener || window.detachEvent;
	if (action === "subscribe") {
		addEvent(getEventName("scroll"), handler);
		addEvent(getEventName("resize"), handler)
	} else if (action === "unsubscribe") {
		removeEvent(getEventName("scroll"), handler);
		removeEvent(getEventName("resize"), handler);
	}
};

})();
