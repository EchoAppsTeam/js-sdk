// vim: set ts=8 sts=8 sw=8 noet:
/*
 * Copyright (c) 2006-2011 Echo <solutions@aboutecho.com>. All rights reserved.
 * You may copy and modify this script as long as the above copyright notice,
 * this condition and the following disclaimer is left intact.
 * This software is provided by the author "AS IS" and no warranties are
 * implied, including fitness for a particular purpose. In no event shall
 * the author be liable for any damages arising in any way out of the use
 * of this software, even if advised of the possibility of such damage.
 * $Id$
 */

var plugin = Echo.Plugin.manifest("SubmitCountdownEvent", "Echo.StreamServer.Controls.Stream.Submit");

plugin.init = function() {
	this.extendTemplate("insertAfter", "echo-submit-content", plugin.countdownTemplate);
};

plugin.labels = {
	"chatClosesIn": "Chat closes in "
};

plugin.component.renderers.countdownLabel = function(element) {
	var application = this;
	if (application.config.get("mode") == "compact") {
		element.hide();
		return;
	}
	var time = plugin.config.get(application, "eventEnd")
		? new Date(parseInt(plugin.config.get(application, "eventEnd")))
		: new Date;
	element.countdown(time, {
		"prefix": plugin.label("chatClosesIn"),
		"display": "compact",
		"finish": function() {
			plugin.publish(application, "SocialChatter.onEventEnd");
		}
	});
};
plugin.component.renderers.tagsContainer = function(element) {};
plugin.component.renderers.markersContainer = function(element) {};
plugin.component.renderers.metadata = function(element) {
	element.hide();
};

plugin.countdownTemplate = '<div class="{plugin.class:countdownLabel} echo-secondaryFont echo-secondaryColor"></div>';

plugin.css =
	'.{plugin.class:countdownLabel} { float: left; margin-top: 15px; }';

Echo.Plugin.create(plugin);
