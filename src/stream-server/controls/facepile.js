(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.FacePile")) return;

var pile = Echo.Control.skeleton("Echo.StreamServer.Controls.FacePile");

pile.vars = {
	"users": [],
	"uniqueUsers": {},
	"isViewComplete": false,
	"moreRequestInProgress": false,
	"count": {
		"total": 0,
		"visible": 0
	}
};

pile.config = {
	"initialUsersCount": undefined,
	"totalUsersCount": undefined,
	"query": "",
	"suffixText": "",
	"item": {
		"avatar": true,
		"text": true
	},
	"infoMessages": {
		"layout": "compact"
	}
};

pile.labels = {
	"and": "and",
	"more": "more"
};

pile.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:actors}"></span>' +
		'<span class="{class:more}"></span>' +
		'<span class="{class:suffixText}"></span>' +
	'</span>';

pile.init = function() {
	// data can be defined explicitly
	// in this case we do not make API requests
	if ($.isEmptyObject(this.data)) {
		this._request();
	} else {
		this.data.itemsPerPage = this.data.itemsPerPage || 2;
		this.config.set("liveUpdates", false);
		this._initialResponseHandler(this.data);
	}
};

pile.renderers.more = function(element) {
	var self = this;
	if (!this._isMoreButtonVisible()) {
		return element.hide();
	}
	element.empty().show();
	var count = this.count.total - this.count.visible;
	var caption = (count > 0 ? count + " " : "") + this.labels.get("more");
	var linkable = !this._fromExternalData() || this.count.visible < this.users.length;
	if (linkable) {
		var link = Echo.Utils.hyperlink({"caption": caption});
		element.addClass("echo-linkColor").append(link);
	} else {
		element.removeClass("echo-linkColor").append(caption);
	}
	this.moreRequestInProgress = false;
	if (linkable) {
		element.one("click", function() {
			self._getMoreUsers();
		});
	}
	return element;
};

pile.renderers.actors = function(element) {
	var self = this, usersDOM = [];
	var item = this.config.get("item");
	var cssPrefix = this.cssPrefix + "-";

	if (!this.users.length || !item.avatar && !item.text) return;

	var action = (item.avatar && !item.text ? "addClass" : "removeClass");
	element[action](cssPrefix + "only-avatars");
	var wrap = function(text, name) {
		return self.substitute("<span {data:classAttr}>{data:text}</span>", {
			"classAttr": name ? 'class="' + cssPrefix + name + '"' : '',
			"text": text
		});
	};
	$.map(this.users.slice(0, this.count.visible), function(user) {
		usersDOM.push(user.instance.render());
	});
	var last;
	var delimiter = this.config.get("item.text") ? ", " : "";
	if (!this._isMoreButtonVisible()) {
		last = usersDOM.pop();
	}
	if (usersDOM.length) {
		usersDOM = delimiter
			? this._intersperse(usersDOM, wrap(delimiter, "delimiter"))
			: usersDOM;
		// use &nbsp; instead of simple space
		// because IE will cut off simple one after <span>
		usersDOM.push(wrap("&nbsp;" + this.labels.get("and") + " ", "and"));
	}
	if (!this._isMoreButtonVisible()) {
		usersDOM.push(last);
	}
	$.map(usersDOM, function(chunk) {
		element.append(chunk);
	});
	return element;
};

pile.renderers.suffixText = function(element) {
	return element.empty().append(this.config.get("suffixText", ""));
};

pile.methods.refresh = function() {
	this.get("request").abort();
	this.remove("request");
	var component = Echo.Utils.getComponent("Echo.StreamServer.Controls.FacePile");
	component.parent.refresh.call(this);
};

pile.methods.getVisibleUsersCount = function() {
	return this.count.visible;
};

pile.methods._isMoreButtonVisible = function() {
	return !this._fromExternalData() && !this.isViewComplete || this.count.visible < this.count.total;
};

pile.methods._fromExternalData = function() {
	return !this.config.get("query") && !!this.data;
};

pile.methods._request = function() {
	var pile = this;
 	var request = this.get("request");
	if (!request) {
		request = Echo.StreamServer.API.request({
			"endpoint": "search",
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"liveUpdatesTimeout": this.config.get("liveUpdatesTimeout"),
			"recurring": true,
			"onError": function(data) {
				pile.showMessage({"type": "error", "data": data});
			},
			"onData": function(data, extra) {
				pile["_" + extra.requestType + "ResponseHandler"](data);
			}
		});
		this.set("request", request);
	}
	request.send();
};

pile.methods._requestMoreItems = function() {
	var pile = this, query = this.config.get("query");
	if (typeof this.nextPageAfter != "undefined") {
		query = 'pageAfter:"' + this.nextPageAfter + '" ' + query;
	}
	var request = Echo.StreamServer.API.request({
		"endpoint": "search",
		"data": {
			"q": query,
			"appkey": this.config.get("appkey")
		},
		"onError": function(data) {
			pile.showMessage({"type": "error", "data": data});
		},
		"onData": function(data) {
			pile._initialResponseHandler(data);
		}
	});
	request.send();
};

pile.methods._initialResponseHandler = function(data) {
	if (data.itemsPerPage && data.itemsPerPage != this.config.get("itemsPerPage")) {
		this.config.set("itemsPerPage", +data.itemsPerPage);
	}
	if (this._fromExternalData()) {
		this.count.total = this.config.get("totalUsersCount", 0);
	}
	this.nextPageAfter = data.nextPageAfter;
	if (!data.entries.length) {
		if (!this.isViewComplete) {
			this.isViewComplete = true;
			this.render();
		}
		return;
	}
	if (!this.count.visible) {
		this.count.visible = this._fromExternalData()
			? this.config.get("initialUsersCount", this.config.get("itemsPerPage"))
			: this.config.get("itemsPerPage");
	}
	this._processResponse(data);
};

pile.methods._secondaryResponseHandler = function(data) {
	this._processResponse(data, true);
};

pile.methods._processResponse = function(data, isLive) {
	var self = this, fetchMoreUsers = true;
	$.each(data.entries, function(i, entry) {
		var isDeleting = (entry.verbs && entry.verbs[0] == "http://activitystrea.ms/schema/1.0/delete");
		if (isDeleting && !self.uniqueUsers[entry.actor.id]) return;
		if (isDeleting) {
			self._maybeRemoveItem(entry);
		} else {
			if (self._isUniqueUser(entry)) {
				fetchMoreUsers = false;
			} else {
			}
			self._initItem(entry);
		}
	});
	if (this._fromExternalData()) {
		this.count.total = Math.max(this.users.length, this.count.total);
	} else {
		this.count.total = this.count.visible = this.users.length;
	}
	this.count.visible = Math.min(this.count.visible, this.users.length);
	if (!this.count.total) {
		this.isViewComplete = false;
	}
	if (!isLive && fetchMoreUsers) {
		this._getMoreUsers();
	} else {
		this.render();
	}
};

pile.methods._isUniqueUser = function(entry) {
	return !this.uniqueUsers[entry.actor.id];
};

pile.methods._initItem = function(entry) {
	var user = this.uniqueUsers[entry.actor.id];
	// user is already in the list -> increment counter and return
	if (user) {
		user.itemsCount++;
		return;
	}
	var config = $.extend(true, {
		"target": $("<div>"),
		"appkey": this.config.get("appkey"),
		"parent": $.extend({}, this.config.getAsHash()),
		"data": entry.actor,
		"user": this.user
	}, this.config.get("item"));
	user = this.uniqueUsers[entry.actor.id] = {
		"itemsCount": 1,
		"instance": new Echo.StreamServer.Controls.FacePile.Item(config)
	};
	this.users[user.instance.isYou() ? "unshift" : "push"](user);
};

pile.methods._maybeRemoveItem = function(entry) {
	var user = this.uniqueUsers[entry.actor.id];
	// if we have move than one item posted by the same user,
	// we decrement the counter, but leave the user in the list
	if (--user.itemsCount) return;
	var index;
	$.each(this.users, function(i, u) {
		if (u.instance.data.id == entry.actor.id) {
			index = i;
			return false; // break
		}
	});
	this.users.splice(index, 1);
	delete this.uniqueUsers[entry.actor.id];
};

pile.methods._getMoreUsers = function() {
	if (this._fromExternalData()) {
		this.count.visible += this.config.get("itemsPerPage");
		if (this.count.visible > this.users.length) {
			this.count.visible = this.users.length;
		}
		this.render();
	} else {
		if (!this.moreRequestInProgress) {
			this.showMessage({
				"type": "loading",
				"target": this.dom.get("more")
			});
			this.moreRequestInProgress = true;
		}
		this._requestMoreItems();
	}
};

pile.methods._intersperse = function(object, separator) {
	return Echo.Utils.foldl([], object, function(item, acc, key) {
		if (acc.length) acc.push(separator);
		acc.push(item);
	});
};

pile.css = 
	'.{class:container} { line-height: 20px; vertical-align: middle; }' +
	'.{class:more} { white-space: nowrap; }' +
	'.{class:more} .echo-control-message-icon { display: inline; margin: 0px 5px; }';

Echo.Control.create(pile);

})(jQuery);

// FacePile item definition

(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.FacePile.Item")) return;

var item = Echo.Control.skeleton("Echo.StreamServer.Controls.FacePile.Item");

item.labels = {
	"you": "You"
};

item.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:avatar}"></span>' +
		'<span class="{class:title}">{data:title}</span>' +
	'</span>';

item.renderers.avatar = function(element) {
	var self = this;
	if (this.config.get("avatar")) {
		var img = Echo.Utils.loadImage(
			this.data.avatar,
			this.user.config.get("defaultAvatar")
		);
		element.empty().append(img);
		if (!this.config.get("text")) {
			element.attr("title", this.data.title);
		}
	} else {
		element.hide();
	}
	return element;
};

item.renderers.title = function(element) {
	if (this.config.get("text")) {
		element.empty().append(this.isYou() ? this.labels.get("you") : this.data.title);
	} else {
		element.hide();
	}
	return element;
};

item.methods.isYou = function() {
	return this.data.id && this.data.id == this.user.get("sessionID");
};

item.css =
	'.{class:avatar} img { width: 16px; height: 16px; margin: 0px 3px 0px 0px; vertical-align: text-top; }' +
	'.{class:only-avatars} .{class:avatar} { margin: 0px 2px; }' +
	'.{class:container}, .{class:container} span { white-space: nowrap; }' +
	'.{class:only-avatars} .{class:container} { white-space: normal; }';

Echo.Control.create(item);

})(jQuery);
