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

//TODO REMOVE INPUT
counter.templates.main = '<span>{data:count}<input type="submit" class="{class:submit}"></span>';


//TODO REMOVE ME
counter.renderers.submit = function(element) {
	var self = this;
	element.click(function() {
		self.config.set("query", "childrenof:http://example.com/*");
		self.refresh();
	});
};

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
			console.log("error");
		},
		"onData": function(response) {
			self.data = response;
			self.render();
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
			self.APIRequest.abort();
		},
		"onData": function(response) {
			//TODO check if counter was updated
			self.data = response;
			self.rerender();
		}
	});
	this.APIRequest.send();
};

counter.methods.refresh = function() {
	this.APIRequest.abort();
	this.data = {};
	//TODO showmessage should be refactored
	this.showMessage({"type": "loading"});
	this.request();
};

Echo.Control.create(counter);

})(jQuery);
