(function(jQuery) {
"use strict";

var $ = jQuery;
/**
 * @class Echo.StreamServer.Controls.Counter
 * Echo Counter class which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/27888212/API-method-count" target="_blank">Echo Count API</a>
 *
 * 	new Echo.StreamServer.Controls.Counter({
 * 		"target": document.getElementById("echo-counter"),
 * 		"appkey": "test.aboutecho.com",
 * 		"query" : "childrenof:http://example.com/test/*"
 * 	});
 *
 * @extends Echo.Control
 *
 * @constructor
 * Counter constructor initializing Echo.StreamServer.Controls.Counter class
 *
 * @param {Object} config
 * Configuration options
 */
var counter = Echo.Control.manifest("Echo.StreamServer.Controls.Counter");

counter.init = function() {
	// data can be defined explicitly
	// in this case we do not make API requests
	// TODO: no live updates for now if data is passed as a config value
	if ($.isEmptyObject(this.get("data"))) {
		this._request();
	} else {
		this.render();
		this.ready();
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
	 * 		"appkey": "test.aboutecho.com",
	 * 		"query" : "childrenof:http://example.com/test/*"
	 * 	});
	 */
	/**
	 * @cfg {Object} data
	 * Specifies predefined items count which should be displayed by the application.
	 *
	 * 	new Echo.Counter({
	 * 		...
	 * 		"data": {"count": 100},
	 * 		...
	 * 	});
	 */
	"data": undefined,
	/**
	 * @cfg {Number} liveUpdatesTimeout
	 * Specifies the timeout between the live updates requests (in seconds).
	 */
	"liveUpdatesTimeout": 10,
	/**
	 * @cfg {String} infoMessages 
	 * Customizes the look and feel of info messages, for example "loading" and "error".
	 */
	"infoMessages": {"layout": "compact"}
};

counter.templates.main = "<span>{data:count}</span>";

counter.methods._request = function() {
	var request = this.get("request");
	if (!request) {
		request = Echo.StreamServer.API.request({
			"endpoint": "count",
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"liveUpdatesTimeout": this.config.get("liveUpdatesTimeout"),
			"recurring": true,
			"onError": $.proxy(this._error, this),
			"onData": $.proxy(this._update, this)
		});
		this.set("request", request);
	}
	request.send();
};

counter.methods._update = function(data) {
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
		this.ready();
	}
};

counter.methods._error = function(data) {
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
		this.showMessage({"type": "error", "data": data, "message": data.errorMessage});
	}
	this.ready();
};

Echo.Control.create(counter);

})(Echo.jQuery);
