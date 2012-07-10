(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.FormAuth")) return;

var plugin = Echo.Plugin.skeleton("FormAuth");

plugin.applications = ["Echo.StreamServer.Controls.Submit"];

plugin.init = function() {

	// checking if it makes sense to init the plugin
	if (!this.component.user.get("sessionID") ||
		!this.config.get("identityManager.login") ||
		!this.config.get("identityManager.signup")) return;

	if (this._userStatus() == "forcedLogin") {
		this.extendTemplate(plugin.templates.forcedLogin, "replace", "header");
	}
	this.extendTemplate(plugin.templates.auth, "insertBefore", "header");
	this.extendRenderer("auth", plugin.renderers.Submit.auth);
	this.extendRenderer("header", plugin.renderers.Submit.header);
	this.extendRenderer("container", plugin.renderers.Submit.container);
	this.extendRenderer("postButton", plugin.renderers.Submit.postButton);
};

plugin.config = {
	"identityManager": {},
	"submitPermissions": "allowGuest"
};

plugin.labels = {
	"youMustBeLoggedIn": "You must be logged in to comment"
};

plugin.templates.auth = '<div class="{class:auth}"></div>';

plugin.templates.forcedLogin =
	'<div class="{class:userInfoWrapper} echo-primaryFont">' +
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
	// TODO: check permissions
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

plugin.css = '.{class:forcedLoginMessage} { font-size: 14px; font-weight: bold; }';

Echo.Plugin.create(plugin);

})(jQuery);
