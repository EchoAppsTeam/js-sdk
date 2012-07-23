(function($) {

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
var plugin = Echo.Plugin.skeleton("FormAuth", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {

	// checking if it makes sense to init the plugin
	if (!this.component.user.get("sessionID") ||
		!this.config.get("identityManager.login") ||
		!this.config.get("identityManager.signup")) return false;

	if (this._userStatus() == "forcedLogin") {
		this.extendTemplate(plugin.templates.forcedLogin, "replace", "header");
	}
	this.extendTemplate(plugin.templates.auth, "insertBefore", "header");
	this.extendRenderer("auth", plugin.renderers.Submit.auth);
	this.extendRenderer("text", plugin.renderers.Submit.text);
	this.extendRenderer("header", plugin.renderers.Submit.header);
	this.extendRenderer("container", plugin.renderers.Submit.container);
	this.extendRenderer("postButton", plugin.renderers.Submit.postButton);
};

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

plugin.templates.auth = '<div class="{class:auth}"></div>';

plugin.templates.forcedLogin =
	'<div class="{class:header} echo-primaryFont">' +
		'<span class="{class:forcedLoginMessage} echo-secondaryColor">' +
			'{plugin.label:youMustBeLoggedIn}' +
		'</span>' +
	'</div>';

plugin.renderers.Submit = {};

plugin.renderers.Submit.auth = function(element) {
	var plugin = this;
	new Echo.IdentityServer.Controls.Auth(plugin.config.assemble({
		"target": element,
		"identityManager": plugin.config.get("identityManager")
	}));
	return element;
};

plugin.renderers.Submit.header = function(element) {
	var plugin = this;
	if (this._userStatus() == "logged") {
		return element.empty();
	}
	return plugin.parentRenderer("header", arguments);
};

plugin.renderers.Submit.text = function(element) {
	var content = this.component.get("data.object.content");
	if (content) element.val(content);
	return this.parentRenderer("text", arguments);
}

plugin.renderers.Submit.container = function(element) {
	var plugin = this;
	plugin.parentRenderer("container", arguments);
	var _class = function(postfix) {
		return plugin.cssPrefix + "-" + postfix;
	};
	return element
		.removeClass($.map(["logged", "anonymous", "forcedLogin"], _class).join(" "))
		.addClass(_class(plugin._userStatus()));
};

plugin.renderers.Submit.postButton = function(element) {
	var plugin = this, submit = this.component;
	var handler = plugin.get("postButtonHandler");
	if (!handler) {
		handler = function(event) {
			if (submit.user.is("logged")) {
				event.stopImmediatePropagation();
				if (!submit.highlightMandatory(submit.dom.get("text"))) {
					submit.post();
				}
			} else if (plugin._permissions() == "forceLogin") {
				event.stopImmediatePropagation();
				submit.dom.get("forcedLoginMessage")
					.addClass(plugin.cssPrefix + "-error");
			}
		};
		plugin.set("postButtonHandler", handler);
	}
	element.unbind("click", handler).bind("click", handler);
	return this.parentRenderer("postButton", arguments);
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
	'.{class:forcedLoginMessage} { font-size: 14px; font-weight: bold; }' +
	'.{plugin.class:error} { color: red; }';

Echo.Plugin.create(plugin);

})(jQuery);
