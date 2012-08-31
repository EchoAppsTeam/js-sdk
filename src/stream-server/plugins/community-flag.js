/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag
 * Adds extra buttons Flag/Unflag to each item in the Echo Stream control for the authenticated users. The item will receive the CommunityFlagged state as soon as it is flagged by a certain number of users. By default this number is 3, but it may be updated by contacting Echo Solutions team at solutions@aboutecho.com. The plugin also shows the number of flags already set for the item next to the Flag/Unflag control.
 *
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "CommunityFlag"
 *         }]
 *     });
 *
 * @extends Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("CommunityFlag", "Echo.StreamServer.Controls.Stream.Item");

plugin.init = function() {
	this.extendTemplate("insertAsLastChild", "data", plugin.template);
	this.component.addButtonSpec("CommunityFlag", this._assembleButton("Flag"));
	this.component.addButtonSpec("CommunityFlag", this._assembleButton("Unflag"));
};

plugin.config = {
	/**
	 * @cfg {Boolean} showUsers
	 * Specifies the visibility of list of users who flagged particular item. Note that the list is only visible for the users with the administrative privileges.
	 */
	"showUsers": true
};

plugin.template = '<div class="{plugin.class:flaggedBy}"></div>';

plugin.labels = {
	/**
	 * @echo_label
	 */
	"flaggedThis": " flagged this.",
	/**
	 * @echo_label
	 */
	"flagControl": "Flag",
	/**
	 * @echo_label
	 */
	"unflagControl": "Unflag",
	/**
	 * @echo_label
	 */
	"flagProcessing": "Flagging...",
	/**
	 * @echo_label
	 */
	"unflagProcessing": "Unflagging..."
};

/**
 * @echo_renderer
 */
plugin.renderers.flaggedBy = function(element) {
	var plugin = this, item = this.component;
	var flags = item.get("data.object.flags", []);
	if (!flags.length || !item.user.is("admin") || !plugin.config.get("showUserList")) {
		return element.hide();
	}
	var flagsPerPage = 5;
	var visibleUsersCount = plugin.get("facepile")
		? plugin.get("facepile").getVisibleUsersCount()
		: flagsPerPage;
	var config = plugin.config.assemble({
		"target": element,
		"data": {
			"entries": flags,
			"itemsPerPage": flagsPerPage
		},
		"initialUsersCount": visibleUsersCount,
		"suffixText": plugin.labels.get("flaggedThis")
	});
	plugin.set("facepile", new Echo.StreamServer.Controls.FacePile(config));
	return element.show();
};

plugin.methods._assembleButton = function(name) {
	var plugin = this, item = this.component;
	var callback = function() {
		var item = this;
		item.get("buttons." + plugin.name + "." + name + ".element")
			.empty()
			.append(plugin.labels.get(name.toLowerCase() + "Processing"));
		var activity = {
			"verbs": ["http://activitystrea.ms/schema/1.0/" + name.toLowerCase()],
			"targets": [{"id": item.get("data.object.id")}]
		};
		var request = Echo.StreamServer.API.request({
			"endpoint": "submit",
			"submissionProxyURL": plugin.config.get("submissionProxyURL", "", true),
			"data": {
				"content": activity,
				"appkey": item.config.get("appkey"),
				"sessionID": item.user.get("sessionID"),
				"target-query": item.config.get("parent.query")
			},
			"onData": function() {
				/**
				 * @event onFlagComplete
				 * @echo_event Echo.StreamServer.Controls.Stream.Plugins.CommunityFlag.onFlagComplete
				 * Triggered if flag operation was completed. 
				 */
				/**
				 * @event onUnFlagComplete
				 * @echo_event Echo.StreamServer.Controls.Stream.Plugins.CommunityFlag.onUnFlagComplete
				 * Triggered if reverse flag operation was completed. 
				 */
				plugin.events.publish({
					"topic": "on" + name + "Complete",
					"data": {
						"item": {
							"data": item.get("data"),
							"target": item.config.get("target")
						}
					}
				});
				plugin.requestDataRefresh();
			}
		})
		request.send();
	};
	return function() {
		var item = this;
		var flags = item.get("data.object.flags");
		var label = plugin.labels.get(name.toLowerCase() + "Control");
		var action = plugin._myFlags(flags).length > 0 ? "Unflag" : "Flag";
		return {
			"name": name,
			"label": '<span class="echo-clickable">' + label + '</span>' +
				(item.user.is("admin") && flags.length ? " (" + flags.length + ")" : ""),
			"visible": item.user.is("logged") && action == name,
			"once": true,
			"callback": callback
		};
	};
};

plugin.methods._myFlags = function(flags) {
	var item = this.component;
	return $.map(flags, function(entry) {
		if (item.user.has("identity", entry.actor.id)) return entry;
	});
};

plugin.css = '.{plugin.class:flaggedBy} { background: url(' + Echo.Loader.getURL("sdk/images/curation/status/communityflagged.png") + ') no-repeat 0px 4px; padding: 0px 0px 4px 21px; }';

Echo.Plugin.create(plugin);
