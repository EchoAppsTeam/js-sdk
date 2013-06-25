Ext.data.JsonP.Echo_GUI_Tabs({
  "tagname": "class",
  "name": "Echo.GUI.Tabs",
  "autodetected": {
  },
  "files": [
    {
      "filename": "echo-tabs.js",
      "href": "echo-tabs.html#Echo-GUI-Tabs"
    }
  ],
  "extends": "Echo.GUI",
  "package": [
    "gui.pack.js"
  ],
  "members": [
    {
      "name": "classPrefix",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-classPrefix",
      "meta": {
      }
    },
    {
      "name": "entries",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-entries",
      "meta": {
      }
    },
    {
      "name": "idPrefix",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-idPrefix",
      "meta": {
      }
    },
    {
      "name": "noRandomId",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-noRandomId",
      "meta": {
      }
    },
    {
      "name": "panels",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-panels",
      "meta": {
      }
    },
    {
      "name": "select",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-select",
      "meta": {
      }
    },
    {
      "name": "show",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-show",
      "meta": {
      }
    },
    {
      "name": "shown",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-shown",
      "meta": {
      }
    },
    {
      "name": "target",
      "tagname": "cfg",
      "owner": "Echo.GUI.Tabs",
      "id": "cfg-target",
      "meta": {
        "required": true
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
      "owner": "Echo.GUI.Tabs",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "add",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-add",
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
      "name": "disable",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-disable",
      "meta": {
      }
    },
    {
      "name": "enable",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-enable",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "getPanels",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-getPanels",
      "meta": {
      }
    },
    {
      "name": "has",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-has",
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
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "show",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-show",
      "meta": {
      }
    },
    {
      "name": "update",
      "tagname": "method",
      "owner": "Echo.GUI.Tabs",
      "id": "method-update",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.GUI.Tabs",
  "short_doc": "Class wrapper for bootstrap-tab.js. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='docClass'>Echo.GUI</a><div class='subclass '><strong>Echo.GUI.Tabs</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/echo-tabs.html#Echo-GUI-Tabs' target='_blank'>echo-tabs.js</a></div></pre><div class='doc-contents'><p>Class wrapper for <a href=\"http://twitter.github.com/bootstrap/javascript.html#tabs\" target=\"_blank\">bootstrap-tab.js</a>.\nThe <a href=\"#!/api/Echo.GUI.Tabs\" rel=\"Echo.GUI.Tabs\" class=\"docClass\">Echo.GUI.Tabs</a> class provides a simplified interface to work with\nthe Bootstrap Tabs JS class.\nEcho wrapper assembles the HTML code required for Bootstrap Tabs JS class\nbased on the parameters specified in the config and initializes\nthe corresponding Bootstrap JS class.</p>\n\n<p>Example:</p>\n\n<pre><code>var myTabs = new <a href=\"#!/api/Echo.GUI.Tabs\" rel=\"Echo.GUI.Tabs\" class=\"docClass\">Echo.GUI.Tabs</a>({\n    \"target\": \".css-selector\",\n    \"entries\": [{\n        \"id\": \"tab1\",\n        \"label\": \"Tab 1\",\n        \"panel\": $(\".panel-css-selector\"),\n        \"extraClass\": \"extra-class\"\n    }, {\n        \"id\": \"tab2\",\n        \"label\": \"Tab 2\",\n        \"panel\": $(\".panel-css-selector2\"),\n    }],\n    \"extraClass\": \"extra-class\",\n    \"select\": function() {},\n    \"show\": function() {},\n    \"shown\": function() {}\n});\n\n// add a new tab\nmyTabs.add({\"id\": \"tab3\", \"label\": \"Tab 3\"});\n\n// remove the second tab\nmyTabs.remove(\"tab2\");\n</code></pre>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/gui.pack.js'>gui.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-target' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-target' class='name expandable'>target</a> : Mixed<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'>The container where the tabs should be located. ...</div><div class='long'><p>The container where the tabs should be located.\nThis parameter can have several types:</p>\n\n<ul>\n<li>CSS selector (ex: \"css-selector\")</li>\n<li>HTMLElement (ex: document.getElementById(\"some-element-id\"))</li>\n<li>jQuery object (ex: $(\".css-selector\"))</li>\n</ul>\n\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-classPrefix' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-classPrefix' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-classPrefix' class='name expandable'>classPrefix</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>String to be added as a prefix to the tab components. ...</div><div class='long'><p>String to be added as a prefix to the tab components.\nElement with tabs will get \"<strong>&lt;classPrefix></strong>header\" class name\nand element with panels will get \"<strong>&lt;classPrefix></strong>panels\" class.</p>\n<p>Defaults to: <code>&quot;echo-tabs-&quot;</code></p></div></div></div><div id='cfg-entries' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-entries' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-entries' class='name expandable'>entries</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Array of entries (tabs). ...</div><div class='long'><p>Array of entries (tabs).</p>\n<p>Defaults to: <code>[]</code></p><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id.</p>\n</div></li><li><span class='pre'>label</span> : String<div class='sub-desc'><p>Tab label.</p>\n</div></li><li><span class='pre'>panel</span> : Mixed (optional)<div class='sub-desc'><p>HTML element which contains tab content.\nIf this parameter is not specified, the container will be created.</p>\n</div></li><li><span class='pre'>disabled</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the tab is disabled.</p>\n</div></li><li><span class='pre'>extraClass</span> : String (optional)<div class='sub-desc'><p>Class name to be added to the tab element.</p>\n</div></li></ul></div></div></div><div id='cfg-idPrefix' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-idPrefix' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-idPrefix' class='name expandable'>idPrefix</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Prefix which helps to make the tab id unique across the page. ...</div><div class='long'><p>Prefix which helps to make the tab id unique across the page.\nEvery <a href=\"#!/api/Echo.GUI.Tabs\" rel=\"Echo.GUI.Tabs\" class=\"docClass\">Echo.GUI.Tabs</a> instance should have its own unique prefix.</p>\n\n<p>Examples: \"my-tabs-section\", \"my-product-tabs\".</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-noRandomId' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-noRandomId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-noRandomId' class='name expandable'>noRandomId</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>By default tab ids have random part to prevent interference of several\ninstances of the same application on the page. ...</div><div class='long'><p>By default tab ids have random part to prevent interference of several\ninstances of the <em>same</em> application on the page. Setting this parameter to <code>true</code> will\nremove random part so it should be used with care.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-panels' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-panels' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-panels' class='name expandable'>panels</a> : HTMLElement<span class=\"signature\"></span></div><div class='description'><div class='short'>Container which contains the panels. ...</div><div class='long'><p>Container which contains the panels.\nIf this parameter is not specified, the container will be created.</p>\n</div></div></div><div id='cfg-select' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-select' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-select' class='name expandable'>select</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Function which will be called when tab is selected. ...</div><div class='long'><p>Function which will be called when tab is selected.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tab</span> : HTMLElement<div class='sub-desc'><p>Container which is the tab itself.</p>\n</div></li><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Id of selected tab.</p>\n</div></li></ul></div></div></div><div id='cfg-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-show' class='name expandable'>show</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to be called before the active tab panel is displayed. ...</div><div class='long'><p>Function to be called before the active tab panel is displayed.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tab</span> : HTMLElement<div class='sub-desc'><p>Container which is the tab itself.</p>\n</div></li><li><span class='pre'>panel</span> : HTMLElement<div class='sub-desc'><p>Container which is a panel related to the tab.</p>\n</div></li><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Id of shown tab.</p>\n</div></li><li><span class='pre'>index</span> : Number<div class='sub-desc'><p>Numerical index of the tab.</p>\n</div></li></ul></div></div></div><div id='cfg-shown' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-cfg-shown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-cfg-shown' class='name expandable'>shown</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to be called as soon as the active tab is displayed. ...</div><div class='long'><p>Function to be called as soon as the active tab is displayed.</p>\n\n<p>The parameters are passed to this function the same as in <a href=\"#!/api/Echo.GUI.Tabs-cfg-show\" rel=\"Echo.GUI.Tabs-cfg-show\" class=\"docClass\">show</a>.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-property-config' class='name expandable'>config</a> : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a><span class=\"signature\"></span></div><div class='description'><div class='short'>As soon as the component is created, you can change its config using\nthis property. ...</div><div class='long'><p>As soon as the component is created, you can change its config using\nthis property.\nFor example:</p>\n\n<pre><code>component.config.set(\"some-config-parameter\", \"new-value\");\ncomponent.refresh();\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.GUI.Tabs-method-constructor' class='name expandable'>Echo.GUI.Tabs</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.GUI.Tabs\" rel=\"Echo.GUI.Tabs\" class=\"docClass\">Echo.GUI.Tabs</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a new tabs in the container you have passed in the \"config.target\". ...</div><div class='long'><p>Creates a new tabs in the container you have passed in the \"config.target\".</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Tabs configuration.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.GUI.Tabs\" rel=\"Echo.GUI.Tabs\" class=\"docClass\">Echo.GUI.Tabs</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/Echo.GUI-method-constructor\" rel=\"Echo.GUI-method-constructor\" class=\"docClass\">Echo.GUI.constructor</a></p></div></div></div><div id='method-add' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-add' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-add' class='name expandable'>add</a>( <span class='pre'>tabConfig</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to add tab. ...</div><div class='long'><p>Method to add tab.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tabConfig</span> : Object<div class='sub-desc'><p>Tab configuration.</p>\n<ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id.</p>\n</div></li><li><span class='pre'>label</span> : String<div class='sub-desc'><p>Tab label which should be displayed.</p>\n</div></li><li><span class='pre'>disabled</span> : Boolean<div class='sub-desc'><p>Specifies whether the tab disabled.</p>\n</div></li><li><span class='pre'>panel</span> : HTMLElement<div class='sub-desc'><p>HTML Element which contains the tab content.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the component and removes it's instance. ...</div><div class='long'><p>Hides the component and removes it's instance.</p>\n</div></div></div><div id='method-disable' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-disable' class='name expandable'>disable</a>( <span class='pre'>id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to disable tab. ...</div><div class='long'><p>Method to disable tab.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id which should be disabled.</p>\n</div></li></ul></div></div></div><div id='method-enable' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-enable' class='name expandable'>enable</a>( <span class='pre'>id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to enable tab. ...</div><div class='long'><p>Method to enable tab.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id which should be enabled.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-get' class='name expandable'>get</a>( <span class='pre'>id</span> ) : HTMLElement<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to get tab DOM element. ...</div><div class='long'><p>Method to get tab DOM element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>DOM element which contains the tab.</p>\n</div></li></ul></div></div></div><div id='method-getPanels' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-getPanels' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-getPanels' class='name expandable'>getPanels</a>( <span class='pre'></span> ) : HTMLElement<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to get a DOM element which contains panels. ...</div><div class='long'><p>Method to get a DOM element which contains panels.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>DOM element which contains panels.</p>\n</div></li></ul></div></div></div><div id='method-has' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-has' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-has' class='name expandable'>has</a>( <span class='pre'>id</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to check whether the tab with specified id already exists. ...</div><div class='long'><p>Method to check whether the tab with specified id already exists.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p><code>true</code> if tab with specific id exists,\n<code>false</code> otherwise.</p>\n</div></li></ul></div></div></div><div id='method-refresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method re-assembles the component HTML code and\nappends it to the target. ...</div><div class='long'><p>This method re-assembles the component HTML code and\nappends it to the target.</p>\n</div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-remove' class='name expandable'>remove</a>( <span class='pre'>id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove tab. ...</div><div class='long'><p>Method to remove tab.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id which should be removed.</p>\n</div></li></ul></div></div></div><div id='method-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-show' class='name expandable'>show</a>( <span class='pre'>id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to show tab with specific id. ...</div><div class='long'><p>Method to show tab with specific id.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id which should be shown.</p>\n</div></li></ul></div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Tabs'>Echo.GUI.Tabs</span><br/><a href='source/echo-tabs.html#Echo-GUI-Tabs-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Tabs-method-update' class='name expandable'>update</a>( <span class='pre'>id, config</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method updates the tab according to the tab config. ...</div><div class='long'><p>This method updates the tab according to the tab config.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Tab id which should be updated.</p>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Tab configuration.</p>\n<ul><li><span class='pre'>label</span> : String<div class='sub-desc'><p>Tab label.</p>\n</div></li><li><span class='pre'>extraClass</span> : String<div class='sub-desc'><p>Class name to be added to the tab element.</p>\n</div></li><li><span class='pre'>content</span> : String<div class='sub-desc'><p>Content of the tab (can contain HTML tags).</p>\n</div></li></ul></div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});