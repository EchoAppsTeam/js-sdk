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
			console.log(res);
			return res;
		}
	};

	//TODO: generate path from object below istead of the big list
	var paths = {};
	paths["echo"] = loader.getURL("");
	paths["echo-assets"] = loader.getURL("");
	paths["echo-gui-css"] = "css!echo/gui.pack.css";
	paths["jquery-noconflict"] = loader.getURL("/third-party/jquery.pack");
	paths["isotope"] = loader.getURL("/third-party/jquery/jquery.isotope.pack"); 
	paths[loader.getURL("") + "/environment.pack"] = [
		"events", "utils", "labels", "configuration", "api",
		"streamserver/api", "identityserver/api", "user-session",
		"view", "control", "app", "plugin", "canvas"
	];
	paths[loader.getURL("") + "/gui.pack"] = [
		"bootstrap-transition", "bootstrap-affix", "bootstrap-alert",
		"bootstrap-button", "bootstrap-modal", "bootstrap-carousel",
		"bootstrap-collapse", "bootstrap-dropdown", "bootstrap-tooltip",
		"bootstrap-popover", "bootstrap-scrollspy", "bootstrap-tab",
		"bootstrap-typeahead", "gui", "echo-modal", "echo-button",
		"echo-dropdown", "echo-tabs"
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


