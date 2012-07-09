(function($) {
 
"use strict";

if (Echo.Utils.isComponentDefined("Echo.API.Request")) return;

Echo.API = {"Transports": {}, "Request": {}};

var utils = Echo.Utils;

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
	this.instance = this._getInstance();
};

Echo.API.Transport.prototype.send = function(data) {
	this.instance.send(data);
};

Echo.API.Transport.prototype.abort = function() {
	this.instance.abort();
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

Echo.API.Transports.AJAX = function(config) {
	config = $.extend({
		"method": "get"
	}, config || {});
	Echo.API.Transports.AJAX.parent.constructor.call(this, config);
};

utils.inherit(Echo.API.Transports.AJAX, Echo.API.Transport);

Echo.API.Transports.AJAX.prototype._getScheme = function() {
	return this.config.get("secure") ? "https:" : window.location.protocol;
};

Echo.API.Transports.AJAX.prototype._getInstance = function() {
	var self = this;
	var ajaxSettings = {
		url: this._prepareURL(),
		type: this.config.get("method"),
		error: function(errorResponse) {
			errorResponse = self._wrapErrorResponse(errorResponse);
			self.config.get("onError")(errorResponse);
		},
		success: this.config.get("onData"),
		beforeSend: this.config.get("onOpen"),
		dataType: "json"
	};
	if ("XDomainRequest" in window && window.XDomainRequest != null) {
		var xhrOrigin = $.ajaxSettings.xhr;
		var domain = utils.parseURL(document.location.href).domain;
		$.support.cors = true;
		ajaxSettings.xhr = function() {
			var targetDomain = utils.parseURL(self.config.get("url")).domain;
			if (targetDomain === "" || targetDomain === domain) {
				return xhrOrigin.call($.ajaxSettings);
			}
			var xdr = new XDomainRequest();
			if (!xdr.setRequestHeader) {
				xdr.setRequestHeader = $.noop;
			}
			if (!xdr.getAllResponseHeaders) {
				xdr.getAllResponseHeaders = $.noop;
			}
			xdr.onload = function () {
				if ($.isFunction(xdr.onredaystatechange)) {
					xdr.readyState = 4;
					xdr.status = 200;
					xdr.onreadystatechange.call(xdr, null, false);
				}
			};
			xdr.onerror = xdr.ontimeout = function () {
				if ($.isFunction(xdr.onreadystatechange)) {
					xdr.readyState = 4;
					xdr.status = 500;
					xdr.onreadystatechange.call(xdr, null, false);
				}
			};
			return xdr;
		};
	}
	return ajaxSettings;
};

Echo.API.Transports.AJAX.prototype._wrapErrorResponse = function(responseError) {
	var originalWrapped = this.constructor.parent._wrapErrorResponse.apply(this, arguments);
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
	this.instance.data = $.extend(this.config.get("data"), data || {});
	this.jxhrInstance = $.ajax(this.instance);
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	if (this.jxhrInstance) {
		this.jxhrInstance.abort();
	}
	this.config.get("onClose")();
};

Echo.API.Transports.AJAX.available = function() {
	return (!$.browser.msie || $.browser.msie && $.browser.version > 7);
};

Echo.API.Transports.JSONP = function(config) {
	Echo.API.Transports.JSONP.parent.constructor.apply(this, arguments);
};

utils.inherit(Echo.API.Transports.JSONP, Echo.API.Transports.AJAX);

Echo.API.Transports.JSONP.prototype._getInstance = function() {
	var settings = this.constructor.parent._getInstance.call(this);
	settings.dataType = "jsonp";
	return settings;
};

Echo.API.Transports.JSONP.available = function() {
	return true;
};

Echo.API.Transports.WebSocket = function(config) {
	Echo.API.Transports.WebSocket.parent.constructor.apply(this, arguments);
};

utils.inherit(Echo.API.Transports.WebSocket, Echo.API.Transport);

Echo.API.Transports.WebSocket.prototype._getScheme = function() {
	return this.config.get("secure") ? "wss:" : "ws:";
};

Echo.API.Transports.WebSocket.prototype._getInstance = function() {
	var self = this;
	var socket = new (window.WebSocket || window.MozWebSocket)(this._prepareURL());
	socket.onmessage = function(event) {
		self.config.get("onData")(utils.parseJSON(event.data));
	};
	socket.onopen = this.config.get("onOpen");
	socket.onclose = this.config.get("onClose");
	socket.onerror = function(errorResponse) {
		errorResponse = self._wrapErrorResponse(errorResponse);
		self.config.get("onError")(errorResponse);
	};
	return socket;
};

Echo.API.Transports.WebSocket.prototype.send = function(params) {
	this.instance.send(utils.object2JSON(params));
};

Echo.API.Transports.WebSocket.prototype.abort = function() {
	this.config.get("onClose")();
};

Echo.API.Transports.WebSocket.available = function() {
	// FIXME: fix when server will support Web Sockets
	return false;
	//return ("WebSocket" in window || "MozWebSocket" in window);
};

Echo.API.Request = function(config) {
	if (!config || !config.endpoint) return;
	this.config = new Echo.Configuration(config, {
		"apiBaseURL": "api.echoenabled.com/v1/",
		"transport": "ajax",
		"secure": false
	});
	this.transport = this._getTransport();
};

Echo.API.Request.prototype.send = function() {
	var method = this["_" + this.config.get("endpoint")];
	method && method.call(this);
};

Echo.API.Request.prototype.request = function(params) {
	this.transport && this.transport.send(params);
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
			"secure": this.config.get("secure")
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
	return this.config.get("apiBaseURL") + this.config.get("endpoint");
};

})(jQuery);
