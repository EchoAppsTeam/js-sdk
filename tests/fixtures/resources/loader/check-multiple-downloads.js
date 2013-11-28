(function(jQuery) {
"use strict";

var $ = jQuery;

var app = Echo.App.definition("Echo.Tests.Apps.TestMultipleDownloads");

if (Echo.App.isDefined(app)) return;

app.init = function() {
	if (!Echo.Variables) {
		Echo.Variables = {};
	}
	Echo.Variables.TestApp = "development";
	this.ready();
};

app.config = {};

app.templates.main = "";

Echo.App.create(app);

})(Echo.jQuery);
