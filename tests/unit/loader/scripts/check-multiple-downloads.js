(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.Tests.Controls.TestControl
 *
 * @extends Echo.Control
 *
 * @constructor
 * Counter constructor initializing Echo.Tests.Controls.TestControl class
 *
 * @param {Object} config
 * Configuration options
 */
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
