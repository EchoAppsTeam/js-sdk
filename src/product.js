(function() {
 
Echo.ProductView = function() {};

Echo.Utils.inherit(Echo.ProductView, Echo.Control);

Echo.ProductView.create = Echo.Control.create;

Echo.ProductView.manifest = Echo.Control.manifest;

(function() {

var list = Echo.ProductView.prototype._initializers.list.slice(0);
list.splice(list.length - 4, 0, ["controls", ["init", "refresh"]]);
Echo.ProductView.prototype._initializers = $.extend({}, Echo.ProductView.prototype._initializers);
Echo.ProductView.prototype._initializers.list = list;

})();

Echo.ProductView.prototype._initializers.controls = function() {
	var view = this;
	this.controls = this.controls || {};
	$.each(this._manifest("controls"), function(name, controlConfig) {
		view.controls[name] = null;
	});
};

Echo.ProductView.prototype._normalizeControlConfig = function(config) {
	var self = this;
	Echo.Utils.foldl(config, ["appkey", "apiBaseURL", "submissionProxyURL"], function(key, acc) {
		acc[key] = acc[key] || self.config.get(key);
	});
	var normalize = function(value) {
		if (typeof value == "string") {
			return self.substitute(value);
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

Echo.ProductView.prototype._initControl = function(controlSpec, controlConfig) {
	this._destroyControl(controlSpec.name);

	// we need to copy apps config to avoid changes in the common config
	var parentConfig = this.config.getAsHash();
	controlConfig.parent = controlConfig.parent || parentConfig;
	controlConfig = this._normalizeControlConfig(
		$.extend(true, 
			{},
			this._manifest("controls")[controlSpec.name].config,
			controlConfig
		)
	);
	var Control = Echo.Utils.getComponent(this._manifest("controls")[controlSpec.name].control);
	this.controls[controlSpec.name] = new Control(controlConfig);
	return this.controls[controlSpec.name];
};

Echo.ProductView.prototype._updateControlPlugins = function(plugins, updatePlugins) {
	var self = this;
	var getPluginIndex = function(plugin, plugins) {
		var idx = -1;
		$.each(plugins, function(i, _plugin) {
			if (plugin.name === _plugin.name) {
				idx = i;
				return false;
			}
		});
		return idx;
	};
	return Echo.Utils.foldl(plugins, updatePlugins, function(extender) {
		var id = getPluginIndex(extender, plugins);
		if (!~id) {
			plugins.push(extender);
			return;
		}
		if (extender.name === plugins[id].name) {
			if (extender.nestedPlugins && plugins[id].nestedPlugins) {
				self._updateAppPlugins(plugins[id].nestedPlugins, extender.nestedPlugins);
				// delete nested plugins in the extender to avoid override effect after extend below
				delete extender.nestedPlugins;
			}
			plugins[id] = $.extend(true, {}, plugins[id], extender);
		}
	});
};

Echo.ProductView.prototype._destroyControl = function(name) {
	var control = this.get("controls." + name);
	control && control.destroy();
	delete this.controls[name];
};

Echo.ProductView.prototype._destroyControls = function(exceptions) {
	var self = this;
	exceptions = exceptions || [];
	var inExceptionList = function(name) {
		var inList = false;
		$.each(exceptions, function(id, exception) {
			if (exception.name == name) {
				inList = true;
				return false; // break
			}
		});
		return inList;
	};
	$.each(this.controls, function(name) {
		if (!inExceptionList(name)) {
			self._destroyControl(name);
		}
	});
};

Echo.ProductView.prototype.getControl = function(name) {
	return Echo.Utils.getComponent(name);
};

})();

(function() {

/**
 * @class Echo.Product
 * Foundation class implementing core logic to create products.
 * @extends Echo.Control
 */
Echo.Product = function() {};

Echo.Utils.inherit(Echo.Product, Echo.Control);

/**
 * @static
 * @method
 * Function which creates a product object using it manifest declaration.
 * @inheritdoc Echo.Control#create
 */
Echo.Product.create = Echo.Control.create;

/**
 * @static
 * @method
 * @inheritdoc Echo.Control#manifest
 */
Echo.Product.manifest = function(name) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return $.extend(_manifest, {
		"views": {}
	});
};

/**
 * @method
 * Accessor method to get product view by its name.
 * @param {String} name (required) Specifies the name of the view to be accessed.
 * @return {Class} Class referense.
 */
Echo.Product.prototype.getView = function(name) {
	return Echo.Utils.getComponent(this.name + "." + name);
};

Echo.Product.prototype.initView = function(name, config) {
	var View = this.getView(name);
	config = config || {};
	config.parent = config.parent || this.config.getAsHash();
	// FIXME
	config.appkey = config.parent.appkey;
	this.views = this.views || {};
	this.views[name] = new View(config);
	return this.views[name];
};

Echo.Product.prototype.destroyView = function(name) {
	var view = this.get("views." + name);
	if (view && view.controls) {
		$.each(view.controls, function(controlName, control) {
			control.destroy();
			delete view.controls[controlName];
		});
		//view.destroy();
		//delete this.views[name];
	}
};

(function() {

var list = Echo.Product.prototype._initializers.list.slice(0);
list.splice(list.length - 4, 0, ["views", ["init", "refresh"]]);
Echo.Product.prototype._initializers = $.extend({}, Echo.Product.prototype._initializers);
Echo.Product.prototype._initializers.list = list;

})();

Echo.Product.prototype._initializers.views = function() {
	var product = this;
	$.each(this._manifest("views"), function(name, view) {
		view.inherits = view.inherits || Echo.ProductView;
		Echo.ProductView.create(
			$.extend(true, Echo.ProductView.manifest(product.name + "." + name), view)
		);
	});
};

})();
