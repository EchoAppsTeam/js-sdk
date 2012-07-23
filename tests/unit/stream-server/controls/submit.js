(function($) {

var suite = Echo.Tests.Unit.Submit = function() {};

suite.prototype.info = {
        "className" : "Echo.Submit",
        "functions": []
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
		this.prepareParams(suite.target, suite.submit);
		this.sequentialAsyncTests([
			"name",
			"content",
			"post"],
		"cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.name = function(callback) {
	var target = suite.target;
	var button = suite.control.postButton();
	button.unbind('click', suite.postHandler);
	suite.postHandler = function() {
		var name = $(".echo-streamserver-controls-submit-nameContainer", target);
		QUnit.ok(name.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking that name is mandatory field for anonymous");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};

suite.prototype.cases.content = function(callback) {
	var button = suite.control.postButton();
	suite.control.name().val("TestName");
	button.unbind('click', suite.postHandler);
	suite.postHandler = function() {
		var content = suite.control.content();
		QUnit.ok(content.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking that content is mandatory field for anonymous");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};

suite.prototype.cases.post = function(callback) {
	var target = suite.target;
	var button = suite.control.postButton();
	var name = suite.control.name().val("TestName");
	var url = suite.control.url().val("TestURL");
	var text = suite.control.text().val("TestContent");
	var handlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"context" : suite.submit.config.get("context"),
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
		this.prepareParams(suite.target, suite.submit);
		this.sequentialAsyncTests([
			"username",
			"onInit",
			"onComplete"
		], "cases");
	}
};

suite.prototype.cases.username = function(callback) {
	var target = suite.target;
	QUnit.equal(suite.control.name().val(), "john.doe", "Checking name of logged user");
	callback();
};

suite.prototype.cases.onInit = function(callback) {
	var target = suite.target;
	var button = suite.control.postButton();
	var text = suite.control.text().val("UserContent");
	var handlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"context" : suite.submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : handlerId
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
			callback();
		}
	});
	suite.submit.post();
};

suite.prototype.cases.onComplete = function(callback) {
	var target = suite.target;
	var button = suite.control.postButton();
	var text = suite.control.text().val("UserContent");
	var initHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"context" : suite.submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : initHandlerId
			});
			params.postData.content[0].object.content = "OverridingContent";
		}
	});
	var completeHandlerId = Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"context" : suite.submit.config.get("context"),
		"handler" : function(topic, params) {
			Echo.Events.unsubscribe({
				"handlerId" : completeHandlerId
			});
			var activity = params.postData.content[0];
			QUnit.equal(activity.object.content, "OverridingContent",
				"Checking overriding post data in OnPostComplete handler")
			callback();
		}
	});
	suite.submit.post();
};

suite.prototype.tests.testMethods = {
	"check": function() {
		var self = this;
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		suite.submit = new Echo.StreamServer.Controls.Submit({
			"target": suite.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/"
		});
		this.prepareParams(suite.target, suite.submit);
		var content = suite.submit.dom.get("text");
		var mandatoryCSS = 'echo-streamserver-controls-submit-mandatory';
		QUnit.ok(suite.submit.highlightMandatory(content),
			"Checking that highlightMandatory() returns true if element is empty");
		QUnit.ok(content.parent().hasClass(mandatoryCSS),
			"Checking that highlightMandatory() adds css class to element parent");
		content.focus();
		QUnit.ok(!content.parent().hasClass(mandatoryCSS),
			"Checking that highlightMandatory() removes css class from element parent after focus event");
		content.val("TestContent");
		QUnit.ok(!suite.submit.highlightMandatory(content),
			 "Checking that highlightMandatory() returns false if element is not empty");
	}
};

suite.prototype.prepareParams = function(target, submit) {
	suite.control = {};
	$.each(["postButton", "name", "url", "text", "content"], function(key, value) {
			suite.control[value] = function() {
				return $("." + suite.submit.cssPrefix + "-" + value, suite.target);
			};
	});
	suite.postHandler = function() { };
};

//TODO: added admin specific test cases when admin role will be supported in testlib.js
/*suite.prototype.tests.adminWorkflow = {
	"config": { },
	"check": function() {
		suite.target = document.getElementById("qunit-fixture");
		$(suite.target).empty();
		suite.submit = new Echo.StreamServer.Controls.Submit({
			"target": suite.target,
			"appkey": "test.aboutecho.com",
		});
	}
};*/

})(jQuery);
