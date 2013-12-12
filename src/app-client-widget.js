Echo.define([
	"echo/app"
], function(App) {
"use strict";

/**
 * @class Echo.App.ClientWidget
 * Implementing additional logic for the client facing widget.
 * You can find instructions on how to create your App in the
 * ["How to develop an App"](#!/guide/how_to_develop_app) guide.
 *
 * @package apps.sdk.js
 * @module
 *
 * @extends Echo.App
 */
var ClientWidget = App.definition("Echo.App.ClientWidget");

return App.create(ClientWidget);

});
