Ext.data.JsonP.Echo_StreamServer_Controls_Stream_Plugins_PinboardVisulization({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
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
  "id": "class-Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
  "members": {
    "cfg": [
      {
        "name": "columnWidth",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-columnWidth"
      },
      {
        "name": "gallery",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-gallery"
      },
      {
        "name": "isotope",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-isotope"
      },
      {
        "name": "itemCSSClassByContentLength",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-itemCSSClassByContentLength"
      },
      {
        "name": "maxChildrenBodyCharacters",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-maxChildrenBodyCharacters"
      },
      {
        "name": "mediaSelector",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization",
        "meta": {
        },
        "id": "cfg-mediaSelector"
      }
    ],
    "property": [

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

    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 197,
  "files": [
    {
      "filename": "pinboard-visualization.js",
      "href": "pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization"
    }
  ],
  "html_meta": {
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='docClass'>Echo.Plugin</a><div class='subclass '><strong>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization' target='_blank'>pinboard-visualization.js</a></div></pre><div class='doc-contents'><p>The PinboardVisualization plugin transforms Echo Stream Client visualization into a pinboard-style representation. The plugin extracts all media (such as images, videos, etc) from the item content and assembles the mini media gallery inside the item UI. You can find UI example of the plugin\n<a href=\"http://echosandbox.com/use-cases/pinboard-visualization/\">here</a>.</p>\n\n<pre><code>new Echo.Stream({\n    \"target\": document.getElementById(\"echo-stream\"),\n    \"appkey\": \"test.echoenabled.com\",\n    \"plugins\": [{\n        \"name\": \"PinboardVisualization\"\n    }]\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-columnWidth' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-columnWidth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-columnWidth' class='name expandable'>columnWidth</a><span> : Number</span></div><div class='description'><div class='short'>Allows to define the width for one column in pixels, default width is 250px. ...</div><div class='long'><p>Allows to define the width for one column in pixels, default width is 250px. The amount of columns is calculated based on the width of the Echo Stream Client container.</p>\n<p>Defaults to: <code>250</code></p></div></div></div><div id='cfg-gallery' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-gallery' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-gallery' class='name expandable'>gallery</a><span> : Object</span></div><div class='description'><div class='short'>Allows is a proxy for the mini media gallery class, initialized for the item in case the media content was found in i...</div><div class='long'><p>Allows is a proxy for the mini media gallery class, initialized for the item in case the media content was found in its content.</p>\n<p>Defaults to: <code>{&quot;resizeDuration&quot;: 250}</code></p></div></div></div><div id='cfg-isotope' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-isotope' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-isotope' class='name expandable'>isotope</a><span> : Object</span></div><div class='description'><div class='short'>Allows to configure the Isotope jQuery plugin, used by the plugin as the rendering engine. ...</div><div class='long'><p>Allows to configure the Isotope jQuery plugin, used by the plugin as the rendering engine. The possible config values can be found at the Isotope plugin homepage (http://isotope.metafizzy.co/). It's NOT recommended to change the settings of the Isotope unless it's really required.</p>\n</div></div></div><div id='cfg-itemCSSClassByContentLength' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-itemCSSClassByContentLength' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-itemCSSClassByContentLength' class='name expandable'>itemCSSClassByContentLength</a><span> : Object</span></div><div class='description'><div class='short'>Allows to define extra CSS class to the item based on the item length. ...</div><div class='long'><p>Allows to define extra CSS class to the item based on the item length. The value of this parameter is the JS object with the CSS classes as the keys and the item text length ranges as values. Multiple CSS classes might be applied to the item if the item text length satisfies several conditions simultaneously.</p>\n<p>Defaults to: <code>{&quot;echo-streamserver-controls-stream-item-smallSizeContent&quot;: [0, 69], &quot;echo-streamserver-controls-stream-item-mediumSizeContent&quot;: [70, 120]}</code></p></div></div></div><div id='cfg-maxChildrenBodyCharacters' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-maxChildrenBodyCharacters' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-maxChildrenBodyCharacters' class='name expandable'>maxChildrenBodyCharacters</a><span> : Number</span></div><div class='description'><div class='short'>Allows to truncate the reply text displayed under the root item. ...</div><div class='long'><p>Allows to truncate the reply text displayed under the root item. Default value is 50 characters. The value of this parameter should be integer and represent the number of visible characters that need to be displayed.</p>\n<p>Defaults to: <code>50</code></p></div></div></div><div id='cfg-mediaSelector' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization'>Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization</span><br/><a href='source/pinboard-visualization.html#Echo-StreamServer-Controls-Stream-Plugins-PinboardVisulization-cfg-mediaSelector' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization-cfg-mediaSelector' class='name expandable'>mediaSelector</a><span> : Function</span></div><div class='description'><div class='short'>Allows to define the function with the custom rules for the media content extraction from the item content. ...</div><div class='long'><p>Allows to define the function with the custom rules for the media content extraction from the item content. The value of this parameter is function which accepts the item content (string) as a first argument and should return the jQuery element with the list of the DOM elements which are considered to be the media content of this item.</p>\n\n<p>Example (also used as a default value):</p>\n\n<pre><code>\"mediaSelector\": function(content) {\n    var dom = $(\"&lt;div&gt;\" + content + \"&lt;/div&gt;\");\n    return $(\"img, video, embed, iframe\", dom);\n}\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-disable' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-disable' class='name expandable'>disable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Disables the plugin. ...</div><div class='long'><p>Disables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enable' class='name expandable'>enable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Enables the plugin. ...</div><div class='long'><p>Enables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enabled' class='name expandable'>enabled</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Checks if the plugin is enabled. ...</div><div class='long'><p>Checks if the plugin is enabled.</p>\n</div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>String action, String anchor, [String|Function html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular component. ...</div><div class='long'><p>Method to extend the template of particular component.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:\n+ \"insertBefore\"\n+ \"insertAfter\"\n+ \"insertAsFirstChild\"\n+ \"insertAsLastChild\"\n+ \"replace\"\n+ \"remove\"</p>\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String|Function (optional)<div class='sub-desc'><p>The content of a transformation to be applied. Can be defined as a HTML string or a transformer function. This param is required for all actions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Object defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key or the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config. Note: only the 'undefined' JS statement triggers the default value usage. The false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>Returns the corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-init' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-init' class='name expandable'>init</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Initializes the plugin. ...</div><div class='long'><p>Initializes the plugin.</p>\n</div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-log' class='name expandable'>log</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>String name, Object args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call parent renderer function, which was extended using Echo.Control.extendRenderer function. ...</div><div class='long'><p>Method to call parent renderer function, which was extended using Echo.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>(required) Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>(required) Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-remove' class='name expandable'>remove</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method to remove specific object field. ...</div><div class='long'><p>Method to remove specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays), it will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key which should be removed from the object.</p>\n</div></li></ul></div></div></div><div id='method-requestDataRefresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-requestDataRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-requestDataRefresh' class='name expandable'>requestDataRefresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method publishes the internal event to make current state invalid. ...</div><div class='long'><p>Method publishes the internal event to make current state invalid.\nIt triggers data refresh.</p>\n</div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>Object args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.\nFunction can be used widely for html templates processing or any other action requiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process, contains control parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding value, preserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});