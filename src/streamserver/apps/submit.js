define("echo/streamserver/apps/submit", [
	"jquery",
	"require",
	"echo/app",
	"echo/utils",
	"echo/streamserver/api",
	"echo/gui",
	"echo/gui/button",
	"echo/events", 
	"echo/gui/modal",
	"css!echo/gui.pack"
], function($, require, App, Utils, API, GUI, GUIButton, Events, GUIModal) {
"use strict";

/**
 * @class Echo.StreamServer.Apps.Submit
 * Echo Submit application which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/35059196/API-method-submit" target="_blank">Echo Submit API</a>
 * and provides a simple ‘submit/comment form’ style interaction.
 *
 * 	new Echo.StreamServer.Apps.Submit({
 * 		"target": document.getElementById("submit"),
 * 		"targetURL": "http://example.com/submit",
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 	});
 *
 * More information regarding the possible ways of the Application initialization
 * can be found in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-an-app) guide.
 *
 * @extends Echo.App
 *
 * @package streamserver/apps.pack.js
 * @package streamserver.pack.js
 *
 * @constructor
 * Submit constructor initializing Echo.StreamServer.Apps.Submit class
 *
 * @param {Object} config
 * Configuration options
 */
var submit = App.manifest("Echo.StreamServer.Apps.Submit");

if (App.isDefined(submit)) return;

/** @hide @cfg apiBaseURL */
/** @hide @echo_label loading */
/** @hide @echo_label retrying */
/** @hide @echo_label error_busy */
/** @hide @echo_label error_timeout */
/** @hide @echo_label error_waiting */
/** @hide @echo_label error_view_limit */
/** @hide @echo_label error_view_update_capacity_exceeded */
/** @hide @echo_label error_result_too_large */
/** @hide @echo_label error_wrong_query */
/** @hide @echo_label error_incorrect_appkey */
/** @hide @echo_label error_internal_error */
/** @hide @echo_label error_quota_exceeded */
/** @hide @echo_label error_incorrect_user_id */
/** @hide @echo_label error_unknown */

/**
 * @echo_event Echo.StreamServer.Apps.Submit.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Submit.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Submit.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Submit.onRerender
 * Triggered when the app is rerendered.
 */

submit.init = function() {
	if (!this.config.get("appkey")) {
		return Utils.showError({
			"errorCode": "incorrect_appkey",
			"label": this.labels.get("error_incorrect_appkey")
		}, {
			"critical": true,
			"target": this.config.get("target")
		});
	}

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
	 * @cfg {String} appkey
	 * Specifies the customer application key. You should specify this parameter
	 * if your application uses StreamServer or IdentityServer API requests.
	 * You can use the "echo.jssdk.demo.aboutecho.com" appkey for testing purposes.
	 */
	"appkey": "",

	/**
	 * @cfg {String} apiBaseURL
	 * URL prefix for all API requests
	 */
	"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",
	/**
	 * @cfg {String} defaultAvatar
	 * Default avatar URL which will be used for the user in
	 * case there is no avatar information defined in the user
	 * profile. Also used for anonymous users.
	 */
	"defaultAvatar": require.toUrl("echo-assets/images/avatar-default.png", false),
	/**
	 * @cfg {String} [targetURL=document.location.href]
	 * Specifies the URI to which the submitted Echo item is related. 
	 * This parameter will be used as a activity target value for the item.
	 *
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * with the string values. Markers will also be displayed in the "Markers"
	 * field in the Submit form UI for Moderators and Administrators.
	 * For non-admin users the markers value will be submitted along with
	 * other item content when the "Post" button is pressed.
	 *
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 *     new Echo.StreamServer.Apps.Submit({
	 *         ...
	 *         "actionString": "Type your comment here...",
	 *         ...
	 *     });
	 */
	"actionString": "Type your comment here...",
	/**
	 * @cfg {Number} postingTimeout
	 * Is used to specify the number of seconds after which the Submit Form will show
	 * the timeout error dialog if the server does not return anything. If the parameter
	 * value is 0 then the mentioned dialog will never be shown.
	 *
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	 * 	new Echo.StreamServer.Apps.Submit({
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
	"targetQuery": undefined,
	/**
	 * @cfg {String} submissionProxyURL
	 * URL prefix for requests to Echo Submission Proxy
	 */
	"submissionProxyURL": "https:{%=baseURLs.api.submissionproxy%}/v2/esp/activity",
	/**
	 * @cfg {Boolean} useSecureAPI
	 * This parameter is used to specify the API request scheme.
	 * If parameter is set to false or not specified, the API request object
	 * will use the scheme used to retrieve the host page.
	 */
	"useSecureAPI": false
};

submit.config.normalizer = {
	"defaultAvatar": require.toUrl
};

submit.vars = {
	"validators": []
};

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

/**
 * @echo_template
 */
submit.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:header}">' +
			'<div class="{class:userInfoWrapper}">' +
				'<div class="{class:avatar}"></div>' +
				'<div class="{class:fields}">' +
					'<div class="{class:fieldsWrapper}">' +
						'<div class="{class:nameContainer} {class:border}">' +
							'<input type="text" class="{class:name} echo-primaryFont echo-primaryColor" />' +
						'</div>' +
						'<div class="{class:urlContainer} {class:border}">' +
							'<input type="text" class="{class:url} echo-primaryFont echo-primaryColor" />' +
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
						'<input type="text" class="{class:markers} echo-primaryFont" />' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
			'<div class="{class:tagsContainer} {class:metadataContainer} echo-primaryFont echo-primaryColor">' +
				'<div class="{class:metadataLabel}">{label:tags}</div>' +
				'<div class="{class:metadataWrapper}">' +
					'<div class="{class:metadataSubwrapper} {class:border} ">' +
						'<input type="text" class="{class:tags} {class:border} echo-primaryFont" />' +
					'</div>' +
				'</div>' +
				'<div class="echo-clear"></div>' +
			'</div>' +
		'</div>' +
		'<div class="{class:controls}">' +
			'<div class="{class:postContainer}">' +
				'<div class="btn echo-primaryFont {class:postButton}"></div>' +
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
	Utils.placeImage({
		"container": element,
		"image": this.user.get("avatar"),
		"defaultImage": this.config.get("defaultAvatar")
	});
	return element;
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
			"target": element,
			"icon": false,
			"disabled": false,
			"label": this.labels.get("post")
		},
		"posting": {
			"target": element,
			"icon": this.config.get("cdnBaseURL.sdk-assets") + "/images/loading.gif",
			"disabled": true,
			"label": this.labels.get("posting")
		}
	};
	var postButton = new GUIButton(states.normal);
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
				postButton.setState(state);
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
		var request = params.request || {};
		if (request.state && request.state.critical) {
			self._showError(params);
		}
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
	var data = this.get("data.object." + type, this.config.get(type));
	var value = $.trim(Utils.stripTags(data.join(", ")));
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
	var publish = function(phase, data, responseBody, requestState) {
		var args = {
			"topic": "onPost" + phase,
			"data": {"postData": data}
		};
		if (requestState || responseBody) {
			args.data.request = {
				"state": requestState,
				"response": responseBody
			};
		}
		self.events.publish(args);
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
		"onData": function(response, state) {
			/**
			 * @echo_event Echo.StreamServer.Apps.Submit.onPostComplete
			 * Triggered when the submit operation is finished.
			 */
			publish("Complete", entry, response, state);

			/**
			 * @echo_event Echo.App.onDataInvalidate
			 * Triggered if dataset is changed.
			 */
			// notify all widgets on the page about a new item posted
			Events.publish({
				"topic": "Echo.App.onDataInvalidate",
				"context": "global",
				"data": {}
			});
		},
		"onError": function(response, state) {
			/**
			 * @echo_event Echo.StreamServer.Apps.Submit.onPostError
			 * Triggered if submit operation failed.
			 */
			publish("Error", entry, response, state);
		}
	};
	/**
	 * @echo_event Echo.StreamServer.Apps.Submit.onPostInit
	 * Triggered if submit operation was started.
	 */
	publish("Init", entry);
	API.request({
		"endpoint": "submit",
		"method": this.config.get("requestMethod"),
		"itemURIPattern": this.config.get("itemURIPattern"),
		"submissionProxyURL": this.config.get("submissionProxyURL"),
		"timeout": this.config.get("postingTimeout"),
		"secure": this.config.get("useSecureAPI"),
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
 * This Method adds a custom validator to check the posting possibility.
 */
submit.methods.addPostValidator = function(validator, priority) {
	this.validators[priority === "low" ? "push" : "unshift"](validator);
};

/**
 * Method implements the refresh logic for the Submit application.
 */
submit.methods.refresh = function() {
	var self = this;
	this.config.set("data.object.content", this.view.get("text").val());
	$.map(["tags", "markers"], function(field) {
		var elements = self.view.get(field).val().split(", ");
		self.config.set("data.object." + field, elements || []);
	});
	var component = Utils.getComponent("Echo.StreamServer.Apps.Submit");
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
	var response = data.request && data.request.response || {};
	var message = $.inArray(response.errorCode, ["network_timeout", "connection_failure"]) >= 0
		? this.labels.get("postingTimeout")
		: this.labels.get("postingFailed", {"error": response.errorMessage || response.errorCode});
	var popup = this._assembleErrorPopup(message);

	new GUIModal({
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
	'.{class:avatar} { float: left; margin-right: -48px; width: 48px; height: 48px; }' +
	'.{class:fields} { width: 100%; float: left; }' +
	'.{class:fields} input { width: 100%; }' +
	'.{class:fieldsWrapper} { margin-left: 53px; }' +
	'.{class:nameContainer} { margin: 1px 0px 4px 0px; padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'.{class:nameContainer} input.{class:name} { font-size: 14px; font-weight: bold; border: none; width: 100%;}' +
	'.{class:fieldsWrapper} input.{class:name}[type="text"] { width: 100%; margin-bottom: 0px; border: none; padding: 0px; outline: 0; box-shadow: none; }' +
	'.{class:fieldsWrapper} input.{class:name}[type="text"]:focus { outline: 0; box-shadow: none;  }' +
	'.{class:urlContainer} { padding: 0px 2px 1px 3px; background-color: #fff; }' +
	'.{class:urlContainer} input.{class:url} { height: 19px; border: none; width: 100%; margin-bottom: 0px;}' +
	'.{class:fieldsWrapper} input.{class:url}[type="text"] { width: 100%; margin-bottom: 0px; border: none; padding: 0px; outline: 0; box-shadow: none;  }' +
	'.{class:fieldsWrapper} input.{class:url}[type="text"]:focus { outline: 0; box-shadow: none; }' +
	'.{class:fieldsWrapper} input.{class:url}[type="text"].echo-secondaryColor,' +
	'.{class:fieldsWrapper} input.{class:name}[type="text"].echo-secondaryColor,' +
	'.{class:content} textarea.{class:textArea}.echo-secondaryColor,' +
	'.{class:container} .{class:metadataSubwrapper} input.echo-secondaryColor[type="text"]' +
		' { color: #C6C6C6 }' +
	'.{class:author} { font-weight: bold; }' +
	'.{class:content} { padding: 5px 5px 5px 6px; background-color: #fff; }' +
	'.{class:content} textarea.{class:textArea} { width: 100%; height: 102px; padding: 0px; margin: 0px; border: none; resize:none; box-shadow: none; outline: 0; }' +
	'.{class:content} textarea.{class:textArea}:focus { outline: 0; box-shadow: none; }' +
	'.{class:text} input { width: 100%; border: none; }' +
	'.{class:metadataContainer} { margin-top: 6px; }' +
	'.{class:metadataLabel} { float: left; width: 50px; margin-right: -50px; text-align: right; line-height: 22px; }' +
	'.{class:metadataWrapper} { float: left; width: 100%; }' +
	'.{class:metadataSubwrapper} { margin-left: 55px; padding: 2px 2px 2px 3px; background-color: #fff; }' +
	'.{class:container} .{class:metadataSubwrapper} input[type="text"] { width: 100%; border: 0; padding: 0px; outline: 0; box-shadow: none; margin-bottom: 0px; }' +
	'.{class:container} .{class:metadataSubwrapper} input[type="text"]:focus { outline: 0; box-shadow: none; }' +
	'.{class:controls} { margin-top: 5px; }' +
	'.{class:postContainer} { float: right; }' +
	'.{class:border} { border: 1px solid #d2d2d2; }' +
	'.{class:mandatory} { border: 1px solid red; }' +
	'.{class:queriesViewOption} { padding-right: 5px; }' +
	'.{class:error} { color: #444444; font: 14px Arial; line-height: 150%; padding-left: 85px; background: no-repeat url({config:cdnBaseURL.sdk-assets}/images/info70.png); }';

return App.create(submit);

});
