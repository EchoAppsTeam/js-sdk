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
		}
	};

	//TODO: generate path from object below istead of the big list
	var paths = {};
	paths[loader.getURL() + "environment.pack"] = [
		"events", "utils", "labels", "configuration", "api",
		"streamserver/api", "identityserver/api", "user-session",
		"view", "control", "app", "plugin", "canvas"
	];
	paths[loader.getURL() + "gui.pack"] = [];

	require.config({
		"waitSeconds": 5, // 5 sec
		"paths": {
		"echo-assets": loader.getURL(""),
			"echo": loader.getURL(""),
			"echo-gui-css": "css!echo/gui.pack.css",
			"jquery-noconflict":  loader.getURL("jquery.pack"),
			"isotope": loader.getURL("third-party/jquery/jquery.isotope.min"),
			// environment pack components
			"echo/events": loader.getURL("environment.pack"),
			"echo/utils": loader.getURL("environment.pack"),
			"echo/labels": loader.getURL("environment.pack"),
			"echo/configuration": loader.getURL("environment.pack"),
			"echo/api": loader.getURL("environment-pack"), // it was
			"echo/streamserver/api": loader.getURL("environment.pack"), // api
			"echo/identityserver/api": loader.getURL("environment.pack"), // pack
			"echo/user-session": loader.getURL("environment.pack"),
			"echo/view": loader.getURL("environment.pack"),
			"echo/control": loader.getURL("environment.pack"),
			"echo/app": loader.getURL("environment.pack"),
			"echo/plugin": loader.getURL("environment.pack"),
			"echo/canvas": loader.getURL("environment.pack"),
			// gui pack components
			"echo/bootstrap-transition": loader.getURL() + "gui.pack",
			"echo/bootstrap-affix": loader.getURL() + "gui.pack",
			"echo/bootstrap-alert": loader.getURL() + "gui.pack",
			"echo/bootstrap-button": loader.getURL() + "gui.pack",
			"echo/bootstrap-modal": loader.getURL() + "gui.pack",
			"echo/bootstrap-carousel": loader.getURL() + "gui.pack",
			"echo/bootstrap-collapse": loader.getURL() + "gui.pack",
			"echo/bootstrap-dropdown": loader.getURL() + "gui.pack",
			"echo/bootstrap-tooltip": loader.getURL() + "gui.pack",
			"echo/bootstrap-popover": loader.getURL() + "gui.pack",
			"echo/bootstrap-scrollspy": loader.getURL() + "gui.pack",
			"echo/bootstrap-tab": loader.getURL() + "gui.pack",
			"echo/bootstrap-typeahead": loader.getURL() + "gui.pack",
			"echo/gui": loader.getURL() + "gui.pack",
			"echo/echo-modal": loader.getURL() + "gui.pack",
			"echo/echo-button": loader.getURL() + "gui.pack",
			"echo/echo-dropdown": loader.getURL() + "gui.pack",
			"echo/echo-tabs": loader.getURL() + "gui.pack"
		},
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


