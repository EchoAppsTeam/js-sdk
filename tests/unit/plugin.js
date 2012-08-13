(function(jQuery) {
var $ = jQuery;

"use strict";

Echo.Tests.Dependencies = Echo.Tests.Dependencies || {};
Echo.Tests.Dependencies.Plugin = {};

var suite = Echo.Tests.Unit.Plugin = function() {};

suite.prototype.info = {
	"className": "Echo.Plugin",
	"functions": [

		// static interface
		"manifest",
		"create",
		"isDefined",
		"getClass",

		// dynamic interface
		"log",
		"set",
		"get",
		"remove",
		"substitute",
		"enable",
		"disable",
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
		var manifest = {
			"name": "MyTestPlugin",
			"component": {
				"name": suite.control().getTestControlClassName(),
				"renderers": {}
			},
			"config": {},
			"labels": {},
			"events": {},
			"methods": {},
			"renderers": {},
			"templates": {},
			"dependencies": [],
			"destroy": undefined
		};

		var _manifest = Echo.Plugin.manifest(manifest.name, manifest.component.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.enabled;
		QUnit.deepEqual(manifest, _manifest,
			"Checking the \"manifest\" function output");

		// create test control
		suite.control().createTestControl();

		// checking if we have class before it was defined
		QUnit.ok(!Echo.Plugin.isDefined(manifest),
			"Checking if the plugin class was defined (via isDefined static method), before actual plugin definition");
		QUnit.ok(!Echo.Plugin.getClass(manifest.name, manifest.component.name),
			"Checking if we have a reference to the plugin class (via getClass static method), before actual plugin definition");

		// create plugin class out of manifest
		suite.createTestPlugin(manifest.name, manifest.component.name);

		// checking if we have class after class definition
		QUnit.ok(Echo.Plugin.isDefined(manifest),
			"Checking if the plugin class was defined (via isDefined static method), after class definition");
		QUnit.ok(!!Echo.Plugin.getClass(manifest.name, manifest.component.name),
			"Checking if we have a reference to the plugin class (via getClass static method), before actual plugin definition");

		// checking plugin class name definition
		QUnit.equal(
			Echo.Plugin._getClassName(manifest.name, manifest.component.name),
			"Echo.StreamServer.Controls.MyTestControl.Plugins.MyTestPlugin",
			"Checking if the \"_getClassName\" returns full plugin class name");
		QUnit.equal(
			Echo.Plugin._getClassName(undefined, manifest.component.name),
			undefined,
			"Checking if the \"_getClassName\" returns undefined if the plugin name is undefined");
		QUnit.equal(
			Echo.Plugin._getClassName(manifest.name, undefined),
			undefined,
			"Checking if the \"_getClassName\" returns undefined if the component name is undefined");

		// create separate plugin to use later in tests
		suite.createTestPlugin(suite.getTestPluginName(), manifest.component.name);

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
		var control = this;
		var plugin = control.getPlugin(suite.getTestPluginName());

		// checking basic interface availability
		QUnit.ok(!!plugin.events,
			"Checking if we have \"events\" interface available");
		QUnit.ok(!!plugin.config,
			"Checking if we have \"config\" interface available");
		QUnit.ok(!!plugin.labels,
			"Checking if we have \"labels\" interface available");

		// checking if we have component reference
		QUnit.ok(plugin.component && plugin.component.name == control.name,
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
				plugin.substitute(substitution[0], undefined, substitution[2]),
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

		// checking if all dependencies are available
		var result = true;
		for (var i = 1; i < 6; i++) {
			if (!Echo.Tests.Dependencies.Plugin["dep" + i]) result = false;
		}
		QUnit.ok(result, "Checking if all dependencies are downloaded and available");

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

		this.destroy();

		callback && callback();
	};
	suite.control().initTestControl({
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
		suite.control().initTestControl({
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
		suite.control().initTestControl({
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
		suite.control().initTestControl({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is active if the \"enabled\" field is defined as a function", true, _callback)
		});
	};
	var initWithEnabledAsBooleanTrue = function(_callback) {
		plugin.enabled = true;
		suite.control().initTestControl({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is active if the \"enabled\" field is defined as a boolean (true)", true, _callback)
		});
	};
	var initWithEnabledAsBooleanFalse = function(_callback) {
		plugin.enabled = false;
		suite.control().initTestControl({
			"plugins": [plugin],
			"ready": checker("Checking if the plugin is inactive if the \"enabled\" field is defined as a boolean (false)", false, _callback)
		});
	};
	var initWithoutEnabledParam = function(_callback) {
		delete plugin.enabled;
		suite.control().initTestControl({
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
			"Checking if null parameter was overridden during control init");
		QUnit.equal(plugin.config.get("undefinedParam"), "undefinedParam replacement",
			"Checking if null parameter was overridden during control init");

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
			QUnit.ok(!!nested.appkey && !!nested.apiBaseURL && !!nested.submissionProxyURL,
				"Checking if basic params defined in the \"assemble\" function call result");
		});

		this.destroy();

		callback && callback();
	};
	suite.control().initTestControl({
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
	var check = function() {
		var self = this;
		var plugin = this.getPlugin("MyTestPlugin");
		QUnit.ok(this.config.get("target") instanceof jQuery,
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
				self.dom.get("plugin_" + assertion[0]).html(),
				assertion[1],
				"Checking rendering output of the \"" + assertion[0] + "\" element"
			);
		});

		QUnit.ok(!!this.dom.get("testRenderer").children().length,
			"Checking if initially empty element became non-empty after applying renderer");

		// checking extendRenderer & parentRenderer functions
		QUnit.ok(this.dom.get("testComponentRenderer").children().length == 2,
			"Checking multiple extension of the same renderer, checking if \"parentRenderer\" function is called");

		// checking extendTemplate function
		var actions = ["insertAsLastChild", "insertBefore", "insertAfter", "insertAsFirstChild", "replace"];
		$.map(actions, function(action) {
			var element = self.dom.get("ext_" + action);
			QUnit.ok(element.html() == action,
				"Checking \"" + action + "\" extendTemplate method");
		});
		QUnit.ok(!self.dom.get("plugin_templateRemoveCheck"),
			"Checking \"remove\" extendTemplate method")

		// checking plugin.dom.* methods
		QUnit.ok(!!plugin.dom.get("testPluginRenderer"),
			"Checking if we have a proper element as a result of the plugin.dom.get(name) call");
		QUnit.equal(plugin.dom.get("testPluginRenderer").html(),
			"<div>Plugin extension (testPluginRenderer)</div>",
			"Checking if a renderer was applied to the element added within the plugin");

		plugin.dom.remove("testPluginRenderer");
		QUnit.equal(plugin.dom.get("testPluginRenderer"), undefined,
			"Checking if an element is not available after dom.remove call");

		plugin.dom.clear();
		QUnit.ok($.isEmptyObject(plugin.dom.elements),
			"Checking plugin.dom.clear() function");

		this.destroy();

		callback && callback();
	};
	suite.control().initTestControl({
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
	var context = Echo.Utils.getUniqueString();
	var publish = function(topic) {
		Echo.Events.publish({
			"topic": topic || _topic,
			"context": context
		});
	};
	var subscribe = function(topic) {
		return Echo.Events.subscribe({
			"topic": topic || _topic,
			"context": context,
			"handler": increment
		});
	};
	subscribe("Echo.Control.onDataInvalidate");
	subscribe("Echo.StreamServer.Controls.MyTestControl.Plugins.MyTestPlugin.outgoing.event.test");
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

		// checking events defined in manifest
		plugin.set("_eventHandler", increment);

		publish("incoming.event.global.test");
		publish("incoming.event.local.test");

		// check if no events received after unsubscribing
		plugin.events.unsubscribe({"handlerId": id});
		publish("incoming.event.test");
		publish("incoming.event.test");
		publish("incoming.event.test");

		// check "requestDataRefresh" method,
		// we expect that the "internal.Echo.Control.onDataInvalidate" is fired
		plugin.requestDataRefresh();

		QUnit.ok(count == 9,
			"Checking if expected amount of events were executed and handled");

		var e = plugin.events;
		QUnit.ok(!!e.subscribe && !!e.publish && !!e.unsubscribe,
			"Checking control \"events\" interface contract");

		this.destroy();

		callback && callback();
	};
	suite.control().initTestControl({
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
	Echo.Labels.set({
		"label1": "label1 global override",
		"label2": "label2 global override"
	}, "Echo.StreamServer.Controls.MyTestControl.Plugins.MyTestPlugin");
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
	suite.control().initTestControl({
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
	suite.control().initTestControl({
		"plugins": [{
			"name": "MyTestPlugin",
			"requiredParam1": true,
			"requiredParam2": true
		}],
		"ready": function() {
			var plugin = this.getPlugin("MyTestPlugin");
			plugin.set("_destroyHandler", function() {
				QUnit.ok(true,
					"Checking if the plugin \"destroy\" method was called after the \"destroy\" control function was called");
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
	"<div class=\"echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test\">div with css class name defined</div>"
], [
	"<div class=\"{plugin.class:test} {plugin.class:test1} {plugin.class:test2}\">div with multiple css class names defined</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test1 echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test2\">div with multiple css class names defined</div>"
], [
	"<div class=\"{plugin.class:test}\">Checking transformation of the {plugin.data:} -> {self:} {plugin.data:key3.key3nested}</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test\">Checking transformation of the {plugin.data:} -> {self:} {self:plugins.MyTestPlugin.data.key3.key3nested}</div>"
], [
	"<div class=\"{plugin.class:test}\">{plugin.label:label1}{plugin.label:label2}{plugin.self:data.key3.key3nested}{plugin.class:example} - mix of multiple patterns</div>",
	"<div class=\"echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-test\">plugin label1 valueplugin label2 value{self:plugins.MyTestPlugin.data.key3.key3nested}echo-streamserver-controls-mytestcontrol-plugin-MyTestPlugin-example - mix of multiple patterns</div>"
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

suite.control = function() {
        return Echo.Tests.Unit.Control;
};

suite.getTestPluginName = function() {
	return "MyTestPlugin";
};

suite.createTestPlugin = function(name, component) {
	Echo.Plugin.create(suite.getPluginManifest(name, component));
};

suite.getPluginManifest = function(name, component) {

	var manifest = Echo.Plugin.manifest(name, component);

	manifest.config = $.extend(true, {}, suite.data.config);

	manifest.labels = {
		"label1": "plugin label1 value",
		"label2": "plugin label2 value",
		"label3": "plugin label3 value"
	};

	var addDependency = function(n) {
		manifest.dependencies.push({
			"url": "unit/dependencies/plugin.dep." + n + ".js",
			"loaded": function() { return !!Echo.Tests.Dependencies.Plugin["dep" + n]; }
		});
	};
	for (var i = 1; i < 6; i++) addDependency(i);

	manifest.init = function() {
		var plugin = this;

		this.data = {
			"key1": "key1 value",
			"key2": "key2 value",
			"key3": {
				"key3nested": "nested value for key 3"
			}
		};

		// appending main template
		this.extendTemplate("insertAsLastChild", "container", manifest.templates.main);

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

	manifest.enabled = function() {
		return (this.config.get("requiredParam1") && this.config.get("requiredParam2"));
	};

	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};

	manifest.templates.main = suite.data.template;

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

	manifest.renderers.testPluginRenderer = function(element) {
		this.parentRenderer("testPluginRenderer", arguments);
		return element.append('<div>Plugin extension (testPluginRenderer)</div>');
	};

	manifest.component.renderers.testComponentRenderer = function(element) {
		this.parentRenderer("testComponentRenderer", arguments);
		return element.append('<div>Plugin extension (testComponentRenderer)</div>');
	};

	manifest.component.renderers.testRendererWithExtra = function(element, extra) {
		return element.empty().append('<span>' + extra.value + '</span>');
	};

	manifest.methods.myMethod = function(arg) {
		return arg;
	};

	manifest.methods.proxy = function(func) {
		return func.call(this);
	};

	manifest.methods._myPrivateMethod = function(arg) {
		return arg;
	};

	manifest.css =
		'.{plugin.class:header} { margin-bottom: 3px; }' +
		'.{plugin.class:avatar} .{class:image} { float: left; margin-right: -48px; }' +
		'.{plugin.class:avatar} img { width: 48px; height: 48px; }' +
		'.{plugin.class:fields} { width: 100%; float: left; }' +
		'.{plugin.class:fields} input { width: 100%; }';

	return manifest;

};

})(Echo.jQuery);
