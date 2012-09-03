Ext.data.JsonP.Echo_Loader({
  "tagname": "class",
  "name": "Echo.Loader",
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
  "id": "class-Echo.Loader",
  "members": {
    "cfg": [

    ],
    "property": [
      {
        "name": "config",
        "tagname": "property",
        "owner": "Echo.Loader",
        "meta": {
          "private": true
        },
        "id": "property-config"
      },
      {
        "name": "overrides",
        "tagname": "property",
        "owner": "Echo.Loader",
        "meta": {
          "private": true
        },
        "id": "property-overrides"
      }
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
  "statics": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "download",
        "tagname": "method",
        "owner": "Echo.Loader",
        "meta": {
          "static": true
        },
        "id": "static-method-download"
      },
      {
        "name": "getURL",
        "tagname": "method",
        "owner": "Echo.Loader",
        "meta": {
          "static": true
        },
        "id": "static-method-getURL"
      },
      {
        "name": "init",
        "tagname": "method",
        "owner": "Echo.Loader",
        "meta": {
          "static": true
        },
        "id": "static-method-init"
      },
      {
        "name": "override",
        "tagname": "method",
        "owner": "Echo.Loader",
        "meta": {
          "static": true
        },
        "id": "static-method-override"
      }
    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 7,
  "files": [
    {
      "filename": "loader.js",
      "href": "loader.html#Echo-Loader"
    }
  ],
  "html_meta": {
  },
  "component": false,
  "superclasses": [

  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/loader.html#Echo-Loader' target='_blank'>loader.js</a></div></pre><div class='doc-contents'><p>Static class which implements common mechanics for canvases loading.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-property-config' class='name expandable'>config</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{&quot;cdnBaseURL&quot;: &quot;http://cdn.echoenabled.com/&quot;, &quot;errorTimeout&quot;: 5000}</code></p></div></div></div><div id='property-overrides' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-property-overrides' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-property-overrides' class='name expandable'>overrides</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{}</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static Methods</h3><div id='static-method-download' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-download' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-download' class='name expandable'>download</a>( <span class='pre'>Object params</span> )<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function to load the JavaScript or CSS stylesheet files in async mode. ...</div><div class='long'><p>Function to load the JavaScript or CSS stylesheet files in async mode.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Object with the following properties:</p>\n<ul><li><span class='pre'>scripts</span> : Array<div class='sub-desc'><p>Array of objects with the properties described below:</p>\n<ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>JavaScript or CSS stylesheet file URL.</p>\n</div></li><li><span class='pre'>loaded</span> : Function<div class='sub-desc'><p>Function for check whether the script was loaded. This function must return\nboolean value which indicates whether the resource was already loaded on the\npage or not. If the resource was already loaded - no download is performed\nand the callback is called immediately.</p>\n</div></li></ul></div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>Callback function which should be called as soon as all requested files\nwere downloaded.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='static-method-getURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-getURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-getURL' class='name expandable'>getURL</a>( <span class='pre'>String url</span> )<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function to get absolute URL. ...</div><div class='long'><p>Function to get absolute URL.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>JavaScript or CSS stylesheet file URL.</p>\n</div></li></ul></div></div></div><div id='static-method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-init' class='name expandable'>init</a>( <span class='pre'>[Object config]</span> )<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function to initialize canvases on the page. ...</div><div class='long'><p>Function to initialize canvases on the page.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Object which defines an initialization config parameters</p>\n<ul><li><span class='pre'>canvases</span> : Mixed (optional)<div class='sub-desc'><p>Array of jQuery elements or a single jQuery element, which represents a\ncanvas target. If this param is omitted, Echo Loader will look for the\ncanvases in the DOM structure.</p>\n</div></li><li><span class='pre'>target</span> : Object (optional)<div class='sub-desc'><p>Target element where Echo Loader should look for the canvases if no\ncanvases were passed in the \"config.canvases\" field.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='static-method-override' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-override' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-override' class='name expandable'>override</a>( <span class='pre'>String canvasID, String appID, Object config</span> )<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function which provides an ability to override config parameters of the\nspecific application within the canvas. ...</div><div class='long'><p>Function which provides an ability to override config parameters of the\nspecific application within the canvas.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>canvasID</span> : String<div class='sub-desc'><p>Canvas ID.</p>\n</div></li><li><span class='pre'>appID</span> : String<div class='sub-desc'><p>Application ID inside the canvas.</p>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Object with the application config overrides.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});