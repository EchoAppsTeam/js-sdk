(function($) {

var suite = Echo.Tests.Unit.PluginsSubmitTextCounter = function() {};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Submit.Plugins.SubmitTextCounter",
	"suiteName": "SubmitTextCounter plugin",
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
		var submit = new Echo.StreamServer.Controls.Submit({
			"target": $(target).empty(),
			"appkey": "test.aboutecho.com",
			"plugins": [{
				"name": "SubmitTextCounter",
				"limit": 40,
				"label": "You have typed {typed} chars, {left} chars left"
			}],
			"ready": function() {
				test.executePluginRenderersTest(this.getPlugin("SubmitTextCounter"));
				QUnit.start();
			}
		});
	}
};

})(jQuery);
