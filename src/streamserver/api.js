(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.StreamServer && Echo.StreamServer.API) return;

if (!Echo.StreamServer) Echo.StreamServer = {};

Echo.StreamServer.API = {};

/**
 * @class Echo.StreamServer.API.Request
 * Class implements the interaction with the
 * <a href="http://wiki.aboutecho.com" target="_blank">Echo StreamServer API</a>
 *
 *     var request = Echo.StreamServer.API.request({
 *         "endpoint": "search",
 *         "data": {
 *             "q": "childrenof: http://example.com/js-sdk",
 *             "appkey": "echo.jssdk.demo.aboutecho.com"
 *         },
 *         "onData": function(data, extra) {
 *             // handle successful request here...
 *         },
 *         "onError": function(data, extra) {
 *             // handle failed request here...
 *         }
 *     });
 *
 *     request.send();
 *
 * @extends Echo.API.Request
 *
 * @package api.pack.js
 *
 * @constructor
 * Constructor initializing class using configuration data.
 *
 * @param {Object} config Configuration data.
 */
Echo.StreamServer.API.Request = Echo.Utils.inherit(Echo.API.Request, function(config) {
	var timeout = config && config.liveUpdates && config.liveUpdates.timeout;
	config = $.extend(true, {
		/**
		 * @cfg {Object} [liveUpdates]
		 * Live updating machinery configuration.
		 *
		 * @cfg {Boolean} [liveUpdates.enabled=false]
		 * Parameter to enable/disable live updates.
		 *
		 * @cfg {String} [liveUpdates.transport="polling"]
		 * Preferred live updates receiveing machinery transport.
		 * The following transports are supported:
		 *
		 * + "polling" - periodic requests to check for updates
		 * + "websockets" - transport based on the WebSocket technology
		 *
		 * If the end user's browser doesn't support the WebSockets technology,
		 * the "polling" transport will be used as a fallback.
		 *
		 * @cfg {Object} [liveUpdates.polling]
		 * Object which contains the configuration specific to the "polling"
		 * live updates transport.
		 *
		 * @cfg {Number} [liveUpdates.polling.timeout=10]
		 * Timeout between the live updates requests (in seconds).
		 *
		 * @cfg {Object} [liveUpdates.websockets]
		 * Object which contains the configuration specific to the "websockets"
		 * live updates transport.
		 *
		 * @cfg {Number} [liveUpdates.websockets.maxConnectRetries=3]
		 * Max connection retries for WebSocket transport. After the number of the
		 * failed connection attempts specified in this parameter is reached, the
		 * WebSocket transport is considered as non-supported: the client no longer
		 * tries to use the WebSockets on the page and the polling transport is used
		 * from now on.
		 *
		 * @cfg {Number} [liveUpdates.websockets.serverPingInterval=30]
		 * The timeout (in seconds) between the client-server ping-pong requests
		 * to keep the connection alive.
		 *
		 * @cfg {String} [endpoint] Specifies the API endpoint. The following endpoints are available:
		 *
		 *  + "submit"
		 *  + "search"
		 *  + "count"
		 *
		 */
		"liveUpdates": {
			"transport": "polling", // or "websockets"
			"enabled": false,
			"polling": {
				// picking up timeout value
				// for backwards compatibility
				"timeout": timeout || 10
			},
			"websockets": {
				"maxConnectRetries": 3,
				"serverPingInterval": 30
			}
		},

		/**
		 * @cfg {Boolean} [skipInitialRequest]
		 * Flag allowing to skip the initial request but continue performing
		 * live updates requests.
		 */
		"skipInitialRequest": false,

		/**
		 * @cfg {String} [itemURIPattern]
		 * Specifies the item id pattern.
		 */
		"itemURIPattern": undefined,

		/**
		 * @cfg {Function} [onData]
		 * Callback called after API request succeded.
		 */
		"onData": function() {},

		/**
		 * @cfg {Function} [onError]
		 * Callback called after API request failed.
		 */
		"onError": function() {},

		/**
		 * @cfg {Function} [onOpen]
		 * Callback called before sending an API request.
		 */
		"onOpen": function() {},

		/**
		 * @cfg {String} [submissionProxyURL]
		 * Specifes the URL to the submission proxy service.
		 */
		"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity"

	}, config);
	config = this._wrapTransportEventHandlers(config);
	this.requestType = "initial"; // initial | secondary
	Echo.StreamServer.API.Request.parent.constructor.call(this, config);
});

/**
 * @method
 * Method to stop live updates requests.
 */
Echo.StreamServer.API.Request.prototype.abort = function() {
	Echo.StreamServer.API.Request.parent.abort.call(this);
	if (this.liveUpdates) {
		this._stopLiveUpdates();
		delete this.liveUpdates;
	}
};

Echo.StreamServer.API.Request.prototype._count =
Echo.StreamServer.API.Request.prototype._search = function(force) {
	if (this.config.get("liveUpdates.enabled")) {
		if (!this.liveUpdates) {
			this._initLiveUpdates();
		}
		this._startLiveUpdates(force);
		return;
	}
	this.request();
};

// WebSockets machinery...

Echo.StreamServer.API.Request.prototype._wsAvailable = function() {
	return this.config.get("endpoint") === "search" &&
		this.config.get("liveUpdates.transport") === "websockets" &&
		Echo.API.Transports.WebSocket.available();
};

Echo.StreamServer.API.Request.prototype._wsEstablish = function() {
	var self = this;

	if (this.liveUpdates.socket) return;

	this.liveUpdates.socket = new Echo.API.Transports.WebSocket($.extend({
//		"uri": "live." + this.config.get("apiBaseURL") + "/ws",
		"uri": "live.echoenabled.com/v1/ws",
		"onOpen": function() {
			// subscribe to the events for the current search query
			var data = {"method": self.config.get("endpoint")};
			self.liveUpdates.socket.send({
				"event": "subscribe/request",
				"data": $.extend(data, self.config.get("data"))
			});
		},
		"onClose": function() {
			// switch to polling when WebSocket connection is closed
			if (self.liveUpdates.transport !== "polling") {
				self.liveUpdates.transport = "polling";
				self._startLiveUpdates();
			}
		},
		"onData": function(response) {
			if (!response || !response.event) return;
			switch (response.event) {
				case "subscribe/confirmed":
					self.liveUpdates.transport = "websockets";
					self._stopLiveUpdates("polling");
					break;
				case "update":
					self.config.get("onData")(response.data);
					break;
			}
		}
	}, this.config.get("liveUpdates.websockets")));
};

Echo.StreamServer.API.Request.prototype._wsEstablished = function() {
	var updates = this.liveUpdates;
	return updates && updates.transport === "websockets" &&
		updates.socket && updates.socket.connected();
};

Echo.StreamServer.API.Request.prototype._wrapTransportEventHandlers = function(config) {
	var self = this;
	var _config = $.extend({}, config);
	return $.extend({}, config, {
		"onOpen": function(response, requestParams) {
			_config.onOpen.call(self, response, {"requestType": self.requestType});
			clearInterval(self.retryTimer);
			delete self.retryTimer;
		},
		"onData": function(response, requestParams) {
			self._onData(response, {"requestType": self.requestType}, _config);
		},
		"onError": function(responseError, requestParams) {
			self._onError(responseError, requestParams, _config);
		}
	});
};

Echo.StreamServer.API.Request.prototype._onData = function(response, requestParams, config) {
	response = response || {};
	if (this.liveUpdates && this.liveUpdates.responseHandler && this.requestType === "secondary") {
		this.liveUpdates.responseHandler(response);
	}
	if (response.result === "error") {
		this._handleErrorResponse(response, {"callback": config.onError});
		return;
	}
	config.onData(response, requestParams);
	if (!this.error && this.requestType === "initial") {
		this.requestType = "secondary";
	}
	this._cleanupErrorHandlers(true);
	if (this.requestType === "initial") {
		this.abort();
		return;
	}
	this.nextSince = response.nextSince;
	this._startLiveUpdates();
};

Echo.StreamServer.API.Request.prototype._onError = function(responseError, requestParams, config) {
	this.constructor.parent._onError.apply(this, arguments);
	this._handleErrorResponse(responseError, {"callback": config.onError});
};

Echo.StreamServer.API.Request.prototype._submit = function() {
	var content = Echo.Utils.objectToJSON(this._AS2KVL(this.config.get("data.content")));
	this.request($.extend({}, this.config.get("data"), {"content": content}));
};

Echo.StreamServer.API.Request.prototype._prepareURI = function() {
	if (this.config.get("endpoint") === "submit") {
		// FIXME: move replace to API.Request lib
		return this.config.get("submissionProxyURL").replace(/^(http|ws)s?:\/\//, "");
	}
	return this.constructor.parent._prepareURI.call(this);
};

Echo.StreamServer.API.Request.prototype._getTransport = function() {
	return this.constructor.parent._getTransport.call(this);
};

Echo.StreamServer.API.Request.prototype._initLiveUpdates = function() {
	var self = this;
	this.liveUpdates = {
		"transport": "polling",
		"originalTimeout": this.config.get("liveUpdates.polling.timeout"),
		"timers": {},
		"timeouts": [],
		"responseHandler": function(data) {
			if (self._wsEstablished()) return;
			self._changeLiveUpdatesTimeout(data);
		}
	};
};

Echo.StreamServer.API.Request.prototype._changeLiveUpdatesTimeout = function(data) {
	var self = this;
	// backwards compatibility
	if (typeof data === "string") {
		data = {"liveUpdates.polling.timeout": data};
	}
	data.liveUpdatesTimeout = parseInt(data.liveUpdatesTimeout);
	var key = "liveUpdates.polling.timeout";
	var applyServerDefinedTimeout = function(timeout) {
		if (!timeout && self.liveUpdates.originalTimeout != self.config.get(key)) {
			self.config.set(key, self.liveUpdates.originalTimeout);
		} else if (timeout && timeout > self.config.get(key)) {
			self.config.set(key, timeout);
		}
	};
	var hasNewData = function(data) {
		// for "v1/search" endpoint at the moment
		return !!(data.entries && data.entries.length);
	};
	if (!this.nextSince) {
		applyServerDefinedTimeout(data.liveUpdatesTimeout);
		return;
	}
	var currentTimeout = this.config.get(key);
	var since = parseInt(this.nextSince);
	var currentTime = Math.floor((new Date()).getTime() / 1000);
	// calculate the delay before starting next request:
	//   - have new data but still behind and need to catch up - use minimum timeout
	//   - have new data but on the track - increase timeout by 1 second
	//   - have no new data - increase timeout by 2 seconds
	var timeout = hasNewData(data)
		? currentTime - since > currentTimeout
			? Math.min(3, this.liveUpdates.originalTimeout) // liveUpdatesTimeoutMin
			: currentTimeout + 1
		: currentTimeout + 2;
	if (timeout > this.liveUpdates.originalTimeout) {
		timeout = this.liveUpdates.originalTimeout;
	}
	this.config.set(key, timeout);
	// if timeout remains the same, take server side value into account
	if (timeout === this.liveUpdates.originalTimeout) {
		applyServerDefinedTimeout(data.liveUpdatesTimeout);
	}
};

Echo.StreamServer.API.Request.prototype._stopLiveUpdates = function(transport) {
	if ((!transport || transport === "polling") && this.liveUpdates.timers.regular) {
		clearTimeout(this.liveUpdates.timers.regular);
	}
	if ((!transport || transport === "websockets") && this._wsEstablished()) {
		this.liveUpdates.socket.send({"event": "unsubscribe/request"});
		this.liveUpdates.socket.abort();
	}
};

Echo.StreamServer.API.Request.prototype._startLiveUpdates = function(force) {
	var self = this;
	if (!this.liveUpdates || this._wsEstablished()) return;

	// trying to upgrade live update connection to WebSockets
	// if supported and requested in the request config
	if (this._wsAvailable() && !this._wsEstablished()) {
		this._wsEstablish();
	}

	this._stopLiveUpdates("polling");
	if (force) {
		// if live updates requests were forced after some operation, we will
		// perform 3 attempts to get live updates: immediately, in 1 second
		// and in 3 seconds after first one
		this.liveUpdates.timeouts = [0, 1, 3];
	}
	var timeout = this.liveUpdates.timeouts.length
		? this.liveUpdates.timeouts.shift()
		: this.config.get("liveUpdates.polling.timeout");
	if (this.requestType === "initial" && !this.config.get("skipInitialRequest")) {
		this.request();
		return;
	} else if (this.requestType === "initial") {
		this.config.get("onData")({}, {"requestType": this.requestType});
		this.requestType = "secondary";
	}
	this.liveUpdates.timers.regular = setTimeout(function() {
		self.request({"since": self.nextSince});
	}, timeout * 1000);
};

Echo.StreamServer.API.Request.prototype._isWaitingForData = function(data) {
	var errorCodes = [
		"busy",
		"waiting",
		"timeout",
		"view_limit",
		"view_update_capacity_exceeded",
		"connection_failure",
		"network_timeout"
	];
	return data
		&& this.config.get("endpoint") !== "submit"
		&& ~$.inArray(data.errorCode, errorCodes);
};

Echo.StreamServer.API.Request.prototype._handleErrorResponse = function(data, config) {
	var self = this;
	config = config || {};
	var errorCallback = config.callback;
	var calcWaitingTimeout = function() {
		// interval is calculated as x^2, x=[1..7]
		if (self.waitingTimeoutStep > 0) {
			if (self.waitingTimeoutStep < 7) {
				self.waitingTimeoutStep++;
			}
		} else {
			self.waitingTimeoutStep = 1;
		}
		return Math.pow(self.waitingTimeoutStep, 2) * 1000;
	};
	if (this._isWaitingForData(data)) {
		var timeout = calcWaitingTimeout();
		this.waitingTimer = setInterval(function() {
			self._cleanupErrorHandlers();
			if (!self.liveUpdates && self.requestType === "initial") {
				self._initLiveUpdates();
			}
			self._startLiveUpdates();
		}, timeout);
		errorCallback(data, {
			"requestType": self.requestType,
			"critical": false,
			"retryIn": timeout
		});
	} else {
		this.waitingTimeoutStep = 0;
		if (this.liveUpdates) {
			this._stopLiveUpdates();
		}
		errorCallback(data, {
			"requestType": self.requestType,
			"critical": data.errorCode !== "connection_aborted"
		});
	}
	this.error = data;
};

Echo.StreamServer.API.Request.prototype._cleanupErrorHandlers = function(successResponseReceived) {
	if (successResponseReceived) {
		this.waitingTimeoutStep = 0;
		delete this.error;
	}
	if (this.waitingTimer) {
		clearInterval(this.waitingTimer);
	}
};

Echo.StreamServer.API.Request.prototype._AS2KVL = function(entries) {
	var self = this;
	entries = $.isArray(entries) ? entries : [entries];
	var strip = function(value) {
		return value
			.replace("http://activitystrea.ms/schema/1.0/", "")
			.replace("http://js-kit.com/spec/e2/v1/", "");
	};
	var prepareActivity = function(activity, meta) {
		var data = {
			"avatar": activity.actor && activity.actor.avatar,
			"content": activity.object && activity.object.content,
			"markers": meta.markers ? $.trim(meta.markers) : undefined,
			"name": activity.actor && (activity.actor.name || activity.actor.title),
			"source": activity.source,
			"tags": meta.tags ? $.trim(meta.tags) : undefined,
			"title": activity.object && activity.object.title,
			"target": activity.targets[0].id,
			"verb": verb(activity),
			"type": type(activity),
			"itemURIPattern": self.config.get("itemURIPattern"),
			"author": activity.author
		};
		if (verb(activity) === "update") {
			data = {
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
			$.each(activity.object, function(key, value) {
				if (key !== "objectTypes") {
					data["field"] = key;
					data["value"] = value;
					return false;
				}
			});
		} else if (/tag/.test(verb(activity))) {
			data = {
				"tags": activity.object && activity.object.content,
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
		} else if (/mark/.test(verb(activity))) {
			data = {
				"markers": activity.object && activity.object.content,
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
		}
		return data;
	};
	var verb = function(entry) {
		return strip(entry.verbs[0]);
	};
	var type = function(entry) {
		return entry.object && entry.object.objectTypes
			? entry.object.objectTypes[0]
			: undefined;
	};
	var post, meta = {"markers": "", "tags": ""};
	$.map(entries, function(entry) {
		if (/tag|mark/.test(verb(entry)) && /tag|marker/.test(type(entry))) {
			meta[strip(type(entry)) + "s"] = entry.object.content;
		}
		if (verb(entry) === "post") {
			post = entry;
		}
	});
	if (post) {
		return prepareActivity(post, meta);
	}
	return $.map(entries, function(entry) {
		return prepareActivity(entry, meta);
	});
};

/**
 * @static
 * Alias for the class constructor.
 * @param {Object} Configuration data.
 * @return {Object} New class instance.
 */
Echo.StreamServer.API.request = function(config) {
	return (new Echo.StreamServer.API.Request(config));
};

})(Echo.jQuery);
