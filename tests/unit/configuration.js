(function($) {

var suite = Echo.Tests.Unit.Configuration = function() {};

suite.prototype.info = {
	"className": "Echo.Configuration",
	"functions": [
		"get",
		"set",
		"remove",
		"extend",
		"getAsHash",
		"_clearCacheByPrefix"
	]
};

suite.prototype.data = {
	"original": {
		"key1": 1,
		"key2": {
			"key2-1": "key2-1 value",
			"key2-2": {
				"key2-2-1": "key2-2-1 value"
			}
		},
		"key3": true,
		"key6": [1,2,3,4,5]
	},
	"overrides": {
		"key2": {
			"key2-1": "NEW key2-1 value"
		},
		"key3": false,
		"key4": "Value from overrides object",
		"key5": 10,
		"key6": [1,2,3]
	}
};

suite.prototype.tests = {};

suite.prototype.tests.PublicInterfaceTests = {
	"check": function() {
		var original = this.data.original;
		var overrides = this.data.overrides;

		var config = new Echo.Configuration(overrides, original);

		QUnit.equal(config.get("key3"), false,
			"Checking if the default config values were overriden correctly");

		QUnit.equal(config.get("key4"), overrides["key4"],
			"Checking if the new values were added into the master config");

		QUnit.equal(config.get("key2.key2-1"), overrides["key2"]["key2-1"],
			"Checking the merge result for the fields with the Object type");

		original["key1"] = 10;
		QUnit.equal(config.get("key1"), 1,
			"Checking if updates of the original object affects config config");

		overrides["key4"] = "Another value from overrides object";
		QUnit.equal(config.get("key4"), "Value from overrides object",
			"Checking if updates of the overrides object affects config config");

		config.set("key1", 5);
		QUnit.equal(original["key1"], 10,
			"Checking if updates of the config doesn't affect original object");
		
		config.set("key5", 50);
		QUnit.equal(overrides["key5"], 10,
			"Checking if updates of the config doesn't affect overrides object");

		QUnit.equal(config.get("key6").length, 3,
			"Check if we override the Array type values completely");

		QUnit.equal(original["key6"].length, 5,
			"Check if the orginal array remains the same");

		config.set("key2.key2-2.key2-2-1", "New value");
		QUnit.equal(config.get("key2.key2-2.key2-2-1"), "New value",
			"Checking nested keys assignment");

		config.set("newkey1.newkey2.newkey3", 100);
		QUnit.equal(config.get("newkey1.newkey2.newkey3"), 100,
			"Checking new nested keys assignment");
		QUnit.equal(config.get("newkey1.newkey2")["newkey3"], 100,
			"Check if new nested keys creation also creates implicit objects");

		QUnit.equal(config.get("somekey", "somevalue"), "somevalue",
			"Checking default value extraction within the get() function");

		config.set("key", false);
		QUnit.equal(config.get("key", "somevalue"), false,
			"Checking if the 'false' is not treated as a reason to use defaults");
		config.set("key", undefined);
		QUnit.equal(config.get("key", "somevalue"), "somevalue",
			"Checking if the 'undefined' IS treated as a reason to use defaults");
		config.set("key", 0);
		QUnit.equal(config.get("key", "somevalue"), 0,
			"Checking if the '0' char is not treated as a reason to use defaults");
		config.set("key", null);
		QUnit.equal(config.get("key", "somevalue"), null,
			"Checking if the 'null' is not treated as a reason to use defaults");

		var dump = config.getAsHash();
		var condition =
			dump["key1"] == config.get("key1") &&
			dump["key5"] == config.get("key5");
		QUnit.equal(condition, true,
			"Check if we dump the right value (checking some fields)");

		config.set("key1", "value1");
		var dump = config.getAsHash();
		dump["key1"] = 15;
		QUnit.equal(config.get("key1"), "value1",
			"Check if changing the value in the dump doesn't affect config values");
		config.set("key1", "value2");
		QUnit.equal(dump["key1"], 15,
			"Check if the dump remains the same after config update");

		config.extend({"key1": 100, "key7": "key7 value", "key2": {"key2-2": "key2-2 value"}});
		var condition =
			config.get("key1") == 100 &&
			config.get("key7") == "key7 value" &&
			config.get("key2.key2-2") == "key2-2 value";
		QUnit.equal(condition, true,
			"Check if we extend the config instance correctly via extend() method");

		config.remove("key1");
		QUnit.equal(config.get("key1"), undefined,
			"Check the remove() method with simple values");

		config.remove("key2.key2-2");
		QUnit.equal(config.get("key1.key2-2.key2-2-1"), undefined,
			"Check the remove() method with objects defined as values");
	}
};

suite.prototype.tests.PrivateFunctionsTests = {
	"check": function() {
		var original = this.data.original;
		var overrides = this.data.overrides;

		var config = new Echo.Configuration(overrides, original);

		config._clearCacheByPrefix("key2");
		QUnit.equal(config.cache["key2"], undefined,
			"Checking if internal cache was cleared");

		QUnit.equal(config.cache["key2.key2-2"], undefined,
			"Checking if nested structure was cleared after the root key was removed");
	}
};

})(jQuery);
