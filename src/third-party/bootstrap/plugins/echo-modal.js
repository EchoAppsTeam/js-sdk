(function(jQuery) {

var $ = jQuery;

if ($.echoModal) return;

/**
 * @class Echo.jQuery.echoModal
 * Class wrapper for bootstrap-modal
 *
 * @alias plugin.Echo.jQuery.modal
 *
 * @constructor
 * Creates a new modal dialog.
 *
 * @param {Object} config
 * Modal configuration.
 *
 * @param {Boolean} [config.show=false]
 * Show modal right after it is created.
 *
 * @param {Boolean} [config.backdrop=true]
 * Show the backdrop.
 *
 * @param {Boolean} [config.keyboard=true]
 * Closes the modal when escape key is pressed.
 *
 * @param {Boolean} [config.closeButton=true]
 * Display close button.
 *
 * @param {String} [config.remote=false]
 * Remote URL.
 * If a remote url is provided, content will be loaded via jQuery's load method and injected into the modal body.
 *
 * @param {String} [config.extraClass=""]
 * Custom class name which should be added to the modal conainer.
 *
 * @param {Object} config.data
 *
 * @param {String} config.data.title
 * Modal title.
 *
 * @param {String} config.data.body
 * Modal body.
 *
 * @param {Array} config.data.buttons
 * Array of objects with the following fields:
 * 	title      - button title
 * 	extraClass - custom class name which will be added to the button
 * 	handler    - function which will be called when button is clicked.
 *
 * @param {Integer} [config.width=null]
 * Modal width.
 *
 * @param {Integer} [config.height=null]
 * Modal height.
 *
 * @param {Integer} [config.padding=null]
 * Modal padding.
 *
 * @param {Boolean} [config.footer=true]
 * Display footer.
 *
 * @param {Boolean} [config.header=true]
 * Display header
 *
 * @param {Boolean} [config.fade=false]
 * Apply a css fade transition.
*/
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

/**
 * Method to show modal.
 *
 * This method allows to hide modal.
*/
Modal.prototype.show = function() {
	this._render();
	this.element.modal("show");
};

/**
 * Method to remove modal.
 *
 * This method allows to completely remove the modal element from the page.
*/
Modal.prototype.remove = function() {
	if (this.rendered) {
		this.rendered = false;
		this.backdrop && this.backdrop.remove();
		this.element.find('iframe').hide().attr('src', '//about:blank').end().empty();
		this.element.unwrap().remove();
	}
};

/**
 * Method to hide modal.
 *
 * This method allows to hide modal.
*/
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
