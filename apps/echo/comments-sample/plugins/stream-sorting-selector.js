Echo.define("streamSortingSelector", [
	"jquery",
	"echo/plugin",
], function($, Plugin) {

"use strict";


var plugin = Plugin.definition("StreamSortingSelector", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.config = {
	"orders": [
		"reverseChronological",
		"chronological",
		"likesDescending",
		"flagsDescending",
		"repliesDescending"
	] 
};

plugin.init = function() {
	this.extendTemplate("insertAsFirstChild", "header", plugin.template);
};

plugin.labels = {
	"sortOrderSelection": "Sorting order:",
	"chronologicalSortOrder": "Chronological",
	"reverseChronologicalSortOrder": "Reverse chronological",
	"likesDescendingSortOrder": "Likes count",
	"flagsDescendingSortOrder": "Flags count",
	"repliesDescendingSortOrder": "Replies count"
};

plugin.template = function() {
	var plugin = this;
	var current = this._getSortOrder() || "reverseChronological";
	var options = $.map(plugin.config.get("orders"), function(order) {
		return plugin.substitute({
			"template": '<option value="{data:order}" {data:selected}>{data:label}</option>',
			"data": {
				"order": order,
				"label": plugin.labels.get(order + "SortOrder"),
				"selected": current === order ? "selected" : ""
			}
		});
	}).join("");
	return '<div class="{plugin.class:wrapper}">' +
		'<span class="{plugin.class:label}">{plugin.label:sortOrderSelection}</span>' +
		'<select class="{plugin.class:selector}">' + options + '</select>' +
	'</div>';
};

plugin.renderers.selector = function(element) {
	var plugin = this, stream = plugin.component;
	return element.on("change", function() {
		plugin._setSortOrder($(this).val());
	});
};

plugin.methods._getSortOrder = function() {
	var stream = this.component;
	var regex = new RegExp("sortOrder:(" + this.config.get("orders").join("|") + ")");
	var result = stream.config.get("query").match(regex);
	return result && result[1];
};

plugin.methods._setSortOrder = function(order) {
	var stream = this.component;
	var _query = stream.config.get("query");
	var _order = this._getSortOrder();
	var query = _order
		? _query.replace(new RegExp("sortOrder:" + _order), "sortOrder:" + order)
		: "sortOrder:" + order + " " + _query;
	stream.config.set("query", query);
	stream.refresh();
};

plugin.css =
	'.{plugin.class:label} { margin-right: 5px; }' +
	'.{plugin.class:wrapper} { float: left; }';

return Plugin.create(plugin);
});
