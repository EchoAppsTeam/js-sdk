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
var subscribe = function(topic, context, stoppers) {
	var handler = getHandler(++order, stoppers);
	var id = Echo.Events.subscribe({
		"topic": topic,
		"handler": handler,
		"context": context
	});
	return {
		"id": id,
		"handler": handler
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
			}
		};
		QUnit.deepEqual(Echo.Events._subscriptions.A, subscriptions.A, "Checking full structure of subscribers");
		QUnit.deepEqual(Echo.Events._subscriptions.X, subscriptions.X, "Checking full structure of subscribers");
		QUnit.deepEqual(Echo.Events._subscriptions.Z, subscriptions.Z, "Checking full structure of subscribers");

		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [2, 1, 6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\")");
		publish({"topic": "X"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
		publish({"topic": "X", "context": "a2"});
		QUnit.deepEqual(published, [10, 8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");

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
			}
		};
		QUnit.deepEqual(Echo.Events._subscriptions.A, subscriptions2.A, "Checking full structure of subscribers after several unsubscriptions");
		QUnit.deepEqual(Echo.Events._subscriptions.X, subscriptions2.X, "Checking full structure of subscribers after several unsubscriptions");
		QUnit.deepEqual(Echo.Events._subscriptions.Z, subscriptions2.Z, "Checking full structure of subscribers after several unsubscriptions");

		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [6, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\")");
		publish({"topic": "X"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", global context)");
		publish({"topic": "X", "context": "a2"});
		QUnit.deepEqual(published, [8, 9], "Publish: handlers order (topic \"X\", context \"a2\")");
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

		publish({"topic": "A", "context": "a1/b2/c2", "bubble": true});
		QUnit.deepEqual(published, [5, 7, 2], "Publish: handlers order (topic \"A\", context \"a1/b2/c2\", bubble)");
		// We publish bubbling event in th context which doesn't have its own handlers
		publish({"topic": "A", "context": "a1/b1/c1/d1/e1", "bubble": true});
		QUnit.deepEqual(published, [12, 1, 13], "Publish: handlers order (topic \"A\", context \"a1/b1/c1/d1/e1\", bubble, propagation.siblings)");
		publish({"topic": "A", "context": "a1"});
		QUnit.deepEqual(published, [2, 13, 1, 12, 7, 5], "Publish: handlers order (topic \"A\", context \"a1\", propagation.siblings)");
		publish({"topic": "A", "context": "a2"});
		QUnit.deepEqual(published, [3], "Publish: handlers order (topic \"A\", context \"a2\", propagation.children)");
		publish({"topic": "A", "context": "a3"});
		QUnit.deepEqual(published, [9, 8], "Publish: handlers order (topic \"A\", context \"a3\", propagation)");

		publish({"topic": "W"});
		QUnit.deepEqual(published, [], "Publish: handlers order (nonexistent topic)");
		publish({"topic": "A", "context": "a4"});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent context)");
		publish({"topic": "A", "context": "a1/b3"});
		QUnit.deepEqual(published, [], "Publish: handlers order (topic \"A\", nonexistent deep context)");
	}
};

})(jQuery);
