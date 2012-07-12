(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Counter")) return;

var counter = Echo.Control.skeleton("Echo.StreamServer.Controls.Counter");

counter.config = {
	"liveUpdatesTimeout": 10 
};

counter.events["Submit.onPostComplete"] =
counter.events["Submit.onEditComplete"] = {
	"context" : "global",
	"handler" : function() {
		this.APIRequest.send({"force": true});
	}
};

counter.templates.main = '<span>{data:count}</span>';

counter.constructor = function() {
	var self = this;
	//TODO showmessage should be refactored
	this.showMessage({"type": "loading"});
	// data can be defined explicitly
	// in this case we do not make API requests
	if ($.isEmptyObject(this.data)){
		this.request();
	} else {
		this.render();
		this.listen();
	}
};

counter.methods.request = function() {
	var self = this;
	Echo.StreamServer.API.request({
		"endpoint": "count",
		"method": "GET",
		"data": {
			"q": self.config.get("query"),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			//TODO add error handling
			// including more_than error
			self.error(response);
		},
		"onData": function(response) {
			//self.data = response;
			self.update(response);
			self.listen();
		}
	}).send();
};

counter.methods.listen = function() {
	var self = this;
	this.APIRequest = Echo.StreamServer.API.request({
		"endpoint": "count",
		"liveUpdatesTimeout": self.config.get("liveUpdatesTimeout"),
		"method": "GET",
		"recurring": true,
		"data": {
			"q": self.config.get("query"),
			"appkey": self.config.get("appkey")
		},
		"onError": function(response) {
			//TODO add error handling
			// including more_than error
			console.log("error");
			self.error(response);
			self.APIRequest.abort();
		},
		"onData": function(response) {
			//TODO check if counter was updated
			self.data = response;
			self.update(response);
		}
	});
	this.APIRequest.send();
};

counter.methods.update = function(data) {
	if ($.isEmptyObject(this.data) || this.data.count != data.count) {
		this.data = data;
		this.render();
		console.log("Counter.onUpdate");
		this.events.publish({
			"topic": "Counter.onUpdate",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
	}
};

counter.methods.error = function(data) {
	if (data.errorCode === "more_than") {
		this.data.count = data.errorMessage + "+";
		this.rerender();
	} else {
		//TODO update showMessage function
		this.showMessage({"type": "error"});
	}
};

/*
 target.html(data.errorCode == "more_than" ? (data.errorMessage + "+") : data.count);
        if ($.isEmptyObject(this.data) || this.data.count != data.count) {
                this.publish("Counter.onUpdate", {
                        "data": data,
                        "query": this.config.get("query", ""),
                        "target": this.config.get("target").get(0)
                });
        }
*/

counter.methods.refresh = function() {
	//TODO we should consider moving refresh logic to the parent method
	this.APIRequest.abort();
	this.data = {};
	//TODO showmessage should be refactored
	this.showMessage({"type": "loading"});
	this.request();
	var component = Echo.Utils.getComponent("Echo.StreamServer.Controls.Counter");
	component.parent.refresh.call(this);
};

Echo.Control.create(counter);

})(jQuery);
