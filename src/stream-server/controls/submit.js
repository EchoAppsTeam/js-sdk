(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Submit")) return;

var submit = Echo.Control.skeleton("Echo.StreamServer.Controls.Submit");

submit.config = {
	"targetURL": document.location.href,
	"markers": [],
	"source": {},
	"tags": [],
	"requestMethod": "GET",
	"data": {},
	"itemURIPattern": undefined,
	"actionString": "Type your comment here...",
	"postingTimeout": 30,
	"targetQuery": undefined
};

submit.labels = {
	"markers": "Markers:",
	"markersHint": "Marker1, marker2, marker3, ...",
	"post": "Post",
	"posting": "Posting...",
	"postingFailed": "There was a server error while trying to submit your item. Please try again in a few minutes. <b>Error: \"{error}\"</b>.",
	"postingTimeout": "There was a network issue while trying to submit your item. Please try again in a few minutes.",
	"tagsHint": "Tag1, tag2, tag3, ...",
	"tags": "Tags:",
	"yourName": "Your Name (required)",
	"yourWebsiteOptional": "Your website (optional)"
};

// templates

submit.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:header}">' +
			'<div class="{class:userInfoWrapper}">' +
				'<div class="{class:avatar}"></div>' +
				'<div class="{class:fields}">' +
					'<div class="{class:fieldsWrapper}">' +
						'<div class="{class:nameContainer} {class:border}">' +
							'<input class="{class:name} echo-primaryFont echo-primaryColor">' +
						'</div>' +
						'<div class="{class:urlContainer} {class:border}">' +
							'<input class="{class:url} echo-primaryFont echo-primaryColor">' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>' +
		'<div class="{class:body}">' +
			'<div class="{class:content} {class:border}">' +
				'<textarea class="{class:text} {class:textArea} echo-primaryFont echo-primaryColor"></textarea>' +
			'</div>' +
			'<div class="{class:markersContainer} {class:metadataContainer} echo-primaryFont echo-primaryColor">' +
				'<div class="{class:metadataLabel}">{label:markers}</div>' +
				'<div class="{class:metadataWrapper}">' +
					'<div class="{class:metadataSubwrapper} {class:border} ">' +
						'<input class="{class:markers} echo-primaryFont">' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
			'<div class="{class:tagsContainer} {class:metadataContainer} echo-primaryFont echo-primaryColor">' +
				'<div class="{class:metadataLabel}">{label:tags}</div>' +
				'<div class="{class:metadataWrapper}">' +
					'<div class="{class:metadataSubwrapper} {class:border} ">' +
						'<input class="{class:tags} {class:border} echo-primaryFont">' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>' +
		'<div class="{class:controls}">' +
			'<div class="{class:postContainer}">' +
				'<button class="{class:postButton} echo-primaryFont"></button>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
	'</div>';

submit.constructor = function() {
	this.render();
}

// renderers

submit.renderers.tagsContainer = 
submit.renderers.markersContainer = function(element) {
	return (this.user.any("roles", ["administrator", "moderator"])) ? element.show() : element.hide();
};

submit.renderers.markers = function(element, dom) {
	return this.render({
		"element": "metaFields",
		"target": element,
		"dom": dom,
		"extra": {"type": "markers"}
	});
};

submit.renderers.tags = function(element, dom) {
	return this.render({
		"element": "metaFields",
		"target": element,
		"dom": dom,
		"extra": {"type": "tags"}
	});
};

submit.renderers.metaFields = function(element, dom, extra) {
	var type = extra.type;
	var data = this.config.get("data.object." + type, this.config.get(type, []));
	var value = $.trim(Echo.Utils.stripTags(data.join(", ")));
	return dom.get(type).iHint({
		"text": this.labels.get(type + "Hint"),
		"className": "echo-secondaryColor"
	}).val(value).blur();
};

submit.renderers.text = function(element) {
	return element.iHint({
		"text": this.config.get("actionString"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.avatar = function(element) {
	var avatar = Echo.Utils.loadImage(this.user.get("avatar"), this.user.config.get("defaultAvatar"));
	return element.append(avatar);
};

submit.renderers.name = function(element) {
	return element.val(this.user.get("name", "")).iHint({
		"text": this.labels.get("yourName"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.url = function(element) {
	return element.val(this.user.get("domain", "")).iHint({
		"text": this.labels.get("yourWebsiteOptional"),
		"className": "echo-secondaryColor"
	});
};

submit.renderers.postButton = function(element) {
	var self = this;
	var states = {
		"normal": {
			"icon": false,
			"disabled": false,
			"label": self.labels.get("post")
		},
		"posting": {
			"icon": "icon-waiting",
			"disabled": true,
			"label": self.labels.get("posting")
		}
	};
	var button = new Echo.Button(element, states.normal);
	this.posting = this.posting || {};
	this.posting.subscriptions = this.posting.subscriptions || [];
	var subscribe = function(phase, state, callback) {
		var topic = submit.name + ".onPost" + phase;
		var subscriptions = self.posting.subscriptions;
		if (subscriptions[topic]) {
			self.events.unsubscribe({
				"topic": topic,
				"handlerId": subscriptions[topic]
			});
		}
		subscriptions[topic] = self.events.subscribe({
			"topic": topic,
			"handler": function(topic, params) {
				button.set(state);
				if (callback) callback();
			}
		});
	};
	
	subscribe("Init", states.posting);
	subscribe("Complete", states.normal, function() {
		self.dom.get("text").val("").trigger("blur");
		self.render("tags");
		self.render("markers");
	});
	subscribe("Error", states.normal);
	
	this.posting.action = this.posting.action || function() {
		var highlighted = false;
		$.each(["name", "text"], function (i, v) {
			highlighted = self.highlightMandatory(self.dom.get(v));
			return !highlighted;
		});
		if (highlighted) return;
		self.post();
	};
	element.unbind("click", this.posting.action).bind("click", this.posting.action);
	return element;
};

// methods

submit.methods.post = function() {
	var self = this;
	var publish = function(phase, data) {
		var params = {
			"topic": "onPost" + phase,
			"data": self.prepareBroadcastParams({
				"postData": data
			})
		};
		self.events.publish(params);
	};
	var content = [].concat(this.getActivity("post", "comment", this.dom.get("text").val()),
				this.getActivity("tag", "marker", this.dom.get("markers").val()),
				this.getActivity("tag", "tag", this.dom.get("tags").val()));
	var entry= {
		"content": content,
		"appkey": this.config.get("appkey"),
		"sessionID": this.user.get("sessionID", "")
	};
	if (this.config.get("targetQuery")) {
		entry["target-query"] = this.config.get("targetQuery");
	}
	var timer;
	var hasPreviousTimeout = false;
	var callbacks = {
		"onData": function(data) {
			publish("Complete", content);
		},
		"onError": function(data) {
			data = data || {};
			if (timer) clearTimeout(timer);
			// we have previous timeout on the client side so we just ignore errors from server side
			if (hasPreviousTimeout) return;
			var isNetworkTimeout = hasPreviousTimeout = ($.inArray(data.errorCode, ["network_timeout", "connection_failure"]) >= 0);
			var message = isNetworkTimeout
				? self.labels.get("postingTimeout")
				: self.labels.get("postingFailed", {"error": data.errorMessage || data.errorCode});
			$.fancybox({
				"content": '<div class="' + self.cssPrefix + '-error">' + message + '</div>',
				"height": 70,
				"width": isNetworkTimeout ? 320 : 390,
				"padding": 15,
				"orig": self.dom.get("text"),
				"autoDimensions": false,
				"transitionIn": "elastic",
				"transitionOut": "elastic",
				"onComplete": function() {
					// set fixed dimensions of the fancybox-wrap (for IE in quirks mode it should be bigger)
					if ($.browser.msie && document.compatMode != "CSS1Compat") {
						var options = arguments[2];
						var delta = 2 * options.padding + 40;
						$("#fancybox-wrap").css({
							"width": options.width + delta,
							"height": options.height + delta
						});
					}
				}
			});
			publish("Error", data);
		}
	};
	publish("Init", content);
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"apiBaseURL": this.config.get("submissionProxyURL"),
		"timeout": this.config.get("postingTimeout"),
		"data": entry,
		"onData": callbacks.onData,
		"onError": callbacks.onError
	}).send();
};


submit.methods.getActivity = function(verb, type, data) {
	return (!data) ? [] : {
		"actor": {
			"objectTypes": [ "http://activitystrea.ms/schema/1.0/person" ],
			"name": this.user.get("name", ( this.user.is("logged") ? "" : this.dom.get("name").val() )),
			"avatar": this.user.get("avatar", "")
		},
		"object": {
			"objectTypes": [ "http://activitystrea.ms/schema/1.0/" + type ],
			"content": data,
		},
		"source": this.config.get("source"),
		"verbs": [ "http://activitystrea.ms/schema/1.0/" + verb ],
		"targets": [{
			"id": this.config.get("targetURL")
		}]
	};
};

submit.methods.highlightMandatory = function(element) {
	if (element && !$.trim(element.val())) {
		var css = this.cssPrefix + "-mandatory";
		element.parent().addClass(css);
		element.focus(function() {
			$(this).parent().removeClass(css);
		});
		return true;
	}
	return false;
};

submit.methods.prepareBroadcastParams = function(params) {
	params = params || {};
	params.data = this.config.get("data");
	params.target = this.config.get("target").get(0);
	params.targetURL = this.config.get("targetURL");
	return params;
};

submit.methods.refresh = function() {
	this.config.set("data.object.content", this.dom.get("text").val());
	this.rerender();
	var component = Echo.Utils.getComponent("Echo.StreamServer.Controls.Submit");
	component.parent.refresh.call(this);
};

submit.css =
	'.{class:header} { margin-bottom: 3px; }' +
	'.{class:avatar} { float: left; margin-right: -48px; }' +
	'.{class:avatar} img { width: 48px; height: 48px; }' +
	'.{class:fields} { width: 100%; float: left; }' +
	'.{class:fields} input { width: 100%; }' +
	'.{class:fieldsWrapper} { margin-left: 53px; }' +
	'.{class:nameContainer} { margin: 1px 0px 4px 0px; padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'.{class:name} { font-size: 14px; font-weight: bold; border: none; }' +
	'.{class:urlContainer} { padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'.{class:url} { height: 19px; border: none; }' +
	'.{class:author} { font-weight: bold; }' +
	'.{class:content} { padding: 5px 5px 5px 6px; background-color: #fff; }' +
	'.{class:textArea} { width: 100%; height: 102px; padding: 0px; margin: 0px; border: none; resize:none ; }' +
	'.{class:text} input { width: 100%; border: none; }' +
	'.{class:metadataContainer} { margin-top: 6px; }' +
	'.{class:metadataLabel} { float: left; width: 50px; margin-right: -50px; text-align: right; line-height: 22px; }' +
	'.{class:metadataWrapper} { float: left; width: 100%; }' +
	'.{class:metadataSubwrapper} { margin-left: 55px; padding: 2px 2px 2px 3px; background-color: #fff; }' +
	'.{class:metadataSubwrapper} input { width: 100%; border: none; }' +
	'.{class:controls} { margin-top: 5px; }' +
	'.{class:postContainer} { float: right; }' +
	'.{class:border} { border: 1px solid #d2d2d2; }' +
	'.{class:mandatory} { border: 1px solid red; }' +
	'.{class:queriesViewOption} { padding-right: 5px; }' +
	'.{class:error} { color: #444444; font: 14px Arial; line-height: 150%; padding-left: 85px; background: no-repeat url("' + Echo.Loader.cdnBaseURL + 'images/info70.png"); height: 70px; }' +
	(($.browser.msie) ?
		'.{class:container} { zoom: 1; }' +
		'.{class:body} { zoom: 1; }' +
		'.{class:header} { zoom: 1; }' +
		'.{class:content} { zoom: 1; }' +
		'.{class:markersContainer} { zoom: 1; }' +
		'.{class:tagsContainer} { zoom: 1; }' : '') +
	(($.browser.webkit) ?
		// get rid of extra gray line inside input elements on iOS
		'.{class:container } input { background-position: 0px; }' +
		'.{class:container } textarea { background-position: 0px; }' +
		'.{class:textArea} { outline: none; }' +
		'.{class:name} { outline: none; }' +
		'.{class:url} { outline: none; }' +
		'.{class:metadataSubwrapper} input { outline: none; }' : '');

Echo.Control.create(submit);

})(jQuery);
