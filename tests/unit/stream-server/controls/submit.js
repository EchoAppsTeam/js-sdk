(function($) {

var data = {
	"instance": {
		"name": "Echo.StreamServer.Controls.Submit"
	},
	"config": {
		"async": true,
		"testTimeout": 10000
	}
};

var suite = Echo.Tests.Unit.Submit = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className" : "Echo.StreamServer.Controls.Submit",
        "functions": [
		"post",
		"refresh",
		"addPostValidator",
		"highlightMandatory"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.anonymousWorkflow = {
	"config": {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"user": {"status": "anonymous"}
	},
	"check": function() {
		var self = this;
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		suite.submit = new Echo.StreamServer.Controls.Submit({
			"target": suite.target,
			"appkey": "test.aboutecho.com",
		});
		this.sequentialAsyncTests([
			"name",
			"content",
			"validator",
			"post"],
		"cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.name = function(callback) {
	var target = suite.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	suite.postHandler = function() {
		var name = $(".echo-streamserver-controls-submit-nameContainer", target);
		QUnit.ok(name.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking that name is mandatory field for anonymous");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};

suite.prototype.cases.content = function(callback) {
	var target = suite.target, submit = suite.submit;
	submit.refresh();
	var button = submit.dom.get("postButton");
	submit.dom.get("name").val("TestName");
	button.unbind('click', suite.postHandler);
	suite.postHandler = function() {
		var content = submit.dom.get("content");
		QUnit.ok(content.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking that content is mandatory field for anonymous");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};


suite.prototype.cases.validator = function(callback) {
	var target = suite.target, submit = suite.submit;
	var validator = function() {
		var text = submit.dom.get("text");
		if (text.val() === "Content") {
			submit.highlightMandatory(text.val(""));
			return false;
		}
		return true;
	};
	submit.addPostValidator(validator);
	submit.refresh();
	var button = submit.dom.get("postButton");
	button.unbind('click', suite.postHandler);
	var content = submit.dom.get("content");
	var text = submit.dom.get("text").val("Content");
	suite.postHandler = function() {
		QUnit.ok(content.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking custom validator");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};

suite.prototype.cases.post = function(callback) {
	var target = suite.target, submit = suite.submit;
	submit.refresh();
	var button = submit.dom.get("postButton");
	var name = submit.dom.get("name").val("TestName");
	var url = submit.dom.get("url").val("TestURL");
	var text = submit.dom.get("text").val("TestContent");
	var handlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : handlerId
			});
			QUnit.equal(name.val(), "TestName", "Checking that name is saved after posting");
			QUnit.equal(url.val(), "TestURL", "Checking that URL is saved after posting");
			QUnit.ok(!text.val(), "Checking that content is cleared after posting");
			callback();
		}
	});
	button.unbind('click', suite.postHandler).click();
};

suite.prototype.tests.loggedUserWorkflow = {
	"config": {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"user": {"status": "logged"}
	},
	"check": function() {
		var self = this;
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		suite.submit = new Echo.StreamServer.Controls.Submit({
			"target": suite.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/"
		});
		this.sequentialAsyncTests([
			"user",
			"content",
			"post"
		], "cases");
	}
};

suite.prototype.cases.user = function(callback) {
	var target = suite.target, submit = suite.submit;
	QUnit.equal(submit.dom.get("name").val(), "john.doe", "Checking name of logged user");
	QUnit.equal(submit.dom.get("avatar").html(), "<img src=\"http://c0.echoenabled.com/images/avatar-default.png\">",
		"Checking avatar of logged user");
	callback();
};

suite.prototype.tests.eventSubscriptions = {
	"config": {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"user": {"status": "logged"}
	},
	"check": function() {
		var self = this;
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.StreamServer.Controls.Submit.onRender",
			"handler": function(topic, params) {
				Echo.Events.unsubscribe({
					"handlerId" : handlerId
				});
				QUnit.ok($(suite.target).html().match(/echo-streamserver-controls-submit/), 'Checking rendering');
			}
		})
		suite.submit = new Echo.StreamServer.Controls.Submit({
			"target": suite.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/"
		});
		this.sequentialAsyncTests([
			"onInit",
			"onComplete",
			"onError"
		], "cases");
	}
};

suite.prototype.cases.onInit = function(callback) {
	var target = suite.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	var initHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : initHandlerId
			});
			var activity = params.postData.content[0];
			var data = {
				"actor": {
					"objectTypes": [ "http://activitystrea.ms/schema/1.0/person" ],
					"name": "john.doe",
					"avatar": "http://c0.echoenabled.com/images/avatar-default.png"
				},
				"object": {
					"objectTypes": [ "http://activitystrea.ms/schema/1.0/comment"],
					"content": "UserContent",
				},
				"source": {},
				"verbs": [ "http://activitystrea.ms/schema/1.0/post" ],
				"targets": [{
					"id": "http://example.com/"
				}]
			};
			QUnit.deepEqual(activity, data, "Checking post data in onPostInit handler");
		}
	});
	var completeHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : completeHandlerId
			});
			callback();
		}
	});
	submit.post();
};

suite.prototype.cases.onComplete = function(callback) {
	var target = suite.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	var initHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : initHandlerId
			});
			params.postData.content[0].object.content = "OverridingContent";
		}
	});
	var completeHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : completeHandlerId
			});
			var activity = params.postData.content[0];
			QUnit.equal(activity.object.content, "OverridingContent",
				"Checking overriding post data in onPostComplete handler");
			callback();
		}
	});
	submit.post();
};

suite.prototype.cases.onError = function(callback) {
	var target = suite.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	var initHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : initHandlerId
			});
			// override content with fake value
			params.postData.content[0].object.content = {};
		}
	});
	// unsubscribe all onPostError handlers to hide fancybox error message
	Echo.Events.unsubscribe({
		"topic": "Echo.StreamServer.Controls.Submit.onPostError",
		"context": submit.config.get("context")
	});
	var errorHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostError",
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : errorHandlerId
			});
			QUnit.equal(params.postData.result, "error",
				"Checking that postData.result is 'error' in onPostError handler");
			callback();
		}
	});
	submit.post();
};

suite.prototype.tests.testMethods = {
	"check": function() {
		target = document.getElementById("qunit-fixture");
		$(target).empty();
		var submit = new Echo.StreamServer.Controls.Submit({
			"target": target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/"
		});
		var content = submit.dom.get("text");
		var mandatoryCSS = 'echo-streamserver-controls-submit-mandatory';
		QUnit.ok(submit.highlightMandatory(content),
			"Checking that highlightMandatory() returns true if element is empty");
		QUnit.ok(content.parent().hasClass(mandatoryCSS),
			"Checking that highlightMandatory() adds css class to element parent");
		content.focus();
		QUnit.ok(!content.parent().hasClass(mandatoryCSS),
			"Checking that highlightMandatory() removes css class from element parent after focus event");
		content.val("TestContent");
		QUnit.ok(!submit.highlightMandatory(content),
			"Checking that highlightMandatory() returns false if element is not empty");
		submit.refresh();
		QUnit.equal(submit.dom.get("text").val(), "TestContent",
			"Checking that comment field is saved after refresh() method");
	}
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Submit", function(config) {
	return new Echo.StreamServer.Controls.Submit($.extend({
		"target": $(document.getElementById("qunit-fixture")).empty(),
		"appkey": config.appkey,
		"targetURL": config.dataBaseLocation
	}, config));
});

//TODO: added admin specific test cases when admin role will be supported in testlib.js
//suite.prototype.tests.adminWorkflow = {
//
//};

})(jQuery);
