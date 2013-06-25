Ext.data.JsonP.Echo_Plugin_Config({
  "tagname": "class",
  "name": "Echo.Plugin.Config",
  "autodetected": {
  },
  "files": [
    {
      "filename": "plugin.js",
      "href": "plugin.html#Echo-Plugin-Config"
    }
  ],
  "private": true,
  "package": [
    "environment.pack.js"
  ],
  "members": [
    {
      "name": "assemble",
      "tagname": "method",
      "owner": "Echo.Plugin.Config",
      "id": "method-assemble",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.Plugin.Config",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.Plugin.Config",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.Plugin.Config",
      "id": "method-set",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.Plugin.Config",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/plugin.html#Echo-Plugin-Config' target='_blank'>plugin.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Echo Plugin interlayer for <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> utilization.</p>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-assemble' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Config'>Echo.Plugin.Config</span><br/><a href='source/plugin.html#Echo-Plugin-Config-method-assemble' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Config-method-assemble' class='name expandable'>assemble</a>( <span class='pre'>data</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to assemble config for nested control based on the parent control config. ...</div><div class='long'><p>Method to assemble config for nested control based on the parent control config.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Configuration data to be merged with the parent config.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p><a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> instance.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Config'>Echo.Plugin.Config</span><br/><a href='source/plugin.html#Echo-Plugin-Config-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Config-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults], [askParent]</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Accessor method to get specific config field. ...</div><div class='long'><p>Accessor method to get specific config field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the <code>undefined</code> JS statement triggers the default\nvalue usage. The <code>false</code>, <code>null</code>, <code>0</code>, <code>[]</code> are considered\nas a proper value.</p>\n</div></li><li><span class='pre'>askParent</span> : Boolean (optional)<div class='sub-desc'><p>Flag to call parent config if the value was not found in the particular instance.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>Corresponding value found in the config.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Config'>Echo.Plugin.Config</span><br/><a href='source/plugin.html#Echo-Plugin-Config-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Config-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove specific config field. ...</div><div class='long'><p>Method to remove specific config field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key which should be removed from the configuration.</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Config'>Echo.Plugin.Config</span><br/><a href='source/plugin.html#Echo-Plugin-Config-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Config-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Setter method to define specific config field value. ...</div><div class='long'><p>Setter method to define specific config field value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
    "private": true
  }
});