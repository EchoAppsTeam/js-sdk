(function($){
	//Save original function reference for internal usage
	var _val = $.fn.val;
	$.iHint = function(target, options) {
		var jElement = $(target);
		//Default values
		target.iHint = {
			"text": "iHint Text",
			"className": "iHint-default"
		};
		//Override with extra parameters
		$.extend(target.iHint, options);
		//Set event callbacks, attributes and call blur
		jElement
			.blur(function() {
				if (!_val.call(jElement)) {
					jElement.addClass(target.iHint.className);
					_val.call(jElement, target.iHint.text);
				}
			})
			.focus(function() {
				if (_val.call(jElement) == target.iHint.text) {
					jElement.removeClass(target.iHint.className);
					_val.call(jElement, "");
				}
			})
			.trigger("blur");
	};
	$.fn.iHint = function(options) {
		return this.each(function() {
			new $.iHint(this, options);
		});
	};
	//override default "val" function so it could be used on iHint elements
	$.fn.val = function(value) {
		if (this[0] && this[0].iHint) {
			if (typeof(value) == 'undefined') {
				if (_val.apply(this, arguments) == this[0].iHint.text) {
					return "";
				}
			} else {
				this.removeClass(this[0].iHint.className);
				return _val.apply(this, arguments);
			}
		} 
		return _val.apply(this, arguments);
	};
})(jQuery);
