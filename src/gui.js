define(["jquery", "configuration"], function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.GUI) return;

/**
 * @class Echo.GUI
 * Foundation class implementing core logic for GUI components.
 *
 * @package gui.pack.js
 *
 * @constructor
 * @param {Object} config
 * GUI component configuration.
 */
Echo.GUI = function(config, defaultConfig) {
	// exit if config is missing or the target is undefined
	if (!config || !(config.target || defaultConfig.targetless)) return;

	config.target = !defaultConfig.targetless && $(config.target);

	this.config = new Echo.Configuration(config, defaultConfig);
	this.refresh();
};
/**
 * @property {Echo.Configuration} config
 * As soon as the component is created, you can change its config using
 * this property.
 * For example:
 * 	component.config.set("some-config-parameter", "new-value");
 * 	component.refresh();
 */

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
