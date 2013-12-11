(function() {

"use strict";

/**
 * @class Echo
 * Static class which implements common initialization mechanics
 */

var metaInfo = {
	"version": "",
	"debug": false
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
 * @param {Object} args
 * Object which defines the base app configuration.
 *
 * @param {String} [args.url]
 * URL to file, which contains the Javascript app module.
 * Single URL is used to initialize application, which is defined in separated file by user.
 * URL can be used with args.component in case of application initialization, then application is
 * defined in file with some other modules (aka modules package).
 *
 * @param {String} [args.component]
 * The name of the JavaScript app module which should be initialized.
 *
 * @param {Object} [args.config]
 * Parameters to be passed into the application constructor during its initialization.
 **/
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
		Echo.require([args.url || args.component], function(App) {
			new App(args.config);
		});
	}
};

/**
 * @static
 * Allows to identify if the debug mode is enabled for Echo environment
 * on the page (i.e whether the logs should be printed in console,
 * non-minified versions of scripts should be used)
 *
 * @return {Boolean}
 */
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
			// this is a css plugin it calls this way: "css!path/to/css/file"
			"css": "echo/third-party/requirejs/css",
			// for * modules we use jquery-noconflict instead of jquery
			"jquery": "jquery-noconflict"
		},
		// for jquery-noconflict module we use real jquery
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
