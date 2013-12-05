Echo.define("echo/streamserver/plugins/pinboard-visualization", [
	"jquery",
	"echo/plugin",
	"echo/streamserver/plugins/stream-item-pinboard-visualization",
	"isotope"
], function($, Plugin, StreamItemPinboardVisualization) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.PinboardVisualization
 * The PinboardVisualization plugin transforms Echo Stream Client visualization
 * into a pinboard-style representation. The plugin extracts all media (such as
 * images, videos, etc) from the item content and assembles the mini media
 * gallery inside the item UI. You can find UI example of the plugin
 * <a href="http://echosandbox.com/use-cases/pinboard-visualization/">here</a>.
 *
 * __Note__: the "PinboardVisualization" plugin is not included into the
 * StreamServer JS package (streamserver.pack.js). Please include the
 * scripts below (production and development versions respectively) to
 * load the "PinboardVisualization" plugin:
 *
 * http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/pinboard-visualization.js  
 * http://cdn.echoenabled.com/sdk/v3/dev/streamserver/plugins/pinboard-visualization.js
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "PinboardVisualization"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins/pinboard-visualization.js
 */
var plugin = Plugin.definition("PinboardVisualization", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

if (Plugin.isDefined(plugin)) return;

var ua = navigator.userAgent.toLowerCase();
var isMozillaBrowser = !!(
		!~ua.indexOf("chrome")
		&& !~ua.indexOf("webkit")
		&& !~ua.indexOf("opera")
		&& (
			/(msie) ([\w.]+)/.exec(ua)
			|| ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		)
	);

plugin.config = {
	/**
	 * @cfg {Object} isotope
	 * Allows to configure the Isotope jQuery plugin, used by the plugin as the
	 * rendering engine. The possible config values can be found at the Isotope
	 * plugin homepage ([http://isotope.metafizzy.co/](http://isotope.metafizzy.co/)). It's NOT recommended to
	 * change the settings of the Isotope unless it's really required.
	 *
	 *__Note__: the Isotope JS library doesn't work in IE <a href="http://en.wikipedia.org/wiki/Quirks_mode">quirks mode</a>.
	 * Due to this fact you should declare the necessary <a href="http://en.wikipedia.org/wiki/DOCTYPE">\<DOCTYPE\></a>
	 * on the page. We recommend to use a
	 * <a href="http://en.wikipedia.org/wiki/DOCTYPE#HTML5_DTD-less_DOCTYPE">HTML5 DOCTYPE</a> declaration.
	 */
	"isotope": {
		"animationOptions": {
			// change duration for mozilla browsers
			"duration": isMozillaBrowser ? 0 : 2750,
			"easing": "linear",
			"queue": false
		},
		// use only jQuery engine for animation in mozilla browsers
		// due to the issues with video display with CSS transitions
		"animationEngine": isMozillaBrowser ? "jquery" : "best-available"
	}
};

plugin.init = function() {
	// display an item immediately (cancel the slide down animation)
	// to let the Isotope library work with the final state of the DOM element
	// representing the item, to avoid its incorrect positioning in the grid
	this.component.config.set("slideTimeout", 0);
};

plugin.enabled = function() {
	return document.compatMode !== "BackCompat"
};

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRender": function(topic, args) {
		this._refreshView();
	},
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRefresh": function(topic, args) {
		this._refreshView();
	},
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.PinboardVisualization.onChangeView": function(topic, args) {
		var plugin = this;
		if (args.force) {
			plugin._refreshView();
		} else {
			plugin.component.queueActivity({
				"action": "rerender",
				"item": plugin.component.items[args.item.data.unique],
				"priority": "high",
				"handler": function() {
					plugin._refreshView();
					plugin.component._executeNextActivity();
				}
			});
		}
	}
};

plugin.methods._refreshView = function() {
	var plugin = this, stream = this.component;
	var body = stream.view.get("body");
	var hasEntries = stream.threads.length;
	body.data("isotope")
		? (hasEntries
			? body.isotope("reloadItems").isotope({"sortBy": "original-order"})
			: body.isotope("destroy"))
		: hasEntries && body.isotope(
			plugin.config.get("isotope")
		);
};

plugin.css = 
	'.{plugin.class} .isotope { -webkit-transition-property: height, width; -moz-transition-property: height, width; -o-transition-property: height, width; transition-property: height, width;  -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }' +
	'.{plugin.class} .isotope .isotope-item { -webkit-transition-property: -webkit-transform, opacity; -moz-transition-property: -moz-transform, opacity; -o-transition-property: top, left, opacity; transition-property:transform, opacity; -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }';

return Plugin.create(plugin);

});

Echo.define("echo/streamserver/plugins/stream-item-pinboard-visualization", [
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/streamserver/bundled-apps/stream/item/media-gallery/client-widget",
	"isotope"
], function($, Plugin, Utils, MediaGallery) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.PinboardVisualization
 * The PinboardVisualization plugin transforms Stream.Item application into a
 * pinboard-style block.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"query": "childrenof:http://example.com/js-sdk",
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "PinboardVisualization",
 * 			"columnWidth": 100,
 * 			"gallery": {"resizeDuration": 550}
 * 		}]
 * 	});
 *
 * __Note__: PinboardVisualization plugin modifies not only the Stream layout,
 * but also the UI of the Stream.Item application. It is notable that "reTag" section
 * is removed from the Item template. That's why setting the "reTag" configuration
 * parameter for the Stream.Item application will result in no actions while the
 * PinboardVisualization plugin is active. This was done to simplfy UI and avoid
 * visual noise as much as possible. More information about "reTag" configuration
 * parameter can be found [here](#!/api/Echo.StreamServer.BundledApps.Stream.Item.ClientWidget-cfg-reTag).
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins/pinboard-visualization.js
 */

var plugin = Plugin.definition("PinboardVisualization", "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate("replace", "container", plugin.templates.container);
};

plugin.config = {
	/**
	 * @cfg {Number} columnWidth
	 * Allows to define the width for one column in pixels, default width is 250px.
	 * The amount of columns is calculated based on the width of the Echo Stream
	 * Client container.
	 */
	"columnWidth": 250,
	/**
	 * @cfg {Number} maxChildrenBodyCharacters
	 * Allows to truncate the reply text displayed under the root item. Default
	 * value is 50 characters. The value of this parameter should be integer and
	 * represent the number of visible characters that need to be displayed.
	 */
	"maxChildrenBodyCharacters": 50,
	/**
	 * @cfg {Function} mediaSelector
	 * Allows to define the function with custom rules for the media content
	 * extraction from the item content. The value of this parameter is a function
	 * which accepts the item content (string) as the first argument and should
	 * return the jQuery element with the list of the DOM elements which are
	 * considered to be the media content of this item.
	 * 
	 * Example (also used as a default value):
	 *
	 * 	"mediaSelector": function(content) {
	 * 		var dom = $("<div>" + content + "</div>");
	 * 		return $("img, video, embed, iframe", dom);
	 * 	}
	 */
	"mediaSelector": function(content) {
		var dom = $("<div>" + content + "</div>");
		return $("img, video, embed, iframe", dom);
	},
	/**
	 * @cfg {Object} itemCSSClassByContentLength
	 * Allows to define extra CSS class to the item based on the item length.
	 * The value of this parameter is the JS object with the CSS classes as
	 * the keys and the item text length ranges as values. Multiple CSS classes
	 * might be applied to the item if the item text length meets several
	 * criteria simultaneously.
	 */
	"itemCSSClassByContentLength": {
		"echo-streamserver-bundledapps-stream-item-clientwidget-smallSizeContent": [0, 69],
		"echo-streamserver-bundledapps-stream-item-clientwidget-mediumSizeContent": [70, 120]
	},
	/**
	 * @cfg {Object} gallery
	 * Allows to proxy the parameters for the mini Media Gallery class,
	 * initialized for the item in case any media content was found in its body. 
	 */
	"gallery": {
		"resizeDuration": 250
	}
};

plugin.enabled = function() {
	return document.compatMode !== "BackCompat"
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"childrenMoreItems": "View more items..."
};

/**
 * @echo_renderer
 */
plugin.component.renderers.content = function(element) {
	var plugin = this, item = this.component;
	return item.parentRenderer('content', arguments).css({
		"width": parseInt(plugin.config.get("columnWidth"))
	});
};

(function() {

/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.PinboardVisualization.onChangeView
 * Triggered if the view was changed.
 */
var publish = function(force) {
	this.events.publish({
		"topic": "onChangeView",
		"data": {
			"force": force
		}
	});
};

var getRenderer = function(name) {
	return function(element) {
		var plugin = this, item = this.component;
		element = item.parentRenderer(name, arguments);
		if (plugin.get("rendered")) {
			element.queue("fx", function(next) {
				next();
				publish.call(plugin, true);
			});
			publish.call(plugin, name === "expandChildren");
		}
		return element;
	};
};

/**
 * @echo_renderer
 */
plugin.component.renderers.container = getRenderer("container");

/**
 * @echo_renderer
 */
plugin.component.renderers.expandChildren = getRenderer("expandChildren");

/**
 * @echo_renderer
 */
plugin.component.renderers.textToggleTruncated = function(element) {
	var plugin = this, item = this.component;
	return item.parentRenderer("textToggleTruncated", arguments).one('click', function() {
		publish.call(plugin, true);
	});
};

$.map(["Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRerender",
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onDelete",
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onResize",
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onLoadMedia"], function(topic) {
		plugin.events[topic] = function() {
			var force = topic !== "Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onDelete";
			publish.call(this, force);
		};
});

$.map(["Echo.StreamServer.BundledApps.Submit.ClientWidget.onRender",
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditError",
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditComplete",
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply.onCollapse"], function(event) {
	plugin.events[event] = function(topic, args) {
		var plugin = this;
		// in some cases we need to refresh isotope layout immediately
		if (!plugin.get("rendered")) return;
		setTimeout(function() {
			publish.call(plugin, true);
		}, 0);
	};
});

// TODO: avoid coherence between plugin components
plugin.events["Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRender"] = function(topic, args) {
	var plugin = this, item = this.component;
	var body = $(".echo-streamserver-bundledapps-stream-clientwidget-body", item.config.get("parent.target"));
	if (!body.data("isotope")) {
		plugin.set("rendered", true);
		return;
	}
	if (item.isRoot()) {
		if (!plugin.get("rendered") && !item.config.get("live")) {
			body.isotope("insert", item.config.get("target"));
		} else {
			publish.call(this, true);
		}
		plugin.set("rendered", true);
	} else {
		publish.call(this, true);
	}
};

})();

/**
 * @echo_renderer
 */
plugin.component.renderers.body = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("body", arguments);
	var filteredElements = plugin.config.get("mediaSelector")(item.get("data.object.content"));
	$(filteredElements.selector, item.view.get("text")).remove();
	var text = Utils.stripTags(item.get("data.object.content"));
	item.view.get("container").addClass(plugin._getCSSByLength(text.length));
	return element;
};

/**
 * @echo_renderer
 */
plugin.renderers.childBody = function(element) {
	var plugin = this, item = this.component;
	if (item.isRoot()) {
		return element.empty();
	}
	var text = Utils.htmlTextTruncate(
		Utils.stripTags(item.get("data.object.content")),
		plugin.config.get("maxChildrenBodyCharacters"),
		"..."
	);
	return element.empty().append(text);
};

/**
 * @echo_renderer
 */
plugin.renderers.media = function(element) {
	var plugin = this, item = this.component;
	var mediaItems = plugin.config.get("mediaSelector")(item.get("data.object.content"));
	if (mediaItems.length) {
		var config = $.extend(plugin.config.get("gallery"), {
			"target": element,
			"appkey": item.config.get("appkey"),
			"elements": mediaItems,
			"item": item
		});
		new MediaGallery(plugin.config.assemble(config));
	} else {
		element.hide();
	}
	return element;
};

plugin.methods._getCSSByLength = function(length) {
	var plugin = this, item = this.component;
	var handler = function(range, acc, className) {
		if (length >= range[0] && length < range[1]) {
			return (acc = className);
		}
	};
	return Utils.foldl("", plugin.config.get("itemCSSClassByContentLength"), handler);
};

/**
 * @echo_template
 */
plugin.templates.container =
	'<div class="{class:container}">' +
		'<div class="{class:header}">' +
			'<div class="{class:avatar-wrapper}">' +
				'<div class="{class:avatar}"></div>' +
			'</div>' +
			'<div class="{plugin.class:topContentWrapper}">' +
				'<div class="{class:authorName} echo-linkColor"></div>' +
				'<div class="{plugin.class:childBody}"></div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
		'<input type="hidden" class="{class:modeSwitch}">' +
		'<div class="echo-clear"></div>' +
		'<div class="{class:wrapper}">' +
			'<div class="{class:subcontainer}">' +
				'<div class="{class:data}">' +
					'<div class="{plugin.class:media}"></div>' + 
					'<div class="{class:body} echo-primaryColor"> ' + 
						'<span class="{class:text}"></span>' +
						'<span class="{class:textEllipses}">...</span>' +
						'<span class="{class:textToggleTruncated} echo-linkColor echo-clickable"></span>' +
					'</div>' +
				'</div>' +
				'<div class="{class:footer} echo-secondaryColor echo-secondaryFont">' +
					'<img class="{class:sourceIcon} echo-clickable">' +
					'<div class="{class:date}"></div>' +
					'<div class="{class:from}"></div>' +
					'<div class="{class:via}"></div>' +
					'<div class="{class:buttons}"></div>' +
					'<div class="echo-clear"></div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';

plugin.css =
	'.{plugin.class:media} { margin-top: 7px; text-align: center; }' +
	'.{plugin.class:topContentWrapper} { margin-left: 5px; padding-left: 35px; }' +
	'.{plugin.class:childBody} { float: none; display: inline; margin-left: 5px; }' +
	'.{plugin.class:childBody} a { text-decoration: none; font-weight: bold; color: #524D4D; }' +
	'.{plugin.class} .{class:container} { padding: 0px; }' +
	'.{plugin.class} .{class:content} { padding-bottom: 0px; background: white; box-shadow: 1px 1px 2px rgba(34, 25, 25, 0.4); margin: 0px 5px 15px 5px; border: 1px solid #D9D4D4; border-bottom: none; border-right: none; }' +
	'.{plugin.class} .{class:authorName} { float: none; display: inline; margin-left: 0px; }' +
	'.{plugin.class} .{class:body} { margin: 0px; }' +
	'.{plugin.class} .{class:avatar} { float: left; width: 30px; height: 30px; padding-right: 10px; }' +
	'.{plugin.class} .{class:depth-1} { margin-left: 0px; border-bottom: none; }' +
	'.{plugin.class} .{class:depth-1} .{class:authorName} { display: inline; font-size: 12px; }' +
	'.{plugin.class} .{class:depth-0} { padding: 15px 15px 10px 15px; }' +
	'.{plugin.class} .{class:depth-0} .{class:authorName} { font-size: 15px; margin-top: 4px; }' +
	'.{plugin.class} .{class:wrapper} { float: none; }' +
	'.{plugin.class} .{class:subcontainer} { float: none; }' +
	'.{plugin.class} .{class:date} { color: #C6C6C6; text-decoration: none; font-weight: normal; }' +
	'.{plugin.class} .{class:footer} a { color: #C6C6C6; text-decoration: none; font-weight: normal; }' +
	'.{plugin.class} .{class:footer} a:hover { text-decoration: underline; }' +
	'.{plugin.class} .{class:container} .{class:footer} { margin-top: 5px; }' +
	'.{plugin.class} .{class:children} .{class:header} { margin-left: 0px; }' +
	'.{plugin.class} .{class:smallSizeContent} .{class:body} { font-size: 18px; line-height: 25px; }' +
	'.{plugin.class} .{class:mediumSizeContent} .{class:body} { font-size: 16px; line-height: 22px; }' +
	'.{plugin.class} .{class:children} .{class:container} { background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:childrenByCurrentActorLive} .{class:container} { background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:children} .{class:wrapper}  { display: none; }' +
	'.{plugin.class} .{class:childrenByCurrentActorLive} .{class:wrapper} {display: none}' +
	'.{plugin.class} .{class:children} .{class:content} { box-shadow: none; margin: 0px; padding: 0px; border: none; border-bottom: 1px solid #d9d4d4; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:childrenByCurrentActorLive} .{class:content} { box-shadow: none; margin: 0px; padding: 0px; border: none; border-bottom: 1px solid #d9d4d4; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:container-child} { margin: 0px; padding: 10px 15px; }' +
	'.{plugin.class} .echo-linkColor { text-decoration: none; font-weight: bold; color: #524D4D; }' +
	'.{plugin.class} .echo-linkColor a { text-decoration: none; font-weight: bold; color: #524D4D; }' +
	'.{plugin.class} .{class:buttons} .echo-linkColor { font-weight: normal; color: #C6C6C6; }' +
	'.{plugin.class} .{class:buttons} .echo-linkColor:hover { font-weight: normal; color: #C6C6C6; }' +
	'.{plugin.class} .{class:expandChildren} .echo-message-icon { background-image: none; }' +
	'.{plugin.class} .{class:expandChildren} { border-bottom: 1px solid #D9D4D4; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:expandChildren} .{class:message-loading} { background-image: none; font-weight: bold; }' +
	'.{plugin.class} .{class:expandChildren} .{class:expandChildrenLabel} { padding-left: 0px; background-image: none; }' +
	// plugins styles
	'.{plugin.class} .{class:plugin-Like-likedBy} { margin-top: 5px; }' +
	'.{plugin.class} .{class:plugin-Reply-submitForm} { box-shadow: none; margin: 0px; border: none; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:plugin-Reply-compactForm} { box-shadow: none; margin: 0px; border: none; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-bundledapps-auth-clientwidget-name { font-size: 12px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-bundledapps-auth-clientwidget-logout { line-height: 24px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-bundledapps-submit-clientwidget-userInfoWrapper {  margin: 5px 0px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-bundledapps-submit-clientwidget-plugin-FormAuth-forcedLoginMessage { font-size: 13px; }' +
	'.{plugin.class} .{class:plugin-Moderation-status}  { width: 30px; clear: both; }' +
	'.{plugin.class} .{class:plugin-TweetDisplay-tweetUserName}, .{plugin.class} .{class:authorName} { float: none; word-wrap: normal; display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }' +
	'.{plugin.class} .{class:plugin-TweetDisplay-tweetUserName} { margin-left: 0px; }' +
	'.{class:plugin-TweetDisplay} .{plugin.class:childBody} { margin-left: 0; }' +

	// TODO: Remove this block after TwitterIntents removing
	'.{plugin.class} .{class:plugin-TwitterIntents-tweetUserName}, .{plugin.class} .{class:authorName} { float: none; word-wrap: normal; display: block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }' +
	'.{plugin.class} .{class:plugin-TwitterIntents-tweetUserName} { margin-left: 0px; }' +
	'.{class:plugin-TwitterIntents} .{plugin.class:childBody} { margin-left: 0; }' +

	((typeof document.createElement("div").style.boxShadow === "undefined")
		? '.{plugin.class} .{class:content} { border: 1px solid #d9d4d4; box-shadow: none; }'
		: '');
	
return Plugin.create(plugin);

});
