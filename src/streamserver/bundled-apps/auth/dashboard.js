Echo.define([
	"jquery",
	"echo/utils",
	"echo/app-dashboard"
], function($, Utils, Dashboard) {

"use strict";

var dashboard = Dashboard.definition("Echo.Apps.SDKControls.Auth.Dashboard");

dashboard.inherits = Utils.getComponent("Echo.Apps.SDKControls.Control.Dashboard");

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
	"name": "defaultAvatar",
	"type": "string",
	"component": "Input",
	"config": {
		"title": "Default avatar URL",
		"desc": "Default avatar URL which will be used for the user in case there is no avatar information defined in the user profile",
		"data": {"sample": "http://cdn.echoenabled.com/images/avatar-default.png"}
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
	"name": "identityManager",
	"type": "object",
	"component": "Group",
	"config": {
		"title": "Identity manager settings",
		"desc": "The list of handlers for login, edit and signup action. If some action is omitted then it will not be available for users in the Auth control. Each handler accepts sessionID as GET parameter. This parameter is necessary for communication with Backplane server. When handler finishes working it constructs the corresponding Backplane message (for login, signup or user data update) and sends this message to Backplane server."
	},
	"items": [{
		"name": "login",
		"type": "object",
		"component": "Group",
		"config": {
			"title": "Login popup",
			"desc": "Encapsulates data for login workflow."
		},
		"items": [{
			"name": "url",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "URL",
				"desc": "Specifies the URL to be opened as an auth handler.",
				"data": {"sample": "http://example.com/auth"}
			}
		}, {
			"name": "width",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Width",
				"desc": "Specifies the width of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "height",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Height",
				"desc": "Specifies the height of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "title",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "Title",
				"desc": "Specifies the Title of the auth modal dialog.",
				"data": {"sample": "Modal dialog title"}
			}
		}]
	}, {
		"name": "signup",
		"type": "object",
		"component": "Group",
		"config": {
			"title": "Signup popup",
			"desc": "Encapsulates data for login workflow."
		},
		"items": [{
			"name": "url",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "URL",
				"desc": "Specifies the URL to be opened as an auth handler.",
				"data": {"sample": "http://example.com/auth"}
			}
		}, {
			"name": "width",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Width",
				"desc": "Specifies the width of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "height",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Height",
				"desc": "Specifies the height of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "title",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "Title",
				"desc": "Specifies the Title of the auth modal dialog.",
				"data": {"sample": "Modal dialog title"}
			}
		}]
	}, {
		"name": "edit",
		"type": "object",
		"component": "Group",
		"config": {
			"title": "Edit popup",
			"desc": "Encapsulates data for login workflow."
		},
		"items": [{
			"name": "url",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "URL",
				"desc": "Specifies the URL to be opened as an auth handler.",
				"data": {"sample": "http://example.com/auth"}
			}
		}, {
			"name": "width",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Width",
				"desc": "Specifies the width of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "height",
			"type": "number",
			"component": "Input",
			"config": {
				"title": "Height",
				"desc": "Specifies the height of the visible auth area.",
				"data": {"sample": 400}
			}
		}, {
			"name": "title",
			"type": "string",
			"component": "Input",
			"config": {
				"title": "Title",
				"desc": "Specifies the Title of the auth modal dialog.",
				"data": {"sample": "Modal dialog title"}
			}
		}]
	}]
}];

return Dashboard.create(dashboard);

});
