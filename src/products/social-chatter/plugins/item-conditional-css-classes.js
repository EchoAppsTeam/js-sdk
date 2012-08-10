// vim: set ts=8 sts=8 sw=8 noet:
/*
 * Copyright (c) 2006-2011 Echo <solutions@aboutecho.com>. All rights reserved.
 * You may copy and modify this script as long as the above copyright notice,
 * this condition and the following disclaimer is left intact.
 * This software is provided by the author "AS IS" and no warranties are
 * implied, including fitness for a particular purpose. In no event shall
 * the author be liable for any damages arising in any way out of the use
 * of this software, even if advised of the possibility of such damage.
 */
(function($) {

var plugin = Echo.createPlugin({
	"name": "ItemConditionalCSSClasses",
	"applications": ["Stream"],
	"init": function(plugin, application) {
		plugin.extendRenderer("Item", "content", plugin.renderers.Item.content);
	}
});

plugin.renderers = {"Item": {}};

plugin.renderers.Item.content = function(element) {
	var item = this;
	item.parentRenderer("content", arguments);
	var conditions = plugin.config.get(item, "conditions");
	if (!conditions || !conditions.length) return;
	$.map(conditions, function(condition) {
		var value = $.getNestedValue(condition.field, item.data);
		var isCaseInsensitive = plugin.config.get(item, "caseInsensitive") == true;
		if ($.isArray(value)) {
			$.each(value, function(_id, _value) {
				if (plugin.areEqual(_value, condition.value, isCaseInsensitive)) {
					element.addClass(condition.className);
					return false; // break
				}
			});
		} else if (plugin.areEqual(condition.value, value, isCaseInsensitive)) {
			element.addClass(condition.className);
		}
	});
};

plugin.areEqual = function(string1, string2, isCaseInsensitive) {
	if (isCaseInsensitive) {
		string1 = (string1 || "").toLowerCase();
		string2 = (string2 || "").toLowerCase();
	}
	return string1 == string2;
};

})(jQuery);
