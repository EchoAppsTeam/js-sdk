(function($) {

"use strict";

var suite = Echo.Tests.Unit.Counter = function() {};

suite.prototype.info = {
        "className" : "Echo.Counter",
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
		var target = document.getElementById("qunit-fixture");	
		$(target).empty();
		var count = 99;
		var counter = new Echo.StreamServer.Controls.Counter({
			"target" : target,
			"appkey" : "test.aboutecho.com",
			"data"   : {"count": count}
		});
		var handlerId = counter.events.subscribe({
			"topic"   : "Echo.StreamServer.Controls.Counter.onRender",
			"handler" : function(topic, params) {
				// unsubscribe to avoid multiple test cases execution
				counter.events.unsubscribe({
					"handlerId" : handlerId
				});
				QUnit.ok($(target).html().match(count),
					'Checking the common usecase rendering');
				QUnit.start();
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
		var target = document.getElementById("qunit-fixture");	
		$(target).empty();
		suite.counter = new Echo.StreamServer.Controls.Counter({
			"target" : target,
			"appkey" : "test.aboutecho.com",
			"query"  : "childrenof:http://example.com/*"
		});
		this.sequentialAsyncTests([
			"onError_more_than",
			"onError_wrong_query",
			"onUpdate"],
		"cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.onError_more_than = function(callback) {
	var handlerId = suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Counter.onError",
		"handler" : function(topic, params) {
			// unsubscribe to avoid multiple test cases execution
			suite.counter.events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.deepEqual(
				params.data,
				{
					"result" : "error",
					"errorCode" : "more_than",
					"errorMessage" : 5000,
					"liveUpdatesTimeout" : NaN
				},
				'Checking the restrictions of the count API. Error: "more_than"');
			QUnit.ok($(params.target).html() === "<span>5000+</span>",
				'Checking the Error: "more_than" usecase rendering');
			callback();
		}
	});
};

suite.prototype.cases.onError_wrong_query = function(callback) {
	suite.counter.config.set("query", "children1of:http://example.com/*");
	var handlerId = suite.counter.events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Counter.onError",
		"handler" : function(topic, params) {
			// unsubscribe to avoid multiple test cases execution
			suite.counter.events.unsubscribe({
				"handlerId": handlerId
			});
			QUnit.deepEqual(
				params.data,
				{
					"result" : "error",
					"errorCode" : "wrong_query",
					"errorMessage" : "Unrecognized query"
				},
				'Checking the restrictions of the count API. Error: "wrong_query"');
			QUnit.ok($(params.target).html().match(/Unrecognized query/),
				'Checking the Error: "wrong_query" usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

suite.prototype.cases.onUpdate = function(callback) {
	suite.counter.config.set("query", "childrenof:http://example.com/test/*");
	var handlerId = suite.counter.events.subscribe({
		"topic" : "Echo.StreamServer.Controls.Counter.onUpdate",
		"handler" : function(topic, params) {
			// unsubscribe to avoid multiple test cases execution
			suite.counter.events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.ok(typeof(params.data.count) === "number",
				'Checking if data.count contains valid value');
			QUnit.ok($(params.target).html().match(params.data.count),
				'Checking the common usecase rendering');
			callback();
		}
	});
	suite.counter.refresh();
};

})(jQuery);
