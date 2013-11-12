require.config({
	//"waitSeconds": Echo.Loader.config.errorTimeout,
	"paths": {
		//"echo": "http://sdk.safin.ul.js-kit.com/",
		//"backplane": "echo/backplane",
		//"echo-sdk": "echo/environment.pack",
		//"echo-api": "echo/api.pack",
		//"echo-streamserver": "echo/streamserver.pack",
		//"echo-identityserver": "echo/identityserver.pack",
		//"echo-jquery": "echo/third-party/jquery.pack",
		//"jquery-private": "echo/third-party/jquery.pack",
		//"echo-gui": "echo/gui.pack",
		"echo-gui-css": "css!echo/gui.pack.css",
		"jquery": "third-party/jquery/jquery"
	},
	map: {
		"*": {
			"css": "third-party/requirejs/css"
			//"echo-jquery": "jquery-private",
			//"jquery-private": { "echo-jquery": "echo-jquery" }
		}
	},
	shim: {
		"echo/backplane": { "exports": "Backplane" },
		"echo/view": { "exports": "Echo.View" },
		"echo/utils": { "exports": "Echo.Utils" },
		"echo/plugin": { "exports": "Echo.Plugin" },
		"echo/labels": { "exports": "Echo.Labels" },
		"echo/gui": { "exports": "Echo.GUI" },
		"echo/events": { "exports": "Echo.Events" },
		"echo/control": { "exports": "Echo.Control" },
		"echo/configuration": { "exports": "Echo.Configuration" },
		"echo/app": { "exports": "Echo.App" },
		"echo/api": { "exports": "Echo.API" },
		"echo/user-session": { "exports": "Echo.UserSession" },
		"echo/cookie": { "exports": "Echo.Cookie"},

		//"echo/third-party/jquery": {}
/*
		"echo-sdk": {
			"deps": ["echo-jquery", "backplane"]
		},
		"echo-streamserver": {
			"deps": ["echo-sdk", "echo-api", "echo-gui", "echo-gui-css"]
		},
		"echo-identityserver": {
			"deps": ["echo-sdk", "echo-api", "echo-gui", "echo-gui-css"]
		}
*/
	}
});

