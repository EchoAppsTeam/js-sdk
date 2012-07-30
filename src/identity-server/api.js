(function($) {

if (Echo.Utils.isComponentDefined("Echo.IdentityServer.API")) return;

/**
 * @class
 * Class implements the interaction with the <a href="http://wiki.aboutecho.com/w/page/35104702/API-section-users" target="_blank">Echo Users API</a> 
 */
if (!Echo.IdentityServer) Echo.IdentityServer = {};

Echo.IdentityServer.API = {};

/**
 * @constructor
 * Constructor initializing class using configuration data.
 * @param {Object} config Configuration data.
 */
Echo.IdentityServer.API.Request = function(config) {
	config = $.extend({
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
		"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity"
	}, config);
	config = this._wrapTransportEventHandlers(config);
	Echo.IdentityServer.API.Request.parent.constructor.call(this, config);
};

Echo.Utils.inherit(Echo.IdentityServer.API.Request, Echo.API.Request);

Echo.IdentityServer.API.Request.prototype._prepareURI = function() {
	return this.config.get("submissionProxyURL");
};

Echo.IdentityServer.API.Request.prototype._wrapTransportEventHandlers = function(config) {
	var self = this;
	var _config = $.extend({}, config);
	return $.extend(config, {
		"onData": function(response, requestParams) {
			self._onData(response, _config);
		}
	});
};

Echo.IdentityServer.API.Request.prototype._onData = function(response, config) {
	if (response && response.result === "error") {
		config.onError(response);
		return;
	}
	config.onData(response);
};

Echo.IdentityServer.API.Request.prototype._update = function(args) {
	var content = $.extend(this.config.get("data.content"), {
		"endpoint": "users/update"
	});
	console.log(content);
	this.request(
		$.extend(this.config.get("data"), {
			"content": Echo.Utils.object2JSON(content)
		})
	);
};

/**
 * @static
 * Alias for the class constructor.
 * @param {Object} Configuration data.
 * @return {Class} New class instance.
 */
Echo.IdentityServer.API.request = function(config) {
	return (new Echo.IdentityServer.API.Request(config));
};

})(jQuery);
