(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Submit")) return;

var submit = Echo.Control.skeleton("Echo.StreamServer.Controls.Submit");

submit.config = {
	"targetURL": document.location.href,
	"submissionProxyURL": window.location.protocol + "//apps.echoenabled.com/v2/esp/activity",
	"markers": [],
	"source": {},
	"tags": [],
	"requestMethod": "GET",
	"mode": "standard",
	"data": {},
	"inReplyTo": {},
	"itemURIPattern": undefined,
	"actionString": "Type your comment here...",
	"postingTimeout": 30,
	"targetQuery": undefined
};

submit.labels = {
	"createdBy": "Created by",
	"markers": "Markers:",
	"markersHint": "Marker1, marker2, marker3, ...",
	"on": "on",
	"post": "Post",
	"posting": "Posting...",
	"postingFailed": "There was a server error while trying to submit your item. Please try again in a few minutes. <b>Error: \"{error}\"</b>.",
	"postingTimeout": "There was a network issue while trying to submit your item. Please try again in a few minutes.",
	"tagsHint": "Tag1, tag2, tag3, ...",
	"tags": "Tags:",
	"update": "Update",
	"updating": "Updating...",
	"yourName": "Your Name (required)",
	"yourWebsiteOptional": "Your website (optional)"
};

submit.events = {
	"internal.User.onInvalidate": function() {
		// TODO: pass control ref as "this"
		this.rerender();
	}
};

// templates

submit.templates.standard = submit.templates.edit =
	'<div class="container">' +
		'<div class="header" data-renderer="header"></div>' +
		'<div class="body">' +
			'<div class="content border">' +
				'<textarea class="text text-area echo-primaryFont echo-primaryColor" data-renderer="text"></textarea>' +
			'</div>' +
			'<div class="markersContainer metadata-container echo-primaryFont echo-primaryColor" data-renderer="markersContainer">' +
				'<div class="metadata-label">{Label:markers}</div>' +
				'<div class="metadata-wrapper">' +
					'<div class="metadata-subwrapper border ">' +
						'<input class="markers echo-primaryFont" data-renderer="markers">' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
			'<div class="tagsContainer metadata-container echo-primaryFont echo-primaryColor" data-renderer="tagsContainer">' +
				'<div class="metadata-label">{Label:tags}</div>' +
				'<div class="metadata-wrapper">' +
					'<div class="metadata-subwrapper border ">' +
						'<input class="tags border echo-primaryFont" data-renderer="tags">' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>' +
		'<div class="controls">' +
			'<div class="post-container echo-ui">' +
				'<button type="button" class="postButton echo-primaryFont"></button>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
	'</div>';

submit.templates.editModeUserInfo =
	'<div class="userInfoWrapper echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{Label:createdBy} ' +
		'<span class="author">{Data:author}</span> ' +
		'{Label:on} {Data:date}' +
	'</div>';

submit.templates.anonymousModeUserInfo = 
	'<div class="anonymousUserInfoWrapper">' +
		'<div class="anonymousUserInfoAvatar" data-renderer="avatar"></div>' +
		'<div class="anonymousUserInfoFields">' +
			'<div class="anonymousUserInfoFieldsWrapper">' +
				'<div class="anonymousUserInfoNameContainer border">' +
					'<input class="anonymousUserInfoName echo-primaryFont echo-primaryColor" data-renderer="name">' +
				'</div>' +
				'<div class="anonymousUserInfoUrlContainer border">' +
					'<input class="anonymousUserInfoUrl echo-primaryFont echo-primaryColor" data-renderer="url">' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

// renderers
	
submit.renderers.tagsContainer = 
submit.renderers.markersContainer = function(element) {
	(this.user.any("roles", ["administrator"])) ? element.show() : element.hide();
};

submit.renderers.markers = function(element) {
	this.metaFields(element, {"type": "markers"});
};

submit.renderers.tags = function(element) {
	this.metaFields(element, {"type": "tags"});
};

submit.renderers.header = function(element) {
	var data = {};
	var template = this.templates.anonymousModeUserInfo;
	if (this.config.get("mode") === "edit") {
		template = this.templates.editModeUserInfo;
		var published = this.config.get("data.object.published");
		var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
		data = {
			"date": date.toLocaleDateString() + ', ' + date.toLocaleTimeString(),
			"author": this.config.get("data.actor.title", this.labels.get("guest"))
		};
	}
	var object = {
		"template": template,
		"data": data
	};
	return element.append(this.render(object));
};

submit.renderers.text = function(element) {
	var content = this.config.get("data.object.content");
	if (content) {
		element.val(content);
	}
	element.iHint({
		"text": this.config.get("actionString"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.avatar = function(element) {
	var avatar = this.user.get("avatar") || this.user.config.get("defaultAvatar");
	element.append('<img src="' + avatar + '">');
};

submit.renderers.name = function(element) {
	element.val(this.user.get("name", "")).iHint({
		"text": this.labels.get("yourName"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.url = function(element) {
	element.val(this.user.get("domain", "")).iHint({
		"text": this.labels.get("yourWebsiteOptional"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.postButton = function(element) {
	// TODO: ...
}

// methods

submit.methods.post = function() {
	// TODO: ...
};

submit.methods.template = function() {
	return this.templates[this.config.get("mode")];
};

submit.methods.metaFields = function(element, extra) {
	var type = extra.type;
	var data = this.config.get("data.object." + type, this.config.get(type, []));
	
	if (this.dom.get(type)) {
		this.dom.get(type).iHint({
				"text": this.labels.get(type + "Hint"),
				"className": "echo-secondaryColor"
		}).val($.trim($.stripTags(data.join(", ")))).blur();
	}
};

submit.methods.highlightMandatory = function(element) {
	if (element && !$.trim(element.val())) {
		element.parent().addClass("echo-submit-mandatory");
		element.focus(function() {
			$(this).parent().removeClass("echo-submit-mandatory");
		});
		return true;
	}
	return false;
};

submit.methods.prepareBroadcastParams = function(params) {
	params = params || {};
	params.data = this.config.get("data");
	params.target = this.config.get("target").get(0);
	params.targetURL = this.config.get("targetURL");
	params.inReplyTo = this.config.get("inReplyTo");
	return params;
};

submit.methods.getContentUpdate = function(content) {
	if (this.config.get("data.object.content", "") === content) {
		return [];
	}
	return [{
		"verb": "update",
		"field": "content",
		"value": content,
		"target": this.config.get("data.object.id")
	}];
};

submit.methods.getMetaDataUpdates = function(verb, type, data) {
	var self = this;
	var extract = function(value) {
		return $.map(value || [], function(item) { return $.trim(item); });
	};
	var items = {
		"modified": extract(data.split(",")),
		"current": extract(this.config.get("data.object." + type, ""))
	};
	var updates = [];
	var diff = function(a, b, verb) {
		$.map(a, function(item) {
			if (item && $.inArray(item, b) == -1) {
				var update = {
					"verb": verb,
					"target": self.config.get("data.object.id")
				};
				update[type] = item
				updates.push(update);
			}
		});
	};
	diff(items.current, items.modified, "un" + verb);
	diff(items.modified, items.current, verb);
	return updates;
};

submit.css = 
	'{prefix} .header { margin-bottom: 3px; }' +
	'{prefix} .anonymousUserInfoAvatar { float: left; margin-right: -48px; }' +
	'{prefix} .anonymousUserInfoAvatar img { width: 48px; height: 48px; }' +
	'{prefix} .anonymousUserInfoFields { width: 100%; float: left; }' +
	'{prefix} .anonymousUserInfoFields input { width: 100%; }' +
	'{prefix} .anonymousUserInfoFieldsWrapper { margin-left: 53px; }' +
	'{prefix} .anonymousUserInfoNameContainer { margin: 1px 0px 4px 0px; padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'{prefix} .anonymousUserInfoName { font-size: 14px; font-weight: bold; border: none; }' +
	'{prefix} .anonymousUserInfoUrlContainer { padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'{prefix} .anonymousUserInfoUrl { height: 19px; border: none; }' +
	'{prefix} .author { font-weight: bold; }' +
	'{prefix} .content { padding: 5px 5px 5px 6px; background-color: #fff; }' +
	'{prefix} .text-area { width: 100%; height: 102px; padding: 0px; margin: 0px; border: none; resize:none ; }' +
	'{prefix} .text-input { width: 100%; border: none; }' +
	'{prefix} .metadata-container { margin-top: 6px; }' +
	'{prefix} .metadata-label { float: left; width: 50px; margin-right: -50px; text-align: right; line-height: 22px; }' +
	'{prefix} .metadata-wrapper { float: left; width: 100%; }' +
	'{prefix} .metadata-subwrapper { margin-left: 55px; padding: 2px 2px 2px 3px; background-color: #fff; }' +
	'{prefix} .metadata-subwrapper input { width: 100%; border: none; }' +
	'{prefix} .controls { margin-top: 5px; }' +
	'{prefix} .post-container { float: right; }' +
	'{prefix} .border { border: 1px solid #d2d2d2; }' +
	'{prefix} .mandatory { border: 1px solid red; }' +
	'{prefix} .queries-view-option { padding-right: 5px; }' +
	'{prefix} .error { color: #444444; font: 14px Arial; line-height: 150%; padding-left: 85px; background: no-repeat url(//cdn.echoenabled.com/images/info70.png); height: 70px; }';

Echo.Control.create(submit);

})(jQuery);
