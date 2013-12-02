Echo.define("echo/streamserver/bundled-apps/stream/dashboard", [
	"jquery",
	"echo/utils",
	"echo/app-dashboard"
], function($, Utils, Dashboard) {

"use strict";

var dashboard = Dashboard.definition("Echo.Apps.SDKControls.Stream.Dashboard");

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
	"name": "query",
	"component": "Input",
	"type": "string",
	"config": {
		"title": "Search query",
		"validators": ["required"],
		"desc": "Specifies the search query to generate the necessary data set",
		"data": {"sample": "childrenof:http://example.com/js-sdk"}
	}
}, {
	"name": "defaultAvatar",
	"type": "string",
	"component": "Input",
	"config": {
		"title": "Default avatar URL",
		"desc": "Default avatar URL which will be used for the user in case there is no avatar information defined in the user profile",
		"data": {"sample": "http://example.com/avatar.png"}
	}
}, {
	"name": "fadeTimeout",
	"component": "Input",
	"type": "number",
	"default": 2800,
	"config": {
		"title": "New item fade timeout",
		"desc": "Specifies the duration of the fading animation (in milliseconds) when an item comes to stream as a live update.",
		"info": "in milliseconds",
		"data": {"sample": "1000, 2000, ..."}
	}
}, {
	"name": "slideTimeout",
	"component": "Input",
	"type": "number",
	"default": 600,
	"config": {
		"title": "New item slide timeout",
		"desc": "Specifies the duration of the sliding animation (in milliseconds) when an item comes to a stream as a live update.",
		"info": "in milliseconds",
		"data": {"sample": "500, 1000, 1500, ..."}
	}
}, {
	"name": "flashColor",
	"component": "Input",
	"type": "string",
	"default": "#ffff99",
	"config": {
		"title": "New item flash color",
		"desc": "Specifies the necessary flash color of the events coming to your stream as live updates. This parameter must have a hex color value.",
		"data": {"sample": "#ffff99"}
	}
}, {
	"name": "providerIcon",
	"component": "Input",
	"type": "string",
	"config": {
		"title": "Default provider icon",
		"desc": "Specifies the URL to the icon representing data provider.",
		"data": {"sample": "http://example.com/icon.png"}
	}
}, {
	"name": "openLinksInNewWindow",
	"component": "Checkbox",
	"type": "boolean",
	"default": false,
	"config": {
		"title": "Open links in a new window",
		"desc": "If this parameter value is set to true, each link will be opened in a new window. This is especially useful when using the control in a popup window."
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
	"name": "children",
	"component": "Group",
	"type": "object",
	"config": {
		"title": "Child items pagination settings"
	},
	"items": [{
		"name": "additionalItemsPerPage",
		"component": "Input",
		"type": "number",
		"default": 5,
		"config": {
			"title": "Additional items per page",
			"desc": "Specifies how many items should be retrieved from server and rendered after clicking the \"View more items\" button.",
			"data": {"sample": "2, 3, 5..."}
		}
	}, {
		"name": "moreButtonSlideTimeout",
		"component": "Input",
		"type": "number",
		"default": 600,
		"config": {
			"title": "\"More\" button slide up timeout",
			"desc": "Specifies the duration of more button slide up animation in the situation when there are no more children items available and the button should be removed.",
			"info": "in milliseconds",
			"data": {"sample": "500, 1000, 1500, ..."}
		}
	}, {
		"name": "itemsSlideTimeout",
		"component": "Input",
		"type": "number",
		"default": 600,
		"config": {
			"title": "Items slide down timeout",
			"desc": "Specifies the duration of the slide down animation of the items coming to the stream after the \"View more items\" button click.",
			"info": "in milliseconds",
			"data": {"sample": "500, 1000, 1500, ..."}
		}
	}]
}, {
	"name": "item",
	"component": "Group",
	"type": "object",
	"config": {
		"title": "Item settings"
	},
	"items": [{
		"name": "aggressiveSanitization",
		"component": "Checkbox",
		"type": "boolean",
		"config": {
			"title": "Aggressive content sanitization",
			"desc": "If this parameter value is set to true, the entire item body will be replaced with the \"I just shared this on Twitter...\" text in the stream in case the item came from Twitter."
		}
	}, {
		"name": "reTag",
		"component": "Checkbox",
		"type": "boolean",
		"default": true,
		"config": {
			"title": "Enable \"RE\" tag",
			"desc": "Allows to show/hide the \"RE\" tag"
		}
	}, {
		"name": "optimizedContext",
		"component": "Checkbox",
		"type": "boolean",
		"default": true,
		"config": {
			"title": "Optimized context for \"RE\" tag",
			"desc": "Allows to configure the context mode for the \"RE\" tag. If set to true the context is turned into optimized mode. The \"RE\" tag contains only one hyperlink in this case (the same current domain is a priority). Otherwise all hyperlinks in the item body will be resolved and converted into \"RE\" tags."
		}
	}, {
		"name": "limits",
		"component": "Group",
		"type": "object",
		"config": {
			"title": "Content truncation rules"
		},
		"items": [{
			"name": "maxBodyCharacters",
			"component": "Input",
			"type": "number",
			"config": {
				"title": "Max body characters",
				"desc": "Allows to truncate the number of characters of the body. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "100, 200, ..."}
			}
		}, {
			"name": "maxBodyLines",
			"component": "Input",
			"type": "number",
			"config": {
				"title": "Max body lines",
				"desc": "Allows to truncate the number of lines of the body. The value of this parameter should be integer and represents the number of lines that need to be displayed. Note: the definition of \"Line\" here is the sequence of characters separated by the \"End Of Line\" character",
				"data": {"sample": "5, 10, ..."}
			}
		}, {
			"name": "maxBodyLinkLength",
			"component": "Input",
			"type": "number",
			"default": 50,
			"config": {
				"title": "Max body link length",
				"desc": "Allows to truncate the number of characters of the hyperlinks in the item body. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "10, 20, ..."}
			}
		}, {
			"name": "maxMarkerLength",
			"component": "Input",
			"type": "number",
			"default": 16,
			"config": {
				"title": "Max marker length",
				"desc": "Allows to truncate the number of characters of markers in the item body. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "10, 20, ..."}
			}
		}, {
			"name": "maxReLinkLength",
			"component": "Input",
			"type": "number",
			"default": 30,
			"config": {
				"title": "Max \"RE\" link length",
				"desc": "Allows to truncate the number of characters of hyperlinks in the \"RE\" tag. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "10, 20, ..."}
			}
		}, {
			"name": "maxReTitleLength",
			"component": "Input",
			"type": "number",
			"default": 143,
			"config": {
				"title": "Max \"RE\" title length",
				"desc": "Allows to truncate the number of characters of titles in \"RE\" tag. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "10, 20, ..."}
			}
		}, {
			"name": "maxTagLength",
			"component": "Input",
			"type": "number",
			"default": 16,
			"config": {
				"title": "Max tag length",
				"desc": "Allows to truncate the number of characters of tags in the item body. The value of this parameter should be integer and represents the number of visible characters that need to be displayed.",
				"data": {"sample": "10, 20, ..."}
			}
		}]
	}, {
		"name": "viaLabel",
		"component": "Group",
		"type": "object",
		"config": {
			"title": "Source labels"
		},
		"items": [{
			"name": "icon",
			"component": "Checkbox",
			"type": "boolean",
			"default": false,
			"config": {
				"title": "Show icon"
			}
		}, {
			"name": "text",
			"component": "Checkbox",
			"type": "boolean",
			"default": false,
			"config": {
				"title": "Show text"
			}
		}]
	}]
}, {
	"name": "liveUpdates",
	"component": "Group",
	"type": "object",
	"config": {
		"title": "Live updates config"
	},
	"items": [{
		"name": "enabled",
		"component": "Checkbox",
		"type": "boolean",
		"default": true,
		"config": {
			"title": "Enable live updates",
			"desc": "Parameter to enable/disable receiving live updates by control."
		}
	}, {
		"name": "timeout",
		"component": "Input",
		"type": "number",
		"default": 10,
		"config": {
			"title": "Live updates timeout",
			"desc": "Specifies the timeout between live updates requests (in seconds).",
			"info": "in seconds",
			"data": {"sample": "10, 20, 30"}
		}
	}]
}, {
	"name": "state",
	"component": "Group",
	"type": "object",
	"config": {
		"title": "Stream state settings"
	},
	"items": [{
		"name": "label",
		"component": "Group",
		"type": "object",
		"config": {
			"title": "State labels"
		},
		"items": [{
			"name": "icon",
			"component": "Checkbox",
			"type": "boolean",
			"default": true,
			"config": {
				"title": "Show icon"
			}
		}, {
			"name": "text",
			"component": "Checkbox",
			"type": "boolean",
			"default": true,
			"config": {
				"title": "Show text"
			}
		}]
	}, {
		"name": "toggleBy",
		"component": "Select",
		"type": "string",
		"default": "mouseover",
		"config": {
			"title": "State toggle by",
			"desc": "Specifies the method of changing stream live/paused state.",
			"options": [{
				"title": "mouseover",
				"value": "mouseover"
			}, {
				"title": "button",
				"value": "button"
			}, {
				"title": "none",
				"value": "none"
			}]
		}
	}, {
		"name": "layout",
		"component": "Select",
		"type": "string",
		"default": "compact",
		"config": {
			"title": "State indicator layout",
			"desc": "Specifies the Live/Pause button layout. This option is available only when the \"state.toggleBy\" option is set to \"button\". In other cases, this option will be ignored.",
			"options": [{
				"title": "compact",
				"value": "compact"
			}, {
				"title": "full",
				"value": "full"
			}]
		}
	}]
}];

return Dashboard.create(dashboard);

});
