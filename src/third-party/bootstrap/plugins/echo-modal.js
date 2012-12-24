(function(jQuery) {

var $ = jQuery;

if ($.echoModal) return;

$.echoModal = function() {
	return new Modal(arguments[0]);
};

var Modal = function(config) {
	this.config = $.extend({
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

	if (this.config.show) {
		this._render();
	}
};

Modal.prototype._render = function() {
	var self = this;

	if (this.rendered) return;

	this.rendered = true;
	this.element = $('<div class="modal" role="dialog" tabindex="-1">');

	if (this.config.fade) {
		this.element.addClass("fade");
	} else {
		this.element.addClass("hide");
	}

	if (this.config.header) {
		var header = this._addSection("modal-header", $("<h3>").append(this.config.data.title));
	}

	var body = this._addSection("modal-body", this.config.data.body);

	if (this.config.footer) {
		var footer = this._addSection("modal-footer");
	}
	if (this.config.width !== null) {
		this.element.width(this.config.width)
			.css({"margin-left": this.config.width * -0.5});
	}
	if (this.config.height !== null) {
		body.height(this.config.height);
	}
	if (this.config.padding !== null) {
		body.css("padding", this.config.padding);
	}
	if (this.config.footer && this.config.data.buttons) {
		$.map(this.config.data.buttons, function(button) {
			var el = $("<button>").addClass("btn").append(button.title);
			if (button.extraClass) {
				el.addClass(button.extraClass);
			}
			el.click(function() {
				button.handler && button.handler.call(this);
			});
			el.appendTo(footer);
		});
	}
	if (this.config.extraClass) {
		this.element.addClass(this.config.extraClass);
	}

	if (this.config.backdrop) {
		if (this.config.fade) {
			this.element.on("show", function() {
				var modal = self.element.data('modal');
				var shown = modal.isShown;
				var backdrop = modal.options.backdrop;

				modal.options.backdrop = true;
				modal.isShown = true;
				modal.backdrop(function(){});
				modal.isShown = shown;
				modal.options.backdrop = backdrop;

				self.backdrop = modal.$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		} else {
			this.element.on("shown", function() {
				self.backdrop = self.element.data('modal').$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		}
	}
	this.element.on("hidden", function() {
		self.remove();
	});
	if (this.config.header && this.config.closeButton) {
		$('<button aria-hidden="true" data-dismiss="modal" class="close" type="button">')
			.append("&times;").prependTo(header);
	}
	if ($.isFunction(this.config.onHide)) {
		this.element.on("hide", function() {
			self.config.onHide.call(self, self.element);
		});
	}
	if ($.isFunction(this.config.onShow)) {
		this.element.on("shown", function() {
			self.config.onShow.call(self, self.element);
		});
	}

	if (this.config.href) {
		this.element.one("shown", function() {
			body.append('<iframe src="' + self.config.href + '" id="" name="" class="echo-modal-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>');
		});
	}

	// we used manual control for backdrop if fade is true
	if (this.config.backdrop && this.config.fade) {
		this.config.backdrop = false;
	}

	this.element.appendTo("body")
		.wrap("<div class='echo-sdk-ui'>")
		.modal(this.config);

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
	this._render();
	this.element.modal("show");
};

Modal.prototype.remove = function() {
	if (this.rendered) {
		this.rendered = false;
		this.backdrop && this.backdrop.remove();
		this.element.find('iframe').hide().attr('src', '//about:blank').end().empty();
		this.element.unwrap().remove();
	}
};

Modal.prototype.hide = function() {
	if (this.rendered) {
		this.element.modal("hide");
	}
};

Echo.Utils.addCSS(
	".echo-sdk-ui .modal-header { min-height: 20px; }" +
	".echo-modal-iframe { display: block; width: 100%; height: 100%; }",
"echo-modal-plugin");

})(Echo.jQuery);
