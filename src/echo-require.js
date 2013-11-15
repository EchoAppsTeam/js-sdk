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
			//"jquery": getBaseURL() + "third-party/jquery/jquery",
			"jquery-noconflict":  getBaseURL() + "jquery.pack",
			"isotope": getBaseURL() + "third-party/jquery/jquery.isotope.min", //getBaseURL() + "third-party/jquery/jquery.isotope.min",
			"gui-pack": getBaseURL() + "gui.pack"
		},
		"map": {
			"*": {
				"css": "third-party/requirejs/css",
				"jquery": "jquery-noconflict",
				"bootstrap-button":"gui-pack"
			},
			"jquery-noconflict": {"jquery": "jquery"},
			//"isotope": {"jquery": "jquery-noconflict"}
		},
		"shim": {
			//"isotope": ["jquery"],
			"echo/backplane": {
            	"exports": "Backplane"
        	},
        	
        	"bootstrap-button": ["jquery"]

		}
	});
})();
