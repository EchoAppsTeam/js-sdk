Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/utils",
	"loadFrom![echo/apps.sdk]echo/app-client-widget",
	"loadFrom![echo/apps.sdk]echo/streamserver/user"
], function($, Utils, App, User) {
"use strict";

/**
 * @class Echo.StreamServer.Base
 * Implementing additional logic for the client facing widget
 * based on StreamServer specific usage.
 * You can find instructions on how to create your App in the
 * ["How to develop an App"](#!/guide/how_to_develop_app) guide.
 *
 * @package streamserver.pack.js
 * @module
 *
 * @extends Echo.App.ClientWidget
 */
var Base = App.definition("Echo.StreamServer.Base");

var onDataInvalidate = function() {
	var request = this.get("request");
	if (request && request.liveUpdates) {
		request.liveUpdates.start(true);
	}
};

Base.events = {
	// we need two subscriptions here, because the "Echo.App.onDataInvalidate" event
	// may be published by the nested apps (in this case the event is not broadcasted
	// to the "global" context) and by the standalone app to notify other apps
	// (not related directly) about the need to invalidate the data (in this case
	// the "global" context is used)
	"Echo.App.onDataInvalidate": [{
		"context": "global",
		"handler": onDataInvalidate
	}, onDataInvalidate],
	// subscribe all root level applications to the user login/logout event
	// and call the "refresh" application method
	"Echo.StreamServer.User.onInvalidate": {
		"context": "global",
		"handler": function() {
			if (!this.dependent()) {
				this.refresh();
			}
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
	var userConfig = this.config.get("user");
	if (!this.config.get("appkey") || !userConfig) {
		next();
		return;
	}
	User(
		$.extend({
			"appkey": this.config.get("appkey"),
			"useSecureAPI": this.config.get("useSecureAPI"),
			"ready": function() {
				app.user = this;
				next();
			}
		}, userConfig)
	);
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
		"name": "user",
		"init": this._initUser,
		"type": "async"
	});
	return App.prototype._init.call(this, subsystems);
};

return App.create(Base);

});
