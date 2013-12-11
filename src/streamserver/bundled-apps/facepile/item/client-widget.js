Echo.define([
	"jquery",
	"echo/utils",
	"require",
	"echo/streamserver/base"
], function($, Utils, require, App) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget
 * Echo FacePile.Item application displays single user (actor). 
 *
 * @extends Echo.StreamServer.Base
 *
 * @package streamserver.pack.js
 * @module
 *
 * @constructor
 * FacePile.Item constructor initializing Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget class
 *
 * @param {Object} config
 * Configuration options
 */
var item = App.definition("Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget");

//if (App.isDefined(item)) return;

/** @hide @cfg plugins */
/** @hide @method dependent */

/**
 * @echo_event Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRerender
 * Triggered when the app is rerendered.
 */

item.config = {
	/**
	 * @cfg {String} defaultAvatar
	 * Default avatar URL which will be used for the user in
	 * case there is no avatar information defined in the user
	 * profile. Also used for anonymous users.
	 */
	"defaultAvatar": require.toUrl("echo-assets/images/avatar-default.png"),

	"user": {
		"endpoints": {
			"logout": "https:{%=baseURLs.api.submissionproxy%}/v2/",
			"whoami": "https:{%=baseURLs.api.streamserver%}/v1/users/"
		}
	}
};

item.labels = {
	/**
	 * @echo_label
	 */
	"you": "You"
};

/**
 * @echo_template
 */
item.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:avatar}"></span>' +
		'<span class="{class:title}">{data:title}</span>' +
	'</span>';

/**
 * @echo_renderer
 */
item.renderers.avatar = function(element) {
	var self = this;
	if (this.config.get("avatar")) {
		Utils.placeImage({
			"container": element,
			"image": this.get("data.avatar"),
			"defaultImage": this.config.get("defaultAvatar")
		});
		if (!this.config.get("text")) {
			element.attr("title", this.get("data.title"));
		}
	} else {
		element.hide();
	}
	return element;
};

/**
 * @echo_renderer
 */
item.renderers.title = function(element) {
	if (this.config.get("text")) {
		element.empty().append(this.isYou() ? this.labels.get("you") : this.get("data.title"));
	} else {
		element.hide();
	}
	return element;
};

/**
 * Function to check if the item was posted by the current user.
 *
 * @return {Boolean}
 */
item.methods.isYou = function() {
	var id = this.get("data.id");
	return id && id === this.user.get("identityUrl");
};

item.css =
	".{class:avatar} { display: inline-block; width: 16px; height: 16px; margin: 0px 3px 0px 0px; vertical-align: text-top; }" +
	'.{class:only-avatars} .{class:avatar} { margin: 0px 2px; }' +
	'.{class:container}, .{class:container} span { white-space: nowrap; display: inline-block; }' +
	'.{class:only-avatars} .{class:container} { white-space: normal; }';

return App.create(item);

});
