(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.Controls.Submit")) return;

/**
 * @class Echo.StreamServer.Controls.Submit
 * Echo Submit control which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/35059196/API-method-submit" target="_blank">Echo Submit API</a>
 * @extends Echo.Control
 * @inheritdoc Echo.Control
 *
 * @constructor
 * Counter constructor initializing Echo.StreamServer.Controls.Submit class
 * @param {Object} config Configuration options
 */
var submit = Echo.Control.skeleton("Echo.StreamServer.Controls.Submit");

submit.config = {
/**
 * @cfg {String} [targetURL=document.location.href] Specifies the URI to which the submitted Echo item is related. This parameter will be used as a activity target value for the item.
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "targetURL": "http://somedomain.com/some_article.html",
 *         ...
 *     });
 */
	"targetURL": document.location.href,
/**
 * @cfg {Array} markers This parameter is used to attach the markers metadata to the item during the item submission. The format of the value is the array array with the string values. Markers will be also displayed in the "Markers" field in the Submit form UI for Moderators and Administrators. For non-admin users the markers value will be submitted along with the other item content when the "Post" button is pressed.
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "markers": ["marker1", "marker2", "marker3"],
 *         ...
 *     });
 */
	"markers": [],
/**
 * @cfg {Object} source Designates the initial item source (E.g. Twitter). You can override source name, URI and the corresponding icon.
 * @cfg {String} source.name Source name.
 * @cfg {String} source.uri Source uri.
 * @cfg {String} source.icon Source icon.
 *
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "source": {
 *             "name": "ExampleSource",
 *             "uri": "http://example.com/",
 *             "icon": "http://example.com/images/source.png"
 *         }, 
 *         ...
 *     });
 */
	"source": {},
/**
 * @cfg {Array} tags This parameter is used to attach the tags metadata to the item during the item submission. The format of the value is the array array with the string values. Tags will be also displayed in the "Tags" field in the Submit form UI for Moderators and Administrators. For non-admin users the tags value will be submitted along with the other item content when the "Post" button is pressed. 
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "tags": ["tag1", "tag2", "tag3"],
 *         ...
 *     });
 */
	"tags": [],
/**
 * @cfg {String} requestMethod This parameter is used to specify the request method. Possible values are "GET" and "POST".
 * Setting parameter to "POST" has some restrictions.
 * We can't handle server response, UI won't show any waiting for the server responses actions
 *
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "requestMethod": "POST",
 *         ...
 *     });
 */
	"requestMethod": "GET",
/**
 * @cfg {String} itemURIPattern Allows to define item id pattern. The value of this parameter should be a valid URI with "{id}" placeholder which will indicate the place where unique id should be inserted. If this parameter is ommited in configuration or the URI is invalid it'll be ignored.
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "itemURIPattern": "http://your-domain.com/path/{id}",
 *         ...
 *     });
 */
	"itemURIPattern": undefined,
/**
 * @cfg {String} actionString Is used to define the default call to action phrase.
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "actionString": "Type your comment here...",
 *         ...
 *     });
 */
	"actionString": "Type your comment here...",
/**
 * @cfg {Number} postingTimeout Is used to specify the number of seconds after which Submit Form will show timeout error dialog if the server does not return anything. If the parameter value is 0 then the mentioned dialog won't never be shown.
 *     new Echo.StreamServer.Controls.Submit({
 *         ...
 *         "postingTimeout": 15,
 *         ...
 *     });
 */
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

submit.constructor = function() {
	this.render();
}

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
	return dom.get(type).iHint({
		"text": this.labels.get(type + "Hint"),
		"className": "echo-secondaryColor"
	}).blur();
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
		self.render({
			"element": "tags"
		});
		self.render({
			"element": "markers"
		});
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
/**
 * @method post
 * Method used for posting user provided content to the <a href="http://wiki.aboutecho.com/w/page/35059196/API-method-submit" target="_blank"> Echo Submit</a> endpoint through <a href="http://wiki.aboutecho.com/w/page/53021402/Echo%20Submission%20Proxy" target="_blank"> Echo Submission Proxy</a>.
 */
submit.methods.post = function() {
	var self = this;
	var publish = function(phase, data) {
		var params = {
			"topic": "onPost" + phase,
			"data": {"postData": data}
		};
		self.events.publish(params);
	};
	var content = [].concat(self._getActivity("post", "comment", self.dom.get("text").val()),
				 self._getActivity("tag", "marker", self.dom.get("markers").val()),
				 self._getActivity("tag", "tag", self.dom.get("tags").val()));
	var entry = {
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
			/**
			 * @event onPostComplete
			 * Echo.StreamServer.Controls.Submit.onPostComplete
			 * is triggered when the submit operation is finished
			 */
			publish("Complete", entry);
			// notify all widgets on the page about a new item posted
			/**
			 * @event onDataInvalidate
			 * Echo.Control.onDataInvalidate
			 * is triggered if dataset is changed
			 */
			Echo.Events.publish({
				"topic": "Echo.Control.onDataInvalidate",
				"context": "global"
			});
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
			/**
			 * @event onPostError
			 * Echo.StreamServer.Controls.Submit.onPostError
			 * is triggered if submit operation failed
			 */
			publish("Error", data);
		}
	};
	/**
	 * @event onPostInit
	 * Echo.StreamServer.Controls.Submit.onPostInit
	 * is triggered if submit operation was started
	 */
	publish("Init", entry);
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"submissionProxyURL": this.config.get("submissionProxyURL"),
		"timeout": this.config.get("postingTimeout"),
		"data": entry,
		"onData": callbacks.onData,
		"onError": callbacks.onError
	}).send();
};

submit.methods._getActivity = function(verb, type, data) {
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

/**
 * @method highlightMandatory
 * Method highlighting the mandatory input data fields if they are empty
 */
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

/**
 * @method prepareBroadcastParams
 * Prepares data for further broadcasting through Echo.Events
 * @return {Object} preformatted data for publishing through Echo.Events mechanics
 */
submit.methods.prepareBroadcastParams = function(params) {
	params = params || {};
	params.data = this.get("data");
	params.target = this.config.get("target").get(0);
	params.targetURL = this.config.get("targetURL");
	return params;
};

/**
 * @method refresh
 * Method implements the refresh logic for the Submit control.
 */
submit.methods.refresh = function() {
	this.set("data.object.content", this.dom.get("text").val());
	this.render();
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
