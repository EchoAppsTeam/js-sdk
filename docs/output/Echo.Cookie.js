Ext.data.JsonP.Echo_Cookie({
  "tagname": "class",
  "files": [
    {
      "filename": "cookie.js",
      "href": "cookie.html#Echo-Cookie"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.Cookie",
      "id": "static-method-get",
      "meta": {
        "static": true
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.Cookie",
      "id": "static-method-remove",
      "meta": {
        "static": true
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.Cookie",
      "id": "static-method-set",
      "meta": {
        "static": true
      }
    }
  ],
  "extends": null,
  "name": "Echo.Cookie",
  "package": [
    "loader.js"
  ],
  "id": "class-Echo.Cookie",
  "short_doc": "Library to work with cookies\n\nExample:\n\nEcho.Cookie.set(\"key\", \"value\");\nEcho.Cookie.get(\"key\"); // returns \"value\"\n\n...",
  "component": false,
  "superclasses": [

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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/cookie.html#Echo-Cookie' target='_blank'>cookie.js</a></div></pre><div class='doc-contents'><p>Library to work with cookies</p>\n\n<p>Example:</p>\n\n<pre><code><a href=\"#!/api/Echo.Cookie-static-method-set\" rel=\"Echo.Cookie-static-method-set\" class=\"docClass\">Echo.Cookie.set</a>(\"key\", \"value\");\n<a href=\"#!/api/Echo.Cookie-static-method-get\" rel=\"Echo.Cookie-static-method-get\" class=\"docClass\">Echo.Cookie.get</a>(\"key\"); // returns \"value\"\n\n<a href=\"#!/api/Echo.Cookie-static-method-remove\" rel=\"Echo.Cookie-static-method-remove\" class=\"docClass\">Echo.Cookie.remove</a>(\"key\");\n<a href=\"#!/api/Echo.Cookie-static-method-get\" rel=\"Echo.Cookie-static-method-get\" class=\"docClass\">Echo.Cookie.get</a>(\"key\"); // returns \"undefined\"\n\n<a href=\"#!/api/Echo.Cookie-static-method-set\" rel=\"Echo.Cookie-static-method-set\" class=\"docClass\">Echo.Cookie.set</a>(\"key2\", \"value2\", {\"expires\": 7}); // this cookie expires in 7 days\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/loader.js'>loader.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-get' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Cookie'>Echo.Cookie</span><br/><a href='source/cookie.html#Echo-Cookie-static-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Cookie-static-method-get' class='name expandable'>get</a>( <span class='pre'>name</span> ) : String|undefined<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Method to get cookie value. ...</div><div class='long'><p>Method to get cookie value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Cookie name.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String|undefined</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Cookie'>Echo.Cookie</span><br/><a href='source/cookie.html#Echo-Cookie-static-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Cookie-static-method-remove' class='name expandable'>remove</a>( <span class='pre'>name, options</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Method to remove particular cookie value. ...</div><div class='long'><p>Method to remove particular cookie value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Cookie name.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>path</span> : String (optional)<div class='sub-desc'><p>Path to the page which cookie is applied to.</p>\n</div></li><li><span class='pre'>domain</span> : String (optional)<div class='sub-desc'><p>Domain for which cookie is applied to.</p>\n</div></li><li><span class='pre'>secure</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if the cookie secure or not.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></li></ul></div></div></div><div id='static-method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Cookie'>Echo.Cookie</span><br/><a href='source/cookie.html#Echo-Cookie-static-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Cookie-static-method-set' class='name expandable'>set</a>( <span class='pre'>name, value, options</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Method to set a particular cookie in the browser. ...</div><div class='long'><p>Method to set a particular cookie in the browser.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Cookie name.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>Any non-object value for cookie.</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>expires</span> : Number (optional)<div class='sub-desc'><p>Number of days in which the cookie expires.</p>\n</div></li><li><span class='pre'>path</span> : String (optional)<div class='sub-desc'><p>Path to the page which the cookie is applied to.</p>\n</div></li><li><span class='pre'>domain</span> : String (optional)<div class='sub-desc'><p>Domain for which the cookie is applied to.</p>\n</div></li><li><span class='pre'>secure</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if this cookie should be secure or not.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});