(function($) {

var suite = Echo.Tests.Unit.Utils = function() {};

suite.prototype.info = {
	"className": "Echo.Utils",
	"functions": [
		"addCSS",
		"capitalize",
		"foldl",
		"getComponent",
		"get",
		"getUniqueString",
		"getVisibleColor",
		"hasCSS",
		"htmlize",
		"htmlTextTruncate",
		"hyperlink",
		"inherit",
		"invoke",
		"isComponentDefined",
		"isMobileDevice",
		"loadImage",
		"log",
		"objectToJSON",
		"parallelCall",
		"parseURL",
		"remove",
		"sequentialCall",
		"set",
		"stripTags",
		"substitute", // covered within the Control and Plugin tests
		"getTimestamp"
	]
};

suite.prototype.tests = {};

suite.prototype.tests.TestDataMethods = {
	"check": function() {
		var hash = Echo.Utils.foldl({}, ["value1", "value2"], function(value, acc) {
			acc[value] = value;
		});
		var values = Echo.Utils.foldl([], ["value1", "value2"], function(value, acc) {
			acc.push(value);
		});
		var truncated_hash = Echo.Utils.foldl({}, {"key1": "value1", "key2": "value2"}, function(value, acc, key) {
			if (key === "key2") return;
			acc[key] = value;
		});

		QUnit.deepEqual(hash, { "value1": "value1", "value2": "value2" },
			"Checking foldl() method with hash as accumulator");
		QUnit.deepEqual(values, ["value1", "value2"],
			"Checking foldl() method with with array as accumulator");
		QUnit.deepEqual(truncated_hash, { "key1": "value1" },
			"Checking foldl() method with undefined return in callback");

		var data = {
			"key1": "value1",
			"key2": {
				"key2-1": "value2-1",
				"key2-2": {
					"key2-2-1": "value2-2-1"
				}
			}
		};

		var cases = [
			["", false, "empty string as a value"],
			[false, false, "boolean 'false' as a value"],
			[true, false, "boolean 'true' as a value"],
			[0, false, "integer '0' as a value"],
			[12, false, "non-zero integer '12' as a value"],
			[{}, false, "object as a value"],
			["key", ["key"], "plain key string"],
			["key1.key2", ["key1", "key2"], "string key with nesting"],
			[["key1", "key2"], ["key1", "key2"], "array as a key"],
			[[], false, "empty array as a key"]
		];
		$.map(cases, function(_case) {
			var result = Echo.Utils._prepareFieldAccessKey(_case[0]);
			var label = "Checking Echo.Utils._prepareFieldAccessKey (" + _case[2] + ")";
			if (_case[1] === false) {
				QUnit.equal(result, _case[1], label);
			} else {
				QUnit.deepEqual(result, _case[1], label);
			}
		});

		QUnit.equal(Echo.Utils.get(data, "key1"), "value1",
			"Checking get() method with simple key");
		QUnit.deepEqual(Echo.Utils.get(data, ""), undefined,
			"Checking get() method with empty string as key, expecting 'undefined'");
		QUnit.deepEqual(Echo.Utils.get(data, []), undefined,
			"Checking get() method with empty array as key, expecting 'undefined'");
		QUnit.deepEqual(Echo.Utils.get(data, "key2"), {
			"key2-1": "value2-1",
			"key2-2": {
				"key2-2-1": "value2-2-1"
			}
		}, "Checking get() method");
		QUnit.equal(Echo.Utils.get(data, "key2.key2-1"), "value2-1",
			"Checking get() method with complex key");
		QUnit.equal(Echo.Utils.get(data, ["key2", "key2-1"]), "value2-1",
			"Checking get() method with complex key represented by Array");
		QUnit.equal(Echo.Utils.get(data, "key1.fakekey", "default value"), "default value",
			"Checking get() method with fake key and default value");
		QUnit.equal(Echo.Utils.get(data), undefined,
			"Checking if the get() method returns 'undefined' in case the key is mising");
		QUnit.equal(Echo.Utils.get(undefined, "key1"), undefined,
			"Checking if the get() method returns 'false' in case the data is mising");
		QUnit.equal(Echo.Utils.get(), undefined,
			"Checking if the get() method returns 'false' in case both the data and key are mising");

		Echo.Utils.set(data, "key1", {"key1-1": "value1-1"});
		QUnit.deepEqual(data["key1"], {"key1-1": "value1-1"},
			"Checking set() method with object param");
		Echo.Utils.set(data, "key3", "value3");
		QUnit.equal(Echo.Utils.set(data), false,
			"Checking if the set() method returns 'false' in case the key is mising");
		QUnit.equal(Echo.Utils.set(undefined, "key1"), false,
			"Checking if the set() method returns 'false' in case the data is mising");
		QUnit.equal(Echo.Utils.set(), false,
			"Checking if the set() method returns 'false' in case both the data and key are mising");

		QUnit.equal(data["key3"], "value3",
			"Checking set() method with plain param");
		QUnit.ok(!Echo.Utils.remove(data, ""), "Checking remove() with empty key");
		QUnit.ok(!Echo.Utils.remove(undefined, "key2"), "Checking remove() with undefined object");
		QUnit.ok(!Echo.Utils.remove(data), "Checking remove() with undefined key");
		QUnit.ok(Echo.Utils.remove(data, "key1") && typeof data.key1 === "undefined" && !data.hasOwnProperty("key1"), "Checking that remove() returns right value and that value by key realy removed");
		QUnit.deepEqual(data, {
			"key2": {
				"key2-1": "value2-1",
				"key2-2": {
					"key2-2-1": "value2-2-1"
				}
			},
			"key3": "value3"
		}, "Checking remove() with simple key");
		Echo.Utils.remove(data, "key2.key2-2.key2-2-1");
		QUnit.deepEqual(data, {
			"key2": {
				"key2-1": "value2-1",
				"key2-2": {}
			},
			"key3": "value3"
		}, "Checking remove() with complex key");
		QUnit.ok(!Echo.Utils.remove("key2.key2-2.key2-2-1"), "Checking remove() method with non-existing complex key (tail key is not defined)");
		QUnit.ok(!Echo.Utils.remove("key2.key2-34.key2-2-1"), "Checking remove() method with non-existing complex key (middle key is not defined)");
		Echo.Utils.remove(data, ["key2", "key2-2"]);
		QUnit.deepEqual(data, {
			"key2": {
				"key2-1": "value2-1"
			},
			"key3": "value3"
		}, "Checking remove() with complex key represented by Array");
		Echo.Utils.set(data, "key1.key-null", null);
		QUnit.ok(!Echo.Utils.remove(data, "key1.key-null.key"), "Checking remove() with null target");
		QUnit.equal(Echo.Utils.remove(data), false,
			"Checking if the remove() method returns 'false' in case the key is mising");
		QUnit.equal(Echo.Utils.remove(undefined, "key1"), false,
			"Checking if the remove() method returns 'false' in case the data is mising");
		QUnit.equal(Echo.Utils.remove(), false,
			"Checking if the remove() method returns 'false' in case both the data and key are mising");

		QUnit.equal(Echo.Utils.htmlize(), undefined,
			"Checking htmlize() method with undefined param");
		QUnit.equal(Echo.Utils.htmlize(""), "",
			"Checking htmlize() method with empty string param");
		QUnit.equal(Echo.Utils.htmlize(10), 10,
			"Checking htmlize() method with integer param (expecting the same integer to be returned)");
		QUnit.equal(Echo.Utils.htmlize("text1 < & > text2"), "text1 &lt; &amp; &gt; text2",
			"Checking htmlize() method with special characters");

		QUnit.equal(Echo.Utils.stripTags(), undefined,
			"Checking stripTags() method with undefined param");
		QUnit.equal(Echo.Utils.stripTags(""), "",
			"Checking stripTags() method with empty string param");
		QUnit.equal(Echo.Utils.stripTags(20), 20,
			"Checking stripTags() method with integer param (expecting the same integer to be returned)");
		QUnit.equal(Echo.Utils.stripTags("<div>Content</div>"), "Content",
			"Checking stripTags() method with simple HTML");
		QUnit.equal(Echo.Utils.stripTags("<div>Outer<div><!-- Comment -->Inner</div></div>"), "OuterInner",
			"Checking stripTags() method with complex HTML");

		QUnit.equal(Echo.Utils.objectToJSON(null), "null",
			"Checking objectToJSON() method for null object ");
		QUnit.equal(Echo.Utils.objectToJSON(123), "123",
			"Checking objectToJSON() method for number object");
		QUnit.equal(Echo.Utils.objectToJSON("string\n"), "\"string\\n\"",
			"Checking objectToJSON() method for string object");
		QUnit.equal(Echo.Utils.objectToJSON(Number.POSITIVE_INFINITY), "null",
			"Checking objectToJSON() method for number object (infinity value)");
		QUnit.equal(Echo.Utils.objectToJSON(true), "true",
			"Checking objectToJSON() method for boolean object (true value)");
		QUnit.equal(Echo.Utils.objectToJSON(false), "false",
			"Checking objectToJSON() method for boolen object (false value)");
		QUnit.equal(Echo.Utils.objectToJSON(["value1", "value2"]), '["value1","value2"]',
			"Checking objectToJSON() method for simple array");
		QUnit.equal(Echo.Utils.objectToJSON([["value1.1", "value1.2"], "value2"]), '[["value1.1","value1.2"],"value2"]',
			"Checking objectToJSON() method for complex array");
		QUnit.equal(Echo.Utils.objectToJSON({"k1": "v1", "k2": "v2"}), '{"k1":"v1","k2":"v2"}',
			"Checking objectToJSON() method for simple object");

		var complex_object = {
			"k1": ["v1.1", null, false],
			"k2": {
				"k2.1": 21,
				"k2.2": 22
			}
		};
		QUnit.equal(Echo.Utils.objectToJSON(complex_object), '{"k1":["v1.1",null,false],"k2":{"k2.1":21,"k2.2":22}}',
			"Checking objectToJSON() method for complex object");

		QUnit.deepEqual(Echo.Utils.parseURL("http://domain.com/some/path/1?query_string#hash_value"), {
			"scheme": "http",
			"domain": "domain.com",
			"path": "/some/path/1",
			"query": "query_string",
			"fragment": "hash_value"
		}, "Checking parseURL() method");

		QUnit.deepEqual(Echo.Utils.parseURL("https://www.domain.com"), {
			"scheme": "https",
			"domain": "www.domain.com",
			"path": "/",
			"query": "",
			"fragment": ""
		}, "Checking parseURL() method with some undefined fields");

		QUnit.equal(Echo.Utils.getTimestamp("1994-11-05T08:15:30Z"), 784023330,
			"Checking getTimestamp() method");
		QUnit.equal(Echo.Utils.getTimestamp("1994-11-05T08:15:30+01:30"), 784017930,
			"Checking getTimestamp() method with timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-11-09T11:32:23.726Z"), 1352460743.726,
			"Checking getTimestamp() method with milliseconds");
		QUnit.equal(Echo.Utils.getTimestamp("2012-11-09T11:32:23.726+01:00"), 1352457143.726,
			"Checking getTimestamp() method with timezone offset and millisecond");
		QUnit.equal(Echo.Utils.getTimestamp("2012-11-09T11:32:23.726-01:00"), 1352464343.726,
			"Checking getTimestamp() method with negative timezone offset and milliseconds");
		QUnit.equal(Echo.Utils.getTimestamp("2012-11-09"), 1352419200,
			"Checking getTimestamp() method with just date defined");
		QUnit.equal(Echo.Utils.getTimestamp("2012-11"), 1351728000,
			"Checking getTimestamp() method with year and month defined");
		QUnit.equal(Echo.Utils.getTimestamp("2012"), 1325376000,
			"Checking getTimestamp() method with just year defined");
		QUnit.equal(Echo.Utils.getTimestamp("2012-01-01"), 1325376000,
			"Checking getTimestamp() method with boundary values of the year and month (min both)");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-01"), 1354320000,
			"Checking getTimestamp() method with boundary values of the year and month (month max, date min)");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-31"), 1356912000,
			"Checking getTimestamp() method with boundary values of the year and month (max both)");
		QUnit.equal(Echo.Utils.getTimestamp("2012-01-01T00:00:00.000Z"), 1325376000,
			"Checking getTimestamp() method with boundary values (min time)");
		QUnit.equal(Echo.Utils.getTimestamp("2012-01-01T00:00:00.000+00:00"), 1325376000,
			"Checking getTimestamp() method with boundary values (min time) and timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-31T23:59:59.999Z"), 1356998399.999,
			"Checking getTimestamp() method with boundary values of the year and month (max time)");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-31T23:59:59.999-00:00"), 1356998399.999,
			"Checking getTimestamp() method with boundary values of the year and month (max time) and negative zero timzone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-01-01T00:00:00.000-01:45"), 1325382300,
			"Checking getTimestamp() method with boundary values (min time) and negative timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-01-01T00:00:00.000+01:45"), 1325369700,
			"Checking getTimestamp() method with boundary values (min time) and positive timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-31T23:59:59.999-23:59"), 1357084739.999,
			"Checking getTimestamp() method with boundary values of the year and month (max time) and negative timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("2012-12-31T23:59:59.999+23:59"), 1356912059.999,
			"Checking getTimestamp() method with boundary values of the year and month (max time) and positive timezone offset");
		QUnit.equal(Echo.Utils.getTimestamp("1994-11-0508-15:30"), undefined,
			"Checking getTimestamp() method with incorrect input value");

		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some_content</div>", 10), "<div>some_conte</div>",
			"Checking htmlTextTruncate() method");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>content</div>", 10), "<div>content</div>",
			"Checking htmlTextTruncate() method with short HTML content");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div><span>some</span>_content</div>", 10),"<div><span>some</span>_conte</div>",
			"Checking htmlTextTruncate() method with nested HTML tags");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some_content</div>", 10, "_postfix"), "<div>some_conte_postfix</div>",
			"Checking htmlTextTruncate() method with postfix param");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>some&nbsp;content</div>", 10), "<div>some&nbsp;conten</div>",
			"Checking htmlTextTruncate() method with special character");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>123456", 5, "", true), "<div>12345</div>",
			"Checking htmlTextTruncate() method with forceClosingTabs = true");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>123456", 5, "", false), "<div>12345</div>",
			"Checking htmlTextTruncate() method with forceClosingTabs = false");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>12345", 5, "", true), "<div>12345</div>",
			"Checking htmlTextTruncate() method with forceClosingTabs = true and no truncation");
		QUnit.equal(Echo.Utils.htmlTextTruncate("<div>12345", 5, "", false), "<div>12345",
			"Checking htmlTextTruncate() method with forceClosingTabs = false and no truncation");

		QUnit.ok(typeof Echo.Utils.getUniqueString() == "string", "getUniqueString() really returns string");
		var strings = [];
		for (var i = 0; i < 5; i++) {
			strings.push(Echo.Utils.getUniqueString());
		}
		for (var i = 0; i < 4; i++) {
			var str = strings.shift();
			QUnit.ok(!~$.inArray(str, strings), "getUniqueString(): string \"" + str + "\" differs from others");
		}

		var classA = function() {};
		classA.prototype.functionA = function() {};
		var classB = Echo.Utils.inherit(classA);
		classB.prototype.functionB = function() {};
		QUnit.ok(!!classB.prototype.functionB,
			"Checking that the result object extended using the Echo.Utils.inherit function has native methods");
		QUnit.ok(!!classA.prototype.functionA,
			"Checking that the parent object has native function after the Echo.Utils.inherit function call");
		QUnit.ok(!classA.prototype.functionB,
			"Checking that there is no methods added to the parent object after the Echo.Utils.inherit function call");
		QUnit.ok(!!classB.prototype.functionA,
			"Checking if the child object has all methods from the parent class");

		QUnit.ok(!!Echo.Utils.getComponent("Echo"),
			"Checking if Echo namespace was defined (via getComponent function)");
		QUnit.ok(!!Echo.Utils.getComponent("Echo.Utils"),
			"Checking if Echo.Utils lib was defined (via getComponent function)");
		QUnit.deepEqual(Echo.Utils.getComponent("Echo.Utils"), window.Echo.Utils,
			"Checking if we receive a proper link back from the getComponent function");
		QUnit.equal(Echo.Utils.getComponent("Fake.Echo.Utils"), undefined,
			"Checking if we receive 'undefined' as a value in case the given component doesn't exist on the page");

		QUnit.ok(Echo.Utils.isComponentDefined("Echo"),
			"Checking if Echo namespace was defined (via isComponentDefined function)");
		QUnit.ok(Echo.Utils.isComponentDefined("Echo.Utils"),
			"Checking if Echo.Utils lib was defined (via isComponentDefined function)");
		QUnit.ok(!Echo.Utils.isComponentDefined("Echo.SomeRandomLib"),
			"Checking if the isComponentDefined function triggers negative value for the random name");
		QUnit.ok(!Echo.Utils.isComponentDefined("SomeNameSpace.SomeRandomLib"),
			"Checking if the isComponentDefined function triggers negative value for the random name and namespace");

		try {
			// checking log() calls with invalid params
			Echo.Utils.log();
			Echo.Utils.log("Some message");
			Echo.Utils.log(null);
			Echo.Utils.log(undefined);
			Echo.Utils.log({});
			Echo.Utils.log({"test": 1});

			// call log() with valid params
			Echo.Utils.log({
				"component": "Echo.TestComponent",
				"type": "warning",
				"message": "Test message from JS SDK Control class",
				"args": {"a": 1, "b": 2}
			});

			// checking if no exceptions were thrown
			QUnit.ok(true, "Checking if no exceptions were thrown while executing the \"log\" function with valid and invalid params");
		} catch(e) {
			QUnit.ok(e, "Execution of the \"log\" function caused exception.");
		};
		QUnit.deepEqual(new RegExp(Echo.Utils.regexps.templateSubstitution).exec("{key:value}"),
			["{key:value}", "key", "value"], "Checking templateSubstitution regexp with one key-value pair");
		QUnit.deepEqual(new RegExp(Echo.Utils.regexps.templateSubstitution).exec("{key}"),
			["{key}", "key", ($.browser.msie && $.browser.version <= 8 || $.browser.msie && document.compatMode === "BackCompat" ? "" : undefined)], "Checking templateSubstitution regexp with key and empty value");
		QUnit.deepEqual(new RegExp(Echo.Utils.regexps.templateSubstitution).exec("string without template"),
			null, "Checking templateSubstitution regexp with fake string as parameter");
		var regexp = new RegExp(Echo.Utils.regexps.templateSubstitution, "g");
		var found = [].concat(regexp.exec("{key1:value1} {key2:value2}"),
				      regexp.exec("{key1:value1} {key2:value2}"));
		QUnit.deepEqual(found, ["{key1:value1}", "key1", "value1", "{key2:value2}", "key2", "value2"],
				"Checking templateSubstitution regexp with multiple key-value pairs");

		var linkParams = {
			"data": {
				"caption": "TestLink",
				"href": "http://aboutecho.com",
				"target": "_blank"
			},
			"options": {
				"openInNewWindow": true,
				"skipEscaping": true
			}
		};

		var link = Echo.Utils.hyperlink(linkParams.data, linkParams.options);
		QUnit.equal(link, "<a href=\"http://aboutecho.com\" target=\"_blank\">TestLink</a>",
			"Checking that hyperlink() method returns a proper link");

		linkParams.data.href = undefined;
		link = Echo.Utils.hyperlink(linkParams.data, linkParams.options);
		QUnit.equal(link, "<a target=\"_blank\" href=\"javascript:void(0)\">TestLink</a>",
			"Checking that hyperlink() method sets 'javascript:void(0)' as default href");

		linkParams.data.href="http://aboutecho.com";
		linkParams.data.caption = undefined;
		link = Echo.Utils.hyperlink(linkParams.data, linkParams.options);
		QUnit.equal(link, "<a href=\"http://aboutecho.com\" target=\"_blank\"></a>",
			"Checking hyperlink() method without caption");

		linkParams.data.target = undefined;
		linkParams.options.openInNewWindow = true;
		link = Echo.Utils.hyperlink(linkParams.data, linkParams.options);
		QUnit.equal(link, "<a href=\"http://aboutecho.com\" target=\"_blank\"></a>",
			"Checking hyperlink() method sets target to '_blank' value if openInNewWindow is true");

		linkParams.data.href = "http://aboutecho.com\?&a=b";
		linkParams.options.skipEscaping = false;
		link = Echo.Utils.hyperlink(linkParams.data, linkParams.options);
		QUnit.equal(link, "<a href=\"http://aboutecho.com\?&amp;a=b\" target=\"_blank\"></a>",
			"Checking hyperlink() method htmlizes href attribute if skipEscaping is false");
		QUnit.strictEqual(Echo.Utils.capitalize(""), "", "Checking capitalize method if string is empty");
		QUnit.strictEqual(Echo.Utils.capitalize("someword"), "Someword", "Checking capitalize method if argument is lowercased word but with no word boundary.");
		QUnit.strictEqual(Echo.Utils.capitalize(" someword"), " Someword", "Checking capitalize method if argument is lowercased word but with word boundary.");
		QUnit.strictEqual(Echo.Utils.capitalize("SOMEWORD"), "SOMEWORD", "Checking capitalize method if argument is uppercased word");
		QUnit.strictEqual(Echo.Utils.capitalize("some text with whitespaces capitalized"), "Some Text With Whitespaces Capitalized", "Checking capitalize method if argument is regular text with whitespaces");
		QUnit.strictEqual(Echo.Utils.capitalize("some|long|word|with|no|whitespace|delimiter"), "Some|Long|Word|With|No|Whitespace|Delimiter", "Checking capitalize method if argument string is delimted with no whiespaces word boundary");

		var nonCtxSpecificCases = [
			[10, 10],
			[true, true],
			[undefined, undefined],
			["some string", "some string"],
			[function() { return "test"; }, "test"],
			[function() {}, undefined],
			[function() { return this.a; }, undefined]
		];
		var ctxSpecificTests = [
			[function() { return this.a; }, 1],
			[function() { return this.b; }, undefined],
			[function() { return this.c; }, "test"]
		];
		var invoke = function(cases, context) {
			$.each(cases, function(id, _case) {
				QUnit.strictEqual(
					Echo.Utils.invoke(_case[0], context),
					_case[1],
					"Checking \"invoke()\" method, case #" + (id + 1) + ", " +
						"with " + (context ? "defined" : "no") + " context"
				);
			});
		};
		invoke(nonCtxSpecificCases);
		invoke(ctxSpecificTests, {"a": 1, "c": "test"});
	}
};

suite.prototype.tests.TestDomMethods = {
	"check": function() {
		QUnit.ok(!Echo.Utils.hasCSS("utils-tests"),
			"Checking whether we have the \"utils-tests\" CSS styles set added to the document before really adding it (using hasCSS function)");
		QUnit.ok(Echo.Utils.addCSS(".echo-utils-tests { background-color: rgb(12, 34, 56); }", "utils-tests"),
			"Checking that addCSS() method returns true if CSS-class was added");
		QUnit.ok(Echo.Utils.hasCSS("utils-tests"),
			"Checking whether we have the \"utils-tests\" CSS styles set added as soon as we added it into the document (using hasCSS function)");
		QUnit.ok(!Echo.Utils.hasCSS(), "Checking the hasCSS function with empty argument");

		var testElement = $('<div class="echo-utils-tests"></div>');
		$("#qunit-fixture").append(testElement);
		QUnit.ok(/rgb\(12,\s*34,\s*56\)/.test(Echo.Utils.getVisibleColor(testElement)),
			"Test element has correct background color added via addCss() function");
		QUnit.ok(!Echo.Utils.addCSS(".echo-utils-tests {}", "utils-tests"),
			"Checking that addCSS() method returns false if previously added Id is used");

		var template =
			'<div class="echo-utils-tests-container">' +
				'<div class="echo-utils-tests-header">header</div>' +
				'<div class="echo-utils-tests-content">' +
					'<div class="echo-utils-tests-section1">content1</div>' +
					'<div class="echo-utils-tests-section2">content2</div>' +
					'<div class="echo-utils-tests-section3">content3</div>' +
				'</div>' +
			'</div>';

		var container = $(template);
		var get = function(name) {
			return $(".echo-utils-tests-" + name, container);
		};
		get("section1").css("background-color", "rgb(255, 0, 0)");
		QUnit.ok(/rgb\(255,\s*0,\s*0\)/.test(Echo.Utils.getVisibleColor(get("section1"))),
			"Checking getVisibleColor() method with element color");
		get("content").css("background-color", "rgb(0, 255, 0)");
		QUnit.ok(/rgb\(0,\s*255,\s*0\)/.test(Echo.Utils.getVisibleColor(get("section3"))),
			"Checking that getVisibleColor() method returns parent element color if element color is undefined");
		get("footer").css("background-color", "rgba(0, 0, 0, 0)");
		QUnit.equal(Echo.Utils.getVisibleColor(get("footer")), "transparent",
			"Checking getVisibleColor() method with transparent element color");

		var user_agents = {
			"android": "Android-x86-1.6-r2 - Mozilla/5.0 (Linux; U; Android 1.6; en-us; eeepc Build/Donut)" +
					"AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
			"iphone": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2 like Mac OS X; en_us) AppleWebKit/525.18.1",
			"opera-mini": "Opera/9.60 (J2ME/MIDP; Opera Mini/4.2.14912/812; U; ru) Presto/2.4.15",
			"ie": "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
			"firefox": "Mozilla/5.0 (X11; U; Linux i686; cs-CZ; rv:1.7.12) Gecko/20050929",
			"chrome": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-US) AppleWebKit/534.16" +
					"(KHTML, like Gecko) Chrome/10.0.648.205 Safari/534.16"
		};
		// test regexp for isMobileDevice() method to avoid redefining userAgent
		QUnit.ok(Echo.Utils.regexps.mobileUA.test(user_agents['android']),
			"Checking mobile device regexp for Android user agent");
		QUnit.ok(Echo.Utils.regexps.mobileUA.test(user_agents['iphone']),
			"Checking mobile device regexp for iPhone user agent");
		QUnit.ok(Echo.Utils.regexps.mobileUA.test(user_agents['opera-mini']),
			"Checking mobile device regexp for Opera-Mini user agent");
		QUnit.ok(!Echo.Utils.regexps.mobileUA.test(user_agents['ie']),
			"Checking mobile device regexp for IE user agent");
		QUnit.ok(!Echo.Utils.regexps.mobileUA.test(user_agents['firefox']),
			"Checking mobile device regexp for Firefox user agent");
		QUnit.ok(!Echo.Utils.regexps.mobileUA.test(user_agents['chrome']),
			"Checking mobile device regexp for Chrome user agent");
		QUnit.equal(
			Echo.Utils.isMobileDevice(),
			Echo.Utils.regexps.mobileUA.test(navigator.userAgent) ? true : false,
			"Checking isMobileDevice() method for real userAgent");
	}
};

suite.prototype.async = {};

suite.prototype.async.simpleImageTest = function(callback) {
	var url = Echo.Loader.getURL("third-party/bootstrap/img/glyphicons-halflings.png", false);
	var img = Echo.Utils.loadImage({
		"image": url,
		"onload": function() {
			QUnit.equal($(this).attr("src"), url, "Checking loadImage() method");
			callback();
		}
	});
	$("#qunit-fixture").append(img);
};

suite.prototype.async.fakeImageTest = function(callback) {
	var url = Echo.Loader.getURL("images/avatar-default.png", false);
	var img = Echo.Utils.loadImage({
		"image": "http://example.com/fake.jpg",
		"defaultImage": url,
		"onload": function() {
			QUnit.equal($(this).attr("src"), url, "Checking loadImage() method with fake image");
			callback();
		}
	});
	$("#qunit-fixture").append(img);
};

suite.prototype.async.errorImageTest = function(callback) {
	var url = Echo.Loader.getURL("images/avatar-default.png", false);
	var img = Echo.Utils.loadImage({
		"image": "http://example.com/fake.jpg",
		"onerror": function() {
			QUnit.ok(true, "Checking loadImage() method onerror handler call")
			callback();
		},
		"onload": function() {
			QUnit.ok(false, "Checking loadImage() method onerror handler call");
			callback();
		}
	});
	$("#qunit-fixture").append(img);
};

suite.prototype.async.emptyUrlImageTest = function(callback) {
	var url = Echo.Loader.getURL("images/avatar-default.png", false);
	var img = Echo.Utils.loadImage({
		"image": "",
		"defaultImage": url,
		"onerror": function() {
			QUnit.ok(false, "Checking loadImage() method with empty URL image");
			callback();
		},
		"onload": function() {
			QUnit.equal($(this).attr("src"), url, "Checking loadImage() method with empty URL image");
			callback();
		}
	});
	$("#qunit-fixture").append(img);
};

suite.prototype.async.nullUrlImageTest = function(callback) {
	var url = Echo.Loader.getURL("images/avatar-default.png", false);
	var img = Echo.Utils.loadImage({
		"image": null,
		"defaultImage": url,
		"onerror": function() {
			QUnit.ok(false, "Checking loadImage() method with null URL image");
			callback();
		},
		"onload": function() {
			QUnit.equal($(this).attr("src"), url, "Checking loadImage() method with null URL image");
			callback();
		}
	});
	$("#qunit-fixture").append(img);
};

var getTestFunctions = function() {
	var result = [];
	var functions = [
		function(cb) { result.push(1); cb(); },
		function(cb) { result.push(2); cb(); },
		function(cb) { result.push(3); cb(); },
		function(cb) { setTimeout(function () { result.push(4); cb(); }, 100); },
		function(cb) { result.push(5); cb(); }
	];
	return {"functions": functions, "result": result};
};

suite.prototype.async.sequentialCallTest = function(callback) {
	Echo.Utils.sequentialCall([], function() {
		QUnit.ok(true, "Checking if an empty list of actions doesn't produce error while executing the \"sequentialCall\" function");
	});

	var data = getTestFunctions();
	Echo.Utils.sequentialCall(data.functions, function() {
		QUnit.deepEqual(data.result, [1,2,3,4,5],
			"Checking \"sequentialCall\" function execution order");
		callback();
	});
};

suite.prototype.async.parallelCallTest = function(callback) {
	Echo.Utils.parallelCall([], function() {
		QUnit.ok(true, "Checking if an empty list of actions doesn't produce error while executing the \"parallelCall\" function");
	});

	var data = getTestFunctions();
	Echo.Utils.parallelCall(data.functions, function() {
		QUnit.deepEqual(data.result, [1,2,3,5,4],
			"Checking \"parallelCall\" function execution order");
		callback();
	});
};

suite.prototype.tests.TestAsyncMethods = {
	"config": {
		"async": true,
		"user": {"status": "anonymous"},
		"testTimeout": 10000
	},
	"check": function() {
		this.sequentialAsyncTests([
			"simpleImageTest",
			"fakeImageTest",
			"errorImageTest",
			"emptyUrlImageTest",
			"nullUrlImageTest",
			"sequentialCallTest",
			"parallelCallTest"
		], "async");
	}
};

})(Echo.jQuery);
