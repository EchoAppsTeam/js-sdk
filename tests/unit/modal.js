(function($) {

Echo.Tests.module("Echo.GUI.Modal", {
	"meta": {
		"className": "Echo.GUI.Modal",
		"functions": ["show", "destroy", "hide", "refresh"]
	}
});

Echo.Tests.asyncTest("common workflow", function() {
	var modalParams = {
		"show": true,
		"backdrop": true,
		"keyboard": true,
		"closeButton": true,
		"remote": false,
		"extraClass": "echo-hide",
		"data": {
			"title": "TestTitle",
			"body": "<b>some_body</b>",
			"buttons": [{
				"title": "Test button",
				"extraClass": "echo-button1-class",
				"handler": sinon.spy()
			}, {
				"title": "Test button2",
				"extraClass": "echo-button2-class",
				"handler": sinon.spy()
			}]
		},
		"width": "400",
		"height": "500",
		"padding": "10",
		"footer": true,
		"header": true,
		"fade": true
	};

	QUnit.expect(21);
	Echo.Utils.addCSS(".echo-hide { display: none; }", "echo-hide");
	var modal = new Echo.GUI.Modal(modalParams);

	QUnit.ok($(".echo-sdk-ui .modal").length, "Check that modal is available");

	var modalElement = modal.element;
	var modalBackdrop = $(".echo-sdk-ui .modal-backdrop")[0];

	QUnit.ok(modalBackdrop, "Check that backdrop is displayed");

	QUnit.ok($(".modal-footer", modalElement).length, "Check that footer is displayed");

	QUnit.ok($(".modal-header", modalElement).length, "Check that header is displayed");

	QUnit.ok($(".modal-header h3", modalElement).html() === modalParams.data.title, "Check that title is displayed");

	Echo.Tests.jqueryObjectsEqual($($(".modal-body", modalElement).html()), $(modalParams.data.body), "Check that body is displayed");

	QUnit.ok($(".modal-header button.close", modalElement).length, "Check that close button is displayed");

	QUnit.ok(modalElement.hasClass(modalParams.extraClass), "Check that extra class has been added");

	$.each(modalParams.data.buttons, function(i, config) {
		var button = $(".modal-footer ." + config.extraClass);
		if (!button) return;
		QUnit.ok(button.length, "Check that button \"" + config.title + "\" is added");
		QUnit.equal(button.html(), config.title, "Check that button HTML is correct");
		button.click();
		QUnit.ok(config.handler.calledOnce, "Check that click handler is called");
	});

	QUnit.ok(modalElement.hasClass("fade"), "Check the modal fade");

	$(".modal-header h3", modalElement).html("Some Title");
	modal.refresh();
	QUnit.ok($(".echo-sdk-ui .modal .modal-header h3").html() === modalParams.data.title, "Check refresh() method");

	modal.config.set("extraClass", "upd-echo-hide");
	modal.config.set("data.title", "upd-title");
	modal.config.set("data.body", "upd_body");
	modal.config.set("width", "400");
	modal.refresh();

	var modalElement = modal.element;
	QUnit.ok(modalElement.hasClass("upd-echo-hide")
			&& $(".modal-header h3", modalElement).html() === "upd-title"
			&& $(".modal-body", modalElement).html() === "upd_body"
			&& modalElement.width() === 400, "Check set() method");

	QUnit.ok($(".modal").length, "Check that element is visible");
	modal.config.set("onHide", function() {
		modal.config.set("onHide", function() {});
		QUnit.ok(!$(".modal").length, "Check hide() method");

		modal.config.set("onShow", function() {
			QUnit.ok($(".modal").length, "Check show() method");
			modal.destroy();
			QUnit.ok(!$(".modal").length, "Check destroy() method");

			QUnit.start();
		});
		modal.show();
		$(".modal").css("left", "-" + $(".modal").width() + "px"); // move modal dialog outside viewport
	});
	modal.hide();
});

})(Echo.jQuery);
