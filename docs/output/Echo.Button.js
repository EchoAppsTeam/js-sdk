Ext.data.JsonP.Echo_Button({
  "tagname": "class",
  "name": "Echo.Button",
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
  "id": "class-Echo.Button",
  "members": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.Button",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "render",
        "tagname": "method",
        "owner": "Echo.Button",
        "meta": {
        },
        "id": "method-render"
      },
      {
        "name": "update",
        "tagname": "method",
        "owner": "Echo.Button",
        "meta": {
        },
        "id": "method-update"
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
  "linenr": 1,
  "files": [
    {
      "filename": "button.js",
      "href": "button.html#Echo-Button"
    }
  ],
  "html_meta": {
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/button.html#Echo-Button' target='_blank'>button.js</a></div></pre><div class='doc-contents'><p>Class implements form element button.</p>\n\n<p>This class enhances standard form element button by adding the ability to define and update button properties like label, disabled and icon.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Button'>Echo.Button</span><br/><a href='source/button.html#Echo-Button-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.Button-method-constructor' class='name expandable'>Echo.Button</a>( <span class='pre'>HTMLElement element, Object params</span> ) : Object</div><div class='description'><div class='short'>Constructor of class encapsulating form element button. ...</div><div class='long'><p>Constructor of class encapsulating form element button.</p>\n\n<pre><code>var element = $(\"&lt;button&gt;&lt;/button&gt;\");\n\nnew <a href=\"#!/api/Echo.Button\" rel=\"Echo.Button\" class=\"docClass\">Echo.Button</a>(element, {\n    \"label\": \"MyButton\",\n    \"disabled\": false\n}); // will add simple button with label 'MyButton' and without icon\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : HTMLElement<div class='sub-desc'><p>HTML element which is container for the button.</p>\n</div></li><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Object representing button properties.</p>\n<ul><li><span class='pre'>label</span> : String<div class='sub-desc'><p>String representing text to show on the button.</p>\n</div></li><li><span class='pre'>icon</span> : String<div class='sub-desc'><p>String representing CSS class which containes background icon of the button.</p>\n</div></li><li><span class='pre'>disabled</span> : Boolean<div class='sub-desc'><p>Disables(true) or enables(false) the button.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-render' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Button'>Echo.Button</span><br/><a href='source/button.html#Echo-Button-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Button-method-render' class='name expandable'>render</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Method used to render the button. ...</div><div class='long'><p>Method used to render the button.</p>\n\n<pre><code>var element = $(\"&lt;button&gt;&lt;/button&gt;\");\n\nvar button = new <a href=\"#!/api/Echo.Button\" rel=\"Echo.Button\" class=\"docClass\">Echo.Button</a>(element, {\n    \"label\": \"MyButton\",\n    \"icon\": false,\n    \"disabled\": false\n});\n\nbutton.label = \"NewButton\";\nbutton.render(); // button's label will be changed from \"MyButton\" to \"NewButton\"\n</code></pre>\n</div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Button'>Echo.Button</span><br/><a href='source/button.html#Echo-Button-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Button-method-update' class='name expandable'>update</a>( <span class='pre'>Object params</span> )</div><div class='description'><div class='short'>Method updates button properties and rerenders the button. ...</div><div class='long'><p>Method updates button properties and rerenders the button.</p>\n\n<pre><code>// style tag in the head of HTML document\n// &lt;style&gt;\n//     .ui-button-icon { background-image: url(http://example.com/image.jpg); }\n// &lt;/style&gt;\n\nvar element = $(\"&lt;button&gt;&lt;/button&gt;\");\n\nvar button = new <a href=\"#!/api/Echo.Button\" rel=\"Echo.Button\" class=\"docClass\">Echo.Button</a>(element, {\n    \"label\": \"MyButton\"\n});\n\nbutton.update({\n    \"icon\": \"ui-button-icon\",\n    \"disabled\": true\n}); // will disables the button and set \"http://example.com/image.jpg\" as a background icon of the button\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Object representing button properties.</p>\n<ul><li><span class='pre'>label</span> : String<div class='sub-desc'><p>String representing text to show on the button.</p>\n</div></li><li><span class='pre'>icon</span> : String<div class='sub-desc'><p>String representing CSS class which containes background icon of the button.</p>\n</div></li><li><span class='pre'>disabled</span> : Boolean<div class='sub-desc'><p>Disables(true) or enables(false) the button.</p>\n</div></li></ul></div></li></ul></div></div></div></div></div></div></div>"
});