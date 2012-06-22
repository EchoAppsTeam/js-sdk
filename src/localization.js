(function() {

"use strict";

if (Echo.Localization) return;

/**
 * Constructor of class encapsulating language variable mechanics.
 *
 * Static methods should be used for general language variables definition.
 * The class should be instanciated to override language variables within the scope of a particular component. 
 *
 * @param {Object} labels object containing the list of language variables
 * @param {String} namespace string representing the namespace
 * @api public
 */

Echo.Localization = function(labels, namespace) {
	var self = this;
	this.labels = {};
	this.namespace = namespace;
	$.each(labels, function(name, value) {
		self.labels[Echo.Localization._key(name, self.namespace)] = value;
	});
};

/**
 * Method returning the language variable value by its name.
 *
 * Function will return the language variable value corresponding to this instance.
 * If current instance doesn't contain this particular language variable, it will fall back to the defined general language variable list.
 *
 * @param {String} name language variable name
 * @param {Object} data data that should be inserted instead of a placeholder in the language variable
 * @return {String}
 * @api public
 */

Echo.Localization.prototype.label = function(name, data) {
	var key = Echo.Localization._key(name, this.namespace);
	return this.labels[key]
		? Echo.Localization._substitute(this.labels[key], data)
		: Echo.Localization.label(name, this.namespace, data);
};

/**
 * Method to add/override the language variable list in the scope of current instance.
 *
 * @param {Object} labels object containing the list of language variables
 * @api public
 */

Echo.Localization.prototype.extend = function(labels) {
	var self = this;
	$.each(labels, function(name, value) {
		var key = Echo.Localization._key(name, self.namespace);
		self.labels[key] = value;
	});
};

// static interface

Echo.Localization.extend = function(labels, namespace, isDefault) {
	$.each(labels, function(name, value) {
		var key = Echo.Localization._key(name, namespace);
		Echo.Localization._labels[isDefault ? "general" : "custom"][key] = value;
	});
};

Echo.Localization.label = function(name, namespace, data) {
	var key = Echo.Localization._key(name, namespace);
	var label = Echo.Localization._labels["custom"][key] || Echo.Localization._labels["general"][key] || name;
	return Echo.Localization._substitute(label, data);
};

Echo.Localization._labels = { "general": {}, "custom": {} };

Echo.Localization._key = function(name, namespace) {
	return (namespace ? namespace + "." : "") + name;
};

Echo.Localization._substitute = function(label, data) {
	$.each(data || {}, function(key, value) {
		label = label.replace(new RegExp("{" + key + "}", "g"), value);
	});
	return label;
};

})();
