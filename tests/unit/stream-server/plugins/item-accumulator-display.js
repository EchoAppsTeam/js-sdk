(function($) {

var suite = Echo.Tests.Unit.PluginsItemAccumulatorDisplay = function() {};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item.Plugins.ItemAccumulatorDisplay",
	"suiteName": "ItemAccumulatorDisplay plugin",
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
		$(target).empty();
		var stream = new Echo.StreamServer.Controls.Stream({
			"target": target,
			"query": "childrenof:http://example.com/js-sdk/ sortOrder:repliesDescending",
			"appkey": "test.aboutecho.com",
			"plugins": [{
				"name": "ItemAccumulatorDisplay"
			}],
			"ready": function() {
				var item = this.threads[0];
				if (item) {
					test.executePluginRenderersTest(item.getPlugin("ItemAccumulatorDisplay"));
					QUnit.start();
				}
			}
		});
	}
};

})(jQuery);
