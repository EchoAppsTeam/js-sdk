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
(function($) {
 
var plugin = Echo.createPlugin({
	"name": "SubmitCountdownEvent",
	"applications": ["Submit"],
	"init": function(plugin, application) {
		plugin.extendRenderer("Submit", "countdownLabel",
			plugin.renderers.Submit.countdownLabel);
		plugin.extendRenderer("Submit", "tagsContainer",
			plugin.renderers.Submit.metadata);
		plugin.extendRenderer("Submit", "markersContainer",
			plugin.renderers.Submit.metadata);
		plugin.extendTemplate("Submit",
			plugin.countdownTemplate, "insertAfter", "echo-submit-content");
		plugin.addCss(plugin.css);
	}
});

plugin.addLabels({
	"chatClosesIn": "Chat closes in "
});

plugin.countdownTemplate = '<div class="echo-submit-countdownLabel echo-secondaryFont echo-secondaryColor"></div>';

plugin.renderers = {"Submit": {}};

plugin.renderers.Submit.metadata = function(element) {
	element.hide();
};

plugin.renderers.Submit.countdownLabel = function(element) {
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

plugin.css = 
	'.echo-submit-countdownLabel { float: left; margin-top: 15px; }';

})(jQuery);
