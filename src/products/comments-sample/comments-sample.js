(function() {

if (Echo.Utils.isComponentDefined("Echo.Products.CommentsSample")) return;

var Comments = Echo.Product.manifest("Echo.Products.CommentsSample", ["Main"]);

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
	"submitFormPosition": "top"
};

Comments.templates.main = '<div class="{class:container}"></div>';

Comments.renderers.container = function(element) {
	this.assemble("Main", element);
	return element;
};

Comments.assemblers.Main = function(target) {
	var view = this.initView("Main", {
		"user": this.user,
		"target": target
	});
	if (this.config.get("identityManager")) {
		view.initControl("Auth", {
			"target": view.dom.get("auth")
		});
	}
	view.initControl("Submit", {
		"target": view.dom.get("submit")
	});
	view.initControl("Stream", {
		"target": view.dom.get("stream")	
	});
};

Comments.views.Main.templates.submitFormTop = 
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:submit}"></div>' +
		'<div class="{class:stream}"></div>' +
	'</div>';

Comments.views.Main.templates.submitFormBottom = 
	'<div class="{class:container}">' +
		'<div class="{class:auth}"></div>' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:submit}"></div>' +
	'</div>';

Comments.views.Main.methods.template = function() {
	return this.config.get("parent.submitFormPosition") === "top"
		? this._manifest("templates").submitFormTop
		: this._manifest("templates").submitFormBottom
};

Comments.views.Main.css = ".{class:container} > div { margin-bottom: 7px; }";

Comments.views.Main.controls.Auth = {
	"control": "Echo.IdentityServer.Controls.Auth",
	"config": {
		"appkey": null,
		"identityManager": "{config:parent.identityManager}"
	}
};

Comments.views.Main.controls.Stream = {
	"control": "Echo.StreamServer.Controls.Stream",
	"config": {}
};

Comments.views.Main.controls.Submit = {
	"control": "Echo.StreamServer.Controls.Submit",
	"config": {}
};

Echo.Product.create(Comments);

})();
