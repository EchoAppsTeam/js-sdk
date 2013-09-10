Ext.data.JsonP.Echo_StreamServer_API_Request({
  "tagname": "class",
  "name": "Echo.StreamServer.API.Request",
  "autodetected": {
  },
  "files": [
    {
      "filename": "api.js",
      "href": "api3.html#Echo-StreamServer-API-Request"
    }
  ],
  "extends": "Echo.API.Request",
  "package": [
    "api.pack.js"
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
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-endpoint",
      "meta": {
      }
    },
    {
      "name": "itemURIPattern",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-itemURIPattern",
      "meta": {
      }
    },
    {
      "name": "liveUpdatesTimeout",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-liveUpdatesTimeout",
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
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-onData",
      "meta": {
      }
    },
    {
      "name": "onError",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-onError",
      "meta": {
      }
    },
    {
      "name": "onOpen",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-onOpen",
      "meta": {
      }
    },
    {
      "name": "recurring",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-recurring",
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
      "name": "skipInitialRequest",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
      "id": "cfg-skipInitialRequest",
      "meta": {
      }
    },
    {
      "name": "submissionProxyURL",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.API.Request",
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
      "owner": "Echo.StreamServer.API.Request",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "abort",
      "tagname": "method",
      "owner": "Echo.StreamServer.API.Request",
      "id": "method-abort",
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
      "owner": "Echo.StreamServer.API.Request",
      "id": "static-method-request",
      "meta": {
        "static": true
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.StreamServer.API.Request",
  "short_doc": "Class implements the interaction with the Echo StreamServer API\n\nvar request = Echo.StreamServer.API.request({\n    \"e...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='docClass'>Echo.API.Request</a><div class='subclass '><strong>Echo.StreamServer.API.Request</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/api3.html#Echo-StreamServer-API-Request' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Class implements the interaction with the <a href=\"http://wiki.aboutecho.com/w/page/19987923/FrontPage\" target=\"_blank\">Echo StreamServer API</a></p>\n\n<pre><code>var request = Echo.StreamServer.API.request({\n    \"endpoint\": \"search\",\n    \"data\": {\n        \"q\": \"childrenof: http://example.com/js-sdk\",\n        \"appkey\": \"echo.jssdk.demo.aboutecho.com\"\n    },\n    \"onData\": function(data, extra) {\n        // handle successful request here...\n    },\n    \"onError\": function(data, extra) {\n        // handle failed request here...\n    }\n});\n\nrequest.send();\n</code></pre>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/api.pack.js'>api.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-apiBaseUrl' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-apiBaseUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-apiBaseUrl' class='name expandable'>apiBaseUrl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Specifies the base URL for API requests</p>\n</div><div class='long'><p>Specifies the base URL for API requests</p>\n</div></div></div><div id='cfg-data' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-data' class='name expandable'>data</a> : Object|String<span class=\"signature\"></span></div><div class='description'><div class='short'>Data to be sent to the server. ...</div><div class='long'><p>Data to be sent to the server. It is converted to a query string,\nif not already a string. Object must be key/value pairs.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-endpoint' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-endpoint' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-endpoint' class='name expandable'>endpoint</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the API endpoint. ...</div><div class='long'><p>Specifies the API endpoint. The following endpoints are available:</p>\n\n<ul>\n<li>\"submit\"</li>\n<li>\"search\"</li>\n<li>\"count\"</li>\n<li>\"mux\"</li>\n</ul>\n\n\n<p><strong>Note</strong>: The API endpoint \"mux\" allows to \"multiplex\" requests,\ni.e. use a single API call to \"wrap\" several requests. More information\nabout \"mux\" can be found <a href=\"http://wiki.aboutecho.com/w/page/32433803/API-method-mux\">here</a>.</p>\n<p>Overrides: <a href=\"#!/api/Echo.API.Request-cfg-endpoint\" rel=\"Echo.API.Request-cfg-endpoint\" class=\"docClass\">Echo.API.Request.endpoint</a></p></div></div></div><div id='cfg-itemURIPattern' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-itemURIPattern' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-itemURIPattern' class='name expandable'>itemURIPattern</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Specifies the item id pattern.</p>\n</div><div class='long'><p>Specifies the item id pattern.</p>\n</div></div></div><div id='cfg-liveUpdatesTimeout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-liveUpdatesTimeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-liveUpdatesTimeout' class='name expandable'>liveUpdatesTimeout</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the live updates requests timeout in seconds. ...</div><div class='long'><p>Specifies the live updates requests timeout in seconds.</p>\n<p>Defaults to: <code>5</code></p></div></div></div><div id='cfg-method' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-method' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-method' class='name expandable'>method</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the request method. ...</div><div class='long'><p>Specifies the request method. The following methods are available:</p>\n\n<ul>\n<li>\"GET\"</li>\n<li>\"POST\"</li>\n</ul>\n\n<p>Defaults to: <code>&quot;GET&quot;</code></p></div></div></div><div id='cfg-onClose' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-onClose' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-onClose' class='name expandable'>onClose</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request aborting.</p>\n</div><div class='long'><p>Callback called after API request aborting.</p>\n</div></div></div><div id='cfg-onData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-onData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onData' class='name expandable'>onData</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request succeded.</p>\n</div><div class='long'><p>Callback called after API request succeded.</p>\n<p>Overrides: <a href=\"#!/api/Echo.API.Request-cfg-onData\" rel=\"Echo.API.Request-cfg-onData\" class=\"docClass\">Echo.API.Request.onData</a></p></div></div></div><div id='cfg-onError' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-onError' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onError' class='name expandable'>onError</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called after API request failed.</p>\n</div><div class='long'><p>Callback called after API request failed.</p>\n<p>Overrides: <a href=\"#!/api/Echo.API.Request-cfg-onError\" rel=\"Echo.API.Request-cfg-onError\" class=\"docClass\">Echo.API.Request.onError</a></p></div></div></div><div id='cfg-onOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-onOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-onOpen' class='name expandable'>onOpen</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback called before sending an API request.</p>\n</div><div class='long'><p>Callback called before sending an API request.</p>\n<p>Overrides: <a href=\"#!/api/Echo.API.Request-cfg-onOpen\" rel=\"Echo.API.Request-cfg-onOpen\" class=\"docClass\">Echo.API.Request.onOpen</a></p></div></div></div><div id='cfg-recurring' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-recurring' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-recurring' class='name expandable'>recurring</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies that the live updates are enabled. ...</div><div class='long'><p>Specifies that the live updates are enabled.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-secure' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-secure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-secure' class='name expandable'>secure</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>There is a flag which indicates what protocol will be used in, secure or not. ...</div><div class='long'><p>There is a flag which indicates what protocol will be used in, secure or not.\nIf this parameter is not set, internally the lib will decide on the URL scheme.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-settings' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-settings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-settings' class='name expandable'>settings</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>A set of the key/value pairs to configure the transport object. ...</div><div class='long'><p>A set of the key/value pairs to configure the transport object.\nThis configuration is passed to the transport object through the\njQuery's ajaxSettings field.\nFor more info see http://api.jquery.com/jQuery.ajax/.\nNote: according to the link above, for some transports these settings\nhave no effect.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-skipInitialRequest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-skipInitialRequest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-skipInitialRequest' class='name expandable'>skipInitialRequest</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Flag allowing to skip the initial request but continue performing live updates requests. ...</div><div class='long'><p>Flag allowing to skip the initial request but continue performing live updates requests.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-submissionProxyURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-cfg-submissionProxyURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-cfg-submissionProxyURL' class='name expandable'>submissionProxyURL</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifes the URL to the submission proxy service. ...</div><div class='long'><p>Specifes the URL to the submission proxy service.</p>\n<p>Defaults to: <code>&quot;{%=baseURLs.api.submissionproxy%}/v2/esp/activity&quot;</code></p></div></div></div><div id='cfg-timeout' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-timeout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-timeout' class='name expandable'>timeout</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the number of seconds after which the onError callback\nis called if the API request failed. ...</div><div class='long'><p>Specifies the number of seconds after which the onError callback\nis called if the API request failed.</p>\n<p>Defaults to: <code>30</code></p></div></div></div><div id='cfg-transport' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-cfg-transport' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-cfg-transport' class='name expandable'>transport</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies the transport name. ...</div><div class='long'><p>Specifies the transport name. The following transports are available:</p>\n\n<ul>\n<li>\"ajax\"</li>\n<li>\"jsonp\"</li>\n<li>\"XDomainRequest\" (only supported in IE8+)</li>\n</ul>\n\n<p>Defaults to: <code>&quot;ajax&quot;</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.StreamServer.API.Request-method-constructor' class='name expandable'>Echo.StreamServer.API.Request</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.StreamServer.API.Request\" rel=\"Echo.StreamServer.API.Request\" class=\"docClass\">Echo.StreamServer.API.Request</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Constructor initializing class using configuration data. ...</div><div class='long'><p>Constructor initializing class using configuration data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Configuration data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.StreamServer.API.Request\" rel=\"Echo.StreamServer.API.Request\" class=\"docClass\">Echo.StreamServer.API.Request</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-abort' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-method-abort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-method-abort' class='name expandable'>abort</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to stop live updates requests. ...</div><div class='long'><p>Method to stop live updates requests.</p>\n</div></div></div><div id='method-send' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.API.Request' rel='Echo.API.Request' class='defined-in docClass'>Echo.API.Request</a><br/><a href='source/api4.html#Echo-API-Request-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.API.Request-method-send' class='name expandable'>send</a>( <span class='pre'>[args]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method performing the API request using the given parameters. ...</div><div class='long'><p>Method performing the API request using the given parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object (optional)<div class='sub-desc'><p>Request parameters.</p>\n<ul><li><span class='pre'>force</span> : Boolean (optional)<div class='sub-desc'><p>Flag to initiate aggressive polling.</p>\n</div></li></ul></div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-request' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.API.Request'>Echo.StreamServer.API.Request</span><br/><a href='source/api3.html#Echo-StreamServer-API-Request-static-method-request' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.API.Request-static-method-request' class='name expandable'>request</a>( <span class='pre'>Configuration</span> ) : Object<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Alias for the class constructor. ...</div><div class='long'><p>Alias for the class constructor.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Configuration</span> : Object<div class='sub-desc'><p>data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>New class instance.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});