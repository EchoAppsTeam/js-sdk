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

		QUnit.ok(!!user.get("emails").length,
			"Checking email list extraction");
		QUnit.equal(user.get("email"), "john.doe@test.com",
			"Checking primary email extraction from user object");

		this.checkBasicOperations(user);
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

		QUnit.ok(!user.get("emails"),
			"Checking email list extraction for anonymous user");
		QUnit.ok(!user.get("email"),
			"Checking primary email extraction for anonymous user");

		this.checkBasicOperations(user);
		QUnit.start();
	}
};

suite.prototype.tests.checkUserEvents = {
	"config": {
		"async": true,
			"user": {"status": "anonymous"},
		"testTimeout": 20000 // 20 secs
	},
	"check": function() {
		var self = this;
		var user = Echo.UserSession({"appkey": "test.aboutecho.com"});

		var subscribe = function(events) {
			$.map(events, function(topic) {
				topic = "Echo.UserSession." + topic;
				var id = Echo.Events.subscribe({
					"topic": topic,
					"handler": function(_topic, data) {
						Echo.Events.unsubscribe({
							"topic": topic,
							"handlerId": id
						});

						var state = user.is("logged")
							? "logged" : "anonymous";

						QUnit.ok(self._checkParams(data, state),
							"Checking \"" + topic + "\" params of events callback for " + state + " user");
					}
				});
			});
		};

		subscribe(["onInit", "onInvalidate"]);
		self.loginTestUser({}, function() {
			subscribe(["onInit"]);
			self.logoutTestUser(function() {
				subscribe(["onInvalidate"]);
				QUnit.start();
			});
		});
	}
};

suite.prototype.checkBasicOperations = function(user) {
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

	Echo.UserSession({"appkey": "test.aboutecho.com", "ready": function() {
		QUnit.ok(true, "Checking if the \"ready\" callback is executed after class init");
	}});
};

// internal functions

suite.prototype._checkParams = function(data, userStatus) {
	var template = {};
	switch( userStatus ) {
		case "logged":
			template = {
				"echo": {
					"roles": [],
					"state": "",
					"markers": []
				},
				"poco": {
					"entry": {
						"accounts": []
					},
					"startIndex": 0,
					"itemsPerPage": 0,
					"totalResults": 0
				}
			};
			return this._checkDiff(data, template);
			break;

		case "anonymous":
			return this._checkDiff(data, template);
			break;
	}

	return false;
};


suite.prototype._checkDiff = function(origin, template) {
	var result = true;
	if( typeof template == "object" ) {
		for( var i in template )
			if( template.hasOwnProperty(i) && origin.hasOwnProperty(i) && typeof template[i] == typeof origin[i] ) {
				if( typeof template[i] == "object" )
					result =  this._checkDiff(origin[i], template[i]);
				} else {
					result = false;
				}
			} else if( typeof template != typeof origin ) {
				result = false;
			}
		return result;
	};

})(jQuery);
