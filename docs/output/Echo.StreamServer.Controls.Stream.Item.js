Ext.data.JsonP.Echo_StreamServer_Controls_Stream_Item({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Stream.Item",
  "extends": "Echo.Control",
  "mixins": [

  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "singleton": false,
  "requires": [

  ],
  "uses": [

  ],
  "enum": null,
  "override": null,
  "inheritable": null,
  "inheritdoc": null,
  "meta": {
  },
  "private": null,
  "id": "class-Echo.StreamServer.Controls.Stream.Item",
  "members": {
    "cfg": [
      {
        "name": "aggressiveSanitization",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-aggressiveSanitization"
      },
      {
        "name": "apiBaseURL",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-apiBaseURL"
      },
      {
        "name": "appkey",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
          "required": true
        },
        "id": "cfg-appkey"
      },
      {
        "name": "contentTransformations",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-contentTransformations"
      },
      {
        "name": "infoMessages",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-infoMessages"
      },
      {
        "name": "labels",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-labels"
      },
      {
        "name": "limits",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-limits"
      },
      {
        "name": "optimizedContext",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-optimizedContext"
      },
      {
        "name": "retag",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-retag"
      },
      {
        "name": "submissionProxyURL",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-submissionProxyURL"
      },
      {
        "name": "target",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
          "required": true
        },
        "id": "cfg-target"
      },
      {
        "name": "viaLabel",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "cfg-viaLabel"
      }
    ],
    "property": [
      {
        "name": "childrenMoreItems",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-childrenMoreItems"
      },
      {
        "name": "dayAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-dayAgo"
      },
      {
        "name": "daysAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-daysAgo"
      },
      {
        "name": "defaultModeSwitchTitle",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-defaultModeSwitchTitle"
      },
      {
        "name": "error_busy",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_busy"
      },
      {
        "name": "error_incorrect_appkey",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_incorrect_appkey"
      },
      {
        "name": "error_incorrect_user_id",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_incorrect_user_id"
      },
      {
        "name": "error_internal_error",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_internal_error"
      },
      {
        "name": "error_quota_exceeded",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_quota_exceeded"
      },
      {
        "name": "error_result_too_large",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_result_too_large"
      },
      {
        "name": "error_timeout",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_timeout"
      },
      {
        "name": "error_unknown",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_unknown"
      },
      {
        "name": "error_view_limit",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_view_limit"
      },
      {
        "name": "error_view_update_capacity_exceeded",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_view_update_capacity_exceeded"
      },
      {
        "name": "error_waiting",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_waiting"
      },
      {
        "name": "error_wrong_query",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-error_wrong_query"
      },
      {
        "name": "fromLabel",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-fromLabel"
      },
      {
        "name": "guest",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-guest"
      },
      {
        "name": "hourAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-hourAgo"
      },
      {
        "name": "hoursAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-hoursAgo"
      },
      {
        "name": "lastMonth",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-lastMonth"
      },
      {
        "name": "lastWeek",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-lastWeek"
      },
      {
        "name": "loading",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-loading"
      },
      {
        "name": "metadataModeSwitchTitle",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-metadataModeSwitchTitle"
      },
      {
        "name": "minuteAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-minuteAgo"
      },
      {
        "name": "minutesAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-minutesAgo"
      },
      {
        "name": "monthAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-monthAgo"
      },
      {
        "name": "monthsAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-monthsAgo"
      },
      {
        "name": "retrying",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-retrying"
      },
      {
        "name": "secondAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-secondAgo"
      },
      {
        "name": "secondsAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-secondsAgo"
      },
      {
        "name": "sharedThisOn",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-sharedThisOn"
      },
      {
        "name": "textToggleTruncatedLess",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-textToggleTruncatedLess"
      },
      {
        "name": "textToggleTruncatedMore",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-textToggleTruncatedMore"
      },
      {
        "name": "today",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-today"
      },
      {
        "name": "userID",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-userID"
      },
      {
        "name": "userIP",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-userIP"
      },
      {
        "name": "viaLabel",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-viaLabel"
      },
      {
        "name": "weekAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-weekAgo"
      },
      {
        "name": "weeksAgo",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-weeksAgo"
      },
      {
        "name": "yesterday",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_label": true
        },
        "id": "property-yesterday"
      }
    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "addButtonSpec",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-addButtonSpec"
      },
      {
        "name": "authorName",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-authorName"
      },
      {
        "name": "avatar",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-avatar"
      },
      {
        "name": "block",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-block"
      },
      {
        "name": "body",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-body"
      },
      {
        "name": "buttons",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-buttons"
      },
      {
        "name": "children",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-children"
      },
      {
        "name": "childrenByCurrentActorLive",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-childrenByCurrentActorLive"
      },
      {
        "name": "container",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-container"
      },
      {
        "name": "date",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-date"
      },
      {
        "name": "dependent",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-dependent"
      },
      {
        "name": "destroy",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-destroy"
      },
      {
        "name": "expandChildren",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-expandChildren"
      },
      {
        "name": "expandChildrenLabel",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-expandChildrenLabel"
      },
      {
        "name": "extendTemplate",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-extendTemplate"
      },
      {
        "name": "from",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-from"
      },
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-get"
      },
      {
        "name": "getAccumulator",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-getAccumulator"
      },
      {
        "name": "getNextPageAfter",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-getNextPageAfter"
      },
      {
        "name": "getPlugin",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-getPlugin"
      },
      {
        "name": "hasMoreChildren",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-hasMoreChildren"
      },
      {
        "name": "invoke",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-invoke"
      },
      {
        "name": "isRoot",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-isRoot"
      },
      {
        "name": "log",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-log"
      },
      {
        "name": "markers",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-markers"
      },
      {
        "name": "metadataUserIP",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-metadataUserIP"
      },
      {
        "name": "modeSwitch",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-modeSwitch"
      },
      {
        "name": "parentRenderer",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-parentRenderer"
      },
      {
        "name": "re",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-re"
      },
      {
        "name": "refresh",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-refresh"
      },
      {
        "name": "remove",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-remove"
      },
      {
        "name": "render",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-render"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-set"
      },
      {
        "name": "showError",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-showError"
      },
      {
        "name": "showMessage",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-showMessage"
      },
      {
        "name": "sourceIcon",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-sourceIcon"
      },
      {
        "name": "substitute",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-substitute"
      },
      {
        "name": "tags",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-tags"
      },
      {
        "name": "template",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-template"
      },
      {
        "name": "textToggleTruncated",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-textToggleTruncated"
      },
      {
        "name": "traverse",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-traverse"
      },
      {
        "name": "unblock",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
        },
        "id": "method-unblock"
      },
      {
        "name": "via",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-via"
      },
      {
        "name": "wrapper",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-wrapper"
      }
    ],
    "event": [
      {
        "name": "onAdd",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onAdd",
            "description": "Triggered when the child item is added."
          }
        },
        "id": "event-onAdd"
      },
      {
        "name": "onButtonClick",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onButtonClick",
            "description": "Triggered when the item control button is clicked."
          }
        },
        "id": "event-onButtonClick"
      },
      {
        "name": "onChildrenExpand",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onChildrenExpand",
            "description": "Triggered when the children block is expanded."
          }
        },
        "id": "event-onChildrenExpand"
      },
      {
        "name": "onDelete",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onDelete",
            "description": "Triggered when the child item is deleted."
          }
        },
        "id": "event-onDelete"
      }
    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "statics": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [

    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 1454,
  "files": [
    {
      "filename": "stream.js",
      "href": "stream.html#Echo-StreamServer-Controls-Stream-Item"
    }
  ],
  "html_meta": {
  },
  "component": false,
  "superclasses": [
    "Echo.Control"
  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Control' rel='Echo.Control' class='docClass'>Echo.Control</a><div class='subclass '><strong>Echo.StreamServer.Controls.Stream.Item</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item' target='_blank'>stream.js</a></div></pre><div class='doc-contents'><p>Echo Stream.Item control which encapsulates Item mechanics.</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required Config options</h3><div id='cfg-appkey' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-appkey' class='name expandable'>appkey</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'>Specifies the customer application key. ...</div><div class='long'><p>Specifies the customer application key. You can use the \"test.echoenabled.com\"\nappkey for testing purposes.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-target' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-target' class='name not-expandable'>target</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'><p>Specifies the DOM element where the control will be displayed.</p>\n</div><div class='long'><p>Specifies the DOM element where the control will be displayed.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional Config options</h3><div id='cfg-aggressiveSanitization' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-aggressiveSanitization' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-aggressiveSanitization' class='name expandable'>aggressiveSanitization</a><span> : Boolean</span></div><div class='description'><div class='short'>If this parameter value is set to true, the entire item body will\nbe replaced with \"I just shared this on Twitter...\"...</div><div class='long'><p>If this parameter value is set to <code>true</code>, the entire item body will\nbe replaced with \"I just shared this on Twitter...\" text in the\nstream if the item came from Twitter.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-apiBaseURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-apiBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-apiBaseURL' class='name expandable'>apiBaseURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for all API requests ...</div><div class='long'><p>URL prefix for all API requests</p>\n<p>Defaults to: <code>&quot;api.echoenabled.com/v1/&quot;</code></p></div></div></div><div id='cfg-contentTransformations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-contentTransformations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-contentTransformations' class='name expandable'>contentTransformations</a><span> : Object</span></div><div class='description'><div class='short'>Specifies allowed item's content transformations for each content type. ...</div><div class='long'><p>Specifies allowed item's content transformations for each content type.\nContains a hash where keys are content types and values are arrays with\nformatting options enabled for given content type. Available options are:</p>\n\n<ul>\n<li>smileys - replaces textual smileys with images</li>\n<li>hashtags - highlights hashtags in text</li>\n<li>urls - highlights urls represented as plain text</li>\n<li>newlines - replaces newlines with <br> tags</li>\n</ul>\n\n<p>Defaults to: <code>{&quot;text&quot;: [&quot;smileys&quot;, &quot;hashtags&quot;, &quot;urls&quot;, &quot;newlines&quot;], &quot;html&quot;: [&quot;smileys&quot;, &quot;hashtags&quot;, &quot;urls&quot;, &quot;newlines&quot;], &quot;xhtml&quot;: [&quot;smileys&quot;, &quot;hashtags&quot;, &quot;urls&quot;]}</code></p></div></div></div><div id='cfg-infoMessages' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-infoMessages' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-infoMessages' class='name expandable'>infoMessages</a><span> : String</span></div><div class='description'><div class='short'>Customizes the look and feel of info messages,\nfor example \"loading\" and \"error\". ...</div><div class='long'><p>Customizes the look and feel of info messages,\nfor example \"loading\" and \"error\".</p>\n<p>Defaults to: <code>{&quot;enabled&quot;: false}</code></p><p>Overrides: <a href='#!/api/Echo.Control-cfg-infoMessages' rel='Echo.Control-cfg-infoMessages' class='docClass'>Echo.Control.infoMessages</a></p></div></div></div><div id='cfg-labels' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-labels' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-labels' class='name expandable'>labels</a><span> : Object</span></div><div class='description'><div class='short'>Specifies the set of language variables defined for this particular control. ...</div><div class='long'><p>Specifies the set of language variables defined for this particular control.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-limits' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-limits' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-limits' class='name expandable'>limits</a><span> : Object</span></div><div class='description'><div class='short'>Defines the limits for different metrics. ...</div><div class='long'><p>Defines the limits for different metrics.</p>\n<ul><li><span class='pre'>maxBodyCharacters</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of the body.\nThe value of this parameter should be integer and represents the\nnumber of visible characters that need to be displayed.</p>\n</div></li><li><span class='pre'>maxBodyLines</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of lines of the body. The value of\nthis parameter should be integer and represents the number of lines\nthat need to be displayed. Note: the definition of \"Line\" here is the\nsequence of characters separated by the \"End Of Line\" character\n(\"\\n\" for plain text or <br> for HTML format).</p>\n</div></li><li><span class='pre'>maxBodyLinkLength</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of the hyperlinks in the\nitem body. The value of this parameter should be integer and represents\nthe number of visible characters that need to be displayed.</p>\n<p>Defaults to: <code>50</code></p></div></li><li><span class='pre'>maxMarkerLength</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of markers in the item body.\nThe value of this parameter should be integer and represents the number\nof visible characters that need to be displayed.</p>\n<p>Defaults to: <code>16</code></p></div></li><li><span class='pre'>maxReLinkLength</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of hyperlinks in the \"reTag\"\nsection of an item. The value of this parameter should be integer and\nrepresents the number of visible characters that need to be displayed.</p>\n<p>Defaults to: <code>30</code></p></div></li><li><span class='pre'>maxReTitleLength</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of titles in \"reTag\" section\nof an item. The value of this parameter should be integer and represents\nthe number of visible characters that need to be displayed.</p>\n<p>Defaults to: <code>143</code></p></div></li><li><span class='pre'>maxTagLength</span> : Number (optional)<div class='sub-desc'><p>Allows to truncate the number of characters of tags in the item body.\nThe value of this parameter should be integer and represents the number\nof visible characters that need to be displayed.</p>\n<p>Defaults to: <code>16</code></p></div></li></ul></div></div></div><div id='cfg-optimizedContext' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-optimizedContext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-optimizedContext' class='name expandable'>optimizedContext</a><span> : Boolean</span></div><div class='description'><div class='short'>Allows to configure the context mode of the \"reTag\" section of an item. ...</div><div class='long'><p>Allows to configure the context mode of the \"reTag\" section of an item.\nIf set to true the context is turned into optimized mode. \"reTag\" section\ncontains only one hyperlink in this case (the same current domain is a priority).\nOtherwise all hyperlinks in the item body will be resolved and converted into reTags.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-retag' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-retag' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-retag' class='name expandable'>retag</a><span> : Boolean</span></div><div class='description'><div class='short'>Allows to show/hide the \"reTag\" section of an item. ...</div><div class='long'><p>Allows to show/hide the \"reTag\" section of an item.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-submissionProxyURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for requests to Echo Submission Proxy ...</div><div class='long'><p>URL prefix for requests to Echo Submission Proxy</p>\n<p>Defaults to: <code>&quot;apps.echoenabled.com/v2/esp/activity/&quot;</code></p></div></div></div><div id='cfg-viaLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-cfg-viaLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-viaLabel' class='name expandable'>viaLabel</a><span> : Object</span></div><div class='description'><div class='short'>Allows to show/hide parts or the whole \"via\" tag. ...</div><div class='long'><p>Allows to show/hide parts or the whole \"via\" tag. Contains a hash with two keys\nmanaging icon and text display modes.</p>\n<p>Defaults to: <code>{&quot;icon&quot;: false, &quot;text&quot;: false}</code></p><ul><li><span class='pre'>icon</span> : Boolean (optional)<div class='sub-desc'><p>Defaults to: <code>false</code></p></div></li><li><span class='pre'>text</span> : Boolean (optional)<div class='sub-desc'><p>Defaults to: <code>false</code></p></div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-childrenMoreItems' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-childrenMoreItems' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-childrenMoreItems' class='name expandable'>childrenMoreItems</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;View more items&quot;</code></p></div></div></div><div id='property-dayAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-dayAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-dayAgo' class='name expandable'>dayAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Day Ago&quot;</code></p></div></div></div><div id='property-daysAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-daysAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-daysAgo' class='name expandable'>daysAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Days Ago&quot;</code></p></div></div></div><div id='property-defaultModeSwitchTitle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-defaultModeSwitchTitle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-defaultModeSwitchTitle' class='name expandable'>defaultModeSwitchTitle</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Switch to metadata view&quot;</code></p></div></div></div><div id='property-error_busy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_busy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_busy' class='name expandable'>error_busy</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_incorrect_appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_appkey' class='name expandable'>error_incorrect_appkey</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_appkey) Incorrect or missing appkey.&quot;</code></p></div></div></div><div id='property-error_incorrect_user_id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_user_id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_user_id' class='name expandable'>error_incorrect_user_id</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_user_id) Incorrect user specified in User ID predicate.&quot;</code></p></div></div></div><div id='property-error_internal_error' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_internal_error' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_internal_error' class='name expandable'>error_internal_error</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(internal_error) Unknown server error.&quot;</code></p></div></div></div><div id='property-error_quota_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_quota_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_quota_exceeded' class='name expandable'>error_quota_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(quota_exceeded) Required more quota than is available.&quot;</code></p></div></div></div><div id='property-error_result_too_large' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_result_too_large' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_result_too_large' class='name expandable'>error_result_too_large</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(result_too_large) The search result is too large.&quot;</code></p></div></div></div><div id='property-error_timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_timeout' class='name expandable'>error_timeout</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_unknown' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_unknown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_unknown' class='name expandable'>error_unknown</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(unknown) Unknown error.&quot;</code></p></div></div></div><div id='property-error_view_limit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_limit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_limit' class='name expandable'>error_view_limit</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;View creation rate limit has been exceeded. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_view_update_capacity_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_update_capacity_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_update_capacity_exceeded' class='name expandable'>error_view_update_capacity_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_waiting' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_waiting' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_waiting' class='name expandable'>error_waiting</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_wrong_query' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_wrong_query' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_wrong_query' class='name expandable'>error_wrong_query</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(wrong_query) Incorrect or missing query parameter.&quot;</code></p></div></div></div><div id='property-fromLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-fromLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-fromLabel' class='name expandable'>fromLabel</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;from&quot;</code></p></div></div></div><div id='property-guest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-guest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-guest' class='name expandable'>guest</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Guest&quot;</code></p></div></div></div><div id='property-hourAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-hourAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-hourAgo' class='name expandable'>hourAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Hour Ago&quot;</code></p></div></div></div><div id='property-hoursAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-hoursAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-hoursAgo' class='name expandable'>hoursAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Hours Ago&quot;</code></p></div></div></div><div id='property-lastMonth' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-lastMonth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-lastMonth' class='name expandable'>lastMonth</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Last Month&quot;</code></p></div></div></div><div id='property-lastWeek' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-lastWeek' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-lastWeek' class='name expandable'>lastWeek</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Last Week&quot;</code></p></div></div></div><div id='property-loading' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-loading' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-loading' class='name expandable'>loading</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading...&quot;</code></p></div></div></div><div id='property-metadataModeSwitchTitle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-metadataModeSwitchTitle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-metadataModeSwitchTitle' class='name expandable'>metadataModeSwitchTitle</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Return to default view&quot;</code></p></div></div></div><div id='property-minuteAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-minuteAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-minuteAgo' class='name expandable'>minuteAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Minute Ago&quot;</code></p></div></div></div><div id='property-minutesAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-minutesAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-minutesAgo' class='name expandable'>minutesAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Minutes Ago&quot;</code></p></div></div></div><div id='property-monthAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-monthAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-monthAgo' class='name expandable'>monthAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Month Ago&quot;</code></p></div></div></div><div id='property-monthsAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-monthsAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-monthsAgo' class='name expandable'>monthsAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Months Ago&quot;</code></p></div></div></div><div id='property-retrying' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-retrying' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-retrying' class='name expandable'>retrying</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Retrying...&quot;</code></p></div></div></div><div id='property-secondAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-secondAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-secondAgo' class='name expandable'>secondAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Second Ago&quot;</code></p></div></div></div><div id='property-secondsAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-secondsAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-secondsAgo' class='name expandable'>secondsAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Seconds Ago&quot;</code></p></div></div></div><div id='property-sharedThisOn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-sharedThisOn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-sharedThisOn' class='name expandable'>sharedThisOn</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;I shared this on {service}...&quot;</code></p></div></div></div><div id='property-textToggleTruncatedLess' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-textToggleTruncatedLess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-textToggleTruncatedLess' class='name expandable'>textToggleTruncatedLess</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;less&quot;</code></p></div></div></div><div id='property-textToggleTruncatedMore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-textToggleTruncatedMore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-textToggleTruncatedMore' class='name expandable'>textToggleTruncatedMore</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;more&quot;</code></p></div></div></div><div id='property-today' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-today' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-today' class='name expandable'>today</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Today&quot;</code></p></div></div></div><div id='property-userID' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-userID' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-userID' class='name expandable'>userID</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;User ID:&quot;</code></p></div></div></div><div id='property-userIP' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-userIP' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-userIP' class='name expandable'>userIP</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;User IP:&quot;</code></p></div></div></div><div id='property-viaLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-viaLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-viaLabel' class='name expandable'>viaLabel</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;via&quot;</code></p></div></div></div><div id='property-weekAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-weekAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-weekAgo' class='name expandable'>weekAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Week Ago&quot;</code></p></div></div></div><div id='property-weeksAgo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-weeksAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-weeksAgo' class='name expandable'>weeksAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Weeks Ago&quot;</code></p></div></div></div><div id='property-yesterday' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-property-yesterday' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-property-yesterday' class='name expandable'>yesterday</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Yesterday&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-constructor' class='name expandable'>Echo.StreamServer.Controls.Stream.Item</a>( <span class='pre'>Object config</span> ) : Object</div><div class='description'><div class='short'>Item constructor initializing Echo.StreamServer.Controls.Stream.Item class ...</div><div class='long'><p>Item constructor initializing <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item\" rel=\"Echo.StreamServer.Controls.Stream.Item\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item</a> class</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration options</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addButtonSpec' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-addButtonSpec' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-addButtonSpec' class='name expandable'>addButtonSpec</a>( <span class='pre'>String plugin, Function spec</span> )</div><div class='description'><div class='short'>Method to add the item control button specification. ...</div><div class='long'><p>Method to add the item control button specification.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>plugin</span> : String<div class='sub-desc'><p>Plugin name.</p>\n</div></li><li><span class='pre'>spec</span> : Function<div class='sub-desc'><p>Function describing the control specification.</p>\n</div></li></ul></div></div></div><div id='method-authorName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-authorName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-authorName' class='name expandable'>authorName</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-avatar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-avatar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-avatar' class='name expandable'>avatar</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-block' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-block' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-block' class='name expandable'>block</a>( <span class='pre'>String label</span> )</div><div class='description'><div class='short'>Method which blocks the particular item during data processing. ...</div><div class='long'><p>Method which blocks the particular item during data processing.\nFor example while changing its status.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>label</span> : String<div class='sub-desc'><p>Text label to be shown as a block message</p>\n</div></li></ul></div></div></div><div id='method-body' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-body' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-body' class='name expandable'>body</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-buttons' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-buttons' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-buttons' class='name expandable'>buttons</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-children' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-children' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-children' class='name expandable'>children</a>( <span class='pre'>Object element, Object config</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-childrenByCurrentActorLive' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-childrenByCurrentActorLive' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-childrenByCurrentActorLive' class='name expandable'>childrenByCurrentActorLive</a>( <span class='pre'>Object element, Object config</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-container' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-container' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-container' class='name expandable'>container</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-date' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-date' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-date' class='name expandable'>date</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-dependent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-dependent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-dependent' class='name expandable'>dependent</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Method checks if control was initialized from another control. ...</div><div class='long'><p>Method checks if control was initialized from another control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-destroy' class='name expandable'>destroy</a>( <span class='pre'>Object config</span> )</div><div class='description'><div class='short'>Unified method to destroy control. ...</div><div class='long'><p>Unified method to destroy control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-expandChildren' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-expandChildren' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-expandChildren' class='name expandable'>expandChildren</a>( <span class='pre'>Object element, Object extra</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>extra</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-expandChildrenLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-expandChildrenLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-expandChildrenLabel' class='name expandable'>expandChildrenLabel</a>( <span class='pre'>Object element, Object extra</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>extra</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>String action, String anchor, [String html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular control. ...</div><div class='long'><p>Method to extend the template of particular control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String (optional)<div class='sub-desc'><p>The content of a transformation to be applied.\nThis param is required for all actions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-from' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-from' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-from' class='name expandable'>from</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Object defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-getAccumulator' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-getAccumulator' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-getAccumulator' class='name expandable'>getAccumulator</a>( <span class='pre'>String type</span> ) : String</div><div class='description'><div class='short'>Accessor method to get the item accumulator value by type. ...</div><div class='long'><p>Accessor method to get the item accumulator value by type.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Accumulator type.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Accumulator value.</p>\n</div></li></ul></div></div></div><div id='method-getNextPageAfter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-getNextPageAfter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-getNextPageAfter' class='name expandable'>getNextPageAfter</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Accessor method to get the correct pageAfter property value\naccording to the defined sortOrder. ...</div><div class='long'><p>Accessor method to get the correct <code>pageAfter</code> property value\naccording to the defined <code>sortOrder</code>.</p>\n\n<p>return {String}</p>\n</div></div></div><div id='method-getPlugin' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-getPlugin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-getPlugin' class='name expandable'>getPlugin</a>( <span class='pre'>String name</span> ) : Object</div><div class='description'><div class='short'>Accessor function allowing to obtain the plugin by its name. ...</div><div class='long'><p>Accessor function allowing to obtain the plugin by its name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Specifies plugin name.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Instance of the corresponding plugin.</p>\n</div></li></ul></div></div></div><div id='method-hasMoreChildren' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-hasMoreChildren' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-hasMoreChildren' class='name expandable'>hasMoreChildren</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Method checking if item has more children. ...</div><div class='long'><p>Method checking if item has more children.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>Mixed mixed, Object context</span> ) : Mixed</div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-isRoot' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-isRoot' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-isRoot' class='name expandable'>isRoot</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Method to check if item is a root one. ...</div><div class='long'><p>Method to check if item is a root one.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-log' class='name expandable'>log</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-markers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-markers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-markers' class='name expandable'>markers</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-metadataUserIP' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-metadataUserIP' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-metadataUserIP' class='name expandable'>metadataUserIP</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-modeSwitch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-modeSwitch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-modeSwitch' class='name expandable'>modeSwitch</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>String name, Object args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function. ...</div><div class='long'><p>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-re' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-re' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-re' class='name expandable'>re</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Basic method to reinitialize control. ...</div><div class='long'><p>Basic method to reinitialize control.</p>\n\n<p>Function can be overriden by class descendants implying specific logic.</p>\n</div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-remove' class='name expandable'>remove</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method to remove specific object field. ...</div><div class='long'><p>Method to remove specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul></div></div></div><div id='method-render' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-render' class='name expandable'>render</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. ...</div><div class='long'><p>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. This function also used to\nre-render the control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Control DOM representation</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-showError' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showError' class='name expandable'>showError</a>( <span class='pre'>Object data, Object options</span> )</div><div class='description'><div class='short'>Renders error message in the target container. ...</div><div class='long'><p>Renders error message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing error message information.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Object containing display options.</p>\n</div></li></ul></div></div></div><div id='method-showMessage' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showMessage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showMessage' class='name expandable'>showMessage</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Renders info message in the target container. ...</div><div class='long'><p>Renders info message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing info message information.</p>\n<ul><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the type of message layout. Can be set to \"compact\" or \"full\".</p>\n</div></li><li><span class='pre'>target</span> : HTMLElement (optional)<div class='sub-desc'><p>Specifies the target container.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-sourceIcon' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-sourceIcon' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-sourceIcon' class='name expandable'>sourceIcon</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>Object args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.</p>\n\n<p>Function can be used widely for html templates processing or any other action\nrequiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process and parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding value,\npreserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div><div id='method-tags' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-tags' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-tags' class='name expandable'>tags</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-template' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-template' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-template' class='name expandable'>template</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method to get the control template during rendering procedure. ...</div><div class='long'><p>Method to get the control template during rendering procedure. Can be overriden.</p>\n</div></div></div><div id='method-textToggleTruncated' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-textToggleTruncated' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-textToggleTruncated' class='name expandable'>textToggleTruncated</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-traverse' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-traverse' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-traverse' class='name expandable'>traverse</a>( <span class='pre'>Array tree, Function callback, Array acc</span> ) : Array</div><div class='description'><div class='short'>Method implementing the children tree traversal ...</div><div class='long'><p>Method implementing the children tree traversal</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tree</span> : Array<div class='sub-desc'><p>List of nodes to traverse through.</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>Callback function to be applied to the tree node.</p>\n</div></li><li><span class='pre'>acc</span> : Array<div class='sub-desc'><p>Accumulator.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'><p>Acumulator.</p>\n</div></li></ul></div></div></div><div id='method-unblock' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-unblock' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-unblock' class='name expandable'>unblock</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method which unblocks the particular blocked item. ...</div><div class='long'><p>Method which unblocks the particular blocked item.</p>\n</div></div></div><div id='method-via' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-via' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-via' class='name expandable'>via</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-wrapper' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-method-wrapper' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-method-wrapper' class='name expandable'>wrapper</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onAdd' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-event-onAdd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-event-onAdd' class='name expandable'>onAdd</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the child item is added.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onAdd\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onAdd\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onAdd</a></p>\n\n</div></div></div><div id='event-onButtonClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-event-onButtonClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-event-onButtonClick' class='name expandable'>onButtonClick</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the item control button is clicked.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onButtonClick\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onButtonClick\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onButtonClick</a></p>\n\n</div></div></div><div id='event-onChildrenExpand' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-event-onChildrenExpand' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-event-onChildrenExpand' class='name expandable'>onChildrenExpand</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the children block is expanded.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onChildrenExpand\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onChildrenExpand\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onChildrenExpand</a></p>\n\n</div></div></div><div id='event-onDelete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item'>Echo.StreamServer.Controls.Stream.Item</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-Item-event-onDelete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item-event-onDelete' class='name expandable'>onDelete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the child item is deleted.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onDelete\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onDelete\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onDelete</a></p>\n\n</div></div></div></div></div></div></div>"
});