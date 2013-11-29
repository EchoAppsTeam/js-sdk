Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/app",
		"echo/utils",
		"echo/events",
		"echo/labels"
		
	], function($, App, Utils, Events, Labels) {

	"use strict";

	var suite = Echo.Tests.Unit.App = function() {};

	suite.prototype.info = {
		"className": "Echo.App",
		"functions": [
			"definition",
			"create",
			"log",
			"get",
			"set",
			"remove",
			"invoke",
			"substitute",
			"dependent",
			"template",
			"getPlugin",
			"destroy",
			"refresh",
			"render",
			"isDefined",
			"initApp",
			"getApp",
			"destroyApp",
			"destroyApps",
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
			var definition = {
				"name": suite.getTestAppClassName(),
				"vars": {},
				"config": {},
				"labels": {},
				"events": {},
				"methods": {},
				"renderers": {},
				"static": {},
				"templates": {}
			};

			var _definition = App.definition(definition.name);
			QUnit.ok(!!_definition.init,
				"Checking if we have a default initialization function in the \"definition\" function return");
			delete _definition.init;
			delete _definition.destroy;
			QUnit.deepEqual(definition, _definition, "Checking the \"definition\" function output");

			suite.createComponents(["TestComponent1", "TestComponent2", "TestComponent3"]);

			// checking if we have class before it was defined
			QUnit.ok(!App.isDefined(definition),
				"Checking if the application class was defined (via isDefined static method), before actual application definition");

			// create class out of definition
			suite.createTestApp(definition.name);

			// checking if we have class after class definition
			QUnit.ok(App.isDefined(definition),
				"Checking if the application class was defined (via isDefined static method), after application definition");

			// create test plugin
			suite.plugin().createTestPlugin("MyPlugin", definition.name);

			this.sequentialAsyncTests([
				"basicOperations",
				"initializationWithInvalidParams",
				"incomingConfigHandling",
				"appRendering",
				"eventsMechanism",
				"labelsOverriding",
				"refresh",
				"destroyCalled",
				"destroyBroadcasting",
				"definitionBaseInheritance",
				"nestedReadyCallbacks",
				"inheritedEvent",
				"initApp",
				"destroyApp",
				"destroyApps"
			], "cases");

		}
	};

	suite.prototype.cases = {};

	suite.prototype.cases.initApp = function(callback) {
		var self = this;
		var check = function() {
			QUnit.ok(true,
	 			"Checking that app.onReady() handler was called after initApp()");
			QUnit.equal(this.config.get("key1"), "value1",
				"Checking that parent section of component config is the config of appropriate application");
			this.initApp({
				"id": "TestApp",
				"component": "unit/apps/testApp",
				"config": {
					"target": self.config.target,
					"ready": function() {
						QUnit.ok(true,
							"Checking that app.onReady() handler was called after initApp()");
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
			QUnit.ok(this.getApp("TestApp") && this.getApp("TestApp") instanceof App, 
				"Check getApp() returns a ref to the initialized component");
			QUnit.strictEqual(undefined, this.getApp("TestComponent1000"), 
				"Check getApp() returns \"undefined\" value for the uninitialized component");
			this.destroy();
		};
		Echo.require(["unit/apps/testApp"], function(app) {
			suite.initTestApp({
				"target": self.config.target,
				"appkey": self.config.appkey,
				"labels": {"myLabel": "My label value"},
				"ready": check,
				"key1": "value1",
				"cdnBaseURL": {"provider": "http://cdn.example.com/base"}
			});
		});
	};

	suite.prototype.cases.destroyApp = function(callback) {
		var self = this;
		var check = function() {
			var component = this.initApp({
				"id": "TestApp",
				"component": "unit/apps/testApp",
				"config": {
					"target": self.config.target
				}
			});
			component.set("_destroyHandler", function() {
				QUnit.ok(true,
					"Checking if the app.destroy() mehtod was called after destroyApp()");
			});
			this.destroyApp("TestApp");
			QUnit.equal(this.apps["TestApp"], undefined,
				"Checking that the component was deleted from application after destroyApp()");
			this.destroy();
			callback();
		};
		suite.initTestApp({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"ready": check
		});
	};

	suite.prototype.cases.destroyApps = function(callback) {
		var test = this;
		var check = function() {
			var self = this;
			var components = [{
				"id": "TestComponent1",
				"url":"unit/apps/testApp"
			}, {
				"id": "TestComponent2",
				"url":"unit/apps/testApp"
			}, {
				"id": "TestComponent3",
				"url":"unit/apps/testApp"
			}];
			$.map(components, function(component) {
				self.initApp({
					"id": component.id,
					"component": component.url,
					"config": {
						"target": test.config.target
					}
				});
			});
			var exceptions = ["TestComponent2"];
			this.destroyApps(exceptions);
			QUnit.ok(!this.apps["TestComponent1"] && !this.apps["TestComponent3"],
				"Checking that components were deleted after destroyApps()");
			QUnit.ok(this.apps["TestComponent2"],
				"Checking that component which is in exceptions list was not deleted after destroyApps()");
			this.destroy();
			callback();
		};
		suite.initTestApp({
			"target": this.config.target,
			"appkey": this.config.appkey,
			"ready": check
		});
	};

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
			QUnit.ok(!!this.view,
				"Checking if we have \"view\" interface available");

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
				"Extracting the value of the class variables defined in definition");
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
			QUnit.strictEqual(this.get("myField"), undefined,
				"Checking field remove operation");

			// checking "substitute" method in a regular mode
			$.each(suite.data.substitutions, function(id, substitution) {
				QUnit.equal(
					self.substitute({
						"template": substitution[0],
						"instructions": substitution[2]
					}),
					substitution[1],
					"Checking \"substitute\" method in a regular mode, pattern #" + (id + 1));
			});

			// checking "substitute" method in a strict mode
			$.each(suite.data.strictSubstitutions, function(id, substitution) {
				QUnit[substitution[2] || "equal"](
					self.substitute({
						"template": substitution[0],
						"strict": true
					}),
					substitution[1],
					"Checking \"substitute\" method in a strict mode, pattern #" + (id + 1));
			});

			// checking "dependent" method
			QUnit.ok(!this.dependent(),
				"Checking if a given application was initialized within another application");
			this.config.set("parent", {});
			QUnit.ok(this.dependent(),
				"Checking if \"dependent\" function detects the config update");
			this.config.remove("parent");

			// checking "getPlugin" method
			QUnit.ok(!!this.getPlugin("MyPlugin"),
				"Checking if existing plugin ref is available");
			QUnit.ok(!this.getPlugin("FakePlugin"),
				"Checking if dummy plugin ref is NOT available");
			try {
				// checking log() calls with invalid params
				this.log();
				this.log({});

				// call log() with valid params
				this.log({
					"type": "error",
					"message": "Test message from the Application class",
					"args": {"a": 1, "b": 2, "c": 3}
				});

				// checking if no exceptions were thrown
				QUnit.ok(true, "Checking if no exceptions were thrown while executing the \"log\" function with valid and invalid params");
			} catch(e) {
				QUnit.ok(e, "Execution of the \"log\" function caused exception.");
			}

			// checking "invoke" method
			var cases = [
				[function() { return this.getPlugin("MyFakeTestPlugin"); }, undefined],
				[function() { return this.cssClass; },
					"echo-streamserver-apps-mytestapp"],
				[function() { return this.fakeKey; }, undefined],
				[function() { return this.get("data.key1")}, "key1 value"],
				[function() { return this.get("name")},
					"Echo.StreamServer.Apps.MyTestApp"]
			];
			$.each(cases, function(id, _case) {
				QUnit.strictEqual(
					Utils.invoke(_case[0], self),
					_case[1],
					"Checking \"invoke()\" method, case #" + (id + 1)
				);
			});

			this.destroy();

			callback && callback();
		};
		suite.initTestApp({
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
		var result, definition = suite.getTestAppClass();

		result = new definition();
		QUnit.ok($.isEmptyObject(result),
			"Checking if 'false' is returned if no config is passed");

		result = new definition({"appkey": "echo.jssdk.tests.aboutecho.com"});
		QUnit.ok($.isEmptyObject(result),
			"Checking if empty object is returned if no target is passed in config");

		callback && callback();
	};

	suite.prototype.cases.incomingConfigHandling = function(callback) {
		var parentConfig = {"myParentParam": {"a": 1, "b": 2}};
		var check = function() {
			QUnit.equal(this.config.get("nullParam"), "nullParam replacement",
				"Checking if null parameter was overridden during application init");
			QUnit.equal(this.config.get("undefinedParam"), "undefinedParam replacement",
				"Checking if undefined parameter was overridden during application init");
			QUnit.equal(this.config.get("integerParam"), 15,
				"Checking if non-changed keys remains the same");
			QUnit.equal(this.config.get("objectParam.param1"), "param1.override",
				"Checking if object parameter was overridden (checking new key)");
			QUnit.equal(this.config.get("objectParam.param2"), undefined,
				"Checking if object parameter was overridden (checking existing key)");
			QUnit.equal(this.config.get("defaultAvatar"), Echo.Loader.getURL("images/info70.png", false),
				"Checking if object parameter was overridden and was normalized (checking defaultAvatar key)");

			// IMPORTANT: Echo.Configuration architecture to be revisited within F:1336,
			//            the approach employed below might also be changed as a result

			// checking the way we work with the "data" and "parent" config fields
			suite.data.config.data.extraKey = "extraKey value";
			QUnit.equal(suite.data.config.data.extraKey, this.config.get("data.extraKey"),
				"Checking if the \"data\" key inside the config points to original " +
				"object which we received in the config (we do not copy the \"data\" object)");
			delete suite.data.config.data.extraKey;

			parentConfig.myParentParam.a = 10; // define new value for myParentParam.a
			QUnit.deepEqual(parentConfig, this.config.get("parent"),
				"Checking if the \"parent\" key inside the config points to original " +
				"object which we received in the config (we do not copy the \"parent\" object)");
			parentConfig.myParentParam.a = 1; // define original value for myParentParam.a

			this.destroy();

			callback && callback();
		};
		suite.initTestApp({
			"data": suite.data.config.data,
			"objectParam": {"param1": "param1.override", "param2": undefined},
			"myTestParam": "test value",
			"undefinedParam": "undefinedParam replacement",
			"nullParam": "nullParam replacement",
			"defaultAvatar": Echo.Loader.getURL("images/info70.png", false),
			"parent": parentConfig,
			"ready": check
		});
	};

	suite.prototype.cases.appRendering = function(callback) {
		var _suite = this;
		var check = function(_callback) {
			var self = this;
			QUnit.ok(this.config.get("target") instanceof $, //$ is a jQuery, for sure
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
					self.view.get(assertion[0]).html(),
					assertion[1],
					"Checking rendering output of the \"" + assertion[0] + "\" element"
				);
			});

			QUnit.ok(!!this.view.get("testRenderer").children().length,
				"Checking if initially empty element became non-empty after applying renderer");

			// template rendering
			var cssClass = "." + this.get("cssPrefix") + "testRenderer";
			var template =
				'<div class="{class:container}">' +
					'<div class="k1">{data:k1}</div>' +
					'<div class="k2">{data:k2}</div>' +
					'<div class="{class:testRenderer}"></div>' +
					'<div class="c1">{config:integerParam}</div>' +
				'</div>';
			var result = this.view.fork().render({
				"template": template,
				"target": $("<div></div>"),
				"data": {"k1": "myvalue1", "k2": {}}
			});
			QUnit.ok(!!result.find(cssClass).children().length,
				"Checking if application renderers were applied when we render template (by passing \"template\" key into the \"render\" function)");
			QUnit.equal(result.find(".k1").html(), "myvalue1",
				"Checking data substitution into template (string value)");
			QUnit.equal(result.find(".k2").html(), "",
				"Checking data substitution into template (object value)");
			QUnit.equal(result.find(".c1").html(), "15",
				"Checking config values substitution into template");

			// element rendering, specific renderer application
			var target = this.view.get("testRenderer");
			this.view.render({
				"target": target,
				"name": "testRendererWithExtra",
				"extra": {"value": "my-value"}
			});
			_suite.jqueryObjectsEqual($(target.html()), $("<span>my-value</span>"),
				"Checking if element content was updated after renderer application");

			this.view.render({
				"target": target,
				"name": "testRendererWithExtra",
				"extra": {"value": "another-value"}
			});
			_suite.jqueryObjectsEqual($(target.html()), $("<span>another-value</span>"),
				"Checking if element content was updated as a result of renderer application");

			this.view.render({
				"name": "testRenderer"
			});
			_suite.jqueryObjectsEqual($(target.html()), $("<div>Some value</div>"),
				"Checking if element content was updated as a result of the native renderer application");

			// recursive element rendering
			this.view.get("nestedSubcontainer").append('<div class="extra-div">Extra DIV appended</div>');
			this.view.render({
				"name": "testRendererRecursive",
				"recursive": true
			});
			_suite.jqueryObjectsEqual($(this.view.get("testRendererRecursive").html()), $("<div class=\"" + this.get("cssPrefix") + "nestedContainer\"><div class=\"" + this.get("cssPrefix") + "nestedSubcontainer\"></div></div>"),
				"Checking if element content was updated after recursive rendering");

			// checking re-rendering
			target.append('<div class="extra-div">Extra DIV appended</div>');
			this.config.get("target").append('<div class="extra-div-1">Another DIV appended</div>');
			this.config.get("target").append('<div class="extra-div-2">DIV appended</div>');
			this.render();
			_suite.jqueryObjectsEqual($(this.view.get("testRenderer").html()), $("<div>Some value</div>"),
				"Checking if component was re-rendered and appended elements were wiped out");

			var template = '<div class="echo-utils-tests-footer">footer content</div>';
			this.render();
			_suite.jqueryObjectsEqual($(this.view.get("testRenderer").html()), $("<div>Some value</div>"),
				"Checking app.view.get() function");
			this.view.set("testRenderer", $(template));
			QUnit.equal(this.view.get("testRenderer").html(), "footer content",
				"Checking app.view.set() function");
			this.view.remove("testRenderer");
			QUnit.equal(this.view.get("testRenderer"), undefined,
				"Checking app.view.remove() function");

			this.destroy();

			_callback && _callback();
		};
		Utils.sequentialCall([
			function(_callback) {
				suite.initTestApp({
					"data": suite.data.config.data,
					"ready": function() {
						check.call(this, _callback);
					}
				});
			}, function(_callback) {
				var name = "Echo.StreamServer.Apps.AnotherTestApp";
				suite.createTestApp(name, {"dynamicTemplate": true});
				suite.initTestApp({
					"data": suite.data.config.data,
					"ready": function() {
						check.call(this, _callback);
					}
				}, name);
			}, callback]);
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
			Events.subscribe({
				"topic": topic || _topic,
				"context": context,
				"handler": increment
			});
		};
		subscribe("Echo.StreamServer.Apps.MyTestApp.onRender");
		subscribe("Echo.StreamServer.Apps.MyTestApp.outgoing.event.test");
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

			// checking events defined in definition
			this.set("_eventHandler", increment);

			publish("incoming.event.global.test");
			publish("incoming.event.local.test");

			QUnit.ok(count == 9,
				"Checking if expected amount of events were executed and handled");

			var e = this.events;
			QUnit.ok(!!e.subscribe && !!e.publish && !!e.unsubscribe,
				"Checking application \"events\" interface contract");

			this.destroy();

			callback && callback();
		};
		suite.initTestApp({
			"context": context,
			"ready": check
		});
	};

	suite.prototype.cases.labelsOverriding = function(callback) {
		Labels.set({
			"label1": "label1 global override",
			"label2": "label2 global override"
		}, "Echo.StreamServer.Apps.MyTestApp");
		var check = function() {
			QUnit.equal(this.labels.get("label1"), "label1 override via config",
				"Checking labels override via application config");
			QUnit.equal(this.labels.get("label2"), "label2 global override",
				"Checking labels override via application config");
			QUnit.equal(this.labels.get("label3"), "label3 value",
				"Checking extraction from the application defined labels set");

			this.destroy();

			callback && callback();
		};
		suite.initTestApp({
			"labels": {
				"label1": "label1 override via config"
			},
			"ready": check
		});
	};

	suite.prototype.cases.refresh = function(callback) {
		var check = function() {
			var app = this;
			this.events.subscribe({
				"topic": "Echo.StreamServer.Apps.MyTestApp.onRefresh",
				"handler": function() {
					QUnit.ok(app.config.get("target").length,
						"Check if the application was rerendered after \"refresh\" function call (non-empty target)");
					QUnit.ok(!app.getPlugin("MyPlugin"),
						"Checking if the plugin keeps the state within \"refresh\" function call");
					QUnit.equal(app.view.get("configString").html(),
						"updated string value1",
						"Checking if the application was rerendered after \"refresh\" function call (validate template re-rendering)");
					QUnit.ok(!app.view.get("plugin_testRenderer"),
						"Check if there is no disabled plugin elements in view after \"refresh\" function call");

					app.destroy();

					callback && callback();
				}
			});
			this.config.set("stringParam", "updated string value1");
			this.getPlugin("MyPlugin").disable(1);
			this.refresh();
		};
		suite.initTestApp({
			"plugins": [{
				"name": "MyPlugin",
				"requiredParam1": true,
				"requiredParam2": true
			}],
			"ready": check
		});
	};

	suite.prototype.cases.destroyCalled = function(callback) {
		var publish = function(topic, app) {
			Events.publish({
				"topic": topic,
				"context": app.config.get("context")
			});
		};
		var check = function() {
			var count = 0;
			this.set("_eventHandler", function() { count++; });
			this.set("_destroyHandler", function() {
				QUnit.ok(true,
					"Checking if the \"destroy\" method was called from the definition");
			});

			// checking if we receive events before destroy
			publish("incoming.event.global.test", this);
			publish("incoming.event.local.test", this);

			this.destroy();

			// checking application target
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
		suite.initTestApp({
			"plugins": [{
				"name": "MyPlugin",
				"requiredParam1": true,
				"requiredParam2": true
			}],
			"ready": check
		});
	};

	suite.prototype.cases.destroyBroadcasting = function(callback) {
		var apps = [];
		var destroyedApps = [];
		var check = function() {
			apps[2].destroy();
			QUnit.deepEqual(destroyedApps, [apps[2], apps[4]],
				"Checking that Echo.App.onDestroy event is published only for current application and its children");
			$.map(apps, function(app) {
				app.destroy();
			});
			callback && callback();
		};
		// define applications tree through declaration of links to parent applications
		var parents = [undefined, 0, 0, 1, 2];
		var i = 0, count = parents.length;
		var initApps = function() {
			suite.initTestApp({
				"ready": function() {
					var self = this;
					this.set("_destroyHandler", function() {
						destroyedApps.push(self);
					});
					if (i++ < count) {
						apps.push(this);
						initApps();
						return;
					}
					check();
				},
				"parent": typeof parents[i] !== "undefined"
						? apps[parents[i]].config.getAsHash()
						: undefined
			});
		};
		initApps();
	};

	suite.prototype.cases.nestedReadyCallbacks = function(callback) {
		var byOuterApp;
		var outerReady = function() {
			QUnit.equal(this.config.get("data.depth"), 0, "Check if it's callback for the outer application");
			QUnit.ok(byOuterApp, "Check if the callback is called due to the outer application initialization");
			callback();
		};
		var innerReady = function() {
			QUnit.equal(this.config.get("data.depth"), 1, "Check if it's callback for the inner application");
			QUnit.ok(!byOuterApp, "Check if the callback is called due to the inner application initialization");
		};
		var createInstance = function(parent) {
			new Echo.Tests.TestApp({
				"target": $("<div>"),
				"appkey": "echo.jssdk.tests.aboutecho.com",
				"data": {"depth": parent ? 1 : 0},
				"context": parent && parent.config.get("context") || undefined,
				"ready": parent ? innerReady : outerReady
			});
		};
		var definition = App.definition("Echo.Tests.TestApp");
		definition.init = function() {
			var depth = this.config.get("data.depth");
			if (!depth) {
				createInstance(this);
			}
			byOuterApp = !depth;
			this.ready();
		};
		App.create(definition);
		createInstance();
	};

	suite.prototype.cases.inheritedEvent = function(callback) {
		var self = this, s = "";
		var handler = function(topic) { s += this.name; };
		var initApp = function(definition, ctx, ready) {
			var d = $.Deferred();
			ready = ready || $.noop;
			App.create(
				$.extend({
					"templates": {
						"main": "<div></div>"
					}
				}, definition)
			);
			suite.initTestApp({
				"context": ctx,
				"ready": function() {
					ready.apply(this, arguments);
					d.resolve(this);
				}
			}, definition.name);
			return d.promise();
		};
		var connector = function() {
			var args = Array.prototype.slice.call(arguments);
			return function(prev) {
				args.splice(1, 0, prev.config.get("context"));
				return initApp.apply(null, args);
			};
		};
		initApp({
			"name": "Echo.Test.Parent",
			"events": {
				"Echo.Test.Child1.onEvent": handler
			}
		})
		.pipe(
			connector({
				"name": "Echo.Test.Child1",
				"inherits": Utils.getComponent("Echo.Test.Parent")
			})
		)
		.pipe(
			connector({
				"name": "Echo.Test.Child1.Child1",
				"inherits": Utils.getComponent("Echo.Test.Child1")
			})
		)
		.pipe(function(prev) {
			return initApp({
				"name": "Echo.Test.SomeApp",
				"events": {
					"Echo.Test.Child1.onEvent": handler
				}
			}, prev.config.get("context"), function() {
				prev.events.publish({
					"topic": "onEvent",
					"inherited": true
				});
				QUnit.strictEqual(s, "Echo.Test.Child1.Child1Echo.Test.Child1Echo.Test.ParentEcho.Test.SomeApp", "Check that inherited event published with the default params");
				s = "";
				prev.events.publish({
					"topic": "onEvent",
					"bubble": false,
					"inherited": true
				});
				QUnit.strictEqual(s, "Echo.Test.Child1.Child1Echo.Test.SomeApp", "Check that inherited event published with the appropriate params (bubble: false)");
				s = "";
				prev.events.publish({
					"topic": "onEvent",
					"propagation": false,
					"inherited": true
				});
				QUnit.strictEqual(s, "Echo.Test.Child1.Child1Echo.Test.Child1Echo.Test.Parent", "Check that inherited event published with the appropriate params (propagation: false)");
				callback();
			});
		});
	};

	suite.prototype.cases.definitionBaseInheritance = function(callback) {
		var initVar = "",
			destroyVar = "";
		var eventsChecker = {
			"parentTestEvent": 0,
			"child1TestEvent": 0,
			"commonTestEvent": 0,
			"newEvent": 0,
			"anotherNewEvent": 0
		};
		var ctx = Events.newContextId();
		var publish = function(topic, args) {
			Events.publish($.extend({
				"topic": topic,
				"context": ctx
			}, args));
		};
		var parentDefinition = {
			"name": "Echo.TestApp1",
			"vars": {
				"someVar": 1,
				"someVar2": 2
			},
			"config": {
				"someProps": {
					"prop1": 1,
					"prop2": 2,
					"prop3": {
						"prop3_1": 1
					}
				},
				"someProp": "someVal"
			},
			"label": {
				"someLabel": "some label text"
			},
			"events": {
				"parentTestEvent": function(topic) { eventsChecker[topic]++; },
				"commonTestEvent": function(topic) { eventsChecker[topic] = ++eventsChecker[topic] + " parent handler"; }
			},
			"methods": {
				"method1": function() { return "method1"; },
				"method2": function() { return "method2"; },
				"method3": function() { return "method3"; }
			},
			"renderers": {
				"someRenderer": function(el) { return el; }
			},
			"templates": {
				"main": '<div class="{class:container}"><div class="{class:someRenderer}"></div></div>'
			},
			"init": function() {
				initVar += "a parent init";
				this.render();
				this.ready();
			},
			"destroy": function() {
				destroyVar += "I'm a parent destroy";
			},
			"css": ".{class:container} { width: 50px; }.{class:someRenderer} { width: 10px; }"
		};
		var app = App.create(parentDefinition);
		var child1Definition = {
			"name": "Echo.TestApp1_Child1",
			"inherits": Echo.TestApp1,
			"vars": {
				"someVar": "overrides by child1"
			},
			"config": {
				"someProps": {
					"prop3": {
						"prop3_2": 2
					}
				},
				"someProp": "overrides by child1"
			},
			"events": {
				"child1TestEvent": function(topic) { eventsChecker[topic]++; },
				"commonTestEvent": function(topic) { eventsChecker[topic]++; },
				"parentTestEvent": function(topic) { eventsChecker[topic]++; return {"stop": ["bubble", "propagation"]}; }
			},
			"methods": {
				"method1": function() {
					return this.parent() + " method1_child_1"
				},
				"child1Method": function() {
					return "child1 method"
				}
			},
			"templates": {
				"main": '<div class="{inherited.class:container} {class:container}"><div class="{class:someRenderer}"></div></div>'
			},
			"init": function() {
				initVar += "I'm a child init and ";
				this.parent();
			},
			"destroy": function() {
				this.parent();
				destroyVar += " and a child destroy. ";
			},
			"css": ".{class:someRenderer} { width: 5px; }"
		};
		var child = App.create(child1Definition);
		var child2 = App.create({
			"name": "Echo.TestApp1_Child2",
			"inherits": Utils.getComponent("Echo.TestApp1")
		});
		var child2_child3 = App.create({
			"name": "Echo.TestApp1_Child2_Child3",
			"inherits": Utils.getComponent("Echo.TestApp1_Child2"),
			"init": function() {
				initVar += " and I'm child3 init and ";
				this.parent();
			},
			"destroy": function() {
				this.parent();
				destroyVar += " and a child3 destroy.";
			}
		});
		var newEventCounter = function() { eventsChecker.newEvent++; };
		var child1_child2 = App.create({
			"name": "Echo.TestApp1_Child1_Child2",
			"methods": {
				"method2": function() {
					return this.parent() + " method2_child_2";
				}
			},
			"events": {
				"Echo.TestApp1_Child1_Child2.someNewTestEvent": newEventCounter,
				"Echo.TestApp1_Child1.someNewTestEvent": newEventCounter,
				"Echo.TestApp1.someNewTestEvent": newEventCounter
			},
			"inherits": Utils.getComponent("Echo.TestApp1_Child1")
		});
		var anotherEventCounter = function() { eventsChecker.anotherNewEvent++; };
		var app2 = App.create($.extend(true, {}, parentDefinition, {
			"name": "Echo.TestApp2",
			"templates": {
				"main": '<div class="{inherited.class:container} {class:container}"></div>'
			},
			"events": {
				"Echo.TestApp2.anotherNewTestEvent": anotherEventCounter,
				"Echo.TestApp1.anotherNewTestEvent": anotherEventCounter,
				"Echo.TestApp1_Child1.anotherNewTestEvent": anotherEventCounter,
				"Echo.TestApp1_Child1_Child2.anotherNewTestEvent": anotherEventCounter,
				"Echo.TestApp1_Child2_Child3.anotherNewTestEvent": anotherEventCounter
			}
		}));
		// identify that event will not be published globally
		Events.subscribe({
			"topic": "Echo.TestApp1.someNewTestEvent",
			"handler": newEventCounter
		});
		suite.initTestApp({
			"context": ctx,
			"target": $("#qunit-fixture"),
			"ready": function() {
				QUnit.strictEqual(initVar, "I'm a child init and a parent init", "Check init parent function executed");
				QUnit.deepEqual(this.config.get("someProps"), {
					"prop1": 1,
					"prop2": 2,
					"prop3": {
						"prop3_1": 1,
						"prop3_2": 2
					}
				}, "Check config props inheritance");
				QUnit.strictEqual(this.someVar, "overrides by child1", "Check var overrides by child");
				QUnit.strictEqual(this.config.get("someProp"), "overrides by child1", "Check config property overrides by child");
				QUnit.strictEqual(this.method1(), "method1 method1_child_1", "Check parent method executed");
				QUnit.strictEqual(this.method3(), "method3", "Check method inherited without override");
				QUnit.strictEqual(this.child1Method(), "child1 method", "Check own method exists");
				QUnit.ok(this.view.get("container").css("width") === "50px" && this.view.get("someRenderer").css("width") === "5px", "Check css inherited base mechanics");
				publish("child1TestEvent");
				publish("commonTestEvent");
				publish("parentTestEvent");
				QUnit.equal(eventsChecker.parentTestEvent, 1, "Check parent event propagation stop");
				QUnit.equal(eventsChecker.child1TestEvent, 1, "Check child event normal publish/subscribe");
				QUnit.strictEqual(eventsChecker.commonTestEvent, "2 parent handler", "Check common event normal publish/subscribe and queue");
				this.destroy();
				QUnit.strictEqual(destroyVar, "I'm a parent destroy and a child destroy. ", "Check destroy parent function executed");
				QUnit.equal(this._definition("css").length, 3, "Making sure that the 'css' field has the expected length after the inheritance");
				var actualIDs = [];
				var expectedIDs = [{"Echo.App": true}, {"Echo.TestApp1": true}, {"Echo.TestApp1_Child1": true}];
				$.map(["Echo.App", "Echo.TestApp1", "Echo.TestApp1_Child1"], function(id) {
					var spec = {};
					spec[id] = Utils.hasCSS(id);
					actualIDs.push(spec);
				});
				QUnit.deepEqual(expectedIDs, actualIDs, "Checking if all the expected CSS rule groups present in the final definition");
				suite.initTestApp({
					"context": ctx,
					"target": $("<div>"),
					"ready": function() {
						QUnit.strictEqual(initVar, "I'm a child init and a parent init and I'm child3 init and a parent init", "Check init function (jumping one level to parent)");
						this.destroy();
						QUnit.strictEqual(destroyVar, "I'm a parent destroy and a child destroy. I'm a parent destroy and a child3 destroy.", "Check destroy function (jumping one level to parent)");
						suite.initTestApp({
							"context": ctx,
							"target": $("<div>"),
							"ready": function() {
								QUnit.strictEqual(this.view.get("container").attr("class"), " echo-testapp2-container", "Check not inherited app substitute \"inherited.class\" placeholder with empty string");
								this.events.publish({
									"topic": "anotherNewTestEvent",
									"inherited": true
								});
								QUnit.strictEqual(eventsChecker.anotherNewEvent, 1, "Check not inherited app publishing event with \"inherited\" flag doesn't publish any extra events");
								suite.initTestApp({
									"context": ctx,
									"target": $("<div>"),
									"ready": function() {
										QUnit.strictEqual(this.method2(), "method2 method2_child_2", "Check parent method executed (second inheritance level; child2 -> parent() -> application)");
										QUnit.strictEqual(this.child1Method(), "child1 method", "Check parent method executed (child2 -> child1)");
										QUnit.strictEqual(this.method3(), "method3", "Check parent method executed (child2 -> application)");
										QUnit.strictEqual(this.view.get("container").attr("class"), "echo-testapp1-container echo-testapp1_child1-container echo-testapp1_child1_child2-container", "Check child inherited css substitution works");
										// "someNewTestEvent" event published from "Echo.TestApp1Child1Child2" with the "inherited" flag
										// so, events "Echo.TestApp1_Child1.someNewTestEvent" & "Echo.TestApp1.someNewTestEvent" should be published as well
										this.events.publish({
											"topic": "someNewTestEvent",
											"inherited": true
										});
										QUnit.strictEqual(eventsChecker.newEvent, 3, "Check event publishing with the parents prefixes");
										callback && callback();
									}
								}, "Echo.TestApp1_Child1_Child2");
							}
						}, "Echo.TestApp2");
					}
				}, "Echo.TestApp1_Child2_Child3");
			}
		}, "Echo.TestApp1_Child1");
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
		"<div class=\"echo-streamserver-apps-mytestapp-test\">div with css class name defined</div>"
	], [
		"<div class=\"{class:test} {class:test1} {class:test2}\">div with multiple css class names defined</div>",
		"<div class=\"echo-streamserver-apps-mytestapp-test echo-streamserver-apps-mytestapp-test1 echo-streamserver-apps-mytestapp-test2\">div with multiple css class names defined</div>"
	], [
		"<div class=\"{class:test}\">{data:key3.key3nested}</div>",
		"<div class=\"echo-streamserver-apps-mytestapp-test\">nested value for key 3</div>"
	], [
		"<div class=\"{class:test}\">{self:data.key3.key3nested}</div>",
		"<div class=\"echo-streamserver-apps-mytestapp-test\">nested value for key 3</div>"
	], [
		"<div class=\"{class:test}\">{label:label1}{label:label2}{self:data.key3.key3nested}{class:example} - mix of multiple patterns</div>",
		"<div class=\"echo-streamserver-apps-mytestapp-test\">label1 valuelabel2 valuenested value for key 3echo-streamserver-apps-mytestapp-example - mix of multiple patterns</div>"
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
			'<div class="{class:selfFunction}"></div>' +
			// checking custom substitution rules
			'<div class="{class:customSubstitution}">{mysubs:key}</div>' +
			'<div class="{class:customSubstitutionNestedKey}">{mysubs:key.key1.key2}</div>' +
			'<div class="{class:customSubstitutionNestedName}">{mysub.sub1.sub2:key.key1}</div>' +
		'</div>';

	// TODO: apply such pattern for the Echo.Configuration lib tests...
	suite.data.config = {
		"appkey": "",
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

	suite.data.strictSubstitutions = [[
		"{config:zeroParam}",
		0,
		"strictEqual"
	], [
		"{config:booleanTrueParam}",
		true,
		"strictEqual"
	], [
		"{config:undefinedParam}",
		undefined,
		"strictEqual"
	], [
		"{config:objectParam}",
		suite.data.config.objectParam,
		"deepEqual"

	// adding basic substitution tests for the strict processing
	// to make sure that the strict mode process regular templates corectly
	]].concat(suite.data.substitutions.slice(0, 12));

	// test helper functions 

	suite.plugin = function() {
		return Echo.Tests.Unit.Plugin;
	};

	suite.getTestAppClassName = function() {
		return "Echo.StreamServer.Apps.MyTestApp";
	};

	suite.getTestAppClass = function(name) {
		return Utils.getComponent(name || suite.getTestAppClassName());
	};

	suite.initTestApp = function(config, name) {
		var definition = suite.getTestAppClass(name);
		new definition($.extend({
			"target": $("<div></div>"),
			"appkey": "echo.jssdk.tests.aboutecho.com"
		}, config));
	};

	suite.createComponents = function(names) {
		$.map(names, function(name) {
			App.create(suite.getComponentDefinition(name));
		});
	};

	suite.getComponentDefinition = function(name) {
		var definition = App.definition(name);
		definition.templates.main = "<div>Sample Component Template</div>";
		definition.init = function() {
			this.render();
			this.ready();
		};
		definition.destroy = function() {
			this.get("_destroyHandler") && this.get("_destroyHandler")();
		};
		return definition;
	};

	suite.createTestApp = function(name, config) {
		App.create(suite.getAppDefinition(name, config));
	};

	suite.getAppDefinition = function(name, config) {
		config = config || {};

		var definition = App.definition(name || suite.getTestAppClassName());

		definition.config = $.extend(true, {}, suite.data.config);

		definition.config.normalizer = {
			"context": function(val, ctrl) {
				var parent = ctrl.config.parent;
				return parent
					? Events.newContextId(parent.context)
					: val ? val : Events.newContextId();
			}
		};

		// copy vars from config
		definition.vars = $.extend(true, {}, definition.config);

		// removing data from vars to avoid intersection
		// because the "data" will be copied over from config
		delete definition.vars.data;

		definition.labels = {
			"label1": "label1 value",
			"label2": "label2 value",
			"label3": "label3 value"
		};

		definition.init = function() {
			this.render();
			this.ready();
		};

		definition.destroy = function() {
			this.get("_destroyHandler") && this.get("_destroyHandler")();
		};

		definition.templates.main = config.dynamicTemplate
			? function() { return suite.data.template; }
			: suite.data.template;

		definition.templates.custom =
			'<div class="{class:container}">' +
				'<div class="{class:testRenderer}"></div>' +
				'<div class="{class:testRenderer1}"></div>' +
			'</div>';

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

		definition.renderers.testRenderer = function(element) {
			return element.empty().append('<div>Some value</div>');
		};

		definition.renderers.testComponentRenderer = function(element) {
			return element.append('<div>Some value from testComponentRenderer</div>');
		};

		definition.renderers.testRendererWithExtra = function(element, extra) {
			return element.empty().append('<span>' + extra.value + '</span>');
		};

		definition.methods.myMethod = function(arg) {
			return arg;
		};

		definition.methods._myPrivateMethod = function(arg) {
			return arg;
		};

		definition.css =
			'.{class:header} { margin-bottom: 3px; }' +
			'.{class:avatar} .{class:image} { float: left; margin-right: -48px; }' +
			'.{class:avatar} img { width: 48px; height: 48px; }' +
			'.{class:fields} { width: 100%; float: left; }' +
			'.{class:fields} input { width: 100%; }';

		return definition;

	};
	callback();
	});
});
