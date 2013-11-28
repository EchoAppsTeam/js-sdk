Echo.define("echo/app-client-widget", [
	"jquery",
	"echo/utils",
	"echo/streamserver/user",
	"echo/app"
], function($, Utils, User, App) {
"use strict";

var ClientWidget = App.definition("Echo.App.ClientWidget");

ClientWidget.init = function() {
	var app = this;
	this.initUser(function() {
		app.render();
		app.ready();
	});
};

ClientWidget.methods.initUser = function(callback) {
	Utils.sequentialCall([
		$.proxy(this._initBackplane, this),
		$.proxy(this._storeUser, this)
	], callback);
};

ClientWidget.methods._initBackplane = function(callback) {
	var app = this;
	var config = this.config.get("backplane");
	if (config.serverBaseURL && config.busName) {
		Echo.require(["echo/backplane"], function(Backplane) {
			Backplane.init(config);
			callback();
		});
	} else {
		callback();
	}
};

ClientWidget.methods._storeUser = function(callback) {
	var app = this;
	if (!this.config.get("appkey")) {
		callback();
		return;
	}
	if (this.config.get("user")) {
		this.user = this.config.get("user");
		callback();
	} else {
		var generateURL = function(baseURL, path) {
			if (!baseURL) return;
			var urlInfo = Utils.parseURL(baseURL);
			return (urlInfo.scheme || "https") + "://" + urlInfo.domain + path;
		};
		User({
			"appkey": this.config.get("appkey"),
			"useSecureAPI": this.config.get("useSecureAPI"),
			"endpoints": {
				"logout": generateURL(this.config.get("submissionProxyURL"), "/v2/"),
				"whoami": generateURL(this.config.get("apiBaseURL"), "/v1/users/")
			},
			"ready": function() {
				app.user = this;
				callback();
			}
		});
	}
};

ClientWidget.static.definition = function() {
	var object = this.parent.apply(this, arguments);
	object.init = ClientWidget.init;
	return object;
};

return App.create(ClientWidget);

});
