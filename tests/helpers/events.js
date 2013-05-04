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
	"Echo.UserSession.onInit": [_userSession.init, {}],
	"Echo.UserSession.onInvalidate": [_userSession.init, {}],

	"Echo.StreamServer.Controls.Stream.onRender": _stream.render,
	"Echo.StreamServer.Controls.Stream.onRerender": _stream.render,
	"Echo.StreamServer.Controls.Stream.onItemsRenderingComplete": _stream.render,
	"Echo.StreamServer.Controls.Stream.onMoreButtonPress": _stream.render,
	"Echo.StreamServer.Controls.Stream.Item.onRender": _stream.onItemReceive,
	"Echo.StreamServer.Controls.Stream.Item.onReady": _stream.render,
	"Echo.StreamServer.Controls.Stream.onReady": _stream.render,
	"Echo.StreamServer.Controls.Stream.Item.onAdd": _stream.item,
	"Echo.StreamServer.Controls.Stream.Item.onDelete": _stream.item,
	"Echo.StreamServer.Controls.Stream.Item.onChildrenExpand": {
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
	"Echo.StreamServer.Controls.Stream.Item.onButtonClick": {
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

	"Echo.StreamServer.Controls.Stream.onItemReceive": _stream.onItemReceive,
	"Echo.StreamServer.Controls.Stream.Item.onRerender": _stream.item,
	"Echo.StreamServer.Controls.Stream.Item.Plugins.PinboardVisualization.onChangeView": {
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

	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onRender": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onRerender": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onRefresh": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onReady": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onResize": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onLoadMedia": {},
	"Echo.StreamServer.Controls.Stream.Item.MediaGallery.onChangeMedia": {},

	"Echo.StreamServer.Controls.Stream.Plugins.Like.onLikeComplete": _stream.items,
	"Echo.StreamServer.Controls.Stream.Plugins.Like.onUnlikeComplete": _stream.items,
	"Echo.StreamServer.Controls.Stream.Plugins.CommunityFlag.onFlagComplete": _stream.items,
	"Echo.StreamServer.Controls.Stream.Plugins.CommunityFlag.onUnflagComplete": _stream.items,

	"Echo.StreamServer.Controls.Submit.onRerender": _submit.onRerender,
	"Echo.StreamServer.Controls.Submit.onRefresh": _submit.onRerender,

	"Echo.StreamServer.Controls.Submit.onExpand": _submit.expand,
	"Echo.StreamServer.Controls.Submit.onCollapse": _submit.expand,

	"Echo.StreamServer.Controls.Submit.onRender": {
		"target": "object",
		"targetURL": "string",
		"data": {}
	},
	"Echo.StreamServer.Controls.Stream.onDataReceive": {
		"entries": function(value) {
			return $.isArray(value) && value[0] && $.type(value[0].normalized) === "boolean";
		},
		"type": "string",
		"query": "string",
		"target": "object"
	},
	"Echo.StreamServer.Controls.Submit.onPostInit": {
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
	"Echo.StreamServer.Controls.Submit.onPostComplete": {
		"target": "object",
		"targetURL": "string",
		"data": {},
		"postData": {
			"content": "array",
			"appkey": "string",
			"sessionID": "string"
//			"avatar": "string",
//			"markers": "string",
//			"name": "string",
//			"tags": "string",
//			"target": "string",
//			"url": "string",
//			"verb": "string"
		}
	},
	"Echo.StreamServer.Controls.Submit.Plugins.Edit.onEditInit": _plugins.Edit.onEdit,
	"Echo.StreamServer.Controls.Submit.Plugins.Edit.onEditComplete": _plugins.Edit.onEdit,
	"Echo.StreamServer.Controls.Submit.Plugins.Edit.onEditError": _plugins.Edit.onEdit,
	"Echo.StreamServer.Controls.Counter.onUpdate": {
		"target": "object",
		"query": "string",
		"data": {
			"count": "number"
		}
	},
	"Echo.Control.onDestroy": {
		"self": "boolean",
		"producer": function(value) {
			return value instanceof Echo.Control;
		}
	},
	"Echo.StreamServer.Controls.Submit.onReady": {
		"data": {},
		"target": "object",
		"targetURL": "string"
	},
	"Echo.StreamServer.Controls.Counter.onError": {
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
	"Echo.StreamServer.Controls.Submit.onPostError": {
		"postData": {
			"result": "string",
			"errorCode": "string",
			"errorMessage": "string"
		},
		"data": {},
		"target": "object",
		"targetURL": "string"
	},
	"Echo.Canvas.onError": {
		"code": "string",
		"message": "string"
	},
	"Echo.StreamServer.Controls.FacePile.Item.onRender": {},
	"Echo.StreamServer.Controls.FacePile.Item.onReady": {},
	"Echo.StreamServer.Controls.FacePile.Item.onRerender": {},
	"Echo.StreamServer.Controls.FacePile.Item.onRefresh": {},
	"Echo.StreamServer.Controls.FacePile.onRender": {},
	"Echo.StreamServer.Controls.FacePile.onReady": {},
	"Echo.StreamServer.Controls.FacePile.onRerender": {},
	"Echo.StreamServer.Controls.FacePile.onRefresh": {},
	"Echo.Control.onDataInvalidate": {},
	"Echo.StreamServer.Controls.Counter.onRender": {},
	"Echo.StreamServer.Controls.Counter.onReady": {},
	"Echo.StreamServer.Controls.Counter.onRerender": {},
	"Echo.StreamServer.Controls.Counter.onRefresh": {},
	"Echo.IdentityServer.Controls.Auth.onRender": {},
	"Echo.IdentityServer.Controls.Auth.onReady": {},
	"Echo.IdentityServer.Controls.Auth.onRerender": {},
	"Echo.IdentityServer.Controls.Auth.onRefresh": {},
	"Echo.Canvas.onRender": {},
	"Echo.Canvas.onReady": {},
	"Echo.Canvas.onRerender": {},
	"Echo.Canvas.onRefresh": {}
};
})(Echo.jQuery);
