(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream")) return;

var stream = Echo.Control.skeleton("Echo.StreamServer.Controls.Stream");

stream.config = {
	"aggressiveSanitization": false,
	"children": {
		"additionalItemsPerPage": 5,
		"displaySortOrder": "chronological",
		"sortOrder": "reverseChronological",
		"moreButtonSlideTimeout": 600,
		"itemsSlideTimeout": 600,
		"maxDepth": 1
	},
	"contentTransformations": {
		"text": ["smileys", "hashtags", "urls", "newlines"],
		"html": ["smileys", "hashtags", "urls", "newlines"],
		"xhtml": ["smileys", "hashtags", "urls"]
	},
	"fadeTimeout": 2800,
	"flashColor": "#ffff99",
	"itemControlsOrder": undefined,
	"itemsPerPage": 15,
	"maxBodyCharacters": undefined,
	"maxBodyLines": undefined,
	"maxBodyLinkLength": 50,
	"maxMarkerLength": 16,
	"maxReLinkLength": 30,
	"maxReTitleLength": 143,
	"maxTagLength": 16,
	"openLinksInNewWindow": false,
	"optimizedContext": true,
	"providerIcon": "//cdn.echoenabled.com/images/favicons/comments.png",
	"reTag": true,
	"slideTimeout": 700,
	"sortOrder": "reverseChronological",
	"streamStateLabel": {
		"icon": true,
		"text": true
	},
	"streamStateToggleBy": "mouseover", // mouseover | button | none
	"submissionProxyURL": window.location.protocol + "//apps.echoenabled.com/v2/esp/activity",
	"viaLabel": {
		"icon": false,
		"text": false
	}
};

stream.labels = {
	"guest": "Guest",
	"live": "Live",
	"paused": "Paused",
	"more": "More",
	"emptyStream": "No items at this time...",
	"new": "new"
};

stream.events = {
	"internal.User.onInvalidate": function() {
		this.refresh();
	},
	"internal.Item.onAdd": function(topic, data) {
		var self = this;
		data.item.dom.content.hide();
		this.queueActivity({
			"action": "animation",
			"actorID": data.item.data.actor.id,
			"itemUnique": data.item.data.unique,
			"priority": "highest",
			"handler": function() {
				delete data.item.added;
				self.addItemSpotUpdate(data.item);
			}
		});
	},
	"internal.Item.onDelete": function(topic, data) {
		var self = this;
		this.queueActivity({
			"action": "animation",
			"itemUnique": data.item.data.unique,
			"actorID": data.item.data.actor.id,
			"priority": "highest",
			"handler": function() {
				delete data.item.deleted;
				self.deleteItemSpotUpdate(data.item, data.config);
			}
		});
	},
	"internal.Item.onRender": function(topic, data) {
		this.events.publish({
			"topic": "Stream.Item.onRender",
			"data": this.prepareBroadcastParams({
				"item": {
					"data": data.item.data,
					"target": data.item.dom.content
				}
			})
		});
	},
	"internal.Item.onControlClick": function(topic, data) {
		topic = this.namespace + ".Item.onControlClick";
		this.events.publish({
			"topic": topic,
			"data": this.prepareBroadcastParams(data)
		});
	},
	"internal.Item.onChildrenExpand": function(topic, args) {
		this.childrenRequestItems(args.data.unique);
	},
	"Submit.onPostComplete": function(topic) {
		var self = this;
		Echo.Broadcast.subscribe({
			"topic": topic,
			"handler": function() {
				self.startLiveUpdates(true);
			}
		});
	},
	"Submit.onEditComplete": function(topic) {
		var self = this;
		Echo.Broadcast.subscribe({
			"topic": topic,
			"handler": function() {
				self.startLiveUpdates(true);
			}
		});
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

stream.renderers.body = function(element) {
	var self = this;
	element = element || this.dom.get("body");
	if (!this.lastRequest) {
		/*this.showMessage({
			"type": "loading",
			"message": this.labels.get(
				this.isErrorWithTimer(this.error)
					? "retrying"
					: this.isWaitingForData(this.error)
						? "error_" + this.error.errorCode
						: "loading"
			)
		}, element);*/
		return;
	}

	if (this.lastRequest.data.length) {
		if (this.lastRequest.initial) element.empty();
		this.appendRootItems(this.lastRequest.data, element);
	} else {
		/*this.showMessage({
			"type": "empty",
			"message": this.labels.get("emptyStream")
		}, element);*/
	}
	if (this.lastRequest.initial && this.config.get("streamStateToggleBy") == "mouseover" && this.config.get("liveUpdates")) {
		element.bind({
			"mouseleave": function() {
				self.setStreamState("live");
			},
			"mouseenter": function() {
				self.setStreamState("paused");
			}
		});
	}
	this.events.publish({
		"topic": "Stream.onReady",
		"data": this.prepareBroadcastParams({"initial": this.lastRequest.initial})
	});
};

stream.renderers.state = function(element) {
	var self = this;
	var label = this.config.get("streamStateLabel");
	if ((!label.icon && !label.text) || !this.config.get("liveUpdates")) return;

	var activitiesCount = 0;
	if (this.activities.state == "paused") {
		activitiesCount = Echo.Utils.foldl(0, self.activities.queue, function(entry, acc) {
			if (entry.affectCounter) {
				return ++acc;
			}
		});
	}
	var currentState = this.activities.state + activitiesCount;
	if (currentState == this.activities.lastState) return;

	element = (element || this.dom.get("state")).empty();
	if (!this.activities.lastState && this.config.get("streamStateToggleBy") == "button") {
		element.addClass("echo-linkColor echo-clickable").click(function(e) {
			self.setStreamState(self.activities.state == "paused" ? "live" : "paused");
		});
	}
	var templates = {
		"picture" : '<span class="echo-stream-state-picture echo-stream-state-picture-' + this.activities.state +'"></span>',
		"message" : this.config.get("streamStateToggleBy") == "button"
			? '<a href="javascript:void(0)" class="echo-stream-state-message">{Label:' + this.activities.state + '}</a>'
			: '<span class="echo-stream-state-message">{Label:' + this.activities.state + '}</span>',
		"count" : ' <span class="echo-stream-state-count">({Data:count} {Label:new})</span>'
	};
	if (label.icon) {
		element.append(templates.picture);
	}
	if (label.text) {
		element.append(this.substitute(templates.message));
		if (activitiesCount && this.activities.state == "paused") {
			element.append(this.substitute(
				templates.count,
				{"count": activitiesCount}
			));
		}
	}
	this.activities.lastState = currentState;
};

stream.renderers.more = function(element) {
	var self = this;
	if (this.isViewComplete || !this.threads.length) {
		return element.empty().hide();
	}
	return element.empty()
		.append(this.labels.get("more"))
		.hover(function() {
			element.addClass("echo-stream-more-hover");
		}, function() {
			element.removeClass("echo-stream-more-hover");
		})
		.show()
		.unbind("click")
		.one("click", function() {
			self.events.publish({
				"topic": "Stream.onMoreButtonPress",
				"data": self.prepareBroadcastParams()
			});
			element.html(self.labels.get("loading"));
			self.moreRequestItems(element);
		});
};

stream.methods.initVars = function() {
	this.activities = {
		"queue": [],
		"state": this.config.get("liveUpdates") ? "live" : "paused", // live | paused
		"lastState": "", // live0 | pausedN
		"animations": 0
	};
	this.hasInitialData = false;
	this.items = {};   // items by unique key hash
	this.threads = []; // items tree
	//this.cleanupErrorHandlers();
};

stream.methods.actualizeChildrenList = function(parent, entries) {
	var self = this;
	return $.map(entries, function(entry) {
		// we should change entry conversationID in accordance with
		// conversationID of the root item
		entry.targets = $.map(entry.targets, function(target) {
			target.conversationID = parent.conversation;
			return target;
		});
		entry = self.normalizeEntry(entry);
		var item = self.items[entry.unique];
		// drop item from items list if the item already exists
		// in the tree, which means that it was posted by the current user
		// and arrived as a live update
		if (item && item.byCurrentUser) {
			self.applyStructureUpdates("delete", item);
		}
		return entry;
	});
};

stream.methods.createChildrenItemsDomWrapper = function(children, parent) {
	var self = this;
	var wrapper = $("<div class='echo-item-children-wrapper'></div>");
	var getIdx = function(item) { return self.getItemListIndex(item, parent.children); };
	$.each(children, function(i, item) {
		item.render();
		var insertion = i > 0 && getIdx(children[i-1]) < getIdx(item)
			? "append"
			: "prepend";
		wrapper[insertion](item.dom.content);
	});
	return wrapper;
};

stream.methods.childrenRequestItems = function(unique) {
	var self = this;
	var item = this.items[unique];
	this.sendAPIRequest({
		"endpoint": "search",
		"query": {"q": this.constructChildrenSearchQuery(item)}
	}, function(data) {
		var element = item.dom.get("expandChildren");
		if (data.result == "error") {
			self.handleErrorResponse(data, {
				"messageTarget": element,
				"waitingHandler": function() {
					self.childrenRequestItems(unique);
				}
			});
			if (!self.isWaitingForData(data))  {
				element.removeClass("echo-clickable")
					.delay(3000)
					.slideUp(self.config.get("children.moreButtonSlideTimeout"));
			}
			return;
		}
		if (!data.hasMoreChildren || data.hasMoreChildren == "false") {
			item.data.hasMoreChildren = false;
		}
		item.data.nextPageAfter = data.nextPageAfter;
		data.entries = self.actualizeChildrenList(item, data.entries);
		self.events.publish({
			"topic": "Stream.onDataReceive",
			"data": self.prepareBroadcastParams({
				"entries": data.entries,
				"initial": false
			})
		});
		var children = [];
		$.each(data.entries, function(i, entry) {
			var _item = self.initItem(entry);
			self.applyStructureUpdates("add", _item);
			if (entry.parentUnique == item.data.unique) children.push(_item);
		});
		self.placeChildrenItems(item, children, data.entries);
	});	
};

stream.methods.initialItemsRequest = function() {
	var self = this;
	this.requestItems({}, function(data) {
		self.lastRequest = {
			"initial": true,
			"data": data
		};
		self.render("body");
	});
};

stream.methods.moreRequestItems = function(element) {
	var self = this;
	element = element || this.dom.get("more");
	this.lastRequest = {
		"initial": false
	};
	this.requestItems({
		"pageAfter": '"' + (self.nextPageAfter || "0") + '"'
	}, function(items) {
		if (items.length) {
			self.lastRequest.data = items;
			self.render("body");
		} else {
			element.html(self.labels.get("emptyStream")).delay(1000).fadeOut(1000);
		}
	});
};

stream.methods.setStreamState = function(state) {
	this.activities.state = state;
	if (state == "live") this.executeNextActivity();
	this.rerender("state");
};

stream.methods.refresh = function() {
	this.stopLiveUpdates();
	this.initVars();
	delete this.lastRequest;
	this.clearCache();
	this.rerender();
	this.initialItemsRequest();
	this.events.publish({
		"topic": "Stream.onRerender",
		"data": this.prepareBroadcastParams()
	});
};

stream.methods.extractPresentationConfig = function(data) {
	return Echo.Utils.foldl({}, ["sortOrder", "itemsPerPage", "safeHTML"], function(key, acc) {
		if (typeof data[key] != "undefined") {
			acc[key] = data[key];
		}
	});
};

stream.methods.extractTimeframeConfig = function(data) {
	var getComparator = function(value) {
		var m = value.match(/^(<|>)(.*)$/);
		var op = m[1];
		var v = m[2].match(/^'([0-9]+) seconds ago'$/);
		var getTS = v
			? function() { return Math.floor((new Date()).getTime() / 1000) - v[1]; }
			: function() { return m[2]; };
		var f;
		if (op == '<') {
			f = function(ts) {
				return ts < getTS()
			}
		} else if (op == '>') {
			f = function(ts) {
				return ts > getTS()
			}
		}
		return f;
	};
	var timeframe = Echo.Utils.foldl([], ["before", "after"], function(key, acc) {
		if (!data[key]) return;
		var cmp = getComparator(data[key]);
		if (cmp) acc.push(cmp);
	});
	return {"timeframe": timeframe};
};

stream.methods.assembleConfigNormalizer = function() {
	var self = this;
	var ensurePositiveValue = function(v) { return v < 0 ? 0 : v; };
	var normalizer = {
		"contentTransformations" : function(object) {
			$.each(object, function(contentType, options) {
				object[contentType] = Echo.Utils.foldl({}, options || [],
					function(option, acc) {
						acc[option] = true;
					});
			});
			return object;
		},
		"safeHTML" : function(value) {
			return "off" != value;
		},
		"streamStateToggleBy": function(value) {
			if (value == "mouseover" && $.isMobileDevice()) {
				return "button";
			}
			return value;
		},
		"fadeTimeout": ensurePositiveValue,
		"slideTimeout": ensurePositiveValue
	};
	var limits = {
		"body": "maxBodyCharacters",
		"lines": "maxBodyLines",
		"reLink": "maxReLinkLength",
		"reTitle": "maxReTitleLength",
		"bodyLink": "maxBodyLinkLength",
		"tags": "maxTagLength",
		"markers": "maxMarkerLength"
	};
	$.each(limits, function(configKey, streamKey) {
		normalizer[streamKey] = function(value) {
			this.set("limits." + configKey, value);
			return value;
		};
	});
	return normalizer;
};

stream.methods.getRespectiveAccumulator = function(item, sort) {
	var accBySort = {
		"likesDescending": "likesCount",
		"flagsDescending": "flagsCount",
		"repliesDescending": "repliesCount"
	};
	return item.getAccumulator(accBySort[sort]);
};

stream.methods.appendRootItems = function(items, container) {
	var self = this;
	var fragment = document.createDocumentFragment();
	$.each(items || [], function(i, item) {
		fragment.appendChild(item.render().get(0));
		self.events.publish({
			"topic": "Stream.Item.onRender",
			"data": self.prepareBroadcastParams({
				"item": {
					"data": item.data,
					"target": item.dom.content
				}
			})
		});
	});
	container.append(fragment);
	this.rerender("more");
};

stream.methods.prepareBroadcastParams = function(params) {
	params = params || {};
	params.target = this.config.get("target").get(0);
	params.query = this.config.get("query");
	if (params.item && params.item.target) {
		params.item.target = params.item.target.get(0);
	}
	return params;
};

stream.methods.constructSearchQuery = function(extra) {
	var after = extra && extra["pageAfter"] && "pageAfter:" + extra["pageAfter"] || "";
	return [this.config.get("query", ""), after].join(" ");
};

stream.methods.constructChildrenSearchQuery = function(item) {
	// depth for item children request
	var depth = this.config.get("children.maxDepth") - item.depth - 1;
	var additionalItems = parseInt(this.config.get("children.additionalItemsPerPage"));
	var pageAfter = item.getNextPageAfter();
	var filter = this.config.get("children.filter");
	var filterQuery = !filter || filter == "()" ? "" : filter + " ";
	return filterQuery + Echo.Utils.foldl("", {
		"childrenof": item.data.object.id,
		"children": depth,
		"childrenItemsPerPage": depth ? parseInt(this.config.get("children.itemsPerPage")) : 0,
		"itemsPerPage": additionalItems,
		"sortOrder": this.config.get("children.sortOrder"),
		"childrenSortOrder": this.config.get("children.sortOrder"),
		"pageAfter": pageAfter ? '"' + (pageAfter || 0) + '"' : undefined
	}, function(value, acc, predicate) {
		return acc += (typeof value != "undefined"
			? predicate + ":" + value + " " 
			: ""
		); 
	}) + filterQuery;
};

stream.methods.requestItems = function(extra, visualizer) {
	var self = this;
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"liveUpdatesTimeout": 3000,
		"method": "GET",
		"data": {
			"q": this.constructSearchQuery(extra),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			console.log("error", response);
		},
		"onData": function(response) {
			self.handleInitialResponse(response, visualizer);
		}
	}).send();
};

stream.methods.handleInitialResponse = function(data, visualizer) {
	var self = this, items = [], roots = [];
	var isMoreRequest = this.lastRequest && !this.lastRequest.initial;
	data = data || {};
	if (data.result == 'error') {
		this.handleErrorResponse(data, {
			"messageTarget": isMoreRequest ? self.dom.get("more") : self.dom.get("body"),
			"waitingHandler": function() {
				if (isMoreRequest) {
					self.moreRequestItems();
				} else {
					self.refresh();
				}
			}
		});
		return;
	}
	//this.cleanupErrorHandlers(true);
	this.config.get("target").show();
	//this.changeLiveUpdatesTimeout(data);
	this.nextSince = data.nextSince || 0;
	this.nextPageAfter = data.nextPageAfter;
	this.config.extend(this.extractPresentationConfig(data));
	data.children.itemsPerPage = +data.children.itemsPerPage;
	this.config.set(
		"children",
		$.extend(
			data.children,
			this.config.get("children")
		)
	);
	this.config.extend(this.extractTimeframeConfig(data));
	var sortOrder = this.config.get("sortOrder");
	data.entries = data.entries || [];

// XXX: temporarily clear items list
data.entries = [];

	this.events.publish({
		"topic": "Stream.onDataReceive",
		"data": self.prepareBroadcastParams({
			"entries": data.entries,
			"initial": !this.hasInitialData
		})
	});
	$.each(data.entries, function(i, entry) {
		entry = self.normalizeEntry(entry);
		var item = self.initItem(entry);
		// avoiding problem when children can go before parents
		self.applyStructureUpdates("add", item);
		if (self.isRootItem(item)) {
			self.addItemToList(roots, item, sortOrder);
		}
	});

	this.hasInitialData = true;
	this.isViewComplete = roots.length != this.config.get("itemsPerPage");
	visualizer(roots);
	//this.startLiveUpdates();
};

stream.methods.checkTimeframeSatisfy = function() {
	var self = this;
	var timeframe = this.config.get("timeframe");
	var unsatisfying = Echo.Utils.foldl([], this.threads, function(thread, acc) {
		var satisfy = Echo.Utils.foldl(true, timeframe, function(p, a) {
			return a ? p(thread.timestamp) : false;
		});
		if (!satisfy) acc.push(thread);
	});
	$.map(unsatisfying, function(item) {
		self.applySpotUpdates("delete", item);
	});
};

stream.methods.handleLiveUpdatesResponse = function(data) {
	var self = this;
	data = data || {};
	if (data.result == "error") {
		this.startLiveUpdates();
		return;
	}
	this.nextSince = data.nextSince || 0;
	this.refreshItemsDate();
	this.checkTimeframeSatisfy();
	this.applyLiveUpdates(data.entries);
	this.render("state");
	this.executeNextActivity();
	this.startLiveUpdates();
};

stream.methods.applyLiveUpdates = function(entries) {
	var self = this;
	$.each(entries || [], function(i, entry) {
		entry = self.normalizeEntry(entry);
		var item = self.items[entry.unique];
		var action = self.classifyAction(entry);
		if (!item && action != "post") return;
		switch (action) {
			case "post":
				if (item) {
					self.applySpotUpdates("replace", self.updateItem(entry));
				} else {
					item = self.initItem(entry, true);
					var satisfies = self.isRootItem(item)
						? self.withinVisibleFrame(item)
						: self.withinVisibleChildrenFrame(item);
					// do not filter out items from the current user
					// they should be displayed in a special container
					if (!satisfies && !self.isRootItem(item) &&
						self.user.hasIdentity(item.data.actor.id)) {
							item.byCurrentUser = true;
					};
					if (satisfies || item.byCurrentUser) {
						self.events.publish({
							"topic": "Stream.Item.onReceive",
							"data": self.prepareBroadcastParams({
								"item": {"data": item.data}
							})
						});
						self.applySpotUpdates("add", item);
					} else {
						delete self.items[entry.unique];
					}
				}
				break;
			case "delete":
				self.applySpotUpdates("delete", item);
				break;
		}
	});
	this.recalcEffectsTimeouts();
};

stream.methods.recalcEffectsTimeouts = function() {
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
	if (maxTimeouts.fade == 0 && maxTimeouts.slide == 0) return;
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

stream.methods.refreshItemsDate = function() {
	$.map(this.threads, function(item) {
		item.refreshDate();
	});
};

stream.methods.executeNextActivity = function() {
	var acts = this.activities;
	if (acts.animations > 0 || !acts.queue.length ||
		this.config.get("liveUpdates") && acts.state == "paused" && acts.queue[0].action != "replace" && !acts.queue[0].byCurrentUser) return;
	acts.queue.shift().handler();
};

stream.methods.applySpotUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	var handler = function(operation) {
		switch (operation) {
			case "add":
				// if we trying to add already existing item
				// and it was not due to item moving we should replace it
				var _item = self.items[item.data.unique];
				if (_item && _item.dom && options.priority != "high") {
					self.applySpotUpdates("replace", item, {"priority": "highest"});
					return;
				}
				self.applyStructureUpdates(operation, item);
				item.added = true;
				if (self.isRootItem(item)) {
					self.placeRootItem(item);
				} else {
					var parent = self.getParentItem(item);
					if (parent && parent.dom) {
						parent.rerender([
							"container",
							"children",
							"childrenByCurrentActorLive"
						]);
					}
				}
				self.executeNextActivity();
				break;
			case "replace":
				item.unblock();
				if (self.maybeMoveItem(item)) {
					var parent = self.getParentItem(item);
					var sort = self.config.get(parent ? "children.sortOrder" : "sortOrder");
					var items = parent ? parent.children : self.threads;
					var oldIdx = self.getItemListIndex(item, items);
					// We need to calculate the projected index of the item
					// after the "replace" action and compare it with the current one
					// to determine whether the item should be moved to the new place or not:
					//   - create a copy of the items list
					//   - remove the item from the copy
					//   - calculate the new index
					//   - compare the old and new indexes
					var container = $.extend([], items);
					container.splice(oldIdx, 1);
					var newIdx = self.getItemProjectedIndex(item, container, sort);
					if (oldIdx != newIdx) {
						self.applySpotUpdates("delete", item, {
							"keepChildren": true,
							"priority": "high"
						});
						self.applySpotUpdates("add", item, {"priority": "high"});
					}
				}
				if (item && item.dom) {
					item.rerender("container", true);
				}
				self.executeNextActivity();
				break;
			case "delete":
				item.deleted = true;
				// keepChildren flag is required to detect the case when item is being moved
				if (self.isRootItem(item)) {
					self.events.publish({
						"topic": "internal.Item.onDelete",
						"data": {"item": item, "config": options}
					});
					self.applyStructureUpdates(operation, item, options);
				} else {
					var parent = self.getParentItem(item);
					if (parent) {
						parent.render("children", parent.dom.get("children"), parent.dom, options);
						if (self.isChildrenPaginationEnabled()) {
							parent.render("childrenByCurrentActorLive", parent.dom.get("childrenByCurrentActorLive"), parent.dom, options);
						}
						self.applyStructureUpdates(operation, item, options);
						parent.rerender("container");
					}
				}
				self.executeNextActivity();
				break;
		}
	};
	this.queueActivity({
		"action": action,
		"itemUnique": item.data.unique,
		"actorID": item.data.actor.id,
		"priority": options.priority,
		"handler": function() { handler(action); }
	});
};

stream.methods.queueActivity = function(params) {
	var item = this.items[params.itemUnique];
	if (!item) return;
	// we consider activity related to the current user if:
	//  - the corresponding item is blocked (moderation action in progress)
	//  - or the activity was performed by the current user
	var byCurrentUser = item.blocked || params.actorID && this.user.hasIdentity(params.actorID);
	var index = this.getActivityProjectedIndex(byCurrentUser, params);
	var data = {
		"action": params.action,
		"type": params.type || "",
		"affectCounter": params.action == "add",
		"itemUnique": params.itemUnique,
		"priority": params.priority,
		"byCurrentUser": byCurrentUser,
		"handler": function() { params.handler(); }
	};
	if (typeof index != "undefined") {
		this.activities.queue.splice(index, 0, data);
	} else {
		this.activities.queue.push(data);
	}
};

stream.methods.getActivityProjectedIndex = function(byCurrentUser, params) {
	var priorityWeights = {
		"highest": 0,
		"high": 10,
		"medium": 20,
		"low": 30,
		"lowest": 40
	};
	params.priority = params.priority == "highest" && "highest"
		|| byCurrentUser && "high"
		|| params.action == "replace" && "medium"
		|| params.priority
		|| "lowest";
	var index;
	if (params.action == "replace") {
		// in case we have "replace" activity for the item which was not added
		// to the stream yet but queued only we should set its priority the same
		// as that "add" activity so that to queue them in the right order
		$.each(this.activities.queue, function(i, activity) {
			if (activity.action == "add" && activity.itemUnique == params.itemUnique) {
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

stream.methods.addItemSpotUpdate = function(item) {
	var self = this;
	this.activities.animations++;
	if (this.timeouts.slide) {
		//We should specify the element height explicitly to avoid element jumping during the animation effect
		var currentHeight = item.dom.content.show().css("height");
		item.dom.content.css("height", currentHeight).hide().animate({
			"height": "show", 
			"marginTop": "show", 
			"marginBottom": "show", 
			"paddingTop": "show", 
			"paddingBottom": "show"
		},
		this.timeouts.slide,
		function(){
			//After the animation effect we should remove explicitly set height
			if (!item.dom || !item.dom.content) return;
			item.dom.content.css("height", "");
		});
	} else {
		item.dom.content.show();
	}
	var publish = function() {
		if (!item.dom || !item.dom.content) return;
		self.events.publish({
			"topic": "Stream.Item.onRender",
			"data": self.prepareBroadcastParams({
				"item": {
					"data": item.data,
					"target": item.dom.content
				}
			})
		});
	};
	if (this.timeouts.fade) {
		var container = item.dom.get("container");
		var originalBGColor = $.getVisibleColor(container);
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
				publish();
				self.activities.animations--;
				self.executeNextActivity();
			}
		);
	} else {
		publish();
		this.activities.animations--;
		this.executeNextActivity();
	}
};

stream.methods.deleteItemSpotUpdate = function(item, config) {
	var self = this;
	this.activities.animations++;
	config = config || {};
	var callback = $.isFunction(config) ? config : config.callback || function() {
		if (!item.dom || !item.dom.content) return;
		// if the item is being moved, we should keep all jQuery handlers
		// for the nested elements (children), thus we use "detach" instead of "remove"
		config.keepChildren ? item.dom.content.detach() : item.dom.remove("content");
		delete item.dom;
		item.vars = {};
		var itemsCount = Echo.Utils.foldl(0, self.items, function(_item, acc) {
			return acc + 1;
		});
		if (!itemsCount) {
			/*self.showMessage({
				"type": "empty",
				"message": self.labels.get("emptyStream")
			}, self.dom.get('body'));*/
		}
		self.activities.animations--;
		self.executeNextActivity();
	};
	if (this.timeouts.slide) {
		item.dom.content.slideUp(this.timeouts.slide, callback);
	} else {
		callback();
	}
};

stream.methods.classifyAction = function(entry) {
	return (entry.verbs[0] == "http://activitystrea.ms/schema/1.0/delete") ? "delete" : "post";
};

stream.methods.isRootItem = function(item) {
	return !this.config.get("children.maxDepth") || item.id == item.conversation;
};

stream.methods.hasParentItem = function(item) {
	return !!this.getParentItem(item);
};

stream.methods.maybeMoveItem = function(item) {
	return item.forceInject;
};

stream.methods.withinVisibleFrame = function(item, items, isViewComplete, sortOrder) {
	items = items || this.threads;
	isViewComplete = typeof isViewComplete == "undefined"
		? this.isViewComplete
		: isViewComplete;
	sortOrder = sortOrder || this.config.get("sortOrder");
	var last = items.length
		? items[items.length - 1]
		: undefined;
	if (isViewComplete || last == undefined) return true;
	return this.compareItems(last, item, sortOrder);
};

stream.methods.withinVisibleChildrenFrame = function(item) {
	var parent = this.getParentItem(item);
	if (!this.isChildrenPaginationEnabled() || !parent) return this.hasParentItem(item);
	return this.withinVisibleFrame(item, parent.children,
			!parent.hasMoreChildren(), this.config.get("children.sortOrder"));
};

stream.methods.getParentItem = function(item) {
	return this.isRootItem(item) ? undefined : this.items[item.data.parentUnique];
};

stream.methods.compareItems = function(a, b, sort) {
	var self = this;
	switch (sort) {
		case "chronological":
			return a.timestamp > b.timestamp;
		case "reverseChronological":
			return a.timestamp <= b.timestamp;
		case "likesDescending":
		case "repliesDescending":
		case "flagsDescending":
			var getCount = function(entry) {
				return self.getRespectiveAccumulator(entry, sort);
			};
			return (getCount(a) < getCount(b) ||
					(getCount(a) == getCount(b) &&
						this.compareItems(a, b, "reverseChronological")));
	};
};

stream.methods.placeRootItem = function(item) {
	var content = item.render();
	if (this.threads.length > 1) {
		var id = this.getItemListIndex(item, this.threads);
		var next = this.threads[id + 1], prev = this.threads[id - 1];
		if (next) {
			next.dom.content.before(content);
		} else {
			prev.dom.content.after(content);
		}
	} else {
		this.dom.get("body").empty().append(content);
	}
	this.events.publish({
		"topic": "internal.Item.onAdd",
		"data": {"item": item}
	});
};

stream.methods.placeChildrenItems = function(parent, children, entries) {
	var self = this;
	var itemsWrapper = this.createChildrenItemsDomWrapper(children, parent);
	// we should calculate index of the sibling item for the responsed items
	var targetItemIdx = -1;
	$.each(parent.children, function(i,_item) {
		if (self.isItemInList(_item.data, entries)) {
			targetItemIdx = i - 1;
			return false;
		}
	});
	var targetItemDom = targetItemIdx >= 0
		? parent.children[targetItemIdx].dom.content
		: parent.dom.get("children");
	var action = targetItemIdx >= 0
		? "insertAfter"
		: this.config.get("children.sortOrder") != "chronological" 
			? "prependTo"
			: "appendTo";
	itemsWrapper[action]($(targetItemDom));
	parent.rerender("childrenByCurrentActorLive");
	// we should specify the element height explicitly
	// to avoid element jumping during the animation effect
	itemsWrapper
		.css("height", itemsWrapper.show().css("height"))
		.hide()
		.animate(
			{
				"height": "show",
				"marginTop": "show",
				"marginBottom": "show",
				"paddingTop": "show", 
				"paddingBottom": "show"
			},
			{
				"duration": this.config.get("children.itemsSlideTimeout"),
				"complete": function() {
					itemsWrapper.css("height", "");
					parent.rerender(["expandChildren", "expandChildrenLabel"]);
					itemsWrapper.children().unwrap();
				}
			}
		);
};

stream.methods.getItemListIndex = function(item, items) {
	var idx = -1;
	$.each(items || [], function(i, entry) {
		if (entry == item || (entry.unique && item.unique && entry.unique == item.unique)) {
			idx = i;
			return false;
		}
	});
	return idx;
};

stream.methods.isItemInList = function(item, items) {
	return this.getItemListIndex(item, items) >= 0;
};

stream.methods.isChildrenPaginationEnabled = function() {
	return !!this.config.get("children.itemsPerPage");
};

stream.methods.initItem = function(entry, isLive) {
	var self = this;
	var item = new Echo.Item({
		"children": [],
		"config": new Echo.Config(this.config.getAsHash()),
		"conversation": entry.target.conversationID, // short cut for "conversationID" field
		"data": entry,
		"depth": 0,
		"id": entry.object.id, // short cut for "id" item field
		"live": isLive,
		"threading": false,
		"timestamp": $.timestampFromW3CDTF(entry.object.published),
		"user": this.user
	});
	// caching item template to avoid unnecessary work
	var template = item.template;
	item.template = function() {
		if (!self.vars.cache.itemTemplate) {
			self.vars.cache.itemTemplate = $.isFunction(template)
				? template.apply(this, arguments)
				: template;
		}
		return self.vars.cache.itemTemplate;
	};
	this.items[item.data.unique] = item;
	return item;
};

stream.methods.updateItem = function(entry) {
	var item = this.items[entry.unique];
	// forcing item re-injection if the published date or the respective accumulator was changed
	var sortOrder = this.config.get(this.isRootItem(item) ? "sortOrder" : "children.sortOrder");
	var accRelatedSortOrder = sortOrder.match(/replies|likes|flags/);
	var acc = accRelatedSortOrder && this.getRespectiveAccumulator(item, sortOrder);
	if (item.data.object.published != entry.object.published) {
		item.timestamp = $.timestampFromW3CDTF(entry.object.published);
		item.forceInject = true;
	}
	$.extend(item.data, entry);
	if (accRelatedSortOrder) {
		if (this.getRespectiveAccumulator(item, sortOrder) != acc) {
			item.forceInject = true;
		}
	}
	return item;
};

stream.methods.getItemProjectedIndex = function(item, items, sort) {
	var self = this;
	var index;
	if (item.live || item.forceInject) {
		$.each(items || [], function(i, entry) {
			if (self.compareItems(entry, item, sort)) {
				index = i;
				return false;
			}
		});
	}
	return typeof index != "undefined" ? index : items.length;
};

stream.methods.addItemToList = function(items, item, sort) {
	items.splice(this.getItemProjectedIndex(item, items, sort), 0, item);
	delete item.forceInject;
	this.items[item.data.unique] = item;
};


stream.methods.applyStructureUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	switch (action) {
		case "add":
			if (!this.isRootItem(item)) {
				var parent = this.getParentItem(item);
				// avoiding problem with missing parent
				if (!parent) {
					delete this.items[item.data.unique];
					return;
				}
				item.depth = parent.depth + 1;
				// backwards compatibility in case children pagination is off
				if (!this.isChildrenPaginationEnabled() && item.depth > 1) {
					item.depth = 1;
					// replace parent of the item
					item.data.parentUnique = parent.data.parentUnique;
					item.data.target.id = parent.data.target.id;
					item.forceInject = true;
					this.applyStructureUpdates("add", item);
					return;
				}
				parent.threading = true;
				item.forceInject = true;
				this.addItemToList(
					parent.children,
					item,
					this.isChildrenPaginationEnabled()
						? this.config.get("children.displaySortOrder")
						: this.config.get("children.sortOrder")
				);
			} else {
				this.addItemToList(this.threads, item, this.config.get("sortOrder"));
			}
			break;
		case "delete":
			var container = null;
			if (this.isRootItem(item)) {
				container = this.threads;
			} else {
				container = this.items[item.data.parentUnique].children;
				if (container.length == 1) {
					var parent = this.getParentItem(item);
					if (parent) parent.threading = false;
				}
			}
			container.splice(this.getItemListIndex(item, container), 1);
			if (!options.keepChildren) {
				item.traverse(item.children, function(child) {
					delete self.items[child.data.unique];
				});
				delete item.children;
			}
			delete this.items[item.data.unique];
			break;
	};
};

stream.methods.normalizeEntry = function(entry) {
	if (entry.normalized) return entry;
	var self = this;
	entry.normalized = true;
	// detecting actual target
	$.each(entry.targets || [], function(i, target) {
		if ((target.id == target.conversationID) ||
			(target.id == entry.object.id) ||
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
	return entry;
};

stream.constructor = function() {
	var self = this;
	this.initVars();
	self.config.get("target").empty().append(self.render());
	self.recalcEffectsTimeouts();
	//self.initLiveUpdates(function() {
	//	return {
	//		"endpoint": "search",
	//		"query": {
	//			"q": self.constructSearchQuery(),
	//			"since": self.nextSince || 0
	//		}
	//	};
	//}, function(data) { self.handleLiveUpdatesResponse(data); });
	if (self.config.get("data")) {
		self.handleInitialResponse(self.config.get("data"), function(data) {
			self.lastRequest = {
				"initial": true,
				"data": data
			};
			self.render("body");
		});
	} else {
		self.initialItemsRequest();
	}
	self.events.publish({
		"topic": "Stream.onRender",
		"data": self.prepareBroadcastParams()
	});
};

stream.css =
	'.{class:message-wrapper} { padding: 15px 0px; text-align: center; -moz-border-radius: 0.5em; -webkit-border-radius: 0.5em; border: 1px solid #E4E4E4; }' +
	'.{class:message-empty}, .{class:message-loading}, .{class:message-error} { display: inline-block; height: 16px; padding-left: 21px; background: no-repeat left center; }' +
	'.{class:message-empty} { background-image: url(//cdn.echoenabled.com/images/information.png); }' +
	'.{class:message-loading} { background-image: url(//cdn.echoenabled.com/images/loading.gif); }' +
	'.{class:message-error} { background-image: url(//cdn.echoenabled.com/images/warning.gif); }' +
	'.{class:header} { margin: 10px 0px 10px 20px; }' +
	'.{class:state} { float: right; }' +
	'.{class:state-picture} { display: inline-block; height: 9px; width: 8px; }' +
	'.{class:state-picture-paused} { background: url("//cdn.echoenabled.com/images/control_pause.png") no-repeat center center; }' +
	'.{class:state-picture-live} { background: url("//cdn.echoenabled.com/images/control_play.png") no-repeat center center; }' +
	'.{class:state-message} { margin-left: 5px; text-decoration: none; }' +
	'.echo-clickable a.{class:state-message}:hover { text-decoration: underline; }' +
	'.{class:more-hover} { background-color: #E4E4E4; }' +
	'.{class:more} { text-align: center; border: solid 1px #E4E4E4; margin-top: 10px; padding: 10px; -moz-border-radius: 0.5em; -webkit-border-radius: 0.5em; cursor: pointer; font-weight: bold; }' +
	'.{class:more} .echo-application-message { padding: 0; border: none; border-radius: 0; }';

Echo.Control.create(stream);

})(jQuery);
