(function(jQuery) {
var $ = jQuery;

"use strict";

Echo.Tests.Download = {};

var suite = Echo.Tests.Unit.Loader = function() {};

suite.prototype.info = {
	"className": "Echo.Loader",
	"functions": [
		"download"
	]
};

suite.prototype.tests = {};

suite.prototype.cases = {};

// checking resources downloading mechanisms

suite.prototype.tests.resourceDownloadingTests = {
	"config": {
		"testTimeout": 15000
	},
	"check": function() {
		this.sequentialAsyncTests([
			"invalidParameters",
			"nonExistingScripts",
			"alreadyLoadedScripts",
			"validScriptsLoading",
			"validAndInvalidScriptsMix",
			"loadingSameScriptMultipleTimes"
		], "cases");
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
	QUnit.stop();
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
			"url": "../events.js"
		}, {
			"url": "../labels.js",
			"loaded": function() { return !!Echo.Labels; }
		}, {
			"url": "../plugin.js"
		}],
		"callback": function() {
			QUnit.ok(true, "Checking if the callback is executed when the scripts loaded previously are loaded again");
			callback();
		}
	});
};

suite.prototype.cases.validScriptsLoading = function(callback, count, description) {
	count = count || 5
	var scripts = [];
	var existingScriptsCount = 5;
	for (var i = 1; i <= count; i++) {
		scripts.push({
			"url": "unit/loader/scripts/" + i + ".js",
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
	"check": function() {
		QUnit.ok(true, "Checking canvases initialization");
	}
};

})(Echo.jQuery);
