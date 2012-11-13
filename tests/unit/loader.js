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
		var debug = Echo.Loader.debug;
		function checkURLs(urls) {
			$.each(urls, function(i, spec) {
				QUnit.ok(spec.expect === Echo.Loader.getURL(spec.data), "Checking URL conversion: " + spec.data);
			});
		};
		var urls = {
			"plain": [{
				"data": "//cdn/echoenabled.com/image.png",
				"expect": "//cdn/echoenabled.com/image.png"
			}, {
				"data": "http://echoenabled.com/image.png",
				"expect": "http://echoenabled.com/image.png"
			}, {
				"data": "https://echoenabled.com/image.png",
				"expect": "https://echoenabled.com/image.png"
			}, {
				"data": "/web/image.png",
				"expect": "/web/image.png"
			}],
			"placeholders": [{
				"data": "{apps}/web/image.png",
				"expect": cdnBaseURL + "apps/web/image.png"
			}, {
				"data": "{sdk-assets}/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "{sdk}/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}],
			"placeholdersDev": [{
				"data": "{apps}/web/image.png",
				"expect": cdnBaseURL + "apps/web/image.png"
			}, {
				"data": "{sdk-assets}/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/web/image.png"
			}, {
				"data": "{sdk}/web/image.png",
				"expect": cdnBaseURL + "sdk/v" + version + "/dev/web/image.png"
			}]
		};
		checkURLs(urls.plain);
		Echo.Loader.debug = false;
		checkURLs(urls.placeholders);
		Echo.Loader.debug = true;
		checkURLs(urls.placeholdersDev);
		Echo.Loader.debug = debug;
	}
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
	Echo.Loader.download([{
		"url": "non-existing-folder/1.js"
	}, {
		"url": "non-existing-folder/2.js"
	}, {
		"url": "non-existing-folder/3.js"
	}], function() {
		QUnit.ok(true, "Checking if the callback is executed when non-existing scripts were passed as a function arguments");
		callback();
	}, {
		"errorTimeout": 1000 // 1 sec
	});
};

suite.prototype.cases.alreadyLoadedScripts = function(callback) {
	Echo.Loader.download([{
		"url": "{sdk}/events.js"
	}, {
		"url": "{sdk}/labels.js",
		"loaded": function() { return !!Echo.Labels; }
	}, {
		"url": "{sdk}/plugin.js"
	}], function() {
		QUnit.ok(true, "Checking if the callback is executed when the scripts loaded previously are loaded again");
		callback();
	});
};

suite.prototype.cases.equalUrlsPerSingleCall = function(callback) {
	Echo.Loader.download([
		{"url": "unit/loader/scripts/d1.js"},
		{"url": "unit/loader/scripts/d1.js"},
		{"url": "unit/loader/styles/1.css"},
		{"url": "unit/loader/styles/1.css"}
	], function() {
		QUnit.ok(!!Echo.Tests.Download.duplicate1, "Checking if the callback is executed when equal urls of js/css was loaded per single call");
		callback();
	});
};

suite.prototype.cases.equalUrlsPerSequentialCalls = function(callback) {
	Echo.Loader.download([
		{"url": "unit/loader/scripts/d2.js"},
		{"url": "unit/loader/styles/2.css"}
	], function() {
		Echo.Loader.download([
			{"url": "unit/loader/scripts/d2.js"},
			{"url": "unit/loader/styles/2.css"}
		], function() {
			QUnit.ok(!!Echo.Tests.Download.duplicate2, "Checking if the callback is executed when equal urls of js/css was loaded per sequential call");
			callback();
		});
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
	Echo.Loader.download([
		{"url": "unit/loader/scripts/d3.js"},
		{"url": "unit/loader/styles/3.css"}
	], commonCallback);

	Echo.Loader.download([
		{"url": "unit/loader/scripts/d3.js"},
		{"url": "unit/loader/styles/3.css"}
	], commonCallback);
};

suite.prototype.cases.validScriptsLoading = function(callback, count, description) {
	count = count || 5;
	var resources = [];
	var existingScriptsCount = 5;
	for (var i = 1; i <= count; i++) {
		resources.push({
			"url": "unit/loader/scripts/" + (count > existingScriptsCount ? "non-existing" : i) + ".js",
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
			"url": "unit/loader/scripts/1.js"
		});
	}
	Echo.Loader.download(resources, function() {
		QUnit.ok(true, "Checking the situation when the same script is loaded multiple times (checking if the callback is executed)");
		callback();
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
