Echo.define([
	"jquery", 
	"echo/utils"
], function($, Utils) {

"use strict";

/**
 * @class Echo.Labels
 * Class implements the language variables mechanics across the components.
 *
 * It should be instantiated to override language variables within
 * the scope of a particular component instance.
 * Language variables overridden with the instance of this class
 * will have the highest priority.
 * Static methods should be used for general language variable
 * definition and localization purposes.
 *
 * Example:
 *
 *     var labels = new Echo.Labels({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream");
 *
 *     labels.get("live"); // returns "Live"
 *     labels.get("paused"); // returns "Paused"
 *
 *     labels.set({
 *         "live": "Live...",
 *         "paused": "Paused..."
 *     });
 *
 *     labels.get("live"); // returns "Live..."
 *     labels.get("paused"); // returns "Paused..."
 *
 * @package apps.sdk.js
 *
 * @constructor
 * Constructor of class encapsulating language variable mechanics.
 *
 * @param {Object} labels
 * Flat object containing the list of language variables to be initialized.
 *
 * @param {String} namespace
 * Component namespace.
 *
 * @return {Object}
 * The reference to the given Echo.Labels class instance.
 */

var Labels = function(labels, namespace) {
	var self = this;
	this.storage = {};
	this.namespace = namespace;
	$.each(labels, function(name, value) {
		self.storage[Labels._key(name, self.namespace)] = value;
	});
};

/**
 * Method to access specific language variable within the scope of a particular component instance.
 *
 * Function returns the language variable value corresponding to this instance.
 * If current instance doesn't contain this particular language variable
 * it will fall back to the global language variable list.
 *
 *     var labels = new Echo.Labels({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream");
 *
 *     labels.get("live"); // returns "Live"
 *     labels.get("paused"); // returns "Paused"
 *
 * @param {String} name
 * Language variable name.
 *
 * @param {Object} data
 * Flat object data that should be inserted instead of a placeholder in the language variable.
 *
 * @return {String}
 * Value of the language variable.
 */

Labels.prototype.get = function(name, data) {
	var key = Labels._key(name, this.namespace);
	return this.storage[key]
		? Labels._substitute(this.storage[key], data)
		: Labels.get(name, this.namespace, data);
};

/**
 * @method
 * Method to add/override the language variable list within the scope
 * of a particular component instance.
 *
 * Function should be used to customize the text part of the UI within
 * the particular component instance.For global text definitions and
 * localization purposes the static method should be used.
 *
 *     var labels = new Echo.Labels({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream");
 *
 *     labels.get("live"); // returns "Live"
 *     labels.get("paused"); // returns "Paused"
 *
 *     labels.set({
 *         "live": "Live...",
 *         "paused": "Paused..."
 *     });
 *
 *     labels.get("live"); // returns "Live..."
 *     labels.get("paused"); // returns "Paused..."
 *
 * @param {Object} labels
 * Flat object containing the list of language variables to be added/overridden.
 */

Labels.prototype.set = function(labels) {
	var self = this;
	$.each(labels, function(name, value) {
		var key = Labels._key(name, self.namespace);
		self.storage[key] = value;
	});
};

/**
 * @static
 * Function to add/override the language variable list in the global scope.
 *
 * Function should be used to define the default language variable list.
 * In this use case the `isDefault` param should be set to `true`.
 * Function should also be used for localization purposes.
 * In this case the `isDefault` param can be omitted or set to `false`.
 * The values overridden with the function will be available globally.
 *
 *     Echo.Labels.set({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream"); // setting custom labels
 *
 *     Echo.Labels.get("live", "Stream"); // returns "Live"
 *     Echo.Labels.get("paused", "Stream"); // returns "Paused"
 *
 *     Echo.Labels.set({
 *         "live": "Live...",
 *         "paused": "Paused..."
 *     }, "Stream", true); // setting default labels
 *
 *     Echo.Labels.get("live", "Stream"); // returns "Live" (custom label is not overridden by default)
 *     Echo.Labels.get("paused", "Stream"); // returns "Paused" (custom label is not overridden by default)
 *
 *     Echo.Labels.set({
 *         "live": "Live label",
 *         "paused": "Paused label"
 *     }, "Stream"); // overriding custom labels
 *
 *     Echo.Labels.get("live", "Stream"); // returns "Live label"
 *     Echo.Labels.get("paused", "Stream"); // returns "Paused label"
 *
 * @param {Object} labels
 * Object containing the list of language variables.
 *
 * @param {String} namespace
 * Namespace.
 *
 * @param {Boolean} isDefault
 * Flag switching the localization mode to setting defaults one.
 */

Labels.set = function(labels, namespace, isDefault) {
	$.each(labels, function(name, value) {
		var key = Labels._key(name, namespace);
		Labels._storage[isDefault ? "general" : "custom"][key] = value;
	});
};

/**
 * @static
 * Function returning the language variable value by its name from the global
 * language variable list.
 *
 * Function returns the language variable value from the global language
 * variable list. It also takes into consideration the localized values.
 * If value of the particular language variable is not found in the localization
 * list it will fall back to the default language variable value.
 *
 *     Echo.Labels.set({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream");
 *
 *     Echo.Labels.get("live", "Stream"); // returns "Live"
 *     Echo.Labels.get("Stream.paused"); // returns "Paused"
 *
 * @param {String} name
 * Language variable name.
 *
 * @param {String} namespace
 * String representing the namespace.
 *
 * @param {Object} data
 * Flat object data that should be inserted instead of a placeholder in the language variable.
 *
 * @return {String}
 * Value of the language variable.
 */

Labels.get = function(name, namespace, data) {
	var key = Labels._key(name, namespace);
	var label = Labels._storage["custom"][key]
		|| Labels._storage["general"][key]
		|| Labels._storage["custom"][name]
		|| Labels._storage["general"][name]
		|| name;
	return Labels._substitute(label, data);
};

Labels._storage = { "general": {}, "custom": {} };

Labels._key = function(name, namespace) {
	return (namespace ? namespace + "." : "") + name;
};

Labels._substitute = function(label, data) {
	$.each(data || {}, function(key, value) {
		label = label.replace(new RegExp("{" + key + "}", "g"), value);
	});
	return label;
};

// FIXME: __DEPRECATED__
// remove this after full require js compatible implementation
Utils.set(window, "Echo.Labels", Labels);

return Labels;

});
