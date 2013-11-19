(function() {
	"use strict";
	var loader = {
		"version": "{%=packageVersion%}",
		"cdnBaseURL": (/^https?/.test(window.location.protocol) ? window.location.protocol : "http:") +	"{%=baseURLs.cdn%}/",
		"getURL": function(url, devVersion) {
			if (typeof devVersion === "undefined") devVersion = true;
			return /^https?:\/\/|^\/\//.test(url)
				? url
				: this.cdnBaseURL + "sdk/v" + this.version +
					(devVersion && this.isDebug() ? "/dev" : "") +
					(!url || url.charAt(0) === "/" ? "" : "/") + url;
		},
		"isDebug": function() {
			return true;
		},
		"generatePaths": function(paths) {
			var res = {};
			for(var item in paths) {
				for(var i = 0; i < paths[item].length; i++) {
					res[paths[item][i]] = item; 
				}
			}
			return res;
		}
	};

	//TODO: generate path from object below istead of the big list
	var paths = {};
	paths[loader.getURL("")] = ["echo", "echo-assets"]; //assets is for pictures
	paths["css!echo/gui.pack.css"] = ["echo-gui-css"];
	paths[loader.getURL("/third-party/jquery/jquery.pack")] = ["jquery-noconflict"];
	paths[loader.getURL("/third-party/jquery/jquery.isotope.min")] = ["isotope"]; 
	paths[loader.getURL("") + "/enviroment.pack"] = [
		"echo/events", "echo/utils", "echo/labels", "echo/configuration", "echo/api",
		"echo/streamserver/api", "echo/identityserver/api", "echo/user-session",
		"echo/view", "echo/control", "echo/app", "echo/plugin", "echo/canvas"
	];
	paths[loader.getURL("") + "/gui.pack"] = [
		"echo/bootstrap-transition", "echo/bootstrap-affix", "echo/bootstrap-alert",
		"echo/bootstrap-button", "echo/bootstrap-modal", "echo/bootstrap-carousel",
		"echo/bootstrap-collapse", "echo/bootstrap-dropdown", "echo/bootstrap-tooltip",
		"echo/bootstrap-popover", "echo/bootstrap-scrollspy", "echo/bootstrap-tab",
		"echo/bootstrap-typeahead", "echo/gui", "echo/gui/modal", "echo/gui/button",
		"echo/gui/dropdown", "echo/gui/tabs"
	];
	paths[loader.getURL("") + "/streamserver.pack"] = [
		"echo/streamserver/controls/counter","echo/streamserver/controls/stream",
		"echo/streamserver/controls/facePile", "echo/streamserver/controls/facePileItem", 
		"echo/streamserver/controls/submit", "echo/streamserver/plugins/edit", 
		"echo/streamserver/plugins/streamItemEdit", "echo/streamserver/plugins/submitEdit",
		"echo/streamserver/plugins/community-flag", "echo/streamserver/plugins/form-auth.js",
		"echo/streamserver/plugins/infinite-scroll", "echo/streamserver/plugins/item-accumulator-display",
		"echo/streamserver/plugins/janrain-sharing", "echo/streamserver/plugins/like", 
		"echo/streamserver/plugins/streamLike", "echo/streamserver/plugins/facePileLike",
		"echo/streamserver/plugins/metadata-manager", "echo/streamserver/plugins/moderation",
		"echo/streamserver/plugins/streamModeration", "echo/streamserver/plugins/streamItemModeration",
		"echo/streamserver/plugins/reply", "echo/streamserver/plugins/streamItemReply",
		"echo/streamserver/plugins/streamReply", "echo/streamserver/plugins/submitReply",
		"echo/streamserver/plugins/textCounter", "echo/streamserver/plugins/tweet-display"
	];
	paths[loader.getURL("") + "/pinboard-visualization"] = [
		"echo/streamserver/plugins/pinboardVisualization",
		"echo/streamserver/plugins/mediaGallery",
		"echo/streamserver/plugins/streamItemPinboardVisualization",
		"echo/streamserver/plugins/streamPinboardVisualization"
	];
	paths[loader.getURL("") + "/identityserver.pack"] = [
		"echo/identityserver/controls/auth",
		"echo/identityserver/plugins/janrain-connector"
	];
	require.config({
		"waitSeconds": 5, // 5 sec before timeout exception
		"paths": loader.generatePaths(paths),
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
			}
		}
	});
})();


