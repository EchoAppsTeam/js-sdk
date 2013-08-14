(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Tests.Suite) return;

Echo.Tests.Suite = function() {
	this.config = {
		"asyncTimeout": 500,
		"testTimeout": 5000,
		"target": $("#qunit-fixture"),
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"dataBaseLocation": "http://example.com/js-sdk/"
	};
};

Echo.Tests.Suite.prototype.run = function() {
	var self = this;
	this.info = this.info || {};
	this.info.functions = this.info.functions || [];
	this.info.className = this.info.className || "";
	$.each(this.tests, function(name, test) {
		test.config = test.config || {};
		if (test.instance && !$.isFunction(test.instance)) {
			test.config.async = true;
		}
		test.config.user = test.config.user || {};
		test.config.user.status = test.config.user.status || "anonymous";
		var check = function(instance) {
			if (!test.config.async) {
				test.check.call(self, instance);
			} else {
				setTimeout(function() {
					test.check.call(self, instance);
				}, test.config.asyncTimeout || self.config.asyncTimeout);
			}
		};
		name = test.config.name || self.normalizeName(name);
		if (test.config.description) {
			name = name + " (" + test.config.description + ")";
		}
		QUnit.test(name, function() {
			// time in milliseconds after which test will time out
			QUnit.config.testTimeout = test.config.testTimeout || self.config.testTimeout;
			// we intentionally prevent next test execution
			// allowing current test to complete or time out
			QUnit.stop();
			self._prepareEnvironment(test, function() {
				if (!test.instance) {
					check();
					// we need to switch to the next test
					// if it was NOT defined as async
					if (!test.config.async) {
						QUnit.start();
					}
				} else if ($.isFunction(test.instance)) {
					check(test.instance());
					QUnit.start();
				} else {
					var config = $.extend({
						"appkey": "echo.jssdk.tests.aboutecho.com",
						"target": $("#qunit-fixture"),
						"ready": function() {
							check(this);
						}
					}, test.instance.config || {});
					var component = Echo.Utils.getComponent(test.instance.name);
					var instance = new component(config);
					if (test.instance.config && test.instance.config.ready) {
						check(instance);
					}
				}
			});
		});
	});
};

Echo.Tests.Suite.prototype.sequentialAsyncTests = function(funcs, namespace) {
	if (namespace && $.isPlainObject(this[namespace]) && $.isFunction(this[namespace].destroy)) {
		funcs.push("destroy");
	}
	funcs.push(function() {
		QUnit.start();
	});
	this.sequentialCall(funcs, namespace);
};

Echo.Tests.Suite.prototype.sequentialCall = function(names, namespace) {
	var self = this;
	var recursive = function(list) {
		if (!list.length) {
			return;
		}
		var func = list.shift();
		if (!$.isFunction(func)) {
			func = (namespace ? self[namespace] : self)[func];
		}
		func.call(self, function() {
			// NOTE: THIS IS A HACK. THIS TECHNIQUE COULD PROVIDE A BUGGY BEHAVIOUR WITH THE FUNCTION SEQUENCES.
			// When we use recursion every "func" call stack save in the root call stack
			// It means that every variables and other properties will accumulate in the root call stack
			// Every engine has a inner call stack size dependent on OS and browser as well
			// In some cases when we sequentially called lots of tests functions call root stack size
			// growing up and overflowed.
			// To avoid it we are wrapped every further recursive function into setTimeout which clear
			// root call stack and executes the function in your own.
			setTimeout(function() {
				recursive(list);
			}, 0);
		});
	};
	recursive(names);
};

Echo.Tests.Suite.prototype.normalizeName = function(name, capitalize) {
	return (!~name.search(/\W/g)
		? name.replace(/[A-Z]|_/g, function(match, pos) {
			var m = match.toLowerCase();
			m = capitalize && m.replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			}) || m;
			return (pos ? " " : "") + m;
		})
		: name);
};

Echo.Tests.Suite.prototype.constructPluginRenderersTest = function(config) {
	var data = {
		"config": {"async": true}
	};
	data.check = function(instance) {
		var test = this;
		var parts = this.info.className.split(".Plugins.");
		var component = parts[0], plugin = parts[1];
		var init = Echo.Tests.getComponentInitializer(component);
		var defaults = {
			"appkey": this.config.appkey,
			"target": this.config.target,
			"dataBaseLocation": this.config.dataBaseLocation,
			"plugin": {"name": plugin},
			"plugins": [],
			"ready": function() {
				test.executePluginRenderersTest(this.getPlugin(plugin));
				this.destroy();
				QUnit.start();
			}
		};
		var _config = new Echo.Configuration(config, defaults).getAsHash();
		_config.plugins.push(_config.plugin);
		init(_config);
	};
	this.tests.TestPluginRenderers = data;
};

Echo.Tests.Suite.prototype.executePluginRenderersTest = function(plugin) {
	var self = this;
	if (!plugin.component.view.rendered()) {
		plugin.component.render();
	}
	var check = function(forComponent) {
		var renderers = forComponent ? plugin._manifest("component").renderers : plugin._manifest("renderers");
		var checker = function(name, element, suffix) {
			var oldElement = element.clone(true, true);
			var renderedElement = renderers[name].call(plugin, element);
			Echo.Tests._testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix);
		};
		$.each(renderers, function(name, renderer) {
			// don't test private renderer
			if (name.charAt(0) === "_") return true;

			self.info.functions.push((forComponent ? "component." : "") + "renderers." + name);
			checker(name, forComponent ? plugin.component.view.get(name) : plugin.view.get(name));
		});
		var oldElements = Echo.Utils.foldl({}, plugin.component.view._elements, function(element, acc, name) {
			acc[name] = element.clone(true, true);
		});
		plugin.component.render();
		$.each(renderers, function(name) {
			// don't test private renderer
			if (name.charAt(0) === "_") return true;
			checker(name, oldElements[(forComponent ? plugin.component.cssPrefix : plugin.cssPrefix) + name], " (recursive rerendering case)");
		});
	};
	check(false);
	check(true);
};

Echo.Tests.Suite.prototype.jqueryObjectsEqual = function(source, target, message) {
	Echo.Tests.jqueryObjectsEqual(source, target, message);
};

Echo.Tests.Suite.prototype.constructRenderersTest = function(data) {
	var self = this;
	data.check = function(instance) {
		if (!instance.view.rendered()) {
			instance.render();
		}
		var checker = function(name, element, suffix) {
			suffix = suffix || "";
			if (!element) {
				QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template." + suffix);
				return;
			}
			var oldElement = element.clone(true, true);
			var renderedElement = instance.view.render({"name": name});
			Echo.Tests._testElementsConsistencyAfterRendering(name, oldElement, renderedElement, suffix);
		};
		$.each(instance.renderers, function(name, renderer) {
			self.info.functions.push("renderers." + name);
			checker(name, instance.view.get(name));
		});
		var oldElements = Echo.Utils.foldl({}, instance.view._elements, function(element, acc, name) {
			acc[name] = element.clone(true, true);
		});
		instance.render();
		$.each(instance.renderers, function(name, element) {
			checker(name, oldElements[instance.cssPrefix + name], " (recursive rerendering case)");
		});
		if (data.config.async) {
			QUnit.start();
		}
	};
	this.tests.TestRenderers = data;
};

// TODO: get rid of this function once IdentityServer.API is rewritten using new format
Echo.Tests.Suite.prototype.loginTestUser = function(config, callback) {
	Echo.Tests.Utils.actualizeTestUser(config, callback);
};

Echo.Tests.Suite.prototype._prepareEnvironment = function(test, callback) {
	this._cleanupEnvironment();
	Echo.Tests.Utils.actualizeTestUser(test.config.user, callback);
};

Echo.Tests.Suite.prototype._cleanupEnvironment = function() {
	//delete all event handlers in all contexts
	Echo.Events._subscriptions = {};
	Echo.Events._dataByHandlerId = {};

	// clear qunit-fixture
	$("#qunit-fixture").empty();

	// force Echo.UserSession to re-initialize itself completely
	// during the next Echo.UserSession object initialization
	Echo.UserSession.state = "init";
};

})(Echo.jQuery);
