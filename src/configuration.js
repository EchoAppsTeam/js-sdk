(function($) {

"use strict";

Echo.Configuration = function(master, slave, normalizer) {
	var self = this;
	this.normalize = normalizer || function(key, value) { return value; };
	this.data = {};
	this.cache = {};
	if (!slave && !normalizer) {
		this.data = master;
	} else {
		$.each($.extend({}, slave, master), function(key, value) {
			self.set(key, value);
		});
	}
};

Echo.Configuration.prototype.get = function(key, defaults) {
	var k = key;
	if (typeof k != "string") {
		k = k.join(".");
	}
	if (!this.cache.hasOwnProperty(k)) {
		this.cache[k] = Echo.Utils.getNestedValue(key, this.data);
	}
	return typeof this.cache[k] == "undefined" ? defaults : this.cache[k];
};

Echo.Configuration.prototype.set = function(key, value) {
	var keys = key.split(/\./);
	delete this.cache[key];
	if (typeof value == "object") {
		this._clearCacheByPrefix(key);
	}
	return Echo.Utils.setNestedValue(this.data, key, this.normalize(keys.pop(), value));
};

Echo.Configuration.prototype.remove = function(key) {
	var keys = key.split(/\./);
	var field = keys.pop();
	var data = Echo.Utils.getNestedValue(keys, this.data);
	Echo.Utils.setNestedValue(this.cache, key, undefined);
	delete data[field];
};

Echo.Configuration.prototype.extend = function(extra) {
	var self = this;
	$.each(extra, function(key, value) {
		self.set(key, value);
	});
};

Echo.Configuration.prototype.getAsHash = function() {
	return $.extend({}, this.data);
};

// internal functions

Echo.Configuration.prototype._clearCacheByPrefix = function(prefix) {
	var self = this;
	prefix += ".";
	$.each(this.cache, function(key, data) {
		// key starts with prefix
		if (!key.indexOf(prefix)) {
			delete self.cache[key];
		}
	});
};

})(jQuery);
