Echo.define("echo/streamserver/bundled-app", [
	"jquery",
	"echo/utils",
	"echo/streamserver/user",
	"echo/app"
], function($, Utils, User, App) {
"use strict";

var BundledApp = App.manifest("Echo.StreamServer.BundledApp");

BundledApp.init = function() {
	var app = this;
	this.initUser(function() {
		app.render();
		app.ready();
	});
};

BundledApp.methods.initUser = function(callback) {
	Utils.sequentialCall([
		$.proxy(this._initBackplane, this),
		$.proxy(this._storeUser, this)
	], callback);
};

BundledApp.methods._initBackplane = function(callback) {
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

BundledApp.methods._storeUser = function(callback) {
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

BundledApp.static.manifest = function() {
	var object = this.parent.apply(this, arguments);
	object.init = BundledApp.init;
	return object;
};

return App.create(BundledApp);

});
