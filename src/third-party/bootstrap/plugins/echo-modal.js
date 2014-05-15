(function(jQuery) {
"use strict";

var $ = jQuery;

if (!window.Echo) window.Echo = {};

if (!Echo.GUI) Echo.GUI = {};

if (Echo.GUI.Modal) return;

/**
 * @class Echo.GUI.Modal
 * Class wrapper for <a href="http://twitter.github.com/bootstrap/javascript.html#modals" target="_blank">bootstrap-modal.js</a>.
 * The Echo.GUI.Modal class provides a simplified interface to work with the
 * Bootstrap Modal JS class.
 * Echo wrapper assembles the HTML code required for Bootstrap Modal JS class
 * based on the parameters specified in the config and initializes
 * the corresponding Bootstrap JS class.
 *
 * Example:
 *
 * 	var myModal = new Echo.GUI.Modal({
 * 		"show": true,
 * 		"backdrop": true,
 * 		"keyboard": true,
 * 		"closeButton": true,
 * 		"remote": false,
 * 		"extraClass": "",
 * 		"data": {
 * 			"title": "Modal title",
 * 			"body": "<b>Modal body</b>",
 * 			"buttons": [{
 * 				"title": "Button1",
 * 				"extraClass": "echo-button1-class",
 * 				"handler": function() {}
 * 			}, {
 * 				"title": "Button2",
 * 				"extraClass": "echo-button2-class",
 * 				"handler": function() {}
 * 			}]
 * 		},
 * 		"width": "400",
 * 		"height": "500",
 * 		"padding": "10",
 * 		"footer": true,
 * 		"header": true,
 * 		"fade": true
 * 	});
 *
 * 	myModal.hide(); // hides the Bootstrap Modal instance
 * 	myModal.config.set("data.title", "New modal title"); // change title of the Bootstrap Modal instance
 * 	myModal.config.set("closeButton", false); // do not show the close button
 * 	myModal.refresh(); // refresh the Bootstrap Modal instance with changed config parameters and show one
 *
 * @extends Echo.GUI
 *
 * @package gui.pack.js
 *
 * @constructor
 * Creates a new modal dialog. The dialog can be created in visible or hidden (default) modes.
 * In order to initialize the modal dialog instance in visible state, the "show" parameter should
 * be defined as 'true' (JS boolean) during the constructor call.
 * For the modal dialogs hidden by default the "show" function can be applied to reveal it when appropriate.
 *
 * @param {Object} config
 * Modal configuration.
 *
 * @cfg {Boolean} [show=false]
 * Defines whether the modal dialog should be displayed right after it is created. 
 *
 * @cfg {Boolean} [backdrop=true]
 * Defines whether the semi-transparent backdrop underneath the modal dialog box should be displayed.
 *
 * @cfg {Boolean} [keyboard=true]
 * Defines whether modal dialog should be closed if the "Esc"(escape) key is pressed on the keyboard.
 *
 * @cfg {Boolean} [closeButton=true]
 * Defines whether the close ("X") icon in the top right corner of the dialog box should be shown.
 *
 * @cfg {String} [remote=false]
 * Remote URL.
 * If a remote URL is provided, content will be loaded via jQuery load method and injected into the modal dialog body.
 *
 * @cfg {String} [extraClass=""]
 * Custom class name which should be added to the modal dialog container.
 *
 * @cfg {String} [href]
 * URL of the standalone page to be displayed inside the modal (loaded via &lt;iframe>).
 *
 * @cfg {Function} [onShow]
 * Callback function to be executed when the modal is opened.
 *
 * @cfg {Function} [onHide]
 * Callback function to be executed when the modal is closed.
 *
 * @cfg {Object} data
 *
 * @cfg {String|Function} data.title
 * Modal dialog title (can contain HTML tags).
 * If function passed in this parameter, the function result will be used.
 *
 * @cfg {String|Function} data.body
 * The main content of the dialog (can contain HTML tags).
 * If function passed in this parameter, the function result will be used.
 *
 * @cfg {Array} data.buttons
 * You can specify the custom buttons in this parameter which should be displayed in the modal footer.
 * Each array element is the object with the following parameters:
 *
 * + title - button title.
 * + extraClass - custom class name which will be added to the button.
 * + handler - function which will be called when button is clicked.
 *
 * @cfg {Number} [width=null]
 * Modal dialog width.
 *
 * @cfg {Number} [height=null]
 * Modal dialog height.
 *
 * @cfg {Number} [padding=null]
 * Modal dialog padding.
 *
 * @cfg {Boolean} [footer=true]
 * Display modal dialog footer.
 * Should be true if you want to display custom buttons.
 *
 * @cfg {Boolean} [header=true]
 * Display modal header.
 *
 * @cfg {Boolean} [fade=false]
 * Apply a CSS fade transition.
 */
Echo.GUI.Modal = Echo.Utils.inherit(Echo.GUI, function(config) {
	Echo.GUI.call(this, config, {
		"targetless": true,
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
		"onHide": function() {},
		"onShow": function() {},
		"fade": false
	});
});

/**
 * This method assemble a bootstrap dialog according to configuration
 * parameters and data.
 */
Echo.GUI.Modal.prototype.refresh = function() {
	var self = this;
	if (this.rendered) this.destroy();

	this.rendered = true;
	var css = this.config.get("fade") ? "fade" : "hide";
	this.element = $('<div class="modal ' + css + '" role="dialog" tabindex="-1">');

	this._assembleHeader();
	this._assembleBody();
	this._assembleFooter();
	this._assembleBackdrop();

	this.element.on("hidden", function() {
		self.destroy();
	});
	this.element.on("shown", function() {
		self.config.get("onShow").call(self, self.element);
	});

	this.element.appendTo("body")
		.wrap('<div class="echo-sdk-ui">')
		.modal(this.config.getAsHash());

	// if we try show few modals in one time, then event "focusin.modal" be called infinity times
	$(document).off("focusin.modal");
};

/**
 * Shows the modal dialog.
 */
Echo.GUI.Modal.prototype.show = function() {
	this.rendered
		? this.element.modal("show")
		: this.refresh();
};

/**
 * Hides the modal dialog and removes the dialog instance.
 */
Echo.GUI.Modal.prototype.destroy = function() {
	if (this.rendered) {
		this.element.modal("hide");
		this.rendered = false;
		this.backdrop && this.backdrop.remove();
		this.element.find("iframe").hide().attr("src", "//about:blank").end().empty();
		this.element.unwrap().remove();
		this.config.get("onHide").call(this, this.element);
	}
};

/**
 * Hides the modal dialog.
 */
Echo.GUI.Modal.prototype.hide = function() {
	if (this.rendered) {
		this.element.modal("hide");
	}
};

Echo.GUI.Modal.prototype._assembleHeader = function() {
	if (this.config.get("header")) {
		var header = this._addSection("modal-header", $("<h3>").append(this.config.get("data").title));
		if (this.config.get("closeButton")) {
			$('<button aria-hidden="true" data-dismiss="modal" class="close" type="button">')
				.append("&times;").prependTo(header);
		}
	}
};

Echo.GUI.Modal.prototype._assembleBody = function() {
	var self = this;
	var body = this._addSection("modal-body", this.config.get("data").body);
	if (this.config.get("href")) {
		this.element.one("shown", function() {
			var iframe = $('<iframe src="' + self.config.get("href") + '" id="" name="" class="echo-modal-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
			if (typeof iframe.get(0).allowTransparency !== "undefined") {
				iframe.attr("allowTransparency", "true");
			}
			body.append(iframe);
		});
	}
	if (this.config.get("width") !== null) {
		this.element.width(this.config.get("width"))
			.css({"margin-left": this.config.get("width") * -0.5});
	}
	if (this.config.get("height") !== null) {
		body.height(this.config.get("height"));
	}
	if (this.config.get("padding") !== null) {
		body.css("padding", this.config.get("padding"));
	}
	if (this.config.get("extraClass")) {
		this.element.addClass(this.config.get("extraClass"));
	}
};

Echo.GUI.Modal.prototype._assembleFooter = function() {
	var self = this;
	if (this.config.get("footer")) {
		var footer = this._addSection("modal-footer");
		if (this.config.get("data").buttons) {
			$.map(this.config.get("data").buttons, function(button) {
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
};

Echo.GUI.Modal.prototype._assembleBackdrop = function() {
	var self = this;
	if (self.config.get("backdrop")) {
		if (self.config.get("fade")) {
			self.element.on("show", function() {
				var modal = self.element.data("modal");
				var shown = modal.isShown;
				var backdrop = modal.options.backdrop;

				modal.options.backdrop = true;
				modal.isShown = true;
				modal.backdrop(function(){});
				modal.isShown = shown;
				modal.options.backdrop = backdrop;

				self.backdrop = modal.$backdrop.wrap('<div class="echo-sdk-ui">').parent();
			});
		} else {
			self.element.on("shown", function() {
				self.backdrop = self.element.data("modal").$backdrop.wrap('<div class="echo-sdk-ui">').parent();
			});
		}
		// we used manual control for backdrop if fade is true
		if (self.config.get("fade")) {
			self.config.set("backdrop", false);
		}
	}
};

Echo.GUI.Modal.prototype._addSection = function(css, content) {
	var section = $('<div class="' + css + '">');
	this.element.append(section);
	if (content) {
		section.append($.isFunction(content) ? content(section) : content);
	}
	return section;
};

})(Echo.jQuery);
