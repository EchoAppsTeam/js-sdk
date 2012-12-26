(function(jQuery) {

var $ = jQuery;

if ($.fn.echoTabs) return;

/**
 * @class Echo.jQuery.fn.echoTabs
 * Class wrapper for bootstrap-tabs
 *
 * @constructor
 * Creates a new tabs.
 *
 * @param {Object} config
 * Tabs configuration.
 *
 * @param {Function} [config.show]
 * Function which will be called when tab is shown.
*/
var Tabs = function(element, config) {
	this.config = config || {};
	this.element = $(element);
	this.panels = config.panels || $("<div>");
	this._initEvents(this.config);
};

/**
 * Method to get a DOM element which contains panels.
 *
 * @return {HTMLElement}
 * DOM element which contains panels
*/
Tabs.prototype.getPanels = function() {
	return this.panels;
};

Tabs.prototype._initEvents = function(config) {
	this.element.find('a[data-toggle=tab]').each(function(i, el) {
		$(el).on("show", config.show || function() {});
	});
};

/**
 * Method to disable tab.
 *
 * @param {String} id
 * Tab id which should be diabled
*/
Tabs.prototype.disable = function(id) {
	this.element.find("a[href='#" + id + "']")
		.removeAttr("data-toggle")
		.addClass("disabled");
};

/**
 * Method to enable tab.
 *
 * @param {String} id
 * Tab id which should be enabled
*/
Tabs.prototype.enable = function(id) {
	this.element.find("a[href='#" + id + "']")
		.attr("data-toggle", "tabs")
		.removeClass("disabled");
};

/**
 * Method to remove tab.
 *
 * @param {String} id
 * Tab id which should be removed
*/
Tabs.prototype.remove = function(id) {
	this.element.find("a[href='#" + id + "']").remove();
};

/**
 * Method to add tab.
 *
 * @param {Object} tabConfig
 * Tab configuration.
 *
 * @param {String} tabConfig.id
 * Tab id.
 *
 * @param {String} tabConfig.label
 * Tab label which should be displayed.
 *
 * @param {HTMLElement} panel
 * HTMLElement which contains the tab content
*/
Tabs.prototype.add = function(tabConfig, panel) {
	tabConfig = tabConfig || {};
	var tab = $('<li><a data-toggle="tab" href="#' + tabConfig.id + '">' + tabConfig.label  + '</a></li>');
	$("a[data-toggle=tab]", tab).on("show", this.config.show);
	this.element.append(tab);
	this.panels.append(panel);
	return this.element;
};

/**
 * Method to get tab DOM element.
 *
 * @param {String} id
 * Tab id.
 *
 * @return {HTMLElement}
 * DOM element which contains the tab.
*/
Tabs.prototype.get = function(id) {
	return this.element.find("a[href='#" + id + "']");
};

/**
 * Method to check whether the tab is already exists.
 *
 * @param {String} id
 * Tab id.
 *
 * @return {Boolean}
 * true if tab with specific id exists,
 * false otherwise.
*/
Tabs.prototype.has = function(id) {
	return !!this.element.has("a[href='#" + id + "']").length;
};

/**
 * Method to update exists tab.
 *
 * @param {String} id
 * The tab id.
 *
 * @param {Object} config
 * Tab config.
 *
 * @param {String} config.label
 * Tab label.
 *
 * @param {String} [config.class]
 * class name to be added to the tab element
*/
Tabs.prototype.update = function(id, config) {
	this.element.find("a[href='#" + id + "']")
		.html(config.label)
		.addClass(config["class"] || "");
};

/**
 * Method to show specific tab.
 *
 * @param {String} id
 * Tab id which should be shown.
*/
Tabs.prototype.show = function(id) {
	this.element.find("a[href='#" + id + "']").tab("show");
};

$.fn.echoTabs = function() {
	var args  = arguments;
	return this.each(function(){
		var data = $(this).data('echoTabs');
		var config = typeof args[0] === "object" && args[0];
		if (!data) {
			$(this).data('echoTabs', (data = new Tabs(this, config)));
		}
		if (typeof args[0] === "string") {
			data[args[0]].apply(data, Array.prototype.slice.call(args, 1));
		}
	});
};

$.fn.echoTabs.Contructor = Tabs;

})(Echo.jQuery);
