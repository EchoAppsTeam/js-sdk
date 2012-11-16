(function(jQuery) {
"use strict";

var $ = jQuery;

/**
 * @class Echo.StreamServer.Controls.Submit
 * Echo Submit control which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/35059196/API-method-submit" target="_blank">Echo Submit API</a>
 *
 * 	new Echo.StreamServer.Controls.Submit({
 * 		"target": document.getElementById("submit"),
 * 		"targetURL": "http://example.com/submit",
 * 		"appkey": "test.js-kit.com",
 * 	});
 *
 * @extends Echo.Control
 *
 * @constructor
 * Submit constructor initializing Echo.StreamServer.Controls.Submit class
 *
 * @param {Object} config
 * Configuration options
 */
var submit = Echo.Control.manifest("Echo.StreamServer.Controls.Submit");

if (Echo.Control.isDefined(submit)) return;

submit.init = function() {
	var self = this;
	this.addPostValidator(function() {
		var valid = true;
		$.each(["name", "text"], function (i, field) {
			valid = !self.highlightMandatory(self.view.get(field));
			return valid;
		});
		return valid;
	}, "low");
	this.render();
	this.ready();
};

submit.config = {
	/**
	 * @cfg {String} [targetURL=document.location.href]
	 * Specifies the URI to which the submitted Echo item is related. 
	 * This parameter will be used as a activity target value for the item.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"targetURL": "http://somedomain.com/some_article.html",
	 * 		...
	 * 	});
	 */
	"targetURL": document.location.href,
	/**
	 * @cfg {Array} markers
	 * This parameter is used to attach the markers metadata to the item
	 * during the item submission. The format of the value is the array 
	 * with the string values. Markers will be also displayed in the "Markers"
	 * field in the Submit form UI for Moderators and Administrators.
	 * For non-admin users the markers value will be submitted along with the
	 * other item content when the "Post" button is pressed.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"markers": ["marker1", "marker2", "marker3"],
	 * 		...
	 * 	});
	 */
	"markers": [],
	/**
	 * @cfg {Object} source
	 * Designates the initial item source (E.g. Twitter). You can override
	 * source name, URI and the corresponding icon.
	 *
	 * @cfg {String} source.name
	 * Source name.
	 *
	 * @cfg {String} source.uri
	 * Source uri.
	 *
	 * @cfg {String} source.icon
	 * Source icon.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"source": {
	 * 			"name": "ExampleSource",
	 * 			"uri": "http://example.com/",
	 * 			"icon": "http://example.com/images/source.png"
	 * 		},
	 * 		...
	 * 	});
	 */
	"source": {},
	/**
	 * @cfg {Array} tags
	 * This parameter is used to attach the tags metadata to the item during
	 * the item submission. The format of the value is the array array with
	 * the string values. Tags will be also displayed in the "Tags" field in
	 * the Submit form UI for Moderators and Administrators. For non-admin
	 * users the tags value will be submitted along with the other item
	 * content when the "Post" button is pressed.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"tags": ["tag1", "tag2", "tag3"],
	 * 		...
	 * 	});
	 */
	"tags": [],
	/**
	 * @cfg {String} requestMethod
	 * This parameter is used to specify the request method. Possible values
	 * are "GET" and "POST". Setting parameter to "POST" has some restrictions.
	 * We can't handle server response, UI won't show any waiting for the
	 * server responses actions.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"requestMethod": "POST",
	 * 		...
	 * 	});
	 */
	"requestMethod": "GET",
	/**
	 * @cfg {String} itemURIPattern
	 * Allows to define item id pattern. The value of this parameter should be
	 * a valid URI with "{id}" placeholder which will indicate the place where
	 * unique id should be inserted. If this parameter is ommited in
	 * configuration or the URI is invalid it'll be ignored.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"itemURIPattern": "http://your-domain.com/path/{id}",
	 * 		...
	 * 	});
	 */
	"itemURIPattern": undefined,
	/**
	 * @cfg {String} actionString
	 * Is used to define the default call to action phrase.
	 *
	 *     new Echo.StreamServer.Controls.Submit({
	 *         ...
	 *         "actionString": "Type your comment here...",
	 *         ...
	 *     });
	 */
	"actionString": "Type your comment here...",
	/**
	 * @cfg {Number} postingTimeout
	 * Is used to specify the number of seconds after which Submit Form will show
	 * timeout error dialog if the server does not return anything. If the parameter
	 * value is 0 then the mentioned dialog won't never be shown.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"postingTimeout": 15,
	 * 		...
	 * 	});
	 */
	"postingTimeout": 30,
	/**
	 * @cfg {String} type
	 * Allows to define item type. The value of this parameter should be a valid URI.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"type": "http://echoenabled.com/activitystreams/schema/1.0/category",
	 * 		...
	 * 	});
	 */
	"type": undefined,
	/**
	 * @cfg {Object} errorPopup
	 * Is used to define dimensions of error message popup. The value of this parameter
	 * is an object with the following fields:
	 *
	 * @cfg {Number} errorPopup.minHeight
	 * The minimum height of error message popup.
	 *
	 * @cfg {Number} errorPopup.maxHeight
	 * The maximum height of error message popup.
	 *
	 * @cfg {Number} errorPopup.width
	 * The width of error message popup.
	 *
	 * 	new Echo.StreamServer.Controls.Submit({
	 * 		...
	 * 		"errorPopup": {
	 * 			"minHeight": 70,
	 * 			"maxHeight": 150,
	 * 			"width": 390
	 * 		}
	 * 		...
	 * 	});
	 */
	"errorPopup": {
		"minHeight": 70,
		"maxHeight": 150,
		"width": 390
	},
	"targetQuery": undefined
};

submit.vars = {
	"validators": []
};

submit.dependencies = [{
	"loaded": function() { return !!Echo.jQuery.echoButton; },
	"url": "{config:cdnBaseURL.sdk}/third-party/bootstrap/echo-button.js"
}, {
	"loaded": function() { return !!Echo.jQuery.echoModal; },
	"url": "{config:cdnBaseURL.sdk}/third-party/bootstrap/echo-modal.js"
}];

submit.labels = {
	/**
	 * @echo_label
	 */
	"markers": "Markers:",
	/**
	 * @echo_label
	 */
	"markersHint": "Marker1, marker2, marker3, ...",
	/**
	 * @echo_label
	 * Label for the button allowing to submit form
	 */
	"post": "Post",
	/**
	 * @echo_label
	 */
	"posting": "Posting...",
	/**
	 * @echo_label
	 */
	"postingFailed": "There was a server error while trying to submit your item. Please try again in a few minutes. <b>Error: \"{error}\"</b>.",
	/**
	 * @echo_label
	 */
	"postingTimeout": "There was a network issue while trying to submit your item. Please try again in a few minutes.",
	/**
	 * @echo_label
	 */
	"tagsHint": "Tag1, tag2, tag3, ...",
	/**
	 * @echo_label
	 */
	"tags": "Tags:",
	/**
	 * @echo_label
	 */
	"yourName": "Your Name (required)",
	/**
	 * @echo_label
	 */
	"yourWebsiteOptional": "Your website (optional)"
};

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
				'<button class="{class:postButton} btn echo-primaryFont"></button>' +
			'</div>' +
			'<div class="echo-clear"></div>' +
		'</div>' +
	'</div>';

/**
 * @echo_renderer
 */
submit.renderers.tagsContainer = function(element) {
	return (this.user.is("admin")) ? element.show() : element.hide();
};

/**
 * @method
 * @echo_renderer
 * @param element
 */
submit.renderers.markersContainer = submit.renderers.tagsContainer;

/**
 * @echo_renderer
 */
submit.renderers.markers = function(element) {
	return this.view.render({
		"name": "_metaFields",
		"target": element,
		"extra": {"type": "markers"}
	});
};

/**
 * @echo_renderer
 */
submit.renderers.tags = function(element) {
	return this.view.render({
		"name": "_metaFields",
		"target": element,
		"extra": {"type": "tags"}
	});
};

/**
 * @echo_renderer
 */
submit.renderers.text = function(element) {
	var content = this.get("data.object.content");
	if (content) element.val(content);
	return element.iHint({
		"text": this.config.get("actionString"),
		"className": "echo-secondaryColor"
	});
};

/**
 * @echo_renderer
 */
submit.renderers.avatar = function(element) {
	var avatar = Echo.Utils.loadImage({
		"image": this.user.get("avatar"),
		"defaultImage": this.config.get("defaultAvatar")
	});
	return element.empty().append(avatar);
};

/**
 * @echo_renderer
 */
submit.renderers.name = function(element) {
	return element.val(this.user.get("name", "")).iHint({
		"text": this.labels.get("yourName"),
		"className": "echo-secondaryColor"
	});
};

/**
 * @echo_renderer
 */
submit.renderers.url = function(element) {
	return element.val(this.user.get("domain", "")).iHint({
		"text": this.labels.get("yourWebsiteOptional"),
		"className": "echo-secondaryColor"
	});
};

/**
 * @echo_renderer
 */
submit.renderers.postButton = function(element) {
	var self = this;
	var states = {
		"normal": {
			"icon": false,
			"disabled": false,
			"label": this.labels.get("post")
		},
		"posting": {
			"icon": this.config.get("cdnBaseURL.sdk-assets") + "/images/loading.gif",
			"disabled": true,
			"label": this.labels.get("posting")
		}
	};
	element.empty().echoButton(states.normal);
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
				element.echoButton("update", state);
				if (callback) callback(params);
			}
		});
	};
	
	subscribe("Init", states.posting);
	subscribe("Complete", states.normal, function() {
		self.view.get("text").val("").trigger("blur");
		self.view.render({"name": "tags"});
		self.view.render({"name": "markers"});
	});
	subscribe("Error", states.normal, function(params) {
		self._showError(params.postData);
	});
	this.posting.action = this.posting.action || function() {
		if (self._isPostValid()) {
			self.post();
		}
	};
	element.off("click", this.posting.action).on("click", this.posting.action);
	return element;
};

submit.renderers._metaFields = function(element, extra) {
	var type = extra.type;
	var data = this.get("data.object." + type) || [];
	var value = $.trim(Echo.Utils.stripTags(data.join(", ")));
	return this.view.get(type).iHint({
		"text": this.labels.get(type + "Hint"),
		"className": "echo-secondaryColor"
	}).val(value).blur();
};

/**
 * Method used for posting user provided content to the
 * <a href="http://wiki.aboutecho.com/w/page/35059196/API-method-submit" target="_blank"> Echo Submit</a>
 * endpoint through <a href="http://wiki.aboutecho.com/w/page/53021402/Echo%20Submission%20Proxy" target="_blank"> Echo Submission Proxy</a>.
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
	var postType = this.config.get("type", this._getASURL("comment"));
	var content = [].concat(
		self._getActivity("post", postType, self.view.get("text").val()),
		self._getActivity("tag", this._getASURL("marker"), self.view.get("markers").val()),
		self._getActivity("tag", this._getASURL("tag"), self.view.get("tags").val())
	);
	var entry = {
		"content": content,
		"appkey": this.config.get("appkey"),
		"sessionID": this.user.get("sessionID", "")
	};
	if (this.config.get("targetQuery")) {
		entry["target-query"] = this.config.get("targetQuery");
	}
	var callbacks = {
		"onData": function(data) {
			/**
			 * @event onPostComplete
			 * @echo_event Echo.StreamServer.Controls.Submit.onPostComplete
			 * Triggered when the submit operation is finished.
			 */
			publish("Complete", entry);
			/**
			 * @event onDataInvalidate
			 * @echo_event Echo.Control.onDataInvalidate
			 * Triggered if dataset is changed.
			 */
			// notify all widgets on the page about a new item posted
			Echo.Events.publish({
				"topic": "Echo.Control.onDataInvalidate",
				"context": "global",
				"data": {}
			});
		},
		"onError": function(data) {
			/**
			 * @event onPostError
			 * @echo_event Echo.StreamServer.Controls.Submit.onPostError
			 * Triggered if submit operation failed.
			 */
			publish("Error", data);
		}
	};
	/**
	 * @event onPostInit
	 * @echo_event Echo.StreamServer.Controls.Submit.onPostInit
	 * Triggered if submit operation was started.
	 */
	publish("Init", entry);
	Echo.StreamServer.API.request({
		"endpoint": "submit",
		"method": this.config.get("requestMethod"),
		"submissionProxyURL": this.config.get("submissionProxyURL"),
		"timeout": this.config.get("postingTimeout"),
		"data": entry,
		"onData": callbacks.onData,
		"onError": callbacks.onError
	}).send();
};

/**
 * Method highlighting the mandatory input data fields if they are empty
 */
submit.methods.highlightMandatory = function(element) {
	if (element && !$.trim(element.val())) {
		var css = this.cssPrefix + "mandatory";
		element.parent().addClass(css);
		element.focus(function() {
			$(this).parent().removeClass(css);
		});
		return true;
	}
	return false;
};

/**
 * Method adds custom validator to check posting possibility
 */
submit.methods.addPostValidator = function(validator, priority) {
	this.validators[priority === "low" ? "push" : "unshift"](validator);
};

/**
 * Method implements the refresh logic for the Submit control.
 */
submit.methods.refresh = function() {
	var self = this;
	this.config.set("data.object.content", this.view.get("text").val());
	$.map(["tags", "markers"], function(field) {
		var elements = self.view.get(field).val().split(", ");
		self.config.set("data.object." + field, elements || []);
	});
	var component = Echo.Utils.getComponent("Echo.StreamServer.Controls.Submit");
	component.parent.refresh.call(this);
};

submit.methods._getActivity = function(verb, type, data) {
	return !data ? [] : {
		"actor": {
			"objectTypes": [this._getASURL("person")],
			"name": this.user.get("name", this.user.is("logged")
					? ""
					: this.view.get("name").val()),
			"avatar": this.user.get("avatar", "")
		},
		"object": {
			"objectTypes": [type],
			"content": data
		},
		"source": this.config.get("source"),
		"verbs": [this._getASURL(verb)],
		"targets": [{
			"id": this.config.get("targetURL")
		}]
	};
};

submit.methods._getASURL = function(postfix) {
	return "http://activitystrea.ms/schema/1.0/" + postfix;
};

submit.methods._showError = function(data) {
	var self = this;
	data = data || {};
	var isNetworkTimeout = $.inArray(data.errorCode, ["network_timeout", "connection_failure"]) >= 0;
	var message = isNetworkTimeout
		? this.labels.get("postingTimeout")
		: this.labels.get("postingFailed", {"error": data.errorMessage || data.errorCode});
	var popup = this._assembleErrorPopup(message);

	$.echoModal({
		"data": {
			"body": popup.content
		},
		"width": popup.width,
		"footer": false,
		"fade": true,
		"show": true
	});
};

submit.methods._assembleErrorPopup = function(message) {
	var dimensions = this.config.get("errorPopup");
	var template = this.substitute({
		"template": '<div class="{data:css}">{data:message}</div>',
		"data": {
			"message": message,
			"css": this.cssPrefix + "error"
		}
	});
	var popup = {
		"content": $(template).css({
			"min-height": dimensions.minHeight,
			"max-height": dimensions.maxHeight
		}),
		"width": dimensions.width
	};
	return popup;
};

submit.methods._isPostValid = function() {
	var self = this, valid = true;
	$.each(this.validators, function(i, handler) {
		valid = handler();
		return valid;
	});
	return valid;
};

submit.methods._prepareEventParams = function(params) {
	return $.extend(params, {
		"data": this.get("data"),
		"target": this.config.get("target").get(0),
		"targetURL": this.config.get("targetURL")
	});
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
	'.{class:error} { color: #444444; font: 14px Arial; line-height: 150%; padding-left: 85px; background: no-repeat url({config:cdnBaseURL.sdk-assets}/images/info70.png); }' +
	($.browser.msie ?
		'.{class:container} { zoom: 1; }' +
		'.{class:body} { zoom: 1; }' +
		'.{class:header} { zoom: 1; }' +
		'.{class:content} { zoom: 1; }' +
		'.{class:markersContainer} { zoom: 1; }' +
		'.{class:tagsContainer} { zoom: 1; }' : '') +
	($.browser.webkit ?
		// get rid of extra gray line inside input elements on iOS
		'.{class:container} input { background-position: 0px; }' +
		'.{class:container} textarea { background-position: 0px; }' +
		'.{class:textArea} { outline: none; }' +
		'.{class:name} { outline: none; }' +
		'.{class:url} { outline: none; }' +
		'.{class:metadataSubwrapper} input { outline: none; }' : '');

Echo.Control.create(submit);

})(Echo.jQuery);
