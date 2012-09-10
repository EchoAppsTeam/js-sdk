(function($) {

var suite = Echo.Tests.Unit.Product = function() {};

suite.prototype.info = {
	"className": "Echo.Product",
	"functions": [
		"create",
		"addControl",
		"destroyControl",
		"destroyControls"
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
			"controls": {},
		};
		var _manifest = Echo.Product.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.inherits;

		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		suite.createControls(["TestControl1", "TestControl2", "TestControl3"]);
		suite.createProduct("TestProduct", {
			"TestControl1": {
				"name": "TestControl1",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			},
			"TestControl2": {
				"name": "TestControl2",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			},
			"TestControl3": {
				"name": "TestControl3",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			}
		});

		this.sequentialAsyncTests([
			"addControl",
			"destroyControl",
			"destroyControls"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.addControl = function(callback) {
	var check = function() {
		this.addControl("TestControl1", {
			"config": {
				"ready": function() {
					QUnit.ok(true,
						"Checking that control.onReady() handler was called after addControl()");
					QUnit.equal(this.config.get("parent.key1"), "value1",
						"Checking that parent section of control config is the config of appropriate product");
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

suite.prototype.cases.destroyControl = function(callback) {
	var check = function() {
		var self = this;
		var control = this.addControl("TestControl1");
		control.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking if the Control.destroy() mehtod was called after destroyControl()");
		});
		this.destroyControl("TestControl1");
		QUnit.equal(self.controls["TestControl1"], undefined,
			"Checking that the control was deleted from product after destroyControl()");
		this.destroy();
		callback();
	};
	suite.initProduct({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.destroyControls = function(callback) {
	var check = function() {
		var self = this;
		var controls = ["TestControl1", "TestControl2", "TestControl3"];
		$.map(controls, function(control) {
			self.addControl(control);
		});
		var exceptions = ["TestControl2"];
		this.destroyControls(exceptions);
		QUnit.ok(!this.controls["TestControl1"] && !this.controls["TestControl3"],
			"Checking that controls were deleted after destroyControls()");
		QUnit.ok(this.controls["TestControl2"],
			"Checking that control which is in exceptions list was not deleted after destroyControls()");
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

suite.createControls = function(names) {
	$.map(names, function(name) {
		Echo.Control.create(suite.getControlManifest(name));
	});
};

suite.getControlManifest = function(name) {
	var manifest = Echo.Control.manifest(name);
	manifest.templates.main = "<div>Sample Control Template</div>";
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

suite.createProduct = function(name, controls) {
	Echo.Product.create(suite.getProductManifest(name, controls));
};

suite.getProductManifest = function(name, controls) {
	var manifest = Echo.Product.manifest(name || suite.getProductClassName());
	manifest.templates.main = "<div>Sample Product Template</div>";
	manifest.controls = controls;
	return manifest;
};

suite.getProductClass = function() {
	return Echo.Utils.getComponent(suite.getProductClassName());
};

suite.getProductClassName = function() {
	return "TestProduct";
};

})(Echo.jQuery);
