Echo.StreamServer.Controls.Stream.ConfigSpecification = [{
	"name": "children",
	"type": "Object",
	"title": "Child nodes rules",
	"description": "Specifies the children pagination feature behavior",
	"properties": [{
		"name": "additionalItemsPerPage",
		"type": "Number",
		"defaultValue": 5,
		"title": "Items per page",
		"description": "Specifies how many items should be retrieved from server and rendered after clicking the \"View more items\" button."
	}, {
		"name": "displaySortOrder",
		"type": "String",
		"defaultValue": "chronological",
		"values": ["chronological", "reverseChronological"],
		"title": "Display order",
		"description": "The order in which the list of child nodes should be sorted during the children display"
	}, {
		"name": "sortOrder",
		"type": "String",
		"defaultValue": "reverseChronological",
		"values": ["chronological", "reverseChronological"],
		"title": "Request sort order",
		"description": "The order in which the list of child nodes should be sorted during the children list rendering"
	}, {
		"name": "moreButtonSlideTimeout",
		"type": "Number",
		"defaultValue": 600,
		"title": "\"More\" button slide timeout",
		"description": "The number of milliseconds to animate the \"More\" button sliding out in case the last portion of child items received"
	}, {
		"name": "itemsSlideTimeout",
		"type": "Number",
		"defaultValue": 600,
		"title": "New child items slide timeout",
		"description": "The number of milliseconds to animate the appearance of the new child items chunk"
	}, {
		"name": "maxDepth",
		"type": "Number",
		"defaultValue": 1,
		"title": "Children threads max depth",
		"description": "Max depth of the children tree"
	}]
}, {
	"name": "fadeTimeout",
	"type": "Number",
	"defaultValue": 2800,
	"title": "Fade out animation duration for the new items",
	"description": "The duration of the fading animation when an item comes to stream as a live update"
}, {
	"name": "flashColor",
	"type": "String",
	"defaultValue": "#ffff99",
	"title": "Slide down animation duration for the new items",
	"description": "The duration of the sliding down animation when an item comes to stream as a live update"
}, {
	"name": "itemsPerPage",
	"type": "Number",
	"defaultValue": 15,
	"title": "Root items per page",
	"description": "Specifies the amount of root items per page"
}, {
	"name": "liveUpdates",
	"type": "Boolean",
	"defaultValue": true,
	"title": "Live updating",
	"description": "Parameter to enable/disable receiving live updates by the application"
}, {
	"name": "liveUpdatesTimeout",
	"type": "Number",
	"defaultValue": 10,
	"title": "Live updates timeout",
	"description": "The timeout between the regular live update requests"
}, {
	"name": "liveUpdatesTimeoutMin",
	"type": "Number",
	"defaultValue": 3,
	"title": "Frequent live updates timeout",
	"description": "The timeout between the live update requests in case of huge amount of incoming items"
}, {
	"name": "openLinksInNewWindow",
	"type": "Boolean",
	"defaultValue": false,
	"title": "Open links in a new window",
	"description": "Specifies if the links from the item body should be opened in the new window or in the current one"
}, {
	"name": "providerIcon",
	"type": "String",
	"defaultValue": "http://cdn.echoenabled.com/images/favicons/comments.png",
	"title": "Default provider icon",
	"description": "Specifies the default provider icon URL"
}, {
	"name": "slideTimeout",
	"type": "Number",
	"defaultValue": 700,
	"title": "Slide down animation duration for the new items",
	"description": "Allows to adjust the duration of the sliding animation when an item comes to a stream as a live update"
}, {
	"name": "sortOrder",
	"type": "Number",
	"defaultValue": "reverseChronological",
	"values": ["chronological", "reverseChronological"],
	"title": "Root items sorting order",
	"description": "Aloows to define root items sorting order"

}, {
	"name": "streamStateLabel",
	"type": "Object",
	"title": "Stream state label",
	"description": "Configuration of the Live/Pause stream indicator",
	"properties": [{
		"name": "icon",
		"type": "Boolean",
		"defaultValue": true,
		"title": "Icon",
		"description": "Specifies if the state icon should be visible"
	}, {
		"name": "text",
		"type": "Boolean",
		"defaultValue": true,
		"title": "Text",
		"description": "Specifies if the state text should be visible"
	}]
}, {
	"name": "streamStateToggleBy",
	"type": "String",
	"defaultValue": "mouseover",
	"values": ["mouseover", "button", "none"],
	"title": "Stream state change trigger",
	"description": "Specifies the method of changing stream live/paused state"
}, {
	"name": "submissionProxyURL",
	"type": "String",
	"defaultValue": "http://apps.echoenabled.com/v2/esp/activity",
	"title": "Submission Proxy URL",
	"description": "Specifies the submission proxy URL"
}, {
	"name": "components",
	"type": "Object",
	"title": "Stream item configuration",
	"description": "Specific configuration of the stream Item class",
	"properties": [{
		"name": "item",
		"type": "Echo.StreamServer.Controls.Stream.Item",
		"title": "Item",
		"description": " "
	}]
}];

Echo.StreamServer.Controls.Stream.Item.ConfigSpecification = [{
	"name": "aggressiveSanitization",
	"type": "Boolean",
	"defaultValue": false
//}, {
//	"name": "buttonsOrder",
//	"type": "Object"
/* FIXME: not looking good atm, enable later
}, {
	"name": "contentTransformations",
	"type": "Object",
	"properties": [{
		"name": "text",
		"type": "Array",
		"values": ["smileys", "hashtags", "urls", "newlines"]
	}, {
		"name": "html",
		"type": "Array",
		"values": ["smileys", "hashtags", "urls", "newlines"]
	}, {
		"name": "xhtml",
		"type": "Array",
		"values": ["smileys", "hashtags", "urls"]
	}]
*/
}, {
	"name": "limits",
	"type": "Object",
	"properties": [{
		"name": "maxBodyCharacters",
		"type": "Number"
	}, {
		"name": "maxBodyLines",
		"type": "Number"
	}, {
		"name": "maxBodyLinkLength",
		"type": "Number",
		"defaultValue": 50
	}, {
		"name": "maxMarkerLength",
		"type": "Number",
		"defaultValue": 16
	}, {
		"name": "maxReLinkLength",
		"type": "Number",
		"defaultValue": 30
	}, {
		"name": "maxReTitleLength",
		"type": "Number",
		"defaultValue": 143
	}, {
		"name": "maxTagLength",
		"type": "Number",
		"defaultValue": 16
	}]
}, {
	"name": "optimizedContext",
	"type": "Boolean",
	"defaultValue": true
}, {
	"name": "reTag",
	"type": "Boolean",
	"defaultValue": true
}, {
	"name": "viaLabel",
	"type": "Object",
	"properties": [{
		"name": "icon",
		"type": "Boolean",
		"defaultValue": false
	}, {
		"name": "text",
		"type": "Boolean",
		"defaultValue": false
	}]
}];

Echo.StreamServer.Controls.Submit.ConfigSpecification = [{
	"name": "targetURL",
	"type": "String"//,
/*
	"defaultValue": document.location.href
}, {
	"name": "markers",
	"type": "Array[String]"
}, {
	"name": "tags",
	"type": "Array[String]"
*/
}, {
	"name": "source",
	"type": "Object",
	"properties": [{
		"name": "name",
		"type": "String"
	}, {
		"name": "uri",
		"type": "String"
	}, {
		"name": "icon",
		"type": "String"
	}]
}, {
	"name": "requestMethod",
	"type": "String",
	"defaultValue": "GET",
	"values": ["GET", "POST"]
}, {
	"name": "itemURIPattern",
	"type": "String"
}, {
	"name": "actionString",
	"type": "String",
	"defulatValue": "Type your comment here..."
}, {
	"name": "postingTimeout",
	"type": "Number",
	"defaultValue": 30
}, {
	"name": "type",
	"type": "String"
}, {
	"name": "targetQuery",
	"type": "String"
}];
