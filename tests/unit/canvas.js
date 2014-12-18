(function($) {
"use strict";

Echo.Tests.module("Echo.Canvas", {
	"meta": {
		"className": "Echo.Canvas",
		"functions": ["updateLayout"]
	}
});

var getCommonWorkflowTest = function(appsInitialization) {
	return function() {
		var target = $("#qunit-fixture");
		target.append('<div id="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001#some-id_001" data-canvas-appsInitialization="' + appsInitialization + '"></div>');
		var deferred = $.map(["Stream", "Submit"], function(name) {
			var def = $.Deferred();
			Echo.Events.subscribe({
				"topic": "Echo.StreamServer.Controls." + name + ".onReady",
				"once": true,
				"handler": function() {
					def.resolve();
				}
			});
			return def.promise();
		});
		Echo.Loader.canvases.push(new Echo.Canvas({
			"target": $("#echo-canvas"),
			"ready": function() {
				$.when.apply($, deferred).then($.proxy(function() {
					QUnit.ok(true, "Check that component is initialized");
					Echo.Loader.canvases.pop();
					QUnit.ok(this.apps["stream"], "Check that Stream is initialized");
					QUnit.ok(this.apps["submit"], "Check thet Submit is initialized");
					QUnit.ok(
						this.config.get("target").is(".echo-canvas-js-sdk-tests-test-canvas-001"),
						"Check that target is marked with CSS class based on canvas ID"
					);
					QUnit.ok(
						this.config.get("target").is(".echo-canvas-js-sdk-tests-test-canvas-001-some-id-001"),
						"Check that target is marked with CSS class based on canvas ID and additional ID separated with #"
					);
					QUnit.ok(
						$.map(this.apps, function(app) {
							return app.instance.config.get("canvasId") === "js-sdk-tests/test-canvas-001#some-id_001" ? app : undefined;
						}).length === 2,
						"Check that all apps received the canvas ID"
					);
					QUnit.ok(
						$.map(this.apps, function(app) {
							return !!~app.instance.config.get("target").attr("class").indexOf("echo-canvas-appId-") ? app : undefined;
						}).length === 2,
						"Check that all apps marked with appId"
					);
					QUnit.ok(
						this.config.get("target").data("echo-canvas-initialized"),
						"Check that target marked as initialized canvas"
					);
					var apps = $.extend(true, {}, this.apps);
					this.destroy();
					QUnit.ok(
						!this.config.get("target").data("echo-canvas-initialized"),
						"Check that target is not marked as initialized canvas"
					);
					QUnit.ok(
						$.map(apps, function(app) {
							return $.isEmptyObject(app.instance.subscriptionIDs) ? app : undefined;
						}).length === 2,
						"Check all apps unsubscribed from all events after destroy canvas"
					);
					QUnit.start();
				}, this));
			}
		}));
	};
};

Echo.Tests.asyncTest("common workflow (async apps initialization)", getCommonWorkflowTest("async"));

Echo.Tests.asyncTest("common workflow (sync apps initialization)", getCommonWorkflowTest("sync"));

(function() {

var TestApp = Echo.Control.manifest("TestApp");

TestApp.init = function() { this.ready(); };

Echo.Control.create(TestApp);

var LongInitializingApp = Echo.Control.manifest("LongInitializingApp");

LongInitializingApp.init = function() {
	var self = this;
	setTimeout(function() {
		self.ready();
	}, 1000);
};

Echo.Control.create(LongInitializingApp);

})();

Echo.Tests.asyncTest("apps initialization (corner cases)", function() {
	var layout = [
		{"row": 1, "col": 1, "size_x": 1, "app": "TestApp"},
		{"row": 2, "col": 1, "size_x": 1, "app": "LongInitializingApp"},
		{"row": 3, "col": 1, "size_x": 1, "app": "LongInitializingApp"}
	];
	var init = function(type, timeout) {
		var deferred = $.Deferred();
		new Echo.Canvas({
			"target": $("<div>").appendTo("#qunit-fixture"),
			"appsInitialization": type,
			"appInitializationTimeout": timeout || 5000,
			"data": {
				"apps": [
					{"component": "TestApp", "id": "TestApp"},
					{"component": "LongInitializingApp", "id": "LongInitializingApp"},
					{"component": "LongInitializingApp", "id": "LongInitializingApp"}
				],
				"layout": layout
			},
			"ready": deferred.resolve.bind(null, (new Date()).getTime())
		});
		return deferred.promise();
	};

	init("async").done(function(time) {
		QUnit.ok((new Date()).getTime() - time < 2000, "Check that async apps initialization works as expected (simultenously)");
	}).done(function() {
		init("sync").done(function(time) {
			QUnit.ok((new Date()).getTime() - time >= 2000, "Check that async apps initialization works as expected (one-by-one)");
			init("sync", 500).done(function(time) {
				QUnit.ok((new Date()).getTime() - time < 1500, "Check that async apps initialization works as expected in case of long running app initialization");
				QUnit.start();
			});
		});
	});
});

Echo.Tests.asyncTest("select app script url", function() {
	var target = $("#qunit-fixture");
	target.append($('<div id="echo-canvas" data-canvas-id="js-sdk-tests/test-canvas-001"></div>'));
	Echo.Loader.canvases.push(new Echo.Canvas({
		"target": $("#echo-canvas"),
		"ready": function() {
			Echo.Loader.canvases.pop();
			var debug = Echo.Loader.debug;
			QUnit.strictEqual(this._getAppScriptURL({}), undefined, "If incoming object is empty, no url is returned");
			QUnit.strictEqual(this._getAppScriptURL({"script": "some-url"}), "some-url", "If \"scripts\" field is omitted, then \"script\" field will be used");
			Echo.Loader.debug = true;
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"prod": "some-prod-url"
				}
			}), "some-prod-url", "If \"scripts\" field provides only \"prod\" URL, then it will be used for development too");
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url",
					"prod": "some-prod-url"
				}
			}), "some-dev-url", "Returns \"dev\" URL in the \"dev\" environment");
			Echo.Loader.debug = false;
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url"
				}
			}), "some-dev-url", "If \"scripts\" field provides only \"dev\" URL, then it will be used for production too");
			QUnit.strictEqual(this._getAppScriptURL({
				"script": "some-url",
				"scripts": {
					"dev": "some-dev-url",
					"prod": "some-prod-url"
				}
			}), "some-prod-url", "Returns \"prod\" URL in the \"prod\" environment");
			if (window.location.protocol === "https:") {
				QUnit.strictEqual(this._getAppScriptURL({
					"scripts": {
						"prod": {
							"secure": "some-secure-url",
							"regular": "some-regular-url"
						}
					}
				}), "some-secure-url", "For the secure zone it returns a secure URL");
			} else {
				QUnit.strictEqual(this._getAppScriptURL({
					"scripts": {
						"prod": {
							"secure": "some-secure-url",
							"regular": "some-regular-url"
						}
					}
				}), "some-regular-url", "For the regular zone it returns a regular URL");
			}
			Echo.Loader.debug = debug;
			this.destroy();
			QUnit.start();
		}
	}));
});

Echo.Tests.test("canvas contract", function() {
	var target = $("<div>").data("canvas-id", "js-sdk-test").appendTo("#qunit-fixture");

	window.CanvasAdapter = function(config) {
		QUnit.equal(config.id, 256, "Check if canvas adapter was initialized with valid custom param in config");
		QUnit.ok(config.target instanceof Echo.jQuery, "Check if canvas adapter was initialized with valid target");
		QUnit.equal(config.canvasId, "js-sdk-test", "Check if canvas adapter was initialized with valid canvasId");
	};

	var canvas = new Echo.Canvas({
		"target": target,
		"data": {
			"apps": [{
				"component": "CanvasAdapter",
				"config": {"id": 256}
			}]
		}
	});
	canvas.destroy();
	try {
		delete window.CanvasAdapter;
	} catch(e) {
		// fallback for IE8
		window.CanvasAdapter = null;
	}
});

Echo.Tests.test("canvas destroy", function() {
	window.TestCanvases = {
		"destroyIsAFunction": function(config) {
			return {
				"destroy": $.noop
			};
		},
		"destroyIsUndefined": function(config) {
			return {};
		},
		"destroyIsNotAFunction": function(config) {
			return {
				"destroy": "destroy"
			};
		}
	};

	$.each(window.TestCanvases, function(component) {
		var result;
		var canvas = new Echo.Canvas({
			"target": $("#qunit-fixture"),
			"data": {
				"apps": [{
					"component": "TestCanvases." + component
				}]
			}
		});
		try {
			canvas.destroy();
			result = true;
		} catch(e) {
			result = false;
		}
		QUnit.ok(result, "Check if canvas adapter was destroyed successfully (" +
			component.replace(/([A-Z])/g, " $1").toLowerCase() + ")");
	});
	try {
		delete window.TestCanvases;
	} catch(e) {
		// fallback for IE8
		window.TestCanvases = null;
	}
});

var SampleApp = function(config) {
	var content = $("<div>").attr("data-sample-app-id", config.appId);
	config.target.append(content);
	this.config = config;
	SampleApp.apps[config.appId] = SampleApp.apps[config.appId] || {"initialized": 0, "destroyed": 0};
	SampleApp.apps[config.appId].initialized += 1;
};
SampleApp.apps = {};

SampleApp.prototype.destroy = function() {
	SampleApp.apps[this.config.appId].destroyed += 1;
};

Echo.Variables.SampleApp = SampleApp;

Echo.Tests.asyncTest("Canvas initialization without layout", function() {
	var target = $("<div>");
	new Echo.Canvas({
		"target": target,
		"data": {
			"apps": [{
				"component": "Echo.Variables.SampleApp",
				"config": {
					"appId": "1"
				}
			}, {
				"component": "Echo.Variables.SampleApp",
				"config": {
					"appId": "2"
				}
			}]
		},
		"ready": function() {
			QUnit.ok(target.find("[data-sample-app-id='1']").length, "First app initialized");
			QUnit.ok(target.find("[data-sample-app-id='2']").length, "Second app initialized");
			this.destroy();
			QUnit.start();
		}
	});
});

Echo.Tests.asyncTest("Canvas layout #1", function() {
	if (screen.width < 400) {
		QUnit.ok(true, "Screen width < 400, skip test");
		QUnit.start();
		return;
	}
	new Echo.Canvas({
		"target": $("<div>").css("width", "100px").appendTo("#qunit-fixture"),
		"data": {
			"apps": [],
			"layout": [
				{"row": 2, "col": 1, "size_x": 4}, //  --------- ---
				{"row": 1, "col": 1, "size_x": 3}, // |         |   |
				{"row": 1, "col": 4, "size_x": 1}  //  --------- ---
				                                   // |             |
				                                   //  -------------
			]
		},
		"ready": function() {
			var rows = this.view.get("container").children("[data-type='row']");
			QUnit.equal(rows.length, 2, "There are two rows");

			var firstRow = rows.eq(0).children("[data-type='column']");
			QUnit.equal(firstRow.length, 2, "[row 1] contains 2 columns");
			QUnit.equal(firstRow.eq(0).css("width"), "75px", "[row 1] [col 1] 75% width");
			QUnit.equal(firstRow.eq(1).css("width"), "25px", "[row 1] [col 2] 25% width");

			var secondRow = rows.eq(1).children("[data-type='column']");
			QUnit.equal(secondRow.length, 1, "[row 2] contains 1 col");
			QUnit.equal(secondRow.eq(0).css("width"), "100px", "[row 2] [col 1] 100% width");

			QUnit.start();
			this.destroy();
		}
	});
});

Echo.Tests.asyncTest("Canvas layout #2", function() {
	if (screen.width < 400) {
		QUnit.ok(true, "Screen width < 400, skip test");
		QUnit.start();
		return;
	}
	new Echo.Canvas({
		"target": $("<div>").css("width", "100px").appendTo("#qunit-fixture"),
		"data": {
			"apps": $.map(new Array(8), function(_, id) {
				return {"id": "" + (id + 1), "component": "Echo.Variables.SampleApp", "config": {"appId": id + 1}};
			}),
			"layout": [
				{"row": 1, "col": 1, "size_x": 1, "app": "1"}, //  ---     -------
				{"row": 1, "col": 3, "size_x": 2, "app": "2"}, // | 1 |   |   2   |
				{"row": 2, "col": 1, "size_x": 1, "app": "3"}, //  ---     -------
				{"row": 2, "col": 3, "size_x": 1, "app": "4"}, // | 3 |   | 4 |
				{"row": 3, "col": 1, "size_x": 2, "app": "5"}, //  ------- -------
				{"row": 3, "col": 3, "size_x": 2, "app": "6"}  // |   5   |   6   |
				                                               //  ------- -------
			]
		},
		"ready": function() {
			var rows = this.view.get("container").children("[data-type='row']");

			QUnit.equal(rows.length, 3, "There are three rows");

			// first row
			var firstRow = rows.eq(0).children("[data-type='column']");
			QUnit.equal(firstRow.length, 3, "[row 1] contains 3 columns");
			QUnit.equal(firstRow.eq(0).css("width"), "25px", "[row 1] [col 1] 25% width");
			QUnit.ok(firstRow.eq(0).find("[data-sample-app-id='1']").length, "[row 1] [col 1] contains app #1");
			QUnit.ok(firstRow.eq(0).find("[data-sample-app-id='3']").length, "[row 1] [col 1] contains app #3");
			QUnit.ok(firstRow.eq(1).is(":empty"), "[row 1] [col 2] empty");
			QUnit.equal(firstRow.eq(1).css("width"), "25px", "[row 1] [col 2] 25% width");
			QUnit.ok(firstRow.eq(2).find("[data-sample-app-id='2']").length, "[row 1] [col 3] contains app #2");
			QUnit.equal(firstRow.eq(2).css("width"), "50px", "[row 1] [col 3] 50% width");

			// second row
			var secondRow = rows.eq(1).children("[data-type='column']");
			QUnit.equal(secondRow.length, 3, "[row 2] contains 3 cols");
			QUnit.ok(secondRow.eq(0).is(":empty"), "[row 2] [col 1] empty");
			QUnit.equal(secondRow.eq(0).css("width"), "50px", "[row 2] [col 1] 50% width");
			QUnit.ok(secondRow.eq(1).find("[data-sample-app-id='4']").length, "[row 2] [col 2] contains app #4");
			QUnit.equal(firstRow.eq(1).css("width"), "25px", "[row 2] [col 2] 25% width");
			QUnit.ok(secondRow.eq(2).is(":empty"), "[row 2] [col 3] empty");
			QUnit.equal(secondRow.eq(2).css("width"), "25px", "[row 2] [col 3] 25% width");

			// third row
			var thirdRow = rows.eq(2).children("[data-type='column']");
			QUnit.equal(thirdRow.length, 2, "[row 3] contains 2 cols");
			QUnit.ok(thirdRow.eq(0).find("[data-sample-app-id='5']").length, "[row 3] [col 1] contains app #5");
			QUnit.equal(thirdRow.eq(0).css("width"), "50px", "[row 3] [col 1] 50% width");
			QUnit.ok(thirdRow.eq(1).find("[data-sample-app-id='6']").length, "[row 3] [col 2] contains app #6");
			QUnit.equal(thirdRow.eq(1).css("width"), "50px", "[row 2] [col 2] 50% width");

			var appsWithoutLayout = this.view.get("container").children(".echo-canvas-appContainer");
			QUnit.equal(appsWithoutLayout.length, 2, "2 apps are declared in 'apps' but not mentioned in 'layout'");
			QUnit.ok(appsWithoutLayout.eq(0).find("[data-sample-app-id='7']").length, "App #7 added at the bottom");
			QUnit.ok(appsWithoutLayout.eq(1).find("[data-sample-app-id='8']").length, "App #8 added at the bottom");

			QUnit.start();
			this.destroy();
		}
	});
});

// TODO test canvas layout with small window width (< 400px)

Echo.Tests.asyncTest("updateLayout method", function() {
	var apps = $.map(new Array(3), function(_, id) {
		var appId = ["first", "second", "third"][id];
		return {"id": appId, "component": "Echo.Variables.SampleApp", "config": {"appId": appId}};
	});
	var layout = [
		{"row": 2, "col": 1, "size_x": 4, "app": "first"},  //  --------- ---
		{"row": 1, "col": 1, "size_x": 3, "app": "second"}, // |         |   |
		{"row": 1, "col": 4, "size_x": 1, "app": "third"}   //  --------- ---
		                                                    // |             |
		                                                    //  -------------
	];
	new Echo.Canvas({
		"target": $("<div>").appendTo("#qunit-fixture"),
		"data": {
			"apps": apps,
			"layout": layout
		},
		"ready": function() {
			var canvas = this;
			Echo.Utils.sequentialCall([
				function(callback) {
					$.map(["first", "second", "third"], function(appId) {
						QUnit.equal(SampleApp.apps[appId].initialized, 1, appId + " app initialized once.");
					});
					QUnit.equal(
						canvas.config.get("target").find(".echo-canvas-container").children(".echo-canvas-row").length,
						2, "There are two rows in canvas");
					callback();
				},
				function(callback) {
					layout = $.extend(true, [], layout);
					layout[2]["row"] = 3; // move one of app from first column to third. So, we have three row.
					canvas.updateLayout(apps, layout).then(function() {
						QUnit.ok(true, "updateLayout method callback called");
						QUnit.equal(
							canvas.config.get("target").find(".echo-canvas-container").children(".echo-canvas-row").length,
							3, "Layout changed (there are three rows now)"
						);
						$.map(["first", "second", "third"], function(appId) {
							QUnit.equal(SampleApp.apps[appId].initialized, 1, appId + " hasn't been re-initialized.");
						});
						callback();
					});
				},
				function(callback) {
					apps = $.extend(true, [], apps);
					apps[1].config["newKey"] = "newValue"; // add some key for second app config, so it should be re-initialized
					canvas.updateLayout(apps, layout).then(function() {
						QUnit.ok(true, "updateLayout method callback called");
						QUnit.equal(SampleApp.apps["first"].initialized, 1, "first app hasn't been re-initialized.");
						QUnit.equal(SampleApp.apps["second"].destroyed, 1, "second app has been destroyed.");
						QUnit.equal(SampleApp.apps["second"].initialized, 2, "second app has been re-initialized.");
						QUnit.equal(SampleApp.apps["third"].initialized, 1, "third app hasn't been re-initialized.");
						callback();
					});
				},
				function(callback) {
					apps = $.extend(true, [], apps);
					apps.splice(2, 1); // remove third app, it should be destroyed
					canvas.updateLayout(apps, layout).then(function() {
						QUnit.ok(true, "updateLayout method callback called");
						QUnit.equal(SampleApp.apps["first"].destroyed, 0, "first app hasn't been destroyed");
						QUnit.equal(SampleApp.apps["first"].initialized, 1, "first app hasn't been re-initialized.");

						QUnit.equal(SampleApp.apps["second"].destroyed, 1, "second app hasn't been destroyed");
						QUnit.equal(SampleApp.apps["second"].initialized, 2, "second app hasn't been re-initialized.");

						QUnit.equal(SampleApp.apps["third"].destroyed, 1, "third app has been destroyed.");
						QUnit.equal(SampleApp.apps["third"].initialized, 1, "third app hasn't been re-initialized.");
						callback();
					});
				},
				function(callback) {
					// app list is empty, all the apps should be destroyed
					canvas.updateLayout([], layout).then(function() {
						QUnit.equal(SampleApp.apps["first"].destroyed, 1, "first app has been destroyed");
						QUnit.equal(SampleApp.apps["first"].initialized, 1, "first app hasn't been re-initialized.");

						QUnit.equal(SampleApp.apps["second"].destroyed, 2, "second app has been destroyed");
						QUnit.equal(SampleApp.apps["second"].initialized, 2, "second app hasn't been re-initialized.");

						QUnit.equal(SampleApp.apps["third"].initialized, 1, "third app hasn't been re-initialized.");
						callback();

					});
				}
			], function() {
					QUnit.start();
					canvas.destroy();
			});
		}
	});
});

})(Echo.jQuery);
