(function() {

var labels = Echo.Labels;

labels.set({
	"fewMoments": "in a few moments",
	"moreYear": "more than a year",
	"defaultDateDiffDisplay": "in {diff} {period}{suffix}",
	"startDateDiffDisplay": "Will be started in {diff} {period}{suffix}",
	"endDateDiffDisplay": "Ended {diff} {period}{suffix} ago"
}, "Echo.SocialChatterEvent", true);

Echo.SocialChatterEvent = function(entry) {
	if (!entry || !entry.object) return {"data": {}};
	this.id = entry.object.id;
	this.data = this.getData(entry.object.content);
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
		when = labels.get("fewMoments", "Echo.SocialChatterEvent");
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
	"eventsList": "All Events",
	"tabGreenRoomLabel": "Green room",
	"tabPublicEventLabel": "Public event",
	"tabAllEventsLabel": "All Events"
};

SocialChatter.vars = {
	"eventById": {},
	"event": undefined
};

SocialChatter.config = {
	"eventsTargetURL": undefined,
	"eventListQuery": undefined,
	"liveUpdates": true,
	"liveUpdatesTimeout": 60, // request Events updates once per minute
	"identityManager": undefined,
	"views": {},
	"defaultEventIcon": "//cdn.echoenabled.com/clientapps/v2/social-chatter/images/vip.jpg"
};

SocialChatter.views.Main = {};

SocialChatter.views.Main.controls = {};

SocialChatter.views.EventsList = {};

SocialChatter.views.EventsList.controls = {};

SocialChatter.views.PublicEvent = {};

SocialChatter.views.PublicEvent.controls = {};

SocialChatter.views.GreenRoom = {};

SocialChatter.views.GreenRoom.controls = {};

SocialChatter.views.Main.templates = {};

SocialChatter.views.EventsList.templates = {};

SocialChatter.views.Main.templates.main =
	'<div class="{class:auth}"></div>';

SocialChatter.views.EventsList.templates.main =
	'<div class="{class:eventListContainer}">' +
		'<div class="{class:newEventButton}">' +
			'<button class="{class:eventSubmitLabel} echo-linkColor"></button>' +
		'</div>' +
		'<div class="{class:eventSubmitContainer}">' +
			'<div class="{class:eventSubmit}"></div>' +
		'</div>' +
		'<div class="{class:eventsStream}"></div>' +
	'</div>';

SocialChatter.views.EventsList.labels = {
	"scheduleEvent": "Schedule new event"
};

SocialChatter.views.GreenRoom.labels = {
	"sendToGreenRoomControl": "Send to Green Room",
	"removeFromGreenRoomControl": "Remove from Green Room"
};

SocialChatter.views.PublicEvent.labels = {
	"askQuestion": "Ask your question to",
	"answersFrom": "Answers from",
	"chatClosesIn": "VIP Chat closes in: ",
	"chatOpensIn": "<b>Live chat starts in:</b> <br><br>",
	"passedEventViewNotice": "<b>Note:</b> this event is over. You are viewing chat archive.",
	"upcomingEventWarning": "Please login to join this event.",
	"passedEventWarning": "Please login to view this chat archive.",
	"onAirEventWarning": "<b>Chat is on air now!</b> <br><br> Please login to join the conversation!",
	"sendToGreenRoomControl": "Send to Green Room",
	"removeFromGreenRoomControl": "Remove from Green Room",
	"assignVIPRoleControl": "Assign VIP role",
	"revokeVIPRoleControl": "Revoke VIP role"
};

SocialChatter.views.PublicEvent.templates = {
	"main": '<div class="{class:publicView}">' +
			'<div class="{class:publicViewNotice}"></div>' +
			'<table><tr>' +
				'<td class="{class:leftColumnTD}"><div class="{class:leftColumn}">' +
					'<div class="{class:publicSubmitLabel}">{label:askQuestion} {data:vipName}</div>' +
					'<div class="{class:publicSubmit}"></div>' +
					'<div class="{class:publicStream}"></div>' +
				'</div></td>' +
				'<td class="{class:rightColumnTD}"><div class="{class:rightColumn}">' +
					'<div class="{class:publicSubmitLabel}">{label:answersFrom} {data:vipName}</div>' +
					'<div class="{class:eventDescription}">' +
						'<div class="{class:avatar}"></div>' +
						'<div class="{class:eventDataWrapper}">' +
							'<div class="{class:title}">{data:eventName}</div>' +
							'<div class="{class:description}">{data:eventDescription}</div>' +
							'<div class="{class:countdown}"></div>' +
						'</div>' +
						'<div class="echo-clear"></div>' +
					'</div>' +
					'<div class="{class:vipStream}"></div>' +
				'</div></td>' +
			'</tr></table>' +
		'</div>',
	"upcoming": '<div class="{class:publicView} {class:publicViewUpcoming}">' +
			'<div class="{class:eventDescription}">' +
				'<div class="{class:avatar}"></div>' +
				'<div class="{class:eventDataWrapper}">' +
					'<div class="{class:title}">{data:eventName}</div>' +
					'<div class="{class:description}">{data:eventDescription}</div>' +
					'<div class="{class:countdown}"></div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>',
	"anonymous": '<div class="{class:publicView} {class:publicViewAnonymous}">' +
			'<div class="{class:loginWarning}"></div>' +
			'<div class="{class:eventDescription}">' +
				'<div class="{class:avatar}"></div>' +
				'<div class="{class:eventDataWrapper}">' +
					'<div class="{class:title}">{data:eventName}</div>' +
					'<div class="{class:description}">{data:eventDescription}</div>' +
					'<div class="{class:countdown}"></div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>'
};

SocialChatter.views.PublicEvent.methods = {};

SocialChatter.views.GreenRoom.methods = {};

SocialChatter.views.PublicEvent.methods.template = function() {
	var event = this.config.get("event");
	var status = event && event.getEventStatus();
	return this._manifest("templates")[this.user && this.user.is("logged")
		? (status && status !== "upcoming" ? "main" : "upcoming")
		: "anonymous"];
};

SocialChatter.views.GreenRoom.templates = {};

SocialChatter.views.GreenRoom.templates.main =
	'<div>' +
		'<div class="{class:vipInstructions}"></div>' +
		'<div class="{class:vipStream}"></div>' +
	'</div>'
;

(function() {
	var plugins = {
		"MetadataManager": {
			"name": "MetadataManager",
			"controls": [{
				"marker": "greenroom",
				"labelMark": "{label:sendToGreenRoomControl}",
				"labelUnmark": "{label:removeFromGreenRoomControl}"
			}],
			"enabled": "{self:_isNonVIPUser}"
		},
		"ItemConditionalCSSClasses": {
			"name": "ItemConditionalCSSClasses",
			"conditions": [{
				"field": "actor.roles",
				"value": ["vip"],
				"className": "{class:vip-guest}"
			}]
		},
		"UserMetadataManager": {
			"name": "UserMetadataManager",
			"controls": [{
				// we need "moderator" role for VIP as well
				// since we need to apply markers to some items
				"roles": "vip,moderator",
				"labelSet": "{label:assignVIPRoleControl}",
				"labelUnset": "{label:revokeVIPRoleControl}"
			}],
			"enabled": "{self:_isNonVIPUser}"
		}
	};

	SocialChatter.views.GreenRoom.controls.Stream = {
		"control": "Echo.StreamServer.Controls.Stream",
		"config": {
			"appkey": null,
			"query": "childrenof:{config:event.id}/* state:Untouched,ModeratorApproved markers:greenroom -markers:answered children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
			"reTag": false,
			"plugins": [{
				"name": "Reply",
				"itemURIPattern": "{config:event.id}/{id}",
				"nestedPlugins": [{
					"name": "SubmitTextareaAutoResize"
				}]
			}, {
				"name": "VipReplies",
				"copyTo": {
					"target": "{config:event.id}"
				},
				"view": "private"
			}, plugins.MetadataManager]
		}
	};

	SocialChatter.views.PublicEvent.controls.Stream = {
		"control": "Echo.StreamServer.Controls.Stream",
		"config": {
			"appkey": null,
			"query": "childrenof:{config:event.id} state:Untouched,ModeratorApproved safeHTML:off user.state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
			"item": {
				"reTag": false
			},
			"liveUpdatesTimeout": 60,
			"plugins": [{
				"name": "Reply",
				"itemURIPattern": "{config:event.id}/{id}",
				"nestedPlugins": [{
					"name": "SubmitTextareaAutoResize"
				}]
			}, {
				"name": "Like"
			}, {
				"name": "Moderation",
				"userActions": [],
				"enabled": "{self:_isNonVIPUser}"
			}, {
				"name": "VipReplies",
				"copyTo": {
					"target": "{config:event.id}"
				},
				"view": "private"
			},
			plugins.ItemConditionalCSSClasses,
			plugins.MetadataManager,
			plugins.UserMetadataManager]
		}
	};

	SocialChatter.views.PublicEvent.controls.Submit = {
		"control": "Echo.StreamServer.Controls.Submit",
		"config": {
			"appkey": null,
			"targetURL": "{config:event.id}",
			"itemURIPattern": "{config:event.id}/{id}",
			"actionString": "Type your question here...",
			"plugins": [{
				"name": "SubmitTextareaAutoResize"
			}, {
				"name": "SubmitCountdownEvent",
				"eventEnd": "{config:event.data.eventEnd}",
				"enabled": "{config:event.isOnAir}"
			}]
		}
	};

	SocialChatter.views.PublicEvent.controls.VIPStream = {
		"control": "Echo.StreamServer.Controls.Stream",
		"config": {
			"appkey": null,
			"query": "childrenof:{config:event.id} state:Untouched,ModeratorApproved safeHTML:off user.roles:vip user.state:Untouched,ModeratorApproved children:1 state:Untouched,ModeratorApproved user.state:Untouched,ModeratorApproved",
			"item": {
				"reTag": false
			},
			"plugins": [{
				"name": "Reply",
				"itemURIPattern": "{config:event.id}/{id}",
				"nestedPlugins": [{
					"name": "SubmitTextareaAutoResize"
				}]
			}, {
				"name": "Like"
			}, {
				"name": "Moderation",
				"userActions": [],
				"enabled": "{self:_isNonVIPUser}"
			}, {
				"name": "VipReplies"
			},
			plugins.ItemConditionalCSSClasses]
		}
	};

})();

SocialChatter.views.Main.controls.Auth = {
	"control": "Echo.IdentityServer.Controls.Auth",
	"config": {
		"appkey": null,
		"identityManager": "{config:identityManager}"
	}
};

SocialChatter.views.PublicEvent.methods._isNonVIPUser = SocialChatter.views.GreenRoom.methods._isNonVIPUser = function() {
	return !this.user.any("roles", ["vip"]);
};

SocialChatter.views.EventsList.renderers = {};

SocialChatter.views.PublicEvent.renderers = {};

SocialChatter.views.PublicEvent.renderers.loginWarning = function(element) {
	return element.html('<span>' + this.labels.get(this.config.get("event").getEventStatus() + "EventWarning") + '</span>');
};

SocialChatter.views.PublicEvent.renderers.publicViewNotice = function(element) {
	var status = this.config.get("event").getEventStatus();
	if (status == "passed") {
		return element.html('<span>' + this.labels.get("passedEventViewNotice") + '</span>');
	}
	return element.hide();
};

SocialChatter.views.PublicEvent.renderers.avatar = function(element) {
	var self = this;
	var url = this.data.vipPhoto || this.config.get("parent.defaultEventIcon");
	var img = $("<img>", {"src": url});
	if (url != this.config.get("parent.defaultEventIcon")) {
		img.one({
			"error" : function(){
				$(this).attr("src", self.config.get("parent.defaultEventIcon"));
			}
		});
	}
	return element.append(img);
};

SocialChatter.views.PublicEvent.renderers.countdown = function(element) {
	var self = this;
	element.hide();
	var status = this.config.get("event").getEventStatus();
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
	return element.css("display", "block")
		.countdown(new Date(this.data[isUpcomingEvent ? "eventStart" : "eventEnd"]), {
			"prefix": this.labels.get(isUpcomingEvent ? "chatOpensIn" : "chatClosesIn"),
			"finish": finishHandler
		});
};

SocialChatter.views.EventsList.renderers.eventSubmitLabel = function(element) {
	var self = this;
	if (this.user.is("admin") && !this.user.any("role", ["vip"])) {
		new Echo.Button(element, {
			"label": this.labels.get("scheduleEvent")
		});
		element.addClass("btn btn-small").click(function() {
			self.dom.get("eventSubmitContainer").slideToggle();
		});
	} else {
		element.detach();
	}
	return element;
};

SocialChatter.views.EventsList.controls.Submit = {
	"control": "Echo.StreamServer.Controls.Submit",
	"config": {
		"appkey": null,
		"targetURL": "{config:parent.eventsTargetURL}",
		"itemURIPattern": "{config:parent.eventsTargetURL}/{id}",
		"plugins": [{
			"name": "SocialChatterEvent"
		}]
	}
};

SocialChatter.views.EventsList.controls.Stream = {
	"control": "Echo.StreamServer.Controls.Stream",
	"config": {
		"appkey": null,
		"query": "childrenof:{config:parent.eventsTargetURL} state:Untouched,ModeratorApproved children:0",
		"liveUpdatesTimeout": "{config:parent.liveUpdatesTimeout}",
		"item": {
			"reTag": false
		},
		"itemControlsOrder": ["SocialChatterEvent", "Edit", "Curation.Delete"],
		"plugins": [{
			"name": "SocialChatterEvent"
		}, {
			"name": "Edit",
			"layout": "inline",
			"nestedPlugins": [{"name": "SocialChatterEvent"}]
		}, {
			"name": "Moderation",
			"userActions": [],
			"itemActions": ["delete"]
		}]
	}
};

SocialChatter.templates.main = 
	'<div class="{class:container} echo-primaryFont echo-primaryBackgroundColor">' +
		'<div class="{class:authContainer}">' +
		'</div>' +
		'<div class="{class:tabsContainer}">' +
			'<ul class="{class:tabs} nav nav-tabs">' +
				'<li><a data-toggle="tab" href="#EventsList">{label:eventsList}</a></li>' +
			'</ul>' +
			'<div class="{class:tabPanels} tab-content">' +
				'<div class="{class:EventsList} tab-pane" id="EventsList"></div>' +
			'</div>' +
		'</div>' +
	'</div>';

SocialChatter.assemblers = {};

SocialChatter.renderers.authContainer = function(element) {
	this._assembler("Auth", element);
	return element;
};

SocialChatter.renderers.tabs = function(element) {
	var self = this;
	var tabs = this.tabs = new Echo.Tabs(element, {
		"panels": this.dom.get("tabPanels"),
		"show": function(e) {
			var selector = $(e.target).attr("href");
			var id = selector.replace(/^#/, "");
			var panel = self.dom.get(id) || $(selector, self.dom.get("tabPanels"));
			if (!self.views[id]) {
				self._assembler(id, panel);
			}
		}
	});
	if (this.event) {
		var data = this.event.data;
		tabs.add({
			"id": "PublicEvent",
			"label": data.eventName || this.labels.get("tabPublicEventLabel")
		}, $(this.substitute('<div class="{class:{data:name}} tab-pane" id="{data:name}"></div>', {"name": "PublicEvent"})));
	}
	if (this.event && this._hasGreenRoomAccess()) {
		tabs.add({
			"id": "GreenRoom",
			"label": this.labels.get("tabGreenRoomLabel")
		}, $(this.substitute('<div class="{class:{data:name}} tab-pane" id="{data:name}"></div>', {"name": "GreenRoom"})));
	}
	tabs.show("EventsList");
	this.dom.get("EventsList").addClass("active");
	return element;
};

SocialChatter.methods._initSocialChatterEvents = function(entries) {
	var self = this;
	$.each(entries, function(id, entry) {
		self.eventById[entry.object.id] =
			new Echo.SocialChatterEvent(entry);
	});
};

SocialChatter.methods._setPublicEvent = function(event) {
	this.data = this.data || {};
	this.event = this.data.event = event;
	if (this.event) {
		this.event.isOnAir = this.event.onAir();
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
	if (this.tabs && !this.tabs.has(config.name)) {
		this.tabs.add({
			"id": config.name,
			"label": config.name == "PublicEvent"
				? this.event.data.eventName || this.labels.get("tabPublicEventLabel")
				: this.labels.get("tabGreenRoomLabel")
		}, $(this.substitute('<div class="{class:{data:name}} tab-pane" id="{data:name}"></div>', config)));
	}
	var tabsDomContainer = this.dom.get("tabPanels");
	config.target = config.target || $("#" + config.name, tabsDomContainer);
	if (this._manifest("assemblers")[config.name]) {
		$(config.target).empty();
		this._assembler(config.name, config.target);
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

SocialChatter.methods._pickRelevantEvent = function() {
	// we need to pick one most relevant event:
	//  - look for event which is on air right now
	//  - otherwise grab first upcoming event
	//  - if there are no upcoming or on air events - return undefined
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

SocialChatter.methods._assembler = function(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	return this._manifest("assemblers")[name].apply(this, args);
};

SocialChatter.assemblers.Auth = function(target) {
	if (!this.config.get("identityManager")) {
		target.hide();
		return;
	}
	var view = this.initView("Main", {
		"user": this.user,
		"target": target,
		"type": "eventsList"
	});
	view._initControl({
		"name": "Auth"
	}, {
		"target": view.dom.get("auth")
	});
};

SocialChatter.assemblers.EventsList = function(target) {
	var self = this;
	var view = this.initView("EventsList", {
		"user": this.user,
		"event": this.event,
		"target": target,
		"type": "eventsList"
	});
	if (this.user.is("admin")) {
		var submit = view._initControl({
			"name": "Submit"
		}, {
			"target": view.dom.get("eventSubmit")
		});
		/*submit.events.subscribe("Echo.StreamServer.Controls.Submit.onPostComplete", function(topic, args) {
			view.dom.get("eventSubmitContainer").slideUp();
		});*/
	}
	var stream = view._initControl({
		"name": "Stream"
	}, {
		"target": view.dom.get("eventsStream")
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onReceive",
		"handler": function(topic, args) {
			var entry = args.item.data;
			var event = new Echo.SocialChatterEvent(entry);
			var status = event.getEventStatus();
			self.eventById[entry.object.id] = event;
			if ((self.event && self.event.id == event.id) ||
				(!self.event && (status == "onAir" || status == "upcoming"
))) {
				self._setPublicEvent(self._pickRelevantEvent());
				self._updateTabs();
			}
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.Item.onDelete",
		"handler": function(topic, data) {
			var item = data.item;
			var id = item.get("data.object.id");
			delete self.eventById[id];
			// refresh if current event was removed
			if (self.event && self.event.id === id) {
				delete self.event;
				self._setPublicEvent(self._pickRelevantEvent());
				self._updateTabs();
			}
		}
	});
	stream.events.subscribe({
		"topic": "Echo.StreamServer.Controls.Stream.onDataReceive",
		"handler": function(topic, data) {
			self._initSocialChatterEvents(data.entries);
			self._setPublicEvent(self._pickRelevantEvent());
			self._updateTabs();
		}
	});
};


SocialChatter.assemblers.PublicEvent = function(target) {
	var self = this;
	var data = this.event.data;
	var pluginEnabled = !(this.event && this.event.getEventStatus() == "passed");
	var view = this.initView("PublicEvent", {
		"user": this.user,
		"data": data,
		"event": this.event,
		"target": target,
		"type": "event"
	});

	// setting tab title
	this.tabs.get("PublicEvent").html(data.eventName || "Unknown Event");

	if (!this.user.is("logged") || this.event.getEventStatus() == "upcoming") return;

	if (this.event.onAir()) 
		view._initControl({
			"name": "Submit"
		}, {
			"target": view.dom.get("publicSubmit")
		});
	view._initControl({
		"name": "Stream"
	}, {
		"target": view.dom.get("publicStream"),
		"plugins": view._updateControlPlugins(
			this._manifest("views").PublicEvent.controls.Stream.config.plugins,
			[{
				"name": "Reply",
				"enabled": pluginEnabled
			}, {
				"name": "Like",
				"enabled": pluginEnabled
			}]
		)
	});
	view._initControl({
		"name": "VIPStream"
	}, {
		"target": view.dom.get("vipStream"),
		"plugins": view._updateControlPlugins(
			this._manifest("views").PublicEvent.controls.VIPStream.config.plugins,
			[{
				"name": "Reply",
				"enabled": pluginEnabled
			}, {
				"name": "Like",
				"enabled": pluginEnabled
			}]
		)
	});
};

SocialChatter.assemblers.GreenRoom = function(target) {
	var view = this.initView("GreenRoom", {
		"user": this.user,
		"event": this.event,
		"target": target,
		"type": "greenRoom"
	});
	view._initControl({
		"name": "Stream"
	}, {
		"target": view.dom.get("vipStream")
	});
	var instrustionsContainer = view.dom.get("vipInstructions");
	if (!this.event || !this.event.data || !this.event.data.vipInstructions) {
		instrustionsContainer.hide();
	} else {
		instrustionsContainer.html(this.event.data.vipInstructions).show();
	}
};

SocialChatter.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.SocialChatterEvent.onBeforeEventOpen": function(topic, args) {
		var entry = args.event;
		this._setPublicEvent(new Echo.SocialChatterEvent(entry));
		this._updateTabs();
		this.tabs.show("PublicEvent");
	}
};

Echo.Utils.foldl(SocialChatter.events, ["Echo.Products.SocialChatter.onEventStart", "Echo.Products.SocialChatter.onEventEnd"], function(topic, acc) {
	acc[topic] = function() {
		self._updateTabs();
	};
});

SocialChatter.views.EventsList.css =
	'.{class:newEventButton} .echo-sdk-button .ui-state-default { width: auto; padding: 3px 15px; }' +
	'.{class:newEventButton} .echo-button-v3 .ui-state-default, .echo-streamserver-controls-submit-controls .echo-button-v3 .ui-state-default {background: -webkit-gradient(linear, left top, left bottom, from(white), to(#EDEDED)); background: -moz-linear-gradient(top, white, #EDEDED); text-shadow: 0 1px 1px rgba(0, 0, 0, .3); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2); -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); width: 100px;}' +
	'.{class:eventListContainer} { margin-left: 15px; margin-right: 15px; }' +
	'.{class:eventListContainer} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:eventSubmitContainer} { display: none; }' +
	'.{class:eventsStream} { margin-top: 15px; }' +
	'.{class:eventsStream} .echo-streamserver-controls-stream-header { display: none; }' +
	'.{class:eventSubmitLabel} { margin-top: 10px; cursor: pointer; font-weight: bold; font-size: 16px; }' +
	'.{class:eventSubmitLabel} div.echo-label { font-size: 12px; }' +
	'.{class:eventSubmit} .echo-streamserver-controls-submit-postContainer { float: left; margin-left: 7px; }' +
	'.{class:eventSubmit} .echo-streamserver-controls-submit-content { border: none; }' +
	'.{class:eventSubmit} { margin: 10px auto; padding: 10px; width: 550px; }' +
	'.{class:eventSubmitContainer} { border-radius: 7px; border: 1px solid #D3D3D3; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); margin: 10px 0px; }'
;

SocialChatter.views.PublicEvent.css =
	'.{class:publicStream}, .{class:vipStream} { margin-top: 15px; }' +
	'.{class:vipStream} { margin-bottom: 20px; }' +
	'.{class:leftColumn} { margin: 5px 25px 0px 10px; }' +
	'.{class:leftColumnTD} { width: 40%; vertical-align: top; }' +
	'.{class:rightColumnTD} { width: 60%; vertical-align: top; }' +
	'.{class:rightColumn} { margin: 0 10px; border: 1px solid #D3D3D3; padding: 15px 10px 15px 20px; border-radius: 4px; -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2); -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); }' +
	'.{class:publicSubmitLabel} { font-weight: bold; font-size: 16px; margin-bottom: 10px; }' +
	'.{class:publicSubmit} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:eventSubmit} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:publicStream} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:vipStream} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:vipStream} textarea.echo-streamserver-controls-submit-text { height: 36px; }' +
	'.{class:publicStream} textarea.echo-streamserver-controls-submit-text { height: 36px; }' +
	'.{class:publicSubmit} textarea.echo-streamserver-controls-submit-text { height: 36px; }' +
	'.{class:vipStream} .echo-streamserver-controls-stream-header { display: none; }' +
	'.{class:publicStream} .echo-streamserver-controls-stream-header { display: none; }' +
	'.{class:publicSubmit} .echo-streamserver-controls-submit-text { height: 55px; }' +
	'.{class:publicView} { margin-top: 5px; }' +
	'.{class:publicView} table { width: 100%; }' +
	'.{class:eventDescription} .{class:avatar} { float: left; width: 100px; margin-right:-110px; margin-top: 2px; }' +
	'.{class:eventDescription} .{class:avatar} img { width: 100px; }' +
	'.{class:eventDescription} .{class:title} { margin-left: 115px; font-size: 20px; line-height: 20px; font-weight: bold; }' +
	'.{class:eventDescription} .{class:description}, .{class:eventDescription} .startEvent, .{class:eventDescription} .{class:countdown} { margin-left: 115px; font-size: 14px; margin-top: 10px; }' +
	'.{class:publicViewUpcoming} .{class:eventDescription}, .{class:publicViewAnonymous} .{class:eventDescription} { max-width: 400px; margin: 20px auto; }' +
	'.{class:publicViewUpcoming} { margin-top: 35px; }' +
	'.{class:countdown}, .{class:publicViewNotice} { background-color: #D9EDF7; border: 1px solid #BCE8F1; border-radius: 4px 4px 4px 4px; color: #3A87AD;  margin: 20px auto 30px; padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 16px; text-align: center; }' +
	'.{class:countdown} { display: none; }' +
	'.{class:publicViewNotice} { width: 450px; }' +
	'.{class:publicViewNotice} { margin-top: 0px; margin-bottom: 10px; }' +
	'.{class:publicViewAnonymous} .{class:loginWarning} { background-color: #F2DEDE; border: 1px solid #EED3D7; border-radius: 4px 4px 4px 4px; color: #B94A48;  margin: 20px auto 30px; padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 16px; text-align: center; width: 300px; }'
;

SocialChatter.views.GreenRoom.css =
	'.{class:vipInstructions} { line-height: 20px; margin-top: 10px; background-color: #D9EDF7; border: 1px solid #BCE8F1; border-radius: 4px 4px 4px 4px; color: #3A87AD;  margin: 20px auto 30px; padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 16px; text-align: center; }' +
	'.{class:vipStream} .echo-streamserver-controls-submit-userInfoWrapper { display: none; }' +
	'.{class:vipStream} textarea.echo-streamserver-controls-submit-text { height: 36px; }' +
	'.{class:vipStream} .echo-streamserver-controls-stream-header { display: none; }'
;

SocialChatter.views.Main.css =
	'.{class:auth} { float: right; }' +
	'.{class:auth} .echo-identityserver-controls-auth-avatar, .{class:auth} .echo-identityserver-controls-auth-logout { height: 24px; line-height: 24px; margin: 0px;}' +
	'.{class:auth} .echo-identityserver-controls-auth-name { line-height: 23px; font-size: 14px; margin: 0px 20px 0px 0px; }' +
	'.{class:auth} .echo-identityserver-controls-auth-edit { height: 24px; line-height: 24px; margin: 0px 5px 0px 0px; }'
;

SocialChatter.css =
	'.echo-ui .echo-tabs-header li.ui-state-default { background-color: #E6E6E6; }' +
	'.echo-ui .echo-tabs-header li.ui-state-active { background-color: #FFFFFF; }' +
	// fancy buttons
	'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-nav li { border: 1px solid #DDDDDD; border-bottom: none; }' +
	'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-nav li a { padding: 7px 15px 5px 15px; font-size: 16px; }' +
	'.echo-ui .echo-socialchatter-tabs .ui-tabs .ui-tabs-panel { border-radius: 0px; border-left: 1px solid #DDDDDD; border-bottom: 1px solid #DDDDDD; border-right: 1px solid #DDDDDD; }' +
	'.echo-ui .echo-socialchatter-tabs .echo-tabs-header { border-bottom: 1px solid #DDDDDD; }' +
	'.echo-app-message { border: none; }' +
	'.{class:container} .echo-streamserver-controls-submit-markersContainer, .{class:container} .echo-streamserver-controls-submit-tagsContainer, .{class:container} .echo-streamserver-controls-stream-item-modeSwitch { display: none !important; }' +
	'.{class:tabs} a { font-size: 16px; font-weight: bold; outline: none; }' +
	'.{class:tabs}.nav.nav-tabs .active a { background-color: #F5F4EE; outline: none; }'
;

Echo.Product.create(SocialChatter);

})();
