Ext.data.JsonP.Echo_Labels({
  "tagname": "class",
  "name": "Echo.Labels",
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
  "id": "class-Echo.Labels",
  "members": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.Labels",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.Labels",
        "meta": {
        },
        "id": "method-get"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.Labels",
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
  "statics": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.Labels",
        "meta": {
          "static": true
        },
        "id": "static-method-get"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.Labels",
        "meta": {
          "static": true
        },
        "id": "static-method-set"
      }
    ],
    "event": [

    ],
    "css_var": [

    ],
    "css_mixin": [

    ]
  },
  "linenr": 8,
  "files": [
    {
      "filename": "labels.js",
      "href": "labels.html#Echo-Labels"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/labels.html#Echo-Labels' target='_blank'>labels.js</a></div></pre><div class='doc-contents'><p>Class implements the language variables mechanics across the components.</p>\n\n<p>It should be instantiated to override language variables within\nthe scope of a particular component instance.\nLanguage variables overriden with the instance of this class\nwill have the highest priority.\nStatic methods should be used for general language variable\ndefinition and localization purposes.</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance Methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Labels'>Echo.Labels</span><br/><a href='source/labels.html#Echo-Labels-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.Labels-method-constructor' class='name expandable'>Echo.Labels</a>( <span class='pre'>Object labels, String namespace</span> ) : Object</div><div class='description'><div class='short'>Constructor of class encapsulating language variable mechanics. ...</div><div class='long'><p>Constructor of class encapsulating language variable mechanics.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.Labels\" rel=\"Echo.Labels\" class=\"docClass\">Echo.Labels</a>({\n    \"live\": \"Live\",\n    \"paused\": \"Paused\"\n}, \"Stream\");\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>labels</span> : Object<div class='sub-desc'><p>Flat object containing the list of language variables to be initialized.</p>\n</div></li><li><span class='pre'>namespace</span> : String<div class='sub-desc'><p>Component namespace.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The reference to the given <a href=\"#!/api/Echo.Labels\" rel=\"Echo.Labels\" class=\"docClass\">Echo.Labels</a> class instance.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Labels'>Echo.Labels</span><br/><a href='source/labels.html#Echo-Labels-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Labels-method-get' class='name expandable'>get</a>( <span class='pre'>String name, Object data</span> ) : String</div><div class='description'><div class='short'>Method to access specific language variable within the scope of a particular component instance. ...</div><div class='long'><p>Method to access specific language variable within the scope of a particular component instance.</p>\n\n<p>Function will return the language variable value corresponding to this instance.\nIf current instance doesn't contain this particular language variable\nit will fall back to the global language variable list.</p>\n\n<pre><code>var labels = new <a href=\"#!/api/Echo.Labels\" rel=\"Echo.Labels\" class=\"docClass\">Echo.Labels</a>({\n    \"live\": \"Live\",\n    \"paused\": \"Paused\"\n}, \"Stream\");\n\nlabels.get(\"live\"); // will return \"Live\"\nlabels.get(\"paused\"); // will return \"Paused\"\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Language variable name.</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Flat object data that should be inserted instead of a placeholder in the language variable.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Value of the language variable.</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Labels'>Echo.Labels</span><br/><a href='source/labels.html#Echo-Labels-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Labels-method-set' class='name expandable'>set</a>( <span class='pre'>Object labels</span> )</div><div class='description'><div class='short'>Method to add/override the language variable list within the scope\nof a particular component instance. ...</div><div class='long'><p>Method to add/override the language variable list within the scope\nof a particular component instance.</p>\n\n<p>Function should be used to customize the text part of the UI within\nthe particular component instance.For global text definitions and\nlocalization purposes the static method should be used.</p>\n\n<pre><code>var labels = new <a href=\"#!/api/Echo.Labels\" rel=\"Echo.Labels\" class=\"docClass\">Echo.Labels</a>({\n    \"live\": \"Live\",\n    \"paused\": \"Paused\"\n}, \"Stream\");\n\nlabels.get(\"live\"); // will return \"Live\"\nlabels.get(\"paused\"); // will return \"Paused\"\n\nlabels.set({\n    \"live\": \"Live...\",\n    \"paused\": \"Paused...\"\n});\n\nlabels.get(\"live\"); // will return \"Live...\"\nlabels.get(\"paused\"); // will return \"Paused...\"\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>labels</span> : Object<div class='sub-desc'><p>Flat object containing the list of language variables to be added/overriden.</p>\n</div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static Methods</h3><div id='static-method-get' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Labels'>Echo.Labels</span><br/><a href='source/labels.html#Echo-Labels-static-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Labels-static-method-get' class='name expandable'>get</a>( <span class='pre'>String name, String namespace, Object data</span> ) : String<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function returning the language variable value by its name from the global\nlanguage variable list. ...</div><div class='long'><p>Function returning the language variable value by its name from the global\nlanguage variable list.</p>\n\n<p>Function will return the language variable value from the global language\nvariable list. It also takes into consideration the localized values.\nIf value of the particular language variable is not found in the localization\nlist it will fall back to the default language variable value.</p>\n\n<pre><code><a href=\"#!/api/Echo.Labels-method-set\" rel=\"Echo.Labels-method-set\" class=\"docClass\">Echo.Labels.set</a>({\n    \"live\": \"Live\",\n    \"paused\": \"Paused\"\n}, \"Stream\");\n\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"live\", \"Stream\"); // will return \"Live\"\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"Stream.paused\"); // will return \"Paused\"\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Language variable name.</p>\n</div></li><li><span class='pre'>namespace</span> : String<div class='sub-desc'><p>String representing the namespace.</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Flat object data that should be inserted instead of a placeholder in the language variable.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Value of the language variable.</p>\n</div></li></ul></div></div></div><div id='static-method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Labels'>Echo.Labels</span><br/><a href='source/labels.html#Echo-Labels-static-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Labels-static-method-set' class='name expandable'>set</a>( <span class='pre'>Object labels, String namespace, Boolean isDefault</span> )<strong class='static signature' >static</strong></div><div class='description'><div class='short'>Function to add/override the language variable list in the global scope. ...</div><div class='long'><p>Function to add/override the language variable list in the global scope.</p>\n\n<p>Function should be used to define the default language variable list.\nIn this use case the <code>isDefault</code> param should be set to <code>true</code>.\nFunction should also be used for localization purposes.\nIn this case the <code>isDefault</code> param can be omitted or set to <code>false</code>.\nThe values overriden with the function will be available globally.</p>\n\n<pre><code><a href=\"#!/api/Echo.Labels-method-set\" rel=\"Echo.Labels-method-set\" class=\"docClass\">Echo.Labels.set</a>({\n    \"live\": \"Live\",\n    \"paused\": \"Paused\"\n}, \"Stream\"); // setting custom labels\n\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"live\", \"Stream\"); // will return \"Live\"\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"paused\", \"Stream\"); // will return \"Paused\"\n\n<a href=\"#!/api/Echo.Labels-method-set\" rel=\"Echo.Labels-method-set\" class=\"docClass\">Echo.Labels.set</a>({\n    \"live\": \"Live...\",\n    \"paused\": \"Paused...\"\n}, \"Stream\", true); // setting default labels\n\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"live\", \"Stream\"); // will return \"Live\" (custom label is not overridden by default)\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"paused\", \"Stream\"); // will return \"Paused\" (custom label is not overridden by default)\n\n<a href=\"#!/api/Echo.Labels-method-set\" rel=\"Echo.Labels-method-set\" class=\"docClass\">Echo.Labels.set</a>({\n    \"live\": \"Live label\",\n    \"paused\": \"Paused label\"\n}, \"Stream\"); // overriding custom labels\n\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"live\", \"Stream\"); // will return \"Live label\"\n<a href=\"#!/api/Echo.Labels-method-get\" rel=\"Echo.Labels-method-get\" class=\"docClass\">Echo.Labels.get</a>(\"paused\", \"Stream\"); // will return \"Paused label\"\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>labels</span> : Object<div class='sub-desc'><p>Object containing the list of language variables.</p>\n</div></li><li><span class='pre'>namespace</span> : String<div class='sub-desc'><p>Namespace.</p>\n</div></li><li><span class='pre'>isDefault</span> : Boolean<div class='sub-desc'><p>Flag switching the localization mode to setting defaults one.</p>\n</div></li></ul></div></div></div></div></div></div></div>"
});