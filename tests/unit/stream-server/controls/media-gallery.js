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
			"<img src='http://cdn.echoenabled.com/images/avatar-default.png'/>",
			"<img src='http://cdn.echoenabled.com/extra/jquery/plugins/fancybox/fancybox.png'/>"
		];
		new Echo.StreamServer.Controls.Stream.Item.MediaGallery({
			"target": this.config.target,
			"appkey": "test.aboutecho.com",
			"elements": elements,
			"ready": function() {
				suite.mediaGallery = this;
				var items = suite.mediaGallery.dom.get("items");
				var controls = suite.mediaGallery.dom.get("controls");
				suite.checkActiveControl = function(index) {
					var isActive = true;
					$.each(controls.children(), function(i, element){
						if (i === index) {
							isActive = $(element).hasClass(suite.mediaGallery.cssPrefix + "activeControl");
						} else {
							isActive = !$(element).hasClass(suite.mediaGallery.cssPrefix + "activeControl");
						}
						
						return isActive;
					});
					return isActive;
				};
				QUnit.ok(suite.checkActiveControl(0),
					"Checking initial view of media gallery (first control is active, all others is not)");
				self.sequentialAsyncTests([
					"changeActiveItem",
					"oneMediaItem",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.cases = {};

suite.prototype.cases.changeActiveItem = function(callback) {
	var gallery = suite.mediaGallery;
	gallery.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.MediaGallery.onLoadMedia",
		"once": true,
		"handler": function(topic, params) {
			QUnit.ok(suite.checkActiveControl(1),
				"Checking that next control is active after control click");
			callback();
		}
	});
	gallery.dom.get("controls").children().get(1).click();
};

suite.prototype.cases.oneMediaItem = function(callback) {
	var gallery = suite.mediaGallery;
	gallery.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.MediaGallery.onRefresh",
		"once": true,
		"handler": function(topic, params) {
			QUnit.ok(!(gallery.dom.get("controls").is(":visible") && gallery.dom.get("controls").children().length),
				"Checking that one media item is displayed without controls");
			callback();
		}
	});
	gallery.config.set("elements", [
		"<img src='http://cdn.echoenabled.com/images/avatar-default.png'/>"
	]);
	gallery.refresh();
};

suite.prototype.cases.destroy = function(callback) {
	if (suite.mediaGallery) suite.mediaGallery.destroy();
	callback && callback();
};

})(Echo.jQuery);
