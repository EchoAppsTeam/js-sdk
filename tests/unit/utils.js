(function($) {

var suite = Echo.Tests.Unit.Utils = function() {};

suite.prototype.info = {
	"className": "Echo.Utils",
	"functions": ["htmlize"]
};

suite.prototype.tests = {};

suite.prototype.tests.TestUtilsMethods = {
	"check": function() {
		QUnit.equal(Echo.Utils.htmlize(), '', "Checking htmlize() method with empty param");
	}
};

})(jQuery);
