Ext.data.JsonP.Echo_StreamServer_Controls_Stream({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Stream",
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
  "id": "class-Echo.StreamServer.Controls.Stream",
  "members": {
    "cfg": [
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
        "name": "children",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-children"
      },
      {
        "name": "fadeTimeout",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-fadeTimeout"
      },
      {
        "name": "flashColor",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-flashColor"
      },
      {
        "name": "infoMessages",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-infoMessages"
      },
      {
        "name": "item",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-item"
      },
      {
        "name": "itemsPerPage",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-itemsPerPage"
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
        "name": "liveUpdates",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-liveUpdates"
      },
      {
        "name": "liveUpdatesTimeout",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-liveUpdatesTimeout"
      },
      {
        "name": "openLinksInNewWindow",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-openLinksInNewWindow"
      },
      {
        "name": "providerIcon",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-providerIcon"
      },
      {
        "name": "slideTimeout",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-slideTimeout"
      },
      {
        "name": "streamStateLabel",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-streamStateLabel"
      },
      {
        "name": "streamStateToggleBy",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "cfg-streamStateToggleBy"
      },
      {
        "name": "submissionProxyURL",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream",
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
      }
    ],
    "property": [
      {
        "name": "emptyStream",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-emptyStream"
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
        "name": "guest",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-guest"
      },
      {
        "name": "live",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-live"
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
        "name": "more",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-more"
      },
      {
        "name": "new",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-new"
      },
      {
        "name": "paused",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_label": true
        },
        "id": "property-paused"
      },
      {
        "name": "retrying",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-retrying"
      }
    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "body",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-body"
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
        "name": "extendTemplate",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-extendTemplate"
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
        "name": "getPlugin",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-getPlugin"
      },
      {
        "name": "getState",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "method-getState"
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
        "name": "log",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-log"
      },
      {
        "name": "more",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-more"
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
        "name": "setState",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
        },
        "id": "method-setState"
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
        "name": "state",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-state"
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
        "name": "template",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-template"
      }
    ],
    "event": [
      {
        "name": "Item",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onReceive",
            "description": "Triggered when new item is received."
          }
        },
        "id": "event-Item"
      },
      {
        "name": "onAdd",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onAdd",
            "description": "Triggered when the item is added."
          }
        },
        "id": "event-onAdd"
      },
      {
        "name": "onDataReceive",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.onDataReceive",
            "description": "Triggered when new data is received."
          }
        },
        "id": "event-onDataReceive"
      },
      {
        "name": "onDelete",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onDelete",
            "description": "Triggered when the item is deleted."
          }
        },
        "id": "event-onDelete"
      },
      {
        "name": "onMoreButtonPress",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.onMoreButtonPress",
            "description": "Triggered when the \"more\" button is pressed."
          }
        },
        "id": "event-onMoreButtonPress"
      },
      {
        "name": "onRerender",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.onRerender",
            "description": "Triggered when the item is rerendered."
          }
        },
        "id": "event-onRerender"
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
  "linenr": 8,
  "files": [
    {
      "filename": "stream.js",
      "href": "stream.html#Echo-StreamServer-Controls-Stream"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Control' rel='Echo.Control' class='docClass'>Echo.Control</a><div class='subclass '><strong>Echo.StreamServer.Controls.Stream</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/stream.html#Echo-StreamServer-Controls-Stream' target='_blank'>stream.js</a></div></pre><div class='doc-contents'><p>Echo Stream control which encapsulates interaction with the\n<a href=\"http://wiki.aboutecho.com/w/page/23491639/API-method-search\" target=\"_blank\">Echo Search API</a></p>\n\n<pre><code>var stream = new <a href=\"#!/api/Echo.StreamServer.Controls.Stream\" rel=\"Echo.StreamServer.Controls.Stream\" class=\"docClass\">Echo.StreamServer.Controls.Stream</a>({\n    \"target\": document.getElementById(\"stream\"),\n    \"query\": \"childrenof:http://example.com/js-sdk\",\n    \"appkey\": \"test.js-kit.com\"\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required Config options</h3><div id='cfg-appkey' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-appkey' class='name expandable'>appkey</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'>Specifies the customer application key. ...</div><div class='long'><p>Specifies the customer application key. You can use the \"test.echoenabled.com\"\nappkey for testing purposes.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-target' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-target' class='name not-expandable'>target</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'><p>Specifies the DOM element where the control will be displayed.</p>\n</div><div class='long'><p>Specifies the DOM element where the control will be displayed.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional Config options</h3><div id='cfg-apiBaseURL' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-apiBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-apiBaseURL' class='name expandable'>apiBaseURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for all API requests ...</div><div class='long'><p>URL prefix for all API requests</p>\n<p>Defaults to: <code>&quot;api.echoenabled.com/v1/&quot;</code></p></div></div></div><div id='cfg-children' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-children' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-children' class='name expandable'>children</a><span> : Object</span></div><div class='description'><div class='short'>Specifies the children pagination feature behavior. ...</div><div class='long'><p>Specifies the children pagination feature behavior.\nIt includes several options.</p>\n<p>Defaults to: <code>{&quot;additionalItemsPerPage&quot;: 5, &quot;displaySortOrder&quot;: &quot;chronological&quot;, &quot;sortOrder&quot;: &quot;reverseChronological&quot;, &quot;moreButtonSlideTimeout&quot;: 600, &quot;itemsSlideTimeout&quot;: 600, &quot;maxDepth&quot;: 1}</code></p><ul><li><span class='pre'>additionalItemsPerPage</span> : Number<div class='sub-desc'><p>Specifies how many items should be retrieved from server and\nrendered after clicking the \"View more items\" button.</p>\n</div></li><li><span class='pre'>moreButtonSlideTimeout</span> : Number<div class='sub-desc'><p>Specifies the duration of more button slide up animation in the\nsituation when there are no more children items available and\nthe button should be removed.</p>\n</div></li><li><span class='pre'>itemsSlideTimeout</span> : Number<div class='sub-desc'><p>Specifies the duration of the slide down animation of the items\ncoming to the stream after the \"View more items\" button click.</p>\n</div></li></ul></div></div></div><div id='cfg-fadeTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-fadeTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-fadeTimeout' class='name expandable'>fadeTimeout</a><span> : Number</span></div><div class='description'><div class='short'>Specifies the duration of the fading animation (in milliseconds)\nwhen an item comes to stream as a live update. ...</div><div class='long'><p>Specifies the duration of the fading animation (in milliseconds)\nwhen an item comes to stream as a live update.</p>\n<p>Defaults to: <code>2800</code></p></div></div></div><div id='cfg-flashColor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-flashColor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-flashColor' class='name expandable'>flashColor</a><span> : String</span></div><div class='description'><div class='short'>Specifies the necessary flash color of the events coming to your\nstream as live updates. ...</div><div class='long'><p>Specifies the necessary flash color of the events coming to your\nstream as live updates. This parameter must have a hex color value.</p>\n<p>Defaults to: <code>&quot;#ffff99&quot;</code></p></div></div></div><div id='cfg-infoMessages' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-infoMessages' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-infoMessages' class='name expandable'>infoMessages</a><span> : Object</span></div><div class='description'><div class='short'>Customizes the look and feel of info messages, for example \"loading\" and \"error\". ...</div><div class='long'><p>Customizes the look and feel of info messages, for example \"loading\" and \"error\".</p>\n<p>Defaults to: <code>{&quot;enabled&quot;: true, &quot;layout&quot;: &quot;full&quot;}</code></p><ul><li><span class='pre'>enabled</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if info messages should be rendered.</p>\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the layout of the info message. By default can be set to \"compact\" or \"full\".</p>\n\n<pre><code>\"infoMessages\" : {\n    \"enabled\" : true,\n    \"layout\" : \"full\"\n}\n</code></pre>\n<p>Defaults to: <code>&quot;full&quot;</code></p></div></li></ul></div></div></div><div id='cfg-item' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-item' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-item' class='name expandable'>item</a><span> : Object</span></div><div class='description'><div class='short'>Specifies the configuration options to be passed to internal\nEcho.StreamServer.Controls.Stream.Item component. ...</div><div class='long'><p>Specifies the configuration options to be passed to internal\n<a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item\" rel=\"Echo.StreamServer.Controls.Stream.Item\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item</a> component.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-itemsPerPage' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-itemsPerPage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-itemsPerPage' class='name expandable'>itemsPerPage</a><span> : Number</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>15</code></p></div></div></div><div id='cfg-labels' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-labels' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-labels' class='name expandable'>labels</a><span> : Object</span></div><div class='description'><div class='short'>Specifies the set of language variables defined for this particular control. ...</div><div class='long'><p>Specifies the set of language variables defined for this particular control.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-liveUpdates' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-liveUpdates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdates' class='name expandable'>liveUpdates</a><span> : Boolean</span></div><div class='description'><div class='short'>Parameter to enable/disable receiving live updates by control. ...</div><div class='long'><p>Parameter to enable/disable receiving live updates by control.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-liveUpdatesTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-liveUpdatesTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdatesTimeout' class='name expandable'>liveUpdatesTimeout</a><span> : Number</span></div><div class='description'><div class='short'>Specifies the timeout between live updates requests (in seconds). ...</div><div class='long'><p>Specifies the timeout between live updates requests (in seconds).</p>\n<p>Defaults to: <code>10</code></p></div></div></div><div id='cfg-openLinksInNewWindow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-openLinksInNewWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-openLinksInNewWindow' class='name expandable'>openLinksInNewWindow</a><span> : Boolean</span></div><div class='description'><div class='short'>If this parameter value is set to true, each link will be opened\nin a new window. ...</div><div class='long'><p>If this parameter value is set to true, each link will be opened\nin a new window. This is especially useful when using the control\nin a popup window.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-providerIcon' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-providerIcon' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-providerIcon' class='name not-expandable'>providerIcon</a><span> : String</span></div><div class='description'><div class='short'><p>Specifies the URL to the icon representing data provider.</p>\n</div><div class='long'><p>Specifies the URL to the icon representing data provider.</p>\n</div></div></div><div id='cfg-slideTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-slideTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-slideTimeout' class='name expandable'>slideTimeout</a><span> : Number</span></div><div class='description'><div class='short'>Specifies the duration of the sliding animation (in milliseconds)\nwhen an item comes to a stream as a live update. ...</div><div class='long'><p>Specifies the duration of the sliding animation (in milliseconds)\nwhen an item comes to a stream as a live update.</p>\n<p>Defaults to: <code>700</code></p></div></div></div><div id='cfg-streamStateLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-streamStateLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-streamStateLabel' class='name expandable'>streamStateLabel</a><span> : Object</span></div><div class='description'><div class='short'>Hides the Pause/Play icon. ...</div><div class='long'><p>Hides the Pause/Play icon. Toggles the labels used in the Stream Status\nlabel. Contains a hash with two keys managing icon and text display modes.</p>\n<p>Defaults to: <code>{&quot;icon&quot;: true, &quot;text&quot;: true}</code></p><ul><li><span class='pre'>icon</span> : Boolean<div class='sub-desc'><p>Toggles the icon visibility.</p>\n</div></li><li><span class='pre'>text</span> : Boolean<div class='sub-desc'><p>Toggles the text visibility.</p>\n</div></li></ul></div></div></div><div id='cfg-streamStateToggleBy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-streamStateToggleBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-streamStateToggleBy' class='name expandable'>streamStateToggleBy</a><span> : String</span></div><div class='description'><div class='short'>Specifies the method of changing stream live/paused state. ...</div><div class='long'><p>Specifies the method of changing stream live/paused state.</p>\n\n<p>The possible values are:</p>\n\n<ul>\n<li>mouseover - the stream is paused when mouse is over it and live\nwhen mouse is out.</li>\n<li>button - the stream changes state when user clicks on streamStateLabel\n(Live/Paused text). This mode would not work if neither state icon nor\nstate text are displayed.</li>\n<li>none - the stream will never be paused.</li>\n</ul>\n\n\n<p>Note that mouseover method is not available for mobile devices and will\nbe forced to button method.</p>\n<p>Defaults to: <code>&quot;mouseover&quot;</code></p></div></div></div><div id='cfg-submissionProxyURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for requests to\nSubmission Proxy subsystem. ...</div><div class='long'><p>URL prefix for requests to\nSubmission Proxy subsystem.</p>\n<p>Defaults to: <code>&quot;http://apps.echoenabled.com/v2/esp/activity&quot;</code></p><p>Overrides: <a href='#!/api/Echo.Control-cfg-submissionProxyURL' rel='Echo.Control-cfg-submissionProxyURL' class='docClass'>Echo.Control.submissionProxyURL</a></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-emptyStream' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-emptyStream' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-emptyStream' class='name expandable'>emptyStream</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;No items at this time...&quot;</code></p></div></div></div><div id='property-error_busy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_busy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_busy' class='name expandable'>error_busy</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_incorrect_appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_appkey' class='name expandable'>error_incorrect_appkey</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_appkey) Incorrect or missing appkey.&quot;</code></p></div></div></div><div id='property-error_incorrect_user_id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_user_id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_user_id' class='name expandable'>error_incorrect_user_id</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_user_id) Incorrect user specified in User ID predicate.&quot;</code></p></div></div></div><div id='property-error_internal_error' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_internal_error' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_internal_error' class='name expandable'>error_internal_error</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(internal_error) Unknown server error.&quot;</code></p></div></div></div><div id='property-error_quota_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_quota_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_quota_exceeded' class='name expandable'>error_quota_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(quota_exceeded) Required more quota than is available.&quot;</code></p></div></div></div><div id='property-error_result_too_large' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_result_too_large' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_result_too_large' class='name expandable'>error_result_too_large</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(result_too_large) The search result is too large.&quot;</code></p></div></div></div><div id='property-error_timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_timeout' class='name expandable'>error_timeout</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_unknown' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_unknown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_unknown' class='name expandable'>error_unknown</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(unknown) Unknown error.&quot;</code></p></div></div></div><div id='property-error_view_limit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_limit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_limit' class='name expandable'>error_view_limit</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;View creation rate limit has been exceeded. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_view_update_capacity_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_update_capacity_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_update_capacity_exceeded' class='name expandable'>error_view_update_capacity_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_waiting' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_waiting' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_waiting' class='name expandable'>error_waiting</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_wrong_query' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_wrong_query' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_wrong_query' class='name expandable'>error_wrong_query</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(wrong_query) Incorrect or missing query parameter.&quot;</code></p></div></div></div><div id='property-guest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-guest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-guest' class='name expandable'>guest</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Guest&quot;</code></p></div></div></div><div id='property-live' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-live' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-live' class='name expandable'>live</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Live&quot;</code></p></div></div></div><div id='property-loading' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-loading' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-loading' class='name expandable'>loading</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading...&quot;</code></p></div></div></div><div id='property-more' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-more' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-more' class='name expandable'>more</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;More&quot;</code></p></div></div></div><div id='property-new' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-new' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-new' class='name expandable'>new</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;new&quot;</code></p></div></div></div><div id='property-paused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-property-paused' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-property-paused' class='name expandable'>paused</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Paused&quot;</code></p></div></div></div><div id='property-retrying' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-retrying' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-retrying' class='name expandable'>retrying</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Retrying...&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.Controls.Stream-method-constructor' class='name expandable'>Echo.StreamServer.Controls.Stream</a>( <span class='pre'>Object config</span> ) : Object</div><div class='description'><div class='short'>Stream constructor initializing Echo.StreamServer.Controls.Stream class ...</div><div class='long'><p>Stream constructor initializing <a href=\"#!/api/Echo.StreamServer.Controls.Stream\" rel=\"Echo.StreamServer.Controls.Stream\" class=\"docClass\">Echo.StreamServer.Controls.Stream</a> class</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration options</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-body' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-body' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-method-body' class='name expandable'>body</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-dependent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-dependent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-dependent' class='name expandable'>dependent</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method checks if control was initialized from another control. ...</div><div class='long'><p>Method checks if control was initialized from another control.</p>\n\n<p>return {Boolean}</p>\n</div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-destroy' class='name expandable'>destroy</a>( <span class='pre'>Object config</span> )</div><div class='description'><div class='short'>Unified method to destroy control. ...</div><div class='long'><p>Unified method to destroy control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>String action, String anchor, [String html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular control. ...</div><div class='long'><p>Method to extend the template of particular control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String (optional)<div class='sub-desc'><p>The content of a transformation to be applied.\nThis param is required for all actions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Object defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-getPlugin' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-getPlugin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-getPlugin' class='name expandable'>getPlugin</a>( <span class='pre'>String name</span> ) : Object</div><div class='description'><div class='short'>Accessor function allowing to obtain the plugin by its name. ...</div><div class='long'><p>Accessor function allowing to obtain the plugin by its name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Specifies plugin name.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Instance of the corresponding plugin.</p>\n</div></li></ul></div></div></div><div id='method-getState' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-getState' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-method-getState' class='name expandable'>getState</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Accessor method to get the current Stream state. ...</div><div class='long'><p>Accessor method to get the current Stream state.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>stream state \"live\" or \"paused\".</p>\n</div></li></ul></div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>Mixed mixed, Object context</span> ) : Mixed</div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-log' class='name expandable'>log</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-more' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-more' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-method-more' class='name expandable'>more</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>String name, Object args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function. ...</div><div class='long'><p>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Basic method to reinitialize control. ...</div><div class='long'><p>Basic method to reinitialize control.</p>\n\n<p>Function can be overriden by class descendants implying specific logic.</p>\n</div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-remove' class='name expandable'>remove</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method to remove specific object field. ...</div><div class='long'><p>Method to remove specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul></div></div></div><div id='method-render' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-render' class='name expandable'>render</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. ...</div><div class='long'><p>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. This function also used to\nre-render the control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Control DOM representation</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-setState' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-setState' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-method-setState' class='name expandable'>setState</a>( <span class='pre'>String state</span> )</div><div class='description'><div class='short'>Setter method to define the Stream state. ...</div><div class='long'><p>Setter method to define the Stream state.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>state</span> : String<div class='sub-desc'><p>stream state \"live\" or \"paused\".</p>\n</div></li></ul></div></div></div><div id='method-showError' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showError' class='name expandable'>showError</a>( <span class='pre'>Object data, Object options</span> )</div><div class='description'><div class='short'>Renders error message in the target container. ...</div><div class='long'><p>Renders error message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing error message information.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Object containing display options.</p>\n</div></li></ul></div></div></div><div id='method-showMessage' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showMessage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showMessage' class='name expandable'>showMessage</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Renders info message in the target container. ...</div><div class='long'><p>Renders info message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing info message information.</p>\n<ul><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the type of message layout. Can be set to \"compact\" or \"full\".</p>\n</div></li><li><span class='pre'>target</span> : HTMLElement (optional)<div class='sub-desc'><p>Specifies the target container.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-state' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-method-state' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-method-state' class='name expandable'>state</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>Object args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.</p>\n\n<p>Function can be used widely for html templates processing or any other action\nrequiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process and parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding value,\npreserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div><div id='method-template' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-template' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-template' class='name expandable'>template</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method to get the control template during rendering procedure. ...</div><div class='long'><p>Method to get the control template during rendering procedure. Can be overriden.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-Item' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-Item' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-Item' class='name expandable'>Item</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>.onReceive ...</div><div class='long'><p>Triggered when new item is received.<br><b>Full name</b>: Echo.StreamServer.Controls.Stream.Item.onReceive</p>\n<p>.onReceive</p>\n</div></div></div><div id='event-onAdd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-onAdd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-onAdd' class='name expandable'>onAdd</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the item is added.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onAdd\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onAdd\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onAdd</a></p>\n\n</div></div></div><div id='event-onDataReceive' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-onDataReceive' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-onDataReceive' class='name expandable'>onDataReceive</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when new data is received.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream-event-onDataReceive\" rel=\"Echo.StreamServer.Controls.Stream-event-onDataReceive\" class=\"docClass\">Echo.StreamServer.Controls.Stream.onDataReceive</a></p>\n\n</div></div></div><div id='event-onDelete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-onDelete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-onDelete' class='name expandable'>onDelete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the item is deleted.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item-event-onDelete\" rel=\"Echo.StreamServer.Controls.Stream.Item-event-onDelete\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.onDelete</a></p>\n\n</div></div></div><div id='event-onMoreButtonPress' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-onMoreButtonPress' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-onMoreButtonPress' class='name expandable'>onMoreButtonPress</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the \"more\" button is pressed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream-event-onMoreButtonPress\" rel=\"Echo.StreamServer.Controls.Stream-event-onMoreButtonPress\" class=\"docClass\">Echo.StreamServer.Controls.Stream.onMoreButtonPress</a></p>\n\n</div></div></div><div id='event-onRerender' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream'>Echo.StreamServer.Controls.Stream</span><br/><a href='source/stream.html#Echo-StreamServer-Controls-Stream-event-onRerender' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream-event-onRerender' class='name expandable'>onRerender</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the item is rerendered.<br><b>Full name</b>: Echo.StreamServer.Controls.Stream.Item.onRerender</p>\n\n</div></div></div></div></div></div></div>"
});