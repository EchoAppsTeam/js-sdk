(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Button) return;

/**
 * @class Echo.GUI.Button
 * The class provides an interface to assemble the Bootstrap component
 * dynamically, based on the JSON config structure rather than static
 * HTML code.
 *
 * Example:
 * 	var button = new Echo.GUI.Button({
 * 		"target": ".css-selector",
 * 		"label": "Button label",
 * 		"icon": "http://example.com/icon.png",
 * 		"disabled": true
 * 	});
 *
 * @constructor
 * Creates a button in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Button parameters.
 *
 * @param {Mixed} config.target
 * Container which should contains the button.
 * This parameter can be several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @param {String} config.label
 * Button label.
 *
 * @param {String} [config.icon]
 * URL for the icon which should be displayed near the label.
 *
 * @param {Boolean} [config.disabled=false]
 * Specifies whether the button should be disabled.
 */
Echo.GUI.Button = function(config) {
	if (!config || !config.target) return;
	config.target = $(config.target);

	this.config = $.extend({
		"label": config.target.html(),
		"disabled": !!config.target.attr("disabled")
	}, config);

	this._render();
};

Echo.GUI.Button.prototype._render = function() {
	this.config.target.empty().append('<div class="echo-label">');

	$(".echo-label", this.config.target).text(this.config.label || "");
	var iconElement = $(".echo-icon", this.config.target);
	var setBackground = function(element, icon) {
		element.css({"background": "no-repeat center url(" + icon + ")"});
	};
	if (this.config.icon) {
		if (!iconElement.length) {
			iconElement = $("<div>").addClass("echo-icon").prependTo(this.config.target);
		}
		setBackground(iconElement, this.config.icon);
	} else {
		iconElement.remove();
	}
	this.config.target.attr("disabled", this.config.disabled);
}

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
	this.config = $.extend(this.config, params);

	this._render();
};

Echo.Utils.addCSS(
	".btn .echo-label { float: left; }" +
	".btn .echo-icon { height: 16px; width: 16px; float: left; margin-right: 2px; margin-top: 2px; }",
	"echo-button-plugin");

})(Echo.jQuery);
