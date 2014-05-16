(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.IdentityServer.Controls.Auth.Plugins.JanrainConnector
 * Janrain Social Sign-in Widget integration with Echo Auth Control.
 *
 *		new Echo.IdentityServer.Controls.Auth({
 *			"target": document.getElementById("auth"),
 *			"appkey": "echo.jssdk.demo.aboutecho.com",
 *			"plugins": [{
 *				"name": "JanrainConnector",
 *				"appId": "echo"
 *			}]
 *		});
 *
 * More information regarding the plugins installation can be found
 * in the ["How to initialize Echo components"](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
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
	$.each(plugin.config.get("buttons", []), function(i, type) {
		var identityManager = component.config.get("identityManager." + type, {});
		var configStr = encodeURIComponent(Echo.Utils.objectToJSON(plugin.config.get("signinWidgetConfig")));
		identityManager.url = component.config.get("cdnBaseURL.sdk") +
			"/third-party/janrain/auth.html?appId=" + plugin.config.get("appId") +
			"&signinConfig=" + configStr + "&bpChannel=";
		$.each(["title", "width", "height"], function(i, param) {
			if (identityManager[param]) return;
			identityManager[param] = plugin.config.get(param);
		});
		component.config.set("identityManager." + type, identityManager);
	});
};

plugin.config = {
	/**
	 * @cfg {String} appId (required)
	 * A string that identifies the application.
	 * Available from Janrain Dashboard home page under "Application info"
	 * (part of the app domain before rpxnow.com).
	 * For example in https://echo.rpxnow.com appId is "echo"
	 */
	"appId": "",

	/**
	 * @cfg {String[]} [buttons=["login"]]
	 * A list of buttons that should be rendered in the Auth Control. May include
	 * any of the following strings (order doesn't matter):
	 *
	 * + "login"
	 * + "edit"
	 * + "signup"
	 */
	"buttons": ["login"],

	/**
	 * @cfg {String} [title]
	 * Title of the auth modal popup
	 */
	"title": "",

	/**
	 * @cfg {Number} [height]
	 * Height of the visible area of the auth modal popup
	 */
	"height": 260,

	/**
	 * @cfg {Number} [width]
	 * Width of the visible area of the auth modal popup
	 */
	"width": 420,

	/**
	 * @cfg {Object} [signinWidgetConfig]
	 * Container for the options specific to Janrain Social Sign-in Widget.
	 * Full list of available options can be found in the
	 * <a href="http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/" target="_blank">documentation</a>.
	 *
	 *		Example:
	 *		{
	 *			"providersPerPage": 4,
	 *			"format": "two column"
	 *			// ...
	 *		}
	 */
	"signinWidgetConfig": {}
};

plugin.enabled = function() {
	return this.config.get("appId") && this.config.get("buttons").length;
};

Echo.Plugin.create(plugin);

})(Echo.jQuery);
