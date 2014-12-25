(function(jQuery) {
"use strict";

var $ = jQuery;

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
		"invoke",
		"substitute",
		"dependent",
		"template",
		"getPlugin",
		"showMessage",
		"showError",
		"destroy",
		"refresh",
		"render",
		"isDefined",
		"getRelativeTime",
		"placeImage",
		"checkAppKey",

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
		var manifest = {
			"name": suite.getTestControlClassName(),
			"vars": {},
			"config": {},
			"labels": {},
			"events": {},
			"methods": {},
			"renderers": {},
			"templates": {},
			"dependencies": []
		};

		var _manifest = Echo.Control.manifest(manifest.name);
		QUnit.ok(!!_manifest.init,
			"Checking if we have a default initialization function in the \"manifest\" function return");
		delete _manifest.init;
		delete _manifest.destroy;
		QUnit.deepEqual(manifest, _manifest, "Checking the \"manifest\" function output");

		// checking if we have class before it was defined
		QUnit.ok(!Echo.Control.isDefined(manifest),
			"Checking if the control class was defined (via isDefined static method), before actual control definition");

		// create class out of manifest
		suite.createTestControl(manifest.name);

		// checking if we have class after class definition
		QUnit.ok(Echo.Control.isDefined(manifest),
			"Checking if the control class was defined (via isDefined static method), after control definition");

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
			"destroyCalled",
			"destroyBroadcasting",
			"manifestBaseInheritance",
			"nestedReadyCallbacks",
			"inheritedEvent",
			"controlRefreshingOnUserInvalidate"
		], "cases");

	}
};

suite.prototype.cases = {};

suite.prototype.cases.basicOperations = function(callback) {
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

		QUnit.equal(
			self.substitute({
				"template": '<div title="{data:title}">{data:title}</div>',
				"data": {
					"title": "test\"title"
				}
			}),
			'<div title="test&quot;title">test&quot;title</div>',
			"Checking if normalizer properly escapes HTML attributes in \"substitute\" method"
		);

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

		QUnit.ok(Echo.Tests.Dependencies.Control.dep6, "Checking if dependency loaded using 'control' condition");
		QUnit.ok(Echo.Tests.Dependencies.Control.dep7, "Checking if dependency loaded using 'plugin' condition");
		QUnit.ok(Echo.Tests.Dependencies.Control.dep8, "Checking if dependency loaded using 'app' condition");

		QUnit.ok(!Echo.Tests.Dependencies.Control.dep9, "Checking if dependency is not loading if 'control' already loaded");
		QUnit.ok(!Echo.Tests.Dependencies.Control.dep10, "Checking if dependency is not loading if 'plugin' already loaded");
		QUnit.ok(!Echo.Tests.Dependencies.Control.dep11, "Checking if dependency is not loading if 'app' already loaded");

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
		}

		// checking "getRelativeTime" method
		var now = Math.floor((new Date()).getTime() / 1000);
		var probes = [
			["", undefined, "empty string"],
			[0, undefined, "zero as a value"],
			["some-random-string", undefined, "random string"],
			[false, undefined, "boolean 'false'"],
			[now + 60, "Just now", "date/time \"from the future\""],
			[now - 0, "Just now", "Just now"],
			[now - 4, "Just now", "less than 5 seconds ago"],
			[now - 9, "Just now", "less than 10 seconds ago"],
			[now - 10, "10 Seconds Ago", "10 seconds ago"],
			[now - 1 * 60, "1 Minute Ago", "minute ago"],
			[now - 3 * 60, "3 Minutes Ago", "minutes ago"],
			[now - 1 * 60 * 60, "1 Hour Ago", "hour ago"],
			[now - 4 * 60 * 60, "4 Hours Ago", "hours ago"],
			[now - 1 * 24 * 60 * 60, "Yesterday", "yesterday"],
			[now - 3 * 24 * 60 * 60, "3 Days Ago", "days ago"],
			[now - 7 * 24 * 60 * 60, "Last Week", "last week"],
			[now - 32 * 24 * 60 * 60, "Last Month", "last month"],
			[now - 64 * 24 * 60 * 60, "2 Months Ago", "months ago"]
		];
		$.map(probes, function(probe) {
			QUnit.equal(self.getRelativeTime(probe[0]), probe[1],
				"Checking \"getRelativeTime\" function (" + probe[2] + ")");
		});

		// checking "invoke" method
		var cases = [
			[function() { return this.getPlugin("MyFakeTestPlugin"); }, undefined],
			[function() { return this.cssClass; },
				"echo-streamserver-controls-mytestcontrol"],
			[function() { return this.fakeKey; }, undefined],
			[function() { return this.get("data.key1"); }, "key1 value"],
			[function() { return this.get("name"); },
				"Echo.StreamServer.Controls.MyTestControl"]
		];
		$.each(cases, function(id, _case) {
			QUnit.strictEqual(
				Echo.Utils.invoke(_case[0], self),
				_case[1],
				"Checking \"invoke()\" method, case #" + (id + 1)
			);
		});

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
	var result, Definition = suite.getTestControlClass();

	result = new Definition();
	QUnit.ok($.isEmptyObject(result),
		"Checking if 'false' is returned if no config is passed");

	result = new Definition({"appkey": "echo.jssdk.tests.aboutecho.com"});
	QUnit.ok($.isEmptyObject(result),
		"Checking if empty object is returned if no target is passed in config");

	result = new Definition({"target": $("<div>")});
	var html = result.config.get("target").html();
	QUnit.ok(/incorrect_appkey/.test(html),
		"Checking if the error message is produced once the control is initialized without the appkey defined (validating the \"checkAppKey\" function)");
	QUnit.ok(/echo-control-message-error/.test(html),
		"Checking if the error message contains the necessary CSS class once the control is initialized without the appkey defined (validating the \"checkAppKey\" function)");
	result.destroy();

	callback && callback();
};

suite.prototype.cases.incomingConfigHandling = function(callback) {
	var parentConfig = {"myParentParam": {"a": 1, "b": 2}};
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
	suite.initTestControl({
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

suite.prototype.cases.controlRendering = function(callback) {
	var _suite = this;
	var check = function(_callback) {
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
			"Checking if control renderers were applied when we render template (by passing \"template\" key into the \"render\" function)");
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

		// checking "showMessage" method
		target = $('<div></div>');
		var data = {
			"type": "error",
			"message": "An error occured during the request...",
			"layout": "compact",
			"target": target
		};
		this.showMessage(data);
		QUnit.ok(!!this.view.get("container"),
			"Checking if the \"showMessage\" function doesn't wipe out other elements in the \"view\" structure");
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

		// checking "showError" method
		var errorTarget = $("<div></div>");
		var errorData = {
			"errorCode": "someUndefinedErrorCode",
			"errorMessage": "Some Error Message"
		};
		var errorRequest = new Echo.API.Request({
			"endpoint": "search",
			"data": {
				"appkey": "echo.jssdk.tests.aboutecho.com",
				"q": "unsupported query"
			},
			"onData": function(response) {},
			"onError": function(response) {},
			"onOpen": function() {}
		});
		var errorOptions = {
			"target": errorTarget,
			"critical": false,
			"request": errorRequest
		};
		this.showError(errorData, errorOptions);
		QUnit.equal(
			errorTarget.find(".echo-control-message-icon").html(),
			"(someUndefinedErrorCode) Some Error Message",
			"Checking if the unsupported errorCode received"
		);
		errorData.errorCode = "busy";
		this.showError(errorData, errorOptions);
		QUnit.equal(
			errorTarget.find(".echo-control-message-icon").html(),
			"Loading. Please wait...",
			"Checking if the supported errorCode received and errorMessage ignored"
		);
		errorOptions.retryIn = 3000;
		errorData.errorCode = "view_limit";
		this.showError(errorData, errorOptions);
		QUnit.equal(
			errorTarget.find(".echo-control-message-icon").html(),
			"View creation rate limit has been exceeded. Retrying in 3 seconds...",
			"Checking if the retrying mechanism works"
		);
		QUnit.stop();
		setTimeout(function() {
			errorOptions.retryIn = 0;
			self.showError(errorData, errorOptions);
			QUnit.equal(
				errorTarget.find(".echo-control-message-icon").html(),
				"Retrying...",
				"Checking if the retrying mechanism works after 3 seconds counted"
			);
			clearInterval(errorRequest.retryTimer);
			QUnit.start();
		}, 3000);

		template = '<div class="echo-utils-tests-footer">footer content</div>';
		this.render();
		_suite.jqueryObjectsEqual($(this.view.get("testRenderer").html()), $("<div>Some value</div>"),
			"Checking control.view.get() function");
		this.view.set("testRenderer", $(template));
		QUnit.equal(this.view.get("testRenderer").html(), "footer content",
			"Checking control.view.set() function");
		this.view.remove("testRenderer");
		QUnit.equal(this.view.get("testRenderer"), undefined,
			"Checking control.view.remove() function");

		this.destroy();

		_callback && _callback();
	};
	Echo.Utils.sequentialCall([
		function(_callback) {
			suite.initTestControl({
				"data": suite.data.config.data,
				"ready": function() {
					check.call(this, _callback);
				}
			});
		}, function(_callback) {
			var name = "Echo.StreamServer.Controls.AnotherTestControl";
			suite.createTestControl(name, {"dynamicTemplate": true});
			suite.initTestControl({
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

		QUnit.equal(count, 9,
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
				QUnit.equal(control.view.get("configString").html(),
					"updated string value1",
					"Checking if the control was rerendered after \"refresh\" function call (validate template re-rendering)");
				QUnit.ok(!control.view.get("plugin_testRenderer"),
					"Check if there is no disabled plugin elements in view after \"refresh\" function call");

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

suite.prototype.cases.destroyCalled = function(callback) {
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

		QUnit.equal(count, 2,
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

suite.prototype.cases.destroyBroadcasting = function(callback) {
	var controls = [];
	var destroyedControls = [];
	var check = function() {
		controls[2].destroy();
		QUnit.deepEqual(destroyedControls, [controls[2], controls[4]],
			"Checking that Echo.Control.onDestroy event is published only for current control and its children");
		$.map(controls, function(control) {
			control.destroy();
		});
		callback && callback();
	};
	// define controls tree through declaration of links to parent controls
	var parents = [undefined, 0, 0, 1, 2];
	var i = 0, count = parents.length;
	var initControls = function() {
		suite.initTestControl({
			"ready": function() {
				var self = this;
				this.set("_destroyHandler", function() {
					destroyedControls.push(self);
				});
				if (i++ < count) {
					controls.push(this);
					initControls();
					return;
				}
				check();
			},
			"parent": typeof parents[i] !== "undefined"
					? controls[parents[i]].config.getAsHash()
					: undefined
		});
	};
	initControls();
};

suite.prototype.cases.nestedReadyCallbacks = function(callback) {
	var byOuterControl;
	var outerReady = function() {
		QUnit.equal(this.config.get("data.depth"), 0, "Check if it's callback for the outer control");
		QUnit.ok(byOuterControl, "Check if the callback is called due to the outer control initialization");
		callback();
	};
	var innerReady = function() {
		QUnit.equal(this.config.get("data.depth"), 1, "Check if it's callback for the inner control");
		QUnit.ok(!byOuterControl, "Check if the callback is called due to the inner control initialization");
	};
	var createInstance = function(parent) {
		new Echo.Tests.TestControl({
			"target": $("<div>"),
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"data": {"depth": parent ? 1 : 0},
			"context": parent && parent.config.get("context") || undefined,
			"ready": parent ? innerReady : outerReady
		});
	};
	var manifest = Echo.Control.manifest("Echo.Tests.TestControl");
	manifest.init = function() {
		var depth = this.config.get("data.depth");
		if (!depth) {
			createInstance(this);
		}
		byOuterControl = !depth;
		this.ready();
	};
	Echo.Control.create(manifest);
	createInstance();
};

suite.prototype.cases.inheritedEvent = function(callback) {
	var s = "";
	var handler = function(topic) { s += this.name; };
	var initControl = function(manifest, ctx, ready) {
		var d = $.Deferred();
		ready = ready || $.noop;
		Echo.Control.create(
			$.extend({
				"templates": {
					"main": "<div></div>"
				}
			}, manifest)
		);
		suite.initTestControl({
			"context": ctx,
			"ready": function() {
				ready.apply(this, arguments);
				d.resolve(this);
			}
		}, manifest.name);
		return d.promise();
	};
	var connector = function() {
		var args = Array.prototype.slice.call(arguments);
		return function(prev) {
			args.splice(1, 0, prev.config.get("context"));
			return initControl.apply(null, args);
		};
	};
	initControl({
		"name": "Echo.Test.Parent",
		"events": {
			"Echo.Test.Child1.onEvent": handler
		}
	})
	.pipe(
		connector({
			"name": "Echo.Test.Child1",
			"inherits": Echo.Utils.getComponent("Echo.Test.Parent")
		})
	)
	.pipe(
		connector({
			"name": "Echo.Test.Child1.Child1",
			"inherits": Echo.Utils.getComponent("Echo.Test.Child1")
		})
	)
	.pipe(function(prev) {
		return initControl({
			"name": "Echo.Test.SomeControl",
			"events": {
				"Echo.Test.Child1.onEvent": handler
			}
		}, prev.config.get("context"), function() {
			prev.events.publish({
				"topic": "onEvent",
				"inherited": true
			});
			QUnit.strictEqual(s, "Echo.Test.Child1.Child1Echo.Test.Child1Echo.Test.ParentEcho.Test.SomeControl", "Check that inherited event published with the default params");
			s = "";
			prev.events.publish({
				"topic": "onEvent",
				"bubble": false,
				"inherited": true
			});
			QUnit.strictEqual(s, "Echo.Test.Child1.Child1Echo.Test.SomeControl", "Check that inherited event published with the appropriate params (bubble: false)");
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

suite.prototype.cases.controlRefreshingOnUserInvalidate = function(callback) {
	var invalidateUser = function() {
		Echo.Events.publish({"topic": "Echo.UserSession.onInvalidate", "data": {}});
	};
	Echo.Control.create({
		"name": "Echo.Tests.Fixtures.RefreshingControl",
		"templates": {"main": '<div class="{class:container}"></div>'}
	});
	$.each([true, false], function(idx, isRefresh) {
		var refreshCallback = sinon.spy();
		suite.initTestControl({
			"refreshOnUserInvalidate": isRefresh,
			"ready": function() {
				this.events.subscribe({
					"topic": "Echo.Tests.Fixtures.RefreshingControl.onRefresh",
					"handler": refreshCallback
				});
				invalidateUser();
				QUnit.ok(
					isRefresh ? refreshCallback.calledOnce : !refreshCallback.called,
					"Check if control is " + (isRefresh ? "refreshed" : "not refreshed") + " when refreshOnUserInvalidate=" + isRefresh.toString()
				);
				this.destroy();
			}
		}, "Echo.Tests.Fixtures.RefreshingControl");
	});
};

suite.prototype.cases.manifestBaseInheritance = function(callback) {
	var initVar = "",
		destroyVar = "";
	var eventsChecker = {
		"parentTestEvent": 0,
		"child1TestEvent": 0,
		"commonTestEvent": 0,
		"newEvent": 0,
		"anotherNewEvent": 0
	};
	var ctx = Echo.Events.newContextId();
	var publish = function(topic, args) {
		Echo.Events.publish($.extend({
			"topic": topic,
			"context": ctx
		}, args));
	};
	var parentManifest = {
		"name": "Echo.TestControl1",
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
		"dependencies": [],
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
	Echo.Control.create(parentManifest);
	var child1Manifest = {
		"name": "Echo.TestControl1_Child1",
		"inherits": Echo.TestControl1,
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
				return this.parent() + " method1_child_1";
			},
			"child1Method": function() {
				return "child1 method";
			}
		},
		"templates": {
			"main": '<div class="{inherited.class:container} {class:container}"><div class="{class:someRenderer}"></div></div>'
		},
		"dependencies": [{
			"url": Echo.Tests.baseURL + "unit/dependencies/control.dep.child.js",
			"loaded": function() { return !!Echo.Tests.Dependencies.Control.depChild; }
		}],
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
	Echo.Control.create(child1Manifest);
	Echo.Control.create({
		"name": "Echo.TestControl1_Child2",
		"inherits": Echo.Utils.getComponent("Echo.TestControl1")
	});
	Echo.Control.create({
		"name": "Echo.TestControl1_Child2_Child3",
		"inherits": Echo.Utils.getComponent("Echo.TestControl1_Child2"),
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
	Echo.Control.create({
		"name": "Echo.TestControl1_Child1_Child2",
		"methods": {
			"method2": function() {
				return this.parent() + " method2_child_2";
			}
		},
		"events": {
			"Echo.TestControl1_Child1_Child2.someNewTestEvent": newEventCounter,
			"Echo.TestControl1_Child1.someNewTestEvent": newEventCounter,
			"Echo.TestControl1.someNewTestEvent": newEventCounter
		},
		"inherits": Echo.Utils.getComponent("Echo.TestControl1_Child1")
	});
	var anotherEventCounter = function() { eventsChecker.anotherNewEvent++; };
	Echo.Control.create($.extend(true, {}, parentManifest, {
		"name": "Echo.TestControl2",
		"templates": {
			"main": '<div class="{inherited.class:container} {class:container}"></div>'
		},
		"events": {
			"Echo.TestControl2.anotherNewTestEvent": anotherEventCounter,
			"Echo.TestControl1.anotherNewTestEvent": anotherEventCounter,
			"Echo.TestControl1_Child1.anotherNewTestEvent": anotherEventCounter,
			"Echo.TestControl1_Child1_Child2.anotherNewTestEvent": anotherEventCounter,
			"Echo.TestControl1_Child2_Child3.anotherNewTestEvent": anotherEventCounter
		}
	}));
	// identify that event will not be published globally
	Echo.Events.subscribe({
		"topic": "Echo.TestControl1.someNewTestEvent",
		"handler": newEventCounter
	});
	suite.initTestControl({
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
			QUnit.equal(this._manifest("css").length, 3, "Making sure that the 'css' field has the expected length after the inheritance");
			var actualIDs = [];
			var expectedIDs = [{"Echo.Control": true}, {"Echo.TestControl1": true}, {"Echo.TestControl1_Child1": true}];
			$.map(["Echo.Control", "Echo.TestControl1", "Echo.TestControl1_Child1"], function(id) {
				var spec = {};
				spec[id] = Echo.Utils.hasCSS(id);
				actualIDs.push(spec);
			});
			QUnit.deepEqual(expectedIDs, actualIDs, "Checking if all the expected CSS rule groups present in the final manifest");
			suite.initTestControl({
				"context": ctx,
				"target": $("<div>"),
				"ready": function() {
					QUnit.strictEqual(initVar, "I'm a child init and a parent init and I'm child3 init and a parent init", "Check init function (jumping one level to parent)");
					this.destroy();
					QUnit.strictEqual(destroyVar, "I'm a parent destroy and a child destroy. I'm a parent destroy and a child3 destroy.", "Check destroy function (jumping one level to parent)");
					suite.initTestControl({
						"context": ctx,
						"target": $("<div>"),
						"ready": function() {
							QUnit.strictEqual(this.view.get("container").attr("class"), " echo-testcontrol2-container", "Check not inherited control substitute \"inherited.class\" placeholder with empty string");
							this.events.publish({
								"topic": "anotherNewTestEvent",
								"inherited": true
							});
							QUnit.strictEqual(eventsChecker.anotherNewEvent, 1, "Check not inherited control publishing event with \"inherited\" flag doesn't publish any extra events");
							suite.initTestControl({
								"context": ctx,
								"target": $("<div>"),
								"ready": function() {
									QUnit.strictEqual(this.method2(), "method2 method2_child_2", "Check parent method executed (second inheritance level; child2 -> parent() -> control)");
									QUnit.strictEqual(this.child1Method(), "child1 method", "Check parent method executed (child2 -> child1)");
									QUnit.strictEqual(this.method3(), "method3", "Check parent method executed (child2 -> control)");
									QUnit.strictEqual(this.view.get("container").attr("class"), "echo-testcontrol1-container echo-testcontrol1_child1-container echo-testcontrol1_child1_child2-container", "Check child inherited css substitution works");
									// "someNewTestEvent" event published from "Echo.TestControl1Child1Child2" with the "inherited" flag
									// so, events "Echo.TestControl1_Child1.someNewTestEvent" & "Echo.TestControl1.someNewTestEvent" should be published as well
									this.events.publish({
										"topic": "someNewTestEvent",
										"inherited": true
									});
									QUnit.strictEqual(eventsChecker.newEvent, 3, "Check event publishing with the parents prefixes");
									suite.initTestControl({
										"target": $("<div>"),
										"ready": function() {
											QUnit.strictEqual(this._manifest("events").parentTestEvent.length, 2, "Check if parent event handlers and own are not mutated");
											Echo.Events.publish({
												"topic": "parentTestEvent",
												"context": this.config.get("context")
											});
											callback && callback();
										}
									}, "Echo.TestControl1_Child1");
								}
							}, "Echo.TestControl1_Child1_Child2");
						}
					}, "Echo.TestControl2");
				}
			}, "Echo.TestControl1_Child2_Child3");
		}
	}, "Echo.TestControl1_Child1");
};

suite.prototype.async = {};

suite.prototype.async.placeImageContainerClassTest = function(callback) {
	var container = $("<div id=\"place-image-container-class\"/>").appendTo($("#qunit-fixture"));
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-horizontal-300x100.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-horizontal-300x100.png");
					callback();
				},
				"onload": function() {
					QUnit.ok(container.hasClass("echo-image-container"), "Checking placeImage() method for image class adding");
					callback();
				}
			});
		}
	});
};

suite.prototype.async.placeImageContainerFillClassTest = function(callback) {
	var container = $("<div id=\"place-image-container-fill-class\"/>").appendTo($("#qunit-fixture"));
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-horizontal-300x100.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-horizontal-300x100.png");
					callback();
				},
				"onload": function() {
					QUnit.ok(container.hasClass("echo-image-position-fill"), "Checking placeImage() method for image area filling class adding");
					callback();
				},
				"position": "fill"
			});
		}
	});
};

suite.prototype.async.placeImageContainerFillDefaultTest = function(callback) {
	var container = $("<div id=\"place-image-container-fill-default-class\"/>").appendTo($("#qunit-fixture"));
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-horizontal-300x100.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-horizontal-300x100.png");
					callback();
				},
				"onload": function() {
					QUnit.ok(container.hasClass("echo-image-position-fill"), "Checking placeImage() method for whether image container filling class is default");
					callback();
				}
			});
		}
	});
};

suite.prototype.async.placeImageContainerFillHorizontalTest = function(callback) {
	var container = $("<div id=\"place-image-container-fill-horizontal\"/>")
		.appendTo($("#qunit-fixture"))
		.css({ "width": "90px", "height": "90px" });
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-horizontal-300x100.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-horizontal-300x100.png");
					callback();
				},
				"onload": function() {
					var self = this;
					// wait for image size affected in IE
					setTimeout(function () {
						QUnit.deepEqual([self.width, self.height], [90, 30],
							"Checking placeImage() method for image area filling by a horizontal image");
						callback();
					}, 0);
				},
				"position": "fill"
			});
		}
	});
};

suite.prototype.async.placeImageContainerFillVerticalTest = function(callback) {
	var container = $("<div id=\"place-image-container-fill-vertical\"/>")
		.appendTo($("#qunit-fixture"))
		.css({ "width": "90px", "height": "90px" });
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-vertical-100x300.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-vertical-100x300.png");
					callback();
				},
				"onload": function() {
					var self = this;
					// wait for image size affected in IE
					setTimeout(function () {
						QUnit.deepEqual([self.width, self.height], [30, 90],
							"Checking placeImage() method for image area filling by a vertical image");
						callback();
					}, 0);
				},
				"position": "fill"
			});
		}
	});
};

suite.prototype.async.horizontalImageQuirksModeTest = function(callback) {
	var container = $("<div id=\"place-image-horizontal-quirks\"/>").appendTo($("#qunit-fixture"));
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-horizontal-300x100.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-horizontal-300x100.png");
					callback();
				},
				"onload": function() {
					QUnit.ok($(this).hasClass("echo-image-stretched-horizontally"),
						"Checking placeImage() method for horizontal stretching class in compatible mode");
					callback();
				},
				"position": "fill"
			});
		}
	});
};

suite.prototype.async.verticalImageQuirksModeTest = function(callback) {
	var container = $("<div id=\"place-image-vertical-quirks\"/>").appendTo($("#qunit-fixture"));
	suite.initTestControl({
		"ready": function() {
			this.placeImage({
				"container": container,
				"image": Echo.Tests.baseURL + "unit/loadimage/avatar-vertical-100x300.png",
				"onerror": function() {
					QUnit.ok(false, "Cannot test loadImage(): missing image avatar-vertical-100x300.png");
					callback();
				},
				"onload": function() {
					QUnit.ok($(this).hasClass("echo-image-stretched-vertically"),
						"Checking placeImage() method for vertical stretching class in compatible mode");
					callback();
				},
				"position": "fill"
			});
		}
	});
};

suite.prototype.tests.TestAsyncMethods = {
		"config": {
			"async": true,
			"user": {"status": "anonymous"},
			"testTimeout": 10000
		},
		"check": function() {
			suite.createTestControl();
			
			var tests = [
				"placeImageContainerClassTest",
				"placeImageContainerFillClassTest",
				"placeImageContainerFillDefaultTest",
				"placeImageContainerFillHorizontalTest",
				"placeImageContainerFillVerticalTest"
			];
			if (document.compatMode !== "CSS1Compat") {
				tests = tests.concat(["horizontalImageQuirksModeTest", "verticalImageQuirksModeTest"]);
			}
			this.sequentialAsyncTests(tests, "async");
		}
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
		'<div class="{class:selfFunction}"></div>' +
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

suite.getTestControlClassName = function() {
	return "Echo.StreamServer.Controls.MyTestControl";
};

suite.getTestControlClass = function(name) {
	return Echo.Utils.getComponent(name || suite.getTestControlClassName());
};

suite.initTestControl = function(config, name) {
	var Definition = suite.getTestControlClass(name);
	new Definition($.extend({
		"target": $("<div></div>"),
		"appkey": "echo.jssdk.tests.aboutecho.com"
	}, config));
};

suite.createTestControl = function(name, config) {
	Echo.Control.create(suite.getControlManifest(name, config));
};

suite.getControlManifest = function(name, config) {
	config = config || {};

	var manifest = Echo.Control.manifest(name || suite.getTestControlClassName());

	manifest.config = $.extend(true, {}, suite.data.config);

	manifest.config.normalizer = {
		"context": function(val, ctrl) {
			var parent = ctrl.config.parent;
			return parent
				? Echo.Events.newContextId(parent.context)
				: val ? val : Echo.Events.newContextId();
		}
	};

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

	var addDependency = function(n, params) {
		var dependency = {
			"url": Echo.Tests.baseURL + "unit/dependencies/control.dep." + n + ".js"
		};
		if (typeof params === "object") {
			dependency = $.extend(dependency, params);
		} else {
			dependency.loaded = function() { return !!Echo.Tests.Dependencies.Control["dep" + n]; };
		}
		manifest.dependencies.push(dependency);
	};
	for (var i = 1; i < 6; i++) addDependency(i);

	Echo.Tests.Unit.App.createApp("Echo.Apps.MyTestApp");
	addDependency(6, {"control": "Echo.StreamServer.Controls.MyNotExistsTestControl"});
	addDependency(7, {"plugin": "Echo.StreamServer.Controls.MyTestControl.Plugins.MyNotExistsTestPlugin"});
	addDependency(8, {"app": "Echo.Apps.MyNotExistsTestApp"});

	addDependency(9, {"control": "Echo.StreamServer.Controls.MyTestControl"});
	addDependency(10, {"plugin": "Echo.StreamServer.Controls.MyTestControl.Plugins.MyPlugin"});
	addDependency(11, {"app": "Echo.Apps.MyTestApp"});

	manifest.init = function() {
		if (!this.checkAppKey()) return;
		this.render();
		this.ready();
	};

	manifest.destroy = function() {
		this.get("_destroyHandler") && this.get("_destroyHandler")();
	};

	manifest.templates.main = config.dynamicTemplate
		? function() { return suite.data.template; }
		: suite.data.template;

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
