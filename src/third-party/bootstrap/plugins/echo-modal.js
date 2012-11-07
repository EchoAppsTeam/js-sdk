(function(jQuery) {

var $ = jQuery;

if ($.echoModal) return;

$.echoModal = function() {
	return new Modal(arguments[0]);
};

var Modal = function(config) {
	var self = this;
	var params = $.extend({
		"show": false,
		"backdrop": true,
		"keyboard": true,
		"closeButton": true,
		"remote": false,
		"extraClass": "",
		"data": {},
		"width": null,
		"height": null,
		"padding": null,
		"footer": true,
		"header": true,
		"fade": false
	}, config);

	this.element = $('<div class="modal" role="dialog" tabindex="-1">');

	if (params.fade) {
		this.element.addClass("fade");
	} else {
		this.element.addClass("hide");
	}

	if (params.header) {
		var header = this._addSection("modal-header", $("<h3>").append(params.data.title));
	}

	var body = this._addSection("modal-body", params.data.body);

	if (params.footer) {
		var footer = this._addSection("modal-footer");
	}
	if (params.width !== null) {
		this.element.width(params.width)
			.css({"margin-left": params.width * -0.5});
	}
	if (params.height !== null) {
		body.height(params.height);
	}
	if (params.padding !== null) {
		body.css("padding", params.padding);
	}
	if (params.footer && params.data.buttons) {
		$.map(params.data.buttons, function(button) {
			var el = $("<button>").addClass("btn").append(button.title);
			if (button.extraClass) {
				el.addClass(button.extraClass);
			}
			el.click(function() {
				button.handler && button.handler();
			});
			el.appendTo(footer);
		});
	}
	if (params.extraClass) {
		this.element.addClass(params.extraClass);
	}

	if (params.backdrop) {
		var wrapper;
		if (params.fade) {
			this.element.on("show", function() {
				var modal = self.element.data('modal');
				var shown = modal.isShown;
				var backdrop = modal.options.backdrop;

				modal.options.backdrop = true;
				modal.isShown = true;
				modal.backdrop(function(){});
				modal.isShown = shown;
				modal.options.backdrop = backdrop;

				wrapper = modal.$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		} else {
			this.element.on("shown", function() {
				wrapper = self.element.data('modal').$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		}
		this.element.on("hidden", function() {
			wrapper.remove();
		});
	}
	if (params.header && params.closeButton) {
		$('<button aria-hidden="true" data-dismiss="modal" class="close" type="button">')
			.append("&times;").prependTo(header);
	}
	if ($.isFunction(params.onHide)) {
		this.element.on("hide", function() {
			params.onHide.call(self, self.element);
		});
	}
	if ($.isFunction(params.onShown)) {
		this.element.on("shown", function() {
			params.onShown.call(self, self.element);
		});
	}

	if (params.href) {
		this.element.one("shown", function() {
			body.append('<iframe src="' + params.href + '" id="" name="" class="echo-modal-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>');
		});
	}

	// we used manual control for backdrop if fade is true
	if (params.backdrop && params.fade) {
		params.backdrop = false;
	}

	this.element.appendTo("body")
		.wrap("<div class='echo-sdk-ui'>")
		.modal(params);

	// if we try show few modals in one time, then event "focusin.modal" be called infinity times
	$(document).off('focusin.modal');
};

Modal.prototype._addSection = function(css, content) {
	var element = $("<div>");
	element.addClass(css).appendTo(this.element);
	if (content) {
		element.append($.isFunction(content) ? content(element) : content);
	}
	return element;
};

Modal.prototype.show = function() {
	this.element.modal("show");
};

Modal.prototype.remove = function() {
	this.element.remove();
	$(".modal-backdrop").remove();
};

Modal.prototype.hide = function() {
	this.element.modal("hide");
};

Echo.Utils.addCSS(
	".echo-sdk-ui .modal-header { min-height: 20px; }" +
	".echo-modal-iframe { display: block; width: 100%; height: 100%; }",
"echo-modal-plugin");

})(Echo.jQuery);
