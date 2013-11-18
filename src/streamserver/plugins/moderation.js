define("echo/streamserver/plugins/streamModeration", [
	"jquery",
	"echo/plugin",
	"echo/utils",
	"echo/streamserver/api",
	"echo/identityserver/api"
], function($, Plugin, Utils, StreamServerAPI, IdentityServerApi) {
"use strict";

/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation
 * Adds several moderation controls to change item status. Besides
 * it provides the opportunity to ban specific user or change his privileges.
 *
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Moderation"
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
var plugin = Plugin.manifest("Moderation", "Echo.StreamServer.Controls.Stream.Item");

plugin.init = function() {
	var self = this;
	var item = this.component;
	var actions = this.config.get("itemActions").concat(this.config.get("userActions"));
	this.extendTemplate("insertAfter", "avatar", plugin.templates.status);
	$.each(actions, function(i, action) {
		var buttons = plugin.actionButtons[action];
		if (buttons && $.isArray(buttons)) {
			$.each(buttons, function(j, button) {
				item.addButtonSpec("Moderation", self["_assemble" + Utils.capitalize(action) + "Button"](button));
			});
		} else {
			item.addButtonSpec("Moderation", self._assembleButton(Utils.capitalize(action)));
		}
	});
};

plugin.config = {
	/**
	 * @cfg {Boolean} [removePersonalItemsAllowed=false]
	 * Specifies whether users are allowed to remove their own items from stream or not.
	 *
	 *     new Echo.StreamServer.Controls.Stream({
	 *         "target": document.getElementById("echo-stream"),
	 *         "appkey": "echo.jssdk.demo.aboutecho.com",
	 *         "plugins": [{
	 *             "name": "Moderation"
	 *             "removePersonalItemsAllowed": true
	 *         }]
	 *     });
	 *
	 * Please note that this parameter affects only client-side interface.
	 * This feature can be enabled on server side via a kvs/put API call, where:
	 *
	 * + key - is <b>remove-personal-items-allowed</b>
	 * + value - boolean <b>false/true</b>
	 * + public - is <b>false</b> (can be omitted)
	 *
	 * <b>IMPORTANT</b>: Client-side <i>"removePersonalItemsAllowed"</i> and KVS
	 * stored <i>"remove-personal-items-allowed"</i> parameters do not depend from
	 * each other, so please keep them synchronized to achieve consistent behavior.
	 */
	"removePersonalItemsAllowed": false,

	/**
	 * @cfg {Array} userActions
	 * Defines the list of user specific actions to be added to the Echo Stream Item.
	 *
	 * The following actions are available: `ban`, `permissions`
	 *
	 * 	new Echo.StreamServer.Controls.Stream({
	 * 		"target": document.getElementById("echo-stream"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"plugins": [{
	 * 			"name": "Moderation"
	 * 			"userActions": ["ban", "permissions"],
	 * 		}]
	 * 	});
	 */
	"userActions": ["ban", "permissions"],

	/**
	 * @cfg {Array} itemActions
	 * Defines the list of item specific actions to be added to the Echo Stream Item.
	 *
	 * The following actions are available: `approve`, `spam`, `delete`, `untouch`
	 *
	 * 	new Echo.StreamServer.Controls.Stream({
	 * 		"target": document.getElementById("echo-stream"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"plugins": [{
	 * 			"name": "Moderation"
	 * 			"itemActions": ["approve", "spam", "delete", "untouch"]
	 * 		}]
	 * 	});
	 */
	"itemActions": ["approve", "spam", "delete"]
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Plugins.Moderation.onUserUpdate": function(topic, args) {
		var target = this.component;
		var source = args.item;
		if (target.get("data.actor.id") !== source.data.actor.id) return;
		target.set("data.actor." + (args.field === "state" ? "status" : args.field), args.value);
		target.render();
		return {"stop": ["bubble"]};
	}
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"approveButton": "Approve",
	/**
	 * @echo_label
	 */
	"deleteButton": "Delete",
	/**
	 * @echo_label
	 */
	"spamButton": "Spam",
	/**
	 * @echo_label
	 */
	"untouchButton": "Untouch",
	/**
	 * @echo_label
	 */
	"changingStatusToCommunityFlagged": "Flagging...",
	/**
	 * @echo_label
	 */
	"changingStatusToModeratorApproved": "Approving...",
	/**
	 * @echo_label
	 */
	"changingStatusToModeratorDeleted": "Deleting...",
	/**
	 * @echo_label
	 */
	"changingStatusToUserDeleted": "Deleting...",
	/**
	 * @echo_label
	 */
	"changingStatusToUntouched": "Untouching...",
	/**
	 * @echo_label
	 */
	"changingStatusToModeratorFlagged": "Marking as spam...",
	/**
	 * @echo_label
	 */
	"statusCommunityFlagged": "Flagged by Community",
	/**
	 * @echo_label
	 */
	"statusModeratorApproved": "Approved by Moderator",
	/**
	 * @echo_label
	 */
	"statusModeratorDeleted": "Deleted by Moderator",
	/**
	 * @echo_label
	 */
	"statusUserDeleted": "Deleted by User",
	/**
	 * @echo_label
	 */
	"statusModeratorFlagged": "Flagged by Moderator",
	/**
	 * @echo_label
	 */
	"statusSystemFlagged": "Flagged by System",
	/**
	 * @echo_label
	 */
	"banUser": "Ban User",
	/**
	 * @echo_label
	 */
	"unbanUser": "Unban",
	/**
	 * @echo_label
	 */
	"userBanned": "Banned User",
	/**
	 * @echo_label
	 */
	"processingAction": "Setting up '{state}' user state...",
	/**
	 * @echo_label
	 */
	"moderatorRole": "Moderator",
	/**
	 * @echo_label
	 */
	"administratorRole": "Administrator",
	/**
	 * @echo_label
	 */
	"userButton": "Demote to User",
	/**
	 * @echo_label
	 */
	"moderatorButton": "Promote to Moderator",
	/**
	 * @echo_label
	 */
	"administratorButton": "Promote to Admin",
	/**
	 * @echo_label
	 */
	"setRoleAction": "Setting up '{role}' role...",
	/**
	 * @echo_label
	 */
	"unsetRoleAction": "Removing '{role}' role...",
	/**
	 * @echo_label
	 */
	"statusUntouched": "New"
};

/**
 * @echo_template
 */
plugin.templates.buttonLabels = {
	"banned": '<span class="{plugin.class:button-state} {plugin.class:button-state-banned}">{plugin.label:userBanned}</span>' +
		'(<span class="echo-clickable">{plugin.label:unbanUser}</span>)',
	"unbanned": '<span class="echo-clickable">{plugin.label:banUser}</span>'
};

/**
 * @echo_template
 */
plugin.templates.status =
	'<div class="{plugin.class:status}">' +
		'<div class="{plugin.class:statusIcon}"></div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

/**
 * @echo_renderer
 */
plugin.renderers.status = function(element) {
	var item = this.component;
	if (!item.user.is("admin")) {
		element.hide();
		return element;
	}
	if (item.get("depth")) {
		element.addClass(this.cssPrefix + 'status-child');
	}
	var status = item.get("data.object.status") || "Untouched";
	return element.addClass(this.cssPrefix + "status-" + status);
};

/**
 * @echo_renderer
 */
plugin.renderers.statusIcon = function(element) {
	var item = this.component;
	if (!item.user.is("admin")) return element;
	var status = item.get("data.object.status") || "Untouched";
	var title = this.labels.get("status" + status);
	return element.addClass(this.cssPrefix + "status-icon-" + status).attr("title", title);
};

plugin.statuses = [
	"Untouched",
	"ModeratorApproved",
	"ModeratorDeleted",
	"UserDeleted",
	"CommunityFlagged",
	"ModeratorFlagged",
	"SystemFlagged"
];

plugin.button2status = {
	"Spam": "ModeratorFlagged",
	"Delete": "ModeratorDeleted",
	"Approve": "ModeratorApproved",
	"Untouch": "Untouched"
};

plugin.actionButtons = {
	"ban": ["Ban", "UnBan"],
	"permissions": ["UserPermissions"]
};

plugin.roles = ["", "moderator", "administrator"];

plugin.methods._changeItemStatus = function(status) {
	var item = this.component;
	this.set("selected", false);
	item.set("data.object.status", status);
	item.view.render({"name": "buttons"});
	// rerender status recursive
	// since it contains other renderers
	this.view.render({
		"name": "status",
		"recursive": true
	});
};

plugin.methods._sendRequest = function(data, callback, errorCallback) {
	StreamServerAPI.request({
		"endpoint": "submit",
		"secure": this.config.get("useSecureAPI", false, true),
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"onData": callback,
		"onError": errorCallback,
		"data": data
	}).send();
};

plugin.methods._publishCompleteActionEvent = function(args) {
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onApproveComplete
	 * Triggered if "Approve" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onSpamComplete
	 * Triggered if "Spam" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onDeleteComplete
	 * Triggered if "Delete" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUntouchComplete
	 * Triggered if "Untouch" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onBanComplete
	 * Triggered if "Ban" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUnBanComplete
	 * Triggered if "UnBan" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUserPermissionsComplete
	 * Triggered if "UserPermissions" operation was completed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onApproveError
	 * Triggered if "Approve" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onSpamError
	 * Triggered if "Spam" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onDeleteError
	 * Triggered if "Delete" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUntouchError
	 * Triggered if "Untouch" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onBanError
	 * Triggered if "Ban" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUnBanError
	 * Triggered if "UnBan" operation failed.
	 */
	/**
	 * @echo_event Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUserPermissionsError
	 * Triggered if "UserPermissions" operation failed.
	 */
	this.events.publish({
		"topic": "on" + args.name + args.state,
		"data": {
			"item": {
				"data": this.component.get("data"),
				"target": this.component.get("view.content")
			},
			"response": args.response
		}
	});
};

plugin.methods._assembleButton = function(name) {
	var self = this;
	var getStatus = function(item) {
		var status = plugin.button2status[name];
		if (!item.user.is("admin") &&
			name === "Delete" &&
			self.config.get("removePersonalItemsAllowed") &&
			item.user.has("identity", item.data.actor.id)
		) {
			status = "UserDeleted";
		}
		return status;
	};
	var callback = function() {
		var item = this;
		var status = getStatus(item);
		item.block(self.labels.get("changingStatusTo" + status));
		var activity = {
			"verbs": ["http://activitystrea.ms/schema/1.0/update"],
			"targets": [{"id": item.get("data.object.id")}],
			"actor": {"title": item.get("data.actor.id")},
			"object": {
				"state": status
			}
		};
		self._sendRequest({
			"content": activity,
			"appkey": item.config.get("appkey"),
			"sessionID": item.user.get("sessionID"),
			"target-query": item.config.get("parent.query")
		}, function(response) {
			self._publishCompleteActionEvent({
				"name": name,
				"state": "Complete",
				"response": response
			});
			self._changeItemStatus(status);
			self.requestDataRefresh();
		}, function(response) {
			self._publishCompleteActionEvent({
				"name": name,
				"state": "Error",
				"response": response
			});
			item.unblock();
		});
	};
	return function() {
		var item = this;
		var status = getStatus(item);
		return {
			"name": name,
			"label": self.labels.get(name.toLowerCase() + "Button"),
			"visible": item.get("data.object.status") !== status &&
					(item.user.is("admin") || status === "UserDeleted"),
			"callback": callback
		};
	};
};

plugin.methods._sendUserUpdate = function(config) {
	var item = this.component;
	IdentityServerAPI.request({
		"endpoint": "update",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"secure": this.config.get("useSecureAPI", false, true),
		"data": {
			"content": {
				"field": config.field,
				"value": config.value,
				"identityURL": item.get("data.actor.id"),
				"username": item.get("data.actor.title")
			},
			"appkey": item.config.get("appkey"),
			"sessionID": item.user.get("sessionID", ""),
			"target-query": item.config.get("parent.query", "")
		},
		"onData": config.onData,
		"onError": function() {
			item.render();
		}
	}).send();
};

plugin.methods._assembleBanButton = function(action) {
	var self = this;
	var callback = function() {
		var item = this;
		var newState = action === "Ban" ? "ModeratorBanned" : "Untouched";
		item.get("buttons." + plugin.name + "." + action + ".element")
			.empty()
			.append(self.labels.get("processingAction", {"state": newState}));
		self._sendUserUpdate({
			"field": "state",
			"value": newState,
			"onData": function(response) {
				self._publishCompleteActionEvent({
					"name": action,
					"state": "Complete",
					"response": response
				});
				self._publishUserUpdateEvent({
					"item": item,
					"field": "state",
					"value": newState
				});
			},
			"onError": function(response) {
				self._publishCompleteActionEvent({
					"name": action,
					"state": "Error",
					"response": response
				});
			}
		});
	};
	return function() {
		var item = this;
		var isBanned = self._isUserBanned();
		var visible = item.get("data.actor.id") !== item.user.config.get("fakeIdentityURL") &&
			isBanned ^ (action === "Ban");
		return {
			"name": action,
			"label": self.substitute({"template": plugin.templates.buttonLabels[isBanned ? "banned" : "unbanned"]}),
			"visible": visible && item.user.is("admin"),
			"callback": callback,
			"once": true
		};
	};
};

plugin.methods._assemblePermissionsButton = function(action) {
	var self = this;
	var callback = function() {
		var item = this;
		var role = self._getRole();
		var next = self._getNextRole(role);
		var roles = next !== ""
			? (item.get("data.actor.roles") || []).concat(next)
			: Utils.foldl([], item.get("data.actor.roles") || [], function(_role, acc) {
				if ($.inArray(_role, plugin.roles) < 0) acc.push(_role);
			});
		var label = next === "" ? "unset" : "set";
		item.get("buttons." + plugin.name + "." + action + ".element")
			.empty()
			.append(self.labels.get(label + "RoleAction", {"role": next || role}));
		self._sendUserUpdate({
			"field": "roles",
			"value": roles.length ? roles.join(",") : "-",
			"onData": function(response) {
				self._publishCompleteActionEvent({
					"name": action,
					"state": "Complete",
					"response": response
				});
				self._publishUserUpdateEvent({
					"item": item,
					"field": "roles",
					"value": roles
				});
			},
			"onError": function(response) {
				self._publishCompleteActionEvent({
					"name": action,
					"state": "Error",
					"response": response
				});
			}
		});
	};
	return function() {
		var item = this;
		var role = self._getRole();
		var template = role
			? '<span class="{plugin.class:button-role} {plugin.class:button-role}-{data:role}">{data:label}</span>' +
				'(<span class="echo-clickable">{data:button}</span>)'
			: '<span class="echo-clickable">{data:button}</span>';

		var label = self.substitute({
			"template": template,
			"data": {
				"role": role,
				"label": role ? self.labels.get(role + "Role") : "",
				"button": self.labels.get((self._getNextRole(role) || "user") + "Button")
			}
		});
		return {
			"name": action,
			"label": label,
			"visible": item.get("data.actor.id") !== item.user.config.get("fakeIdentityURL") &&
				item.user.any("roles", ["administrator"]),
			"callback": callback,
			"once": true
		};
	};
};

plugin.methods._publishUserUpdateEvent = function(data) {
	this.events.publish({
		"topic": "onUserUpdate",
		"data": {
			"item": data.item,
			"field": data.field,
			"value": data.value
		},
		"global": false,
		"propagation": false
	});
	this.requestDataRefresh();
};

plugin.methods._isUserBanned = function() {
	return this.component.get("data.actor.status") === "ModeratorBanned";
};

plugin.methods._getRole = function() {
	var result = "";
	$.each(this.component.get("data.actor.roles") || [], function(id, role) {
		if ($.inArray(role, plugin.roles) > 0) {
			result = role;
			if (role === "administrator") {
				return false; // break;
			}
		}
	});
	return result;
};

plugin.methods._getNextRole = function(role) {
	return plugin.roles[($.inArray(role, plugin.roles) + 1) % plugin.roles.length];
};

plugin.css = function() {
	return '.{plugin.class:status} { width: 48px; height: 24px; }' +
		'.{plugin.class:status-child} { width: 24px; height: 24px; }' +
		'.{plugin.class:statusIcon} { float: right; margin: 4px; width: 16px; height: 16px; }' +
		// statuses
		'.{plugin.class:status-Untouched} { background: #00aaff; }' +
		'.{plugin.class:status-ModeratorApproved} { background: #bdfb6d; }' +
		'.{plugin.class:status-ModeratorDeleted} { background: #f20202; }' +
		'.{plugin.class:status-UserDeleted} { background: #ff8e8e; }' +
		'.{plugin.class:status-SystemFlagged}, .{plugin.class:status-CommunityFlagged}, .{plugin.class:status-ModeratorFlagged} { background: #ff9e00; }' +
		// buttons
		'.{plugin.class:button-state} { margin-right: 3px; }' +
		'.{plugin.class:button-state-banned} { color: #FF0000; }' +
		'.{plugin.class:button-role} { margin-right: 3px; }' +
		'.{plugin.class:button-role-moderator} { color: #0000FF; }' +
		'.{plugin.class:button-role-administrator} { color: #008000; }' +
		// status icons
		$.map(plugin.statuses, function(name) {
			return '.{plugin.class:status-icon-' + name + '} { background: url({config:cdnBaseURL.sdk-assets}/images/curation/status/' + name.toLowerCase() + '.png) no-repeat; }';
		}).join("");
}();

return Plugin.create(plugin);

});

define("echo/streamserver/plugins/streamItemModeration", [
	"jquery",
	"echo/plugin"
], function($, Plugin) {
"use strict";

var plugin = Plugin.manifest("Moderation", "Echo.StreamServer.Controls.Stream");

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUserUpdate": function(topic, args) {
		this.events.publish({
			"topic": "onUserUpdate",
			"data": args,
			"global": false
		});
		return {"stop": ["bubble"]};
	}
};

return Plugin.create(plugin);
});
