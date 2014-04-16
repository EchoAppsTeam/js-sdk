Ext.data.JsonP.Echo_StreamServer_Controls_Counter({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Counter",
  "autodetected": {
  },
  "files": [
    {
      "filename": "counter.js",
      "href": "counter.html#Echo-StreamServer-Controls-Counter"
    }
  ],
  "extends": "Echo.Control",
  "package": [
    "streamserver/controls.pack.js",
    "streamserver.pack.js"
  ],
  "members": [
    {
      "name": "apiBaseURL",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-apiBaseURL",
      "meta": {
      }
    },
    {
      "name": "appkey",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-appkey",
      "meta": {
      }
    },
    {
      "name": "cdnBaseURL",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-cdnBaseURL",
      "meta": {
      }
    },
    {
      "name": "data",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "cfg-data",
      "meta": {
      }
    },
    {
      "name": "infoMessages",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "cfg-infoMessages",
      "meta": {
      }
    },
    {
      "name": "liveUpdates",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "cfg-liveUpdates",
      "meta": {
      }
    },
    {
      "name": "plugins",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-plugins",
      "meta": {
      }
    },
    {
      "name": "query",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "cfg-query",
      "meta": {
      }
    },
    {
      "name": "refreshOnUserInvalidate",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-refreshOnUserInvalidate",
      "meta": {
      }
    },
    {
      "name": "target",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-target",
      "meta": {
        "required": true
      }
    },
    {
      "name": "useSecureAPI",
      "tagname": "cfg",
      "owner": "Echo.Control",
      "id": "cfg-useSecureAPI",
      "meta": {
      }
    },
    {
      "name": "constructor",
      "tagname": "method",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "checkAppKey",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-checkAppKey",
      "meta": {
      }
    },
    {
      "name": "dependent",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-dependent",
      "meta": {
      }
    },
    {
      "name": "destroy",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-destroy",
      "meta": {
      }
    },
    {
      "name": "extendRenderer",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-extendRenderer",
      "meta": {
      }
    },
    {
      "name": "extendTemplate",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-extendTemplate",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "invoke",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-invoke",
      "meta": {
      }
    },
    {
      "name": "log",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-log",
      "meta": {
      }
    },
    {
      "name": "ready",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-ready",
      "meta": {
      }
    },
    {
      "name": "refresh",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-refresh",
      "meta": {
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "render",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-render",
      "meta": {
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-set",
      "meta": {
      }
    },
    {
      "name": "showError",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-showError",
      "meta": {
      }
    },
    {
      "name": "showMessage",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-showMessage",
      "meta": {
      }
    },
    {
      "name": "substitute",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-substitute",
      "meta": {
      }
    },
    {
      "name": "template",
      "tagname": "method",
      "owner": "Echo.Control",
      "id": "method-template",
      "meta": {
      }
    },
    {
      "name": "error_busy",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_busy",
      "meta": {
      }
    },
    {
      "name": "error_incorrect_appkey",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_incorrect_appkey",
      "meta": {
      }
    },
    {
      "name": "error_incorrect_user_id",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_incorrect_user_id",
      "meta": {
      }
    },
    {
      "name": "error_internal_error",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_internal_error",
      "meta": {
      }
    },
    {
      "name": "error_quota_exceeded",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_quota_exceeded",
      "meta": {
      }
    },
    {
      "name": "error_result_too_large",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_result_too_large",
      "meta": {
      }
    },
    {
      "name": "error_timeout",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_timeout",
      "meta": {
      }
    },
    {
      "name": "error_unknown",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_unknown",
      "meta": {
      }
    },
    {
      "name": "error_view_limit",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_view_limit",
      "meta": {
      }
    },
    {
      "name": "error_view_update_capacity_exceeded",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_view_update_capacity_exceeded",
      "meta": {
      }
    },
    {
      "name": "error_waiting",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_waiting",
      "meta": {
      }
    },
    {
      "name": "error_wrong_query",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-error_wrong_query",
      "meta": {
      }
    },
    {
      "name": "loading",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-loading",
      "meta": {
      }
    },
    {
      "name": "retrying",
      "tagname": "echo_label",
      "owner": "Echo.Control",
      "id": "echo_label-retrying",
      "meta": {
      }
    },
    {
      "name": "onError",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onError",
      "meta": {
      }
    },
    {
      "name": "onReady",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onReady",
      "meta": {
      }
    },
    {
      "name": "onRefresh",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onRefresh",
      "meta": {
      }
    },
    {
      "name": "onRender",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onRender",
      "meta": {
      }
    },
    {
      "name": "onRerender",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onRerender",
      "meta": {
      }
    },
    {
      "name": "onUpdate",
      "tagname": "echo_event",
      "owner": "Echo.StreamServer.Controls.Counter",
      "id": "echo_event-onUpdate",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.StreamServer.Controls.Counter",
  "short_doc": "Echo Counter class which encapsulates interaction with the\nEcho Count API\nand provides a simple live updating number. ...",
  "component": false,
  "superclasses": [
    "Echo.Control"
  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "mixins": [

  ],
  "parentMixins": [

  ],
  "requires": [

  ],
  "uses": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Control' rel='Echo.Control' class='docClass'>Echo.Control</a><div class='subclass '><strong>Echo.StreamServer.Controls.Counter</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/counter.html#Echo-StreamServer-Controls-Counter' target='_blank'>counter.js</a></div></pre><div class='doc-contents'><p>Echo Counter class which encapsulates interaction with the\n<a href=\"http://echoplatform.com/streamserver/docs/rest-api/other-api/count/\" target=\"_blank\">Echo Count API</a>\nand provides a simple live updating number.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Counter\" rel=\"Echo.StreamServer.Controls.Counter\" class=\"docClass\">Echo.StreamServer.Controls.Counter</a>({\n    \"target\": document.getElementById(\"echo-counter\"),\n    \"appkey\": \"echo.jssdk.demo.aboutecho.com\",\n    \"query\" : \"childrenof:http://example.com/test/*\"\n});\n</code></pre>\n\n<p>More information regarding the possible ways of the Control initialization\ncan be found in the <a href=\"#!/guide/how_to_initialize_components-section-initializing-an-app\">“How to initialize Echo components”</a> guide.</p>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/streamserver/controls.pack.js'>streamserver/controls.pack.js</a>, <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/streamserver.pack.js'>streamserver.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-target' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-target' class='name expandable'>target</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>Specifies the DOM element where the control will be displayed.</p>\n</div><div class='long'><p>Specifies the DOM element where the control will be displayed.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-apiBaseURL' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-apiBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-apiBaseURL' class='name expandable'>apiBaseURL</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>URL prefix for all API requests ...</div><div class='long'><p>URL prefix for all API requests</p>\n<p>Defaults to: <code>&quot;//api.echoenabled.com/v1/&quot;</code></p></div></div></div><div id='cfg-appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-appkey' class='name expandable'>appkey</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the customer application key. ...</div><div class='long'><p>Specifies the customer application key. You should specify this parameter\nif your control uses StreamServer or IdentityServer API requests.\nYou can use the \"echo.jssdk.demo.aboutecho.com\" appkey for testing purposes.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-cdnBaseURL' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-cdnBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-cdnBaseURL' class='name expandable'>cdnBaseURL</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>A set of the key/value pairs to define CDN base URLs for different components. ...</div><div class='long'><p>A set of the key/value pairs to define CDN base URLs for different components.\nThe values are used as the URL prefixes for all static files, such as scripts,\nstylesheets, images etc. You can add your own CDN base URL and use it anywhere\nwhen the configuration object is available.</p>\n<ul><li><span class='pre'>sdk</span> : String<div class='sub-desc'><p>Base URL of the SDK CDN location used for the main SDK resources.</p>\n</div></li><li><span class='pre'>apps</span> : String<div class='sub-desc'><p>Base URL of the Echo apps built on top of the JS SDK.</p>\n</div></li></ul></div></div></div><div id='cfg-data' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-cfg-data' class='name expandable'>data</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies predefined items count which should be displayed by the application. ...</div><div class='long'><p>Specifies predefined items count which should be displayed by the application.\nCounter control works with the data format used by the \"count\" API endpoint.\nMore information about the data format can be found\n<a href=\"http://echoplatform.com/streamserver/docs/rest-api/other-api/count/#sect7\" target=\"_blank\">here</a>.</p>\n\n<pre><code>new Echo.Counter({\n    ...\n    \"data\": {\"count\": 100},\n    ...\n});\n</code></pre>\n</div></div></div><div id='cfg-infoMessages' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-cfg-infoMessages' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-cfg-infoMessages' class='name expandable'>infoMessages</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Customizes the look and feel of info messages, for example \"loading\" and \"error\". ...</div><div class='long'><p>Customizes the look and feel of info messages, for example \"loading\" and \"error\".</p>\n<p>Defaults to: <code>{&quot;layout&quot;: &quot;compact&quot;}</code></p><p>Overrides: <a href=\"#!/api/Echo.Control-cfg-infoMessages\" rel=\"Echo.Control-cfg-infoMessages\" class=\"docClass\">Echo.Control.infoMessages</a></p></div></div></div><div id='cfg-liveUpdates' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-cfg-liveUpdates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-cfg-liveUpdates' class='name expandable'>liveUpdates</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Live updating machinery configuration (only the \"polling\" transport\nis supported for the \"count\" API endpoint). ...</div><div class='long'><p>Live updating machinery configuration (only the \"polling\" transport\nis supported for the \"count\" API endpoint).</p>\n<p>Defaults to: <code>{&quot;enabled&quot;: true, &quot;polling&quot;: {&quot;timeout&quot;: 10}}</code></p><ul><li><span class='pre'>enabled</span> : Boolean (optional)<div class='sub-desc'><p>Parameter to enable/disable live updates.</p>\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>polling</span> : Object (optional)<div class='sub-desc'><p>Object which contains the configuration specific to the \"polling\"\nlive updates transport.</p>\n<ul><li><span class='pre'>timeout</span> : Number (optional)<div class='sub-desc'><p>Timeout between the live updates requests (in seconds).</p>\n<p>Defaults to: <code>10</code></p></div></li></ul></div></li></ul></div></div></div><div id='cfg-plugins' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-plugins' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-plugins' class='name expandable'>plugins</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>The list of the plugins to be added to the control instance. ...</div><div class='long'><p>The list of the plugins to be added to the control instance.\nEach plugin is represented as the JS object with the \"name\" field.\nOther plugin parameters should be added to the same JS object.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-query' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-cfg-query' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-cfg-query' class='name expandable'>query</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the search query to generate the necessary data set. ...</div><div class='long'><p>Specifies the search query to generate the necessary data set.\nIt must be constructed according to the\n<a href=\"http://echoplatform.com/streamserver/docs/rest-api/items-api/search/\" target=\"_blank\">\"search\" API</a>\nmethod specification.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Counter\" rel=\"Echo.StreamServer.Controls.Counter\" class=\"docClass\">Echo.StreamServer.Controls.Counter</a>({\n    \"target\": document.getElementById(\"echo-counter\"),\n    \"appkey\": \"echo.jssdk.demo.aboutecho.com\",\n    \"query\" : \"childrenof:http://example.com/test/*\"\n});\n</code></pre>\n</div></div></div><div id='cfg-refreshOnUserInvalidate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-refreshOnUserInvalidate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-refreshOnUserInvalidate' class='name expandable'>refreshOnUserInvalidate</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true control will be automatically refreshed after user login/logout ...</div><div class='long'><p>If true control will be automatically refreshed after user login/logout</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-useSecureAPI' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-cfg-useSecureAPI' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-cfg-useSecureAPI' class='name expandable'>useSecureAPI</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>This parameter is used to specify the API request scheme. ...</div><div class='long'><p>This parameter is used to specify the API request scheme.\nIf parameter is set to false or not specified, the API request object\nwill use the scheme used to retrieve the host page.</p>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.Controls.Counter-method-constructor' class='name expandable'>Echo.StreamServer.Controls.Counter</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.StreamServer.Controls.Counter\" rel=\"Echo.StreamServer.Controls.Counter\" class=\"docClass\">Echo.StreamServer.Controls.Counter</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Counter constructor initializing Echo.StreamServer.Controls.Counter class ...</div><div class='long'><p>Counter constructor initializing <a href=\"#!/api/Echo.StreamServer.Controls.Counter\" rel=\"Echo.StreamServer.Controls.Counter\" class=\"docClass\">Echo.StreamServer.Controls.Counter</a> class</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration options</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.StreamServer.Controls.Counter\" rel=\"Echo.StreamServer.Controls.Counter\" class=\"docClass\">Echo.StreamServer.Controls.Counter</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-checkAppKey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-checkAppKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-checkAppKey' class='name expandable'>checkAppKey</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to check the presense of the \"appkey\" configuration parameter and render\nthe error message (inside the element...</div><div class='long'><p>Method to check the presense of the \"appkey\" configuration parameter and render\nthe error message (inside the element specified as the \"target\" in the control\nconfiguration) in case the \"appkey\" is missing in the config.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>The boolean result of the \"appkey\" config parameter check.</p>\n</div></li></ul></div></div></div><div id='method-dependent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-dependent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-dependent' class='name expandable'>dependent</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Method checks if the control was initialized from another control. ...</div><div class='long'><p>Method checks if the control was initialized from another control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-destroy' class='name expandable'>destroy</a>( <span class='pre'>config</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Unified method to destroy control. ...</div><div class='long'><p>Unified method to destroy control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-extendRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-extendRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-extendRenderer' class='name expandable'>extendRenderer</a>( <span class='pre'>name, renderer</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method extending the paticular renderer with defined function. ...</div><div class='long'><p>Method extending the paticular renderer with defined function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name to be extended.</p>\n</div></li><li><span class='pre'>renderer</span> : Function<div class='sub-desc'><p>Renderer function to be applied.</p>\n</div></li></ul></div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>action, anchor, [html]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to extend the template of the particular control. ...</div><div class='long'><p>Method to extend the template of the particular control.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>The following actions are available:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String (optional)<div class='sub-desc'><p>The content of a transformation to be applied.\nThis param is required for all actions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults]</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>mixed, context</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-log' class='name expandable'>log</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-ready' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-ready' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-ready' class='name expandable'>ready</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Should be called in the \"init\" function of the control manifest to\nshow that the control was initialized. ...</div><div class='long'><p>Should be called in the \"init\" function of the control manifest to\nshow that the control was initialized. Basically it is the indicator\nof the control to be ready and operable.</p>\n</div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Basic method to reinitialize control. ...</div><div class='long'><p>Basic method to reinitialize control.</p>\n\n<p>Function can be overriden by class descendants implying specific logic.</p>\n</div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove a specific object field. ...</div><div class='long'><p>Method to remove a specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Indicates that the value associated with the given key was removed.</p>\n</div></li></ul></div></div></div><div id='method-render' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-render' class='name expandable'>render</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. ...</div><div class='long'><p>Rendering function which prepares the DOM representation of the control\nand appends it to the control target element. This function is also used to\nre-render the control.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Control DOM representation</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-showError' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showError' class='name expandable'>showError</a>( <span class='pre'>data, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Renders error message in the target container. ...</div><div class='long'><p>Renders error message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing error message information.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Object containing display options.</p>\n</div></li></ul></div></div></div><div id='method-showMessage' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-showMessage' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-showMessage' class='name expandable'>showMessage</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Renders info message in the target container. ...</div><div class='long'><p>Renders info message in the target container.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object containing info message information.</p>\n<ul><li><span class='pre'>layout</span> : String (optional)<div class='sub-desc'><p>Specifies the type of message layout. Can be set to \"compact\" or \"full\".</p>\n</div></li><li><span class='pre'>target</span> : HTMLElement (optional)<div class='sub-desc'><p>Specifies the target container.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>args</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Templater function which compiles the given template using the provided data. ...</div><div class='long'><p>Templater function which compiles the given template using the provided data.</p>\n\n<p>Function can be used widely for html templates processing or any other action\nrequiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process and parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding value,\npreserving the replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div><div id='method-template' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-method-template' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-method-template' class='name expandable'>template</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to get the control template during rendering procedure. ...</div><div class='long'><p>Method to get the control template during rendering procedure. Can be overriden.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-echo_label'>Labels</h3><div class='subsection'><div id='echo_label-error_busy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_busy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_busy' class='name expandable'>error_busy</a> : &quot;Loading. Please wait...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_incorrect_appkey' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_incorrect_appkey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_incorrect_appkey' class='name expandable'>error_incorrect_appkey</a> : &quot;(incorrect_appkey) Incorrect or missing appkey.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_incorrect_user_id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_incorrect_user_id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_incorrect_user_id' class='name expandable'>error_incorrect_user_id</a> : &quot;(incorrect_user_id) Incorrect user specified in User ID predicate.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_internal_error' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_internal_error' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_internal_error' class='name expandable'>error_internal_error</a> : &quot;(internal_error) Unknown server error.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_quota_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_quota_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_quota_exceeded' class='name expandable'>error_quota_exceeded</a> : &quot;(quota_exceeded) Required more quota than is available.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_result_too_large' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_result_too_large' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_result_too_large' class='name expandable'>error_result_too_large</a> : &quot;(result_too_large) The search result is too large.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_timeout' class='name expandable'>error_timeout</a> : &quot;Loading. Please wait...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_unknown' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_unknown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_unknown' class='name expandable'>error_unknown</a> : &quot;(unknown) Unknown error.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_view_limit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_view_limit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_view_limit' class='name expandable'>error_view_limit</a> : &quot;View creation rate limit has been exceeded. Retrying in {seconds} seconds...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_view_update_capacity_exceeded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_view_update_capacity_exceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_view_update_capacity_exceeded' class='name expandable'>error_view_update_capacity_exceeded</a> : &quot;This stream is momentarily unavailable due to unusually high activity. Retrying in {seconds} seconds...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_waiting' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_waiting' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_waiting' class='name expandable'>error_waiting</a> : &quot;Loading. Please wait...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-error_wrong_query' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-error_wrong_query' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-error_wrong_query' class='name expandable'>error_wrong_query</a> : &quot;(wrong_query) Incorrect or missing query parameter.&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-loading' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-loading' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-loading' class='name expandable'>loading</a> : &quot;Loading...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-retrying' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Control' rel='Echo.Control' class='defined-in docClass'>Echo.Control</a><br/><a href='source/control.html#Echo-Control-echo_label-retrying' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Control-echo_label-retrying' class='name expandable'>retrying</a> : &quot;Retrying...&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-echo_event'>Events</h3><div class='subsection'><div id='echo_event-onError' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onError' class='name expandable'>onError</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when some error has occured while getting counter data. ...</div><div class='long'><p>Triggered when some error has occured while getting counter data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onError\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onError\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onError</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div><div id='echo_event-onReady' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onReady' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onReady' class='name expandable'>onReady</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when the app initialization is finished completely. ...</div><div class='long'><p>Triggered when the app initialization is finished completely.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onReady\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onReady\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onReady</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div><div id='echo_event-onRefresh' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRefresh' class='name expandable'>onRefresh</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when the app is refreshed. ...</div><div class='long'><p>Triggered when the app is refreshed. For example after the user\nlogin/logout action or as a result of the \"refresh\" function call.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRefresh\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onRefresh\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onRefresh</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div><div id='echo_event-onRender' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onRender' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRender' class='name expandable'>onRender</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when the app is rendered. ...</div><div class='long'><p>Triggered when the app is rendered.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRender\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onRender\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onRender</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div><div id='echo_event-onRerender' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onRerender' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRerender' class='name expandable'>onRerender</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when the app is rerendered. ...</div><div class='long'><p>Triggered when the app is rerendered.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onRerender\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onRerender\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onRerender</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div><div id='echo_event-onUpdate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Counter'>Echo.StreamServer.Controls.Counter</span><br/><a href='source/counter.html#Echo-StreamServer-Controls-Counter-echo_event-onUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Counter-echo_event-onUpdate' class='name expandable'>onUpdate</a>( <span class='pre'>topic, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Triggered when new value is received. ...</div><div class='long'><p>Triggered when new value is received.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Full name of the event \"<a href=\"#!/api/Echo.StreamServer.Controls.Counter-echo_event-onUpdate\" rel=\"Echo.StreamServer.Controls.Counter-echo_event-onUpdate\" class=\"docClass\">Echo.StreamServer.Controls.Counter.onUpdate</a>\"</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Data object with arbitrary properties</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});