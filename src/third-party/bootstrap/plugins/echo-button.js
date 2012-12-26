(function(jQuery) {

var $ = jQuery;

if ($.fn.echoButton) return;

/**
 * @class Echo.jQuery.fn.echoButton
 * Class wrapper for bootstrap-button
 *
 * @constructor
 * Creates a button.
 *
 * @param {Object} params
 * Button parameters.
 *
 * @param {String} params.label
 * Button label.
 *
 * @param {String} [params.icon]
 * URL for the icon.
 *
 * @param {Boolean} [params.disabled=false]
 * Specifies whether the button disabled.
*/
$.fn.echoButton = function() {
	var args  = arguments;
	return this.each(function(){
		var data = $(this).data("echoButton");
		if (!data || typeof args[0] === "object") {
			$(this).data("echoButton", (data = new Button(this, args[0])));
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

/**
  * Method to update button label, icon and availability.
  *
  * This method allows to change the button label, icon and availability.
  * If some of attributes of params object is ommited, empty strings will
  * be used for string values and false for boolean value.
  *
  * @param {Object} params
  * Button parameters to be replaced.
  *
  * @param {String} params.label
  * Button label
  *
  * @param {String} [params.icon]
  * Icon URL which should be shown on the button
  *
  * @param {Boolean} [params.disabled=false]
  * Specifies whether the button disabled.
*/
Button.prototype.update = function(params) {
	params = params || {};
	this.label = params.label || "";
	this.icon = params.icon || "";
	this.disabled = params.disabled || false;
	this._render();
};

Button.prototype._render = function() {
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
