(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Button) return;

/**
 * @class Echo.GUI.Button
 * The class provides an interface to assemble the Bootstrap component
 * dynamically, based on the JS Object rather than static HTML code.
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

	this.config = {
		"label": config.target.html(),
		"disabled": !!config.target.attr("disabled")
	};
	this.update(config);
};

/**
 * This method updates config and re-assemble HTML code of the button.
 *
 * It can be called with the same parameters as a {@link Echo.GUI.Button#constructor}
 * except config.target.
 */
Echo.GUI.Button.prototype.update = function(config) {
	this.config = $.extend(true, this.config, config);
	this.refresh();
};

/**
 * This method re-assemble the button HTML code and
 * append it to the target.
 */
Echo.GUI.Button.prototype.refresh = function() {
	this.config.target.empty().append('<div class="echo-label">');

	$(".echo-label", this.config.target).text(this.config.label || "");
	var iconElement = $(".echo-icon", this.config.target);
	if (this.config.icon) {
		if (!iconElement.length) {
			iconElement = $("<div>").addClass("echo-icon").prependTo(this.config.target);
		}
		iconElement.css({"background": "no-repeat center url(" + this.config.icon + ")"});
	} else {
		iconElement.remove();
	}
	this.config.target.attr("disabled", this.config.disabled);
};

})(Echo.jQuery);
