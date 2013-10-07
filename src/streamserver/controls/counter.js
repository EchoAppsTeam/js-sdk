(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Counter
 * Echo Counter class which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/27888212/API-method-count" target="_blank">Echo Count API</a>
 * and provides a simple live updating number.
 *
 * 	new Echo.StreamServer.Controls.Counter({
 * 		"target": document.getElementById("echo-counter"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"query" : "childrenof:http://example.com/test/*"
 * 	});
 *
 * More information regarding the possible ways of the Control initialization
 * can be found in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-an-app) guide.
 *
 * @extends Echo.Control
 *
 * @package streamserver/controls.pack.js
 * @package streamserver.pack.js
 *
 * @constructor
 * Counter constructor initializing Echo.StreamServer.Controls.Counter class
 *
 * @param {Object} config
 * Configuration options
 */
var counter = Echo.Control.manifest("Echo.StreamServer.Controls.Counter");

if (Echo.Control.isDefined(counter)) return;

/** @hide @cfg defaultAvatar */
/** @hide @cfg labels */
/** @hide @cfg submissionProxyURL */
/** @hide @method getPlugin */
/** @hide @method getRelativeTime */
/** @hide @method parentRenderer */
/** @hide @method placeImage */
/** @hide @echo_label justNow */
/** @hide @echo_label today */
/** @hide @echo_label yesterday */
/** @hide @echo_label lastWeek */
/** @hide @echo_label lastMonth */
/** @hide @echo_label secondAgo */
/** @hide @echo_label secondsAgo */
/** @hide @echo_label minuteAgo */
/** @hide @echo_label minutesAgo */
/** @hide @echo_label hourAgo */
/** @hide @echo_label hoursAgo */
/** @hide @echo_label dayAgo */
/** @hide @echo_label daysAgo */
/** @hide @echo_label weekAgo */
/** @hide @echo_label weeksAgo */
/** @hide @echo_label monthAgo */
/** @hide @echo_label monthsAgo */

/**
 * @echo_event Echo.StreamServer.Controls.Counter.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.Controls.Counter.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.Controls.Counter.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.Controls.Counter.onRerender
 * Triggered when the app is rerendered.
 */

counter.init = function() {
	if (!this.checkAppKey()) return;

	this.request = this._getRequestObject();
	if ($.isEmptyObject(this.get("data"))) {
		this.request.send();
	} else {
		this.render();
		this.ready();
		if (this.request) {
			this.request.send({
				"skipInitialRequest": true
			});
		}
	}
};

counter.config = {
	/**
	 * @cfg {String} query
	 * Specifies the search query to generate the necessary data set.
	 * It must be constructed according to the
	 * <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">"search" API</a>
	 * method specification.
	 *
	 * 	new Echo.StreamServer.Controls.Counter({
	 * 		"target": document.getElementById("echo-counter"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"query" : "childrenof:http://example.com/test/*"
	 * 	});
	 */
	/**
	 * @cfg {Object} data
	 * Specifies predefined items count which should be displayed by the application.
	 * Counter control works with the data format used by the "count" API endpoint.
	 * More information about the data format can be found
	 * <a href="http://wiki.aboutecho.com/API-method-count#ResponseFormat" target="_blank">here</a>.
	 *
	 * 	new Echo.Counter({
	 * 		...
	 * 		"data": {"count": 100},
	 * 		...
	 * 	});
	 */
	"data": undefined,

	/**
	 * @cfg {Object} [liveUpdates]
	 * Live updating machinery configuration (only the "polling" transport
	 * is supported for the "count" API endpoint).
	 *
	 * @cfg {Boolean} [liveUpdates.enabled=true]
	 * Parameter to enable/disable live updates.
	 *
	 * @cfg {Object} [liveUpdates.polling]
	 * Object which contains the configuration specific to the "polling"
	 * live updates transport.
	 *
	 * @cfg {Number} [liveUpdates.polling.timeout=10]
	 * Timeout between the live updates requests (in seconds).
	 */
	"liveUpdates": {
		"enabled": true,
		"polling": {
			"timeout": 10
		}
	},

	/**
	 * @cfg {String} infoMessages 
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 */
	"infoMessages": {"layout": "compact"}
};

counter.templates.main = "<span>{data:count}</span>";

counter.methods._getRequestObject = function(overrides) {
	return Echo.StreamServer.API.request(
		$.extend(true, {
			"endpoint": "count",
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"liveUpdates": this.config.get("liveUpdates"),
			"secure": this.config.get("useSecureAPI"),
			"apiBaseURL": this.config.get("apiBaseURL"),
			"onError": $.proxy(this._error, this),
			"onData": $.proxy(this._handleResponse, this)
		}, overrides)
	);
};

counter.methods._maybeUpdate = function(data) {
	if ($.isEmptyObject(this.data) || this.data.count != data.count) {
		this.events.publish({
			"topic": "onUpdate",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
		this.set("data", data);
		this.render();
	}
};

counter.methods._handleResponse = function(data, options) {
	this._maybeUpdate(data);
	if (options.requestType === "initial") {
		this.ready();
	}
};

counter.methods._error = function(data, options) {
	this.events.publish({
		"topic": "onError",
		"data": {
			"data": data,
			"query": this.config.get("query"),
			"target": this.config.get("target").get(0)
		}
	});
	if (data.errorCode === "more_than") {
		this.set("data.count", data.errorMessage + "+");
		this.render();
	} else {
		if (typeof options.critical === "undefined" || options.critical || options.requestType === "initial") {
			this.showMessage({"type": "error", "data": data, "message": data.errorMessage});
		}
	}
	this.ready();
};

Echo.Control.create(counter);

})(Echo.jQuery);
