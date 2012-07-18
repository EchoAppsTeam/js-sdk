(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Counter")) return;

var counter = Echo.Control.skeleton("Echo.StreamServer.Controls.Counter");

counter.config = {
	"liveUpdatesTimeout": 10,
	"infoMessages": {"layout": "compact"}
};

counter.templates.main = "<span>{data:count}</span>";

/**
* @class Echo.StreamServer.Controls.Counter
* Echo Counter class which encapsulates interaction with the
* <a href="http://wiki.aboutecho.com/w/page/27888212/API-method-count" target="_blank">Echo Count API</a>
*
* @constructor
* Counter constructor initializing Echo.StreamServer.Controls.Counter class
* @param {Object} config
* @param {String} config.target Specifies the DOM element where the control will be displayed.
* @param {String} config.appkey Specifies the customer application key. You can use the "test.echoenabled.com" appkey for testing purposes.
* @param {String} config.query Specifies the search query to generate the necessary data set. It must be constructed according to the <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">"search" API</a> method specification.
*
*     new Echo.StreamServer.Controls.Counter({
*         "target": document.getElementById("container"),
*         "appkey": "test.aboutecho.com",
*         "query" : "childrenof:http://example.com/test/*"
*     });
* @param {Object} config.data Specifies predefined items count which should be displayed by the application.
*     new Echo.Counter({
*         ...
*         "data": {"count": 100},
*         ...
*     });
* @param {Number} [config.liveUpdatesTimeout=10] Specifies the timeout between the live updates requests (in seconds).
* @param {Object} [config.infoMessages] Customizes the look and feel of info messages, for example "loading" and "error".
* @param {String} [config.infoMessages.layout="compact"] Specifies the layout of the info message. By default can be set to "compact" or "full".
* @param {Boolean} [config.infoMessages.enabled=true] Specifies if info messages should be rendered.
*     new Echo.StreamServer.Controls.Counter({
*         ...
*         "infoMessages" : {
*             "enabled" : true,
*             "layout" : "full"
*         }
*     });
* @return {Object} the reference to the corresponding Echo.StreamServer.Controls.Counter instance.
*/

counter.init = function() {
	// data can be defined explicitly
	// in this case we do not make API requests
	// TODO: no live updates for now if data is passed as a config value
	if ($.isEmptyObject(this.get("data"))) {
		this._request();
	} else {
		this.render();
	}
};

/**
* @method refresh
* Method implements the refresh logic for the Counter control.
* It should be used for example after some config params were changed.
*/

counter.methods.refresh = function() {
	this.showMessage({"type": "loading"});
	this.set("data", {});
	this.get("request").abort();
	this.remove("request");
	this._request();
	var component = Echo.Utils.getComponent("Echo.StreamServer.Controls.Counter");
	component.parent.refresh.call(this);
};

// internal functions

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
		this.set("data", data);
		this.render();
		this.events.publish({
			"topic": "onUpdate",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
	}
};

counter.methods._error = function(data) {
	if (data.errorCode === "more_than") {
		this.set("data.count", data.errorMessage + "+");
		this.render();
	} else {
		this.showMessage({"type": "error", "data": data, "message": data.errorMessage});
	}
	this.events.publish({
		"topic": "onError",
		"data": {
			"data": data,
			"query": this.config.get("query"),
			"target": this.config.get("target").get(0)
		}
	});
};

Echo.Control.create(counter);

})(jQuery);
