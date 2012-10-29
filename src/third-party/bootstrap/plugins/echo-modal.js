(function(jQuery) {

var $ = jQuery;

$.echoModal = function() {
	return new Modal(arguments[0]);
};

var Modal = function(config) {
	var params = $.extend({
		"show": false,
		"backdrop": true,
		"keyboard": true,
		"closeButton": false,
		"remote": false,
		"class": "",
		"data": {}
	}, config);

	this.element = $('<div class="modal hide" role="dialog">');

	var header = this._addSection("modal-header", params.data.title);

	if (params.href) {
		params.data.body = $('<iframe scrolling="no" frameborder="0" src="' + params.href +'" hspace="0">');
	}
	var body = this._addSection("modal-body", params.data.body);
	var footer = this._addSection("modal-footer");

	if (params.data.buttons) {
		$.map(params.data.buttons, function(button) {
			var el = $("<button>").addClass("btn").append(button.title);
			$.map(button["class"] || [], function(extraClass) {
				el.addClass(extraClass);
			});
			el.click(function() {
				button.handler && button.handler();
			});
			el.appendTo(footer);
		});
	}
	if (params.class) {
		this.element.addClass(params.class);
	}
	if (params.backdrop) {
		this.element.on("shown", function() {
			$(".modal-backdrop").wrap("<span class='echo-sdk-ui'>");
		});
		this.element.on("hide", function() {
			$(".modal-backdrop").unwrap();
		});
	}
	if (params.closeButton) {
		$('<button aria-hidden="true" data-dismiss="modal" class="close" type="button">')
			.append("×").prependTo(header);
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

	this.element.appendTo("body")
		.wrap("<span class='echo-sdk-ui'>")
		.modal(params);
};

Modal.prototype._addSection = function(css, content) {
	var element = $("<div>");
	return element.addClass(css)
		.appendTo(this.element)
		.append($.isFunction(content) ? content(element) : content);
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

})(Echo.jQuery);
