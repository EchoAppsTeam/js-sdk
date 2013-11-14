(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.ServerRelatedApp
 * Foundation class implementing application logic application
 * which related to the server interaction. This class provide
 * some useful methods and properties such as config properties etc.
 *
 * @extends Echo.App
 *
 * @package environment.pack.js
 *
 * @constructor
 * Server related App constructor initializing Echo.ServerRelatedApp class
 */
var app = Echo.App.manifest("Echo.ServerRelatedApp");

if (Echo.App.isDefined(app)) return;

app.config = {
	/**
	 * @cfg {String} appkey
	 * Specifies the customer application key. You should specify this parameter
	 * if your application uses StreamServer or IdentityServer API requests.
	 * You can use the "echo.jssdk.demo.aboutecho.com" appkey for testing purposes.
	 */
	"appkey": "",

	/**
	 * @cfg {String} apiBaseURL
	 * URL prefix for all API requests
	 */
	"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",

	/**
	 * @cfg {Boolean} useSecureAPI
	 * This parameter is used to specify the API request scheme.
	 * If parameter is set to false or not specified, the API request object
	 * will use the scheme used to retrieve the host page.
	 */
	"useSecureAPI": false
};

app.labels = {
	/**
	 * @echo_label loading
	 */
	"loading": "Loading...",
	/**
	 * @echo_label retrying
	 */
	"retrying": "Retrying...",
	/**
	 * @echo_label error_busy
	 */
	"error_busy": "Loading. Please wait...",
	/**
	 * @echo_label error_timeout
	 */
	"error_timeout": "Loading. Please wait...",
	/**
	 * @echo_label error_waiting
	 */
	"error_waiting": "Loading. Please wait...",
	/**
	 * @echo_label error_view_limit
	 */
	"error_view_limit": "View creation rate limit has been exceeded. Retrying in {seconds} seconds...",
	/**
	 * @echo_label error_view_update_capacity_exceeded
	 */
	"error_view_update_capacity_exceeded": "This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...",
	/**
	 * @echo_label error_result_too_large
	 */
	"error_result_too_large": "(result_too_large) The search result is too large.",
	/**
	 * @echo_label error_wrong_query
	 */
	"error_wrong_query": "(wrong_query) Incorrect or missing query parameter.",
	/**
	 * @echo_label error_incorrect_appkey
	 */
	"error_incorrect_appkey": "(incorrect_appkey) Incorrect or missing appkey.",
	/**
	 * @echo_label error_internal_error
	 */
	"error_internal_error": "(internal_error) Unknown server error.",
	/**
	 * @echo_label error_quota_exceeded
	 */
	"error_quota_exceeded": "(quota_exceeded) Required more quota than is available.",
	/**
	 * @echo_label error_incorrect_user_id
	 */
	"error_incorrect_user_id": "(incorrect_user_id) Incorrect user specified in User ID predicate.",
	/**
	 * @echo_label error_unknown
	 */
	"error_unknown": "(unknown) Unknown error.",
	/**
	 * @echo_label today
	 */
	"today": "Today"
};

app.templates = {"message": {}};

app.templates.message.compact =
	'<span class="echo-app-message echo-app-message-icon echo-app-message-{data:type} {class:messageIcon} {class:messageText}" title="{data:message}">&nbsp;</span>';

app.templates.message.full =
	'<div class="echo-app-message {class:messageText}">' +
		'<span class="echo-app-message-icon echo-app-message-{data:type} {class:messageIcon}">' +
			'{data:message}' +
		'</span>' +
	'</div>';

/**
 * Renders info message in the target container.
 *
 * @param {Object} data
 * Object containing info message information.
 *
 * @param {String} [data.layout]
 * Specifies the type of message layout. Can be set to "compact" or "full".
 *
 * @param {HTMLElement} [data.target]
 * Specifies the target container.
 */
app.methods.showMessage = function(data) {
	if (!this.config.get("infoMessages.enabled")) return;
	var target = data.target || this.config.get("target");
	var layout = data.layout || this.config.get("infoMessages.layout");
	var view = this.view.fork();
	target.empty().append(view.render({
		"data": data,
		"template": this.templates.message[layout]
	}));
};

/**
 * Renders error message in the target container.
 *
 * @param {Object} data
 * Object containing error message information.
 *
 * @param {Object} options
 * Object containing display options.
 */
app.methods.showError = function(data, options) {
	var self = this;
	if (typeof options.retryIn === "undefined") {
		var label = this.labels.get("error_" + data.errorCode);
		var message = label === "error_" + data.errorCode
			? "(" + data.errorCode + ") " + (data.errorMessage || "")
			: label;
		this.showMessage({
			"type": options.critical ? "error" : "loading",
			"message": message,
			"target": options.target
		});
	} else if (!options.retryIn && options.request.retryTimer) {
		this.showMessage({
			"type": "loading",
			"message": this.labels.get("retrying"),
			"target": options.target
		});
	} else {
		var secondsLeft = options.retryIn / 1000;
		var ticker = function() {
			if (!secondsLeft) {
				return;
			}
			var label = self.labels.get("error_" + data.errorCode, {"seconds": secondsLeft--});
			self.showMessage({
				"type": "loading",
				"message": label,
				"target": options.target
			});
		};
		options.request.retryTimer = setInterval(ticker, 1000);
		ticker();
	}
};

/**
 * Method to check the presense of the "appkey" configuration parameter and render
 * the error message (inside the element specified as the "target" in the application
 * configuration) in case the "appkey" is missing in the config.
 *
 * @return {Boolean}
 * The boolean result of the "appkey" config parameter check.
 */
app.methods.checkAppKey = function() {
	if (!this.config.get("appkey")) {
		this.showError({"errorCode": "incorrect_appkey"}, {"critical": true});
		return false;
	}
	return true;
};

app.css =
	// message classes
	'.echo-app-message { padding: 15px 0px; text-align: center; }' +
	'.echo-app-message-icon { height: 16px; padding-left: 16px; background: no-repeat left center; }' +
	'.echo-app-message .echo-app-message-icon { padding-left: 21px; height: auto; }' +
	'.echo-app-message-info { background-image: url({config:cdnBaseURL.sdk-assets}/images/information.png); }' +
	'.echo-app-message-loading { background-image: url({config:cdnBaseURL.sdk-assets}/images/loading.gif); }' +
	'.echo-app-message-error { background-image: url({config:cdnBaseURL.sdk-assets}/images/warning.gif); }'

Echo.App.create(app);

(function(App) {

var initializers = $.extend(true, {}, App.prototype._initializers);

initializers.loading = function() {
	this.showMessage({
		"type": "loading",
		"message": this.labels.get("loading")
	});
};

var before = Echo.Utils.foldl(0, initializers.list, function(initializer, acc, i) {
	if (initializer[0] === "dependencies:async") {
		return (acc = i);
	}
});

initializers.list.splice(before, 0, ["loading", ["init", "refresh"]]);

App.prototype._initializers = initializers;

})(Echo.Utils.getComponent("Echo.ServerRelatedApp"));

})(Echo.jQuery);
