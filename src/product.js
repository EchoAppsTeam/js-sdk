(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.Product")) return;

// static interface

/**
 * @class Echo.Product
 * Foundation class implementing core logic to create products.
 *
 * @extends Echo.Control
 */
Echo.Product = Echo.Utils.inherit(Echo.Control);

/**
 * @static
 * @method
 * Function which creates a product object using it manifest declaration.
 *
 * @param {Object} manifest
 * Specifies the product interface in the predefined way.
 *
 * @param {String} manifest.name
 * Specifies the product name including namespace
 *
 * @param {Object} [manifest.vars]
 * Specifies internal product variables.
 *
 * @param {Object} [manifest.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [manifest.labels]
 * Specifies the list of language labels used in the particular product UI.
 *
 * @param {Object} [manifest.events]
 * Specifies the list of external events used by product.
 *
 * @param {Object} [manifest.methods]
 * Specifies the list of product methods.
 *
 * @param {Object} [manifest.renderers]
 * Specifies the list of product renderers.
 *
 * @param {Object} [manifest.templates]
 * Specifies the list of product templates.
 *
 * @param {Function} [manifest.init]
 * Function called during product initialization.
 *
 * @param {String} [manifest.css]
 * Specifies the CSS rules for the product.
 *
 * @return {Object}
 * Reference to the generated product class.
 */
Echo.Product.create = Echo.Control.create;

/**
 * @static
 * @method
 * Method returning common manifest structure for a product.
 *
 * @param {String} name
 * Product name.
 *
 * @return {Object}
 * Basic product manifest declaration.
 */
Echo.Product.manifest = function(name) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return _manifest;
};

// public interface

/**
 * Method to add and initialize nested component.
 *
 * This function allows to initialize nested component. Component configuration object
 * is constructed by merging the following 2 objects:
 *
 * + this instance config
 * + componentSpec parameter if it's provided
 *
 * @param {Object} componentSpec
 *
 * @param {String} componentSpec.id
 * Nested component id.
 *
 * @param {String} componentSpec.constructor
 * Constructor name for the nested component like "Echo.StreamServer.Control.Stream".
 *
 * @param {Object} [componentSpec.config]
 * Configuration object for the nested component.
 */
Echo.Product.prototype.initComponent = function(componentSpec) {
	this.destroyComponent(componentSpec.id);
	componentSpec.config = componentSpec.config || {};
	if (this.user) {
		componentSpec.config.user = this.user;
	}
	componentSpec.config.parent = componentSpec.config.parent || this.config.getAsHash();
	if (componentSpec.config.parent.components) {
		delete componentSpec.config.parent.components;
	}
	componentSpec.config.plugins = this._mergeSpecsByName(
		$.extend(true, [], this.config.get("components." + componentSpec.id + ".plugins", [])),
		componentSpec.config.plugins || []
	);
	componentSpec.config = this._normalizeComponentConfig(
		$.extend(
			true,
			{},
			this.config.get("components." + componentSpec.id, {}),
			componentSpec.config
		)
	);
	var Component = Echo.Utils.getComponent(componentSpec.constructor);
	this.components = this.components || {};
	this.components[componentSpec.id] = new Component(componentSpec.config);
	return this.components[componentSpec.id];
};

/**
 * Method to destroy nested component by id. If component defined,
 * then will be called "destroy" method of the nested component
 * and the ref removing from the inner container "components".
 *
 * @param {String} id
 * Id of the component to be removed.
 */
Echo.Product.prototype.destroyComponent = function(id) {
	var component = this.get("components." + id);
	if (component) {
		component.destroy();
		delete this.components[id];
	}
};

/**
 * Method to destroy all defined nested components but ids in the exception list.
 *
 * Method can accept one parameter which specifies the exception 
 * nested component ids list. If list is omit or empty, then method destroys
 * all defined nested components.
 *
 * @param {Array} [exceptions]
 * List of nested component to be kept.
 */
Echo.Product.prototype.destroyComponents = function(exceptions) {
	var self = this;
	exceptions = exceptions || [];
	var inExceptionList = function(id) {
		var inList = false;
		$.each(exceptions, function(_id, exception) {
			if (exception === id) {
				inList = true;
				return false; // break
			}
		});
		return inList;
	};
	$.each(this.components, function(id) {
		if (!inExceptionList(id)) {
			self.destroyComponent(id);
		}
	});
};

// private interface

Echo.Product.prototype._mergeSpecsByName = function(specs) {
	var self = this;
	var getSpecIndex = function(spec, specs) {
		var idx = -1;
		$.each(specs, function(i, _spec) {
			if (spec.name === _spec.name) {
				idx = i;
				return false;
			}
		});
		return idx;
	};
	// flatten update specs list
	var updateSpecs = $.map(Array.prototype.slice.call(arguments, 1) || [], function(spec) {
		return spec;
	});
	return Echo.Utils.foldl(specs, updateSpecs, function(extender) {
		var id = getSpecIndex(extender, specs);
		if (!~id) {
			specs.push(extender);
			return;
		}
		if (extender.name === specs[id].name) {
			if (extender.nestedPlugins) {
				specs[id].nestedPlugins = specs[id].nestedPlugins || [];
				self._mergeSpecsByName(specs[id].nestedPlugins, extender.nestedPlugins);
				// delete nested plugins in the extender to avoid override effect after extend below
				delete extender.nestedPlugins;
			}
		}
		specs[id] = $.extend(true, {}, specs[id], extender);
	});
};

Echo.Product.prototype._normalizeComponentConfig = function(config) {
	var self = this;
	Echo.Utils.foldl(config, ["appkey", "apiBaseURL", "submissionProxyURL"], function(key, acc) {
		acc[key] = acc[key] || self.config.get(key);
	});
	var normalize = function(value) {
		if (typeof value === "string") {
			return self.substitute({
				"template": value,
				"strict": true
			});
		} else if ($.isPlainObject(value)) {
			return Echo.Utils.foldl({}, value, function(value, acc, key) {
				acc[key] = normalize(value);
			});
		} else if ($.isArray(value)) {
			return $.map(value, function(element) {
				return normalize(element);
			});
		} else {
			return value;
		}
	};
	return normalize(config);
};

})(Echo.jQuery);
