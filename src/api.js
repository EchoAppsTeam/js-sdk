(function($) {
 
"use strict";

if (Echo.Utils.isComponentDefined("Echo.API.Request")) return;

Echo.API = {"Transports": {}, "Request": {}};

var utils = Echo.Utils;

Echo.API.Transports.AJAX = function(config) {
	this.config = new Echo.Configuration(config, {
		"method": "get",
		"onData": function() {},
		"onError": function() {}
	});
	this.instance = this._getInstance();
};

Echo.API.Transports.AJAX.prototype._getInstance = function() {
	var self = this;
	if ("XDomainRequest" in window && window.XDomainRequest != null) {
		var xdr = new XDomainRequest();
		xdr.open(this.config.get("method"), this.config.get("url"));
		xdr.onload = function() {
			self.config.get("onData")($.parseJSON(xdr.responseText));
		};
		xdr.onerror = function() {
			self.config.get("onError")(xdr);
		};
		return xdr;
	} else {
		var ajaxSettings = {
			url: this.config.get("url"),
			type: this.config.get("method"),
			crossDomain: true,
			data: this.config.get("data"),
			error: this.config.get("onError"),
			success: this.config.get("onData"),
			dataType: "json"
		};
		if (!$.support.cors) {
			ajaxSettings.dataType = "jsonp";
		}
		$.ajaxSetup(ajaxSettings);
		return $.ajax;
	}
};

Echo.API.Transports.AJAX.prototype.send = function(params) {
	if ($.support.cors) {
		this.instance();
	} else {
		this.instance.send(params);
	}
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	this.instance.abort();
};

Echo.API.Transports.WS = function(config) {
	this.config = new Echo.Configurstion(config, {
		"onData": function() {},
		"onOpen": function() {},
		"onClose": function() {},
		"onError": function() {}
	});
	this.instance = this._getInstance();
};

Echo.API.Transports.WS.prototype._getInstance = function() {
	var self = this;
	var Socket = window.MozWebSocket || window.WebSocket;
	var socket = new Socket(url);
	socket.onmessage = function(event) {
		self.config.get("onData")(utils.parseJSON(event.data));
	};
	socket.onopen = function() {
		self.config.get("onOpen");
	};
	socket.onclose = function() {
		self.config.get("onClose");
	};
	socket.onerror = function(event) {
		self.config.get("onError")(event.data);
	};
	return socket;
};

Echo.API.Transports.WS.prototype.send = function(params) {
	this.instance.send(utils.object2JSON(params));
};

Echo.API.Request = function(config) {
	if (!config || !config.endpoint) return;
	this.config = new Echo.Configuration(config, {
		"apiBaseURL": "api.echoenabled.com/v1/",
		"transport": "ajax"
	});
	this.transport = this._getTransport();
};

Echo.API.Request.prototype.send = function() {
	var method = this["_" + this.config.get("endpoint")];
	method && method.call(this);
};

Echo.API.Request.prototype.request = function() {
	this.transport && this.transport.send();
};

Echo.API.Request.prototype.abort = function() {
	this.transport && this.transport.abort();
};

Echo.API.Request.prototype._getTransport = function() {
	var transport = this.config.get("transport");
	if (Echo.API.Transports[transport.toUpperCase()]) {
		return new Echo.API.Transports[transport.toUpperCase()](
			$.extend(this._getHandlersByConfig(), {
				"url": this._prepareURL(),
				"data": this.config.get("data")
			})
		);
	}
};

Echo.API.Request.prototype._getHandlersByConfig = function() {
	return utils.foldl({}, this.config.getAsHash(), function(value, acc, key) {
		if (/^on[A-Z]/.test(key)) {
			acc[key] = value;
		}
	});
};

Echo.API.Request.prototype._prepareURL = function(config) {
	var scheme = this.config.get("secure") ? "https:" : window.location.protocol;
	return scheme + "//" + this.config.get("apiBaseURL") + this.config.get("endpoint");
};

})(jQuery);
