define("echo/app", [
	"jquery",
	"echo/utils",
	"echo/control"
], function($, Utils, Control) {
"use strict";

// static interface

/**
 * @class App
 * Foundation class implementing core logic to create applications.
 *
 * You can find instructions on how to build your application in the ["How to develop an app"](#!/guide/how_to_develop_app) guide.
 *
 * @package environment.pack.js
 *
 * @extends Control
 */
App = Utils.inherit(Control);

/**
 * @static
 * @method
 * The function which creates an application JS class using its manifest declaration.
 *
 * @param {Object} manifest
 * Specifies the application interface in the predefined way.
 *
 * @param {String} manifest.name
 * Specifies the application name including namespace
 *
 * @param {Object} [manifest.vars]
 * Specifies internal application variables.
 *
 * @param {Object} [manifest.config]
 * Specifies the configuration data with the ability to define default values.
 *
 * @param {Object} [manifest.labels]
 * Specifies the list of language labels used in the particular application UI.
 *
 * @param {Object} [manifest.events]
 * Specifies the list of external events used by application.
 *
 * @param {Object} [manifest.methods]
 * Specifies the list of application methods.
 *
 * @param {Object} [manifest.renderers]
 * Specifies the list of application renderers.
 *
 * @param {Object} [manifest.templates]
 * Specifies the list of application templates.
 *
 * @param {Function} [manifest.init]
 * Function called during application initialization.
 *
 * @param {String} [manifest.css]
 * Specifies the CSS rules for the application.
 *
 * @return {Object}
 * Reference to the generated application class.
 */
App.create = Control.create;

/**
 * @static
 * @method
 * Method returning the common manifest structure for an application.
 *
 * @param {String} name
 * App name.
 *
 * @return {Object}
 * Basic application manifest declaration.
 */
App.manifest = function(name) {
	var _manifest = App.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || App;
	return _manifest;
};

/**
 * @static
 * Checks if app is already defined.
 *
 * @param {Mixed} manifest
 * Control manifest or control name.
 *
 * @return {Boolean}
 */
App.isDefined = Control.isDefined;

// public interface

/**
 * Method to add and initialize nested component.
 *
 * This function allows to initialize nested component. Component configuration object
 * is constructed by merging the following 2 objects:
 *
 * + this instance config
 * + spec parameter if it's provided
 *
 * @param {Object} spec
 *
 * @param {String} spec.id
 * Nested component id.
 *
 * @param {String} spec.component
 * Constructor name for the nested component like "StreamServer.Control.Stream".
 *
 * @param {Object} [spec.config]
 * Configuration object for the nested component.
 */
App.prototype.initComponent = function(spec) {
	this.destroyComponent(spec.id);
	spec.config = spec.config || {};
	if (this.user) {
		spec.config.user = this.user;
	}
	spec.config.parent = spec.config.parent || this.config.getAsHash();
	if (spec.config.parent.components) {
		delete spec.config.parent.components;
	}
	spec.config.plugins = this._mergeSpecsByName(
		$.extend(true, [], this.config.get("components." + spec.id + ".plugins", [])),
		spec.config.plugins || []
	);
	spec.config = this._normalizeComponentConfig(
		$.extend(true, {}, this.config.get("components." + spec.id, {}), spec.config)
	);
	var Component = Utils.getComponent(spec.component);
	this.set("components." + spec.id, new Component(spec.config));
	return this.getComponent(spec.id);
};

/**
 * Method to retrieve the initialized component by id.
 *
 * @param {String} id
 * Id of the component to be retrieved.
 *
 * @return {Object}
 * The link to the corresponding component or 'undefined'
 * in case no control with the given id was found.
 */
App.prototype.getComponent = function(id) {
	return this.get("components." + id);
};

/**
 * Method to destroy a nested component by id. If the component is defined,
 * then the "destroy" method of the nested component is called
 * and the reference is removed from the inner "components" container.
 *
 * @param {String} id
 * Id of the component to be removed.
 */
App.prototype.destroyComponent = function(id) {
	var component = this.getComponent(id);
	if (component) {
		component.destroy();
		this.remove("components." + id);
	}
};

/**
 * Method to destroy all defined nested components by their ids in the exception list.
 *
 * Method can accept one parameter which specifies the nested exception
 * component ids list. If the list is omitted or empty, then the method destroys
 * all defined nested components.
 *
 * @param {Array} [exceptions]
 * List of nested component to be kept.
 */
App.prototype.destroyComponents = function(exceptions) {
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

App._merge = Control._merge;

App._manifest = Control._manifest;

App.prototype._mergeSpecsByName = function(specs) {
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
	return Utils.foldl(specs, updateSpecs, function(extender) {
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

App.prototype._normalizeComponentConfig = function(config) {
	var self = this;
	// extend the config with the default fields from manifest
	Utils.foldl(config, this._manifest("config"), function(value, acc, key) {
		// do not override existing values in data
		if (typeof acc[key] === "undefined") {
			acc[key] = self.config.get(key);
		}
	});
	var normalize = function(value) {
		if (typeof value === "string") {
			return self.substitute({
				"template": value,
				"strict": true
			});
		} else if ($.isPlainObject(value)) {
			return Utils.foldl({}, value, function(value, acc, key) {
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

return App;
});
