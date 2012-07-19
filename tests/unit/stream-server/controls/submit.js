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
		suite.control = {};
		$.each(["postButton", "name", "url", "text", "content"], function(key, value) {
			suite.control[value] = function() {
				return $("." + suite.submit.cssPrefix + "-" + value, suite.target);
			};
		});
		suite.postHandler = function() { };
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

})(jQuery);
