(function(jQuery) {
"use strict";

var $ = jQuery;

var app = Echo.App.definition("Echo.Tests.Apps.TestApp");

if (Echo.App.isDefined(app)) return;

app.init = function() {
	if (!Echo.Variables) {
		Echo.Variables = {};
	}
	Echo.Variables.TestApp = "production";
	this.ready();
};

app.config = {};

app.templates.main = "";

Echo.App.create(app);

})(Echo.jQuery);
