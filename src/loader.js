(function() {	
"use strict";

Echo.Loader = {
    "version": "",
    "debug": false,
	"cdnBaseURL": (/^https?/.test(window.location.protocol) ? window.location.protocol : "http:") +	"{%=baseURLs.cdn%}/",
}

Echo.Loader.getURL = function(url, devVersion) {
	if (typeof devVersion === "undefined") devVersion = true;
	return /^https?:\/\/|^\/\//.test(url)
		? url
		: this.cdnBaseURL + "sdk/v" + this.version +
			(devVersion && this.isDebug() ? "/dev" : "") +
			(!url || url.charAt(0) === "/" ? "" : "/") + url;
};

Echo.Loader.generatePaths = function(paths) {
	var res = {};
	for(var item in paths) {
		for(var i = 0; i < paths[item].length; i++) {
			res[paths[item][i]] = item; 
		}
	}
	return res;
}

Echo.Loader.isDebug = function() {
		return Echo.Loader.debug;
};

Echo.Loader.initApplication = function(path, config) {
	Echo.require([path], function(App) {
		new App(config);
	});
};

(function() {
	if (Echo.Loader.debug) return;
	var debug;
	var _debugKey = "echo-debug";
	var hashParts = window.location.hash.match(/echo.debug:(true|false)/);
		if (hashParts && hashParts.length) {
			debug = hashParts[1];
    	}
		if (typeof debug !== "undefined") {
			if (debug === "true") {
				Echo.Loader.debug = true;
				localStorage[_debugKey] = true;
			} else {
				Echo.Loader.debug = false;
				localStorage[_debugKey] = "false";
			}
			return;
		}
		Echo.Loader.debug = !!localStorage[_debugKey];
})();

var paths = {};
paths[Echo.Loader.getURL("", false)] = [];
paths[Echo.Loader.getURL("")] = [];
paths[Echo.Loader.getURL("", false)].push("echo-assets");
paths[Echo.Loader.getURL("")].push("echo");
paths[Echo.Loader.getURL("", false)]
paths[Echo.Loader.getURL("/backplane")] = ["echo/backplane"];
paths[Echo.Loader.getURL("/third-party/jquery.pack")] = ["jquery-noconflict"];
paths[Echo.Loader.getURL("/third-party/jquery/jquery.isotope.min")] = ["isotope"]; 
paths[Echo.Loader.getURL("/tests/qunit/qunit")] = ["QUnit"];//TODO: replace to harness 
paths[Echo.Loader.getURL("") + "/environment.pack"] = [
	"echo/events", "echo/utils",
	"echo/labels", "echo/configuration",
	"echo/api", "echo/streamserver/api",
	"echo/streamserver/user", "echo/view",
	"echo/app", "echo/plugin",
	"echo/variables", "echo/cookie"
];
paths[Echo.Loader.getURL("") + "/gui.pack"] = [
	"echo/bootstrap-transition", "echo/bootstrap-affix",
	"echo/bootstrap-alert", "echo/bootstrap-button",
	"echo/bootstrap-modal", "echo/bootstrap-carousel",
	"echo/bootstrap-collapse", "echo/bootstrap-dropdown",
	"echo/bootstrap-tooltip", "echo/bootstrap-popover",
	"echo/bootstrap-scrollspy", "echo/bootstrap-tab",
	"echo/bootstrap-typeahead", "echo/gui",
	"echo/gui/modal", "echo/gui/button",
	"echo/gui/dropdown", "echo/gui/tabs"
];
paths[Echo.Loader.getURL("") + "/streamserver.pack"] = [
	"echo/app-client-widget", "echo/streamserver/bundled-apps/counter/client-widget",
	"echo/streamserver/bundled-apps/stream/client-widget", "echo/streamserver/bundled-apps/facepile/client-widget",
	"echo/streamserver/bundled-apps/facepile/item/client-widget", "echo/streamserver/bundled-apps/submit/client-widget",
	"echo/streamserver/bundled-apps/auth/client-widget", "echo/streamserver/plugins/edit",
	"echo/streamserver/plugins/community-flag", "echo/streamserver/plugins/form-auth",
	"echo/streamserver/plugins/infinite-scroll", "echo/streamserver/plugins/item-accumulator-display",
	"echo/streamserver/plugins/janrain-connector", "echo/streamserver/plugins/janrain-sharing",
	"echo/streamserver/plugins/like", "echo/streamserver/plugins/metadata-manager",
	"echo/streamserver/plugins/moderation", "echo/streamserver/plugins/reply","echo/streamserver/plugins/text-counter",
	"echo/streamserver/plugins/tweet-display", "echo/streamserver/bundled-apps/stream/item/client-widget",
	"echo/streamserver/plugins/janrain-auth"
];

paths[Echo.Loader.getURL("streamserver/plugins/pinboard-visualization")] = [
	"echo/streamserver/plugins/pinboard-visualization", "echo/streamserver/bundled-apps/stream/item/media-gallery/client-widget",
	"echo/streamserver/plugins/stream-item-pinboard-visualization", "echo/streamserver/plugins/stream-pinboard-visualization"
];
require.config({
	"waitSeconds": 5, // 5 sec before timeout exception
	"paths": Echo.Loader.generatePaths(paths),
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
		'QUnit': {
			exports: 'QUnit',
			init: function() {
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
				QUnit.config.reorder = false;
				QUnit.config.autorun = false;//requireJS loads it then document.readyState = complete. In this case QUnit sets it = true and tests starts asynchronously
			}
		} 
	}
});
})();
