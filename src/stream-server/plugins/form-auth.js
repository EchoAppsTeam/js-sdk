/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.FormAuth
 * Adds the authentication section to the Echo Submit control
 *     var identityManager = {"width": 400, "height": 240, "url": "http://example.com/auth"};
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Edit",
 *             "identityManager": {
 *                 "login": identityManager,
 *                 "signup": identityManager
 *             }
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("FormAuth", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	if (this._userStatus() === "forcedLogin") {
		this.extendTemplate("replace", "header", plugin.templates.forcedLogin);
	}
	this.extendTemplate("insertBefore", "header", plugin.templates.auth);
	this.component.addPostValidator(this._validator());
};

plugin.enabled = function() {
	return (this.component.user.get("sessionID") &&
		this.config.get("identityManager.login") &&
		this.config.get("identityManager.signup"));
};

plugin.dependencies = [{
	"url": Echo.Loader.config.cdnBaseURL + "sdk/identity-server.pack.js",
	"loaded": function() {
		return Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth");
	}
}];

plugin.config = {
/**
 * @cfg {Object} identityManager The list of handlers for login, edit and signup action. If some action is ommited then it will not be available for users in the Auth control. Each handler accepts sessionID as GET parameter. This parameter is necessary for communication with Backplane server. When handler finishes working it constructs the corresponding Backplane message (for login, signup or user data update) and sends this message to Backplane server.
 * @cfg {Object} [identityManager.login] Encapsulates data for login workflow
 * @cfg {Number} [identityManager.login.width] Specifies the width of the visible auth area
 * @cfg {Number} [identityManager.login.height] Specifies the height of the visible auth area
 * @cfg {String} [identityManager.login.url] Specifies the URL to be opened as an auth handler
 * @cfg {Object} [identityManager.signup] Encapsulates data for signup workflow
 * @cfg {Number} [identityManager.signup.width] Specifies the width of the visible auth area
 * @cfg {Number} [identityManager.signup.height] Specifies the height of the visible auth area
 * @cfg {String} [identityManager.signup.url] Specifies the URL to be opened as an auth handler
 * @cfg {Object} [identityManager.edit] Encapsulates data for edit workflow
 * @cfg {Number} [identityManager.edit.width] Specifies the width of the visible auth area
 * @cfg {Number} [identityManager.edit.height] Specifies the height of the visible auth area
 * @cfg {String} [identityManager.edit.url] Specifies the URL to be opened as an auth handler
 */
	"identityManager": {},
/**
 * @cfg {String} submitPermissions Specifies the permitted commenting modes. The two options are: "allowGuest" and "forceLogin".
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Edit",
 *             "identityManager": {
 *                 "login": identityManager,
 *                 "signup": identityManager
 *             },
 *             "submitPermissions": "forceLogin"
 *         }]
 *     });
 */
	"submitPermissions": "allowGuest"
};

plugin.labels = {
	"youMustBeLoggedIn": "You must be logged in to comment"
};

plugin.templates.auth = '<div class="{plugin.class:auth}"></div>';

plugin.templates.forcedLogin =
	'<div class="{class:header} echo-primaryFont">' +
		'<span class="{plugin.class:forcedLoginMessage} echo-secondaryColor">' +
			'{plugin.label:youMustBeLoggedIn}' +
		'</span>' +
	'</div>';

plugin.component.renderers.header = function(element) {
	var plugin = this;
	if (this._userStatus() === "logged") {
		return element.empty();
	}
	return plugin.parentRenderer("header", arguments);
};

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

plugin.renderers.auth = function(element) {
	var plugin = this;
	new Echo.IdentityServer.Controls.Auth(plugin.config.assemble({
		"target": element,
		"identityManager": plugin.config.get("identityManager")
	}));
	return element;
};

plugin.methods._validator = function() {
	var plugin = this, submit = this.component;
	return function() {
		if (!submit.user.is("logged") && plugin._permissions() === "forceLogin") {
			plugin.dom.get("forcedLoginMessage").addClass(plugin.cssPrefix + "error");
			return false;
		}
		return true;
	}
};

plugin.methods._permissions = function() {
	return this.config.get("submitPermissions");
};

plugin.methods._userStatus = function(application) {
	return this.component.user.is("logged")
		? "logged"
		: this._permissions() == "forceLogin"
			? "forcedLogin"
			: "anonymous";
};

plugin.css =
	'.{plugin.class:forcedLoginMessage} { font-size: 14px; font-weight: bold; }' +
	'.{plugin.class:error} { color: red; }';

Echo.Plugin.create(plugin);
