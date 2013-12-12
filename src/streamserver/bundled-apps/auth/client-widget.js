Echo.define([
	"jquery",
	"echo/utils",
	"echo/gui/modal",
	"echo/streamserver/base"
], function($, Utils, GUIModal, App) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Auth.ClientWidget
 * Echo Auth application displays the user login status and allows them to sign in using different social identities.
 *
 * 	var identityManager = {
 * 		"title": "Title of the auth area"
 * 		"width": 400,
 * 		"height": 240,
 * 		"url": "http://example.com/auth"
 * 	};
 *
 * 	new Echo.StreamServer.BundledApps.Auth.ClientWidget({
 * 		"target": document.getElementById("echo-auth"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"identityManager": {
 * 			"login": identityManager,
 * 			"signup": identityManager
 * 		}
 * 	});
 *
 * More information regarding the possible ways of the Application initialization
 * can be found in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-an-app) guide.
 *
 * @extends Echo.StreamServer.Base
 *
 * @package streamserver.pack.js
 * @module
 *
 * @constructor
 * Auth constructor initializing Echo.StreamServer.BundledApps.Auth.ClientWidget class.
 *
 * @param {Object} config
 * Configuration options.
 */
var auth = App.definition("Echo.StreamServer.BundledApps.Auth.ClientWidget");

/**
 * @echo_event Echo.StreamServer.BundledApps.Auth.ClientWidget.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Auth.ClientWidget.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Auth.ClientWidget.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Auth.ClientWidget.onRerender
 * Triggered when the app is rerendered.
 */

auth.config = {
	/**
	 * @cfg {String} appkey
	 * Specifies the customer application key. You should specify this parameter
	 * if your application uses StreamServer or StreamServer API requests.
	 * You can use the "echo.jssdk.demo.aboutecho.com" appkey for testing purposes.
	 */
	"appkey": "",

	/**
	 * @cfg {String} apiBaseURL
	 * URL prefix for all API requests
	 */
	"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",

	/**
	 * @cfg {String} defaultAvatar
	 * Default avatar URL which will be used for the user in
	 * case there is no avatar information defined in the user
	 * profile. Also used for anonymous users.
	 */
	"defaultAvatar": Echo.require.toUrl("echo-assets/images/avatar-default.png"),

	/**
	 * @cfg {Object} identityManager
	 * The list of handlers for login, edit and signup action. If some action
	 * is omitted then it will not be available for users in the Auth application.
	 * Each handler accepts sessionID as GET parameter. This parameter is necessary
	 * for communication with Backplane server. When handler finishes working it
	 * constructs the corresponding Backplane message (for login, signup or user
	 * data update) and sends this message to Backplane server.
	 *
	 * 	var identityManager = {
	 * 		"title": "Title of the auth area"
	 * 		"width": 400,
	 * 		"height": 240,
	 * 		"url": "http://example.com/auth"
	 * 	};
	 *
	 * 	new Echo.StreamServer.BundledApps.Auth.ClientWidget({
	 * 		"target": document.getElementById("echo-auth"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"identityManager": {
	 * 			"login": identityManager,
	 * 			"signup": identityManager
	 * 		}
	 * 	});
	 *
	 * @cfg {Object} [identityManager.login]
	 * Encapsulates data for login workflow.
	 *
	 * @cfg {Number} [identityManager.login.width]
	 * Specifies the width of the visible auth area.
	 *
	 * @cfg {Number} [identityManager.login.height]
	 * Specifies the height of the visible auth area.
	 *
	 * @cfg {String} [identityManager.login.url]
	 * Specifies the URL to be opened as an auth handler.
	 *
	 * @cfg {String} [identityManager.login.title]
	 * Specifies the Title of the auth modal dialog.
	 *
	 * @cfg {Object} [identityManager.signup]
	 * Encapsulates data for signup workflow.
	 *
	 * @cfg {Number} [identityManager.signup.width]
	 * Specifies the width of the visible auth area.
	 *
	 * @cfg {Number} [identityManager.signup.height]
	 * Specifies the height of the visible auth area.
	 *
	 * @cfg {String} [identityManager.signup.url]
	 * Specifies the URL to be opened as an auth handler.
	 *
	 * @cfg {String} [identityManager.signup.title]
	 * Specifies the Title of the auth modal dialog.
	 *
	 * @cfg {Object} [identityManager.edit]
	 * Encapsulates data for edit workflow.
	 *
	 * @cfg {Number} [identityManager.edit.width]
	 * Specifies the width of the visible auth area.
	 *
	 * @cfg {Number} [identityManager.edit.height]
	 * Specifies the height of the visible auth area.
	 *
	 * @cfg {String} [identityManager.edit.url]
	 * Specifies the URL to be opened as an auth handler.
	 */
	"identityManager": {},

	/**
	 * @cfg {Boolean} useSecureAPI
	 * This parameter is used to specify the API request scheme.
	 * If parameter is set to false or not specified, the API request object
	 * will use the scheme used to retrieve the host page.
	 */
	"useSecureAPI": false,

	"user": {
		"endpoints": {
			"logout": "https:{%=baseURLs.api.submissionproxy%}/v2/",
			"whoami": "https:{%=baseURLs.api.streamserver%}/v1/users/"
		}
	},

	/**
	 * @cfg {String} submissionProxyURL
	 * URL prefix for requests to Echo Submission Proxy
	 */
	"submissionProxyURL": "https:{%=baseURLs.api.submissionproxy%}/v2/esp/activity"
};

auth.vars = {
	"modal": null
};

auth.labels = {
	/**
	 * @echo_label
	 */
	"edit": "Edit",
	/**
	 * @echo_label
	 */
	"login": "Login",
	/**
	 * @echo_label
	 */
	"logout": "Logout",
	/**
	 * @echo_label
	 */
	"loggingOut": "Logging out...",
	/**
	 * @echo_label
	 */
	"or": "or",
	/**
	 * @echo_label
	 */
	"signup": "signup"
};

auth.events = {
	"Echo.StreamServer.User.onInvalidate": {
		"context": "global",
		"handler": function() {
			this.modal && this.modal.hide();
		}
	}
};

/**
 * @echo_template
 */
auth.templates.anonymous =
	'<div class="{class:userAnonymous}">' +
		'<span class="{class:login} echo-linkColor echo-clickable">' +
			'{label:login}' +
		'</span>' +
		'<span class="{class:or}"> {label:or} </span>' +
		'<span class="{class:signup} echo-linkColor echo-clickable">' +
			'{label:signup}' +
		'</span>' +
	'</div>';

/**
 * @echo_template
 */
auth.templates.logged =
	'<div class="{class:userLogged}">' +
		'<div class="{class:avatar}"></div>' +
		'<div class="{class:name}"></div>' +
		'<div class="{class:edit} echo-linkColor echo-clickable">' +
			'{label:edit}' +
		'</div>' +
		'<div class="{class:logout} echo-linkColor echo-clickable">' +
			'{label:logout}' +
		'</div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

/**
 * @echo_renderer
 */
auth.renderers.logout = function(element) { 
	var self = this;
	return element.click(function() {
		element.empty().append(self.labels.get("loggingOut"));
		self.user.logout();
	});
};

/**
 * @echo_renderer
 */
auth.renderers.login = function(element) {
	return this._assembleIdentityControl("login", element);
};

/**
 * @echo_renderer
 */
auth.renderers.edit = function(element) {
	return this._assembleIdentityControl("edit", element);
};

/**
 * @echo_renderer
 */
auth.renderers.signup = function(element) {
	return this._assembleIdentityControl("signup", element);
};

/**
 * @echo_renderer
 */
auth.renderers.or = function(element) {
	if (!this.config.get("identityManager.login") ||
		!this.config.get("identityManager.signup") ||
		!this.user.get("sessionID")) {
			element.hide();
	}
	return element;
};

/**
 * @echo_renderer
 */
auth.renderers.avatar = function(element) {
	Utils.placeImage({
		"container": element,
		"image": this.user.get("avatar"),
		"defaultImage": this.config.get("defaultAvatar")
	});
	return element;
};

/**
 * @echo_renderer
 */
auth.renderers.name = function(element) {
	return element.append(this.user.get("name", ""));
};

/**
 * Method to define which template should be used for general rendering procedure.
 *
 * @return {String}
 * Application template.
 */
auth.methods.template = function() {
	return this.templates[this.user.is("logged") ? "logged" : "anonymous"];
};

auth.methods._assembleIdentityControl = function(type, element) {
	var self = this;
	var data = this.config.get("identityManager." + type);
	if (!data || !this.user.get("sessionID")) return element.hide();

	if (data.type === "script") {
		return element.click(function() {
			$.getScript(self._appendSessionID(data.url));
		});
	} else {
		return element.on("click", function() {
			self.modal = new GUIModal({
				"data": {
					"title": data.title
				},
				"href": self._appendSessionID(data.url),
				"width": parseInt(data.width),
				"height": parseInt(data.height),
				"padding": "0 0 5px 0",
				"footer": false,
				"fade": true,
				"onShow": function() {
					Backplane.expectMessages("identity/ack");
				},
				"onHide": function() {
					self.modal = null;
				}
			});
			self.modal.show();
		});
	}
};

auth.methods._appendSessionID = function(url) {
	var id = encodeURIComponent(this.user.get("sessionID"));
	var parts = Utils.parseURL(url);
	var session = parts["query"]
		? parts["query"].match(/=$/) ? id : "&sessionID=" + id
		: "sessionID=" + id;
	var template = "{data:scheme}://{data:domain}{data:path}?{data:query}{data:fragment}";
	return this.substitute({
		"template": template,
		"data": {
			"scheme": parts["scheme"] || "http",
			"domain": parts["domain"],
			"path": parts["path"],
			"query": (parts["query"] || "") + session,
			"fragment": parts["fragment"] ? ("#" + parts["fragment"]) : ""
		}
	});
};

auth.css =
	".{class:logout} { float: right; }" +
	".{class:userAnonymous} { text-align: right; }" +
	".{class:avatar} { float: left; width: 24px; height: 24px; }" +
	".{class:name} { float: left; font-size: 18px; line-height: 24px; margin-left: 5px; font-weight: bold; }" +
	".{class:edit} { float: left; margin: 6px 0px 0px 12px; }";

return App.create(auth);

});
