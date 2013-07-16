(function(jQuery) {
var $ = jQuery;

"use strict";

Echo.Tests.Download = {};

var suite = Echo.Tests.Unit.Loader = function() {};

suite.prototype.info = {
	"className": "Echo.Loader",
	"functions": [
		"init",
		"initApplication",
		"initEnvironment",
		"isDebug",
		"download",
		"override",
		"getURL"
	]
};

suite.prototype.tests = {};

suite.prototype.cases = {};

suite.prototype.initEnvironmentCases = {};

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
			"loadingSameScriptMultipleTimes",
			"fireSameScriptLoadingMultipleTimes"
		], "cases");
	}
};
// This code reproduces the issue described here:
// https://github.com/SlexAxton/yepnope.js/issues/113
//
// Test case: load a file via Echo.Loader.download and in its callback function
// load some more files, one synchronously and one asynchronously
// (or maybe more than one).
//
// Yepnope uses two-phase script loading mechanism: first preloads and then
// executes it. The issue appears when asynchronous script is pushed to the stack
// of scripts to be loaded and then synchronous script is preloaded but not
// executed yet. In this test case yepnope tries to execute synchronous script
// before it's fully preloaded.

suite.prototype.tests.raceConditionTests = {
	"config": {
		"async": true,
		"testTimeout": 15000
	},
	"check": function() {
		var base = Echo.Tests.baseURL + "tests/unit/loader/scripts";

		Echo.Loader.download([{"url": base + "/race-base.js"}], function() {
			// we override injectJs function to be sure that
			// preloading is finished before executing the script
			var injectJs = Echo.yepnope.injectJs;
			Echo.yepnope.injectJs = function () {
				var self = this;
				var arg = arguments;
				setTimeout(function() {
					injectJs.apply(self, arg);
				}, 5000);
			};

			Echo.Loader.download([{"url": base + "/race-first.js"}], function() {
				QUnit.ok(Echo.Variables.raceCondition.first,
					"Check if first callback will be executed after complete loading of first script");
			});

			// asynchronous loading of this script affects internal state of yepnope
			setTimeout(function() {
				Echo.Loader.download([{"url": base + "/race-second.js"}], function() {
					QUnit.ok(Echo.Variables.raceCondition.second,
						"Check if second callback will be executed after complete loading of second script");
					delete Echo.Variables.raceCondition;
					Echo.yepnope.injectJs = injectJs;
					QUnit.start();
				});
			}, 10);
		});
	}
};

suite.prototype.tests.urlConvertingTests = {
	"check": function() {
		var cdnBaseURL = Echo.Loader.config.cdnBaseURL;
		var version = Echo.Loader.version;
		var debug = Echo.Loader.debug;
		function checkURLs(urls) {
			$.each(urls, function(i, spec) {
				QUnit.ok(spec.expect === Echo.Loader.getURL(spec.data), "Checking URL conversion: '" + spec.data + "'");
			});
		}
		var urls = {
			"absolute": [{
				"data": "//cdn/echoenabled.com/image.png",
				"expect": "//cdn/echoenabled.com/image.png"
			}, {
				"data": "http://echoenabled.com/image.png",
				"expect": "http://echoenabled.com/image.png"
			}, {
				"data": "https://echoenabled.com/image.png",
				"expect": "https://echoenabled.com/image.png"
			}],
			"relative": [{
				"data": "/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "",
				"expect": cdnBaseURL + "sdk/v" + version
			}],
			"relativeDev": [{
				"data": "/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev/web/image.png"
			}, {
				"data": "web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev/web/image.png"
			}, {
				"data": "",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev"
			}]
		};
		checkURLs(urls.absolute);
		Echo.Loader.debug = false;
		QUnit.ok(!Echo.Loader.isDebug(), "Checking if debug mode is off");
		checkURLs(urls.relative);
		Echo.Loader.debug = true;
		QUnit.ok(Echo.Loader.isDebug(), "Checking if debug mode is on");
		checkURLs(urls.relativeDev);
		QUnit.equal(
			Echo.Loader.getURL("web/image.png", false),
			cdnBaseURL + "sdk/v" + version + "/web/image.png",
			"Checking URL conversion: /web/image.png, no dev version"
		);
		Echo.Loader.debug = debug;
	}
};

suite.prototype.tests.environmentInitializationTests = {
	"config": {
		"async": true,
		"testTimeout": 15000
	},
	"check": function() {
		this.sequentialAsyncTests([
			"emptyCallback",
			"environmentCheck"
		], "initEnvironmentCases");
	}
};

suite.prototype.initEnvironmentCases.emptyCallback = function(callback) {
	try {
		Echo.Loader.initEnvironment();
		QUnit.ok(true, "Checking if the 'callback' param is optional (no errors produced)");
	} catch(e) {
		QUnit.ok(false, "Calling 'initEnvironment' with no callback produced JS error...");
	}
	callback();
};

suite.prototype.initEnvironmentCases.environmentCheck = function(callback) {
	Echo.Loader.initEnvironment(function() {
		QUnit.ok(true, "Checking if the callback is being fired as soon as the environment is ready.");
		QUnit.ok(!!window.Backplane && !!Echo.Control && Echo.jQuery,
			"Checking if the callback is being fired as soon as the environment is ready.");
		var state = $.extend(true, {}, Echo.Loader.vars.state);
		Echo.Loader.initEnvironment();
		QUnit.deepEqual(state, Echo.Loader.vars.state,
			"Checking if the second 'initEnvironment' function call doesn't produce any downloading requests");
		callback();
	});
};

suite.prototype.cases.invalidParameters = function(callback) {
	var emptyArray = function(_callback) {
		Echo.Loader.download([], function() {
			QUnit.ok(true, "Checking if the callback is fired even if the list of the scripts to load is empty (empty array)");
			_callback();
		});
	};
	var scriptsParamMissing = function(_callback) {
		Echo.Loader.download(undefined, function() {
			QUnit.ok(true, "Checking if the callback is fired even if the scripts list is undefined");
			_callback();
		});
	};
	var callbackCheck = function(_callback) {
		try {
			Echo.Loader.download([]);
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
	var base = Echo.Tests.baseURL + "tests/unit/loader/";
	Echo.Loader.download([{
		"url": base + "non-existing-folder/1.js"
	}, {
		"url": base + "non-existing-folder/2.js"
	}, {
		"url": base + "non-existing-folder/3.js"
	}], function() {
		QUnit.ok(true, "Checking if the callback is executed when non-existing scripts were passed as a function arguments");
		callback();
	}, {
		"errorTimeout": 1000 // 1 sec
	});
};

suite.prototype.cases.alreadyLoadedScripts = function(callback) {
	Echo.Loader.download([{
		"url": "events.js"
	}, {
		"url": "labels.js",
		"loaded": function() { return !!Echo.Labels; }
	}, {
		"url": "plugin.js"
	}], function() {
		QUnit.ok(true, "Checking if the callback is executed when the scripts loaded previously are loaded again");
		callback();
	});
};

suite.prototype.cases.equalUrlsPerSingleCall = function(callback) {
	var base = Echo.Tests.baseURL + "tests/unit/loader/";
	Echo.Loader.download([
		{"url": base + "scripts/d1.js"},
		{"url": base + "scripts/d1.js"},
		{"url": base + "styles/1.css"},
		{"url": base + "styles/1.css"}
	], function() {
		QUnit.ok(!!Echo.Tests.Download.duplicate1, "Checking if the callback is executed when equal urls of js/css was loaded per single call");
		callback();
	});
};

suite.prototype.cases.equalUrlsPerSequentialCalls = function(callback) {
	var base = Echo.Tests.baseURL + "tests/unit/loader/";
	Echo.Loader.download([
		{"url": base + "scripts/d2.js"},
		{"url": base + "styles/2.css"}
	], function() {
		Echo.Loader.download([
			{"url": base + "scripts/d2.js"},
			{"url": base + "styles/2.css"}
		], function() {
			QUnit.ok(!!Echo.Tests.Download.duplicate2, "Checking if the callback is executed when equal urls of js/css was loaded per sequential call");
			callback();
		});
	});
};

suite.prototype.cases.equalUrlsPerParallelCalls = function(callback) {
	var base = Echo.Tests.baseURL + "tests/unit/loader/";
	var k = 2;
	var commonCallback = function() {
		if (!--k) {
			QUnit.ok(!!Echo.Tests.Download.duplicate3, "Checking if the callback is executed when equal urls of js/css was loaded per parallel call");
			callback();
		}
	};
	Echo.Loader.download([
		{"url": base + "scripts/d3.js"},
		{"url": base + "styles/3.css"}
	], commonCallback);
	Echo.Loader.download([
		{"url": base + "scripts/d3.js"},
		{"url": base + "styles/3.css"}
	], commonCallback);
};

suite.prototype.cases.validScriptsLoading = function(callback, count, description) {
	count = count || 5;
	var resources = [];
	var existingScriptsCount = 5;
	for (var i = 1; i <= count; i++) {
		resources.push({
			"url": Echo.Tests.baseURL + "tests/unit/loader/scripts/" +
				(count > existingScriptsCount ? "non-existing" : i) + ".js",
			"loaded": function() { return !!Echo.Tests.Download["object" + i]; }
		});
	}
	Echo.Loader.download(resources, function() {
		var success = true;
		// check only existing scripts
		for (var i = 1; i <= existingScriptsCount; i++) {
			if (success) {
				success = !!Echo.Tests.Download["object" + i];
			}
		}
		QUnit.ok(success, description || "Checking if all the test scripts were loaded successfully");
		callback();
	}, {
		"errorTimeout": 1000 // 1 sec
	});
};

suite.prototype.cases.validAndInvalidScriptsMix = function(callback) {
	this.cases.validScriptsLoading(callback, 7, "Checking if the mix of valid and invalid scripts is handled by the loader correctly");
};

suite.prototype.cases.loadingSameScriptMultipleTimes = function(callback) {
	var resources = [];
	for (var i = 1; i <= 5; i++) {
		resources.push({
			"url": Echo.Tests.baseURL + "tests/unit/loader/scripts/1.js"
		});
	}
	Echo.Loader.download(resources, function() {
		QUnit.ok(true, "Checking the situation when the same script is loaded multiple times (checking if the callback is executed)");
		callback();
	});
};

suite.prototype.cases.fireSameScriptLoadingMultipleTimes = function(callback) {
	var resources = [{
		"url": Echo.Tests.baseURL + "tests/unit/loader/scripts/check-multiple-downloads.js"
	}];
	var count = 0;
	var check = function() {
		return Echo.Control.isDefined("Echo.Tests.Controls.TestMultipleDownloads");
	};
	var maybeExecuteCallback = function() {
		if (++count === 3) callback();
	};
	Echo.Loader.download(resources, function() {
		QUnit.ok(check(), "Checking if the control is defined after the first download");
		maybeExecuteCallback();
	});
	Echo.Loader.download(resources, function() {
		QUnit.ok(check(), "Checking if the control is defined after the second (parallel) download");
		maybeExecuteCallback();
	});
	Echo.Loader.download(resources, function() {
		Echo.Loader.download(resources, function() {
			Echo.Loader.download(resources, function() {
				QUnit.ok(check(),
					"Checking if the 'download' functions can be executed within the previous 'download' function calls");
				maybeExecuteCallback();
			});
		});
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
			"app-initialization",
			"foreign-app-initialization",
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

/*
 * TODO fix relative URLs in tests/unit/loader/canvases/test.canvas.007.json
suite.prototype.tests.canvasesScriptsLoadingTest = {
	"config": {
		"async": true,
		"testTimeout": 5000
	},
	"check": function() {
		var self = this;
		var debug = Echo.Loader.debug;

		$("#qunit-fixture").append("<div class=\"echo-canvas\" data-canvas-appkey=\"echo.jssdk.tests.aboutecho.com\" data-canvas-id=\"js-sdk-tests/test.canvas.007\"></div>");

		Echo.Loader.override("test.canvas.007", "test.apps.scripts", {"ready": function() {
			this.destroy();
			QUnit.ok(Echo.Variables.TestControl === "development", "Check if development version of application script was loaded");

			Echo.Loader.debug = false;
			delete window.Echo.Tests.Controls.TestControl;
			$("#qunit-fixture").empty().append("<div class=\"echo-canvas\" data-canvas-appkey=\"echo.jssdk.tests.aboutecho.com\" data-canvas-id=\"js-sdk-tests/test.canvas.007\"></div>");
			Echo.Loader.override("test.canvas.007", "test.apps.scripts", {"ready": function() {
				this.destroy();
				QUnit.ok(Echo.Variables.TestControl === "production", "Check if production version of application script was loaded");

				Echo.Loader.debug = debug;
				delete window.Echo.Tests.Controls.TestControl;

				QUnit.start();
			}});
			Echo.Loader.init({ "target": $("#qunit-fixture") });
		}});
		Echo.Loader.init({ "target": $("#qunit-fixture") });
	}
};
*/

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
