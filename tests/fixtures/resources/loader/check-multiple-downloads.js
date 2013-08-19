(function(jQuery) {
"use strict";

var $ = jQuery;

var control = Echo.Control.manifest("Echo.Tests.Controls.TestMultipleDownloads");

if (Echo.Control.isDefined(control)) return;

control.init = function() {
	if (!Echo.Variables) {
		Echo.Variables = {};
	}
	Echo.Variables.TestControl = "development";
	this.ready();
};

control.config = {};

control.templates.main = "";

Echo.Control.create(control);

})(Echo.jQuery);
