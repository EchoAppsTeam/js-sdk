Ext.data.JsonP.Echo_StreamServer_API_Request({
  "tagname": "class",
  "name": "Echo.StreamServer.API.Request",
  "extends": "Echo.API.Request",
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
  "id": "class-Echo.StreamServer.API.Request",
  "members": {
    "cfg": [
      {
        "name": "apiBaseUrl",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-apiBaseUrl"
      },
      {
        "name": "endpoint",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
          "required": true
        },
        "id": "cfg-endpoint"
      },
      {
        "name": "liveUpdatesTimeout",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-liveUpdatesTimeout"
      },
      {
        "name": "onClose",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-onClose"
      },
      {
        "name": "onData",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-onData"
      },
      {
        "name": "onError",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-onError"
      },
      {
        "name": "onOpen",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-onOpen"
      },
      {
        "name": "skipInitialRequests",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-skipInitialRequests"
      },
      {
        "name": "submissionProxyURL",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "cfg-submissionProxyURL"
      },
      {
        "name": "transport",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-transport"
      }
    ],
    "property": [

    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "abort",
        "tagname": "method",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
        },
        "id": "method-abort"
      },
      {
        "name": "send",
        "tagname": "method",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "method-send"
      }
    ],
    "event": [

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
      {
        "name": "request",
        "tagname": "method",
        "owner": "Echo.StreamServer.API.Request",
        "meta": {
          "static": true
        },
        "id": "static-method-request"
      }
    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 5,
  "files": [
    {
      "filename": "api.js",
      "href": "api2.html#Echo-StreamServer-API-Request"
    }
  ],
  "html_meta": {
  },
  "component": false,
  "superclasses": [
    "Echo.API.Request"
  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='docClass'>Echo.API.Request</a><div class='subclass '><strong>Echo.StreamServer.API.Request</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/api2.html#Echo-StreamServer-API-Request' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Class implements the interaction with the <a href=\"http://wiki.aboutecho.com/w/page/19987923/FrontPage\" target=\"_blank\">Echo StreamServer API</a></p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required Config options</h3><div id='cfg-endpoint' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-endpoint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-endpoint' class='name not-expandable'>endpoint</a><span> : String</span><strong class='required signature' >required</strong></div><div class='description'><div class='short'><p>Specifes the API endpoint.</p>\n</div><div class='long'><p>Specifes the API endpoint.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional Config options</h3><div id='cfg-apiBaseUrl' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-apiBaseUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-apiBaseUrl' class='name not-expandable'>apiBaseUrl</a><span> : String</span></div><div class='description'><div class='short'><p>Specifies the base URL for API requests</p>\n</div><div class='long'><p>Specifies the base URL for API requests</p>\n</div></div></div><div id='cfg-liveUpdatesTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-liveUpdatesTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-liveUpdatesTimeout' class='name expandable'>liveUpdatesTimeout</a><span> : Number</span></div><div class='description'><div class='short'>Specifies the live updates requests timeout in seconds. ...</div><div class='long'><p>Specifies the live updates requests timeout in seconds.</p>\n<p>Defaults to: <code>5</code></p></div></div></div><div id='cfg-onClose' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-onClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onClose' class='name not-expandable'>onClose</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request aborting.</p>\n</div><div class='long'><p>Callback called after API request aborting.</p>\n</div></div></div><div id='cfg-onData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-onData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onData' class='name not-expandable'>onData</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request succeded.</p>\n</div><div class='long'><p>Callback called after API request succeded.</p>\n<p>Overrides: <a href='#!/api/Echo.API.Request-cfg-onData' rel='Echo.API.Request-cfg-onData' class='docClass'>Echo.API.Request.onData</a></p></div></div></div><div id='cfg-onError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onError' class='name not-expandable'>onError</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request failed.</p>\n</div><div class='long'><p>Callback called after API request failed.</p>\n<p>Overrides: <a href='#!/api/Echo.API.Request-cfg-onError' rel='Echo.API.Request-cfg-onError' class='docClass'>Echo.API.Request.onError</a></p></div></div></div><div id='cfg-onOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-onOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onOpen' class='name not-expandable'>onOpen</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called before sending an API request.</p>\n</div><div class='long'><p>Callback called before sending an API request.</p>\n<p>Overrides: <a href='#!/api/Echo.API.Request-cfg-onOpen' rel='Echo.API.Request-cfg-onOpen' class='docClass'>Echo.API.Request.onOpen</a></p></div></div></div><div id='cfg-skipInitialRequests' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-skipInitialRequests' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-skipInitialRequests' class='name not-expandable'>skipInitialRequests</a><span> : Boolean</span></div><div class='description'><div class='short'><p>Flag allowing to skip the initial request but continue performing live updates requests.</p>\n</div><div class='long'><p>Flag allowing to skip the initial request but continue performing live updates requests.</p>\n</div></div></div><div id='cfg-submissionProxyURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a><span> : String</span></div><div class='description'><div class='short'>Specifes the URL to the submission proxy service. ...</div><div class='long'><p>Specifes the URL to the submission proxy service.</p>\n<p>Defaults to: <code>&quot;apps.echoenabled.com/v2/esp/activity&quot;</code></p></div></div></div><div id='cfg-transport' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-transport' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-transport' class='name expandable'>transport</a><span> : String</span></div><div class='description'><div class='short'>Specifies the transport name. ...</div><div class='long'><p>Specifies the transport name.</p>\n<p>Defaults to: <code>&quot;ajax&quot;</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance Methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.API.Request-method-constructor' class='name expandable'>Echo.StreamServer.API.Request</a>( <span class='pre'>Object config</span> ) : Object</div><div class='description'><div class='short'>Constructor initializing class using configuration data. ...</div><div class='long'><p>Constructor initializing class using configuration data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-abort' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-method-abort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-method-abort' class='name expandable'>abort</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method to stop live updates requests. ...</div><div class='long'><p>Method to stop live updates requests.</p>\n</div></div></div><div id='method-send' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-method-send' class='name expandable'>send</a>( <span class='pre'>[Object args]</span> )</div><div class='description'><div class='short'>Method performing api request using given parameters. ...</div><div class='long'><p>Method performing api request using given parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object (optional)<div class='sub-desc'><p>Request parameters.</p>\n<ul><li><span class='pre'>force</span> : Boolean (optional)<div class='sub-desc'><p>Flag to initiate aggressive polling.</p>\n</div></li></ul></div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static Methods</h3><div id='static-method-request' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api2.html#Echo-StreamServer-API-Request-static-method-request' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-static-method-request' class='name expandable'>request</a>( <span class='pre'>Object Configuration</span> ) : Class<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Alias for the class constructor. ...</div><div class='long'><p>Alias for the class constructor.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Configuration</span> : Object<div class='sub-desc'><p>data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Class</span><div class='sub-desc'><p>New class instance.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});