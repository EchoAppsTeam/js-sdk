(function($) {

"use strict";

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {"Unit": {}, "Common": {}};

Echo.Tests.runTests = function() {
	Backplane.init({
		"serverBaseURL" : "http://api.echoenabled.com/v1",
		"busName": "jskit"		
	});
	$.each(this.Unit, function(name, suiteClass) {
		$.extend(suiteClass.prototype, new Echo.Tests.Common());
		suiteClass.prototype.tests = suiteClass.prototype.tests || {};
		var suite = new suiteClass();
		var normalizedName = suite.info.suiteName || suite.normalizeName(name, true);
		QUnit.module(normalizedName);
		// TODO: register single callback for all test framework
		// (now one callback for each suite so they are called all after each test is finished)
		QUnit.testDone(function(data) {
			if (data.module != normalizedName) {
				return;
			}
			$.each(suite.info.functions, function(i, name) {
				Echo.Tests.Stats.functions.tested[suite.info.className + "." + name] = true;
			});
		});
		suite.run();
	});
};

Echo.Tests.Common = function() {
	this.config = {
		"asyncTimeout": 500,
		"testTimeout": 5000,
		"appkey": "test.aboutecho.com",
		"dataBaseLocation": "http://example.com/js-sdk/"
	};
};

Echo.Tests.Common.prototype.run = function() {
	var self = this;
	this.info = this.info || {};
	this.info.functions = this.info.functions || [];
	this.info.className = this.info.className || "";
	$.each(this.tests, function(name, test) {
		test.config = test.config || {};
		if (test.instance && !$.isFunction(test.instance)) {
			test.config.async = true;
		}
		test.config.user = test.config.user || {"status": "anonymous"};
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
		QUnit.asyncTest(name, function() {
			self.prepareEnvironment(test, function() {
				// time in milliseconds after which test will time out
				QUnit.config.testTimeout = test.config.testTimeout || self.config.testTimeout;
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

Echo.Tests.Common.prototype.sequentialAsyncTests = function(funcs, namespace) {
	funcs.push(function() {
		QUnit.start();
	});
	this.sequentialCall(funcs, namespace);
};

Echo.Tests.Common.prototype.sequentialCall = function(names, namespace) {
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

Echo.Tests.Common.prototype.normalizeName = function(name, capitalize) {
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


Echo.Tests.Common.prototype.constructUserTest = function(data) {
	//TODO: add extra validation of the user object
	data.check = function(instance) {
		QUnit.ok(!!instance.user, "Check whether the given instance has the user object attached");
		QUnit.start();
	};
	this.tests.TestUserInstance = { "config": { "user": {} }};
};

Echo.Tests.Common.prototype.executePluginRenderersTest = function(plugin) {
	var self = this;
	var renderers = plugin.manifest.renderers;
	if (!plugin.component.dom) {
		plugin.component.render();
	}
	$.each(renderers, function(name, renderer) {
		self.info.functions.push("manifest.renderers." + name);
		var element = plugin.component.dom.get(name);
		var oldElement = element.clone();
		var renderedElement = renderer.call(plugin, element, plugin.component.dom);
		QUnit.ok(renderedElement instanceof jQuery && renderedElement.length == 1, "Renderer \"" + name + "\": check contract");
		QUnit.ok(renderedElement.jquery == oldElement.jquery, "Renderer \"" + name + "\": check that element is still the same after second rendering");
		QUnit.equal(renderedElement.children().length, oldElement.children().length, "Renderer \"" + name + "\": check the number of children after second rendering of element");
	});
};

Echo.Tests.Common.prototype.constructRenderersTest = function(data) {
	var self = this;
	data.check = function(instance) {
		if (!instance.dom) {
			instance.render();
		};
		$.each(instance.extension.renderers, function(name, renderer) {
			// renderer routes shouldn't be checked here, it's Router thing
			if (name == "routes") return;
			self.info.functions.push("renderers." + name);
			var element = instance.dom.get(name);
			if (!element) {
				QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template.");
				return;
			};
			var oldElement = element.clone();
			var renderedElement = instance.render({
				"element": name,
				"dom": instance.dom
			});
			QUnit.ok(renderedElement instanceof jQuery && renderedElement.length == 1, "Renderer \"" + name + "\": check contract");
			QUnit.ok(renderedElement.jquery == oldElement.jquery, "Renderer \"" + name + "\": check that element is still the same after second rendering");
			QUnit.deepEqual(renderedElement.children().length, oldElement.children().length, "Renderer \"" + name + "\": check the number of children after second rendering of element");
		});
		if (data.config.async) {
			QUnit.start();
		}
	};
	this.tests.TestRenderers = data;
};

Echo.Tests.Common.prototype.loginTestUser = function(config, callback) {
	var user = Echo.UserSession({"appkey": "test.aboutecho.com"});
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

Echo.Tests.Common.prototype.logoutTestUser = function(callback) {
	Echo.UserSession({"appkey": "test.aboutecho.com"}).logout(callback);
};

Echo.Tests.Common.prototype.prepareEnvironment = function(test, callback) {
	var self = this;
	this.cleanupEnvironment(function() {
		if (test.config.user.status == "anonymous") {
			callback();
			return;
		}
		self.loginTestUser(test.config.user, callback);
	});
};

Echo.Tests.Common.prototype.cleanupEnvironment = function(callback) {
	//delete all event handlers in all contexts
	Echo.Events._subscriptions = {};
	Echo.Events._dataByHandlerId = {};

	// clear qunit-fixture
	$("#qunit-fixture").empty();

	// logout user
	this.logoutTestUser(callback);
};

Echo.Tests.Stats = {
	"functions": {
		"all": {},
		"executed": {},
		"tested": {}
	},
	"allCount": 0,
	"lists": {
		"executed": [],
		"tested": [],
		"notTested": [],
		"notExecuted": []
	},
	"wrapFunction": function(parentObject, func, name, prefix) {
		var fullName = prefix + name;
		var funcs = Echo.Tests.Stats.functions;
		funcs.all[fullName] = true;
		parentObject[name] = function() {
			if (!funcs.executed[fullName]) {
				funcs.executed[fullName] = 0;
			}
			funcs.executed[fullName]++;
			var r = func.apply(this, arguments);
			if (typeof r != "undefined") return r;
		};
		$.each(func, function(key, value) {
			if (func.hasOwnProperty(key)) {
				parentObject[name][key] = value;
			}
		});
	},
	"getFunctionNames": function(namespace, prefix) {
		var stats = Echo.Tests.Stats;
		var ignoreList = ["Echo.Tests", "Echo.Vars", "Echo.Global"];
		$.each([namespace, namespace.prototype], function(i, parentObject) {
			if (!parentObject) return;
			$.each(parentObject, function(name, value) {
				var isValidForTesting =
					$.inArray(prefix + name, ignoreList) < 0 &&
					parentObject.hasOwnProperty(name) &&
					typeof value != "string" &&
					typeof value != "undefined" &&
					name != "manifest" &&
					name != "constructor" &&
					name != "parent";

				if (!isValidForTesting) return;

				// check if function is "private" (they start with "_" symbol)
				var isInternal = name.charAt(0) == "_";

				// wrap all functions except constructors and "private" functions
				var isFunctionValidForTesting =
					typeof value == "function" &&
					name.charAt(0).toUpperCase() != name.charAt(0) &&
					!isInternal;

				if (isFunctionValidForTesting) {
					stats.wrapFunction(parentObject, value, name, prefix);
				}

				// traverse recursively within the valid for testing objects
				if (!isInternal) {
					stats.getFunctionNames(value, prefix + name + ".");
				}
			});
		});
	},
	"show": function() {
		var all = 0;
		var funcs = Echo.Tests.Stats.functions;
		var lists = Echo.Tests.Stats.lists;
		$.each(funcs.all, function(name) {
			all++;
			lists[funcs.tested[name] ? "tested" : "notTested"].push(name);
			lists[funcs.executed[name] ? "executed" : "notExecuted"].push(name);
		});
		Echo.Tests.Stats.allCount = all;
		$("#qunit-testresult").append(
			'<div class="echo-tests-stats">' +
				'<h3>Code coverage analysis</h3> ' +
				'<p>Total functions count: <b>' + all + '</b></p> ' +
				Echo.Utils.foldl([], {
					"tested": "Covered by tests",
					"notTested": "Not covered",
					"executed": "Executed during the tests",
					"notExecuted": "Not executed"
				}, function(label, acc, type) {
					var css = "red";
					var isBadType = /^not/.test(type);
					if (isBadType && !lists[type].length || !isBadType && lists[type].length == all) {
						css = "green";
					}
					acc.push('<p>' + label + ': <b class="' + css + '">' + lists[type].length + ' (' + (Math.round(1000 * lists[type].length / all) / 10) + '%)</b> [<a class="echo-clickable" data-type="' + type + '">view list</a>]</p> ');
				}).join("") +
				'<div class="echo-tests-stats-functions"></div>' +
			'</div>'
		);
		$(".echo-tests-stats a").click(function() {
			Echo.Tests.Stats.showFunctionList($(this).attr("data-type"));
		});
	},
	"showFunctionList": function(type) {
		// FIXME: unify lists with previous one
		var label = {
			"tested": "Covered by tests",
			"notTested": "Not covered",
			"executed": "Executed during the tests",
			"notExecuted": "Not executed"
		};
		var el = $(".echo-tests-stats-functions");
		this.isListVisible = !(this.isListVisible && this.lastListType == type);
		if (this.isListVisible) {
			var html = Echo.Tests.Stats.lists[type].length && "<ul><li>" + (Echo.Tests.Stats.lists[type].join("</li><li>")) + "</li></ul>" || "Empty list";
			el.show().html("<b>" + label[type] + "</b><br>" + html);
			this.lastListType = type;
		} else {
			el.hide();
		}
	}
};

Echo.Utils.addCSS(
	'.echo-tests-stats p { margin: 5px 0px 5px 20px; }' +
	'.echo-tests-stats p .green { color: green; }' +
	'.echo-tests-stats p .red { color: red; }' +
	'.echo-tests-stats .echo-clickable { text-decoration: underline; }' +
	'.echo-tests-stats-functions { display: none; background: #b9d9dd; margin-top: 10px; padding: 5px 10px; }'
, "echo-tests");

QUnit.begin(function() {
	Echo.Tests.Stats.getFunctionNames(Echo, "Echo.");

	//TODO: check if we need it later
	// Override function so that test suite couldn't execute next test
	// before all data for the current one was not loaded yet
	
});

QUnit.done(function() {
	Echo.Tests.Stats.show();
});

})(jQuery);
