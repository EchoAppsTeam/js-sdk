define("echo/identityserver/api", ["jquery", "echo/api", "echo/utils"], function(jQuery, API, Utils) {

	"use strict";

	var $ = jQuery,
		IdentityServer = {};
	
	IdentityServer.API = {};

	//if (Echo.IdentityServer && Echo.IdentityServer.API) return;

	//if (!Echo.IdentityServer) Echo.IdentityServer = {};

	//Echo.IdentityServer.API = {};

	/**
	 * @class IdentityServer.API.Request
	 * Class implements the interaction with the <a href="http://wiki.aboutecho.com/w/page/35104702/API-section-users" target="_blank">Echo Users API</a> 
	 *
	 *     var request = IdentityServer.API.request({
	 *         "endpoint": "whoami",
	 *         "apiBaseURL": "http://api.echoenabled.com/v1/users/",
	 *         "data": {
	 *             "appkey": "echo.jssdk.demo.aboutecho.com",
	 *             "sessionID": "http://api.echoenabled.com/v1/bus/jskit/channel/137025938529801703"
	 *         },
	 *         "onData": function(data, extra) {
	 *             // handle successful request here...
	 *         },
	 *         "onError": function(data, extra) {
	 *             // handle failed request here...
	 *         }
	 *     });
	 *
	 *     request.send();
	 *
	 * @extends API.Request
	 *
	 * @package api.pack.js
	 *
	 * @constructor
	 * Constructor initializing class using configuration data.
	 * @param {Object} config Configuration data.
	 */
	IdentityServer.API.Request = Utils.inherit(API.Request, function(config) {
		config = $.extend({
			/**
			 * @cfg {String} [endpoint] Specifies the API endpoint. The only "whoami" endpoint is implemented now.
			 */
			/**
			 * @cfg {Function} [onData] Callback called after API request succeded.
			 */
			"onData": function() {},
			/**
			 * @cfg {Function} [onError] Callback called after API request failed. 
			 */
			"onError": function() {},
			/**
			 * @cfg {String} [submissionProxyURL] Specifes the URL to the submission proxy service.
			 */
			"submissionProxyURL": "https:{%=baseURLs.api.submissionproxy%}/v2/esp/activity"
		}, config);
		config = this._wrapTransportEventHandlers(config);
		IdentityServer.API.Request.parent.constructor.call(this, config);
	});

	IdentityServer.API.Request.prototype._prepareURL = function() {
		return this.config.get("endpoint") === "whoami"
			? IdentityServer.API.Request.parent._prepareURL.call(this)
			: this.config.get("submissionProxyURL");
	};

	IdentityServer.API.Request.prototype._wrapTransportEventHandlers = function(config) {
		var self = this;
		var _config = $.extend({}, config);
		return $.extend({}, config, {
			"onData": function(response, requestParams) {
				self._onData(response, _config);
			}
		});
	};

	IdentityServer.API.Request.prototype._onData = function(response, config) {
		if (response && response.result === "error") {
			config.onError(response);
			return;
		}
		config.onData(response);
	};

	IdentityServer.API.Request.prototype._update = function(args) {
		var content = $.extend({}, this.config.get("data.content"), {
			"endpoint": "users/update"
		});
		this.request(
			$.extend({}, this.config.get("data"), {
				"content": Utils.objectToJSON(content)
			})
		);
	};

	IdentityServer.API.Request.prototype._whoami = function(args) {
		this.request(args);
	};

	/**
	 * @static
	 * Alias for the class constructor.
	 * @param {Object} Configuration data.
	 * @return {Object} New class instance.
	 */
	IdentityServer.API.request = function(config) {
		return (new IdentityServer.API.Request(config));
	};

	return IdentityServer.API;
});
