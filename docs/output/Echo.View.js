Ext.data.JsonP.Echo_View({
  "tagname": "class",
  "name": "Echo.View",
  "autodetected": {
  },
  "files": [
    {
      "filename": "view.js",
      "href": "view.html#Echo-View"
    }
  ],
  "package": [
    "environment.pack.js"
  ],
  "members": [
    {
      "name": "constructor",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "fork",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-fork",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "render",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-render",
      "meta": {
      }
    },
    {
      "name": "rendered",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-rendered",
      "meta": {
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.View",
      "id": "method-set",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.View",
  "short_doc": "Class implementing core rendering logic, which is widely used across the system. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/view.html#Echo-View' target='_blank'>view.js</a></div></pre><div class='doc-contents'><p>Class implementing core rendering logic, which is widely used across the system.\nIn addition to the rendering facilities, this class maintains the list of elements within\nthe given view (\"view elements collection\") and provides the interface to access/update them.</p>\n\n<pre><code>var view = new <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a>({\n    \"cssPrefix\": \"some-prefix-\",\n    \"renderers\": {\n        \"header\": function(element) {\n            // will return element as is\n            return element;\n        }\n    },\n    \"template\": '&lt;div class=\"some-prefix-container\"&gt;' +\n        '&lt;div class=\"some-prefix-header\"&gt;{data:header}&lt;/div&gt;' +\n        '&lt;div class=\"some-prefix-content\"&gt;{data:content}&lt;/div&gt;' +\n    '&lt;/div&gt;',\n    \"data\": {\n        \"header\": \"Header text\",\n        \"content\": \"Content text\"\n    }\n});\n\nview.render(); // will render the corresponding template\nview.get(\"content\"); // will return a jquery object with the className \"some-prefix-content\"\nview.get(\"header\").text(); // will return \"Header text\"\nview.set(\"footer\", $('&lt;div class=\"some-prefix-footer\"&gt;'));\n\n// will place the \"footer\" element after \"content\" element in the view\nview.get(\"footer\").insertAfter(view.get(\"content\"));\n\nvar view2 = view.fork({\n    \"renderers\": {\n        \"content\": function(element) {\n            return element.addClass(\"some-external-className\");\n        }\n    }\n});\n\nview2.render();\nview2 === view; // will return false\nview2.get(\"content\").attr(\"class\"); // will return \"some-prefix-content some-external-className\"\nview.get(\"content\").attr(\"class\"); // will return \"some-prefix-content\"\n</code></pre>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.View-method-constructor' class='name expandable'>Echo.View</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Class constructor encapsulating templates rendering and renderers application mechanics. ...</div><div class='long'><p>Class constructor encapsulating templates rendering and renderers application mechanics.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Specifies class configuration parameters.</p>\n<ul><li><span class='pre'>cssPrefix</span> : String (optional)<div class='sub-desc'><p>CSS class name prefix used by the <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> to detect whether a certain element\nshould be added into the view elements collection (if the element CSS class name\nmatches the prefix) and which renderer should be applied in case the element\nsatisfies the CSS prefix match condition.</p>\n</div></li><li><span class='pre'>renderers</span> : Object (optional)<div class='sub-desc'><p>Object which specifies a set of renderers which should be applied during the template\nrendering. The name of the element is used as a key, the renderer function as the value.</p>\n</div></li><li><span class='pre'>renderer</span> : Function (optional)<div class='sub-desc'><p>Function to be applied for each element in the view elements collection.</p>\n\n<p>The \"renderer\" function must return the value of the \"target\" field of the incoming object.</p>\n\n<p>Additional notes:</p>\n\n<ul>\n<li>if this parameter is defined, the \"renderers\" config field value will be ignored</li>\n<li>this function is for advanced use only, for most cases you should use the \"renderers\"\nobject instead</li>\n</ul>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Object which contains renderer specific information.</p>\n<ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Name of the renderer specific for the current element</p>\n</div></li><li><span class='pre'>target</span> : HTMLElement<div class='sub-desc'><p>Reference to jQuery object which represents the current element</p>\n</div></li><li><span class='pre'>extra</span> : Object (optional)<div class='sub-desc'><p>The JS object with the set of extra parameters required to process\nthe current element</p>\n</div></li></ul></div></li></ul></div></li><li><span class='pre'>substitutions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Object with the data to be inserted into the template into the {data:%KEY%} placeholder.\nThe {data:%KEY%} is a default placeholder supported by the <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> even if no\nsubstitution rules were defined in the config via \"substitutions\" field.</p>\n</div></li><li><span class='pre'>template</span> : String (optional)<div class='sub-desc'><p>Template which should be processed using a given substitution rules and\nthe set of renderers.\nNote: in order to prevent elements overriding in the view elements collection,\nmake sure that the template defined in the <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> constructor call contains\nelements with the unique CSS class names (matching the CSS prefix).</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-fork' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-fork' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-fork' class='name expandable'>fork</a>( <span class='pre'>[config]</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Function which instantiates an Echo.View object with the config of the current instance. ...</div><div class='long'><p>Function which instantiates an <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> object with the config of the current instance.\nThis function is helpful when you need to process the template using the rules and\nrenderers specified for the parent <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> class instance.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Configuration overrides object. See <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> class constructor\nto get more information about the config object fields and types.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>New <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> class instance with the configuration params taken from the current instance.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-get' class='name expandable'>get</a>( <span class='pre'>name</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Accessor function to get specific element in this view. ...</div><div class='long'><p>Accessor function to get specific element in this view.</p>\n\n<p>This function returns the corresponding element if it exists in the view.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>The name of the element in the view to be obtained.\nThe name equals to a CSS class name defined for the element minus the CSS prefix\ndefined in the <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> object config. For example, if an element has the\n\"echo-item-container\" CSS class and the \"echo-item-\" CSS prefix was defined\nduring the object constructor call, the element will be available using\nthe \"container\" name. If element has more than one CSS class name matching\nthe CSS prefix - it will be available under multiple names.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-remove' class='name expandable'>remove</a>( <span class='pre'>element</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove a specific element from the view elements collection. ...</div><div class='long'><p>Method to remove a specific element from the view elements collection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : String|Object<div class='sub-desc'><p>The name of the element or the element itself to be removed from the collection.\nSee (link <a href=\"#!/api/Echo.View-method-get\" rel=\"Echo.View-method-get\" class=\"docClass\">get</a>) to get more information about this field format in case of string name.</p>\n</div></li></ul></div></div></div><div id='method-render' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-render' class='name expandable'>render</a>( <span class='pre'>args</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to transform the template into the DOM representation and apply renderers. ...</div><div class='long'><p>Function to transform the template into the DOM representation and apply renderers.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies rendering parameters.</p>\n<ul><li><span class='pre'>renderers</span> : Object (optional)<div class='sub-desc'><p>Object which specifies a set of renderers which should be applied during the template\nrendering. The name of the element is used as a key, the renderer function as the value.</p>\n</div></li><li><span class='pre'>substitutions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during template compilation.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Object with the data to be inserted into the template into the {data:%KEY%} placeholder.\nThe {data:%KEY%} is a default placeholder supported by the <a href=\"#!/api/Echo.View\" rel=\"Echo.View\" class=\"docClass\">Echo.View</a> even if no\nsubstitution rules were defined in the config via \"substitutions\" field.</p>\n</div></li><li><span class='pre'>template</span> : String (optional)<div class='sub-desc'><p>Template which should be processed using a given substitution rules and\nthe set of renderers.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>DOM (jQuery element) representation of the given template using the rules specified.</p>\n</div></li></ul></div></div></div><div id='method-rendered' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-rendered' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-rendered' class='name expandable'>rendered</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Function which indicates whether the view was rendered or not. ...</div><div class='long'><p>Function which indicates whether the view was rendered or not.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.View'>Echo.View</span><br/><a href='source/view.html#Echo-View-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.View-method-set' class='name expandable'>set</a>( <span class='pre'>name, element</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Setter method to add element into the view elements collection. ...</div><div class='long'><p>Setter method to add element into the view elements collection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>The name of the element which should be added into the view elements collection.\nSee (link <a href=\"#!/api/Echo.View-method-get\" rel=\"Echo.View-method-get\" class=\"docClass\">get</a>) to get more information about this field format.</p>\n</div></li><li><span class='pre'>element</span> : Object|String<div class='sub-desc'><p>The corresponding DOM or jQuery element which should be added into collection.\nThe element might also be a HTML markup string which will be transformed into the\njQuery element before assignment.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});