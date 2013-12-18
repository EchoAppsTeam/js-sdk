(function() {

"use strict";

/**
 * @class Echo
 * Global namespace for all Echo functionality
 */
var metaInfo = {
	"version": "",
	"debug": false
};

/**
 * @static
 * Allows to identify if debug mode is enabled for Echo environment on the page
 * (i.e whether the logs should be printed in console, non-minified versions
 * of scripts should be used). More information can be found
 * [here](#!/guide/terminology-section-minified-scripts-and-debugging).
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
			// this is a plugin to load single module from pack.
			// It can be used this way: loadFrom![url/to/pack]single/module/name
			"loadFrom": "echo/third-party/requirejs/loadFrom",
			// for * modules we use jquery-noconflict instead of jquery
			"jquery": "jquery-noconflict"
		},
		// for jquery-noconflict module we use real jquery
		"jquery-noconflict": {"jquery": "jquery"},
	},
	"shim": {
		"echo/backplane": {
			"exports": "Backplane"
		}
	}
});

})();
