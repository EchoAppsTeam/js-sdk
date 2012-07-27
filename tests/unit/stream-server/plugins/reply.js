(function($) {

var suite = Echo.Tests.Unit.PluginsReply = function() {};

suite.prototype.tests = {};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item.Plugins.Reply",
	"suiteName": "Reply plugin",
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
			"query": "childrenof:" + this.config.dataBaseLocation,
			"appkey": this.config.appkey,
			"plugins": [{
				"name": "Reply"
			}],
			"ready": function() {
				var item = this.threads[0];
				if (item) {
					test.executePluginRenderersTest(item.getPlugin("Reply"));
					QUnit.start();
				}
			}
		});
	}
};

})(jQuery);
