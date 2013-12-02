Echo.define("echo/streamserver/bundled-apps/submit/dashboard", [
	"jquery",
	"echo/utils",
	"echo/app-dashboard"
], function($, Utils, Dashboard) {

"use strict";

var dashboard = Dashboard.definition("Echo.Apps.SDKControls.Submit.Dashboard");

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
	"component": "Input",
	"name": "targetURL",
	"type": "string",
	"config": {
		"title": "Target URL",
		"validators": ["required"],
		"desc": "Specifies the URI to which the submitted Echo item is related",
		"data": {"sample": "http://example.com/js-sdk"}
	}
}, {
	"component": "Input",
	"name": "actionString",
	"type": "string",
	"config": {
		"title": "Action string",
		"desc": "Defines the default call to action phrase",
		"data": {"sample": "Write your post here..."}
	}
}, {
	"component": "Input",
	"name": "defaultAvatar",
	"type": "string",
	"config": {
		"title": "Default avatar URL",
		"desc": "Default avatar URL which will be used for the user in case there is no avatar information defined in the user profile",
		"data": {"sample": "http://example.com/avatar.png"}
	}
}, {
	"component": "Input",
	"name": "type",
	"type": "string",
	"config": {
		"title": "Item type",
		"desc": "Allows to define item type. The value of this parameter should be a valid ActivityStreams URI",
		"data": {"sample": "http://activitystrea.ms/schema/1.0/comment"}
	}
}, {
	"name": "itemURIPattern",
	"component": "Input",
	"type": "string",
	"config": {
		"title": "Item ID pattern",
		"desc": "Allows to define item id pattern. The value of this parameter should be a valid URI with \"{id}\" placeholder which will indicate the place where unique id should be inserted. If this parameter is omitted in configuration or the URI is invalid it'll be ignored.",
		"data": {"sample": "http://your-domain.com/path/{id}"}
	}
}, {
	"name": "postingTimeout",
	"component": "Input",
	"type": "number",
	"default": 30,
	"config": {
		"title": "Posting timeout",
		"desc": "Is used to specify the number of seconds after which the Submit Form will show the timeout error dialog if the server does not return anything. If the parameter value is 0 then the mentioned dialog will never be shown."
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
	"name": "requestMethod",
	"component": "Select",
	"type": "string",
	"default": "GET",
	"config": {
		"title": "Submit request method",
		"desc": "This parameter is used to specify the request method. Possible values are \"GET\" and \"POST\". Setting parameter to \"POST\" has some restrictions. We can't handle server response, UI won't show any waiting for the server responses actions.",
		"options": [{
			"title": "GET",
			"value": "GET"
		}, {
			"title": "POST",
			"value": "POST"
		}]
	}
}, {
	"component": "Group",
	"name": "errorPopup",
	"type": "object",
	"config": {
		"title": "Error popup dimensions",
		"desc": "Is used to define dimensions of error message popup"
	},
	"items": [{
		"component": "Input",
		"name": "minHeight",
		"type": "number",
		"default": 70,
		"config": {
			"title": "Min height",
			"data": {"sample": "50, 100, ..."}
		}
	}, {
		"component": "Input",
		"name": "maxHeight",
		"type": "number",
		"default": 150,
		"config": {
			"title": "Max height",
			"data": {"sample": "50, 100, ..."}
		}
	}, {
		"component": "Input",
		"name": "width",
		"type": "number",
		"default": 390,
		"config": {
			"title": "Width",
			"data": {"sample": "50, 100, ..."}
		}
	}]
}, {
	"component": "Group",
	"name": "source",
	"type": "object",
	"config": {
		"title": "Item source",
		"desc": "Designates the initial item source (E.g. Twitter)"
	},
	"items": [{
		"component": "Input",
		"name": "name",
		"type": "string",
		"config": {
			"title": "Name",
			"desc": "Source name",
			"data": {"sample": "MySource"}
		}
	}, {
		"component": "Input",
		"name": "uri",
		"type": "string",
		"config": {
			"title": "URI",
			"desc": "Source URI",
			"data": {"sample": "http://example.com/"}
		}
	}, {
		"component": "Input",
		"name": "icon",
		"type": "string",
		"config": {
			"title": "Icon",
			"desc": "Source icon",
			"data": {"sample": "http://example.com/images/source.png"}
		}
	}]
}];

return Dashboard.create(dashboard);

});
