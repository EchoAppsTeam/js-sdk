Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery"
	], function($) {

	"use strict";

	Echo.Tests.module("Compatibility tests");

	Echo.Tests.asyncTest("jQuery no conflict", function() {
		var testVersion = "1.4.1";
		QUnit.ok(!(window.$ || window.jQuery), "jQuery is not defined globally");

		Echo.require(["https://cdnjs.cloudflare.com/ajax/libs/jquery/" + testVersion + "/jquery.min.js"], function () {
			QUnit.strictEqual(window.$.fn.jquery, testVersion, "Downloaded jQuery has the expected version");
			QUnit.notEqual(window.$.fn.jquery, $.fn.jquery, "Echo jQuery instance wasn't overridden after another jQuery version inclusion on the page");

			Echo.require(["jquery"], function () {
				QUnit.strictEqual(window.$.fn.jquery, testVersion, "External jQuery instance has the expected version after Echo jQuery inclusion");
				QUnit.notEqual(window.$.fn.jquery, $.fn.jquery, "Echo jQuery and external jQuery instances have different versions");
				window.jQuery.noConflict(true);
				QUnit.ok(!(window.$ || window.jQuery), "jQuery is not defined globally after noConflict() call");
				QUnit.start();
			});
		});
	}, {
		"timeout": 6000
	});

	Echo.Tests.asyncTest("v2 and v3 no conflict", function() {
		var compareWithV2Scripts = Echo.Tests.isolate(function(callback) {
			var win = this;
			$("<script>")
				.on("load readystatechange", function() {
					$(this).off("load readystatechange");
					var EchoV2 = win.Echo;
					var EchoV3 = window.Echo;
					var inV2 = $.map(EchoV3, function(v, k) {
						return EchoV2[k];
					});
					QUnit.equal(inV2.length, 0, "Neither of Echo V3 keys match with Echo V2 keys");
					callback();
				})
				.appendTo(win.document.body)
				.attr("src", "http://cdn.echoenabled.com/clientapps/v2/packs/full-pack.js");
		});
		compareWithV2Scripts(function() {
			QUnit.start();
		});
	});

	Echo.Tests.asyncTest("require no conflict", function() {
		var origRequire = window.require;
		QUnit.ok(!!Echo.requirejs, "Echo require is loaded");

		Echo.require(["https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.9/require.js"], function () {
			var externalRequire = window.require;
			QUnit.ok(!!window.require, "External require is loaded");
			QUnit.notDeepEqual(window.require, Echo.requirejs,
				"External require end Echo require are different objects");

			Echo.require(["echo/loader"], function () {
				QUnit.deepEqual(window.require, externalRequire,
					"External require is not overridden after Echo require is loaded");
				window.require = origRequire;
				QUnit.start();
			});
		});
	}, {
		"timeout": 6000
	});
	callback();
	});
});
