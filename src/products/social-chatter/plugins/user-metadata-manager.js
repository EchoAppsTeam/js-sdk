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
(function() {
var plugin = Echo.Plugin.manifest("UserMetadataManager", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this;
	var component = this.component;
	var controls = this.config.get("controls");
	$.each(controls, function(i, control) {
		control.field = self._getField(control);
		if (!control.field) return;

		component.addButtonSpec(self.name,
			self._assembleControl("SetUserProperty", control));

		component.addButtonSpec(self.name,
			self._assembleControl("UnsetUserProperty", control));

	});
};

plugin.labels = {
	"setPropertyProcessing": "Adding '{value}' {name}...",
	"unsetPropertyProcessing": "Removing '{value}' {name}..."
};

plugin.methods._assembleControl = function(action, control) {
	var self = this;
	var component = this.component;
	var name = action + "-" + control.field.value.replace(/[^a-z0-9_-]/ig, '');
	var operation = action.match(/^(.*)UserProperty$/)[1];
	var callback = function() {
		var item = this;
		var actor = item.data.actor;
		var field = self._getUpdatedUserProperty(operation.toLowerCase(),
			control.field, actor);
		var label = operation.toLowerCase() + "PropertyProcessing";
		item.get("buttons." + self.name + "." + name + ".element")
			.empty()
			.append(self.labels.get(label, control.field));

		var value = field.name == "state"
			? field.value
			: field.value.length ? field.value.join(",") : "-";

		var request = new Echo.IdentityServer.API.Request({
			"endpoint": "update",
			"submissionProxyURL": component.config.get("submissionProxyURL", "", true),
			"data": {
				"content": {
					"field": field.name,
					"value": value,
					"identityURL": actor.id,
					"username": actor.title
				},
				"appkey": component.config.get("appkey"),
				"sessionID": component.user.get("sessionID"),
				"target-query": component.config.get("parent.query")
			},
			"onData": function(data) {
				if (!data || data.result == "error") {
					item.dom.render();
					return;
				}
				self.events.publish({
					"topic": "onUserUpdate",
					"data": {
						"item": component,
						"field": field
					},
					"global": false,
					"propagation": false
				});
			}
		});
		request.send();
	};
	return function() {
		return {
			"name": name,
			"label": control["label" + operation],
			"visible": self._isControlVisible(control, operation.toLowerCase()),
			"once": true,
			"callback": callback
		};
	};
};

plugin.methods._getField = function(control) {
	var name;
	$.map(["roles", "state", "markers"], function(_name) {
		if (control[_name]) {
			name = _name;
			return false; // break
		}
	});
	return name ? {"name": name, "value": control[name]} : undefined;
};

plugin.methods._getUpdatedUserProperty = function(action, field, actor) {
	var value;
	if (field.name == "state") {
		value = action == "set" ? field.value : "Untouched";
	} else {
		var list = field.value.split(",");
		value = Echo.Utils.foldl([], actor[field.name] || [], function(name, acc) {
			if ($.inArray(name, list) < 0) acc.push(name);
		});
		value = action == "set" ? value.concat(list) : value;
	}
	return {"name": field.name, "value": value};
};

plugin.methods._applyUserUpdate = function(target, source, field) {
	if (target.get("data.actor.id") != source.get("data.actor.id")) return;
	target.data.actor[field.name == "state" ? "status" : field.name] = field.value;
	target.dom.render();
};

plugin.methods._isSubset = function(target, full) {
	if (!full || !full.length) return false;
	return !(Echo.Utils.foldl([], target || [], function(item, acc) {
		if ($.inArray(item, full) < 0) acc.push(item);
	})).length;
};

plugin.methods._isControlVisible = function(control, operation) {
	var item = this.component;
	var actor = item.data.actor;
	if (actor.id == item.user.get("fakeIdentityURL") || !item.user.is("admin")) {
		return false;
	}
	if (control.field.name == "state") {
		return (actor.status == control.field.value) ^ (operation == "set");
	}
	if (control.field.name == "roles" && !item.user.any("role", ["administrator"])) {
		return false;
	}
	return this._isSubset(control.field.value.split(","), actor[control.field.name]) ^ (operation == "set");
};

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Plugins.UserMetadataManager.onUserUpdate": function(topic, args) {
		console.log(this.component.get("data.actor.id"));
		this._applyUserUpdate(this.component, args.item, args.field);
	}
};

Echo.Plugin.create(plugin);
})();

(function(){
var plugin = Echo.Plugin.manifest("UserMetadataManager", "Echo.StreamServer.Controls.Stream");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.UserMetadataManager.onUserUpdate": function(topic, args) {
		this.events.publish({
			"topic": "onUserUpdate",
			"data": args,
			"global": false
		});
	}
};

Echo.Plugin.create(plugin);
})();