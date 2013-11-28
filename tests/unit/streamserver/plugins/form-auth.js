Echo.require([
	"jquery",
	"echo/streamserver/plugins/formAuth"
], function($) {

"use strict";

var plugin = "Echo.StreamServer.Apps.Submit.Plugins.FormAuth";

Echo.Tests.module(plugin, {
	"meta": {
		"className": plugin
	}
});

var _identityManager = {
	"width": 400,
	"height": 240,
	"url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="
};
Echo.Tests.pluginRenderersTest(plugin, {
	"targetURL": "http://example.com/js-sdk/",
	"pluginConfig": {
		"submitPermissions": "forceLogin",
		"identityManager": {
			"login": _identityManager,
			"signup": _identityManager
		}
	}
});

});
