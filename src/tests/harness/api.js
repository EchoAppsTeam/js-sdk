(function(jQuery) {
"use strict";

var $ = jQuery;

Echo.Tests.module = function(name, config) {
	config.meta = config.meta || {};
	QUnit.module(name, {
		"setup": function() {
			_testSetup();
			config.setup && config.setup.call(this);
		},
		"teardown": function() {
			config.teardown && config.teardown.call(this);
			_testTeardown();
		},
		"meta": {
			"className": config.meta.className || "",
			"functions": config.meta.functions || []
		}
	});
};

Echo.Tests.test = function(name, callback, config) {
	config = _normalizeTestConfig(config);
	QUnit.test(name, function() {
		var self = this, args = arguments;
		_actualizeTestUser(config.user, function() {
			callback.apply(self, args);
		});
	});
};

Echo.Tests.asyncTest = function(name, callback, config) {
	config = _normalizeTestConfig(config);
	QUnit.test(name, function() {
		var self = this, args = arguments;
		// we might want individual timeout for each test
		// so we can't use QUnit.asyncTest, but we emulate it using QUnit.stop()
		QUnit.config.testTimeout = config.timeout;
		QUnit.stop();
		_actualizeTestUser(config.user, function() {
			callback.apply(self, args);
		});
	});
};

Echo.Tests.renderersTest = function(component, params, config) {
	params = $.extend({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"target": $("#qunit-fixture"),
		"ready": function() {}
	}, params || {});
	Echo.Tests.asyncTest("basic checks for renderers", function() {
		var handler = function() {
			var instance = this;
			var checker = function(name, element, suffix) {
				if (!element) {
					QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template." + suffix);
					return;
				}
				var oldElement = element.clone(true, true);
				var renderedElement = instance.view.render({"name": name});
				_testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix);
			};
			$.each(instance.renderers, function(name, renderer) {
				QUnit.config.current.moduleTestEnvironment.meta.functions.push("renderers." + name);
				checker(name, instance.view.get(name));
			});
			var oldElements = Echo.Utils.foldl({}, instance.view._elements, function(element, acc, name) {
				acc[name] = element.clone(true, true);
			});
			instance.render();
			$.each(instance.renderers, function(name, element) {
				checker(name, oldElements[instance.cssPrefix + name], " (recursive rerendering case)");
			});
			QUnit.start();
		};
		var ready = params.ready;
		params.ready = function() {
			if (this.view.rendered()) {
				handler.call(this);
			} else {
				this.events.subscribe({
					"topic": component + ".onRender",
					"once": true,
					"handler": handler
				});
			}
			ready.call(this);
		};
		var Component = Echo.Utils.getComponent(component);
		new Component(params);
	}, config);
};

Echo.Tests.isolatedTest = function(test) {
	return function(cb) {
		var iframe = $('<iframe name="' + name + '" style="width: 0px; height: 0px; border: 0px; visibility: hidden; display: none"></iframe>');
		$(document.body).append(iframe);
		iframe.on("load", function() {
			var win = iframe.get(0).contentWindow;
			var callback = function() {
				// cleanup first
				iframe.remove();
				// and then execute callback to advance to the next test
				cb();
			};
			test.call(win, callback);
		});
		iframe.attr("src", "about:blank");
	};
};

// methods useful if one wants to disable particular test easily
Echo.Tests._test = Echo.Tests._asyncTest = Echo.Tests._renderersTest = function() {
	Echo.Utils.log({
		"component": "Tests",
		"message": "[" + QUnit.config.currentModule + "] Disabled test: " + arguments[0]
	});
};

// private functions

function _testSetup() {
	//delete all event handlers in all contexts
	Echo.Events._subscriptions = {};
	Echo.Events._dataByHandlerId = {};

	// delete all accumulated stuff from Loader
	Echo.Loader.canvases = [];
	Echo.Loader.overrides = {};
	Echo.Loader.vars = {
		"state": {"resources": {}, "queue": []},
		"processing": false,
		"syncQueue": []
	};

	// clear qunit-fixture
	$("#qunit-fixture").empty();
};

function _testTeardown() {
	delete Echo.Tests.current.user;
	var meta = QUnit.config.current.moduleTestEnvironment.meta;
	if (!meta || meta.processed) return;
	meta.processed = true;
	$.each(meta.functions, function(i, name) {
		Echo.Tests.Stats.markFunctionTested(meta.className + "." + name);
	});
};

function _normalizeTestConfig(config) {
	return $.extend(true, {
		"timeout": 5000,
		"user": {
			"status": "anonymous"
		}
	}, config || {});
}

function _actualizeTestUser(config, callback) {
	Echo.Tests.current.user = config;
	callback();
};

function _testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix) {
	var prefix = "Renderer \"" + name + "\": ";
	suffix = suffix || "";
	QUnit.ok(
		renderedElement instanceof jQuery && renderedElement.length === 1,
		prefix + "check contract" + suffix
	);
	QUnit.ok(
		renderedElement.jquery === oldElement.jquery,
		prefix + "check that element is still the same after second rendering" + suffix
	);
	QUnit.equal(
		renderedElement.children().length,
		oldElement.children().length,
		prefix + "check the number of children after second rendering of element" + suffix
	);
	// this variable contains regexp that will test rendered element
	// use case is renderer function has side effects (ex. date computation, random values etc)
	var oldText = oldElement.text().toLowerCase().replace(/([^\w\s])/g, "\\$1").replace(/\d+/g, "\\d+");
	QUnit.ok(
		(new RegExp("^" + oldText + "$")).test(renderedElement.text().toLowerCase()),
		prefix + "check that text representation of the element is still the same after second rendering" + suffix
	);
};
// TODO: remove this line when all tests use new format
Echo.Tests._testElementsConsistencyAfterRendering = _testElementsConsistencyAfterRendering;

})(Echo.jQuery);
