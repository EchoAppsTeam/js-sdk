Echo.define("echo/labels", [
	"jquery", 
	"echo/utils"
], function($, Utils) {

"use strict";

var Labels;

/**
 * @class Labels
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
 *     var labels = new Labels({
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
 * @package environment.pack.js
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
 * The reference to the given Labels class instance.
 */

Labels = function(labels, namespace) {
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
 *     var labels = new Labels({
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
 *     var labels = new Labels({
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
 *     Labels.set({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream"); // setting custom labels
 *
 *     Labels.get("live", "Stream"); // returns "Live"
 *     Labels.get("paused", "Stream"); // returns "Paused"
 *
 *     Labels.set({
 *         "live": "Live...",
 *         "paused": "Paused..."
 *     }, "Stream", true); // setting default labels
 *
 *     Labels.get("live", "Stream"); // returns "Live" (custom label is not overridden by default)
 *     Labels.get("paused", "Stream"); // returns "Paused" (custom label is not overridden by default)
 *
 *     Labels.set({
 *         "live": "Live label",
 *         "paused": "Paused label"
 *     }, "Stream"); // overriding custom labels
 *
 *     Labels.get("live", "Stream"); // returns "Live label"
 *     Labels.get("paused", "Stream"); // returns "Paused label"
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
 *     Labels.set({
 *         "live": "Live",
 *         "paused": "Paused"
 *     }, "Stream");
 *
 *     Labels.get("live", "Stream"); // returns "Live"
 *     Labels.get("Stream.paused"); // returns "Paused"
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

// predefined global label

Labels.set({
	/**
	 * @echo_label retrying
	 */
	"retrying": "Retrying...",
	/**
	 * @echo_label error_busy
	 */
	"error_busy": "Loading. Please wait...",
	/**
	 * @echo_label error_timeout
	 */
	"error_timeout": "Loading. Please wait...",
	/**
	 * @echo_label error_waiting
	 */
	"error_waiting": "Loading. Please wait...",
	/**
	 * @echo_label error_view_limit
	 */
	"error_view_limit": "View creation rate limit has been exceeded. Retrying in {seconds} seconds...",
	/**
	 * @echo_label error_view_update_capacity_exceeded
	 */
	"error_view_update_capacity_exceeded": "This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...",
	/**
	 * @echo_label error_result_too_large
	 */
	"error_result_too_large": "(result_too_large) The search result is too large.",
	/**
	 * @echo_label error_wrong_query
	 */
	"error_wrong_query": "(wrong_query) Incorrect or missing query parameter.",
	/**
	 * @echo_label error_incorrect_appkey
	 */
	"error_incorrect_appkey": "(incorrect_appkey) Incorrect or missing appkey.",
	/**
	 * @echo_label error_internal_error
	 */
	"error_internal_error": "(internal_error) Unknown server error.",
	/**
	 * @echo_label error_quota_exceeded
	 */
	"error_quota_exceeded": "(quota_exceeded) Required more quota than is available.",
	/**
	 * @echo_label error_incorrect_user_id
	 */
	"error_incorrect_user_id": "(incorrect_user_id) Incorrect user specified in User ID predicate.",
	/**
	 * @echo_label error_unknown
	 */
	"error_unknown": "(unknown) Unknown error.",
	/**
	 * @echo_label today
	 */
	"today": "Today",
	/**
	 * @echo_label justNow
	 */
	"justNow": "Just now",
	/**
	 * @echo_label yesterday
	 */
	"yesterday": "Yesterday",
	/**
	 * @echo_label lastWeek
	 */
	"lastWeek": "Last Week",
	/**
	 * @echo_label lastMonth
	 */
	"lastMonth": "Last Month",
	/**
	 * @echo_label secondAgo
	 */
	"secondAgo": "{number} Second Ago",
	/**
	 * @echo_label secondsAgo
	 */
	"secondsAgo": "{number} Seconds Ago",
	/**
	 * @echo_label minuteAgo
	 */
	"minuteAgo": "{number} Minute Ago",
	/**
	 * @echo_label minutesAgo
	 */
	"minutesAgo": "{number} Minutes Ago",
	/**
	 * @echo_label hourAgo
	 */
	"hourAgo": "{number} Hour Ago",
	/**
	 * @echo_label hoursAgo
	 */
	"hoursAgo": "{number} Hours Ago",
	/**
	 * @echo_label dayAgo
	 */
	"dayAgo": "{number} Day Ago",
	/**
	 * @echo_label daysAgo
	 */
	"daysAgo": "{number} Days Ago",
	/**
	 * @echo_label weekAgo
	 */
	"weekAgo": "{number} Week Ago",
	/**
	 * @echo_label weeksAgo
	 */
	"weeksAgo": "{number} Weeks Ago",
	/**
	 * @echo_label monthAgo
	 */
	"monthAgo": "{number} Month Ago",
	/**
	 * @echo_label monthsAgo
	 */
	"monthsAgo": "{number} Months Ago"
}, "", true);

return Labels;
});
