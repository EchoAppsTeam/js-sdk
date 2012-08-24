var plugin = Echo.Plugin.manifest("ItemConditionalCSSClasses", "Echo.StreamServer.Controls.Stream.Item");

plugin.component.renderers.content = function(element) {
	var self = this;
	var item = this.component;
	item.parentRenderer("content", arguments);
	var conditions = this.config.get("conditions");
	if (!conditions || !conditions.length) return;
	$.map(conditions, function(condition) {
		var value = Echo.Utils.getNestedValue(condition.field, item.data);
		var isCaseInsensitive = self.config.get("caseInsensitive") === true;
		if ($.isArray(value)) {
			$.each(value, function(_id, _value) {
				if (self._areEqual(_value, condition.value, isCaseInsensitive)) {
					element.addClass(condition.className);
					return false; // break
				}
			});
		} else if (self._areEqual(condition.value, value, isCaseInsensitive)) {
			element.addClass(condition.className);
		}
	});
	return element;
};

plugin.methods._areEqual = function(string1, string2, isCaseInsensitive) {
	if (isCaseInsensitive) {
		string1 = (string1 || "").toLowerCase();
		string2 = (string2 || "").toLowerCase();
	}
	return string1 === string2;
};

Echo.Plugin.create(plugin);
