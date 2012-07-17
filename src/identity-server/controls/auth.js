/**
* @class Echo.StreamServer.Controls.Auth
* Echo Auth control displays user login status and allows to sign in using different social identities.
*
* @constructor
* Auth constructor initializing Echo.StreamServer.Controls.Auth class
* @param {Object} config
* @param {String} config.target Specifies the DOM element where the control will be displayed.
* @param {String} config.appkey Specifies the customer application key. You can use the "test.echoenabled.com" appkey for testing purposes.
* @param {Object} config.identityManager The list of handlers for login, edit and signup action. If some action is ommited then it will not be available for users in the Auth control. Each handler accepts sessionID as GET parameter. This parameter is necessary for communication with Backplane server. When handler finishes working it constructs the corresponding Backplane message (for login, signup or user data update) and sends this message to Backplane server.
* @param {Object} [config.identityManager.login] Encapsulates data for login workflow
* @param {Number} [config.identityManager.login.width] Specifies the width of the visible auth area
* @param {Number} [config.identityManager.login.height] Specifies the height of the visible auth area
* @param {String} [config.identityManager.login.url] Specifies the URL to be opened as an auth handler
* @param {Object} [config.identityManager.signup] Encapsulates data for signup workflow
* @param {Number} [config.identityManager.signup.width] Specifies the width of the visible auth area
* @param {Number} [config.identityManager.signup.height] Specifies the height of the visible auth area
* @param {String} [config.identityManager.signup.url] Specifies the URL to be opened as an auth handler
* @param {Object} [config.identityManager.edit] Encapsulates data for edit workflow
* @param {Number} [config.identityManager.edit.width] Specifies the width of the visible auth area
* @param {Number} [config.identityManager.edit.height] Specifies the height of the visible auth area
* @param {String} [config.identityManager.edit.url] Specifies the URL to be opened as an auth handler
*     var identityManager = {"width": 400, "height": 240, "url": "http://example.com/auth"};
*
*     new Echo.IdentityServer.Controls.Auth({
*         "target": document.getElementById("container"),
*         "appkey": "test.aboutecho.com",
*         "identityManager": {
*             "login": identityManager,
*             "signup": identityManager
*         }
*     });
* @return {Object} the reference to the corresponding Echo.StreamServer.Controls.Auth instance.
*/
(function($) {

if (Echo.Utils.isComponentDefined("Echo.IdentityServer.Controls.Auth")) return;

var auth = Echo.Control.skeleton("Echo.IdentityServer.Controls.Auth");

auth.config = {
	"identityManager": {},
	"infoMessages": {"enabled": false}
};

auth.labels = {
	"edit": "Edit",
	"login": "Login",
	"logout": "Logout",
	"loggingOut": "Logging out...",
	"or": "or",
	"signup": "signup"
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

auth.events = {
	"Echo.UserSession.onInvalidate": {
		"context": "global",
		"handler": function() {
			$.fancybox.close();
		}
	}
};

auth.renderers.logout = function(element) { 
	var self = this;
	return element.click(function() {
		element.empty().append(self.labels.get("loggingOut"));
		self.user.logout();
	});
};

auth.renderers.login = function(element) {
	return this._assembleIdentityControl("login", element);
};

auth.renderers.edit = function(element) {
	return this._assembleIdentityControl("edit", element);
};

auth.renderers.signup = function(element) {
	return this._assembleIdentityControl("signup", element);
};

auth.renderers.or = function(element) {
	if (!this.config.get("identityManager.login") ||
		!this.config.get("identityManager.signup") ||
		!this.user.get("sessionID")) {
			element.hide();
	}
	return element;
};

auth.renderers.avatar = function(element) {
	return element.append(Echo.Utils.loadImage(
		this.user.get("avatar"),
		this.user.config.get("defaultAvatar")
	));
};

auth.renderers.name = function(element) {
	return element.append(this.user.get("name", ""));
};

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
			"height": data.height,
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
			"width": data.width
		});
	}
};

auth.methods._appendSessionID = function(url) {
	var id = encodeURIComponent(this.user.get("sessionID"));
	var parts = Echo.Utils.parseURL(url);
	var session = parts["query"]
		? parts["query"].match(/=$/) ? id : "&sessionID=" + id
		: "sessionID=" + id;
	var url = "{data:scheme}://{data:domain}{data:path}?{data:query}{data:fragment}";
	return this.substitute(url, {
		"scheme": parts["scheme"] || "http",
		"domain": parts["domain"],
		"path": parts["path"],
		"query": (parts["query"] || "") + session,
		"fragment": parts["fragment"] ? ("#" + parts["fragment"]) : ""
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

})(jQuery);
