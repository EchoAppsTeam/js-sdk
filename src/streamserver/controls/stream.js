(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream")) return;

/**
 * @class Echo.StreamServer.Controls.Stream
 * Echo Stream control which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">Echo Search API</a>
 *
 * 	var stream = new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("stream"),
 * 		"query": "childrenof:http://example.com/js-sdk",
 * 		"appkey": "test.js-kit.com"
 * 	});
 *
 * @extends Echo.Control
 *
 * @constructor
 * Stream constructor initializing Echo.StreamServer.Controls.Stream class
 *
 * @param {Object} config
 * Configuration options
 */
var stream = Echo.Control.manifest("Echo.StreamServer.Controls.Stream");

stream.init = function() {
	this._recalcEffectsTimeouts();
	if (this.config.get("data")) {
		this._handleInitialResponse(this.config.get("data"));
	} else {
		this._requestInitialItems();
	}
};

stream.config = {
	/**
	 * @cfg {Object} children
	 * Specifies the children pagination feature behavior.
	 * It includes several options.
	 *
	 * @cfg {Number} children.additionalItemsPerPage
	 * Specifies how many items should be retrieved from server and
	 * rendered after clicking the "View more items" button.
	 *
	 * @cfg {Number} children.moreButtonSlideTimeout
	 * Specifies the duration of more button slide up animation in the
	 * situation when there are no more children items available and
	 * the button should be removed.
	 *
	 * @cfg {Number} children.itemsSlideTimeout
	 * Specifies the duration of the slide down animation of the items
	 * coming to the stream after the "View more items" button click. 
	 */
	"children": {
		"additionalItemsPerPage": 5,
		"displaySortOrder": "chronological",
		"sortOrder": "reverseChronological",
		"moreButtonSlideTimeout": 600,
		"itemsSlideTimeout": 600,
		"maxDepth": 1
	},
	/**
	 * @cfg {Number} fadeTimeout
	 * Specifies the duration of the fading animation (in milliseconds)
	 * when an item comes to stream as a live update.
	 */
	"fadeTimeout": 2800,
	/**
	 * @cfg {String} flashColor
	 * Specifies the necessary flash color of the events coming to your
	 * stream as live updates. This parameter must have a hex color value.
	 */
	"flashColor": "#ffff99",
	/**
	 * @cfg {Object} item
	 * Specifies the configuration options to be passed to internal
	 * Echo.StreamServer.Controls.Stream.Item component.
	 */
	"item": {},
	/**
	 * @cfg {Number} itemsPerPage
	 * 
	 */
	"itemsPerPage": 15,
	/**
	 * @cfg {Boolean} liveUpdates
	 * Parameter to enable/disable receiving live updates by control. 
	 */
	"liveUpdates": true,
	/**
	 * @cfg {Number} 
	 * Specifies the timeout between live updates requests (in seconds).
	 */
	"liveUpdatesTimeout": 10,
	"liveUpdatesTimeoutMin": 3,
	/**
	 * @cfg {Boolean} openLinksInNewWindow
	 * If this parameter value is set to true, each link will be opened
	 * in a new window. This is especially useful when using the control
	 * in a popup window.
	 */
	"openLinksInNewWindow": false,
	/**
	 * @cfg {String} providerIcon
	 * Specifies the URL to the icon representing data provider.
	 */
	"providerIcon": Echo.Loader.getURL("{sdk}/images/favicons/comments.png"),
	/**
	 * @cfg {Number} slideTimeout
	 * Specifies the duration of the sliding animation (in milliseconds)
	 * when an item comes to a stream as a live update.
	 */
	"slideTimeout": 700,
	"sortOrder": "reverseChronological",
	/**
	 * @cfg {Object} streamStateLabel
	 * Hides the Pause/Play icon. Toggles the labels used in the Stream Status
	 * label. Contains a hash with two keys managing icon and text display modes.
	 *
	 * @cfg {Boolean} streamStateLabel.icon
	 * Toggles the icon visibility.
	 *
	 * @cfg {Boolean} streamStateLabel.text
	 * Toggles the text visibility.
	 *
	 */
	"streamStateLabel": {
		"icon": true,
		"text": true
	},
	/**
	 * @cfg {String} streamStateToggleBy
	 * Specifies the method of changing stream live/paused state.
	 *
	 * The possible values are:
	 *
	 * + mouseover - the stream is paused when mouse is over it and live
	 *  when mouse is out.
	 * + button - the stream changes state when user clicks on streamStateLabel
	 * (Live/Paused text). This mode would not work if neither state icon nor
	 * state text are displayed.
	 * + none - the stream will never be paused.
	 * 
	 * Note that mouseover method is not available for mobile devices and will
	 * be forced to button method.
	 */
	"streamStateToggleBy": "mouseover", // mouseover | button | none
	/**
	 * @cfg {String} submissionProxyURL URL prefix for requests to
	 * Submission Proxy subsystem.
	 */
	"submissionProxyURL": "http://apps.echoenabled.com/v2/esp/activity"
};

stream.config.normalizer = {
	"safeHTML": function(value) {
		return "off" !== value;
	},
	"streamStateToggleBy": function(value) {
		return value === "mouseover" && Echo.Utils.isMobileDevice()
			? "button"
			: value;
	}
};

stream.vars = {
	"activities": {
		"queue": [],
		"state": undefined,
		"lastState": "", // live0 | pausedN
		"animations": 0
	},
	"hasInitialData": false,
	"items": {},   // items by unique key hash
	"threads": [], // items tree
	"lastRequest": undefined
};

stream.labels = {
	/**
	 * @echo_label
	 */
	"guest": "Guest",
	/**
	 * @echo_label
	 */
	"live": "Live",
	/**
	 * @echo_label
	 */
	"paused": "Paused",
	/**
	 * @echo_label
	 */
	"more": "More",
	/**
	 * @echo_label
	 */
	"emptyStream": "No items at this time...",
	/**
	 * @echo_label
	 */
	"new": "new"
};

stream.events = {
	"Echo.StreamServer.Controls.Stream.Item.onAdd": function(topic, data) {
		var self = this;
		var item = this.items[data.item.data.unique];
		item.config.get("target").hide();
		this.queueActivity({
			"action": "animation",
			"item": item,
			"priority": "highest",
			"handler": function() {
				item.render();
				item.set("added", false);
				self._animateSpotUpdate("add", item, data.config);
			}
		});
		return {"stop": ["bubble"]};
	},
	"Echo.StreamServer.Controls.Stream.Item.onDelete": function(topic, data) {
		var self = this;
		var item = this.items[data.item.data.unique];
		this.queueActivity({
			"action": "animation",
			"item": item,
			"priority": "highest",
			"handler": function() {
				item.set("deleted", false);
				self._animateSpotUpdate("remove", item, data.config);
			}
		});
		return {"stop": ["bubble"]};
	},
	"Echo.StreamServer.Controls.Stream.Item.onChildrenExpand": function(topic, args) {
		this._requestChildrenItems(args.data.unique);
		return {"stop": ["bubble"]};
	}
};

stream.templates.main =
	'<div class="{class:container} echo-primaryFont echo-primaryBackgroundColor">' +
		'<div class="{class:header}">'+
			'<div class="{class:state} echo-secondaryColor"></div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
		'<div class="{class:body}"></div>' +
		'<div class="{class:more}"></div>' +
	'</div>';

/**
 * @echo_renderer
 */
stream.renderers.body = function(element) {
	var self = this, request = this.lastRequest;
	if (!request) {
		return element;
	}
	if (request.data.length) {
		if (request.initial) {
			element.empty();
		}
		this._appendRootItems(request.data, element);
	} else {
		this.showMessage({
			"type": "empty",
			"message": this.labels.get("emptyStream"),
			"target": element
		});
	}
	if (request.initial && this.config.get("liveUpdates") &&
		this.config.get("streamStateToggleBy") === "mouseover") {
			element.hover(
				function() { self.setState("paused"); },
				function() { self.setState("live"); }
			);
	}
	return element;
};

/**
 * @echo_renderer
 */
stream.renderers.state = function(element) {
	var self = this;
	var label = this.config.get("streamStateLabel");

	if (!label.icon && !label.text || !this.config.get("liveUpdates")) {
		return element;
	}

	var state = this.getState();
	var activitiesCount = 0;
	if (state === "paused") {
		activitiesCount = Echo.Utils.foldl(0, this.activities.queue,
			function(entry, acc) {
				if (entry.affectCounter) return ++acc;
			}
		);
	}
	var currentState = state + activitiesCount;

	if (currentState === this.activities.lastState) {
		return element;
	}

	element.empty();
	if (!this.activities.lastState && this.config.get("streamStateToggleBy") === "button") {
		element.addClass("echo-linkColor echo-clickable").click(function() {
			self.setState(state === "paused" ? "live" : "paused");
		});
	}
	var templates = {
		"picture": '<span class="{class:state-picture} {class:state-picture}-' + state + '"></span>',
		"message": this.config.get("streamStateToggleBy") === "button"
			? '<a href="javascript:void(0)" class="{class:state-message}">' +
				'{label:' + state + '}' +
			  '</a>'
			: '<span class="{class:state-message}">{label:' + state + '}</span>',
		"count": ' <span class="{class:state-count}">({data:count} {label:new})</span>'
	};
	if (label.icon) {
		element.append(this.substitute({"template": templates.picture}));
	}
	if (label.text) {
		element.append(this.substitute({"template": templates.message}));
		if (activitiesCount && state === "paused") {
			element.append(this.substitute({
				"template": templates.count,
				"data": {"count": activitiesCount}
			}));
		}
	}
	this.activities.lastState = currentState;
	return element;
};

/**
 * @echo_renderer
 */
stream.renderers.more = function(element) {
	var self = this;
	if (this.isViewComplete || !this.threads.length) {
		return element.empty().hide();
	}
	return element.empty()
		.append(this.labels.get("more"))
		.hover(function() {
			element.addClass(self.cssPrefix + "more-hover");
		}, function() {
			element.removeClass(self.cssPrefix + "more-hover");
		})
		.show()
		.off("click")
		.one("click", function() {
			/**
			 * @event onMoreButtonPress
			 * @echo_event Echo.StreamServer.Controls.Stream.onMoreButtonPress
			 * Triggered when the "more" button is pressed.
			 */
			self.events.publish({"topic": "onMoreButtonPress"});
			element.html(self.labels.get("loading"));
			self._requestMoreItems(element);
		});
};

/**
 * Accessor method to get the current Stream state.
 *
 * @return {String}
 * stream state "live" or "paused".
 */
stream.methods.getState = function() {
	return this.activities.state === undefined
		? this.config.get("liveUpdates") ? "live" : "paused"
		: this.activities.state;
};

/**
 * Setter method to define the Stream state.
 *
 * @param {String} state
 * stream state "live" or "paused".
 */
stream.methods.setState = function(state) {
	this.activities.state = state;
	if (state === "live") {
		this._executeNextActivity();
	}
	this.view.render({"name": "state"});
};

stream.methods._requestChildrenItems = function(unique) {
	var self = this;
	var item = this.items[unique];
	var target = item.view.get("expandChildren");
	var request = Echo.StreamServer.API.request({
		"endpoint": "search",
		"apiBaseURL": this.config.get("apiBaseURL"),
		"data": {
			"q": this._constructChildrenSearchQuery(item),
			"appkey": this.config.get("appkey")
		},
		"onOpen": function() {
			self.showError({}, {
				"retryIn": 0,
				"target": target,
				"request": request
			});
		},
		"onError": function(data, options) {
			self.showError(data, $.extend(options, {
				"target": target,
				"request": request
			}));
		},
		"onData": function(data) {
			var items = {};
			item.set("data.nextPageAfter", data.nextPageAfter);
			item.set("data.hasMoreChildren", data.hasMoreChildren);
			data.entries = self._actualizeChildrenList(item, data.entries);
			/**
			 * @event onDataReceive
			 * @echo_event Echo.StreamServer.Controls.Stream.onDataReceive
			 * Triggered when new data is received.
			 */
			self.events.publish({
				"topic": "onDataReceive",
				"data": {
					"entries": data.entries,
					"initial": false
				},
				"propagation": false
			});
			var actions = $.map(data.entries, function(entry) {
				return function(callback) {
					self._initItem(entry, false, function() {
						items[this.get("data.unique")] = this;
						callback();
					});
				};
			});
			Echo.Utils.parallelCall(actions, function() {
				var children = [];
				$.map(data.entries, function(entry) {
					var child = items[entry.unique];
					self._applyStructureUpdates("add", child);
					if (entry.parentUnique === item.get("data.unique")) {
						children.push(child);
					}
				});
				self._placeChildItems(item, children);
			});
		}
	});
	request.send();
};

stream.methods._requestInitialItems = function() {
	var self = this;
	if (!this.request) {
		this.request = Echo.StreamServer.API.request({
			"endpoint": "search",
			"apiBaseURL": this.config.get("apiBaseURL"),
			"liveUpdatesTimeout": this.config.get("liveUpdatesTimeout"),
			"recurring": true,
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"onOpen": function(data, options) {
				if (options.requestType === "initial") {
					self.showError({}, {
						"retryIn": 0,
						"request": self.request
					});
				}
			},
			"onError": function(data, options) {
				self.showError(data, $.extend(options, {
					"request": self.request
				}));
			},
			"onData": function(data, options) {
				if (options.requestType === "initial") {
					self._handleInitialResponse(data);
				} else {
					self._handleLiveUpdatesResponse(data);
				}
			}
		});
	}
	this.request.send();
};

stream.methods._requestMoreItems = function(element) {
	var self = this;
	this.lastRequest = {"initial": false};
	if (!this.moreRequest) {
		this.moreRequest = Echo.StreamServer.API.request({
			"endpoint": "search",
			"apiBaseURL": this.config.get("apiBaseURL"),
			"onOpen": function() {
				self.showError({}, {
					"retryIn": 0,
					"target": element,
					"request": self.moreRequest
				});
			},
			"onError": function(data, options) {
				self.showError(data, $.extend(options, {
					"target": element,
					"request": self.moreRequest
				}));
			},
			"onData": function(data) {
				self._handleInitialResponse(data, function(data) {
					if (data.length) {
						self.lastRequest.data = data;
						self.view.render({"name": "body"});
						self.view.render({"name": "more"});
					} else {
						element.html(self.labels.get("emptyStream"))
							.delay(1000)
							.fadeOut(1000);
					}
				});
			}
		});
	}
	this.moreRequest.send({
		"data": {
			"q": this.config.get("query") + " pageAfter:" +
					"\"" + (this.get("nextPageAfter", "0")) + "\"",
			"appkey": this.config.get("appkey")
		}
	});
};

stream.methods._prepareEventParams = function(params) {
	return $.extend(params, {
		"target": this.config.get("target").get(0),
		"query": this.config.get("query")
	});
};

stream.methods._applyLiveUpdates = function(entries, callback) {
	var self = this;
	this._refreshItemsDate();
	this._checkTimeframeSatisfy();
	var actions = $.map(entries || [], function(entry) {
		return function(_callback) {
			entry = self._normalizeEntry(entry);
			var item = self.items[entry.unique];
			var action = self._classifyAction(entry);
			if (!item && action !== "post") {
				_callback();
				return;
			}
			if (action === "post") {
				if (item) {
					self._applySpotUpdates("replace", self._updateItem(entry));
					_callback();
					return;
				}
				self._initItem(entry, true, function() {
					item = this;
					var satisfies = item.isRoot()
						? self._withinVisibleFrame(item)
						: self._withinVisibleChildrenFrame(item);

					// do not filter out items from the current user
					// they should be displayed in a special container
					if (!satisfies && !item.isRoot() &&
						self.user.has("identity", item.data.actor.id)) {
							item.set("byCurrentUser", true);
					}

					if (satisfies || item.get("byCurrentUser")) {
						/**
						 * @event Item.onReceive
						 * @echo_event Echo.StreamServer.Controls.Stream.Item.onReceive
						 * Triggered when new item is received.
						 */
						self.events.publish({
							"topic": "Item.onReceive",
							"data": {"item": {"data": item.data}},
							"propagation": false
						});
						self._applySpotUpdates("add", item);
					}
					_callback();
				});
				return;
			}
			if (action === "delete") {
				self._applySpotUpdates("remove", item);
				_callback();
			}
		};
	});
	Echo.Utils.sequentialCall(actions, function() {
		self._recalcEffectsTimeouts();
		callback && callback.call(self);
	});
};

stream.methods._actualizeChildrenList = function(parent, entries) {
	var self = this;
	return $.map(entries, function(entry) {

		// we should change entry conversationID
		// according to the root item conversationID
		entry.targets = $.map(entry.targets, function(target) {
			target.conversationID = parent.get("data.target.conversationID");
			return target;
		});

		entry = self._normalizeEntry(entry);
		var item = self.items[entry.unique];

		// drop item from items list if the item already exists
		// in the tree, which means that it was posted by the current user
		// and arrived as a live update
		if (item && item.get("byCurrentUser")) {
			self._applyStructureUpdates("delete", item);
		}

		return entry;
	});
};

stream.methods._createChildrenItemsDomWrapper = function(children, parent) {
	var self = this;
	var wrapper = $('<div class="' + this.get("cssPrefix") + 'children-wrapper"></div>');
	var getIdx = function(item) {
		return self._getItemListIndex(item, parent.get("children"));
	};
	$.each(children, function(i, item) {
		var insertion = i > 0 && getIdx(children[i-1]) < getIdx(item)
			? "append"
			: "prepend";
		wrapper[insertion](item.config.get("target"));
		item.render();
	});
	return wrapper;
};

stream.methods._extractPresentationConfig = function(data) {
	var keys = ["sortOrder", "itemsPerPage", "safeHTML"];
	return Echo.Utils.foldl({}, keys, function(key, acc) {
		if (typeof data[key] !== "undefined") {
			acc[key] = data[key];
		}
	});
};

stream.methods._extractTimeframeConfig = function(data) {
	var getComparator = function(value) {
		var match = value.match(/^(<|>)(.*)$/);
		var operation = match[1];
		var value = match[2].match(/^'([0-9]+) seconds ago'$/);
		var getTS = value
			? function() { return Math.floor((new Date()).getTime() / 1000) - value[1]; }
			: function() { return match[2]; };
		if (operation === '<') {
			return function(ts) { return ts < getTS(); }
		}
		if (operation === '>') {
			return function(ts) { return ts > getTS(); }
		}
	};
	var timeframe = Echo.Utils.foldl([], ["before", "after"], function(key, acc) {
		if (!data[key]) return;
		var cmp = getComparator(data[key]);
		if (cmp) acc.push(cmp);
	});
	return {"timeframe": timeframe};
};

stream.methods._getRespectiveAccumulator = function(item, sort) {
	var accBySort = {
		"likesDescending": "likesCount",
		"flagsDescending": "flagsCount",
		"repliesDescending": "repliesCount"
	};
	return item.getAccumulator(accBySort[sort]);
};

stream.methods._appendRootItems = function(items, container) {
	if (!items || !items.length) return;
	$.map(items, function(item) {
		container.append(item.config.get("target").get(0));
		item.render();
	});
};

stream.methods._constructChildrenSearchQuery = function(item) {
	// depth for item children request
	var depth = this.config.get("children.maxDepth") - item.get("depth") - 1;
	var additionalItems = parseInt(this.config.get("children.additionalItemsPerPage"));
	var pageAfter = item.getNextPageAfter();
	var filter = this.config.get("children.filter");
	var filterQuery = !filter || filter === "()" ? "" : filter + " ";
	return filterQuery + Echo.Utils.foldl("", {
		"childrenof": item.get("data.object.id"),
		"children": depth,
		"childrenItemsPerPage": depth
			? parseInt(this.config.get("children.itemsPerPage"))
			: 0,
		"itemsPerPage": additionalItems,
		"sortOrder": this.config.get("children.sortOrder"),
		"childrenSortOrder": this.config.get("children.sortOrder"),
		"pageAfter": pageAfter ? '"' + (pageAfter || 0) + '"' : undefined
	}, function(value, acc, predicate) {
		return acc += (typeof value !== "undefined"
			? predicate + ":" + value + " " 
			: ""
		); 
	}) + filterQuery;
};

stream.methods._handleInitialResponse = function(data, visualizer) {
	var self = this, items = {}, roots = [];
	this.config.get("target").show();
	this.nextSince = data.nextSince || 0;
	this.nextPageAfter = data.nextPageAfter;

	var presentation = this._extractPresentationConfig(data);
	presentation.itemsPerPage = +presentation.itemsPerPage;
	this.config.extend(presentation);

	data.entries = data.entries || [];

	data.children.itemsPerPage = +data.children.itemsPerPage;
	data.children.maxDepth = +data.children.maxDepth;
	this.config.set("children", $.extend(this.config.get("children"), data.children));

	this.config.extend(this._extractTimeframeConfig(data));
	this.events.publish({
		"topic": "onDataReceive",
		"data": {
			"entries": data.entries,
			"initial": !this.hasInitialData
		},
		"propagation": false
	});
	var sortOrder = this.config.get("sortOrder");
	var actions = $.map(data.entries, function(entry) {
		return function(callback) {
			self._initItem(entry, false, function() {
				items[this.get("data.unique")] = this;
				callback();
			});
		};
	});
	// items initialization is an async process, so we init
	// item instances first and append them into the structure later
	Echo.Utils.parallelCall(actions, function() {
		$.map(data.entries, function(entry) {
			var item = items[entry.unique];
			self._applyStructureUpdates("add", item);
			if (item.isRoot()) {
				self._addItemToList(roots, item, sortOrder);
			}
		});
		self.hasInitialData = true;
		self.isViewComplete = roots.length !== self.config.get("itemsPerPage");
		(visualizer || function(data) {
			self.lastRequest = {
				"initial": true,
				"data": data
			};
			self.render();
			self.ready();
		})(roots);
	});
};

stream.methods._checkTimeframeSatisfy = function() {
	var self = this;
	var timeframe = this.config.get("timeframe");
	var unsatisfying = Echo.Utils.foldl([], this.threads, function(thread, acc) {
		var satisfy = Echo.Utils.foldl(true, timeframe, function(p, a) {
			return a ? p(thread.get("timestamp")) : false;
		});
		if (!satisfy) acc.push(thread);
	});
	$.map(unsatisfying, function(item) {
		self._applySpotUpdates("remove", item);
	});
};

stream.methods._handleLiveUpdatesResponse = function(data) {
	var self = this;
	data = data || {};
	if (data.result === "error") {
		this.startLiveUpdates();
		return;
	}
	this._applyLiveUpdates(data.entries, function() {
		self.view.render({"name": "state"});
		self._executeNextActivity();
	});
};

stream.methods._recalcEffectsTimeouts = function() {
	// recalculating timeouts based on amount of items in activities queue
	var s = this;
	var maxTimeouts = {
		"fade": s.config.get("fadeTimeout"),
		"slide": s.config.get("slideTimeout")
	};
	s.timeouts = s.timeouts || {
		"fade": maxTimeouts.fade,
		"slide": maxTimeouts.slide
	};
	if (!maxTimeouts.fade && !maxTimeouts.slide) {
		return;
	}
	s.timeouts.coeff = s.timeouts.coeff || {
		"fade": s.timeouts.fade / (maxTimeouts.fade + maxTimeouts.slide),
		"slide": s.timeouts.slide / (maxTimeouts.fade + maxTimeouts.slide)
	};
	var calc = function(timeout, value) {
		value = Math.round(value * s.timeouts.coeff[timeout]);
		if (value < 100) return 0; // no activities for small timeouts
		if (value > maxTimeouts[timeout]) return maxTimeouts[timeout];
		return value;
	};
	// reserving 80% of time between live updates for activities
	var frame = s.config.get("liveUpdatesTimeout") * 1000 * 0.8;
	var msPerItem = s.activities.queue.length ? frame / s.activities.queue.length : frame;
	s.timeouts.fade = calc("fade", msPerItem);
	s.timeouts.slide = calc("slide", msPerItem);
};

stream.methods._refreshItemsDate = function() {
	$.map(this.threads, function(item) {
		item.view.render({"name": "date"});
		item.traverse(item.get("children"), function(child) {
			child.view.render({"name": "date"});
		});
	});
};

stream.methods._executeNextActivity = function() {
	var acts = this.activities;
	if (acts.animations > 0 ||
			!acts.queue.length ||
			this.config.get("liveUpdates") &&
			acts.state === "paused" &&
			acts.queue[0].action !== "replace" &&
			!acts.queue[0].byCurrentUser) {
		return;
	}
	acts.queue.shift().handler();
};

// the list of spot update helpers, executed by the
// "_applySpotUpdates" and "_animateSpotUpdates" top level functions
stream.methods._spotUpdates = {"animate": {}};

stream.methods._spotUpdates.add = function(item, options) {
	// if we are trying to add an item which already exists,
	// we should change the operation to "replace"
	var _item = this.items[item.get("data.unique")];
	if (_item && _item.view.rendered() && options.priority != "high") {
		this._applySpotUpdates("replace", item, {"priority": "highest"});

		// notify top level function that the update was not applied,
		// because we routed an action to the "replace" operation
		return false;
	}
	this._applyStructureUpdates("add", item);
	item.set("added", true);
	if (item.isRoot()) {
		this._placeRootItem(item);
	} else {
		var parent = this._getParentItem(item);
		if (parent && parent.view.rendered()) {
			parent.view.render({"name": "container"});
			parent.view.render({"name": "children"});
			parent.view.render({"name": "childrenByCurrentActorLive"});
		}
	}
};

stream.methods._spotUpdates.replace = function(item, options) {
	item.unblock();
	if (this._maybeMoveItem(item)) {
		var parent = this._getParentItem(item);
		var sort = this.config.get(parent ? "children.sortOrder" : "sortOrder");
		var items = parent ? parent.get("children") : this.threads;
		var oldIdx = this._getItemListIndex(item, items);
		// We need to calculate the projected index of the item
		// after the "replace" action and compare it with the current one
		// to determine whether the item should be moved to the new place or not:
		//   - create a copy of the items list
		//   - remove the item from the copy
		//   - calculate the new index
		//   - compare the old and new indexes
		var container = $.extend([], items);
		container.splice(oldIdx, 1);
		var newIdx = this._getItemProjectedIndex(item, container, sort);
		if (oldIdx != newIdx) {
			this._applySpotUpdates("remove", item, {
				"keepChildren": true,
				"priority": "high"
			});
			this._applySpotUpdates("add", item, {"priority": "high"});
		}
	}
	if (item && item.view.rendered()) {
		item.view.render({"name": "container", "recursive": true});
		/**
		 * @event onRerender
		 * @echo_event Echo.StreamServer.Controls.Stream.Item.onRerender
		 * Triggered when the item is rerendered.
		 */
		item.events.publish({"topic": "onRerender"});
	}
};

stream.methods._spotUpdates.remove = function(item, options) {
	item.set("deleted", true);
	if (item.isRoot()) {
		/**
		 * @event onDelete
		 * @echo_event Echo.StreamServer.Controls.Stream.Item.onDelete
		 * Triggered when the item is deleted.
		 */
		item.events.publish({
			"topic": "onDelete",
			"data": {"config": options},
			"global": false,
			"propagation": false
		});
		this._applyStructureUpdates("delete", item, options);
	} else {
		var parent = this._getParentItem(item);
		if (parent) {
			parent.view.render({
				"name": "children",
				"target": parent.view.get("children"),
				"extra": options
			});
			parent.view.render({
				"name": "childrenByCurrentActorLive",
				"target": parent.view.get("childrenByCurrentActorLive"),
				"extra": options
			});
			this._applyStructureUpdates("delete", item, options);
			parent.view.render({"name": "container"});
		}
	}
};

stream.methods._spotUpdates.animate.add = function(item) {
	var self = this;
	this.activities.animations++;
	if (this.timeouts.slide) {
		// we should specify the element height explicitly
		// to avoid element jumping during the animation effect
		var currentHeight = item.config.get("target").show().css("height");
		item.config.get("target").css("height", currentHeight).hide().animate({
			"height": "show", 
			"marginTop": "show", 
			"marginBottom": "show", 
			"paddingTop": "show", 
			"paddingBottom": "show"
		},
		this.timeouts.slide,
		function(){
			// we should remove explicitly set height
			// as soon as the animation is complete
			item.config.get("target").css("height", "");
		});
	} else {
		item.config.get("target").show();
	}
	if (this.timeouts.fade) {
		var container = item.view.get("container");
		var originalBGColor = Echo.Utils.getVisibleColor(container);
		container
		// delay fading out until content sliding is finished
		.delay(this.timeouts.slide)
		.css({"backgroundColor": this.config.get("flashColor")})
		// Fading out
		.animate(
			{"backgroundColor": originalBGColor},
			this.timeouts.fade,
			"linear",
			function() {
				container.css("backgroundColor", "");
				self.activities.animations--;
				self._executeNextActivity();
			}
		);
	} else {
		this.activities.animations--;
		this._executeNextActivity();
	}
};

stream.methods._spotUpdates.animate.remove = function(item, config) {
	var self = this;
	this.activities.animations++;
	config = config || {};
	var callback = $.isFunction(config) ? config : config.callback || function() {
		if (!item.config.get("target").length) return;
		// if the item is being moved, we should keep all jQuery handlers
		// for the nested elements (children), thus we use "detach" instead of "remove"
		item.config.get("target")[config.keepChildren ? "detach" : "remove"]();
		item.set("vars", {});
		var itemsCount = Echo.Utils.foldl(0, self.items, function(_item, acc) {
			return acc + 1;
		});
		if (!itemsCount) {
			self.showMessage({
				"type": "empty",
				"message": self.labels.get("emptyStream"),
				"target": self.view.get("body")
			});
		}
		self.activities.animations--;
		self._executeNextActivity();
	};
	if (this.timeouts.slide) {
		item.config.get("target").slideUp(this.timeouts.slide, callback);
	} else {
		callback();
	}
};

stream.methods._applySpotUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	this.queueActivity({
		"action": action,
		"item": item,
		"priority": options.priority,
		"handler": function() {
			// execute corresponding update function and
			// launch the next activity if the operation was successful
			if (self._spotUpdates[action].call(self, item, options) !== false) {
				self._executeNextActivity();
			}
		}
	});
};

stream.methods._animateSpotUpdate = function(action, item, options) {
	this._spotUpdates.animate[action].call(this, item, options);
};

stream.methods.queueActivity = function(params) {
	if (!params.item) return;
	var actorID = params.item.get("data.actor.id");
	// we consider activity related to the current user if:
	//  - the corresponding item is blocked (moderation action in progress)
	//  - or the activity was performed by the current user
	var byCurrentUser = params.item.blocked || actorID && this.user.has("identity", actorID);
	var index = this._getActivityProjectedIndex(byCurrentUser, params);
	var data = {
		"action": params.action,
		"item": params.item,
		"type": params.type || "",
		"affectCounter": params.action === "add",
		"priority": params.priority,
		"byCurrentUser": byCurrentUser,
		"handler": params.handler
	};
	if (typeof index !== "undefined") {
		this.activities.queue.splice(index, 0, data);
	} else {
		this.activities.queue.push(data);
	}
};

stream.methods._getActivityProjectedIndex = function(byCurrentUser, params) {
	var priorityWeights = {
		"highest": 0,
		"high": 10,
		"medium": 20,
		"low": 30,
		"lowest": 40
	};
	params.priority = params.priority === "highest" && "highest"
		|| byCurrentUser && "high"
		|| params.action == "replace" && "medium"
		|| params.priority
		|| "lowest";
	var index;
	if (params.action === "replace") {
		// in case we have "replace" activity for the item which was not added
		// to the stream yet but queued only we should set its priority the same
		// as that "add" activity so that to queue them in the right order
		$.each(this.activities.queue, function(i, activity) {
			if (activity.action === "add" && activity.itemUnique === params.itemUnique) {
				params.priority = activity.priority;
				return false; // break
			}
		});
	}
	$.each(this.activities.queue, function(i, activity) {
		if (priorityWeights[params.priority] < priorityWeights[activity.priority]) {
			index = i;
			return false; // break
		}
	});
	return index;
};

stream.methods._classifyAction = function(entry) {
	return entry.verbs[0] === "http://activitystrea.ms/schema/1.0/delete"
		? "delete"
		: "post";
};

stream.methods._maybeMoveItem = function(item) {
	return item.get("forceInject");
};

stream.methods._withinVisibleFrame = function(item, items, isViewComplete, sortOrder) {
	items = items || this.threads;
	isViewComplete = typeof isViewComplete === "undefined"
		? this.isViewComplete
		: isViewComplete;
	sortOrder = sortOrder || this.config.get("sortOrder");
	if (isViewComplete || !items.length) {
		return true;
	}
	return this._compareItems(items[items.length - 1], item, sortOrder);
};

stream.methods._withinVisibleChildrenFrame = function(item) {
	var parent = this._getParentItem(item);
	if (!parent) {
		return false;
	}
	return this._withinVisibleFrame(
		item,
		parent.get("children"),
		!parent.hasMoreChildren(),
		this.config.get("children.sortOrder")
	);
};

stream.methods._getParentItem = function(item) {
	return item.isRoot() ? undefined : this.items[item.get("data.parentUnique")];
};

stream.methods._compareItems = function(a, b, sort) {
	var self = this;
	var result = false;
	switch (sort) {
		case "chronological":
			result = a.get("timestamp") > b.get("timestamp");
			break;
		case "reverseChronological":
			result = a.get("timestamp") <= b.get("timestamp");
			break;
		case "likesDescending":
		case "repliesDescending":
		case "flagsDescending":
			var getCount = function(entry) {
				return self._getRespectiveAccumulator(entry, sort);
			};
			result = (getCount(a) < getCount(b) ||
					(getCount(a) === getCount(b) &&
						this._compareItems(a, b, "reverseChronological")));
			break;
	}
	return result;
};

stream.methods._placeRootItem = function(item) {
	var content = item.config.get("target");
	if (this.threads.length > 1) {
		var id = this._getItemListIndex(item, this.threads);
		var next = this.threads[id + 1], prev = this.threads[id - 1];
		if (next) {
			next.config.get("target").before(content);
		} else {
			prev.config.get("target").after(content);
		}
	} else {
		this.view.get("body").empty().append(content);
	}
	/**
	 * @event onAdd
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.onAdd
	 * Triggered when the item is added.
	 */
	item.events.publish({
		"topic": "onAdd",
		"global": false,
		"propagation": false
	});
};

stream.methods._placeChildItems = function(parent, children) {
	var self = this;
	var itemsWrapper = this._createChildrenItemsDomWrapper(children, parent);

	// we should calculate index of the sibling item for the responsed items
	var targetItemIdx = -1;
	$.each(parent.get("children"), function(i,_item) {
		if (self._isItemInList(_item, children)) {
			targetItemIdx = i - 1;
			return false;
		}
	});

	var targetItemDom = targetItemIdx >= 0
		? parent.get("children")[targetItemIdx].config.get("target")
		: parent.view.get("children");
	var action = targetItemIdx >= 0
		? "insertAfter"
		: this.config.get("children.sortOrder") != "chronological" 
			? "prependTo"
			: "appendTo";
	itemsWrapper[action]($(targetItemDom));
	parent.view.render({"name": "childrenByCurrentActorLive"});
	// we should specify the element height explicitly
	// to avoid element jumping during the animation effect
	itemsWrapper
		.css("height", itemsWrapper.show().css("height"))
		.hide()
		.animate({
			"height": "show",
			"marginTop": "show",
			"marginBottom": "show",
			"paddingTop": "show", 
			"paddingBottom": "show"
		}, {
			"duration": this.config.get("children.itemsSlideTimeout"),
			"complete": function() {
				itemsWrapper.css("height", "");
				parent.view.render({"name": "expandChildren"});
				parent.view.render({"name": "expandChildrenLabel"});
				itemsWrapper.children().unwrap();
			}
		});
};

stream.methods._getItemListIndex = function(item, items) {
	var idx = -1;
	$.each(items || [], function(i, entry) {
		if (entry == item || entry.get("data.unique") === item.get("data.unique")) {
			idx = i;
			return false;
		}
	});
	return idx;
};

stream.methods._isItemInList = function(item, items) {
	return this._getItemListIndex(item, items) >= 0;
};

stream.methods._initItem = function(entry, isLive, callback) {
	var self = this;
	var parentConfig = this.config.getAsHash();
	var config = $.extend(true, {}, {
		"target": $("<div>"),
		"appkey": this.config.get("appkey"),
		"parent": parentConfig,
		"plugins": this.config.get("plugins"),
		"data": this._normalizeEntry(entry),
		"live": isLive,
		"ready": callback
	}, parentConfig.item);
	delete parentConfig.item;
	return new Echo.StreamServer.Controls.Stream.Item(config);
};

stream.methods._updateItem = function(entry) {
	var item = this.items[entry.unique];
	// forcing item re-injection if the published date or the respective accumulator was changed
	var sortOrder = this.config.get(item.isRoot() ? "sortOrder" : "children.sortOrder");
	var accRelatedSortOrder = sortOrder.match(/replies|likes|flags/);
	var acc = accRelatedSortOrder && this._getRespectiveAccumulator(item, sortOrder);
	if (item.data.object.published !== entry.object.published) {
		item.set("timestamp", Echo.Utils.timestampFromW3CDTF(entry.object.published));
		item.set("forceInject", true);
	}
	$.extend(item.data, entry);
	if (accRelatedSortOrder) {
		if (this._getRespectiveAccumulator(item, sortOrder) !== acc) {
			item.set("forceInject", true);
		}
	}
	return item;
};

stream.methods._getItemProjectedIndex = function(item, items, sort) {
	var self = this;
	var index;
	if (item.config.get("live") || item.get("forceInject")) {
		$.each(items || [], function(i, entry) {
			if (self._compareItems(entry, item, sort)) {
				index = i;
				return false;
			}
		});
	}
	return typeof index !== "undefined" ? index : items.length;
};

stream.methods._addItemToList = function(items, item, sort) {
	items.splice(this._getItemProjectedIndex(item, items, sort), 0, item);
	item.set("forceInject", false);
	this.items[item.get("data.unique")] = item;
};

stream.methods._applyStructureUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	switch (action) {
		case "add":
			// adding item into the list
			this.items[item.get("data.unique")] = item;
			if (!item.isRoot()) {
				var parent = this._getParentItem(item);

				// avoiding problem with missing parent
				if (!parent) {
					delete this.items[item.get("data.unique")];
					return;
				}

				item.set("depth", parent.get("depth") + 1);
				parent.set("threading", true);
				item.set("forceInject", true);
				this._addItemToList(
					parent.get("children"),
					item,
					this.config.get("children.displaySortOrder")
				);
			} else {
				this._addItemToList(this.threads, item, this.config.get("sortOrder"));
			}
			break;
		case "delete":
			var container = item.isRoot()
				? this.threads
				: this.items[item.get("data.parentUnique")].get("children");
			if (!item.isRoot() && container.length === 1) {
				var parent = this._getParentItem(item);
				if (parent) parent.set("threading", false);
			}
			container.splice(this._getItemListIndex(item, container), 1);
			if (!options.keepChildren) {
				item.traverse(item.get("children"), function(child) {
					delete self.items[child.get("data.unique")];
				});
				item.set("children", []);
			}
			delete this.items[item.get("data.unique")];
			break;
	}
};

stream.methods._normalizeEntry = function(entry) {
	if (entry.normalized) return entry;
	var self = this;
	entry.normalized = true;

	// detecting actual target
	$.each(entry.targets || [], function(i, target) {
		if ((target.id === target.conversationID) ||
			(target.id === entry.object.id) ||
			(self.items[target.id + target.conversationID])) {
				entry.target = target;
		}
	});

	entry.object.content_type = entry.object.content_type || "text";
	entry.object.accumulators = entry.object.accumulators || {};
	$.each(["repliesCount", "flagsCount", "likesCount"], function(i, name) {
		entry.object.accumulators[name] = parseInt(entry.object.accumulators[name] || "0");
	});
	entry.object.context = entry.object.context || [];
	entry.object.flags = entry.object.flags || [];
	entry.object.likes = entry.object.likes || [];
	entry.target = entry.target || entry.targets[0] || {};
	entry.target.conversationID = entry.target.conversationID || entry.object.id;
	entry.source = entry.source || {};
	entry.provider = entry.provider || {};
	entry.unique = entry.object.id + entry.target.conversationID;
	entry.parentUnique = entry.target.id + entry.target.conversationID;
	entry.hasMoreChildren = entry.hasMoreChildren || "false";
	return entry;
};

stream.css =
	'.{class:message-wrapper} { padding: 15px 0px; text-align: center; -moz-border-radius: 0.5em; -webkit-border-radius: 0.5em; border: 1px solid #E4E4E4; }' +
	'.{class:message-empty}, .{class:message-loading}, .{class:message-error} { display: inline-block; height: 16px; padding-left: 21px; background: no-repeat left center; }' +
	'.{class:message-empty} { background-image: url(' + Echo.Loader.getURL("{sdk}/images/information.png") + '); }' +
	'.{class:message-loading} { background-image: url(' + Echo.Loader.getURL("{sdk}/images/loading.gif") + '); }' +
	'.{class:message-error} { background-image: url(' + Echo.Loader.getURL("{sdk}/images/warning.gif") + '); }' +
	'.{class:header} { margin: 10px 0px 10px 20px; }' +
	'.{class:state} { float: right; }' +
	'.{class:state-picture} { display: inline-block; height: 9px; width: 8px; }' +
	'.{class:state-picture-paused} { background: url("' + Echo.Loader.getURL("{sdk}/images/control_pause.png") + '") no-repeat center center; }' +
	'.{class:state-picture-live} { background: url("' + Echo.Loader.getURL("{sdk}/images/control_play.png") + '") no-repeat center center; }' +
	'.{class:state-message} { margin-left: 5px; text-decoration: none; }' +
	'.echo-clickable a.{class:state-message}:hover { text-decoration: underline; }' +
	'.{class:more-hover} { background-color: #E4E4E4; }' +
	'.{class:more} { text-align: center; border: solid 1px #E4E4E4; margin-top: 10px; padding: 10px; -moz-border-radius: 0.5em; -webkit-border-radius: 0.5em; cursor: pointer; font-weight: bold; }' +
	'.{class:more} .echo-app-message { padding: 0; border: none; border-radius: 0; }' +
	($.browser.msie
		? '.{class:state-picture} { vertical-align: middle; }' +
		'.{class:container} { zoom: 1; }'
		: ''
	);

Echo.Control.create(stream);

})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream.Item")) return;

/**
 * @class Echo.StreamServer.Controls.Stream.Item
 * Echo Stream.Item control which encapsulates Item mechanics.
 *
 * @extends Echo.Control
 *
 * @constructor
 * Item constructor initializing Echo.StreamServer.Controls.Stream.Item class
 *
 * @param {Object} config
 * Configuration options
 */
var item = Echo.Control.manifest("Echo.StreamServer.Controls.Stream.Item");

item.init = function() {
	this.timestamp = Echo.Utils.timestampFromW3CDTF(this.get("data.object.published"));
	this.ready();
};

item.config = {
	/**
	 * @cfg {Boolean} aggressiveSanitization
	 * If this parameter value is set to `true`, the entire item body will
	 * be replaced with "I just shared this on Twitter..." text in the 
	 * stream if the item came from Twitter.
	 */
	"aggressiveSanitization": false,
	"buttonsOrder": undefined,
	/**
	 * @cfg {Object} contentTransformations
	 * Specifies allowed item's content transformations for each content type.
	 * Contains a hash where keys are content types and values are arrays with
	 * formatting options enabled for given content type. Available options are:
	 *
	 * + smileys - replaces textual smileys with images
	 * + hashtags - highlights hashtags in text
	 * + urls - highlights urls represented as plain text
	 * + newlines - replaces newlines with <br> tags
	 */
	"contentTransformations": {
		"text": ["smileys", "hashtags", "urls", "newlines"],
		"html": ["smileys", "hashtags", "urls", "newlines"],
		"xhtml": ["smileys", "hashtags", "urls"]
	},
	/**
	 * @cfg {String} infoMessages
	 * Customizes the look and feel of info messages,
	 * for example "loading" and "error".
	 */
	"infoMessages": {
		"enabled": false
	},
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
	 * ("\n" for plain text or <br> for HTML format).
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
	 * If set to true the context is turned into optimized mode. "reTag" section
	 * contains only one hyperlink in this case (the same current domain is a priority).
	 * Otherwise all hyperlinks in the item body will be resolved and converted into reTags.
	 */
	"optimizedContext": true,
	/**
	 * @cfg {Boolean} [retag=true]
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
	}
};

item.config.normalizer = {
	"contentTransformations": function(object) {
		$.each(object, function(contentType, options) {
			object[contentType] = Echo.Utils.foldl({}, options || [],
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
	"today": "Today",
	/**
	 * @echo_label
	 */
	"yesterday": "Yesterday",
	/**
	 * @echo_label
	 */
	"lastWeek": "Last Week",
	/**
	 * @echo_label
	 */
	"lastMonth": "Last Month",
	/**
	 * @echo_label
	 */
	"secondAgo": "Second Ago",
	/**
	 * @echo_label
	 */
	"secondsAgo": "Seconds Ago",
	/**
	 * @echo_label
	 */
	"minuteAgo": "Minute Ago",
	/**
	 * @echo_label
	 */
	"minutesAgo": "Minutes Ago",
	/**
	 * @echo_label
	 */
	"hourAgo": "Hour Ago",
	/**
	 * @echo_label
	 */
	"hoursAgo": "Hours Ago",
	/**
	 * @echo_label
	 */
	"dayAgo": "Day Ago",
	/**
	 * @echo_label
	 */
	"daysAgo": "Days Ago",
	/**
	 * @echo_label
	 */
	"weekAgo": "Week Ago",
	/**
	 * @echo_label
	 */
	"weeksAgo": "Weeks Ago",
	/**
	 * @echo_label
	 */
	"metadataModeSwitchTitle": "Return to default view",
	/**
	 * @echo_label
	 */
	"monthAgo": "Month Ago",
	/**
	 * @echo_label
	 */
	"monthsAgo": "Months Ago",
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
	"childrenMoreItems": "View more items"
};

item.methods.template = function() {
	return '<div class="{class:content}">' +
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
							'<div class="{class:metadata}">' +
								'<div class="{class:metadata-userID}">' +
									'<span class="{class:metadata-title} {class:metadata-icon}">' +
										'{label:userID}' +
									'</span>' +
									'<span class="{class:metadata-value}">{data:actor.id}</span>' +
								'</div>' +
								'<div class="{class:metadata-userIP} {class:metadataUserIP}">' +
									'<span class="{class:metadata-title} {class:metadata-icon}">' +
										'{label:userIP}' +
									'</span>' +
									'<span class="{class:metadata-value}">{data:ip}</span>' +
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
					'<div class="echo-clear"></div>' +
				'</div>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
			'<div class="{class:childrenMarker}"></div>' +
		'</div>' +
		(this.config.get("parent.children.sortOrder") === "chronological"
			? '<div class="{class:children}"></div>' +
			'<div class="{class:expandChildren} {class:container-child} echo-trinaryBackgroundColor echo-clickable">' +
				'<span class="{class:expandChildrenLabel} echo-message-icon"></span>' +
			'</div>'
			: '<div class="{class:expandChildren} {class:container-child} echo-trinaryBackgroundColor echo-clickable">' +
				'<span class="{class:expandChildrenLabel} echo-message-icon"></span>' +
			'</div>' +
			'<div class="{class:children}"></div>'
		) +
		'<div class="{class:childrenByCurrentActorLive}"></div>' +
	'</div>';
};

/**
 * @echo_renderer
 */
item.renderers.authorName = function(element) {
	return element.append(this.get("data.actor.title") || this.labels.get("guest"));
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
			if (!self.get("buttons." + name + ".element")) return;
			var clickables = self.get("buttons." + name + ".clickableElements");
			clickables[action + "Class"]("echo-linkColor");
		});
	};
	if (!Echo.Utils.isMobileDevice()) {
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
item.renderers.metadataUserIP = function(element) {
	if (!this.get("data.ip")) {
		element.hide();
	}
	return element;
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
	if (Echo.Utils.isMobileDevice()) {
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
	var size = this.depth ? 24 : 48;
	var avatar = Echo.Utils.loadImage(
		this.get("data.actor.avatar"),
		this.user.config.get("defaultAvatar")
	);
	avatar.css({"width": size, "height": size});
	return element.empty().append(avatar);
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
	if (!this.config.get("reTag")) {
		return element;
	}
	var context = this.get("data.object.context");
	var re = "";
	//XXX use normalized permalink and location instead
	var permalink = this.get("data.object.permalink");
	var limits = this.config.get("limits");
	var openLinksInNewWindow = this.config.get("parent.openLinksInNewWindow");

	var getDomain = function(url) {
		var parts = Echo.Utils.parseURL(url);
		return parts && parts.domain ? parts.domain : url;
	};

	var reOfContext = function(c) {
		var maxLength = limits.maxReTitleLength;
		if (!c.title) {
			maxLength = limits.maxReLinkLength;
			c.title = c.uri.replace(/^https?:\/\/(.*)/ig, '$1');
		}
		if (c.title.length > maxLength) {
			c.title = c.title.substring(0, maxLength) + "...";
		}
		return "<div>" + Echo.Utils.hyperlink({
			"class": "echo-primaryColor",
			"href": c.uri,
			"caption": "Re: " + Echo.Utils.stripTags(c.title)
		}, {
			"openInNewWindow": openLinksInNewWindow
		}) + "</div>";
	};

	var pageHref = document.location.href;
	var pageDomain = getDomain(pageHref);

	if (permalink === pageHref || this.depth || !context || !context.length) {
		return element;
	}
	var mustSkipContext = false;
	$.each(context, function(i, c) {
		//XXX use normalized uri
		if (c.uri === pageHref) {
			mustSkipContext = true;
			return false; //break
		}
	});

	if (mustSkipContext) {
		return element;
	}

	if (this.config.get("optimizedContext")) {
		var primaryContext = context[0];
		$.each(context, function(i, c) {
			if (getDomain(c.uri) === pageDomain) {
				primaryContext = c;
				return false; //break
			}
		});
		if (primaryContext) {
			re = reOfContext(primaryContext);
		}
	} else {
		$.each(context, function(i, c) {
			re += reOfContext(c);
		});
	}
	return element.empty().append(re);
};

/**
 * @echo_renderer
 */
item.renderers.sourceIcon = function(element) {
	var self = this;
	if (!this.config.get("viaLabel.icon") ||
			this.get("data.source.name") == "jskit" ||
			this.get("data.source.name") == "echo") {
		this.view.remove(element);
	}
	var hyperlink = Echo.Utils.hyperlink({
		"href": this.get("data.source.uri", this.get("data.object.permalink"))
	}, {
		"openInNewWindow": this.config.get("parent.openLinksInNewWindow")
	});
	var url = this.get("data.source.icon", this.config.get("providerIcon"));
	element.hide().attr("src", Echo.Utils.htmlize(url))
		.show()
		.one("error", function() { self.view.remove(element); })
		.wrap(hyperlink);
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
	this.view.get("text").empty().append(text);
	this.view.get("textEllipses")[!truncated || this.textExpanded ? "hide" : "show"]();
	this.view.get("textToggleTruncated")[truncated || this.textExpanded ? "show" : "hide"]();
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.date = function(element) {
	this._calcAge();
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
			"css": "echo-linkColor echo-message-icon",
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
		// IE in Quirks mode can't handle elements with the "height: 0px" correctly,
		// element with the "height: 0px" is renderered like it doesn't have
		// the height property at all. Thus we set the "height: 1px" as the final value
		// for the animate function and simply hide element when the animation is done.
		if ($.browser.msie && document.compatMode !== "CSS1Compat") {
			element.animate({
				"height": "1px",
				"marginTop": "hide",
				"marginBottom": "hide",
				"paddingTop": "hide",
				"paddingBottom": "hide"
			}, {
				"duration": this.config.get("children.moreButtonSlideTimeout"),
				"complete": function() {
					element.hide();
				}
			});
		} else {
			element.slideUp(this.config.get("children.moreButtonSlideTimeout"));
		}
		return element;
	}
	extra = extra || {};

	// the "show()" jQuery method doesn't work for some reasons in Chrome (A:5755)
	element.css("display", "block");

	return element.addClass(this.cssPrefix + "depth-" + (this.depth + 1))
		.off("click")
		.one("click", function() {
			self.view.render({
				"name": "expandChildrenLabel",
				"target": self.view.get("expandChildrenLabel"),
				"extra": {"state": "loading"}
			});
			/**
			 * @event onChildrenExpand
			 * @echo_event Echo.StreamServer.Controls.Stream.Item.onChildrenExpand
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
			 * @event onDelete
			 * @echo_event Echo.StreamServer.Controls.Stream.Item.onDelete
			 * Triggered when the child item is deleted.
			 */
			/**
			 * @event onAdd
			 * @echo_event Echo.StreamServer.Controls.Stream.Item.onAdd
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
		this.view.remove(element);
		return element;
	}
	var name = type === "markers" ? "maxMarkerLength" : "maxTagsLength";
	var limit = this.config.get("limits." + name);
	var items = Echo.Utils.foldl([], this.data.object[type], function(item, acc) {
		var template = item.length > limit
			? '<span title="{data:item}">{data:truncatedItem}</span>'
			: '<span>{data:item}</span>';
		var truncatedItem = Echo.Utils.htmlTextTruncate(item, limit, "...");
		acc.push(self.substitute({
			"template": template,
			"data": {"item": item, "truncatedItem": truncatedItem}
		}));
	});
	return element.prepend(items.sort().join(", "));
};

item.renderers._button = function(element, extra) {
	var template = extra.template ||
		'<a class="{class:button} {class:button}-{data:name}">{data:label}</a>';
	var data = {
		"label": extra.label || "",
		"name": extra.name
	};
	var button = $(this.substitute({"template": template, "data": data}));
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
	if (Echo.Utils.isMobileDevice()) {
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
	var a = Echo.Utils.hyperlink({
		"class": "echo-secondaryColor",
		"href": data.uri || this.get("data.object.permalink"),
		"caption": data.name
	}, {
		"openInNewWindow": this.config.get("parent.openLinksInNewWindow")
	});
	return element.html("&nbsp;" + this.labels.get(extra.label + "Label") + "&nbsp;").append(a);
};

/**
 * Method checking if item has more children.
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
 * Method to add the item control button specification.
 *
 * @param {String} plugin
 * Plugin name.
 *
 * @param {Function} spec
 * Function describing the control specification.
 */
item.methods.addButtonSpec = function(plugin, spec) {
	if (!this.buttonSpecs[plugin]) {
		this.buttonSpecs[plugin] = [];
	}
	this.buttonSpecs[plugin].push(spec);
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

item.methods._calcAge = function() {
	if (!this.timestamp) return;
	var self = this;
	var d = new Date(this.timestamp * 1000);
	var now = (new Date()).getTime();
	var when;
	var diff = Math.floor((now - d.getTime()) / 1000);
	var dayDiff = Math.floor(diff / 86400);
	var getAgo = function(ago, period) {
		return ago + " " + self.labels.get(period + (ago == 1 ? "" : "s") + "Ago");
	};

	if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 365) {
		when = d.toLocaleDateString() + ', ' + d.toLocaleTimeString();
	} else if (diff < 60) {
		when = getAgo(diff, 'second');
	} else if (diff < 60 * 60) {
		diff = Math.floor(diff / 60);
		when = getAgo(diff, 'minute');
	} else if (diff < 60 * 60 * 24) {
		diff = Math.floor(diff / (60 * 60));
		when = getAgo(diff, 'hour');
	} else if (diff < 60 * 60 * 48) {
		when = this.labels.get("yesterday");
	} else if (dayDiff < 7) {
		when = getAgo(dayDiff, 'day');
	} else if (dayDiff < 14) {
		when = this.labels.get("lastWeek");
	} else if (dayDiff < 30) {
		diff =  Math.floor(dayDiff / 7);
		when = getAgo(diff, 'week');
	} else if (dayDiff < 60) {
		when = this.labels.get("lastMonth");
	} else if (dayDiff < 365) {
		diff =  Math.floor(dayDiff / 31);
		when = getAgo(diff, 'month');
	}
	if (this.age !== when) {
		this.age = when;
	}
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
		return '<img class="' + self.cssPrefix + 'smiley-icon" src="' + Echo.Loader.getURL("{sdk}/images/smileys/emoticon_") + smiley.file + '" title="' + smiley.title + '" alt="' + smiley.title + '" />';
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
				 * @event onButtonClick 
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.onButtonClick
				 * Triggered when the item control button is clicked.
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
		var order = Echo.Utils.foldl([], requiredOrder, function(name, acc) {
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
			_removeLinksToSelf,
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

	var _removeLinksToSelf = function(text, extra) {
		if (extra.source && extra.source !== "jskit" && extra.source !== "echo") {
			var url = this.depth
				? this.get("data.target.id")
				: this.config.get("reTag")
					? this.get("data.object.permalink") || this.get("data.target.id")
					: undefined;
			if (url) {
				text = text.replace(new RegExp(url, "g"), "");
			}
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
			if (new RegExp("^" + _urlMatcher + "$").test($2)) {
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
		var self = this;
		if (extra.contentTransformations.urls) {
			text = text.replace(new RegExp(_urlMatcher, "ig"), function($0, $1) {
				return Echo.Utils.hyperlink({
					"href": $1,
					"caption": $1
				}, {
					"skipEscaping": true,
					"openInNewWindow": extra.openLinksInNewWindow
				});
			});
		}
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
				var chunks = result.split(splitter);
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
			// we should call Echo.Utils.htmlTextTruncate to close all tags
			// which might remain unclosed after lines truncation
			var truncatedText = Echo.Utils.htmlTextTruncate(text, limit, "", true);
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
	'.{class:container-root} { padding: 10px 0px; }' +
	'.{class:container-root-thread} { padding: 10px 0px 0px 0px; }' +
	'.{class:container-child} { padding: 10px; margin: 0px 20px 2px 0px; }' +
	'.{class:container-child-thread} { padding: 10px; margin: 0px 20px 2px 0px; }' +
	'.{class:avatar-wrapper} { margin-right: -58px; float: left; position: relative; }' +
	'.{class:children} .{class:avatar-wrapper}, .{class:childrenByCurrentActorLive} .{class:avatar-wrapper} { margin-right: -34px; }' +
	'.{class:children} .{class:subwrapper}, .{class:childrenByCurrentActorLive} .{class:subwrapper} { margin-left: 34px; }' +
	'.{class:wrapper} { float: left; width: 100%; }' +
	'.{class:subwrapper} { margin-left: 58px; }' +
	'.{class:subcontainer} { float: left; width: 100%; }' +
	'.{class:markers} { line-height: 16px; background: url(' + Echo.Loader.getURL("{sdk}/images/curation/metadata/marker.png") + ') no-repeat; padding: 0px 0px 4px 21px; margin-top: 7px; }' +
	'.{class:tags} { line-height: 16px; background: url(' + Echo.Loader.getURL("{sdk}/images/tag_blue.png") + ') no-repeat; padding: 0px 0px 4px 21px; }' +
	'.{class:metadata} { display: none; }' +
	'.{class:metadata-title} { font-weight: bold; line-height: 25px; height: 25px; margin-right: 5px; }' +
	'.{class:metadata-icon} { display: inline-block; padding-left: 26px; }' +
	'.{class:metadata-userID} { border-bottom: 1px solid #e1e1e1; border-top: 1px solid #e1e1e1;}' +
	'.{class:metadata-userID} .{class:metadata-icon} { background: url("' + Echo.Loader.getURL("{sdk}/images/curation/metadata/user.png") + '") no-repeat left center; }' +
	'.{class:metadata-userIP} { border-bottom: 1px solid #e1e1e1; }' +
	'.{class:metadata-userIP} .{class:metadata-icon} { background: url("' + Echo.Loader.getURL("{sdk}/images/curation/metadata/computer.png") + '") no-repeat left center; }' +
	'.{class:modeSwitch} { float: right; width: 16px; height: 16px; background:url("' + Echo.Loader.getURL("{sdk}/images/curation/metadata/flip.png") + '") no-repeat 0px 3px; }' +
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
	'.{class:sourceIcon} { float: left; height: 16px; width: 16px; margin-right: 5px; border: 0px; }' +
	'.{class:date}, .{class:from}, .{class:via} { float: left; }' +
	'.{class:from} a, .{class:via} a { text-decoration: none; color: #C6C6C6; }' +
	'.{class:from} a:hover, .{class:via} a:hover { color: #476CB8; }' +
	'.{class:tag} { display: inline-block; height: 16px; background: url("' + Echo.Loader.getURL("{sdk}/images/tag_blue.png") + '") no-repeat; padding-left: 18px; }' +
	'.{class:smiley-icon} { border: 0px; }' +
	'.{class:textToggleTruncated} { margin-left: 5px; }' +
	'.{class:blocker-backdrop} { position: absolute; left: 0px; top: 0px; background: #FFFFFF; opacity: 0.7; z-index: 100; }' +
	'.{class:blocker-message} { position: absolute; z-index: 200; width: 200px; height: 20px; line-height: 20px; text-align: center; background-color: #FFFF99; border: 1px solid #C6C677; opacity: 0.7; -moz-border-radius: 0.5em 0.5em 0.5em 0.5em; }' +
	'.{class:expandChildren} { display:none; text-align: center; padding:4px; }' +
	'.{class:expandChildren} .{class:expandChildrenLabel} { display: inline-block; padding-left: 22px; }' +
	'.{class:expandChildren} .echo-message-icon { background: url("' + Echo.Loader.getURL("{sdk}/images/whirlpool.png") + '") no-repeat 5px 4px; }' +
	'.{class:expandChildren} .{class:message-loading} { background: no-repeat left top url(' + Echo.Loader.getURL("{sdk}/images/loading.gif") + '); }' +
	'.{class:expandChildren} .echo-app-message { padding: 0; border:none; border-radius: 0; }' +
	itemDepthRules.join("\n") +
	($.browser.msie
		? '.{class:childrenMarker} { font-size: 1px; line-height: 1px; }' +
		'.{class:blocker-backdrop}, .{class:blocker-message} { filter:alpha(opacity=70); }' +
		'.{class:content}, .{class:container}, .{class:subwrapper} { zoom: 1; }' +
		'.{class:avatar-wrapper} { position: static; }'
		: ''
	);

Echo.Control.create(item);

})(Echo.jQuery);
