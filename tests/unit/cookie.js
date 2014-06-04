(function($) {
"use strict";

Echo.Tests.module("Echo.Cookie", {
	"meta": {
		"className": "Echo.Cookie",
		"functions": ["set", "get", "remove"]
	}
});

Echo.Tests.test("public interface", function() {
	QUnit.ok(!Echo.Cookie.get("test_z"), "Cookie 'test_z' is absent");
	Echo.Cookie.set("test_a", 1, {"path": "/"});
	Echo.Cookie.set("test_a", 2);
	QUnit.equal(Echo.Cookie.get("test_a"), "2",
		"We have value of cookie 'test_a' for the current page");
	Echo.Cookie.remove("test_a");
	QUnit.equal(Echo.Cookie.get("test_a"), "1",
		"We have value of cookie 'test_a' for the '/' page after removing value for the current page");
	Echo.Cookie.remove("test_a", {"path": "/"});
	QUnit.ok(!Echo.Cookie.get("test_a"), "Cookie 'test_a' doesn't exist anymore");
});

})(Echo.jQuery);
