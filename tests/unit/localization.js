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
		
		QUnit.equal(Echo.Localization.key("field", "Namespace"), "Namespace.field", "Checking static key() method");
		QUnit.equal(Echo.Localization.label("field", "Namespace"), "value", "Checking static label() method");
		QUnit.equal(Echo.Localization.label("wrong_field", "Namespace"), "wrong_field", "Checking static label() method with wrong name param");
		QUnit.equal(Echo.Localization.label("key", "Namespace", {"content": "test"}), "test", "Checking static label() method with data param");
		
		Echo.Localization.extend({
			"field": "default_value",
			"key": "default_content"
		}, "Namespace", 1);
		
		QUnit.equal(Echo.Localization.label("field", "Namespace"), "value", "Checking that custom localization is not overridden by default");
		
		var TestObject = function(data, namespace) {
			this.localization = new Echo.Localization(data, namespace);
		};
		
		TestObject.prototype.getField = function(field) {
			return this.localization.label(field);
		};
		
		TestObject.prototype.getOverriddenField = function(field, data) {
			return this.localization.label(field, data);
		};
		
		TestObject.prototype.extendField = function(data) {
			this.localization.extend(data);
		};
		
		var localization = {
			"field": "test_value",
			"key": "{test_content}"
		};
		
		var object = new TestObject(localization, "Namespace");
		QUnit.equal(object.getField("field"), "test_value", "Checking label() method of instance");
		QUnit.equal(object.getOverriddenField("key", {"test_content": "new_content"}), "new_content", "Checking label() method of instance with data");
		object.extendField({"new_key": "new_value"});
		QUnit.equal(object.getField("new_key"), "new_value", "Checking extend() + label() methods");
		QUnit.equal(Echo.Localization.label("field", "Namespace"), "value", "Checking that custom global localization is not overridden by instance localization");
	}
};

})(jQuery);
