(function() {

"use strict";

var metaInfo = {
	"version": "",
	"debug": false
};

Echo.initApplication = function(args) {
	if (!args.url && !args.component) {
		return;
	}
	if (args.url && args.component) {
		Echo.require([args.url], function(component) {
			if (!Echo.require.specified(args.component)) {
				var componentParts = typeof args.component === "string"
					? args.component.split(".")
					: args.component;
				var searchModule = function(obj, keys) {
					if (!obj || !keys) {
						return;
					}
					var currentKey = keys.shift();
					if (keys.length === 0) {
						return obj[currentKey];
					} else {
						return searchModule(obj[currentKey], keys);
					}
				};
				var App = searchModule(window, componentParts);
				new App(args.config);
			} else {
				Echo.require([args.component], function(App) {
					new App(args.config);
				});
			}
		});
	} else {
		Echo.require([args.url ? args.url : args.component], function(App) {
			new App(args.config);
		});
	}
};

Echo.isDebug = function() {
	return metaInfo.debug;
};

(function() {
	if (metaInfo.debug) return;
	var debug;
	var _debugKey = "echo-debug";
	var hashParts = window.location.hash.match(/echo.debug:(true|false)/);
	if (hashParts && hashParts.length) {
		debug = hashParts[1];
	}
	if (typeof debug !== "undefined") {
		if (debug === "true") {
			metaInfo.debug = true;
			window.localStorage[_debugKey] = "true";
		} else {
			metaInfo.debug = false;
			window.localStorage[_debugKey] = "false";
		}
		return;
	}
	metaInfo.debug = (window.localStorage[_debugKey] === "true");
})();

function getURL(url, devVersion) {
	var protocol = /^https?/.test(window.location.protocol)
		? window.location.protocol
		: "http:";
	var cdnBaseURL = protocol + "{%=baseURLs.cdn%}/";
	if (typeof devVersion === "undefined") devVersion = true;
	return /^https?:\/\/|^\/\//.test(url)
		? url
		: cdnBaseURL + "sdk/v" + metaInfo.version +
			(devVersion && Echo.isDebug() ? "/dev" : "") +
			(!url || url.charAt(0) === "/" ? "" : "/") + url;
};

function generatePaths(paths) {
	var res = {};
	for (var i = 0; i < paths.length; i++) {
		for (var j = 0; j < paths[i].modules.length; j++) {
			res[paths[i].modules[j]] = paths[i].path;
		}
	}
	return res;
};

var paths = [{
	"path": getURL("", false),
	"modules": ["echo-assets"]
}, {
	"path": getURL(""),
	"modules": ["echo"]
}, {
	"path": getURL("/backplane"),
	"modules": ["echo/backplane"]
}, {
	"path": getURL("/third-party/jquery.pack"),
	"modules": ["jquery-noconflict"]
}, {
	"path": getURL("/third-party/jquery/jquery.isotope.min"),
	"modules": ["isotope"]
}];

require.config({
	"waitSeconds": 5, // 5 sec before timeout exception
	"paths": generatePaths(paths),
	"map": {
		"*": {
			"css": "echo/third-party/requirejs/css",
			"jquery": "jquery-noconflict"
		},
		"jquery-noconflict": {"jquery": "jquery"},
	},
	"shim": {
		"echo/backplane": {
			"exports": "Backplane"
		},
		"echo/tests/harness/suite": {
			"deps": ["echo/tests/harness"]
		},
		"echo/tests/harness": {
			"init": function() {
				// don't execute tests automatically, we will do it manually later
				QUnit.config.autostart = false;
				// tests will run in the order they were added
				QUnit.config.reorder = false;
				// we need it to make tests start synchronously
				QUnit.config.autorun = false;
			}
		}
	}
});

})();
