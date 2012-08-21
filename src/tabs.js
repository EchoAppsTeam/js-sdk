Echo.Tabs = function(element, config) {
	config = config || {};
	this.element = element;
	this.panels = config.panels || this.getPanels();
	this._initEvents(config);
};

Echo.Tabs.prototype.getPanels = function() {
	var id = $("a:first", this.element).attr("href");
	return $(id).parent();
};

Echo.Tabs.prototype._initEvents = function(config) {
	this.element.find('a[data-toggle=tab]').each(function(i, el) {
		$(el).on("show", config.show || function() {});
	});
};

Echo.Tabs.prototype.disable = function(id) {
	this.element.find("a[href=#" + id + "]")
		.removeAttr("data-toggle")
		.addClass("disabled");
	return this;
};

Echo.Tabs.prototype.enable = function(id) {
	this.element.find("a[href=#" + id + "]")
		.attr("data-toggle", "tabs")
		.removeClass("disabled");
	return this;
};

Echo.Tabs.prototype.remove = function(id) {
	this.element.find("a[href=#" + id + "]")
		.remove();
	return this;
};

Echo.Tabs.prototype.add = function(tabConfig, panel) {
	tabConfig = tabConfig || {};
	var tab = $('<li><a data-toggle="tab" href="#' + tabConfig.id + '">' + tabConfig.label  + '</a></li>');
	this.element.append(tab);
	this.panels.append(panel);
	return this;
};

Echo.Tabs.prototype.get = function(id) {
	return this.element.find("a[href=#" + id + "]");
};

Echo.Tabs.prototype.has = function(id) {
	return !!this.element.has("a[href=#" + id + "]").length;
};

Echo.Tabs.prototype.update = function(id, config) {
	this.element.find("a[href=#" + id + "]")
		.html(config.label)
		.addClass(config.class || "");
	return this;
};

Echo.Tabs.prototype.show = function(id) {
	this.element.find("a[href=#" + id + "]").tab("show");
	return this;
};
