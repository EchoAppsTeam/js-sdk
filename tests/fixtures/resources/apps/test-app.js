Echo.define("fixtures/resources/apps/test-app", [
	"jquery",
	"echo/app",
	"echo/utils"
], function($, App, Utils) {

"use strict";

var testApp = App.definition("Echo.Tests.Apps.TestApp");

testApp.init = function() {
	this.render();
	this.ready();
};

testApp.config = {
	"appkey": "",
	"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",
	"query": "",
	"data": undefined
};

testApp.templates.main = "<span>{data}</span>";

testApp.methods._error = function(data, options) {
	this.events.publish({
		"topic": "onError",
		"data": {
			"data": data,
			"query": this.config.get("query"),
			"target": this.config.get("target").get(0)
		}
	});
	Utils.showMessage({
		"type": "error",
		"data": data,
		"message": data.errorMessage,
		"target": this.config.get("target")
	});
	this.ready();
};

return App.create(testApp);

});
