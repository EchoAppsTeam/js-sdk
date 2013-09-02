(function($) {

Echo.Tests.module("Echo.API", {
	"meta": {
		"className": "Echo.API",
		// TODO: cover all these methods with tests
		"functions": [
			"Request.send",
			"Request.request",
			"Request.abort",
			"Transports.AJAX.available",
			"Transports.AJAX.send",
			"Transports.AJAX.abort",
			"Transports.XDomainRequest.available",
			"Transports.JSONP.available",
			"Transports.JSONP.send",
			"Transports.JSONP.abort",
			"Transport.send",
			"Transport.abort"
		]
	}
});

Echo.Tests.test("private interface", function() {
	var req = new Echo.API.Request({
		"endpoint": "some_endpoint",
		"onSomeEvent": function() {},
		"onSomeEvent2": function() {},
		"onemotion": true
	});
	QUnit.equal("//" + req._prepareURI(), "{%=baseURLs.api.streamserver%}/v1/some_endpoint", "Checking URI assembler for transport url");
	var handlers = req._getHandlersByConfig();
	QUnit.ok("onSomeEvent" in handlers && "onSomeEvent2" in handlers, "Checking that component can retrieve event handlers from config");

	var request = function(url) {
		return new Echo.API.Request({
			"endpoint": "endpoint",
			"apiBaseURL": url
		});
	};
	QUnit.equal(request("https://example.com/v1/")._prepareURI(), "example.com/v1/endpoint", "[_prepareURI] https:// in URL");
	QUnit.equal(request("http://example.com/v1/")._prepareURI(), "example.com/v1/endpoint", "[_prepareURI] \"http://\" in URL");
	QUnit.equal(request("wss://example.com/v1/")._prepareURI(), "example.com/v1/endpoint", "[_prepareURI] \"wss://\" in URL");
	QUnit.equal(request("//example.com/v1/")._prepareURI(), "example.com/v1/endpoint", "[_prepareURI] \"//\" in URL");
	QUnit.equal(request("example.com/v1/")._prepareURI(), "example.com/v1/endpoint", "[_prepareURI] no protocol in URL");
});

})(Echo.jQuery);
