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

var _userSession = {};
_userSession.init = {
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
	"Echo.UserSession.onInit": [_userSession.init, {}],
	"Echo.UserSession.onInvalidate": [_userSession.init, {}],

	"Echo.StreamServer.Apps.Stream.onRefresh": _stream.render,
	"Echo.StreamServer.Apps.Stream.onRender": _stream.render,
	"Echo.StreamServer.Apps.Stream.onRerender": _stream.render,
	"Echo.StreamServer.Apps.Stream.onItemsRenderingComplete": _stream.render,
	"Echo.StreamServer.Apps.Stream.onMoreButtonPress": _stream.render,
	"Echo.StreamServer.Apps.Stream.Item.onRender": _stream.onItemReceive,
	"Echo.StreamServer.Apps.Stream.Item.onReady": _stream.render,
	"Echo.StreamServer.Apps.Stream.onReady": _stream.render,
	"Echo.StreamServer.Apps.Stream.Item.onAdd": _stream.item,
	"Echo.StreamServer.Apps.Stream.Item.onDelete": _stream.item,
	"Echo.StreamServer.Apps.Stream.Item.onChildrenExpand": {
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
	"Echo.StreamServer.Apps.Stream.Item.onButtonClick": {
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

	"Echo.StreamServer.Apps.Stream.onItemReceive": _stream.onItemReceive,
	"Echo.StreamServer.Apps.Stream.Item.onRerender": _stream.item,
	"Echo.StreamServer.Apps.Stream.Item.Plugins.PinboardVisualization.onChangeView": {
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

	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onRender": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onRerender": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onRefresh": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onReady": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onResize": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onLoadMedia": {},
	"Echo.StreamServer.Apps.Stream.Item.MediaGallery.onChangeMedia": {},

	"Echo.StreamServer.Apps.Stream.Plugins.Like.onLikeComplete": _stream.items,
	"Echo.StreamServer.Apps.Stream.Plugins.Like.onUnlikeComplete": _stream.items,
	"Echo.StreamServer.Apps.Stream.Plugins.CommunityFlag.onFlagComplete": _stream.items,
	"Echo.StreamServer.Apps.Stream.Plugins.CommunityFlag.onUnflagComplete": _stream.items,

	"Echo.StreamServer.Apps.Submit.onRerender": _submit.onRerender,
	"Echo.StreamServer.Apps.Submit.onRefresh": _submit.onRerender,

	"Echo.StreamServer.Apps.Submit.onExpand": _submit.expand,
	"Echo.StreamServer.Apps.Submit.onCollapse": _submit.expand,

	"Echo.StreamServer.Apps.Submit.onRender": {
		"target": "object",
		"targetURL": "string",
		"data": {}
	},
	"Echo.StreamServer.Apps.Stream.onDataReceive": {
		"entries": function(value) {
			return $.isArray(value) && value[0] && $.type(value[0].normalized) === "boolean";
		},
		"type": "string",
		"query": "string",
		"target": "object"
	},
	"Echo.StreamServer.Apps.Submit.onPostInit": {
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
	"Echo.StreamServer.Apps.Submit.onPostComplete": {
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
	"Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditInit": _plugins.Edit.onEdit,
	"Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditComplete": _plugins.Edit.onEdit,
	"Echo.StreamServer.Apps.Submit.Plugins.Edit.onEditError": _plugins.Edit.onEdit,
	"Echo.StreamServer.Apps.Counter.onUpdate": {
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
	"Echo.StreamServer.Apps.Submit.onReady": {
		"data": {},
		"target": "object",
		"targetURL": "string"
	},
	"Echo.StreamServer.Apps.Counter.onError": {
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
	"Echo.StreamServer.Apps.Submit.onPostError": {
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
	"Echo.Canvas.onError": {
		"code": "string",
		"message": "string"
	},
	"Echo.StreamServer.Apps.FacePile.Item.onRender": {},
	"Echo.StreamServer.Apps.FacePile.Item.onReady": {},
	"Echo.StreamServer.Apps.FacePile.Item.onRerender": {},
	"Echo.StreamServer.Apps.FacePile.Item.onRefresh": {},
	"Echo.StreamServer.Apps.FacePile.onRender": {},
	"Echo.StreamServer.Apps.FacePile.onReady": {},
	"Echo.StreamServer.Apps.FacePile.onRerender": {},
	"Echo.StreamServer.Apps.FacePile.onRefresh": {},
	"Echo.App.onDataInvalidate": {},
	"Echo.StreamServer.Apps.Counter.onRender": {},
	"Echo.StreamServer.Apps.Counter.onReady": {},
	"Echo.StreamServer.Apps.Counter.onRerender": {},
	"Echo.StreamServer.Apps.Counter.onRefresh": {},
	"Echo.IdentityServer.Apps.Auth.onRender": {},
	"Echo.IdentityServer.Apps.Auth.onReady": {},
	"Echo.IdentityServer.Apps.Auth.onRerender": {},
	"Echo.IdentityServer.Apps.Auth.onRefresh": {},
	"Echo.Canvas.onRender": {},
	"Echo.Canvas.onReady": {},
	"Echo.Canvas.onRerender": {},
	"Echo.Canvas.onRefresh": {}
};
})(Echo.jQuery);
