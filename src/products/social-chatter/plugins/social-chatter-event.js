(function($) {

var plugin = Echo.Plugin.manifest("SocialChatterItemEvent", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.config = {
	"dateFormat": "yy-mm-dd",
	"timeFormat": "hh:mm tt",
	"ampm": true
};

plugin.init = function() {
	this.component.config.get("target").addClass(this.cssPrefix + "SocialChatterEvent");
	this.event = new Echo.SocialChatterEvent(this.component.get("data.object.content"));
	this.extendTemplate("insertAfter", "authorName", this._template);
	this.component.addButtonSpec("ViewFullEvent", this._assembleButton());
};

/*var plugin = Echo.createPlugin({
	"name": "SocialChatterEvent",
	"applications": ["Stream", "Submit"],
	"dependencies": [{
		"url": "//cdn.echoenabled.com/clientapps/v2/submit.js",
		"application": "Submit"
	}, {
		"url": "//cdn.echoenabled.com/clientapps/v2/social-chatter/datepicker/jquery-ui-1.8.18.custom.min.js",
		"loaded": function() { return !!$.datepicker; }
	}, {
		"url": "//cdn.echoenabled.com/clientapps/v2/social-chatter/datepicker/jquery-ui-timepicker-addon.js",
		"loaded": function() { return !!$.datepicker && !!$.timepicker; }
	}],
	"init": function(plugin, application) {
		if (!plugin.config.get(application, "dateFormat")) {
			plugin.config.set(application, "dateFormat", "yy-mm-dd");
		}
		if (!plugin.config.get(application, "timeFormat")) {
			plugin.config.set(application, "timeFormat", "hh:mm tt");
		}
		if (!plugin.config.get(application, "ampm")) {
			plugin.config.set(application, "ampm", true);
		}
		if (application instanceof Echo.Submit) {
			$(application.config.get("target"))
				.addClass("echo-submit-plugin-SocialChatterEvent");
			plugin.extendTemplate("Submit", plugin.template["Submit.AdminNotice"],
				"insertAfter", "echo-submit-header");
			plugin.extendTemplate("Submit", plugin.template["Submit.Metadata"],
				"insertAfter", "echo-submit-text");
			plugin.extendTemplate("Submit", plugin.template["Submit.EventIcon"],
				"insertBefore", "echo-submit-body");
			$.each(plugin.renderers.Submit, function(name, renderer) {
				plugin.extendRenderer("Submit", name, renderer);
			});
			plugin.listenSubmitEvents(application);
			plugin.postAction(application);
		}
		if (application instanceof Echo.Stream) {
			$(application.config.get("target"))
				.addClass("echo-stream-plugin-SocialChatterEvent");
			plugin.extendTemplate("Item", plugin.template.Item,
				"insertAfter", "{plugin.class:authorName}");
			$.each(plugin.renderers.Item, function(name, renderer) {
				plugin.extendRenderer("Item", name, renderer);
			});
			plugin.addItemControl(application, plugin.assembleControl(application));
			plugin.listenStreamEvents(application);
		}
		plugin.addCss(plugin.css);
	}
});*/

plugin.labels = {
	"unknown": "Unknown",
	"notProvided": "Not provided",
	"errorLoadingImageURL": "Error loading image URL",
	"eventTitle": "Event title",
	"VIPGuestName": "VIP guest name",
	"photoURL": "VIP/Event photo URL",
	"eventNameHint": "Type event name",
	"vipNameHint": "Type vip name",
	"vipPhotoHint": "Type vip photo url",
	"vipInstructionsHint": "Type instructions for your VIP guest. Instructions will be displayed as a note in the \"Green Room\" tab",
	"eventDescriptionHint": "Type event description",
	"eventStartHint": "Type event start date",
	"eventEndHint": "Type event end date",
	"changeEventIcon": "change icon",
	"onAirEventOpen": "View Current Session",
	"upcomingEventOpen": "View this Upcoming Chat",
	"passedEventOpen": "View this Chat Archive",
	"eventName": "<b>Event title</b>",
	"eventStatus": "<b>Event status</b>",
	"upcoming": "upcoming event",
	"onAir": "<span class=\"echo-event-onair-label\">on air now!</span>",
	"passed": "passed event",
	"vipName": "<b>VIP guest name</b>",
	"vipInstructions": "<b>Instructions for VIP guest <small>(for Green Room tab)</small></b>",
	"eventDescription": "<b>Event description</b>",
	"eventDuration": "<b>Event duration</b>",
	"eventStart": "<b>Start date and time</b> <small>(in your timezone)</small>",
	"eventEnd": "<b>End date and time</b> <small>(in your timezone)</small>",
	"createdBy": "<b>Created by</b>",
	"creationDate": "<b>Creation date</b>",
	"viewFullEvent": "Show event details",
	"viewDefaultEvent": "Hide event details",
	"eventSubmitNotice": "<b>Notes for administrators:</b> <div style=\"text-align: left; padding-left: 40px;\"><div style=\"margin: 10px 0 10px 0;\">1. fields marked with <span class=\"echo-submit-event-field-mandatory\">*</span> are mandatory</div><div style=\"margin-bottom: 10px;\">2. there might be multiple instances of passed and upcoming events, but only <b>one on air</b> event at a time. Please make sure that there are no time overlaps in events scheduling. Learn more about the Social Chatter application <a href='http://wiki.aboutecho.com/Echo%20Application%20-%20Echo%20Social%20Chatter' target='_blank'>here</a>.</div></ul>"
};

plugin.templates = {
	"Submit.AdminNotice":
		'<div class="echo-submit-eventSubmitNotice"></div>',
	"Submit.EventIcon":
		'<div class="echo-submit-eventIconContainer">' +
			'<img class="echo-submit-eventIcon" src="//cdn.echoenabled.com/clientapps/v2/social-chatter/images/vip.jpg">' +
			'<div class="echo-submit-eventIconError">{label:errorLoadingImage}</div>' +
			'<div class="echo-submit-changeEventIcon echo-linkColor echo-clickable"></div>' +
		'</div>',
	"Submit.Metadata":
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:eventTitle} <span class="echo-submit-event-field-mandatory">*</span></div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<input type="text" class="echo-submit-eventName echo-submit-text-input echo-primaryFont">' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:VIPGuestName} <span class="echo-submit-event-field-mandatory">*</span></div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<input type="text" class="echo-submit-vipName echo-submit-text-input echo-primaryFont">' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:photoURL}</div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<input type="text" class="echo-submit-vipPhoto echo-submit-text-input echo-primaryFont">' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:eventStart} <span class="echo-submit-event-field-mandatory">*</span></div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<input type="text" class="echo-submit-eventStart echo-submit-text-input echo-primaryFont">' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:eventEnd} <span class="echo-submit-event-field-mandatory">*</span></div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<input type="text" class="echo-submit-eventEnd echo-submit-text-input echo-primaryFont">' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:eventDescription}</div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<textarea class="echo-submit-eventDescription echo-submit-text-area echo-primaryFont"></textarea>' +
			'</div>' +
		'</div>' +
		'<div class="echo-submit-metadata-container">' +
			'<div class="echo-submit-field-title">{label:vipInstructions}</div>' +
			'<div class="echo-submit-event-inputContainer echo-submit-border">' +
				'<textarea class="echo-submit-vipInstructions echo-submit-text-area echo-primaryFont"></textarea>' +
			'</div>' +
		'</div>',
	"EventDefault": '<div class="{plugin.class:eventContainer}">' +
		'<div class="{plugin.class:eventDefault}">' +
			'<div class="{plugin.class:eventNameDefault}"></div>' +
			'<div class="{plugin.class:eventDescriptionDefault}"></div>' +
			'<div class="{plugin.class:eventStatus}"></div>' +
			'<div class="{plugin.class:eventButtonContainer}">' +
				'<button class="{plugin.class:eventButton}"></button>' +
			'</div>' +
		'</div>' +
	'</div>',
	"EventFull": '<div class="{plugin.class:eventContainer}">' +
		'<div class="{plugin.class:event}">' +
			'<div class="{plugin.class:eventInfo}">' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventName}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventStatus}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:vipName}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventDescription}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventDuration}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventStart}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventEnd}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventCreatedBy}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:eventCreationDate}"></span>' +
				'</div>' +
				'<div class="{plugin.class:eventItem}">' +
					'<span class="{plugin.class:vipInstructions}"></span>' +
				'</div>' +
			'</div>' +
			'<div class="{plugin.class:eventButtonContainer}">' +
				'<button class="{plugin.class:eventButton}"></button>' +
			'</div>' +
		'</div>' +
	'</div>'
};

plugin.methods._template = function() {
	var type = this.get("eventTemplate.type", "default");
	return type === "default"
		? plugin.templates["EventDefault"]
		: plugin.templates["EventFull"];
};

plugin.fields = ["eventName", "vipName", "vipInstructions", "vipPhoto", "eventDescription", "eventStart", "eventEnd"];

plugin.mandatoryFields = ["eventName", "vipName", "eventStart", "eventEnd"];

Echo.Utils.foldl(plugin.renderers, ["eventName", "vipName", "eventStart", "eventEnd", "eventDescription"], function(info, acc) {
	acc[info] = function(element) {
		var event = this.event;
		if (info == "eventStart" || info == "eventEnd") {
			element.html(this.labels.get(info) + ": " + this._getFullDate(event.data[info]));
		} else {
			var prefix = this.labels.get(info) !== info
				? this.labels.get(info) + ": "
				: "";
			element.html(prefix + (event.data[info] || this.labels.get("unknown")));
		}
		return element;
	};
});

plugin.renderers.eventStatus = function(element) {
	var event = this.event;
	var status = event.getEventStatus();
	var content = this.labels.get("eventStatus") + ": " + this.labels.get(status);
	var extra;
	if (status == "upcoming") {
		extra = event.calcAnotherStartEvent();
	} else if (status == "passed") {
		extra = event.calcEndEvent();
	}
	if (extra)
		content += ". " + extra + ".";
	return element.html(content);
};

plugin.renderers.eventDuration = function(element) {
	var duration = this.event.getEventDuration();
	return element.html(this.labels.get("eventDuration") + ": " + this.event.displayDateDiff(duration, function(diff, period) {
		return diff + " " + period + (diff == 1 ? "" : "s");
	}));
};

plugin.renderers.eventCreatedBy = function(element) {
	return element.html(this.labels.get("createdBy") + ": " + this.component.get("data.actor.title"));	
};

plugin.renderers.eventNameDefault = function(element) {
	return element.html(this.event.data.eventName || this.labels.get("unknown"));
};

plugin.renderers.eventDescriptionDefault = function(element) {
	return element.html(this.event.data.eventName || this.labels.get("unknown"));
};

plugin.renderers.eventCreationDate = function(element) {
	this.component.calcAge();
	return element.html(plugin.label("creationDate") + ": " + this.component.get("age"));	
};

plugin.renderers.vipInstructions = function(element) {
	return element.html(plugin.label("vipInstructions") + ": " + (this.event.data.vipInstructions || plugin.label("notProvided")));
};

plugin.renderers.eventButton = function(element) {
	if ($.isEmptyObject(this.event)) {
		return element.detach();
	}
	new Echo.Button(element, {
		"label": this.labels.get(this.event.getEventStatus() + "EventOpen")
	});
	return element.click(function() {
		plugin.events.publish("SocialChatter.onBeforeEventOpen", {
			"event": self.component.get("data")
		});
	});
};

/*plugin.renderers.eventContainer = function(element) {
	var application = this;
	if (!plugin.get(this, "eventTemplate.type")) {
		plugin.set(this, "eventTemplate.type", "default");
	}
	var type = plugin.get(this, "eventTemplate.type");
	var template = type == "default"
		? plugin.template["Item.EventDefault"]
		: plugin.template["Item.EventFull"];
	var event = new Echo.SocialChatterEvent(application.data.object.content);
	renderers = $.extend(renderers, {
		"eventStatus": function(element) {
			
		},
		"eventDuration": function(element) {
			
		},
		"eventCreatedBy": function(element) {
		},
		"eventNameDefault": function(element) {
		},
		"eventDescriptionDefault": function(element) {
		},
		"eventCreationDate": function(element) {
		},
		"vipInstructions": function(element) {
		},
		"eventButton": function(element) {
			
		}
	});
	var dom = $.toDOM(this.substitute(template), "echo-item-", renderers);
	element.empty().append(dom.content);
};*/

/*plugin.renderers.Submit.changeEventIcon = function(element) {
	var self = this;
	element.text(plugin.label("changeEventIcon"));
	element.click(function() {
		self.dom.get("vipPhoto").focus().select();
	});
};

plugin.renderers.Submit.text = function(element) {
	var event = new Echo.SocialChatterEvent(this.config.get("data.object.content"));
	if ($.isEmptyObject(event)) {
		return this.parentRenderer("text", arguments);
	}
	// we need to put some value into textarea
	// to satisfy submission code requirements,
	// this calue would be re-written by the plugin later
	element.val(".").detach();
};

plugin.renderers.Submit.eventInfo = function(element, dom, extra) {
	extra = extra || {};
	var type = extra.type;
	var event = new Echo.SocialChatterEvent(this.config.get("data.object.content"));
	var value = event.data && event.data[type] && (type == "eventStart" || type == "eventEnd")
		? plugin.getFullDate(this, event.data[type])
		: event.data[type] || "";
	if (!$.isEmptyObject(event)) {
		dom.get(type)
			.iHint({
				"text": plugin.label(type + "Hint"),
				"className": "echo-secondaryColor"
			})
			.val($.trim($.stripTags(value || "")))
			.blur();
	} else {
		dom.get(type).detach();
	}
};

plugin.renderers.Submit.eventSubmitNotice = function(element) {
	element.html('<span>' + plugin.label("eventSubmitNotice") + '</span>');
};

$.each(["eventStart", "eventEnd"], function(i, info) {
	plugin.renderers.Submit[info] = function(element, dom) {
		var self = this;
		this.render("eventInfo", element, dom, {"type": info});
		var datepicker = $("#ui-datepicker-div");
		var event = new Echo.SocialChatterEvent(this.config.get("data.object.content"));
		if (event.data[info]) {
			plugin.set(this, "eventsTimestamp." + info, event.data[info]);
		}
		var datetimepickerConfig = {
			"ampm": plugin.config.get(this, "ampm"),
			"dateFormat": plugin.config.get(this, "dateFormat"),
			"timeFormat": plugin.config.get(this, "timeFormat"),
			"onSelect": function() {
				plugin.set(self, "eventsTimestamp." + info, element.datetimepicker("getDate").getTime());
			},
			"onClose": function(date) {
				var element = info == "eventStart"
					? dom.get("eventEnd")
					: dom.get("eventStart");
				if (element.val()) {
					var startDate = plugin.get(self, "eventsTimestamp.eventStart");
					var endDate = plugin.get(self, "eventsTimestamp.eventEnd");
					if (startDate > endDate) {
						element.val(date);
					}
				} else {
					element.val(date);
				}
			}
		};
		element.datetimepicker(datetimepickerConfig)
		.keydown(function(e) {
			var code = e.keyCode || e.which;
			if (code ^ 9 && code ^ 13)
				return false;
		});
		!datepicker.parents(".datepicker-ui").length && datepicker.wrap('<div class="datepicker-ui"></div>');
	};
});

$.each(plugin.fields, function(i, info) {
	plugin.renderers.Submit[info] = plugin.renderers.Submit[info] || function(element, dom) {
		var self = this;
		this.render("eventInfo", element, dom, {"type": info});
		// exclusion for "vipPhoto" element name
		if (info == "vipPhoto") {
			var content = this.config.get("data.object.content");
			if (content) {
				var event = new Echo.SocialChatterEvent(content);
				if (event.data.vipPhoto) {
					dom.get("eventIcon").attr("src", event.data.vipPhoto);
				}
			}
			element.focus(function() {
				self.dom.get("eventIconError").hide();
				element.parent().removeClass("echo-input-error");
			}).blur(function() {
				var _element = $(this);
				if (_element.val()) {
					self.dom.get("eventIcon")
						.attr("src", _element.val())
						.one("error", function() {
							element.parent().addClass("echo-input-error");
							self.dom.get("eventIconError").show();
							self.dom.get("eventIcon")
								.attr("src", "//cdn.echoenabled.com/clientapps/v2/social-chatter/images/vip.jpg");
						});
				}
			})
		}
	};
});*/

plugin.methods._assembleContent = function() {
	var self = this;
	return Echo.Utils.foldl({}, plugin.fields, function(name, acc) {
		if (name == "eventStart" || name == "eventEnd") {
			acc[name] = self.get("eventsTimestamp." + name);
			return;
		}
		acc[name] = self.component.dom.get(name).val();
	});
};
/*
plugin.listenStreamEvents = function(application) {
	plugin.subscribe(application, "internal.Item.onDelete", function(topic, args) {
		plugin.publish(application, "SocialChatter.onEventDelete", args);
	});
};

plugin.methods._postAction = function() {
	application.posting = application.posting || {};
	application.posting.action = function() {
		var highlighted;
		$.each(plugin.mandatoryFields, function(i, v) {
			var element = application.dom.get(v);
			highlighted = application.highlightMandatory(element);
			return !highlighted;
		});
		if (highlighted) return;
		application.post();
	}
};

plugin.listenSubmitEvents = function(application) {
	$.each(["Post", "Edit"], function(i, mode) {
		plugin.subscribe(application, "Submit.on" + mode + "Init", function(topic, args) {
			if ($.isArray(args.postData)) {
				$.each(args.postData, function(i, data) {
					if (data.field == "content") {
						data.value = $.object2JSON(plugin.assembleContent(application));
					}
				});
			} else {
				args.postData.content = $.object2JSON(plugin.assembleContent(application));
			}
		});
	});
	plugin.subscribe(application, "Submit.onPostComplete", function(topic, args) {
		application.rerender(plugin.fields);
	});
};*/

plugin.component.renderers.footer = function(element) {
	this.parentRenderer("footer", arguments);
	if (!this.component.user.is("admin") || this.component.user.any("role", ["vip"])) {
		element.hide();
	}
	return element;
};

plugin.component.renderers.avatar = function() {
	var item = this.component;
	var content = new Echo.SocialChatterEvent(item.get("data.object.content"));
	var initialAvatar = item.get("data.actor.avatar");
	var defaultAvatar = item.user.get("defaultAvatar");
	// re-define default avatar for the item
	this.component.user.set("defaultAvatar", "//cdn.echoenabled.com/clientapps/v2/social-chatter/images/vip.jpg");
	if (!$.isEmptyObject(content)) {
		item.set("data.actor.avatar", content.data.vipPhoto);
	}
	var element = this.parentRenderer("avatar", arguments);
	item.set("data.actor.avatar", initialAvatar);
	// reset default avatar
	this.component.user.set("defaultAvatar", defaultAvatar);
	return element;
}

plugin.component.renderers.authorName = plugin.component.renderers.body = function(element) {
	element.remove();
};

plugin.methods._getFullDate = function(timestamp) {
	var d = new Date(timestamp);
	return (timestamp
		? $.datepicker.formatDate(this.config.get("dateFormat"), d)
		+ " " + $.datepicker.formatTime(this.config.get("timeFormat"),  {
			"hour": d.getHours(),
			"minute": d.getMinutes(),
			"second": d.getSeconds(),
			"millisec": d.getMilliseconds()
		}, {
			"ampm": this.config.get("ampm")
		})
		: this.labels.get("unknown"));
};

plugin.methods._assembleButton = function() {
	var self = this;
	return function() {
		var item = this;
		var type = self.get("eventTemplate.type") || "default";
		return {
			"name": "ViewFullEvent",
			"label": type == "default"
				? self.labels.get("viewFullEvent")
				: self.labels.get("viewDefaultEvent"),
			"visible": item.user.is("admin"),
			"callback": function() {
				self.set("eventTemplate.type", type == "default" ? "full" : "default");
				item.dom.render({
					"template": self.get("eventTemplate.type") === "default"
						? plugin.templates["EventDefault"]
						: plugin.templates["EventFull"]
				});
				/*$.each(["eventContainer", "controls"], function(i, name) {
					item.dom.render({
						"name": name,
						"recursive": true
					});
				});*/
			} 
		};
	};
};

plugin.css =
	'.ui-timepicker-div .ui-widget-header { margin-bottom: 8px; }' +
	'.ui-timepicker-div dl { text-align: left; }' +
	'.ui-timepicker-div dl dt { height: 25px; margin-bottom: -25px; }' +
	'.ui-timepicker-div dl dd { margin: 0 10px 10px 65px; }' +
	'.ui-timepicker-div td { font-size: 90%; }' +
	'.ui-tpicker-grid-label { background: none; border: none; margin: 0; padding: 0; }' +
	'.{plugin.class:eventItem} { margin: 5px 0px; }' +
	'.{plugin.class:eventContainer} { float: left; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-content { border: 0px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-post-container { float: left; margin: 0px 15px 0px 5px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-cancelButton-container { float: left; }' +
	'.echo-stream-plugin-SocialChatterEvent .{plugin.class:avatar}-wrapper { margin-top: 7px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-input-error { border: 1px solid red; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-eventIconError { display: none; color: red; font-size: 12px; margin: 10px 0px; text-align: center; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-eventIconContainer { text-align: center; width: 175px; float: left; margin-right: 20px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-eventIconContainer img { margin: 20px 0px 10px 0px; max-width: 120px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-changeEventIcon { text-align: center; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-body { float: left; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-controls { clear: both; margin-left: 195px; margin-bottom: 15px; }' +
	'.echo-submit-plugin-SocialChatterEvent .echo-submit-body { margin-right: 20px; }' +
	'.echo-submit-field-title { font-size: 14px; font-weight: bold; margin-bottom: 5px; }' +
	'.{plugin.class:eventButtonContainer} { padding: 15px 0 15px 0px; text-align: left; }' +
	'.{plugin.class:eventDefault} { padding: 5px 0 5px 0px; }' +
	'.{plugin.class:eventNameDefault} { font-size: 20px; font-weight: bold; }' +
	'.{plugin.class:eventDescriptionDefault} { font-size: 14px; margin: 10px 0px; }' +
	'.echo-socialchatter-view-eventsStream .{plugin.class:avatar}, .echo-socialchatter-view-eventsStream .{plugin.class:avatar} img { height: auto !important; }' +
	'.echo-socialchatter-view-eventsStream .{plugin.class:modeSwitch}, .echo-socialchatter-view-eventsStream .{plugin.class:status} { display: none !important; }' +
	'.echo-socialchatter-view-eventsStream .{plugin.class:subcontainer} { margin-left: 10px; }' +
	'.echo-event-onair-label { color: green; font-weight: bold; }' +
	'.echo-submit-eventSubmitNotice { background-color: #D9EDF7; border: 1px solid #BCE8F1; border-radius: 4px 4px 4px 4px; color: #3A87AD;  padding: 15px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); font-size: 14px; line-height: 16px; text-align: center; }' +
	'.echo-submit-eventSubmitNotice a { color: #3A87AD; cursor: pointer; text-decoration: underline; }' +
	'.echo-submit-event-field-mandatory { color: red; font-weight: bold; }' +
	'.echo-submit-event-inputContainer { margin-bottom: 15px; width: 300px; padding: 5px; }';

Echo.Plugin.create(plugin);

})(jQuery);
