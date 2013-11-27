Echo.require([
	"jquery",
	"echo/streamserver/apps/counter",
	"echo/api"
], function($, Counter, API) {

"use strict";

var suite = Echo.Tests.Unit.Counter = function() {};

suite.prototype.info = {
	"className" : "Echo.StreamServer.Apps.Counter",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.staticWorkflow = {
	"config" : {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data defined explicitly"
	},
	"check" : function() {
		var self = this;
		var target = this.config.target;
		var count = 99;
		new Counter({
			"target" : target,
			"appkey" : "echo.jssdk.tests.aboutecho.com",
			"data"   : {"count": count},
			"ready"  : function() {
				suite.counter = this;
				QUnit.ok(target.html().match(count),
					'Checking the static usecase rendering');
				QUnit.ok(this.request instanceof API.Request, "Check that counter initializing with the pre-defined data inits a request object as well");
				QUnit.strictEqual(this.request.config.get("liveUpdates.enabled"), this.config.get("liveUpdates.enabled"), "Check that counter initializing with the pre-defined data inits a request object with the proper options");
				self.sequentialAsyncTests([
					"staticInit",
					"staticRefresh"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.dynamicWorkflow = {
	"config" : {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"description" : "data taken from API endpoint"
	},
	"check" : function() {
		var self = this;
		new Counter({
			"target" : this.config.target,
			"appkey" : "echo.jssdk.tests.aboutecho.com",
			"query"  : "childrenof:http://example.com/*",
			"liveUpdates": {
				"timeout": 60
			},
			"ready"  : function() {
				suite.counter = this;
				QUnit.equal(suite.counter.config.get("liveUpdates.polling.timeout"), 60,
					"Check that \"liveUpdates.timeout\" mapped to the \"liveUpdates.polling.timeout\"");
				QUnit.ok(self.config.target.html().match(suite.counter.get("data.count")),
				'Checking the dynamic usecase rendering');
				var sequentialTests = [
					"onError_more_than",
					"onUpdate"
				];
				// FIXME: when server will support XDomainRequest handling
				if (!API.Transports.XDomainRequest.available({
					"method": "get",
					"URL": "api.echoenabled.com"
				})) {
					sequentialTests = sequentialTests.concat(["onError_wrong_query", "onError_incorrect_appkey"]);
				}
				self.sequentialAsyncTests(sequentialTests, "cases");
			}
		});
	}
};

suite.prototype.cases = {};

suite.prototype.cases.staticInit = function(callback) {
	var self = this;
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.ok(self.config.target.html().match(suite.counter.get("data.count")),
				'Checking the static usecase rendering and refresh() idempotence');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.staticRefresh = function(callback) {
	var self = this;
	var count = 101;
	suite.counter.set("data", {"count": count});
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.ok(self.config.target.html().match(suite.counter.get("data.count")),
				'Checking the static usecase rerendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.onError_more_than = function(callback) {
	var self = this;
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onError",
		"handler" : function(topic, params) {
			params = params || {};
			if (params.data && params.data.errorCode === "waiting") {
				var data = {
					"errorCode": "more_than",
					"result": "error",
					"errorMessage": 5000
				};
				params.data = data;
				this._error(data, {"critical": true});
				return;
			}
			QUnit.deepEqual(
				params.data,
				{
					"result" : "error",
					"errorCode" : "more_than",
					"errorMessage" : 5000
				},
				'Checking the restrictions of the count API. Error: "more_than"');
			this.events.unsubscribe({
				"topic": "Echo.StreamServer.Apps.Counter.onError"
			});
		}
	});
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			self.jqueryObjectsEqual($(self.config.target.html()), $("<span>5000+</span>"),
				'Checking the Error: "more_than" usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.onError_wrong_query = function(callback) {
	var self = this;
	suite.counter.config.set("query", "children1of:http://example.com/*");
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onError",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.deepEqual(
				params.data,
				{
					"result" : "error",
					"errorCode" : "wrong_query",
					"errorMessage" : "Unrecognized query"
				},
				'Checking the restrictions of the count API. Error: "wrong_query"');
		}
	});
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			QUnit.ok(self.config.target.html().match(/Unrecognized query/),
				'Checking the Error: "wrong_query" usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.onError_incorrect_appkey = function(callback) {
	var self = this;
	suite.counter.config.set("query", "childrenof:http://example.com/test/*");
	suite.counter.config.set("appkey", "faketest.aboutecho.com");
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onError",
		"once"    : true,
		"handler" : function(topic, params) {
			//TODO fix test when the API is fixed
			// it should return incorrect_appkey instead of wrong_query 
			QUnit.deepEqual(
				params.data,
				{
					"result" : "error",
					"errorCode" : "wrong_query",
					"errorMessage" : "Unrecognized query"
				},
				'Checking the restrictions of the count API. Error: "incorrect_appkey"');
		}
	});
	suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"    : true,
		"handler" : function(topic, params) {
			//TODO fix test when the API is fixed
			// it should return incorrect_appkey instead of wrong_query 
			QUnit.ok(self.config.target.html().match(/Unrecognized query/),
				'Checking the Error: "incorrect_appkey" usecase rendering');
			//QUnit.ok($(params.target).html().match(/Incorrect application key was specified in the query/),
			//	'Checking the Error: "incorrect_appkey" usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.onUpdate = function(callback) {
	var self = this;
	suite.counter.config.set("appkey", "echo.jssdk.tests.aboutecho.com");
	suite.counter.events.subscribe({
		"topic" : "Echo.StreamServer.Apps.Counter.onUpdate",
		"once"  : true,
		"handler" : function(topic, params) {
			QUnit.ok(typeof(params.data.count) === "number",
				'Checking if data.count contains valid value');
		}
	});
	suite.counter.events.subscribe({
		"topic" : "Echo.StreamServer.Apps.Counter.onRefresh",
		"once"  : true,
		"handler" : function(topic, params) {
			QUnit.ok(self.config.target.html().match(suite.counter.get("data.count")),
				'Checking the common usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.destroy = function(callback) {
	suite.counter.destroy();
	callback();
};

});
