(function() {
	var protocol = /^https?/.test(window.location.protocol) ? window.location.protocol : "http:";

	// TODO: make auto-substitution
	//var cdnBaseURL = protocol + "{%=baseURLs.cdn%}/";
	var cdnBaseURL = "/sdk/v3/dev";

	require.config({
		"waitSeconds": 5, // 5 sec
		"paths": {
			"echo": cdnBaseURL,
			"echo-gui-css": "css!echo/gui.pack.css",
			"jquery": cdnBaseURL + "/third-party/jquery/jquery"
		},
		// TODO: add "noСonflict" for jQuery
		map: {
			"*": {
				"css": "third-party/requirejs/css"
				//"echo-jquery": "jquery-private",
				//"jquery-private": { "echo-jquery": "echo-jquery" }
			}
		},
		// TODO: add shims for bootstrap plugins
		shim: {
			//"echo/third-party/jquery": {}
		}
	});
})();
