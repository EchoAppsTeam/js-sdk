(function(jQuery) {
var $ = jQuery;

"use strict";

Echo.Tests.Download = {};

var suite = Echo.Tests.Unit.Loader = function() {};

suite.prototype.info = {
	"className": "Echo.Loader",
	"functions": [
		"init",
		"download",
		"override",
		"getURL"
	]
};

suite.prototype.tests = {};

suite.prototype.cases = {};

// checking resources downloading mechanisms

suite.prototype.tests.resourceDownloadingTests = {
	"config": {
		"async": true,
		"testTimeout": 15000
	},
	"check": function() {
		this.sequentialAsyncTests([
			"equalUrlsPerSingleCall",
			"equalUrlsPerSequentialCalls",
			"equalUrlsPerParallelCalls",
			"invalidParameters",
			"nonExistingScripts",
			"alreadyLoadedScripts",
			"validScriptsLoading",
			"validAndInvalidScriptsMix",
			"loadingSameScriptMultipleTimes"
		], "cases");
	}
};

suite.prototype.tests.urlConvertingTests = {
	"check": function() {
		var cdnBaseURL = Echo.Loader.config.cdnBaseURL;
		var version = Echo.Loader.version;
		var urls = {
			"absolute": [
				"//cdn/echoenabled.com/image.png",
				"http://echoenabled.com/image.png",
				"https://echoenabled.com/image.png"
			],
			"relative": [
				"/web/image.png",
				"web/image.png",
				"sdk"
			],
			"sdk": [
				"{sdk}/web/image.png",
				"{sdk}web/image.png",
				"{sdk}"
			],
			"apps": [
				"{apps}/web/image.png",
				"{apps}/web/image.png",
				"{apps}"
			]
		};
		$.each(urls, function(key, val) {
			var checked = true;
			$.map(val, function(url) {
				if ((key === "absolute" || key === "relative") && url !== Echo.Loader.getURL(url) ||
					key === "apps" && url.replace("{apps}", cdnBaseURL + "apps") !== Echo.Loader.getURL(url) ||
					key === "sdk" && url.replace("{sdk}", cdnBaseURL + "sdk/v" + version) !== Echo.Loader.getURL(url)
				) {
					checked = false;
				}
			});
			QUnit.ok(checked, "Checking if " + key + " URL has been correctly converted");
		});
	}
};

suite.prototype.cases.invalidParameters = function(callback) {
	var emptyArray = function(_callback) {
		Echo.Loader.download({
			"scripts": [],
			"callback": function() {
				QUnit.ok(true, "Checking if the callback is fired even if the list of the scripts to load is empty (empty array)");
				_callback();
			}
		});
	};
	var scriptsParamMissing = function(_callback) {
		Echo.Loader.download({
			"callback": function() {
				QUnit.ok(true, "Checking if the callback is fired even if the scripts list is undefined");
				_callback();
			}
		});
	};
	var callbackCheck = function(_callback) {
		try {
			Echo.Loader.download({"scripts": []});
			QUnit.ok(true, "Checking if the callback is an optional parameter (no JS error expected)");
			_callback();
		} catch(e) {
			QUnit.ok(false, "Received JS error when trying to launch \"download\" function without a \"callback\" function");
			_callback();
		}
	};
	Echo.Utils.sequentialCall([
		emptyArray,
		scriptsParamMissing,
		callbackCheck
	], callback);
};

suite.prototype.cases.nonExistingScripts = function(callback) {
	Echo.Loader.download({
		"errorTimeout": 1000, // 1 sec
		"scripts": [{
			"url": "non-existing-folder/1.js"
		}, {
			"url": "non-existing-folder/2.js"
		}, {
			"url": "non-existing-folder/3.js"
		}],
		"callback": function() {
			QUnit.ok(true, "Checking if the callback is executed when non-existing scripts were passed as a function arguments");
			callback();
		}
	});
};

suite.prototype.cases.alreadyLoadedScripts = function(callback) {
	Echo.Loader.download({
		"scripts": [{
			"url": "{sdk}/events.js"
		}, {
			"url": "{sdk}/labels.js",
			"loaded": function() { return !!Echo.Labels; }
		}, {
			"url": "{sdk}/plugin.js"
		}],
		"callback": function() {
			QUnit.ok(true, "Checking if the callback is executed when the scripts loaded previously are loaded again");
			callback();
		}
	});
};

suite.prototype.cases.equalUrlsPerSingleCall = function(callback) {
	Echo.Loader.download({
		"scripts": [
			{"url": "unit/loader/scripts/d1.js"},
			{"url": "unit/loader/scripts/d1.js"},
			{"url": "unit/loader/styles/1.css"},
			{"url": "unit/loader/styles/1.css"}
		],
		"callback": function() {
			QUnit.ok(!!Echo.Tests.Download.duplicate1, "Checking if the callback is executed when equal urls of js/css was loaded per single call");
			callback();
		}
	});
};

suite.prototype.cases.equalUrlsPerSequentialCalls = function(callback) {
	Echo.Loader.download({
		"scripts": [
			{"url": "unit/loader/scripts/d2.js"},
			{"url": "unit/loader/styles/2.css"}
		],
		"callback": function() {
			Echo.Loader.download({
				"scripts": [
					{"url": "unit/loader/scripts/d2.js"},
					{"url": "unit/loader/styles/2.css"}
				],
				"callback": function() {
					QUnit.ok(!!Echo.Tests.Download.duplicate2, "Checking if the callback is executed when equal urls of js/css was loaded per sequential call");
					callback();
				}
			});
		}
	});
};

suite.prototype.cases.equalUrlsPerParallelCalls = function(callback) {
	var k = 2;
	var commonCallback = function() {
		if(!--k) {
			QUnit.ok(!!Echo.Tests.Download.duplicate3, "Checking if the callback is executed when equal urls of js/css was loaded per parallel call");
			callback();
		}
	};
	Echo.Loader.download({
		"scripts": [
			{"url": "unit/loader/scripts/d3.js"},
			{"url": "unit/loader/styles/3.css"}
		],
		"callback": function() {
			commonCallback();
		}
	});

	Echo.Loader.download({
		"scripts": [
			{"url": "unit/loader/scripts/d3.js"},
			{"url": "unit/loader/styles/3.css"}
		],
		"callback": function() {
			commonCallback();
		}
	});
};

suite.prototype.cases.validScriptsLoading = function(callback, count, description) {
	count = count || 5;
	var scripts = [];
	var existingScriptsCount = 5;
	for (var i = 1; i <= count; i++) {
		scripts.push({
			"url": "unit/loader/scripts/" + (count > existingScriptsCount ? "non-existing" : i) + ".js",
			"loaded": function() { return !!Echo.Tests.Download["object" + i]; }
		});
	}
 	Echo.Loader.download({
		"errorTimeout": 1000, // 1 sec
		"scripts": scripts,
		"callback": function() {
			var success = true;
			// check only existing scripts
			for (var i = 1; i <= existingScriptsCount; i++) {
				if (success) {
					success = !!Echo.Tests.Download["object" + i];
				}
			}
			QUnit.ok(success, description || "Checking if all the test scripts were loaded successfully");
			callback();
		}
	});
};

suite.prototype.cases.validAndInvalidScriptsMix = function(callback) {
	this.cases.validScriptsLoading(callback, 7, "Checking if the mix of valid and invalid scripts is handled by the loader correctly");
};

suite.prototype.cases.loadingSameScriptMultipleTimes = function(callback) {
	var scripts = [];
	for (var i = 1; i <= 5; i++) {
		scripts.push({
			"url": "unit/loader/scripts/1.js"
		});
	}
 	Echo.Loader.download({
		"scripts": scripts,
		"callback": function() {
			QUnit.ok(true, "Checking the situation when the same script is loaded multiple times (checking if the callback is executed)");
			callback();
		}
	});
};

// checking canvases initialization scenarios

suite.prototype.tests.canvasesInitializationTests = {
	"config": {
		"async": true,
		"testTimeout": 15000
	},
	"check": function() {
		var self = this;
		this.sequentialAsyncTests($.map([
			"simple-valid-canvas",
			"valid-and-invalid-canvases",
			"double-initialization-prevention",
			"different-initialization-schemas",
			"multiple-apps-canvas",
			"app-config-overrides"
		], function(name) {
			return self.loaderIframeTest(name);
		}));
	}
};

// dynamic interface with utils functions

suite.prototype.loaderIframeTest = function(name) {
	return function(callback) {
		var iframe = $('<iframe name="' + name + '" style="width:0px; height: 0px; border: 0px; visibility:hidden; display:none;"></iframe>');
		$(document.body).append(iframe);
		iframe.on("load", function() {
			iframe.get(0).contentWindow.test(callback);
		});
		iframe.attr("src", "unit/loader/pages/" + name + ".html");
	};
};

// static interface with utils functions (to be accessible within nested iframes)

suite.eventsCountCheck = function(events) {
	var success = true;
	$.each(events, function(id, event) {
		if (event[0] != event[1]) {
			success = false;
			return false; // break
		}
	});
	return success;
};

})(Echo.jQuery);
