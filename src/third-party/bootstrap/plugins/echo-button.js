(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI || Echo.GUI.Button) return;

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
 * @extends Echo.GUI
 *
 * @constructor
 * Creates a button in the container you have passed in the "config.target".
 *
 * @param {Object} config
 * Button configuration data.
 *
 * @cfg {Mixed} target
 * Container which should contains the button.
 * This parameter can be several types:
 * 	- CSS selector (ex: ".css-selector")
 * 	- HTMLElement (ex: document.getElementById("some-element-id"))
 * 	- jQuery object (ex: $(".css-selector"))
 *
 * @cfg {String} label
 * Button label.
 *
 * @cfg {String} [icon]
 * URL for the icon which should be displayed near the label.
 *
 * @cfg {Boolean} [disabled=false]
 * Specifies whether the button should be disabled.
 */
Echo.GUI.Button = Echo.Utils.inherit(Echo.GUI, function(config) {
	if (!config || !config.target) return;

	Echo.GUI.call(this, config);
});

Echo.GUI.Button.prototype._getDefaultConfig = function(config) {
	return {
		"label": config.target.html(),
		"disabled": !!config.target.attr("disabled")
	};
};

Echo.GUI.Button.prototype._build = function() {
	var target = this.config.get("target");

	target.empty().append('<div class="echo-label">');

	$(".echo-label", target).text(this.config.get("label"));
	var iconElement = $(".echo-icon", target);
	if (this.config.get("icon")) {
		if (!iconElement.length) {
			iconElement = $("<div>").addClass("echo-icon").prependTo(target);
		}
		iconElement.css({"background": "no-repeat center url(" + this.config.get("icon") + ")"});
	} else {
		iconElement.remove();
	}
	target.attr("disabled", this.config.get("disabled"));
};
})(Echo.jQuery);
