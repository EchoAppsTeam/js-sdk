// vim: set ts=8 sts=8 sw=8 noet:
/*
 * Copyright (c) 2006-2011 Echo <solutions@aboutecho.com>. All rights reserved.
 * You may copy and modify this script as long as the above copyright notice,
 * this condition and the following disclaimer is left intact.
 * This software is provided by the author "AS IS" and no warranties are
 * implied, including fitness for a particular purpose. In no event shall
 * the author be liable for any damages arising in any way out of the use
 * of this software, even if advised of the possibility of such damage.
 */

var plugin = Echo.createPlugin({
	"name": "UserMetadataManager",
	"applications": ["Stream"],
	"init": function(plugin, application) {
		var controls = plugin.config.get(application, "controls");
		$.each(controls, function(i, control) {
			control.field = plugin.getField(control);
			if (!control.field) return;
			plugin.addItemControl(application,
				plugin.assembleControl("SetUserProperty", control, application));
			plugin.addItemControl(application,
				plugin.assembleControl("UnsetUserProperty", control, application));
		});
	}
});

plugin.addLabels({
	"setPropertyProcessing": "Adding '{value}' {name}...",
	"unsetPropertyProcessing": "Removing '{value}' {name}..."
});

plugin.assembleControl = function(action, control, application) {
	var name = action + "-" + control.field.value.replace(/[^a-z0-9_-]/ig, '');
	var operation = action.match(/^(.*)UserProperty$/)[1];
	var callback = function() {
		var item = this;
		var actor = item.data.actor;
		var field = plugin.getUpdatedUserProperty(operation.toLowerCase(),
								control.field, actor);
		var label = operation.toLowerCase() + "PropertyProcessing";
		item.controls[plugin.name + "." + name].element
			.empty()
			.append(plugin.label(label, control.field));
		var value = field.name == "state"
			? field.value
			: field.value.length ? field.value.join(",") : "-";
		$.get(plugin.config.get(application, "submissionProxyURL", "", true), {
			"appkey": application.config.get("appkey"),
			"content": $.object2JSON({
				"endpoint": "users/update",
				"field": field.name,
				"value": value,
				"identityURL": actor.id,
				"username": actor.title
			}),
			"sessionID": application.user.get("sessionID", "")
		}, function(data) {
			if (!data || data.result == "error") {
				item.rerender();
				return;
			}
			$.map(application.threads, function(thread) {
				thread.traverse(thread.children, function(child) {
					plugin.applyUserUpdate(child, item, field);
				});
				plugin.applyUserUpdate(thread, item, field);
			});
		}, "jsonp");
	};
	return function() {
		var item = this;
		return {
			"name": name,
			"label": control["label" + operation],
			"visible": plugin.isControlVisible(application, item,
						control, operation.toLowerCase()),
			"onetime": true,
			"callback": callback
		};
	};
};

plugin.getField = function(control) {
	var name;
	$.map(["roles", "state", "markers"], function(_name) {
		if (control[_name]) {
			name = _name;
			return false; // break
		}
	});
	return name ? {"name": name, "value": control[name]} : undefined;
};

plugin.getUpdatedUserProperty = function(action, field, actor) {
	var value;
	if (field.name == "state") {
		value = action == "set" ? field.value : "Untouched";
	} else {
		var list = field.value.split(",");
		value = $.foldl([], actor[field.name] || [], function(name, acc) {
			if ($.inArray(name, list) < 0) acc.push(name);
		});
		value = action == "set" ? value.concat(list) : value;
	}
	return {"name": field.name, "value": value};
};

plugin.applyUserUpdate = function(target, source, field) {
	if (target.data.actor.id != source.data.actor.id) return;
	target.data.actor[field.name == "state" ? "status" : field.name] = field.value;
	target.rerender();
};

plugin.isSubset = function(target, full) {
	if (!full || !full.length) return false;
	return !($.foldl([], target || [], function(item, acc) {
		if ($.inArray(item, full) < 0) acc.push(item);
	})).length;
};

plugin.isControlVisible = function(application, item, control, operation) {
	var actor = item.data.actor;
	if (actor.id == item.user.get("fakeIdentityURL") || !item.user.isAdmin()) {
		return false;
	}
	if (control.field.name == "state") {
		return (actor.status == control.field.value) ^ (operation == "set");
	}
	if (control.field.name == "roles" && !item.user.hasAny("roles", ["administrator"])) {
		return false;
	}
	return plugin.isSubset(control.field.value.split(","), actor[control.field.name]) ^ (operation == "set");
};
