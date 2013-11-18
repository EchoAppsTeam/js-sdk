define("echo/streamserver/plugins/formAuth", [
	"jquery",
	"echo/plugin",
	"echo/identityserver/controls/Auth"
], function($, Plugin, Auth) {
"use strict";

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.FormAuth
 * Adds the authentication section to the Echo Submit control
 *
 * 	var identityManager = {
 * 		"width": 400,
 * 		"height": 240,
 * 		"url": "http://example.com/auth"
 * 	};
 *
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "FormAuth",
 * 			"submitPermissions": "forceLogin",
 * 			"identityManager": {
 * 				"login": identityManager,
 * 				"signup": identityManager
 * 			}
 * 		}]
 * 	});
 *
 * Note: it is strongly recommended to use
 * {@link Echo.StreamServer.Controls.Submit.Plugins.JanrainAuth JanrainAuth} plugin
 * in case of integration with Janrain authentication provider because it is
 * based on the most current <a href="http://janrain.com/products/engage/social-login/" target="_blank">Janrain Social Login Widget</a>
 * implementation.
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Plugin.manifest("FormAuth", "Echo.StreamServer.Controls.Submit");

plugin.init = function() {
	if (this._userStatus() === "forcedLogin") {
		this.extendTemplate("replace", "header", plugin.templates.forcedLogin);
	}
	this.extendTemplate("insertBefore", "header", plugin.templates.auth);
	this.component.addPostValidator(this._validator());
};

plugin.config = {
	/**
	 * @cfg {Object} identityManager The list of handlers for login, edit
	 * and signup actions. If some action is omitted then it will not be
	 * available for users in the Auth control. Each handler accepts sessionID
	 * as GET parameter. This parameter is necessary for communication with
	 * the Backplane server. When the handler finishes working it constructs the
	 * corresponding Backplane message (for login, signup or user data update)
	 * and sends this message to the Backplane server.
	 *
	 * @cfg {Object} [identityManager.login]
	 * Encapsulates data for login workflow
	 *
	 * @cfg {Number} [identityManager.login.width]
	 * Specifies the width of the visible auth area
	 *
	 * @cfg {Number} [identityManager.login.height]
	 * Specifies the height of the visible auth area
	 *
	 * @cfg {String} [identityManager.login.url]
	 * Specifies the URL to be opened as an auth handler
	 *
	 * @cfg {String} [identityManager.login.title]
	 * Specifies the Title of the auth modal dialog
	 *
	 * @cfg {Object} [identityManager.signup]
	 * Encapsulates data for signup workflow
	 *
	 * @cfg {Number} [identityManager.signup.width]
	 * Specifies the width of the visible auth area
	 *
	 * @cfg {Number} [identityManager.signup.height]
	 * Specifies the height of the visible auth area
	 *
	 * @cfg {String} [identityManager.signup.url]
	 * Specifies the URL to be opened as an auth handler
	 *
	 * @cfg {String} [identityManager.signup.title]
	 * Specifies the Title of the auth modal dialog
	 *
	 * @cfg {Object} [identityManager.edit]
	 * Encapsulates data for edit workflow
	 *
	 * @cfg {Number} [identityManager.edit.width]
	 * Specifies the width of the visible auth area
	 *
	 * @cfg {Number} [identityManager.edit.height]
	 * Specifies the height of the visible auth area
	 *
	 * @cfg {String} [identityManager.edit.url]
	 * Specifies the URL to be opened as an auth handler
	 *
	 * @cfg {String} [identityManager.edit.title]
	 * Specifies the Title of the auth modal dialog
	 */
	"identityManager": {},

	/**
	 * @cfg {String} submitPermissions
	 * Specifies the permitted commenting modes.
	 * The two options are:
	 *
	 * + "allowGuest" - allows to guest users submit an activity item (comment etc)
	 * + "forceLogin" - submit permissions allowed only for logged in users
	 */
	"submitPermissions": "allowGuest"
};

plugin.enabled = function() {
	return (this.component.user && this.component.user.get("sessionID") &&
		this.config.get("identityManager.login") &&
		this.config.get("identityManager.signup"));
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
	'<div class="{class:header} echo-primaryFont">' +
		'<span class="{plugin.class:forcedLoginMessage} echo-secondaryColor">' +
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
	var plugin = this;
	new Auth(plugin.config.assemble({
		"target": element,
		"identityManager": plugin.config.get("identityManager")
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
