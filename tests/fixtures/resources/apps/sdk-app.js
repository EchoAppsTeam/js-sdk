Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/app",
	"loadFrom![echo/apps.sdk]echo/utils"
], function($, App, Utils) {

"use strict";

var app = App.definition("Echo.Tests.Fixtures.canvases.SDKApp");

app.config = {
	"key": "value1"
};

app.templates.main = "<div></div>";

// FIXME: __DEPRECATED__
// remove this after full require js compatible implementation
Utils.set(window, "Echo.Tests.Fixtures.canvases.SDKApp", app);

return App.create(app);

});
