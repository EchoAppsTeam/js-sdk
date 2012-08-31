
var Button = function(element, params) {
	this.element = $(element);
	params = params || {};
	this.element.addClass("echo-sdk-button");
	$("<div>").appendTo(element).addClass("echo-label");
	this.update({
		"label": params.label || this.element.text(),
		"icon": params.icon || "",
		"disabled": params.disabled || !!this.element.attr('disabled')
	});
	Echo.Utils.addCSS(this._css);
};

Button.prototype.update = function(params) {
	console.log(params);
	params = params || {};
	this.label = params.label || "";
	this.icon = params.icon || "";
	this.disabled = params.disabled || false;
	this.render();
};

Button.prototype.render = function() {
	$(".echo-label", this.element).text(this.label);
	var iconElement = $(".echo-icon", this.element);
	if (this.icon) {
		if (iconElement.length) {
			iconElement.removeClass().addClass(this.icon + " echo-icon");
		} else {
			$("<div>").addClass(this.icon + " echo-icon").prependTo(this.element);
		}
	} else {
		iconElement.remove();
	}
	this.element.attr("disabled", this.disabled);
};

Button.prototype._css =
	".echo-sdk-button .echo-label { float: left; } " +
	".echo-sdk-button .echo-icon { height: 16px; width: 16px; float: left; margin-right: 2px; margin-top: 2px; } " +
	".echo-sdk-button .echo-icon-waiting { background: no-repeat center url(//cdn.echoenabled.com/images/loading.gif); height: 16px; width: 16px; } ";

$.fn.echoButton = function() {
	var args  = arguments;
	return this.each(function(){
		var data = $(this).data('echoButton');
		var config = typeof args[0] === "object" && args[0];
		if (!data) {
			$(this).data('echoButton', (data = new Button(this, config)));
		}
		if (typeof args[0] === "string") {
			data[args[0]].apply(data, Array.prototype.slice.call(args, 1));
		}
	});
};
