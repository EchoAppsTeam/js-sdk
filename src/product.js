(function(jQuery) {
"use strict";

var $ = jQuery;
if (Echo.Utils.isComponentDefined("Echo.Product")) return;

/**
 * @class Echo.Product
 * Foundation class implementing core logic to create products.
 *
 * @extends Echo.Control
 */
Echo.Product = function() {};

Echo.Utils.inherit(Echo.Product, Echo.Control);

/**
 * @static
 * @method
 * Function which creates a product object using it manifest declaration.
 *
 * @inheritdoc Echo.Control#create
 */
Echo.Product.create = Echo.Control.create;

Echo.Control.addInitializer(
	Echo.Product,
	["controls", ["init", "refresh"]],
	{"after": "init:async"}
);

Echo.Product.manifest = function(name) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return $.extend(_manifest, {
		"controls": []
	});
};

Echo.Product.prototype._initializers.controls = function() {
	this.controls = this.controls || {};
	var controlsOrder = this._mergeSpecsByName(
		$.map(this._manifest("controls"), function(el) {
			return $.extend(true, {}, el);
		}),
		$.map(this.config.get("controls", []), function(el) {
			return $.extend(true, {}, el);
		})
	);
	$.map(controlsOrder, $.proxy(this.addControl, this));
};

Echo.Product.prototype.addControl = function(controlSpec) {
	this.destroyControl(controlSpec.name);
	controlSpec.config = controlSpec.config || {};
	if (this.user) {
		controlSpec.config.user = this.user;
	}
	controlSpec.config.parent = controlSpec.config.parent || this.config.getAsHash();
	delete controlSpec.config.parent.controls;
	controlSpec.config = this._normalizeControlConfig(controlSpec.config);
	var Control = Echo.Utils.getComponent(controlSpec.name);
	this.controls[controlSpec.name] = new Control(controlSpec.config);
	return this.controls[controlSpec.name];
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
			if (extender.plugins || extender.nestedPlugins) {
				if (extender.plugins) {
					specs[id].plugins = specs[id].plugins || [];
					self._mergeSpecsByName(specs[id].plugins, extender.plugins);
				}
				if (extender.nestedPlugins) {
					specs[id].nestedPlugins = specs[id].nestedPlugins || []
					self._mergeSpecsByName(specs[id].nestedPlugins, extender.nestedPlugins);
					// delete nested plugins in the extender to avoid override effect after extend below
					delete extender.nestedPlugins;
				}
			}
			specs[id] = $.extend(true, {}, specs[id], extender);
		}
	});
};

Echo.Product.prototype.destroyControl = function(name) {
	var control = this.get("controls." + name);
	control && control.destroy();
	delete this.controls[name];
};

Echo.Product.prototype.destroyControls = function(exceptions) {
	var self = this;
	exceptions = exceptions || [];
	var inExceptionList = function(name) {
		var inList = false;
		$.each(exceptions, function(id, exception) {
			if (exception === name) {
				inList = true;
				return false; // break
			}
		});
		return inList;
	};
	$.each(this.controls, function(name) {
		if (!inExceptionList(name)) {
			self.destroyControl(name);
		}
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

Echo.Product.prototype._getSubstitutionInstructions = function() {
	var self = this;
	var instructions = Echo.Product.parent._getSubstitutionInstructions.call(this);
	return $.extend(instructions, {
		"target": function(key) {
			return self.view.get(key);
		}
	});
};

})(Echo.jQuery);
