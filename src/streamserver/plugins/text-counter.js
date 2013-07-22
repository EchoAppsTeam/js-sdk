(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.TextCounter
 * Adds the character counter under the text field in the Echo Submit control.
 * Allows to set the maximum length of the text to enter.
 *
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "TextCounter"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-2) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Echo.Plugin.manifest("TextCounter", "Echo.StreamServer.Controls.Submit");

if (Echo.Plugin.isDefined(plugin)) return;

/**
 * @cfg {Number} limit
 * Specifies the maximum length of the text.
 * There is no limit if it is not defined.
 */
/**
 * @cfg {String} label
 * Specifies the custom label for the counter. Parameter string is
 * a template that has several placeholders. A placeholder is a
 * word wrapped in curly brackets. It supports the following
 * list of placeholder words:
 *
 * + limit - The number from the limit parameter. 
 * + typed - The number of characters currently typed in the text field.
 * + left - The number of characters left (limit - typed).
 *
 * Default parameter value is:
 *
 * + "{typed}/{limit} characters" if limit parameter is provided
 * + "{typed} characters" if limit parameter is not provided
 */
plugin.init = function() {
	this.extendTemplate("insertAfter", "content", plugin.templates.counter);
};

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.view.render({"name": "counterLabel"});
	}
};

plugin.labels = {
	/**
	 * @echo_label
	 * Label to show in the counter if maximum character limit is provided
	 */
	"limited": "{typed}/{left} characters",
	/**
	 * @echo_label
	 * Label to show in the counter if no character limit is provided
	 */
	"unlimited": "{typed} characters"
};

/**
 * @echo_template
 */
plugin.templates.counter =
	 '<div class="{plugin.class:counterLabel} echo-primaryFont echo-primaryColor"></div>';

/**
 * @echo_renderer
 */
plugin.component.renderers.text = function(element) {
	var plugin = this;
	plugin.parentRenderer("text", arguments);
	var limit = plugin.config.get("limit", 0);
	var handler = function() {
		if (limit) {
			var text = element.val();
			if (text.length <= limit) {
				plugin.set("text", text);
			} else if (text.length > limit) {
				element.val(plugin.get("text"));
				return;
			}
		}
		plugin.view.render({"name": "counterLabel"});
	};
	return element.on("blur focus keyup keypress", handler);
};

/**
 * @echo_renderer
 */
plugin.renderers.counterLabel = function(element) {
	var plugin = this, submit = this.component;
	var limit = plugin.config.get("limit", 0);
	var typed = submit.view.get("text").val().length;
	var label = plugin.labels.get(
		plugin.config.get("label", limit ? "limited" : "unlimited"),
		{
			"typed": typed,
			"left": Math.max(limit - typed, 0),
			"limit": limit
		}
	);
	return element.text(label);
};

Echo.Plugin.create(plugin);

})(Echo.jQuery);
