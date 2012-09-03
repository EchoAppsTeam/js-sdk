Ext.data.JsonP.Echo_StreamServer_Controls_Submit_Plugins_JanrainSharing({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
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
  "id": "class-Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
  "members": {
    "cfg": [
      {
        "name": "activity",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
        "meta": {
        },
        "id": "cfg-activity"
      },
      {
        "name": "appId",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
        "meta": {
        },
        "id": "cfg-appId"
      },
      {
        "name": "xdReceiver",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
        "meta": {
        },
        "id": "cfg-xdReceiver"
      }
    ],
    "property": [
      {
        "name": "sharePrompt",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
        "meta": {
          "echo_label": true
        },
        "id": "property-sharePrompt"
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
  "linenr": 3,
  "files": [
    {
      "filename": "janrain-sharing.js",
      "href": "janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='docClass'>Echo.Plugin</a><div class='subclass '><strong>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing' target='_blank'>janrain-sharing.js</a></div></pre><div class='doc-contents'><p>Plugin provides the ability to load JanRain sharing dialog after\nthe item has been posted using the Echo Submit control.\nInstallation procedure also includes actions on Janrain side.</p>\n\n<p>Download the \"rpx_xdcomm.html\" file from the JanRain application\ndashboard (the \"Deployment\" -> \"Social Sharing\" section) and\nplace it in the root directory of your website.</p>\n\n<p>Configure the list of the necessary social sharing providers\nin the JanRain application dashboard\n(the \"Deployment\" -> \"Social Sharing\" -> \"Choose providers\" section).</p>\n\n<pre><code>var identityManager = {\n    \"width\": 400,\n    \"height\": 240,\n    \"url\": \"http://example.com/auth\"\n};\nnew <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    \"target\": document.getElementById(\"echo-submit\"),\n    \"appkey\": \"test.echoenabled.com\",\n    \"plugins\": [{\n        \"name\": \"JanrainSharing\",\n        \"appId\": \"yourJanRainAppId\",\n        \"xdReceiver\": \"http://your-domain.com/rpx_xdcomm.html\",\n        \"activity\": {\n            \"sharePrompt\": \"Share your comment:\",\n            \"shareContent\": \"I just commented '{content}' on {domain}\",\n            \"itemURL\": \"http://your-domain.com/this-page.html\"\n        }\n    }]\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-activity' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-activity' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-activity' class='name expandable'>activity</a><span> : Object</span></div><div class='description'><div class='short'>Configures the sharing dialog. ...</div><div class='long'><p>Configures the sharing dialog.</p>\n<ul><li><span class='pre'>sharePrompt</span> : String<div class='sub-desc'><p>Caption of the textarea in the sharing dialog</p>\n</div></li><li><span class='pre'>shareContent</span> : String<div class='sub-desc'><p>Content of the message which will be shared.\nThe following pseudo-tags can be used:</p>\n\n<ul>\n<li>{content} - tag is replaced with the content of the item;</li>\n<li>{domain} - tag is replaced with the current page domain.</li>\n</ul>\n\n\n<p>If value of shareContent parameter is not provided then\nthe following message will be used:</p>\n\n<ul>\n<li>\"{content}\" for ordinary item;</li>\n<li>\"@{author} {content}\" if this is reply to tweet.</li>\n</ul>\n\n</div></li><li><span class='pre'>itemURL</span> : String<div class='sub-desc'><p>The url where the item was posted initially.</p>\n</div></li><li><span class='pre'>pageTitle</span> : String<div class='sub-desc'><p>The page title where this activity is taking place.\nThis information will be displayed in the Sharing dialog\nif at least one of the following providers is active:\nYahoo!, Facebook or LinkedIn. If this value is not provided\nthen the original page title will be used.</p>\n</div></li><li><span class='pre'>pageDescription</span> : String<div class='sub-desc'><p>The page description where this activity is taking place.\nThis information will be displayed in the Sharing dialog\nif at least one of the following providers is active:\nFacebook or LinkedIn.</p>\n</div></li><li><span class='pre'>pageImages</span> : Array<div class='sub-desc'><p>The list of up to five images. These images are displayed\nas thumbnails by Facebook and LinkedIn. Facebook uses all\nfive images. LinkedIn uses only the first image.</p>\n<ul><li><span class='pre'>src</span> : String<div class='sub-desc'><p>The absolute URL of the image.</p>\n</div></li><li><span class='pre'>href</span> : String<div class='sub-desc'><p>The absolute URL to which the image links.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='cfg-appId' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-appId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-appId' class='name expandable'>appId</a><span> : String</span></div><div class='description'><div class='short'>JanRain application ID. ...</div><div class='long'><p>JanRain application ID. You can find the application ID\n in the JanRain application dashboard.</p>\n</div></div></div><div id='cfg-xdReceiver' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-xdReceiver' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-xdReceiver' class='name not-expandable'>xdReceiver</a><span> : String</span></div><div class='description'><div class='short'><p>Full URL of the \"rpx_xdcomm.html\" file, downloaded from\nthe JanRain application dashboard.</p>\n</div><div class='long'><p>Full URL of the \"rpx_xdcomm.html\" file, downloaded from\nthe JanRain application dashboard.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-sharePrompt' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-property-sharePrompt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-property-sharePrompt' class='name expandable'>sharePrompt</a><span> : String</span><strong class='echo_label signature' >localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;Share your comment:&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-disable' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-disable' class='name expandable'>disable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Disables the plugin. ...</div><div class='long'><p>Disables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enable' class='name expandable'>enable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Enables the plugin. ...</div><div class='long'><p>Enables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enabled' class='name expandable'>enabled</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Checks if the plugin is enabled. ...</div><div class='long'><p>Checks if the plugin is enabled.</p>\n</div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>String action, String anchor, [String|Function html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular component. ...</div><div class='long'><p>Method to extend the template of particular component.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:\n+ \"insertBefore\"\n+ \"insertAfter\"\n+ \"insertAsFirstChild\"\n+ \"insertAsLastChild\"\n+ \"replace\"\n+ \"remove\"</p>\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String|Function (optional)<div class='sub-desc'><p>The content of a transformation to be applied. Can be defined as a\nHTML string or a transformer function. This param is required for all\nactions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Object defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key or the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config. Note: only the 'undefined' JS statement triggers the default value usage. The false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-init' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-init' class='name expandable'>init</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Initializes the plugin. ...</div><div class='long'><p>Initializes the plugin.</p>\n</div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-log' class='name expandable'>log</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>String name, Object args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call parent renderer function, which was extended using Echo.Control.extendRenderer function. ...</div><div class='long'><p>Method to call parent renderer function, which was extended using Echo.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-remove' class='name expandable'>remove</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method to remove specific object field. ...</div><div class='long'><p>Method to remove specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays), it will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul></div></div></div><div id='method-requestDataRefresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-requestDataRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-requestDataRefresh' class='name expandable'>requestDataRefresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method publishes the internal event to make current state invalid. ...</div><div class='long'><p>Method publishes the internal event to make current state invalid.\nIt triggers data refresh.</p>\n</div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>Object args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.\nFunction can be used widely for html templates processing or any other\naction requiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process, contains control parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding\nvalue, preserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during\ntemplate compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});