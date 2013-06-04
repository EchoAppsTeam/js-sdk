Ext.data.JsonP.Echo_IdentityServer_API_Request({
  "tagname": "class",
  "files": [
    {
      "filename": "api.js",
      "href": "api.html#Echo-IdentityServer-API-Request"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "apiBaseUrl",
      "tagname": "cfg",
      "owner": "Echo.API.Request",
      "id": "cfg-apiBaseUrl",
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
      "owner": "Echo.IdentityServer.API.Request",
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
      "owner": "Echo.IdentityServer.API.Request",
      "id": "cfg-onData",
      "meta": {
      }
    },
    {
      "name": "onError",
      "tagname": "cfg",
      "owner": "Echo.IdentityServer.API.Request",
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
      "name": "submissionProxyURL",
      "tagname": "cfg",
      "owner": "Echo.IdentityServer.API.Request",
      "id": "cfg-submissionProxyURL",
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
      "name": "constructor",
      "tagname": "method",
      "owner": "Echo.IdentityServer.API.Request",
      "id": "method-constructor",
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
    },
    {
      "name": "request",
      "tagname": "method",
      "owner": "Echo.IdentityServer.API.Request",
      "id": "static-method-request",
      "meta": {
        "static": true
      }
    }
  ],
  "extends": "Echo.API.Request",
  "name": "Echo.IdentityServer.API.Request",
  "package": [
    "api.pack.js"
  ],
  "id": "class-Echo.IdentityServer.API.Request",
  "short_doc": "Class implements the interaction with the Echo Users API\n\nvar request = Echo.IdentityServer.API.request({\n    \"endpoi...",
  "component": false,
  "superclasses": [
    "Echo.API.Request"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='docClass'>Echo.API.Request</a><div class='subclass '><strong>Echo.IdentityServer.API.Request</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/api.html#Echo-IdentityServer-API-Request' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Class implements the interaction with the <a href=\"http://wiki.aboutecho.com/w/page/35104702/API-section-users\" target=\"_blank\">Echo Users API</a></p>\n\n<pre><code>var request = Echo.IdentityServer.API.request({\n    \"endpoint\": \"whoami\",\n    \"apiBaseURL\": \"http://api.echoenabled.com/v1/users/\",\n    \"data\": {\n        \"appkey\": \"echo.jssdk.demo.aboutecho.com\",\n        \"sessionID\": \"http://api.echoenabled.com/v1/bus/jskit/channel/137025938529801703\"\n    },\n    \"onData\": function(data, extra) {\n        // handle successful request here...\n    },\n    \"onError\": function(data, extra) {\n        // handle failed request here...\n    }\n});\n\nrequest.send();\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/api.pack.js'>api.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-apiBaseUrl' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-apiBaseUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-apiBaseUrl' class='name not-expandable'>apiBaseUrl</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Specifies the base URL for API requests</p>\n</div><div class='long'><p>Specifies the base URL for API requests</p>\n</div></div></div><div id='cfg-data' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-data' class='name expandable'>data</a><span> : Object|String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Data to be sent to the server. ...</div><div class='long'><p>Data to be sent to the server. It is converted to a query string,\nif not already a string. Object must be key/value pairs.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-endpoint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-cfg-endpoint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.IdentityServer.API.Request-cfg-endpoint' class='name expandable'>endpoint</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the API endpoint. ...</div><div class='long'><p>Specifies the API endpoint. The only \"whoami\" endpoint is implemented now.</p>\n<p>Overrides: </p></div></div></div><div id='cfg-method' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-method' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-method' class='name expandable'>method</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the request method. ...</div><div class='long'><p>Specifies the request method. The following methods are available:</p>\n\n<ul>\n<li>\"GET\"</li>\n<li>\"POST\"</li>\n</ul>\n\n<p>Defaults to: <code>&quot;GET&quot;</code></p></div></div></div><div id='cfg-onClose' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-onClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onClose' class='name not-expandable'>onClose</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request aborting.</p>\n</div><div class='long'><p>Callback called after API request aborting.</p>\n</div></div></div><div id='cfg-onData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-cfg-onData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.IdentityServer.API.Request-cfg-onData' class='name not-expandable'>onData</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request succeded.</p>\n</div><div class='long'><p>Callback called after API request succeded.</p>\n<p>Overrides: </p></div></div></div><div id='cfg-onError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-cfg-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.IdentityServer.API.Request-cfg-onError' class='name not-expandable'>onError</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request failed.</p>\n</div><div class='long'><p>Callback called after API request failed.</p>\n<p>Overrides: </p></div></div></div><div id='cfg-onOpen' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-onOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onOpen' class='name not-expandable'>onOpen</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called before sending an API request.</p>\n</div><div class='long'><p>Callback called before sending an API request.</p>\n</div></div></div><div id='cfg-secure' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-secure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-secure' class='name expandable'>secure</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>There is a flag which indicates what protocol will be used in, secure or not. ...</div><div class='long'><p>There is a flag which indicates what protocol will be used in, secure or not.\nIf this parameter is not set, internally the lib will decide on the URL scheme.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-settings' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-settings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-settings' class='name expandable'>settings</a><span> : Object</span><span class=\"signature\"></span></div><div class='description'><div class='short'>A set of the key/value pairs to configure the transport object. ...</div><div class='long'><p>A set of the key/value pairs to configure the transport object.\nThis configuration is passed to the transport object through the\njQuery's ajaxSettings field.\nFor more info see http://api.jquery.com/jQuery.ajax/.\nNote: according to the link above, for some transports these settings\nhave no effect.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-submissionProxyURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.IdentityServer.API.Request-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Specifes the URL to the submission proxy service. ...</div><div class='long'><p>Specifes the URL to the submission proxy service.</p>\n<p>Defaults to: <code>&quot;http://apps.echoenabled.com/v2/esp/activity&quot;</code></p></div></div></div><div id='cfg-timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-timeout' class='name expandable'>timeout</a><span> : Number</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the number of seconds after which the onError callback\nis called if the API request failed. ...</div><div class='long'><p>Specifies the number of seconds after which the onError callback\nis called if the API request failed.</p>\n<p>Defaults to: <code>30</code></p></div></div></div><div id='cfg-transport' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-cfg-transport' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-transport' class='name expandable'>transport</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the transport name. ...</div><div class='long'><p>Specifies the transport name. The following transports are available:</p>\n\n<ul>\n<li>\"ajax\"</li>\n<li>\"jsonp\"</li>\n<li>\"XDomainRequest\" (only supported in IE8+)</li>\n</ul>\n\n<p>Defaults to: <code>&quot;ajax&quot;</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.IdentityServer.API.Request-method-constructor' class='name expandable'>Echo.IdentityServer.API.Request</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.IdentityServer.API.Request\" rel=\"Echo.IdentityServer.API.Request\" class=\"docClass\">Echo.IdentityServer.API.Request</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Constructor initializing class using configuration data. ...</div><div class='long'><p>Constructor initializing class using configuration data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.IdentityServer.API.Request\" rel=\"Echo.IdentityServer.API.Request\" class=\"docClass\">Echo.IdentityServer.API.Request</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-send' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api3.html#Echo-API-Request-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-method-send' class='name expandable'>send</a>( <span class='pre'>[args]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method performing the API request using the given parameters. ...</div><div class='long'><p>Method performing the API request using the given parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object (optional)<div class='sub-desc'><p>Request parameters.</p>\n<ul><li><span class='pre'>force</span> : Boolean (optional)<div class='sub-desc'><p>Flag to initiate aggressive polling.</p>\n</div></li></ul></div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-request' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.IdentityServer.API.Request'>Echo.IdentityServer.API.Request</span><br/><a href='source/api.html#Echo-IdentityServer-API-Request-static-method-request' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.IdentityServer.API.Request-static-method-request' class='name expandable'>request</a>( <span class='pre'>Configuration</span> ) : Object<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Alias for the class constructor. ...</div><div class='long'><p>Alias for the class constructor.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Configuration</span> : Object<div class='sub-desc'><p>data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>New class instance.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});