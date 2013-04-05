(function($) {

var data = {
	"instance": {
		"name": "Echo.IdentityServer.Controls.Auth"
	},
	"config": {
		"async": true,
		"testTimeout": 10000
	}
};

var suite = Echo.Tests.Unit.Auth = function() {
	this.constructRenderersTest(data);
};

suite.prototype.info = {
	"className" : "Echo.IdentityServer.Controls.Auth",
	"functions": ["template"]
};

suite.prototype.tests = {};


suite.prototype.tests.loggedInUser = {
	"config": {
		"async": true,
		"testTimeout": 20000, // 20 secs
		"user": {"status": "logged"}
	},
	"check" : function() {
		var identityManager = {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="};
		var target = document.getElementById("qunit-fixture");	
		$(target).empty();

		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.IdentityServer.Controls.Auth.onRender",
			"context": "global",
			"handler": function(topic, params) {
				// unsubscribe to avoid multiple test cases execution
				Echo.Events.unsubscribe({
					"handlerId": handlerId
				});
				QUnit.ok($(target).html().match(/echo-identityserver-controls-auth-userLogged/),
					"Checking the logged user mode rendering");
			}
		});

		var checkAvatar = function() {
			var self = this;
			var getRenderedAvatar = function() {
				return self.view.get("avatar").find("img").attr("src");
			};
			// case: user avatar is available
			QUnit.equal(this.user.get("avatar"), getRenderedAvatar(), "Checking if user avatar is rendered");
			// case: user avatar isn't available
			this.user.set("avatar", "");
			this.refresh();
			QUnit.equal(this._manifest("config").defaultAvatar, getRenderedAvatar(), "Checking if default avatar is rendered");
			var avatar = Echo.Loader.getURL("images/info70.png", false);
			// case: user avatar isn't available and defaultAvatar was setted
			this.config.set("defaultAvatar", avatar);
			this.refresh();
			QUnit.equal(avatar, getRenderedAvatar(), "Checking if specified default avatar is rendered");

			QUnit.start();
		};

		new Echo.IdentityServer.Controls.Auth({
			"target": target,
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"identityManager": {
				"login": identityManager,
				"signup": identityManager
			},
			"ready": checkAvatar
		});
	}
};

suite.prototype.tests.anonymousUser = {
	"config" : {
		"async": true,
		"testTimeout": 20000, // 20 secs
		"user": {"status": "anonymous"}
	},
	"check" : function() {
		var identityManager = {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="};
		var target = document.getElementById("qunit-fixture");	
		$(target).empty();
		var handlerId = Echo.Events.subscribe({
			"topic": "Echo.IdentityServer.Controls.Auth.onRender",
			"handler": function(topic, params) {
				// unsubscribe to avoid multiple test cases execution
				Echo.Events.unsubscribe({
					"handlerId": handlerId
				});
				QUnit.ok($(target).html().match(/echo-identityserver-controls-auth-userAnonymous/),
					"Checking the anonymous mode rendering");
				QUnit.start();
			}
		});
		new Echo.IdentityServer.Controls.Auth({
			"target": target,
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"identityManager": {
				"login": identityManager,
				"signup": identityManager
			}
		});
	}
};

})(Echo.jQuery);
