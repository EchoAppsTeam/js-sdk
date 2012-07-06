(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Counter")) return;

var counter = Echo.Control.skeleton("Echo.StreamServer.Controls.Counter");

counter.config = {
	"liveUpdatesTimeout": 1 
};

counter.labels = {
	"loading": "Loading..."
};

counter.templates.main = "<span>{data:count}</span>";

counter.templates.loading = "<span>{label:loading}</span>";

counter.methods.template = function() {
	return this.templates[this.loading ? "loading" : "main"] 
};

counter.constructor = function() {
	var self = this;
	this.loading = true;
	this.render();
	Echo.StreamServer.API.request({
		"endpoint": "count",
		"liveUpdatesTimeout": self.config.get("liveUpdatesTimeout"),
		"method": "GET",
		"recurring": true,
		"data": {
			"q": self.config.get("query"),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			console.log(response);
			
		},
		"onData": function(response) {
			self.loading = false;
			self.render({"data": response});
		}
	}).send();
};

Echo.Control.create(counter);

})(jQuery);
