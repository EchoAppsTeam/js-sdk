(function() {
 
Echo.ProductView = function() {};

Echo.Utils.inherit(Echo.ProductView, Echo.Control);

Echo.ProductView.create = Echo.Control.create;

Echo.ProductView.manifest = function(name) {
	var _manifest = Echo.ProductView.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.ProductView;
	return $.extend(_manifest, {
		"controls": {}
	});
};

Echo.Control.addInitializer(
	Echo.ProductView,
	["controls", ["init", "refresh"]],
	{"after": "user:async"}
);

Echo.ProductView.prototype._initializers.controls = function() {
	var view = this;
	this.controls = this.controls || {};
	$.each(this._manifest("controls"), function(name, controlConfig) {
		view.controls[name] = null;
	});
};

Echo.ProductView.prototype.initControl = function(name, controlConfig) {
	this.destroyControl(name);
	controlConfig = controlConfig || {};
	// we need to copy apps config to avoid changes in the common config
	var parentConfig = this.config.getAsHash();
	controlConfig.parent = controlConfig.parent || parentConfig;
	controlConfig.plugins = this._updateControlPlugins(
		Echo.Utils.getNestedValue(this._manifest("controls"), name + ".config.plugins", []),
		this.config.get("controls." + name + ".config.plugins", []),
		controlConfig.plugins || []
	);
	controlConfig = this._normalizeControlConfig(
		$.extend(true, 
			{},
			Echo.Utils.getNestedValue(this._manifest("controls"), name + ".config", {}),
			this.config.get("controls." + name + ".config", {}),
			controlConfig
		)
	);
	var Control = Echo.Utils.getComponent(this._manifest("controls")[name].control);
	this.controls[name] = new Control(controlConfig);
	return this.controls[name];
};

Echo.ProductView.prototype._updateControlPlugins = function(plugins) {
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
	// flatten update plugins list
	var updatePlugins = $.map(Array.prototype.slice.call(arguments, 1) || [], function(plugin) {
		return plugin;
	});
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

Echo.ProductView.prototype.destroyControl = function(name) {
	var control = this.get("controls." + name);
	control && control.destroy();
	delete this.controls[name];
};

Echo.ProductView.prototype.destroyControls = function(exceptions) {
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

Echo.ProductView.prototype.getControl = function(name) {
	return Echo.Utils.getComponent(name);
};

Echo.ProductView.prototype._normalizeControlConfig = function(config) {
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

})();

(function() {

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

/**
 * @static
 * @inheritdoc Echo.Control#manifest
 */
Echo.Product.manifest = function(name, views) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return $.extend(_manifest, {
		"views": $.extend(true, {}, Echo.Utils.foldl({}, views, function(_name, acc) {
				var viewName = name + ".Views." + _name;
				acc[_name] = Echo.ProductView.manifest(viewName);
			})
		),
		"assemblers": {}
	});
};

Echo.Control.addInitializer(
	Echo.Product,
	["views", ["init", "refresh"]],
	{"after": "user:async"}
);

Echo.Product.prototype._initializers.views = function() {
	$.each(this._manifest("views"), function(name, view) {
		Echo.ProductView.create(view);
	});
};

/**
 * Accessor method to get product view by its name.
 *
 * @param {String} name
 * Specifies the name of the view to be accessed.
 *
 * @return {Object}
 * Class referense.
 */
Echo.Product.prototype.getView = function(name) {
	return Echo.Utils.getComponent(this.name + ".Views." + name);
};

Echo.Product.prototype.initView = function(name, config) {
	this.destroyView(name);
	var View = this.getView(name);
	config = config || {};
	config.parent = config.parent || this.config.getAsHash();
	config.appkey = config.parent.appkey;
	config = $.extend(true, {}, this.config.get("views." + name), config);
	this.views = this.views || {};
	this.views[name] = new View(config);
	return this.views[name];
};

Echo.Product.prototype.destroyViews = function() {
	var self = this;
	$.each(this.get("views"), function(name) {
		self.destroyView(name);
	});
};

Echo.Product.prototype.destroyView = function(name) {
	var view = this.get("views." + name);
	if (view && view.controls) {
		view.destroyControls();
		view.destroy();
		delete this.views[name];
	}
};

Echo.Product.prototype.assemble = function(viewName) {
	var args = Array.prototype.slice.call(arguments, 1);
	return this._manifest("assemblers")[viewName].apply(this, args);
};

})();
