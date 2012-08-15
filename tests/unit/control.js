(function(jQuery) {
var $ = jQuery;

"use strict";

Echo.Tests.Dependencies = Echo.Tests.Dependencies || {};
Echo.Tests.Dependencies.Control = {};

var suite = Echo.Tests.Unit.Control = function() {};

suite.prototype.info = {
	"className": "Echo.Control",
	"functions": [
		"manifest",
		"create",
		"log",
		"get",
		"set",
		"remove",
		"substitute",
		"dependent",
		"template",
		"getPlugin",
		"showMessage",
		"destroy",
		"refresh",

		// functions below are covered
		// within the Plugin component test
		"template",
		"parentRenderer",
		"extendTemplate",
		"extendRenderer"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.PublicInterfaceTests = {
	"config": {
		"async": true,
		"user": {"status": "anonymous"},
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var self = this;
		var manifest = {
			"name": suite.getTestControlClassName(),
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

		var _manifest = Echo.Control.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		// create class out of manifest
		suite.createTestControl(manifest.name);

		// create test plugin
		suite.plugin().createTestPlugin("MyPlugin", manifest.name);

		this.sequentialAsyncTests([
			"basicOperations",
			"initializationWithInvalidParams",
			"incomingConfigHandling",
			"controlRendering",
			"eventsMechanism",
			"labelsOverriding",
			"refresh",
			"destroy"
		], "cases");

	}
};

suite.prototype.cases = {};

suite.prototype.cases.basicOperations = function(callback) {
	var test = this;
	var check = function() {
		var self = this;

		// checking basic interface availability
		QUnit.ok(!!this.events,
			"Checking if we have \"events\" interface available");
		QUnit.ok(!!this.config,
			"Checking if we have \"config\" interface available");
		QUnit.ok(!!this.labels,
			"Checking if we have \"labels\" interface available");
		QUnit.ok(!!this.user,
			"Checking if we have \"user\" interface available");
		QUnit.ok(!!this.dom,
			"Checking if we have \"dom\" interface available");

		// checking if all functions defined in "methods" namespace are available
		QUnit.ok(this.myMethod(true),
			"Checking if public methods are available and executable");
		QUnit.ok(this._myPrivateMethod(true),
			"Checking if private methods are available and executable");

		// checking "get" operation
		var data = suite.data.config.data;
		QUnit.equal(this.get("data.key1"), data.key1,
			"Checking if we can extract data passed via config using the \"get\" function");
		QUnit.equal(this.get("data.key3.key3nested"), data.key3.key3nested,
			"Checking if we can extract nested data passed via config using the \"get\" function");
		QUnit.equal(this.get("non-existing-key"), undefined,
			"Trying to fetch the value using non-existing key via \"get\" function");
		QUnit.equal(this.get("non-existing-key", "default"), "default",
			"Trying to fetch the value using non-existing key via \"get\" function and passing default value");
		QUnit.equal(this.get("non-existing-key", false), false,
			"Trying to fetch the value using non-existing key via \"get\" function and passing 'false' as a default value");
		QUnit.equal(this.get("integerParam"), 15,
			"Extracting the value of the class variables defined in manifest");
		QUnit.equal(this.get("zeroParam", "somevalue"), 0,
			"Extracting the 0 value of the class variables and passing default value");

		// checking "set"/"get"/"remove" scenario
		this.set("myField", "myValue");
		QUnit.equal(this.get("myField"), "myValue",
			"Checking basic value set/get scenario (value of type string)");
		this.set("myField", {"key1": "value1"});
		QUnit.equal(this.get("myField.key1"), "value1",
			"Checking basic value set/get scenario (value of type object)");
		this.remove("myField", "myValue");
		QUnit.equal(this.get("myField"), undefined,
			"Checking field remove operation");

		// checking "substitute" method
		$.each(suite.data.substitutions, function(id, substitution) {
			QUnit.equal(
				self.substitute(substitution[0], undefined, substitution[2]),
				substitution[1],
				"Checking \"substitute\" method, pattern #" + (id + 1));
		});

		// checking "dependent" method
		QUnit.ok(!this.dependent(),
			"Checking if a given control was initialized within another control");
		this.config.set("parent", {});
		QUnit.ok(this.dependent(),
			"Checking if \"dependent\" function detects the config update");
		this.config.remove("parent");

		// checking "getPlugin" method
		QUnit.ok(!!this.getPlugin("MyPlugin"),
			"Checking if existing plugin ref is available");
		QUnit.ok(!this.getPlugin("FakePlugin"),
			"Checking if dummy plugin ref is NOT available");

		// checking if all dependencies are available
		var result = true;
		for (var i = 1; i < 6; i++) {
			if (!Echo.Tests.Dependencies.Control["dep" + i]) result = false;
		}
		QUnit.ok(result, "Checking if all dependencies are downloaded and available");

		try {
			// checking log() calls with invalid params
			this.log();
			this.log({});

			// call log() with valid params
			this.log({
				"type": "error",
				"message": "Test message from the Control class",
				"args": {"a": 1, "b": 2, "c": 3}
			});

			// checking if no exceptions were thrown
			QUnit.ok(true, "Checking if no exceptions were thrown while executing the \"log\" function with valid and invalid params");
		} catch(e) {
			QUnit.ok(e, "Execution of the \"log\" function caused exception.");
		};

		this.destroy();

		callback && callback();
	};
	suite.initTestControl({
		"data": suite.data.config.data,
		"plugins": [{
			"name": "MyPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": check
	});
};

suite.prototype.cases.initializationWithInvalidParams = function(callback) {
	var result, definition = suite.getTestControlClass();

	result = new definition();
	QUnit.ok($.isEmptyObject(result),
		"Checking if 'false' is returned if no config is passed");

	result = new definition({"target": $("div")});
	QUnit.ok($.isEmptyObject(result),
		"Checking if empty object is returned if no appkey is passed in config");

	result = new definition({"appkey": "test.echoenabled.com"});
	QUnit.ok($.isEmptyObject(result),
		"Checking if empty object is returned if no target is passed in config");
	
	callback && callback();
};

suite.prototype.cases.incomingConfigHandling = function(callback) {
	var check = function() {
		QUnit.equal(this.config.get("nullParam"), "nullParam replacement",
			"Checking if null parameter was overridden during control init");
		QUnit.equal(this.config.get("undefinedParam"), "undefinedParam replacement",
			"Checking if undefined parameter was overridden during control init");
		QUnit.equal(this.config.get("integerParam"), 15,
			"Checking if non-changed keys remains the same");
		QUnit.equal(this.config.get("objectParam.param1"), "param1.override",
			"Checking if object parameter was overridden (checking new key)");
		QUnit.equal(this.config.get("objectParam.param2"), undefined,
			"Checking if object parameter was overridden (checking existing key)");

		this.destroy();

		callback && callback();
	};
	suite.initTestControl({
		"objectParam": {"param1": "param1.override"},
		"myTestParam": "test value",
		"undefinedParam": "undefinedParam replacement",
		"nullParam": "nullParam replacement",
		"ready": check
	});
};

suite.prototype.cases.controlRendering = function(callback) {
	var check = function() {
		var self = this;
		QUnit.ok(this.config.get("target") instanceof jQuery,
			"Checking if the target if a jQuery element");
		QUnit.ok(!!this.config.get("target").children().length,
			"Checking if target is not empty after rendering");

		// checking if we have expected results in several elements
		var assertions = [
			["data", "key1 value"],
			["configString", "Some test value"],
			["configInteger", "15"],
			["configUndefined", ""],
			["configBooleanFalse", "false"],
			["configObject", ""],
			["configArray", ""],
			["dataNonExisting", ""],
			["label", "label1 value"],
			["labelNonExisting", "nonexistinglabel"]
		];

		$.map(assertions, function(assertion) {
			QUnit.equal(
				self.dom.get(assertion[0]).html(),
				assertion[1],
				"Checking rendering output of the \"" + assertion[0] + "\" element"
			);
		});

		QUnit.ok(!!this.dom.get("testRenderer").children().length,
			"Checking if initially empty element became non-empty after applying renderer");

		// template rendering
		var cssClass = ".echo-streamserver-controls-mytestcontrol-testRenderer";
		var template =
			'<div class="{class:container}">' +
				'<div class="k1">{data:k1}</div>' +
				'<div class="k2">{data:k2}</div>' +
				'<div class="{class:testRenderer}"></div>' +
				'<div class="c1">{config:integerParam}</div>' +
			'</div>';
		var result = this.dom.render({
			"template": template,
			"target": $("<div></div>"),
			"data": {"k1": "myvalue1", "k2": {}}
		});
		QUnit.ok(!!result.find(cssClass).children().length,
			"Checking if control renderers were applied when we render template (by passing \"template\" key into the \"render\" function)");
		QUnit.equal(result.find(".k1").html(), "myvalue1",
			"Checking data substitution into template (string value)");
		QUnit.equal(result.find(".k2").html(), "",
			"Checking data substitution into template (object value)");
		QUnit.equal(result.find(".c1").html(), "15",
			"Checking config values substitution into template");

		// element rendering, specific renderer application
		var target = this.dom.get("testRenderer");
		this.dom.render({
			"target": target,
			"name": "testRendererWithExtra",
			"extra": {"value": "my-value"}
		});
		QUnit.equal(target.html(), "<span>my-value</span>",
			"Checking if element content was updated after renderer application");

		this.dom.render({
			"target": target,
			"name": "testRendererWithExtra",
			"extra": {"value": "another-value"}
		});
		QUnit.equal(target.html(), "<span>another-value</span>",
			"Checking if element content was updated as a result of renderer application");

		this.dom.render({
			"name": "testRenderer"
		});
		QUnit.equal(target.html(), "<div>Some value</div>",
			"Checking if element content was updated as a result of the native renderer application");

		// recursive element rendering
		this.dom.get("nestedSubcontainer").append('<div class="extra-div">Extra DIV appended</div>');
		this.dom.render({
			"name": "testRendererRecursive",
			"recursive": true
		});
		QUnit.equal(this.dom.get("testRendererRecursive").html(), "<div class=\"echo-streamserver-controls-mytestcontrol-nestedContainer\"><div class=\"echo-streamserver-controls-mytestcontrol-nestedSubcontainer\"></div></div>",
			"Checking if element content was updated after recursive rendering");

		// checking re-rendering
		target.append('<div class="extra-div">Extra DIV appended</div>');
		this.config.get("target").append('<div class="extra-div-1">Another DIV appended</div>');
		this.config.get("target").append('<div class="extra-div-2">DIV appended</div>');
		this.dom.render();
		QUnit.equal(this.dom.get("testRenderer").html(), "<div>Some value</div>",
			"Checking if component was re-rendered and appended elements were wiped out");

		// checking "showMessage" method
		var target = $('<div></div>');
		var data = {
			"type": "error",
			"message": "An error occured during the request...",
			"layout": "compact",
			"target": target
		};
		this.showMessage(data);
		QUnit.equal(
			target.find(".echo-control-message-icon").attr("title"),
			data.message,
			"Checking \"showMessage\" in compact mode");

		data.layout = "full";
		this.showMessage(data);
		QUnit.equal(
			target.find(".echo-control-message-icon").html(),
			data.message,
			"Checking \"showMessage\" in full mode");

		var template = '<div class="echo-utils-tests-footer">footer content</div>';
		this.dom.render();
		QUnit.equal(this.dom.get("testRenderer").html(), "<div>Some value</div>",
			"Checking control.dom.get() function");
		this.dom.set("testRenderer", $(template));
		QUnit.equal(this.dom.get("testRenderer").html(), "footer content",
			"Checking control.dom.set() function");
		this.dom.remove("testRenderer");
		QUnit.equal(this.dom.get("testRenderer"), undefined,
			"Checking control.dom.remove() function");
		this.dom.clear();
		QUnit.ok($.isEmptyObject(this.dom.elements), "Checking control.dom.clear() function");

		this.destroy();

		callback && callback();
	};
	suite.initTestControl({
		"data": suite.data.config.data,
		"ready": check
	});
};

suite.prototype.cases.eventsMechanism = function(callback) {
	var count = 0, increment = function() { count++; };
	var _topic = "myTestTopic";
	var context = Echo.Utils.getUniqueString();
	var publish = function(topic) {
		Echo.Events.publish({
			"topic": topic || _topic,
			"context": context
		});
	};
	var subscribe = function(topic) {
		Echo.Events.subscribe({
			"topic": topic || _topic,
			"context": context,
			"handler": increment
		});
	};
	subscribe("Echo.StreamServer.Controls.MyTestControl.onRender");
	subscribe("Echo.StreamServer.Controls.MyTestControl.outgoing.event.test");
	var check = function() {

		// subscribing to incoming events
		this.events.subscribe({
			"topic": "incoming.event.test",
			"handler": increment
		});
		publish("incoming.event.test");
		publish("incoming.event.test");
		publish("incoming.event.test");

		// publishing outgoing event
		this.events.publish({"topic": "outgoing.event.test"});
		this.events.publish({"topic": "outgoing.event.test"});
		this.events.publish({"topic": "outgoing.event.test"});

		// checking events defined in manifest
		this.set("_eventHandler", increment);

		publish("incoming.event.global.test");
		publish("incoming.event.local.test");

		QUnit.ok(count == 9,
			"Checking if expected amount of events were executed and handled");

		var e = this.events;
		QUnit.ok(!!e.subscribe && !!e.publish && !!e.unsubscribe,
			"Checking control \"events\" interface contract");

		this.destroy();

		callback && callback();
	};
	suite.initTestControl({
		"context": context,
		"ready": check
	});
};

suite.prototype.cases.labelsOverriding = function(callback) {
	Echo.Labels.set({
		"label1": "label1 global override",
		"label2": "label2 global override"
	}, "Echo.StreamServer.Controls.MyTestControl");
	var check = function() {
		QUnit.equal(this.labels.get("label1"), "label1 override via config",
			"Checking labels override via control config");
		QUnit.equal(this.labels.get("label2"), "label2 global override",
			"Checking labels override via control config");
		QUnit.equal(this.labels.get("label3"), "label3 value",
			"Checking extraction from the control defined labels set");

		this.destroy();

		callback && callback();
	};
	suite.initTestControl({
		"labels": {
			"label1": "label1 override via config"
		},
		"ready": check
	});
};

suite.prototype.cases.refresh = function(callback) {
	var check = function() {
		var control = this;
		this.events.subscribe({
			"topic": "Echo.StreamServer.Controls.MyTestControl.onRefresh",
			"handler": function() {
				QUnit.ok(control.config.get("target").length,
					"Check if the control was rerendered after \"refresh\" function call (non-empty target)");
				QUnit.ok(!control.getPlugin("MyPlugin"),
					"Checking if the plugin keeps the state within \"refresh\" function call");
				QUnit.equal(control.dom.get("configString").html(),
					"updated string value1",
					"Checking if the control was rerendered after \"refresh\" function call (validate template re-rendering)");
				QUnit.ok(!control.dom.get("plugin_testRenderer"),
					"Check if there is no disabled plugin elements in dom after \"refresh\" function call");

				control.destroy();

				callback && callback();
			}
		});
		this.config.set("stringParam", "updated string value1");
		this.getPlugin("MyPlugin").disable(1);
		this.refresh();
	};
	suite.initTestControl({
		"plugins": [{
			"name": "MyPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": check
	});
};

suite.prototype.cases.destroy = function(callback) {
	var publish = function(topic, control) {
		Echo.Events.publish({
			"topic": topic,
			"context": control.config.get("context")
		});
	};
	var check = function() {
		var count = 0;
		this.set("_eventHandler", function() { count++; });
		this.set("_destroyHandler", function() {
			QUnit.ok(true,
				"Checking if the \"destroy\" method was called from the manifest");
		});

		// checking if we receive events before destroy
		publish("incoming.event.global.test", this);
		publish("incoming.event.local.test", this);

		this.destroy();

		// checking control target
		QUnit.ok(!this.config.get("target").html(),
			"Check if the target was cleared after the \"destroy\" function call");

		// checking if no event subscriptions after destroy call
		publish("incoming.event.global.test", this);
		publish("incoming.event.local.test", this);

		QUnit.ok(count == 2,
			"Checking if expected amount of events were executed and handled (checking \"destroy\" function call)");

		this.destroy();

		// check plugin events
		callback && callback();
	};
	suite.initTestControl({
		"plugins": [{
			"name": "MyPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": check
	});
};

// data required to perform tests

suite.data = {};

suite.data.substitutions = [[
	"",
	""
], [
	"test string with no substitutions",
	"test string with no substitutions"
], [
	"<div>HTML text with no <b>substitutions</b></div>",
	"<div>HTML text with no <b>substitutions</b></div>"
], [
	".css-classes-with-no-subs { text-align: right; color: red; }",
	".css-classes-with-no-subs { text-align: right; color: red; }"
], [
	"test string with substitutions {label:label1}",
	"test string with substitutions label1 value"
], [
	"bad pattern should not break the string {label:} {config:} {self:}",
	"bad pattern should not break the string {label:} {config:} {self:}"
], [
	"non existing label extraction {label:nonexisting}, shoud return key",
	"non existing label extraction nonexisting, shoud return key"
], [
	"<div class=\"{class:test}\">div with css class name defined</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-test\">div with css class name defined</div>"
], [
	"<div class=\"{class:test} {class:test1} {class:test2}\">div with multiple css class names defined</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-test echo-streamserver-controls-mytestcontrol-test1 echo-streamserver-controls-mytestcontrol-test2\">div with multiple css class names defined</div>"
], [
	"<div class=\"{class:test}\">{data:key3.key3nested}</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-test\">nested value for key 3</div>"
], [
	"<div class=\"{class:test}\">{self:data.key3.key3nested}</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-test\">nested value for key 3</div>"
], [
	"<div class=\"{class:test}\">{label:label1}{label:label2}{self:data.key3.key3nested}{class:example} - mix of multiple patterns</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-test\">label1 valuelabel2 valuenested value for key 3echo-streamserver-controls-mytestcontrol-example - mix of multiple patterns</div>"
], [
	"{config:stringParam}-{config:nonexistingkey}-{config:integerParam}-{config:objectParam.param1}",
	"Some test value--15-param1.value"
], [
	"<div>{mysubs:key}</div><span>{mysubs:key.key1.key2}</span><div>{mysub.sub.nested.sub:key.key1}</div>",
	"<div>mysubs key, key value</div><span>mysubs key, key.key1.key2 value</span><div>mysub.sub.nested.sub key, key.key1 value</div>",
	{
	 "mysubs": function(value) { return "mysubs key, " + value + " value"; },
	 "mysub.sub.nested.sub": function(value) { return "mysub.sub.nested.sub key, " + value + " value"; }
	}
], [
	// non-supported types of values, we should process them as ""
	"{d:arrayVal}{d:objectVal}{d:functionVal}{d:undefinedVal}",
	"",
	{"d": function(key) {
		var data = {
			"arrayVal": [1,2,3,4,5],
			"objectVal": {"key1": "value1", "key2": "value2"},
			"functionVal": function() { return "test"; },
			"undefinedVal": undefined
		};
		return data[key];
	}}
]];

suite.data.template =
	'<div class="{class:container}">' +
		'<div class="{class:testRenderer}"></div>' +
		'<div class="{class:testRendererRecursive}">' +
			'<div class="{class:nestedContainer}">' +
				'<div class="{class:nestedSubcontainer}">' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="{class:testComponentRenderer}"></div>' +
		// checking {data:...} substitution
		'<div class="{class:data} echo-primaryFont echo-primaryColor">{data:key1}</div>' +
		'<div class="{class:dataNested} echo-primaryColor">{data:key3.key3nested}</div>' +
		'<div class="{class:dataNonExisting}">{data:nonexistingkey}</div>' +
		// checking {label:...} substitution
		'<div class="{class:label} echo-primaryFont">{label:label1}</div>' +
		'<div class="{class:labelNonExisting}">{label:nonexistinglabel}</div>' +
		'<div class="{class:class}">{class:myclass}</div>' +
		// checking {config:...} substitution
		'<div class="{class:configNonExisting}">{config:nonexistingkey}</div>' +
		'<div class="{class:configString} echo-primaryFont">{config:stringParam}</div>' +
		'<div class="{class:configArray}">{config:arrayParam}</div>' +
		'<div class="{class:configInteger} echo-primaryFont">{config:integerParam}</div>' +
		'<div class="{class:configUndefined}">{config:undefinedParam}</div>' +
		'<div class="{class:configNull} echo-primaryFont">{config:null}</div>' +
		'<div class="{class:configBooleanFalse}">{config:booleanFalseParam}</div>' +
		'<div class="{class:configBooleanTrue}">{config:booleanTrueParam}</div>' +
		'<div class="{class:configZero} echo-primaryFont">{config:zeroParam}</div>' +
		'<div class="{class:configObject} echo-primaryFont">{config:objectParam}</div>' +
		// checking {self:...} substitution
		'<div class="{class:selfData} echo-primaryFont">{self:data}</div>' +
		'<div class="{class:selfDataKey} echo-primaryFont">{self:data.key1}</div>' +
		'<div class="{class:selfDataKeyNested}">{self:data.key3.key3nested}</div>' +
		'<div class="{class:selfNonExistingKey}">{self:nonExistingKey}</div>' +
		'<div class="{class:selfFunction}">{self:render}</div>' +
		// checking custom substitution rules
		'<div class="{class:customSubstitution}">{mysubs:key}</div>' +
		'<div class="{class:customSubstitutionNestedKey}">{mysubs:key.key1.key2}</div>' +
		'<div class="{class:customSubstitutionNestedName}">{mysub.sub1.sub2:key.key1}</div>' +
	'</div>';

// TODO: apply such pattern for the Echo.Configuration lib tests...
suite.data.config = {
	"data": {
		"key1": "key1 value",
		"key2": "key2 value",
		"key3": {
			"key3nested": "nested value for key 3"
		}
	},
	"stringParam": "Some test value",
	"arrayParam": [1, 2, 3, 4, 5],
	"integerParam": 15,
	"undefinedParam": undefined,
	"nullParam": null,
	"booleanFalseParam": false,
	"booleanTrueParam": true,
	"zeroParam": 0,
	"objectParam": {
		"param1": "param1.value",
		"param2": "param2.value",
		"param3": {
			"nestedParam": {
				"nested1": 1,
				"nested2": 2
			}
		}
	}
};

// test helper functions 

suite.plugin = function() {
	return Echo.Tests.Unit.Plugin;
};

suite.getTestControlClassName = function() {
	return "Echo.StreamServer.Controls.MyTestControl";
};

suite.getTestControlClass = function() {
	return Echo.Utils.getComponent(suite.getTestControlClassName());
};

suite.initTestControl = function(config) {
	var definition = suite.getTestControlClass();
	new definition($.extend({
		"target": $("<div></div>"),
		"appkey": "test.echoenabled.com",
	}, config));
};

suite.createTestControl = function(name) {
	Echo.Control.create(suite.getControlManifest(name));
};

suite.getControlManifest = function(name) {

	var manifest = Echo.Control.manifest(name || suite.getTestControlClassName());

	manifest.config = $.extend(true, {}, suite.data.config);

	// copy vars from config
	manifest.vars = $.extend(true, {}, manifest.config);

	// removing data from vars to avoid intersection
	// because the "data" will be copied over from config
	delete manifest.vars.data;

	manifest.labels = {
		"label1": "label1 value",
		"label2": "label2 value",
		"label3": "label3 value"
	};

	var addDependency = function(n) {
		manifest.dependencies.push({
			"url": "unit/dependencies/control.dep." + n + ".js",
			"loaded": function() { return !!Echo.Tests.Dependencies.Control["dep" + n]; }
		});
	};
	for (var i = 1; i < 6; i++) addDependency(i);

	manifest.init = function() {
		this.dom.render();
	};

	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};

	manifest.templates.main = suite.data.template;

	manifest.templates.custom =
		'<div class="{class:container}">' +
			'<div class="{class:testRenderer}"></div>' +
			'<div class="{class:testRenderer1}"></div>' +
		'</div>';

	manifest.events = {
		"incoming.event.global.test": {
			"context": "global",
			"handler": function() {
				this.get("_eventHandler") && this.get("_eventHandler")();
			}
		},
		"incoming.event.local.test": function() {
			this.get("_eventHandler") && this.get("_eventHandler")();
		}
	};

	manifest.renderers.testRenderer = function(element) {
		return element.empty().append('<div>Some value</div>');
	};

	manifest.renderers.testComponentRenderer = function(element) {
		return element.append('<div>Some value from testComponentRenderer</div>');
	};

	manifest.renderers.testRendererWithExtra = function(element, extra) {
		return element.empty().append('<span>' + extra.value + '</span>');
	};

	manifest.methods.myMethod = function(arg) {
		return arg;
	};

	manifest.methods._myPrivateMethod = function(arg) {
		return arg;
	};

	manifest.css =
		'.{class:header} { margin-bottom: 3px; }' +
		'.{class:avatar} .{class:image} { float: left; margin-right: -48px; }' +
		'.{class:avatar} img { width: 48px; height: 48px; }' +
		'.{class:fields} { width: 100%; float: left; }' +
		'.{class:fields} input { width: 100%; }';

	return manifest;

};

})(Echo.jQuery);
