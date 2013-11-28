Echo.Tests.Units.push(function(callback) {
Echo.require([
	"jquery",
	"echo/labels"
], function($, Labels) {

"use strict";

Echo.Tests.module("Echo.Labels", {
	"meta": {
		"className": "Echo.Labels",
		"functions": ["_key", "set", "get"]
	}
});

Echo.Tests.test("public interface", function() {
	Labels.set({
		"field": "value",
		"key": "{content}"
	}, "Namespace");

	QUnit.equal(Labels._key("field", "Namespace"), "Namespace.field",
		"Checking static _key() method");
	QUnit.equal(Labels.get("field", "Namespace"), "value",
		"Checking static get() method");
	QUnit.equal(Labels.get("wrong_field", "Namespace"), "wrong_field",
		"Checking static get() method with wrong name param");
	QUnit.equal(Labels.get("key", "Namespace", {"content": "test"}), "test",
		"Checking static get() method with data param");

	Labels.set({
		"field": "default_value",
		"key": "default_content"
	}, "Namespace", 1);

	QUnit.equal(Labels.get("field", "Namespace"), "value",
		"Checking that custom label is not overridden by default");

	var TestObject = function(data, namespace) {
		this.labels = new Labels(data, namespace);
	};

	TestObject.prototype.getField = function(field) {
		return this.labels.get(field);
	};

	TestObject.prototype.getOverriddenField = function(field, data) {
		return this.labels.get(field, data);
	};

	TestObject.prototype.setField = function(data) {
		this.labels.set(data);
	};

	var data = {
		"field": "test_value",
		"key": "{test_content}"
	};

	var object = new TestObject(data, "Namespace");
	QUnit.equal(object.getField("field"), "test_value",
		"Checking get() method of instance");
	QUnit.equal(
		object.getOverriddenField("key", {"test_content": "new_content"}),
		"new_content",
		"Checking get() method of instance with data"
	);
	object.setField({"new_key": "new_value"});
	QUnit.equal(object.getField("new_key"), "new_value",
		"Checking set() + get() methods");
	QUnit.equal(Labels.get("field", "Namespace"), "value",
		"Checking that custom global label is not overridden by Echo.Labels instance");
});
callback();
});
});
