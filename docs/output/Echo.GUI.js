Ext.data.JsonP.Echo_GUI({
  "tagname": "class",
  "name": "Echo.GUI",
  "autodetected": {
  },
  "files": [
    {
      "filename": "gui.js",
      "href": "gui.html#Echo-GUI"
    }
  ],
  "package": [
    "gui.pack.js"
  ],
  "members": [
    {
      "name": "config",
      "tagname": "property",
      "owner": "Echo.GUI",
      "id": "property-config",
      "meta": {
      }
    },
    {
      "name": "constructor",
      "tagname": "method",
      "owner": "Echo.GUI",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "destroy",
      "tagname": "method",
      "owner": "Echo.GUI",
      "id": "method-destroy",
      "meta": {
      }
    },
    {
      "name": "refresh",
      "tagname": "method",
      "owner": "Echo.GUI",
      "id": "method-refresh",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.GUI",
  "component": false,
  "superclasses": [

  ],
  "subclasses": [
    "Echo.GUI.Button",
    "Echo.GUI.Dropdown",
    "Echo.GUI.Modal",
    "Echo.GUI.Tabs"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Echo.GUI.Button' rel='Echo.GUI.Button' class='docClass'>Echo.GUI.Button</a></div><div class='dependency'><a href='#!/api/Echo.GUI.Dropdown' rel='Echo.GUI.Dropdown' class='docClass'>Echo.GUI.Dropdown</a></div><div class='dependency'><a href='#!/api/Echo.GUI.Modal' rel='Echo.GUI.Modal' class='docClass'>Echo.GUI.Modal</a></div><div class='dependency'><a href='#!/api/Echo.GUI.Tabs' rel='Echo.GUI.Tabs' class='docClass'>Echo.GUI.Tabs</a></div><h4>Files</h4><div class='dependency'><a href='source/gui.html#Echo-GUI' target='_blank'>gui.js</a></div></pre><div class='doc-contents'><p>Foundation class implementing core logic for GUI components.</p>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/gui.pack.js'>gui.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI'>Echo.GUI</span><br/><a href='source/gui.html#Echo-GUI-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-property-config' class='name expandable'>config</a> : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a><span class=\"signature\"></span></div><div class='description'><div class='short'>As soon as the component is created, you can change its config using\nthis property. ...</div><div class='long'><p>As soon as the component is created, you can change its config using\nthis property.\nFor example:\n    component.config.set(\"some-config-parameter\", \"new-value\");\n    component.refresh();</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI'>Echo.GUI</span><br/><a href='source/gui.html#Echo-GUI-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.GUI-method-constructor' class='name expandable'>Echo.GUI</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.GUI\" rel=\"Echo.GUI\" class=\"docClass\">Echo.GUI</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>GUI component configuration.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.GUI\" rel=\"Echo.GUI\" class=\"docClass\">Echo.GUI</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI'>Echo.GUI</span><br/><a href='source/gui.html#Echo-GUI-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the component and removes it's instance. ...</div><div class='long'><p>Hides the component and removes it's instance.</p>\n</div></div></div><div id='method-refresh' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI'>Echo.GUI</span><br/><a href='source/gui.html#Echo-GUI-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method re-assembles the component HTML code and\nappends it to the target. ...</div><div class='long'><p>This method re-assembles the component HTML code and\nappends it to the target.</p>\n</div></div></div></div></div></div></div>",
  "meta": {
  }
});