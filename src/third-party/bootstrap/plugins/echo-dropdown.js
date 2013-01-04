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
 * Creates a new dropdown in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Dropdown parameters.
 *
 * @param {Mixed} config.target
 * Container which should contains the dropdown.
 * This parameter can be several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @param {String} config.title
 * Dropdown title.
 *
 * @param {Array} config.entries
 * Array of the dropdown entries.
 * Each entry is the object with the following parameters:
 * 	title   - entry title
 * 	handler - function which will be called when entry is selected
 * 	icon    - URL for the icon.
 */
Echo.GUI.Dropdown = function(config) {
	if (!config || !config.target) return;

	config.target = $(config.target);

	this.config = $.extend({
		"title": "",
		"entries": []
	}, config);

	this._render();
};

Echo.GUI.Dropdown.prototype._render = function() {
	this.config.target.empty();
	this._assembleEntries(this._assembleContainer());
}

/**
 * This method allows to change dropdown title.
 *
 * @param {String} title
 * Dropdown title.
 */
Echo.GUI.Dropdown.prototype.setTitle = function(title) {
	this.config.title = title;
	this._render();
};

Echo.GUI.Dropdown.prototype._assembleContainer = function() {
	 var template =
		'<li class="dropdown">' +
			'<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' +
				this.config.title +
			'</a>' +
		'</li>';
	var dropdown = $(template);
	this.config.target.append($('<ul class="nav">').append(dropdown));

	return dropdown;
};

Echo.GUI.Dropdown.prototype._assembleEntries = function(container) {
	var menu = $('<ul class="dropdown-menu" role="menu">');
	container.append(menu);

	$.map(this.config.entries || [], function(entry) {
		var item = $("<a role='button' class='echo-clickable' />")
			.click(function() {
				entry.handler && entry.handler.call(this, entry);
			});
		if (entry.icon) {
			item.css({
				"background-image": "url(" + entry.icon + ")",
				"background-repeat": "no-repeat",
				"background-position": "10px 5px",
				"padding-left": 32
			});
		}
		menu.append($("<li>").append(item.append(entry.title)));
		item.html(entry.title).appendTo(($("<li>").appendTo(menu)));
	});
	return menu;
};

})(Echo.jQuery);
