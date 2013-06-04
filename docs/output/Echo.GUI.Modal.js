Ext.data.JsonP.Echo_GUI_Modal({
  "tagname": "class",
  "files": [
    {
      "filename": "echo-modal.js",
      "href": "echo-modal.html#Echo-GUI-Modal"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "backdrop",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-backdrop",
      "meta": {
      }
    },
    {
      "name": "closeButton",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-closeButton",
      "meta": {
      }
    },
    {
      "name": "data",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-data",
      "meta": {
      }
    },
    {
      "name": "extraClass",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-extraClass",
      "meta": {
      }
    },
    {
      "name": "fade",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-fade",
      "meta": {
      }
    },
    {
      "name": "footer",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-footer",
      "meta": {
      }
    },
    {
      "name": "header",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-header",
      "meta": {
      }
    },
    {
      "name": "height",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-height",
      "meta": {
      }
    },
    {
      "name": "href",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-href",
      "meta": {
      }
    },
    {
      "name": "keyboard",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-keyboard",
      "meta": {
      }
    },
    {
      "name": "onHide",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-onHide",
      "meta": {
      }
    },
    {
      "name": "onShow",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-onShow",
      "meta": {
      }
    },
    {
      "name": "padding",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-padding",
      "meta": {
      }
    },
    {
      "name": "remote",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-remote",
      "meta": {
      }
    },
    {
      "name": "show",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-show",
      "meta": {
      }
    },
    {
      "name": "width",
      "tagname": "cfg",
      "owner": "Echo.GUI.Modal",
      "id": "cfg-width",
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
      "owner": "Echo.GUI.Modal",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "destroy",
      "tagname": "method",
      "owner": "Echo.GUI.Modal",
      "id": "method-destroy",
      "meta": {
      }
    },
    {
      "name": "hide",
      "tagname": "method",
      "owner": "Echo.GUI.Modal",
      "id": "method-hide",
      "meta": {
      }
    },
    {
      "name": "refresh",
      "tagname": "method",
      "owner": "Echo.GUI.Modal",
      "id": "method-refresh",
      "meta": {
      }
    },
    {
      "name": "show",
      "tagname": "method",
      "owner": "Echo.GUI.Modal",
      "id": "method-show",
      "meta": {
      }
    }
  ],
  "extends": "Echo.GUI",
  "name": "Echo.GUI.Modal",
  "package": [
    "gui.pack.js"
  ],
  "id": "class-Echo.GUI.Modal",
  "short_doc": "Class wrapper for bootstrap-modal.js. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='docClass'>Echo.GUI</a><div class='subclass '><strong>Echo.GUI.Modal</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/echo-modal.html#Echo-GUI-Modal' target='_blank'>echo-modal.js</a></div></pre><div class='doc-contents'><p>Class wrapper for <a href=\"http://twitter.github.com/bootstrap/javascript.html#modals\" target=\"_blank\">bootstrap-modal.js</a>.\nThe <a href=\"#!/api/Echo.GUI.Modal\" rel=\"Echo.GUI.Modal\" class=\"docClass\">Echo.GUI.Modal</a> class provides a simplified interface to work with the\nBootstrap Modal JS class.\nEcho wrapper assembles the HTML code required for Bootstrap Modal JS class\nbased on the parameters specified in the config and initializes\nthe corresponding Bootstrap JS class.</p>\n\n<p>Example:</p>\n\n<pre><code>var myModal = new <a href=\"#!/api/Echo.GUI.Modal\" rel=\"Echo.GUI.Modal\" class=\"docClass\">Echo.GUI.Modal</a>({\n    \"show\": true,\n    \"backdrop\": true,\n     \"keyboard\": true,\n     \"closeButton\": true,\n     \"remote\": false,\n     \"extraClass\": \"\",\n     \"data\": {\n         \"title\": \"Modal title\",\n         \"body\": \"&lt;b&gt;Modal body&lt;/b&gt;\",\n         \"buttons\": [{\n             \"title\": \"Button1\",\n             \"extraClass\": \"echo-button1-class\",\n             \"handler\": function() {}\n         }, {\n             \"title\": \"Button2\",\n             \"extraClass\": \"echo-button2-class\",\n             \"handler\": function() {}\n         }]\n     },\n     \"width\": \"400\",\n     \"height\": \"500\",\n     \"padding\": \"10\",\n     \"footer\": true,\n     \"header\": true,\n     \"fade\": true\n});\n\nmyModal.hide(); // hides the Bootstrap Modal instance\nmyModal.config.set(\"data.title\", \"New modal title\"); // change title of the Bootstrap Modal instance\nmyModal.config.set(\"closeButton\", false); // do not show the close button\nmyModal.refresh(); // refresh the Bootstrap Modal instance with changed config parameters and show one\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/gui.pack.js'>gui.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-backdrop' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-backdrop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-backdrop' class='name expandable'>backdrop</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Defines whether the semi-transparent backdrop underneath the modal dialog box should be displayed. ...</div><div class='long'><p>Defines whether the semi-transparent backdrop underneath the modal dialog box should be displayed.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-closeButton' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-closeButton' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-closeButton' class='name expandable'>closeButton</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Defines whether the close (\"X\") icon in the top right corner of the dialog box should be shown. ...</div><div class='long'><p>Defines whether the close (\"X\") icon in the top right corner of the dialog box should be shown.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-data' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-data' class='name expandable'>data</a><span> : Object</span><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<ul><li><span class='pre'>title</span> : String|Function<div class='sub-desc'><p>Modal dialog title (can contain HTML tags).\nIf function passed in this parameter, the function result will be used.</p>\n</div></li><li><span class='pre'>body</span> : String|Function<div class='sub-desc'><p>The main content of the dialog (can contain HTML tags).\nIf function passed in this parameter, the function result will be used.</p>\n</div></li><li><span class='pre'>buttons</span> : Array<div class='sub-desc'><p>You can specify the custom buttons in this parameter which should be displayed in the modal footer.\nEach array element is the object with the following parameters:</p>\n\n<ul>\n<li>title - button title.</li>\n<li>extraClass - custom class name which will be added to the button.</li>\n<li>handler - function which will be called when button is clicked.</li>\n</ul>\n\n</div></li></ul></div></div></div><div id='cfg-extraClass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-extraClass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-extraClass' class='name expandable'>extraClass</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Custom class name which should be added to the modal dialog container. ...</div><div class='long'><p>Custom class name which should be added to the modal dialog container.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-fade' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-fade' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-fade' class='name expandable'>fade</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Apply a CSS fade transition. ...</div><div class='long'><p>Apply a CSS fade transition.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-footer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-footer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-footer' class='name expandable'>footer</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Display modal dialog footer. ...</div><div class='long'><p>Display modal dialog footer.\nShould be true if you want to display custom buttons.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-header' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-header' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-header' class='name expandable'>header</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Display modal header. ...</div><div class='long'><p>Display modal header.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-height' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-height' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-height' class='name expandable'>height</a><span> : Number</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Modal dialog height. ...</div><div class='long'><p>Modal dialog height.</p>\n<p>Defaults to: <code>null</code></p></div></div></div><div id='cfg-href' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-href' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-href' class='name not-expandable'>href</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>URL of the standalone page to be displayed inside the modal (loaded via &lt;iframe>).</p>\n</div><div class='long'><p>URL of the standalone page to be displayed inside the modal (loaded via &lt;iframe>).</p>\n</div></div></div><div id='cfg-keyboard' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-keyboard' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-keyboard' class='name expandable'>keyboard</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Defines whether modal dialog should be closed if the \"Esc\"(escape) key is pressed on the keyboard. ...</div><div class='long'><p>Defines whether modal dialog should be closed if the \"Esc\"(escape) key is pressed on the keyboard.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-onHide' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-onHide' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-onHide' class='name not-expandable'>onHide</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback function to be executed when the modal is closed.</p>\n</div><div class='long'><p>Callback function to be executed when the modal is closed.</p>\n</div></div></div><div id='cfg-onShow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-onShow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-onShow' class='name not-expandable'>onShow</a><span> : Function</span><span class=\"signature\"></span></div><div class='description'><div class='short'><p>Callback function to be executed when the modal is opened.</p>\n</div><div class='long'><p>Callback function to be executed when the modal is opened.</p>\n</div></div></div><div id='cfg-padding' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-padding' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-padding' class='name expandable'>padding</a><span> : Number</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Modal dialog padding. ...</div><div class='long'><p>Modal dialog padding.</p>\n<p>Defaults to: <code>null</code></p></div></div></div><div id='cfg-remote' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-remote' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-remote' class='name expandable'>remote</a><span> : String</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Remote URL. ...</div><div class='long'><p>Remote URL.\nIf a remote URL is provided, content will be loaded via jQuery load method and injected into the modal dialog body.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-show' class='name expandable'>show</a><span> : Boolean</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Defines whether the modal dialog should be displayed right after it is created. ...</div><div class='long'><p>Defines whether the modal dialog should be displayed right after it is created.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-width' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-cfg-width' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-cfg-width' class='name expandable'>width</a><span> : Number</span><span class=\"signature\"></span></div><div class='description'><div class='short'>Modal dialog width. ...</div><div class='long'><p>Modal dialog width.</p>\n<p>Defaults to: <code>null</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.GUI' rel='Echo.GUI' class='defined-in docClass'>Echo.GUI</a><br/><a href='source/gui.html#Echo-GUI-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI-property-config' class='name expandable'>config</a><span> : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a></span><span class=\"signature\"></span></div><div class='description'><div class='short'>As soon as the component is created, you can change its config using\nthis property. ...</div><div class='long'><p>As soon as the component is created, you can change its config using\nthis property.\nFor example:</p>\n\n<pre><code>component.config.set(\"some-config-parameter\", \"new-value\");\ncomponent.refresh();\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.GUI.Modal-method-constructor' class='name expandable'>Echo.GUI.Modal</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.GUI.Modal\" rel=\"Echo.GUI.Modal\" class=\"docClass\">Echo.GUI.Modal</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a new modal dialog. ...</div><div class='long'><p>Creates a new modal dialog. The dialog can be created in visible or hidden (default) modes.\nIn order to initialize the modal dialog instance in visible state, the \"show\" parameter should\nbe defined as 'true' (JS boolean) during the constructor call.\nFor the modal dialogs hidden by default the \"show\" function can be applied to reveal it when appropriate.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Modal configuration.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.GUI.Modal\" rel=\"Echo.GUI.Modal\" class=\"docClass\">Echo.GUI.Modal</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: </p></div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the modal dialog and removes the dialog instance. ...</div><div class='long'><p>Hides the modal dialog and removes the dialog instance.</p>\n<p>Overrides: </p></div></div></div><div id='method-hide' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-method-hide' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-method-hide' class='name expandable'>hide</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the modal dialog. ...</div><div class='long'><p>Hides the modal dialog.</p>\n</div></div></div><div id='method-refresh' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method assemble a bootstrap dialog according to configuration\nparameters and data. ...</div><div class='long'><p>This method assemble a bootstrap dialog according to configuration\nparameters and data.</p>\n<p>Overrides: </p></div></div></div><div id='method-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.GUI.Modal'>Echo.GUI.Modal</span><br/><a href='source/echo-modal.html#Echo-GUI-Modal-method-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.GUI.Modal-method-show' class='name expandable'>show</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Shows the modal dialog. ...</div><div class='long'><p>Shows the modal dialog.</p>\n</div></div></div></div></div></div></div>",
  "meta": {
  }
});