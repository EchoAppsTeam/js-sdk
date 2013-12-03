Echo.define("echo/app-dashboard", [
	"jquery",
	"echo/utils",
	"echo/app",
], function($, Utils, App) {

"use strict";

//temporal!
var AppServerHelper = Echo.AppServer;

var Dashboard = {};

Dashboard = Utils.inherit(App);

Dashboard.create = App.create;

Dashboard.definition = App.definition;

Dashboard.isDefined = App.isDefined;//?

Dashboard._merge = App._merge;

Dashboard._definition = $.extend(true, {}, App._definition, {
	"config": {
		"apiBaseURL": "{%= baseURLs.api %}",
		"cdnBaseURL": "{%= baseURLs.cdn %}"
	},
	"route": {
		"local": {
			"path": "/default"
		},
		"prefix": "",
		"path": "/default"
	},
	"routes": {
		"default": {
			"spec": "/default",
			"handler": function() {}
		}
	}
});

Dashboard._definition.name = "Echo.App.Dashboard";

Dashboard.prototype.getCSSClass = function(name, ignoreInheritance) {
	var keys = ignoreInheritance ? ["class"] : ["inherited.class", "class"];
	var template = $.map(keys, function(key) {
		return "{" + key + ":" + name + "}";
	}).join(" ");
	return this.substitute({"template": template});
};

Dashboard.prototype.flipCSSClasses = function(element, toRemove, toAdd, ignorePrefix, ignoreInheritance) {
	var self = this;
	var wrap = function(css) {
		 return ignorePrefix ? css : self.getCSSClass(css, ignoreInheritance);
	};
	return element
		.removeClass(wrap(toRemove))
		.addClass(wrap(toAdd));
};

var initializers = $.extend(true, {}, Dashboard.prototype._initializers);

var list = initializers.list;

$.each(list, function(i, spec) {
	// insert router initializer before 'view'
	if (spec[0] === "view") {
		list.splice(i, 0, ["router", ["init", "refresh"]]);
		return false;
	}
});

initializers.router = function() {
	var route = Utils.invoke(this.constructor._definition.route, this);
	var routes = Utils.invoke(this.constructor._definition.routes, this);
	route.path = AppServerHelper.URLObserver.getFragment();
	return new AppServerHelper.Router({
		"widget": this,
		"config": {
			"route": route,
			"routes": routes
		}
	});
};

Dashboard.prototype._initializers = initializers;

// static interface (specific mehtods for Echo.AppServer.Dashboard)

var endpoints = {
	"{data:customer}": "customer/{customerId}",
	"{data:app.info}": "app/{appId}",
	"{data:app.plans}": "app/{appId}/plans",
	"{data:app.token}": "customer/{customerId}/app/{appId}/subscription",
	"{data:subscription}": "customer/{customerId}/app/{appId}/subscription",
	"{data:apps.janrain.apps}": "customer/{customerId}/janrainapps",
	"{data:apps.streamserver.appkeys}": "customer/{customerId}/appkeys",
	"{data:apps.streamserver.domains}": "customer/{customerId}/domains"
};

var handlers = {
	"{data:user}": function(config) {
		return User;
	},
	"{data:app.token}": function(config, data) {
		return data.token;
	},
	"{data:apps.janrainapp.apps}": function(config, data) {
		return $.map(data, function(app) {
			return {
				"name": app.name,
				"email": app.email
			};
		});
	}
};

Dashboard.normalizeConfig = function(config, callback, refetch) {

	var data = AppServerHelper.Utils.traverse(config, {}, function(value, acc, key) {
		var handler = handlers[value];
		var endpoint = endpoints[value];

		if (handler && !endpoint) {
			Echo.Utils.set(config, key, handler(config, value));
			return;
		}
		if (endpoint) {
			if (!acc[value]) {
				acc[value] = {
					"keys": [],
					"endpoint": endpoint
				};
			}
			acc[value]["keys"].push(key);
		}
	});

	var requests = Utils.foldl({}, data || {}, function(value, acc, key) {
		acc[key] = value.endpoint.replace(/{(\w+)}/g, function(tmp, found) {
			return Utils.get({
				"appId": config.appId,
				"customerId": config.customerId
			}, found);
		});
	});

	Dashboard.fetchRequestedData(requests, function(response) {
		var _config = {};
		$.each(data, function(id, value) {
			$.map(value.keys, function(key) {
				var handler = handlers[id];
				Utils.set(_config, key, $.isFunction(handler) ? handler(config, response[id]) : response[id]);
			});
		});
		var normalizedConfig = $.extend(true, {}, config, _config);
		// TODO: get rid of following two lines when AppDetails will be on v3 architecture
		delete normalizedConfig.appId;
		delete normalizedConfig.customerId;
		callback(normalizedConfig);
	}, refetch);
};

Dashboard.fetchRequestedData = function(requests, callback, refetch) {
	callback = callback || $.noop;
	if ($.isEmptyObject(requests)) {
		callback();
		return;
	}
	var response = {};
	var uncached = Utils.foldl([], requests || {}, function(request, acc, id) {
		var cached = Dashboard.Cache.get(request);
		if (cached && !refetch) {
			response[id] = cached;
		} else {
			acc.push({
				"id": id,
				"endpoint": request
			});
		}
	});

	if (!uncached.length) {
		callback(response);
		return;
	}

	AppServerHelper.API.request({
		"endpoint": "mux",
		"data": {
			"requests": uncached
		},
		"onData": function(data) {
			$.map(data, function(atom) {
				response[atom.id] = atom.data;
				Dashboard.Cache.set(requests[atom.id], atom.data);
			});
			callback(response);
		}
	}).send();
};

Dashboard.prepareConfig = function(dashboard) {
	var self = this;
	var presetDashboards = {
		"instances": function() {
			// TODO: get rid of this condition which was introduced for backward compatibility
			return dashboard.config && dashboard.config.appSettings ? dashboard : {
				"component": "Echo.AppServer.Controls.AppInstanceManager",
				"script": "{cdnBaseURL:apps.appserver}/full.pack.js",
				"config": $.extend(true, {
					"user": "{data:user}",
					"app": "{data:app.info}",
					"customer": "{data:customer}",
					"token": "{data:app.token}",
					"appSettings": dashboard
				}, dashboard.config ? dashboard.config.instanceManager : {})
			};
		},
		"external": function() {
			return {
				"component": "Echo.AppServer.Dashboards.External",
				"script": "{cdnBaseURL:apps.appserver}/full.pack.js",
				"config": dashboard.config
			}
		}
	};
	return presetDashboards[dashboard.type] ? presetDashboards[dashboard.type]() : dashboard;
};

// TODO: move this class to App model when it'll be ready

Dashboard.getByType = function(dashboards, type) {
	// TODO: get rid of these preset dashboards which were introduced for backward compatibility
	var presetDashboards = {
		"instances": function(dashboard) {
			return dashboard.config && dashboard.config.appSettings
				? dashboard.config.appSettings : dashboard;
		}
	};
	var found;
	$.each(dashboards, function(i, dashboard) {
		// TODO we consider 'id' also because StreamSentiment Trending dashboard
		// draw it's own ProductInstanceManager and it's dashboard has default type ('widget')
		// So, we should consider this 'widget' dashboard as 'instances'
		// We should get rid of this hack when StreamSentiment dashboard type will be 'instances'.
		var dashboardType = dashboard.type || dashboard.id;
		if (dashboardType === type) {
			found = presetDashboards[type] ? presetDashboards[type](dashboard) : dashboard;
			return false;
		}
	});
	return found;
};

if (!Dashboard.Cache) {
	Dashboard.Cache = new AppServerHelper.Cache({"prefix": "Echo.AppServer.Dashboard"});
}

//SDKControls.Dashboard definition
var dashboard = Dashboard.definition("Echo.Apps.SDKControls.Control.Dashboard");

dashboard.inherits = Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.init = function() {
	this.parent();
};

dashboard.config.normalizer = {
	"ecl": function(obj) {
		var self = this;
		return $.map(obj, function(item) {
			if (item.name === "appkey") {
				item.config.options = $.map(self.get("appkeys"), function(appkey) {
					return {
						"title": appkey.key,
						"value": appkey.key
					};
				});
			}
			return item;
		});
	}
};

dashboard.methods.declareInitialConfig = function() {
	var keys = this.config.get("appkeys", []);
	return keys.length ? {
		"appkey": keys[0].key
	} : {};
};

return Dashboard.create(dashboard);
});
