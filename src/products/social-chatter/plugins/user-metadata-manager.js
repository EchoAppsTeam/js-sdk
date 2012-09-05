(function(jQuery) {
"use strict";

var $ = jQuery;

var plugin = Echo.Plugin.manifest("UserMetadataManager", "Echo.StreamServer.Controls.Stream.Item");

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
					item.render();
					return;
				}
				self.events.publish({
					"topic": "onUserUpdate",
					"data": {
						"item": item,
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

plugin.methods._applyUserUpdate = function(source, field) {
	var target = this.component;
	if (target.get("data.actor.id") !== source.data.actor.id) return;
	target.set("data.actor." + (field.name === "state" ? "status" : field.name), field.value);
	target.render();
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
		this._applyUserUpdate(args.item, args.field);
	}
};

Echo.Plugin.create(plugin);
})(Echo.jQuery);

(function(jQuery) {
"use strict";

var $ = jQuery;

var plugin = Echo.Plugin.manifest("UserMetadataManager", "Echo.StreamServer.Controls.Stream");

plugin.events = {
	"Echo.StreamServer.Controls.Stream.Item.Plugins.UserMetadataManager.onUserUpdate": function(topic, args) {
		this.events.publish({
			"topic": "onUserUpdate",
			"data": args,
			"global": false
		});
		return {"stop": ["bubble"]};
	}
};

Echo.Plugin.create(plugin);
})(Echo.jQuery);
