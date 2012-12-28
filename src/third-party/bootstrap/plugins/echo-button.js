(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Button) return;

/**
 * @class Echo.GUI.Button
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#buttons" target="_blank">bootstrap-button.js</a>.
 * The button HTML code automatically builds depending on parameters you have passed to the constructor.
 *
 * Example:
 * 	Echo.GUI.Button({
 * 		"target": ".css-selector",
 * 		"label": "Button label",
 * 		"icon": "http://example.com/icon.png",
 * 		"disabled": true,
 * 	});
 *
 * The class methods can be called through constructor. In this case the method name should be passed in the first parameter.
 *
 * Example:
 * 	Echo.GUI.Button("update", {"target": ".css-selector", "label": "New label"});
 *
 * @constructor
 * Creates a button in the container you have passed in the "params.target".
 *
 * @param {Object} params
 * Button parameters.
 *
 * @param {Mixed} params.target
 * Container which should contains the button.
 * This parameter can be several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @param {String} params.label
 * Button label.
 *
 * @param {String} [params.icon]
 * URL for the icon which should be displayed near the label.
 *
 * @param {Boolean} [params.disabled=false]
 * Specifies whether the button should be disabled.
 */
Echo.GUI.Button = function() {
	var args  = arguments;

	var params = (typeof args[0] === "string")
		? args[1] || {}
		: args[0];

	if (typeof params.target === "undefined") return;

	var elements = params.target instanceof Echo.jQuery
		? params.target
		: $(params.target);

	var data = $(elements[0]).data("echoButton");
	if (!data || typeof args[0] === "object") {
		elements.data("echoButton", (data = new Button(elements, args[0])));
	}
	if (typeof args[0] === "string") {
		data[args[0]].apply(data, Array.prototype.slice.call(args, 1));
	}
	return data;
};

var Button = function(element, params) {
	params = params || {};

	this.element = $(element);
	if (element.hasClass("echo-sdk-button")) {
		element.empty();
	}
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
 * If some of attributes of params object is omitted, empty strings will
 * be used for string values and false for boolean value.
 *
 * @param {Object} params
 * Button parameters to be replaced.
 *
 * @param {Mixed} [params.target]
 * Container which should contains the button.
 * You should specify this parameter if you call this method from constructor.
 *
 * @param {String} params.label
 * Button label
 *
 * @param {String} [params.icon]
 * URL for the icon which should be displayed near the label.
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
