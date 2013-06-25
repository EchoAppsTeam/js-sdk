Ext.data.JsonP.Echo_GUI_Button({
  "tagname": "class",
  "name": "Echo.GUI.Button",
  "autodetected": {
  },
  "files": [
    {
      "filename": "echo-button.js",
      "href": "echo-button.html#Echo-GUI-Button"
    }
  ],
  "extends": "Echo.GUI",
  "package": [
    "gui.pack.js"
  ],
  "members": [
    {
      "name": "disabled",
      "tagname": "cfg",
      "owner": "Echo.GUI.Button",
      "id": "cfg-disabled",
      "meta": {
      }
    },
    {
      "name": "icon",
      "tagname": "cfg",
      "owner": "Echo.GUI.Button",
      "id": "cfg-icon",
      "meta": {
      }
    },
    {
      "name": "label",
      "tagname": "cfg",
      "owner": "Echo.GUI.Button",
      "id": "cfg-label",
      "meta": {
      }
    },
    {
      "name": "target",
      "tagname": "cfg",
      "owner": "Echo.GUI.Button",
      "id": "cfg-target",
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
      "owner": "Echo.GUI.Button",
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
      "name": "setState",
      "tagname": "method",
      "owner": "Echo.GUI.Button",
      "id": "method-setState",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.GUI.Button",
  "short_doc": "Class wrapper for bootstrap-button.js. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='docClass'>Echo.GUI</a><div class='subclass '><strong>Echo.GUI.Button</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/echo-button.html#Echo-GUI-Button' target='_blank'>echo-button.js</a></div></pre><div class='doc-contents'><p>Class wrapper for <a href=\"http://twitter.github.com/bootstrap/javascript.html#buttons\">bootstrap-button.js</a>.\nThe <a href=\"#!/api/Echo.GUI.Dropdown\" rel=\"Echo.GUI.Dropdown\" class=\"docClass\">Echo.GUI.Dropdown</a> class provides a simplified interface to work with the\nBootstrap Button JS class.\nEcho wrapper assembles the HTML code required for Bootstrap Button JS class\nbased on the parameters specified in the config and initializes\nthe corresponding Bootstrap JS class.</p>\n\n<p>Example:</p>\n\n<pre><code>var button = new <a href=\"#!/api/Echo.GUI.Button\" rel=\"Echo.GUI.Button\" class=\"docClass\">Echo.GUI.Button</a>({\n    \"target\": \".css-selector\",\n    \"label\": \"Button label\",\n    \"icon\": \"http://example.com/icon.png\",\n    \"disabled\": true\n});\n\n// Change the button title\nbutton.setState({\"label\": \"New button label\"});\n\n// Destroy the button\nbutton.destroy();\n</code></pre>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/gui.pack.js'>gui.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-disabled' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-cfg-disabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Button-cfg-disabled' class='name expandable'>disabled</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies whether the button should be disabled. ...</div><div class='long'><p>Specifies whether the button should be disabled.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-icon' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-cfg-icon' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Button-cfg-icon' class='name expandable'>icon</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>URL for the icon which should be displayed near the label.</p>\n</div><div class='long'><p>URL for the icon which should be displayed near the label.</p>\n</div></div></div><div id='cfg-label' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-cfg-label' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Button-cfg-label' class='name expandable'>label</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Button label.</p>\n</div><div class='long'><p>Button label.</p>\n</div></div></div><div id='cfg-target' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Button-cfg-target' class='name expandable'>target</a> : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>The container where the button should be located. ...</div><div class='long'><p>The container where the button should be located.\nThis parameter can have several types:</p>\n\n<ul>\n<li>CSS selector (ex: \".css-selector\")</li>\n<li>HTMLElement (ex: document.getElementById(\"some-element-id\"))</li>\n<li>jQuery object (ex: $(\".css-selector\"))</li>\n</ul>\n\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-property-config' class='name expandable'>config</a> : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a><span class=\"signature\"></span></div><div class='description'><div class='short'>As soon as the component is created, you can change its config using\nthis property. ...</div><div class='long'><p>As soon as the component is created, you can change its config using\nthis property.\nFor example:</p>\n\n<pre><code>component.config.set(\"some-config-parameter\", \"new-value\");\ncomponent.refresh();\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.GUI.Button-method-constructor' class='name expandable'>Echo.GUI.Button</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.GUI.Button\" rel=\"Echo.GUI.Button\" class=\"docClass\">Echo.GUI.Button</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a button inside the container defined in the “target\" config parameter. ...</div><div class='long'><p>Creates a button inside the container defined in the “target\" config parameter.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Button configuration data.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.GUI.Button\" rel=\"Echo.GUI.Button\" class=\"docClass\">Echo.GUI.Button</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/Echo.GUI-method-constructor\" rel=\"Echo.GUI-method-constructor\" class=\"docClass\">Echo.GUI.constructor</a></p></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the component and removes it's instance. ...</div><div class='long'><p>Hides the component and removes it's instance.</p>\n</div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method re-assembles the component HTML code and\nappends it to the target. ...</div><div class='long'><p>This method re-assembles the component HTML code and\nappends it to the target.</p>\n</div></div></div><div id='method-setState' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Button'>Echo.GUI.Button</span><br/><a href='source/echo-button.html#Echo-GUI-Button-method-setState' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Button-method-setState' class='name expandable'>setState</a>( <span class='pre'>config</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Allows to repaint the button using arbitrary values for configuration\nparameters from constructor ...</div><div class='long'><p>Allows to repaint the button using arbitrary values for configuration\nparameters from <a href=\"#!/api/Echo.GUI.Button-method-constructor\" rel=\"Echo.GUI.Button-method-constructor\" class=\"docClass\">constructor</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});