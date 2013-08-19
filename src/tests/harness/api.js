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
		// unfortunately user actualization process is async, we have to handle it
		// so we stop QUnit processing before test ...
		QUnit.stop();
		Echo.Tests.Utils.actualizeTestUser(config.user, function() {
			callback.apply(self, args);
			// ... and start it again after test
			QUnit.start();
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
		Echo.Tests.Utils.actualizeTestUser(config.user, function() {
			callback.apply(self, args);
		});
	});
};

Echo.Tests.renderersTest = function(component, params, config) {
	params = $.extend({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {}
	}, params || {});

	Echo.Tests.asyncTest("basic checks for renderers", function() {
		var ready = params.ready;
		var handler = function() {
			var instance = this;
			ready.call(instance);
			_checkRenderers.call(instance, {
				"instance": instance,
				"renderers": instance.renderers,
				"cssPrefix": instance.cssPrefix
			});
			instance.destroy();
			QUnit.start();
		};
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
		};
		params.target = params.target || $("#qunit-fixture");
		var Component = Echo.Utils.getComponent(component);
		new Component(params);
	}, config);
};

Echo.Tests.pluginRenderersTest = function(plugin, params, config) {
	params = $.extend({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"plugins": [],
		"ready": function() {}
	}, params || {});

	var parts = plugin.split(".Plugins.");
	var component = parts[0];
	plugin = parts[1];
	params.plugins.push($.extend({"name": plugin}, params.pluginConfig || {}));
	delete params.pluginConfig;

	// XXX: hack this because Stream.Item can't be instantiated itself
	var forStreamItem = component.indexOf("Stream.Item") >= 0;
	component = component.replace("Stream.Item", "Stream");

	Echo.Tests.asyncTest("basic checks for renderers", function() {
		var ready = params.ready;
		var handler = function() {
			var instance = this;
			var pluginInstance = forStreamItem
				? instance.threads[0].getPlugin(plugin)
				: instance.getPlugin(plugin);
			ready.call(instance);
			_checkRenderers.call(pluginInstance, {
				"instance": pluginInstance.component,
				"renderers": pluginInstance._manifest("renderers"),
				"cssPrefix": pluginInstance.cssPrefix
			});
			_checkRenderers.call(pluginInstance, {
				"instance": pluginInstance.component,
				"renderers": pluginInstance._manifest("component").renderers,
				"cssPrefix": pluginInstance.component.cssPrefix,
				"statPrefix": "component."
			});
			instance.destroy();
			QUnit.start();
		};
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
		};
		params.target = params.target || $("#qunit-fixture");
		var Component = Echo.Utils.getComponent(component);
		new Component(params);
	}, config);
};

Echo.Tests.isolate = function(test) {
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

Echo.Tests.jqueryObjectsEqual = function(actual, expected, message) {
	var properties = [
		"disabled",
		"readOnly",
		"tagName"
	];
	var attributes = [
		"autocomplete",
		"aria-activedescendant",
		"aria-controls",
		"aria-describedby",
		"aria-disabled",
		"aria-expanded",
		"aria-haspopup",
		"aria-hidden",
		"aria-labelledby",
		"aria-pressed",
		"aria-selected",
		"aria-valuemax",
		"aria-valuemin",
		"aria-valuenow",
		"class",
		"href",
		"id",
		"nodeName",
		"role",
		"tabIndex",
		"src",
		"alt",
		"title"
	];
	function extract(elem) {
		if (!elem || !elem.length) {
			return {};
		}
		var children, result = {};
		$.map(properties, function(attr) {
			var value = elem.prop(attr);
			if (typeof value !== "undefined") {
				result[attr] = value;
			}
		});
		$.map(attributes, function(attr) {
			var value = elem.attr(attr);
			if (typeof value !== "undefined") {
				result[attr] = value;
			}
		});
		result.events = $._data(elem[0], "events");
		result.data = $.extend({}, elem.data());
		delete result.data[$.expando];
		children = elem.contents();
		if (children.length) {
			result.children = children.map(function( ind ) {
				return extract($(this));
			}).get();
		} else {
			result.text = elem.text();
		}
		$.each(["events"], function(i, p) {
			if (typeof result[p] === "undefined") {
				delete result[p];
			}
		});
		return result;
	}
	if (!expected || !expected.length) {
		QUnit.pushFailure(message + " (expected value must not be empty or undefined)");
		return;
	}
	QUnit.deepEqual(extract(actual), extract(expected), message);
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

	// delete all accumulated stuff from Loader except resources state
	// because yepnope has the same info and we don't want it unsynchronized
	var resources = Echo.Loader.vars.state.resources;
	Echo.Loader.canvases = [];
	Echo.Loader.overrides = {};
	Echo.Loader.vars = {
		"state": {"resources": resources, "queue": []},
		"processing": false,
		"syncQueue": []
	};

	// clear qunit-fixture
	$("#qunit-fixture").empty();
};

function _testTeardown() {
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

function _checkSingleRenderer(name, element, rendererFn, suffix) {
	suffix = suffix || "";
	if (!element) {
		QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template." + suffix);
		return;
	}
	var oldElement = element.clone(true, true);
	var renderedElement = rendererFn.call(this, element);
	_testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix);
}

function _checkRenderers(config) {
	var self = this;
	var instance = config.instance;
	var renderers = config.renderers;
	config.statPrefix = config.statPrefix || "";
	$.each(renderers, function(name, renderer) {
		QUnit.config.current.moduleTestEnvironment.meta.functions.push(config.statPrefix + "renderers." + name);
		_checkSingleRenderer.call(self, name, (config.statPrefix ? instance : self).view.get(name), renderers[name]);
	});
	var oldElements = Echo.Utils.foldl({}, instance.view._elements, function(element, acc, name) {
		acc[name] = element.clone(true, true);
	});
	instance.render();
	$.each(renderers, function(name, element) {
		_checkSingleRenderer.call(self, name, oldElements[config.cssPrefix + name], renderers[name], " (recursive rerendering case)");
	});
}

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
	// Some renderers may add computed numbers or dates to element HTML so it
	// may become different in the 2 sequential executions. We still consider such
	// renderers valid that's why we replace any number of digits in the element
	// text with a single "0" symbol for new text and old text to match
	var oldText = oldElement.text().toLowerCase().replace(/\d+/g, "0");
	var newText = renderedElement.text().toLowerCase().replace(/\d+/g, "0");
	QUnit.equal(
		newText,
		oldText,
		prefix + "check that text representation of the element is still the same after second rendering" + suffix
	);
};
// TODO: remove this line when all tests use new format
Echo.Tests._testElementsConsistencyAfterRendering = _testElementsConsistencyAfterRendering;

})(Echo.jQuery);
