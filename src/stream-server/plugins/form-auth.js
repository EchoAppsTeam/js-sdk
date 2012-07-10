(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.FormAuth")) return;

var plugin = Echo.Plugin.skeleton("FormAuth");

plugin.applications = ["Echo.StreamServer.Controls.Submit"];

plugin.init = function() {
	if (!this.component.user.get("sessionID")) return;
	this.extendTemplate(plugin.templates.submit,
		"insertBefore", "echo-streamserver-controls-submit-header");
	this.extendRenderer("auth", plugin.renderers.Submit.auth);
	this.extendRenderer("header", plugin.renderers.Submit.header);
/* TODO: to be developed...
	this.extendRenderer("container", plugin.renderers.Submit.container);
	this.extendRenderer("postButton", plugin.renderers.Submit.postButton);
	this.extendRenderer("forcedLoginUserInfo", plugin.renderers.Submit.forcedLoginUserInfo);
*/
};

plugin.labels = {
	"youMustBeLoggedIn": "You must be logged in to comment"
};

plugin.templates.submit = '<div class="{class:auth}">TEST</div>';

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
	if (plugin.component.user.is("logged")) {
		return element.empty();
	}
	return plugin.parentRenderer("header", arguments);
};

plugin.renderers.Submit.container = function(element) {
	return element;
};

plugin.renderers.Submit.postButton = function(element) {
	return element;
};

plugin.renderers.Submit.forcedLoginUserInfo = function(element) {
	return element;
};

plugin.css = '.echo-submit-forcedLoginUserInfoMessage { font-size: 14px; font-weight: bold; }';

Echo.Plugin.create(plugin);

})(jQuery);
