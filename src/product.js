(function() {
 
if (Echo.Utils.isComponentDefined("Echo.ProductView")) return;

Echo.ProductView = function() {};

Echo.Utils.inherit(Echo.ProductView, Echo.Control);

Echo.ProductView.create = Echo.Control.create;

Echo.ProductView.manifest = Echo.Control.manifest;

$.map(["_initializersList", "_refreshInitializersList"], function(listName) {
	var list = Echo.ProductView.prototype[listName].slice(0);
	list.splice(list.length - 1, 0, "controls");
	Echo.ProductView.prototype[listName] = list;
});

Echo.ProductView.prototype._initializers.controls = function() {
	var view = this;
	this.controls = this.controls || {};
	$.each(this._manifest("controls"), function(name, controlConfig) {
		view.controls[name] = {};
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
	controlConfig = this._normalizeControlConfig(
		$.extend(true, 
			{},
			// FIXME: should be in config
			this._manifest(controlSpec.name),
			controlConfig
		)
	);
	var Control = Echo.Utils.getComponent(controlSpec.name);
	console.log(controlConfig);
	this.controls[controlSpec.name] = new Control(controlConfig);
	console.log(this.controls);
	return this.controls[controlSpec.name];
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

if (Echo.Utils.isComponentDefined("Echo.Product")) return;

Echo.Product = function() {};

Echo.Utils.inherit(Echo.Product, Echo.Control);

Echo.Product.create = Echo.Control.create;

Echo.Product.manifest = function(name) {
	var _manifest = Echo.Product.parent.constructor.manifest.apply(this, arguments);
	_manifest.inherits = _manifest.inherits || Echo.Product;
	return $.extend(_manifest, {
		"views": {}
	});
};

Echo.Product.prototype.getView = function(name) {
	return Echo.Utils.getComponent(this.name + "." + name);
};

$.map(["_initializersList", "_refreshInitializersList"], function(listName) {
	var list = Echo.Product.prototype[listName].slice(0);
	list.splice(list.length - 1, 0, "views");
	Echo.Product.prototype[listName] = list;
});

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
