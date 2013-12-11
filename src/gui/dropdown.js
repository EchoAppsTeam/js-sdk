Echo.define([
	"jquery",
	"echo/gui",
	"echo/utils"
], function($, GUI, Utils) {

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
 *
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
 * 	// Change the dropdown title
 * 	dropdown.setTitle("New dropdown title");
 *
 * 	// Update the dropdown entities
 * 	dropdown.updateEntries([{
 * 		"title": "New entry",
 * 		"handler": function() {}
 * 	}, {
 * 		"title": "New entry 2"
 * 	}]);
 *
 * @extends Echo.GUI
 *
 * @package gui.pack.js
 * @module
 *
 * @constructor
 * Creates a new dropdown in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Dropdown parameters.
 *
 * @cfg {Mixed} target(required)
 * The container where the dropdown should be located.
 * This parameter can have several types:
 *
 * + CSS selector (ex: ".css-selector")
 * + HTMLElement (ex: document.getElementById("some-element-id"))
 * + jQuery object (ex: $(".css-selector"))
 *
 * @cfg {String} [extraClass=""]
 * Custom class name which should be added to the dropdown.
 *
 * @cfg {String} [title=""]
 * Dropdown title.
 *
 * @cfg {String} [icon=""]
 * URL of the 14x14px icon to be displayed near the dropdown title.
 *
 * @cfg {Array} [entries=[]]
 * Array of the dropdown entries.
 * Each entry is the object with the following parameters:
 *
 * + title - entry title
 * + handler - function which will be called when entry is selected
 * + icon - URL for the icon. Icon size should be 16x16 pixels.
 * + entries - Array of nested entries.
 */
GUI.Dropdown = Utils.inherit(GUI, function(config) {
	GUI.call(this, config, {
		"title": "",
		"extraClass": "",
		"entries": []
	});
});

GUI.Dropdown.prototype.refresh = function() {
	this.config.get("target").empty();
	this._container = this._assembleContainer();
	this._assembleEntries(this._container, this.config.get("entries"));
};

/**
 * This method allows to change dropdown title.
 *
 * @param {String} title
 * Dropdown title.
 */
GUI.Dropdown.prototype.setTitle = function(title) {
	$(".dropdown-toggle", this.config.get("target")).empty().append(title);
};

/**
 * This method allows to re-assemble dropdown entries.
 *
 * @param {Array} entries
 * Array of the dropdown entries. The structure of this array is the same as in
 * {@link #cfg-entries entries} config parameter.
 */
GUI.Dropdown.prototype.updateEntries = function(entries) {
	this.config.set("entries", entries);
	$(".dropdown-menu", this.config.get("target")).remove();
	this._assembleEntries(this._container, entries);
};

GUI.Dropdown.prototype._assembleContainer = function() {
	 var template =
		'<li class="dropdown">' +
			'<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' +
				this.config.get("title") +
			'</a>' +
		'</li>';
	var dropdown = $(template);
	if (this.config.get("icon")) {
		$(".dropdown-toggle", dropdown)
			.css("background", "no-repeat url(" + this.config.get("icon") + ") 3px 0px")
			.css("padding-left", "23px");
	}
	this.config.get("target").append($('<ul class="' + this.config.get("extraClass") + '">').append(dropdown));

	return dropdown;
};

GUI.Dropdown.prototype._assembleEntries = function(container, entries) {
	var self = this;
	var menu = $('<ul class="dropdown-menu" role="menu">');
	container.append(menu);

	$.map(entries, function(entry) {
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
		var li = $("<li>").appendTo(menu);
		item.append(entry.title).appendTo(li);
		if (entry.entries) {
			li.addClass("dropdown-submenu");
			self._assembleEntries(li, entry.entries);
		}
	});
	return menu;
};

return GUI.Dropdown;

});
