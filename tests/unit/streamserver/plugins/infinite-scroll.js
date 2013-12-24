Echo.Tests.Units.push(function(callback) {
	"use strict";

	Echo.require([
		"jquery",
		"loadFrom![echo/streamserver.sdk]echo/streamserver/bundled-apps/stream/client-widget"
	], function($, Stream) {

	var plugin = "Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.InfiniteScroll";

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
		/* jshint nonew:false */
		new Stream({
			"target": target,
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"query": "childrenof:http://example.com/js-sdk/ itemsPerPage:1",
			"liveUpdates": {
				"enabled": false
			},
			"plugins": [{
				"component": "loadFrom![echo/streamserver.sdk]echo/streamserver/bundled-apps/stream/plugins/infinite-scroll"
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
				var spy = sinon.spy(element, "click");
				this.events.subscribe({
					"topic": "Echo.StreamServer.BundledApps.Stream.ClientWidget.onDataReceive",
					"once": true,
					"handler": function(topic, args) {
						this.destroy();
						$(window).trigger("scroll");
						QUnit.equal(spy.callCount, 1, "Plugin reaction on window scroll event is NOT registered after app destroy");
						spy.restore();
						// restore styles stream target had before the test
						target.css(styles);
						QUnit.start();
					}
				});
				$(window).trigger("scroll");
				QUnit.ok(spy.called, "Plugin reaction on window scroll event is registered");
			}
		});
		/* jshint nonew:true */
	});

	callback();

	});
});
