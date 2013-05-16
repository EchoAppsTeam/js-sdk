Ext.data.JsonP.Echo_StreamServer_Controls_Stream_Item_Plugins_CommunityFlag({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
  "extends": "Echo.Plugin",
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
  "id": "class-Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
  "members": {
    "cfg": [
      {
        "name": "showUserList",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
        },
        "id": "cfg-showUserList"
      }
    ],
    "property": [
      {
        "name": "flagControl",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-flagControl"
      },
      {
        "name": "flagProcessing",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-flagProcessing"
      },
      {
        "name": "flagged",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-flagged"
      },
      {
        "name": "flaggedThis",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-flaggedThis"
      },
      {
        "name": "unflagControl",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-unflagControl"
      },
      {
        "name": "unflagProcessing",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_label": true
        },
        "id": "property-unflagProcessing"
      }
    ],
    "method": [
      {
        "name": "disable",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-disable"
      },
      {
        "name": "enable",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-enable"
      },
      {
        "name": "enabled",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-enabled"
      },
      {
        "name": "extendTemplate",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-extendTemplate"
      },
      {
        "name": "flaggedBy",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-flaggedBy"
      },
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-get"
      },
      {
        "name": "init",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-init"
      },
      {
        "name": "invoke",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-invoke"
      },
      {
        "name": "log",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-log"
      },
      {
        "name": "parentRenderer",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-parentRenderer"
      },
      {
        "name": "remove",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-remove"
      },
      {
        "name": "requestDataRefresh",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-requestDataRefresh"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-set"
      },
      {
        "name": "substitute",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-substitute"
      }
    ],
    "event": [
      {
        "name": "onFlagComplete",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagComplete",
            "description": "Triggered if flag operation was completed."
          }
        },
        "id": "event-onFlagComplete"
      },
      {
        "name": "onFlagError",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagError",
            "description": "Triggered if flag operation failed."
          }
        },
        "id": "event-onFlagError"
      },
      {
        "name": "onUnflagComplete",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagComplete",
            "description": "Triggered if reverse flag operation was completed."
          }
        },
        "id": "event-onUnflagComplete"
      },
      {
        "name": "onUnflagError",
        "tagname": "event",
        "owner": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag",
        "meta": {
          "echo_event": {
            "name": "Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagError",
            "description": "Triggered if reverse flag operation failed."
          }
        },
        "id": "event-onUnflagError"
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
      "filename": "community-flag.js",
      "href": "community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag"
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
    "Echo.Plugin"
  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='docClass'>Echo.Plugin</a><div class='subclass '><strong>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag' target='_blank'>community-flag.js</a></div></pre><div class='doc-contents'><p>Adds extra Flag/Unflag buttons to each item in the Echo Stream\ncontrol for the authenticated users. The item will receive the\nCommunityFlagged state as soon as it is flagged by a certain number\nof users. By default this number is 3, but it may be updated by\ncontacting Echo Solutions team at solutions@aboutecho.com. The plugin\nalso shows the number of flags already set for the item next to the\nFlag/Unflag control.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Stream\" rel=\"Echo.StreamServer.Controls.Stream\" class=\"docClass\">Echo.StreamServer.Controls.Stream</a>({\n    \"target\": document.getElementById(\"echo-stream\"),\n    \"appkey\": \"test.echoenabled.com\",\n    \"plugins\": [{\n        \"name\": \"CommunityFlag\"\n    }]\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-showUserList' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-cfg-showUserList' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-cfg-showUserList' class='name expandable'>showUserList</a><span> : Boolean</span></div><div class='description'><div class='short'>Specifies the visibility of the list of users who flagged a particular\nitem. ...</div><div class='long'><p>Specifies the visibility of the list of users who flagged a particular\nitem. Note that the list is only visible for the users with\nadministrative privileges.</p>\n<p>Defaults to: <code>true</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-flagControl' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-flagControl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-flagControl' class='name expandable'>flagControl</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Flag&quot;</code></p></div></div></div><div id='property-flagProcessing' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-flagProcessing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-flagProcessing' class='name expandable'>flagProcessing</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Flagging...&quot;</code></p></div></div></div><div id='property-flagged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-flagged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-flagged' class='name expandable'>flagged</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Flagged&quot;</code></p></div></div></div><div id='property-flaggedThis' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-flaggedThis' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-flaggedThis' class='name expandable'>flaggedThis</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot; flagged this.&quot;</code></p></div></div></div><div id='property-unflagControl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-unflagControl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-unflagControl' class='name expandable'>unflagControl</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Unflag&quot;</code></p></div></div></div><div id='property-unflagProcessing' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-property-unflagProcessing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-property-unflagProcessing' class='name expandable'>unflagProcessing</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Unflagging...&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-disable' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-disable' class='name expandable'>disable</a>( <span class='pre'>[global]</span> )</div><div class='description'><div class='short'>Method to disable the plugin. ...</div><div class='long'><p>Method to disable the plugin.\nThe plugin becomes disabled for the current control instance and\nthe update can also be reflected in the config (if the \"global\"\nflag is defined during the function invocation) to disable it\nfor other controls which use the same config parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if the plugin should be disabled in the config. By default\nthe function disables the plugin for the current control instance only.</p>\n</div></li></ul></div></div></div><div id='method-enable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enable' class='name expandable'>enable</a>( <span class='pre'>[global]</span> )</div><div class='description'><div class='short'>Method to enable the plugin. ...</div><div class='long'><p>Method to enable the plugin.\nThe plugin becomes enabled for the current control instance and\nthe update can also be reflected in the config (if the \"global\"\nflag is defined during the function invocation) to enable it\nfor other controls which use the same config parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if the plugin should be enabled in the config. By default\nthe function enables the plugin for the current control instance only.</p>\n</div></li></ul></div></div></div><div id='method-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enabled' class='name expandable'>enabled</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Checks if the plugin is enabled. ...</div><div class='long'><p>Checks if the plugin is enabled.</p>\n</div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>action, anchor, [html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular component. ...</div><div class='long'><p>Method to extend the template of particular component.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String|Function (optional)<div class='sub-desc'><p>The content of a transformation to be applied. Can be defined as a\nHTML string or a transformer function. This param is required for all\nactions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-flaggedBy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-method-flaggedBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-method-flaggedBy' class='name expandable'>flaggedBy</a>( <span class='pre'>element</span> )<strong class='echo_renderer signature' >renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-init' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-init' class='name expandable'>init</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Initializes the plugin. ...</div><div class='long'><p>Initializes the plugin.</p>\n</div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>mixed, context</span> ) : Mixed</div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-log' class='name expandable'>log</a>( <span class='pre'>data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>name, args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function. ...</div><div class='long'><p>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> ) : Boolean</div><div class='description'><div class='short'>Method to remove a specific object field. ...</div><div class='long'><p>Method to remove a specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Indicates that the value associated with the given key was removed.</p>\n</div></li></ul></div></div></div><div id='method-requestDataRefresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-requestDataRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-requestDataRefresh' class='name expandable'>requestDataRefresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method publishes the internal event to make the current state invalid. ...</div><div class='long'><p>Method publishes the internal event to make the current state invalid.\nIt triggers the data refresh.</p>\n</div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.\nFunction can be used widely for html templates processing or any other\naction requiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process, contains control parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding\nvalue, preserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during\ntemplate compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onFlagComplete' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-event-onFlagComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagComplete' class='name expandable'>onFlagComplete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if flag operation was completed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagComplete\" rel=\"Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagComplete\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagComplete</a></p>\n\n</div></div></div><div id='event-onFlagError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-event-onFlagError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagError' class='name expandable'>onFlagError</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if flag operation failed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagError\" rel=\"Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onFlagError\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onFlagError</a></p>\n\n</div></div></div><div id='event-onUnflagComplete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-event-onUnflagComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagComplete' class='name expandable'>onUnflagComplete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if reverse flag operation was completed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagComplete\" rel=\"Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagComplete\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagComplete</a></p>\n\n</div></div></div><div id='event-onUnflagError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag'>Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag</span><br/><a href='source/community-flag.html#Echo-StreamServer-Controls-Stream-Item-Plugins-CommunityFlag-event-onUnflagError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagError' class='name expandable'>onUnflagError</a>( <span class='pre'></span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered if reverse flag operation failed.<br><b>Full name</b>: <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagError\" rel=\"Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-event-onUnflagError\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag.onUnflagError</a></p>\n\n</div></div></div></div></div></div></div>"
});