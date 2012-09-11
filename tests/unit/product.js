(function($) {

var suite = Echo.Tests.Unit.Product = function() {};

suite.prototype.info = {
	"className": "Echo.Product",
	"functions": [
		"create",
		"initComponent",
		"destroyComponent",
		"destroyComponents"
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
			"destroy": undefined
		};
		var _manifest = Echo.Product.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.inherits;

		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		suite.createComponents(["TestComponent1", "TestComponent2", "TestComponent3"]);
		suite.createProduct("TestProduct", {
			"TestComponent1": {
				"target": this.config.target,
				"appkey": this.config.appkey
			},
			"TestComponent2": {
				"target": this.config.target,
				"appkey": this.config.appkey
			},
			"TestComponent3": {
				"target": this.config.target,
				"appkey": this.config.appkey
			}
		});

		this.sequentialAsyncTests([
			"initComponent",
			"destroyComponent",
			"destroyComponents"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.initComponent = function(callback) {
	var self = this;
	var check = function() {
		this.initComponent({
			"id": "TestComponent1",
			"constructor": "TestComponent1",
			"config": {
				"target": self.config.target,
				"ready": function() {
					QUnit.ok(true,
						"Checking that control.onReady() handler was called after initComponent()");
					QUnit.equal(this.config.get("parent.key1"), "value1",
						"Checking that parent section of component config is the config of appropriate product");
					callback();
				}
			}
		});
		this.destroy();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check,
		"key1": "value1"
	});
};

suite.prototype.cases.destroyComponent = function(callback) {
	var self = this;
	var check = function() {
		var component = this.initComponent({
			"id": "TestComponent1",
			"constructor": "TestComponent1",
			"config": {
				"target": self.config.target,
			}
		});
		component.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking if the control.destroy() mehtod was called after destroyComponent()");
		});
		this.destroyComponent("TestComponent1");
		QUnit.equal(this.components["TestComponent1"], undefined,
			"Checking that the component was deleted from product after destroyComponent()");
		this.destroy();
		callback();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.destroyComponents = function(callback) {
	var test = this;
	var check = function() {
		var self = this;
		var components = ["TestComponent1", "TestComponent2", "TestComponent3"];
		$.map(components, function(component) {
			self.initComponent({
				"id": component,
				"constructor": component,
				"config": {
					"target": test.config.target,
				}
			});
		});
		var exceptions = ["TestComponent2"];
		this.destroyComponents(exceptions);
		QUnit.ok(!this.components["TestComponent1"] && !this.components["TestComponent3"],
			"Checking that components were deleted after destroyComponents()");
		QUnit.ok(this.components["TestComponent2"],
			"Checking that component which is in exceptions list was not deleted after destroyComponents()");
		this.destroy();
		callback();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

// test helper functions

suite.createComponents = function(names) {
	$.map(names, function(name) {
		Echo.Control.create(suite.getComponentManifest(name));
	});
};

suite.getComponentManifest = function(name) {
	var manifest = Echo.Control.manifest(name);
	manifest.templates.main = "<div>Sample Component Template</div>";
	manifest.init = function() {
		this.render();
		this.ready();
	};
	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};
	return manifest;
};

suite.initProduct = function(config) {
	var Product = suite.getProductClass();
	new Product($.extend(true, {}, config));
};

suite.createProduct = function(name) {
	Echo.Product.create(suite.getProductManifest(name));
};

suite.getProductManifest = function(name) {
	var manifest = Echo.Product.manifest(name || suite.getProductClassName());
	manifest.templates.main = "<div>Sample Product Template</div>";
	return manifest;
};

suite.getProductClass = function() {
	return Echo.Utils.getComponent(suite.getProductClassName());
};

suite.getProductClassName = function() {
	return "TestProduct";
};

})(Echo.jQuery);
