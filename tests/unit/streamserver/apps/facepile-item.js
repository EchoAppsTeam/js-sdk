Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery"
], function($) {

"use strict";

var data = {
	"instance": {
		"name": "Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget",
		"config": {
			"data": {
				"id": "http://example.com/id",
				"title": "Test user"
			}
		}
	},
	"config": {
		"async": true,
		"testTimeout": 10000
	}
};

var suite = Echo.Tests.Unit.FacePileItem = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className" : data.instance.name,
	"functions": ["isYou"]
};
callback();
});
});
