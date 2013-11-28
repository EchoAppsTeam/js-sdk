Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/events",
	"echo/labels"
], function($, Plugin, Utils, Events, Labels) { 

"use strict";

var suite = Echo.Tests.Unit.Plugin = function() {};

suite.prototype.info = {
	"className": "Echo.Plugin",
	"functions": [

		// static interface
		"definition",
		"create",
		"isDefined",
		"getClass",

		// dynamic interface
		"init",
		"log",
		"set",
		"get",
		"remove",
		"substitute",
		"enable",
		"disable",
		"enabled",
		"invoke",
		"extendTemplate",
		"parentRenderer",
		"requestDataRefresh",

		// internal classes to define public interface
		"Labels.set",
		"Labels.get",
		"Config.set",
		"Config.get",
		"Config.remove",
		"Config.assemble",
		"Events.publish",
		"Events.subscribe",
		"Events.unsubscribe"
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
		var definition = {
			"name": "MyTestPlugin",
			"component": {
				"name": suite.app().getTestAppClassName(),
				"renderers": {}
			},
			"config": {},
			"labels": {},
			"events": {},
			"methods": {},
			"renderers": {},
			"templates": {}
		};

		var _definition = Plugin.definition(definition.name, definition.component.name);
		QUnit.ok(!!_definition.init,
			"Checking if we have a default initialization function in the \"definition\" function return");
		delete _definition.init;
		delete _definition.destroy;
		delete _definition.enabled;
		QUnit.deepEqual(definition, _definition,
			"Checking the \"definition\" function output");

		// create test app
		suite.app().createTestApp();

		QUnit.ok(!Plugin.isDefined(definition),
			"Checking that the plugin class isn't defined (via isDefined static method), before actual plugin definition");
		QUnit.ok(!Plugin.isDefined(Plugin._getClassName(definition.name, definition.component.name)),
			"Checking that the plugin class isn't defined(via isDefined static method with plugin name as a parameter), before actual plugin definition");
		QUnit.ok(!Plugin.getClass(definition.name, definition.component.name),
			"Checking that we haven't a reference to the plugin class (via getClass static method), before actual plugin definition");

		// create plugin class out of definition
		suite.createTestPlugin(definition.name, definition.component.name);

		// checking if we have class after class definition
		QUnit.ok(Plugin.isDefined(definition),
			"Checking if the plugin class was defined (via isDefined static method), after class definition");
		QUnit.ok(Plugin.isDefined(Plugin._getClassName(definition.name, definition.component.name)),
			"Checking if the plugin class was defined (via isDefined static method with plugin name as a parameter), after class definition");
		QUnit.ok(!!Plugin.getClass(definition.name, definition.component.name),
			"Checking if we have a reference to the plugin class (via getClass static method), before actual plugin definition");

		// checking plugin class name definition
		QUnit.equal(
			Plugin._getClassName(definition.name, definition.component.name),
			"Echo.StreamServer.Apps.MyTestApp.Plugins.MyTestPlugin",
			"Checking if the \"_getClassName\" returns full plugin class name");
		QUnit.equal(
			Plugin._getClassName(undefined, definition.component.name),
			undefined,
			"Checking if the \"_getClassName\" returns undefined if the plugin name is undefined");
		QUnit.equal(
			Plugin._getClassName(definition.name, undefined),
			undefined,
			"Checking if the \"_getClassName\" returns undefined if the component name is undefined");

		// create separate plugin to use later in tests
		suite.createTestPlugin(suite.getTestPluginName(), definition.component.name);

		this.sequentialAsyncTests([
			"basicOperations",
			"initializationWithInvalidParams",
			"enabledConfigParamCheck",
			"configInterfaceCheck",
			"pluginRenderingMechanism",
			"eventsMechanism",
			"labelsOverriding",
			"destroy"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.basicOperations = function(callback) {
	var test = this;
	var check = function() {
		var app = this;
		var plugin = app.getPlugin(suite.getTestPluginName());

		// checking basic interface availability
		QUnit.ok(!!plugin.events,
			"Checking if we have \"events\" interface available");
		QUnit.ok(!!plugin.config,
			"Checking if we have \"config\" interface available");
		QUnit.ok(!!plugin.labels,
			"Checking if we have \"labels\" interface available");

		// checking if we have component reference
		QUnit.ok(plugin.component && plugin.component.name == app.name,
			"Checking if we have valid \"component\" reference");

		// checking if all functions defined in "methods" namespace are available
		QUnit.ok(plugin.myMethod(true),
			"Checking if public methods are available and executable");
		QUnit.ok(plugin._myPrivateMethod(true),
			"Checking if private methods are available and executable");

		// checking "get" operation
		var data = suite.data.config.data;
		QUnit.equal(plugin.get("non-existing-key"), undefined,
			"Trying to fetch the value using non-existing key via \"get\" function");
		QUnit.equal(plugin.get("non-existing-key", "default"), "default",
			"Trying to fetch the value using non-existing key via \"get\" function and passing default value");
		QUnit.equal(plugin.get("non-existing-key", false), false,
			"Trying to fetch the value using non-existing key via \"get\" function and passing 'false' as a default value");

		// checking "set"/"get"/"remove" scenario
		plugin.set("myField", "myValue");
		QUnit.equal(plugin.get("myField"), "myValue",
			"Checking basic value set/get scenario (value of type string)");
		plugin.set("myField", {"key1": "value1"});
		QUnit.equal(plugin.get("myField.key1"), "value1",
			"Checking basic value set/get scenario (value of type object)");
		plugin.remove("myField", "myValue");
		QUnit.equal(plugin.get("myField"), undefined,
			"Checking field remove operation");

		// checking "substitute" method
		$.each(suite.data.substitutions, function(id, substitution) {
			QUnit.equal(
				plugin.substitute({
					"template": substitution[0],
					"instructions": substitution[2]
				}),
				substitution[1],
				"Checking \"substitute\" method, pattern #" + (id + 1));
		});

		// checking "enable"/"disable" methods
		QUnit.ok(plugin.enabled(),
			"Checking if a plugin is enabled");
		plugin.disable();
		QUnit.ok(!plugin.enabled(),
			"Checking if a plugin was disabled after \"disable\" function call");
		plugin.enable();
		QUnit.ok(plugin.enabled(),
			"Checking if a plugin was enabled back after \"enable\" function call");

		try {
			// checking log() calls with invalid params
			plugin.log();
			plugin.log({});

			// call log() with valid params
			plugin.log({
				"type": "warning",
				"message": "Test message from the Plugin class",
				"args": {"a": 1, "b": 2, "c": 3, "d": []}
			});

			// checking if no exceptions were thrown
			QUnit.ok(true, "Checking if no exceptions were thrown while executing the \"log\" function with valid and invalid params");
		} catch(e) {
			QUnit.ok(e, "Execution of the \"log\" function caused exception.");
		};

		// checking "invoke" method
		var cases = [
			[plugin.enabled, true],
			[function() { return this.cssClass; },
				"echo-streamserver-apps-mytestapp-plugin-MyTestPlugin"],
			[function() { return this.fakeKey; }, undefined],
			[function() { return this.get("data.key1")}, "key1 value"],
			[function() { return this.get("name")}, "MyTestPlugin"]
		];
		$.each(cases, function(id, _case) {
			QUnit.strictEqual(
				Utils.invoke(_case[0], plugin),
				_case[1],
				"Checking \"invoke()\" method, case #" + (id + 1)
			);
		});

		this.destroy();

		callback && callback();
	};
	suite.app().initTestApp({
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": check
	});
};

suite.prototype.cases.initializationWithInvalidParams = function(callback) {
	var initWithMissingParams = function(_callback) {
		suite.app().initTestApp({
			"plugins": [{
				"name": "MyTestPlugin"
			}],
			"ready": function() {
				var plugin = this.getPlugin("MyTestPlugin");
				QUnit.ok(!plugin,
					"Checking if the plugin was disabled if invalid config params were passed and \"init\" function returned \"false\"");

				this.destroy();

				_callback();
			}
		});
	};
	var initWithMandatoryParamsDefined = function(_callback) {
		suite.app().initTestApp({
			"plugins": [{
				"name": "MyTestPlugin",
				"requiredParam1": true,
				"requiredParam2": true
			}],
			"ready": function() {
				var plugin = this.getPlugin("MyTestPlugin");
				QUnit.ok(!!plugin,
					"Checking if the plugin was initialize successfully if valid config params were defined");

				this.destroy();

				_callback();
			}
		});
	};
	this.sequentialCall([
		initWithMissingParams,
		initWithMandatoryParamsDefined,
		callback
	]);
};

suite.prototype.cases.enabledConfigParamCheck = function(callback) {
	var plugin = {
		"name": "MyTestPlugin",
		"requiredParam1": true,
		"requiredParam2": true
	};
	var checker = function(label, active, cb) {
		return function(_callback) {
			QUnit.ok(!!this.getPlugin("MyTestPlugin") == active, label);
			this.destroy();
			cb();
		};
	};
	var initWithEnabledAsFunction = function(_callback) {
		plugin.enabled = function() { return true; };
		suite.app().initTestApp({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is active if the \"enabled\" field is defined as a function", true, _callback)
		});
	};
	var initWithEnabledAsBooleanTrue = function(_callback) {
		plugin.enabled = true;
		suite.app().initTestApp({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is active if the \"enabled\" field is defined as a boolean (true)", true, _callback)
		});
	};
	var initWithEnabledAsBooleanFalse = function(_callback) {
		plugin.enabled = false;
		suite.app().initTestApp({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is inactive if the \"enabled\" field is defined as a boolean (false)", false, _callback)
		});
	};
	var initWithoutEnabledParam = function(_callback) {
		delete plugin.enabled;
		suite.app().initTestApp({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is active if the \"enabled\" field is omitted", true, _callback)
		});
	};
	this.sequentialCall([
		initWithEnabledAsFunction,
		initWithEnabledAsBooleanTrue,
		initWithEnabledAsBooleanFalse,
		initWithoutEnabledParam,
		callback
	]);
};

suite.prototype.cases.configInterfaceCheck = function(callback) {
	var check = function() {
		var plugin = this.getPlugin("MyTestPlugin");

		QUnit.equal(plugin.config.get("nullParam"), "nullParam replacement",
			"Checking if null parameter was overridden during app init");
		QUnit.equal(plugin.config.get("undefinedParam"), "undefinedParam replacement",
			"Checking if null parameter was overridden during app init");

		// checking if the config is available inside the plugin
		plugin.proxy(function() {
			QUnit.equal(this.config.get("objectParam.param1"), "param1.override",
				"Checking if object parameter was overridden (checking new key)");
			QUnit.equal(this.config.get("objectParam.param2"), undefined,
				"Checking if object parameter was overridden (checking existing key)");
			QUnit.equal(this.config.get("myParam"), undefined,
				"Trying to extract undefined key value");

			this.config.set("myParam", "my value");
			QUnit.equal(this.config.get("myParam"), "my value",
				"Extracting value after config value definition");

			this.config.remove("myParam");
			QUnit.equal(this.config.get("myParam"), undefined,
				"Checking if the value was wiped out of config");

			var nested = this.config.assemble();
			QUnit.ok(nested.plugins[0].name == "MyNestedPlugin",
				"Checking if the \"nestedPlugins\" were copied over to \"plugins\" section in the \"assemble\" function call result");
			QUnit.ok(!!nested.parent,
				"Checking if we have parent config in the \"assemble\" function call result");
			QUnit.ok(!!nested.appkey,
				"Checking if basic params defined in the \"assemble\" function call result");
		});

		this.destroy();

		callback && callback();
	};
	suite.app().initTestApp({
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true,
			"objectParam": {"param1": "param1.override"},
			"myTestParam": "test value",
			"undefinedParam": "undefinedParam replacement",
			"nullParam": "nullParam replacement",
			"nestedPlugins": [{
				"name": "MyNestedPlugin"
			}]
		}],
		"ready": check
	});
};

suite.prototype.cases.pluginRenderingMechanism = function(callback) {
	var _suite = this;
	var check = function() {
		var self = this;
		var plugin = this.getPlugin("MyTestPlugin");
		QUnit.ok(this.config.get("target") instanceof $, //$ is a jQuery, for sure
			"Checking if the target if a jQuery element");
		QUnit.ok(!!this.config.get("target").children().length,
			"Checking if target is not empty after rendering");

		// checking if we have expected results in several elements
		var assertions = [
			["data", "key1 value"],
			["configString", "Some plugin test value"],
			["configInteger", "150"],
			["configUndefined", ""],
			["configObject", ""],
			["configArray", ""],
			["label", "plugin label1 value"],
			["labelNonExisting", "nonexistinglabel"]
		];

		$.map(assertions, function(assertion) {
			QUnit.equal(
				self.view.get("plugin_" + assertion[0]).html(),
				assertion[1],
				"Checking rendering output of the \"" + assertion[0] + "\" element"
			);
		});

		QUnit.ok(!!this.view.get("testRenderer").children().length,
			"Checking if initially empty element became non-empty after applying renderer");

		// checking extendRenderer & parentRenderer functions
		QUnit.ok(this.view.get("testComponentRenderer").children().length == 2,
			"Checking multiple extension of the same renderer, checking if \"parentRenderer\" function is called");

		// checking extendTemplate function
		var actions = ["insertAsLastChild", "insertBefore", "insertAfter", "insertAsFirstChild", "replace"];
		$.map(actions, function(action) {
			var element = self.view.get("ext_" + action);
			QUnit.ok(element.html() == action,
				"Checking \"" + action + "\" extendTemplate method");
		});
		QUnit.ok(!self.view.get("plugin_templateRemoveCheck"),
			"Checking \"remove\" extendTemplate method");

		// checking plugin.view.* methods
		QUnit.ok(!!plugin.view.get("testPluginRenderer"),
			"Checking if we have a proper element as a result of the plugin.view.get(name) call");
		_suite.jqueryObjectsEqual($(plugin.view.get("testPluginRenderer").html()),
			$("<div>Plugin extension (testPluginRenderer)</div>"),
			"Checking if a renderer was applied to the element added within the plugin");

		plugin.view.remove("testPluginRenderer");
		QUnit.equal(plugin.view.get("testPluginRenderer"), undefined,
			"Checking if an element is not available after view.remove call");

		this.destroy();

		callback && callback();
	};
	suite.app().initTestApp({
		"data": suite.data.config.data,
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true,
			"undefinedParam": "undefinedParam replacement",
			"nullParam": "nullParam replacement",
			"nestedPlugins": [{
				"name": "MyNestedPlugin"
			}]
		}],
		"ready": check
	});
};

suite.prototype.cases.eventsMechanism = function(callback) {
	var count = 0, increment = function() { count++; };
	var _topic = "myTestTopic";
	var context = Utils.getUniqueString();
	var publish = function(topic) {
		Events.publish({
			"topic": topic || _topic,
			"context": context
		});
	};
	var subscribe = function(topic) {
		return Events.subscribe({
			"topic": topic || _topic,
			"context": context,
			"handler": increment
		});
	};
	subscribe("Echo.App.onDataInvalidate");
	subscribe("Echo.StreamServer.Apps.MyTestApp.Plugins.MyTestPlugin.outgoing.event.test");
	var check = function() {
		var plugin = this.getPlugin("MyTestPlugin");

		// subscribing to incoming events
		var id = plugin.events.subscribe({
			"topic": "incoming.event.test",
			"handler": increment
		});
		publish("incoming.event.test");
		publish("incoming.event.test");
		publish("incoming.event.test");

		// publishing outgoing event
		plugin.events.publish({"topic": "outgoing.event.test"});
		plugin.events.publish({"topic": "outgoing.event.test"});
		plugin.events.publish({"topic": "outgoing.event.test"});

		// checking events defined in definition
		plugin.set("_eventHandler", increment);

		publish("incoming.event.global.test");
		publish("incoming.event.local.test");

		// check if no events received after unsubscribing
		plugin.events.unsubscribe({"handlerId": id});
		publish("incoming.event.test");
		publish("incoming.event.test");
		publish("incoming.event.test");

		// check "requestDataRefresh" method,
		// we expect that the "internal.Echo.App.onDataInvalidate" is fired
		plugin.requestDataRefresh();

		QUnit.ok(count == 9,
			"Checking if expected amount of events were executed and handled");

		var e = plugin.events;
		QUnit.ok(!!e.subscribe && !!e.publish && !!e.unsubscribe,
			"Checking app \"events\" interface contract");

		this.destroy();

		callback && callback();
	};
	suite.app().initTestApp({
		"context": context,
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": check
	});
};

suite.prototype.cases.labelsOverriding = function(callback) {
	Labels.set({
		"label1": "label1 global override",
		"label2": "label2 global override"
	}, "Echo.StreamServer.Apps.MyTestApp.Plugins.MyTestPlugin");
	var check = function() {
		var plugin = this.getPlugin("MyTestPlugin");

		QUnit.equal(plugin.labels.get("label1"), "label1 override via config",
			"Checking labels override via plugin config");
		QUnit.equal(plugin.labels.get("label2"), "label2 global override",
			"Checking labels override via plugin config");
		QUnit.equal(plugin.labels.get("label3"), "plugin label3 value",
			"Checking extraction from the plugin defined labels set");

		this.destroy();

		callback && callback();
	};
	suite.app().initTestApp({
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true,
			"labels": {
				"label1": "label1 override via config"
			}
		}],
		"ready": check
	});
};

suite.prototype.cases.destroy = function(callback) {
	suite.app().initTestApp({
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": function() {
			var plugin = this.getPlugin("MyTestPlugin");
			plugin.set("_destroyHandler", function() {
				QUnit.ok(true,
					"Checking if the plugin \"destroy\" method was called after the \"destroy\" app function was called");
			});

			this.destroy();

			callback && callback();
		}
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
	"test string with substitutions {plugin.label:label1}",
	"test string with substitutions plugin label1 value"
], [
	"bad pattern should not break the string {plugin.label:} {plugin.config:} {plugin.self:}",
	"bad pattern should not break the string {plugin.label:} {plugin.config:} {plugin.self:}"
], [
	"non existing label extraction {label:nonexisting}, shoud return key",
	"non existing label extraction nonexisting, shoud return key"
], [
	"<div class=\"{plugin.class:test}\">div with css class name defined</div>",
	"<div class=\"echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test\">div with css class name defined</div>"
], [
	"<div class=\"{plugin.class:test} {plugin.class:test1} {plugin.class:test2}\">div with multiple css class names defined</div>",
	"<div class=\"echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test1 echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test2\">div with multiple css class names defined</div>"
], [
	"<div class=\"{plugin.class:test}\">Checking transformation of the {plugin.data:} -> {self:} {plugin.data:key3.key3nested}</div>",
	"<div class=\"echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test\">Checking transformation of the {plugin.data:} -> {self:} {self:plugins.MyTestPlugin.data.key3.key3nested}</div>"
], [
	"<div class=\"{plugin.class:test}\">{plugin.label:label1}{plugin.label:label2}{plugin.self:data.key3.key3nested}{plugin.class:example} - mix of multiple patterns</div>",
	"<div class=\"echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-test\">plugin label1 valueplugin label2 value{self:plugins.MyTestPlugin.data.key3.key3nested}echo-streamserver-apps-mytestapp-plugin-MyTestPlugin-example - mix of multiple patterns</div>"
]];

suite.data.template =
	'<div class="{class:plugin_container}">' +
		'<div class="{class:testRenderer} {plugin.class:testRenderer}"></div>' +
		'<div class="{class:plugin_testRenderer} {plugin.class:testRenderer}"></div>' +
		'<div class="{class:plugin_templateExtensionCheck}"></div>' +
		'<div class="{class:plugin_templateReplaceCheck}"></div>' +
		'<div class="{class:plugin_templateRemoveCheck}"></div>' +
		'<div class="{plugin.class:testPluginRenderer}"></div>' +
		// checking {plugin.data:...} substitution
		'<div class="{class:plugin_data} echo-primaryFont echo-primaryColor">{plugin.data:key1}</div>' +
		'<div class="{class:plugin_dataNested} echo-primaryColor">{plugin.data:key3.key3nested}</div>' +
		'<div class="{class:plugin_dataNonExisting}">{plugin.data:nonexistingkey}</div>' +
		// checking {plugin.label:...} substitution
		'<div class="{class:plugin_label} echo-primaryFont">{plugin.label:label1}</div>' +
		'<div class="{class:plugin_labelNonExisting}">{plugin.label:nonexistinglabel}</div>' +
		// checking {plugin.class:...} substitution
		'<div class="{class:plugin_class}">{plugin.class:myclass}</div>' +
		// checking {plugin.config:...} substitution
		'<div class="{class:plugin_configNonExisting}">{plugin.config:nonexistingkey}</div>' +
		'<div class="{class:plugin_configString} echo-primaryFont">{plugin.config:stringPluginParam}</div>' +
		'<div class="{class:plugin_configArray}">{plugin.config:arrayPluginParam}</div>' +
		'<div class="{class:plugin_configInteger} echo-primaryFont">{plugin.config:integerPluginParam}</div>' +
		'<div class="{class:plugin_configUndefined}">{plugin.config:undefinedPluginParam}</div>' +
		'<div class="{class:plugin_configObject} echo-primaryFont">{plugin.config:objectPluginParam}</div>' +
		'<div class="{class:plugin_configObjectNested} echo-primaryFont">{plugin.config:objectPluginParam.param1}</div>' +
		// checking {plugin.self:...} substitution
		'<div class="{class:plugin_selfData} echo-primaryFont">{plugin.self:data}</div>' +
		'<div class="{class:plugin_selfDataKey} echo-primaryFont">{plugin.self:data.key1}</div>' +
		'<div class="{class:plugin_selfDataKeyNested}">{plugin.self:data.key3.key3nested}</div>' +
		'<div class="{class:plugin_selfNonExistingKey}">{plugin.self:nonExistingKey}</div>' +
		'<div class="{class:plugin_selfFunction}">{plugin.self:render}</div>' +
	'</div>';

suite.data.config = {
	"stringPluginParam": "Some plugin test value",
	"arrayPluginParam": [100, 200, 300, 400, 500],
	"integerPluginParam": 150,
	"undefinedPluginParam": undefined,
	"objectPluginParam": {
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

suite.app = function() {
	var App = function() {};
	$.extend(true, App, Echo.Tests.Unit.App);  
    return App; 
};

suite.getTestPluginName = function() {
	return "MyTestPlugin";
};

suite.createTestPlugin = function(name, component) {
	Plugin.create(suite.getPluginDefinition(name, component));
};

suite.getPluginDefinition = function(name, component) {

	var definition = Plugin.definition(name, component);

	definition.config = $.extend(true, {}, suite.data.config);

	definition.labels = {
		"label1": "plugin label1 value",
		"label2": "plugin label2 value",
		"label3": "plugin label3 value"
	};

	definition.init = function() {
		var plugin = this;

		this.data = {
			"key1": "key1 value",
			"key2": "key2 value",
			"key3": {
				"key3nested": "nested value for key 3"
			}
		};

		// appending main template
		this.extendTemplate("insertAsLastChild", "container", definition.templates.main);

		// extending template using different constructions
		var actions = ["insertAsLastChild", "insertBefore", "insertAfter", "insertAsFirstChild"];
		$.map(actions, function(action) {
			plugin.extendTemplate(
				action,
				"plugin_templateExtensionCheck",
				'<div class="{class:ext_' + action + '}">' + action + '</div>'
			);
		});
		plugin.extendTemplate(
			"replace",
			"plugin_templateReplaceCheck",
			'<div class="{class:ext_replace}">replace</div>'
		);
		plugin.extendTemplate(
			"remove",
			"plugin_templateRemoveCheck"
		);
	};

	definition.enabled = function() {
		return (this.config.get("requiredParam1") && this.config.get("requiredParam2"));
	};

	definition.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};

	definition.templates.main = suite.data.template;

	definition.events = {
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

	definition.renderers.testPluginRenderer = function(element) {
		this.parentRenderer("testPluginRenderer", arguments);
		return element.append('<div>Plugin extension (testPluginRenderer)</div>');
	};

	definition.component.renderers.testComponentRenderer = function(element) {
		this.parentRenderer("testComponentRenderer", arguments);
		return element.append('<div>Plugin extension (testComponentRenderer)</div>');
	};

	definition.component.renderers.testRendererWithExtra = function(element, extra) {
		return element.empty().append('<span>' + extra.value + '</span>');
	};

	definition.methods.myMethod = function(arg) {
		return arg;
	};

	definition.methods.proxy = function(func) {
		return func.call(this);
	};

	definition.methods._myPrivateMethod = function(arg) {
		return arg;
	};

	definition.css =
		'.{plugin.class:header} { margin-bottom: 3px; }' +
		'.{plugin.class:avatar} .{class:image} { float: left; margin-right: -48px; }' +
		'.{plugin.class:avatar} img { width: 48px; height: 48px; }' +
		'.{plugin.class:fields} { width: 100%; float: left; }' +
		'.{plugin.class:fields} input { width: 100%; }';

	return definition;

};
callback();
});
});
