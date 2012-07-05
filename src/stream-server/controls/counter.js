(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Counter")) return;

var counter = Echo.Control.skeleton("Echo.StreamServer.Controls.Counter");

counter.templates.main = "<span>{data:count}</span>";

counter.constructor = function() {
	var self = this;
	Echo.StreamServer.API.request({
		"endpoint": "count",
		"liveUpdatesTimeout": 3000,
		"method": "GET",
		"data": {
			"q": self.config.get("query"),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			console.log("error", response);
		},
		"onData": function(response) {
			self.render({"data": response});
		}
	}).send();
};

Echo.Control.create(counter);

})(jQuery);
