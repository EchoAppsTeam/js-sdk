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
				if(paths[item] instanceof Array) {
					for(var i = 0; i < paths[item].length; i++) {
						res[paths[item][i]] = item; 
					}
				} else {
					res[item] = paths[item];
				}
			}
			return res;
		}
	};

	//TODO: generate path from object below istead of the big list
	var paths = {};
	paths["echo"] = loader.getURL("");
	paths["echo-assets"] = loader.getURL("");
	paths["echo-gui-css"] = "css!echo/gui.pack.css";
	paths["jquery-noconflict"] = loader.getURL("/third-party/jquery.pack");
	paths["isotope"] = loader.getURL("/third-party/jquery/jquery.isotope.min"); 
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
		"echo/streamserver/controls/facepile","echo/streamserver/controls/submit",
		"echo/streamserver/plugins/community-flag", "echo/streamserver/plugins/form-auth.js",
		"echo/streamserver/plugins/item-accumulator-display", "echo/streamserver/plugins/janrain-sharing",
		"echo/streamserver/plugins/metadata-manager", "echo/streamserver/plugins/pinboard-visualization",
		"echo/streamserver/plugins/text-counter", "echo/streamserver/plugins/edit", 
		"echo/streamserver/plugins/infinite-scroll", "echo/streamserver/plugins/janrain-auth",
		"echo/streamserver/plugins/like", "echo/streamserver/plugins/moderation",
		"echo/streamserver/plugins/reply", "echo/streamserver/plugins/tweet-display"
	];
	require.config({
		"waitSeconds": 5, // 5 sec
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


