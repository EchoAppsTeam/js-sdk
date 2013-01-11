(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Dropdown) return;

/**
 * @class Echo.GUI.Dropdown
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#dropdowns" target="_blank">bootstrap-dropdown.js</a>.
 * The Echo.GUI.Dropdown class provides a simplified interface to work with the
 * Bootstrap Dropdown JS class.
 * Echo wrapper assembles the HTML code required for Bootstrap Dropdown JS class
 * based on the parameters specified in the config and initializes
 * the corresponding Bootstrap JS class.
 *
 * Example:
 * 	var dropdown = new Echo.GUI.Dropdown({
 * 		"target": ".css-selector",
 * 		"title": "Dropdown title",
 * 		"extraClass": "nav",
 * 		"entries": [{
 * 			"title": "entry1",
 * 			"handler": function() {},
 * 			"icon": "http://example.com/icon.png"
 * 		}, {
 * 			"title": "entry2"
 * 		}]
 * 	});
 *
 * @extends Echo.GUI
 * @constructor
 * Creates a new dropdown in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Dropdown parameters.
 *
 * @cfg {Mixed} target
 * The container where the dropdown should be located.
 * This parameter can have several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @cfg {String} extraClass
 * Custom class name which should be added to the dropdown.
 *
 * @cfg {String} title
 * Dropdown title.
 *
 * @cfg {Array} entries
 * Array of the dropdown entries.
 * Each entry is the object with the following parameters:
 * 	title   - entry title
 * 	handler - function which will be called when entry is selected
 * 	icon    - URL for the icon. Icon size should be 16x16 pixels.
 */
Echo.GUI.Dropdown = Echo.Utils.inherit(Echo.GUI, function(config) {
	if (!config || !config.target) return;

	config.target = $(config.target);
	Echo.GUI.call(this, config, {
		"title": "",
		"extraClass": "",
		"entries": []
	});
});

Echo.GUI.Dropdown.prototype.refresh = function() {
	this.config.get("target").empty();
	this._assembleEntries(this._assembleContainer());
};

/**
 * This method allows to change dropdown title.
 *
 * @param {String} title
 * Dropdown title.
 */
Echo.GUI.Dropdown.prototype.setTitle = function(title) {
	$(".dropdown-toggle", this.config.get("target")).empty().append(title);
};

Echo.GUI.Dropdown.prototype._assembleContainer = function() {
	 var template =
		'<li class="dropdown">' +
			'<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' +
				this.config.get("title") +
			'</a>' +
		'</li>';
	var dropdown = $(template);
	this.config.get("target").append($('<ul class="' + this.config.get("extraClass") + '">').append(dropdown));

	return dropdown;
};

Echo.GUI.Dropdown.prototype._assembleEntries = function(container) {
	var menu = $('<ul class="dropdown-menu" role="menu">');
	container.append(menu);

	$.map(this.config.get("entries"), function(entry) {
		var item = $("<a role='button' class='echo-clickable' />")
			.click(function() {
				entry.handler && entry.handler.call(this, entry);
			});
		if (entry.icon) {
			item.addClass("icon");
			item.css({
				"background-image": "url(" + entry.icon + ")"
			});
		}
		menu.append($("<li>").append(item.append(entry.title)));
	});
	return menu;
};

})(Echo.jQuery);
