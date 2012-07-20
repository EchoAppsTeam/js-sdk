(function($) {

if (Echo.Utils.isComponentDefined("Echo.IdentityServer.API")) return;

if (!Echo.IdentityServer) Echo.IdentityServer = {};

Echo.IdentityServer.API = {};

Echo.IdentityServer.API.Request = function(config) {
	config = $.extend({
		"onData": function() {},
		"onError": function() {},
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

Echo.IdentityServer.API.request = function(config) {
	return (new Echo.IdentityServer.API.Request(config));
};

})(jQuery);
