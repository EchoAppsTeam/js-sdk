(function(jQuery) {

var $ = jQuery;

if ($.echoModal) return;

/**
 * @class Echo.jQuery.echoModal
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#modals" target="_blank">bootstrap-modal</a>.
 * It contains logic to automatically build HTML code required for bootstrap-modal.
 * I.E. you can pass the necessary parameters to the $.echoModal function and
 * modal dialog HTML element will be build automatically.
 *
 * Example:
 * 	var myModal = $.echoModal({
 * 		"show": true,
 * 		"backdrop": true,
 * 		 "keyboard": true,
 * 		 "closeButton": true,
 * 		 "remote": false,
 * 		 "extraClass": "",
 * 		 "data": {
 * 			 "title": "Modal title",
 * 			 "body": "<b>Modal body</b>",
 * 			 "buttons": [{
 * 				 "title": "Button1",
 * 				 "extraClass": "echo-button1-class",
 * 				 "handler": function() {}
 * 			 }, {
 * 				 "title": "Button2",
 * 				 "extraClass": "echo-button2-class",
 * 				 "handler": function() {}
 * 			 }]
 * 		 },
 * 		 "width": "400",
 * 		 "height": "500",
 * 		 "padding": "10",
 * 		 "footer": true,
 * 		 "header": true,
 * 		 "fade": true
 * 	});
 *
 * @constructor
 * Creates a new modal dialog and show it if config.show parameter is true.
 *
 * @param {Object} config
 * Modal configuration.
 *
 * @param {Boolean} [config.show=false]
 * Show modal dialog right after it is created.
 *
 * @param {Boolean} [config.backdrop=true]
 * Show the semi-transparent backdrop underneath the modal dialog box.
 *
 * @param {Boolean} [config.keyboard=true]
 * Close the modal dialog if the "Esc"(escape) key is pressed on the keyboard.
 *
 * @param {Boolean} [config.closeButton=true]
 * Show the close ("X") icon in the top right corner of the dialog box.
 *
 * @param {String} [config.remote=false]
 * Remote URL.
 * If a remote URL is provided, content will be loaded via jQuery load method and injected into the modal dialog body.
 *
 * @param {String} [config.extraClass=""]
 * Custom class name which should be added to the modal dialog container.
 *
 * @param {Object} config.data
 *
 * @param {String} config.data.title
 * Modal dialog title.
 *
 * @param {String} config.data.body
 * Modal dialog body.
 *
 * @param {Array} config.data.buttons
 * You can specify the custom buttons in this parameter which should be displayed in the modal footer.
 * Each array element is the object with the following parameters:
 * 	title      - button title
 * 	extraClass - custom class name which will be added to the button
 * 	handler    - function which will be called when button is clicked.
 *
 * @param {Number} [config.width=null]
 * Modal dialog width.
 *
 * @param {Number} [config.height=null]
 * Modal dialog height.
 *
 * @param {Number} [config.padding=null]
 * Modal dialog padding.
 *
 * @param {Boolean} [config.footer=true]
 * Display modal dialog footer.
 * Should be true if you want to display custom buttons.
 *
 * @param {Boolean} [config.header=true]
 * Display modal header
 *
 * @param {Boolean} [config.fade=false]
 * Apply a CSS fade transition.
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
 * Allows to hide modal dialog.
 * 	myModal.show();
*/
Modal.prototype.show = function() {
	this._render();
	this.element.modal("show");
};

/**
 * Allows to completely remove the modal dialog element from the page.
 * 	myModal.remove();
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
 * Allows to hide existing modal dialog.
 * 	myModal.hide();
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
