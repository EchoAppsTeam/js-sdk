(function(jQuery) {

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Modal) return;

/**
 * @class Echo.GUI.Modal
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#modals" target="_blank">bootstrap-modal.js</a>.
 * It contains logic to automatically build HTML code required for bootstrap-modal.
 * I.E. you can pass the necessary parameters to the Echo.GUI.Modal constructor and
 * modal dialog HTML element will be build automatically.
 *
 * Example:
 * 	var myModal = new Echo.GUI.Modal({
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
 * Creates a new modal dialog. The dialog can be created in visible or hidden (default) modes. In order to initialize the modal dialog instance in visible state, the "config.show" parameter should be defined as 'true' (JS boolean) during the constructor call. For the modal dialogs hidden by default the "show" function can be applied to reveal it when appropriate.
 *
 * @param {Object} config
 * Modal configuration.
 *
 * @param {Boolean} [config.show=false]
 * Defines whether the modal dialog should be displayed right after it is created. 
 *
 * @param {Boolean} [config.backdrop=true]
 * Defines whether the semi-transparent backdrop underneath the modal dialog box should be displayed.
 *
 * @param {Boolean} [config.keyboard=true]
 * Defines whether modal dialog should be closed if the "Esc"(escape) key is pressed on the keyboard.
 *
 * @param {Boolean} [config.closeButton=true]
 * Defines whether the close ("X") icon in the top right corner of the dialog box should be shown.
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
 * @param {String|Function} config.data.title
 * Modal dialog title (can contain HTML tags).
 * If function passed in this parameter, the function result will be used.
 *
 * @param {String|Function} config.data.body
 * The main content of the dialog (can contain HTML tags).
 * If function passed in this parameter, the function result will be used.
 *
 * @param {Array} config.data.buttons
 * You can specify the custom buttons in this parameter which should be displayed in the modal footer.
 * Each array element is the object with the following parameters:
 * 	title      - button title.
 * 	extraClass - custom class name which will be added to the button.
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
 * Display modal header.
 *
 * @param {Boolean} [config.fade=false]
 * Apply a CSS fade transition.
 */
Echo.GUI.Modal = function(config) {
	this.config = {
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
	};
	this.update(config);
};

/**
 * This method updates config and re-assemble HTML code of the modal.
 *
 * It can be called with the same parameters as a {@link Echo.GUI.Modal#constructor}
 */
Echo.GUI.Modal.prototype.update = function(config) {
	this.config = $.extend(true, this.config || {}, config);
	this.refresh();
};

/**
 * This method re-assemble the modal dialog HTML code and
 * append it to the target.
 */
Echo.GUI.Modal.prototype.refresh = function() {
	var self = this;
	if (!this.config.show) return;
	if (this.rendered) this.remove();

	this.rendered = true;
	var css = this.config.fade ? "fade" : "hide";
	this.element = this.element || $('<div class="modal ' + css + '" role="dialog" tabindex="-1">');
	this.element.empty();

	this._assembleHeader();
	this._assembleBody();
	this._assembleFooter();
	this._assembleBackdrop();

	this.element.on("hidden", function() {
		self.remove();
	});
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

	this.element.appendTo("body")
		.wrap("<div class='echo-sdk-ui'>")
		.modal(this.config);

	// if we try show few modals in one time, then event "focusin.modal" be called infinity times
	$(document).off('focusin.modal');
};

/**
 * Shows the modal dialog.
 *  myModal.show();
 */
Echo.GUI.Modal.prototype.show = function() {
	this.config.show = true;
	this.refresh();
};

/**
 * Hides the modal dialog and removes the dialog instance.
 *  myModal.remove();
 */
Echo.GUI.Modal.prototype.remove = function() {
	if (this.rendered) {
		this.element.modal("hide");
		this.rendered = false;
		this.backdrop && this.backdrop.remove();
		this.element.find('iframe').hide().attr('src', '//about:blank').end().empty();
		this.element.unwrap().remove();
	}
};

/**
 * Hides the modal dialog.
 *  myModal.hide();
 */
Echo.GUI.Modal.prototype.hide = function() {
	this.config.show = false;
	if (this.rendered) {
		this.element.modal("hide");
	}
};

Echo.GUI.Modal.prototype._assembleHeader = function() {
	if (this.config.header) {
		var header = this._addSection("modal-header", $("<h3>").append(this.config.data.title));
		if (this.config.closeButton) {
			$('<button aria-hidden="true" data-dismiss="modal" class="close" type="button">')
				.append("&times;").prependTo(header);
		}
	}
}

Echo.GUI.Modal.prototype._assembleBody = function() {
	var self = this;
	var body = this._addSection("modal-body", this.config.data.body);
	if (this.config.href) {
		this.element.one("shown", function() {
			body.append('<iframe src="' + self.config.href + '" id="" name="" class="echo-modal-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>');
		});
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
	if (this.config.extraClass) {
		this.element.addClass(this.config.extraClass);
	}
}

Echo.GUI.Modal.prototype._assembleFooter = function() {
	var self = this;
	if (this.config.footer) {
		var footer = this._addSection("modal-footer");
		if (this.config.data.buttons) {
			$.map(this.config.data.buttons, function(button) {
				var el = $("<button>").addClass("btn").append(button.title);
				if (button.extraClass) {
					el.addClass(button.extraClass);
				}
				el.click(function() {
					button.handler && button.handler.call(self, this);
				});
				el.appendTo(footer);
			});
		}
	}
}

Echo.GUI.Modal.prototype._assembleBackdrop = function() {
	var self = this;
	if (self.config.backdrop) {
		if (self.config.fade) {
			self.element.on("show", function() {
				var modal = self.element.data('modal');
				var shown = modal.isShown;
				var backdrop = modal.options.backdrop;
				if (backdrop) return;

				modal.options.backdrop = true;
				modal.isShown = true;
				modal.backdrop(function(){});
				modal.isShown = shown;
				modal.options.backdrop = backdrop;

				self.backdrop = modal.$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		} else {
			self.element.on("shown", function() {
				self.backdrop = self.element.data('modal').$backdrop.wrap("<div class='echo-sdk-ui'>").parent();
			});
		}
		// we used manual control for backdrop if fade is true
		if (self.config.fade) {
			self.config.backdrop = false;
		}
	}
}

Echo.GUI.Modal.prototype._addSection = function(css, content) {
	var section = $('<div class="' + css + '">');
	this.element.append(section);
	if (content) {
		section.append(Echo.Utils.invoke(content));
	}
	return section;
};

})(Echo.jQuery);
