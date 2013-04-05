Ext.data.JsonP.Echo_Plugin_config({
  "tagname": "class",
  "name": "Echo.Plugin.config",
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
  "id": "class-Echo.Plugin.config",
  "members": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "assemble",
        "tagname": "method",
        "owner": "Echo.Plugin.config",
        "meta": {
        },
        "id": "method-assemble"
      },
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.Plugin.config",
        "meta": {
        },
        "id": "method-get"
      },
      {
        "name": "remove",
        "tagname": "method",
        "owner": "Echo.Plugin.config",
        "meta": {
        },
        "id": "method-remove"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.Plugin.config",
        "meta": {
        },
        "id": "method-set"
      }
    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 457,
  "files": [
    {
      "filename": "plugin.js",
      "href": "plugin.html#Echo-Plugin-config"
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

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/plugin.html#Echo-Plugin-config' target='_blank'>plugin.js</a></div></pre><div class='doc-contents'><p>Echo Plugin interlayer for <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> utilization.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-assemble' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.config'>Echo.Plugin.config</span><br/><a href='source/plugin.html#Echo-Plugin-config-method-assemble' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.config-method-assemble' class='name expandable'>assemble</a>( <span class='pre'>data</span> ) : Object</div><div class='description'><div class='short'>Method to assemble config for nested control based on the parent control config. ...</div><div class='long'><p>Method to assemble config for nested control based on the parent control config.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Configuration data to be merged with the parent config.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p><a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> instance.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.config'>Echo.Plugin.config</span><br/><a href='source/plugin.html#Echo-Plugin-config-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.config-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults], [askParent]</span> ) : Mixed</div><div class='description'><div class='short'>Accessor method to get specific config field. ...</div><div class='long'><p>Accessor method to get specific config field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the <code>undefined</code> JS statement triggers the default\nvalue usage. The <code>false</code>, <code>null</code>, <code>0</code>, <code>[]</code> are considered\nas a proper value.</p>\n</div></li><li><span class='pre'>askParent</span> : Boolean (optional)<div class='sub-desc'><p>Flag to call parent config if the value was not found in the particular instance.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>Corresponding value found in the config.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.config'>Echo.Plugin.config</span><br/><a href='source/plugin.html#Echo-Plugin-config-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.config-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> )</div><div class='description'><div class='short'>Method to remove specific config field. ...</div><div class='long'><p>Method to remove specific config field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key which should be removed from the configuration.</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.config'>Echo.Plugin.config</span><br/><a href='source/plugin.html#Echo-Plugin-config-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.config-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )</div><div class='description'><div class='short'>Setter method to define specific config field value. ...</div><div class='long'><p>Setter method to define specific config field value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});