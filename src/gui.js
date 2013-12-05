Echo.define("echo/gui", [
	"jquery",
	"echo/configuration",
	// FIXME: __DEPRECATED__
	// remove this after full require js compatible implementation
	"echo/utils",
	"css!echo/gui.pack"
], function($, Configuration, Utils) {

"use strict";

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
var GUI = function(config, defaultConfig) {
	// exit if config is missing or the target is undefined
	if (!config || !(config.target || defaultConfig.targetless)) return;

	config.target = !defaultConfig.targetless && $(config.target);

	this.config = new Configuration(config, defaultConfig);
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
GUI.prototype.refresh = function() {
};

/**
 * Hides the component and removes it's instance.
 */
GUI.prototype.destroy = function() {
	this.config.get("target") && this.config.get("target").empty();
	this.config.remove("target");
};

// FIXME: __DEPRECATED__
// remove this after full require js compatible implementation
Utils.set(window, "Echo.GUI", GUI);

return GUI;

});
