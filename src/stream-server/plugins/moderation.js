(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.Moderation
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
var plugin = Echo.Plugin.skeleton("Moderation", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

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

plugin.actionButtons = {
	"ban": ["Ban", "UnBan"],
	"permissions": ["UserPermissions"]
};

plugin.init = function() {
	var self = this;
	var item = this.component;
	var actions = this.config.get("itemActions").concat(this.config.get("userActions"));
	this.extendRenderer("status", plugin.renderers.Item.status);
	this.extendRenderer("statusIcon", plugin.renderers.Item.statusIcon);
	this.extendTemplate(plugin.statusItemTemplate,
		"insertAfter", "avatar");
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
	this.component.labels.set({
		"userBanned": this.labels.get("userBanned"),
		"unbanUser": this.labels.get("unbanUser"),
		"banUser": this.labels.get("banUser")
	});
	this.events.subscribe({
		"topic": "internal.Echo.StreamServer.Controls.Stream.Item.Plugin.Moderation.onUserUpdate",
		"handler": function(topic, args) {
			if (args.item.data.actor.id !== item.data.actor.id) return;
			item.data.actor[args.data.field] = args.data.value;
			item.render();
			return {"stop": ["bubble"]};
		}
	});
};

plugin.roles = ["", "moderator", "administrator"];

plugin.statusItemTemplate = 
	'<div class="{class:status}">' +
		'<div class="{class:statusIcon}"></div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

plugin.labels = {
	"approveControl": "Approve",
	"deleteControl": "Delete",
	"spamControl": "Spam",
	"untouchControl": "Untouch",
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
	"userControl": "Demote to User",
	"moderatorControl": "Promote to Moderator",
	"administratorControl": "Promote to Admin",
	"setRoleAction": "Setting up '{role}' role...",
	"unsetRoleAction": "Removing '{role}' role...",
	"statusUntouched": "New"
};

plugin.controlLabels = {
	"banned": '<span class="{class:control-state} {class:control-state-banned}">{label:userBanned}</span>' +
		'(<span class="echo-clickable">{label:unbanUser}</span>)',
	"unbanned": '<span class="echo-clickable">{label:banUser}</span>'
};

plugin.statuses = [
	"Untouched",
	"ModeratorApproved",
	"ModeratorDeleted",
	"CommunityFlagged",
	"ModeratorFlagged",
	"SystemFlagged"
];

plugin.control2status = {
	"Spam": "ModeratorFlagged",
	"Delete": "ModeratorDeleted",
	"Approve": "ModeratorApproved",
	"Untouch": "Untouched"
};

plugin.renderers = {"Item": {}};

plugin.renderers.Item.status = function(element) {
	var item = this.component;
	if (!item.user.is("admin")) {
		element.hide();
		return element;
	}
	if (item.depth) {
		element.addClass(item.cssPrefix + '-status-child');
	}
	var status = item.data.object.status || "Untouched";
	return element.addClass(item.cssPrefix + "-status-" + status);
};

plugin.renderers.Item.statusIcon = function(element) {
	var item = this.component;
	if (!item.user.is("admin")) return element;
	var status = item.data.object.status || "Untouched";
	var title = this.labels.get("status" + status);
	return element.addClass(item.cssPrefix + "-status-icon-" + status).attr("title", title);
};

plugin.methods._changeItemStatus = function(item, status) {
	this.set("selected", false);
	item.data.object.status = status;
	item.render({"element": "controls"});
	// rerender status recursive
	// since it contains other renderers
	item.render({
		"element": "status",
		"recursive": true
	});
};

plugin.methods._sendRequest = function(data, callback, errorCallback) {
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"onData": callback,
		"onError": errorCallback,
		"data": data,
	}).send();
};

plugin.methods._assembleButton = function(name) {
	var self = this;
	var callback = function() {
		var item = this;
		var status = plugin.control2status[name];
		item.block(self.labels.get("changingStatusTo" + status));
		var activity = {
			"verbs": ["http://activitystrea.ms/schema/1.0/update"],
			"targets": [{"id": item.get("data.object.id")}],
			"actor": {"title": item.data.actor.id},
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
			self._changeItemStatus(item, status);
			self.requestDataRefresh();
		}, function() {
			item.unblock();
		});
	};
	return function() {
		var item = this;
		return {
			"name": name,
			"label": self.labels.get(name.toLowerCase() + "Control"),
			"visible": item.user.is("admin") &&
					item.data.object.status !== plugin.control2status[name],
			"callback": callback
		};
	};
};

plugin.methods._sendUserUpdate = function(config, item) {
	Echo.IdentityServer.API.request({
		"endpoint": "update",
		"data": {
			"content": {
				"field": config.field,
				"value": config.value,
				"identityURL": item.data.actor.id,
				"username": item.data.actor.title
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

plugin.methods._assembleBanButton = function(action, application) {
	var self = this;
	var callback = function() {
		var item = this;
		var newState = action == "Ban" ? "ModeratorBanned" : "Untouched";
		item.buttons[plugin.name + "." + action].element
			.empty()
			.append(self.labels.get("processingAction", {"state": newState}));
		self._sendUserUpdate({
			"field": "state",
			"value": newState,
			"onData": function(data) {
				self._publishUserUpdateEvent({
					"item": item,
					"field": "state",
					"value": newState
				});
			}
		}, item);
	};
	return function() {
		var item = this;
		var isBanned = self._isUserBanned(item);
		var visible = item.data.actor.id != item.user.get("fakeIdentityURL") &&
			isBanned ^ (action == "Ban");
		return {
			"name": action,
			"label": item.substitute(plugin.controlLabels[isBanned ? "banned" : "unbanned"]),
			"visible": visible && item.user.is("admin"),
			"callback": callback,
			"onetime": true
		};
	};
};

plugin.methods._assemblePermissionsButton = function(action) {
	var self = this;
	var callback = function() {
		var item = this;
		var role = self._getRole(item);
		var next = self._getNextRole(role);
		var roles = next != ""
			? (item.data.actor.roles || []).concat(next)
			: Echo.Utils.foldl([], item.data.actor.roles || [], function(_role, acc) {
				if ($.inArray(_role, plugin.roles) < 0) acc.push(_role);
			});
		var label = next == "" ? "unset" : "set";
		item.buttons[plugin.name + "." + action].element
			.empty()
			.append(self.labels.get(label + "RoleAction", {"role": next || role}));
		self._sendUserUpdate({
			"field": "roles",
			"value": roles.length ? roles.join(",") : "-",
			"onData": function(data) {
				self._publishUserUpdateEvent({
					"item": item,
					"field": "roles",
					"value": roles
				});
			}
		}, item);
	};
	return function() {
		var item = this;
		var role = self._getRole(item);
		var template = (role
			? '<span class="{class:control-role} {class:control-role}-{data:role}">{data:label}</span>' +
				'(<span class="echo-clickable">{data:button}</span>)'
			: '<span class="echo-clickable">{data:button}</span>'
		);
		var label = item.substitute(template, {
			"role": role,
			"label": role ? self.labels.get(role + "Role") : "",
			"button": self.labels.get((self._getNextRole(role) || "user") + "Control")
		});
		return {
			"name": action,
			"label": label,
			"visible": item.data.actor.id != item.user.get("fakeIdentityURL") &&
				item.user.any("roles", ["administrator"]),
			"callback": callback,
			"onetime": true
		};
	};
};

plugin.methods._publishUserUpdateEvent = function(data) {
	this.events.publish({
		"topic": "onUserUpdate",
		"prefix": "internal",
		"bubble": true,
		"data": {
			"item": data.item,
			"field": data.field,
			"value": data.value
		}
	});
	this.requestDataRefresh();
};

plugin.methods._isUserBanned = function(item) {
	return item.data.actor.status == "ModeratorBanned";
};

plugin.methods._getRole = function(item) {
	var result = "";
	$.each(item.data.actor.roles || [], function(id, role) {
		if ($.inArray(role, plugin.roles) > 0) {
			result = role;
			if (role == "administrator") {
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
			'.{class:status} { zoom: 1; }';
	};
	return '.{class:status} { width: 48px; height: 24px; }' +
		'.{class:status-child} { width: 24px; height: 24px; }' +
		'.{class:status-child} .{class:statusCheckbox} { display: block; }' +
		'.{class:statusIcon} { float: right; margin: 4px; width: 16px; height: 16px; }' +
		// statuses
		'.{class:status-Untouched} { background: #00aaff; }' +
		'.{class:status-ModeratorApproved} { background: #bdfb6d; }' +
		'.{class:status-ModeratorDeleted} { background: #f20202; }' +
		'.{class:status-SystemFlagged}, .{class:status-CommunityFlagged}, .{class:status-ModeratorFlagged} { background: #ff9e00; }' +
		// controls
		'.{class:control-state} { margin-right: 3px; }' +
		'.{class:control-state-banned} { color: #FF0000; }' +
		'.{class:control-role} { margin-right: 3px; }' +
		'.{class:control-role-moderator} { color: #0000FF; }' +
		'.{class:control-role-administrator} { color: #008000; }' +
		// status icons
		$.map(plugin.statuses, function(name) {
			return '.{class:status-icon-' + name + '} { background: url("//cdn.echoenabled.com/images/curation/status/' + name.toLowerCase() + '.png") no-repeat; }';
		}).join("") + msieCss;
}();

Echo.Plugin.create(plugin);

})(jQuery);
