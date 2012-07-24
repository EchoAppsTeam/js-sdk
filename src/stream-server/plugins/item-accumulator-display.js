(function($) {

var plugin = Echo.Plugin.skeleton("ItemAccumulatorDisplay", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.config = {
	"countTickTimeout": 1,
	"accumulator": "repliesCount"
};

plugin.init = function() {
	this.extendRenderer("accumulatorContainer", plugin.renderers.Item.accumulatorContainer);
	this.extendTemplate(plugin.template, "insertBefore", "modeSwitch");
};

plugin.renderers = {"Item": {}};

plugin.template = '<div class="{class:accumulatorContainer}"></div>';

plugin.renderers.Item.accumulatorContainer = function(element) {
	var item = this.component;
	var accName = this.config.get("accumulator");
	var accumulator = item.get("data.object.accumulators")[accName];
	var count = this.get("count") || {};
	if (typeof count.current === "undefined") {
		// first-time rendering actions
		this.set("count", {
			"actual": accumulator,
			"current": accumulator
		});
		return element.append(accumulator);
	}
	this._stopTimer();
	var container = item.dom.get("container");
	container.stop(true, true);
	if (count.actual !== accumulator) {
		count.actual = accumulator;
		this.set("count", count);
	}
	element.append(count.current);

	// animate counter if necessary
	if (count.current !== count.actual) {
		var bgColor = this.get("originalBGColor");
		if (typeof bgColor === "undefined") {
			bgColor = Echo.Utils.getVisibleColor(container);
			this.set("originalBGColor", bgColor);
		}
		container.css({"backgroundColor": item.config.get("parent.flashColor")});
		this._animateCounter(bgColor);
	}
	return element;
};

plugin.methods._stopTimer = function() {
	var timer = this.get("timer");
	if (timer) clearTimeout(timer);
	this.set("timer", undefined);
};

plugin.methods._animateCounter = function(bgColor) {
	this._stopTimer();
	var plugin = this;
	var count = this.get("count");
	var item = this.component;
	if (typeof count.current !== "undefined" && count.current === count.actual &&
			!this.get("animationInProgress")) {
		// fading out
		var container = item.dom.get("container");
		this.set("animationInProgress", true);
		container.animate(
			{"backgroundColor": bgColor},
			item.config.get("parent.fadeTimeout"),
			"linear",
			function() {
				container.css("backgroundColor", "");
				plugin.set("animationInProgress", false);
			}
		);
		return;
	}
	this.set("timer", setTimeout(function() {
		var count = plugin.get("count");
		if (count.current !== count.actual) {
			count.current < count.actual ? count.current++ : count.current--;
			plugin.set("count.current", count.current);
			item.dom.get("accumulatorContainer").html(count.current);
			plugin._animateCounter(bgColor);
		}
	}, this.config.get("countTickTimeout") * 1000));
};

plugin.css = '.{class:accumulatorContainer} { float: right; margin-right: 7px; }';

Echo.Plugin.create(plugin);

})(jQuery);
