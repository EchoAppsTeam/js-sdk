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
 * @inheritdoc Echo.Control#create
 */
Echo.Product.create = Echo.Control.create;

/**
 * @static
 * @method
 * Method returning common manifest structure for a product.
 *
 * @param {String} name
 * Specifies product name.
 *
 * @param {Array} [controlIds]
 * Specifies a list of nested control identificators that will be
 * used to declare their names and configuration options.
 * 
 * @return {Object}
 * Basic product manifest declaration.
 *
 * @inheritdoc Echo.Control#create
 */
Echo.Product.manifest = function(name, controlIds) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return $.extend(_manifest, {
		"controls": Echo.Utils.foldl({}, controlIds || [], function(controlId, acc) {
			acc[controlId] = {};
		})
	});
};

// public interface

/**
 * Method to add and initialize nested control.
 *
 * This function allows to initialize nested control and setting ref
 * to the inner continer "controls". Also it merge configs from manifest,
 * config from the constructor call and from the the parameter if defined.
 *
 * @param {String} id
 * Defines the nested control id.
 *
 * @param {Object} [controlSpec]
 * Defines the specification for the nested control.
 *
 * @param {String} [controlSpec.name]
 * Defines a full nested control name like "Echo.StreamServer.Control.Stream".
 *
 * @param {Object} [controlSpec.config]
 * Defines a config for the nested control.
 */
Echo.Product.prototype.addControl = function(id, controlSpec) {
	this.destroyControl(id);
	controlSpec = controlSpec || {};
	controlSpec.name = controlSpec.name || this._getControlNameById(id);
	controlSpec.config = controlSpec.config || {};
	if (this.user) {
		controlSpec.config.user = this.user;
	}
	controlSpec.config.parent = controlSpec.config.parent || this.config.getAsHash();
	delete controlSpec.config.parent.controls;
	controlSpec.config.plugins = this._mergeSpecsByName(
		Echo.Utils.getNestedValue(this._manifest("controls"), id + ".config.plugins", []),
		this.config.get("controls." + id + ".config.plugins", []),
		controlSpec.config.plugins || []
	);
	controlSpec.config = this._normalizeControlConfig(
		$.extend(
			true,
			{},
			Echo.Utils.getNestedValue(this._manifest("controls"), id + ".config", {}),
			this.config.get("controls." + id + ".config", {}),
			controlSpec.config
		)
	);
	var Control = Echo.Utils.getComponent(controlSpec.name);
	this.controls = this.controls || {};
	this.controls[id] = new Control(controlSpec.config);
	return this.controls[id];
};

/**
 * Method to destroy nested control by id. If control defined,
 * then will be called "destroy" method of the nested control
 * and it removed from the inner container "controls";
 *
 * @param {String} id
 * Specifies the which indicates what control should be removed.
 */
Echo.Product.prototype.destroyControl = function(id) {
	var control = this.get("controls." + id);
	if (control) {
		control.destroy();
		delete this.controls[id];
	}
};

/**
 * Method to destroy all defined nested controls but ids in exception list.
 *
 * Method can accept one parameter which specifies the exception 
 * nested control id list. If list is omit or empty, then method destroyes
 * all defined nested controls.
 *
 * @param {Array} [exceptions]
 * Specifies nested control ids exception list.
 */
Echo.Product.prototype.destroyControls = function(exceptions) {
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
	$.each(this.controls, function(id) {
		if (!inExceptionList(id)) {
			self.destroyControl(id);
		}
	});
};

// private interface

Echo.Product.prototype._getControlNameById = function(id) {
	return Echo.Utils.getNestedValue(this._manifest("controls"), id + ".name", "") || this.config.get("controls." + id + ".name");
};

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

Echo.Product.prototype._normalizeControlConfig = function(config) {
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
