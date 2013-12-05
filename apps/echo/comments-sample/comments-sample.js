Echo.define([
	"jquery",
	"echo/app",
	"echo/streamserver/bundled-apps/stream/client-widget",
	"echo/streamserver/bundled-apps/submit/client-widget"
], function($, App, Stream, Submit) {

"use strict";

var Comments = App.definition("Echo.Apps.CommentsSample");

if (App.isDefined("Echo.Apps.CommentsSample")) return;

Comments.config = {
	"appkey": "",
	"submitFormPosition": "top" // top | bottom
};

Comments.templates.topSubmitFormPosition =
	'<div class="{class:container}">' +
		'<div class="{class:submit}"></div>' +
		'<div class="{class:stream}"></div>' +
	'</div>';

Comments.templates.bottomSubmitFormPosition =
	'<div class="{class:container}">' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:submit}"></div>' +
	'</div>';

Comments.methods.template = function() {
	return this.templates[
		this.config.get("submitFormPosition") + "SubmitFormPosition"
	];
};

Comments.renderers.stream = function(element) {
	this.initApp({
		"id": "Stream",
		"component": Stream,
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.renderers.submit = function(element) {
	this.initApp({
		"id": "Submit",
		"component": Submit,
		"config": {
			"target": element
		}
	});
	return element;
};

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

return App.create(Comments);

});
