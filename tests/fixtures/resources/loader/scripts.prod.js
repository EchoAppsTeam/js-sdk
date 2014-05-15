(function(jQuery) {
"use strict";

var control = Echo.Control.manifest("Echo.Tests.Controls.TestControl");

if (Echo.Control.isDefined(control)) return;

control.init = function() {
	if (!Echo.Variables) {
		Echo.Variables = {};
	}
	Echo.Variables.TestControl = "production";
	this.ready();
};

control.config = {};

control.templates.main = "";

Echo.Control.create(control);

})(Echo.jQuery);
