var plugin = Echo.Plugin.manifest("SubmitCountdownEvent", "Echo.StreamServer.Controls.Submit");

plugin.init = function() {
	this.extendTemplate("insertAfter", "content", plugin.countdownTemplate);
};

plugin.labels = {
	"chatClosesIn": "Chat closes in "
};

plugin.renderers.countdownLabel = function(element) {
	var self = this;
	var submit = this.component;
	if (submit.config.get("mode") === "compact") {
		return element.hide();
	}
	var time = this.config.get("eventEnd")
		? new Date(parseInt(this.config.get("eventEnd")))
		: new Date;
	return element.countdown(time, {
		"prefix": this.labels.get("chatClosesIn"),
		"display": "compact",
		"finish": function() {
			self.events.publish({"topic": "onEventEnd"});
		}
	});
};

plugin.component.renderers.tagsContainer =
plugin.component.renderers.markersContainer =
plugin.component.renderers.metadata = function(element) {
	return element.hide();
};

plugin.countdownTemplate = '<div class="{plugin.class:countdownLabel} echo-secondaryFont echo-secondaryColor"></div>';

plugin.css =
	'.{plugin.class:countdownLabel} { float: left; margin-top: 15px; }';

Echo.Plugin.create(plugin);
