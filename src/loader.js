(function() {

"use strict";

var metaInfo = {
	"version": "",
	"debug": false
};

Echo.initApplication = function(args) {
	if (!args.url || !args.module)
		return;
	Echo.require([args.url], function(module) {
		Echo.require([args.module], function(App) {
			new App(args.config);
		});
	});
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
	var cdnBaseURL = protocol  +"{%=baseURLs.cdn%}/";
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
	"path": getURL("/environment.pack"),
	"modules": [
		"echo/events",
		"echo/utils",
		"echo/labels",
		"echo/configuration",
		"echo/api",
		"echo/streamserver/api",
		"echo/streamserver/user",
		"echo/view",
		"echo/app",
		"echo/plugin",
		"echo/variables",
		"echo/cookie"
	]
}, {
	"path": getURL("/gui.pack"),
	"modules": [
		"echo/bootstrap-transition",
		"echo/bootstrap-affix",
		"echo/bootstrap-alert",
		"echo/bootstrap-button",
		"echo/bootstrap-modal",
		"echo/bootstrap-carousel",
		"echo/bootstrap-collapse",
		"echo/bootstrap-dropdown",
		"echo/bootstrap-tooltip",
		"echo/bootstrap-popover",
		"echo/bootstrap-scrollspy",
		"echo/bootstrap-tab",
		"echo/bootstrap-typeahead",
		"echo/gui",
		"echo/gui/modal",
		"echo/gui/button",
		"echo/gui/dropdown",
		"echo/gui/tabs"
	]
}, {
	//TODO: Test Pinboard without this defenition
	"path": getURL("streamserver/plugins/pinboard-visualization"),
	"modules": [
		"echo/streamserver/bundled-apps/stream/item/media-gallery/client-widget",
		"echo/streamserver/plugins/pinboard-visualization",
		"echo/streamserver/plugins/stream-item-pinboard-visualization",
		"echo/streamserver/plugins/stream-pinboard-visualization"
	]
}, {
	"path": getURL("/third-party/jquery/jquery.isotope.min"),
	"modules": ["isotope"]
}, {
	"path": getURL("/tests/qunit/qunit"),
	"modules": ["QUnit"]
}];

require.config({
	"waitSeconds": 5, // 5 sec before timeout exception
	"paths": generatePaths(paths),
	"map": {
		"*": {
			"css": "third-party/requirejs/css",
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
		"QUnit": {
			"exports": "QUnit",
			"init": function() {
				// We shouldn`t load tests automatically, we`ll do it manually
				QUnit.config.autoload = false;
				// don't execute tests automatically, we will do it manually later
				QUnit.config.autostart = false;
				// tests will run in the order they were added
				QUnit.config.reorder = false;
				// We have to set autorun = false, because of requirejs. 
				// We need it to make tests start synchronously.
				QUnit.config.autorun = false;
			}
		}
	}
});

})();
