Echo.define(function() {

"use strict";

var canvasList = [];
var appOverrides = {};
var errorMessages = {
	"no_apps": "No applications defined for this canvas",
	"no_config": "Unable to retrieve Canvas config",
	"incomplete_app_config": "Unable to init an app (config is incomplete)",
	"missing_app": "Unable to init an app (component not found)",
	"app_init_failed": "Unable to init an app (JS error)",
	"canvas_already_initialized": "Canvas has been initialized already",
	"invalid_canvas_config": "Canvas with invalid configuration found"
};
var protocol = (/^https?/.test(window.location.protocol) ? window.location.protocol : "http:").replace(":", "");

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

var Canvases = {};

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

Canvases.override = function(canvasId, appId, config) {
	appOverrides[canvasId] = appOverrides[canvasId] || {};
	appOverrides[canvasId][appId] = config;
};

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
	var id = this.attr("id") || config.id;

	if (this.attr("initialized") === "true") {
		this.error({
			"code": "canvas_already_initialized",
			"extra": {"target": this.target}
		});
		return;
	}

	this.attr("initialized", true);

	if (!id) {
		this.error({
			"code": "invalid_canvas_config",
			"extra": {"target": this.target}
		});
		return;
	}

	this.useSecureAPI = Boolean(this.attr("useSecureAPI")) || config.useSecureAPI;
	this.mode = 0 && Echo.isDebug() && "dev" || this.attr("mode") || "prod";
	this.cssPrefix = "echo-canvas-";
	this.callbacks = {
		"ready": config.ready,
		"error": config.error
	};

	this.makeIdsAndClasses(id);
	this.switchCSS("on");
	this.fetchConfig(function() {
		var apps = self.data.apps;
		var count = 0;
		self.apps = [];
		var done = function(app) {
			app && self.apps.push(app);
			if (++count === apps.length) {
				self.callbacks.ready({
					"ids": self.ids,
					"target": self.target,
					"apps": self.apps,
					"data": self.data,
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
	var context = (this.useSecureAPI ? "https" : protocol || "http") + "-" + this.mode;
	this.url = requireContexts[context].toUrl("canvases/" + this.ids.main);
	Echo.require([this.url], function(config) {
		if (!config || !config.apps || !config.apps.length) {
			self.error({
				"code": config ? "no_apps" : "no_config",
				"extra": {"config": config, "target": self.target}
			});
			return;
		}
		self.data = config;
		callback();
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
	app.script = getAppScriptURL(app);
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
	var apps = this.apps;
	for (var i = 0; i < apps.length; i++) {
		if (apps[i] && typeof apps[i].destroy === "function") {
			apps[i].destroy();
		}
	}
	this.attr("initialized", false);
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
				"args": {"config": params.config}
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
				"args": {
					"config": params.config,
					"error": e
				}
			});
		}
		callback(app);
	};

	if (!url && !component) {
		init();
	} else if (url && component) {
		Echo.require([url], function() {
			if (Echo.require.specified(component)) {
				Echo.require([component], init);
				return;
			}
			init(getComponent(window, component.split(".")));
		});
		return;
	} else {
		Echo.require([component || url], init);
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
	return typeof obj === "object" && !isArray(obj) && !obj.nodeType && !obj.jquery;
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

return Canvases;

});
