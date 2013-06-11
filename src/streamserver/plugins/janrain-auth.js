(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.JanrainAuth
 * Adds the possibility to login via Janrain providing only Janrain application name.
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
 * in the ["How to initialize Echo components"](#!/guide/how_to_initialize_components-section-2) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Echo.Plugin.manifest("JanrainAuth", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	if (this._userStatus() === "forcedLogin") {
		this.extendTemplate("replace", "header", plugin.templates.forcedLogin);
	}
	this.extendTemplate("insertBefore", "header", plugin.templates.auth);
	this.component.addPostValidator(this._validator());
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
	"extParams": {},

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
		this.config.get("appId") && this.config.get("sections").length;
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

plugin.templates.auth = '<div class="{plugin.class:auth}"></div>';

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
	var plugin = this, fields = ["appId", "width", "height", "sections", "extParams"];
	var janrainConnectorPlugin = Echo.Utils.foldl({"name": "JanrainConnector"}, fields, function(param, acc) {
		if (plugin.config.get(param)) {
			acc[param] = plugin.config.get(param);
		}
		return acc;
	});
	new Echo.IdentityServer.Controls.Auth(plugin.config.assemble({
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

Echo.Plugin.create(plugin);

})(Echo.jQuery);
