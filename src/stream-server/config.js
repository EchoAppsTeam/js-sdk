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
		"description": "Additional items per page for children threads"
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
		"description": "The numer of milliseconds to animate the \"More\" button sliding out in case the last portion of child items received"
	}, {
		"name": "itemsSlideTimeout",
		"type": "Number",
		"defaultValue": 600,
		"title": "New child items slide timeout",
		"description": "The numer of milliseconds to animate the appearance of the new child items chunk"
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
	"defaultValue": "#ffff99"
}, {
	"name": "components",
	"type": "Object",
	"properties": [{
		"name": "item",
		"type": "Echo.StreamServer.Controls.Stream.Item"
	}]
}, {
	"name": "itemsPerPage",
	"type": "Number",
	"defaultValue": 15
}, {
	"name": "liveUpdates",
	"type": "Boolean",
	"defaultValue": true
}, {
	"name": "liveUpdatesTimeout",
	"type": "Number",
	"defaultValue": 10
}, {
	"name": "liveUpdatesTimeoutMin",
	"type": "Number",
	"defaultValue": 3
}, {
	"name": "openLinksInNewWindow",
	"type": "Boolean",
	"defaultValue": false
}, {
	"name": "providerIcon",
	"type": "String",
	"defaultValue": "http://cdn.echoenabled.com/images/favicons/comments.png"
}, {
	"name": "slideTimeout",
	"type": "Number",
	"defaultValue": 700
}, {
	"name": "sortOrder",
	"type": "Number",
	"defaultValue": "reverseChronological",
	"values": ["chronological", "reverseChronological"]
}, {
	"name": "streamStateLabel",
	"type": "Object",
	"properties": [{
		"name": "icon",
		"type": "Boolean",
		"defaultValue": true
	}, {
		"name": "text",
		"type": "Boolean",
		"defaultValue": true
	}]
}, {
	"name": "streamStateToggleBy",
	"type": "String",
	"defaultValue": "mouseover",
	"values": ["mouseover", "button", "none"]
}, {
	"name": "submissionProxyURL",
	"type": "String",
	"defaultValue": "http://apps.echoenabled.com/v2/esp/activity"
}];

Echo.StreamServer.Controls.Stream.Item.ConfigSpecification = [{
	"name": "aggressiveSanitization",
	"type": "Boolean",
	"defaultValue": false
//}, {
//	"name": "buttonsOrder",
//	"type": "Object"
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

/*
Echo.StreamServer.Controls.Submit.ConfigSpecification = [{
	"targetURL": document.location.href,
	"markers": [],
	"source": {},
	"tags": [],
	"requestMethod": "GET",
	"itemURIPattern": undefined,
	"actionString": "Type your comment here...",
	"postingTimeout": 30,
	"type": undefined,
	"targetQuery": undefined
}];
*/
