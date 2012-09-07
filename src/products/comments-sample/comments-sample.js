(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Products.CommentsSample")) return;

var Comments = Echo.Product.manifest("Echo.Products.CommentsSample");

Comments.dependencies = [
	{"loaded": function() {
		var isLoaded;
		$.each(["Stream", "Submit"], function(k, val) {
			return isLoaded = Echo.Utils.isComponentDefined("Echo.StreamServer.Controls." + val);
		});
		return isLoaded;
	}, "url": "sdk/stream-server.pack.js"},

	{"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth");
	}, "url": "sdk/identity-server.pack.js"}
];

Comments.config = {
	"submitFormPosition": "top" // top | bottom
};

Comments.templates.submitFormTop =
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:submit}"></div>' +
		'<div class="{class:stream}"></div>' +
	'</div>';

Comments.templates.submitFormBottom =
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:submit}"></div>' +
	'</div>';

Comments.methods.template = function() {
	return this.templates[
		"submitForm" + Echo.Utils.capitalize(
			this.config.get("submitFormPosition")
		)
	];
};

Comments.controls = [{
	"name": "Echo.IdentityServer.Controls.Auth",
	"config": {
		"appkey": null,
		"target": "{target:auth}",
		"identityManager": "{config:identityManager}"
	}
}, {
	"name": "Echo.StreamServer.Controls.Stream",
	"config": {
		"target": "{target:stream}"
	}
}, {
	"name": "Echo.StreamServer.Controls.Submit",
	"config": {
		"target": "{target:submit}"
	}
}];

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

Echo.Product.create(Comments);

})(Echo.jQuery);
