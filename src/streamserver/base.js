Echo.define([
	"jquery",
	"echo/utils",
	"echo/app-client-widget",
	"echo/streamserver/user"
], function($, Utils, App, User) {
"use strict";

/**
 * @class Echo.StreamServer.Base
 * Implementing additional logic for the client facing widget
 * based on stream server specific usage.
 * You can find instructions on how to create your App in the
 * ["How to develop an App"](#!/guide/how_to_develop_app) guide.
 *
 * @package streamserver.pack.js
 *
 * @extends Echo.App.ClientWidget
 */
var Base = App.definition("Echo.StreamServer.Base");

Base.config = {
	"loadingMessageLayout": "full"
};

Base.labels = {
	/**
	 * @echo_label loading
	 */
	"loading": "Loading..."
};

Base.events = {
	"Echo.App.onDataInvalidate": function() {
		var request = this.get("request");
		if (request && request.liveUpdates) {
			request.liveUpdates.start(true);
		}
	}
};

Base.methods._initUser = function(next) {
	Utils.sequentialCall([
		$.proxy(this._initBackplane, this),
		$.proxy(this._storeUser, this)
	], next);
};

Base.methods._initBackplane = function(next) {
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

Base.methods._storeUser = function(next) {
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

Base.methods._loading = function() {
	Utils.showMessage({
		"type": "loading",
		"target": this.config.get("target"),
		"message": this.labels.get("loading"),
		"layout": this.config.get("loadingMessageLayout")
	});
};

Base.methods._init = function(subsystems) {
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

return App.create(Base);

});
