(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Tabs) return;

/**
 * @class Echo.GUI.Tabs
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#tabs" target="_blank">bootstrap-tab.js</a>.
 * The Echo.GUI.Tabs class provides a simplified interface to work with
 * the Bootstrap Tabs JS class.
 * Echo wrapper assembles the HTML code required for Bootstrap Tabs JS class
 * based on the parameters specified in the config and initializes
 * the corresponding Bootstrap JS class.
 *
 * Example:
 * 	var myTabs = new Echo.GUI.Tabs({
 * 		"target": ".css-selector",
 * 		"entries": [{
 * 			"id": "tab1",
 * 			"label": "Tab 1",
 * 			"panel": $(".panel-css-selector"),
 * 			"extraClass": "extra-class"
 * 		}, {
 * 			"id": "tab2",
 * 			"label": "Tab 2",
 * 			"panel": $(".panel-css-selector2"),
 * 		}],
 * 		"show": function() {}
 * 	});
 *
 * @extends Echo.GUI
 * @constructor
 * Creates a new tabs in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Tabs configuration.
 *
 * @cfg {Mixed} target
 * The container where the tabs should be located.
 * This parameter can have several types:
 * 	- CSS selector (ex: "css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @cfg {Array} [entries]
 * Array of entries (tabs).
 * Each entry is the JS object with the following parameters:
 * 	id         - Tab id.
 * 	label      - Tab label.
 * 	panel      - HTML Element which contains tab content.
 * 	disabled   - Specifies whether the tab disabled.
 * 	extraClass - Class name to be added to the tab element.
 *
 * @cfg {HTMLElement} [panels]
 * Container which contains the panels.
 * If this parameter is not specified, the container will be created.
 *
 * @cfg {Function} [show]
 * Function which will be called when tab is shown.
 */
Echo.GUI.Tabs = Echo.Utils.inherit(Echo.GUI, function(config) {
	config.panels = config.panels ? $(config.panels) : $("<div>");

	Echo.GUI.call(this, config, {
		"entries": [],
		"extraClass": "",
		"show": function() {}
	});
});

Echo.GUI.Tabs.prototype.refresh = function() {
	var self = this;
	var entries = this.config.get("entries");
	var panels = this.config.get("panels");
	var target = this.config.get("target");

	target.empty();

	this.tabsContainer = $('<ul class="nav nav-tabs">');
	target.append(this.tabsContainer);

	panels.addClass("tab-content");
	if (panels.parent().length === 0) {
		target.append(panels);
	}

	if (entries.length) {
		for (var i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}
};

/**
 * Method to get a DOM element which contains panels.
 *
 * @return {HTMLElement}
 * DOM element which contains panels.
 */
Echo.GUI.Tabs.prototype.getPanels = function() {
	return this.config.get("panels");
};

/**
 * Method to disable tab.
 *
 * @param {String} id
 * Tab id which should be disabled.
 */
Echo.GUI.Tabs.prototype.disable = function(id) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.config.get("target").find("a[data-item='" + id + "']")
		.removeAttr("data-toggle")
		.addClass("disabled");
	}
};

/**
 * Method to enable tab.
 *
 * @param {String} id
 * Tab id which should be enabled.
 */
Echo.GUI.Tabs.prototype.enable = function(id) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.config.get("target").find("a[data-item='" + id + "']")
			.attr("data-toggle", "tab")
			.removeClass("disabled");
	}
};

/**
 * Method to remove tab.
 *
 * @param {String} id
 * Tab id which should be removed.
 */
Echo.GUI.Tabs.prototype.remove = function(id) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.config.get("entries").splice(tabIndex, 1);
		this.config.get("target").find("a[data-item='" + id + "']").remove();
		this.config.get("panels").find("[id='" + id + "']").remove();
	}
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
 * @param {Boolean} tabConfig.disabled
 * Specifies whether the tab disabled.
 *
 * @param {HTMLElement} tabConfig.panel
 * HTML Element which contains the tab content.
 *
 */
Echo.GUI.Tabs.prototype.add = function(tabConfig) {
	var self = this;
	if (!tabConfig || !tabConfig.id) return;

	var attrs = [
		(tabConfig.disabled ? ' class="disabled"' : ' data-toggle="tab"'),
		'class="' + tabConfig.extraClass + '"',
		'href="#' + tabConfig.id + '"',
		'data-item="' + tabConfig.id + '"'
	];
	var tab = $('<li><a' + attrs.join(" ") + '>' + tabConfig.label  + '</a></li>');

	$("a", tab).on("show", function() {
		self.config.get("show").call(self, this);
	});
	this.tabsContainer.append(tab);

	if (tabConfig.panel) {
		if (tabConfig.panel.attr("id") !== tabConfig.id.toString()) {
			tabConfig.panel.attr("id", tabConfig.id);
		}
		this.config.get("panels").append(tabConfig.panel.addClass("tab-pane"));
	}
	return this.config.get("target");
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
	return this.config.get("target").find("a[data-item='" + id + "']");
};

/**
 * Method to check whether the tab with specified id already exists.
 *
 * @param {String} id
 * Tab id.
 *
 * @return {Boolean}
 * true if tab with specific id exists,
 * false otherwise.
 */
Echo.GUI.Tabs.prototype.has = function(id) {
	return !!this.config.get("target").has("a[data-item='" + id + "']").length;
};

/**
 * This method updates the tab according to the tab config.
 *
 * @param {String} id
 * Tab id which should be updated.
 *
 * @param {Object} config
 * Tab configuration.
 *
 * @param {String} config.label
 * Tab id.
 *
 * @param {String} config.extraClass
 * Class name to be added to the tab element.
 *
 * @param {String} config.content
 * Content of the tab (can contain HTML tags).
 */
Echo.GUI.Tabs.prototype.update = function(id, config) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		config.content && this.config.get("panels").find("[id='" + id + "']").html(config.content);
		this.config.get("target").find("a[data-item='" + id + "']")
			.html(config.label)
			.addClass(config.extraClass);
	}
};

/**
 * Method to show tab with specific id.
 *
 * @param {String} id
 * Tab id which should be shown.
 */
Echo.GUI.Tabs.prototype.show = function(id) {
	this.config.get("target").find("a[data-item='" + id + "']").tab("show");
};

Echo.GUI.Tabs.prototype._getTabIndex = function(id) {
	for (var i = 0; i < this.config.get("entries").length; i++) {
		if (this.config.get("entries")[i].id === id) {
			return i;
		}
	}
	return -1;
}

})(Echo.jQuery);
