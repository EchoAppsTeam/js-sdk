(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Configuration")) return;

/**
 * @class Echo.Configuration
 * Class implements the interface for convenient work with different
 * configurations. The Echo.Configuration class is used in various
 * places of Echo JS SDK components.
 *
 * Example:
 *
 *     var config = new Echo.Configuration({
 *         "key1": "value1",
 *         "key2": {
 *             "key3": "value3"
 *         }
 *     });
 *
 *     config.get("key1"); // returns "value1"
 *     config.set("key1", "new_value1");
 *
 *     config.get("key1"); // returns "new_value1"
 *
 *     config.get("key2.key3"); // returns "value3"
 *
 * @package environment.pack.js
 *
 * @constructor
 * Class constructor, which accepts user defined and default configuration
 * and applies the normalization function to the necessary
 * (defined in normalization function) fields.
 *
 * @param {Object} master
 * Specifies the primary source of configuration. Usually the configuration
 * defined in component config.
 *
 * @param {Object} [slave]
 * The set of default values which will be applied if no corresponding value
 * found in the primary (master) config.
 *
 * @param {Function} [normalizer]
 * Function which is applied for every field value. You can use this function
 * if any additional processing of the config field value is required.
 *
 * @return {Object}
 * Reference to the given Echo.Configuration class instance.
 */
Echo.Configuration = function(master, slave, normalizer) {
	this.data = {};
	this.cache = {};
	this.normalize = normalizer || function(key, value) { return value; };
	$.each(this._merge(master, slave), $.proxy(this.set, this));
};

/**
 * Method to access specific config field.
 *
 * This function returns the corresponding value of the given key or the
 * default value if specified in the second argument. Method provides the
 * ability to extract the value located on any level of the config structure,
 * in case the config contains JS objects as values for some keys.
 *
 * @param {String} key
 * Specifies the key for data extraction.
 *
 * @param {Object} [defaults]
 * Default value if no corresponding key was found in the config.
 * Note: only the `undefined` JS statement triggers the default value usage.
 * The `false`, `null`, `0`, `[]` are considered as a proper value.
 *
 * @return {Mixed}
 * Corresponding value found in the config.
 */
Echo.Configuration.prototype.get = function(key, defaults) {
	if (typeof key !== "string") {
		key = key.join(".");
	}
	if (!this.cache.hasOwnProperty(key)) {
		this.cache[key] = Echo.Utils.get(this.data, key);
	}
	return typeof this.cache[key] === "undefined" ? defaults : this.cache[key];
};

/**
 * Method to define specific config field value.
 *
 * This function allows to define the value for the corresponding field in
 * the config. Method provides the ability to define the value located on
 * any level of the config structure, in case the config contains JS objects
 * as values for some keys.
 *
 * @param {String} key
 * Specifies the key where the given data should be stored.
 *
 * @param {Mixed} value
 * The corresponding value which should be defined for the key.
 */
Echo.Configuration.prototype.set = function(key, value) {
	delete this.cache[key];
	if (typeof value === "object") {
		this._clearCacheByPrefix(key);
	}
	Echo.Utils.set(this.data, key, this.normalize(key.split(".").pop(), value));
};

/**
 * Method to remove specific config field.
 *
 * This function allows to remove the value associated with the given key.
 * If the key contains a complex structure (such as objects or arrays), it
 * will be removed as well.
 *
 * @param {String} key
 * Specifies the key which should be removed from the configuration.
 */
Echo.Configuration.prototype.remove = function(key) {
	var keys = key.split(".");
	var field = keys.pop();
	var data = Echo.Utils.get(this.data, keys, this.data);
	Echo.Utils.set(this.cache, key, undefined);
	delete this.cache[key];
	delete data[field];
};

/**
 * Method to extend a given config instance with the additional values.
 *
 * This function provides the ability to extend a given instance of the
 * config with the extra set of data. The new data overrides the existing
 * values.
 *
 * @param {Object} extra
 * The corresponding value which should be defined for the key.
 */
Echo.Configuration.prototype.extend = function(extra) {
	$.each(extra, $.proxy(this.set, this));
};

/**
 * Method to export config data into a single JS object.
 *
 * This function returns the JS object which corresponds to the current
 * configuration object values.This method might be very helpful for debugging
 * or transferring configuration between the components.
 */
Echo.Configuration.prototype.getAsHash = function() {
	return $.extend({}, this.data);
};

Echo.Configuration.prototype._clearCacheByPrefix = function(prefix) {
	var self = this;
	prefix += ".";
	$.each(this.cache, function(key, data) {
		// key starts with prefix
		if (!key.indexOf(prefix)) {
			delete self.cache[key];
		}
	});
};

Echo.Configuration.prototype._merge = function(master, slave) {
	var self = this, target, src, options;

	for (var i = 0; i < arguments.length; i++) {
		options = arguments[i];
		if ($.isPlainObject(options)) {
			target = target || {};
			$.each(options, function(name, copy) {
				src = target[name];
				if ($.isPlainObject(src)) {
					target[name] = self._merge(src, copy);
				} else if (!target.hasOwnProperty(name)) {
					target[name] = self._merge(copy);
				}
			});
		} else if ($.isArray(options)) {
			target = $.map(options, function(option) {
				return self._merge(option);
			});
		} else if (typeof target === "undefined" && typeof options !== "undefined") {
			target = options;
		}
	}
	return target;
};

})(Echo.jQuery);
