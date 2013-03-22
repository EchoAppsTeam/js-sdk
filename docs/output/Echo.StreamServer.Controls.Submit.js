Ext.data.JsonP.Echo_StreamServer_Controls_Submit({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Submit",
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
  "id": "class-Echo.StreamServer.Controls.Submit",
  "members": {
    "cfg": [
      {
        "name": "actionString",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-actionString"
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
        },
        "id": "cfg-appkey"
      },
      {
        "name": "cdnBaseURL",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-cdnBaseURL"
      },
      {
        "name": "defaultAvatar",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-defaultAvatar"
      },
      {
        "name": "errorPopup",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-errorPopup"
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
        "name": "itemURIPattern",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-itemURIPattern"
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
        "name": "markers",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-markers"
      },
      {
        "name": "plugins",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-plugins"
      },
      {
        "name": "postingTimeout",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-postingTimeout"
      },
      {
        "name": "requestMethod",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-requestMethod"
      },
      {
        "name": "source",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-source"
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
        "name": "tags",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-tags"
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
        "name": "targetURL",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-targetURL"
      },
      {
        "name": "type",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "cfg-type"
      },
      {
        "name": "useSecureAPI",
        "tagname": "cfg",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "cfg-useSecureAPI"
      }
    ],
    "property": [
      {
        "name": "dayAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-dayAgo"
      },
      {
        "name": "daysAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-daysAgo"
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
        "name": "hourAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-hourAgo"
      },
      {
        "name": "hoursAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-hoursAgo"
      },
      {
        "name": "lastMonth",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-lastMonth"
      },
      {
        "name": "lastWeek",
        "tagname": "property",
        "owner": "Echo.Control",
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
        "name": "markers",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-markers"
      },
      {
        "name": "markersHint",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-markersHint"
      },
      {
        "name": "minuteAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-minuteAgo"
      },
      {
        "name": "minutesAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-minutesAgo"
      },
      {
        "name": "monthAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-monthAgo"
      },
      {
        "name": "monthsAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-monthsAgo"
      },
      {
        "name": "post",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-post"
      },
      {
        "name": "posting",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-posting"
      },
      {
        "name": "postingFailed",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-postingFailed"
      },
      {
        "name": "postingTimeout",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-postingTimeout"
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
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-secondAgo"
      },
      {
        "name": "secondsAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-secondsAgo"
      },
      {
        "name": "tags",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-tags"
      },
      {
        "name": "tagsHint",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-tagsHint"
      },
      {
        "name": "today",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-today"
      },
      {
        "name": "weekAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-weekAgo"
      },
      {
        "name": "weeksAgo",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-weeksAgo"
      },
      {
        "name": "yesterday",
        "tagname": "property",
        "owner": "Echo.Control",
        "meta": {
          "echo_label": true
        },
        "id": "property-yesterday"
      },
      {
        "name": "yourName",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-yourName"
      },
      {
        "name": "yourWebsiteOptional",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_label": true
        },
        "id": "property-yourWebsiteOptional"
      }
    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "addPostValidator",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "method-addPostValidator"
      },
      {
        "name": "avatar",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-avatar"
      },
      {
        "name": "checkAppKey",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-checkAppKey"
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
        "name": "getRelativeTime",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-getRelativeTime"
      },
      {
        "name": "highlightMandatory",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "method-highlightMandatory"
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
        "name": "markers",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-markers"
      },
      {
        "name": "markersContainer",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-markersContainer"
      },
      {
        "name": "name",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-name"
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
        "name": "placeImage",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-placeImage"
      },
      {
        "name": "post",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
        },
        "id": "method-post"
      },
      {
        "name": "postButton",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-postButton"
      },
      {
        "name": "ready",
        "tagname": "method",
        "owner": "Echo.Control",
        "meta": {
        },
        "id": "method-ready"
      },
      {
        "name": "refresh",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
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
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-tags"
      },
      {
        "name": "tagsContainer",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-tagsContainer"
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
        "name": "text",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-text"
      },
      {
        "name": "url",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-url"
      }
    ],
    "event": [
      {
        "name": "onDataInvalidate",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_event": {
            "name": "Echo.Control.onDataInvalidate",
            "description": "Triggered if dataset is changed."
          }
        },
        "id": "event-onDataInvalidate"
      },
      {
        "name": "onPostComplete",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Submit.onPostComplete",
            "description": "Triggered when the submit operation is finished."
          }
        },
        "id": "event-onPostComplete"
      },
      {
        "name": "onPostError",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Submit.onPostError",
            "description": "Triggered if submit operation failed."
          }
        },
        "id": "event-onPostError"
      },
      {
        "name": "onPostInit",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Submit",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Submit.onPostInit",
            "description": "Triggered if submit operation was started."
          }
        },
        "id": "event-onPostInit"
      }
    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 6,
  "files": [
    {
      "filename": "submit.js",
      "href": "submit.html#Echo-StreamServer-Controls-Submit"
    }
  ],
  "html_meta": {
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Control' rel='Echo.Control' class='docClass'>Echo.Control</a><div class='subclass '><strong>Echo.StreamServer.Controls.Submit</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/submit.html#Echo-StreamServer-Controls-Submit' target='_blank'>submit.js</a></div></pre><div class='doc-contents'><p>Echo Submit control which encapsulates interaction with the\n<a href=\"http://wiki.aboutecho.com/w/page/35059196/API-method-submit\" target=\"_blank\">Echo Submit API</a></p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    \"target\": document.getElementById(\"submit\"),\n    \"targetURL\": \"http://example.com/submit\",\n    \"appkey\": \"test.aboutecho.com\",\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required Config options</h3><div id='cfg-target' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-target' class='name not-expandable'>target</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'><p>Specifies the DOM element where the control will be displayed.</p>\n</div><div class='long'><p>Specifies the DOM element where the control will be displayed.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional Config options</h3><div id='cfg-actionString' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-actionString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-actionString' class='name expandable'>actionString</a><span> : String</span></div><div class='description'><div class='short'>Is used to define the default call to action phrase. ...</div><div class='long'><p>Is used to define the default call to action phrase.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"actionString\": \"Type your comment here...\",\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>&quot;Type your comment here...&quot;</code></p></div></div></div><div id='cfg-apiBaseURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-apiBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-apiBaseURL' class='name expandable'>apiBaseURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for all API requests ...</div><div class='long'><p>URL prefix for all API requests</p>\n<p>Defaults to: <code>&quot;api.echoenabled.com/v1/&quot;</code></p></div></div></div><div id='cfg-appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-appkey' class='name expandable'>appkey</a><span> : String</span></div><div class='description'><div class='short'>Specifies the customer application key. ...</div><div class='long'><p>Specifies the customer application key. You should specify this parameter\nif your control uses StreamServer or IdentityServer API requests.\nYou can use the \"test.echoenabled.com\" appkey for testing purposes.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-cdnBaseURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-cdnBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-cdnBaseURL' class='name expandable'>cdnBaseURL</a><span> : Object</span></div><div class='description'><div class='short'>A set of the key/value pairs to define CDN base URLs for different components. ...</div><div class='long'><p>A set of the key/value pairs to define CDN base URLs for different components.\nThe values are used as the URL prefixes for all static files, such as scripts,\nstylesheets, images etc. You can add your own CDN base URL and use it anywhere\nwhen the configuration object is available.</p>\n<ul><li><span class='pre'>sdk</span> : String (optional)<div class='sub-desc'><p>Base URL of the SDK CDN location used for the main SDK resources.</p>\n</div></li><li><span class='pre'>apps</span> : String (optional)<div class='sub-desc'><p>Base URL of the Echo apps built on top of the JS SDK.</p>\n</div></li></ul></div></div></div><div id='cfg-defaultAvatar' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-defaultAvatar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-defaultAvatar' class='name expandable'>defaultAvatar</a><span> : String</span></div><div class='description'><div class='short'>Default avatar URL which will be used for the user in\ncase there is no avatar information defined in the user\nprofile. ...</div><div class='long'><p>Default avatar URL which will be used for the user in\ncase there is no avatar information defined in the user\nprofile. Also used for anonymous users.</p>\n</div></div></div><div id='cfg-errorPopup' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-errorPopup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-errorPopup' class='name expandable'>errorPopup</a><span> : Object</span></div><div class='description'><div class='short'>Is used to define dimensions of error message popup. ...</div><div class='long'><p>Is used to define dimensions of error message popup. The value of this parameter\nis an object with the following fields:</p>\n<p>Defaults to: <code>{&quot;minHeight&quot;: 70, &quot;maxHeight&quot;: 150, &quot;width&quot;: 390}</code></p><ul><li><span class='pre'>minHeight</span> : Number<div class='sub-desc'><p>The minimum height of error message popup.</p>\n</div></li><li><span class='pre'>maxHeight</span> : Number<div class='sub-desc'><p>The maximum height of error message popup.</p>\n</div></li><li><span class='pre'>width</span> : Number<div class='sub-desc'><p>The width of error message popup.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"errorPopup\": {\n        \"minHeight\": 70,\n        \"maxHeight\": 150,\n        \"width\": 390\n    }\n    ...\n});\n</code></pre>\n</div></li></ul></div></div></div><div id='cfg-infoMessages' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-infoMessages' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-infoMessages' class='name expandable'>infoMessages</a><span> : Object</span></div><div class='description'><div class='short'>Customizes the look and feel of info messages, for example \"loading\" and \"error\". ...</div><div class='long'><p>Customizes the look and feel of info messages, for example \"loading\" and \"error\".</p>\n<p>Defaults to: <code>{&quot;enabled&quot;: true, &quot;layout&quot;: &quot;full&quot;}</code></p><ul><li><span class='pre'>enabled</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if info messages should be rendered.</p>\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the layout of the info message. By default can be set to \"compact\" or \"full\".</p>\n\n<pre><code>\"infoMessages\": {\n    \"enabled\": true,\n    \"layout\": \"full\"\n}\n</code></pre>\n<p>Defaults to: <code>&quot;full&quot;</code></p></div></li></ul></div></div></div><div id='cfg-itemURIPattern' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-itemURIPattern' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-itemURIPattern' class='name expandable'>itemURIPattern</a><span> : String</span></div><div class='description'><div class='short'>Allows to define item id pattern. ...</div><div class='long'><p>Allows to define item id pattern. The value of this parameter should be\na valid URI with \"{id}\" placeholder which will indicate the place where\nunique id should be inserted. If this parameter is ommited in\nconfiguration or the URI is invalid it'll be ignored.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"itemURIPattern\": \"http://your-domain.com/path/{id}\",\n    ...\n});\n</code></pre>\n</div></div></div><div id='cfg-labels' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-labels' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-labels' class='name expandable'>labels</a><span> : Object</span></div><div class='description'><div class='short'>Specifies the set of language variables defined for this particular control. ...</div><div class='long'><p>Specifies the set of language variables defined for this particular control.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-markers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-markers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-markers' class='name expandable'>markers</a><span> : Array</span></div><div class='description'><div class='short'>This parameter is used to attach the markers metadata to the item\nduring the item submission. ...</div><div class='long'><p>This parameter is used to attach the markers metadata to the item\nduring the item submission. The format of the value is the array\nwith the string values. Markers will also be displayed in the \"Markers\"\nfield in the Submit form UI for Moderators and Administrators.\nFor non-admin users the markers value will be submitted along with\nother item content when the \"Post\" button is pressed.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"markers\": [\"marker1\", \"marker2\", \"marker3\"],\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='cfg-plugins' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-plugins' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-plugins' class='name expandable'>plugins</a><span> : Array</span></div><div class='description'><div class='short'>The list of the plugins to be added to the control instance. ...</div><div class='long'><p>The list of the plugins to be added to the control instance.\nEach plugin is represented as the JS object with the \"name\" field.\nOther plugin parameters should be added to the same JS object.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-postingTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-postingTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-postingTimeout' class='name expandable'>postingTimeout</a><span> : Number</span></div><div class='description'><div class='short'>Is used to specify the number of seconds after which the Submit Form will show\nthe timeout error dialog if the server...</div><div class='long'><p>Is used to specify the number of seconds after which the Submit Form will show\nthe timeout error dialog if the server does not return anything. If the parameter\nvalue is 0 then the mentioned dialog will never be shown.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"postingTimeout\": 15,\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>30</code></p></div></div></div><div id='cfg-requestMethod' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-requestMethod' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-requestMethod' class='name expandable'>requestMethod</a><span> : String</span></div><div class='description'><div class='short'>This parameter is used to specify the request method. ...</div><div class='long'><p>This parameter is used to specify the request method. Possible values\nare \"GET\" and \"POST\". Setting parameter to \"POST\" has some restrictions.\nWe can't handle server response, UI won't show any waiting for the\nserver responses actions.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"requestMethod\": \"POST\",\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>&quot;GET&quot;</code></p></div></div></div><div id='cfg-source' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-source' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-source' class='name expandable'>source</a><span> : Object</span></div><div class='description'><div class='short'>Designates the initial item source (E.g. ...</div><div class='long'><p>Designates the initial item source (E.g. Twitter). You can override\nsource name, URI and the corresponding icon.</p>\n<p>Defaults to: <code>{}</code></p><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Source name.</p>\n</div></li><li><span class='pre'>uri</span> : String<div class='sub-desc'><p>Source uri.</p>\n</div></li><li><span class='pre'>icon</span> : String<div class='sub-desc'><p>Source icon.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"source\": {\n        \"name\": \"ExampleSource\",\n        \"uri\": \"http://example.com/\",\n        \"icon\": \"http://example.com/images/source.png\"\n    },\n    ...\n});\n</code></pre>\n</div></li></ul></div></div></div><div id='cfg-submissionProxyURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a><span> : String</span></div><div class='description'><div class='short'>URL prefix for requests to Echo Submission Proxy ...</div><div class='long'><p>URL prefix for requests to Echo Submission Proxy</p>\n<p>Defaults to: <code>&quot;apps.echoenabled.com/v2/esp/activity/&quot;</code></p></div></div></div><div id='cfg-tags' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-tags' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-tags' class='name expandable'>tags</a><span> : Array</span></div><div class='description'><div class='short'>This parameter is used to attach the tags metadata to the item during\nthe item submission. ...</div><div class='long'><p>This parameter is used to attach the tags metadata to the item during\nthe item submission. The format of the value is the array array with\nthe string values. Tags will be also displayed in the \"Tags\" field in\nthe Submit form UI for Moderators and Administrators. For non-admin\nusers the tags value will be submitted along with the other item\ncontent when the \"Post\" button is pressed.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"tags\": [\"tag1\", \"tag2\", \"tag3\"],\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='cfg-targetURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-targetURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-targetURL' class='name expandable'>targetURL</a><span> : String</span></div><div class='description'><div class='short'>Specifies the URI to which the submitted Echo item is related. ...</div><div class='long'><p>Specifies the URI to which the submitted Echo item is related.\nThis parameter will be used as a activity target value for the item.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"targetURL\": \"http://somedomain.com/some_article.html\",\n    ...\n});\n</code></pre>\n<p>Defaults to: <code>document.location.href</code></p></div></div></div><div id='cfg-type' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-cfg-type' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-cfg-type' class='name expandable'>type</a><span> : String</span></div><div class='description'><div class='short'>Allows to define item type. ...</div><div class='long'><p>Allows to define item type. The value of this parameter should be a valid URI.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    ...\n    \"type\": \"http://echoenabled.com/activitystreams/schema/1.0/category\",\n    ...\n});\n</code></pre>\n</div></div></div><div id='cfg-useSecureAPI' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-useSecureAPI' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-useSecureAPI' class='name expandable'>useSecureAPI</a><span> : Boolean</span></div><div class='description'><div class='short'>This parameter is used to specify the API request scheme. ...</div><div class='long'><p>This parameter is used to specify the API request scheme.\nIf parameter is set to false or not specified, the API request object\nwill use the scheme used to retrieve the host page.</p>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-dayAgo' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-dayAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-dayAgo' class='name expandable'>dayAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Day Ago&quot;</code></p></div></div></div><div id='property-daysAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-daysAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-daysAgo' class='name expandable'>daysAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Days Ago&quot;</code></p></div></div></div><div id='property-error_busy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_busy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_busy' class='name expandable'>error_busy</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_incorrect_appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_appkey' class='name expandable'>error_incorrect_appkey</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_appkey) Incorrect or missing appkey.&quot;</code></p></div></div></div><div id='property-error_incorrect_user_id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_incorrect_user_id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_incorrect_user_id' class='name expandable'>error_incorrect_user_id</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(incorrect_user_id) Incorrect user specified in User ID predicate.&quot;</code></p></div></div></div><div id='property-error_internal_error' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_internal_error' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_internal_error' class='name expandable'>error_internal_error</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(internal_error) Unknown server error.&quot;</code></p></div></div></div><div id='property-error_quota_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_quota_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_quota_exceeded' class='name expandable'>error_quota_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(quota_exceeded) Required more quota than is available.&quot;</code></p></div></div></div><div id='property-error_result_too_large' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_result_too_large' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_result_too_large' class='name expandable'>error_result_too_large</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(result_too_large) The search result is too large.&quot;</code></p></div></div></div><div id='property-error_timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_timeout' class='name expandable'>error_timeout</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_unknown' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_unknown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_unknown' class='name expandable'>error_unknown</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(unknown) Unknown error.&quot;</code></p></div></div></div><div id='property-error_view_limit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_limit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_limit' class='name expandable'>error_view_limit</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;View creation rate limit has been exceeded. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_view_update_capacity_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_view_update_capacity_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_view_update_capacity_exceeded' class='name expandable'>error_view_update_capacity_exceeded</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...&quot;</code></p></div></div></div><div id='property-error_waiting' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_waiting' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_waiting' class='name expandable'>error_waiting</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading. Please wait...&quot;</code></p></div></div></div><div id='property-error_wrong_query' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-error_wrong_query' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-error_wrong_query' class='name expandable'>error_wrong_query</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;(wrong_query) Incorrect or missing query parameter.&quot;</code></p></div></div></div><div id='property-hourAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-hourAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-hourAgo' class='name expandable'>hourAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Hour Ago&quot;</code></p></div></div></div><div id='property-hoursAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-hoursAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-hoursAgo' class='name expandable'>hoursAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Hours Ago&quot;</code></p></div></div></div><div id='property-lastMonth' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-lastMonth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-lastMonth' class='name expandable'>lastMonth</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Last Month&quot;</code></p></div></div></div><div id='property-lastWeek' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-lastWeek' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-lastWeek' class='name expandable'>lastWeek</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Last Week&quot;</code></p></div></div></div><div id='property-loading' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-loading' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-loading' class='name expandable'>loading</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Loading...&quot;</code></p></div></div></div><div id='property-markers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-markers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-markers' class='name expandable'>markers</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Markers:&quot;</code></p></div></div></div><div id='property-markersHint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-markersHint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-markersHint' class='name expandable'>markersHint</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Marker1, marker2, marker3, ...&quot;</code></p></div></div></div><div id='property-minuteAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-minuteAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-minuteAgo' class='name expandable'>minuteAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Minute Ago&quot;</code></p></div></div></div><div id='property-minutesAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-minutesAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-minutesAgo' class='name expandable'>minutesAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Minutes Ago&quot;</code></p></div></div></div><div id='property-monthAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-monthAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-monthAgo' class='name expandable'>monthAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Month Ago&quot;</code></p></div></div></div><div id='property-monthsAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-monthsAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-monthsAgo' class='name expandable'>monthsAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Months Ago&quot;</code></p></div></div></div><div id='property-post' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-post' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-post' class='name expandable'>post</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'>Label for the button allowing to submit form ...</div><div class='long'><p>Label for the button allowing to submit form</p>\n<p>Defaults to: <code>&quot;Post&quot;</code></p></div></div></div><div id='property-posting' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-posting' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-posting' class='name expandable'>posting</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Posting...&quot;</code></p></div></div></div><div id='property-postingFailed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-postingFailed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-postingFailed' class='name expandable'>postingFailed</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;There was a server error while trying to submit your item. Please try again in a few minutes. &lt;b&gt;Error: \\&quot;{error}\\&quot;&lt;/b&gt;.&quot;</code></p></div></div></div><div id='property-postingTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-postingTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-postingTimeout' class='name expandable'>postingTimeout</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;There was a network issue while trying to submit your item. Please try again in a few minutes.&quot;</code></p></div></div></div><div id='property-retrying' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-retrying' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-retrying' class='name expandable'>retrying</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Retrying...&quot;</code></p></div></div></div><div id='property-secondAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-secondAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-secondAgo' class='name expandable'>secondAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Second Ago&quot;</code></p></div></div></div><div id='property-secondsAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-secondsAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-secondsAgo' class='name expandable'>secondsAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Seconds Ago&quot;</code></p></div></div></div><div id='property-tags' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-tags' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-tags' class='name expandable'>tags</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Tags:&quot;</code></p></div></div></div><div id='property-tagsHint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-tagsHint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-tagsHint' class='name expandable'>tagsHint</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Tag1, tag2, tag3, ...&quot;</code></p></div></div></div><div id='property-today' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-today' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-today' class='name expandable'>today</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Today&quot;</code></p></div></div></div><div id='property-weekAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-weekAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-weekAgo' class='name expandable'>weekAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Week Ago&quot;</code></p></div></div></div><div id='property-weeksAgo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-weeksAgo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-weeksAgo' class='name expandable'>weeksAgo</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;{number} Weeks Ago&quot;</code></p></div></div></div><div id='property-yesterday' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-property-yesterday' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-property-yesterday' class='name expandable'>yesterday</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Yesterday&quot;</code></p></div></div></div><div id='property-yourName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-yourName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-yourName' class='name expandable'>yourName</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Your Name (required)&quot;</code></p></div></div></div><div id='property-yourWebsiteOptional' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-property-yourWebsiteOptional' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-property-yourWebsiteOptional' class='name expandable'>yourWebsiteOptional</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Your website (optional)&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.Controls.Submit-method-constructor' class='name expandable'>Echo.StreamServer.Controls.Submit</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a></div><div class='description'><div class='short'>Submit constructor initializing Echo.StreamServer.Controls.Submit class ...</div><div class='long'><p>Submit constructor initializing <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a> class</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration options</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addPostValidator' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-addPostValidator' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-addPostValidator' class='name expandable'>addPostValidator</a>( <span class='pre'>validator, priority</span> )</div><div class='description'><div class='short'>This Method adds a custom validator to check the posting possibility. ...</div><div class='long'><p>This Method adds a custom validator to check the posting possibility.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>validator</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>priority</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-avatar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-avatar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-avatar' class='name expandable'>avatar</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-checkAppKey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-checkAppKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-checkAppKey' class='name expandable'>checkAppKey</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Method to check the presense of the \"appkey\" configuration parameter and render\nthe error message (inside the element...</div><div class='long'><p>Method to check the presense of the \"appkey\" configuration parameter and render\nthe error message (inside the element specified as the \"target\" in the control\nconfiguration) in case the \"appkey\" is missing in the config.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>The boolean result of the \"appkey\" config parameter check.</p>\n</div></li></ul></div></div></div><div id='method-dependent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-dependent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-dependent' class='name expandable'>dependent</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Method checks if the control was initialized from another control. ...</div><div class='long'><p>Method checks if the control was initialized from another control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-destroy' class='name expandable'>destroy</a>( <span class='pre'>config</span> )</div><div class='description'><div class='short'>Unified method to destroy control. ...</div><div class='long'><p>Unified method to destroy control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>action, anchor, [html]</span> )</div><div class='description'><div class='short'>Method to extend the template of the particular control. ...</div><div class='long'><p>Method to extend the template of the particular control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String (optional)<div class='sub-desc'><p>The content of a transformation to be applied.\nThis param is required for all actions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-getPlugin' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-getPlugin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-getPlugin' class='name expandable'>getPlugin</a>( <span class='pre'>name</span> ) : Object</div><div class='description'><div class='short'>Accessor function allowing to obtain the plugin by its name. ...</div><div class='long'><p>Accessor function allowing to obtain the plugin by its name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Specifies plugin name.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Instance of the corresponding plugin.</p>\n</div></li></ul></div></div></div><div id='method-getRelativeTime' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-getRelativeTime' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-getRelativeTime' class='name expandable'>getRelativeTime</a>( <span class='pre'>datetime</span> ) : String</div><div class='description'><div class='short'>Method to calculate the relative time passed since the given date and time. ...</div><div class='long'><p>Method to calculate the relative time passed since the given date and time.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>datetime</span> : Mixed<div class='sub-desc'><p>The date to calculate how much time passed since that moment. The function recognizes\nthe date in W3CDFT or UNIX timestamp formats.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>String which represents the date and time in the relative format.</p>\n</div></li></ul></div></div></div><div id='method-highlightMandatory' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-highlightMandatory' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-highlightMandatory' class='name expandable'>highlightMandatory</a>( <span class='pre'>element</span> )</div><div class='description'><div class='short'>Method highlighting the mandatory input data fields if they are empty ...</div><div class='long'><p>Method highlighting the mandatory input data fields if they are empty</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>mixed, context</span> ) : Mixed</div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-log' class='name expandable'>log</a>( <span class='pre'>data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-markers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-markers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-markers' class='name expandable'>markers</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-markersContainer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-markersContainer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-markersContainer' class='name expandable'>markersContainer</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-name' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-name' class='name expandable'>name</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>name, args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function. ...</div><div class='long'><p>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-placeImage' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-placeImage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-placeImage' class='name expandable'>placeImage</a>( <span class='pre'>args</span> )</div><div class='description'><div class='short'>Method to place an image inside the container. ...</div><div class='long'><p>Method to place an image inside the container.</p>\n\n<p>This method removes any container's content and creates a new image HTML element\ninside the container. If the image is not available on the given URL then this function\nloads the default image that is passed as a defaultImage argument.</p>\n\n<p>The method adds special classes to the container, and implements some\nworkaround for IE in quirks mode.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>The object which contains attributes for the image.</p>\n<ul><li><span class='pre'>container</span> : HTMLElement<div class='sub-desc'><p>Specifies the target container.</p>\n</div></li><li><span class='pre'>image</span> : String<div class='sub-desc'><p>The URL of the image to be loaded.</p>\n</div></li><li><span class='pre'>defaultImage</span> : String (optional)<div class='sub-desc'><p>The URL of the default image.</p>\n</div></li><li><span class='pre'>onload</span> : Function (optional)<div class='sub-desc'><p>The callback which fires when image is loaded.</p>\n</div></li><li><span class='pre'>onerror</span> : Function (optional)<div class='sub-desc'><p>The callback which fires when loading image fails.</p>\n</div></li><li><span class='pre'>position</span> : String (optional)<div class='sub-desc'><p>The position of an image inside the container. The only \"fill\" is implemented now.</p>\n<p>Defaults to: <code>&quot;fill&quot;</code></p></div></li></ul></div></li></ul></div></div></div><div id='method-post' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-post' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-post' class='name expandable'>post</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method used for posting user provided content to the\n Echo Submit\nendpoint through  Echo Submission Proxy. ...</div><div class='long'><p>Method used for posting user provided content to the\n<a href=\"http://wiki.aboutecho.com/w/page/35059196/API-method-submit\" target=\"_blank\"> Echo Submit</a>\nendpoint through <a href=\"http://wiki.aboutecho.com/w/page/53021402/Echo%20Submission%20Proxy\" target=\"_blank\"> Echo Submission Proxy</a>.</p>\n</div></div></div><div id='method-postButton' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-postButton' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-postButton' class='name expandable'>postButton</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-ready' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-ready' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-ready' class='name expandable'>ready</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Should be called in the \"init\" function of the control manifest to\nshow that the control was initialized. ...</div><div class='long'><p>Should be called in the \"init\" function of the control manifest to\nshow that the control was initialized. Basically it is the indicator\nof the control to be ready and operable.</p>\n</div></div></div><div id='method-refresh' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method implements the refresh logic for the Submit control. ...</div><div class='long'><p>Method implements the refresh logic for the Submit control.</p>\n<p>Overrides: <a href='#!/api/Echo.Control-method-refresh' rel='Echo.Control-method-refresh' class='docClass'>Echo.Control.refresh</a></p></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> ) : Boolean</div><div class='description'><div class='short'>Method to remove a specific object field. ...</div><div class='long'><p>Method to remove a specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Indicates that the value associated with the given key was removed.</p>\n</div></li></ul></div></div></div><div id='method-render' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-render' class='name expandable'>render</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. ...</div><div class='long'><p>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. This function is also used to\nre-render the control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Control DOM representation</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-showError' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showError' class='name expandable'>showError</a>( <span class='pre'>data, options</span> )</div><div class='description'><div class='short'>Renders error message in the target container. ...</div><div class='long'><p>Renders error message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing error message information.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Object containing display options.</p>\n</div></li></ul></div></div></div><div id='method-showMessage' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showMessage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showMessage' class='name expandable'>showMessage</a>( <span class='pre'>data</span> )</div><div class='description'><div class='short'>Renders info message in the target container. ...</div><div class='long'><p>Renders info message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing info message information.</p>\n<ul><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the type of message layout. Can be set to \"compact\" or \"full\".</p>\n</div></li><li><span class='pre'>target</span> : HTMLElement (optional)<div class='sub-desc'><p>Specifies the target container.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles the given template using the provided data. ...</div><div class='long'><p>Templater function which compiles the given template using the provided data.</p>\n\n<p>Function can be used widely for html templates processing or any other action\nrequiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process and parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding value,\npreserving the replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div><div id='method-tags' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-tags' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-tags' class='name expandable'>tags</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-tagsContainer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-tagsContainer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-tagsContainer' class='name expandable'>tagsContainer</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-template' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-template' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-template' class='name expandable'>template</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method to get the control template during rendering procedure. ...</div><div class='long'><p>Method to get the control template during rendering procedure. Can be overriden.</p>\n</div></div></div><div id='method-text' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-text' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-text' class='name expandable'>text</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-url' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-method-url' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-method-url' class='name expandable'>url</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onDataInvalidate' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-event-onDataInvalidate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-event-onDataInvalidate' class='name expandable'>onDataInvalidate</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if dataset is changed.<br><b>Full name</b>: Echo.Control.onDataInvalidate</p>\n\n</div></div></div><div id='event-onPostComplete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-event-onPostComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-event-onPostComplete' class='name expandable'>onPostComplete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the submit operation is finished.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Submit-event-onPostComplete\" rel=\"Echo.StreamServer.Controls.Submit-event-onPostComplete\" class=\"docClass\">Echo.StreamServer.Controls.Submit.onPostComplete</a></p>\n\n</div></div></div><div id='event-onPostError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-event-onPostError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-event-onPostError' class='name expandable'>onPostError</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if submit operation failed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Submit-event-onPostError\" rel=\"Echo.StreamServer.Controls.Submit-event-onPostError\" class=\"docClass\">Echo.StreamServer.Controls.Submit.onPostError</a></p>\n\n</div></div></div><div id='event-onPostInit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit'>Echo.StreamServer.Controls.Submit</span><br/><a href='source/submit.html#Echo-StreamServer-Controls-Submit-event-onPostInit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit-event-onPostInit' class='name expandable'>onPostInit</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if submit operation was started.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Submit-event-onPostInit\" rel=\"Echo.StreamServer.Controls.Submit-event-onPostInit\" class=\"docClass\">Echo.StreamServer.Controls.Submit.onPostInit</a></p>\n\n</div></div></div></div></div></div></div>"
});