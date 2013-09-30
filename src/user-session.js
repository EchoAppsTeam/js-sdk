(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.UserSession")) return;

/**
 * @singleton
 * @class Echo.UserSession
 * Class implements the interface to work with the user object.
 * The Echo.UserSession class is used in pretty much all applications
 * built on top of the Echo JS SDK.
 *
 * Example:
 * 	var user = Echo.UserSession({"appkey": "echo.jssdk.demo.aboutecho.com"});
 * 	user.is("logged"); // returns true or false
 *
 * @package environment.pack.js
 *
 * @constructor
 * Class constructor which accepts the object which represents the
 * configuration as the argument. The class is a singleton, i.e. one
 * user instance is shared across the different apps on the page.
 *
 * @param {Object} config
 * Class configuration, which is an object with the following fields:
 *
 * @param {String} config.appkey
 * Echo application key to make user initialization request.
 *
 * @param {String} [config.defaultAvatar]
 * Default avatar URL which will be used for the user in case there is
 * no avatar information defined in the user profile. Also used for
 * anonymous users.
 *
 * @return {Object}
 * The reference to the Echo.UserSession class.
 */
Echo.UserSession = function(config) {
	return Echo.UserSession._construct(config);
};

/**
 * Method to define specific user object field value.
 *
 * This function allows to define the value for the corresponding
 * field in the user object.
 *
 * @param {String} key
 * Defines the key where the given data should be stored. The following keys are available:
 *
 * + "name"
 * + "roles"
 * + "state"
 * + "markers"
 *
 * @param {Mixed} value
 * The corresponding value which should be defined for the key.
 */
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

/**
 * Method to access specific user object field.
 *
 * This function returns the corresponding value of the given key or the
 * default value if specified in the second argument.
 *
 * @param {String} key
 * Defines the key for which the value needs to be retrieved. The following keys are available:
 *
 * + "avatar"
 * + "name"
 * + "sessionID"
 * + "email"
 * + "roles"
 * + "state"
 * + "markers"
 * + "activeIdentities"
 * + "identityUrl"
 *
 * @param {Mixed} [defaults]
 * Default value if no corresponding key was found in the user object.
 * Note: only the `undefined` JS statement triggers the default value usage.
 * The `false`, `null`, `0`, `[]` are considered as a proper value.
 *
 * @return {Mixed}
 * The corresponding value found in the user object.
 */
Echo.UserSession.get = function(key, defaults) {
	var user = this;
	var value = user._maybeDelegate({
		"action": "get",
		"key": key,
		"fallback": function() {
			return user._attrLocation(key)[key];
		}
	});
	return typeof value === "undefined" ? defaults : value;
};

/**
 * Method for checking if the user object conforms a certain condition.
 *
 * The argument of the function defines the condition which should be checked.
 * The list of built-in conditions is pre-defined. For instance, you can check
 * if the user is logged in or not by passing the "logged" string as the function
 * value.
 *
 * @param {String} key
 * Defines the name of the condition to check. The following keys are available:
 *
 * + "logged"
 * + "admin"
 *
 * @return (Boolean)
 * True or false if condition was met or not respectively.
 */
Echo.UserSession.is = function(key) {
	return this._maybeDelegate({
		"action": "is",
		"key": key
	});
};

/**
 * Method to check if the user object has a given value defined for a certain
 * field.
 *
 * @param {String} key
 * Defines the name of the user object field. The following keys are available:
 *
 * + "identity"
 * + "marker"
 * + "role"
 *
 * @param {Mixed} value
 * Defines the desired string or integer value.
 *
 * @return (Boolean)
 * True or false if condition was met or not respectively.
 */
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

/**
 * Method to check if the value of a certain user object field belongs to the
 * array of values.
 *
 * This function is very similar to the Echo.UserSession.has with the difference
 * that the value of the second argument should be `Array`.
 *
 * @param {String} key
 * Defines the name of the user object field. The following keys are available:
 *
 * + "markers"
 * + "roles"
 *
 * @param {Array} values
 * Defines the set of values.
 *
 * @return (Boolean)
 * True or false if condition was met or not respectively.
 */
Echo.UserSession.any = function(key, values) {
	var user = this;
	return user._maybeDelegate({
		"action": "any",
		"key": key,
		"arg": [values],
		"fallback": function() {
			var satisfies = false;
			if (!user.identity) return false;
			$.each(values, function(i, value) {
				var data = user.get(key, {});
				if ((typeof data === "string" && data === value) ||
					($.isArray(data) && $.inArray(value, data) >= 0)) {
						satisfies = true;
						return false; // break
				}
			});
			return satisfies;
		}
	});
};

/**
 * Method to log the user out.
 *
 * This function is async, so you should pass the callback if you want
 * to perform any additional operations after the logout event.
 *
 * @param {Function} callback
 * The callback executed as soon as the logout action was completed.
 * The callback is executed without arguments.
 */
Echo.UserSession.logout = function(callback) {
	var user = this;
	if (!user.is("logged")) {
		user._reset({});
		callback && callback();
		return;
	}
	user._logoutRequest({
		"sessionID": user.get("sessionID")
	}, function(data) {
		user._onInit(callback);
		Backplane.expectMessages("identity/ack");
	});
};

Echo.UserSession._construct = function(config) {
	if (!config) {
		Echo.Utils.log({
			"type": "error",
			"component": "Echo.UserSession",
			"message": "Unable to initialize user session, config is invalid",
			"args": {"config": config}
		});
		return;
	}
	var user = this;
	var callback = function() {
		config.ready && config.ready.call(user);
	};
	user.state = user.state || "init";

	// checking if the Backplane configuration became defined on the page,
	// in this case if the Echo.UserSession was initialized previously - make complete
	// re-initialization from scratch to update the singleton properties
	if (!user._sessionID && user.get("sessionID")) {
		user._sessionID = user.get("sessionID");
		user.state = user.state === "ready" ? "init" : user.state;
	}

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
			user.cache = {};
			user.config = new Echo.Configuration(config, user._getDefaultConfig());
			user._listenEvents();
			user._init(callback);
	}
	return user;
};

Echo.UserSession._maybeDelegate = function(config) {
	var user = this;
	var name = Echo.Utils.capitalize(config.key);
	var handler = user["_" + config.action + name];
	return handler
		? handler.apply(this, config.arg || [])
		: (config.fallback ? config.fallback() : undefined);
};

Echo.UserSession._getDefaultConfig = function() {
	return {
		"appkey": "",
		"endpoints": {
			"logout": "{%=baseURLs.api.submissionproxy%}/v2/",
			"whoami": "{%=baseURLs.api.streamserver%}/v1/users/"
		},
		"useSecureAPI": false,
		"fakeIdentityURL": "http://js-kit.com/ECHO/user/fake_user"
	};
};

Echo.UserSession._logoutRequest = function(data, callback) {
	(new Echo.API.Request({
		"apiBaseURL": this.config.get("endpoints.logout"),
		"secure": this.config.get("useSecureAPI"),
		"endpoint": "logout",
		// FIXME: "logout" endpoint supports only JSONP request type
		"transport": "jsonp",
		"onData": callback,
		"data": data
	})).request();
};

Echo.UserSession._whoamiRequest = function(args) {
	Echo.IdentityServer.API.request({
		"apiBaseURL": this.config.get("endpoints.whoami"),
		"secure": this.config.get("useSecureAPI"),
		"endpoint": "whoami",
		"onData": args.onData,
		"onError": args.onError,
		"data": args.data
	}).send();
};

Echo.UserSession._listenEvents = function() {
	var user = this;
	if (user.backplaneSubscriptionID) return;
	user.backplaneSubscriptionID = Backplane.subscribe(function(message) {
		if (message.type !== "identity/ack") return;
		user._init(function() {
			/**
			 * @echo_event Echo.UserSession.onInvalidate
			 * Triggered after user has logged in or logged out.
			 *
			 * @param {String} topic
			 * Name of the event to subscribe (ex: "Echo.UserSession.onInvalidate").
			 *
			 * @param {Object} data
			 * Object which is returned by the users/whoami API endpoint or empty
			 * object for logout events.
			 *
			 * @param {Object} data.echo
			 * Echo section contains three elements.
			 *
			 * @param {Array} data.echo.roles
			 * Array of roles.
			 *
			 * @param {String} data.echo.state
			 * State of user.
			 *
			 * @param {Array} data.echo.marker
			 * Markers act as hidden metadata for a user.
			 *
			 * @param {Object} data.poco
			 * Contains user record representation in Portable Contacts format.
			 *
			 * @param {Object} data.poco.entry
			 * Portable contacts object.
			 *
			 * @param {Array} data.poco.entry.accounts
			 * Array of user identities held in this contact.
			 *
			 * @param {String} data.poco.entry.id
			 * Unique user identifier automatically assigned by the platform.
			 *
			 * @param {Number} data.poco.entry.startIndex
			 * The index of the first result returned in this response.
			 *
			 * @param {Number} data.poco.entry.itemsPerPage
			 * The number of results returned per page in this response.
			 *
			 * @param {Number} data.poco.entry.totalResults
			 * The total number of contacts found.
			 */
			Echo.Events.publish({
				"topic": "Echo.UserSession.onInvalidate",
				"data": user.is("logged") ? user.data : {}
			});
		});
	});
};

Echo.UserSession._reset = function(data) {
	var user = this;
	user.data = user._normalize($.extend({}, data));
	user.identity = {};
	user.cache = {};
	var identities = user.get("activeIdentities");
	user.identity = identities && identities.length ? identities[0] : {};
};

Echo.UserSession._init = function(callback) {
	var user = this;
	user.state = "waiting";
	var handler = function(data) {
		// user is not logged in
		if (!data || data.result && data.result === "session_not_found") {
			data = {};
		}
		user.state = "ready";
		user._reset(data);
		/**
		 * @echo_event Echo.UserSession.onInit
		 * Triggered when the user is initialized on the page.
		 *
		 * @param {String} topic
		 * Name of the event to subscribe (ex: "Echo.UserSession.onInit").
		 *
		 * @param {Object} data
		 * Object which is returned by the users/whoami API endpoint or
		 * empty object for logout events.
		 *
		 * @param {Object} data.echo
		 * Echo section contains three elements.
		 *
		 * @param {Array} data.echo.roles
		 * Array of roles.
		 *
		 * @param {String} data.echo.state
		 * State of user.
		 *
		 * @param {Array} data.echo.marker
		 * Markers act as hidden metadata for a user.
		 *
		 * @param {Object} data.poco
		 * Contains user record representation in Portable Contacts format.
		 *
		 * @param {Object} data.poco.entry
		 * Portable contacts object.
		 *
		 * @param {Array} data.poco.entry.accounts
		 * Array of user identities held in this contact.
		 *
		 * @param {String} data.poco.entry.id
		 * Unique user identifier automatically assigned by the platform.
		 *
		 * @param {Number} data.poco.entry.startIndex
		 * The index of the first result returned in this response.
		 *
		 * @param {Number} data.poco.entry.itemsPerPage
		 * The number of results returned per page in this response.
		 *
		 * @param {Number} data.poco.entry.totalResults
		 * The total number of contacts found.
		 */
		Echo.Events.publish({
			"topic": "Echo.UserSession.onInit",
			"data": data
		});
		callback && callback();
	};
	if (user.get("sessionID")) {
		user._whoamiRequest({
			"data": {
				"appkey": user.config.get("appkey"),
				"sessionID": user.get("sessionID")
			},
			"onData": handler,
			"onError": function(response) {
				Echo.Utils.log({
					"type": "error",
					"component": "Echo.UserSession",
					"args": {"response": response},
					"message": "Unable to initialize user session, " +
						"error response from IdentityServer API received"
				});
				handler();
			}
		});
	} else {
		handler();
	}
};

Echo.UserSession._normalize = function(data) {
	data = data || {};
	data.echo = data.echo || {};
	data.echo.state = data.echo.state || "Untouched";
	data.echo.roles = data.echo.roles || [];
	data.echo.markers = data.echo.markers || [];
	data.poco = data.poco || {"entry": {}};
	data.identities = data.poco.entry.accounts || [];
	return data;
};

Echo.UserSession._onInit = function(callback) {
	if (!callback) return;
	Echo.Events.subscribe({
		"topic": "Echo.UserSession.onInit",
		"once": true,
		"handler": callback
	});
};

Echo.UserSession._attrLocation = function(key) {
	return ~$.inArray(key, ["roles", "state", "markers"])
		? this.data.echo
		: this.identity;
};

Echo.UserSession._extract = function(field, container, filter) {
	var user = this;
	user.identity[field] = typeof user.identity[field] !== "undefined"
		? user.identity[field]
		: Echo.Utils.foldl(undefined, user.identity[container] || [], filter);
	return user.identity[field];
};

Echo.UserSession._isLogged = function() {
	var activeIdentities = this.get("activeIdentities");
	return !!(activeIdentities && activeIdentities.length);
};

Echo.UserSession._isAdmin = function() {
	return this.any("roles", ["administrator", "moderator"]);
};

Echo.UserSession._setName = function(value) {
	this.identity.displayName = value;
};

Echo.UserSession._getActiveIdentities = function() {
	var user = this;

	if (!user.data.poco || !user.data.poco.entry) return;

	// check if we already have this information
	if (user.cache.activeIdentities) {
		return user.cache.activeIdentities;
	}

	var identities = $.map(user.data.poco.entry.accounts || [], function(entry) {
		if (entry.loggedIn === "true") return entry;
	});

	// cache data for next calls
	user.cache.activeIdentities = identities;

	return identities;
};

Echo.UserSession._getAvatar = function() {
	return this._extract("avatar", "photos", function(img) {
		if (img.type === "avatar") return img.value;
	});
};

Echo.UserSession._getName = function() {
	var identity = this.identity;
	return identity ? (identity.displayName || identity.username) : undefined;
};

Echo.UserSession._getEmail = function() {
	return this._extract("email", "emails", function(email) {
		if (email.primary === "true") return email.value;
	});
};

Echo.UserSession._getSessionID = function() {
	return Backplane.getChannelID();
};

Echo.UserSession._hasIdentity = function(identityUrl) {
	var user = this, hasIdentity = false;
	$.each(user.data.identities, function(i, identity) {
		if (identity.identityUrl && identity.identityUrl === identityUrl) {
			hasIdentity = true;
			return false; // break
		}
	});
	return hasIdentity;
};

Echo.UserSession._anyMarker = function(value) {
	return this.any("markers", value);
};

Echo.UserSession._anyRole = function(value) {
	return this.any("roles", value);
};

})(Echo.jQuery);
