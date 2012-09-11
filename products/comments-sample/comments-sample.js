(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Products.CommentsSample")) return;

var Comments = Echo.Product.manifest("Echo.Products.CommentsSample");

Comments.dependencies = [
	{"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Submit") && Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Stream");
	}, "url": "sdk/stream-server.pack.js"},

	{"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth");
	}, "url": "sdk/identity-server.pack.js"}
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
		"constructor": "Echo.IdentityServer.Controls.Auth",
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
		"constructor": "Echo.StreamServer.Controls.Stream",
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.renderers.submit = function(element) {
	this.initComponent({
		"id": "Submit",
		"constructor": "Echo.StreamServer.Controls.Submit",
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

Echo.Product.create(Comments);

})(Echo.jQuery);
