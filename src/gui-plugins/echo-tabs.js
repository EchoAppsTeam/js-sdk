Echo.define("echo/gui/tabs", [
	"jquery",
	"echo/gui",
	"echo/utils"
], function($, GUI, Utils) {

/**
 * @class Echo.GUI.Tabs
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#tabs" target="_blank">bootstrap-tab.js</a>.
 * The GUI.Tabs class provides a simplified interface to work with
 * the Bootstrap Tabs JS class.
 * Echo wrapper assembles the HTML code required for Bootstrap Tabs JS class
 * based on the parameters specified in the config and initializes
 * the corresponding Bootstrap JS class.
 *
 * Example:
 *
 * 	var myTabs = new GUI.Tabs({
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
 * 		"extraClass": "extra-class",
 * 		"select": function() {},
 * 		"show": function() {},
 * 		"shown": function() {}
 * 	});
 *
 * 	// add a new tab
 * 	myTabs.add({"id": "tab3", "label": "Tab 3"});
 *
 * 	// remove the second tab
 * 	myTabs.remove("tab2");
 *
 * @extends Echo.GUI
 *
 * @package gui.pack.js
 *
 * @constructor
 * Creates a new tabs in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Tabs configuration.
 *
 * @cfg {Mixed} target (required)
 * The container where the tabs should be located.
 * This parameter can have several types:
 *
 * + CSS selector (ex: "css-selector")
 * + HTMLElement (ex: document.getElementById("some-element-id"))
 * + jQuery object (ex: $(".css-selector"))
 *
 * @cfg {String} [idPrefix=""]
 * Prefix which helps to make the tab id unique across the page.
 * Every GUI.Tabs instance should have its own unique prefix.
 *
 * Examples: "my-tabs-section", "my-product-tabs".
 *
 * @cfg {Boolean} [noRandomId=false]
 * By default tab ids have random part to prevent interference of several
 * instances of the *same* application on the page. Setting this parameter to `true` will
 * remove random part so it should be used with care.
 *
 * @cfg {Array} [entries=[]]
 * Array of entries (tabs).
 *
 * @cfg {String} entries.id
 * Tab id.
 *
 * @cfg {String} entries.label
 * Tab label.
 *
 * @cfg {Mixed} [entries.panel]
 * HTML element which contains tab content.
 * If this parameter is not specified, the container will be created.
 *
 * @cfg {Boolean} [entries.disabled]
 * Specifies whether the tab is disabled.
 *
 * @cfg {String} [entries.extraClass]
 * Class name to be added to the tab element.
 *
 * @cfg {HTMLElement} [panels]
 * Container which contains the panels.
 * If this parameter is not specified, the container will be created.
 *
 * @cfg {String} [classPrefix="echo-tabs-"]
 * String to be added as a prefix to the tab components.
 * Element with tabs will get "**\<classPrefix\>**header" class name
 * and element with panels will get "**\<classPrefix\>**panels" class.
 *
 * @cfg {Function} [select]
 * Function which will be called when tab is selected.
 *
 * @cfg {HTMLElement} select.tab
 * Container which is the tab itself.
 *
 * @cfg {String} select.id
 * Id of selected tab.
 *
 * @cfg {Function} [show]
 * Function to be called before the active tab panel is displayed.
 *
 * @cfg {HTMLElement} show.tab
 * Container which is the tab itself.
 *
 * @cfg {HTMLElement} show.panel
 * Container which is a panel related to the tab.
 *
 * @cfg {String} show.id
 * Id of shown tab.
 *
 * @cfg {Number} show.index
 * Numerical index of the tab.
 *
 * @cfg {Function} [shown]
 * Function to be called as soon as the active tab is displayed.
 *
 * The parameters are passed to this function the same as in #show.
 */
GUI.Tabs = Utils.inherit(GUI, function(config) {
	config.panels = config.panels ? $(config.panels) : $("<div>");

	GUI.call(this, config, {
		"entries": [],
		"idPrefix": "",
		"noRandomId": false,
		"classPrefix": "echo-tabs-",
		"select": function() {},
		"show": function() {},
		"shown": function() {}
	});
});

GUI.Tabs.prototype.refresh = function() {
	var self = this;
	var entries = this.config.get("entries");
	var panels = this.config.get("panels");
	var target = this.config.get("target");

	target.empty();

	this._randomId = this.config.get("noRandomId") ? "" : "-" + Utils.getUniqueString();

	this.tabsContainer = $('<ul class="nav nav-tabs ' + this.config.get("classPrefix") + 'header">');
	target.append(this.tabsContainer);

	panels.addClass("tab-content " + this.config.get("classPrefix") + "panels");
	if (panels.parent().length === 0) {
		target.append(panels);
	}

	if (entries.length) {
		for (var i = 0; i < entries.length; i++) {
			this.add(entries[i]);
		}
		this.show(entries[this.config.get("selected", 0)].id);
	}

	this.tabsContainer.on("click.tab.data-api", ':not(.active) > [data-toggle="tab"]', function() {
		self.config.get("select").call(self,
			$(this),
			$(this).data("item")
		);
	});
};

/**
 * Method to get a DOM element which contains panels.
 *
 * @return {HTMLElement}
 * DOM element which contains panels.
 */
GUI.Tabs.prototype.getPanels = function() {
	return this.config.get("panels");
};

/**
 * Method to disable tab.
 *
 * @param {String} id
 * Tab id which should be disabled.
 */
GUI.Tabs.prototype.disable = function(id) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.get(id)
			.removeAttr("data-toggle")
			.removeAttr("href")
			.parent().addClass("disabled");
	}
};

/**
 * Method to enable tab.
 *
 * @param {String} id
 * Tab id which should be enabled.
 */
GUI.Tabs.prototype.enable = function(id) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		this.get(id)
			.attr("data-toggle", "tab")
			.attr("href", "#" + this._getTabFullId(id))
			.parent().removeClass("disabled");
	}
};

/**
 * Method to remove tab.
 *
 * @param {String} id
 * Tab id which should be removed.
 */
GUI.Tabs.prototype.remove = function(id) {
	this.get(id).remove();
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
GUI.Tabs.prototype.add = function(tabConfig) {
	var self = this;
	if (!tabConfig || !tabConfig.id) return this.config.get("target");

	if (!~this._getTabIndex(tabConfig.id)) {
		this.config.get("entries").push(tabConfig);
	}

	var fullId = this._getTabFullId(tabConfig.id);
	var classes = tabConfig.disabled ? "disabled" : "";
	if (tabConfig.extraClass) {
		classes += " " + tabConfig.extraClass;
	}
	var attrs = 'data-item="' + tabConfig.id + '"';
	if (!tabConfig.disabled) {
		attrs += ' href="#' + fullId + '" data-toggle="tab"';
	}
	var tab = $('<li' + (classes ? ' class="' + classes + '"' : '') +'><a ' + attrs + '>' + tabConfig.label  + '</a></li>');

	var a = $("a", tab);
	$.map(["show", "shown"], function(event) {
		a.on(event, function() {
			self.config.get(event).call(self,
				$(this),
				self._getPanel(tabConfig.id),
				tabConfig.id,
				self._getTabIndex(tabConfig.id)
			);
		});
	});

	$.each(tabConfig.data || {}, function(k, v) {
		a.data(k, v);
	});
	this.tabsContainer.append(tab);

	tabConfig.panel = tabConfig.panel ? $(tabConfig.panel) : $("<div>");
	if (tabConfig.panel.attr("id") !== fullId) {
		tabConfig.panel.attr("id", fullId);
	}
	this.config.get("panels").append(tabConfig.panel.addClass("tab-pane"));
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
GUI.Tabs.prototype.get = function(id) {
	return this.config.get("target").find("a[data-item='" + id + "']");
};

/**
 * Method to check whether the tab with specified id already exists.
 *
 * @param {String} id
 * Tab id.
 *
 * @return {Boolean}
 * `true` if tab with specific id exists,
 * `false` otherwise.
 */
GUI.Tabs.prototype.has = function(id) {
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
 * Tab label.
 *
 * @param {String} config.extraClass
 * Class name to be added to the tab element.
 *
 * @param {String} config.content
 * Content of the tab (can contain HTML tags).
 */
GUI.Tabs.prototype.update = function(id, config) {
	var tabIndex = this._getTabIndex(id);
	if (~tabIndex) {
		config.content && this._getPanel(id).html(config.content);
		this.get(id).html(config.label).addClass(config.extraClass);
	}
};

/**
 * Method to show tab with specific id.
 *
 * @param {String} id
 * Tab id which should be shown.
 */
GUI.Tabs.prototype.show = function(id) {
	this.get(id).tab("show");
	// sometimes panel is in detached DOM so we explicitly activate it
	this._getPanel(id).addClass("active");
};

GUI.Tabs.prototype._getTabIndex = function(id) {
	var entries = this.config.get("entries");
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].id === id) {
			return i;
		}
	}
	return -1;
}

GUI.Tabs.prototype._getPanel = function(id) {
	return this.getPanels().find("#" + this._getTabFullId(id));
};

GUI.Tabs.prototype._getTabFullId = function(id) {
	return this.config.get("idPrefix") + id + this._randomId;
};

return GUI.Tabs;

});
