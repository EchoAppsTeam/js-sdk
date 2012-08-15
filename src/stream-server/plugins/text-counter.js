/**
 * @class Echo.StreamServer.Controls.Submit.Plugins.TextCounter
 * Adds the character counter under the text field in the Echo Submit control. Allows to set the maximum length of the text to enter.
 *     new Echo.StreamServer.Controls.Submit({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "TextCounter"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("TextCounter", "Echo.StreamServer.Controls.Submit");

/**
 * @cfg {Number} limit Specifies the maximum length of the text. There is no limit if it is not defined.
 * @cfg {String} label Specifies the custom label for the counter. Parameter string is a template that has several placeholders. Placeholder is some word wrapped with the curly brackets. It supports the following list of placeholder words:
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
	var component = this.component;
	this.extendTemplate("insertAfter", "content", plugin.templates.counter);
};

plugin.labels = {
	"limited": "{typed}/{left} characters",
	"unlimited": "{typed} characters"
};

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.dom.render({"name": "counterLabel"});
	}
};

plugin.templates.counter = '<div class="{plugin.class:counterLabel} echo-primaryFont echo-primaryColor"></div>';

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
		plugin.dom.render({"name": "counterLabel"});
	};
	return element.on("blur focus keyup keypress", handler);
};

plugin.renderers.counterLabel = function(element) {
	var plugin = this;
	var limit = plugin.config.get("limit", 0);
	var typed = this.component.dom.get("text").val().length;
	var label = this.labels.get(
		plugin.config.get("label", limit ? "limited" : "unlimited"),
		{"typed": typed, "left": Math.max(limit - typed, 0), "limit": limit}
	);
	return element.text(label);
};

Echo.Plugin.create(plugin);
