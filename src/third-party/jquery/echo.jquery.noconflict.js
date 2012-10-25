if (!window.Echo) window.Echo = {};

if (Echo.jQuery) {
	jQuery.noConflict(true);
} else {
	Echo.jQuery = jQuery.noConflict(true);
}
