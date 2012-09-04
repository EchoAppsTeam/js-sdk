(function(jQuery) {
"use strict";

var $ = jQuery;

var _isPreIE9 = function() {
	return ($.browser.msie && $.browser.version < 9 && document.documentMode && document.documentMode < 9);
};

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Item.MediaGallery 
 * The MediaGallery control is used to display different media (pictures, video,
 * flash objects, etc). 
 *
 * @extends Echo.Control
 */
if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream.Item.MediaGallery")) return;

var mediaGallery = Echo.Control.manifest("Echo.StreamServer.Controls.Stream.Item.MediaGallery");

mediaGallery.labels = {
	"mediaIsNotAvailable": "<i>Media is not avaiable at this moment...</i>"
};

mediaGallery.config = {
	"resizeDuration": 250,
	"elements": [],
	"item": undefined
};

mediaGallery.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:thumbnails}">' +
			'<div class="{class:items}"></div>' +
		'</div>' +
		'<div class="{class:controls}"></div>' +
	'</div>';

mediaGallery.templates.mediaError =
	'<span class="{class:itemErrorLoading}">{label:mediaIsNotAvailable}</span>';

/**
 * @echo_renderer
 */
mediaGallery.renderers.controls = function(element) {
	var self = this;
	var item = this.config.get("item");
	this.elements = this.config.get("elements");
	this.currentIndex = 0;
	var publish = function(topic) {
		self.events.publish({
			"topic": topic,
			"context": item ? item.config.get("context") : self.config.get("context")
		});
	};
	var controlsContainer = element;
	var itemsContainer = this.view.get("items");
	var itemClass = this.cssPrefix + "item";
	var controlClass = this.cssPrefix + "control";
	var activeControlClass = this.cssPrefix + 'activeControl';
	$.each(this.elements, function(i, element) {
		element = $(element);
		self._normalizeFlashContent(element);
		var ratio;
		var isCurrentControl = (i == self.currentIndex);
		var itemContainer = $('<div></div>').append(element).addClass(itemClass);
		var showCurrentMedia = function() {
			/**
			 * @event onLoadMedia
			 * @echo_event Echo.StreamServer.Controls.Stream.Item.MediaGallery.onLoadMedia
			 * Triggered when corresponding media is loaded.
			 */
			i == self.currentIndex && itemContainer.css("display", "block") && publish("onLoadMedia");
		};
		var controlContainer = $('<a href="#"></a>').addClass(controlClass);
		controlContainer.click(function() {
			var control = $(this);
			var currentItem = itemsContainer.children().eq(self.currentIndex);
			$("." + controlClass, controlsContainer).removeClass(activeControlClass);
			control.addClass(activeControlClass);
			itemsContainer.animate({
				"height": itemContainer.height()
			}, self.config.get("resizeDuration"), function() {
				/**
				 * @event onResize
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.MediaGallery.onResize
				 * Triggered when corresponding media is resized.
				 */
				publish("onResize");
			});
			currentItem.fadeOut(function() {
				itemContainer.fadeIn(function() {
					self.currentIndex = i;
					/**
					 * @event onChangeMedia
					 * @echo_event Echo.StreamServer.Controls.Stream.Item.MediaGallery.onChangeMedia
					 * Triggered when media is changed.
					 */
					publish("onChangeMedia");
				});
			});
			return false;
		});
		if (isCurrentControl) {
			controlContainer.addClass(activeControlClass);
		}
		element.one("error", function() {
			itemContainer.empty().append(self.substitute({"template": self.templates.mediaError}));
			showCurrentMedia();
		}).one("load", function() {
			self._loadMediaHandler(element, itemContainer);
			showCurrentMedia();
		});
		itemsContainer.append(itemContainer);
		controlsContainer.append(controlContainer);
	});
	if (this.elements.length == 1) {
		controlsContainer.hide();
	}
	return element;
};

// To avoid bugs with flash content when we show/hide it
// we should try fix it with wmode parameter if needed
mediaGallery.methods._normalizeFlashContent = function(element) {
	var tagName = element.get(0).tagName.toLowerCase();
	if (tagName == "iframe") {
		var parts = Echo.Utils.parseURL(element.attr("src") || "");
		if (!/(www\.)?youtube\.com/.test(parts.domain)) return;
		var query = parts.query;
		query = query && ~query.indexOf("wmode")
			? query.replace(/(wmode=)([^&?]+)/g, function($0, $1, $2) {
				if ($2 != "opaque" || $2 != "transparent") {
					return $1 + "opaque";
				}
			})
			: (query ? (query += "&wmode=opaque") : "wmode=opaque");
		parts.path = parts.path || "";
		parts.fragment = parts.fragment ? "#" + parts.fragment : "";
		parts.query = query ? "?" + query : "";
		element.attr("src", this.substitute({
			"template": "{Data:scheme}://{Data:domain}{Data:path}{Data:query}{Data:fragment}",
			"data": parts
		}));
	} else if (tagName == "embed") {
		var wmode = element.attr("wmode");
		if (wmode != "opaque" || wmode != "transparent") {
			element.attr("wmode", "opaque");
		}
	}
};

mediaGallery.methods._getHiddenElementDimensions = function(parent, element) {
	var dimensions;
	parent.css({
		"postion": "absolute",
		"visibility": "hidden",
		"display": "block"
	});
	dimensions = {
		"width": element.width(),
		"height": element.height()
	};
	parent.css({
		"postion": "",
		"visibility": "",
		"display": ""
	});
	return dimensions;
};

mediaGallery.methods._loadMediaHandler = function(element, elementContainer) {
	var self = this;
	var target = this.config.get("target");
	var viewportDimensions = {
		"width": target.width(),
		"height": target.width()
	};
	var getElementDimensions = function() {
		return !elementContainer.is(":visible")
			? self._getHiddenElementDimensions(elementContainer, element)
			: {
				"width": element.width(),
				"height": element.height()
			};
	};
	var ratio;
	var elementDimensions = getElementDimensions();
	if (elementDimensions.width > viewportDimensions.width) {
		ratio = viewportDimensions.width / elementDimensions.width;
		element.css({
			"width": viewportDimensions.width,
			"height": elementDimensions.height * ratio
		});
		elementDimensions = getElementDimensions();
	}
	if (elementDimensions.height > viewportDimensions.height) {
		ratio = viewportDimensions.height / elementDimensions.height;
		element.css({
			"width": elementDimensions.width * ratio,
			"height": viewportDimensions.height
		});
	}
};

mediaGallery.css =
	'.{class:thumbnails} { overflow: hidden; }' +
	'.{class:item} { width: 100%; display: none; }' +
	'.{class:controls} { text-align: center; margin-top: 10px; }' +
	'.{class:control} { display: inline-block; width: 8px; height: 8px; font-size: 0px; line-height: 8px; outline: none; border-radius: 4px; vertical-align: middle; margin-left: 8px; cursor: pointer; background-color: #c6c6c6; text-decoration: none; transition: all .2s ease-in 0; -moz-transition-property: all; -moz-transition-duration: .2s; -moz-transition-timing-function: ease-in; -moz-transition-delay: 0; -webkit-transition-property: all; -webkit-transition-duration: .2s; -webkit-transition-timing-function: ease-in; -webkit-transition-delay: 0; }' +
	'.{class:control}:hover { background-color: #ee7b11; }' +
	'.{class:activeControl}, .{class:activeControl}:hover { background-color: #524d4d; }' +
	(_isPreIE9() ? '.{class} { display: inline; zoom: 1; }' : '');

Echo.Control.create(mediaGallery);
	
})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.PinboardVisulization
 * The PinboardVisualization plugin transforms Stream.Item control into a
 * pinboard-style block.
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("PinboardVisualization", "Echo.StreamServer.Controls.Stream.Item");

plugin.init = function() {
	var self = this, item = this.component;
	this.extendTemplate("replace", "container", plugin.template);
};

plugin.dependencies = [{
	"loaded": function() { return !!Echo.jQuery().isotope; },
	"url": "sdk/third-party/jquery/jquery.isotope.min.js"
}];

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
	 * Allows to define the function with the custom rules for the media content
	 * extraction from the item content. The value of this parameter is function
	 * which accepts the item content (string) as a first argument and should
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
	 * might be applied to the item if the item text length satisfies several
	 * conditions simultaneously.
	 */
	"itemCSSClassByContentLength": {
		"echo-streamserver-controls-stream-item-smallSizeContent": [0, 69],
		"echo-streamserver-controls-stream-item-mediumSizeContent": [70, 120]
	},
	/**
	 * @cfg {Object} gallery
	 * Allows is a proxy for the mini media gallery class, initialized for the
	 * item in case the media content was found in its content.
	 */
	"gallery": {
		"resizeDuration": 250
	}
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"childrenMoreItems": "View more items..."
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.onRender": function(topic, args) {
		var plugin = this, item = this.component;
		var body = plugin._getStreamBody(item);
		if (!body.hasClass("isotope")) {
			plugin.set("rendered", true);
			return;
		}
		if (item.isRoot() && !plugin.get("rendered") && !item.config.get("live")) {
			body.isotope("insert", item.config.get("target"));
			plugin.set("rendered", true);
			return;
		}
		plugin._refreshView();
	}
};

$.map([ "Echo.StreamServer.Controls.Submit.onRender",
	"Echo.StreamServer.Controls.Submit.onEditError",
	"Echo.StreamServer.Controls.Submit.onEditComplete",
	"Echo.StreamServer.Controls.Stream.Item.onRerender",
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onExpand",
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Reply.onCollapse",
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onResize",
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onLoadMedia"], function(event) {
	plugin.events[event] = function(topic, args) {
		this._refreshView();
	};
});

plugin.events["Echo.StreamServer.Controls.Stream.Item.onDelete"] = function(topic, args) {
	var plugin = this, item = this.component;
	/**
	 * @event onChangeView
	 * @echo_event Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization.onChangeView
	 * Triggered if the view was changed.
	 */
	plugin.events.publish({
		"topic": "onChangeView",
		"data": {
			"action": "rerender",
			"priority": "high",
			"handler": function() { plugin._refreshView(); }
		},
		"context": item.config.get("parent.context")
	});
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

/**
 * @echo_renderer
 */
plugin.component.renderers.avatar = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("avatar", arguments);
	$(":first-child", element).css({
		"width": 30,
		"height": 30
	});
	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.container = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("container", arguments);
	if (plugin.get("rendered")) {
		element.queue("fx", function(next) {
			next();
			plugin._refreshView();
		});
		plugin.events.publish({
			"topic": "onChangeView",
			"data": {
				"action": "rerender",
				"priority": "high",
				"handler": function() { plugin._refreshView(); }
			},
			"context": item.config.get("parent.context")
		});
	}
	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.expandChildren = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("expandChildren", arguments);
	if (plugin.get("rendered")) {
		element.queue("fx", function(next) {
			next();
			plugin._refreshView();
		});
		plugin._refreshView();
	}
	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.body = function(element) {
	var plugin = this, item = this.component;
	element = item.parentRenderer("body", arguments);
	var filteredElements = plugin.config.get("mediaSelector")(item.get("data.object.content"));
	$(filteredElements.selector, item.view.get("text")).remove();
	var text = Echo.Utils.stripTags(item.get("data.object.content"));
	item.view.get("container").addClass(plugin._getCSSByLength(text.length));
	return element;
};

/**
 * @echo_renderer
 */
plugin.component.renderers.textToggleTruncated = function(element) {
	var plugin = this, item = this.component;
	return item.parentRenderer("textToggleTruncated", arguments).one('click', function() {
		plugin._refreshView();
	});
};

/**
 * @echo_renderer
 */
plugin.renderers.childBody = function(element) {
	var plugin = this, item = this.component;
	if (item.isRoot()) {
		return element.empty();
	}
	var text = Echo.Utils.htmlTextTruncate(
		item.get("data.object.content"),
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
		new Echo.StreamServer.Controls.Stream.Item.MediaGallery(config);
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
	return Echo.Utils.foldl("", plugin.config.get("itemCSSClassByContentLength"), handler);
};

plugin.methods._getStreamBody = function(item) {
	var stream = item.config.get("parent");
	return $(".echo-streamserver-controls-stream-body", stream.target);
};

plugin.methods._refreshView = function() {
	var plugin = this, item = this.component;
	var stream = plugin._getStreamBody(item);
	stream.isotope("reloadItems").isotope({"sortBy": "original-order"});
};

plugin.template =
	'<div class="{class:container}">' +
		'<div class="{class:header}">' +
			'<div class="{class:avatar}"></div>' +
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
	'.{plugin.class} .{class:content} { padding-bottom: 0px; background: white; box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4); margin: 0px 5px 15px 5px; border: none; }' +
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
	'.{plugin.class} .{class:expandChildren} .echo-message-icon { background-image: none; }' +
	'.{plugin.class} .{class:expandChildren} { border-bottom: 1px solid #D9D4D4; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:expandChildren} .{class:message-loading} { background-image: none; font-weight: bold; }' +
	'.{plugin.class} .{class:expandChildren} .{class:expandChildrenLabel} { padding-left: 0px; background-image: none; }' +
	// plugins styles
	'.{plugin.class} .{class:plugin-Like-likedBy} { margin-top: 5px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} { box-shadow: none; margin: 0px; border: none; background-color: #F2F0F0; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-identityserver-controls-auth-name { font-size: 12px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-identityserver-controls-auth-logout { line-height: 24px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-controls-submit-userInfoWrapper {  margin: 5px 0px; }' +
	'.{plugin.class} .{class:plugin-Reply-replyForm} .echo-streamserver-controls-submit-plugin-FormAuth-forcedLoginMessage { font-size: 13px; }' +
	(_isPreIE9() ? '.{plugin.class} .{class:content} { border: 1px solid #d9d4d4; box-shadow: none; }' : '');
	
Echo.Plugin.create(plugin);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization
 * The PinboardVisualization plugin transforms Echo Stream Client visualization
 * into a pinboard-style representation. The plugin extracts all media (such as
 * images, videos, etc) from the item content and assembles the mini media
 * gallery inside the item UI. You can find UI example of the plugin
 * <a href="http://echosandbox.com/use-cases/pinboard-visualization/">here</a>.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "PinboardVisualization"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("PinboardVisualization", "Echo.StreamServer.Controls.Stream");

plugin.config = {
	/**
	 * @cfg {Object} isotope
	 * Allows to configure the Isotope jQuery plugin, used by the plugin as the
	 * rendering engine. The possible config values can be found at the Isotope
	 * plugin homepage (http://isotope.metafizzy.co/). It's NOT recommended to
	 * change the settings of the Isotope unless it's really required.
	 */
	"isotope": {
		"animationOptions": {
			// change duration for mozilla browsers
			"duration": $.browser.mozilla || $.browser.msie ? 0 : 2750,
			"easing": "linear",
			"queue": false
		},
		// use only jQuery engine for animation in mozilla browsers
		// due to the issues with video display with CSS transitions
		"animationEngine": $.browser.mozilla || $.browser.msie ? "jquery" : "best-available"
	}
};

plugin.dependencies = [{
	"loaded": function() { return !!Echo.jQuery().isotope; },
	"url": "sdk/third-party/jquery/jquery.isotope.min.js"
}];

plugin.events = {
	"Echo.StreamServer.Controls.Stream.onRender": function(topic, args) {
		this._isotopeView();
	},
	"Echo.StreamServer.Controls.Stream.onRefresh": function(topic, args) {
		this._isotopeView();
	},
	"Echo.StreamServer.Controls.Stream.Item.Plugins.PinboardVisualization.onChangeView": function(topic, args) {
		var stream = this.component;
		var params = $.extend({}, args, {"item": stream.items[args.item.data.unique]});
		stream.queueActivity(params);
	}
};

plugin.methods._isotopeView = function() {
	var plugin = this, stream = this.component;
	stream.view.get("body").isotope(
		plugin.config.get("isotope")
	);
};

plugin.css = 
	'.{plugin.class} .isotope { -webkit-transition-property: height, width; -moz-transition-property: height, width; -o-transition-property: height, width; transition-property: height, width;  -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }' +
	'.{plugin.class} .isotope .isotope-item { -webkit-transition-property: -webkit-transform, opacity; -moz-transition-property: -moz-transform, opacity; -o-transition-property: top, left, opacity; transition-property:transform, opacity; -webkit-transition-duration: 0.8s; -moz-transition-duration: 0.8s; -o-transition-duration: 0.8s; transition-duration: 0.8s; }';

Echo.Plugin.create(plugin);

})(Echo.jQuery);

})(Echo.jQuery);
