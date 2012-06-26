(function() {

"use strict";

if (Echo.Labels) return;

/**
 * Constructor of class encapsulating language variable mechanics.
 *
 * The class should be instantiated to override language variables within the scope of a particular component instance.
 * Language variables overriden with the instance of this class will have the highest priority.
 * Static methods should be used for general language variable definition and localization purposes.
 *
 * @param {Object} labels flat object containing the list of language variables to be initialized
 * @param {String} namespace string representing the component namespace
 * @api public
 */

Echo.Labels = function(labels, namespace) {
	var self = this;
	this.storage = {};
	this.namespace = namespace;
	$.each(labels, function(name, value) {
		self.storage[Echo.Labels._key(name, self.namespace)] = value;
	});
};

/**
 * Method returning the language variable value by its name within the scope of a particular component instance.
 *
 * Function will return the language variable value corresponding to this instance.
 * If current instance doesn't contain this particular language variable, it will fall back to the global language variable list.
 *
 * @param {String} name language variable name
 * @param {Object} data flat object data that should be inserted instead of a placeholder in the language variable
 * @return {String}
 * @api public
 */

Echo.Labels.prototype.get = function(name, data) {
	var key = Echo.Labels._key(name, this.namespace);
	return this.storage[key]
		? Echo.Labels._substitute(this.storage[key], data)
		: Echo.Labels.get(name, this.namespace, data);
};

/**
 * Method to add/override the language variable list within the scope of a particular component instance.
 *
 * @param {Object} labels flat object containing the list of language variables to be added/overriden 
 * @api public
 */

Echo.Labels.prototype.set = function(labels) {
	var self = this;
	$.each(labels, function(name, value) {
		var key = Echo.Labels._key(name, self.namespace);
		self.storage[key] = value;
	});
};

// Static interface
/**
 * Function to add/override the language variable list in the global scope.
 *
 * Function should be used to define the default language variable list.
 * In this use case the `isDefault` param should be set to `true`.
 * Function should also be used for localization purposes.
 * In this case the `isDefault` param can be omitted or set to `false`.
 * The values overriden with the function will be available globally.
 *
 * @param {Object} labels object containing the list of language variables
 * @param {String} namespace string representing the namespace
 * @param {Boolean} isDefault flag switching the localization mode to setting defaults one
 * @api public
 */

Echo.Labels.set = function(labels, namespace, isDefault) {
	$.each(labels, function(name, value) {
		var key = Echo.Labels._key(name, namespace);
		Echo.Labels._storage[isDefault ? "general" : "custom"][key] = value;
	});
};

/**
 * Function returning the language variable value by its name from the global language variable list.
 *
 * Function will return the language variable value from the global language variable list.
 * It also takes into consideration the localized values.
 * If value of the particular language varibale is not found in the localization list it will fall back to the default language variable value.
 *
 * @param {String} name language variable name
 * @param {String} namespace string representing the namespace
 * @param {Object} data flat object data that should be inserted instead of a placeholder in the language variable 
 * @return {String}
 * @api public
 */

Echo.Labels.get = function(name, namespace, data) {
	var key = Echo.Labels._key(name, namespace);
	var label = Echo.Labels._storage["custom"][key] || Echo.Labels._storage["general"][key] || name;
	return Echo.Labels._substitute(label, data);
};

Echo.Labels._storage = { "general": {}, "custom": {} };

Echo.Labels._key = function(name, namespace) {
	return (namespace ? namespace + "." : "") + name;
};

Echo.Labels._substitute = function(label, data) {
	$.each(data || {}, function(key, value) {
		label = label.replace(new RegExp("{" + key + "}", "g"), value);
	});
	return label;
};

})();
