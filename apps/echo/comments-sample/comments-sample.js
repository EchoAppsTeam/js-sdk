Echo.define("commentsSample", [
	"jquery",
	"echo/app",
	"echo/streamserver/apps/stream",
	"echo/streamserver/apps/submit"
], function($, App, Stream, Submit) {

"use strict";

var Comments = App.manifest("Echo.Apps.CommentsSample");

if (App.isDefined("Echo.Apps.CommentsSample")) return;

Comments.config = {
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
		"component": "Echo.StreamServer.Controls.Stream",
		"config": {
			"target": element,
		}
	});
	return element;
};

Comments.renderers.submit = function(element) {
	this.initApp({
		"id": "Submit",
		"component": "Echo.StreamServer.Controls.Submit",
		"config": {
			"target": element,
			"infoMessages": {"enabled": false},
			"plugins": [{
				"name": "FormAuth",
				"url": "echo/streamserver/plugins/formAuth",
				"identityManager": "{config:identityManager}"
			}]
		}
	});
	return element;
};

Comments.css = ".{class:container} > div { margin-bottom: 7px; }";

return App.create(Comments);
});
