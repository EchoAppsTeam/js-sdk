(function($) {
 
"use strict";

if (Echo.Utils.isComponentDefined("Echo.API.Request")) return;

Echo.API = {"Transports": {}, "Request": {}};

var utils = Echo.Utils;

Echo.API.Transport = function(config) {
	this.config = new Echo.Configuration(config, {
		"data": {},
		"url": "",
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

Echo.API.Transport.prototype.onError = Echo.API.Transport.prototype.onData = function() {};

Echo.API.Transports.AJAX = function(config) {
	config = $.extend({
		"method": "get"
	}, config || {});
	Echo.API.Transports.AJAX.parent.constructor.call(this, config);
};

utils.inherit(Echo.API.Transports.AJAX, Echo.API.Transport);

Echo.API.Transports.AJAX.prototype._getInstance = function() {
	var self = this;
	var ajaxSettings = {
		url: this.config.get("url"),
		type: this.config.get("method"),
		error: function(text) {
			self.onError(text);
			self.config.get("onError")(text);
		},
		success: function(response) {
			self.onData(response);
			self.config.get("onData")(response);
		},
		beforeSend: this.config.get("onOpen"),
		dataType: "json"
	};
	if ("XDomainRequest" in window && window.XDomainRequest != null) {
		ajaxSettings.xhr = function() {
			return new XDomainRequest();
		};
	}
	return ajaxSettings;
};

Echo.API.Transports.AJAX.prototype.send = function(data) {
	data = $.extend(this.config.get("data"), data || {});
	var ajaxSettings = this.instance;
	ajaxSettings.data = data;
	this.jxhrInstance = $.ajax(ajaxSettings);
};

Echo.API.Transports.AJAX.prototype.abort = function() {
	if (this.xhrInstance) {
		this.jxhrInstance.abort();
		this.config.get("onClose");
	}
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

Echo.API.Transports.WS = function(config) {
	Echo.API.Transports.WS.parent.constructor.apply(this, arguments);
};

utils.inherit(Echo.API.Transports.WS, Echo.API.Transport);

Echo.API.Transports.WS.prototype._getInstance = function() {
	var self = this;
	var Socket = window.WebSocket || window.MozWebSocket;
	var socket = new Socket(this.config.get("url"));
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

Echo.API.Transports.WS.prototype.abort = function() {
	throw new Error("Reference Error: Web Sockets don't support this method");
};

Echo.API.Transports.WS.available = function() {
	// FIXME: fix when server will support Web Sockets
	return false;
	//return ("WebSocket" in window || "MozWebSocket" in window);
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

Echo.API.Request.prototype.request = function(params) {
	this.transport && this.transport.send(params);
};

Echo.API.Request.prototype.abort = function() {
	this.transport && this.transport.abort();
};

Echo.API.Request.prototype._getTransport = function() {
	var userDefinedTransport = this.config.get("transport");
	var transport = utils.foldl("", Echo.API.Transports, function(constructor, acc, name) {
		var available = Echo.API.Transports[name].available();
		if (userDefinedTransport === name.toLowerCase() && available) {
			return name;
		} else if (available) {
			acc = name;
		}
	});
	return new Echo.API.Transports[transport](
		$.extend(this._getHandlersByConfig(), {
			"url": this._prepareURL(),
			"data": this.config.get("data")
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

Echo.API.Request.prototype._prepareURL = function(config) {
	var scheme = this.config.get("secure") ? "https:" : window.location.protocol;
	return scheme + "//" + this.config.get("apiBaseURL") + this.config.get("endpoint");
};

})(jQuery);
