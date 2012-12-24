(function(jQuery) {

var $ = jQuery;

if ($.echoTabs) return;

var Tabs = function(element, config) {
	this.config = config || {};
	this.element = $(element);
	this.panels = config.panels || this.getPanels();
	this._initEvents(this.config);
};

Tabs.prototype.getPanels = function() {
	var id = $("a:first", this.element).attr("href");
	return $(id).parent();
};

Tabs.prototype._initEvents = function(config) {
	this.element.find('a[data-toggle=tab]').each(function(i, el) {
		$(el).on("show", config.show || function() {});
	});
};

Tabs.prototype.disable = function(id) {
	this.element.find("a[href=#" + id + "]")
		.removeAttr("data-toggle")
		.addClass("disabled");
};

Tabs.prototype.enable = function(id) {
	this.element.find("a[href=#" + id + "]")
		.attr("data-toggle", "tabs")
		.removeClass("disabled");
};

Tabs.prototype.remove = function(id) {
	this.element.find("a[href=#" + id + "]").remove();
};

Tabs.prototype.add = function(tabConfig, panel) {
	tabConfig = tabConfig || {};
	var tab = $('<li><a data-toggle="tab" href="#' + tabConfig.id + '">' + tabConfig.label  + '</a></li>');
	$("a[data-toggle=tab]", tab).on("show", this.config.show);
	this.element.append(tab);
	this.panels.append(panel);
	return this.element;
};

Tabs.prototype.get = function(id) {
	return this.element.find("a[href=#" + id + "]");
};

Tabs.prototype.has = function(id) {
	return !!this.element.has("a[href=#" + id + "]").length;
};

Tabs.prototype.update = function(id, config) {
	this.element.find("a[href=#" + id + "]")
		.html(config.label)
		.addClass(config["class"] || "");
};

Tabs.prototype.show = function(id) {
	this.element.find("a[href=#" + id + "]").tab("show");
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
