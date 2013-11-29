Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"echo/streamserver/bundled-apps/auth/client-widget",
		"echo/events"
	], function($, Auth, Events) {

	"use strict";

	Echo.Tests.module("Echo.StreamServer.BundledApps.Auth.ClientWidget", {
		"meta": {
			"className" : "Echo.StreamServer.BundledApps.Auth.ClientWidget",
			"functions": ["template"]
		}
	});

	Echo.Tests.renderersTest("Echo.StreamServer.BundledApps.Auth.ClientWidget");

	Echo.Tests.asyncTest("logged in workflow", function() {
		var identityManager = {
			"width": 400,
			"height": 240,
			"url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="
		};
		var target = $("#qunit-fixture");
		Events.subscribe({
			"topic": "Echo.StreamServer.BundledApps.Auth.ClientWidget.onRender",
			"once": true,
			"handler": function(topic, params) {
				QUnit.ok(target.html().match(/echo-streamserver-bundledapps-auth-clientwidget-userLogged/),
					"Checking the logged user mode rendering");
			}
		});
		var checkAvatar = function() {
			var self = this;
			var getRenderedAvatar = function() {
				return self.view.get("avatar").find("img").attr("src");
			};
			QUnit.equal(this.user.get("avatar"), getRenderedAvatar(), "Checking if user avatar is rendered when available");
			this.user.set("avatar", "");
			this.refresh();
			QUnit.equal(this._definition("config").defaultAvatar, getRenderedAvatar(), "Checking if default avatar is rendered when user avatar is not available");
			var avatar = Echo.Loader.getURL("images/info70.png", false);
			this.config.set("defaultAvatar", avatar);
			this.refresh();
			QUnit.equal(avatar, getRenderedAvatar(), "Checking if custom default avatar is rendered when user avatar is not available");
			QUnit.start();
		};
		new Auth({
			"target": target,
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"identityManager": {
				"login": identityManager,
				"signup": identityManager
			},
			"ready": checkAvatar
		});
	}, {
		"user": {"status": "logged"}
	});

	Echo.Tests.asyncTest("anonymous user workflow", function() {
		var identityManager = {
			"width": 400,
			"height": 240,
			"url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="
		};
		var target = $("#qunit-fixture");
		Events.subscribe({
			"topic": "Echo.StreamServer.BundledApps.Auth.ClientWidget.onRender",
			"once": true,
			"handler": function(topic, params) {
				QUnit.ok(target.html().match(/echo-streamserver-bundledapps-auth-clientwidget-userAnonymous/),
					"Checking the anonymous mode rendering");
				QUnit.start();
			}
		});
		new Auth({
			"target": target,
			"appkey": "echo.jssdk.tests.aboutecho.com",
			"identityManager": {
				"login": identityManager,
				"signup": identityManager
			}
		});
	});
	callback();
	});
});
