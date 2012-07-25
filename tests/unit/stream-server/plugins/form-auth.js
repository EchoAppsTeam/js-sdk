(function($) {

var suite = Echo.Tests.Unit.PluginsFormAuth = function() {};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
	"suiteName": "FormAuth plugin",
	"functions": []
};

suite.prototype.tests.renderersTest = {
	"config": {
		"async": true,
		"testTimeout": 10000
	},
	"check": function() {
		var test = this;
		var target = document.getElementById("qunit-fixture");
		var identityManager = {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="};
		var submit = new Echo.StreamServer.Controls.Submit({
			"target": $(target).empty(),
			"appkey": "test.aboutecho.com",
			"plugins": [{
				"name": "FormAuth",
				"submitPermissions": "forceLogin",
				"identityManager": {
					"login": identityManager,
					"signup": identityManager
				}
			}],
			"ready": function() {
				test.executePluginRenderersTest(this.getPlugin("FormAuth"));
				QUnit.start();
			}
		});
	}
};

})(jQuery);
