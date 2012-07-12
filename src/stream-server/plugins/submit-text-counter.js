(function($) {

if (Echo.Utils.isComponentDefined("Echo.Plugins.SubmitTextCounter")) return;

var plugin = Echo.Plugin.skeleton("SubmitTextCounter");

plugin.applications = ["Echo.StreamServer.Controls.Submit"];

plugin.init = function() {
	var component = this.component;
	this.extendTemplate(plugin.templates.counter, "insertAfter", "content");
	this.extendRenderer("text", plugin.renderers.Submit.text);
	this.extendRenderer("counterLabel", plugin.renderers.Submit.counterLabel);
};

plugin.labels = {
	"limited": "{typed}/{left} characters",
	"unlimited": "{typed} characters"
};

plugin.events = {
	"Echo.StreamServer.Controls.Submit.onPostComplete": function(topic, args) {
		this.component.rerender("counterLabel");
	}
};

plugin.templates.counter = '<div class="{class:counterLabel} echo-primaryFont echo-primaryColor"></div>';

plugin.renderers.Submit = {};

plugin.renderers.Submit.text = function(element, dom) {
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
		plugin.component.rerender("counterLabel");
	};
	return element.bind("blur focus keyup keypress", handler);
};

plugin.renderers.Submit.counterLabel = function(element, dom) {
	var plugin = this;
	var limit = plugin.config.get("limit", 0);
	var typed = dom.get("text").val().length;
	var label = this.labels.get(
		plugin.config.get("label", limit ? "limited" : "unlimited"),
		{"typed": typed, "left": Math.max(limit - typed, 0), "limit": limit}
	);
	return element.text(label);
};

Echo.Plugin.create(plugin);

})(jQuery);
