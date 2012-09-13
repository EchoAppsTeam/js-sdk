Ext.data.JsonP.Echo_StreamServer_Controls_Submit_Plugins_FormAuth({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
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
  "code_type": "assignment",
  "inheritable": false,
  "inheritdoc": null,
  "meta": {
  },
  "id": "class-Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
  "members": {
    "cfg": [
      {
        "name": "identityManager",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
        },
        "id": "cfg-identityManager"
      },
      {
        "name": "submitPermissions",
        "tagname": "cfg",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
        },
        "id": "cfg-submitPermissions"
      }
    ],
    "property": [
      {
        "name": "youMustBeLoggedIn",
        "tagname": "property",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
          "echo_label": true
        },
        "id": "property-youMustBeLoggedIn"
      }
    ],
    "method": [
      {
        "name": "auth",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-auth"
      },
      {
        "name": "container",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-container"
      },
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
        "name": "header",
        "tagname": "method",
        "owner": "Echo.StreamServer.Controls.Submit.Plugins.FormAuth",
        "meta": {
          "echo_renderer": true
        },
        "id": "method-header"
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
        "name": "invoke",
        "tagname": "method",
        "owner": "Echo.Plugin",
        "meta": {
        },
        "id": "method-invoke"
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
  "files": [
    {
      "filename": "form-auth.js",
      "href": "form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='docClass'>Echo.Plugin</a><div class='subclass '><strong>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth' target='_blank'>form-auth.js</a></div></pre><div class='doc-contents'><p>Adds the authentication section to the Echo Submit control</p>\n\n<pre><code>var identityManager = {\n    \"width\": 400,\n    \"height\": 240,\n    \"url\": \"http://example.com/auth\"\n};\n\nnew <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    \"target\": document.getElementById(\"submit\"),\n    \"appkey\": \"test.aboutecho.com\",\n    \"plugins\": [{\n        \"name\": \"FormAuth\",\n        \"submitPermissions\": \"forceLogin\",\n        \"identityManager\": {\n            \"login\": identityManager,\n            \"signup\": identityManager\n        }\n    }]\n});\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-identityManager' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-cfg-identityManager' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-cfg-identityManager' class='name expandable'>identityManager</a><span> : Object</span></div><div class='description'><div class='short'>The list of handlers for login, edit\nand signup action. ...</div><div class='long'><p>The list of handlers for login, edit\nand signup action. If some action is ommited then it will not be\navailable for users in the Auth control. Each handler accepts <code>sessionID</code>\nas GET parameter. This parameter is necessary for communication with\nBackplane server. When handler finishes working it constructs the\ncorresponding Backplane message (for login, signup or user data update)\n and sends this message to Backplane server.</p>\n<p>Defaults to: <code>{}</code></p><ul><li><span class='pre'>login</span> : Object (optional)<div class='sub-desc'><p>Encapsulates data for login workflow</p>\n<ul><li><span class='pre'>width</span> : Number (optional)<div class='sub-desc'><p>Specifies the width of the visible auth area</p>\n</div></li><li><span class='pre'>height</span> : Number (optional)<div class='sub-desc'><p>Specifies the height of the visible auth area</p>\n</div></li><li><span class='pre'>url</span> : String (optional)<div class='sub-desc'><p>Specifies the URL to be opened as an auth handler</p>\n</div></li></ul></div></li><li><span class='pre'>signup</span> : Object (optional)<div class='sub-desc'><p>Encapsulates data for signup workflow</p>\n<ul><li><span class='pre'>width</span> : Number (optional)<div class='sub-desc'><p>Specifies the width of the visible auth area</p>\n</div></li><li><span class='pre'>height</span> : Number (optional)<div class='sub-desc'><p>Specifies the height of the visible auth area</p>\n</div></li><li><span class='pre'>url</span> : String (optional)<div class='sub-desc'><p>Specifies the URL to be opened as an auth handler</p>\n</div></li></ul></div></li><li><span class='pre'>edit</span> : Object (optional)<div class='sub-desc'><p>Encapsulates data for edit workflow</p>\n<ul><li><span class='pre'>width</span> : Number (optional)<div class='sub-desc'><p>Specifies the width of the visible auth area</p>\n</div></li><li><span class='pre'>height</span> : Number (optional)<div class='sub-desc'><p>Specifies the height of the visible auth area</p>\n</div></li><li><span class='pre'>url</span> : String (optional)<div class='sub-desc'><p>Specifies the URL to be opened as an auth handler</p>\n</div></li></ul></div></li></ul></div></div></div><div id='cfg-submitPermissions' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-cfg-submitPermissions' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-cfg-submitPermissions' class='name expandable'>submitPermissions</a><span> : String</span></div><div class='description'><div class='short'>Specifies the permitted commenting modes. ...</div><div class='long'><p>Specifies the permitted commenting modes.\nThe two options are: \"allowGuest\" and \"forceLogin\".</p>\n<p>Defaults to: <code>&quot;allowGuest&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-youMustBeLoggedIn' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-property-youMustBeLoggedIn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-property-youMustBeLoggedIn' class='name expandable'>youMustBeLoggedIn</a><span> : String</span><strong class='echo_label signature'>localization label</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;You must be logged in to comment&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-auth' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-method-auth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-method-auth' class='name expandable'>auth</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature'>renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-container' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-method-container' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-method-container' class='name expandable'>container</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature'>renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-disable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-disable' class='name expandable'>disable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Disables the plugin. ...</div><div class='long'><p>Disables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enable' class='name expandable'>enable</a>( <span class='pre'>Object global</span> )</div><div class='description'><div class='short'>Enables the plugin. ...</div><div class='long'><p>Enables the plugin.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enabled' class='name expandable'>enabled</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Checks if the plugin is enabled. ...</div><div class='long'><p>Checks if the plugin is enabled.</p>\n</div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>String action, String anchor, [String|Function html]</span> )</div><div class='description'><div class='short'>Method to extend the template of particular component. ...</div><div class='long'><p>Method to extend the template of particular component.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>One of the following actions:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String|Function (optional)<div class='sub-desc'><p>The content of a transformation to be applied. Can be defined as a\nHTML string or a transformer function. This param is required for all\nactions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Object defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-header' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.FormAuth'>Echo.StreamServer.Controls.Submit.Plugins.FormAuth</span><br/><a href='source/form-auth.html#Echo-StreamServer-Controls-Submit-Plugins-FormAuth-method-header' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.FormAuth-method-header' class='name expandable'>header</a>( <span class='pre'>Object element</span> )<strong class='echo_renderer signature'>renderer</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-init' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-init' class='name expandable'>init</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Initializes the plugin. ...</div><div class='long'><p>Initializes the plugin.</p>\n</div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>Mixed mixed, Object context</span> ) : Mixed</div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-log' class='name expandable'>log</a>( <span class='pre'>Object data</span> )</div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>String name, Object args</span> ) : HTMLElement</div><div class='description'><div class='short'>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function. ...</div><div class='long'><p>Method to call parent renderer function, which was extended using\nEcho.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-remove' class='name expandable'>remove</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method to remove specific object field. ...</div><div class='long'><p>Method to remove specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul></div></div></div><div id='method-requestDataRefresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-requestDataRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-requestDataRefresh' class='name expandable'>requestDataRefresh</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method publishes the internal event to make current state invalid. ...</div><div class='long'><p>Method publishes the internal event to make current state invalid.\nIt triggers data refresh.</p>\n</div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>Object args</span> ) : String</div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.\nFunction can be used widely for html templates processing or any other\naction requiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process, contains control parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding\nvalue, preserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during\ntemplate compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});