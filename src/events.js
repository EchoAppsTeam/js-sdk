(function() {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.Events")) return;

/**
 * Library for exchanging messages between components on the page. It also provides external interface for users to subscribe to a certain events (like "app was rendered", "user logged in", etc).
 *
 * Contexts used in this library are complex identifiers constructed using the following rules:
 *     <contextId> :: "<id>" or "<parentContextID>/<id>", where
 *     <id> :: some unique identifier assigned to component
 *     <parentContextID> :: "<contextID>"
 */
Echo.Events = {};

/**
 * Function allowing to subscribe to an event with a specific callback function and topic.
 *
 * @static
 * @param {Object} params Configuration parameters object with the following fields:
 * @param {String} params.topic Event name.
 * @param {String} params.context (optional) Unique identifier for inter-component communication.
 * @param {Function} params.handler Callback function which will be called when event is published
 * @param {String} params.handler.topic Event name (same as params.topic)
 * @param {Object} params.handler.data Arbitrary data object passed to the {@link #publish} function
 * @return {String} Unique identifier for the current subscription which can be used for unsubscribing.
 */
Echo.Events.subscribe = function(params) {
	var handlerId = Echo.Utils.getUniqueString();
	var context = Echo.Events._initContext(params.topic, params.context);
	Echo.Events._executeForDeepestContext(params.topic, context, function(obj, lastContext) {
		obj[lastContext].handlers.push({
			"id": handlerId,
			"handler": params.handler
		});
	});
	Echo.Events._dataByHandlerId[handlerId] = {
		"context": context,
		"topic": params.topic
	};
	return handlerId;
};

/**
 * Function allowing to unsubscribe from an event.
 *
 * @static
 * @param {Object} params Configuration parameters object with the following fields:
 * @param {String} params.topic Event name.
 * @param {String} params.context (optional) Unique identifier for inter-component communication.
 * @param {String} params.handlerId Unique identifier from the {@link #subscribe} function.
 * @return {Boolean} Unsubscription status.
 */
Echo.Events.unsubscribe = function(params) {
	var unsubscribed = false;
	if (params.handlerId && Echo.Events._dataByHandlerId[params.handlerId]) {
		params.topic = Echo.Events._dataByHandlerId[params.handlerId].topic;
		params.context = Echo.Events._dataByHandlerId[params.handlerId].context;
	} else {
		params.context = Echo.Events._initContext(params.topic, params.context);
	}
	if (params.handlerId || params.topic) {
		var obj = Echo.Events._executeForDeepestContext(params.topic, params.context, function(obj, lastContext) {
			if (params.handlerId) {
				$.each(obj[lastContext].handlers, function(i, data) {
					if (data.id === params.handlerId) {
						obj[lastContext].handlers.splice(i, 1);
						delete Echo.Events._dataByHandlerId[data.id];
						unsubscribed = true;
						return false;
					}
				});
			} else {
				$.each(obj[lastContext].handlers, function(i, data) {
					delete Echo.Events._dataByHandlerId[data.id];
				});
				delete obj[lastContext];
				unsubscribed = true;
			}
		});
	} else {
		$.each(Echo.Events._subscriptions, function(topic, data) {
			Echo.Events._executeForDeepestContext(topic, params.context, function(obj, lastContext) {
				$.each(obj[lastContext].handlers, function(i, data) {
					delete Echo.Events._dataByHandlerId[data.id];
				});
				delete obj[lastContext];
				unsubscribed = true;
			});
		});
	}
	return unsubscribed;
};

/**
 * Function allowing to publish an event providing arbitrary data.
 *
 * @static
 * @param {Object} params Configuration parameters object with the following fields:
 * @param {String} params.topic Event name.
 * @param {String} params.context (optional) Unique identifier for inter-component communication.
 * @param {String} params.data Arbitrary data object.
 */
Echo.Events.publish = function(params) {
	params.context = Echo.Events._initContext(params.topic, params.context);
	Echo.Events._executeForDeepestContext(params.topic, params.context, function(obj, lastContext, restContexts) {
		Echo.Events._callHandlers(obj[lastContext], params, restContexts);
	});
	if (!params.bubble && params.context !== "global") {
		params.context = "global";
		Echo.Events.publish(params);
	}
};

// private stuff

Echo.Events._subscriptions = {};

Echo.Events._dataByHandlerId = {};

Echo.Events._lastHandlerResult;

Echo.Events._initContext = function(topic, context) {
	context = context || "global";
	if (topic) {
		var obj = Echo.Events._subscriptions[topic] = Echo.Events._subscriptions[topic] || {};
		$.each(context.split("/"), function(i, part) {
			if (!obj[part]) {
				obj[part] = {
					"contexts": {},
					"handlers": []
				};
			}
			obj = obj[part].contexts;
		});
	}
	return context;
};

Echo.Events._executeForDeepestContext = function(topic, context, callback) {
	var parts = context.split("/");
	var lastContext = parts.pop();
	var obj = Echo.Events._subscriptions[topic];
	$.each(parts, function(i, part) {
		obj = obj[part].contexts;
	});
	if (obj[lastContext]) {
		callback(obj, lastContext, parts);
	}
};

Echo.Events._shouldStopEvent = function(stopperType) {
	var stoppers = Echo.Events._lastHandlerResult && Echo.Events._lastHandlerResult.stop;
	if (!stoppers) {
		return false;
	}
	return stopperType === "bubble"
		? ~$.inArray("bubble", stoppers)
		: ~$.inArray("propagation", stoppers) || ~$.inArray(stopperType, stoppers);
};

Echo.Events._callHandlers = function(obj, params, restContexts) {
	// use copy of handler list so that inner unsubscribe actions couldn't mess it up
	var handlers = (obj.handlers || []).slice(0);
	$.each(handlers, function(i, data) {
		Echo.Events._lastHandlerResult = data.handler(params.topic, params.data);
		if (Echo.Events._shouldStopEvent("propagation.siblings")) {
			return false;
		}
	});
	if (params.bubble && Echo.Events._shouldStopEvent("bubble")) {
		return;
	}
	if (params.bubble) {
		if (!restContexts.length) {
			return;
		}
		params.context = restContexts.join("/");
		Echo.Events.publish(params);
	} else if (!Echo.Events._shouldStopEvent("propagation.children")) {
		$.each(obj.contexts, function(id, context) {
			Echo.Events._callHandlers(context, params);
			if (Echo.Events._shouldStopEvent("propagation.siblings")) {
				return false;
			}
		});
	}
};

})();
