(function($) {

var suite = Echo.Tests.Unit.PluginsFormAuth = function() {
	var identityManager = {
		"width": 400,
		"height": 240,
		"url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="
	};
	this.constructPluginRenderersTest({
		"plugin": {
			"name": "FormAuth",
			"submitPermissions": "forceLogin",
			"identityManager": {
				"login": identityManager,
				"signup": identityManager
			}
		}
	});
};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
	"suiteName": "FormAuth plugin",
	"functions": []
};

})(Echo.jQuery);
