Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"cookie"
], function($, Cookie) {

"use strict";

Echo.Tests.module("Echo.Cookie", {
	"meta": {
		"className": "Echo.Cookie",
		"functions": ["set", "get", "remove"]
	}
});

Echo.Tests.test("public interface", function() {
	QUnit.ok(!Cookie.get("test_z"), "Cookie 'test_z' is absent");
	Cookie.set("test_a", 1, {"path": "/"});
	Cookie.set("test_a", 2);
	QUnit.equal(Cookie.get("test_a"), "2",
		"We have value of cookie 'test_a' for the current page");
	Cookie.remove("test_a");
	QUnit.equal(Cookie.get("test_a"), "1",
		"We have value of cookie 'test_a' for the '/' page after removing value for the current page");
	Cookie.remove("test_a", {"path": "/"});
	QUnit.ok(!Cookie.get("test_a"), "Cookie 'test_a' doesn't exist anymore");
});
callback();
});
});
