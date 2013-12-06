Echo.define([
	"jquery",
	"echo/utils",
	"echo/app-dashboard"
], function($, Utils, Dashboard) {

"use strict";

var dashboard = Dashboard.definition("Echo.Apps.SDKControls.FacePile.Dashboard");

dashboard.inherits = Utils.getComponent("Echo.Apps.SDKControls.Control.Dashboard");

dashboard.dependencies = [{
	"url": "{config:cdnBaseURL.apps.root}/echo/sdk-controls/v3/dashboard.js",
	"control": "Echo.Apps.SDKControls.Control.Dashboard"
}];

dashboard.init = function() {
	this.parent();
};

dashboard.config.ecl = [{
	"component": "Select",
	"name": "appkey",
	"type": "string",
	"config": {
		"title": "Application key",
		"desc": "Specifies the application key for this instance",
		"options": []
	}
}, {
	"name": "query",
	"type": "string",
	"component": "Input",
	"config": {
		"title": "Search query",
		"validators": ["required"],
		"desc": "Specifies the search query to generate the necessary data set",
		"data": {"sample": "childrenof:http://example.com/js-sdk"}
	}
}, {
	"name": "suffixText",
	"type": "string",
	"component": "Input",
	"config": {
		"title": "Suffix text",
		"desc": "Specifies the text being appended to the end of FacePile user's list.",
		"data": {"sample": "participate in this discussion"}
	}
}, {
	"name": "useSecureAPI",
	"type": "boolean",
	"default": false,
	"component": "Checkbox",
	"config": {
		"title": "Force secure connection for HTTP pages",
		"desc": "This parameter is used to specify the API request scheme. If parameter is set to false or not specified, the API request object will use the scheme used to retrieve the host page."
	}
}, {
	"name": "item",
	"type": "object",
	"component": "Group",
	"config": {
		"title": "FacePile item settings",
		"icons": {"default": {"type": "bootstrap", "source": "icon-list-alt"}}
	},
	"items": [{
		"name": "defaultAvatar",
		"type": "string",
		"component": "Input",
		"config": {
			"title": "Default avatar URL",
			"desc": "Default avatar URL which will be used for the user in case there is no avatar information defined in the user profile. Also used for anonymous users.",
			"data": {"sample": "http://cdn.echoenabled.com/images/avatar-default.png"}
		}
	}, {
		"name": "avatar",
		"type": "boolean",
		"default": true,
		"component": "Checkbox",
		"config": {
			"title": "Show user avatar",
			"desc": "Specifies if the user avatar should be rendered within the FacePile item."
		}
	}, {
		"name": "text",
		"type": "boolean",
		"default": true,
		"component": "Checkbox",
		"config": {
			"title": "Show user name",
			"desc": "Specifies if the user name should be rendered within the FacePile item."
		}
	}]
}];

return Dashboard.create(dashboard);

});
