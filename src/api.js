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

//
// WebSocket transport definition
//
Echo.API.Transports.WebSocket = function(config) {
	if (!config || !config.uri) {
		Echo.Utils.log({
			"type": "error",
			"component": "Echo.API.Transports.WebSocket",
			"message": "Unable to initialize WebSocket transport, config is invalid",
			"args": {"config": config}
		});
		return;
	}
	this.unique = Echo.Utils.getUniqueString();
	this.subscriptionIds = [];
	this.config = new Echo.Configuration(config, {
		"data": {},
		"uri": "",
		"secure": false,
		"onData": function() {},
		"onOpen": function() {},
		"onClose": function() {},
		"onError": function() {},
		"maxConnectRetries": 3,
		"serverPingInterval": 30 // client-server ping-pong interval
	});
	this._init();
};

Echo.API.Transports.WebSocket.available = function() {
	return Echo.API.Transports.WebSocket.Socket.available();
};

Echo.API.Transports.WebSocket.prototype.getSocket = function() {
	return Echo.API.Transports.WebSocket.socketByURI[this.config.get("uri")];
};

Echo.API.Transports.WebSocket.prototype._init = function() {
	var self = this, uri = this.config.get("uri");
	var sockets = Echo.API.Transports.WebSocket.socketByURI;
	if (!sockets[uri]) {
		var config = {
			"uri": this._prepareURI(),
			"maxConnectRetries": this.config.get("maxConnectRetries"),
			"serverPingInterval": this.config.get("serverPingInterval")
		};
		sockets[uri] = {
			"socket": new Echo.API.Transports.WebSocket.Socket(config),
			"subscribers": {}
		};
	}

	// register socket subscriber
	sockets[uri].subscribers[this.unique] = true;

	this.socket = sockets[uri].socket;

	// if connected - fire "onOpen" callback immediately
	if (this.socket.connected()) {
		this.config.get("onOpen")();
	}
	$.map(["onOpen", "onClose", "onError", "onData"], function(topic) {
		var id = Echo.Events.subscribe({
			"topic": "Echo.API.Transports.WebSocket.Socket." + topic,
			"handler": function(_, data) {
				self.config.get(topic)(data);
			},
			// when we receive data - send it to the appropriate
			// subscribers only (do not send it to all subscribers)
			"context": self.socket.context(topic === "onData" ? self.unique : undefined)
		});
		self.subscriptionIds.push(id);
	});
	this.socket.connect();
};

Echo.API.Transports.WebSocket.prototype.send = function(event) {
	event.subscription_id = event.subscription_id || this.unique;
	return this.socket.send(event);
};

Echo.API.Transports.WebSocket.prototype.connect = function() {
	return this.socket.connect();
};

Echo.API.Transports.WebSocket.prototype.connected = function() {
	return this.socket.connected();
};

Echo.API.Transports.WebSocket.prototype.abort = function() {
	$.map(this.subscriptionIds, function(id) {
		Echo.Events.unsubscribe({"handlerId": id});
	});
	this.subscriptionIds = [];
	var socket = this.getSocket();
	delete socket.subscribers[this.unique];
	// close socket connection if the last subscriber left
	if ($.isEmptyObject(socket.subscribers)) {
		delete Echo.API.Transports.WebSocket.socketByURI[this.config.get("uri")];
		this.socket.abort();
	}
};

Echo.API.Transports.WebSocket.prototype._prepareURI = function() {
	return (this.config.get("secure") ? "wss://" : "ws://") + this.config.get("uri");
};

Echo.API.Transports.WebSocket.socketByURI = {};

Echo.API.Transports.WebSocket.Socket = function(config) {
	this.state = "init";
	this.timers = {};
	this.config = new Echo.Configuration(config, {
		"uri": "",
		"maxConnectRetries": 3,
		"serverPingInterval": 30 // in seconds
	});
	this._resetRetriesAttempts();
};

// static interface

Echo.API.Transports.WebSocket.Socket.Implementation = window.WebSocket || window.MozWebSocket;

Echo.API.Transports.WebSocket.Socket.available = function() {
	return !!this.Implementation;
};

// dynamic interface

Echo.API.Transports.WebSocket.Socket.prototype.connected = function() {
	return this.state === "connected";
};

Echo.API.Transports.WebSocket.Socket.prototype.connecting = function() {
	return this.state === "connecting";
};

Echo.API.Transports.WebSocket.Socket.prototype.context = function(subscriptionId) {
	return this.config.get("uri") + (subscriptionId ? "/" + subscriptionId : "");
};

Echo.API.Transports.WebSocket.Socket.prototype.abort = function() {
	this._clearTimers();
	this.socket.close();
};

Echo.API.Transports.WebSocket.Socket.prototype.connect = function() {
	var self = this;

	// return in case we are connected or connection is in progress
	if (this.connecting() || this.connected()) return;

	this._clearTimers();

	var uri = this.config.get("uri");
	this.socket = new Echo.API.Transports.WebSocket.Socket.Implementation(uri);
	this.socket.onopen = function() {
		// send ping immediately to make sure the server is responding
		self._ping(function() {
			self._resetRetriesAttempts();
			self._publish("onOpen");
		});

		// establish periodical clinet-server ping-pong to keep connection alive
		var interval = self.config.get("serverPingInterval") * 1000;
		self.timers.ping = setInterval($.proxy(self._ping, self), interval);
	};
	this.socket.onmessage = function(event) {
		if (!event || !event.data) return;
		var data = $.parseJSON(event.data);
		self._publish("onData", data, data && data.subscription_id);
	};
	this.socket.onclose = function() {
		self._publish("onClose");
		self._tryReconnect();
	};
	this.socket.onerror = function(error) {
		self._publish("onError", {"error": error});
	};
};

Echo.API.Transports.WebSocket.Socket.prototype.send = function(event) {
	return this.socket.send(Echo.Utils.objectToJSON(event));
};

// private functions

Echo.API.Transports.WebSocket.Socket.prototype._resetRetriesAttempts = function() {
	this.attemptsRemaining = this.config.get("maxConnectRetries");
};

Echo.API.Transports.WebSocket.Socket.prototype._clearTimers = function() {
	this.timers.ping && clearInterval(this.timers.ping);
	this.timers.pong && clearTimeout(this.timers.pong);
};

Echo.API.Transports.WebSocket.Socket.prototype._publish = function(topic, data, subscriptionId) {
	Echo.Events.publish({
		"topic": "Echo.API.Transports.WebSocket.Socket." + topic,
		"data": data || {},
		"context": this.context(subscriptionId)
	});
};

Echo.API.Transports.WebSocket.Socket.prototype._ping = function(callback) {
	var self = this;
	if (this.send({"event": "ping"})) {
		var id = Echo.Events.subscribe({
			"topic": "Echo.API.Transports.WebSocket.Socket.onData",
			"handler": function(topic, data) {
				// we are expecting "pong" message only...
				if (!data || data.event !== "pong") return;

				clearTimeout(self.timers.pong);
				Echo.Events.unsubscribe({"handlerId": id});
				self.state = "connected";

				callback && callback();
			},
			"context": this.context()
		});
		// waiting for the "pong" response half of the ping-pong interval
		this.timers.pong = setTimeout(function() {
			Echo.Events.unsubscribe({"handlerId": id});
			self._tryReconnect();
		}, this.config.get("serverPingInterval") * 1000 / 2);
	} else {
		// "send" operation failed, which means that
		// we are disconnected, trying to reconnect...
		this._tryReconnect();
	}
};

Echo.API.Transports.WebSocket.Socket.prototype._tryReconnect = function() {
	var self = this;
	this.state = this.attemptsRemaining ? this.state : "disconnected";

	// exit when connection is in progress (to prevent
	// multiple connections) or if no connection attempts left
	if (this.connecting() || this.state === "disconnected") return;

	// if we were disconnected and try to connect again - decrease
	// the retries counter to indicate several faile connection attempts in a row
	if (!this.connected()) {
		this.attemptsRemaining--;
	}

	this.state = "connecting";
	setTimeout(function() {
		self.state = "init";
		self.connect();
	}, this.config.get("serverPingInterval") * 1000);
};

//
// AJAX transport definition
//
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
	this.transportObject.data = data && typeof data === "string"
		? data
		: typeof configData === "string"
			? configData
			: $.extend({}, configData, data || {});
	this.transportObject = $.ajax(this.transportObject);
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	if (this.transportObject) {
		this.transportObject.abort();
	}
	this.config.get("onClose")();
};

Echo.API.Transports.AJAX.available = function() {
	return $.support.cors;
};

//
// XDomainRequest transport definition
//
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
	config = config || {"URL": "", "method": ""};
	var schema = utils.parseURL(config.URL) && utils.parseURL(config.URL).schema || "http:";
	// XDomainRequests must be: GET or POST methods, HTTP or HTTPS protocol,
	// and same scheme as calling page
	var transportSpecAvailability = /^get|post$/i.test(config.method)
		&& /^https?/.test(schema)
		&& document.location.protocol === schema;
	return "XDomainRequest" in window
		&& transportSpecAvailability;
};

//
// JSONP transport definition
//
Echo.API.Transports.JSONP = utils.inherit(Echo.API.Transports.AJAX, function(config) {
	return Echo.API.Transports.JSONP.parent.constructor.apply(this, arguments);
});

Echo.API.Transports.JSONP.prototype.send = function(data) {
	if (this.config.get("method").toLowerCase() === "get") {
		this.transportObject.data = $.extend({}, this.config.get("data"), data);
		return (this.transportObject = $.ajax(this.transportObject));
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
		"apiBaseURL": "api.echoenabled.com/v1/",
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
		"settings": {},
		/**
		 * @cfg {String} [transport]
		 * Specifies the transport name.
		 */
		"transport": "ajax",
		/**
		 * @cfg {String} [method]
		 * Specifies the request method.
		 */
		"method": "GET",
		/**
		 * @cfg {Number} [timeout]
		 * Specifies the number of seconds after which the onError callback
		 * is called if the API request failed.
		 */
		"timeout": 30
	});
};

Echo.API.Request.prototype._isSecureRequest = function() {
	var parts = utils.parseURL(this.config.get("apiBaseURL"));
	if (!parts.scheme) return false;
	return /https|wss/.test(parts.scheme);
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
	}
	var method = this["_" + this.config.get("endpoint")];
	method && method.call(this, force);
};

//TODO: probably we should replace request with _request or simply not documenting it
Echo.API.Request.prototype.request = function(params) {
	var self = this;
	var timeout = this.config.get("timeout");
	this.transport = this._getTransport();
	if (this.transport) {
		this.transport.send(params);
		if (timeout && this.config.get("onError")) {
			this._timeoutId = setTimeout(function() {
				self.config.get("onError")({
					"result": "error",
					"errorCode": "network_timeout"
				}, {
					"requestType": self.requestType,
					"critical": true
				});
				self.transport.abort();
			}, timeout * 1000);
		}
	}
};

Echo.API.Request.prototype._onData = Echo.API.Request.prototype._onError = function(response) {
	clearTimeout(this._timeoutId);
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
			$.each(["AJAX", "XDomainRequest", "JSONP"], function(i, name) {
				var available = Echo.API.Transports[name].available({
					"URL": self.config.get("apiBaseURL"),
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
	return utils.foldl({}, this.config.getAsHash(), function(value, acc, key) {
		if (/^on[A-Z]/.test(key)) {
			acc[key] = value;
		}
	});
};

Echo.API.Request.prototype._prepareURI = function() {
	return this.config.get("apiBaseURL").replace(/^(http|ws)s?:\/\//, "") + this.config.get("endpoint");
};

})(Echo.jQuery);
