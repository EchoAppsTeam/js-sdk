Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/app",
	"loadFrom![echo/apps.sdk]echo/utils"
], function($, App, Utils) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget 
 * The MediaGallery application is used to display different media (pictures, video,
 * flash objects, etc). 
 *
 * @extends Echo.App
 *
 * @package streamserver/plugins/pinboard-visualization.js
 * @module
 */

var mediaGallery = App.definition("Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget");

/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRerender
 * Triggered when the app is rerendered.
 */

mediaGallery.labels = {
	"mediaIsNotAvailable": "<i>Media is not avaiable at this moment...</i>"
};

/**
 * @cfg {Number} resizeDuration
 * Duration of the resize animation media content
 *
 * @cfg {Array} elements
 * List of the jQuery elements which will be displayed (media content)
 *
 * @cfg {Object} item
 * An instance of the Echo.StreamServer.BundledApps.Stream.Item.ClientWidget object
 * which may use its state for some reasons (context, data, etc)
 *
 */
mediaGallery.config = {
	"resizeDuration": 250,
	"elements": [],
	"item": undefined,
	/**
	 * @cfg
	 * @inheritdoc
	 */
	"infoMessages": {
		"enabled": false,
		"layout": ""
	}
};

/**
 * @echo_template
 */
mediaGallery.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:thumbnails}">' +
			'<div class="{class:items}"></div>' +
		'</div>' +
		'<div class="{class:controls}"></div>' +
	'</div>';

/**
 * @echo_template
 */
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
		var isCurrentControl = (i === self.currentIndex);
		var itemContainer = $('<div></div>').append(element).addClass(itemClass);
		var showCurrentMedia = function() {
			/**
			 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onLoadMedia
			 * Triggered when corresponding media is loaded.
			 */
			i === self.currentIndex && itemContainer.css("display", "block") && publish("onLoadMedia");
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
				 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onResize
				 * Triggered when corresponding media is resized.
				 */
				publish("onResize");
			});
			currentItem.fadeOut(function() {
				itemContainer.fadeIn(function() {
					self.currentIndex = i;
					/**
					 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onChangeMedia
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
	if (this.elements.length === 1) {
		controlsContainer.hide();
	}
	return element;
};

// To avoid bugs with flash content when we show/hide it
// we should try fix it with wmode parameter if needed
mediaGallery.methods._normalizeFlashContent = function(element) {
	var tagName = element.get(0).tagName.toLowerCase();
	if (tagName === "iframe") {
		var parts = Utils.parseURL(element.attr("src") || "");
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
			"template": "{data:scheme}://{data:domain}{data:path}{data:query}{data:fragment}",
			"data": parts
		}));
	} else if (tagName === "embed") {
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
	'.{class:activeControl}, .{class:activeControl}:hover { background-color: #524d4d; }';

return App.create(mediaGallery);	

});
