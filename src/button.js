(function($) {
 
if (Echo.Utils.isComponentDefined("Echo.Button")) return;

/**
 * @class
 * Class implements standard form element button.
 *
 * @constructor
 * Constructor of class encapsulating form element button.
 *
 *     var element = $("<button></button>");
 *
 *     new Echo.Button(element, {
 *         "label": "MyButton",
 *         "icon": false,
 *         "disabled": false
 *     }); // will adds simple button with label 'MyButton' and without icon
 *
 * @param {HTMLElement} element HTML element which is container for the button.
 * @param {Object} state Object representing the button state.
 * @param {String} state.label String representing text to show on the button.
 * @param {String} state.icon String representing CSS class which containes background icon of the button.
 * @param {Boolean} state.disabled Disables(true) or enables(false) the button.
 */

Echo.Button = function(element, state) {
	this.element = element || $("<button>");
	this.element.addClass("echo-button");
	$("<div>").appendTo(element).addClass("label");
	this.set({
		"label": state.label || this.element.text(),
		"icon": state.icon || "",
		"disabled": state.disabled || !!this.element.attr('disabled')
	});
	Echo.Utils.addCSS(this._css, "echo-button");
};

/**
 * Method transfers the button to new state and redraws the button.
 *
 * @method set
 * @param {Object} state Object representing the button state.
 * @param {String} state.label String representing text to show on the button.
 * @param {String} state.icon String representing CSS class which containes background icon of the button.
 * @param {Boolean} state.disabled Disables(true) or enables(false) the button.
 */

Echo.Button.prototype.set = function(state) {
	if (state) {
		this.label = state.label || "";
		this.icon = state.icon || "";
		this.disabled = state.disabled || false;
	}
	this._refresh();
};

// internal methods

Echo.Button.prototype._refresh = function() {
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

})(jQuery);
