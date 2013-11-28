Echo.require(['cookie'], function(Cookie) {
	
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
				Cookie.set(_debugCookieName, true, options);
			} else {
				Echo.Loader.debug = false;
				Cookie.remove(_debugCookieName, options);
			}
			return;
		}
		Echo.Loader.debug = !!Cookie.get(_debugCookieName);
})();

var paths = {};
paths[Echo.Loader.getURL("")] = ["echo"]; 
paths[Echo.Loader.getURL("", false)] = ["echo-assets"];
paths[Echo.Loader.getURL("/backplane")] = ["echo/backplane"];
paths[Echo.Loader.getURL("/third-party/jquery.pack")] = ["jquery-noconflict"];
paths[Echo.Loader.getURL("/third-party/jquery/jquery.isotope.min")] = ["isotope"]; 
paths[Echo.Loader.getURL("/tests/qunit/qunit")] = ["QUnit"];//TODO: replace to harness 
paths[Echo.Loader.getURL("") + "/enviroment.pack"] = [
	"echo/events", "echo/utils",
	"echo/labels", "echo/configuration",
	"echo/api", "echo/streamserver/api",
	"echo/streamserver/user", "echo/view",
	"echo/app", "echo/plugin"
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
	"echo/streamserver/bundled-app", "echo/streamserver/apps/counter",
	"echo/streamserver/apps/stream", "echo/streamserver/apps/facePile",
	"echo/streamserver/apps/facePileItem", "echo/streamserver/apps/submit",
	"echo/streamserver/apps/auth", "echo/streamserver/plugins/edit",
	"echo/streamserver/plugins/streamItemEdit", "echo/streamserver/plugins/submitEdit",
	"echo/streamserver/plugins/communityFlag", "echo/streamserver/plugins/formAuth",
	"echo/streamserver/plugins/infiniteScroll", "echo/streamserver/plugins/itemAccumulatorDisplay",
	"echo/streamserver/plugins/janrain-connector", "echo/streamserver/plugins/janrainSharing",
	"echo/streamserver/plugins/submitJanrainSharing", "echo/streamserver/plugins/streamJanrainSharing",
	"echo/streamserver/plugins/like", "echo/streamserver/plugins/streamLike",
	"echo/streamserver/plugins/facePileLike", "echo/streamserver/plugins/metadataManager",
	"echo/streamserver/plugins/moderation", "echo/streamserver/plugins/streamModeration",
	"echo/streamserver/plugins/streamItemModeration", "echo/streamserver/plugins/reply",
	"echo/streamserver/plugins/streamItemReply", "echo/streamserver/plugins/streamReply",
	"echo/streamserver/plugins/submitReply", "echo/streamserver/plugins/textCounter",
	"echo/streamserver/plugins/tweet-display", "echo/streamserver/apps/item"
];
paths[Echo.Loader.getURL("") + "/pinboard-visualization"] = [
	"echo/streamserver/plugins/pinboardVisualization", "echo/streamserver/plugins/mediaGallery",
	"echo/streamserver/plugins/streamItemPinboardVisualization", "echo/streamserver/plugins/streamPinboardVisualization"
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
});
