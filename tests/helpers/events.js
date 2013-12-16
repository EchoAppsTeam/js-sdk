(function($) {

var _stream = {};
_stream.render = {
	"query": "string",
	"target": "object"
};

_stream.onItemReceive = {
	"query": "string",
	"target": "object",
	"item": {
		"data": {
			"id": "string",
			"unique": "string",
			"target": {
				"conversationID": "string"
			},
			"verbs": "array",
			"provider": {
				"icon": "string",
				"name": "string",
				"uri": "string"
			},
			"normalized": "boolean"
		}
	}
};

_stream.item = {
	"query": "string",
	"target": "object",
	"item": {
		"data": {
			"id": "string",
			"unique": "string",
			"target": {
				"conversationID": "string"
			},
			"verbs": "array",
			"provider": {
				"icon": "string",
				"name": "string",
				"uri": "string"
			},
			"normalized": "boolean"
		},
		"target": "object"
	}
};

_stream.items = {
	"query": "string",
	"target": "object",
	"item": {
		"target": "object",
		"data": {
			"entries": "array",
			"id": "string",
			"updated": "string"
		}
	}
};

var _submit = {};
_submit.onRerender = {
	"data": {},
	"target": "object",
	"targetURL": "string"
};

_submit.expand = {
	"target": "object",
	"targetURL": "string",
	"data": {
		"entries": "array",
		"id": "string",
		"updated": "string"
	}
};

var _user = {};
_user.init = {
	"echo": {
		"roles": "array",
		"state": "string",
		"markers": "array"
	},
	"poco": {
		"entry": {
			"accounts": "array"
		},
		"startIndex": "number",
		"itemsPerPage": "number",
		"totalResults": "number"
	}
};

var _plugins = {};

_plugins.Edit = {};

_plugins.Edit.onEdit = {
	"target": "object",
	"targetURL": "string",
	"data": {
		"entries": "array",
		"id": "string",
		"updated": "string"
	},
	"postData": {
		"verb": "update|mark|unmark|tag|untag",
		"target": "string",
		"markers": "string",
		"tags": "string",
		"field": "string",
		"value": "string"
	}
};

Echo.Tests.Events = Echo.Tests.Events || {};

Echo.Tests.Events.contracts = {
	"Echo.API.Transports.WebSockets.onOpen": {},
	"Echo.API.Transports.WebSockets.onClose": {},
	"Echo.API.Transports.WebSockets.onQuotaExceeded": {},
	"Echo.API.Transports.WebSockets.onError": {
		"errorCode": "string",
		"errorMessage": "string"
	},
	"Echo.API.Transports.WebSockets.onData": {
		"event": "string"
	},
	"Echo.StreamServer.User.onInit": [_user.init, {}],
	"Echo.StreamServer.User.onInvalidate": [_user.init, {}],

	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRefresh": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRender": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onRerender": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onItemsRenderingComplete": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onMoreButtonPress": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRender": _stream.onItemReceive,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onReady": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onReady": _stream.render,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onAdd": _stream.item,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onDelete": _stream.item,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onChildrenExpand": {
		"data": {
			"id": "string"
		},
		"target": "object",
		"query": "string",
		"item": {
			"data": {
				"id": "string",
				"verbs": "array",
				"targets": "array",
				"postedTime": "string",
				"normalized": "boolean",
				"target": {
					"id": "string",
					"conversationID": "string"
				},
				"unique": "string"
			},
			"target": "object"
		}
	},
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onButtonClick": {
		"name": "string",
		"plugin": "string",
		"item": {
			"data": {
				"id": "string",
				"verbs": "array",
				"targets": "array",
				"postedTime": "string",
				"normalized": "boolean",
				"target": {
					"id": "string",
					"conversationID": "string"
				},
				"unique": "string"
			},
			"target": "object"
		},
		"target": "object",
		"query": "string"
	},

	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onItemReceive": _stream.onItemReceive,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.onRerender": _stream.item,
	"Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.PinboardVisualization.onChangeView": {
		"target": "object",
		"query": "string",
		"item": {
			"data": {
				"id": "string",
				"verbs": "array",
				"targets": "array",
				"postedTime": "string",
				"normalized": "boolean",
				"target": {
					"id": "string",
					"conversationID": "string"
				},
				"unique": "string"
			},
			"target": "object"
		}
	},

	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRender": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRerender": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onRefresh": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onReady": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onResize": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onLoadMedia": {},
	"Echo.StreamServer.BundledApps.Stream.Item.MediaGallery.ClientWidget.onChangeMedia": {},

	"Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Like.onLikeComplete": _stream.items,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.Like.onUnlikeComplete": _stream.items,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.CommunityFlag.onFlagComplete": _stream.items,
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.CommunityFlag.onUnflagComplete": _stream.items,

	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onRerender": _submit.onRerender,
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onRefresh": _submit.onRerender,

	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onExpand": _submit.expand,
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onCollapse": _submit.expand,

	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onRender": {
		"target": "object",
		"targetURL": "string",
		"data": {}
	},
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onDataReceive": {
		"entries": function(value) {
			return $.isArray(value) && value[0] && $.type(value[0].normalized) === "boolean";
		},
		"type": "string",
		"query": "string",
		"target": "object"
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostInit": {
		"target": "object",
		"targetURL": "string",
		"data": {},
		"postData": {
			"content": "array",
			"appkey": "string",
			"sessionID": "string"
		}
	},
	// TODO: revisit contract later
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostComplete": {
		"target": "object",
		"targetURL": "string",
		"data": {},
		"postData": {
			"content": "array",
			"appkey": "string",
			"sessionID": "string"
		},
		"request": {
			"state": "object",
			"response": "object"
		}
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditInit": _plugins.Edit.onEdit,
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditComplete": _plugins.Edit.onEdit,
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditError": _plugins.Edit.onEdit,
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onUpdate": {
		"target": "object",
		"query": "string",
		"data": {
			"count": "number"
		}
	},
	"Echo.App.onDestroy": {
		"self": "boolean",
		"producer": function(value) {
			return value instanceof Echo.App;
		}
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onReady": {
		"data": {},
		"target": "object",
		"targetURL": "string"
	},
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onError": {
		"data": {
			"result": "string",
			"errorCode": "string",
			"errorMessage": function(value) {
				return ($.type(value) === "number" || $.type(value) === "string");
			}
		},
		"query": "string",
		"target": "object"
	},
	"Echo.StreamServer.BundledApps.Submit.ClientWidget.onPostError": {
		"postData": {
			"content": "array",
			"appkey": "string",
			"sessionID": "string"
		},
		"request": {
			"state": "object",
			"response": {
				"result": "string",
				"errorCode": "string",
				"errorMessage": "string"
			}
		},
		"data": {},
		"target": "object",
		"targetURL": "string"
	},
	"Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRender": {},
	"Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onReady": {},
	"Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRerender": {},
	"Echo.StreamServer.BundledApps.FacePile.Item.ClientWidget.onRefresh": {},
	"Echo.StreamServer.BundledApps.FacePile.ClientWidget.onRender": {},
	"Echo.StreamServer.BundledApps.FacePile.ClientWidget.onReady": {},
	"Echo.StreamServer.BundledApps.FacePile.ClientWidget.onRerender": {},
	"Echo.StreamServer.BundledApps.FacePile.ClientWidget.onRefresh": {},
	"Echo.App.onDataInvalidate": {},
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onRender": {},
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onReady": {},
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onRerender": {},
	"Echo.StreamServer.BundledApps.Counter.ClientWidget.onRefresh": {},
	"Echo.StreamServer.BundledApps.Auth.ClientWidget.onRender": {},
	"Echo.StreamServer.BundledApps.Auth.ClientWidget.onReady": {},
	"Echo.StreamServer.BundledApps.Auth.ClientWidget.onRerender": {},
	"Echo.StreamServer.BundledApps.Auth.ClientWidget.onRefresh": {}
};

})(Echo.jQuery);
