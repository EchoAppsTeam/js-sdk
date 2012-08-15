/**
 * @class Echo.Button
 * Class implements form element button.
 *
 * This class enhances standard form element button by adding the ability to define and update button properties like label, disabled and icon.
 *
 * @constructor
 * Constructor of class encapsulating form element button.
 *
 *     var element = $("<button></button>");
 *
 *     new Echo.Button(element, {
 *         "label": "MyButton",
 *         "disabled": false
 *     }); // will add simple button with label 'MyButton' and without icon
 *
 * @param {HTMLElement} element HTML element which is container for the button.
 * @param {Object} params Object representing button properties.
 * @param {String} params.label String representing text to show on the button.
 * @param {String} params.icon String representing CSS class which containes background icon of the button.
 * @param {Boolean} params.disabled Disables(true) or enables(false) the button.
 */

Echo.Button = function(element, params) {
	if (!element) return;
	params = params || {};
	this.element = element;
	this.element.addClass("echo-button");
	$("<div>").appendTo(element).addClass("label");
	this.update({
		"label": params.label || this.element.text(),
		"icon": params.icon || "",
		"disabled": params.disabled || !!this.element.attr('disabled')
	});
	Echo.Utils.addCSS(this._css, "echo-button");
};

/**
 * @method update
 * Method updates button properties and rerenders the button.
 *
 *     // style tag in the head of HTML document
 *     // <style>
 *     //     .ui-button-icon { background-image: url(http://example.com/image.jpg); }
 *     // </style>
 *
 *     var element = $("<button></button>");
 *
 *     var button = new Echo.Button(element, {
 *         "label": "MyButton"
 *     });
 *
 *     button.update({
 *         "icon": "ui-button-icon",
 *         "disabled": true
 *     }); // will disables the button and set "http://example.com/image.jpg" as a background icon of the button
 *
 * @param {Object} params Object representing button properties.
 * @param {String} params.label String representing text to show on the button.
 * @param {String} params.icon String representing CSS class which containes background icon of the button.
 * @param {Boolean} params.disabled Disables(true) or enables(false) the button.
 */

Echo.Button.prototype.update = function(params) {
	params = params || {};
	this.label = params.label || "";
	this.icon = params.icon || "";
	this.disabled = params.disabled || false;
	this.render();
};

/**
 * @method render
 * Method used to render the button.
 *
 *     var element = $("<button></button>");
 *
 *     var button = new Echo.Button(element, {
 *         "label": "MyButton",
 *         "icon": false,
 *         "disabled": false
 *     });
 *
 *     button.label = "NewButton";
 *     button.render(); // button's label will be changed from "MyButton" to "NewButton"
 */

Echo.Button.prototype.render = function() {
	$(".label", this.element).text(this.label);
	var iconElement = $(".icon", this.element);
	if (this.icon) {
		if (iconElement.length) {
			iconElement.removeClass().addClass(this.icon + " icon");
		} else {
			$("<div>").addClass(this.icon + " icon").prependTo(this.element);
		}
	} else {
		iconElement.remove();
	}
	this.element.attr("disabled", this.disabled);
}

Echo.Button.prototype._css =
	".echo-button { padding: 3px 12px; border: 1px solid #D3D3D3; cursor: pointer; border-radius: 4px;" +
		       "background: -webkit-gradient(linear, left top, left bottom, from(white), to(#EDEDED)); background: -moz-linear-gradient(top, white, #EDEDED);" +
		       "text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3); -webkit-box-shadow: 0 1px 2px rgba(0,0, 0, 0.2); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); }" +
	".echo-button .label { font-size: 16px; float: left; } " +
	".echo-button .icon { height: 16px; width: 16px; float: left; margin-right: 2px; margin-top: 2px; } " +
	".echo-button .icon-waiting { background: no-repeat center url(//cdn.echoenabled.com/images/loading.gif); height: 16px; width: 16px; } ";
