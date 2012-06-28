(function($) {
 
"use strict";

if (Echo.API && Echo.API.Request) return;

Echo.API = {};

var utils = Echo.Utils;

Echo.API.Request = function(config) {
	if (!config || !config.endpoint) return;
	this.config = new Echo.Configuration(config, {
		"method": "GET",
		"apiBaseURL": "api.echoenabled.com/v1/"
	});
};

Echo.API.Request.prototype.send = function() {
	var method = this["_" + this.config.get("endpoint")];
	method && method.call(this);
};

Echo.API.Request.prototype.request = function(config) {
	var transport = this._getTransport();
	transport();
};

Echo.API.Request.prototype.abort = function() { };

Echo.API.Request.prototype.transports = {};

Echo.API.Request.prototype.transports.ajax = function(config) {
	if ("XDomainRequest" in window && window.XDomainRequest != null) {
		var xdr = new XDomainRequest();
		var self = this;
		xdr.open(this.config.get("method"), this._prepareURL() + "?" + utils.objectToQuery(this.config.get("data")));
		xdr.onload = function() {
			self.config.get("onData") && self.config.get("onData")($.parseJSON(xdr.responseText));
		};
		xdr.onerror = function() {
			self.config.get("onError") && self.config.get("onError")(xdr);
		};
		xdr.send();
	} else {
		var ajaxSettings = {
			url: this._prepareURL(),
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
		$.ajax(ajaxSettings);
	}
};

Echo.API.Request.prototype.transports.ws = function(url, config) {
	var Socket = window.MozWebSocket || window.WebSocket;
	var socket = new Socket(url);
	socket.onmessage = function(event) {
		config.success(utils.parseJSON(event.data));
	};
	socket.onopen = function() {
		config.open();
	};
	socket.onerror = function(event) {
		config.success(event.data);
	};
	socket.send(utils.object2JSON(config.data));
};

Echo.API.Request.prototype._getTransport = function() {
	var self = this;
	return function() {
		// FIXME: enable when web socket support is available
		//this.transports[window.WebSocket || window.MozWebSocket ? "ws" : "ajax"].apply(this, arguments);
		self.transports["ajax"].apply(self, arguments);
	};
};

Echo.API.Request.prototype._prepareURL = function(config) {
	return "http://" + this.config.get("apiBaseURL") + this.config.get("endpoint");
};

 })(jQuery);
