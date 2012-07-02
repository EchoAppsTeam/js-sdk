(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.API")) return;

if (!Echo.StreamServer) Echo.StreamServer = {};

Echo.StreamServer.API = {};

Echo.StreamServer.API.Request = function(config) {
	this.parent(config);
};

Echo.Utils.inherit(Echo.StreamServer.API.Request, Echo.API.Request);

Echo.StreamServer.API.Request.prototype._search = function() {
	// TODO:
	//  - check "recurring" flag (live updates)
	//  - handle timeout errors
	this.request();
};

Echo.StreamServer.API.Request.prototype._submit = function() {
	// TODO:
	//  - AS JSON -> KV GET
	// this.request();
};

Echo.StreamServer.API.Request.prototype._AS2KVL = function(entries, config) {
	entries = $.isArray(entries) ? entries : [entries];
	config = config || {};
	var strip = function(value) {
		return value
			.replace("http://activitystrea.ms/schema/1.0/", "")
			.replace("http://js-kit.com/spec/e2/v1/", "");
	};
	var prepareActivity = function(activity, meta) {
		return {
			"avatar": activity.actor.avatar,
			"content": activity.object.content,
			"markers": meta.markers ? $.trim(meta.markers) : undefined,
			"name": activity.actor.name || activity.actor.title,
			"source": activity.source,
			"tags": meta.tags ? $.trim(meta.tags) : undefined,
			"target": activity.targets[0].id,
			"verb": verb(activity),
			"type": type(activity),
			"itemURIPattern": config.itemURIPattern
		};
	};
	var verb = function(entry) { return strip(entry.verbs[0]); };
	var type = function(entry) { return strip(entry.object.objectTypes[0]); };
	var post, meta = {"markers": "", "tags": ""};
	$.map(entries, function(entry) {
		if (verb(entry) == "tag" && /tag|marker/.test(type(entry))) {
			meta[type(entry) + "s"] = entry.object.content;
		}
		if (verb(entry) == "post") {
			post = entry;
		}
	});
	if (post) {
		return prepareActivity(post, meta);
	}
	return $.map(entries, function(entry) {
		return prepareActivity(enry);
	});
};

Echo.StreamServer.API.request = function(config) {
	return (new Echo.StreamServer.API.Request(config));
};

})(jQuery);
