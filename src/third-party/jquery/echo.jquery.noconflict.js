define("echo.jquery.noconflict", ["jquery"], function (jq) {
	if (!window.Echo) window.Echo = {};

	if (Echo.jQuery) {
		jq.noConflict(true);
	} else {
		Echo.jQuery = jq.noConflict(true);
	}
	return Echo.jQuery;
});

