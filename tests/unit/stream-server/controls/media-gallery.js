(function($) {

var data = {
	"instance": {
		"name": "Echo.StreamServer.Controls.Stream.Item.MediaGallery"
	},
	"config": {
		"async": true,
		"testTimeout": 10000
	}
};

var suite = Echo.Tests.Unit.MediaGallery = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className": "Echo.StreamServer.Controls.Stream.Item.MediaGallery",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true,
		"testTimeout": 20000, // 20 secs
		"user": {"status": "anonymous"}
	},
	"check": function() {
		var self = this;
		var elements = [
			"<img src='" + Echo.Loader.getURL("sdk/images/avatar-default.png") + "'/>",
			"<img src='" + Echo.Loader.getURL("sdk/third-party/jquery/img/fancybox/fancybox.png") + "'/>"
		];
		suite.checkGalleryActiveItem = function(gallery, index) {
			var isActive = true;
			var items = gallery.view.get("items");
			var controls = gallery.view.get("controls");
			$.each(controls.children(), function(i, element){
				if (i === index) {
					isActive = $(element).hasClass(suite.mediaGallery.cssPrefix + "activeControl") &&
						$(items.children().get(i)).is(":visible");
				} else {
					isActive = !$(element).hasClass(suite.mediaGallery.cssPrefix + "activeControl") &&
						!$(items.children().get(i)).is(":visible");
				}
				return isActive;
			});
			return isActive;
		};
		new Echo.StreamServer.Controls.Stream.Item.MediaGallery({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"elements": elements,
			"ready": function() {
				suite.mediaGallery = this;
				self.sequentialAsyncTests([
					"initialView",
					"changeActiveItem",
					"oneMediaItem",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases = {};

suite.prototype.cases.initialView = function(callback) {
	var gallery = suite.mediaGallery;
	gallery.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.MediaGallery.onLoadMedia",
		"once": true,
		"handler": function(topic, params) {
			QUnit.ok(suite.checkGalleryActiveItem(gallery, 0),
				"Checking initial view of media gallery (first item is active, all others are not)");
			callback();
		}
	});
};

suite.prototype.cases.changeActiveItem = function(callback) {
	var gallery = suite.mediaGallery;
	gallery.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.MediaGallery.onChangeMedia",
		"once": true,
		"handler": function(topic, params) {
			QUnit.ok(suite.checkGalleryActiveItem(gallery, 1),
				"Checking that next item is active after control click");
			callback();
		}
	});
	$(gallery.view.get("controls").children().get(1)).click();
};

suite.prototype.cases.oneMediaItem = function(callback) {
	var gallery = suite.mediaGallery;
	gallery.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.MediaGallery.onRefresh",
		"once": true,
		"handler": function(topic, params) {
			QUnit.ok(!(gallery.view.get("controls").is(":visible") && gallery.view.get("controls").children().length),
				"Checking that one media item is displayed without controls");
			callback();
		}
	});
	gallery.config.set("elements", [
		"<img src='" + Echo.Loader.getURL("sdk/images/avatar-default.png") + "'/>"
	]);
	gallery.refresh();
};

suite.prototype.cases.destroy = function(callback) {
	if (suite.mediaGallery) suite.mediaGallery.destroy();
	callback && callback();
};

})(Echo.jQuery);
