(function(jQuery) {

var $ = jQuery;

$.fn.echoButton = function() {
	var args  = arguments;
	return this.each(function(){
		var data = $(this).data("echoButton");
		if (!data || typeof args[0] === "object") {
			$(this).data("echoButton", new Button(this, args[0]));
		}
		if (typeof args[0] === "string") {
			data[args[0]].apply(data, Array.prototype.slice.call(args, 1));
		}
	});
};

var Button = function(element, params) {
	params = params || {};
	this.element = $(element);
	this.element.addClass("echo-sdk-button");
	$("<div>").appendTo(element).addClass("echo-label").css({
		"float": "left"
	});
	this.update({
		"label": params.label || this.element.text(),
		"icon": params.icon || "",
		"disabled": params.disabled || !!this.element.attr('disabled')
	});
};

Button.prototype.update = function(params) {
	params = params || {};
	this.label = params.label || "";
	this.icon = params.icon || "";
	this.disabled = params.disabled || false;
	this.render();
};

Button.prototype.render = function() {
	$(".echo-label", this.element).text(this.label);
	var iconElement = $(".echo-icon", this.element);
	var setBackground = function(element, icon) {
		element.css({
			"background" : "no-repeat center url(" + icon + ")"
		});
	};
	if (this.icon) {
		if (!iconElement.length) {
			iconElement = $("<div>").addClass("echo-icon").prependTo(this.element).css({
				"height": 16,
				"width": 16,
				"float": "left",
				"margin-right": 2,
				"margin-top": 2
			});
		}
		setBackground(iconElement, this.icon);
	} else {
		iconElement.remove();
	}
	this.element.attr("disabled", this.disabled);
};

})(Echo.jQuery);
