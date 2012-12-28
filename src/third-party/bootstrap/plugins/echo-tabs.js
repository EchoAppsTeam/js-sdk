(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Tabs) return;

/**
 * @class Echo.GUI.Tabs
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#tabs" target="_blank">bootstrap-tab.js</a>.
 * The tabs HTML code automatically builds depending on parameters you have passed to the constructor.
 *
 * Example:
 * 	var myTabs = new Echo.GUI.Tabs({
 * 		"target": ".css-selector",
 * 		"show": function() {}
 * 	});
 * 	myTabs.add({"id": "tab1", "label": "Tab label"});
 *
 * @constructor
 * Creates a new tabs in the container you have passed in the "params.target".
 *
 * @param {Object} config
 * Tabs configuration.
 *
 * @param {Mixed} params.target
 * Container which should contains the tabs.
 * This parameter can be several types:
 *  - CSS selector (ex: "css-selector")
 *  - HTMLElement (ex: document.getElementById("some-element-id"))
 *  - jQuery object (ex: $(".css-selector"))
 *
 * @param {Function} [config.show]
 * Function which will be called when tab is shown.
 */
Echo.GUI.Tabs = function(config) {
	this.config = config || {};
	if (typeof this.config.target === "undefined") return;

	this.element = config.target instanceof Echo.jQuery
		? config.target
		: $(config.target);

	this.panels = this.config.panels || $("<div>");
	this._initEvents(this.config);
};

/**
 * Method to get a DOM element which contains panels.
 *
 * @return {HTMLElement}
 * DOM element which contains panels.
 */
Echo.GUI.Tabs.prototype.getPanels = function() {
	return this.panels;
};

Echo.GUI.Tabs.prototype._initEvents = function(config) {
	this.element.find('a[data-toggle=tab]').each(function(i, el) {
		$(el).on("show", config.show || function() {});
	});
};

/**
 * Method to disable tab.
 *
 * @param {String} id
 * Tab id which should be disabled.
 */
Echo.GUI.Tabs.prototype.disable = function(id) {
	this.element.find("a[data-item='" + id + "']")
		.removeAttr("data-toggle")
		.addClass("disabled");
};

/**
 * Method to enable tab.
 *
 * @param {String} id
 * Tab id which should be enabled.
 */
Echo.GUI.Tabs.prototype.enable = function(id) {
	this.element.find("a[data-item='" + id + "']")
		.attr("data-toggle", "tabs")
		.removeClass("disabled");
};

/**
 * Method to remove tab.
 *
 * @param {String} id
 * Tab id which should be removed.
 */
Echo.GUI.Tabs.prototype.remove = function(id) {
	this.element.find("a[data-item='" + id + "']").remove();
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
 * HTML Element which contains the tab content.
 */
Echo.GUI.Tabs.prototype.add = function(tabConfig, panel) {
	tabConfig = tabConfig || {};
	var tab = $('<li><a data-toggle="tab" href="#' + tabConfig.id + '" data-item="' + tabConfig.id + '">' + tabConfig.label  + '</a></li>');
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
Echo.GUI.Tabs.prototype.get = function(id) {
	return this.element.find("a[data-item='" + id + "']");
};

/**
 * Method to check whether the tab with specified id is already exists.
 *
 * @param {String} id
 * Tab id.
 *
 * @return {Boolean}
 * true if tab with specific id exists,
 * false otherwise.
 */
Echo.GUI.Tabs.prototype.has = function(id) {
	return !!this.element.has("a[data-item='" + id + "']").length;
};

/**
 * Method to update exists tab.
 *
 * @param {String} id
 * The tab id.
 *
 * @param {Object} config
 * Tab configuration.
 *
 * @param {String} config.label
 * Tab label.
 *
 * @param {String} [config.class]
 * Class name to be added to the tab element.
 */
Echo.GUI.Tabs.prototype.update = function(id, config) {
	this.element.find("a[data-item='" + id + "']")
		.html(config.label)
		.addClass(config["class"] || "");
};

/**
 * Method to show tab with specific id.
 *
 * @param {String} id
 * Tab id which should be shown.
 */
Echo.GUI.Tabs.prototype.show = function(id) {
	this.element.find("a[data-item='" + id + "']").tab("show");
};

})(Echo.jQuery);
