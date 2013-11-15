(function() {
	var protocol = /^https?/.test(window.location.protocol) ? window.location.protocol : "http:";
	var cdnBaseURL = protocol + "{%=baseURLs.cdn%}/";
	
	var getBaseURL = function() {
		return cdnBaseURL + "sdk/v{%=packageVersion%}/dev/";
	};

	require.config({
		"waitSeconds": 5, // 5 sec
		"paths": {
			"echo": getBaseURL(),
			"echo-gui-css": "css!echo/gui.pack.css",
			"jquery-noconflict":  getBaseURL() + "jquery.pack",
			"isotope": getBaseURL() + "third-party/jquery/jquery.isotope.min", 
			// enviroment pack components
			"echo/events": getBaseURL() + "enviroment.pack",
			"echo/utils": getBaseURL() + "enviroment.pack",
			"echo/labels": getBaseURL() + "enviroment.pack",
			"echo/configuration": getBaseURL() + "enviroment.pack",
			"echo/api": getBaseURL() + "enviroment-pack",					// it was
			"echo/streamserver/api": getBaseURL() + "enviroment.pack",		// api
			"echo/identityserver/api": getBaseURL() + "enviroment.pack",	// pack
			"echo/user-session": getBaseURL() + "enviroment.pack",
			"echo/view": getBaseURL() + "enviroment-pack",
			"echo/control": getBaseURL() + "enviroment-pack",
			"echo/app": getBaseURL() + "enviroment.pack",
			"echo/plugin": getBaseURL() + "enviroment.pack",
			"echo/canvas": getBaseURL() + "enviroment.pack",
			//"echo/control": getBaseURL() + "enviroment.pack",
			// gui pack components
			"echo/bootstrap-transition": getBaseURL() + "gui.pack",
			"echo/bootstrap-affix": getBaseURL() + "gui.pack",
			"echo/bootstrap-alert": getBaseURL() + "gui.pack",
			"echo/bootstrap-button": getBaseURL() + "gui.pack",
			"echo/bootstrap-modal": getBaseURL() + "gui.pack",
			"echo/bootstrap-carousel": getBaseURL() + "gui.pack",
			"echo/bootstrap-collapse": getBaseURL() + "gui.pack",
			"echo/bootstrap-dropdown": getBaseURL() + "gui.pack",
			"echo/bootstrap-tooltip": getBaseURL() + "gui.pack",
			"echo/bootstrap-popover": getBaseURL() + "gui.pack",
			"echo/bootstrap-scrollspy": getBaseURL() + "gui.pack",
			"echo/bootstrap-tab": getBaseURL() + "gui.pack",
			"echo/bootstrap-typeahead": getBaseURL() + "gui.pack",
			"echo/gui": getBaseURL() + "gui.pack",
			"echo/echo-modal": getBaseURL() + "gui.pack",
			"echo/echo-button": getBaseURL() + "gui.pack",
			"echo/echo-dropdown": getBaseURL() + "gui.pack",
			"echo/echo-tabs": getBaseURL() + "gui.pack"
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
