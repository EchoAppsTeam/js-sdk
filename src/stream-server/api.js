(function($) {

if (Echo.Utils.isComponentDefined("Echo.StreamServer.API")) return;

if (!Echo.StreamServer) Echo.StreamServer = {};

Echo.StreamServer.API = {};

Echo.StreamServer.API.Request = function(config) {
	var self = this;
	config = $.extend({
		"liveUpdatesTimeout": 5,
		"onData": function() {},
		"skipInitialRequest": false,
		"onError": function() {},
		"submissionProxyURL": "apps.echoenabled.com/v2/esp/activity"
	}, config);
	config = this._wrapTransportEventHandlers(config);
	this.requestType = "initial"; // initial | secondary
	Echo.StreamServer.API.Request.parent.constructor.call(this, config);
};

Echo.Utils.inherit(Echo.StreamServer.API.Request, Echo.API.Request);

Echo.StreamServer.API.Request.prototype.abort = function() {
	this.transport && this.transport.abort();
	if (this.liveUpdates) {
		this._stopLiveUpdates();
		delete this.liveUpdates;
	}
};

Echo.StreamServer.API.Request.prototype._search = Echo.StreamServer.API.Request.prototype._count = function(args) {
	args = args || {};
	if (this.config.get("recurring")) {
		if (!this.liveUpdates) {
			this._initLiveUpdates();
		}
		this._startLiveUpdates(args.force);
		return;
	}
	this.request(args.data);
};

Echo.StreamServer.API.Request.prototype._wrapTransportEventHandlers = function(config) {
	var self = this;
	var _config = $.extend({}, config);
	return $.extend(config, {
		"onData": function(response, requestParams) {
			self._onData(response, {
				"requestType": self.requestType
			}, _config);
		},
		"onError": function(responseError, requestParams) {
			self._onError(responseError, requestParams, _config);
		}
	});
};

Echo.StreamServer.API.Request.prototype._onData = function(response, requestParams, config) {
	response = response || {};
	if (this.liveUpdates && this.liveUpdates.responseHandler && this.requestType === "secondary") {
		this.liveUpdates.responseHandler(response);
	}
	this.constructor.parent._onData.apply(this, arguments);
	if (response.result === "error") {
		this._handleErrorResponse(response, {
			"callback": config.onError
		});
		return;
	}
	config.onData(response, requestParams);
	if (!this.error && this.requestType === "initial") {
		this.requestType = "secondary";
	}
	this._cleanupErrorHandlers(true);
	if (this.requestType === "initial") {
		this.abort();
		return;
	}
	this.nextSince = response.nextSince;
	this._startLiveUpdates();
};

Echo.StreamServer.API.Request.prototype._onError = function(responseError, requestParams, config) {
	this.constructor.parent._onError.apply(this, arguments);
	this._handleErrorResponse(responseError, {
		"callback": config.onError
	});
	if (this.requestType !== "secondary" || !this._isWaitingForData(responseError)) {
		this.abort();
	}
};

Echo.StreamServer.API.Request.prototype._submit = function() {
	this.request(
		$.extend(this.config.get("data"), {
			"content": Echo.Utils.object2JSON(this._AS2KVL(this.config.get("data.content")))
		})
	);
};

Echo.StreamServer.API.Request.prototype._prepareURI = function() {
	if (this.config.get("endpoint") === "submit") {
		return this.config.get("submissionProxyURL");
	}
	return this.constructor.parent._prepareURI.call(this);
};

Echo.StreamServer.API.Request.prototype._getTransport = function() {
	return this.constructor.parent._getTransport.call(this);
};

Echo.StreamServer.API.Request.prototype._initLiveUpdates = function() {
	var self = this;
	this.liveUpdates = {
		"originalTimeout": this.config.get("liveUpdatesTimeout"),
		"timers": {},
		"timeouts": [],
		"responseHandler": function(data) {
			self._changeLiveUpdatesTimeout(data);
		}
	};
};

Echo.StreamServer.API.Request.prototype._changeLiveUpdatesTimeout = function(data) {
	var self = this;
	// backwards compatibility
	if (typeof data == "string") {
		data = {"liveUpdatesTimeout": data};
	}
	data.liveUpdatesTimeout = parseInt(data.liveUpdatesTimeout);
	var applyServerDefinedTimeout = function(timeout) {
		if (!timeout && self.liveUpdates.originalTimeout != self.config.get("liveUpdatesTimeout")) {
			self.config.set("liveUpdatesTimeout", self.liveUpdates.originalTimeout);
		} else if (timeout && timeout > self.config.get("liveUpdatesTimeout")) {
			self.config.set("liveUpdatesTimeout", timeout);
		}
	};
	var hasNewData = function(data) {
		// for "v1/search" endpoint at the moment
		return !!(data.entries && data.entries.length);
	};
	if (!this.nextSince) {
		applyServerDefinedTimeout(data.liveUpdatesTimeout);
		return;
	}
	var currentTimeout = this.config.get("liveUpdatesTimeout");
	var since = parseInt(this.nextSince);
	var currentTime = Math.floor((new Date()).getTime() / 1000);
	// calculate the delay before starting next request:
	//   - have new data but still behind and need to catch up - use minimum timeout
	//   - have new data but on the track - increase timeout by 1 second
	//   - have no new data - increase timeout by 2 seconds
	var timeout = hasNewData(data)
		? currentTime - since > currentTimeout
			? this.config.get("liveUpdatesTimeoutMin", 3)
			: currentTimeout + 1
		: currentTimeout + 2;
	if (timeout > this.liveUpdates.originalTimeout) {
		timeout = this.liveUpdates.originalTimeout;
	}
	this.config.set("liveUpdatesTimeout", timeout);
	// if timeout remains the same, take server side value into account
	if (timeout == this.liveUpdates.originalTimeout) {
		applyServerDefinedTimeout(data.liveUpdatesTimeout);
	}
};

Echo.StreamServer.API.Request.prototype._stopLiveUpdates = function() {
	if (this.liveUpdates.timers.regular) {
		clearTimeout(this.liveUpdates.timers.regular);
	}
};

Echo.StreamServer.API.Request.prototype._startLiveUpdates = function(force) {
	var self = this;
	if (!this.liveUpdates) return;
	this._stopLiveUpdates();
	if (force) {
		// if live updates requests were forced after some operation, we will
		// perform 3 attempts to get live updates: immediately, in 1 second
		// and in 3 seconds after first one
		this.liveUpdates.timeouts = [0, 1, 3];
	}
	var timeout = this.liveUpdates.timeouts.length
		? this.liveUpdates.timeouts.shift()
		: this.config.get("liveUpdatesTimeout");
	if (this.requestType === "initial" && !this.error && !this.config.get("skipInitialRequest")) {
		this.request({
			"nextSince": self.nextSince 
		});
		return;
	} else if (this.requestType === "initial") {
		this.config.get("onData")({}, {
			"requestType": this.requestType
		});
		this.requestType = "secondary";
		return;
	}
	this.liveUpdates.timers.regular = setTimeout(function() {
		self.request({
			"nextSince": self.nextSince 
		});
	}, timeout * 1000);
};

Echo.StreamServer.API.Request.prototype._isWaitingForData = function(data) {
	return data && $.inArray(data.errorCode, ["waiting", "timeout", "busy", "view_limit", "view_update_capacity_exceeded"]) >= 0;
};

Echo.StreamServer.API.Request.prototype._isErrorWithTimer = function(data) {
	return data && $.inArray(data.errorCode, ["view_limit", "view_update_capacity_exceeded"]) >= 0;
};

Echo.StreamServer.API.Request.prototype._handleErrorResponse = function(data, config) {
	var self = this;
	config = config || {};
	var timeElapsed = 0;
	var maxWaitingTimeout = 0;
	var errorCallback = config.callback;
	var calcWaitingTimeout = function() {
		// interval is calculated as e^x, x=[1..4]
		if (self.waitingTimeoutStep > 0) {
			if (self.waitingTimeoutStep < 4) {
				self.waitingTimeoutStep++;
			}
		} else {
			self.waitingTimeoutStep = 1;
		}
		return Math.round(Math.exp(self.waitingTimeoutStep)) * 1000;
	};
	if (this._isWaitingForData(data)) {
		maxWaitingTimeout = calcWaitingTimeout();
		var timeout = this._isErrorWithTimer(data) ? 1000 : maxWaitingTimeout;
		this.waitingTimer = setInterval(function() {
			timeElapsed += timeout;
			if (timeElapsed == maxWaitingTimeout) {
				self._cleanupErrorHandlers();
				if (!self.liveUpdates && self.requestType === "initial") {
					self._initLiveUpdates();
				}
				errorCallback(data, {
					"requestType": self.requestType,
					"retryTimeout": timeout,
					"critical": false
				});
				self._startLiveUpdates();
			}
		}, timeout);
	} else {
		this.waitingTimeoutStep = 0;
		errorCallback(data, {
			"requestType": self.requestType,
			"critical": true
		});
	}
	this.error = data;
};

Echo.StreamServer.API.Request.prototype._cleanupErrorHandlers = function(successResponseReceived) {
	if (successResponseReceived) {
		this.waitingTimeoutStep = 0;
		delete this.error;
	}
	if (this.waitingTimer) {
		clearInterval(this.waitingTimer);
	}
};

Echo.StreamServer.API.Request.prototype._AS2KVL = function(entries) {
	var self = this;
	entries = $.isArray(entries) ? entries : [entries];
	var strip = function(value) {
		return value
			.replace("http://activitystrea.ms/schema/1.0/", "")
			.replace("http://js-kit.com/spec/e2/v1/", "");
	};
	var prepareActivity = function(activity, meta) {
		var data = {
			"avatar": activity.actor && activity.actor.avatar,
			"content": activity.object && activity.object.content,
			"markers": meta.markers ? $.trim(meta.markers) : undefined,
			"name": activity.actor && (activity.actor.name || activity.actor.title),
			"source": activity.source,
			"tags": meta.tags ? $.trim(meta.tags) : undefined,
			"target": activity.targets[0].id,
			"verb": verb(activity),
			"type": type(activity),
			"itemURIPattern": self.config.get("itemURIPattern")
		};
		if (verb(activity) === "update") {
			data = {
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
			$.each(activity.object, function(key, value) {
				if (key !== "objectTypes") {
					data["field"] = key;
					data["value"] = value;
					return false;
				}
			});
		} else if (/tag/.test(verb(activity))) {
			data = {
				"tags": activity.object && activity.object.content,
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
		} else if (/mark/.test(verb(activity))) {
			data = {
				"markers": activity.object && activity.object.content,
				"verb": verb(activity),
				"target": activity.targets[0].id
			};
		}
		return data;
	};
	var verb = function(entry) {
		return strip(entry.verbs[0]);
	};
	var type = function(entry) {
		return entry.object && entry.object.objectTypes ? strip(entry.object.objectTypes[0]) : undefined;
	};
	var post, meta = {"markers": "", "tags": ""};
	$.map(entries, function(entry) {
		if (/tag|mark/.test(verb(entry)) && /tag|marker/.test(type(entry))) {
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
		return prepareActivity(entry, meta);
	});
};

Echo.StreamServer.API.request = function(config) {
	return (new Echo.StreamServer.API.Request(config));
};

})(jQuery);
