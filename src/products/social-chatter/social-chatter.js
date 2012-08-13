(function() {

var labels = Echo.Labels;

labels.set({
	"fewMoments": "in a few moments",
	"moreYear": "more than a year",
	"defaultDateDiffDisplay": "in {diff} {period}{suffix}",
	"startDateDiffDisplay": "Will be started in {diff} {period}{suffix}",
	"endDateDiffDisplay": "Ended {diff} {period}{suffix} ago"
}, "Echo.SocialChatterEvent", true);

// TODO: pass entire entry to this constructor, not only "content" field
Echo.SocialChatterEvent = function(data, id) {
	this.id = id;
	this.data = this.getData(data);
};

Echo.SocialChatterEvent.prototype.getData = function(dataString) {
	var data = {};
	try {
		data = $.parseJSON(dataString);
	} catch (e) {}
	return data || {};
};

Echo.SocialChatterEvent.prototype.calcEventDates = function(type, display) {
	type = type.charAt(0).toUpperCase() + type.substr(1);
	var content = this.data;
	if (!content["event" + type]) return;
	var timestamp = content["event" + type];
	var d = new Date(timestamp);
	var now = (new Date()).getTime();
	var diff = Math.abs(Math.floor((d.getTime() - now) / 1000));
	var dayDiff = Math.floor(diff / 86400);
	if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 365)
		return (d.toLocaleDateString() + ', ' + d.toLocaleTimeString());
	return this.displayDateDiff(diff, display);
};

Echo.SocialChatterEvent.prototype.displayDateDiff = function(diff, display) {
	var self = this;
	var when;
	var dayDiff = Math.floor(diff / 86400);
	var display = display || function(diff, period) {
		return labels.get("defaultDateDiffDisplay", "Echo.SocialChatterEvent", {
			"diff": diff,
			"period": period,
			"suffix": diff == 1 ? "" : "s"
		});
	};
	if (diff < 60) {
		when = labels.get("fewMoments");
	} else if (diff < 60 * 60) {
		diff = Math.floor(diff / 60);
		when = display(diff, "minute");
	} else if (diff < 60 * 60 * 24) {
		diff = Math.floor(diff / (60 * 60));
		when = display(diff, "hour");
	} else if (dayDiff < 30) {
		when = display(dayDiff, "day");
	} else if (dayDiff < 365) {
		diff =  Math.floor(dayDiff / 31);
		when = display(diff, "month");
	} else {
		when = labels.get("moreYear");
	}
	return when;
};

Echo.SocialChatterEvent.prototype.calcStartEvent = function() {
	return this.calcEventDates("start");
};

Echo.SocialChatterEvent.prototype.calcEndEvent = function() {
	var self = this;
	return this.calcEventDates("end", function(diff, period) {
		return labels.get("endDateDiffDisplay", "Echo.SocialChatterEvent", {
			"diff": diff,
			"period": period,
			"suffix": diff == 1 ? "" : "s"
		});
	});
};

// FIXME: need rename function
Echo.SocialChatterEvent.prototype.calcAnotherStartEvent = function() {
	var self = this;
	return this.calcEventDates("start", function(diff, period) {
		return labels.get("startDateDiffDisplay", "Echo.SocialChatterEvent", {
			"diff": diff,
			"period": period,
			"suffix": diff == 1 ? "" : "s"
		});
	});
};

Echo.SocialChatterEvent.prototype.getTimestamp = function() {
	return {
		"start": this.data.eventStart ? this.data.eventStart : 0,
		"end": this.data.eventEnd ? this.data.eventEnd : 0
	};
};

Echo.SocialChatterEvent.prototype.onAir = function() {
	var timestamp = this.getTimestamp();
	var now = (new Date()).getTime();
	return (timestamp.start <= now && timestamp.end >= now);
};

Echo.SocialChatterEvent.prototype.getEventDuration = function() {
	var timestamp = this.getTimestamp();
	return Math.floor((timestamp.end - timestamp.start) / 1000);
};

Echo.SocialChatterEvent.prototype.getEventStatus = function() {
	if (this.onAir()) return "onAir";
	var timestamp = this.getTimestamp();
	var now = (new Date()).getTime();
	if (timestamp.start > now) return "upcoming";
	else if (timestamp.end < now) return "passed";
};

})();

(function() {

if (Echo.Utils.isComponentDefined("Echo.Products.SocialChatter")) return;

var SocialChatter = Echo.Product.manifest("Echo.Products.SocialChatter");

SocialChatter.labels = {
	"guest": "Guest",
	"live": "Live",
	"paused": "Paused",
	"more": "More",
	"emptyGreenRoom": "No items at this time...",
	"new": "new",
	"loading": "Loading...",
	"tabGreenRoomLabel": "Green room",
	"tabPublicEventLabel": "Public event",
	"tabAllEventsLabel": "All Events", 
	"assignVIPRoleControl": "Assign VIP role",
	"revokeVIPRoleControl": "Revoke VIP role",
	"sendToGreenRoomControl": "Send to Green Room",
	"removeFromGreenRoomControl": "Remove from Green Room"
};

SocialChatter.vars = {"cache": {}};

SocialChatter.init = function() {
	var self = this;
	this.showMessage({"type": "loading", "message": this.labels.get("loading")});
	this.config.set("eventListQuery", "childrenof: " + this.config.get("eventsTargetURL") + " itemsPerPage:100 state:Untouched,ModeratorApproved children:0");
	self._initVars();
	self._initBackplane();
	self._requestEventsList(function(data) {
		self._initSocialChatterEvents(data.entries);
		self._setPublicEvent(self._pickRelevantEvent(data.entries));
		self.dom.render();
		self.config.set("apps.Stream.EventsList.data", data);
	});
};

SocialChatter.config = {
	"backplane": {
		"serverBaseURL": "http://api.echoenabled.com/v1"
	},
	"eventsTargetURL": undefined,
	"liveUpdates": true,
	"liveUpdatesTimeout": 60, // request Events updates once per minute
	"identityManager": undefined,
	"views": {}
};

SocialChatter.views.Main = {};

SocialChatter.views.EventsList = {};

SocialChatter.views.Main.templates = {};

SocialChatter.views.EventsList.templates = {};

SocialChatter.views.Main.templates.main = SocialChatter.views.EventsList.templates.main =
	'<div class="{class:eventListContainer}">' +
		'<div class="{class:newEventButton}">' +
			'<div class="{class:eventSubmitLabel} echo-linkColor">{label:newEvent}</div>' +
		'</div>' +
		'<div class="{class:eventSubmitContainer}">' +
			'<div class="{class:eventSubmit}"></div>' +
		'</div>' +
		'<div class="{class:eventsStream}"></div>' +
	'</div>';

SocialChatter.views.Main.controls = {};

SocialChatter.views.Main.controls["Echo.IdentityServer.Controls.Auth"] = {
	"appkey": null,
	"identityManager": "{config:identityManager}"
};

SocialChatter.views.EventsList.renderers = {};

/*SocialChatterView.renderers.loginWarning = function(element) {
	element.html('<span>' + this.labels.get(this.event.getEventStatus() + "EventWarning") + '</span>');
};

SocialChatterView.renderers.publicViewNotice = function(element) {
	var status = this.event.getEventStatus();
	if (status == "passed") {
		return '<span>' + this.labels.get("passedEventViewNotice") + '</span>';
	}
	element.hide();
};

SocialChatterView.renderers.avatar = function(element) {
	var self = this;
	var url = this.data.vipPhoto || this.config.get("defaultEventIcon");
	var img = $("<img>", {"src": url});
	if (url != this.config.get("defaultEventIcon")) {
		img.one({
			"error" : function(){
				$(this).attr("src", self.config.get("defaultEventIcon"));
			}
		});
	}
	element.append(img);
};

SocialChatterView.renderers.countdown = function(element) {
	var self = this;
	element.hide();
	var status = this.event.getEventStatus();
	var isUpcomingEvent = status == "upcoming";
	var finishHandler = status == "upcoming" || status == "onAir"
		? function() {
			var topic = isUpcomingEvent
				? "SocialChatter.onEventStart"
				: "SocialChatter.onEventEnd";
			Echo.Broadcast.publish(topic, self.data);
		}
		: function() {};
	if (status != "upcoming") return;
	element.css("display", "block")
		.countdown(new Date(this.data[isUpcomingEvent ? "eventStart" : "eventEnd"]), {
			"prefix": this.labels.get(isUpcomingEvent ? "chatOpensIn" : "chatClosesIn"),
			"finish": finishHandler
		});
};*/

SocialChatter.views.EventsList.renderers.eventSubmitLabel = function(element) {
	var self = this;
	if (this.user.is("admin") && !this.user.any("role", ["vip"])) {
		new Echo.Button(element, {
			"label": this.labels.get("scheduleEvent")
		});
		element.click(function() {
			self.dom.get("eventSubmitContainer").slideToggle();
		});
	} else {
		element.detach();
	}
	return element;
};

SocialChatter.views.EventsList.controls = {};

SocialChatter.views.EventsList.controls["Echo.StreamServer.Controls.Submit"] = {
	"appkey": null,
	"targetURL": "{Self:eventsTargetURL}",
	"itemURIPattern": "{Self:eventsTargetURL}/{id}",
	"plugins": [{
		"name": "SocialChatterEvent"
	}]
};

SocialChatter.views.EventsList.controls["Echo.StreamServer.Controls.Stream"] = {
	"appkey": null,
	"query": "childrenof:{Self:eventsTargetURL} state:Untouched,ModeratorApproved children:0",
	"reTag": false,
	"itemControlsOrder": ["SocialChatterEvent", "Edit", "Curation.Delete"],
	"plugins": [{
		"name": "SocialChatterEvent"
	}, {
		"name": "Edit",
		"layout": "inline",
		"nestedPlugins": [{"name": "SocialChatterEvent"}]
	}, {
		"name": "Curation"
	}]
};

SocialChatter.templates.main = 
	'<div class="{class:container} echo-primaryFont echo-primaryBackgroundColor">' +
		'<div class="{class:authContainer}">' +
			'<div class="{class:auth}"></div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
		'<div class="{class:tabs}"></div>' +
	'</div>';

/*SocialChatter.methods._getDefaultAppsConfig = function(config) {
	var plugins = {
		"MetadataManager": {
			"name": "MetadataManager",
			"controls": [{
				"marker": "greenroom",
				"labelMark": "{Label:sendToGreenRoomControl}",
				"labelUnmark": "{Label:removeFromGreenRoomControl}"
			}],
			"enabled": "{Self:isNonVIPUser}"
		},
		"ItemConditionalCSSClasses": {
			"name": "ItemConditionalCSSClasses",
			"conditions": [{
				"field": "actor.roles",
				"value": ["vip"],
				"className": "echo-item-vip-guest"
			}]
		},
		"UserMetadataManager": {
			"name": "UserMetadataManager",
			"controls": [{
				// we need "moderator" role for VIP as well
				// since we need to apply markers to some items
				"roles": "vip,moderator",
				"labelSet": "{Label:assignVIPRoleControl}",
				"labelUnset": "{Label:revokeVIPRoleControl}"
			}],
			"enabled": "{Self:isNonVIPUser}"
		}
	};
	return {
		// Green Room tab applications
		/*"GreenRoom": {
			"Stream": {
				"appkey": null,
				"query": "childrenof:{Self:event.id}/* state:Untouched,ModeratorApproved markers:greenroom -markers:answered children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
				"reTag": false,
				"plugins": [{
					"name": "Reply",
					"itemURIPattern": "{Self:event.id}/{id}",
					"nestedPlugins": [{
						"name": "SubmitTextareaAutoResize"
					}]
				}, {
					"name": "VipReplies",
					"copyTo": {
						"target": "{Self:event.id}"
					},
					"view": "private"
				}, plugins.MetadataManager]
			}
		},*/
		// All Events tab applications
		/*,
		// all applications from the public event tab
		"PublicEvent": {
			"Stream": {
				"appkey": null,
				"query": "childrenof:{Self:event.id} state:Untouched,ModeratorApproved safeHTML:off user.state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
				"reTag": false,
				"liveUpdatesTimeout": 60,
				"plugins": [{
					"name": "Reply",
					"itemURIPattern": "{Self:event.id}/{id}",
					"nestedPlugins": [{
						"name": "SubmitTextareaAutoResize"
					}]
				}, {
					"name": "Like"
				}, {
					"name": "Curation",
					"enabled": "{Self:isNonVIPUser}"
				}, {
					"name": "VipReplies",
					"copyTo": {
						"target": "{Self:event.id}"
					},
					"view": "private"
				},
				plugins.ItemConditionalCSSClasses,
				plugins.MetadataManager,
				plugins.UserMetadataManager]
			},
			"Submit": {
				"appkey": null,
				"targetURL": "{Self:event.id}",
				"itemURIPattern": "{Self:event.id}/{id}",
				"actionString": "Type your question here...",
				"plugins": [{
					"name": "SubmitTextareaAutoResize"
				}, {
					"name": "SubmitCountdownEvent",
					"eventEnd": "{Self:event.data.eventEnd}",
					"enabled": "{Self:event.isOnAir}"
				}]
			},
			"VIPStream": {
				"appkey": null,
				"query": "childrenof:{Self:event.id} state:Untouched,ModeratorApproved safeHTML:off user.roles:vip user.state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
				"reTag": false,
				"plugins": [{
					"name": "Reply",
					"itemURIPattern": "{Self:event.id}/{id}",
					"nestedPlugins": [{
						"name": "SubmitTextareaAutoResize"
					}]
				}, {
					"name": "Like"
				}, {
					"name": "Curation",
					"enabled": "{Self:isNonVIPUser}"
				}, {
					"name": "VipReplies"
				},
				plugins.ItemConditionalCSSClasses]
			}
		},
		// views-independent applications
		"Main": {
			"Auth": {
				"appkey": null,
				"identityManager": config.identityManager
			}
		}
	};
};*/

SocialChatter.assemblers = {};

/*SocialChatter.renderers.auth = function(element) {
	if (!this.config.get("identityManager")) {
		element.hide();
		return;
	}
	this._initInternalApplication({
		"view": "Main",
		"name": "Auth",
		"application": "Echo.IdentityServer.Controls.Auth"
	}, {
		"target": element
	});
};*/

SocialChatter.renderers.tabs = function(element) {
	this._assembler("EventsList", element);
	return element;
};

SocialChatter.methods._initVars = function() {
	this.event = undefined;
	this.eventById = {};
};

SocialChatter.methods._initSocialChatterEvents = function(entries) {
	var self = this;
	$.each(entries, function(id, entry) {
		self.eventById[entry.object.id] =
			new Echo.SocialChatterEvent(entry.object.content, entry.object.id);
	});
};

SocialChatter.methods._setPublicEvent = function(event) {
	this.data = this.data || {};
	this.event = this.data.event = event;
	// prepare variables for appending into config via templating engine
	this.isNonVIPUser = this.user.any("role", ["vip"]) ? "" : "true";
	if (this.event) {
		this.event.isOnAir = this.event.onAir() ? "true" : "";
	}
};

SocialChatter.methods._hasGreenRoomAccess = function() {
	// Green Room is available for VIP guests and admins,
	// VIP guests should have admin rights as well to mark items as "answered"
	return this.user.is("admin");
};

SocialChatter.methods._updateTab = function(config) {
	if (this.tabs && !this.event && config.name != "EventsList"
		|| (this.event && this.event.getEventStatus() == "passed" && config.name == "GreenRoom")) {
		this.tabs.remove(config.name);
		return;
	}
	// exit if we don't have access to Green Room tab
	if (config.name == "GreenRoom" && !this._hasGreenRoomAccess()) return;
	if (this.tabs && typeof this.tabs.tabIndexById[config.name] == "undefined") {
		this.tabs.add({
			"id": config.name,
			"label": config.name == "PublicEvent"
				? this.event.data.eventName || this.labels.get("tabPublicEventLabel")
				: this.labels.get("tabGreenRoomLabel"),
			"icon": false
		});
	}
	var tabsDomContainer = this.dom.get("tabs");
	config.target = config.target || $("#" + this.tabs.idPrefix + config.name, tabsDomContainer);
	config.ui = config.ui || {"tab": $(".echo-" + this.tabs.classPrefix + config.name, tabsDomContainer)};
	if (this.assemblers[config.name]) {
		$(config.target).empty();
		this._assembler(config.name, config.target, config.ui);
	}
};

SocialChatter.methods._updateTabs = function() {
	var self = this;
	$.each(["PublicEvent", "GreenRoom"], function(i, tabId) {
		self._updateTab({
			"name": tabId
		});
	});
};

SocialChatter.methods._pickRelevantEvent = function(entries) {
	// we need to pick one most relevant event:
	//  - look for event which is on air right now
	//  - otherwise grab first upcoming event
	//  - if there are no upcoming or on air events - return undefined
	if (entries && !entries.length) return;
	var relevantEvent;
	$.each(this.eventById, function(id, event) {
		var status = event.getEventStatus();
		if (status == "onAir") {
			relevantEvent = event;
			return false; // break
		}
		if (status == "upcoming" && event.data.eventStart &&
			(!relevantEvent || relevantEvent.data.eventStart > event.data.eventStart)) {
				relevantEvent = event;
		}
	});
	return relevantEvent;
};

SocialChatter.methods._classifyAction = function(entry) {
	return (entry.verbs[0] == "http://activitystrea.ms/schema/1.0/delete") ? "delete" : "post";
};

SocialChatter.methods._handleLiveUpdatesResponse = function(data) {
	var self = this;
	this.nextSince = data.nextSince || 0;
	// we need to do the following:
	//   - if the current public event is updated: update data and UI
	//   - if the current public event was deleted: delete from data and refresh the UI
	//   - if any other event was deleted: delete from data
	//   - if new event is added AND public event (on air or upcoming) is displayed:
	//		add to the data, do NOT update/switch public event view
	//   - if new event is added AND NO public event (on air or upcoming) is displayed:
	//		add to the data AND add public event tab!
	if (!data.entries || !data.entries.length) return;
	$.each(data.entries, function(id, entry) {
		var event = self.eventById[entry.object.id];
		var action = self._classifyAction(entry);
		if (!event && action != "post") return;
		switch (action) {
			case "post":
				var event = new Echo.SocialChatterEvent(
					entry.object.content,
					entry.object.id
				);
				var status = event.getEventStatus();
				self.eventById[entry.object.id] = event;
				// if current event is updated
				// OR if NO public event - add new tab & green room tab
				if ((self.event && self.event.id == event.id) ||
					(!self.event && (status == "onAir" || status == "upcoming"))) {
					self._setPublicEvent(self._pickRelevantEvent(data.entries));
					self._updateTabs();
				}
				break;
			case "delete":
				delete self.eventById[entry.object.id];
				// refresh if current event was removed
				if (self.event && self.event.id == entry.object.id) {
					delete self.event;
					self._setPublicEvent(self._pickRelevantEvent());
					self._updateTabs();
				}
				break;
		};
	});
	this.startLiveUpdates();
};

SocialChatter.methods._initBackplane = function() {
	if (!this.config.get("backplane.busName")) return;
	Backplane.init(this.config.get("backplane"));
};

SocialChatter.methods._initTabs = function() {
	var self = this;
	var tabs = [{
		"id": "EventsList",
		"label": this.labels.get("tabAllEventsLabel"),
		"icon": false
	}];
	if (this.event) {
		var data = this.event.data;
		tabs.push({
			"id": "PublicEvent",
			"label": data.eventName || this.labels.get("tabPublicEventLabel"),
			"icon": false,
			"selected": true
		});
	}
	if (this.event && this._hasGreenRoomAccess()) {
		tabs.push({
			"id": "GreenRoom",
			"label": this.labels.get("tabGreenRoomLabel"),
			"icon": false
		});
	}
	this.tabs = new Echo.UI.Tabs({
		"target": this.dom.get("tabs"),
		"addUIClass": false,
		"idPrefix": "socialchatter-tabs-",
		"classPrefix": "socialchatter-tabs-",
		"config": {
			"show": function(event, ui) {
				self._updateTab({
					"name": tabs[ui.index].id,
					"target": ui.panel,
					"ui": ui
				});
			}
		},	
		"tabs": tabs 
	});
	if (this.event) {
		this.tabs.select("PublicEvent");
	}
};

SocialChatter.methods._requestEventsList = function(callback) {
	var self = this;
	Echo.StreamServer.API.request({
		"endpoint": "search",
		"recurring": true,
		"apiBaseURL": this.config.get("apiBaseURL"),
		"liveUpdatesTimeout": this.config.get("liveUpdatesTimeout"),
		"data": {
			"q": this.config.get("eventListQuery"),
			"appkey": this.config.get("appkey")
		},
		"onData": function(response) {
			callback(response);
		}
	}).send();
};

SocialChatter.methods._assembler = function(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	return this._manifest("assemblers")[name].apply(this, args);
};

SocialChatter.methods._updateAppPlugins = function(plugins, updatePlugins) {
	var self = this;
	var getPluginIndex = function(plugin, plugins) {
		var idx = -1;
		$.each(plugins, function(i, _plugin) {
			if (plugin.name === _plugin.name) {
				idx = i;
				return false;
			}
		});
		return idx;
	};
	return Echo.Utils.foldl(plugins, updatePlugins, function(extender) {
		var id = getPluginIndex(extender, plugins);
		if (!~id) {
			plugins.push(extender);
			return;
		}
		if (extender.name === plugins[id].name) {
			if (extender.nestedPlugins && plugins[id].nestedPlugins) {
				self._updateAppPlugins(plugins[id].nestedPlugins, extender.nestedPlugins);
				// delete nested plugins in the extender to avoid override effect after extend below
				delete extender.nestedPlugins;
			}
			plugins[id] = $.extend(true, plugins[id], extender);
		}
	});
};

SocialChatter.assemblers.Auth = function(target) {
	if (!this.config.get("identityManager")) {
		target.hide();
		return;
	}
	var ViewConstructor = this.getView("Main");
	var view = new ViewConstructor({
		"user": this.user,
		"target": target,
		"appkey": this.config.get("appkey"),
		"type": "eventsList"
	});
	var content = view.dom.render();
	view._initControl({
		"name": "Echo.IdentityServer.Controls.Auth"
	}, {
		"target": view.dom.get("auth")
	});
};

SocialChatter.assemblers.EventsList = function(target) {
	var ViewConstructor = this.getView("EventsList");
	var view = new ViewConstructor({
		"user": this.user,
		"target": target,
		"appkey": this.config.get("appkey"),
		"type": "eventsList"
	});
	var content = view.dom.render();
	if (this.user.is("admin")) {
		var submit = view._initControl({
			"name": "Echo.StreamServer.Controls.Submit"
		}, {
			"target": view.dom.get("eventSubmit")
		});
		/*submit.events.subscribe("Submit.onPostComplete", function(topic, args) {
			view.dom.get("eventSubmitContainer").slideUp();
		});*/
	}
	var stream = view._initControl({
		"name": "Echo.StreamServer.Controls.Stream"
	}, {
		"target": view.dom.get("eventsStream"),
		"query": this.config.get("eventListQuery")
	});
	$(target).append(content);
};


SocialChatter.assemblers.PublicEvent = function(target, ui) {
	var self = this;
	var data = this.event.data;
	var pluginEnabled = !(this.event && this.event.getEventStatus() == "passed");
	var view = new Echo.SocialChatterView({
		"user": this.user,
		"data": data,
		"target": target,
		"type": "event"
	});
	var content = view.dom.render();
	// setting tab title
	$(ui.tab).html(data.eventName || "Unknown Event");
	if (!this.user.logged() || this.event.getEventStatus() == "upcoming") {
		$(target).append(content);
		return;
	}
	if (this.event.onAir()) 
		this._initInternalApplication({
			"view": "PublicEvent",
			"name": "Submit",
			"application": "Submit"
		}, {
			"target": view.dom.get("publicSubmit")
		});
	this._initInternalApplication({
		"view": "PublicEvent",
		"name": "Stream",
		"application": "Stream"
	}, {
		"target": view.dom.get("publicStream"),
		"plugins": this._updateAppPlugins(
			this.config.get("views")["PublicEvent"]["Stream"].plugins,
			[{
				"name": "Reply",
				"enabled": pluginEnabled
			}, {
				"name": "Like",
				"enabled": pluginEnabled
			}]
		)
	});
	this._initInternalApplication({
		"view": "PublicEvent",
		"name": "VIPStream",
		"application": "Stream"
	}, {
		"target": view.dom.get("vipStream"),
		"plugins": this._updateAppPlugins(
			this.config.get("views")["PublicEvent"]["VIPStream"].plugins,
			[{
				"name": "Reply",
				"enabled": pluginEnabled
			}, {
				"name": "Like",
				"enabled": pluginEnabled
			}]
		)
	});
	$(target).append(content);
};

SocialChatter.assemblers.GreenRoom = function(target, ui) {
	var view = new Echo.SocialChatterView({
		"user": this.user,
		"target": target,
		"type": "greenRoom"
	});
	var content = view.dom.render();
	this._initInternalApplication({
		"view": "GreenRoom",
		"name": "Stream",
		"application": "Stream"
	}, {
		"target": view.dom.get("vipStream")
	});
	var instrustionsContainer = view.dom.get("vipInstructions");
	if (!this.event || !this.event.data || !this.event.data.vipInstructions) {
		instrustionsContainer.hide();
	} else {
		instrustionsContainer.html(this.event.data.vipInstructions).show();
	}
	$(target).append(content);
};

SocialChatter.events = {
	"User.onInvalidate": function() {
		this.refresh();
	},
	"SocialChatter.onBeforeEventOpen": function(topic, args) {
		var obj = args.event.object;
		self._setPublicEvent(new Echo.SocialChatterEvent(obj.content, obj.id));
		self._updateTabs();
		self.tabs.select("PublicEvent");
	}
};

Echo.Utils.foldl(SocialChatter.events, ["Submit.onPostComplete", "Submit.onEditComplete", "SocialChatter.onEventDelete"], function(topic, acc) {
	acc[topic] = function() {
		self.startLiveUpdates(true);
	};
});

Echo.Utils.foldl(SocialChatter.events, ["SocialChatter.onEventStart", "SocialChatter.onEventEnd"], function(topic, acc) {
	acc[topic] = function() {
		self._updateTabs();
	};
});

SocialChatter.css =
		'.echo-ui .echo-tabs-header li.ui-state-default { background-color: #E6E6E6; }' +
		'.echo-ui .echo-tabs-header li.ui-state-active { background-color: #FFFFFF; }' +
		// fancy buttons
		'.echo-item-eventButtonContainer .echo-button .ui-state-default, .echo-socialchatter-view-newEventButton .echo-button .ui-state-default, .echo-submit-controls .echo-button .ui-state-default {background: -webkit-gradient(linear, left top, left bottom, from(white), to(#EDEDED)); background: -moz-linear-gradient(top, white, #EDEDED); text-shadow: 0 1px 1px rgba(0, 0, 0, .3); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2); -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); width: 100px;}' +
		'.echo-socialchatter-view-newEventButton .echo-button .ui-state-default, .echo-item-eventButtonContainer .echo-button .ui-state-default { width: auto; padding: 3px 15px; }' +
		'.echo-socialchatter-view-eventListContainer { margin-left: 15px; margin-right: 15px; }' +
		'.echo-socialchatter-view-eventListContainer .echo-submit-userInfoWrapper { display: none; }' +
		'.echo-socialchatter-view-publicStream, .echo-socialchatter-view-vipStream { margin-top: 15px; }' +
		'.echo-socialchatter-view-vipStream { margin-bottom: 20px; }' +
		'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-nav li { border: 1px solid #DDDDDD; border-bottom: none; }' +
		'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-nav li a { padding: 7px 15px 5px 15px; font-size: 16px; }' +
		'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-panel { border-radius: 0px; border-left: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; border-right: 1px solid #DDDDDD; }' +
		'.echo-ui .echo-socialchatter-tabs .echo-tabs-header { border-bottom: 1px solid #DDDDDD; }' +
		'.echo-socialchatter-view-eventSubmitContainer { display: none; }' +
		'.echo-socialchatter-view-eventsStream { margin-top: 15px; }' +
		'.echo-socialchatter-view-eventsStream .echo-stream-header { display: none; }' +
		'.echo-socialchatter-view-leftColumn { margin: 5px 25px 0px 10px; }' +
		'.echo-socialchatter-view-leftColumnTD { width: 40%; vertical-align: top; }' +
		'.echo-socialchatter-view-rightColumnTD { width: 60%; vertical-align: top; }' +
		'.echo-socialchatter-view-rightColumn { margin: 0 10px; border: 1px solid #D3D3D3; padding: 15px 10px 15px 20px; border-radius: 4px; -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2); -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); }' +
		'.echo-socialchatter-view-publicSubmitLabel { font-weight: bold; font-size: 16px; margin-bottom: 10px; }' +
		'.echo-socialchatter-view-eventSubmitLabel { margin-top: 10px; cursor: pointer; font-weight: bold; font-size: 16px; }' +
		'.echo-socialchatter-view-eventSubmit .echo-submit-post-container { float: left; margin-left: 7px; }' +
		'.echo-socialchatter-view-eventSubmit .echo-submit-content { border: none; }' +
		'.echo-socialchatter-view-publicSubmit .echo-submit-userInfoWrapper { display: none; }' +
		'.echo-socialchatter-view-eventSubmit .echo-submit-userInfoWrapper { display: none; }' +
		'.echo-socialchatter-view-publicStream .echo-submit-userInfoWrapper { display: none; }' +
		'.echo-socialchatter-view-vipStream .echo-submit-userInfoWrapper { display: none; }' +
		'.echo-socialchatter-view-vipStream textarea.echo-submit-text { height: 36px; }' +
		'.echo-socialchatter-view-publicStream textarea.echo-submit-text { height: 36px; }' +
		'.echo-socialchatter-view-publicSubmit textarea.echo-submit-text { height: 36px; }' +
		'.echo-socialchatter-view-vipStream .echo-stream-header { display: none; }' +
		'.echo-socialchatter-view-publicStream .echo-stream-header { display: none; }' +
		'.echo-application-message { border: none; }' +
		'.echo-socialchatter-container .echo-submit-markersContainer, .echo-socialchatter-container .echo-submit-tagsContainer, .echo-socialchatter-container .echo-item-modeSwitch { display: none !important; }' +
		'.echo-socialchatter-view-publicSubmit .echo-submit-text { height: 55px; }' +
		'.echo-socialchatter-auth { float: right; }' +
		'.echo-socialchatter-auth .echo-auth-avatar, .echo-auth-logout { height: 24px; line-height: 24px; margin: 0px;}' +
		'.echo-socialchatter-auth .echo-auth-name { line-height: 23px; font-size: 14px; margin: 0px 20px 0px 0px; }' +
		'.echo-socialchatter-auth .echo-auth-edit { height: 24px; line-height: 24px; margin: 0px 5px 0px 0px; }' +
		'.echo-socialchatter-view-publicView { margin-top: 5px; }' +
		'.echo-socialchatter-view-publicView table { width: 100%; }' +
		'.echo-socialchatter-view-eventSubmit { margin: 10px auto; padding: 10px; width: 550px; }' +
		'.echo-socialchatter-view-eventSubmitContainer { border-radius: 7px; border: 1px solid #D3D3D3; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); margin: 10px 0px; }' +
		'.echo-socialchatter-view-eventDescription .echo-socialchatter-view-avatar { float: left; width: 100px; margin-right:-110px; margin-top: 2px; }' +
		'.echo-socialchatter-view-eventDescription .echo-socialchatter-view-avatar img { width: 100px; }' +
		'.echo-socialchatter-view-eventDescription .echo-socialchatter-view-title { margin-left: 115px; font-size: 20px; line-height: 20px; font-weight: bold; }' +
		'.echo-socialchatter-view-eventDescription .echo-socialchatter-view-description, .echo-socialchatter-view-eventDescription .startEvent, .echo-socialchatter-view-eventDescription .echo-socialchatter-view-countdown { margin-left: 115px; font-size: 14px; margin-top: 10px; }' +
		'.echo-socialchatter-view-publicViewUpcoming .echo-socialchatter-view-eventDescription, .echo-socialchatter-view-publicViewAnonymous .echo-socialchatter-view-eventDescription { max-width: 400px; margin: 20px auto; }' +
		'.echo-socialchatter-view-publicViewUpcoming { margin-top: 35px; }' +
		'.echo-socialchatter-view-countdown, .echo-socialchatter-view-publicViewNotice, .echo-socialchatter-view-vipInstructions { background-color: #D9EDF7; border: 1px solid #BCE8F1; border-radius: 4px 4px 4px 4px; color: #3A87AD;  margin: 20px auto 30px; padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 16px; text-align: center; }' +
		'.echo-socialchatter-view-countdown { display: none; }' +
		'.echo-socialchatter-view-vipInstructions { line-height: 20px; margin-top: 10px; }' +
		'.echo-socialchatter-view-publicViewNotice { width: 450px; }' +
		'.echo-socialchatter-view-publicViewNotice { margin-top: 0px; margin-bottom: 10px; }' +
		'.echo-socialchatter-view-publicViewAnonymous .echo-socialchatter-view-loginWarning { background-color: #F2DEDE; border: 1px solid #EED3D7; border-radius: 4px 4px 4px 4px; color: #B94A48;  margin: 20px auto 30px; padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 16px; text-align: center; width: 300px; }'
;

Echo.Product.create(SocialChatter);

})();
