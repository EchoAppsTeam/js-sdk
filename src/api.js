(function(jQuery) {
"use strict";

var $ = jQuery;

Echo.API = {"Transports": {}, "Request": {}};

var utils = Echo.Utils;

/**
 * @class Echo.API.Transport
 */
Echo.API.Transport = function(config) {
	this.config = new Echo.Configuration(config, {
		"data": {},
		"uri": "",
		"secure": false,
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
 * @class Echo.API.Transports.AJAX
 * @extends Echo.API.Transport
 */
Echo.API.Transports.AJAX = function(config) {
	config = $.extend({
		"method": "get"
	}, config || {});
	return Echo.API.Transports.AJAX.parent.constructor.call(this, config);
};

utils.inherit(Echo.API.Transport, Echo.API.Transports.AJAX);

Echo.API.Transports.AJAX.prototype._getScheme = function() {
	return this.config.get("secure") ? "https:" : "http:";
};

Echo.API.Transports.AJAX.prototype._getTransportObject = function() {
	var self = this;
	var domain = utils.parseURL(document.location.href).domain;
	var targetDomain = utils.parseURL(self.config.get("uri")).domain;
	var ajaxSettings = {
		"url": this._prepareURL(),
		"type": this.config.get("method"),
		"error": function(errorResponse, requestParams) {
			errorResponse = self._wrapErrorResponse(errorResponse);
			self.config.get("onError")(errorResponse, requestParams);
		},
		"success": this.config.get("onData"),
		"crossDomain": true,
		"beforeSend": this.config.get("onOpen"),
		"dataType": "json"
	};
	if ("XDomainRequest" in window && window.XDomainRequest !== null && (!targetDomain || targetDomain !== domain)) {
		var xdr = new XDomainRequest();
		var parseResponseText = function(responseText) {
			var data;
			try {
				data = $.parseJSON(xdr.responseText);
			} catch(e) {
				data = {
					"type": "error",
					"errorCode": "parse_error",
					"message": "Parse JSON error"
				};
			}
			return data;
		};
		xdr.onload = function() {
			self.config.get("onData")(parseResponseText(xdr.responseText));
		};
		xdr.onerror = function() {
			var errorResponse = self._wrapErrorResponse(parseResponseText(xdr.responseText));
			self.config.get("onError")(errorResponse);
		};
		ajaxSettings.xdr = xdr;
	}
	return ajaxSettings;
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
	data = data || {};
	var method = this.config.get("method").toLowerCase();
	this.transportObject.data = $.extend({}, this.config.get("data"), data || {});
	this._transportObject = this.transportObject.xdr
		? this.transportObject.xdr
		: $.ajax(this.transportObject);
	if ("XDomainRequest" in window
		&& window.XDomainRequest !== null
		&& this._transportObject instanceof XDomainRequest) {
		this.config.get("onOpen")();
		// TODO: need investigate XDomainRequest cache
		// avoid recieved data caching
		$.extend(this.transportObject.data, {
			"_echo": utils.getUniqueString()
		});
		if (method === "get") {
			this._transportObject.open(method, this._prepareURL() + "?" + $.param(this.transportObject.data));
			this._transportObject.send(null);
		} else {
			this._transportObject.open(method, this._prepareURL());
			this._transportObject.send($.param(this.transportObject.data));
		}
	}
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	if (this._transportObject) {
		this._transportObject.abort();
	}
	this.config.get("onClose")();
};

Echo.API.Transports.AJAX.available = function() {
	return !($.browser.msie && $.browser.version < 8);
};

/**
 * @class Echo.API.Transports.JSONP
 * @extends Echo.API.Transports.AJAX
 */
Echo.API.Transports.JSONP = function(config) {
	return Echo.API.Transports.JSONP.parent.constructor.apply(this, arguments);
};

utils.inherit(Echo.API.Transports.AJAX, Echo.API.Transports.JSONP);

Echo.API.Transports.JSONP.prototype.send = function(data) {
	if (this.config.get("method").toLowerCase() === "get") {
		this.transportObject.data = $.extend({}, this.config.get("data"), data);
		return $.ajax(this.transportObject);
	}
	this._pushPostParameters($.extend({}, this.config.get("data"), data));
	this.transportObject.submit();
	this.config.get("onData")();
};

Echo.API.Transports.JSONP.prototype._getTransportObject = function() {
	var settings = this.constructor.parent._getTransportObject.call(this);
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
	return form;
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
 * @class Echo.API.Transports.WebSocket
 * @extends Echo.API.Transport
 */
Echo.API.Transports.WebSocket = function(config) {
	return Echo.API.Transports.WebSocket.parent.constructor.apply(this, arguments);
};

utils.inherit(Echo.API.Transport, Echo.API.Transports.WebSocket);

Echo.API.Transports.WebSocket.prototype._getScheme = function() {
	return this.config.get("secure") ? "wss:" : "ws:";
};

Echo.API.Transports.WebSocket.prototype._getTransportObject = function() {
	var self = this;
	var socket = new (window.WebSocket || window.MozWebSocket)(this._prepareURL());
	socket.onmessage = function(event) {
		self.config.get("onData")($.parseJSON(event.data));
	};
	socket.onopen = this.config.get("onOpen");
	socket.onclose = this.config.get("onClose");
	socket.onerror = function(errorResponse, requestParams) {
		errorResponse = self._wrapErrorResponse(errorResponse);
		self.config.get("onError")(errorResponse, requestParams);
	};
	return socket;
};

Echo.API.Transports.WebSocket.prototype.send = function(params) {
	this.transportObject.send(utils.objectToJSON(params));
};

Echo.API.Transports.WebSocket.prototype.abort = function() {
	this.config.get("onClose")();
};

Echo.API.Transports.WebSocket.available = function() {
	// FIXME: fix when server will support Web Sockets
	return false;
	//return ("WebSocket" in window || "MozWebSocket" in window);
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
	if (!config || !config.endpoint) return;
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
		 * Specifies the number of seconds after which onError callback will be
		 * called if API request failed.
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
 * Method performing api request using given parameters.
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
			var timeout = this._timeoutId = setTimeout(function() {
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
	var userDefinedTransport = this.config.get("transport").toUpperCase();
	var transport = Echo.API.Transports[userDefinedTransport] && Echo.API.Transports[userDefinedTransport].available()
		? userDefinedTransport
		: utils.foldl("", Echo.API.Transports, function(constructor, acc, name) {
			var available = Echo.API.Transports[name].available();
			if (available) {
				return name;
			}
		});
	return new Echo.API.Transports[transport](
		$.extend(this._getHandlersByConfig(), {
			"uri": this._prepareURI(),
			"data": this.config.get("data"),
			"method": this.config.get("method"),
			"secure": this._isSecureRequest()
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
