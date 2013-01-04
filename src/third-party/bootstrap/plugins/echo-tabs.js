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
 * Creates a new tabs in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Tabs configuration.
 *
 * @param {Mixed} config.target
 * Container which should contains the tabs.
 * This parameter can be several types:
 * 	- CSS selector (ex: "css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @param {HTMLElement} [config.panels]
 * Container which contains the panels.
 * If this parameter is not specified, the container will be created.
 *
 * @param {Function} [config.show]
 * Function which will be called when tab is shown.
 */
Echo.GUI.Tabs = function(config) {
	if (!config || !config.target) return;

	this.config = $.extend({
		"panels": "<div>",
		"show": function() {}
	}, config);
	this.config.panels = $(this.config.panels);

	this._render();
};

Echo.GUI.Tabs.prototype._render = function() {
	this.config.target.empty();

	this.config.target.append($('<ul class="nav nav-tabs">'));

	this.config.panels.addClass("tab-content");
	if (this.config.panels.parent().length === 0) {
		this.config.target.append(this.config.panels);
	}

	this.config.target.find('a[data-toggle=tab]').on("show", this.config.show);
}

/**
 * Method to get a DOM element which contains panels.
 *
 * @return {HTMLElement}
 * DOM element which contains panels.
 */
Echo.GUI.Tabs.prototype.getPanels = function() {
	return this.config.panels;
};

/**
 * Method to disable tab.
 *
 * @param {String} id
 * Tab id which should be disabled.
 */
Echo.GUI.Tabs.prototype.disable = function(id) {
	this.config.target.find("a[data-item='" + id + "']")
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
	this.config.target.find("a[data-item='" + id + "']")
		.attr("data-toggle", "tab")
		.removeClass("disabled");
};

/**
 * Method to remove tab.
 *
 * @param {String} id
 * Tab id which should be removed.
 */
Echo.GUI.Tabs.prototype.remove = function(id) {
	this.config.target.find("a[data-item='" + id + "']").remove();
	this.config.panels.find("[id='" + id + "']").remove();
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
	this.config.target.append(tab);

	if (panel) {
		if (panel.attr("id") !== tabConfig.id.toString()) {
			panel.attr("id", tabConfig.id);
		}
		this.config.panels.append(panel.addClass("tab-pane"));
	}
	return this.config.target;
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
	return this.config.target.find("a[data-item='" + id + "']");
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
	return !!this.config.target.has("a[data-item='" + id + "']").length;
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
 * @param {String} config.content
 * Tab content.
 *
 * @param {String} [config.class]
 * Class name to be added to the tab element.
 */
Echo.GUI.Tabs.prototype.update = function(id, config) {
	config.content && this.config.panels.find("[id='" + id + "']").html(config.content);
	this.config.target.find("a[data-item='" + id + "']")
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
	this.config.target.find("a[data-item='" + id + "']").tab("show");
};

})(Echo.jQuery);
