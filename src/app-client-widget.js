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

ClientWidget.methods._initUser = function(callback) {
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

ClientWidget.methods._loading = function() {
	Utils.showMessage({
		"type": "loading",
		"target": this.config.get("target"),
		"message": this.labels.get("loading"),
		"layout": this.config.get("loadingMessageLayout")
	});
};

ClientWidget.methods._init = function(subsystems) {
	var index;
	$.each(subsystems, function(i, subsystem) {
		if (subsystem.name === "plugins") {
			index = i;
			return false;
		}
	});
	index = index || 0;
	subsystems.splice(index, 0, {
		"name": "loading",
		"init": this._loading,
		"type": "sync"
	});
	subsystems.splice(index + 1, 0, {
		"name": "user",
		"init": this._initUser,
		"type": "async"
	});
	return Utils.getComponent("Echo.App.ClientWidget").parent._init.call(this, subsystems);
};

ClientWidget.static.definition = function() {
	var object = this.parent.apply(this, arguments);
	object.init = ClientWidget.init;
	return object;
};

return App.create(ClientWidget);

});
