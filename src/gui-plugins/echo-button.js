define("echo/gui/button", [
	"jquery",
	"echo/gui",
	"echo/utils"
], function($, GUI, Utils) {

/**
 * @class GUI.Button
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#buttons">bootstrap-button.js</a>.
 * The GUI.Button class provides a simplified interface to work with the
 * Bootstrap Button JS class.
 * Echo wrapper assembles the HTML code required for Bootstrap Button JS class
 * based on the parameters specified in the config and initializes
 * the corresponding Bootstrap JS class.
 *
 * Example:
 *
 * 	element.on("click", function() {
 * 		// your click action handler...
 * 	});
 * 	var button = new GUI.Button({
 * 		"target": element,
 * 		"label": "Button label",
 * 		"icon": "http://example.com/icon.png",
 * 		"disabled": true
 * 	});
 *
 * 	// Change the button title
 * 	button.setState({"label": "New button label"});
 *
 * 	// Destroy the button
 * 	button.destroy();
 *
 * @extends GUI
 *
 * @package gui.pack.js
 *
 * @constructor
 * Creates a button inside the container defined in the “target" config parameter.
 *
 * @param {Object} config
 * Button configuration data.
 *
 * @cfg {Mixed} target
 * The container where the button should be located.
 * This parameter can have several types:
 *
 * + CSS selector (ex: ".css-selector")
 * + HTMLElement (ex: document.getElementById("some-element-id"))
 * + jQuery object (ex: $(".css-selector"))
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
GUI.Button = Utils.inherit(GUI, function(config) {
	GUI.call(this, config, {
		"label": config.target.html(),
		"disabled": !!config.target.attr("disabled")
	});
});

/**
 * Allows to repaint the button using arbitrary values for configuration
 * parameters from #constructor
 */
GUI.Button.prototype.setState = function(config) {
	var self = this;
	$.each(config, function(k, v) {
		self.config.set(k, v);
	});
	this.refresh();
};

GUI.Button.prototype.refresh = function() {
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

return GUI.Button;
});
