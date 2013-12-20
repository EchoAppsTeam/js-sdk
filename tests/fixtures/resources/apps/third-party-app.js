Echo.define([
	"echo/utils"
], function(Utils) {

"use strict";

var App = function() {};

App.prototype.key = "value";

Utils.set(window, "Echo.Tests.Fixtures.canvases.ThirdPartyApp", App);

return App;

});
