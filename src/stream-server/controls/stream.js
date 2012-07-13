(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream")) return;

var stream = Echo.Control.skeleton("Echo.StreamServer.Controls.Stream");

stream.config = {
	"children": {
		"additionalItemsPerPage": 5,
		"displaySortOrder": "chronological",
		"sortOrder": "reverseChronological",
		"moreButtonSlideTimeout": 600,
		"itemsSlideTimeout": 600,
		"maxDepth": 1
	},
	"fadeTimeout": 2800,
	"flashColor": "#ffff99",
	"item": {},
	"itemsPerPage": 15,
	"openLinksInNewWindow": false,
	"providerIcon": "//cdn.echoenabled.com/images/favicons/comments.png",
	"slideTimeout": 700,
	"sortOrder": "reverseChronological",
	"streamStateLabel": {
		"icon": true,
		"text": true
	},
	"streamStateToggleBy": "mouseover", // mouseover | button | none
	"submissionProxyURL": window.location.protocol + "//apps.echoenabled.com/v2/esp/activity"
};

var _ensurePositiveValue = function(v) { return v < 0 ? 0 : v; };
stream.config.normalizer = {
	"safeHTML": function(value) {
		return "off" !== value;
	},
	"streamStateToggleBy": function(value) {
		if (value === "mouseover" && Echo.Utils.isMobileDevice()) {
			return "button";
		}
		return value;
	},
	"fadeTimeout": _ensurePositiveValue,
	"slideTimeout": _ensurePositiveValue
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
			"itemUnique": data.item.unique(),
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
			"itemUnique": data.item.unique(),
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
		this.childrenRequestItems(args.unique());
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
		this.showMessage({
			"type": "loading",
			"message": this.labels.get(
				0 && this.isErrorWithTimer(this.error)
					? "retrying"
					: 0 && this.isWaitingForData(this.error)
						? "error_" + this.error.errorCode
						: "loading"
			)
		}, element);
		return element;
	}

	if (this.lastRequest.data.length) {
		if (this.lastRequest.initial) {
			element.empty();
		}
		this.appendRootItems(this.lastRequest.data, element);
	} else {
		this.showMessage({
			"type": "empty",
			"message": this.labels.get("emptyStream")
		}, element);
	}
	if (this.lastRequest.initial && this.config.get("streamStateToggleBy") === "mouseover" && this.config.get("liveUpdates")) {
		element.hover(function() {
			self.setStreamState("paused");
		}, function() {
			self.setStreamState("live");
		});
	}
	this.events.publish({
		"topic": "Stream.onReady",
		"data": this.prepareBroadcastParams({"initial": this.lastRequest.initial})
	});
	return element;
};

stream.renderers.state = function(element) {
	var self = this;
	var label = this.config.get("streamStateLabel");
	if ((!label.icon && !label.text) || !this.config.get("liveUpdates")) {
		return element;
	}

	var activitiesCount = 0;
	if (this.activities.state === "paused") {
		activitiesCount = Echo.Utils.foldl(0, this.activities.queue, function(entry, acc) {
			if (entry.affectCounter) {
				return ++acc;
			}
		});
	}
	var currentState = this.activities.state + activitiesCount;
	if (currentState === this.activities.lastState) {
		return element;
	}

	element = (element || this.dom.get("state")).empty();
	if (!this.activities.lastState && this.config.get("streamStateToggleBy") === "button") {
		element.addClass("echo-linkColor echo-clickable").click(function() {
			self.setStreamState(self.activities.state === "paused" ? "live" : "paused");
		});
	}
	var templates = {
		"picture": '<span class="{class:state-picture} {class:state-picture}-' + this.activities.state + '"></span>',
		"message": this.config.get("streamStateToggleBy") === "button"
			? '<a href="javascript:void(0)" class="{class:state-message}">{label:' + this.activities.state + '}</a>'
			: '<span class="{class:state-message}">{label:' + this.activities.state + '}</span>',
		"count": ' <span class="{class:state-count}">({data:count} {label:new})</span>'
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
	return element;
};

stream.renderers.more = function(element) {
	var self = this;
	if (this.isViewComplete || !this.threads.length) {
		return element.empty().hide();
	}
	return element.empty()
		.append(this.labels.get("more"))
		.hover(function() {
			element.addClass(self.cssPrefix + "-more-hover");
		}, function() {
			element.removeClass(self.cssPrefix + "-more-hover");
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
			target.conversationID = parent.target.conversationID;
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
	var wrapper = $('<div class="' + this.cssPrefix + '-children-wrapper"></div>');
	var getIdx = function(item) { return self.getItemListIndex(item, parent.get("children")); };
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
			if (entry.parentUnique == item.unique()) children.push(_item);
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
		self.render({"element": "body"});
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
			self.render({"element": "body"});
		} else {
			element.html(self.labels.get("emptyStream")).delay(1000).fadeOut(1000);
		}
	});
};

stream.methods.setStreamState = function(state) {
	this.activities.state = state;
	if (state === "live") {
		this.executeNextActivity();
	}
	this.render({"element": "state"});
};

stream.methods.refresh = function() {
	this.stopLiveUpdates();
	this.initVars();
	delete this.lastRequest;
	this.clearCache();
	this.render();
	this.initialItemsRequest();
	this.events.publish({
		"topic": "Stream.onRerender",
		"data": this.prepareBroadcastParams()
	});
};

stream.methods.extractPresentationConfig = function(data) {
	return Echo.Utils.foldl({}, ["sortOrder", "itemsPerPage", "safeHTML"], function(key, acc) {
		if (typeof data[key] !== "undefined") {
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
	this.render({"element": "more"});
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
	var depth = this.config.get("children.maxDepth") - item.get("depth") - 1;
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
		//"recurring": true,
		"method": "GET",
		"data": {
			"q": this.constructSearchQuery(extra),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			console.log(["error", response]);
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
	if (data.result === "error") {
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
	var presentation = this.extractPresentationConfig(data);
	presentation.itemsPerPage = +presentation.itemsPerPage;
	this.config.extend(presentation);
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
		if (item.isRoot()) {
			self.addItemToList(roots, item, sortOrder);
		}
	});

	this.hasInitialData = true;
	this.isViewComplete = roots.length !== this.config.get("itemsPerPage");
	visualizer(roots);
	//this.startLiveUpdates();
};

stream.methods.checkTimeframeSatisfy = function() {
	var self = this;
	var timeframe = this.config.get("timeframe");
	var unsatisfying = Echo.Utils.foldl([], this.threads, function(thread, acc) {
		var satisfy = Echo.Utils.foldl(true, timeframe, function(p, a) {
			return a ? p(thread.get("timestamp")) : false;
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
	if (data.result === "error") {
		this.startLiveUpdates();
		return;
	}
	this.nextSince = data.nextSince || 0;
	this.refreshItemsDate();
	this.checkTimeframeSatisfy();
	this.applyLiveUpdates(data.entries);
	this.render({"element": "state"});
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
					var satisfies = item.isRoot()
						? self.withinVisibleFrame(item)
						: self.withinVisibleChildrenFrame(item);
					// do not filter out items from the current user
					// they should be displayed in a special container
					if (!satisfies && !item.isRoot() &&
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

stream.methods.applySpotUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	var handler = function(operation) {
		switch (operation) {
			case "add":
				// if we trying to add already existing item
				// and it was not due to item moving we should replace it
				var _item = self.items[item.unique()];
				if (_item && _item.dom && options.priority != "high") {
					self.applySpotUpdates("replace", item, {"priority": "highest"});
					return;
				}
				self.applyStructureUpdates(operation, item);
				item.added = true;
				if (item.isRoot()) {
					self.placeRootItem(item);
				} else {
					var parent = self.getParentItem(item);
					if (parent && parent.dom) {
						parent.render({"element": "container"});
						parent.render({"element": "children"});
						parent.render({"element": "childrenByCurrentActorLive"});
					}
				}
				self.executeNextActivity();
				break;
			case "replace":
				item.unblock();
				if (self.maybeMoveItem(item)) {
					var parent = self.getParentItem(item);
					var sort = self.config.get(parent ? "children.sortOrder" : "sortOrder");
					var items = parent ? parent.get("children") : self.threads;
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
					item.render({"element": "container", "recursive": true});
				}
				self.executeNextActivity();
				break;
			case "delete":
				item.deleted = true;
				// keepChildren flag is required to detect the case when item is being moved
				if (item.isRoot()) {
					self.events.publish({
						"topic": "internal.Item.onDelete",
						"data": {"item": item, "config": options}
					});
					self.applyStructureUpdates(operation, item, options);
				} else {
					var parent = self.getParentItem(item);
					if (parent) {
						parent.render({
							"element": "children",
							"target": parent.dom.get("children"),
							"dom": parent.dom,
							"extra": options
						});
						parent.render({
							"element": "childrenByCurrentActorLive",
							"target": parent.dom.get("childrenByCurrentActorLive"),
							"dom": parent.dom,
							"extra": options
						});
						self.applyStructureUpdates(operation, item, options);
						parent.render({"element": "container"});
					}
				}
				self.executeNextActivity();
				break;
		}
	};
	this.queueActivity({
		"action": action,
		"itemUnique": item.unique(),
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
			self.showMessage({
				"type": "empty",
				"message": self.labels.get("emptyStream")
			}, self.dom.get('body'));
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
	if (!parent) return this.hasParentItem(item);
	return this.withinVisibleFrame(item, parent.get("children"),
			!parent.hasMoreChildren(), this.config.get("children.sortOrder"));
};

stream.methods.getParentItem = function(item) {
	return item.isRoot() ? undefined : this.items[item.parentUnique()];
};

stream.methods.compareItems = function(a, b, sort) {
	var self = this;
	switch (sort) {
		case "chronological":
			return a.get("timestamp") > b.get("timestamp");
		case "reverseChronological":
			return a.get("timestamp") <= b.get("timestamp");
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
	$.each(parent.get("children"), function(i,_item) {
		if (self.isItemInList(_item.data, entries)) {
			targetItemIdx = i - 1;
			return false;
		}
	});
	var targetItemDom = targetItemIdx >= 0
		? parent.get("children")[targetItemIdx].dom.content
		: parent.dom.get("children");
	var action = targetItemIdx >= 0
		? "insertAfter"
		: this.config.get("children.sortOrder") != "chronological" 
			? "prependTo"
			: "appendTo";
	itemsWrapper[action]($(targetItemDom));
	parent.render({"element": "childrenByCurrentActorLive"});
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
					parent.render({"element": "expandChildren"});
					parent.render({"element": "expandChildrenLabel"});
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

stream.methods.initItem = function(entry, isLive) {
	var self = this;
	var parentConfig = this.config.getAsHash();
	var config = $.extend({
		"target": $("<div>"),
		"appkey": this.config.get("appkey"),
		"parent": parentConfig,
		"plugins": this.config.get("plugins"),
		"data": entry,
		"live": isLive
	}, parentConfig.item);
	delete parentConfig.item;
	var item = new Echo.StreamServer.Controls.Stream.Item(config);
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
	this.items[entry.unique] = item;
	return item;
};

stream.methods.updateItem = function(entry) {
	var item = this.items[entry.unique];
	// forcing item re-injection if the published date or the respective accumulator was changed
	var sortOrder = this.config.get(item.isRoot() ? "sortOrder" : "children.sortOrder");
	var accRelatedSortOrder = sortOrder.match(/replies|likes|flags/);
	var acc = accRelatedSortOrder && this.getRespectiveAccumulator(item, sortOrder);
	if (item.data.object.published !== entry.object.published) {
		item.set("timestamp", Echo.Utils.timestampFromW3CDTF(entry.object.published));
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
	return typeof index !== "undefined" ? index : items.length;
};

stream.methods.addItemToList = function(items, item, sort) {
	items.splice(this.getItemProjectedIndex(item, items, sort), 0, item);
	delete item.forceInject;
	this.items[item.unique()] = item;
};

stream.methods.applyStructureUpdates = function(action, item, options) {
	var self = this;
	options = options || {};
	switch (action) {
		case "add":
			if (!item.isRoot()) {
				var parent = this.getParentItem(item);
				// avoiding problem with missing parent
				if (!parent) {
					delete this.items[item.unique()];
					return;
				}
				item.set("depth", parent.get("depth") + 1);
				parent.set("threading", true);
				item.forceInject = true;
				this.addItemToList(
					parent.get("children"),
					item,
					this.config.get("children.displaySortOrder")
				);
			} else {
				this.addItemToList(this.threads, item, this.config.get("sortOrder"));
			}
			break;
		case "delete":
			var container = null;
			if (item.isRoot()) {
				container = this.threads;
			} else {
				container = this.items[item.parentUnique()].get("children");
				if (container.length === 1) {
					var parent = this.getParentItem(item);
					if (parent) parent.set("threading", false);
				}
			}
			container.splice(this.getItemListIndex(item, container), 1);
			if (!options.keepChildren) {
				item.traverse(item.get("children"), function(child) {
					delete self.items[child.unique()];
				});
				item.set("children", []);
			}
			delete this.items[item.unique()];
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
			self.render({"element": "body"});
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
	'.{class:more} .echo-application-message { padding: 0; border: none; border-radius: 0; }' +
	($.browser.msie
		? '.{class:state-picture} { vertical-align: middle; }' +
		'.{class:container} { zoom: 1; }'
		: ''
	);

Echo.Control.create(stream);

var item = Echo.Control.skeleton("Echo.StreamServer.Controls.Stream.Item");

item.config = {
	"aggressiveSanitization": false,
	"buttonsOrder": undefined,
	"contentTransformations": {
		"text": ["smileys", "hashtags", "urls", "newlines"],
		"html": ["smileys", "hashtags", "urls", "newlines"],
		"xhtml": ["smileys", "hashtags", "urls"]
	},
	"limits": {
		"maxBodyCharacters": undefined,
		"maxBodyLines": undefined,
		"maxBodyLinkLength": 50,
		"maxMarkerLength": 16,
		"maxReLinkLength": 30,
		"maxReTitleLength": 143,
		"maxTagLength": 16
	},
	"optimizedContext": true,
	"reTag": true,
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

item.labels = {
	"defaultModeSwitchTitle": "Switch to metadata view",
	"guest": "Guest",
	"today": "Today",
	"yesterday": "Yesterday",
	"lastWeek": "Last Week",
	"lastMonth": "Last Month",
	"secondAgo": "Second Ago",
	"secondsAgo": "Seconds Ago",
	"minuteAgo": "Minute Ago",
	"minutesAgo": "Minutes Ago",
	"hourAgo": "Hour Ago",
	"hoursAgo": "Hours Ago",
	"dayAgo": "Day Ago",
	"daysAgo": "Days Ago",
	"weekAgo": "Week Ago",
	"weeksAgo": "Weeks Ago",
	"metadataModeSwitchTitle": "Return to default view",
	"monthAgo": "Month Ago",
	"monthsAgo": "Months Ago",
	"sharedThisOn": "I shared this on {service}...",
	"userID": "User ID:",
	"userIP": "User IP:",
	"textToggleTruncatedMore": "more",
	"textToggleTruncatedLess": "less",
	"fromLabel": "from",
	"viaLabel": "via",
	"childrenMoreItems": "View more items"
};

item.renderers.authorName = function(element) {
	return element.append(this.data.actor.title || this.labels.get("guest"));
};

item.renderers.markers = function(element, dom) {
	return this.render({
		"element": "_extraField",
		"target": element,
		"dom": dom,
		"extra": {"type": "markers"}
	});
};

item.renderers.tags = function(element, dom) {
	return this.render({
		"element": "_extraField",
		"target": element,
		"dom": dom,
		"extra": {"type": "tags"}
	});
};

item.renderers._extraField = function(element, dom, extra) {
	var self = this;
	var type = (extra || {}).type;
	if (!this.data.object[type] || !this.user.is("admin")) {
		dom.remove(element);
		return element;
	}
	var name = type === "markers"
		? "maxMarkerLength"
		: type === "tags"
			? "maxTagsLength"
			: "";
	var limit = this.config.get("limits." + name);
	var items = $.foldl([], this.data.object[type], function(item, acc) {
		var template = item.length > limit
			? '<span title="{data:item}">{data:truncatedItem}</span>'
			: '<span>{data:item}</span>';
		var truncatedItem = $.htmlTextTruncate(item, limit, "...");
		acc.push(self.substitute(template, {"item": item, "truncatedItem": truncatedItem}));
	});
	return element.prepend(items.sort().join(", "));
};

item.renderers.container = function(element, dom) {
	var self = this;
	element.removeClass(
		$.map(["child", "root", "child-thread", "root-thread"],	function(suffix) {
			return self.cssPrefix + "-container-" + suffix;
		}).join(" ")
	);
	var threadSuffix = this.threading ? "-thread" : "";
	if (this.depth) {
		element.addClass(this.cssPrefix + "-container-child" + threadSuffix);
		element.addClass("echo-trinaryBackgroundColor");
	} else {
		element.addClass(this.cssPrefix + "-container-root" + threadSuffix);
	}
	element.addClass(this.cssPrefix + "-depth-" + this.depth);
	var switchClasses = function(action) {
		$.map(self.buttonsOrder, function(name) {
			if (!self.buttons[name].element) return;
			self.buttons[name].clickableElements[action + "Class"]("echo-linkColor");
		});
	};
	if (!Echo.Utils.isMobileDevice()) {
		element.unbind(["mouseleave", "mouseenter"]).hover(function() {
			if (self.user.is("admin")) {
				dom.get("modeSwitch").show();
			}
			switchClasses("add");
		}, function() {
			if (self.user.is("admin")) {
				dom.get("modeSwitch").hide();
			}
			switchClasses("remove");
		});
	}
	return element;
};

item.renderers.metadataUserIP = function(element) {
	if (!this.data.ip) {
		element.hide();
	}
	return element;
};

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
		self.dom.get("data").toggle();
		self.dom.get("metadata").toggle();
	});
	if (Echo.Utils.isMobileDevice()) {
		element.show();
	}
	return element;
};

item.renderers.wrapper = function(element) {
	return element.addClass(this.cssPrefix + "-wrapper" + (this.depth ? "-child" : "-root"));
};

item.renderers.avatar = function(element) {
	var self = this;
	var size = (!this.depth ? 48 : 24);
	var avatar = Echo.Utils.loadImage(this.data.actor.avatar, this.user.get("defaultAvatar"));
	avatar.css({"width": size, "height": size});
	return element.append(avatar);
};

item.renderers._childrenContainer = function(element, dom, config) {
	var self = this;
	// we cannot use element.empty() because it will remove children's event handlers
	$.each(element.children(), function(i, child) {
		$(child).detach();
	});
	$.map(this.children, function(child) {
		if (config && config.filter && !config.filter(child)) return;
		var initialRendering = !child.dom;
		element.append(initialRendering ? child.render() : child.dom.content);
		if (child.deleted) {
			self.events.publish({
				"topic": "internal.Item.onDelete",
				"data": {
					"item": child,
					"config": config
				}
			});
		} else if (child.added) {
			self.events.publish({
				"topic": "internal.Item.onAdd",
				"data": {"item": child}
			});
		// don't publish events while rerendering
		} else if (initialRendering) {
			self.events.publish({
				"topic": "internal.Item.onRender",
				"data": {"item": child}
			});
		}
	});
	return element;
};

item.renderers.children = function(element, dom, config) {
	return this.render({
		"element": "_childrenContainer",
		"target": element,
		"extra": {
			"filter": function(item) { return !item.byCurrentUser; },
			"keepChildren": config && config.keepChildren
		}
	});
};

item.renderers.childrenByCurrentActorLive = function(element, dom, config) {
	return this.render({
		"element": "_childrenContainer",
		"target": element,
		"extra": {
			"filter": function(item) { return item.byCurrentUser; },
			"keepChildren": config && config.keepChildren
		}
	});
};

item.renderers._button = function(element, dom, extra) {
	var template = extra.template ||
		'<a class="{class:button} {class:button}-{data:name}">{data:label}</a>';
	var data = {
		"label": extra.label || "",
		"name": extra.name
	};
	var button = $(this.substitute(template, data));
	var clickables = $(".echo-clickable", button);
	if (!clickables.length) {
		clickables = button;
		button.addClass("echo-clickable");
	}
	clickables[extra.onetime ? "one" : "bind"]({
		"click": function(event) {
			event.stopPropagation();
			if (extra.callback) extra.callback();
		}
	});
	var data = this.buttons[extra.plugin + "." + extra.name];
	data.element = button;
	data.clickableElements = clickables;
	if (Echo.Utils.isMobileDevice()) {
		clickables.addClass("echo-linkColor");
	}
	return element.append(button);
};

item.renderers._buttonsDelimiter = function(element) {
	return element.append('<span class="' + this.cssPrefix + '-button-delim"> \u00b7 </span>');
};

item.renderers.buttons = function(element) {
	var self = this;
	this.assembleButtons();
	this.sortButtons();
	element.empty();
	$.map(this.buttonsOrder, function(name) {
		var data = self.buttons[name];
		if (!data || !data.name || !data.visible()) {
			return;
		}
		self.render({
			"element": "_buttonsDelimiter",
			"target": element
		});
		self.render({
			"element": "_button",
			"target": element,
			"extra": data
		});
	});
	return element;
};

item.renderers.re = function(element) {
	if (!this.config.get("reTag")) {
		return element;
	}
	var self = this;
	var context = this.data.object.context;
	var re = "";
	//XXX use normalized permalink and location instead
	var permalink = this.data.object.permalink;
	var limits = this.config.get("limits");
	var openLinksInNewWindow = this.config.get("openLinksInNewWindow");

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
	return element.append(re);
};

item.renderers.sourceIcon = function(element, dom) {
	if (!this.config.get("viaLabel.icon") ||
			this.data.source.name == "jskit" ||
			this.data.source.name == "echo") {
		dom.remove(element);
	}
	element.hide().attr("src", Echo.Utils.htmlize(
		this.data.source.icon || this.config.get("providerIcon")
	))
	.show()
	.one("error", function() {
		dom.remove(element);
	})
	.wrap(Echo.Utils.hyperlink({
		"href": this.data.source.uri || this.data.object.permalink
	}, {
		"openInNewWindow": this.config.get("openLinksInNewWindow")
	}));
};

item.renderers.via = function(element) {
	var self = this;
	var get = function(field) {
		return (self.data[field].name || "").toLowerCase();
	};
	if (get("source") === get("provider")) {
		return element;
	}
	return this.render({
		"element": "_viaText",
		"target": element,
		"extra": {
			"label": "via",
			"field": "provider"
		}
	});
};

item.renderers.from = function(element) {
	return this.render({
		"element": "_viaText",
		"target": element,
		"extra": {
			"label": "from",
			"field": "source"
		}
	});
};

item.renderers._viaText = function(element, dom, extra) {
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
		"href": data.uri || this.data.object.permalink,
		"caption": data.name
	}, {
		"openInNewWindow": this.config.get("openLinksInNewWindow")
	});
	return element.html("&nbsp;" + this.labels.get(extra.label + "Label") + "&nbsp;").append(a);
};

item.renderers.textToggleTruncated = function(element) {
	var self = this;
	element.unbind("click").click(function() {
		self.textExpanded = !self.textExpanded;
		self.render({"element": "body"});
		self.render({"element": "textToggleTruncated"});
	});
	return element.append(
		this.labels.get("textToggleTruncated" + (this.textExpanded ? "Less" : "More"))
	);
};

item.renderers.body = function(element, dom) {
	var self = this;
	var output = function(text, truncated) {
		dom.get("text").empty().append(text);
		dom.get("textEllipses")[!truncated || self.textExpanded ? "hide" : "show"]();
		dom.get("textToggleTruncated")[truncated || self.textExpanded ? "show" : "hide"]();
	};
	var text = this.data.object.content;
	var source = this.data.source.name;
	var openLinksInNewWindow = this.config.get("openLinksInNewWindow");
	var contentTransformations = this.config.get("contentTransformations." + this.data.object.content_type, {});
	if (source && source === "Twitter" && this.config.get("aggressiveSanitization")) {
		output(this.labels.get("sharedThisOn", {"service": source}));
		return element;
	}

	var limits = this.config.get("limits");
	var wrap = function(tag) {
		var template = tag.length > limits.maxTagLength
			? '<span class="{class:tag}" title="{data:tag}">{data:truncatedTag}</span>'
			: '<span class="{class:tag}">{data:tag}</span>';
		var truncatedTag = tag.substring(0, limits.maxTagLength) + "...";
		return self.substitute(template, {"tag": tag, "truncatedTag": truncatedTag});
	};

	if (contentTransformations.hashtags) {
		text = text.replace(/(#|\uff03)(<a[^>]*>[^<]*<\/a>)/ig, function($0, $1, $2){
			return wrap($2);
		});
	}

	var insertHashTags = function(t) {
		if (!contentTransformations.hashtags) return t;
		return t.replace(/(^|[^\w&\/])(?:#|\uff03)([^\s\.,;:'"#@\$%<>!\?\(\)\[\]]+)/ig, function($0, $1, $2) {
			return $1 + wrap($2);
		});
	};
	var tags2meta = function(text) {
		var tags = [];
		text = text.replace(/((<a\s+[^>]*>)(.*?)(<\/a>))|<.*?>/ig, function($0, $1, $2, $3, $4) {
			//we are cutting and pushing <a> tags to acc to avoid potential html issues after autolinking
			if ($1) {
				var content = tags2meta($3);
				content.text = insertHashTags(content.text);
				$0 = $2 + meta2tags(content) + $4;
			}
			tags.push($0);
			return " %%HTML_TAG%% ";
		});
		return {"text" : text, "tags": tags};
	};
	var meta2tags = function(content) {
		$.each(content.tags, function(i, v) {
			content.text = content.text.replace(" %%HTML_TAG%% ", v);
		});
		return content.text;
	};
	var urlMatcher = "((?:http|ftp|https):\\/\\/(?:[a-z0-9#:\\/\\;\\?\\-\\.\\+,@&=%!\\*\\'(){}\\[\\]$_|^~`](?!gt;|lt;))+)";
	var normalizeLinks = function(content) {
		return content.replace(/(<a\s+[^>]*>)(.*?)(<\/a>)/ig, function($0, $1, $2, $3) {
			if (new RegExp("^" + urlMatcher + "$").test($2)) {
				$2 = $2.length > limits.maxBodyLinkLength ? $2.substring(0, limits.maxBodyLinkLength) + "..." : $2;
			}
			if (openLinksInNewWindow && !/\s+target=("[^<>"]*"|'[^<>']*'|\w+)/.test($1)) {
				$1 = $1.replace(/(^<a\s+[^>]*)(>$)/, '$1 target="_blank"$2');
			}
			return $1 + $2 + $3;
		});
	};
	var content = tags2meta(text);
	if (source && source !== "jskit" && source !== "echo") {
		var url = this.depth
			? this.data.target.id
			: this.config.get("reTag")
				? this.data.object.permalink || this.data.target.id
				: undefined;
		if (url) {
			content.text = content.text.replace(new RegExp(url, "g"), "");
			if (!/\S/.test(content.text)) {
				output(this.labels.get("sharedThisOn", {"service": source}));
				return element;
			}
		}
	}

	var textBeforeAutoLinking = content.text = insertHashTags(content.text);
	if (contentTransformations.urls) {
		content.text = content.text.replace(new RegExp(urlMatcher, "ig"), function($0, $1) {
			return Echo.Utils.hyperlink({
				"href": $1,
				"caption": $1
			}, {
				"skipEscaping": true,
				"openInNewWindow": openLinksInNewWindow
			});
		})
	}
	if (contentTransformations.smileys) {
		if (content.text !== textBeforeAutoLinking) {
			content = tags2meta(meta2tags(content));
		}
		var smileys = this.initSmileysConfig();
		if (content.text.match(smileys.regexps.test)) {
			$.each(smileys.codes, function(i, code) {
				content.text = content.text.replace(smileys.regexps[code], smileys.tag(smileys.hash[code]));
			});
		}
	}

	if (contentTransformations.newlines) {
		content.text = content.text.replace(/\n\n+/g, "\n\n");
		content.text = content.text.replace(/\n/g, "&nbsp;<br>");
	}
	var result = normalizeLinks(meta2tags(content));
	var truncated = false;
	if ((limits.maxBodyCharacters || limits.maxBodyLines) && !self.textExpanded) {
		if (limits.maxBodyLines) {
			var splitter = contentTransformations.newlines ? "<br>" : "\n";
			var chunks = result.split(splitter);
			if (chunks.length > limits.maxBodyLines) {
				result = chunks.splice(0, limits.maxBodyLines).join(splitter);
				truncated = true;
			}
		}
		var limit = limits.maxBodyCharacters && result.length > limits.maxBodyCharacters
			? limits.maxBodyCharacters
			: truncated
				? result.length
				: undefined;
		// we should call Echo.Utils.htmlTextTruncate to close all tags
		// which might remain unclosed after lines truncation
		var truncatedText = Echo.Utils.htmlTextTruncate(result, limit, "", true);
		if (truncatedText.length !== result.length) {
			truncated = true;
		}
		result = truncatedText;
	}
	output(result, truncated);
	return element;
};

item.renderers.date = function(element) {
	var container = element || this.dom && this.dom.get("date");
	this.calcAge();
	if (container) {
		container.html(this.age);
	}
	return element;
};

item.renderers.expandChildrenLabel = function(element, dom, extra) {
	if (!this.children.length || !this.hasMoreChildren()) {
		return element;
	}
	extra = extra || {};
	extra.state = extra.state || "regular";
	var states = {
		"loading": {
			"css": this.cssPrefix + "-message-loading",
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

item.renderers.expandChildren = function(element, dom, extra) {
	if (!this.children.length) {
		return element;
	}
	if (!this.hasMoreChildren()) {
		// IE in Quirks mode can't operate with elements with "height: 0px" correctly,
		// element with "height: 0px" is renderered as though it doesn't have height property at all.
		// Thus we set "height: 1px" as the final value for animate function and simply hide element
		// after the animation is done.
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
	var self = this;
	// extra.element is sibling element for more children button
	extra = extra || {};
	// the "show()" jQuery method doesn't work for some reason in Chrome (A:5755)
	return element.css("display", "block")
		.addClass(this.cssPrefix + "-depth-" + (this.depth + 1))
		.unbind("click")
		.one("click", function() {
			self.render({
				"element": "expandChildrenLabel",
				"target": dom.get("expandChildrenLabel"),
				"dom": dom,
				"extra": {"state": "loading"}
			});
			self.events.publish({
				"topic": "internal.Item.onChildrenExpand",
				"data": {"data": self.data}
			});
		});
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
		(this.config.get("children.sortOrder") == "chronological"
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

item.methods.hasMoreChildren = function() {
	return this.data.hasMoreChildren == "true";
};

item.methods.getNextPageAfter = function() {
	var children = $.grep(this.children, function(child) {
		return !child.live;
	});
	var index = this.config.get("children.sortOrder") == "chronological"
		? children.length - 1
		: 0;
	return children.length
		? children[index].data.pageAfter
		: undefined;
};

item.methods.initSmileysConfig = function() {
	if (Echo.Vars.smileys) return Echo.Vars.smileys;
	var esc = function(v) { return v.replace(/([\W])/g, "\\$1"); };
	var smileys = Echo.Vars.smileys = {"codes": [], "regexps": []};
	smileys.hash = {
		':)':		{file: 'smile.png', title: 'Smile'},
		':-)':		{file: 'smile.png', title: 'Smile'},
		';)':		{file: 'wink.png', title: 'Wink'},
		';-)':		{file: 'wink.png', title: 'Wink'},
		':(':		{file: 'unhappy.png', title: 'Frown'},
		':-(':		{file: 'unhappy.png', title: 'Frown'},
		'=-O':		{file: 'surprised.png', title: 'Surprised'},
		':-D':		{file: 'grin.png', title: 'Laughing'},
		':-P':		{file: 'tongue.png', title: 'Tongue out'},
		'=)':		{file: 'happy.png', title: 'Happy'},
		'B-)':		{file: 'evilgrin.png', title: 'Evil grin'}
	};
	var escapedCodes = [];
	$.each(smileys.hash, function(code) {
		var escaped = esc(code);
		escapedCodes.push(escaped);
		smileys.codes.push(code);
		smileys.regexps[code] = new RegExp(escaped, "g");
	});
	smileys.regexps.test = new RegExp(escapedCodes.join("|"));
	smileys.tag = function(smiley) {
		return '<img class="' + this.cssPrefix + '-smiley-icon" src="//cdn.echoenabled.com/images/smileys/emoticon_' + smiley.file + '" title="' + smiley.title + '" alt="' + smiley.title + '" />';
	};
	return smileys;
};

item.methods.assembleButtons = function() {
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
				self.events.publish({
					"topic": "internal.Item.onButtonClick",
					"data": {
						"name": data.name,
						"plugin": plugin,
						"item": {
							"data": self.data,
							"target": self.dom.content
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
			data.visible = function() {
				return visible && self.config.get("plugins." + plugin + ".enabled");
			}
			var name = plugin + "." + data.name;
			self.buttons[name] = data;
			if ($.inArray(name, self.buttonsOrder) < 0) {
				buttonsOrder.push(name);
			}
		});
	});
	// keep correct order of plugins and buttons
	self.buttonsOrder = buttonsOrder.concat(self.buttonsOrder);
};

item.methods.sortButtons = function() {
	var self = this;
	var defaultOrder = this.buttonsOrder;
	var requiredOrder = this.config.get("buttonsOrder");
	// if buttons order is not specified in application config, use default order
	if (!requiredOrder) {
		this.config.set("buttonsOrder", defaultOrder);
	} else if (requiredOrder != defaultOrder) {
		var push = function(name, acc, pos) {
			if (!self.buttons[name]) return;
			acc.push(name);
			pos = pos || $.inArray(name, defaultOrder);
			if (pos >= 0) {
				delete defaultOrder[pos];
			}
		};
		var order = $.foldl([], requiredOrder, function(name, acc) {
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

item.methods.traverse = function(tree, callback, acc) {
	var self = this;
	$.each(tree || [], function(i, item) {
		acc = self.traverse(item.children, callback, callback(item, acc));
	});
	return acc;
};

item.methods.refreshDate = function() {
	this.render({"element": "date"});
	$.map(this.children || [], function(child) {
		child.refreshDate();
	});
};

item.methods.calcAge = function() {
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

item.methods.block = function(label) {
	if (this.blocked) return;
	this.blocked = true;
	var content = this.dom.get("container");
	var width = content.width();
	//We should take into account that container has a 10px 0px padding value
	var height = content.outerHeight();
	this.blockers = {
		"backdrop": $('<div class="' + this.cssPrefix + '-blocker-backdrop"></div>').css({
			"width": width, "height": height
		}),
		"message": $(this.substitute('<div class="{class:blocker-message}">{data:label}</div>', {"label": label})).css({
			"left": ((parseInt(width) - 200)/2) + 'px',
			"top": ((parseInt(height) - 20)/2) + 'px'
		})
	};
	content.addClass("echo-relative")
		.prepend(this.blockers.backdrop)
		.prepend(this.blockers.message);
};

item.methods.unblock = function() {
	if (!this.blocked) return;
	this.blocked = false;
	this.blockers.backdrop.remove();
	this.blockers.message.remove();
	this.dom.get("container").removeClass("echo-relative");
};

item.methods.getAccumulator = function(type) {
	return this.data.object.accumulators[type];
};

item.methods.isRoot = function() {
	return this.config.get("data.object.id") == this.config.get("data.target.conversationID");
};

item.methods.unique = function() {
	return this.config.get("data.unique");
};

item.methods.parentUnique = function() {
	return this.config.get("data.parentUnique");
};

item.constructor = function(config) {
	this.children = [];
	this.depth = 0;
	this.threading = false;
	//"id": entry.object.id, // short cut for "id" item field
	this.timestamp = Echo.Utils.timestampFromW3CDTF(this.data.object.published);
	this.textExpanded = false;
	this.blocked = false;
	this.buttonsOrder = [];
	this.buttonSpecs = {};
	this.buttons = {}; 
};

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
	'.{class:markers} { line-height: 16px; background: url(//cdn.echoenabled.com/images/curation/metadata/marker.png) no-repeat; padding: 0px 0px 4px 21px; margin-top: 7px; }' +
	'.{class:tags} { line-height: 16px; background: url(//cdn.echoenabled.com/images/tag_blue.png) no-repeat; padding: 0px 0px 4px 21px; }' +
	'.{class:metadata} { display: none; }' +
	'.{class:metadata-title} { font-weight: bold; line-height: 25px; height: 25px; margin-right: 5px; }' +
	'.{class:metadata-icon} { display: inline-block; padding-left: 26px; }' +
	'.{class:metadata-userID} { border-bottom: 1px solid #e1e1e1; border-top: 1px solid #e1e1e1;}' +
	'.{class:metadata-userID} .{class:metadata-icon} { background: url("//cdn.echoenabled.com/images/curation/metadata/user.png") no-repeat left center; }' +
	'.{class:metadata-userIP} { border-bottom: 1px solid #e1e1e1; }' +
	'.{class:metadata-userIP} .{class:metadata-icon} { background: url("//cdn.echoenabled.com/images/curation/metadata/computer.png") no-repeat left center; }' +
	'.{class:modeSwitch} { float: right; width: 16px; height: 16px; background:url("//cdn.echoenabled.com/images/curation/metadata/flip.png") no-repeat 0px 3px; }' +
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
	'.{class:tag} { display: inline-block; height: 16px; background: url("//cdn.echoenabled.com/images/tag_blue.png") no-repeat; padding-left: 18px; }' +
	'.{class:smiley-icon} { border: 0px; }' +
	'.{class:textToggleTruncated} { margin-left: 5px; }' +
	'.{class:blocker-backdrop} { position: absolute; left: 0px; top: 0px; background: #FFFFFF; opacity: 0.7; z-index: 100; }' +
	'.{class:blocker-message} { position: absolute; z-index: 200; width: 200px; height: 20px; line-height: 20px; text-align: center; background-color: #FFFF99; border: 1px solid #C6C677; opacity: 0.7; -moz-border-radius: 0.5em 0.5em 0.5em 0.5em; }' +
	'.{class:expandChildren} { display:none; text-align: center; padding:4px; }' +
	'.{class:expandChildren} .{class:expandChildrenLabel} { display: inline-block; padding-left: 22px; }' +
	'.{class:expandChildren} .echo-message-icon { background: url("//cdn.echoenabled.com/images/whirlpool.png") no-repeat 5px 4px; }' +
	'.{class:expandChildren} .{class:message-loading} { background: no-repeat left top url(//cdn.echoenabled.com/images/loading.gif); }' +
	'.{class:expandChildren} .echo-application-message { padding: 0; border:none; border-radius: 0; }' +
	itemDepthRules.join("\n") +
	($.browser.msie
		? '.{class:childrenMarker} { font-size: 1px; line-height: 1px; }' +
		'.{class:blocker-backdrop}, .{class:blocker-message} { filter:alpha(opacity=70); }' +
		'.{class:content}, .{class:container}, .{class:subwrapper} { zoom: 1; }' +
		'.{class:avatar-wrapper} { position: static; }'
		: ''
	);

Echo.Control.create(item);

})(jQuery);
