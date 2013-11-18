define("echo/streamserver/plugins/janrainAuth", [
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/identityserver/controls/auth"
], function($, Plugin, Utils, Auth) {
"use strict";

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.JanrainAuth
 * Janrain Social Sign-in Widget integration with Echo Submit Control.
 *
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "JanrainAuth",
 * 			"submitPermissions": "forceLogin",
 * 			"appId": "echo"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the ["How to initialize Echo components"](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.manifest("JanrainAuth", "Echo.StreamServer.Controls.Submit");

plugin.init = function() {
	if (this._userStatus() === "forcedLogin") {
		this.extendTemplate("replace", "header", plugin.templates.forcedLogin);
	}
	this.extendTemplate("insertBefore", "header", plugin.templates.auth);
	this.component.addPostValidator(this._validator());
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
	 * <a href="http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/" target="_blank">documentation</a>
	 *
	 * Example:
	 * 	{
	 * 		"providersPerPage": 4,
	 * 		"format": "two column"
	 * 		// ...
	 * 	}
	 */
	"signinWidgetConfig": {},

	/**
	 * @cfg {String} submitPermissions
	 * Specifies the permitted commenting modes. The two options are possible:
	 *
	 * + "allowGuest" - allows to guest users submit an activity item (comment etc)
	 * + "forceLogin" - submit permissions allowed only for logged in users
	 */
	"submitPermissions": "allowGuest"
};

plugin.enabled = function() {
	return this.component.user && this.component.user.get("sessionID") &&
		this.config.get("appId") && this.config.get("buttons").length;
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"youMustBeLoggedIn": "You must be logged in to comment"
};

plugin.dependencies = [{
	"control": "Echo.IdentityServer.Controls.Auth",
	"url": "{config:cdnBaseURL.sdk}/identityserver.pack.js"
}];

/**
 * @echo_template
 */
plugin.templates.auth = '<div class="{plugin.class:auth}"></div>';

/**
 * @echo_template
 */
plugin.templates.forcedLogin =
	'<div class="echo-primaryFont {class:header}">' +
		'<span class="echo-secondaryColor {plugin.class:forcedLoginMessage}">' +
			'{plugin.label:youMustBeLoggedIn}' +
		'</span>' +
	'</div>';

/**
 * @echo_renderer
 */
plugin.component.renderers.header = function(element) {
	var plugin = this;
	if (plugin._userStatus() === "logged") {
		return element.empty();
	}
	return plugin.parentRenderer("header", arguments);
};

/**
 * @echo_renderer
 */
plugin.component.renderers.container = function(element) {
	var plugin = this;
	plugin.parentRenderer("container", arguments);
	var _class = function(postfix) {
		return plugin.cssPrefix + postfix;
	};
	return element
		.removeClass($.map(["logged", "anonymous", "forcedLogin"], _class).join(" "))
		.addClass(_class(plugin._userStatus()));
};

/**
 * @echo_renderer
 */
plugin.renderers.auth = function(element) {
	var plugin = this, fields = ["appId", "title", "width", "height", "buttons", "signinWidgetConfig"];
	var janrainConnectorPlugin = Utils.foldl({"name": "JanrainConnector"}, fields, function(param, acc) {
		if (plugin.config.get(param)) {
			acc[param] = plugin.config.get(param);
		}
		return acc;
	});
	new Auth(plugin.config.assemble({
		"target": element,
		"plugins": [janrainConnectorPlugin]
	}));
	return element;
};

plugin.methods._validator = function() {
	var plugin = this, submit = this.component;
	return function() {
		if (!submit.user.is("logged") && plugin._permissions() === "forceLogin") {
			plugin.view.get("forcedLoginMessage").addClass(plugin.cssPrefix + "error");
			return false;
		}
		return true;
	}
};

plugin.methods._permissions = function() {
	return this.config.get("submitPermissions");
};

plugin.methods._userStatus = function() {
	return this.component.user.is("logged")
		? "logged"
		: this._permissions() === "forceLogin"
			? "forcedLogin"
			: "anonymous";
};

plugin.css =
	'.{plugin.class:forcedLoginMessage} { font-size: 14px; font-weight: bold; }' +
	'.{plugin.class:error} { color: red; }';

return Plugin.create(plugin);

});
