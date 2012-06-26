(function($) {

"use strict";

if (Echo.UserSession) return;

Echo.UserSession = function(config) {
	return Echo.UserSession._construct(config);
};

Echo.UserSession.set = function(key, value) {
	var user = this;
	user._maybeDelegate({
		"action": "set",
		"key": key,
		"arg": [value],
		"fallback": function() {
			user._attrLocation(key)[key] = value;
		}
	});
};

Echo.UserSession.get = function(key, defaults) {
	var user = this;
	return user._maybeDelegate({
		"action": "get",
		"key": key,
		"fallback": function() {
			var value = user._attrLocation(key)[key];
			return value == undefined ? defaults : value;
		}
	});
};

Echo.UserSession.is = function(key) {
	var user = this;
	return user._maybeDelegate({
		"action": "is",
		"key": key
	});
};

Echo.UserSession.has = function(key, value) {
	var user = this;
	return user._maybeDelegate({
		"action": "has",
		"key": key,
		"arg": [value],
		"fallback": function() {
			return user.any(key, [value]);
		}
	});
};

Echo.UserSession.any = function(key, values) {
	var user = this;
	return user._maybeDelegate({
		"action": "any",
		"key": key,
		"arg": values,
		"fallback": function() {
			var satisfies = false;
			if (!user.identity) return false;
			$.each(values, function(i, value) {
				var data = user.get(key, {});
				if ((typeof data == "string" && data == value) ||
					($.isArray(data) && $.inArray(value, data) >= 0)) {
						satisfies = true;
						return false; // break
				}
			});
			return satisfies;
		}
	});
};

Echo.UserSession.logout = function(callback) {
	var user = this;
	if (!user.is("logged")) {
		user._reset({});
		(callback || function(){})();
		return;
	}
	user._apiRequest(user.config.get("endpoints.logout"), {
		"sessionID": Backplane.getChannelID()
	}, function(data) {
		user._onInit(callback);
		Backplane.expectMessages("identity/ack");
	});
};

// internal functions

Echo.UserSession._construct = function(config) {
	if (!config || !config.appkey) return;
	var user = this;
	var callback = function() {
		(config.ready || function() {}).call(user);
	};
	user.state = user.state || "init";
	switch (user.state) {

		// initialization call when previous request is in progress
		case "waiting":
			user._onInit(callback);
			break;

		// singleton already initialized
		case "ready":
			callback();
			break;

		// first time call
		default:
			user.data = {};
			user.config = new Echo.Configuration(config, user._getDefaultConfig());
			user._listenEvents();
			user._init(callback);
	};
	return user;
};

Echo.UserSession._maybeDelegate = function(config) {
	var user = this;
	var name = config.key.charAt(0).toUpperCase() + config.key.slice(1);
	var handler = user["_" + config.action + name];
	return handler
		? handler.call(this, config.arg || [])
		: (config.fallback ? config.fallback() : undefined);
};

Echo.UserSession._getDefaultConfig = function() {
	var protocol = window.location.protocol == "https:" ? "https:" : "http:";
	return {
		"appkey": "",
		"endpoints": {
			"logout": protocol + "//apps.echoenabled.com/v2/logout",
			"whoami": protocol + "//api.echoenabled.com/v1/users/whoami"
		},
		"defaultAvatar": protocol + "//cdn.echoenabled.com/images/avatar-default.png",
		"fakeIdentityURL": "http://js-kit.com/ECHO/user/fake_user"
	};
};

Echo.UserSession._apiRequest = function(endpoint, data, callback) {
	$.get(endpoint, data || {}, callback || function() {}, "jsonp");
};

Echo.UserSession._listenEvents = function() {
	var user = this;
	if (user.backplaneSubscriptionID) return;
	user.backplaneSubscriptionID = Backplane.subscribe(function(message) {
		if (message.type != "identity/ack") return;
		user._init(function() {
			Echo.Events.publish(
				"Echo.UserSession.onInvalidate",
				{"data": user.data}
			);
		});
	});
};

Echo.UserSession._reset = function(data) {
	var user = this;
	user.data = user._normalize($.extend({}, data));
	user.identity = {};
	var identities = user.get("activeIdentities");
	user.identity = identities && identities.length ? identities[0] : {};
};

Echo.UserSession._init = function(callback) {
	var user = this;
	user.state = "waiting";
	user._apiRequest(user.config.get("endpoints.whoami"), {
		"appkey": user.config.get("appkey"),
		"sessionID": Backplane.getChannelID()
	}, function(data) {
		// user is not logged in
		if (data.result && data.result == "session_not_found") {
			data = {};
		}
		user.state = "ready";
		user._reset(data);
		Echo.Events.publish("Echo.UserSession.onInit", {"data": data});
		(callback || function(){})();
	});
};

Echo.UserSession._normalize = function(data) {
	var user = this;
	data = data || {};
	data.echo = data.echo || {};
	data.echo.state = data.echo.state || "Untouched";
	data.echo.roles = data.echo.roles || [];
	data.echo.markers = data.echo.markers || [];
	data.poco = data.poco || {"entry": {}};
	data.sessionID = window.Backplane && Backplane.getChannelID() || undefined;
	data.identities = data.poco.entry.accounts || [];
	return data;
};

Echo.UserSession._onInit = function(callback) {
	if (!callback) return;
	var topic = "Echo.UserSession.onInit";
	var handlerId = Echo.Events.subscribe(topic, function() {
		Echo.Events.unsubscribe(topic, handlerId);
		callback();
	});
};

Echo.UserSession._attrLocation = function(key) {
	var user = this;
	return $.inArray(key, ["roles", "state", "markers"]) >= 0
		? user.data.echo
		: user.identity;
};

// functions delegated by the user.is(..) call

Echo.UserSession._isLogged = function() {
	var user = this;
	var activeIdentities = user.get("activeIdentities");
	return !!(activeIdentities && activeIdentities.length);
};

// functions delegated by the user.set(..) call

Echo.UserSession._setName = function(value) {
	var user = this;
	user.identity.displayName = value;
};

// functions delegated by the user.get(..) call

Echo.UserSession._getActiveIdentities = function() {
	var user = this;

	if (!user.data.poco || !user.data.poco.entry) return;

	// check if we already have this information
	if (user.identity && user.identity.activeIdentities) {
		return user.identity.activeIdentities;
	}

	var identities = $.map(user.data.poco.entry.accounts || [], function(entry) {
		if (entry.loggedIn == "true") return entry;
	});

	// cache data for next calls
	if (user.identity) {
		user.identity.activeIdentities = identities;
	}
	return identities;
};

Echo.UserSession._getAvatar = function() {
	var user = this;
	user.identity.avatar = user.identity.avatar ||
		Echo.Utils.foldl(undefined, user.identity.photos || [], function(img) {
			if (img.type == "avatar") return img.value;
		});
	return user.identity.avatar;
};

Echo.UserSession._getName = function() {
	var user = this, identity = user.identity;
	return identity ? (identity.displayName || identity.username) : undefined;
};

// functions delegated by the user.has(..) call

Echo.UserSession._hasIdentity = function(identityUrl) {
	var user = this, hasIdentity = false;
	$.each(user.data.identities, function(i, identity) {
		if (identity.identityUrl && identity.identityUrl == identityUrl) {
			hasIdentity = true;
			return false; // break
		}
	});
	return hasIdentity;	
};

// functions delegated by the user.any(..) call

Echo.UserSession._anyMarker = function(value) {
	var user = this;
	return user.any("markers", value);
};

Echo.UserSession._anyRole = function(value) {
	var user = this;
	return user.any("roles", value);
};

})(jQuery);
