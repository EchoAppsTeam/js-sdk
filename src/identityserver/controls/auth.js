(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth")) return;

/**
 * @class Echo.IdentityServer.Controls.Auth
 * Echo Auth control displays user login status and allows to sign in using
 * different social identities.
 *
 * 	var identityManager = {
 * 		"width": 400,
 * 		"height": 240,
 * 		"url": "http://example.com/auth"
 * 	};
 *
 * 	new Echo.IdentityServer.Controls.Auth({
 * 		"target": document.getElementById("echo-auth"),
 * 		"appkey": "test.aboutecho.com",
 * 		"identityManager": {
 * 			"login": identityManager,
 * 			"signup": identityManager
 * 		}
 * 	});
 *
 * @extends Echo.Control
 *
 * @constructor
 * Auth constructor initializing Echo.IdentityServer.Controls.Auth class.
 *
 * @param {Object} config
 * Configuration options.
 */
var auth = Echo.Control.manifest("Echo.IdentityServer.Controls.Auth");

auth.config = {
	/**
	 * @cfg {Object} identityManager
	 * The list of handlers for login, edit and signup action. If some action
	 * is ommited then it will not be available for users in the Auth control.
	 * Each handler accepts sessionID as GET parameter. This parameter is necessary
	 * for communication with Backplane server. When handler finishes working it
	 * constructs the corresponding Backplane message (for login, signup or user
	 * data update) and sends this message to Backplane server.
	 *
	 * 	var identityManager = {
	 * 		"width": 400,
	 * 		"height": 240,
	 * 		"url": "http://example.com/auth"
	 * 	};
	 *
	 * 	new Echo.IdentityServer.Controls.Auth({
	 * 		"target": document.getElementById("echo-auth"),
	 * 		"appkey": "test.aboutecho.com",
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
	 * @cfg {String} infoMessages
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 */
	"infoMessages": {"enabled": false}
};

auth.dependencies = [{
	"url": "{sdk}/third-party/jquery/css/fancybox.css"
}];

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
	"Echo.UserSession.onInvalidate": {
		"context": "global",
		"handler": function() {
			$.fancybox.close();
		}
	}
};

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
	return element.empty().append(Echo.Utils.loadImage(
		this.user.get("avatar"),
		this.user.config.get("defaultAvatar")
	));
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
 * Control template.
 */
auth.methods.template = function() {
	return this.templates[this.user.is("logged") ? "logged" : "anonymous"];
};

auth.methods._assembleIdentityControl = function(type, element) {
	var self = this;
	var data = this.config.get("identityManager." + type);
	if (!data || !this.user.get("sessionID")) return element.hide();

	if (data.type == "script") {
		return element.click(function() {
			$.getScript(self._appendSessionID(data.url));
		});
	} else {
		return element.fancybox({
			"autoScale": false,
			"height": parseInt(data.height),
			"href": self._appendSessionID(data.url),
			"onClosed": function() {
				// remove dynamic height/width calculations for overlay
				if ($.browser.msie && document.compatMode != "CSS1Compat") {
					var style = $("#fancybox-overlay").get(0).style;
					style.removeExpression("height");
					style.removeExpression("width");
				}
			},
			"onComplete": function() {
				// set fixed dimensions of the frame (for IE in quirks mode it should be smaller)
				var delta = ($.browser.msie && document.compatMode != "CSS1Compat" ? 40 : 0);
				$("#fancybox-frame").css({
					"width": data.width - delta,
					"height": data.height - delta
				});
			},
			"onStart": function() {
				Backplane.expectMessages("identity/ack");
				// dynamical calculation of overlay height/width
				if ($.browser.msie && document.compatMode != "CSS1Compat") {
					var style = $("#fancybox-overlay").get(0).style;
					style.setExpression("height", "Math.max(document.body.clientHeight, document.body.scrollHeight)");
					style.setExpression("width", "Math.max(document.body.clientWidth, document.body.scrollWidth)");
				}
			},
			"padding": 0,
			"scrolling": "no",
			"transitionIn": "elastic",
			"transitionOut": "elastic",
			"type": "iframe",
			"width": parseInt(data.width)
		});
	}
};

auth.methods._appendSessionID = function(url) {
	var id = encodeURIComponent(this.user.get("sessionID"));
	var parts = Echo.Utils.parseURL(url);
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
	".{class:avatar} { float: left; }" +
	".{class:avatar} img { width: 24px; height: 24px; }" +
	".{class:name} { float: left; font-size: 18px; line-height: 24px; margin-left: 5px; font-weight: bold; }" +
	".{class:edit} { float: left; margin: 6px 0px 0px 12px; }";

Echo.Control.create(auth);

})(Echo.jQuery);
