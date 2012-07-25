(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.MetadataManager
 * Provides the ability to add buttons to the Echo Stream control items adding/removing markers/tags. By default those buttons will be available for moderators and administrators, though the visibility of tag controls can be configured via special param.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "MetadataManager"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("MetadataManager", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;
/**
 * @cfg {Array} controls Specifies the list of buttons which should be added to the Echo Stream item.
 * @cfg {String} controls.marker Specifies the value of marker to be set.
 * @cfg {String} controls.tag Specifies the value of tag to be set.
 * @cfg {String} controls.labelMark Specifies the button label to perform the corresponding action.
 * @cfg {String} controls.labelUnmark Specifies the button label to undo the corresponding action
 * @cfg {Object|Function} controls.visible Specifies the condition of visibility. Applicable only for tags. Can be either an object or a function.
 *
 * Example: simple marker control
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "MetadataManager"
 *             "controls": [{
 *                 "marker": "sticky",
 *                 "labelMark": "Pin",
 *                 "labelUnmark": "Unpin"
 *             }]
 *         }]
 *     });
 *
 * Example: simple tag control
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "MetadataManager"
 *             "controls": [{
 *                 "tag": "football",
 *                 "labelMark": "Set Football tag",
 *                 "labelUnmark": "Unset Football tag"
 *             }]
 *         }]
 *     });
 *
 * Example: tag control with visibility condition defined as an object
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "MetadataManager"
 *             "controls": [{
 *                 "tag": "football",
 *                 "labelMark": "Set Football tag",
 *                 "labelUnmark": "Unset Football tag",
 *                 "visible": {
 *                     "user.markers": ["top_commenter", "top_visitor"],
 *                     "user.state": ["Untouched", "ModeratorApproved"]
 *                     "user.roles": ["Moderator"]
 *                 }
 *             }]
 *         }]
 *     });
 *
 * Example: tag control with visibility condition defined as a function 
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "MetadataManager"
 *             "controls": [{
 *                 "tag": "football",
 *                 "labelMark": "Set Football tag",
 *                 "labelUnmark": "Unset Football tag",
 *                 "visible": function(application, item) {
 *                     var user = application.user;
 *                     if (user.get("state") == "Untouched") return true;
 *                     return false;
 *                 }
 *             }]
 *         }]
 *     });
 */
plugin.init = function() {
	var self = this;
	var item = this.component;
	$.each(this.config.get("controls"), function(i, control) {
		item.addButtonSpec("MetadataManager", self._assembleButton("Mark", control));
		item.addButtonSpec("MetadataManager", self._assembleButton("Unmark", control));
	});
};

plugin.labels = {
	"markProcessing": "Adding {type} {marker}...",
	"unmarkProcessing": "Removing {type} {marker}..."
};

plugin.methods._assembleButton = function(action, control) {
	var self = this;
	var type = control.marker ? "marker" : "tag";
	var marker = (control.marker || control.tag);
	var name = action + "As" + marker.replace(/[^a-z0-9_-]/ig, '');
	var callback = function() {
		var item = this;
		var operation = action.toLowerCase();
		item.buttons[plugin.name + "." + name].element
			.empty()
			.append(self.labels.get(operation + "Processing", {"type": type, "marker": marker}));
		var verb = type == "tag" ? operation.replace(/mark/g, "tag") : operation;
		var activity = {
			"verbs": ["http://activitystrea.ms/schema/1.0/" + verb],
			"targets": [{"id": item.get("data.object.id")}],
			"object": {
				"objectTypes": [
					"http://activitystrea.ms/schema/1.0/" + type
				],
				"content": marker
			}
		};
		Echo.StreamServer.API.request({
			"endpoint": "submit",
			"submissionProxyURL": item.config.get("submissionProxyURL"),
			"onData": function() {
				self.requestDataRefresh();
			},
			"data": {
				"appkey": item.config.get("appkey"),
				"content": activity,
				"target-query": item.config.get("parent.query", ""),
				"sessionID": item.user.get("sessionID", "")
			}
		}).send();
	};
	return function() {
		var item = this;
		return {
			"name": name,
			"label": control["label" + action],
			"visible": self._isButtonVisible(item, control, marker, action, type),
			"onetime": true,
			"callback": callback
		};
	};
};

plugin.methods._isButtonVisible = function(item, control, marker, action, type) {
	var component = this.component;
	var visible = ($.inArray(marker, item.data.object[type + "s"] || []) == -1) ^ (action == "Unmark");
	if (!visible || !item.user.is("logged")) return false;
	if (item.user.is("admin")) return true;
	var customProxyURL = component.config.get("submissionProxyURL");
	if (type == "marker" && !customProxyURL) return false;
	control.visible = control.visible || function() { return false; };
	if ($.isFunction(control.visible)) {
		return control.visible(item);
	}
	if ($.isEmptyObject(control.visible)) return false;
	var isVisible = true;
	$.each(["state", "roles", "markers"], function(i, field) {
		var values = control.visible["user." + field];
		if (values) {
			values = typeof values == "string" ? [values] : values;
			if (!item.user.any(field, values)) {
				isVisible = false;
				return false; // break
			}
		}
	});
	return isVisible;
};

Echo.Plugin.create(plugin);

})(jQuery);
