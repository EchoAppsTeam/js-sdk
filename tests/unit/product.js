(function($) {

var suite = Echo.Tests.Unit.Product = function() {};

suite.prototype.info = {
	"className": "Echo.Product",
	"functions": [
		"create",
		"initView",
		"getView",
		"destroyView",
		"destroyViews",
		"assemble"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.PublicInterfaceTests = {
	"config": {
		"async": true
	},
	"check": function() {
		var self = this;
		var manifest = {
			"name": suite.getProductClassName(),
			"vars": {},
			"config": {},
			"labels": {},
			"events": {},
			"methods": {},
			"renderers": {},
			"templates": {},
			"dependencies": [],
			"destroy": undefined,
			"views": {},
			"assemblers": {}
		};
		var _manifest = Echo.Product.manifest(manifest.name, []);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.inherits;
		
		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");
		
		suite.createControls(["Control1", "Control2", "Control3"]);
		
		var views = {
			"View1": {
				"Control1": {
					"control": "Control1",
					"config": {
						"target": this.config.target,
						"appkey": this.config.appkey
					}
				},
				"Control2": {
					"control": "Control1",
					"config": {
						"target": this.config.target,
						"appkey": this.config.appkey
					}
				}
			},
			"View2": {
				"Control3": {
					"control": "Control3",
					"config": {
						"target": this.config.target,
						"appkey": this.config.appkey
					}
				}
			}
		};
		var assemblers = {
			"View1": function() {
				QUnit.ok(true,
					"Checking that assembler function was called");
			},
			"View2": function(param) {
				QUnit.equal(param, "param",
					"Checking that assembler function was called with correct parameters");
			}
		};
		suite.createProduct("TestProduct", views, assemblers);
		this.sequentialAsyncTests([
			"initView",
			"getView",
			"destroyView",
			"destroyViews",
			"assemble"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.initView = function(callback) {
	var self = this;
	var check = function() {
		var product = this;
		var view = this.initView("View1", {
			"target": self.config.target,
			"appkey": self.config.appkey,
			"key": "value"
		});
		QUnit.ok(this.views["View1"],
			"Checking that view was added to product after initView()");
		view.initControl("Control1", {
			"ready": function() {
				QUnit.ok(true,
					"Checking that control was rendered after initView() and initControl()");
				product.destroy();
				callback();
			}
		});
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.getView = function(callback) {
	var self = this;
	var check = function() {
		var product = this;
		this.initView("View1", {
			"target": self.config.target,
			"appkey": self.config.appkey
		});
		QUnit.deepEqual(this.getView("View1"), window.TestProduct.Views.View1,
			"Checking that getControl returns a proper link");
		QUnit.equal(this.getView("FakeView"), undefined,
			"Checking that getControl() returns undefined with fake view name");
		this.destroy();
		callback();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.destroyView = function(callback) {
	var self = this;
	var check = function() {
		var product = this;
		var view = this.initView("View1", {
			"target": self.config.target,
			"appkey": self.config.appkey
		});
		var control = view.initControl("Control1");
		control.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking that Control.destroy() was called after Product.destroy()");
		});
		view.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking that View.destroy() was called after Product.destroy()");
		});
		this.destroyView();
		this.destroy();
		callback();
	}
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	})
};

suite.prototype.cases.destroyViews = function(callback) {
	var self = this;
	var check = function() {
		var product = this;
		var views = ["View1", "View2"];
		$.map(views, function(view) {
			product.initView(view, {
				"target": self.config.target,
				"appkey": self.config.appket
			});
		});
		this.destroyViews();
		QUnit.ok(!this.views["View1"] && !this.views["View2"],
			"Checking that all views were deleted from product");
		this.destroy();
		callback();
	}
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	})
};

suite.prototype.cases.assemble = function(callback) {
	var check = function() {
		this.assemble("View1");
		this.assemble("View2", "param");
		callback();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

// test helper functions

suite.createControls = function(names) {
	$.map(names, function(name) {
		Echo.Control.create(suite.getControlManifest(name));
	});
};

suite.getControlManifest = function(name) {
	var manifest = Echo.Control.manifest(name);
	manifest.templates.main = "<div>Sample Control Template</div>";
	manifest.init = function() {
		this.dom.render();
		this.ready();
	};
	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};
	return manifest;
};

suite.getProductViewManifest = function(name, controls) {
	var manifest = Echo.ProductView.manifest(name);
	manifest.templates.main = "<div>Sample View Template</div>";
	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};
	manifest.controls = controls;
	return manifest;
};

suite.initProduct = function(config) {
	var Product = suite.getProductClass();
	new Product($.extend(true, {}, config));
};

suite.createProduct = function(name, views, assemblers) {
	Echo.Product.create(suite.getProductManifest(name, views, assemblers));
};

suite.getProductManifest = function(name, views, assemblers) {
	var viewNames = Echo.Utils.foldl([], views, function(controls, acc, _name) {
			acc.push(name + ".Views." + _name);
	});
	var manifest = Echo.Product.manifest(name, viewNames);
	manifest.templates.main = "<div>Sample Product Template</div>";
	manifest.views = Echo.Utils.foldl({}, views, function(controls, acc, _name) {
		var viewName = name + ".Views." + _name;
		acc[viewName] = suite.getProductViewManifest(viewName, controls);
	});
	manifest.assemblers = assemblers || {};
	return manifest;
};

suite.getProductClassName = function() {
	return "TestProduct";
};

suite.getProductClass = function() {
	return Echo.Utils.getComponent(suite.getProductClassName());
};

})(Echo.jQuery);
