/**
 * @class Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation
 * Adds several moderation controls to change item status. Besides it provides the opportunity to ban specific user or change his privileges.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Moderation"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Moderation", "Echo.StreamServer.Controls.Stream.Item");

var capitalize = function(string) {
	return string.replace(/\b[a-z]/g, function(match) {
		return match.toUpperCase();
	});
};

plugin.config = {
/**
 * @cfg {Array} userActions Defines the list of user specific actions to be added to the Echo Stream Item.
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Moderation"
 * 			"userActions": ["ban", "permissions"],
 * 		}]
 * 	});
 */
	"userActions": ["ban", "permissions"],
/**
 * @cfg {Array} itemActions Defines the list of item specific actions to be added to the Echo Stream Item.
 * 	new Echo.StreamServer.Controls.Stream({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "test.echoenabled.com",
 * 		"plugins": [{
 * 			"name": "Moderation"
 * 			"itemActions": ["approve", "spam", "delete", "untouch"]
 * 		}]
 * 	});
 */
	"itemActions": ["approve", "spam", "delete"]
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation.onUserUpdate": function(topic, args) {
		args.item.set("data.actor." + args.field, args.value);
		args.item.dom.render();
		return {"stop": ["bubble"]};
	}
};

plugin.actionButtons = {
	"ban": ["Ban", "UnBan"],
	"permissions": ["UserPermissions"]
};

plugin.init = function() {
	var self = this;
	var item = this.component;
	var actions = this.config.get("itemActions").concat(this.config.get("userActions"));
	this.extendTemplate("insertAfter", "avatar", plugin.statusItemTemplate);
	$.each(actions, function(i, action) {
		var buttons = plugin.actionButtons[action];
		if (buttons && $.isArray(buttons)) {
			$.each(buttons, function(j, button) {
				item.addButtonSpec("Moderation", self["_assemble" + capitalize(action) + "Button"](button));
			});
		} else {
			item.addButtonSpec("Moderation", self._assembleButton(capitalize(action)));
		}
	});
};

plugin.roles = ["", "moderator", "administrator"];

plugin.statusItemTemplate = 
	'<div class="{plugin.class:status}">' +
		'<div class="{plugin.class:statusIcon}"></div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

plugin.labels = {
	"approveButton": "Approve",
	"deleteButton": "Delete",
	"spamButton": "Spam",
	"untouchButton": "Untouch",
	"changingStatusToCommunityFlagged": "Flagging...",
	"changingStatusToModeratorApproved": "Approving...",
	"changingStatusToModeratorDeleted": "Deleting...",
	"changingStatusToUntouched": "Untouching...",
	"changingStatusToModeratorFlagged": "Marking as spam...",
	"statusCommunityFlagged": "Flagged by Community",
	"statusModeratorApproved": "Approved by Moderator",
	"statusModeratorDeleted": "Deleted by Moderator",
	"statusModeratorFlagged": "Flagged by Moderator",
	"statusSystemFlagged": "Flagged by System",
	"banUser": "Ban User",
	"unbanUser": "Unban",
	"userBanned": "Banned User",
	"processingAction": "Setting up '{state}' user state...",
	"moderatorRole": "Moderator",
	"administratorRole": "Administrator",
	"userButton": "Demote to User",
	"moderatorButton": "Promote to Moderator",
	"administratorButton": "Promote to Admin",
	"setRoleAction": "Setting up '{role}' role...",
	"unsetRoleAction": "Removing '{role}' role...",
	"statusUntouched": "New"
};

plugin.buttonLabels = {
	"banned": '<span class="{plugin.class:button-state} {plugin.class:button-state-banned}">{plugin.label:userBanned}</span>' +
		'(<span class="echo-clickable">{plugin.label:unbanUser}</span>)',
	"unbanned": '<span class="echo-clickable">{plugin.label:banUser}</span>'
};

plugin.statuses = [
	"Untouched",
	"ModeratorApproved",
	"ModeratorDeleted",
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

plugin.renderers.statusIcon = function(element) {
	var item = this.component;
	if (!item.user.is("admin")) return element;
	var status = item.get("data.object.status") || "Untouched";
	var title = this.labels.get("status" + status);
	return element.addClass(this.cssPrefix + "status-icon-" + status).attr("title", title);
};

plugin.methods._changeItemStatus = function(status) {
	var item = this.component;
	this.set("selected", false);
	item.set("data.object.status", status);
	item.dom.render({"name": "buttons"});
	// rerender status recursive
	// since it contains other renderers
	this.dom.render({
		"name": "status",
		"recursive": true
	});
};

plugin.methods._sendRequest = function(data, callback, errorCallback) {
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"onData": callback,
		"onError": errorCallback,
		"data": data
	}).send();
};

plugin.methods._publishCompleteActionEvent = function(name) {
	this.events.publish({
		"topic": "on" + name + "Complete",
		"data": {
			"item": {
				"data": this.component.get("data"),
				"target": this.component.get("dom.content")
			}
		},
		"bubble": true
	});
};

plugin.methods._assembleButton = function(name) {
	var self = this;
	var callback = function() {
		var item = this;
		var status = plugin.button2status[name];
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
		}, function(data) {
			self._publishCompleteActionEvent(name);
			self._changeItemStatus(status);
			self.requestDataRefresh();
		}, function() {
			item.unblock();
		});
	};
	return function() {
		var item = this;
		return {
			"name": name,
			"label": self.labels.get(name.toLowerCase() + "Button"),
			"visible": item.user.is("admin") &&
					item.get("data.object.status") !== plugin.button2status[name],
			"callback": callback
		};
	};
};

plugin.methods._sendUserUpdate = function(config) {
	var item = this.component;
	Echo.IdentityServer.API.request({
		"endpoint": "update",
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
			item.dom.render();
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
			"onData": function(data) {
				self._publishCompleteActionEvent(action);
				self._publishUserUpdateEvent({
					"item": item,
					"field": "state",
					"value": newState
				});
			}
		});
	};
	return function() {
		var item = this;
		var isBanned = self._isUserBanned();
		var visible = item.get("data.actor.id") != item.user.get("fakeIdentityURL") &&
			isBanned ^ (action === "Ban");
		return {
			"name": action,
			"label": self.substitute(plugin.buttonLabels[isBanned ? "banned" : "unbanned"]),
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
		var roles = next != ""
			? (item.get("data.actor.roles") || []).concat(next)
			: Echo.Utils.foldl([], item.get("data.actor.roles") || [], function(_role, acc) {
				if ($.inArray(_role, plugin.roles) < 0) acc.push(_role);
			});
		var label = next == "" ? "unset" : "set";
		item.get("buttons." + plugin.name + "." + action + ".element")
			.empty()
			.append(self.labels.get(label + "RoleAction", {"role": next || role}));
		self._sendUserUpdate({
			"field": "roles",
			"value": roles.length ? roles.join(",") : "-",
			"onData": function(data) {
				self._publishCompleteActionEvent(action);
				self._publishUserUpdateEvent({
					"item": item,
					"field": "roles",
					"value": roles
				});
			}
		});
	};
	return function() {
		var item = this;
		var role = self._getRole();
		var template = (role
			? '<span class="{plugin.class:button-role} {plugin.class:button-role}-{data:role}">{data:label}</span>' +
				'(<span class="echo-clickable">{data:button}</span>)'
			: '<span class="echo-clickable">{data:button}</span>'
		);
		var label = self.substitute(template, {
			"role": role,
			"label": role ? self.labels.get(role + "Role") : "",
			"button": self.labels.get((self._getNextRole(role) || "user") + "Button")
		});
		return {
			"name": action,
			"label": label,
			// FIXME: add fakeIdentityURL to UserSession
			"visible": item.get("data.actor.id") != item.user.get("fakeIdentityURL") &&
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
	var msieCss = "";
	if ($.browser.msie) {
		msieCss =
			'.{plugin.class:status} { zoom: 1; }';
	};
	return '.{plugin.class:status} { width: 48px; height: 24px; }' +
		'.{plugin.class:status-child} { width: 24px; height: 24px; }' +
		'.{plugin.class:statusIcon} { float: right; margin: 4px; width: 16px; height: 16px; }' +
		// statuses
		'.{plugin.class:status-Untouched} { background: #00aaff; }' +
		'.{plugin.class:status-ModeratorApproved} { background: #bdfb6d; }' +
		'.{plugin.class:status-ModeratorDeleted} { background: #f20202; }' +
		'.{plugin.class:status-SystemFlagged}, .{plugin.class:status-CommunityFlagged}, .{plugin.class:status-ModeratorFlagged} { background: #ff9e00; }' +
		// buttons
		'.{plugin.class:button-state} { margin-right: 3px; }' +
		'.{plugin.class:button-state-banned} { color: #FF0000; }' +
		'.{plugin.class:button-role} { margin-right: 3px; }' +
		'.{plugin.class:button-role-moderator} { color: #0000FF; }' +
		'.{plugin.class:button-role-administrator} { color: #008000; }' +
		// status icons
		$.map(plugin.statuses, function(name) {
			return '.{plugin.class:status-icon-' + name + '} { background: url("//cdn.echoenabled.com/images/curation/status/' + name.toLowerCase() + '.png") no-repeat; }';
		}).join("") + msieCss;
}();

Echo.Plugin.create(plugin);
