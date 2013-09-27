(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.FacePile
 * Echo FacePile control displays users (actors) returned in any activity stream and displays a live updating collection of avatars and names.
 * It is either a static list formed by a predefined data set or live updated list constructed using the Echo Query Language.
 *
 * 	new Echo.StreamServer.Controls.FacePile({
 * 		"target": document.getElementById("echo-facepile"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"query": "childrenof:http://example.com/* itemsPerPage:2 children:0",
 * 		"suffixText": " commented on aboutecho.com",
 * 		"item": {"avatar": true, "text": true}
 * 	});
 *
 * More information regarding the possible ways of the Control initialization
 * can be found in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-1) guide.
 *
 * @extends Echo.Control
 *
 * @package streamserver/controls.pack.js
 * @package streamserver.pack.js
 *
 * @constructor
 * FacePile constructor initializing Echo.StreamServer.Controls.FacePile class
 *
 * @param {Object} config
 * Configuration options
 */
var pile = Echo.Control.manifest("Echo.StreamServer.Controls.FacePile");

if (Echo.Control.isDefined(pile)) return;

/** @hide @cfg defaultAvatar */
/** @hide @cfg submissionProxyURL */
/** @hide @method placeImage */
/** @hide @method getRelativeTime */
/** @hide @echo_label today */
/** @hide @echo_label yesterday */
/** @hide @echo_label lastWeek */
/** @hide @echo_label lastMonth */
/** @hide @echo_label secondAgo */
/** @hide @echo_label secondsAgo */
/** @hide @echo_label minuteAgo */
/** @hide @echo_label minutesAgo */
/** @hide @echo_label hourAgo */
/** @hide @echo_label hoursAgo */
/** @hide @echo_label dayAgo */
/** @hide @echo_label daysAgo */
/** @hide @echo_label weekAgo */
/** @hide @echo_label weeksAgo */
/** @hide @echo_label monthAgo */
/** @hide @echo_label monthsAgo */

/**
 * @echo_event Echo.StreamServer.Controls.FacePile.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.onRerender
 * Triggered when the app is rerendered.
 */


pile.init = function() {
	if (!this.checkAppKey()) return;

	// data can be defined explicitly
	// in this case we do not make API requests
	if ($.isEmptyObject(this.get("data"))) {
		this._request();
	} else {
		this.set("data.itemsPerPage", this.get("data.itemsPerPage", 2));
		this.config.set("liveUpdates.enabled", false);
		this._initialResponseHandler(this.data);
	}
};

pile.config = {
	/**
	 * @cfg {Object} data
	 * Specifies static data for the face pile. It has the same format as returned
	 * by the <a href="http://wiki.aboutecho.com/API-method-search#ResponseFormat" target="_blank">
	 * "search" API endpoint</a>. If the "data" parameter is provided then the
	 * "query" parameter should be omitted. If "data" and "query" parameters are both
	 * provided "query" takes precedence over "data".
	 */
	"data": undefined,

	/**
	 * @cfg {String} initialUsersCount
	 * The number of users which will be shown when the FacePile is displayed
	 * for the first time. Default value is the value of `data.itemsPerPage`
	 * parameter. Note that the parameter is actual only for the list created
	 * using `data`.
	 */
	"initialUsersCount": undefined,

	/**
	 * @cfg {String} totalUsersCount
	 * The total number of users for the FacePile. If it's not defined it defaults to
	 * the length of the provided data.entries field. Note that the parameter is actual
	 * only for the list created using `data`.
	 */
	"totalUsersCount": undefined,

	/**
	 * @cfg {String} query
	 * Specifies the search query to generate the necessary data set.
	 * It must be constructed according to the
	 * <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">"search" API</a>
	 * method specification.
	 *
	 * 	new Echo.StreamServer.Controls.FacePile({
	 * 		"target": document.getElementById("echo-facepile"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"query" : "childrenof:http://example.com/test/*"
	 * 	});
	 */
	"query": "",

	/**
	 * @cfg {String} suffixText
	 * Specifies the text being appended to the end of Face Pile user's list.
	 */
	"suffixText": "",

	/**
	 * @cfg {Object} item
	 * Customizes the FacePile item
	 *
	 * @cfg {Boolean} item.avatar
	 * Specifies if the user avatar should be rendered within the FacePile item.
	 *
	 * @cfg {Boolean} item.text
	 * Specifies if the user name should be rendered within the FacePile item.
	 */
	"item": {
		"avatar": true,
		"text": true
	},

	/**
	 * @cfg {Object} [liveUpdates]
	 * Live updating machinery configuration.
	 *
	 * @cfg {Boolean} [liveUpdates.enabled=true]
	 * Parameter to enable/disable live updates.
	 *
	 * @cfg {String} [liveUpdates.transport="polling"]
	 * Preferred live updates receiveing machinery transport.
	 * The following transports are supported:
	 *
	 * + "polling" - periodic requests to check for updates
	 * + "websockets" - transport based on the WebSocket technology
	 *
	 * If the end user's browser doesn't support the WebSockets technology,
	 * the "polling" transport will be used as a fallback.
	 *
	 * @cfg {Object} [liveUpdates.polling]
	 * Object which contains the configuration specific to the "polling"
	 * live updates transport.
	 *
	 * @cfg {Number} [liveUpdates.polling.timeout=10]
	 * Timeout between the live updates requests (in seconds).
	 *
	 * @cfg {Object} [liveUpdates.websockets]
	 * Object which contains the configuration specific to the "websockets"
	 * live updates transport.
	 *
	 * @cfg {Number} [liveUpdates.websockets.maxConnectRetries=3]
	 * Max connection retries for WebSocket transport. After the number of the
	 * failed connection attempts specified in this parameter is reached, the
	 * WebSocket transport is considered as non-supported: the client no longer
	 * tries to use the WebSockets on the page and the polling transport is used
	 * from now on.
	 *
	 * @cfg {Number} [liveUpdates.websockets.serverPingInterval=30]
	 * The timeout (in seconds) between the client-server ping-pong requests
	 * to keep the connection alive.
	 */
	"liveUpdates": {
		"transport": "polling", // or "websockets"
		"enabled": true,
		"polling": {
			"timeout": 10
		},
		"websockets": {
			"maxConnectRetries": 3,
			"serverPingInterval": 30
		}
	},

	/**
	 * @cfg {String} infoMessages
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 */
	"infoMessages": {
		"layout": "compact"
	}
};

pile.vars = {
	"users": [],
	"uniqueUsers": {},
	"isViewComplete": false,
	"moreRequestInProgress": false,
	"count": {
		"total": 0,
		"visible": 0
	}
};

pile.labels = {
	/**
	 * @echo_label
	 */
	"and": "and",
	/**
	 * @echo_label
	 */
	"more": "more"
};

/**
 * @echo_template
 */
pile.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:actors}"></span>' +
		'<span class="{class:more}"></span>' +
		'<span class="{class:suffixText}"></span>' +
	'</span>';

/**
 * @echo_renderer
 */
pile.renderers.more = function(element) {
	var self = this;
	if (!this._isMoreButtonVisible()) {
		return element.hide();
	}
	element.empty().show();
	var count = this.get("count.total") - this.get("count.visible");
	var caption = (count > 0 ? count + " " : "") + this.labels.get("more");
	var linkable = !this._fromExternalData() || this.get("count.visible") < this.get("users").length;
	if (linkable) {
		var link = Echo.Utils.hyperlink({"caption": caption});
		element.addClass("echo-linkColor").append(link);
	} else {
		element.removeClass("echo-linkColor").append(caption);
	}
	this.set("moreRequestInProgress", false);
	if (linkable) {
		element.one("click", function() {
			self._getMoreUsers();
		});
	}
	return element;
};

/**
 * @echo_renderer
 */
pile.renderers.actors = function(element) {
	var self = this, usersDOM = [];
	var cssPrefix = this.get("cssPrefix");
	var item = this.config.get("item");

	if (!this.get("users").length || !item.avatar && !item.text) {
		return element.empty();
	}

	var action = (item.avatar && !item.text ? "addClass" : "removeClass");
	element[action](cssPrefix + "only-avatars");
	var wrap = function(text, name) {
		return self.substitute({
			"template": "<span {data:classAttr}>{data:text}</span>",
			"data": {
				"classAttr": name ? 'class="' + cssPrefix + name + '"' : '',
				"text": text
			}
		});
	};
	$.map(this.get("users").slice(0, this.get("count.visible")), function(user) {
		usersDOM.push(user.instance.render());
	});
	var last;
	var delimiter = this.config.get("item.text") ? ", " : "";
	if (!this._isMoreButtonVisible()) {
		last = usersDOM.pop();
	}
	if (usersDOM.length) {
		usersDOM = delimiter
			? this._intersperse(usersDOM, wrap(delimiter, "delimiter"))
			: usersDOM;
		// use &nbsp; instead of simple space
		// because IE will cut off simple one after <span>
		usersDOM.push(wrap("&nbsp;" + this.labels.get("and") + " ", "and"));
	}
	if (!this._isMoreButtonVisible()) {
		usersDOM.push(last);
	}
	$.map(usersDOM, function(chunk) {
		element.append(chunk);
	});
	return element;
};

/**
 * @echo_renderer
 */
pile.renderers.suffixText = function(element) {
	return element.empty().append(this.config.get("suffixText", ""));
};

/**
 * Method to get the visible users count
 *
 * @return {Number}
 * visible users count
 */
pile.methods.getVisibleUsersCount = function() {
	return this.count.visible;
};

pile.methods._isMoreButtonVisible = function() {
	return !this._fromExternalData() && !this.isViewComplete || this.count.visible < this.count.total;
};

pile.methods._fromExternalData = function() {
	return !this.config.get("query") && !!this.data;
};

pile.methods._request = function() {
	var self = this;
 	var request = this.get("request");
	if (!request) {
		request = Echo.StreamServer.API.request({
			"endpoint": "search",
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"liveUpdates": $.extend(this.config.get("liveUpdates"), {
				"onData": function(data) {
					self._secondaryResponseHandler(data);
				}
			}),
			"secure": this.config.get("useSecureAPI"),
			"apiBaseURL": this.config.get("apiBaseURL"),
			"onError": function(data, extra) {
				var needShowError = typeof extra.critical === "undefined" || extra.critical || extra.requestType === "initial";
				if (needShowError) {
					self.showError(data, {"critical": extra.critical});
				}
			},
			"onData": function(data, extra) {
				self._initialResponseHandler(data);
			}
		});
		this.set("request", request);
	}
	request.send();
};

pile.methods._requestMoreItems = function() {
	var self = this, query = this.config.get("query");
	var nextPageAfter = this.get("nextPageAfter");
	if (typeof nextPageAfter !== "undefined") {
		query = 'pageAfter:"' + nextPageAfter + '" ' + query;
	}
	var request = Echo.StreamServer.API.request({
		"endpoint": "search",
		"secure": this.config.get("useSecureAPI"),
		"apiBaseURL": this.config.get("apiBaseURL"),
		"data": {
			"q": query,
			"appkey": this.config.get("appkey")
		},
		"onError": function(data) {
			self.showMessage({"type": "error", "data": data});
		},
		"onData": function(data) {
			self._initialResponseHandler(data);
		}
	});
	request.send();
};

pile.methods._initialResponseHandler = function(data) {
	if (data.itemsPerPage && data.itemsPerPage !== this.config.get("itemsPerPage")) {
		this.config.set("itemsPerPage", +data.itemsPerPage);
	}
	if (this._fromExternalData()) {
		this.set("count.total", this.config.get("totalUsersCount", 0));
	}
	this.set("nextPageAfter", data.nextPageAfter);
	if (!data.entries.length) {
		if (!this.get("isViewComplete")) {
			this.set("isViewComplete", true);
			this.render();
			this.ready();
		}
		return;
	}
	if (!this.get("count.visible")) {
		this.set("count.visible", this._fromExternalData()
			? this.config.get("initialUsersCount", this.config.get("itemsPerPage"))
			: this.config.get("itemsPerPage")
		);
	}
	this._processResponse(data);
};

pile.methods._secondaryResponseHandler = function(data) {
	this._processResponse(data, true);
};

pile.methods._processResponse = function(data, isLive) {
	var self = this, fetchMoreUsers = true;
	var actions = $.map(data.entries, function(entry) {
		return function(callback) {
			if (self._isRemoveAction(entry)) {
				self._maybeRemoveItem(entry);
				callback();
			} else {
				if (self._isUniqueUser(entry)) {
					fetchMoreUsers = false;
				}
				var user = self.get("uniqueUsers." + entry.actor.id);
				if (user) {
					// user is already in the list -> increment counter and return
					user.itemsCount++;
					callback();
				} else {
					self._initItem(entry, function() {
						self._updateStructure(this);
						callback();
					});
				}
			}
		};
	});
	Echo.Utils.parallelCall(actions, function() {
		self._output(isLive, fetchMoreUsers);
	});
};

pile.methods._isRemoveAction = function(entry) {
	return entry.verbs && entry.verbs[0] === "http://activitystrea.ms/schema/1.0/delete";
};

pile.methods._output = function(isLive, fetchMoreUsers) {
	if (this._fromExternalData()) {
		this.set("count.total", Math.max(this.get("users").length, this.get("count.total")));
	} else {
		this.set("count.total", this.get("users").length);
		this.set("count.visible", this.get("users").length);
	}
	this.set("count.visible", Math.min(this.get("count.visible"), this.get("users").length));
	if (!this.get("count.total")) {
		this.set("isViewComplete", false);
	}
	if (!isLive && fetchMoreUsers) {
		this._getMoreUsers();
	} else {
		this.render();
		this.ready();
	}
};

pile.methods._isUniqueUser = function(entry) {
	return !this.get("uniqueUsers." + entry.actor.id);
};

pile.methods._initItem = function(entry, callback) {
	var config = $.extend({
		"apiBaseURL": this.config.get("apiBaseURL"),
		"submissionProxyURL": this.config.get("submissionProxyURL"),
		"target": $("<div>"),
		"appkey": this.config.get("appkey"),
		"parent": this.config.getAsHash(),
		"plugins": this.config.get("plugins"),
		"context": this.config.get("context"),
		"useSecureAPI": this.config.get("useSecureAPI"),
		"data": entry.actor,
		"user": this.user,
		"ready": callback
	}, this.config.get("item"));
	return new Echo.StreamServer.Controls.FacePile.Item(config);
};

pile.methods._updateStructure = function(item) {
	this.set("uniqueUsers." + item.get("data.id"), {
		"itemsCount": 1,
		"instance": item
	});
	var user = this.get("uniqueUsers." + item.get("data.id"));
	this.get("users")[user.instance.isYou() ? "unshift" : "push"](user);
};

pile.methods._maybeRemoveItem = function(entry) {
	var user = this.get("uniqueUsers." + entry.actor.id);
	// if we have move than one item posted by the same user,
	// we decrement the counter, but leave the user in the list
	if (!user || --user.itemsCount) return;
	var index;
	$.each(this.get("users"), function(i, u) {
		if (u.instance.data.id === entry.actor.id) {
			index = i;
			return false; // break
		}
	});
	this.get("users").splice(index, 1);
	this.remove("uniqueUsers." + entry.actor.id);
};

pile.methods._getMoreUsers = function() {
	if (this._fromExternalData()) {
		var usersLength = this.get("users").length;
		var currentVisible = this.get("count.visible");
		this.set("count.visible", currentVisible += this.config.get("itemsPerPage"));
		if (this.get("count.visible") > usersLength) {
			this.set("count.visible", usersLength);
		}
		this.render();
	} else {
		if (!this.get("moreRequestInProgress")) {
			this.showMessage({
				"type": "loading",
				"target": this.view.get("more")
			});
			this.set("moreRequestInProgress", true);
		}
		this._requestMoreItems();
	}
};

pile.methods._intersperse = function(object, separator) {
	return Echo.Utils.foldl([], object, function(item, acc, key) {
		if (acc.length) acc.push(separator);
		acc.push(item);
	});
};

pile.css = 
	'.{class:container} { line-height: 20px; vertical-align: middle; }' +
	'.{class:more} { white-space: nowrap; }' +
	'.{class:more}.echo-linkColor a, .{class:more}.echo-linkColor a:hover { color: #476CB8; text-decoration: underline; }' +
	'.{class:more} .echo-control-message-icon { display: inline; margin: 0px 5px; }';

Echo.Control.create(pile);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.FacePile.Item
 * Echo FacePile.Item control displays single user (actor). 
 *
 * @extends Echo.Control
 *
 * @package streamserver/controls.pack.js
 * @package streamserver.pack.js
 *
 * @constructor
 * FacePile.Item constructor initializing Echo.StreamServer.Controls.FacePile.Item class
 *
 * @param {Object} config
 * Configuration options
 */
var item = Echo.Control.manifest("Echo.StreamServer.Controls.FacePile.Item");

if (Echo.Control.isDefined(item)) return;

/** @hide @cfg appkey */
/** @hide @cfg plugins */
/** @hide @cfg submissionProxyURL */
/** @hide @method checkAppKey */
/** @hide @method placeImage */
/** @hide @method dependent */
/** @hide @method getRelativeTime */
/** @hide @echo_label today */
/** @hide @echo_label yesterday */
/** @hide @echo_label lastWeek */
/** @hide @echo_label lastMonth */
/** @hide @echo_label secondAgo */
/** @hide @echo_label secondsAgo */
/** @hide @echo_label minuteAgo */
/** @hide @echo_label minutesAgo */
/** @hide @echo_label hourAgo */
/** @hide @echo_label hoursAgo */
/** @hide @echo_label dayAgo */
/** @hide @echo_label daysAgo */
/** @hide @echo_label weekAgo */
/** @hide @echo_label weeksAgo */
/** @hide @echo_label monthAgo */
/** @hide @echo_label monthsAgo */
/** @hide @echo_label loading */
/** @hide @echo_label retrying */
/** @hide @echo_label error_busy */
/** @hide @echo_label error_timeout */
/** @hide @echo_label error_waiting */
/** @hide @echo_label error_view_limit */
/** @hide @echo_label error_view_update_capacity_exceeded */
/** @hide @echo_label error_result_too_large */
/** @hide @echo_label error_wrong_query */
/** @hide @echo_label error_incorrect_appkey */
/** @hide @echo_label error_internal_error */
/** @hide @echo_label error_quota_exceeded */
/** @hide @echo_label error_incorrect_user_id */
/** @hide @echo_label error_unknown */

/**
 * @echo_event Echo.StreamServer.Controls.FacePile.Item.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.Item.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.Item.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.Controls.FacePile.Item.onRerender
 * Triggered when the app is rerendered.
 */

item.config = {
	/**
	 * @cfg {String} infoMessages
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 */
	"infoMessages": {
		"enabled": false
	}
};

item.labels = {
	/**
	 * @echo_label
	 */
	"you": "You"
};

/**
 * @echo_template
 */
item.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:avatar}"></span>' +
		'<span class="{class:title}">{data:title}</span>' +
	'</span>';

/**
 * @echo_renderer
 */
item.renderers.avatar = function(element) {
	var self = this;
	if (this.config.get("avatar")) {
		this.placeImage({ 
			"container": element,
			"image": this.get("data.avatar"),
			"defaultImage": this.config.get("defaultAvatar")
		});
		if (!this.config.get("text")) {
			element.attr("title", this.get("data.title"));
		}
	} else {
		element.hide();
	}
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.title = function(element) {
	if (this.config.get("text")) {
		element.empty().append(this.isYou() ? this.labels.get("you") : this.get("data.title"));
	} else {
		element.hide();
	}
	return element;
};

/**
 * Function to check if the item was posted by the current user.
 *
 * @return {Boolean}
 */
item.methods.isYou = function() {
	var id = this.get("data.id");
	return id && id === this.user.get("identityUrl");
};

item.css =
	".{class:avatar} { display: inline-block; width: 16px; height: 16px; margin: 0px 3px 0px 0px; vertical-align: text-top; }" +
	'.{class:only-avatars} .{class:avatar} { margin: 0px 2px; }' +
	'.{class:container}, .{class:container} span { white-space: nowrap; display: inline-block; }' +
	'.{class:only-avatars} .{class:container} { white-space: normal; }';

Echo.Control.create(item);

})(Echo.jQuery);
