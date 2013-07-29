(function(jQuery) {
"use strict";

var $ = jQuery;

Echo.Tests.addModule = function(config) {
	config.meta = config.meta || {};
	QUnit.module(config.name, {
		"setup": function() {
			Echo.Tests._setup();
			config.setup && config.setup.call(this);
		},
		"teardown": function() {
			config.teardown && config.teardown.call(this);
			Echo.Tests._teardown();
		},
		"meta": {
			"className": config.meta.className || "",
			"functions": config.meta.functions || []
		}
	});
};

Echo.Tests.iframeTest = function(test) {
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

/*
The Idea of the function were took from https://github.com/jquery/jquery-ui/blob/master/tests/unit/testsuite.js
Some functionality copied as is.
*/
Echo.Tests.jqueryObjectsEqual = function(source, target, message) {
	var expected, actual;
	var properties = [
		"disabled",
		"readOnly"
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
			QUnit.push(false, actual, expected,
				"jqueryObjectsEqual failed, can't extract the element, message was: " + message);
			return;
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
			result.tagName = elem.prop("tagName");
			result.text = elem.text();
		}
		return result;
	}
	expected = extract(source);

	actual = extract(target);
	QUnit.deepEqual(actual, expected, message);
};

Echo.Tests.constructRenderersTest = function(test) {
	test.config = $.extend({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"target": $("#qunit-fixture"),
		"ready": function() {}
	}, test.config || {});
	QUnit.asyncTest("basic checks for renderers", function() {
		var handler = function() {
			var instance = this;
			var checker = function(name, element, suffix) {
				if (!element) {
					QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template." + suffix);
					return;
				}
				var oldElement = element.clone(true, true);
				var renderedElement = instance.view.render({"name": name});
				Echo.Tests._testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix);
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
		var ready = test.config.ready;
		test.config.ready = function() {
			if (this.view.rendered()) {
				handler.call(this);
			} else {
				this.events.subscribe({
					"topic": test.component + ".onRender",
					"once": true,
					"handler": handler
				});
			}
			ready.call(this);
		};
		var Component = Echo.Utils.getComponent(test.component);
		new Component(test.config);
	});
};

Echo.Tests._testElementsConsistencyAfterRendering = function(name, oldElement, renderedElement, suffix) {
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

Echo.Tests._setup = function() {
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

Echo.Tests._teardown = function() {
	var meta = QUnit.config.current.moduleTestEnvironment.meta;
	if (!meta || meta.processed) return;
	meta.processed = true;
	$.each(meta.functions, function(i, name) {
		Echo.Tests.Stats.markFunctionTested(meta.className + "." + name);
	});
};

})(Echo.jQuery);
