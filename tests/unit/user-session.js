(function($) {

var suite = Echo.Tests.Unit.UserSession = function() {};

suite.prototype.info = {
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
};

suite.prototype.tests = {};

suite.prototype.tests.LoggedInUserChecks = {
	"config": {
		"async": true,
		"user": {"status": "logged"},
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var user = Echo.UserSession({"appkey": "test.aboutecho.com"});
		var identity = "http://somedomain.com/users/fake_user";

		QUnit.ok(user.is("logged"),
			"Check that user is logged in via user.is(\"logged\") function");
		QUnit.equal(user.is("logged"), user._isLogged(),
			"Check \"is\" function delegation using \"logged\" property");

		QUnit.equal(user.get("name"), "john.doe",
			"Checking user.get() method, requesting user name");

		QUnit.equal(user.get("avatar"),
			"http://c0.echoenabled.com/images/avatar-default.png",
			"Checking functions delegation: user.get() method, requesting user avatar");
		QUnit.equal(user.get("avatar"), user._getAvatar(),
			"Checking functions delegation: user.get() method should return the same value as user._getAvatar() one");
		QUnit.equal(user.get("activeIdentities").length, user._getActiveIdentities().length,
			"Checking active identities calculation via user.get(\"activeIdentities\") and via private user._getActiveIdentities() function");

		QUnit.ok(user.has("identity", identity),
			"Checking user.has(\"identity\", \"...\") function if condition is true");
		QUnit.ok(!user.has("identity", identity + "/other"),
			"Checking user.has(\"identity\", \"...\") function if condition is false");

		this.checkBasicOperations();
	
		QUnit.start();
	}
};

suite.prototype.tests.AnonymousUserChecks = {
	"config": {
		"async": true,
		"user": {"status": "anonymous"},
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var user = Echo.UserSession({"appkey": "test.aboutecho.com"});

		QUnit.ok(!user.is("logged"),
			"Check if the user is not logged in using user.is(\"logged\") function");
		QUnit.equal(user.is("logged"), user._isLogged(),
			"Check \"is\" function delegation using \"logged\" property");

		var avatar = user.get("avatar");
		var defaultAvatar = "http://example.com/default-avatar.png";
		QUnit.equal(user.get("avatar", defaultAvatar), defaultAvatar,
			"Checking get operation with existing attribute and default value via function call delegation (avatar field)");

		this.checkBasicOperations();

		QUnit.start();
	}
};

suite.prototype.checkBasicOperations = function() {
	var user = Echo.UserSession({"appkey": "test.aboutecho.com"});
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

	var topic = "Echo.UserSession.onInit";
	var handlerId = Echo.Events.subscribe({
		"topic": topic,
		"handler": function() {
			Echo.Events.unsubscribe({
				"topic": topic,
				"handlerId": handlerId
			});
			QUnit.ok(true, "Check if \"onInit\" callback is executed after class init");
		}
	});

	Echo.UserSession({"appkey": "test.aboutecho.com", "ready": function() {
		QUnit.ok(true, "Checking if the \"ready\" callback is executed after class init");
	}});
};

})(jQuery);
