(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.GUI) return;

/**
 * @class Echo.GUI
 * Foundation class implementing core logic for GUI components.
 *
 * @constructor
 * @param {Object} config
 * GUI component configuration.
 */
Echo.GUI = function(config, defaultConfig) {
	if (!config) return;

	this.config = new Echo.Configuration($.extend(true, {}, config), defaultConfig);
	this.refresh();
};

/**
 * This method re-assembles the component HTML code and
 * appends it to the target.
 */
Echo.GUI.prototype.refresh = function() {
};

/**
 * Hides the component and removes it's instance.
 */
Echo.GUI.prototype.destroy = function() {
	this.config.get("target") && this.config.get("target").empty();
	this.config.remove("target");
};

})(Echo.jQuery);
