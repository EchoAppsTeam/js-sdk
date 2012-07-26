(function($) {

var suite = Echo.Tests.Unit.PluginsCommunityFlag = function() {};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
	"suiteName": "CommunityFlag plugin",
	"functions": []
};

suite.prototype.tests.renderersTest = {
	"config": {
		"async": true,
		"testTimeout": 10000
	},
	"check": function() {
		var test = this;
		var stream = new Echo.StreamServer.Controls.Stream({
			"target": $(document.getElementById("qunit-fixture")).empty(),
			"query": "childrenof:" + this.config.dataBaseLocation + " sortOrder:repliesDescending",
			"appkey": this.config.appkey,
			"plugins": [{
				"name": "CommunityFlag"
			}],
			"ready": function() {
				var item = this.threads[0];
				if (!item) return;
				test.executePluginRenderersTest(item.getPlugin("CommunityFlag"));
				QUnit.start();
			}
		});
	}
};

})(jQuery);
