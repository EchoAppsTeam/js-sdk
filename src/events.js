Echo.define("echo/events", [
	"jquery",
	"echo/utils"
], function($, Utils) {

"use strict";

/**
 * @class Echo.Events
 * Library for exchanging messages between the components on the page. It also
 * provides the external interface for users to subscribe to certain events
 * (like "app was rendered", "user logged in", etc).
 *
 * The contexts used in this library are complex identifiers constructed using the following rules:
 *     &lt;contextId> :: "&lt;id>" or "&lt;parentContextID>/&lt;id>", where
 *     &lt;id> :: some unique identifier assigned to component
 *     &lt;parentContextID> :: "&lt;contextID>"
 *
 * Example:
 *
 * 	// Subscribe to the event.
 * 	Events.subscribe({
 * 		"topic": "Echo.StreamServer.User.onInvalidate",
 * 		"context": "global",
 * 		"handler": app.refresh
 * 	});
 *
 * 	// And then publish event:
 * 	Events.publish({
 * 		"topic": "Echo.StreamServer.User.onInvalidate",
 * 		"data": user.is("logged") ? user.data : {}
 * 	});
 *
 * @package environment.pack.js
 */
var Events = {};

/**
 * @static
 * Function allowing to subscribe to an event with a specific callback function
 * and topic.
 *
 * @param {Object} params
 * Configuration parameters object with the following fields:
 *
 * @param {String} params.topic
 * Event name.
 *
 * @param {String} [params.context]
 * Unique identifier for inter-component communication.
 *
 * @param {Boolean} [params.once=false]
 * Specifies that provided handler should be executed exactly once (handler will
 * be unsubscribed right before its execution).
 *
 * @param {Function} params.handler
 * Callback function which will be called when event is published
 *
 * @param {String} params.handler.topic
 * Event name (same as params.topic).
 *
 * @param {Object} params.handler.data
 * Arbitrary data object passed to the {@link #publish} function.
 *
 * @return {String}
 * Unique identifier for the current subscription which can be used for unsubscribing.
 */
Events.subscribe = function(params) {
	var handlerId = Utils.getUniqueString();
	var context = _initContext(params.topic, params.context);
	if (params.once) {
		var handler = params.handler;
		params.handler = function() {
			Events.unsubscribe({"handlerId": handlerId});
			handler.apply(this, arguments);
		};
	}
	_executeForDeepestContext(params.topic, context, function(obj, lastContext) {
		obj[lastContext].handlers.push({
			"id": handlerId,
			"handler": params.handler
		});
	});
	_dataByHandlerId[handlerId] = {
		"context": context,
		"topic": params.topic
	};
	return handlerId;
};

/**
 * @static
 * Function allowing to unsubscribe from an event.
 *
 * @param {Object} params
 * Configuration parameters object with the following fields:
 *
 * @param {String} params.topic
 * Event name.
 *
 * @param {String} [params.context]
 * Unique identifier for inter-component communication.
 *
 * @param {String} params.handlerId
 * Unique identifier from the {@link #subscribe} function.
 *
 * @return {Boolean}
 * Unsubscription status.
 */
Events.unsubscribe = function(params) {
	var unsubscribed = false;
	if (params.handlerId) {
		if (_dataByHandlerId[params.handlerId]) {
			params.topic = _dataByHandlerId[params.handlerId].topic;
			params.context = _dataByHandlerId[params.handlerId].context;
		} else {
			// trying to unsubsribe from previously unsubscribed handler
			return false;
		}
	} else {
		params.context = _initContext(params.topic, params.context);
	}
	if (params.handlerId || params.topic) {
		var obj = _executeForDeepestContext(params.topic, params.context, function(obj, lastContext) {
			if (params.handlerId) {
				$.each(obj[lastContext].handlers, function(i, data) {
					if (data.id === params.handlerId) {
						obj[lastContext].handlers.splice(i, 1);
						delete _dataByHandlerId[data.id];
						unsubscribed = true;
						return false;
					}
				});
			} else {
				$.each(obj[lastContext].handlers, function(i, data) {
					delete _dataByHandlerId[data.id];
				});
				delete obj[lastContext];
				unsubscribed = true;
			}
		});
	} else {
		$.each(Events._subscriptions, function(topic, data) {
			_executeForDeepestContext(topic, params.context, function(obj, lastContext) {
				$.each(obj[lastContext].handlers, function(i, data) {
					delete _dataByHandlerId[data.id];
				});
				delete obj[lastContext];
				unsubscribed = true;
			});
		});
	}
	return unsubscribed;
};

/**
 * @static
 * Function allowing to publish an event providing arbitrary data.
 *
 * @param {Object} params
 * Configuration parameters object with the following fields:
 *
 * @param {String} params.topic
 *  Event name.
 *
 * @param {String} [params.context]
 * Unique identifier for inter-component communication.
 *
 * @param {Object} [params.data]
 * Some data object.
 *
 * @param {Boolean} [params.bubble=true]
 * Indicates whether a given event should be propagated into the parent contexts.
 *
 * @param {Boolean} [params.propagation=true]
 * Indicates whether a given event should be propagated into the child contexts
 * AND executed for the current context.
 *
 * @param {Boolean} [params.global=true]
 * Specifies whether the event should also be published to the "global" context or not.
 */
Events.publish = function(params) {
	params = $.extend({
		"bubble": true,
		"propagation": true,
		"global": true
	}, params);
	delete _lastHandlerResult[params.topic];
	params.context = _initContext(params.topic, params.context);
	_executeForDeepestContext(params.topic, params.context, function(obj, lastContext, restContexts) {
		_callHandlers(obj[lastContext], params, restContexts);
	});
	if (params.global && params.context !== "global") {
		params.context = "global";
		Events.publish(params);
	}
};

/**
 * @static
 * Generates a string which represents new unique context ID to be used for subscriptions.
 *
 * @param {String} [parentContextId]
 * Optional parameter which specifies the parent object context ID.
 * If this parameter is defined, the nested context ID is generated.
 *
 * @return {String}
 * Unique context identifier.
 */
Events.newContextId = function(parentContextId) {
	return (parentContextId ? parentContextId + "/" : "") + Utils.getUniqueString();
};

var _lastHandlerResult = {}, _dataByHandlerId = {};
Events._subscriptions = {};

var _initContext = function(topic, context) {
	context = context || "global";
	if (topic) {
		var obj = Events._subscriptions[topic] = Events._subscriptions[topic] || {};
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

var _executeForDeepestContext = function(topic, context, callback) {
	var parts = context.split("/");
	var lastContext = parts.pop();
	var obj = Events._subscriptions[topic];
	$.each(parts, function(i, part) {
		obj = obj[part].contexts;
	});
	if (obj[lastContext]) {
		callback(obj, lastContext, parts);
	}
};

var _shouldStopEvent = function(stopperType, topic) {
	var stoppers = _lastHandlerResult[topic] && _lastHandlerResult[topic].stop;
	if (!stoppers) {
		return false;
	}
	return stopperType === "bubble"
		? ~$.inArray("bubble", stoppers)
		: ~$.inArray("propagation", stoppers) || ~$.inArray(stopperType, stoppers);
};

var _callHandlers = function(obj, params, restContexts) {
	// use copy of handler list so that inner unsubscribe actions couldn't mess it up
	var _params, handlers = (obj.handlers || []).slice(0);
	$.each(handlers, function(i, data) {
		_lastHandlerResult[params.topic] = data.handler(params.topic, params.data);
		if (_shouldStopEvent("propagation.siblings", params.topic)) {
			return false;
		}
	});
	if (params.bubble && restContexts.length && !_shouldStopEvent("bubble", params.topic)) {
		// copy incoming parameters object so that we can manipulate it freely
		_params = $.extend({}, params);
		_params.context = restContexts.join("/");
		_params.global = false;
		_params.propagation = false;
		Events.publish(_params);
	}
	if (params.propagation && !_shouldStopEvent("propagation.children", params.topic)) {
		// copy incoming parameters object so that we can manipulate it freely
		_params = $.extend({}, params);
		_params.global = false;
		_params.bubble = false;
		$.each(obj.contexts, function(id, context) {
			_callHandlers(context, _params, []);
			if (_shouldStopEvent("propagation.siblings", _params.topic)) {
				return false;
			}
		});
	}
};

return Events;
});
