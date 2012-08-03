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
};

plugin.labels = {
	"likeThis": " like this.",
	"likesThis": " likes this.",
	"likeControl": "Like",
	"unlikeControl": "Unlike",
	"likeProcessing": "Liking...",
	"unlikeProcessing": "Unliking..."
};

plugin.events = {
	"Echo.StreamServer.Controls.FacePile.Item.Plugins.Like.onUnlike": function(topic, args) {
		this._sendActivity("Unlike", this.component);
		return {"stop": ["bubble"]};
	}
};

plugin.template = '<div class="{plugin.class:likedBy}"></div>';

plugin.methods._sendRequest = function(data, callback) {
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.component.config.get("submissionProxyURL"),
		"onData": callback,
		"data": data
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
					"data": item.get("data"),
					"target": item.config.get("target")
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
		item.get("buttons." + plugin.name + "." + name + ".element")
			.empty()
			.append(plugin.labels.get(name.toLowerCase() + "Processing"));
		plugin._sendActivity(name, item);
	};
	return function() {
		var item = this;
		var action =
			($.map(item.get("data.object.likes"), function(entry) {
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
	if (!item.get("data.object.likes").length) {
		return element.hide();
	}
	var likesPerPage = 5;
	var visibleUsersCount = plugin.get("facePile")
		? plugin.get("facePile").getVisibleUsersCount()
		: likesPerPage;
	var youLike = false;
	var userId = item.user.get("id");
	var users = item.get("data.object.likes");
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
		"totalUsersCount": item.get("data.object.accumulators.likesCount"),
		"suffixText": plugin.labels.get(users.length > 1 || youLike ? "likeThis" : "likesThis")
	});
	config.plugins.push({"name": "Like"});
	if (item.user.is("admin")) {
		element.addClass(plugin.cssPrefix + "highlight");
	}
	var facePile = new Echo.StreamServer.Controls.FacePile(config);
	plugin.set("facePile", facePile);
	return element.show();
};

plugin.css =
	'.{plugin.class:likedBy} { background: url(//cdn.echoenabled.com/images/likes.png) no-repeat 0px 4px; padding: 0px 0px 4px 21px; }' +
	'.{plugin.class:highlight} { line-height: 23px; }' +
	($.browser.msie ?
		'.{plugin.class:highlight} span { vertical-align: middle; }' +
		'.{plugin.class:likedBy} { background-position: 0px 2px; }'
		: ''
	);

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

plugin.template = '<img class="{plugin.class:adminUnlike}" src="//cdn.echoenabled.com/images/container/closeWindow.png" title="{plugin.label:unlikeOnBehalf}" width="10" height="9">';

plugin.component.renderers.container = function(element) {
	this.parentRenderer("container", arguments);
	if (this.component.user.is("admin")) {
		element.addClass(this.cssPrefix + "highlight");
	}
};

plugin.renderers.adminUnlike = function(element) {
	var plugin = this;
	var item = this.component;
	if (!item.user.is("admin")) {
		return element.remove();
	}
	return element.one("click", function() {
		item.dom.get("container").css("opacity", 0.3);
		plugin.events.publish({
			"topic": "onUnlike",
			"actor": item.get("data"),
			"data": {
				"actor": item.get("data"),
				"target": item.config.get("parent.target").get(0)
			},
			"global": false,
			"propagation": false
		});
	});
};

plugin.css =
	'.{plugin.class:adminUnlike} { cursor: pointer; margin-left: 3px; }' +
	'.{plugin.class:highlight} { display: inline-block; line-height: 16px; background-color: #EEEEEE; padding: 1px 3px; border: 1px solid #D2D2D2; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; margin: 0px 2px; }' +

Echo.Plugin.create(plugin);

})(jQuery);
