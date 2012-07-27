(function($) {

/**
 * @class Echo.StreamServer.Controls.Stream.Plugins.Like
 * Adds extra controls Like/Unlike to each item in the Echo Stream control. Note that these controls will appear only for authenticated users.
 *     new Echo.StreamServer.Controls.Stream({
 *         "target": document.getElementById("echo-stream"),
 *         "appkey": "test.echoenabled.com",
 *         "plugins": [{
 *             "name": "Like"
 *         }]
 *     });
 * @extends Echo.Plugin
 * @inheritdoc Echo.Plugin
 */
var plugin = Echo.Plugin.manifest("Like", "Echo.StreamServer.Controls.Stream.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var self = this;
	this.extendTemplate("insertAsLastChild", "data", plugin.template);
	this.component.addButtonSpec("Like", this._assembleButton("Like"));
	this.component.addButtonSpec("Like", this._assembleButton("Unlike"));
	this.events.subscribe({
		"topic": "internal.Echo.StreamServer.Controls.Stream.Item.Plugins.Like.onUnlike",
		"handler": function(topic, args) {
			self._sendActivity("unlike", args.item);
			return {"stop": ["bubble"]};
		}
	});
};

plugin.labels = {
	"likeThis": " like this.",
	"likesThis": " likes this.",
	"likeControl": "Like",
	"unlikeControl": "Unlike",
	"likeProcessing": "Liking...",
	"unlikeProcessing": "Unliking..."
};

plugin.template = '<div class="{class:likedBy}"></div>';

plugin.methods._sendRequest = function(data, callback) {
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"onData": callback,
		"data": data,
	}).send();
};

plugin.methods._sendActivity = function(name, item) {
	var plugin = this;
	var activity = {
		"verbs": ["http://activitystrea.ms/schema/1.0/" + name.toLowerCase()],
		"targets": [{"id": item.get("data.object.id")}]
	};
	this._sendRequest({
		"content": activity,
		"appkey": item.config.get("appkey"),
		"sessionID": item.user.get("sessionID"),
		"target-query": item.config.get("parent.query")
	}, function() {
		plugin.events.publish({
			"topic": "on" + name + "Complete",
			"data": {
				"item": {
					"data": item.data,
					"target": item.dom.get()
				}
			}
		});
		plugin.requestDataRefresh();
	});
};

plugin.methods._assembleButton = function(name) {
	var plugin = this;
	var component = this.component;
	var callback = function() {
		var item = this;
		item.buttons[plugin.manifest.name + "." + name].element
			.empty()
			.append(plugin.labels.get(name.toLowerCase() + "Processing"));
		plugin._sendActivity(name, item);
	};
	return function() {
		var item = this;
		var action =
			($.map(item.data.object.likes, function(entry) {
				if (item.user.has("identity", entry.actor.id)) return entry;
			})).length > 0 ? "Unlike" : "Like";
		return {
			"name": name,
			"label": plugin.labels.get(name.toLowerCase() + "Control"),
			"visible": item.user.is("logged") && action === name,
			"onetime": true,
			"callback": callback
		};
	};
};

plugin.renderers.likedBy = function(element) {
	var plugin = this;
	var item = this.component;
	if (!item.data.object.likes.length) {
		element.hide();
		return;
	}
	var likesPerPage = 5;
	var visibleUsersCount = plugin.get("facePile")
		? plugin.get("facePile").getVisibleUsersCount()
		: likesPerPage;
	var youLike = false;
	var userId = item.user.get("id");
	var users = item.data.object.likes;
	$.each(users, function(i, like) {
		if (like.actor.id === userId) {
			youLike = true;
			return false; // break
		}
	});
	var config = plugin.config.assemble({
		"target": element.get(0),
		"data": {
			"itemsPerPage": likesPerPage,
			"entries": users
		},
		"initialUsersCount": visibleUsersCount,
		"totalUsersCount": item.data.object.accumulators.likesCount,
		"suffixText": plugin.labels.get(users.length > 1 || youLike ? "likeThis" : "likesThis")
	});
	config.plugins.push({"name": "Like"});
	if (item.user.is("admin")) {
		element.addClass(item.cssPrefix + "-highlight");
	}
	var facePile = new Echo.StreamServer.Controls.FacePile(config);
	plugin.set("facePile", facePile);
	this.events.subscribe({
		"topic": "internal.Echo.StreamServer.Controls.FacePile.Item.Plugins.Like.onUnlike",
		"handler": function(topic, data) {
			if (data.target !== element.get(0)) return {"stop": ["bubble"]};
			plugin.events.publish({
				"topic": "onUnlike",
				"prefix": "internal",
				"bubble": true,
				"data": {
					"actor": data.actor,
					"item": item
				}
			});
			return {"stop": ["bubble"]};
		}
	});
	return element.show();
};

Echo.Plugin.create(plugin);

})(jQuery);

(function($) {

var plugin = Echo.Plugin.manifest("Like", "Echo.StreamServer.Controls.FacePile.Item");

if (Echo.Plugin.isDefined(plugin)) return;

plugin.labels = {
	"unlikeOnBehalf": "Unlike on behalf of this user"
};

plugin.init = function() {
	this.extendTemplate("insertAsLastChild", "container", plugin.template);
};

plugin.template = '<img class="{class:adminUnlike}" src="//cdn.echoenabled.com/images/container/closeWindow.png" title="{plugin.label:unlikeOnBehalf}" width="10" height="9">';

plugin.renderers.adminUnlike = function(element) {
	var plugin = this;
	var item = this.component;
	if (!item.user.is("admin")) {
		element.remove();
		return;
	}
	element.one("click", function() {
		item.dom.get("container").css("opacity", 0.3);
		plugin.events.publish({
			"topic": "onUnlike",
			"prefix": "internal",
			"bubble": true,
			"actor": item.data,
			"data": {
				"actor": item.data,
				"target": item.config.get("parent.target").get(0)
			}
		});
	});
};

plugin.css = '.echo-streamserver-controls-stream-item-likedBy { background: url(//cdn.echoenabled.com/images/likes.png) no-repeat 0px 4px; padding: 0px 0px 4px 21px; }' +
	'.echo-streamserver-controls-stream-item-likedBy .echo-streamserver-controls-stream-item-highlight { line-height: 23px; }' +
	'.echo-streamserver-controls-stream-item-highlight .{class:container} { display: inline-block; line-height: 16px; background-color: #EEEEEE; padding: 1px 3px; border: 1px solid #D2D2D2; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 0px 2px; }' +
	'.echo-streamserver-controls-stream-item-highlight .echo-streamserver-controls-stream-item-delimiter { display: none; }' +
	'.echo-streamserver-controls-stream-item-likedBy .{class:adminUnlike} { cursor: pointer; margin-left: 3px; }' +
	($.browser.msie ?
		'.echo-streamserver-controls-stream-item-likedBy .echo-streamserver-controls-stream-item-highlight span { vertical-align: middle; }' +
		'.echo-streamserver-controls-stream-item-likedBy { background-position: 0px 2px; }'
		: ''
	);

Echo.Plugin.create(plugin);

})(jQuery);
