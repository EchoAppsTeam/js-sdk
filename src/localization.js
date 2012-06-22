(function() {

if (Echo.Localization) return;

Echo.Localization = function(labels, namespace) {
	var self = this;
	this.labels = {};
	this.namespace = namespace;
	$.each(labels, function(name, value) {
		self.labels[Echo.Localization.key(name, self.namespace)] = value;
	});
};

Echo.Localization.prototype.label = function(name, data) {
	var key = Echo.Localization.key(name, this.namespace);
	return this.labels[key]
		? Echo.Localization.substitute(this.labels[key], data)
		: Echo.Localization.label(name, this.namespace, data);
}

Echo.Localization.prototype.extend = function(labels) {
	var self = this;
	$.each(labels, function(name, value) {
		var key = Echo.Localization.key(name, self.namespace);
		self.labels[key] = value;
	});
}

// static interface

Echo.Localization.labels = { "defaults": {}, "custom": {} };

Echo.Localization.key = function(name, namespace) {
	return (namespace ? namespace + "." : "") + name;
};

Echo.Localization.extend = function(labels, namespace, isDefault) {
	$.each(labels, function(name, value) {
		var key = Echo.Localization.key(name, namespace);
		Echo.Localization.labels[isDefault ? "defaults" : "custom"][key] = value;
	});
};

Echo.Localization.label = function(name, namespace, data) {
	var key = Echo.Localization.key(name, namespace);
	var label = Echo.Localization.labels["custom"][key] || Echo.Localization.labels["defaults"][key] || name;
	return Echo.Localization.substitute(label, data);
};

Echo.Localization.substitute = function(label, data) {
	$.each(data || {}, function(key, value) {
		label = label.replace(new RegExp("{" + key + "}", "g"), value);
	});
	return label;
}

})();