Echo.require([
	"jquery",
	"echo/user-session",
	"echo/utils"
], function($, UserSession, Utils) {

"use strict";

Echo.Tests.module("Echo.UserSession", {
	"meta": {
		"className": "Echo.UserSession",
		"functions": [
			// public interface
			"set",
			"get",
			"is",
			"has",
			"any",
			"logout",

			// private methods
			"_maybeDelegate",
			"_onInit",
			"_isLogged",
			"_getActiveIdentities",
			"_getAvatar",
			"_getName",
			"_hasIdentity",
			"_anyMarker",
			"_anyRole"
		]
	},
	"setup": function() {
		resetUserSession();
	}
});

Echo.Tests.asyncTest("logged in checks", function() {
	UserSession({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {
			var user = this;
			var identity = "http://somedomain.com/users/fake_user";

			QUnit.ok(user.is("logged"),
				"Check that user is logged in via user.is(\"logged\") function");
			QUnit.equal(user.is("logged"), user._isLogged(),
				"Check \"is\" function delegation using \"logged\" property");

			QUnit.equal(user.get("name"), "john.doe",
				"Checking user.get() method, requesting user name");

			QUnit.equal(user.get("avatar"),
				"http://example.com/avatar.png",
				"Checking functions delegation: user.get() method, requesting user avatar");
			QUnit.equal(user.get("avatar"), user._getAvatar(),
				"Checking functions delegation: user.get() method should return the same value as user._getAvatar() one");
			QUnit.equal(user.get("activeIdentities").length, user._getActiveIdentities().length,
				"Checking active identities calculation via user.get(\"activeIdentities\") and via private user._getActiveIdentities() function");

			QUnit.ok(user.has("identity", identity),
				"Checking user.has(\"identity\", \"...\") function if condition is true");
			QUnit.ok(!user.has("identity", identity + "/other"),
				"Checking user.has(\"identity\", \"...\") function if condition is false");

			QUnit.ok(!!user.get("emails").length,
				"Checking email list extraction");
			QUnit.equal(user.get("email"), "john.doe@test.com",
				"Checking primary email extraction from user object");

			checkBasicOperations(user);

			user.logout(function() {
				QUnit.ok(!user.is("logged"), "Check that user is not logged after logout");
				QUnit.start();
			});
		}
	});
}, {
	"user": {"status": "logged"},
	"timeout": 8000
});

Echo.Tests.asyncTest("anonymous checks", function() {
	UserSession({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {
			var user = this;
			QUnit.ok(!user.is("logged"),
				"Check if the user is not logged in using user.is(\"logged\") function");
			QUnit.equal(user.is("logged"), user._isLogged(),
				"Check \"is\" function delegation using \"logged\" property");

			var avatar = user.get("avatar");
			var defaultAvatar = "http://example.com/default-avatar.png";
			QUnit.equal(user.get("avatar", defaultAvatar), defaultAvatar,
				"Checking get operation with existing attribute and default value via function call delegation (avatar field)");

			QUnit.ok(!user.get("emails"),
				"Checking email list extraction for anonymous user");
			QUnit.ok(!user.get("email"),
				"Checking primary email extraction for anonymous user");

			checkBasicOperations(user);
			QUnit.start();
		}
	});
});

Echo.Tests.asyncTest("backplane corner cases", function() {
	var initUser = function(callback) {
		UserSession({
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"ready": callback
		});
	};
	var sequentialCalls = function(callback) {
		resetUserSession();
		Backplane.initialized = false;
		initUser(function() {
			QUnit.ok(!this.is("logged"),
				"Check if user isn't logged when initialization was started without Backplane");
			Backplane.initialized = true;
			initUser(function() {
				QUnit.ok(this.is("logged"),
					"Check if user is logged when first user initialization was started without Backplane");
				callback();
			});
		});
	};
	var parallelCalls = function(done) {
		// we need to simulate a latency so we can start parallel initialisation
		var init = $.proxy(UserSession._whoamiRequest, UserSession);
		sinon.stub(UserSession, "_whoamiRequest", function(args) {
			setTimeout(function() { init(args); }, 500);
		});

		resetUserSession();

		Utils.parallelCall([function(callback) {
			Backplane.initialized = false;
			initUser(function() {
				QUnit.ok(!this.is("logged"),
					"Check if user isn't logged when initialization was started without Backplane");
				callback();
			});
		}, function(callback) {
			Backplane.initialized = true;
			QUnit.equal(UserSession.state, "ready", "Check if user state is \"ready\"");
			initUser(function() {
				QUnit.ok(this.is("logged"), "Check if user is logged when previous user state was \"ready\"");
				callback();
			});
		}, function(callback) {
			Backplane.initialized = true;
			QUnit.equal(UserSession.state, "waiting", "Check if user state is \"waiting\"");
			initUser(function() {
				QUnit.ok(this.is("logged"), "Check if user is logged when previous user state was \"waiting\"");
				callback();
			});
		}], function() {
			UserSession._whoamiRequest.restore();
			done();
		});
	};

	QUnit.expect(7);
	Utils.sequentialCall([
		sequentialCalls,
		parallelCalls
	], function() {
		QUnit.start();
	});
}, {
	"user": {"status": "logged"},
	"timeout": 6000
});

// FIXME: test is disabled because it doesn't really test anything at the moment
Echo.Tests._asyncTest("error handling", function() {
	UserSession({
		"ready": function() {
			var user = this;
			QUnit.ok(true, "The \"ready\" callback is executed even when the appkey is missing");
			QUnit.ok(
				!this.is("logged"),
				"UserSession object initialized with no appkey is considered as anonymous user"
			);
		}
	});

	resetUserSession();
	UserSession({
		"appkey": "invalid.appkey.sdk.test",
		"ready": function() {
			QUnit.ok(
				!this.is("logged"),
				"UserSession object initialized using invalid appkey is considered as anonymous user"
			);
		}
	});

	Backplane.initialized = false;
	resetUserSession();
	UserSession({
		"appkey": "echo.jssdk.tests.aboutecho.com",
		"ready": function() {
			QUnit.ok(
				!this.is("logged"),
				"UserSession object initialized with Backplane inactive is considered as anonymous user"
			);
			Backplane.initialized = true;
			QUnit.start();
		}
	});
});

function resetUserSession() {
	// force Echo.UserSession to re-initialize itself completely
	// during the next Echo.UserSession object initialization
	UserSession.state = undefined;
	UserSession._sessionID = undefined;
}

function checkBasicOperations(user) {
	var identity = "http://somedomain.com/users/fake_user";

	QUnit.equal(user.is("some-random-value"), undefined,
		"Check if we received expected result when calling 'is' function with unexpected argument");

	user.set("state", "ModeratorBanned");
	QUnit.equal(user.get("state"), "ModeratorBanned",
		"Checking basic get/set operations with simple values (user state: string)");

	user.set("name", "sean.doe");
	QUnit.equal(user.get("name"), "sean.doe",
		"Checking basic get/set operations with simple values (user name: string)");

	user.set("avatar", "http://example.com/my-avatar.png");
	QUnit.equal(user.get("avatar"), "http://example.com/my-avatar.png",
		"Checking basic get/set operations with simple values (user avatar: string)");

	user.set("avatar", false);
	QUnit.strictEqual(user.get("avatar"), false,
		"Checking basic get/set operations with casting to false values");

	user.set("some_attr", undefined);
	QUnit.equal(user.get("some_attr", "default value"), "default value",
		"Checking get operation with undefined attribute and default value");
	QUnit.equal(user.get("fake_attr", "default value"), "default value",
		"Checking get operation with fake attribute and default value");

	var roles = ["role1", "role2", "role3"];	
	user.set("roles", roles);
	QUnit.equal(user.get("roles").length, roles.length,
		"Checking get/set operations with arrays (user roles)");
	QUnit.ok(user.any("roles", ["role2"]),
		"Checking user.any() function with arrays (user roles)");
	QUnit.ok(!user.any("roles", ["non-existing-role"]),
		"Checking user.any() function with arrays (user roles) with empty intersection");
	QUnit.ok(user.has("role", "role3"),
		"Checking user.has(\"role\", \"...\") function with delegation (user roles)");
	QUnit.ok(!user.has("role", "non-existing-role"),
		"Checking user.has() function for non-existing role");

	var markers = ["marker1", "marker2", "marker3"];	
	user.set("markers", markers);
	QUnit.equal(user.get("markers").length, markers.length,
		"Checking get/set operations with arrays (user markers)");
	QUnit.ok(user.any("markers", ["marker2"]),
		"Checking user.any() function with arrays (user markers)");
	QUnit.ok(!user.any("markers", ["non-existing-marker"]),
		"Checking user.any() function with arrays (user markers) with empty intersection");
	QUnit.ok(user.has("marker", "marker3"),
		"Checking user.has() function with arrays (user marker)");
	QUnit.ok(!user.has("marker", "non-existing-marker"),
		"Checking user.has() function for non-existing marker");

	QUnit.equal(user.has("identity", identity), user._hasIdentity(identity),
		"Checking delegation using user.has(\"identity\", \"...\") function");
}

});
