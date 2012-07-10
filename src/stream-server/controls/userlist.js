(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.UserListItem")) return;

var userListItem = Echo.Control.skeleton("Echo.StreamServer.Controls.UserListItem");

userListItem.labels = {
	"you": "You"
};

userListItem.templates.main =
	'<span class="{class:container}">' +
		'<img class="{class:avatar}">' +
		'<span class="{class:title}">{data:title}</span>' +
	'</span>';

userListItem.renderers.avatar = function(element) {
	var self = this;
	var url = this.data.avatar || this.user.get("defaultAvatar");
	//TODO employ new loadImage()
	if (this.config.get("userLabel.avatar")) {
		element.attr("src", url);
		if (url != this.user.get("defaultAvatar")) {
			element.one({
				"error" : function(){
					$(this).attr("src", self.user.get("defaultAvatar"));
				}
			});
		}
		if (!this.config.get("userLabel.text")) {
			element.attr("title", this.data.title);
		}
	} else {
		element.hide();
//TODO: should we remove element from dom and do we have an opportunity to?
//		dom.remove(element);
	}
};

userListItem.renderers.title = function(element) {
	if (this.config.get("userLabel.text")) {
		return this.isYou() ? this.labels.get("you") : this.data.title;
	} else {
//TODO: do we have valid dom reference in every renderer?
//		dom.remove(element);
		element.hide();
	}
};

userListItem.methods.isYou = function() {
	return this.data.id && this.data.id == this.user.get("sessionID");
};

userListItem.css =
		'.{class:avatar} { width: 16px; height: 16px; margin: 0px 3px 0px 0px; vertical-align: text-top; }' +
		//TODO only-avatars class complies to item not to the list as it was originally
		'.{class:only-avatars} .{class:avatar} { margin: 0px 2px; }' +
		'.{class:container}, .{class:container} span { white-space: nowrap; }' +
		'.{class:only-avatars} .{class:container} { white-space: normal; }';

Echo.Control.create(userListItem);

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.UserList")) return;

var userList = Echo.Control.skeleton("Echo.StreamServer.Controls.UserList");

userList.config = { 
		"initialUsersCount": undefined,
		"totalUsersCount": undefined,
		"query": "",
		"suffixText": "",
		"userLabel": {
			"avatar": true,
			"text": true
		}
	});

userList.labels = {
	"and": "and",
	"more": "more"
};

userList.templates.main =
	'<span class="{class:container}">' +
		'<span class="{class:actors}"></span>' +
		'<span class="{class:more}"></span>' +
		'<span class="{class:suffixText}"></span>' +
	'</span>';

userList.renderers.more = function(element) {
	var self = this;
	if (!this.isMoreButtonVisible()) {
		element.hide();
		return;
	}
	element.empty().show();
	var count = this.count.total - this.count.visible;
	var caption = (count > 0 ? count + " " : "") + this.label("more");
	var linkable = !this.fromExternalData() || this.count.visible < this.users.length;
	if (linkable) {
		//TODO fix hyperlink call
		element.addClass("echo-linkColor").append(this.hyperlink({"caption": caption}));
	} else {
		element.removeClass("echo-linkColor").append(caption);
	}
	this.moreRequestInProgress = false;
	if (linkable) {
		element.one("click", function() {
			self.getMoreUsers();
		});
	}
};

userList.renderers.actors = function(element) {
	var self = this;
	if (!this.users.length) return;
	var usersDOM = [];
	var userLabel = this.config.get("userLabel");
	if (!this.users.length || !userLabel.avatar && !userLabel.text) return;

	var action = (userLabel.avatar && !userLabel.text ? "addClass" : "removeClass");
	element[action]("echo-user-list-only-avatars");
	//TODO replace string concatenation with substitute
	var wrap = function(text, name) {
		var classAttr = name ? ' class="echo-user-list-' + name + '"' : '';
		return "<span" + classAttr + ">" + text + "</span>";
	};
	$.map(this.users.slice(0, this.count.visible), function(user) {
		usersDOM.push(user.instance.render());
	});
	var delimiter = this.config.get("userLabel.text") ? ", " : "";
	var last;
	if (!this.isMoreButtonVisible()) last = usersDOM.pop();
	if (usersDOM.length) {
		usersDOM = delimiter
			? $.intersperse(usersDOM, wrap(delimiter, "delimiter"))
			: usersDOM;
		// use &nbsp; instead of simple space because IE will cut off simple one after <span>
		usersDOM.push(wrap("&nbsp;" + this.label("and") + " ", "and"));
	}
	if (!this.isMoreButtonVisible()) usersDOM.push(last);
	$.map(usersDOM, function(chunk) {
		element.append(chunk);
	});
};

userList.renderers.suffixText = function() {
	return this.config.get("suffixText", "");
};

userList.methods.isMoreButtonVisible = function() {
	return !this.fromExternalData() && !this.isViewComplete || this.count.visible < this.count.total;
};

userList.methods.fromExternalData = function() {
	return !this.config.get("query") && !!this.config.get("data");
};

userList.methods.getVisibleUsersCount = function() {
	return this.count.visible;
};

userList.css = 
		'.{class:container} { line-height: 20px; vertical-align: middle; }' +
		'.{class:more} { white-space: nowrap; }' +
		//TODO profiling error messages should be moved to low lovel control base class
		'.{class:more} .echo-application-message-icon { display: inline; margin: 0px 5px; }'
	, 'user-list');
};

Echo.Control.create(userList);

/*
Echo.UserList.prototype.initVars = function() {
	this.users = [];
	this.uniqueUsers = {};
	this.isViewComplete = false;
	delete this.nextPageAfter;
	this.count = {
		"total": 0,
		"visible": 0
	};
	this.cleanupErrorHandlers();
};

Echo.UserList = function(config) {
	if (!config || !config.target) return;
	var self = this;
	this.vars = {};
	this.initVars();
	this.messageLayout = "compact";
	this.initApplication(function() {
		self.addCss();
		self.config.get("target").empty().append(self.render());
		if (self.config.get("query")) {
			self.showMessage({
				"type": "loading"
			}, self.dom.get("container"));
			self.initLiveUpdates(function() {
				return {
					"endpoint": "search",
					"query": {
						"q": self.config.get("query"),
						"since": self.nextSince || 0
					}
				};
			}, function(data) {
				self.handleLiveUpdatesResponse(data);
			});
			self.request();
		} else if (self.config.get("data")) {
			var data = self.config.get("data");
			data.itemsPerPage = data.itemsPerPage || 2;
			self.config.set("liveUpdates", false);
			self.handleInitialResponse(data);
		}
	});
};

Echo.UserList.prototype.getMoreUsers = function() {
	if (this.fromExternalData()) {
		this.count.visible += this.config.get("itemsPerPage");
		if (this.count.visible > this.users.length) {
			this.count.visible = this.users.length;
		}
		this.rerender();
	} else {
		if (!this.moreRequestInProgress) {
			this.showMessage({
				"type": "loading"
			}, this.dom.get("more"));
			this.moreRequestInProgress = true;
		}
		this.request();
	}
};

Echo.UserList.prototype.request = function() {
	var self = this;
	var query = this.config.get("query");
	if (typeof this.nextPageAfter != "undefined") {
		query = 'pageAfter:"' + this.nextPageAfter + '" ' + query;
	}
	this.sendAPIRequest({
		"endpoint": "search",
		"query": {"q": query}
	}, function(data) {
		self.changeLiveUpdatesTimeout(data);
		self.handleInitialResponse(data);
	});
};

Echo.UserList.prototype.handleInitialResponse = function(data) {
	if (data.result == "error") {
		this.handleErrorResponse(data);
		return;
	}
	this.cleanupErrorHandlers(true);
	if (data.itemsPerPage && data.itemsPerPage != this.config.get("itemsPerPage")) {
		this.config.set("itemsPerPage", +data.itemsPerPage);
	}
	if (this.fromExternalData()) {
		this.count.total = this.config.get("totalUsersCount", 0);
	}
	this.nextSince = data.nextSince || 0;
	this.nextPageAfter = data.nextPageAfter || 0;
	if (!data.entries.length) {
		if (!this.isViewComplete) {
			this.isViewComplete = true;
			this.rerender();
		}
		this.startLiveUpdates();
		return;
	}
	if (!this.count.visible) {
		if (this.fromExternalData()) {
			this.count.visible = this.config.get("initialUsersCount", this.config.get("itemsPerPage"));
		} else {
			this.count.visible = this.config.get("itemsPerPage");
		}
	}
	this.processResponse(data);
};

Echo.UserList.prototype.handleLiveUpdatesResponse = function(data) {
	var self = this;
	if (data.result == "error") {
		this.startLiveUpdates();
		return;
	}
	this.nextSince = data.nextSince || 0;
	if (!data.entries.length) {
		this.startLiveUpdates();
		return;
	}
	this.processResponse(data, true);
};

Echo.UserList.prototype.processResponse = function(data, isLive) {
	var self = this;
	var config = new Echo.Config(this.config.getAsHash());
	var usersAdded = false;
	var usersDeleted = false;
	$.each(data.entries, function(i, entry) {
		var isDeleting = (entry.verbs && entry.verbs[0] == "http://activitystrea.ms/schema/1.0/delete");
		var user = self.uniqueUsers[entry.actor.id];
		if (isDeleting && !user) return;
		if (isDeleting) {
			if (!--user.itemsCount) {
				var index;
				$.each(self.users, function(i, u) {
					if (u.instance.data.id == entry.actor.id) {
						index = i;
						return false; // break
					}
				});
				self.users.splice(index, 1);
				delete self.uniqueUsers[entry.actor.id];
				usersDeleted = true;
			}
		} else if (user) {
			user.itemsCount++;
		} else {
			var userInstance = new Echo.UserListItem({
				"data": entry.actor,
				"user": self.user,
				"config": config
			});
			user = {
				"itemsCount": 1,
				"instance": userInstance
			};
			self.users[userInstance.isYou() ? "unshift" : "push"](user);
			self.uniqueUsers[entry.actor.id] = user;
			usersAdded = true;
		}
	});
	if (this.fromExternalData()) {
		this.count.total = Math.max(this.users.length, this.count.total);
	} else {
		this.count.total = this.count.visible = this.users.length;
	}
	this.count.visible = Math.min(this.count.visible, this.users.length);
	if (!this.count.total) this.isViewComplete = false;
	if (usersAdded || usersDeleted) this.rerender();
	if (isLive || usersAdded) {
		this.startLiveUpdates();
	} else {
		this.getMoreUsers();
	}
};

Echo.UserList.prototype.refresh = function() {
	this.stopLiveUpdates();
	this.initVars();
	this.rerender();
	if (this.config.get("query")) {
		this.request();
	} else if (this.config.get("data")) {
		this.handleInitialResponse(this.config.get("data"));
	}
};

*/

})(jQuery);
