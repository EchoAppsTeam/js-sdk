(function(jQuery) {

var $ = jQuery;

if ($.fn.echoDropdown) return;

$.fn.echoDropdown = function() {
	var args = arguments;
	return this.each(function(){
		var data = $(this).data("echoDropdown");
		if (!data || typeof args[0] === "object") {
			$(this).data("echoDropdown", (data = new Dropdown(this, args[0])));
		}
		if (typeof args[0] === "string") {
			data[args[0]].apply(data, Array.prototype.slice.call(args, 1));
		}
	});
};

var Dropdown = function(element, params) {
	this.element = $(element);
	var dropdown = this._assembleContainer(params);
	this._assembleEntries(params.entries, dropdown);
};

Dropdown.prototype.setTitle = function(title) {
	$(".dropdown-toggle", this.element).empty().append(title);
};

Dropdown.prototype._assembleContainer = function(params) {
	var container = $("<ul>").addClass("nav")
		.appendTo(this.element);
	var dropdown = $("<li>")
		.addClass("dropdown")
		.appendTo(container);
	$("<a>").addClass("dropdown-toggle")
		.attr("data-toggle", "dropdown")
		.attr("role", "button")
		.attr("href", "#")
		.append(params.title)
		.appendTo(dropdown);
	return dropdown;
};

Dropdown.prototype._assembleEntries = function(entries, container) {
	var menu = $("<ul>").addClass("dropdown-menu")
		.attr("role", "menu")
		.appendTo(container);
	$.map(entries || [], function(entry) {
		var item = $("<a role='button' class='echo-clickable' />")
			.click(function() {
				entry.handler && entry.handler({
					"title": entry.title
				});
			});
		if (entry.icon) {
			item.css({
				"background-image": "url(" + entry.icon + ")",
				"background-repeat": "no-repeat",
				"background-position": "10px 5px",
				"padding-left": 32
			});
		}
		item.append(entry.title).appendTo(($("<li>").appendTo(menu)));
	});
	return menu;
};

})(Echo.jQuery);
