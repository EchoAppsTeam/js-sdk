Echo.define([
	"jquery",
	"echo/utils",
	"echo/streamserver/base"
], function($, Utils, App) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.Item.ClientWidget
 * Echo Stream.Item application which encapsulates Item mechanics.
 *
 * @extends Echo.StreamServer.Base
 *
 * @package streamserver.pack.js
 *
 * @constructor
 * Item constructor initializing Echo.StreamServer.BundledApps.Stream.Item.ClientWidget class
 *
 * @param {Object} config
 * Configuration options
 */
var item = App.definition("Echo.StreamServer.BundledApps.Stream.Item.ClientWidget");

if (App.isDefined(item)) return;

/** @hide @cfg plugins */
/** @hide @cfg target */
/** @hide @method dependent */

/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRender
 * Triggered when the app is rendered.
 */

item.init = function() {
	this.timestamp = Utils.timestampFromW3CDTF(this.get("data.object.published"));
	this.ready();
};

item.config = {
	/**
	 * @cfg {Boolean} aggressiveSanitization
	 * If this parameter value is set to true, the entire item body will
	 * be replaced with the "I just shared this on Twitter..." text in the
	 * stream in case the item came from Twitter.
	 */
	"aggressiveSanitization": false,

	"buttonsOrder": undefined,

	/**
	 * @cfg {Object} contentTransformations
	 * Specifies the allowed item's content transformations for each content type.
	 * Contains a hash where keys are content types and values are arrays with
	 * formatting options enabled for the given content type. Available options are:
	 *
	 * + smileys - replaces textual smileys with images
	 * + hashtags - highlights hashtags in text
	 * + urls - highlights urls represented as plain text
	 * + newlines - replaces newlines with \<br> tags
	 */
	"contentTransformations": {
		"text": ["smileys", "urls", "newlines"],
		"html": ["smileys", "urls", "newlines"],
		"xhtml": ["smileys", "urls"]
	},

	/**
	 * @cfg {String} defaultAvatar
	 * Default avatar URL which will be used for the user in
	 * case there is no avatar information defined in the user
	 * profile. Also used for anonymous users.
	 */
	"defaultAvatar": Echo.require.toUrl("echo-assets/images/avatar-default.png"),

	/**
	 * @cfg {Object} limits
	 * Defines the limits for different metrics.
	 *
	 * @cfg {Number} [limits.maxBodyCharacters]
	 * Allows to truncate the number of characters of the body.
	 * The value of this parameter should be integer and represents the 
	 * number of visible characters that need to be displayed.
	 *
	 * @cfg {Number} [limits.maxBodyLines]
	 * Allows to truncate the number of lines of the body. The value of
	 * this parameter should be integer and represents the number of lines
	 * that need to be displayed. Note: the definition of "Line" here is the
	 * sequence of characters separated by the "End Of Line" character
	 * ("\n" for plain text or \<br> for HTML format).
	 *
	 * @cfg {Number} [limits.maxBodyLinkLength=50]
	 * Allows to truncate the number of characters of the hyperlinks in the
	 * item body. The value of this parameter should be integer and represents
	 * the number of visible characters that need to be displayed.
	 *
	 * @cfg {Number} [limits.maxMarkerLength=16]
	 * Allows to truncate the number of characters of markers in the item body.
	 * The value of this parameter should be integer and represents the number
	 * of visible characters that need to be displayed.
	 *
	 * @cfg {Number} [limits.maxReLinkLength=30]
	 * Allows to truncate the number of characters of hyperlinks in the "reTag"
	 * section of an item. The value of this parameter should be integer and
	 * represents the number of visible characters that need to be displayed.
	 *
	 * @cfg {Number} [limits.maxReTitleLength=143]
	 * Allows to truncate the number of characters of titles in "reTag" section
	 * of an item. The value of this parameter should be integer and represents
	 * the number of visible characters that need to be displayed.
	 *
	 * @cfg {Number} [limits.maxTagLength=16]
	 * Allows to truncate the number of characters of tags in the item body.
	 * The value of this parameter should be integer and represents the number
	 * of visible characters that need to be displayed.
	 */
	"limits": {
		"maxBodyCharacters": undefined,
		"maxBodyLines": undefined,
		"maxBodyLinkLength": 50,
		"maxMarkerLength": 16,
		"maxReLinkLength": 30,
		"maxReTitleLength": 143,
		"maxTagLength": 16
	},

	/**
	 * @cfg {Boolean} [optimizedContext=true]
	 * Allows to configure the context mode of the "reTag" section of an item.
	 * If set to true the context is turned into optimized mode. The "reTag" section
	 * contains only one hyperlink in this case (the same current domain is a priority).
	 * Otherwise all hyperlinks in the item body will be resolved and converted into reTags.
	 */
	"optimizedContext": true,

	/**
	 * @cfg {String} providerIcon
	 * Specifies the URL to the icon representing data provider.
	 */
	"providerIcon": Echo.require.toUrl("echo-assets/images/favicons/comments.png"),

	/**
	 * @cfg {Boolean} [reTag=true]
	 * Allows to show/hide the "reTag" section of an item.
	 */
	"reTag": true,

	/**
	 * @cfg {Object} [viaLabel]
	 * Allows to show/hide parts or the whole "via" tag. Contains a hash with two keys
	 * managing icon and text display modes.
	 *
	 * @cfg {Boolean} [viaLabel.icon=false]
	 *
	 * @cfg {Boolean} [viaLabel.text=false]
	 */
	"viaLabel": {
		"icon": false,
		"text": false
	},

	/**
	 * @cfg
	 * @inheritdoc
	 */
	"infoMessages": {
		"enabled": false,
		"layout": ""
	},
	"user": {
		"endpoints": {
			"logout": "https:{%=baseURLs.api.submissionproxy%}/v2/",
			"whoami": "https:{%=baseURLs.api.streamserver%}/v1/users/"
		}
	}
};

item.config.normalizer = {
	"contentTransformations": function(object) {
		$.each(object, function(contentType, options) {
			object[contentType] = Utils.foldl({}, options || [],
				function(option, acc) {
					acc[option] = true;
				}
			);
		});
		return object;
	}
};

item.vars = {
	"children": [],
	"depth": 0,
	"threading": false,
	"textExpanded": false,
	"timestamp": undefined,
	"blocked": false,
	"buttonsOrder": [],
	"buttonSpecs": {},
	"buttons": {}
};

item.labels = {
	/**
	 * @echo_label
	 */
	"defaultModeSwitchTitle": "Switch to metadata view",
	/**
	 * @echo_label
	 */
	"guest": "Guest",
	/**
	 * @echo_label
	 */
	"metadataModeSwitchTitle": "Return to default view",
	/**
	 * @echo_label
	 */
	"sharedThisOn": "I shared this on {service}...",
	/**
	 * @echo_label
	 */
	"userID": "User ID:",
	/**
	 * @echo_label
	 */
	"userIP": "User IP:",
	/**
	 * @echo_label
	 */
	"textToggleTruncatedMore": "more",
	/**
	 * @echo_label
	 */
	"textToggleTruncatedLess": "less",
	/**
	 * @echo_label
	 */
	"fromLabel": "from",
	/**
	 * @echo_label
	 */
	"viaLabel": "via",
	/**
	 * @echo_label
	 */
	"childrenMoreItems": "View more items",
	/**
	 * @echo_label
	 */
	"re": "Re",
	/**
	 * @echo_label today
	 */
	"today": "Today",
	/**
	 * @echo_label justNow
	 */
	"justNow": "Just now",
	/**
	 * @echo_label yesterday
	 */
	"yesterday": "Yesterday",
	/**
	 * @echo_label lastWeek
	 */
	"lastWeek": "Last Week",
	/**
	 * @echo_label lastMonth
	 */
	"lastMonth": "Last Month",
	/**
	 * @echo_label secondAgo
	 */
	"secondAgo": "{number} Second Ago",
	/**
	 * @echo_label secondsAgo
	 */
	"secondsAgo": "{number} Seconds Ago",
	/**
	 * @echo_label minuteAgo
	 */
	"minuteAgo": "{number} Minute Ago",
	/**
	 * @echo_label minutesAgo
	 */
	"minutesAgo": "{number} Minutes Ago",
	/**
	 * @echo_label hourAgo
	 */
	"hourAgo": "{number} Hour Ago",
	/**
	 * @echo_label hoursAgo
	 */
	"hoursAgo": "{number} Hours Ago",
	/**
	 * @echo_label dayAgo
	 */
	"dayAgo": "{number} Day Ago",
	/**
	 * @echo_label daysAgo
	 */
	"daysAgo": "{number} Days Ago",
	/**
	 * @echo_label weekAgo
	 */
	"weekAgo": "{number} Week Ago",
	/**
	 * @echo_label weeksAgo
	 */
	"weeksAgo": "{number} Weeks Ago",
	/**
	 * @echo_label monthAgo
	 */
	"monthAgo": "{number} Month Ago",
	/**
	 * @echo_label monthsAgo
	 */
	"monthsAgo": "{number} Months Ago"
};

item.templates.metadata = {
	/**
	 * @echo_template
	 */
	"userID":
		'<div class="{class:metadata-userID}">' +
			'<span class="{class:metadata-title} {class:metadata-icon}">' +
				'{label:userID}' +
			'</span>' +
			'<span class="{class:metadata-value}">{data:actor.id}</span>' +
		'</div>',
	/**
	 * @echo_template
	 */
	"userIP":
		'<div class="{class:metadata-userIP}">' +
			'<span class="{class:metadata-title} {class:metadata-icon}">' +
				'{label:userIP}' +
			'</span>' +
			'<span class="{class:metadata-value}">{data:ip}</span>' +
		'</div>'
};

/**
 * @echo_template
 */
item.templates.mainHeader =
	'<div class="{class:content}">' +
		'<div class="{class:container}">' +
			'<div class="{class:avatar-wrapper}">' +
				'<div class="{class:avatar}"></div>' +
			'</div>' +
			'<div class="{class:wrapper}">' +
				'<div class="{class:subwrapper}">' +
					'<div class="{class:subcontainer}">' +
						'<div class="{class:frame}">' +
							'<div class="{class:modeSwitch} echo-clickable"></div>' +
							'<div class="{class:authorName} echo-linkColor"></div>' +
							'<div class="echo-clear"></div>' +
							'<div class="{class:data}">' +
								'<div class="{class:re}"></div>' +
								'<div class="{class:body} echo-primaryColor"> ' +
									'<span class="{class:text}"></span>' +
									'<span class="{class:textEllipses}">...</span>' +
									'<span class="{class:textToggleTruncated} echo-linkColor echo-clickable"></span>' +
								'</div>' +
								'<div class="{class:markers} echo-secondaryFont echo-secondaryColor"></div>' +
								'<div class="{class:tags} echo-secondaryFont echo-secondaryColor"></div>' +
							'</div>' +
							'<div class="{class:metadata}"></div>' +
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
					'<div class="echo-clear"></div>' +
				'</div>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
			'<div class="{class:childrenMarker}"></div>' +
		'</div>';

/**
 * @echo_template
 */
item.templates.mainFooter =
		'<div class="{class:childrenByCurrentActorLive}"></div>' +
	'</div>';

/**
 * @echo_template
 */
item.templates.childrenTop =
	'<div class="{class:children}"></div>' +
	'<div class="{class:expandChildren} {class:container-child} echo-trinaryBackgroundColor echo-clickable">' +
		'<span class="{class:expandChildrenLabel} echo-app-message-icon"></span>' +
	'</div>';

/**
 * @echo_template
 */
item.templates.childrenBottom =
	'<div class="{class:expandChildren} {class:container-child} echo-trinaryBackgroundColor echo-clickable">' +
		'<span class="{class:expandChildrenLabel} echo-app-message-icon"></span>' +
	'</div>' +
	'<div class="{class:children}"></div>';

item.methods.template = function() {
	return this.templates.mainHeader +
	(this.config.get("parent.children.sortOrder") === "chronological"
		? this.templates.childrenTop
		: this.templates.childrenBottom
	) +
	this.templates.mainFooter;
};

/**
 * @echo_renderer
 */
item.renderers.authorName = function(element) {
	var author = this.get("data.actor.title") || this.labels.get("guest");
	return Utils.safelyExecute(element.html, author, element) || element;
};

/**
 * @echo_renderer
 */
item.renderers.markers = function(element) {
	return this.view.render({
		"name": "_extraField",
		"target": element,
		"extra": {"type": "markers"}
	});
};

/**
 * @echo_renderer
 */
item.renderers.tags = function(element) {
	return this.view.render({
		"name": "_extraField",
		"target": element,
		"extra": {"type": "tags"}
	});
};

/**
 * @echo_renderer
 */
item.renderers.container = function(element) {
	var self = this;
	element.removeClass(
		$.map(["child", "root", "child-thread", "root-thread"],	function(suffix) {
			return self.cssPrefix + "container-" + suffix;
		}).join(" ")
	);
	var suffix = this.threading ? "-thread" : "";
	var cssClass = this.depth
		? "container-child" + suffix + " echo-trinaryBackgroundColor"
		: "container-root" + suffix;
	element.addClass(
		this.cssPrefix + "depth-" + this.depth + " " +
		this.cssPrefix + cssClass
	);
	var switchClasses = function(action) {
		$.map(self.buttonsOrder, function(name) {
			var clickables = self.get("buttons." + name + ".clickableElements");
			if (!self.get("buttons." + name + ".element") || !clickables) return;
			clickables[action + "Class"]("echo-linkColor");
		});
	};
	if (!Utils.isMobileDevice()) {
		element.off(["mouseleave", "mouseenter"]).hover(function() {
			if (self.user.is("admin")) {
				self.view.get("modeSwitch").show();
			}
			switchClasses("add");
		}, function() {
			if (self.user.is("admin")) {
				self.view.get("modeSwitch").hide();
			}
			switchClasses("remove");
		});
	}
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.metadata = function(element) {
	element.empty();
	if (this.user.is("admin")) {
		var view = this.view.fork();
		var addSection = function(section) {
			element.append(view.render({
				"template": item.templates.metadata[section]
			}));
		};
		addSection("userID");
		if (this.get("data.ip")) {
			addSection("userIP");
		}
	}
	return element.hide();
};

/**
 * @echo_renderer
 */
item.renderers.modeSwitch = function(element) {
	var self = this;
	element.hide();
	if (!this.user.is("admin")) {
		return element;
	}
	var mode = "default";
	var setTitle = function(el) {
		element.attr("title", self.labels.get(mode + "ModeSwitchTitle"));
	};
	setTitle();
	element.click(function() {
		mode = (mode === "default" ? "metadata" : "default");
		setTitle();
		self.view.get("data").toggle();
		self.view.get("metadata").toggle();
	});
	if (Utils.isMobileDevice()) {
		element.show();
	}
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.wrapper = function(element) {
	return element.addClass(this.cssPrefix + "wrapper" + (this.depth ? "-child" : "-root"));
};

/**
 * @echo_renderer
 */
item.renderers.avatar = function(element) {
	Utils.placeImage({
		"container": element,
		"image": this.get("data.actor.avatar"),
		"defaultImage": this.config.get("defaultAvatar")
	});
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.children = function(element, config) {
	return this.view.render({
		"name": "_childrenContainer",
		"target": element,
		"extra": {
			"filter": function(item) { return !item.byCurrentUser; },
			"keepChildren": config && config.keepChildren
		}
	});
};

/**
 * @echo_renderer
 */
item.renderers.childrenByCurrentActorLive = function(element, config) {
	return this.view.render({
		"name": "_childrenContainer",
		"target": element,
		"extra": {
			"filter": function(item) { return item.byCurrentUser; },
			"keepChildren": config && config.keepChildren
		}
	});
};

/**
 * @echo_renderer
 */
item.renderers.buttons = function(element) {
	var self = this;
	this._assembleButtons();
	this._sortButtons();
	element.empty();
	$.map(this.buttonsOrder, function(name) {
		var data = self.get("buttons." + name);
		if (!data || !data.name || !data.visible()) {
			return;
		}
		self.view.render({
			"name": "_buttonsDelimiter",
			"target": element
		});
		self.view.render({
			"name": "_button",
			"target": element,
			"extra": data
		});
	});
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.re = function(element) {
	var self = this;
	if (!this.config.get("reTag") || this.depth) {
		return element.hide();
	}

	// TODO: use normalized permalink and location instead
	var pageHref = document.location.href;
	var context = this.get("data.object.context");
	var permalink = this.get("data.object.permalink");
	if (permalink === pageHref || !context || !context.length) {
		return element.hide();
	}

	var fromCurrentPage = false;
	$.map(context, function(ctx) {
		// TODO: use normalized uri here
		if (ctx.uri === pageHref) {
			fromCurrentPage = true;
			return false; // break
		}
	});
	if (fromCurrentPage) return element.hide();

	var re;
	var config = {
		"limits": this.config.get("limits"),
		"openLinksInNewWindow": this.config.get("parent.openLinksInNewWindow")
	};
	var pageDomain = this._getDomain(pageHref);

	if (this.config.get("optimizedContext")) {
		var primary;
		$.map(context, function(ctx) {
			if (self._getDomain(ctx.uri) === pageDomain) {
				primary = ctx;
				return false; // break
			}
		});
		re = this._reOfContext(primary || context[0], config);
	} else {
		re = $.map(context, function(ctx) {
			return self._reOfContext(ctx, config);
		});
	}
	return element.empty().append(re).show();
};

/**
 * @echo_renderer
 */
item.renderers.sourceIcon = function(element) {
	if (!this.config.get("viaLabel.icon") ||
			this.get("data.source.name") === "jskit" ||
			this.get("data.source.name") === "echo") {
		return element.hide();
	}
	var url = this.get("data.source.icon", this.config.get("providerIcon"));
	var data = {"href": this.get("data.source.uri", this.get("data.object.permalink"))};
	var config = {"openInNewWindow": this.config.get("parent.openLinksInNewWindow")};
	element.hide()
		.attr("src", Utils.htmlize(url))
		.one("error", function() { element.hide(); })
		.one("load", function() {
			element.show().wrap(Utils.hyperlink(data, config));
		});
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.via = function(element) {
	var self = this;
	var get = function(field) {
		return (self.data[field].name || "").toLowerCase();
	};
	if (get("source") === get("provider")) {
		return element;
	}
	return this.view.render({
		"name": "_viaText",
		"target": element,
		"extra": {
			"label": "via",
			"field": "provider"
		}
	});
};

/**
 * @echo_renderer
 */
item.renderers.from = function(element) {
	return this.view.render({
		"name": "_viaText",
		"target": element,
		"extra": {
			"label": "from",
			"field": "source"
		}
	});
};

/**
 * @echo_renderer
 */
item.renderers.textToggleTruncated = function(element) {
	var self = this;
	element.off("click").click(function() {
		self.textExpanded = !self.textExpanded;
		self.view.render({"name": "body"});
		self.view.render({"name": "textToggleTruncated"});
	});
	return element.empty().append(
		this.labels.get("textToggleTruncated" + (this.textExpanded ? "Less" : "More"))
	);
};

/**
 * @echo_renderer
 */
item.renderers.body = function(element) {
	var self = this;
	var data = [this.get("data.object.content"), {
		"source": this.get("data.source.name"),
		"limits": this.config.get("limits"),
		"contentTransformations": this.config.get("contentTransformations." + this.get("data.object.content_type"), {}),
		"openLinksInNewWindow": this.config.get("parent.openLinksInNewWindow")
	}];
	$.each(this._getBodyTransformations(), function(i, trasformation) {
		data = trasformation.apply(self, data);
		if (!/\S/.test(data[0])) {
			data[0] = self.labels.get("sharedThisOn", {"service": data[1].source});
			return false;
		}
	});
	var text = data[0];
	var truncated = data[1].truncated;
	var textElement = this.view.get("text").empty();
	Utils.safelyExecute(textElement.append, text, textElement);
	this.view.get("textEllipses")[!truncated || this.textExpanded ? "hide" : "show"]();
	this.view.get("textToggleTruncated")[truncated || this.textExpanded ? "show" : "hide"]();
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.date = function(element) {
	// is used to preserve backwards compatibility
	var self = this;
	this.age = this.getRelativeTime();
	return element.html(this.age);
};

/**
 * @echo_renderer
 */
item.renderers.expandChildrenLabel = function(element, extra) {
	if (!this.children.length || !this.hasMoreChildren()) {
		return element;
	}
	extra = extra || {};
	extra.state = extra.state || "regular";
	var states = {
		"loading": {
			"css": this.cssPrefix + "message-loading",
			"label": "loading"
		},
		"regular": {
			"css": "echo-linkColor echo-app-message-icon",
			"label": "childrenMoreItems"
		}
	};
	return element
		.removeClass(states[extra.state === "loading" ? "regular" : "loading"].css)
		.addClass(states[extra.state].css)
		.html(this.labels.get(states[extra.state].label));
};

/**
 * @echo_renderer
 */
item.renderers.expandChildren = function(element, extra) {
	var self = this;
	if (!this.children.length) {
		return element;
	}
	if (!this.hasMoreChildren()) {
		element.slideUp(this.config.get("children.moreButtonSlideTimeout"));
		return element;
	}
	extra = extra || {};

	return element.addClass(this.cssPrefix + "depth-" + (this.depth + 1))
		.show()
		.off("click")
		.one("click", function() {
			self.view.render({
				"name": "expandChildrenLabel",
				"target": self.view.get("expandChildrenLabel"),
				"extra": {"state": "loading"}
			});
			/**
			 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onChildrenExpand
			 * Triggered when the children block is expanded.
			 */
			self.events.publish({
				"topic": "onChildrenExpand",
				"data": {"data": self.data},
				"global": false,
				"propagation": false
			});
		});
};

item.renderers._childrenContainer = function(element, config) {
	// we cannot use element.empty() because it will remove children's event handlers
	$.each(element.children(), function(i, child) {
		$(child).detach();
	});
	$.map(this.children, function(child) {
		if (config && config.filter && !config.filter(child)) return;
		element.append(child.config.get("target"));
		if (!child.view.rendered() && !child.added) {
			child.render();
		}
		if (child.deleted || child.added) {
			/**
			 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onDelete
			 * Triggered when the child item is deleted.
			 */
			/**
			 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onAdd
			 * Triggered when the child item is added.
			 */
			child.events.publish({
				"topic": child.deleted ? "onDelete" : "onAdd",
				"data": {"config": config},
				"global": false,
				"propagation": false
			});
		}
	});
	return element;
};

item.renderers._extraField = function(element, extra) {
	var self = this;
	var type = (extra || {}).type;
	if (!this.data.object[type] || !this.user.is("admin")) {
		return element.hide();
	}
	var name = type === "markers" ? "maxMarkerLength" : "maxTagLength";
	var limit = this.config.get("limits." + name);
	var items = Utils.foldl([], this.data.object[type], function(item, acc) {
		var template = item.length > limit
			? '<span title="{data:item}">{data:truncatedItem}</span>'
			: '<span>{data:item}</span>';
		var truncatedItem = Utils.htmlTextTruncate(item, limit, "...");
		acc.push(self.substitute({
			"template": template,
			"data": {"item": item, "truncatedItem": truncatedItem}
		}));
	});
	return (
		Utils.safelyExecute(
			element.prepend,
			items.sort().join(", "),
			element
		) || element).show();
};

item.renderers._button = function(element, extra) {
	var template = extra.template ||
		'<a class="{class:button} {class:button}-{data:name}">{data:label}</a>';
	var data = {
		"label": extra.label || "",
		"name": extra.name
	};
	var button = $(this.substitute({"template": template, "data": data}));
	if (!extra.clickable) return element.append(button);

	var clickables = $(".echo-clickable", button);
	if (!clickables.length) {
		clickables = button;
		button.addClass("echo-clickable");
	}
	clickables[extra.once ? "one" : "on"]({
		"click": function(event) {
			event.stopPropagation();
			if (extra.callback) extra.callback();
		}
	});
	var data = this.get("buttons." + extra.plugin + "." + extra.name);
	data.element = button;
	data.clickableElements = clickables;
	if (Utils.isMobileDevice()) {
		clickables.addClass("echo-linkColor");
	}
	return element.append(button);
};

item.renderers._buttonsDelimiter = function(element) {
	return element.append('<span class="' + this.cssPrefix + 'button-delim"> \u00b7 </span>');
};

item.renderers._viaText = function(element, extra) {
	extra = extra || {};
	var data = this.data[extra.field];
	if (!this.config.get("viaLabel.text") ||
			!data.name ||
			data.name === "jskit" ||
			data.name === "echo") {
		return element;
	}
	var a = Utils.hyperlink({
		"class": "echo-secondaryColor",
		"href": data.uri || this.get("data.object.permalink"),
		"caption": data.name
	}, {
		"openInNewWindow": this.config.get("parent.openLinksInNewWindow")
	});
	return element.html("&nbsp;" + this.labels.get(extra.label + "Label") + "&nbsp;").append(a);
};

/**
 * Method checking if the item has more children.
 *
 * @return {Boolean}
 */
item.methods.hasMoreChildren = function() {
	return this.get("data.hasMoreChildren") === "true";
};

/**
 * Accessor method to get the correct `pageAfter` property value
 * according to the defined `sortOrder`.
 *
 * return {String}
 */
item.methods.getNextPageAfter = function() {
	var children = $.grep(this.children, function(child) {
		return !child.config.get("live");
	});
	var index = this.config.get("parent.children.sortOrder") === "chronological"
		? children.length - 1
		: 0;
	return children.length
		? children[index].data.pageAfter
		: undefined;
};

/**
 * Method to calculate the relative time of the item's timestamp
 *
 * @return {String}
 * String which represents item's timestamp in the relative format
 * using default labels as a pattern.
 */
item.methods.getRelativeTime = function() {
	var diff = Utils.getRelativeTimeDiff(this.timestamp);
	var key = diff.unit
		? diff.unit + (diff.value === 1 ? "" : "s") + "Ago"
		: diff.value;
	return this.labels.get(key, {"number": diff.value});
};

/**
 * Method implementing the children tree traversal
 *
 * @param {Array} tree
 * List of nodes to traverse through.
 *
 * @param {Function} callback
 * Callback function to be applied to the tree node.
 *
 * @param {Array} acc
 * Accumulator.
 *
 * @return {Array}
 * Acumulator.
 */
item.methods.traverse = function(tree, callback, acc) {
	var self = this;
	$.each(tree || [], function(i, item) {
		acc = self.traverse(item.children, callback, callback(item, acc));
	});
	return acc;
};

/**
 * Method which blocks the particular item during data processing.
 * For example while changing its status.
 *
 * @param {String} label
 * Text label to be shown as a block message
 */
item.methods.block = function(label) {
	if (this.blocked) return;
	this.blocked = true;
	var content = this.view.get("container");
	var width = content.width();
	// we should take into account that the container has a 10px 0px padding value
	var height = content.outerHeight();
	this.blockers = {
		"backdrop": $('<div class="' + this.cssPrefix + 'blocker-backdrop"></div>').css({
			"width": width, "height": height
		}),
		"message": $(this.substitute({
			"template": '<div class="{class:blocker-message}">{data:label}</div>',
			"data": {"label": label}
		})).css({
			"left": ((parseInt(width) - 200)/2) + 'px',
			"top": ((parseInt(height) - 20)/2) + 'px'
		})
	};
	content.addClass("echo-relative")
		.prepend(this.blockers.backdrop)
		.prepend(this.blockers.message);
};

/**
 * Method which unblocks the particular blocked item.
 */
item.methods.unblock = function() {
	if (!this.blocked) return;
	this.blocked = false;
	this.blockers.backdrop.remove();
	this.blockers.message.remove();
	this.view.get("container").removeClass("echo-relative");
};

/**
 * Accessor method to get the item accumulator value by type.
 *
 * @param {String} type
 * Accumulator type.
 *
 * @return {String}
 * Accumulator value.
 */
item.methods.getAccumulator = function(type) {
	return this.data.object.accumulators[type];
};

/**
 * Method to check if item is a root one.
 *
 * @return {Boolean}
 */
item.methods.isRoot = function() {
	return !this.config.get("parent.children.maxDepth") ||
		this.get("data.object.id") === this.get("data.target.conversationID");
};

/**
 * Method to add the item application button specification.
 *
 * @param {String} plugin
 * Plugin name.
 *
 * @param {Function} spec
 * Function describing the application specification.
 */
item.methods.addButtonSpec = function(plugin, spec) {
	if (!this.buttonSpecs[plugin]) {
		this.buttonSpecs[plugin] = [];
	}
	this.buttonSpecs[plugin].push(spec);
};

item.methods._getDomain = function(url) {
	var parts = Utils.parseURL(url);
	return parts && parts.domain ? parts.domain : url;
};

item.methods._reOfContext = function(context, config) {
	var title = context.title || context.uri.replace(/^https?:\/\/(.*)/ig, '$1');
	var maxLength = config.limits[title ? "maxReTitleLength" : "maxReLinkLength"];
	if (title.length > maxLength) {
		title = title.substring(0, maxLength) + "...";
	}
	var hyperlink = Utils.hyperlink({
		"class": "echo-primaryColor",
		"href": context.uri,
		"caption": this.labels.get("re") + ": " + Utils.stripTags(title)
	}, {
		"openInNewWindow": config.openLinksInNewWindow
	});
	return $(this.substitute({
		"template": '<div class="{class:re-container}">{data:hyperlink}</div>',
		"data": {"hyperlink": hyperlink}
	}));
};

item.methods._prepareEventParams = function(params) {
	return $.extend(params, {
		"target": this.config.get("parent.target").get(0),
		"query": this.config.get("parent.query"),
		"item": {
			"data": this.data,
			"target": this.config.get("target").get(0)
		}
	});
};

var _smileys = {
	"codes": [],
	"regexps": [],
	"hash": {
		":)": {file: "smile.png", title: "Smile"},
		":-)": {file: "smile.png", title: "Smile"},
		";)": {file: "wink.png", title: "Wink"},
		";-)": {file: "wink.png", title: "Wink"},
		":(": {file: "unhappy.png", title: "Frown"},
		":-(": {file: "unhappy.png", title: "Frown"},
		"=-O": {file: "surprised.png", title: "Surprised"},
		":-D": {file: "grin.png", title: "Laughing"},
		":-P": {file: "tongue.png", title: "Tongue out"},
		"=)": {file: "happy.png", title: "Happy"},
		"B-)": {file: "evilgrin.png", title: "Evil grin"}
	}
};

item.methods._initSmileysConfig = function() {
	var self = this;
	if (_smileys.codes.length) {
		return _smileys;
	}
	var esc = function(v) { return v.replace(/([\W])/g, "\\$1"); };
	var escapedCodes = [];
	$.each(_smileys.hash, function(code) {
		var escaped = esc(code);
		escapedCodes.push(escaped);
		_smileys.codes.push(code);
		_smileys.regexps[code] = new RegExp(escaped, "g");
	});
	_smileys.regexps.test = new RegExp(escapedCodes.join("|"));
	_smileys.tag = function(smiley) {
		return self.substitute({"template": '<img class="{class:smiley-icon}" src="' + Echo.require.toUrl("echo-assets/images/smileys/emoticon_" + smiley.file) + '" title="' + smiley.title + '" alt="' + smiley.title + '">'});
	};
	return _smileys;
};

item.methods._assembleButtons = function() {
	var self = this;
	var buttonsOrder = [];
	$.each(this.buttonSpecs, function(plugin, specs) {
		$.map(specs, function(spec) {
			var data = $.isFunction(spec)
				? spec.call(self)
				: $.extend({}, spec);
			if (!data.name) return;
			var callback = data.callback || function() {};
			data.callback = function() {
				callback.call(self);
				/**
				 * @echo_event Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onButtonClick
				 * Triggered when the item application button is clicked.
				 */
				self.events.publish({
					"topic": "onButtonClick",
					"data": {
						"name": data.name,
						"plugin": plugin,
						"item": {
							"data": self.data,
							"target": self.config.get("target")
						}
					}
				});
			};
			data.label = data.label || data.name;
			data.plugin = plugin;
			if (typeof data.clickable === "undefined") {
				data.clickable = true;
			}
			if (typeof data.visible === "undefined") {
				data.visible = true;
			}
			var visible = data.visible;
			data.visible = $.isFunction(visible)
				? visible
				: function() { return visible; };
			var name = plugin + "." + data.name;
			self.set("buttons." + name, data);
			if ($.inArray(name, self.buttonsOrder) < 0) {
				buttonsOrder.push(name);
			}
		});
	});
	// keep correct order of plugins and buttons
	self.buttonsOrder = buttonsOrder.concat(self.buttonsOrder);
};

item.methods._sortButtons = function() {
	var self = this;
	var defaultOrder = this.buttonsOrder;
	var requiredOrder = this.config.get("buttonsOrder");
	// if buttons order is not specified in application config, use default order
	if (!requiredOrder) {
		this.config.set("buttonsOrder", defaultOrder);
	} else if (requiredOrder != defaultOrder) {
		var push = function(name, acc, pos) {
			if (!self.get("buttons." + name)) return;
			acc.push(name);
			pos = pos || $.inArray(name, defaultOrder);
			if (pos >= 0) {
				delete defaultOrder[pos];
			}
		};
		var order = Utils.foldl([], requiredOrder, function(name, acc) {
			if (/^(.*)\./.test(name)) {
				push(name, acc);
			} else {
				var re = new RegExp("^" + name + "\.");
				$.map(defaultOrder, function(n, i) {
					if (n && n.match(re)) {
						push(n, acc, i);
					}
				});
			}
		});
		this.buttonsOrder = order;
		this.config.set("buttonsOrder", order);
	// if application config tells not to use buttons
	} else if (!requiredOrder.length) {
		this.buttonsOrder = [];
	}
};

(function() {
	item.methods._getBodyTransformations = function() {
		return [
			_aggressiveSanitization,
			_replaceLinkedHashtags,
			_tags2meta,
			_replacePlainHashtags,
			_autoLinking,
			_replaceSmileys,
			_replaceNewLines,
			_meta2tags,
			_normalizeLinks,
			_applyLimits
		];
	};

	var _urlMatcher = "((?:http|ftp|https):\\/\\/(?:[a-z0-9#:\\/\\;\\?\\-\\.\\+,@&=%!\\*\\'(){}\\[\\]$_|^~`](?!gt;|lt;))+)";

	var _wrapTag = function(tag, limits) {
		var template = tag.length > limits.maxTagLength
			? '<span class="{class:tag}" title="{data:tag}">{data:truncatedTag}</span>'
			: '<span class="{class:tag}">{data:tag}</span>';
		var truncatedTag = tag.substring(0, limits.maxTagLength) + "...";
		return this.substitute({
			"template": template,
			"data": {"tag": tag, "truncatedTag": truncatedTag}
		});
	};

	var _aggressiveSanitization = function(text, extra) {
		if (extra.source && extra.source === "Twitter" && this.config.get("aggressiveSanitization")) {
			text = "";
		}
		return [text, extra];
	};

	var _replaceLinkedHashtags = function(text, extra) {
		var self = this;
		if (extra.contentTransformations.hashtags) {
			text = text.replace(/(?:#|\uff03)(<a[^>]*>[^<]*<\/a>)/ig, function($0, $1, $2){
				return _wrapTag.call(self, $1, extra.limits);
			});
		}
		return [text, extra];
	};

	var _replacePlainHashtags = function(text, extra) {
		var self = this;
		if (extra.contentTransformations.hashtags) {
			text = text.replace(/(^|[^\w&\/])(?:#|\uff03)([^\s\.,;:'"#@\$%<>!\?\(\)\[\]]+)/ig, function($0, $1, $2) {
				return $1 + _wrapTag.call(self, $2, extra.limits);
			});
		}
		return [text, extra];
	};

	var _tags2meta = function(text, extra) {
		var self = this, tags = [];
		text = text.replace(/((<a\s+[^>]*>)(.*?)(<\/a>))|<.*?>/ig, function($0, $1, $2, $3, $4) {
			//we are cutting and pushing <a> tags to acc to avoid potential html issues after autolinking
			if ($1) {
				var data = _tags2meta.call(self, $3, extra);
				data = _replacePlainHashtags.apply(self, data);
				data = _meta2tags.apply(self, data);
				$0 = $2 + data[0] + $4;
			}
			tags.push($0);
			return " %%HTML_TAG%% ";
		});
		extra.tags = tags;
		return [text, extra];
	};

	var _meta2tags = function(text, extra) {
		$.each(extra.tags, function(i, v) {
			text = text.replace(" %%HTML_TAG%% ", v);
		});
		return [text, extra];
	};

	var _normalizeLinks = function(text, extra) {
		text = text.replace(/(<a\s+[^>]*>)(.*?)(<\/a>)/ig, function($0, $1, $2, $3) {
			if (new RegExp("^" + _urlMatcher + "$", "i").test($2)) {
				$2 = $2.length > extra.limits.maxBodyLinkLength ? $2.substring(0, extra.limits.maxBodyLinkLength) + "..." : $2;
			}
			if (extra.openLinksInNewWindow && !/\s+target=("[^<>"]*"|'[^<>']*'|\w+)/.test($1)) {
				$1 = $1.replace(/(^<a\s+[^>]*)(>$)/, '$1 target="_blank"$2');
			}
			return $1 + $2 + $3;
		});
		return [text, extra];
	};

	var _autoLinking = function(text, extra) {
		extra.textBeforeAutoLinking = text;
		var self = this, url;
		if (extra.source && extra.source !== "jskit" && extra.source !== "echo") {
			url = this.depth
				? this.get("data.target.id")
				: this.config.get("reTag")
					? this.get("data.object.permalink") || this.get("data.target.id")
					: undefined;
		}
		text = text.replace(new RegExp(_urlMatcher, "ig"), function($0, $1) {
			// cut out URL to current item
			if (url === $1) return "";
			if (!extra.contentTransformations.urls) return $0;
			return Utils.hyperlink({
				"href": $1,
				"caption": $1
			}, {
				"skipEscaping": true,
				"openInNewWindow": extra.openLinksInNewWindow
			});
		});
		return [text, extra];
	};

	var _replaceSmileys = function(text, extra) {
		if (extra.contentTransformations.smileys) {
			if (text !== extra.textBeforeAutoLinking) {
				var data = _meta2tags.call(this, text, extra);
				data = _tags2meta.apply(this, data);
				text = data[0];
				extra = data[1];
			}
			var smileys = this._initSmileysConfig();
			if (text.match(smileys.regexps.test)) {
				$.each(smileys.codes, function(i, code) {
					text = text.replace(smileys.regexps[code], smileys.tag(smileys.hash[code]));
				});
			}
		}
		return [text, extra];
	};

	var _replaceNewLines = function(text, extra) {
		if (extra.contentTransformations.newlines) {
			text = text.replace(/\n\n+/g, "\n\n");
			text = text.replace(/\n/g, "&nbsp;<br>");
		}
		return [text, extra];
	};

	var _applyLimits = function(text, extra) {
		var truncated = false;
		if ((extra.limits.maxBodyCharacters || extra.limits.maxBodyLines) && !this.textExpanded) {
			if (extra.limits.maxBodyLines) {
				var splitter = extra.contentTransformations.newlines ? "<br>" : "\n";
				var chunks = text.split(splitter);
				if (chunks.length > extra.limits.maxBodyLines) {
					text = chunks.splice(0, extra.limits.maxBodyLines).join(splitter);
					truncated = true;
				}
			}
			var limit = extra.limits.maxBodyCharacters && text.length > extra.limits.maxBodyCharacters
				? extra.limits.maxBodyCharacters
				: truncated
					? text.length
					: undefined;
			// we should call Utils.htmlTextTruncate to close all tags
			// which might remain unclosed after lines truncation
			var truncatedText = Utils.htmlTextTruncate(text, limit, "", true);
			if (truncatedText.length !== text.length) {
				truncated = true;
			}
			text = truncatedText;
		}
		extra.truncated = truncated;
		return [text, extra];
	};
})();

var itemDepthRules = [];
// 100 is a maximum level of children in query, but we can apply styles for ~20
for (var i = 0; i <= 20; i++) {
	itemDepthRules.push('.{class:depth}-' + i + ' { margin-left: ' + (i ? 68 + (i - 1) * 44 : 0) + 'px; }');
}

item.css =
	'.{class:content} { word-wrap: break-word; }' +
	'.{class:container-root} { padding: 10px 0px 10px 10px; }' +
	'.{class:container-root-thread} { padding: 10px 0px 0px 10px; }' +
	'.{class:container-child} { padding: 10px; margin: 0px 20px 2px 0px; }' +
	'.{class:container-child-thread} { padding: 10px; margin: 0px 20px 2px 0px; }' +
	'.{class:avatar-wrapper} { margin-right: -58px; float: left; position: relative; }' +
	'.{class:children} .{class:avatar-wrapper}, .{class:childrenByCurrentActorLive} .{class:avatar-wrapper} { margin-right: -34px; }' +
	'.{class:children} .{class:subwrapper}, .{class:childrenByCurrentActorLive} .{class:subwrapper} { margin-left: 34px; }' +
	'.{class:wrapper} { float: left; width: 100%; }' +
	'.{class:subwrapper} { margin-left: 58px; }' +
	'.{class:subcontainer} { float: left; width: 100%; }' +
	'.{class:markers} { line-height: 16px; background: url("' + Echo.require.toUrl("echo-assets/images/curation/metadata/marker.png") + '") no-repeat; padding: 0px 0px 4px 21px; margin-top: 7px; }' +
	'.{class:tags} { line-height: 16px; background: url("' + Echo.require.toUrl("echo-assets/images/tag_blue.png") + '") no-repeat; padding: 0px 0px 4px 21px; }' +
	'.{class:metadata-title} { font-weight: bold; line-height: 25px; height: 25px; margin-right: 5px; }' +
	'.{class:metadata-icon} { display: inline-block; padding-left: 26px; }' +
	'.{class:metadata-userID} { border-bottom: 1px solid #e1e1e1; border-top: 1px solid #e1e1e1;}' +
	'.{class:metadata-userID} .{class:metadata-icon} { background: url("' + Echo.require.toUrl("echo-assets/images/curation/metadata/user.png") + '") no-repeat left center; }' +
	'.{class:metadata-userIP} { border-bottom: 1px solid #e1e1e1; }' +
	'.{class:metadata-userIP} .{class:metadata-icon} { background: url("' + Echo.require.toUrl("echo-assets/images/curation/metadata/computer.png") + '") no-repeat left center; }' +
	'.{class:modeSwitch} { float: right; width: 16px; height: 16px; background:url("' + Echo.require.toUrl("echo-assets/images/curation/metadata/flip.png") + '") no-repeat 0px 3px; }' +
	'.{class:childrenMarker} { border-color: transparent transparent #ECEFF5; border-width: 0px 11px 11px; border-style: solid; margin: 3px 0px 0px 77px; height: 1px; width: 0px; display: none; }' + // This is magic "arrow up". Only color and margins could be changed
	'.{class:container-root-thread} .{class:childrenMarker} { display: block; }' +
	'.{class:avatar} { width: 48px; height: 48px; }' +
	'.{class:children} .{class:avatar}, .{class:childrenByCurrentActorLive} .{class:avatar} { width: 24px; height: 24px; }' +
	'.{class:authorName} { float: left; font-size: 15px; font-family: Arial, sans-serif; font-weight: bold; }' +
	'.{class:re} { font-weight: bold; }' +
	'.{class:re} a:link, .{class:re} a:visited, .{class:re} a:active { text-decoration: none; }' +
	'.{class:re} a:hover { text-decoration: underline; }' +
	'.{class:body} { padding-top: 4px; }' +
	'.{class:buttons} { float: left; margin-left: 3px; }' +
	'.{class:buttons} a.{class:button} { color: #C6C6C6; }' +
	'.{class:buttons} a.{class:button}.echo-linkColor, .{class:buttons} a.{class:button}:hover { color: #476CB8; text-decoration: none; }' +
	'.{class:sourceIcon} { float: left; height: 16px; width: 16px; margin-right: 5px; border: 0px; }' +
	'.{class:date}, .{class:from}, .{class:via} { float: left; }' +
	'.{class:from} a, .{class:via} a { text-decoration: none; color: #C6C6C6; }' +
	'.{class:from} a:hover, .{class:via} a:hover { color: #476CB8; }' +
	'.{class:tag} { display: inline-block; height: 16px; background: url("' + Echo.require.toUrl("echo-assets/images/tag_blue.png") + '") no-repeat; padding-left: 18px; }' +
	'.{class:smiley-icon} { border: 0px; }' +
	'.{class:textToggleTruncated} { margin-left: 5px; }' +
	'.{class:blocker-backdrop} { position: absolute; left: 0px; top: 0px; background: #FFFFFF; opacity: 0.7; z-index: 100; }' +
	'.{class:blocker-message} { position: absolute; z-index: 200; width: 200px; height: 20px; line-height: 20px; text-align: center; background-color: #FFFF99; border: 1px solid #C6C677; opacity: 0.7; -moz-border-radius: 0.5em 0.5em 0.5em 0.5em; }' +
	'.{class:expandChildren} { display:none; text-align: center; padding:4px; }' +
	'.{class:expandChildren} .{class:expandChildrenLabel} { display: inline-block; padding-left: 22px; }' +
	'.{class:expandChildren} .echo-app-message-icon { background: url("' + Echo.require.toUrl("echo-assets/images/whirlpool.png") + '") no-repeat 5px 4px; }' +
	'.{class:expandChildren} .{class:message-loading} { background: no-repeat left top url("' + Echo.require.toUrl("echo-assets/images/loading.gif") + '"); }' +
	'.{class:expandChildren} .echo-app-message { padding: 0; border:none; border-radius: 0; }' +
	itemDepthRules.join("\n");

return App.create(item);

});
