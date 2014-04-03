(function($) {

var published = [];
var order;
var getHandler = function(n, stoppers) {
	return function() {
		published.push(n);
		if (stoppers) {
			return {"stop": stoppers};
		}
	};
};
var subscribe = function(topic, context, stoppers, once) {
	var handler = getHandler(++order, stoppers);
	var params = {
		"topic": topic,
		"handler": handler,
		"context": context,
		"once": once
	};
	var id = Echo.Events.subscribe(params);
	return {
		"id": id,
		"handler": params.handler
	};
};
var unsubscribe = function(topic, handlerId, context) {
	return Echo.Events.unsubscribe({
		"topic": topic,
		"handlerId": handlerId,
		"context": context
	});
};
var publish = function(params) {
	published = [];
	Echo.Events.publish(params);
};

Echo.Tests.module("Echo.Events", {
	"meta": {
		"className": "Echo.Events",
		"functions": [
			"subscribe",
			"unsubscribe",
			"publish",
			"newContextId"
		]
	}
});

Echo.Tests.test("public methods", function() {
	order = 0;
	var s1 = subscribe("A.test", "a1/b1/c1");
	var s2 = subscribe("A.test", "a1");
	var s3 = subscribe("Z.test", "a2");
	var s4 = subscribe("A.test", "a2");
	var s5 = subscribe("A.test", "a1/b2/c2");
	var s6 = subscribe("A.test", "a1/b1/c1");
	var s7 = subscribe("A.test", "a1/b2");
	var s8 = subscribe("X.test");
	var s9 = subscribe("X.test");
	var s10 = subscribe("X.test", "a2");
	var s11 = subscribe("B.test", "b1", undefined, true);
	var subscriptions = {
		"A.test": {
			"a1": {
				"contexts": {
					"b1": {
						"contexts": {
							"c1": {"contexts": {}, "handlers": [{"id": s1.id, "handler": s1.handler}, {"id": s6.id, "handler": s6.handler}]}
						},
						"handlers": []
					},
					"b2": {
						"contexts": {
							"c2": {"contexts": {}, "handlers": [{"id": s5.id, "handler": s5.handler}]}
						},
						"handlers": [{"id": s7.id, "handler": s7.handler}]
					}
				},
				"handlers": [{"id": s2.id, "handler": s2.handler}]
			},
			"a2": {"contexts": {}, "handlers": [{"id": s4.id, "handler": s4.handler}]}
		},
		"Z.test": {
			"a2": {"contexts": {}, "handlers": [{"id": s3.id, "handler": s3.handler}]}
		},
		"X.test": {
			"global": {"contexts": {}, "handlers": [{"id": s8.id, "handler": s8.handler}, {"id": s9.id, "handler": s9.handler}]},
			"a2": {"contexts": {}, "handlers": [{"id": s10.id, "handler": s10.handler}]}
		},
		"B.test": {
			"b1": {"contexts": {}, "handlers": [{"id": s11.id, "handler": s11.handler}]}
		}
	};
	$.each(["B.test", "A.test", "X.test", "Z.test"], function(i, topic) {
		QUnit.deepEqual(Echo.Events._subscriptions[topic], subscriptions[topic], "Checking full structure of subscribers for topic \"" + topic + "\"");
	});

	publish({"topic": "A.test", "context": "a1"});
	QUnit.deepEqual(published, [2, 1, 6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\", with propagation)");
	publish({"topic": "A.test", "context": "a1", "propagation": false});
	QUnit.deepEqual(published, [2], "Publish: handlers order (topic \"A\", context \"a1\", no propagation)");
	publish({"topic": "X.test"});
	QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
	publish({"topic": "X.test", "context": "a2"});
	QUnit.deepEqual(published, [10, 8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");
	$.each(["A.test", "X.test", "Z.test"], function(i, topic) {
		QUnit.deepEqual(Echo.Events._subscriptions[topic], subscriptions[topic], "Checking that subscriptions for topic \"" + topic + "\" aren't changed after publish");
	});

	publish({"topic": "B.test", "context": "b1", "global": false});
	QUnit.deepEqual(published, [11], "Publish: handlers order (topic \"B\", context \"b1\", one-time subscription)");
	publish({"topic": "B.test", "context": "b1", "global": false});
	QUnit.deepEqual(published, [], "Publish: handlers order (topic \"B\", context \"b1\" again)");
	QUnit.deepEqual(Echo.Events._subscriptions["B.test"], {}, "Checking that there are no subscriptions for topic \"B.test\"");

	QUnit.ok(unsubscribe("A.test", s1.id, "a1/b1/c1"), "Unsubscribe: event \"A\", handlerId: \"" + s1.id + "\", context \"a1/b1/c1\"");
	QUnit.ok(unsubscribe("A.test", s2.id), "Unsubscribe: event \"A\", handlerId: \"" + s2.id + "\", unknown context");
	QUnit.ok(unsubscribe(undefined, undefined, "a2"), "Unsubscribe: all events, all handlers, context \"a2\"");
	QUnit.ok(!unsubscribe("A.test", s1.id, "a1/b1/c1"), "Unsubscribe from previously unsubscribed handler using all available data: nothing to do");
	QUnit.ok(!unsubscribe(undefined, s1.id), "Unsubscribe from previously unsubscribed handler using only handlerId: nothing to do");
	QUnit.ok(unsubscribe("A.test", undefined, "a1/b1/x1"), "Unsubscribe from undefined context with undefined handlerId");
	var subscriptions2 = {
		"A.test": {
			"a1": {
				"contexts": {
					"b1": {
						"contexts": {
							"c1": {"contexts": {}, "handlers": [{"id": s6.id, "handler": s6.handler}]}
						},
						"handlers": []
					},
					"b2": {
						"contexts": {
							"c2": {"contexts": {}, "handlers": [{"id": s5.id, "handler": s5.handler}]}
						},
						"handlers": [{"id": s7.id, "handler": s7.handler}]
					}
				},
				"handlers": []
			}
		},
		"Z.test": {},
		"X.test": {
			"global": {"contexts": {}, "handlers": [{"id": s8.id, "handler": s8.handler}, {"id": s9.id, "handler": s9.handler}]}
		},
		"B.test": {}
	};
	$.each(["A.test", "B.test", "X.test", "Z.test"], function(i, topic) {
		QUnit.deepEqual(Echo.Events._subscriptions[topic], subscriptions2[topic], "Checking full structure of subscribers for topic \"" + topic + "\" after several unsubscriptions");
	});

	var x = subscribe("Z.test", "x1/x2/x3");
	unsubscribe("Z.test", x.id, "x1/x2/x3");
	QUnit.deepEqual(Echo.Events._subscriptions["Z.test"], {}, "Checking that all parent contexts are cleared in case they are empty");

	publish({"topic": "A.test", "context": "a1"});
	QUnit.deepEqual(published, [6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\")");
	publish({"topic": "X.test"});
	QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
	publish({"topic": "X.test", "context": "a2"});
	QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");
	publish({"topic": "X.test", "context": "a2", "global": false});
	QUnit.deepEqual(published, [], "Publish: handlers order (topic \"X\", context \"a2\", not global event)");

	// checking Echo.Events.newContextId...
	var contextId = Echo.Events.newContextId();
	QUnit.equal(typeof contextId, "string",
		"Making sure that the context ID has string typed value");

	var nestedContextId = Echo.Events.newContextId(contextId);
	QUnit.equal(typeof nestedContextId, "string",
		"Checking whether the nested context ID has a string typed value as well");

	QUnit.ok(nestedContextId.indexOf(contextId) > -1,
		"Checking if the main context is a part of the nested context ID");

	var ctxs = [], ctxById = {}, hasDuplicates = false;
	for (var i = 0; i < 10000; i++) {
		var ctx = Echo.Events.newContextId();
		if (ctx in ctxById) {
			hasDuplicates = true;
			break;
		}
		ctxs.push(ctx);
		ctxById[ctx] = true;
	}
	QUnit.ok(!hasDuplicates, "Checking if the 'newContextId' function always produces random values");
});

Echo.Tests.test("advanced publishing", function() {
	order = 0;
	var s1 = subscribe("A.test", "a1/b1/c1", ["propagation.siblings"]);
	var s2 = subscribe("A.test", "a1", ["bubble"]);
	var s3 = subscribe("A.test", "a2", ["propagation.children"]);
	var s4 = subscribe("A.test", "a2/b1");
	var s5 = subscribe("A.test", "a1/b2/c2");
	var s6 = subscribe("A.test", "a1/b1/c1");
	var s7 = subscribe("A.test", "a1/b2");
	var s8 = subscribe("A.test", "a3/b1", ["propagation"]);
	var s9 = subscribe("A.test", "a3");
	var s10 = subscribe("A.test", "a3/b2");
	var s11 = subscribe("A.test", "a3/b2/c2");
	var s12 = subscribe("A.test", "a1/b1/c1/d1");
	var s13 = subscribe("A.test", "a1/b1", ["bubble"]);
	// We need to create context but shouldn't have any handlers for it so we unsubscribe right after subscription
	var s14 = subscribe("A.test", "a1/b1/c1/d1/e1");
	unsubscribe("A.test", s14.id, "a1/b1/c1/d1/e1");
	var s15 = subscribe("A.test", "a1/b2/c3");
	var s16 = subscribe("A.test", "x");

	publish({"topic": "A.test", "context": "a1/b2/c2"});
	QUnit.deepEqual(published, [5, 7, 2], "Publish: handlers order (topic \"A\", context \"a1/b2/c2\", stop:bubble)");
	publish({"topic": "A.test", "context": "a1/b2/c2", "bubble": false});
	QUnit.deepEqual(published, [5], "Publish: handlers order (topic \"A\", context \"a1/b2/c2\", bubble:false)");
	// We publish bubbling event in the context which doesn't have its own handlers
	publish({"topic": "A.test", "context": "a1/b1/c1/d1/e1"});
	QUnit.deepEqual(published, [12, 1, 13], "Publish: handlers order (topic \"A\", context \"a1/b1/c1/d1/e1\", stop:bubble, stop:propagation.siblings)");
	publish({"topic": "A.test", "context": "a1"});
	QUnit.deepEqual(published, [2, 13, 1, 12, 7, 5, 15], "Publish: handlers order (topic \"A\", context \"a1\", stop:propagation.siblings)");
	publish({"topic": "A.test", "context": "a2"});
	QUnit.deepEqual(published, [3], "Publish: handlers order (topic \"A\", context \"a2\", stop:propagation.children)");
	publish({"topic": "A.test", "context": "a3"});
	QUnit.deepEqual(published, [9, 8], "Publish: handlers order (topic \"A\", context \"a3\", stop:propagation)");
	publish({"topic": "A.test", "context": "a1/b2"});
	QUnit.deepEqual(published, [7, 2, 5, 15], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:true, propagation:true)");
	publish({"topic": "A.test", "context": "a1/b2", "bubble": false});
	QUnit.deepEqual(published, [7, 5, 15], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:false, propagation:true)");
	publish({"topic": "A.test", "context": "a1/b2", "propagation": false});
	QUnit.deepEqual(published, [7, 2], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:true, propagation:false)");
	publish({"topic": "A.test", "context": "a1/b2", "bubble": false, "propagation": false});
	QUnit.deepEqual(published, [7], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:false, propagation:false)");
	publish({"topic": "A.test", "context": "x/a/x", "bubble": false});
	QUnit.deepEqual(published, [], "Publish same context name as a parents one should not execute a parents handler (x - subscribed, x/a/x - published)");
	publish({"topic": "A.test", "context": "x/x/x", "bubble": false});
	QUnit.deepEqual(published, [], "Publish same context name as a parents one should not execute a parents handler (x - subscribed, x/x/x - published)");

	publish({"topic": "W.test"});
	QUnit.deepEqual(published, [], "Publish: handlers order (nonexistent topic)");
	publish({"topic": "A.test", "context": "a4"});
	QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent context)");
	publish({"topic": "A.test", "context": "a1/b3"});
	QUnit.deepEqual(published, [2], "Publish: handlers order (topic \"A\", nonexistent deep context with bubble)");
	publish({"topic": "A.test", "context": "a1/b3", "bubble": false});
	QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent deep context without bubble)");
});

})(Echo.jQuery);
