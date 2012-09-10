(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Products.CommentsSample")) return;

var Comments = Echo.Product.manifest("Echo.Products.CommentsSample", ["Auth", "Submit", "Stream"]);

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

$.map(["auth", "stream", "submit"], function(name) {
	Comments.renderers[name] = function(element) {
		var id = Echo.Utils.capitalize(name);
		this.addControl(id, {
			"config": {"target": element}
		});
		return element;
	};
});

Comments.controls.Auth = {
	"name": "Echo.IdentityServer.Controls.Auth",
	"config": {
		"appkey": null,
		"identityManager": "{config:identityManager}"
	}
};
Comments.controls.Stream = {
	"name": "Echo.StreamServer.Controls.Stream"
};
Comments.controls.Submit = {
	"name": "Echo.StreamServer.Controls.Submit"
};

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

Echo.Product.create(Comments);

})(Echo.jQuery);
