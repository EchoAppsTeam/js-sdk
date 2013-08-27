(function($) {

var plugin = "Echo.StreamServer.Controls.Stream.Plugins.InfiniteScroll";

Echo.Tests.module(plugin, {
	"meta": {
		"className": plugin,
		"functions": [
			"destroy"
		]
	}
});

Echo.Tests.asyncTest("common workflow", function() {
	var target = $("#qunit-fixture");
	new Echo.StreamServer.Controls.Stream({
		"target": target,
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"query": "childrenof:http://example.com/js-sdk/ itemsPerPage:1",
		"liveUpdates": {
			"enabled": false
		},
		"plugins": [{
			"name": "InfiniteScroll"
		}],
		"ready": function() {
			var element = this.view.get("more");
			QUnit.ok(!!element.length, "More button is visible");
			var styles = target.css(["left", "top", "visibility"]);
			// temporarily move stream target into viewport for the plugin to react on scroll event
			target.css({
				"left": 0,
				"top": $(window).scrollTop() + 100,
				"visibility": "hidden"
			});
			var plugin = this.getPlugin("InfiniteScroll");
			var spy = sinon.spy(element, "click");
			this.events.subscribe({
				"topic": "Echo.StreamServer.Controls.Stream.onDataReceive",
				"once": true,
				"handler": function(topic, args) {
					this.destroy();
					$(window).trigger("scroll");
					QUnit.equal(spy.callCount, 1, "Plugin reaction on window scroll event is NOT registered after app destroy");
					spy.reset();
					// restore styles stream target had before the test
					target.css(styles);
					QUnit.start();
				}
			});
			$(window).trigger("scroll");
			QUnit.ok(spy.called, "Plugin reaction on window scroll event is registered");
		}
	});
});

})(Echo.jQuery);
