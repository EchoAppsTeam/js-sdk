(function($) {

var suite = Echo.Tests.Unit.App = function() {};

suite.prototype.info = {
	"className": "Echo.App",
	"functions": [
		"create",
		"initComponent",
		"getComponent",
		"destroyComponent",
		"destroyComponents",
		"isDefined"
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
			"name": suite.getAppClassName(),
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
		var _manifest = Echo.App.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.inherits;

		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		suite.createComponents(["TestComponent1", "TestComponent2", "TestComponent3"]);

		// checking if we have class before it was defined
		QUnit.ok(!Echo.App.isDefined(manifest),
			"Checking if the app class was defined (via isDefined static method), before actual app definition");

		suite.createApp("TestApp", {
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

		// checking if we have class after class definition
		QUnit.ok(Echo.App.isDefined(manifest),
			"Checking if the app class was defined (via isDefined static method), after app definition");

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
			"component": "TestComponent1",
			"config": {
				"target": self.config.target,
				"ready": function() {
					QUnit.ok(true,
						"Checking that control.onReady() handler was called after initComponent()");
					QUnit.equal(this.config.get("parent.key1"), "value1",
						"Checking that parent section of component config is the config of appropriate application");
					QUnit.equal(
						this.config.get("cdnBaseURL.provider"),
						"http://cdn.example.com/base",
						"Checking if the config values defined for the main app were proxied into the internal app (checking cdnBaseURL.provider)");
					QUnit.equal(
						this.config.get("labels.myLabel"),
						"My label value",
						"Checking if the config values defined for the main app were proxied into the internal app (checking labels.myLabel)");
					callback();
				}
			}
		});
		QUnit.ok(this.getComponent("TestComponent1") && this.getComponent("TestComponent1") instanceof Echo.Control, "Check getComponent() returns a ref to the initialized component");
		QUnit.strictEqual(undefined, this.getComponent("TestComponent1000"), "Check getComponent() returns \"undefined\" value for the uninitialized component");
		this.destroy();
	};
	suite.initApp({
		"target": this.config.target,
		"appkey": this.config.appkey,
		"labels": {"myLabel": "My label value"},
		"cdnBaseURL": {"provider": "http://cdn.example.com/base"},
		"ready": check,
		"key1": "value1"
	});
};

suite.prototype.cases.destroyComponent = function(callback) {
	var self = this;
	var check = function() {
		var component = this.initComponent({
			"id": "TestComponent1",
			"component": "TestComponent1",
			"config": {
				"target": self.config.target
			}
		});
		component.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking if the control.destroy() mehtod was called after destroyComponent()");
		});
		this.destroyComponent("TestComponent1");
		QUnit.equal(this.components["TestComponent1"], undefined,
			"Checking that the component was deleted from application after destroyComponent()");
		this.destroy();
		callback();
	};
	suite.initApp({
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
				"component": component,
				"config": {
					"target": test.config.target
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
	suite.initApp({
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

suite.initApp = function(config) {
	var App = suite.getAppClass();
	new App($.extend(true, {}, config));
};

suite.createApp = function(name) {
	Echo.App.create(suite.getAppManifest(name));
};

suite.getAppManifest = function(name) {
	var manifest = Echo.App.manifest(name || suite.getAppClassName());
	manifest.templates.main = "<div>Sample App Template</div>";
	return manifest;
};

suite.getAppClass = function() {
	return Echo.Utils.getComponent(suite.getAppClassName());
};

suite.getAppClassName = function() {
	return "TestApp";
};

})(Echo.jQuery);
