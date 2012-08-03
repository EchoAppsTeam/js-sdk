(function($) {

"use strict";

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {"Unit": {}, "Common": {}};

// collection of component initializers
var _initializers = {};

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

Echo.Tests.getComponentInitializer = function(name) {
	return _initializers[name];
};

Echo.Tests.defineComponentInitializer = function(name, initializer) {
	_initializers[name] = initializer;
};

Echo.Tests.Common = function() {
	this.config = {
		"asyncTimeout": 500,
		"testTimeout": 5000,
		"target": $("#qunit-fixture"),
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

Echo.Tests.Common.prototype.constructPluginRenderersTest = function(config) {
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
				QUnit.start();
			}
		};
		var _config = new Echo.Configuration(config, defaults).getAsHash();
		_config.plugins.push(_config.plugin);
		init(_config);
	}
	this.tests.TestPluginRenderers = data;
};

Echo.Tests.Common.prototype.executePluginRenderersTest = function(plugin) {
	var self = this;
	if (!plugin.component.dom.rendered) {
		plugin.component.dom.render();
	}
	var _check = function(forComponent) {
		var renderers = forComponent ? plugin.manifest.component.renderers : plugin.manifest.renderers;
		$.each(renderers, function(name, renderer) {
			self.info.functions.push((forComponent ? "component." : "") + "renderers." + name);
			var element = forComponent ? plugin.component.dom.get(name) : plugin.dom.get(name);
			var oldElement = element.clone();
			var renderedElement = renderer.call(plugin, element);
			QUnit.ok(renderedElement instanceof jQuery && renderedElement.length == 1, "Renderer \"" + name + "\": check contract");
			QUnit.ok(renderedElement.jquery == oldElement.jquery, "Renderer \"" + name + "\": check that element is still the same after second rendering");
			QUnit.equal(renderedElement.children().length, oldElement.children().length, "Renderer \"" + name + "\": check the number of children after second rendering of element");
		});
	};
	_check(false);
	_check(true);
};

Echo.Tests.Common.prototype.constructRenderersTest = function(data) {
	var self = this;
	data.check = function(instance) {
		if (!instance.dom.rendered) {
			instance.dom.render();
		};
		$.each(instance.extension.renderers, function(name, renderer) {
			self.info.functions.push("renderers." + name);
			var element = instance.dom.get(name);
			if (!element) {
				QUnit.ok(true, "Note: the test for the " + " \"" + name + "\"" + " renderer was not executed, because the template doesn't contain the respective element. This renderer works for another type of template.");
				return;
			};
			var oldElement = element.clone();
			var renderedElement = instance.dom.render({"name": name});
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
		"coverage": {
			"executed": [],
			"tested": [],
			"notTested": [],
			"notExecuted": []
		},
		"events": {
			"subscribed": {},
			"published": {}
		},
		"eventGroups": {
			"published": [],
			"subscribed": [],
			"succeed": [],
			"failed": [],
			"notcovered": [],
			"notexecuted": []
		}
	},
	"labels": {
		"event": {
			"published": "Published events",
			"subscribed": "Subscribed on events",
			"succeed": "Contract check succeeded",
			"failed": "Contract check failed",
			"notcovered": "Published but not defined",
			"notexecuted": "Defined but not published"
		},
		"coverage": {
			"tested": "Covered by tests",
			"notTested": "Not covered",
			"executed": "Executed during the tests",
			"notExecuted": "Not executed"
		}
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
	"prepare": function() {

		Echo.Tests.Stats.getFunctionNames(Echo, "Echo.");

		var eventPublish = Echo.Events.publish;
		var eventSubscribe = Echo.Events.subscribe;

		Echo.Events.subscribe = function(params) {
			if ($.type(Echo.Tests.Stats.lists.events.subscribed[params.topic]) == "undefined") {
				Echo.Tests.Stats.lists.events.subscribed[params.topic] = {
					"count": 0
				};
			}

			Echo.Tests.Stats.lists.events.subscribed[params.topic].count++;

			return eventSubscribe(params);
		};

		Echo.Events.publish = function(params) {

			if ($.type(Echo.Tests.Stats.lists.events.published[params.topic]) == "undefined") {
				Echo.Tests.Stats.lists.events.published[params.topic] = {
					"count": 0,
					"status": "succeed",
					"data": []
				};
			}

			Echo.Tests.Stats.lists.events.published[params.topic].count++;

			if (Echo.Tests.Events.contracts[params.topic]) {
				if (_checkContract(params.data, Echo.Tests.Events.contracts[params.topic]) !== true) {
					Echo.Tests.Stats.lists.events.published[params.topic].status = "failed";
					Echo.Tests.Stats.lists.events.published[params.topic].data.push(params.data);
				}
			} else {
				Echo.Tests.Stats.lists.events.published[params.topic].status = "notcovered";
				Echo.Tests.Stats.lists.events.published[params.topic].data.push(params.data);
			}

			return eventPublish(params);
		}
	},
	"show": function() {
		var all = 0;
		var funcs = Echo.Tests.Stats.functions;
		var lists = Echo.Tests.Stats.lists.coverage;
		$.each(funcs.all, function(name) {
			all++;
			lists[funcs.tested[name] ? "tested" : "notTested"].push(name);
			lists[funcs.executed[name] ? "executed" : "notExecuted"].push(name);
		});
		Echo.Tests.Stats.allCount = all;

		$.each(Echo.Tests.Stats.lists.events.published, function(i, val) {
			Echo.Tests.Stats.lists.eventGroups[val.status].push(i);
			Echo.Tests.Stats.lists.eventGroups["published"].push(i);
		});

		$.each(Echo.Tests.Stats.lists.events.subscribed, function(i, val) {
			Echo.Tests.Stats.lists.eventGroups["subscribed"].push(i);
		});

		var totalContract = 0;
		Echo.Tests.Stats.lists.eventGroups["notexecuted"] = $.map(Echo.Tests.Events.contracts, function(_val, topic) {
			totalContract++;
			if ($.inArray(topic, Echo.Tests.Stats.lists.eventGroups["published"]) == -1) {
				return topic;
			}
		});

		var getCountEvents = function(type, expectedValue) {
			expectedValue = expectedValue || 0;
			if ($.type(expectedValue) == "string") {
				expectedValue = Echo.Tests.Stats.lists.eventGroups[expectedValue].length;
			}
			return '<b class="' + (Echo.Tests.Stats.lists.eventGroups[type].length == expectedValue ? 'green' : 'red') + '">' + Echo.Tests.Stats.lists.eventGroups[type].length + '</b> [<a class="echo-clickable" data-type="' + type +'">view list</a>]';
		};

		$("#qunit-testresult").append(
			'<div class="echo-tests-stats">' +
				'<div class="echo-tests-coverage">' +
				'<h3>Code coverage analysis</h3> ' +
				'<p>Total functions count: <b>' + all + '</b></p> ' +
				Echo.Utils.foldl([], Echo.Tests.Stats.labels.coverage, function(label, acc, type) {
					var css = "red";
					var isBadType = /^not/.test(type);
					if (isBadType && !lists[type].length || !isBadType && lists[type].length == all) {
						css = "green";
					}
					acc.push('<p>' + label + ': <b class="' + css + '">' + lists[type].length + ' (' + (Math.round(1000 * lists[type].length / all) / 10) + '%)</b> [<a class="echo-clickable" data-type="' + type + '">view list</a>]</p> ');
				}).join("") +
				'</div><div class="echo-tests-events">' +
					'<h3>Events analysis</h3> ' +
					'<p>Total contract defined: <b>' + totalContract + '</b></p> ' +
					'<p>Published / Subscribed: ' + getCountEvents("published", totalContract) + ' / ' + getCountEvents("subscribed", totalContract) + '</p>' +
					'<p>Contract check succeeded / failed: ' + getCountEvents("succeed", "published") + ' / ' + getCountEvents("failed", "published") + '</p>' +
					'<p>Published but not defined: ' + getCountEvents("notcovered") + '</p>' +
					'<p>Defined but not published: ' + getCountEvents("notexecuted") + '</p>' +
				'</div><div class="echo-clear"></div>' +
				'<div class="echo-tests-stats-info"></div>' +
			'</div>'
		);

		$(".echo-tests-events a").click(function() {
			Echo.Tests.Stats.showInfoList($(this).attr("data-type"), "event");
		});

		$(".echo-tests-coverage a").click(function() {
			Echo.Tests.Stats.showInfoList($(this).attr("data-type"), "coverage");
		});
	},
	"showInfoList": function(type, prefix) {
		var el = $(".echo-tests-stats-info");
		this.isListVisible = !(this.isListVisible && this.lastListType == prefix + "-" + type);
		if (this.isListVisible) {
			var html,data = [];
			switch(prefix) {
				case "event":
					html = "<ul>";
					$.map(Echo.Tests.Stats.lists.eventGroups[type], function(topic) {
						if (type == "subscribed") {
							html += '<li>' + topic + ': <b>' + Echo.Tests.Stats.lists.events.subscribed[topic].count + '</b>';
						} else {
							if ($.type(Echo.Tests.Stats.lists.events.published[topic]) == "undefined") {
								html += '<li>' + topic + '</li>';
							} else {
								html += '<li>' + topic;
								if (type == "failed") {
									html += ' <span>( failed <b>' + Echo.Tests.Stats.lists.events.published[topic].data.length + '</b> out of <b>' + Echo.Tests.Stats.lists.events.published[topic].count + '</b> times )</span>';
								} else {
									html += ' <span>( executed <b>' + Echo.Tests.Stats.lists.events.published[topic].count + '</b> times )</span>';
								}

								if( type == "notcovered" || type == "failed") {
									html +=	' [<a class="echo-clickable" data-type="' + topic + '">view data</a>] <div class="echo-event-data">' + '</div>';
								}
								html +=	'</li>';
							}
						}
					});
					html += "</ul>";
					break;
				case "coverage":
					html = Echo.Tests.Stats.lists[prefix][type].length && "<ul><li>" + ($.unique(Echo.Tests.Stats.lists[prefix][type]).join("</li><li>")) + "</li></ul>" || "Empty list";
					break;
			}

			el.show().html("<b>" + Echo.Tests.Stats.labels[prefix][type] + "</b><br>" + html);

			el.find(".echo-clickable").click(function() {
				var dataTag = $(this).parent().find(".echo-event-data");
				if (dataTag.html() == "") {
					var data = $.map(Echo.Tests.Stats.lists.events.published[$(this).attr("data-type")].data, function(val) {
						return '<pre>' + QUnit.jsDump.parse(_prepareEventData(val)) + '</pre>';
					});
					dataTag.html(data.join(""));
				}

				if (dataTag.is(':hidden')) {
					dataTag.show();
				} else {
					dataTag.hide();
				}
			});

			this.lastListType = prefix + "-" + type;
		} else {
			el.hide();
		}
	}
};

Echo.Utils.addCSS(
	'.echo-tests-stats p { margin: 5px 0px 5px 20px; }' +
	'.echo-tests-stats p .green { color: green; }' +
	'.echo-tests-stats p .red { color: red; }' +
	'.echo-tests-stats .echo-clickable { text-decoration: underline; cursor: pointer; }' +
	'.echo-tests-stats-info { display: none; background: #b9d9dd; margin-top: 10px; padding: 5px 10px; }' +
	'.echo-event-data { display: none; }' +
	'.echo-event-data pre { border: 1px dashed #999999;	padding: 10px; background: #B0D0D0; }' +
	'.echo-tests-stats-info span { color: #555555; }' +
	'.echo-tests-coverage, .echo-tests-events { float: left; width: 350px; }' +
	'.echo-clear { clear: both; }'
, "echo-tests");

QUnit.begin(function() {
	Echo.Tests.Stats.prepare();
	//TODO: check if we need it later
	// Override function so that test suite couldn't execute next test
	// before all data for the current one was not loaded yet
	
});

QUnit.done(function() {
	Echo.Tests.Stats.show();
});

// Extending QUnit lib to have an ability to verify function contract
var _checkContract = function(origin, template) {
	var result = true;
	if ($.type(template) == $.type(origin)) {
		if ($.isPlainObject(template)) {
			$.each(template, function(i) {
				if (origin.hasOwnProperty(i) && $.type(template[i]) == $.type(origin[i])) {
					if ($.isPlainObject(template[i])) {
						result =  _checkContract(origin[i], template[i]);
					}
				} else {
					result = false;
				}
				if (!result)
					return result;
			});
			if ($.isEmptyObject(template) && !$.isEmptyObject(origin)) {
				result = false;
			}
		}
	} else {
		result = false;
	}
	return result;
};

var _prepareEventData = function(obj, level) {
	level = level || 0;
	if (($.type(obj) == "object" || $.type(obj) == "array")) {
		if (obj.tagName || obj.jquery) {
			obj = "[object DOM]";
		} else if (level <= 2) {
			$.each(obj, function(key) {
				obj[key] = _prepareEventData(obj[key], level+1);
			});
		} else {
			obj = obj.toString();
		}
	}
	return obj;
};

QUnit.checkContract = function(actual, expected, message) {
	QUnit.push(_checkContract(actual, expected), _prepareEventData(actual), _prepareEventData(expected), message);
};

})(jQuery);
