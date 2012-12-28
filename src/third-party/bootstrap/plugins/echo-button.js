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
 * 	var button = new Echo.GUI.Button({
 * 		"target": ".css-selector",
 * 		"label": "Button label",
 * 		"icon": "http://example.com/icon.png",
 * 		"disabled": true,
 * 	});
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
Echo.GUI.Button = function(params) {
	if (!params || typeof params.target === "undefined") return;

	this.element = params.target instanceof Echo.jQuery
		? params.target
		: $(params.target);

	params.label = params.label || this.element.text();
	params.disabled = params.disabled || !!this.element.attr("disabled");

	this.element.empty();
	$("<div>").appendTo(this.element).addClass("echo-label");
	this.update({
		"label": params.label,
		"icon": params.icon || "",
		"disabled": params.disabled
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
 * @param {String} params.label
 * Button label
 *
 * @param {String} [params.icon]
 * URL for the icon which should be displayed near the label.
 *
 * @param {Boolean} [params.disabled=false]
 * Specifies whether the button disabled.
 */
Echo.GUI.Button.prototype.update = function(params) {
	params = params || {};
	this.label = params.label || "";
	this.icon = params.icon || "";
	this.disabled = params.disabled || false;
	this._render();
};

Echo.GUI.Button.prototype._render = function() {
	$(".echo-label", this.element).text(this.label);
	var iconElement = $(".echo-icon", this.element);
	var setBackground = function(element, icon) {
		element.css({
			"background" : "no-repeat center url(" + icon + ")"
		});
	};
	if (this.icon) {
		if (!iconElement.length) {
			iconElement = $("<div>").addClass("echo-icon").prependTo(this.element);
		}
		setBackground(iconElement, this.icon);
	} else {
		iconElement.remove();
	}
	this.element.attr("disabled", this.disabled);
};

Echo.Utils.addCSS(
	".btn .echo-label {float: left;}" +
	".btn .echo-icon {height: 16px; width: 16px; float: left; margin-right: 2px; margin-top: 2px;}",
    "echo-button-plugin");
})(Echo.jQuery);
