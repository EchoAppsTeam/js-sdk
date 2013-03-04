(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Tests.Suite) return;

Echo.Tests.Suite = function() {
	this.config = {
		"asyncTimeout": 500,
		"testTimeout": 5000,
		"target": $("#qunit-fixture"),
		"appkey": "test.aboutecho.com",
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
						"appkey": "test.aboutecho.com",
						"target": $("#qunit-fixture")
					}, test.instance.config || {});
					var component = Echo.Utils.getComponent(test.instance.name);
					var instance = new component(config);
					check(instance);
				}
			});
		});
	});
};

Echo.Tests.Suite.prototype.sequentialAsyncTests = function(funcs, namespace) {
	if (namespace && $.isPlainObject(this[namespace]) && $.isFunction(this[namespace].destroy)) {
		funcs.push("destroy");
	}
	funcs.push(QUnit.start);
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
		func.call(self, function() { recursive(list); });
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
	var _check = function(forComponent) {
		var renderers = forComponent ? plugin._manifest("component").renderers : plugin._manifest("renderers");
		$.each(renderers, function(name, renderer) {
			// don't test private renderer
			if (name.charAt(0) === "_") return true;

			self.info.functions.push((forComponent ? "component." : "") + "renderers." + name);
			var element = forComponent ? plugin.component.view.get(name) : plugin.view.get(name);
			var oldElement = element.clone();
			var renderedElement = renderer.call(plugin, element);
			QUnit.ok(renderedElement instanceof jQuery && renderedElement.length === 1, "Renderer \"" + name + "\": check contract");
			QUnit.ok(renderedElement.jquery === oldElement.jquery, "Renderer \"" + name + "\": check that element is still the same after second rendering");
			QUnit.equal(renderedElement.children().length, oldElement.children().length, "Renderer \"" + name + "\": check the number of children after second rendering of element");
		});
	};
	_check(false);
	_check(true);
};


/*
The Idea of the function were took from https://github.com/jquery/jquery-ui/blob/master/tests/unit/testsuite.js
Some functionality copied as is.
*/
Echo.Tests.Suite.prototype.jqueryObjectsEqual = function(source, target, message) {
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
			result[attr] = typeof value !== "undefined" ? value : "";
		});
		$.map(attributes, function(attr) {
			var value = elem.attr(attr);
			result[attr] = typeof value !== "undefined" ? value : "";
		});
		result.events = $._data(elem[0], "events");
		result.data = $.extend({}, elem.data());
		delete result.data[$.expando];
		children = elem.children();
		if (children.length) {
			result.children = elem.children().map(function( ind ) {
				return extract($(this));
			}).get();
		} else {
			result.text = elem.text();
		}
		return result;
	}
	expected = extract(source);

	actual = extract(target);
	QUnit.deepEqual(actual, expected, message);
};

Echo.Tests.Suite.prototype.constructRenderersTest = function(data) {
	var self = this;
	data.check = function(instance) {
		if (!instance.view.rendered()) {
			instance.render();
		}
		$.each(instance.renderers, function(name, renderer) {
			self.info.functions.push("renderers." + name);
			var element = instance.view.get(name);
			if (!element) {
				QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template.");
				return;
			}
			var oldElement = element.clone();
			var renderedElement = instance.view.render({"name": name});
			QUnit.ok(renderedElement instanceof jQuery && renderedElement.length === 1, "Renderer \"" + name + "\": check contract");
			QUnit.ok(renderedElement.jquery === oldElement.jquery, "Renderer \"" + name + "\": check that element is still the same after second rendering");
			QUnit.deepEqual(renderedElement.children().length, oldElement.children().length, "Renderer \"" + name + "\": check the number of children after second rendering of element");
		});
		if (data.config.async) {
			QUnit.start();
		}
	};
	this.tests.TestRenderers = data;
};

Echo.Tests.Suite.prototype.loginTestUser = function(config, callback) {
	var user = Echo.UserSession($.extend({"appkey": "test.aboutecho.com"}, config || {}));
	if (user.is("logged")) {
		callback && callback();
		return;
	}
	$.get("http://echosandbox.com/js-sdk/auth", {
		"action": "login",
		"channel": Backplane.getChannelID(),
		"identityUrl": "http://somedomain.com/users/fake_user"
	}, function() {
		Echo.UserSession._onInit(callback);
		Backplane.expectMessages("identity/ack");
	}, "jsonp");
};

Echo.Tests.Suite.prototype.logoutTestUser = function(callback) {
	Echo.UserSession({"appkey": "test.aboutecho.com"}).logout(callback);
};

Echo.Tests.Suite.prototype._prepareEnvironment = function(test, callback) {
	var self = this;
	this._cleanupEnvironment(function() {
		if (test.config.user.status === "anonymous") {
			callback();
			return;
		}
		self.loginTestUser(test.config.user, callback);
	});
};

Echo.Tests.Suite.prototype._cleanupEnvironment = function(callback) {
	//delete all event handlers in all contexts
	Echo.Events._subscriptions = {};
	Echo.Events._dataByHandlerId = {};

	// clear qunit-fixture
	$("#qunit-fixture").empty();

	// logout user
	this.logoutTestUser(callback);
};

})(Echo.jQuery);
