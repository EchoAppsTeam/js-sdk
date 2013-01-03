(function($) {

var suite = Echo.Tests.Unit.Modal = function() {};

suite.prototype.info = {
	"className": "Echo.GUI.Modal",
	"functions": ["show", "remove", "hide"]
};

suite.prototype.tests = {};

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
			"handler": function() {
				Echo.Tests.Unit.Modal._button0Handler = true;
			}
		}, {
			"title": "Test button2",
			"extraClass": "echo-button2-class",
			"handler": function() {
				Echo.Tests.Unit.Modal._button1Handler = true;
			}
		}]
	},
	"width": "400",
	"height": "500",
	"padding": "10",
	"footer": true,
	"header": true,
	"fade": true
};

suite.prototype.tests.commonWorkflow = {
	"config": {
		"async": true
	},
	"check": function() {
		Echo.Utils.addCSS(".echo-hide { display: none; }", "echo-hide");
		var modal = new Echo.GUI.Modal(modalParams);

		QUnit.ok($(".echo-sdk-ui .modal").length, "Check that modal is available");

		var modalElement = $($(".echo-sdk-ui .modal")[0]);
		var modalBackdrop = $(".echo-sdk-ui .modal-backdrop")[0];

		QUnit.ok(modalBackdrop, "Check that backdrop is displayed");

		QUnit.ok($(".modal-footer", modalElement).length, "Check that footer is displayed");

		QUnit.ok($(".modal-header", modalElement).length, "Check that header is displayed");

		QUnit.ok($(".modal-header h3", modalElement).html() === modalParams.data.title, "Check that title is displayed");

		this.jqueryObjectsEqual( $($(".modal-body", modalElement).html()), $(modalParams.data.body), "Check that body is displayed" );

		QUnit.ok($(".modal-header button.close", modalElement).length, "Check that close button is displayed");

		QUnit.ok(modalElement.hasClass(modalParams.extraClass), "Check that extra class has been added");

		var buttonsTest = true;
		for (var i in modalParams.data.buttons) {
			var button = $(".modal-footer ." + modalParams.data.buttons[i].extraClass);
			button.click();
			if (
				!button
				|| !Echo.Tests.Unit.Modal["_button" + i + "Handler"]
				|| button.html() !== modalParams.data.buttons[i].title
			) {
				buttonsTest = false;
				break;
			}
		}
		QUnit.ok(buttonsTest, "Check that custom buttons is displayed");

		QUnit.ok(modalElement.hasClass("fade"), "Check the modal fade");

		modal.hide();
		QUnit.ok(!$(".modal").length, "Check hide() method");

		modal.show();
		$(".modal").hide();
		QUnit.ok($(".modal").length, "Check show() method");

		modal.remove();
		QUnit.ok(!$(".modal").length, "Check remove() method");

		QUnit.start();
		
	}
};

})(Echo.jQuery);
