(function($) {

var suite = Echo.Tests.Unit.IdentityServerAPI = function() {};

suite.prototype.info = {
	"className": "Echo.IdentityServer.API",
	"suiteName": "IdentityServer.API",
	"functions": [
		"Request._whoami",
		"Request._update",
		"request"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.PublicWorkflowTests = {
	"config": {
		"async": true,
		"testTimeout": 20000
	},
	"check": function() {
		this.sequentialAsyncTests([
			"simpleWhoamiRequest"//,
			// FIXME: test fails with fake data
			//"simpleUserUpdateRequest"
		], "cases");
	}
};

suite.prototype.cases = {};

suite.prototype.cases.simpleWhoamiRequest = function(callback) {
	var user = Echo.UserSession({"appkey": "echo.jssdk.tests.aboutecho.com"});
	Echo.IdentityServer.API.request({
		"endpoint": "whoami",
		"apiBaseURL": "http://api.echoenabled.com/v1/users/",
		"data": {
			"appkey": user.config.get("appkey"),
			"sessionID": user.get("sessionID")
		},
		"onOpen": function() {
			QUnit.ok(true, "Checking if the \"onOpen\" callback was executed before data sending");
		},
		"onData": function(data) {
			QUnit.ok(data && data.result !== "error",
				"Checking if the \"onData\" callback was executed after the regular request.");
			callback();
		}
	}).send();
};

suite.prototype.cases.simpleUserUpdateRequest = function(callback) {
	var user = Echo.UserSession({"appkey": "echo.jssdk.tests.aboutecho.com"});
	var states = ["Untouched", "ModeratorApproved", "ModeratorBanned", "ModeratorDeleted"];
	var identityURL = "http://example.com/some_path/test-user/";
	var state = states[Math.floor(Math.random() * states.length)];
	var updateRequest = Echo.IdentityServer.API.request({
		"endpoint": "update",
		"apiBaseURL": "http://api.echoenabled.com/v1/users/",
		"data": {
			"content": {
				"field": "state",
				"value": state,
				"identityURL": identityURL,
				"username": "TestUserName"
			},
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"sessionID": user.get("sessionID")
		},
		"onData": function(response) {
			QUnit.ok(
				response && response.echo && response.echo.state === state
				&& response.poco && response.poco.entry && response.poco.entry.accounts
				&& response.poco.entry.accounts.length
				&& response.poco.entry.accounts[0].identityUrl === identityURL
				&& response.poco.entry.accounts[0].username === "TestUserName",
				"Checking if the \"onData\" callback executed after the update request"
			);
			callback();
		}
	});
	this.loginTestUser({"status": "logged"}, function(args) {
		updateRequest.send();
	});
};

})(jQuery);
