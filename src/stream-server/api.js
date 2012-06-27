(function($) {

"use strict";

if (Echo.StreamServer && Echo.StreamServer.API) return;

if (!Echo.StreamServer) Echo.StreamServer = {};

Echo.StreamServer.API = {};

Echo.StreamServer.API.Request = function(config) {
	var parentConfig = (new this.parentProto.constructor(config)).config;
	this.config = new Echo.Configuration(config, parentConfig.getAsHash());
};

Echo.Utils.inherit(Echo.StreamServer.API.Request, Echo.API.Request);

Echo.StreamServer.API.Request.prototype._search = function() {
	// TODO:
	//  - check "recurring" flag (live updates)
	//  - handle timeout errors
	this.request();
};

Echo.StreamServer.API.Request.prototype._submit = function() {
	// TODO:
	//  - AS JSON -> KV GET
	// this.request();
};

Echo.StreamServer.API.request = function(config) {
	return (new Echo.StreamServer.API.Request(config));
};

})(jQuery);
