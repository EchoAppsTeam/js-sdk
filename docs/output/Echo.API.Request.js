Ext.data.JsonP.Echo_API_Request({
  "tagname": "class",
  "name": "Echo.API.Request",
  "extends": null,
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
  "id": "class-Echo.API.Request",
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
        "name": "data",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-data"
      },
      {
        "name": "endpoint",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-endpoint"
      },
      {
        "name": "method",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-method"
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
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-onData"
      },
      {
        "name": "onError",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-onError"
      },
      {
        "name": "onOpen",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-onOpen"
      },
      {
        "name": "settings",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-settings"
      },
      {
        "name": "timeout",
        "tagname": "cfg",
        "owner": "Echo.API.Request",
        "meta": {
        },
        "id": "cfg-timeout"
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
  "linenr": 283,
  "files": [
    {
      "filename": "api.js",
      "href": "api3.html#Echo-API-Request"
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

  ],
  "subclasses": [
    "Echo.IdentityServer.API.Request",
    "Echo.StreamServer.API.Request"
  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Echo.IdentityServer.API.Request' rel='Echo.IdentityServer.API.Request' class='docClass'>Echo.IdentityServer.API.Request</a></div><div class='dependency'><a href='#!/api/Echo.StreamServer.API.Request' rel='Echo.StreamServer.API.Request' class='docClass'>Echo.StreamServer.API.Request</a></div><h4>Files</h4><div class='dependency'><a href='source/api3.html#Echo-API-Request' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Class implementing API requests logic on the transport layer.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-apiBaseUrl' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-apiBaseUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-apiBaseUrl' class='name not-expandable'>apiBaseUrl</a><span> : String</span></div><div class='description'><div class='short'><p>Specifies the base URL for API requests</p>\n</div><div class='long'><p>Specifies the base URL for API requests</p>\n</div></div></div><div id='cfg-data' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-data' class='name expandable'>data</a><span> : Object|String</span></div><div class='description'><div class='short'>Data to be sent to the server. ...</div><div class='long'><p>Data to be sent to the server. It is converted to a query string,\nif not already a string. Object must be key/value pairs.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-endpoint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-endpoint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-endpoint' class='name not-expandable'>endpoint</a><span> : String</span></div><div class='description'><div class='short'><p>Specifes the API endpoint.</p>\n</div><div class='long'><p>Specifes the API endpoint.</p>\n</div></div></div><div id='cfg-method' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-method' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-method' class='name expandable'>method</a><span> : String</span></div><div class='description'><div class='short'>Specifies the request method. ...</div><div class='long'><p>Specifies the request method.</p>\n<p>Defaults to: <code>&quot;GET&quot;</code></p></div></div></div><div id='cfg-onClose' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-onClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onClose' class='name not-expandable'>onClose</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request aborting.</p>\n</div><div class='long'><p>Callback called after API request aborting.</p>\n</div></div></div><div id='cfg-onData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-onData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onData' class='name not-expandable'>onData</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request succeded.</p>\n</div><div class='long'><p>Callback called after API request succeded.</p>\n</div></div></div><div id='cfg-onError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onError' class='name not-expandable'>onError</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called after API request failed.</p>\n</div><div class='long'><p>Callback called after API request failed.</p>\n</div></div></div><div id='cfg-onOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-onOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onOpen' class='name not-expandable'>onOpen</a><span> : Function</span></div><div class='description'><div class='short'><p>Callback called before sending an API request.</p>\n</div><div class='long'><p>Callback called before sending an API request.</p>\n</div></div></div><div id='cfg-settings' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-settings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-settings' class='name expandable'>settings</a><span> : Object</span></div><div class='description'><div class='short'>A set of the key/value pairs to configure the transport object. ...</div><div class='long'><p>A set of the key/value pairs to configure the transport object.\nThis configuration is passed to the transport object through the\njQuery's ajaxSettings field.\nFor more info see http://api.jquery.com/jQuery.ajax/.\nNote: according to the link above, for some transports these settings\nhave no effect.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-timeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-timeout' class='name expandable'>timeout</a><span> : Number</span></div><div class='description'><div class='short'>Specifies the number of seconds after which the onError callback\nis called if the API request failed. ...</div><div class='long'><p>Specifies the number of seconds after which the onError callback\nis called if the API request failed.</p>\n<p>Defaults to: <code>30</code></p></div></div></div><div id='cfg-transport' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-cfg-transport' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-transport' class='name expandable'>transport</a><span> : String</span></div><div class='description'><div class='short'>Specifies the transport name. ...</div><div class='long'><p>Specifies the transport name.</p>\n<p>Defaults to: <code>&quot;ajax&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-send' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api3.html#Echo-API-Request-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-method-send' class='name expandable'>send</a>( <span class='pre'>[args]</span> )</div><div class='description'><div class='short'>Method performing the API request using the given parameters. ...</div><div class='long'><p>Method performing the API request using the given parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object (optional)<div class='sub-desc'><p>Request parameters.</p>\n<ul><li><span class='pre'>force</span> : Boolean (optional)<div class='sub-desc'><p>Flag to initiate aggressive polling.</p>\n</div></li></ul></div></li></ul></div></div></div></div></div></div></div>"
});