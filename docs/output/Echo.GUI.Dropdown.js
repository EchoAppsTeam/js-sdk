Ext.data.JsonP.Echo_GUI_Dropdown({
  "tagname": "class",
  "files": [
    {
      "filename": "echo-dropdown.js",
      "href": "echo-dropdown.html#Echo-GUI-Dropdown"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "entries",
      "tagname": "cfg",
      "owner": "Echo.GUI.Dropdown",
      "id": "cfg-entries",
      "meta": {
      }
    },
    {
      "name": "extraClass",
      "tagname": "cfg",
      "owner": "Echo.GUI.Dropdown",
      "id": "cfg-extraClass",
      "meta": {
      }
    },
    {
      "name": "icon",
      "tagname": "cfg",
      "owner": "Echo.GUI.Dropdown",
      "id": "cfg-icon",
      "meta": {
      }
    },
    {
      "name": "target",
      "tagname": "cfg",
      "owner": "Echo.GUI.Dropdown",
      "id": "cfg-target",
      "meta": {
        "required": true
      }
    },
    {
      "name": "title",
      "tagname": "cfg",
      "owner": "Echo.GUI.Dropdown",
      "id": "cfg-title",
      "meta": {
      }
    },
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
      "owner": "Echo.GUI.Dropdown",
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
    },
    {
      "name": "setTitle",
      "tagname": "method",
      "owner": "Echo.GUI.Dropdown",
      "id": "method-setTitle",
      "meta": {
      }
    },
    {
      "name": "updateEntries",
      "tagname": "method",
      "owner": "Echo.GUI.Dropdown",
      "id": "method-updateEntries",
      "meta": {
      }
    }
  ],
  "extends": "Echo.GUI",
  "name": "Echo.GUI.Dropdown",
  "package": [
    "gui.pack.js"
  ],
  "id": "class-Echo.GUI.Dropdown",
  "short_doc": "Class wrapper for bootstrap-dropdown.js. ...",
  "component": false,
  "superclasses": [
    "Echo.GUI"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='docClass'>Echo.GUI</a><div class='subclass '><strong>Echo.GUI.Dropdown</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/echo-dropdown.html#Echo-GUI-Dropdown' target='_blank'>echo-dropdown.js</a></div></pre><div class='doc-contents'><p>Class wrapper for <a href=\"http://twitter.github.com/bootstrap/javascript.html#dropdowns\" target=\"_blank\">bootstrap-dropdown.js</a>.\nThe <a href=\"#!/api/Echo.GUI.Dropdown\" rel=\"Echo.GUI.Dropdown\" class=\"docClass\">Echo.GUI.Dropdown</a> class provides a simplified interface to work with the\nBootstrap Dropdown JS class.\nEcho wrapper assembles the HTML code required for Bootstrap Dropdown JS class\nbased on the parameters specified in the config and initializes\nthe corresponding Bootstrap JS class.</p>\n\n<p>Example:</p>\n\n<pre><code>var dropdown = new <a href=\"#!/api/Echo.GUI.Dropdown\" rel=\"Echo.GUI.Dropdown\" class=\"docClass\">Echo.GUI.Dropdown</a>({\n    \"target\": \".css-selector\",\n    \"title\": \"Dropdown title\",\n    \"extraClass\": \"nav\",\n    \"entries\": [{\n        \"title\": \"entry1\",\n        \"handler\": function() {},\n        \"icon\": \"http://example.com/icon.png\"\n    }, {\n        \"title\": \"entry2\"\n    }]\n});\n\n// Change the dropdown title\ndropdown.setTitle(\"New dropdown title\");\n\n// Update the dropdown entities\ndropdown.updateEntries([{\n    \"title\": \"New entry\",\n    \"handler\": function() {}\n}, {\n    \"title\": \"New entry 2\"\n}]);\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/gui.pack.js'>gui.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-target' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-cfg-target' class='name expandable'>target</a><span> : Mixed</span><span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'>The container where the dropdown should be located. ...</div><div class='long'><p>The container where the dropdown should be located.\nThis parameter can have several types:</p>\n\n<ul>\n<li>CSS selector (ex: \".css-selector\")</li>\n<li>HTMLElement (ex: document.getElementById(\"some-element-id\"))</li>\n<li>jQuery object (ex: $(\".css-selector\"))</li>\n</ul>\n\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-entries' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-cfg-entries' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-cfg-entries' class='name expandable'>entries</a><span> : Array</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Array of the dropdown entries. ...</div><div class='long'><p>Array of the dropdown entries.\nEach entry is the object with the following parameters:</p>\n\n<ul>\n<li>title - entry title</li>\n<li>handler - function which will be called when entry is selected</li>\n<li>icon - URL for the icon. Icon size should be 16x16 pixels.</li>\n<li>entries - Array of nested entries.</li>\n</ul>\n\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='cfg-extraClass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-cfg-extraClass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-cfg-extraClass' class='name expandable'>extraClass</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Custom class name which should be added to the dropdown. ...</div><div class='long'><p>Custom class name which should be added to the dropdown.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-icon' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-cfg-icon' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-cfg-icon' class='name expandable'>icon</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>URL of the 14x14px icon to be displayed near the dropdown title. ...</div><div class='long'><p>URL of the 14x14px icon to be displayed near the dropdown title.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-title' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-cfg-title' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-cfg-title' class='name expandable'>title</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Dropdown title. ...</div><div class='long'><p>Dropdown title.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-property-config' class='name expandable'>config</a><span> : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a></span><span class=\"signature\"></span></div><div class='description'><div class='short'>As soon as the component is created, you can change its config using\nthis property. ...</div><div class='long'><p>As soon as the component is created, you can change its config using\nthis property.\nFor example:</p>\n\n<pre><code>component.config.set(\"some-config-parameter\", \"new-value\");\ncomponent.refresh();\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.GUI.Dropdown-method-constructor' class='name expandable'>Echo.GUI.Dropdown</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.GUI.Dropdown\" rel=\"Echo.GUI.Dropdown\" class=\"docClass\">Echo.GUI.Dropdown</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a new dropdown in the container you have passed in the \"config.target\". ...</div><div class='long'><p>Creates a new dropdown in the container you have passed in the \"config.target\".</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Dropdown parameters.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.GUI.Dropdown\" rel=\"Echo.GUI.Dropdown\" class=\"docClass\">Echo.GUI.Dropdown</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: </p></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the component and removes it's instance. ...</div><div class='long'><p>Hides the component and removes it's instance.</p>\n</div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method re-assembles the component HTML code and\nappends it to the target. ...</div><div class='long'><p>This method re-assembles the component HTML code and\nappends it to the target.</p>\n</div></div></div><div id='method-setTitle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-method-setTitle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-method-setTitle' class='name expandable'>setTitle</a>( <span class='pre'>title</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method allows to change dropdown title. ...</div><div class='long'><p>This method allows to change dropdown title.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>title</span> : String<div class='sub-desc'><p>Dropdown title.</p>\n</div></li></ul></div></div></div><div id='method-updateEntries' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Dropdown'>Echo.GUI.Dropdown</span><br/><a href='source/echo-dropdown.html#Echo-GUI-Dropdown-method-updateEntries' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Dropdown-method-updateEntries' class='name expandable'>updateEntries</a>( <span class='pre'>entries</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method allows to re-assemble dropdown entries. ...</div><div class='long'><p>This method allows to re-assemble dropdown entries.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>entries</span> : Array<div class='sub-desc'><p>Array of the dropdown entries. The structure of this array is the same as in\n<a href=\"#!/api/Echo.GUI.Dropdown-cfg-entries\" rel=\"Echo.GUI.Dropdown-cfg-entries\" class=\"docClass\">entries</a> config parameter.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});