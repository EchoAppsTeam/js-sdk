(function(jQuery) {
"use strict";

var $ = jQuery;

var Comments = Echo.App.manifest("Echo.Apps.CommentsSample");

if (Echo.App.isDefined("Echo.Apps.CommentsSample")) return;

Comments.dependencies = [
	{"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Submit") && Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream");
	}, "url": "{sdk}/streamserver.pack.js"},

	{"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth");
	}, "url": "{sdk}/identityserver.pack.js"}
];

Comments.config = {
	"submitFormPosition": "top" // top | bottom
};

Comments.templates.topSubmitFormPosition =
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:submit}"></div>' +
		'<div class="{class:stream}"></div>' +
	'</div>';

Comments.templates.bottomSubmitFormPosition =
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:submit}"></div>' +
	'</div>';

Comments.methods.template = function() {
	return this.templates[
		this.config.get("submitFormPosition") + "SubmitFormPosition"
	];
};

Comments.renderers.auth = function(element) {
	this.initComponent({
		"id": "Auth",
		"name": "Echo.IdentityServer.Controls.Auth",
		"config": {
			"appkey": null,
			"target": element,
			"identityManager": "{config:identityManager}"
		}
	});
	return element;
};

Comments.renderers.stream = function(element) {
	this.initComponent({
		"id": "Stream",
		"name": "Echo.StreamServer.Controls.Stream",
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.renderers.submit = function(element) {
	this.initComponent({
		"id": "Submit",
		"name": "Echo.StreamServer.Controls.Submit",
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

Echo.App.create(Comments);

})(Echo.jQuery);
