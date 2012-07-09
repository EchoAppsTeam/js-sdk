(function($) {

"use strict";

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.UserListItem")) return;

var userListitem = Echo.Control.skeleton("Echo.StreamServer.Controls.UserListItem");

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
		'.{class:only-avatars} .{class:avatar} { margin: 0px 2px; }' +
		'.{class:container}, .{class:container} span { white-space: nowrap; }' +
		'.{class:only-avatars} .{class:container} { white-space: normal; }';

Echo.Control.create(userListItem);

})(jQuery);
