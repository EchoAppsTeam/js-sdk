(function($) {

var suite = Echo.Tests.Unit.Localization = function() {};

suite.prototype.info = {
	"className": "Echo.Localization",
	"functions": ["key", "extend", "label"]
};

suite.prototype.tests = {};

suite.prototype.tests.TestLocalizationMethods = {
	"check": function() {
		Echo.Localization.extend({
			"field": "value",
			"key": "{content}"
		}, "Namespace");
		QUnit.equal(Echo.Localization.labels["Namespace.field"], "value", "Checking extends() method");
		QUnit.equal(Echo.Localization.key("field", "Namespace"), "Namespace.field", "Checking key() method");
		QUnit.equal(Echo.Localization.label("field", "Namespace"), "value", "Checking label() method");
		QUnit.equal(Echo.Localization.label("key", "Namespace", {"content": "test"}), "test", "Checking label() method with data param");
	}
}

})(jQuery);
