Ext.data.JsonP.Echo_API_Request({
  "tagname": "class",
  "name": "Echo.API.Request",
  "autodetected": {
  },
  "files": [
    {
      "filename": "api.js",
      "href": "api4.html#Echo-API-Request"
    }
  ],
  "package": [
    "api.pack.js",
    "environment.pack.js"
  ],
  "members": [
    {
      "name": "apiBaseURL",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-apiBaseURL",
      "meta": {
      }
    },
    {
      "name": "data",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-data",
      "meta": {
      }
    },
    {
      "name": "endpoint",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-endpoint",
      "meta": {
      }
    },
    {
      "name": "method",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-method",
      "meta": {
      }
    },
    {
      "name": "onClose",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-onClose",
      "meta": {
      }
    },
    {
      "name": "onData",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-onData",
      "meta": {
      }
    },
    {
      "name": "onError",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-onError",
      "meta": {
      }
    },
    {
      "name": "onOpen",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-onOpen",
      "meta": {
      }
    },
    {
      "name": "secure",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-secure",
      "meta": {
      }
    },
    {
      "name": "settings",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-settings",
      "meta": {
      }
    },
    {
      "name": "timeout",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-timeout",
      "meta": {
      }
    },
    {
      "name": "transport",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-transport",
      "meta": {
      }
    },
    {
      "name": "send",
      "tagname": "method",
      "owner": "Echo.API.Request",
      "id": "method-send",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.API.Request",
  "component": false,
  "superclasses": [

  ],
  "subclasses": [
    "Echo.IdentityServer.API.Request",
    "Echo.StreamServer.API.Request"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Echo.IdentityServer.API.Request' rel='Echo.IdentityServer.API.Request' class='docClass'>Echo.IdentityServer.API.Request</a></div><div class='dependency'><a href='#!/api/Echo.StreamServer.API.Request' rel='Echo.StreamServer.API.Request' class='docClass'>Echo.StreamServer.API.Request</a></div><h4>Files</h4><div class='dependency'><a href='source/api4.html#Echo-API-Request' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Class implementing API requests logic on the transport layer.</p>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/api.pack.js'>api.pack.js</a>, <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-apiBaseURL' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-apiBaseURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-apiBaseURL' class='name expandable'>apiBaseURL</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the base URL for API requests ...</div><div class='long'><p>Specifies the base URL for API requests</p>\n<p>Defaults to: <code>&quot;//api.echoenabled.com/v1/&quot;</code></p></div></div></div><div id='cfg-data' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-data' class='name expandable'>data</a> : Object|String<span class=\"signature\"></span></div><div class='description'><div class='short'>Data to be sent to the server. ...</div><div class='long'><p>Data to be sent to the server. It is converted to a query string,\nif not already a string. Object must be key/value pairs.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-endpoint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-endpoint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-endpoint' class='name expandable'>endpoint</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Specifes the API endpoint.</p>\n</div><div class='long'><p>Specifes the API endpoint.</p>\n</div></div></div><div id='cfg-method' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-method' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-method' class='name expandable'>method</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the request method. ...</div><div class='long'><p>Specifies the request method. The following methods are available:</p>\n\n<ul>\n<li>\"GET\"</li>\n<li>\"POST\"</li>\n</ul>\n\n<p>Defaults to: <code>&quot;GET&quot;</code></p></div></div></div><div id='cfg-onClose' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-onClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onClose' class='name expandable'>onClose</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request aborting.</p>\n</div><div class='long'><p>Callback called after API request aborting.</p>\n</div></div></div><div id='cfg-onData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-onData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onData' class='name expandable'>onData</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request succeded.</p>\n</div><div class='long'><p>Callback called after API request succeded.</p>\n</div></div></div><div id='cfg-onError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onError' class='name expandable'>onError</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request failed.</p>\n</div><div class='long'><p>Callback called after API request failed.</p>\n</div></div></div><div id='cfg-onOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-onOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onOpen' class='name expandable'>onOpen</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called before sending an API request.</p>\n</div><div class='long'><p>Callback called before sending an API request.</p>\n</div></div></div><div id='cfg-secure' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-secure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-secure' class='name expandable'>secure</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>There is a flag which indicates what protocol will be used in, secure or not. ...</div><div class='long'><p>There is a flag which indicates what protocol will be used in, secure or not.\nIf this parameter is not set, internally the lib will decide on the URL scheme.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-settings' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-settings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-settings' class='name expandable'>settings</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>A set of the key/value pairs to configure the transport object. ...</div><div class='long'><p>A set of the key/value pairs to configure the transport object.\nThis configuration is passed to the transport object through the\njQuery's ajaxSettings field.\nFor more info see http://api.jquery.com/jQuery.ajax/.\nNote: according to the link above, for some transports these settings\nhave no effect.</p>\n</div></div></div><div id='cfg-timeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-timeout' class='name expandable'>timeout</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the number of seconds after which the onError callback\nis called if the API request failed. ...</div><div class='long'><p>Specifies the number of seconds after which the onError callback\nis called if the API request failed.</p>\n<p>Defaults to: <code>30</code></p></div></div></div><div id='cfg-transport' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-cfg-transport' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-transport' class='name expandable'>transport</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the transport name. ...</div><div class='long'><p>Specifies the transport name. The following transports are available:</p>\n\n<ul>\n<li>\"websockets\"</li>\n<li>\"ajax\"</li>\n<li>\"jsonp\"</li>\n<li>\"XDomainRequest\" (only supported in IE8+)</li>\n</ul>\n\n<p>Defaults to: <code>&quot;ajax&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-send' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.API.Request'>Echo.API.Request</span><br/><a href='source/api4.html#Echo-API-Request-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-method-send' class='name expandable'>send</a>( <span class='pre'>[args]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method performing the API request using the given parameters. ...</div><div class='long'><p>Method performing the API request using the given parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object (optional)<div class='sub-desc'><p>Request parameters.</p>\n<ul><li><span class='pre'>force</span> : Boolean (optional)<div class='sub-desc'><p>Flag to initiate aggressive polling.</p>\n</div></li></ul></div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});