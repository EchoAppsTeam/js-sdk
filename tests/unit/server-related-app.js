(function(jQuery) {

Echo.Tests.module("Echo.ServerRelatedApp", {
	"meta": {
		"className": "Echo.ServerRelatedApp",
		"functions": [
			"showMessage",
			"showError",
			"checkAppKey"
		]
	}
});

Echo.Tests.asyncTest("showMessage()", function() {
	QUnit.expect(3);
	run(function(callback) {
		initTestApp({
			"data": {
				"key1": "key1 value",
				"key2": "key2 value",
				"key3": {
					"key3nested": "nested value for key 3"
				}
			},
			"ready": function() {
				var target = jQuery('<div></div>');
				var data = {
					"type": "error",
					"message": "An error occured during the request...",
					"layout": "compact",
					"target": target
				};
				this.showMessage(data);
				QUnit.ok(!!this.view.get("container"),
					"Checking if the \"showMessage\" function doesn't wipe out other elements in the \"view\" structure");
				QUnit.equal(
					target.find(".echo-app-message-icon").attr("title"),
					data.message,
					"Checking \"showMessage\" in compact mode");

				data.layout = "full";
				this.showMessage(data);
				QUnit.equal(
					target.find(".echo-app-message-icon").html(),
					data.message,
					"Checking \"showMessage\" in full mode");
				this.destroy();
				callback();
			}
		});
	});
});

Echo.Tests.asyncTest("showError()", function() {
	QUnit.expect(4);
	run(function(callback) {
		initTestApp({
			"data": {
				"key1": "key1 value",
				"key2": "key2 value",
				"key3": {
					"key3nested": "nested value for key 3"
				}
			},
			"ready": function() {
				var self = this;
				var errorCount = 0;
				var errorTarget = jQuery("<div></div>");
				var errorData = {
					"errorCode": "someUndefinedErrorCode",
					"errorMessage": "Some Error Message"
				};
				var errorRequest = new Echo.API.Request({
					"endpoint": "search",
					"data": {
						"appkey": "echo.jssdk.tests.aboutecho.com",
						"q": "unsupported query"
					},
					"onData": function(response) {},
					"onError": function(response) {},
					"onOpen": function() {}
				});
				var errorOptions = {
					"target": errorTarget,
					"critical": false,
					"request": errorRequest
				};
				this.showError(errorData, errorOptions);
				QUnit.equal(
					errorTarget.find(".echo-app-message-icon").html(),
					"(someUndefinedErrorCode) Some Error Message",
					"Checking if the unsupported errorCode received"
				);
				errorData.errorCode = "busy";
				this.showError(errorData, errorOptions);
				QUnit.equal(
					errorTarget.find(".echo-app-message-icon").html(),
					"Loading. Please wait...",
					"Checking if the supported errorCode received and errorMessage ignored"
				);
				errorOptions.retryIn = 3000;
				errorData.errorCode = "view_limit";
				this.showError(errorData, errorOptions);
				QUnit.equal(
					errorTarget.find(".echo-app-message-icon").html(),
					"View creation rate limit has been exceeded. Retrying in 3 seconds...",
					"Checking if the retrying mechanism works"
				);
				setTimeout(function() {
					errorOptions.retryIn = 0;
					self.showError(errorData, errorOptions);
					QUnit.equal(
						errorTarget.find(".echo-app-message-icon").html(),
						"Retrying...",
						"Checking if the retrying mechanism works after 3 seconds counted"
					);
					clearInterval(errorRequest.retryTimer);
					self.destroy();
					callback();
				}, 3000);
			}
		});
	});
});

Echo.Tests.test("checkAppkey()", function() {
	var definition = getTestAppClass();
	var app = new definition({"target": jQuery("<div>")});

	var html = app.config.get("target").html();
	QUnit.ok(/incorrect_appkey/.test(html),
		"Checking if the error message is produced once the application is initialized without the appkey defined (validating the \"checkAppKey\" function)");
	QUnit.ok(/echo-app-message-error/.test(html),
		"Checking if the error message contains the necessary CSS class once the application is initialized without the appkey defined (validating the \"checkAppKey\" function)");
	app.destroy();
});

// helper functions

function run(source) {
	source = jQuery.isArray(source) ? source : [source];
	Echo.Utils.sequentialCall(source, function() {
		QUnit.start();
	});
}

function getTestAppClassName() {
	return "MyTestApp";
};

function getTestAppClass(name) {
	return Echo.Utils.getComponent(name || getTestAppClassName());
};

function initTestApp(config, name) {
	createTestApp("MyTestApp");
	var definition = getTestAppClass(name);
	new definition(jQuery.extend({
		"target": jQuery("<div></div>"),
		"appkey": "echo.jssdk.tests.aboutecho.com"
	}, config));
};

function createTestApp(name, config) {
	Echo.App.create(getAppManifest(name, config));
};

function getAppManifest(name, config) {
	config = config || {};

	var manifest = Echo.App.manifest(name || getTestAppClassName());

	manifest.inherits = Echo.Utils.getComponent("Echo.ServerRelatedApp");

	manifest.init = function() {
		if (!this.checkAppKey()) return;
		this.render();
		this.ready();
	};

	manifest.templates.main = '<div class="{class:container}"></div>';

	manifest.css =
		'.{class:header} { margin-bottom: 3px; }' +
		'.{class:avatar} .{class:image} { float: left; margin-right: -48px; }' +
		'.{class:avatar} img { width: 48px; height: 48px; }' +
		'.{class:fields} { width: 100%; float: left; }' +
		'.{class:fields} input { width: 100%; }';

	return manifest;

};

})(Echo.jQuery);
