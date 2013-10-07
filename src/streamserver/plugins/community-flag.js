(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag
 * Adds extra Flag/Unflag buttons to each item in the Echo Stream
 * control for the authenticated users. The item will receive the
 * CommunityFlagged state as soon as it is flagged by a certain number
 * of users. By default this number is 3, but it may be updated by
 * contacting Echo Solutions team at solutions@aboutecho.com. The plugin
 * also shows the number of flags already set for the item next to the
 * Flag/Unflag control.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "CommunityFlag"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver/plugins.pack.js
 * @package streamserver.pack.js
 */
var plugin = Echo.Plugin.manifest("CommunityFlag", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	this.extendTemplate("insertAsLastChild", "data", plugin.templates.main);
	this.component.addButtonSpec("CommunityFlag", this._assembleButton("Flag"));
	this.component.addButtonSpec("CommunityFlag", this._assembleButton("Unflag"));
};

plugin.config = {
	/**
	 * @cfg {Boolean} showUserList
	 * Specifies the visibility of the list of users who flagged a particular
	 * item. Note that the list is only visible for the users with
	 * administrative privileges.
	 */
	"showUserList": true
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"flagged": "Flagged",
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

plugin.dependencies = [{
	"control": "Echo.StreamServer.Controls.FacePile",
	"url": "{config:cdnBaseURL.sdk}/streamserver.pack.js"
}];

/**
 * @echo_template
 */
plugin.templates.main = '<div class="{plugin.class:flaggedBy}"></div>';

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
			"secure": plugin.config.get("useSecureAPI", false, true),
			"submissionProxyURL": plugin.config.get("submissionProxyURL", "", true),
			"data": {
				"content": activity,
				"appkey": item.config.get("appkey"),
				"sessionID": item.user.get("sessionID"),
				"target-query": item.config.get("parent.query")
			},
			"onData": function(response) {
				/**
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagComplete
				 * Triggered if flag operation was completed.
				 */
				/**
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagComplete
				 * Triggered if reverse flag operation was completed.
				 */
				plugin._publishEventComplete({
					"name": name,
					"state": "Complete",
					"response": response
				});
				if (name === "Flag" && !item.config.get("parent.showFlags")) {
					plugin.set("flagged", true);
					item.view.render({"name": "buttons"});
				}
				plugin.requestDataRefresh();
			},
			"onError": function(response) {
				/**
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagError
				 * Triggered if flag operation failed.
				 */
				/**
				 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagError
				 * Triggered if reverse flag operation failed.
				 */
				plugin._publishEventComplete({
					"name": name,
					"state": "Error",
					"response": response
				});
				item.render();
			}
		});
		request.send();
	};
	return function() {
		var item = this;
		var flags = item.get("data.object.flags");
		var label = plugin.labels.get(name.toLowerCase() + "Control");
		var action = plugin._myFlags(flags).length > 0 ? "Unflag" : "Flag";
		var flagged = name === "Flag" && !item.config.get("parent.showFlags") && plugin.get("flagged");
		var data = {
			"name": name,
			"label": !flagged
				? '<span class="echo-clickable">' + label + '</span>' +
				(item.user.is("admin") && flags.length ? " (" + flags.length + ")" : "")
				: plugin.labels.get("flagged"),
			"visible": item.user.is("logged") && action === name,
			"clickable": !flagged,
			"once": true,
			"callback": callback
		};
		if (flagged) {
			data.template = '<span>{data:label}</span>';
		}
		return data;
	};
};

plugin.methods._publishEventComplete = function(args) {
	var item = this.component;
	this.events.publish({
		"topic": "on" + args.name + args.state,
		"data": {
			"item": {
				"data": item.get("data"),
				"target": item.config.get("target")
			},
			"response": args.response
		}
	});
};

plugin.methods._myFlags = function(flags) {
	var item = this.component;
	return $.map(flags, function(entry) {
		if (item.user.has("identity", entry.actor.id)) return entry;
	});
};

plugin.css = '.{plugin.class:flaggedBy} { background: url({config:cdnBaseURL.sdk-assets}/images/curation/status/communityflagged.png) no-repeat 0px 4px; padding: 0px 0px 4px 21px; }';

Echo.Plugin.create(plugin);

})(Echo.jQuery);
