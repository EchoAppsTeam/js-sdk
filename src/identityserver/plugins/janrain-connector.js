(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.IdentityServer.Controls.Auth.Plugins.JanrainConnector
 * Adds the possibility to login via Janrain providing only Janrain application name.
 *
 * 	new Echo.IdentityServer.Controls.Auth({
 * 		"target": document.getElementById("auth"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "JanrainConnector",
 * 			"appId": "echo"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the ["How to initialize Echo components"](#!/guide/how_to_initialize_components-section-2) guide.
 *
 * @extends Echo.Plugin
 *
 * @package identityserver/plugins.pack.js
 * @package identityserver.pack.js
 */
var plugin = Echo.Plugin.manifest("JanrainConnector", "Echo.IdentityServer.Controls.Auth");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this, component = this.component;
	$.each(plugin.config.get("sections") || [], function(i, type) {
		var identityManager = component.config.get("identityManager." + type, {});
		var extParamsStr = encodeURIComponent(Echo.Utils.objectToJSON(plugin.config.get("extParams")));
		identityManager.url = component.config.get("cdnBaseURL.sdk") +
			"/third-party/janrain/auth.html?appId=" + plugin.config.get("appId") +
			"&extParams=" + extParamsStr + "&bpChannel=";
		$.each(["title", "width", "height"], function(i, param) {
			if (identityManager[param]) return;
			identityManager[param] = plugin.config.get(param);
		});
		component.config.set("identityManager." + type, identityManager);
	});
};

plugin.config = {
	/**
	 * @cfg {String} appId
	 * A string that identifies the application.
	 * Available from Janrain Dashboard home page under "Application info."
	 * (part of the app domain before rpxnow.com).
	 * For example in https://echo.rpxnow.com appId is "echo"
	 */
	"appId": "",

	/**
	 * @cfg {String[]} [sections=["login"]]
	 * A list of sections that should be rendered in the Auth Control. May include
	 * any of the following strings (order doesn't matter):
	 *
	 * + "login"
	 * + "edit"
	 * + "signup"
	 */
	"sections": ["login"],

	/**
	 * @cfg {String} [title]
	 * Title of the auth modal dialog
	 */
	"title": "",

	/**
	 * @cfg {Number} [height]
	 * Height of the visible auth area
	 */
	"height": 260,

	/**
	 * @cfg {Number} [width]
	 * Width of the visible auth area
	 */
	"width": 420,

	/**
	 * @cfg {Object} [extParams]
	 * Container for the options specific to Janrain Social Sign-in Widget.
	 * Full list of available options can be found in the
	 * <a href="http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/" target="_blank">documentation</a>
	 *
	 * Example:
	 * 	{
	 * 		"providersPerPage": 4,
	 * 		"format": "two column"
	 * 		// ...
	 * 	}
	 */
	"extParams": {}
};

Echo.Plugin.create(plugin);

})(Echo.jQuery);
