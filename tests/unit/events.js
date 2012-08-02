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

var suite = Echo.Tests.Unit.Events = function() {};

suite.prototype.info = {
	"className": "Echo.Events",
	"functions": ["subscribe", "unsubscribe", "publish"]
};

suite.prototype.tests = {};

suite.prototype.tests.PublicMethods = {
	"check": function() {
		order = 0;
		var s1 = subscribe("A", "a1/b1/c1");
		var s2 = subscribe("A", "a1");
		var s3 = subscribe("Z", "a2");
		var s4 = subscribe("A", "a2");
		var s5 = subscribe("A", "a1/b2/c2");
		var s6 = subscribe("A", "a1/b1/c1");
		var s7 = subscribe("A", "a1/b2");
		var s8 = subscribe("X");
		var s9 = subscribe("X");
		var s10 = subscribe("X", "a2");
		var s11 = subscribe("B", "b1", undefined, true);
		var subscriptions = {
			"A": {
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
			"Z": {
				"a2": {"contexts": {}, "handlers": [{"id": s3.id, "handler": s3.handler}]}
			},
			"X": {
				"global": {"contexts": {}, "handlers": [{"id": s8.id, "handler": s8.handler}, {"id": s9.id, "handler": s9.handler}]},
				"a2": {"contexts": {}, "handlers": [{"id": s10.id, "handler": s10.handler}]}
			},
			"B": {
				"b1": {"contexts": {}, "handlers": [{"id": s11.id, "handler": s11.handler}]}
			}
		};
		$.each(["B", "A", "X", "Z"], function(i, topic) {
			QUnit.deepEqual(Echo.Events._subscriptions[topic], subscriptions[topic], "Checking full structure of subscribers for topic \"" + topic + "\"");
		});

		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [2, 1, 6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\", with propagation)");
		publish({"topic": "A", "context": "a1", "propagation": false});
		QUnit.deepEqual(published, [2], "Publish: handlers order (topic \"A\", context \"a1\", no propagation)");
		publish({"topic": "X"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
		publish({"topic": "X", "context": "a2"});
		QUnit.deepEqual(published, [10, 8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");
		publish({"topic": "B", "context": "b1", "global": false});
		QUnit.deepEqual(published, [11], "Publish: handlers order (topic \"B\", context \"b1\", one-time subscription)");
		publish({"topic": "B", "context": "b1", "global": false});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"B\", context \"b1\" again)");

		QUnit.ok(unsubscribe("A", s1.id, "a1/b1/c1"), "Unsubscribe: event \"A\", handlerId: \"" + s1.id + "\", context \"a1/b1/c1\"");
		QUnit.ok(unsubscribe("A", s2.id), "Unsubscribe: event \"A\", handlerId: \"" + s2.id + "\", unknown context");
		QUnit.ok(unsubscribe(undefined, undefined, "a2"), "Unsubscribe: all events, all handlers, context \"a2\"");
		QUnit.ok(!unsubscribe("A", s1.id, "a1/b1/c1"), "Unsubscribe from previously unsubscribed handler: nothing to do");
		var subscriptions2 = {
			"A": {
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
				},
				"global": {
					"contexts": {},
					"handlers": []
				}
			},
			"Z": {},
			"X": {
				"global": {"contexts": {}, "handlers": [{"id": s8.id, "handler": s8.handler}, {"id": s9.id, "handler": s9.handler}]}
			},
			"B": {
				"b1": {"contexts": {}, "handlers": []}
			}
		};
		$.each(["A", "B", "X", "Z"], function(i, topic) {
			QUnit.deepEqual(Echo.Events._subscriptions[topic], subscriptions2[topic], "Checking full structure of subscribers for topic \"" + topic + "\" after several unsubscriptions");
		});

		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\")");
		publish({"topic": "X"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
		publish({"topic": "X", "context": "a2"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");
		publish({"topic": "X", "context": "a2", "global": false});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"X\", context \"a2\", not global event)");
	}
};

suite.prototype.tests.AdvancedPublishing = {
	"check": function() {
		order = 0;
		var s1 = subscribe("A", "a1/b1/c1", ["propagation.siblings"]);
		var s2 = subscribe("A", "a1", ["bubble"]);
		var s3 = subscribe("A", "a2", ["propagation.children"]);
		var s4 = subscribe("A", "a2/b1");
		var s5 = subscribe("A", "a1/b2/c2");
		var s6 = subscribe("A", "a1/b1/c1");
		var s7 = subscribe("A", "a1/b2");
		var s8 = subscribe("A", "a3/b1", ["propagation"]);
		var s9 = subscribe("A", "a3");
		var s10 = subscribe("A", "a3/b2");
		var s11 = subscribe("A", "a3/b2/c2");
		var s12 = subscribe("A", "a1/b1/c1/d1");
		var s13 = subscribe("A", "a1/b1", ["bubble"]);
		// We need to create context but shouldn't have any handlers for it so we unsubscribe right after subscription
		var s14 = subscribe("A", "a1/b1/c1/d1/e1");
		unsubscribe("A", s14.id, "a1/b1/c1/d1/e1");
		var s15 = subscribe("A", "a1/b2/c3");

		publish({"topic": "A", "context": "a1/b2/c2"});
		QUnit.deepEqual(published, [5, 7, 2], "Publish: handlers order (topic \"A\", context \"a1/b2/c2\", stop:bubble)");
		publish({"topic": "A", "context": "a1/b2/c2", "bubble": false});
		QUnit.deepEqual(published, [5], "Publish: handlers order (topic \"A\", context \"a1/b2/c2\", bubble:false)");
		// We publish bubbling event in the context which doesn't have its own handlers
		publish({"topic": "A", "context": "a1/b1/c1/d1/e1"});
		QUnit.deepEqual(published, [12, 1, 13], "Publish: handlers order (topic \"A\", context \"a1/b1/c1/d1/e1\", stop:bubble, stop:propagation.siblings)");
		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [2, 13, 1, 12, 7, 5, 15], "Publish: handlers order (topic \"A\", context \"a1\", stop:propagation.siblings)");
		publish({"topic": "A", "context": "a2"});
		QUnit.deepEqual(published, [3], "Publish: handlers order (topic \"A\", context \"a2\", stop:propagation.children)");
		publish({"topic": "A", "context": "a3"});
		QUnit.deepEqual(published, [9, 8], "Publish: handlers order (topic \"A\", context \"a3\", stop:propagation)");
		publish({"topic": "A", "context": "a1/b2"});
		QUnit.deepEqual(published, [7, 2, 5, 15], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:true, propagation:true)");
		publish({"topic": "A", "context": "a1/b2", "bubble": false});
		QUnit.deepEqual(published, [7, 5, 15], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:false, propagation:true)");
		publish({"topic": "A", "context": "a1/b2", "propagation": false});
		QUnit.deepEqual(published, [7, 2], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:true, propagation:false)");
		publish({"topic": "A", "context": "a1/b2", "bubble": false, "propagation": false});
		QUnit.deepEqual(published, [7], "Publish: handlers order (topic \"A\", context \"a1/b2\", bubble:false, propagation:false)");

		publish({"topic": "W"});
		QUnit.deepEqual(published, [], "Publish: handlers order (nonexistent topic)");
		publish({"topic": "A", "context": "a4"});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent context)");
		publish({"topic": "A", "context": "a1/b3"});
		QUnit.deepEqual(published, [2], "Publish: handlers order (topic \"A\", nonexistent deep context with bubble)");
		publish({"topic": "A", "context": "a1/b3", "bubble": false});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent deep context without bubble)");
	}
};

})(jQuery);
