define("echo/cookie", [], function() {
	
	"use strict";

	var Cookie;

	//if (!window.Echo) window.Echo = {};

	//if (Echo.Cookie) return;

	var _pluses = /\+/g;
	var _decode = function(s) {
		return decodeURIComponent(s.replace(_pluses, " "));
	};

	/**
	 * @class Cookie
	 * Library to work with cookies
	 *
	 * Example:
	 *
	 *     Cookie.set("key", "value");
	 *     Cookie.get("key"); // returns "value"
	 *
	 *     Cookie.remove("key");
	 *     Cookie.get("key"); // returns "undefined"
	 *
	 *     Cookie.set("key2", "value2", {"expires": 7}); // this cookie expires in 7 days
	 *
	 * @package loader.js
	 */
	Cookie = {};

	/**
	 * @static
	 * Method to get cookie value.
	 *
	 * @param {String} name
	 * Cookie name.
	 *
	 * @return {String|undefined}
	 */
	Cookie.get = function(name) {
		var cookies = document.cookie.split("; ");
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split("=");
			if (_decode(parts.shift()) === name) {
				return _decode(parts.join("="));
			}
		}
	};

	/**
	 * @static
	 * Method to set a particular cookie in the browser.
	 *
	 * @param {String} name
	 * Cookie name.
	 *
	 * @param {Mixed} value
	 * Any non-object value for cookie.
	 *
	 * @param {Object} options
	 *
	 * @param {Number} [options.expires]
	 * Number of days in which the cookie expires.
	 *
	 * @param {String} [options.path]
	 * Path to the page which the cookie is applied to.
	 *
	 * @param {String} [options.domain]
	 * Domain for which the cookie is applied to.
	 *
	 * @param {Boolean} [options.secure=false]
	 * Specifies if this cookie should be secure or not.
	 */
	Cookie.set = function(name, value, options) {
		options = options || {};
		if (typeof options.expires === "number") {
			var days = options.expires;
			var d = options.expires = new Date();
			d.setTime(d.getTime() + days * 86400 * 1000);
		}
		document.cookie = [
			encodeURIComponent(name), "=", encodeURIComponent(value),
			options.expires ? "; expires=" + options.expires.toUTCString() : "",
			options.path ? "; path=" + options.path : "",
			options.domain ? "; domain=" + options.domain : "",
			options.secure ? "; secure" : ""
		].join("");
	};

	/**
	 * @static
	 * Method to remove particular cookie value.
	 *
	 * @param {String} name
	 * Cookie name.

	 * @param {Object} options
	 *
	 * @param {String} [options.path]
	 * Path to the page which cookie is applied to.
	 *
	 * @param {String} [options.domain]
	 * Domain for which cookie is applied to.
	 *
	 * @param {Boolean} [options.secure=false]
	 * Specifies if the cookie secure or not.
	 */
	Cookie.remove = function(name, options) {
		options = options || {};
		if (typeof Cookie.get(name) !== "undefined") {
			options.expires = -1;
			Cookie.set(name, "", options);
		}
	};

});
