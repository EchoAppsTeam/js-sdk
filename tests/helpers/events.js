(function($) {

var _stream = {};
_stream.render = {
	"query": "",
	"target": $("<div>")
};

_stream.onItemReceive = {
	"query": "",
	"target": $("<div>"),
	"item": {
		"data": {
			"id": "",
			"unique": "",
			"target": {
				"conversationID": ""
			},
			"verbs": [],
			"provider": {
				"icon": "",
				"name": "",
				"uri": ""
			},
			"normalized": true
		}
	}
};
_stream.item = {
	"query": "",
	"target": $("<div>"),
	"item": {
		"data": {
			"id": "",
			"unique": "",
			"target": {
				"conversationID": ""
			},
			"verbs": [],
			"provider": {
				"icon": "",
				"name": "",
				"uri": ""
			},
			"hasMoreChildren": "",
			"normalized": true
		},
		"target": $("<div>")
	}
};

_stream.items = {
	"query": "",
	"target": $("<div>"),
	"item": {
		"target": $("<div>"),
		"data": {
			"entries": [],
			"id": "",
			"updated": ""
		}
	}
};

var _submit = {};
_submit.onRerender = {
	"data": {
		"object": {
			"content": "",
			"tags": [],
			"markers": []
		}
	},
	"target": $("<div>"),
	"targetURL": ""
};

_submit.expand = {
	"target": $("<div>"),
	"targetURL": "",
	"data": {
		"entries": [],
		"id": "",
		"updated": ""
	}
};

var _userSession = {};
_userSession.init = {
	"echo": {
		"roles": [],
		"state": "",
		"markers": []
	},
	"poco": {
		"entry": {
			"accounts": []
		},
		"startIndex": 0,
		"itemsPerPage": 0,
		"totalResults": 0
	}
};

Echo.Tests.Events = Echo.Tests.Events || {};

Echo.Tests.Events.contracts = {
	"Echo.UserSession.onInit": [_userSession.init, {}],
	"Echo.UserSession.onInvalidate": [_userSession.init, {}],

	"Echo.StreamServer.Controls.Stream.onRender": _stream.render,
	"Echo.StreamServer.Controls.Stream.onRerender": _stream.render,
	"Echo.StreamServer.Controls.Stream.onMoreButtonPress": _stream.render,
	"Echo.StreamServer.Controls.Stream.Item.onRender": _stream.onItemReceive,
	"Echo.StreamServer.Controls.Stream.Item.onReady": _stream.render,
	"Echo.StreamServer.Controls.Stream.onReady": _stream.render,
	"Echo.StreamServer.Controls.Stream.Item.onAdd": _stream.item,
	"Echo.StreamServer.Controls.Stream.Item.onChildrenExpand": {
		"data": {
			"id": ""
		},
		"target": $("<div>"),
		"query": "",
		"item": {
			"data": {
				"id": "",
				"verbs": [],
				"targets": [],
				"postedTime": "",
				"normalized": true,
				"target": {
					"id": "",
					"conversationID": ""
				},
				"unique": ""
			},
			"target": $("<div>")
		}
	},
	"Echo.StreamServer.Controls.Stream.Item.onButtonClick": {
		"name": "",
		"plugin": "",
		"item": {
			"data": {
				"id": "",
				"verbs": [],
				"targets": [],
				"postedTime": "",
				"normalized": true,
				"target": {
					"id": "",
					"conversationID": ""
				},
				"unique": ""
			},
			"target": $("<div>")
		},
		"target": $("<div>"),
		"query": "query_string"
	},

	"Echo.StreamServer.Controls.Stream.onItemReceive": _stream.onItemReceive,
	"Echo.StreamServer.Controls.Stream.Item.onRerender": _stream.item,
	"Echo.StreamServer.Controls.Stream.Item.Plugins.PinboardVisualization.onChangeView": {
		"action": "",
		"priority": "",
		"handler": function() { return true; },
		"target": $("<div>"),
		"query": "",
		"item": {
			"data": {
				"id": "",
				"verbs": [],
				"targets": [],
				"postedTime": "",
				"normalized": true,
				"target": {
					"id": "",
					"conversationID": ""
				},
				"unique": ""
			},
			"target": $("<div>")
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
		"target": $("<div>"),
		"targetURL": "",
		"data": {}
	},
	"Echo.StreamServer.Controls.Stream.onDataReceive": {
		"entries": function(value) {
			return $.isArray(value) && value[0] && $.type(value[0].normalized) !== "undefined";
		},
		"initial": true,
		"query": "",
		"target": $("<div>")
	},
	"Echo.StreamServer.Controls.Submit.onPostInit": {
		"target": $("<div>"),
		"targetURL": "",
		"data": {},
		"postData": {
			"content": [],
			"appkey": "",
			"sessionID": ""
		}
	},
	// TODO: revisit contract later
	"Echo.StreamServer.Controls.Submit.onPostComplete": {
		"target": $("<div>"),
		"targetURL": "",
		"data": {},
		"postData": {
			"content": [],
			"appkey": "",
			"sessionID": ""
//			"avatar": "",
//			"markers": "",
//			"name": "",
//			"tags": "",
//			"target": "",
//			"url": "",
//			"verb": "post"
		}
	},
	"Echo.StreamServer.Controls.Submit.onEditInit": {
		"target": $("<div>"),
		"targetURL": "",
		"data": {
			"entries": [],
			"id": "",
			"updated": ""
		},
		"postData": {
			"verb": "update|mark|unmark|tag|untag",
			"target": "",
			"markers": "",
			"tags": "",
			"field": "",
			"value": ""
		}
	},
	"Echo.StreamServer.Controls.Counter.onUpdate": {
		"target": $("<div>"),
		"query": "",
		"data": {
			"count": 0
		}
	},
	"Echo.Control.onDestroy": {
		"self": true,
		"producer": {
			"name": ""
		}
	},
	"Echo.StreamServer.Controls.Submit.onReady": {
		"data": {},
		"target": $("<div>"),
		"targetURL": ""
	},
	"Echo.StreamServer.Controls.Counter.onError": {
		"data": {
			"result": "",
			"errorCode": "",
			"errorMessage": function(value) {
				return (typeof value == "number" || typeof value == "string");
			}
		},
		"query": "",
		"target": $("<div>")
	},
	"Echo.StreamServer.Controls.Submit.onPostError": {
		"postData": {
			"result": "",
			"errorCode": "",
			"errorMessage": ""
		},
		"data": {},
		"target": $("<div>"),
		"targetURL": ""
	},
	"Echo.Loader.onError": {
		"code": "",
		"message": ""
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
	"Echo.IdentityServer.Controls.Auth.onRefresh": {}
};
})(Echo.jQuery);