(function(jQuery) {

"use strict";

var $ = jQuery;

if (Echo.Tests.Stats) return;

Echo.Tests.Stats = {};

Echo.Tests.Stats.markFunctionTested = function(fn) {
	_coverage.functions.raw.tested[fn] = true;
};

QUnit.begin(_initStats);

QUnit.done(_showStats);

// private stuff

var _coverage = {};

_coverage.functions = {
	"raw": {
		"all": {},
		"executed": {},
		"tested": {}
	},
	"processed": {
		"count": 0,
		"tested": [],
		"notTested": [],
		"executed": [],
		"notExecuted": []
	},
	"labels": {
		"tested": "Covered by tests",
		"notTested": "Not covered",
		"executed": "Executed during the tests",
		"notExecuted": "Not executed"
	}
};

_coverage.events = {
	"raw": {
		"subscribed": {},
		"published": {}
	},
	"processed": {
		"count": 0,
		"published": [],
		"subscribed": [],
		"succeeded": [],
		"failed": [],
		"notTested": [],
		"notPublished": []
	},
	"labels": {
		"published": "Published events",
		"subscribed": "Subscribed on events",
		"succeeded": "Contract check succeeded",
		"failed": "Contract check failed",
		"notTested": "Published but not defined",
		"notPublished": "Defined but not published"
	}
};

function initStats() {
	getFunctionNames(Echo.Tests.Stats.root.object, Echo.Tests.Stats.root.namespace);
	startEventsSpy();
};

function showStats() {
	stopEventsSpy();
	calculateFunctionsCoverage();
	calculateEventsCoverage();
	showCoverage();
};

var _eventsPublish, _eventsSubscribe;

function startEventsSpy() {
	if (!Echo.Tests.Events) return;

	var events = _coverage.events.raw;
	var testRegExp = /test/i;
	_eventsPublish = Echo.Events.publish;
	_eventsSubscribe = Echo.Events.subscribe;

	Echo.Events.subscribe = function(params) {
		if (!testRegExp.test(params.topic)) {
			if (typeof events.subscribed[params.topic] === "undefined") {
				events.subscribed[params.topic] = {
					"count": 0
				};
			}
			events.subscribed[params.topic].count++;
		}
		return _eventsSubscribe(params);
	};

	Echo.Events.publish = function(params) {
		if (!testRegExp.test(params.topic)) {
			if (typeof events.published[params.topic] === "undefined") {
				events.published[params.topic] = {
					"count": 0,
					"status": "succeeded",
					"data": []
				};
			}

			events.published[params.topic].count++;

			var data = $.extend(true, {}, params.data);
			if (Echo.Tests.Events.contracts[params.topic]) {
				if (checkContract(params.data, Echo.Tests.Events.contracts[params.topic]) !== true) {
					events.published[params.topic].status = "failed";
					events.published[params.topic].data.push(data);
				}
			} else {
				events.published[params.topic].status = "notTested";
				events.published[params.topic].data.push(data);
			}
		}
		return _eventsPublish(params);
	}
};

function stopEventsSpy() {
	if (!Echo.Tests.Events) return;

	Echo.Events.subscribe = _eventsSubscribe;
	Echo.Events.publish = _eventsPublish;
};

function wrapFunction(parentObject, func, name, prefix) {
	var fullName = prefix + name;
	var funcs = _coverage.functions.raw;
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
};

function getFunctionNames(namespace, prefix) {
	$.each([namespace, namespace.prototype], function(i, parentObject) {
		if (!parentObject) return;
		$.each(parentObject, function(name, value) {
			var isValidForTesting = Echo.Tests.Stats.isValidForTesting(parentObject, prefix, name, value);
			if (!isValidForTesting) return;

			// check if function is "private" (they start with "_" symbol)
			var isInternal = name.charAt(0) === "_";

			// wrap all functions except constructors and "private" functions
			var isFunctionValidForTesting =
				typeof value === "function" &&
				name.charAt(0).toUpperCase() !== name.charAt(0) &&
				!isInternal;

			if (isFunctionValidForTesting) {
				wrapFunction(parentObject, value, name, prefix);
			}

			if (!isInternal) {
				getFunctionNames(value, prefix + name + ".");
			}
		});
	});
};

function calculateFunctionsCoverage() {
	var raw = _coverage.functions.raw;
	var processed = _coverage.functions.processed;
	$.each(raw.all, function(name) {
		processed.count++;
		processed[raw.tested[name] ? "tested" : "notTested"].push(name);
		processed[raw.executed[name] ? "executed" : "notExecuted"].push(name);
	});
};

function calculateEventsCoverage() {
	if (!Echo.Tests.Events) return;

	var raw = _coverage.events.raw;
	var processed = _coverage.events.processed;
	$.each(raw.published, function(i, val) {
		processed[val.status].push(i);
		processed.published.push(i);
	});
	$.each(raw.subscribed, function(i, val) {
		processed.subscribed.push(i);
	});
	processed.published.sort();
	processed.subscribed.sort();

	processed.notPublished = $.map(Echo.Tests.Events.contracts, function(_val, topic) {
		processed.count++;
		if ($.inArray(topic, processed.published) === -1) {
			return topic;
		}
	});
};

function getEventsCount(type, expectedValue, isEquiv) {
	var isOk, processed = _coverage.events.processed;
	expectedValue = expectedValue || 0;

	var check = function(expected) {
		if (typeof expected === "string") {
			if (isEquiv) {
				isOk = QUnit.equiv(processed[type], processed[expected])
			} else {
				isOk = processed[type].length === processed[expected].length;
			}
		} else {
			isOk = processed[type].length === expected;
		}
		return isOk;
	};

	if ($.isArray(expectedValue)) {
		$.each(expectedValue, function(val) {
			// if real value is not equal with ANY of a number of expected values
			// then consider it failed and don't compare with other
			return check(val);
		});
	} else {
		check(expectedValue);
	}

	return '<b class="' + (isOk ? 'green' : 'red') + '">' + processed[type].length + '</b> [<a class="echo-clickable" data-type="' + type +'">view list</a>]';
};

function showCoverage() {
	var funcs = _coverage.functions;
	var events = _coverage.events;
	$("#qunit-testresult").append(
		'<div class="echo-tests-stats">' +
			'<div class="echo-tests-coverage-functions">' +
			'<h3>Code coverage analysis</h3> ' +
			'<p>Total functions count: <b>' + funcs.processed.count + '</b></p> ' +
			Echo.Utils.foldl([], funcs.labels, function(label, acc, type) {
				var css = "red";
				var isBadType = /^not/.test(type);
				if (isBadType && !funcs.processed[type].length || !isBadType && funcs.processed[type].length === funcs.processed.count) {
					css = "green";
				}
				acc.push('<p>' + label + ': <b class="' + css + '">' + funcs.processed[type].length + ' (' + (Math.round(1000 * funcs.processed[type].length / funcs.processed.count) / 10) + '%)</b> [<a class="echo-clickable" data-type="' + type + '">view list</a>]</p> ');
			}).join("") +
			'</div>' +
			(!Echo.Tests.Events
				? '' 
				: '<div class="echo-tests-coverage-events">' +
					'<h3>Events analysis</h3> ' +
					'<p>Total contract defined: <b>' + events.processed.count + '</b></p> ' +
					'<p>Published / Subscribed: ' + getEventsCount("published", [events.processed.count, "subscribed"], true) + ' / ' + getEventsCount("subscribed", [events.processed.count, "published"], true) + ' | [<a class="echo-clickable" data-type="diff">show diff</a>]</p>' +
					'<p>Contract check succeeded / failed: ' + getEventsCount("succeeded", "published") + ' / ' + getEventsCount("failed", 0) + '</p>' +
					'<p>Published but not defined: ' + getEventsCount("notTested") + '</p>' +
					'<p>Defined but not published: ' + getEventsCount("notPublished") + '</p>' +
				'</div>'
			) +
			'<div class="echo-clear"></div>' +
			'<div class="echo-tests-stats-info"></div>' +
		'</div>'
	);

	$(".echo-tests-coverage-events a").click(function() {
		showCoverageList($(this).data("type"), "events");
	});
	$(".echo-tests-coverage-functions a").click(function() {
		showCoverageList($(this).data("type"), "functions");
	});
};

var _isListVisible, _lastListType;
function showCoverageList(type, prefix) {
	var html = "", data = [];
	var el = $(".echo-tests-stats-info");
	var list = _coverage[prefix].processed[type];
	_isListVisible = !(_isListVisible && _lastListType === prefix + "-" + type);
	if (_isListVisible) {
		if (prefix === "functions") {
			html = list.length && "<ul><li>" + (list.join("</li><li>")) + "</li></ul>" || "Empty list";
			el.html("<b>" + (_coverage[prefix].labels[type] || "") + "</b><br>" + html).show();
		} else if (prefix === "events") {
			var events = _coverage[prefix];
			if (type === "diff") {

				var getDiff = function(o, n, title) {
					var html = "";

					$.map(events.processed[o], function(val) {
						if ($.inArray(val, events.processed[n]) === -1) {
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
				var getTextCount = function(count) {
					return count === 1 ? "once" : count + " times"
				};
				$.each(list, function(i, topic) {
					if (type === "subscribed") {
						html += '<li>' + topic + ' <span>( subscribed <b>' + getTextCount(events.raw[type][topic].count) + '</b> )</span></li>';
					} else if ($.type(events.raw.published[topic]) === "undefined") {
						html += '<li>' + topic + '</li>';
					} else {
						html += '<li>' + topic;
						if (type === "failed") {
							html += ' <span>( failed <b>' + getTextCount(events.raw.published[topic].data.length) + '</b> out of <b>' + getTextCount(events.raw.published[topic].count) + '</b> )</span>';
						} else {
							html += ' <span>( published <b>' + getTextCount(events.raw.published[topic].count)  + '</b> )</span>';
						}

						if( type === "notTested" || type === "failed") {
							html +=	' [<a class="echo-clickable" data-topic="' + topic + '">view data</a>] <div class="echo-tests-event-data">' + '</div>';
						}
						html +=	'</li>';
					}
				});

				if (!html.length) {
					html = "<ul><li>Empty list</li></ul>";
				} else {
					html = "<ul>"+html+"</ul>";
				}
			}

			el.html("<b>" + (_coverage[prefix].labels[type] || "") + "</b><br>" + html).show()
				.find(".echo-clickable").click(function() {
					var dataTag = $(this).parent().find(".echo-tests-event-data");
					if (dataTag.html() === "") {
						var data = $.map(events.raw.published[$(this).data("topic")].data, function(val) {
							return '<pre>' + QUnit.jsDump.parse(prepareEventData(val)) + '</pre>';
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
		_lastListType = prefix + "-" + type;
	} else {
		el.hide();
	}
};

function checkContract(actual, expected) {
	var result;

	// event has several expected results so let's match against one of them
	if ($.isArray(expected)) {
		$.each(expected, function(i, sample) {
			result = checkContract(actual, sample);
			// result matches with the sample, no need to match against others
			if (result) return false;
		});
		return result;
	}

	// event has exactly one expected result
	result = true;
	$.each(expected, function(i) {
		// actual data must have expected property otherwise it's a fail
		if (actual.hasOwnProperty(i)) {

			// sample is the type we should match with (easiest case)
			if ($.type(expected[i]) === "string") {
				result = $.type(actual[i]) === expected[i];

			// we have a function to compare values
			} else if ($.type(expected[i]) === "function") {
				result = expected[i](actual[i]);

			// we expect a complex object so let's compare recursively
			} else {
				result = checkContract(actual[i], expected[i]);
			}
		} else {
			result = false;
		}
		return result; // break if it doesn't meet our expectations
	});
	return result;
};

function prepareEventData(obj, level) {
	level = level || 0;
	if (($.type(obj) === "object" || $.type(obj) === "array")) {
		if (obj.tagName || obj.jquery) {
			obj = "[object DOM]";
		} else if (level <= 2) {
			$.each(obj, function(key) {
				obj[key] = prepareEventData(obj[key], level + 1);
			});
		} else {
			obj = $.type(obj) === "array" ? [] : {};
		}
	}
	return obj;
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

})(Echo.jQuery);
