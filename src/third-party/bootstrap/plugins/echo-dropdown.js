(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Dropdown) return;

/**
 * @class Echo.GUI.Dropdown
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#dropdowns" target="_blank">bootstrap-dropdown.js</a>.
 * The dropdown HTML code automatically builds depending on parameters you have passed to the constructor.
 *
 * Example:
 * 	var dropdown = new Echo.GUI.Dropdown({
 * 		"target": ".css-selector",
 * 	    "title": "Dropdown title",
 * 		"entries": [{
 * 			"title": "entry1",
 * 			"handler": function() {},
 * 			"icon": "http://example.com/icon.png"
 * 		}, {
 * 			"title": "entry2",
 * 		}]
 * 	});
 *
 * @constructor
 * Creates a new dropdown in the container you have passed in the "params.target".
 *
 * @param {Object} params
 * Dropdown parameters.
 *
 * @param {Mixed} params.target
 * Container which should contains the dropdown.
 * This parameter can be several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @param {String} params.title
 * Dropdown title.
 *
 * @param {Array} params.entries
 * Array of the dropdown entries.
 * Each entry is the object with the following parameters:
 * 	title   - entry title
 * 	handler - function which will be called when entry is selected
 * 	icon    - URL for the icon.
 */
Echo.GUI.Dropdown = function(params) {
	if (!params || typeof params.target === "undefined") return;

	this.element = params.target instanceof Echo.jQuery
		? params.target
		: $(params.target);

	var dropdown = this._assembleContainer(params);
	this._assembleEntries(params.entries, dropdown);
};

/**
 * This method allows to change dropdown title.
 *
 * @param {Object} params
 *
 * @param {String} params.title
 * Dropdown title.
 */
Echo.GUI.Dropdown.prototype.setTitle = function(title) {
	$(".dropdown-toggle", this.element).empty().append(title);
};

Echo.GUI.Dropdown.prototype._assembleContainer = function(params) {
	var container = $("<ul>").addClass("nav")
		.appendTo(this.element);
	var dropdown = $("<li>")
		.addClass("dropdown")
		.appendTo(container);
	$("<a>").addClass("dropdown-toggle")
		.attr("data-toggle", "dropdown")
		.attr("role", "button")
		.attr("href", "#")
		.append(params.title)
		.appendTo(dropdown);
	return dropdown;
};

Echo.GUI.Dropdown.prototype._assembleEntries = function(entries, container) {
	var menu = $("<ul>").addClass("dropdown-menu")
		.attr("role", "menu")
		.appendTo(container);
	$.map(entries || [], function(entry) {
		var item = $("<a role='button' class='echo-clickable' />")
			.click(function() {
				entry.handler && entry.handler.call(this, {
					"title": entry.title
				});
			});
		if (entry.icon) {
			item.css({
				"background-image": "url(" + entry.icon + ")",
				"background-repeat": "no-repeat",
				"background-position": "10px 5px",
				"padding-left": 32
			});
		}
		item.append(entry.title).appendTo(($("<li>").appendTo(menu)));
	});
	return menu;
};

})(Echo.jQuery);
