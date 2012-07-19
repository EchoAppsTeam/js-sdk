(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.itemsAutorequest
 * Echo Stream plugin automatically loads the next page full of items when the end of the stream is displayed on the browser screen. This produces an 'Infinite Scroll' Effect.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "ItemsAutoRequest"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.skeleton("ItemsAutoRequest", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

// http://www.appelsiini.net/download/jquery.viewport.mini.js
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);

plugin.init = function() {
	var plugin = this;
	$(window).bind("scroll", function(event) {
		var element = plugin.component.dom && plugin.component.dom.get("more");
		if (element && !plugin.get("requestInProgress") && $.inviewport(element, {"threshold": 0})) {
			plugin.set("requestInProgress", true);
			element.click();
		}
	});	
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.onDataReceive": function(topic, args) {
		this.set("requestInProgress", false);
	}
};

Echo.Plugin.create(plugin);

})(jQuery);
