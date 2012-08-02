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
		new Echo.StreamServer.Controls.Submit({
			"target": this.config.target,
			"appkey": "test.aboutecho.com",
			"ready" : function() {
				suite.submit = this;
				self.sequentialAsyncTests([
					"name",
					"content",
					"validator",
					"post",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.loggedUserWorkflow = {
	"config": {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"user": {"status": "logged"}
	},
	"check": function() {
		var self = this;
		new Echo.StreamServer.Controls.Submit({
			"target": this.config.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/",
			"ready" : function() {
				suite.submit = this;
				self.sequentialAsyncTests([
					"user",
					"content",
					"post",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.eventSubscriptions = {
	"config": {
		"async" : true,
		"testTimeout" : 20000, // 20 secs
		"user": {"status": "logged"}
	},
	"check": function() {
		var self = this;
		Echo.Events.subscribe({
			"topic"   : "Echo.StreamServer.Controls.Submit.onRender",
			"once"    : true,
			"handler" : function(topic, params) {
				QUnit.ok(self.config.target.html().match(/echo-streamserver-controls-submit/),
				'Checking rendering');
			}
		})
		new Echo.StreamServer.Controls.Submit({
			"target": this.config.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/",
			"ready" : function() {
				suite.submit = this;
				self.sequentialAsyncTests([
					"onInit",
					"onComplete",
					"onError",
					"destroy"
				], "cases");
			}
		});
	}
};

suite.prototype.tests.testMethods = {
	"check": function() {
		new Echo.StreamServer.Controls.Submit({
			"target": this.config.target,
			"appkey": "test.aboutecho.com",
			"targetURL": "http://example.com/",
			"ready" : function() {
				var self = this;
				var content = this.dom.get("text");
				var mandatoryCSS = 'echo-streamserver-controls-submit-mandatory';
				QUnit.ok(this.highlightMandatory(content),
					"Checking that highlightMandatory() returns true if element is empty");
				QUnit.ok(content.parent().hasClass(mandatoryCSS),
					"Checking that highlightMandatory() adds css class to element parent");
				content.focus();
				QUnit.ok(!content.parent().hasClass(mandatoryCSS),
					"Checking that highlightMandatory() removes css class from element parent after focus event");
				content.val("TestContent");
				QUnit.ok(!this.highlightMandatory(content),
					"Checking that highlightMandatory() returns false if element is not empty");
				Echo.Events.subscribe({
					"topic"   : "Echo.StreamServer.Controls.Submit.onRefresh",
					"once"    : true,
					"handler" : function(topic, params) {
						QUnit.equal(self.dom.get("text").val(), "TestContent",
							"Checking that comment field is saved after refresh() method");
						self.destroy();
					}
				});
				this.refresh();
			}
		});
	}
};

suite.prototype.cases = {};

suite.prototype.cases.name = function(callback) {
	var target = this.config.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	suite.postHandler = function() {
		var element = $(".echo-streamserver-controls-submit-nameContainer", target);
		QUnit.ok(element.hasClass('echo-streamserver-controls-submit-mandatory'),
			"Checking that name is mandatory field for anonymous");
		callback();
	};
	button.bind('click', suite.postHandler).click();
};

suite.prototype.cases.content = function(callback) {
	var target = this.config.target, submit = suite.submit;
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
	var target = this.config.target, submit = suite.submit;
	var validator = function() {
		var text = submit.dom.get("text");
		if (text.val() === "Content") {
			submit.highlightMandatory(text.val(""));
			return false;
		}
		return true;
	};
	submit.addPostValidator(validator);
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
	var target = this.config.target, submit = suite.submit;
	submit.refresh();
	var button = submit.dom.get("postButton");
	var name = submit.dom.get("name").val("TestName");
	var url = submit.dom.get("url").val("TestURL");
	var text = submit.dom.get("text").val("TestContent");
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			QUnit.equal(name.val(), "TestName", "Checking that name is saved after posting");
			QUnit.equal(url.val(), "TestURL", "Checking that URL is saved after posting");
			QUnit.ok(!text.val(), "Checking that content is cleared after posting");
			callback();
		}
	});
	button.unbind('click', suite.postHandler).click();
};

suite.prototype.cases.user = function(callback) {
	var target = this.config.target, submit = suite.submit;
	QUnit.equal(submit.dom.get("name").val(), "john.doe", "Checking name of logged user");
	QUnit.equal(submit.dom.get("avatar").html(), "<img src=\"http://c0.echoenabled.com/images/avatar-default.png\">",
		"Checking avatar of logged user");
	callback();
};

suite.prototype.cases.onInit = function(callback) {
	var target = this.config.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
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
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : callback
	});
	submit.post();
};

suite.prototype.cases.onComplete = function(callback) {
	var target = this.config.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			params.postData.content[0].object.title = "Title";
			params.postData.content[0].object.content = "OverridingContent";
		}
	});
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostComplete",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			var activity = params.postData.content[0];
			QUnit.equal(activity.object.content, "OverridingContent",
				"Checking overriding post data in onPostComplete handler");
			QUnit.equal(activity.object.title, "Title",
				"Checking adding title field in onPostComplete handler");
			callback();
		}
	});
	submit.post();
};

suite.prototype.cases.onError = function(callback) {
	var target = this.config.target, submit = suite.submit;
	var button = submit.dom.get("postButton");
	var text = submit.dom.get("text").val("UserContent");
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostInit",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			// override content with fake value
			params.postData.content[0].object.content = {};
		}
	});
	// unsubscribe all onPostError handlers to hide fancybox error message
	Echo.Events.unsubscribe({
		"topic": "Echo.StreamServer.Controls.Submit.onPostError",
		"context": submit.config.get("context")
	});
	Echo.Events.subscribe({
		"topic"   : "Echo.StreamServer.Controls.Submit.onPostError",
		"once"    : true,
		"context" : submit.config.get("context"),
		"handler" : function(topic, params) {
			QUnit.equal(params.postData.result, "error",
				"Checking that postData.result is 'error' in onPostError handler");
			callback();
		}
	});
	submit.post();
};

suite.prototype.cases.destroy = function(callback) {
	if (suite.submit) suite.submit.destroy();
	callback && callback();
};

Echo.Tests.defineComponentInitializer("Echo.StreamServer.Controls.Submit", function(config) {
	return new Echo.StreamServer.Controls.Submit($.extend({
		"target": config.target,
		"appkey": config.appkey,
		"targetURL": config.dataBaseLocation
	}, config));
});

//TODO: added admin specific test cases when admin role will be supported in testlib.js
//suite.prototype.tests.adminWorkflow = {
//
//};

})(jQuery);
