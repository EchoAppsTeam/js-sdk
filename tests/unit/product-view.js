(function($) {

var suite = Echo.Tests.Unit.ProductView = function() {};

suite.prototype.info = {
	"className": "Echo.ProductView",
	"functions": [
		"create",
		"initControl",
		"getControl",
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
			"name": suite.getProductViewClassName(),
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
		var _manifest = Echo.ProductView.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.inherits;

		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		suite.createControls(["Control1", "Control2", "Control3"]);
		suite.createProductView("TestProductView", {
			"Control1": {
				"control": "Control1",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			},
			"Control2": {
				"control": "Control2",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			},
			"Control3": {
				"control": "Control3",
				"config": {
					"target": this.config.target,
					"appkey": this.config.appkey
				}
			}
		});

		this.sequentialAsyncTests([
			"initControl",
			"destroyControl",
			"destroyControls",
			"getControl"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.initControl = function(callback) {
	var check = function() {
		var self = this;
		QUnit.deepEqual(this.controls, {
			"Control1": null,
			"Control2": null,
			"Control3": null
		}, "Checking controls of product view after initialization");
		var control = this.initControl("Control1", {
			"ready": function() {
				QUnit.ok(true,
					"Checking that control.onReady() handler was called after initControl()");
				QUnit.equal(this.config.get("parent.key1"), "value1",
					"Checking that parent section of control config is the config of appropriate product view");
				callback();
			}
		});
		this.destroy();
	};
	suite.initProductView({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check,
		"key1": "value1"
	});
};

suite.prototype.cases.destroyControl = function(callback) {
	var check = function() {
		var self = this;
		var control = this.initControl("Control1");
		control.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking if the Control.destroy() mehtod was called after destroyControl()");
		});
		this.destroyControl("Control1");
		QUnit.equal(self.controls["Control1"], undefined,
			"Checking that the control was deleted from product view after destroyControl()");
		this.destroy();
		callback();
	};
	suite.initProductView({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.destroyControls = function(callback) {
	var check = function() {
		var self = this;
		var controls = ["Control1", "Control2", "Control3"];
		$.map(controls, function(control) {
			self.initControl(control);
		});
		var exceptions = ["Control2"];
		this.destroyControls(exceptions);
		QUnit.ok(!this.controls["Control1"] && !this.controls["Control3"],
			"Checking that controls were deleted after destroyControls()");
		QUnit.ok(this.controls["Control2"],
			"Checking that control which is in exceptions list was not deleted after destroyControls()");
		this.destroy();
		callback();
	};
	suite.initProductView({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"ready": check
	});
};

suite.prototype.cases.getControl = function(callback) {
	var check = function() {
		this.initControl("Control1");
		QUnit.deepEqual(this.getControl("Control1"), window.Control1,
			"Checking that getControl returns a proper link");
		QUnit.equal(this.getControl("FakeControl"), undefined,
			"Checking that getControl() returns undefined with fake control name");
		this.destroy();
		callback();
	};
	suite.initProductView({
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

suite.initProductView = function(config) {
	var View = suite.getProductViewClass();
	new View($.extend(true, {}, config));
};

suite.createProductView = function(name, controls) {
	Echo.ProductView.create(suite.getProductViewManifest(name, controls));
};

suite.getProductViewManifest = function(name, controls) {
	var manifest = Echo.ProductView.manifest(name || suite.getProductViewClassName());
	manifest.templates.main = "<div>Sample View Template</div>";
	manifest.controls = controls;
	return manifest;
};

suite.getProductViewClass = function() {
	return Echo.Utils.getComponent(suite.getProductViewClassName());
};

suite.getProductViewClassName = function() {
	return "TestProductView";
};

})(Echo.jQuery);
