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
			"jquery": getBaseURL() + "third-party/jquery/jquery",
			"jquery-noconflict": getBaseURL() + "third-party/jquery/jquery-noconflict"
		},
		map: {
			"*": {
				"css": "third-party/requirejs/css",
				"jquery": "jquery-noconflict"
			},
			"jquery-noconflict": { "jquery": "jquery" }
		},
		// TODO: add shims for bootstrap plugins
		shim: {
			
		}
	});
})();
