(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Counter")) return;

var counter = Echo.Control.skeleton("Echo.StreamServer.Controls.Counter");

counter.config = {
	"liveUpdatesTimeout": 1
};

counter.templates.main = "<span>{data:count}</span>";

counter.constructor = function() {
	var self = this;
	this.showMessage({"type": "loading"});
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
			console.log("error");
			self.data = response;
			self.render();
		},
		"onData": function(response) {
			console.log("success");
			self.data = response;
			self.render();
		}
	}).send();
};

Echo.Control.create(counter);

})(jQuery);
