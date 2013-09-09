(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.API && Echo.API.Transport) return;

Echo.API = {"Transports": {}, "Request": {}};

var utils = Echo.Utils;

Echo.API.Transport = function(config) {
	this.config = new Echo.Configuration(config, {
		"data": {},
		"uri": "",
		"secure": false,
		"settings": {
			"crossDomain": true,
			"dataType": "json"
		},
		"onData": function() {},
		"onOpen": function() {},
		"onClose": function() {},
		"onError": function() {}
	});
	this.transportObject = this._getTransportObject();
};

Echo.API.Transport.prototype._wrapErrorResponse = function(responseError) {
	return {
		"result": "error",
		"errorCode": "connection_failure",
		"errorMessage": "",
		"transportError": responseError || ""
	};
};

Echo.API.Transport.prototype._prepareURL = function() {
	return this._getScheme() + "//" + this.config.get("uri");
};

/**
 * @ignore
 * @class Echo.API.Transports.WebSocket
 */
Echo.API.Transports.WebSocket = utils.inherit(Echo.API.Transport, function(config) {
	if (!config || !config.uri) {
		Echo.Utils.log({
			"type": "error",
			"component": "Echo.API.Transports.WebSocket",
			"message": "Unable to initialize WebSocket transport, config is invalid",
			"args": {"config": config}
		});
		return;
	}
	config = $.extend(true, {
		"settings": {
			"maxConnectRetries": 3,
			"serverPingInterval": 30, // client-server ping-pong interval
			"protocols": ["liveupdate.ws.echoenabled.com"]
		}
	}, config || {});
	this.timers = {};
	this.subscriptionIds = {};
	this.unique = Echo.Utils.getUniqueString();
	Echo.API.Transports.WebSocket.parent.constructor.call(this, config);
});

Echo.API.Transports.WebSocket.socketByURI = {};

Echo.API.Transports.WebSocket.prototype.connecting = function() {
	return this.transportObject && this.transportObject.readyState === 0;
};

Echo.API.Transports.WebSocket.prototype.connected = function() {
	return this.transportObject && this.transportObject.readyState === 1;
};

Echo.API.Transports.WebSocket.prototype.closing = function() {
	return this.transportObject && this.transportObject.readyState === 2;
};

Echo.API.Transports.WebSocket.prototype.closed = function() {
	return this.transportObject && this.transportObject.readyState === 3;
};

Echo.API.Transports.WebSocket.prototype.context = function(subscriptionId) {
	return this.config.get("uri").replace(/\//g, "-") + (subscriptionId ? "/" + subscriptionId : "");
};

Echo.API.Transports.WebSocket.prototype.abort = function(force) {
	var socket = Echo.API.Transports.WebSocket.socketByURI[this.config.get("uri")];
	this._clearEvents(["onClose"]);
	if (socket) {
		delete socket.subscribers[this.unique];
		// close socket connection if the last subscriber left
		if ($.isEmptyObject(socket.subscribers) || force) {
			delete Echo.API.Transports.WebSocket.socketByURI[this.config.get("uri")];
			if (!this.closed() || !this.closing()) {
				// clear all events in case of closing connection
				this._clearEvents();
				this.transportObject.close();
			}
		}
	}
	this._clearTimers();
};

Echo.API.Transports.WebSocket.prototype.send = function(event) {
	event.subscription = event.subscription || this.unique;
	return this.transportObject.send(Echo.Utils.objectToJSON(event));
};

Echo.API.Transports.WebSocket.prototype.keepConnection = function() {
	// establish periodical client-server ping-pong to keep connection alive
	var interval = this.config.get("settings.serverPingInterval") * 1000;
	this.timers.ping = setInterval($.proxy(this._ping, this), interval);
};

// private functions

Echo.API.Transports.WebSocket.prototype._getScheme = function() {
	return this.config.get("secure") ? "wss:" : "ws:";
};

Echo.API.Transports.WebSocket.prototype._clearEvents = function(exceptions) {
	var self = this;
	exceptions = exceptions || [];
	$.map(this.subscriptionIds, function(ids, name) {
		if (!~$.inArray(name, exceptions)) {
			$.map(ids, function(id) {
				Echo.Events.unsubscribe({"handlerId": id});
			});
			self.subscriptionIds[name] = [];
		}
	});
	if (!exceptions.length) {
		this.subscriptionIds = {};
	}
};

Echo.API.Transports.WebSocket.prototype._getTransportObject = function() {
	var self = this, uri = this.config.get("uri");
	var sockets = Echo.API.Transports.WebSocket.socketByURI;
	$.map(["onOpen", "onClose", "onError", "onData"], function(topic) {
		var id = Echo.Events.subscribe({
			"topic": "Echo.API.Transports.WebSocket." + topic,
			"handler": function(_, data) {
				self.config.get(topic)(data);
			},
			// when we receive data - send it to the appropriate
			// subscribers only (do not send it to all subscribers)
			"context": self.context(topic === "onData" ? self.unique : undefined)
		});
		self.subscriptionIds[topic] = self.subscriptionIds[topic] || [];
		self.subscriptionIds[topic].push(id);
	});

	if (!sockets[uri]) {
		sockets[uri] = {
			"socket": this._prepareTransportObject(),
			"subscribers": {}
		};
	}
	// register socket subscriber
	sockets[uri].subscribers[this.unique] = true;

	return sockets[uri].socket;
};

Echo.API.Transports.WebSocket.prototype._prepareTransportObject = function() {
	var self = this;

	// return in case we are connected or connection is in progress
	if (this.connecting() || this.connected()) return;

	this._clearTimers();

	var socket = new (window.WebSocket || window.MozWebSocket)(this._prepareURL(), this.config.get("settings.protocols"));
	socket.onopen = function() {
		// send ping immediately to make sure the server is responding
		self._ping(function() {
			self._publish("onOpen");
		});
		self.keepConnection();
	};
	socket.onmessage = function(event) {
		if (!event || !event.data) return;
		var data = $.parseJSON(event.data);
		self._publish("onData", data, data && data.subscription);
	};
	socket.onclose = function() {
		self._publish("onClose");
	};
	socket.onerror = function(error) {
		self._publish("onError", {"error": error});
	};
	return socket;
};

Echo.API.Transports.WebSocket.prototype._resetRetriesAttempts = function() {
	this.attemptsRemaining = this.config.get("settings.maxConnectRetries");
};

Echo.API.Transports.WebSocket.prototype._clearTimers = function() {
	this.timers.ping && clearInterval(this.timers.ping);
	this.timers.pong && clearTimeout(this.timers.pong);
	this.timers = {};
};

Echo.API.Transports.WebSocket.prototype._publish = function(topic, data, subscriptionId) {
	Echo.Events.publish({
		"topic": "Echo.API.Transports.WebSocket." + topic,
		"data": data || {},
		"propagation": !subscriptionId,
		"context": this.context(subscriptionId)
	});
};

Echo.API.Transports.WebSocket.prototype._ping = function(callback) {
	var self = this;
	var id = Echo.Events.subscribe({
		"topic": "Echo.API.Transports.WebSocket.onData",
		"handler": function(topic, data) {
			// we are expecting "pong" message only...
			if (!data || data.event !== "pong") return;

			clearTimeout(self.timers.pong);
			Echo.Events.unsubscribe({"handlerId": id});
			self._resetRetriesAttempts();

			callback && callback();
		},
		"context": this.context()
	});

	this.send({"event": "ping"});
	// waiting for the "pong" response half of the ping-pong interval
	this.timers.pong = setTimeout(function() {
		Echo.Events.unsubscribe({"handlerId": id});
		self._tryReconnect();
	}, this.config.get("settings.serverPingInterval") * 1000);
};

Echo.API.Transports.WebSocket.prototype._tryReconnect = function() {
	// if we were disconnected and try to connect again - decrease
	// the retries counter to indicate several fail connection attempts in a row
	this.attemptsRemaining--;

	// exit when the connection attempt is scheduled (to prevent
	// multiple connections) or if no connection attempts left
	if (this.attemptsRemaining === 0) {
		this._reconnect();
	}
};

Echo.API.Transports.WebSocket.prototype._reconnect = function() {
	this.abort(true);
	this.transportObject = this._getTransportObject();
};

Echo.API.Transports.WebSocket.available = function() {
	return !!(window.WebSocket || window.MozWebSocket);
};

/**
 * @ignore
 * @class Echo.API.Transports.AJAX
 */
Echo.API.Transports.AJAX = utils.inherit(Echo.API.Transport, function(config) {
	config = $.extend({
		"method": "get"
	}, config || {});
	return Echo.API.Transports.AJAX.parent.constructor.call(this, config);
});

Echo.API.Transports.AJAX.prototype._getScheme = function() {
	return this.config.get("secure") ? "https:" : "http:";
};

Echo.API.Transports.AJAX.prototype._getTransportObject = function() {
	var self = this;
	return $.extend(true, {
		"url": this._prepareURL(),
		"type": this.config.get("method"),
		"error": function(errorResponse, requestParams) {
			errorResponse = self._wrapErrorResponse(errorResponse);
			if (errorResponse.transportError && errorResponse.transportError.statusText === "abort") {
				errorResponse.errorCode = "connection_aborted";
			}
			self.config.get("onError")(errorResponse, requestParams);
		},
		"success": this.config.get("onData"),
		"beforeSend": this.config.get("onOpen")
	}, this.config.get("settings"));
};

Echo.API.Transports.AJAX.prototype._wrapErrorResponse = function(responseError) {
	var originalWrapped = Echo.API.Transports.AJAX.parent._wrapErrorResponse.apply(this, arguments);
	if (responseError && responseError.responseText) {
		var errorObject;
		try {
			errorObject = $.parseJSON(responseError.responseText);
		} catch(e) {}
		return errorObject || originalWrapped;
	}
	return originalWrapped;
};

Echo.API.Transports.AJAX.prototype.send = function(data) {
	var configData = this.config.get("data");
	data = typeof data === "string"
		? data
		: typeof configData === "string"
			? configData
			: $.extend({}, configData, data || {});
	if (typeof this.transportObject.status === "undefined") {
		this.transportObject.data = data;
		this.transportObject = $.ajax(this.transportObject);
	} else {
		$.ajax(
			$.extend(this._getTransportObject(), {
				"data": data
			})
		);
	}
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	// check that transport object initialized by $.ajax function
	// instead of initializing by constructor
	if (this.transportObject && this.transportObject.abort) {
		this.transportObject.abort();
	}
	this.config.get("onClose")();
};

Echo.API.Transports.AJAX.available = function() {
	return $.support.cors;
};

/**
 * @ignore
 * @class Echo.API.Transports.XDomainRequest
 */
Echo.API.Transports.XDomainRequest = utils.inherit(Echo.API.Transports.AJAX, function() {
	return Echo.API.Transports.XDomainRequest.parent.constructor.apply(this, arguments);
});

Echo.API.Transports.XDomainRequest.prototype._getTransportObject = function() {
	var obj = Echo.API.Transports.XDomainRequest.parent._getTransportObject.call(this);
	var domain = utils.parseURL(document.location.href).domain;
	var targetDomain = utils.parseURL(this.config.get("uri")).domain;
	if (domain === targetDomain) {
		return obj;
	}
	// jQuery.XDomainRequest.js
	// Author: Jason Moon - @JSONMOON
	// IE8+
	// link: https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
	if (!jQuery.support.cors && window.XDomainRequest) {
		var jsonRegEx = /\/json/i;
		var xmlRegEx = /\/xml/i;

		// ajaxTransport exists in jQuery 1.5+
		jQuery.ajaxTransport("text html xml json", function(options, userOptions, jqXHR) {
			var xdr = null;
			var userType = (userOptions.dataType || "").toLowerCase();
			return {
				"send": function(headers, complete) {
					xdr = new XDomainRequest();
					if (/^\d+$/.test(userOptions.timeout)) {
						xdr.timeout = userOptions.timeout;
					}
					xdr.ontimeout = function() {
						complete(500, "timeout");
					};
					xdr.onload = function() {
						var allResponseHeaders = "Content-Length: " + xdr.responseText.length + "\r\nContent-Type: " + xdr.contentType;
						var status = {
							"code": 200,
							"message": "success"
						};
						var responses = {
							"text": xdr.responseText
						};
						try {
							if ((userType === "json") || ((userType !== "text") && jsonRegEx.test(xdr.contentType))) {
								try {
									responses.json = $.parseJSON(xdr.responseText);
								} catch(e) {
									status.code = 500;
									status.message = "parseerror";
								}
							} else if ((userType === "xml") || ((userType !== "text") && xmlRegEx.test(xdr.contentType))) {
								var doc = new ActiveXObject("Microsoft.XMLDOM");
								doc.async = false;
								try {
									doc.loadXML(xdr.responseText);
								} catch(e) {
									doc = undefined;
								}
								if (!doc || !doc.documentElement || doc.getElementsByTagName("parsererror").length) {
									status.code = 500;
									status.message = "parseerror";
									throw "Invalid XML: " + xdr.responseText;
								}
								responses.xml = doc;
							}
						} catch(parseMessage) {
							throw parseMessage;
						} finally {
							complete(status.code, status.message, responses, allResponseHeaders);
						}
					};
					xdr.onerror = function() {
						complete(500, "error", {
							"text": xdr.responseText
						});
					};
					var postData = typeof userOptions.data === "string"
						? userOptions.data
						: $.param(userOptions.data || "");
					xdr.open(options.type, options.url);
					xdr.send(postData);
				},
				"abort": function() {
					if (xdr) {
						xdr.abort();
					}
				}
			};
		});
	}
	// avoid caching the respond result
	return $.extend(obj, {
		"cache": false
	});
};

Echo.API.Transports.XDomainRequest.available = function(config) {
	config = config || {"method": "", "secure": false};
	var scheme = config.secure ? "https:" : "http:";
	// XDomainRequests must be: GET or POST methods, HTTP or HTTPS protocol,
	// and same scheme as calling page
	var transportSpecAvailability = /^get|post$/i.test(config.method)
		&& /^https?/.test(scheme)
		&& document.location.protocol === scheme;
	return "XDomainRequest" in window
		&& transportSpecAvailability;
};

/**
 * @ignore
 * @class Echo.API.Transports.JSONP
 */
Echo.API.Transports.JSONP = utils.inherit(Echo.API.Transports.AJAX, function(config) {
	return Echo.API.Transports.JSONP.parent.constructor.apply(this, arguments);
});

Echo.API.Transports.JSONP.prototype.send = function(data) {
	if (this.config.get("method").toLowerCase() === "get") {
		return Echo.API.Transports.JSONP.parent.send.apply(this, arguments);
	}
	this._pushPostParameters($.extend({}, this.config.get("data"), data));
	this.transportObject.submit();
	this.config.get("onData")();
};

Echo.API.Transports.JSONP.prototype.abort = function() {
	if (this.transportObject.form && this.transportObject.iframe) {
		this.transportObject.form.remove();
		this.transportObject.iframe.remove();
		return;
	}
	return Echo.API.Transports.JSONP.parent.abort.call(this);
};

Echo.API.Transports.JSONP.prototype._getTransportObject = function() {
	var settings = Echo.API.Transports.JSONP.parent._getTransportObject.call(this);
	if (this.config.get("method").toLowerCase() === "post") {
		return this._getPostTransportObject({
			"url": settings.url
		});
	}
	delete settings.xhr;
	settings.dataType = "jsonp";
	return settings;
};

Echo.API.Transports.JSONP.prototype._getPostTransportObject = function(settings) {
	var id = "echo-post-" + Math.random();
	var container =
		$("#echo-post-request").length
			? $("#echo-post-request").empty()
			: $('<div id="echo-post-request"/>').css({"height": 0}).prependTo("body");
	// it won't work if the attributes are specified as a hash in the second parameter
	this.iframe = this.iframe || $('<iframe id="' + id + '" name="' + id + '" width="0" height="0" frameborder="0" border="0"></iframe>').appendTo(container);
	var form = $("<form/>", {
		"target" : id,
		"method" : "POST",
		"enctype" : "application/x-www-form-urlencoded",
		"acceptCharset" : "UTF-8",
		"action" : settings.url
	}).appendTo(container);
	this._pushPostParameters(settings.data);
	return {
		"form": form,
		"iframe": this.iframe
	};
};

Echo.API.Transports.JSONP.prototype._pushPostParameters = function(data) {
	var self = this;
	$.each(data || {}, function(key, value) {
		$("<input/>", {
			"type" : "hidden",
			"name" : key,
			"value" : value
		}).appendTo(self.transportObject);
	});
	return self.transportObject;
};

Echo.API.Transports.JSONP.available = function() {
	return true;
};

/**
 * @class Echo.API.Request
 * Class implementing API requests logic on the transport layer.
 *
 * @package api.pack.js
 * @package environment.pack.js
 */
/*
 * @constructor
 * @param {Object} config
 * Configuration data.
 */
Echo.API.Request = function(config) {
	/**
	 * @cfg {String} endpoint
	 * Specifes the API endpoint.
	 */
	if (!config || !config.endpoint) {
		Echo.Utils.log({
			"type": "error",
			"component": "Echo.API",
			"message": "Unable to initialize API request, config is invalid",
			"args": {"config": config}
		});
		return {};
	}
	this.config = new Echo.Configuration(config, {
		/**
		 * @cfg {Function} [onData]
		 * Callback called after API request succeded.
		 */
		/**
		 * @cfg {Function} [onError]
		 * Callback called after API request failed.
		 */
		/**
		 * @cfg {Function} [onOpen]
		 * Callback called before sending an API request.
		 */
		/**
		 * @cfg {Function} [onClose]
		 * Callback called after API request aborting.
		 */
		/**
		 * @cfg {String} [apiBaseUrl]
		 * Specifies the base URL for API requests
		 */
		"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",
		/**
		 * @cfg {Object|String} [data]
		 * Data to be sent to the server. It is converted to a query string,
		 * if not already a string. Object must be key/value pairs.
		 */
		"data": {},
		/**
		 * @cfg {Object} [settings]
		 * A set of the key/value pairs to configure the transport object.
		 * This configuration is passed to the transport object through the
		 * jQuery's ajaxSettings field.
		 * For more info see http://api.jquery.com/jQuery.ajax/.
		 * Note: according to the link above, for some transports these settings
		 * have no effect.
		 */
		/**
		 * @cfg {String} [transport]
		 * Specifies the transport name. The following transports are available:
		 *
		 *  + "websocket"
		 *  + "ajax"
		 *  + "jsonp"
		 *  + "XDomainRequest" (only supported in IE8+)
		 *
		 */
		"transport": "ajax",
		/**
		 * @cfg {String} [method]
		 * Specifies the request method. The following methods are available:
		 *
		 *  + "GET"
		 *  + "POST"
		 *
		 */
		"method": "GET",
		/**
		 * @cfg {Boolean} [secure]
		 * There is a flag which indicates what protocol will be used in, secure or not.
		 * If this parameter is not set, internally the lib will decide on the URL scheme.
		 */
		"secure": false,
		/**
		 * @cfg {Number} [timeout]
		 * Specifies the number of seconds after which the onError callback
		 * is called if the API request failed.
		 */
		"timeout": 30
	});
	this.transport = this._getTransport();
};

Echo.API.Request.prototype._isSecureRequest = function() {
	var parts, secure = this.config.get("secure");
	var re = /https|wss/;
	if (secure) return secure;
	parts = utils.parseURL(this.config.get("apiBaseURL"));
	return re.test(window.location.protocol) || re.test(parts.scheme);
};

/**
 * Method performing the API request using the given parameters.
 *
 * @param {Object} [args] Request parameters.
 * @param {Boolean} [args.force] Flag to initiate aggressive polling.
 */
Echo.API.Request.prototype.send = function(args) {
	var force = false;
	if (args) {
		force = args.force;
		delete args.force;
		this.config.extend(args);
		this.transport.config.extend(args);
	}
	var method = this["_" + this.config.get("endpoint")];
	method && method.call(this, force);
};

//TODO: probably we should replace request with _request or simply not documenting it
Echo.API.Request.prototype.request = function(params) {
	var self = this;
	var timeout = this.config.get("timeout");
	if (this.transport) {
		this.transport.send(params);
		if (timeout && this.config.get("onError")) {
			this._timeoutId = setTimeout(function() {
				self.config.get("onError")({
					"result": "error",
					"errorCode": "network_timeout"
				}, {
					"critical": true
				});
				self.transport.abort();
			}, timeout * 1000);
		}
	}
};

Echo.API.Request.prototype.abort = function() {
	this.transport && this.transport.abort();
};

Echo.API.Request.prototype._getTransport = function() {
	var self = this;
	var userDefinedTransport = utils.foldl("", Echo.API.Transports, function(constructor, acc, name) {
		if (self.config.get("transport").toLowerCase() === name.toLowerCase()) {
			return name;
		}
	});
	var transport = Echo.API.Transports[userDefinedTransport] && Echo.API.Transports[userDefinedTransport].available()
		? userDefinedTransport
		: function() {
			var transport;
			$.each(["WebSocket", "AJAX", "XDomainRequest", "JSONP"], function(i, name) {
				var available = Echo.API.Transports[name].available({
					"secure": self.config.get("secure"),
					"method": self.config.get("method")
				});
				if (available) {
					transport = name;
					return false;
				}
			});
			return transport;
		}();
	return new Echo.API.Transports[transport](
		$.extend(this._getHandlersByConfig(), {
			"uri": this._prepareURI(),
			"data": this.config.get("data"),
			"method": this.config.get("method"),
			"secure": this._isSecureRequest(),
			"settings": this.config.get("settings")
		})
	);
};

Echo.API.Request.prototype._getHandlersByConfig = function() {
	var self = this;
	return utils.foldl({}, this.config.getAsHash(), function(value, acc, key) {
		var handler;
		if (/^on[A-Z]/.test(key) && $.isFunction(value)) {
			handler = key !== "onOpen"
				? function() { clearTimeout(self._timeoutId); value.apply(null, arguments); }
				: value;
			acc[key] = handler;
		}
	});
};

Echo.API.Request.prototype._prepareURI = function() {
	return this.config.get("apiBaseURL").replace(/^(?:(?:http|ws)s?:)?\/\//, "") + this.config.get("endpoint");
};

})(Echo.jQuery);
