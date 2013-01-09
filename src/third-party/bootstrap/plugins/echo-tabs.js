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
 * @param {Array} [config.entries]
 * Array of entries (tabs).
 * Each entry is the JS object with the following parameters:
 * 	id         - Tab id.
 * 	label      - Tab label.
 * 	panel      - HTML Element which contains tab content.
 * 	disabled   - Specifies whether the tab disabled.
 * 	extraClass - Class name to be added to the tab element.
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

	this.config = $.extend(true, {}, {
		"panels": "<div>",
		"entries": [],
		"extraClass": "",
		"show": function() {}
	}, config);
	this.config.panels = $(this.config.panels);
	this.config.target = $(this.config.target);

	this.refresh();
};

/**
 * This method re-assemble the tabs HTML code and
 * append it to the target.
 */
Echo.GUI.Tabs.prototype.refresh = function() {
	if (!this.config.target) return;

	var self = this,
		entries = this.config.entries,
		panels = this.config.panels,
		target = this.config.target;

	target.empty();
	target.empty();

	this.tabsContainer = $('<ul class="nav nav-tabs">');
	target.append(this.tabsContainer);

	panels.addClass("tab-content");
	if (panels.parent().length === 0) {
		target.append(panels);
	}

	if (entries.length) {
		for (var i =0; i < entries.length; i++) {
			this.add(entries[i]);
		}
	}
};

/**
 * Hides the tabs and removes it's instance.
 */
Echo.GUI.Tabs.prototype.destroy = function() {
	this.config.target.empty();
	delete this.config.target;
};

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
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.config.entries[tabIndex].disabled = true;
		this.config.target.find("a[data-item='" + id + "']")
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
		this.config.entries[tabIndex].disabled = false;
		this.config.target.find("a[data-item='" + id + "']")
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
		this.config.entries.splice(tabIndex, 1);
		this.config.target.find("a[data-item='" + id + "']").remove();
		this.config.panels.find("[id='" + id + "']").remove();
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
 * @param {HTMLElement} tabConfig.disabled
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
		self.config.show.call(self, this);
	});
	this.tabsContainer.append(tab);

	if (tabConfig.panel) {
		if (tabConfig.panel.attr("id") !== tabConfig.id.toString()) {
			tabConfig.panel.attr("id", tabConfig.id);
		}
		this.config.panels.append(tabConfig.panel.addClass("tab-pane"));
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
 * This method updates config and re-assemble HTML code of the tabs.
 *
 * It can be called with the same parameters as a {@link Echo.GUI.Tabs#constructor}
 * except config.target.
 */
Echo.GUI.Tabs.prototype.update = function(id, config) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.config.entries[tabIndex] = $.extend(this.config.entries[tabIndex], config);
		config.content && this.config.panels.find("[id='" + id + "']").html(config.content);
		this.config.target.find("a[data-item='" + id + "']")
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
	this.config.target.find("a[data-item='" + id + "']").tab("show");
};

Echo.GUI.Tabs.prototype._getTabIndex = function(id) {
	for (var i = 0; i < this.config.entries.length; i++) {
		if (this.config.entries[i].id === id) {
			return i;
		}
	}
	return -1;
}

})(Echo.jQuery);
