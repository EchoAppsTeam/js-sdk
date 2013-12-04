Echo.define("echo/app-client-widget", [
	"jquery",
	"echo/utils",
	"echo/streamserver/user",
	"echo/app"
], function($, Utils, User, App) {
"use strict";

var ClientWidget = App.definition("Echo.App.ClientWidget");

ClientWidget.config = {
	"loadingMessageLayout": "full"
};

ClientWidget.labels = {
	/**
	 * @echo_label loading
	 */
	"loading": "Loading..."
};

ClientWidget.events = {
	"Echo.App.onDataInvalidate": function() {
		var request = this.get("request");
		if (request && request.liveUpdates) {
			request.liveUpdates.start(true);
		}
	}
};

ClientWidget.methods._initUser = function(next) {
	Utils.sequentialCall([
		$.proxy(this._initBackplane, this),
		$.proxy(this._storeUser, this)
	], next);
};

ClientWidget.methods._initBackplane = function(next) {
	var app = this;
	var config = this.config.get("backplane");
	if (config.serverBaseURL && config.busName) {
		Echo.require(["echo/backplane"], function(Backplane) {
			Backplane.init(config);
			next();
		});
	} else {
		next();
	}
};

ClientWidget.methods._storeUser = function(next) {
	var app = this;
	if (!this.config.get("appkey")) {
		next();
		return;
	}
	if (this.config.get("user")) {
		this.user = this.config.get("user");
		next();
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
				next();
			}
		});
	}
};

ClientWidget.methods._loading = function() {
	Utils.showMessage({
		"type": "loading",
		"target": this.config.get("target"),
		"message": this.labels.get("loading"),
		"layout": this.config.get("loadingMessageLayout")
	});
};

ClientWidget.methods._init = function(subsystems) {
	var index = 0;
	$.each(subsystems, function(i, subsystem) {
		if (subsystem.name === "plugins") {
			index = i;
			return false;
		}
	});
	subsystems.splice(index, 0, {
		"name": "loading",
		"init": this._loading,
		"type": "sync"
	}, {
		"name": "user",
		"init": this._initUser,
		"type": "async"
	});
	return App.prototype._init.call(this, subsystems);
};

return App.create(ClientWidget);

});
