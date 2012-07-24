(function($) {

var suite = Echo.Tests.Unit.API = function() {};

suite.prototype.info = {
	"className": "Echo.API.Request",
	"suiteName": "API",
	"functions": []
};

suite.prototype.tests = {};

suite.prototype.tests.PrivateInterfaceTests = {
    "check": function() {
		var event1 = function() {},
			event2 = function() {};
		var req = new Echo.API.Request({
			"endpoint": "some_endpoint",
			"onSomeEvent": event1,
			"onSomeEvent2": event2,
			"onemotion": true
		});
		QUnit.equal("api.echoenabled.com/v1/some_endpoint", req._prepareURI(), "Checking URI assembler for trnsport url");
		var handlers = req._getHandlersByConfig();
		QUnit.deepEqual({
			"onSomeEvent": event1,
			"onSomeEvent2": event2
		}, handlers, "Checking that component can retrieve event handlers from config");
	}
};

})(jQuery);
