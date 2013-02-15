(function(jQuery) {

"use strict";

var $ = jQuery;

if (!window.Echo) window.Echo = {};
if (!Echo.Tests) Echo.Tests = {"Unit": {}, "Common": {}};

// collection of component initializers
var _initializers = {};

Echo.Tests.baseURL = "http://echoappsteam.github.com/js-sdk/";

(function(){
	var ua = navigator.userAgent.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec(ua)
		|| /(webkit)[ \/]([\w.]+)/.exec( ua )
		|| /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)
		|| /(msie) ([\w.]+)/.exec(ua)
		|| ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		|| [];

	var matched = {
		browser: match[1] || "",
		version: match[2] || "0"
	};
	var browser = {};

	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if (browser.chrome) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}

	Echo.Tests.browser = browser;
})();

Echo.Tests.runTests = function() {
	Backplane.init({
		"serverBaseURL" : "http://api.echoenabled.com/v1",
		"busName": "jskit"		
	});

	// hack for tests of loader
	window.onerror = function( message, file, line ) {
		return /non-existing/.test(file);
	};

	$.each(this.Unit, function(name, suiteClass) {
		$.extend(suiteClass.prototype, new Echo.Tests.Common());
		suiteClass.prototype.tests = suiteClass.prototype.tests || {};
		var suite = new suiteClass();
		var normalizedName = suite.info.suiteName || suite.normalizeName(name, true);
		QUnit.module(normalizedName);
		// TODO: register single callback for all test framework
		// (now one callback for each suite so they are called all after each test is finished)
		QUnit.testDone(function(data) {
			if (data.module !== normalizedName) return;
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
			self.prepareEnvironment(test, function() {
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
	if (namespace && $.isPlainObject(this[namespace]) && $.isFunction(this[namespace].destroy)) {
		funcs.push("destroy");
	}
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

Echo.Tests.Common.prototype.executePluginRenderersTest = function(plugin) {
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
Echo.Tests.Common.prototype.jqueryObjectsEqual = function(source, target, message) {
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

Echo.Tests.Common.prototype.constructRenderersTest = function(data) {
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
		if (test.config.user.status === "anonymous") {
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
			"succeeded": [],
			"failed": [],
			"notcovered": [],
			"notexecuted": []
		}
	},
	"labels": {
		"event": {
			"published": "Published events",
			"subscribed": "Subscribed on events",
			"succeeded": "Contract check succeeded",
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
			if (typeof r !== "undefined") return r;
		};
		// in case function has some properties itself we need to copy them to the wrapped version
		$.each(func, function(key, value) {
			if (func.hasOwnProperty(key)) {
				parentObject[name][key] = value;
			}
		});
	},
	"getFunctionNames": function(namespace, prefix) {
		var stats = Echo.Tests.Stats;
		var ignoreList = ["Echo.Tests", "Echo.Variables", "Echo.jQuery", "Echo.yepnope"];
		var isNotLteIE7 = !(Echo.Tests.browser && Echo.Tests.browser.version <= 7);
		// browser-specific ignore
		$.map(["AJAX", "XDomainRequest", "JSONP"], function(transport) {
			if (!Echo.API.Transports[transport].available() || isNotLteIE7 && transport === "JSONP") {
				ignoreList.push("Echo.API.Transports." + transport);
			}
		});
		$.each([namespace, namespace.prototype], function(i, parentObject) {
			if (!parentObject) return;
			$.each(parentObject, function(name, value) {
				var isValidForTesting =
					$.inArray(prefix + name, ignoreList) < 0 &&
					parentObject.hasOwnProperty(name) &&
					typeof value !== "string" &&
					typeof value !== "undefined" &&
					!$.isArray(value) &&
					name !== "cache" &&
					name !== "manifest" &&
					name !== "constructor" &&
					name !== "parent";

				if (!isValidForTesting) return;

				// check if function is "private" (they start with "_" symbol)
				var isInternal = name.charAt(0) === "_";

				// wrap all functions except constructors and "private" functions
				var isFunctionValidForTesting =
					typeof value === "function" &&
					name.charAt(0).toUpperCase() !== name.charAt(0) &&
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
	"initEventsSpy": function() {
		var eventPublish = Echo.Events.publish;
		var eventSubscribe = Echo.Events.subscribe;
		var events = Echo.Tests.Stats.lists.events;
		var testRegExp = /test/i;

		Echo.Tests.Stats.stopEventsSpy = function() {
			Echo.Events.subscribe = eventSubscribe;
			Echo.Events.publish = eventPublish;
		};

		Echo.Events.subscribe = function(params) {
			if (!testRegExp.test(params.topic)) {
				if ($.type(events.subscribed[params.topic]) === "undefined") {
					events.subscribed[params.topic] = {
						"count": 0
					};
				}
				events.subscribed[params.topic].count++;
			}
			return eventSubscribe(params);
		};

		Echo.Events.publish = function(params) {
			if (!testRegExp.test(params.topic)) {
				if ($.type(events.published[params.topic]) === "undefined") {
					events.published[params.topic] = {
						"count": 0,
						"status": "succeeded",
						"data": []
					};
				}

				events.published[params.topic].count++;

				var data = $.extend(true, {}, params.data);
				if (Echo.Tests.Events.contracts[params.topic]) {
					if (_checkContract(params.data, Echo.Tests.Events.contracts[params.topic]) !== true) {
						events.published[params.topic].status = "failed";
						events.published[params.topic].data.push(data);
					}
				} else {
					events.published[params.topic].status = "notcovered";
					events.published[params.topic].data.push(data);
				}
			}
			return eventPublish(params);
		}
	},
	"stopEventsSpy": function() {
	},
	"prepare": function() {
		Echo.Tests.Stats.getFunctionNames(Echo, "Echo.");
		Echo.Tests.Stats.initEventsSpy();
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

		var events = Echo.Tests.Stats.lists.events;
		var eventGroups = Echo.Tests.Stats.lists.eventGroups;

		Echo.Tests.Stats.stopEventsSpy();

		$.each(events.published, function(i, val) {
			eventGroups[val.status].push(i);
			eventGroups["published"].push(i);
		});

		$.each(events.subscribed, function(i, val) {
			eventGroups["subscribed"].push(i);
		});
		eventGroups["published"].sort();
		eventGroups["subscribed"].sort();

		var totalContract = 0;
		eventGroups["notexecuted"] = $.map(Echo.Tests.Events.contracts, function(_val, topic) {
			totalContract++;
			if ($.inArray(topic, eventGroups["published"]) === -1) {
				return topic;
			}
		});

		var getEventsCount = function(type, expectedValue, isEquiv) {
			var isOk;
			var check = function(expected) {
				if ($.type(expected) === "string") {
					if( isEquiv ) {
						isOk = QUnit.equiv(eventGroups[type], eventGroups[expected])
					} else {
						isOk = eventGroups[type].length === eventGroups[expected].length;
					}
				} else {
					isOk = eventGroups[type].length === expected;
				}
				return isOk;
			};

			expectedValue = expectedValue || 0;

			if ($.isArray(expectedValue)) {
				$.each(expectedValue, function(val) {
					return check(val);
				});
			} else {
				check(expectedValue);
			}

			return '<b class="' + (isOk ? 'green' : 'red') + '">' + eventGroups[type].length + '</b> [<a class="echo-clickable" data-type="' + type +'">view list</a>]';
		};

		$("#qunit-testresult").append(
			'<div class="echo-tests-stats">' +
				'<div class="echo-tests-coverage-functions">' +
				'<h3>Code coverage analysis</h3> ' +
				'<p>Total functions count: <b>' + all + '</b></p> ' +
				Echo.Utils.foldl([], Echo.Tests.Stats.labels.coverage, function(label, acc, type) {
					var css = "red";
					var isBadType = /^not/.test(type);
					if (isBadType && !lists[type].length || !isBadType && lists[type].length === all) {
						css = "green";
					}
					acc.push('<p>' + label + ': <b class="' + css + '">' + lists[type].length + ' (' + (Math.round(1000 * lists[type].length / all) / 10) + '%)</b> [<a class="echo-clickable" data-type="' + type + '">view list</a>]</p> ');
				}).join("") +
				'</div><div class="echo-tests-coverage-events">' +
					'<h3>Events analysis</h3> ' +
					'<p>Total contract defined: <b>' + totalContract + '</b></p> ' +
					'<p>Published / Subscribed: ' + getEventsCount("published", [totalContract, "subscribed"], true) + ' / ' + getEventsCount("subscribed", [totalContract, "published"], true) + ' | [<a class="echo-clickable" data-type="diff">show diff</a>]</p>' +
					'<p>Contract check succeeded / failed: ' + getEventsCount("succeeded", "published") + ' / ' + getEventsCount("failed", 0) + '</p>' +
					'<p>Published but not defined: ' + getEventsCount("notcovered") + '</p>' +
					'<p>Defined but not published: ' + getEventsCount("notexecuted") + '</p>' +
				'</div><div class="echo-clear"></div>' +
				'<div class="echo-tests-stats-info"></div>' +
			'</div>'
		);

		$(".echo-tests-coverage-events a").click(function() {
			Echo.Tests.Stats.showInfoList($(this).attr("data-type"), "event");
		});

		$(".echo-tests-coverage-functions a").click(function() {
			Echo.Tests.Stats.showInfoList($(this).attr("data-type"), "coverage");
		});
	},
	"showInfoList": function(type, prefix) {
		var el = $(".echo-tests-stats-info");
		var eventGroups = Echo.Tests.Stats.lists.eventGroups;
		var events = Echo.Tests.Stats.lists.events;
		this.isListVisible = !(this.isListVisible && this.lastListType === prefix + "-" + type);
		if (this.isListVisible) {
			var html = "",data = [];
			switch(prefix) {
				case "event":
					if (type === "diff") {
						var getDiff = function(o, n, title) {
							var html = "";

							$.map(eventGroups[o], function(val) {
								if ($.inArray(val, eventGroups[n]) === -1) {
									html += "<li>" + val + "</li>";
								}
							});

							if (html.length) {
								html = "<ul>" + html + "</ul>";
							} else {
								html = "<ul><li>Empty list</li></ul>";
							}

							return "<b>" + title + "</b>" + html;
						};

						html += getDiff("published", "subscribed", "Published but not subscribed");
						html += getDiff("subscribed", "published", "Subscribed but not published");
					} else {
						$.map(eventGroups[type], function(topic) {
							var getTextCount = function(count) {
								return count === 1 ? "once" : count + " times"
							};

							if (type === "subscribed") {
								html += '<li>' + topic + ': <span>( subscribed <b>' + getTextCount(events.subscribed[topic].count) + '</b> )</span></li>';
							} else {
								if ($.type(events.published[topic]) === "undefined") {
									html += '<li>' + topic + '</li>';
								} else {
									html += '<li>' + topic;
									if (type === "failed") {
										html += ' <span>( failed <b>' + getTextCount(events.published[topic].data.length) + '</b> out of <b>' + getTextCount(events.published[topic].count) + '</b> )</span>';
									} else {
										html += ' <span>( published <b>' + getTextCount(events.published[topic].count)  + '</b> )</span>';
									}

									if( type === "notcovered" || type === "failed") {
										html +=	' [<a class="echo-clickable" data-type="' + topic + '">view data</a>] <div class="echo-tests-event-data">' + '</div>';
									}
									html +=	'</li>';
								}
							}
						});

						if (!html.length) {
							html = "<ul><li>Empty list</li></ul>";
						} else {
							html = "<ul>"+html+"</ul>";
						}
					}
					break;
				case "coverage":
					html = Echo.Tests.Stats.lists[prefix][type].length && "<ul><li>" + (Echo.Tests.Stats.lists[prefix][type].sort().join("</li><li>")) + "</li></ul>" || "Empty list";
					break;
			}

			el.html("<b>" + (Echo.Tests.Stats.labels[prefix][type] || "") + "</b><br>" + html).show();

			if (prefix === "event") {
				el.find(".echo-clickable").click(function() {
					var dataTag = $(this).parent().find(".echo-tests-event-data");
					if (dataTag.html() === "") {
						var data = $.map(events.published[$(this).attr("data-type")].data, function(val) {
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
			}

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
	'.echo-tests-stats-info span { color: #555555; }' +
	'.echo-tests-stats-info del {background: #E0F2BE; color: #374E0C; text-decoration: none;}' +
	'.echo-tests-stats-info ins {background: #FFCACA; color: #550000; text-decoration: none;}' +
	'.echo-tests-event-data { color: black; display: none; }' +
	'.echo-tests-event-data pre { border: 1px dashed #999999; padding: 10px; background: #B0D0D0; }' +
	'.echo-tests-coverage-functions, .echo-tests-coverage-events { float: left; width: 400px; }' +
	'.echo-clear { clear: both; }'
, "echo-tests");

// No reordering tests, they will run one by one
QUnit.config.reorder = false;

QUnit.begin(function() {
	Echo.Tests.Stats.prepare();
});

QUnit.done(function() {
	// stop Backplane requests
	Backplane.initialized = false;

	Echo.Tests.Stats.show();
});

// Extending QUnit lib to have an ability to verify function contract
var _checkContract = function(origin, template, isRecursive) {
	var result = true;
	if (!isRecursive && $.isArray(template)) {
		$.each(template, function(i, value) {
			result = _checkContract(origin, value, true);
			if (result) return false;
		});
	} else {
		if ($.type(template) === $.type(origin)) {
			if ($.isPlainObject(template)) {
				$.each(template, function(i) {
					if (origin.hasOwnProperty(i) && $.type(template[i]) === "function") {
						result = template[i](origin[i]);
					} else {
						if (origin.hasOwnProperty(i) && $.type(template[i]) === $.type(origin[i])) {
							if ($.isPlainObject(template[i])) {
								result =  _checkContract(origin[i], template[i], true);
							}
						} else {
							result = false;
						}
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
	}
	return result;
};

var _prepareEventData = function(obj, level) {
	level = level || 0;
	if (($.type(obj) === "object" || $.type(obj) === "array")) {
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

})(Echo.jQuery);
