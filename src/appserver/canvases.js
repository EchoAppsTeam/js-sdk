Echo.define([
	// FIXME: __DEPRECATED__
	// remove this after full require js compatible implementation
	"loadFrom![echo/apps.sdk]echo/utils"
], function(Utils) {

"use strict";

var canvasList = [];
var appOverrides = {};
var errorMessages = {
	"no_apps": "No applications are defined for this canvas",
	"no_config": "Unable to retrieve Canvas config",
	"canvas_already_initialized": "Canvas has been initialized already",
	"invalid_canvas_config": "Canvas with invalid configuration found",
	"incomplete_app_config": "Unable to init an app (config is incomplete)",
	"app_init_failed": "Unable to init an app (JS error)"
};
var protocol = (/^https?/.test(window.location.protocol) ? window.location.protocol : "http:").replace(":", "");

// we always request canvases requiring "canvases/some-id" modules,
// but "canvases" prefix must resolve in several URLs depending
// whether it's debug or production mode and http/https scheme.
// So we create 4 require contexts for module name mapping.
var requireContexts = {};
(function() {
	var protocols = ["http", "https"];
	for (var i = 0; i < protocols.length; i++) {
		var p = protocols[i];
		requireContexts[p + "-dev"] = Echo.require.config({
			"context": p + "-dev",
			"paths": {
				"canvases": p + ":{%=baseURLs.canvases.dev%}"
			}
		});
		requireContexts[p + "-prod"] = Echo.require.config({
			"context": p + "-prod",
			"paths": {
				"canvases": p + ":{%=baseURLs.canvases.prod%}"
			}
		});
	}
})();

/**
 * @class Echo.AppServer.Canvases
 * Class implementing Canvases mechanics on the client side.
 *
 * @package appserver.sdk.js
 * @module
 */
var Canvases = {};

/**
 * @static
 * Function to initialize canvases on the page.
 *
 * @param {Object} [config]
 *
 * @param {Mixed} [config.canvases]
 * Single DOM element or array of DOM elements which represent canvas targets.
 * If value is not provided, this method will look for the canvases
 * in the DOM structure.
 *
 * @param {Object} [config.target=document]
 * Target element where to look for the canvases if no canvases were
 * passed in the "config.canvases" field.
 *
 * @param {Function} [config.onCanvasReady]
 * Callback which is executed for each canvas once its target element
 * is initialized and all applications started their initization as well.
 *
 * __Note__ that this callback doesn't guarantee that every application
 * is initialized at the moment of its execution. Applications need to
 * provide some way to register a "onReady" callback themselves.
 *
 * @param {Object} config.onCanvasReady.params
 * Object which is passed to the callback.
 *
 * @param {String} config.onCanvasReady.params.ids
 *
 * @param {String} config.onCanvasReady.params.ids.unique
 * Full unique canvas id. It's used to distinguish the same canvas
 * instances on the page.
 *
 * @param {Object} config.onCanvasReady.params.ids.main
 * Canvas id without unique part. It's used to get canvas data from
 * the Canvas Storage.
 *
 * @param {HTMLElement} config.onCanvasReady.params.target
 * DOM element where canvas will be displayed.
 * 
 * @param {Array} config.onCanvasReady.params.apps
 * Array with references to application instances inside this Canvas.
 *
 * @param {String} config.onCanvasReady.params.dataURL
 * URL to the canvas data in the storage. It's exposed mostly for
 * testing purposes.
 *
 * @param {Function} [config.onCanvasError]
 * Callback which is executed for each failed canvas.
 *
 * @param {Object} config.onCanvasError.data
 * Object which is passed to the callback.
 *
 * @param {String} config.onCanvasError.data.code
 * Error code, one of the following values:
 *
 * + canvas_already_initialized
 * + invalid_canvas_config
 * + no_apps
 * + no_config
 *
 * @param {String} config.onCanvasError.data.message
 * Human-readable string related to the error code.
 *
 * @param {String} config.onCanvasError.data.extra
 * Object of arbitrary structure with additional information about error
 * (possibly canvas target, config, etc).
 *
 * @param {Function} [config.onCanvasComplete]
 * Callback which is executed once all the canvases are ready.
 *
 * @param {Object} config.onCanvasComplete.stats
 * Object which is returned from the callback.
 *
 * @param {Number} config.onCanvasComplete.stats.total
 * Total number of canvases found on the page.
 *
 * @param {Number} config.onCanvasComplete.stats.failed
 * Number of canvases failed to initialize.
 */
Canvases.init = function(config) {
	config = config || {};
	var count = 0, failed = 0;
	var canvases = lookupCanvases(config);
	var maybeComplete = function() {
		if (++count === canvases.length) {
			config.onComplete && config.onComplete({
				"total": canvases.length,
				"failed": failed
			});
		}
	};
	var ready = function(data) {
		config.onCanvasReady && config.onCanvasReady(data);
		maybeComplete();
	};
	var error = function(data) {
		failed++;
		config.onCanvasError && config.onCanvasError(data);
		maybeComplete();
	};
	for (var i = 0; i < canvases.length; i++) {
		initCanvas(canvases[i].getAttribute("data-canvas-init"), {
			"target": canvases[i],
			"ready": ready,
			"error": error
		});
	}
};

/**
 * @static
 * Function which provides an ability to override config parameters of the
 * specific application within the canvas.
 *
 * @param {String} canvasId
 * Canvas id that may consist of two parts separated by "#":
 * the main mandatory canvas identifier (located before the "#" char)
 * and the optional unique identifier of the canvas on a page
 * (located after the "#" char). The unique page identifier (after the "#")
 * is used in case you have multiple canvases with the same primary id on a page.
 * In this case in order to have an ability to perform local overrides
 * using the this function, you specify the unique id after the "#" char
 * and use the full identifier to perform the override.
 * Here is an example of the canvas id without the unique part:
 *
 *     <div class="echo-canvas" data-canvas-id="echo/some-canvas"></div>
 *
 * If you'd like to put multiple instances of the same canvas on a page
 * and you want to have an ability to perform local overrides using this
 * method, the canvas id should include the unique part, for example:
 *
 *     <div class="echo-canvas" data-canvas-id="echo/some-canvas#left-side"></div>
 *     <div class="echo-canvas" data-canvas-id="echo/some-canvas#right-side"></div>
 *
 * Where the "#left-side" and "#right-side" are the unique parts for
 * the canvases within this page. Now you can override the app settings using
 * inside the canvas with the following instructions:
 *
 *     Echo.AppServer.Canvases.override("echo/some-canvas#left-side", "AppInstanceId", { ... });
 *     Echo.AppServer.Canvases.override("echo/some-canvas#right-side", "AppInstanceId", { ... });
 *
 * @param {String} appId
 * Application id inside the canvas.
 *
 * @param {Object} config
 * Object with the application specific config overrides.
 */
Canvases.override = function(canvasId, appId, config) {
	appOverrides[canvasId] = appOverrides[canvasId] || {};
	appOverrides[canvasId][appId] = config;
};

/**
 * @static
 * Destroys canvas and all applications inside it.
 *
 * @param {String} [id]
 * Canvas unique id. If not provided then all the canvases on the page
 * will be destroyed.
 *
 * Basically, to destroy an application this function tries to execute
 * *destroy* method for application instance if it exists.
 */
Canvases.destroy = function(id) {
	if (typeof id !== "undefined") {
		destroyCanvas(id);
		return;
	}
	while (canvasList.length) {
		destroyCanvas(canvasList[0], 0);
	}
};

// private interfaces

var Canvas = function(config) {
	var self = this;
	this.target = normalizeTarget(config.target);
	this.data = config.data;
	this.callbacks = {
		"ready": config.ready,
		"error": config.error
	};
	var id = this.attr("id") || config.id;

	if (this.attr("initialized") === "true") {
		this.error({
			"code": "canvas_already_initialized",
			"extra": {"target": this.target}
		});
		return;
	}

	if (!id) {
		this.error({
			"code": "invalid_canvas_config",
			"extra": {"target": this.target}
		});
		return;
	}

	this.attr("initialized", true);
	this.cssPrefix = "echo-canvas-";
	this.apps = [];
	this.makeIdsAndClasses(id);
	this.switchCSS("on");

	var useSecureAPI = Boolean(this.attr("useSecureAPI")) || config.useSecureAPI;
	var mode = Echo.isDebug() && "dev" || this.attr("mode") || "prod";
	var context = (useSecureAPI ? "https" : protocol || "http") + "-" + mode;
	this.url = requireContexts[context].toUrl("canvases/" + this.ids.main);

	this.fetchConfig(function() {
		var apps = self.data.apps;
		var count = 0;
		var done = function(app) {
			app && self.apps.push(app);
			if (++count === apps.length) {
				self.callbacks.ready({
					"ids": self.ids,
					"target": self.target,
					"apps": self.apps,
					"dataURL": self.url
				});
			}
		};
		for (var i = 0; i < apps.length; i++) {
			initApplication(self.prepareApp(apps[i]), done);
		}
	});
};

Canvas.prototype.fetchConfig = function(callback) {
	var self = this;
	Echo.require([this.url], function(config) {
		if (!config || !config.apps || !config.apps.length) {
			self.error({
				"code": config ? "no_apps" : "no_config",
				"extra": {"config": config, "target": self.target}
			});
			return;
		}
		self.data = extend({}, config);
		callback();
	}, function() {
		// won't work in IE 8- :( Let's ignore it
		self.error({
			"code": "no_config",
			"extra": {"target": self.target}
		});
	});
};

Canvas.prototype.prepareApp = function(app) {
	var addDivTo = function(target, className, html) {
		var div = document.createElement("div");
		div.className = className;
		if (html) div.innerHTML = html;
		target.appendChild(div);
		return div;
	};

	app.config = app.config || {};
	app.config.canvasId = this.ids.unique;
	app.config.backplane = this.data.backplane;
	app.url = getAppScriptURL(app);
	delete app.scripts;

	var container = addDivTo(this.target, this.cssPrefix + "appContainer");
	if (app.caption) {
		addDivTo(container, this.cssPrefix + "appHeader", app.caption);
	}
	app.config.target = addDivTo(container, this.cssPrefix + "appBody " + this.cssPrefix + "appId-" + app.id);

	var overrides = (appOverrides[this.ids.unique] || {})[app.id];
	if (overrides) {
		app.config = extend(app.config, overrides);
	}
	return app;
};

Canvas.prototype.attr = function(name, value) {
	if (typeof value !== "undefined") {
		this.target.setAttribute("data-canvas-" + name, value);
		return true;
	}
	return this.target.getAttribute("data-canvas-" + name);
};

Canvas.prototype.makeIdsAndClasses = function(id) {
	var parts = id.split("#");
	var normalize = function(s) {
		return s.replace(/[^a-z\d]/ig, "-");
	};
	var normalizedId = normalize(id);
	var noUnique = parts.length === 1;
	this.ids = {
		"unique": id,
		"main": noUnique ? id : parts[0]
	};
	this.cssClasses = {
		"unique": this.cssPrefix + normalizedId,
		"main": this.cssPrefix + (noUnique ? normalizedId : normalize(parts[0]))
	};
};

Canvas.prototype.switchCSS = function(action) {
	var cls = this.target.className;
	var main = " " + this.cssClasses.main;
	var unique = " " + this.cssClasses.unique;
	if (action === "on" && cls.indexOf(this.cssClasses.main) < 0) {
		cls += main;
		if (this.ids.unique !== this.ids.main) {
			cls += unique;
		}
	} else if (action === "off") {
		cls = cls.replace(main + unique, "");
	}
	this.target.className = cls;
};

Canvas.prototype.destroy = function() {
	this.attr("initialized", false);
	var apps = this.apps;
	if (!apps || !apps.length) return;
	for (var i = 0; i < apps.length; i++) {
		if (apps[i] && typeof apps[i].destroy === "function") {
			apps[i].destroy();
		}
	}
	this.switchCSS("off");
	Echo.require.undef(this.url);
};

Canvas.prototype.error = function(args) {
	this.callbacks.error(logError(args));
};

function initApplication(params, callback) {
	var url = params.url;
	var component = params.component;
	var init = function(App) {
		if (!App) {
			logError({
				"code": "incomplete_app_config",
				"extra": {"config": params.config}
			});
			callback();
			return;
		}
		var app;
		try {
			app = new App(params.config);
		} catch(e) {
			logError({
				"code": "app_init_failed",
				"extra": {
					"config": params.config,
					"error": e
				}
			});
		}
		callback(app);
	};

	// Note that _every_ call of Echo.require takes "init" function as third
	// parameter (so called errback). It's done to transform script loading
	// errors into "incomplete_app_config" log messages.
	if (!url && !component) {
		init();
	} else if (url && component) {
		Echo.require([url], function() {
			if (Echo.require.specified(component)) {
				Echo.require([component], init, init);
				return;
			}
			init(getComponent(window, component.split(".")));
		}, init);
	} else if (component && Echo.require.specified(component)) {
		Echo.require([component], init, init);
	} else if (url) {
		Echo.require([url], init, init);
	} else {
		init();
	}
}

function getComponent(obj, keys) {
	if (!obj || !keys) {
		return;
	}
	var key = keys.shift();
	if (!keys.length) {
		return obj[key];
	} else {
		return getComponent(obj[key], keys);
	}
}

function getAppScriptURL(config) {
	if (!config.scripts) return config.script;

	var script = {
		"dev": config.scripts.dev || config.scripts.prod,
		"prod": config.scripts.prod || config.scripts.dev
	}[Echo.isDebug() ? "dev" : "prod"];
	if (typeof script === "string") return script;

	return script[protocol === "https" ? "secure" : "regular"];
}

function lookupCanvases(config) {
	var target = normalizeTarget(config.target) || document;
	var canvases = config.canvases;
	if (canvases && !canvases.length) {
		canvases = [canvases];
	}
	if (canvases) {
		return canvases;
	} else if (target.querySelectorAll) {
		return target.querySelectorAll(".echo-canvas");
	}
	// all modern browsers won't go here anyway
	logError({"message": "browser is not supported"});
	return [];
}

function normalizeTarget(target) {
	return target && target.length && target[0] || target;
}

function initCanvas(initMode, config) {
	// this function might be called either immediately (without arguments)
	// or after "scroll"/"resize" events (with "event" argument);
	// function workflow varies depending on the given argument
	(function init(event) {
		if (initMode !== "when-visible" || isInViewport(config.target)) {
			event && onViewportChange("unsubscribe", init);
			canvasList.push(new Canvas(config));
		} else if (!event) {
			onViewportChange("subscribe", init);
		}
	})();
}

function destroyCanvas(id, index) {
	if (typeof index === "undefined") {
		for (var i = 0; i < canvasList.length; i++) {
			if (canvasList[i].ids.unique === id) {
				index = i;
				break;
			}
		}
	}
	canvasList.splice(index, 1)[0].destroy();
}

function logError(args) {
	args.message = args.message || errorMessages[args.code];
	window.console && console.log(
		"[Canvases] error: " + args.message,
		"| extra:", args.extra ? args.extra : "none"
	);
	return args;
}

function isInViewport(canvas) {
	var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	return scrollTop + viewportHeight >= canvas.offsetTop;
}

function getEventName(name) {
	return window.addEventListener ? name : "on" + name;
}

function onViewportChange(action, handler) {
	var addEvent = window.addEventListener || window.attachEvent;
	var removeEvent = window.removeEventListener || window.detachEvent;
	if (action === "subscribe") {
		addEvent(getEventName("scroll"), handler);
		addEvent(getEventName("resize"), handler);
	} else if (action === "unsubscribe") {
		removeEvent(getEventName("scroll"), handler);
		removeEvent(getEventName("resize"), handler);
	}
}

var isArray = Array.isArray || function(obj) {
	return obj instanceof Array;
};

var isPlainObject = function(obj) {
	return obj && typeof obj === "object" && !isArray(obj) && !obj.nodeType && !obj.jquery;
};

// specially crafted version (always deep cloning) of jQuery's v2.1.0-pre "extend"
function extend(target, options) {
	var name, src, copy, copyIsArray, clone;
	for (name in options) {
		if (options.hasOwnProperty(name)) {
			src = target[name];
			copy = options[name];

			// Prevent never-ending loop
			if (target === copy) {
				continue;
			}

			copyIsArray = copy && isArray(copy);
			// Recurse if we are merging plain objects or arrays
			if (copy && isPlainObject(copy) || copyIsArray) {
				if (copyIsArray) {
					copyIsArray = false;
					clone = src && isArray(src) ? src : [];
				} else {
					clone = src && isPlainObject(src) ? src : {};
				}
				// Never move original objects, clone them
				target[name] = extend(clone, copy);

			// Don't bring in undefined values
			} else if (typeof copy !== "undefined") {
				target[name] = copy;
			}
		}
	}
	// Return the modified object
	return target;
}

// FIXME: __DEPRECATED__
// remove this after full require js compatible implementation
Utils.set(window, "Echo.AppServer.Canvases", Canvases);

return Canvases;

});
