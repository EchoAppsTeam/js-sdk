Ext.data.JsonP.Echo_Configuration({
  "tagname": "class",
  "files": [
    {
      "filename": "configuration.js",
      "href": "configuration.html#Echo-Configuration"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "constructor",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-constructor",
      "meta": {
      }
    },
    {
      "name": "extend",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-extend",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "getAsHash",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-getAsHash",
      "meta": {
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.Configuration",
      "id": "method-set",
      "meta": {
      }
    }
  ],
  "extends": null,
  "name": "Echo.Configuration",
  "package": [
    "environment.pack.js"
  ],
  "id": "class-Echo.Configuration",
  "short_doc": "Class implements the interface for convenient work with different\nconfigurations. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/configuration.html#Echo-Configuration' target='_blank'>configuration.js</a></div></pre><div class='doc-contents'><p>Class implements the interface for convenient work with different\nconfigurations. The <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> class is used in various\nplaces of Echo JS SDK components.</p>\n\n<p>Example:</p>\n\n<pre><code>var config = new <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a>({\n    \"key1\": \"value1\",\n    \"key2\": {\n        \"key3\": \"value3\"\n    }\n});\n\nconfig.get(\"key1\"); // returns \"value1\"\nconfig.set(\"key1\", \"new_value1\");\n\nconfig.get(\"key1\"); // returns \"new_value1\"\n\nconfig.get(\"key2.key3\"); // returns \"value3\"\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.Configuration-method-constructor' class='name expandable'>Echo.Configuration</a>( <span class='pre'>master, [slave], [normalizer]</span> ) : <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Class constructor, which accepts user defined and default configuration\nand applies the normalization function to the...</div><div class='long'><p>Class constructor, which accepts user defined and default configuration\nand applies the normalization function to the necessary\n(defined in normalization function) fields.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>master</span> : Object<div class='sub-desc'><p>Specifies the primary source of configuration. Usually the configuration\ndefined in component config.</p>\n</div></li><li><span class='pre'>slave</span> : Object (optional)<div class='sub-desc'><p>The set of default values which will be applied if no corresponding value\nfound in the primary (master) config.</p>\n</div></li><li><span class='pre'>normalizer</span> : Function (optional)<div class='sub-desc'><p>Function which is applied for every field value. You can use this function\nif any additional processing of the config field value is required.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a></span><div class='sub-desc'><p>Reference to the given <a href=\"#!/api/Echo.Configuration\" rel=\"Echo.Configuration\" class=\"docClass\">Echo.Configuration</a> class instance.</p>\n</div></li></ul></div></div></div><div id='method-extend' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-extend' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Configuration-method-extend' class='name expandable'>extend</a>( <span class='pre'>extra</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to extend a given config instance with the additional values. ...</div><div class='long'><p>Method to extend a given config instance with the additional values.</p>\n\n<p>This function provides the ability to extend a given instance of the\nconfig with the extra set of data. The new data overrides the existing\nvalues.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>extra</span> : Object<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Configuration-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults]</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to access specific config field. ...</div><div class='long'><p>Method to access specific config field.</p>\n\n<p>This function returns the corresponding value of the given key or the\ndefault value if specified in the second argument. Method provides the\nability to extract the value located on any level of the config structure,\nin case the config contains JS objects as values for some keys.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the <code>undefined</code> JS statement triggers the default value usage.\nThe <code>false</code>, <code>null</code>, <code>0</code>, <code>[]</code> are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>Corresponding value found in the config.</p>\n</div></li></ul></div></div></div><div id='method-getAsHash' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-getAsHash' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Configuration-method-getAsHash' class='name expandable'>getAsHash</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to export config data into a single JS object. ...</div><div class='long'><p>Method to export config data into a single JS object.</p>\n\n<p>This function returns the JS object which corresponds to the current\nconfiguration object values.This method might be very helpful for debugging\nor transferring configuration between the components.</p>\n</div></div></div><div id='method-remove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Configuration-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove specific config field. ...</div><div class='long'><p>Method to remove specific config field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays), it\nwill be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the configuration.</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Configuration'>Echo.Configuration</span><br/><a href='source/configuration.html#Echo-Configuration-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Configuration-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to define specific config field value. ...</div><div class='long'><p>Method to define specific config field value.</p>\n\n<p>This function allows to define the value for the corresponding field in\nthe config. Method provides the ability to define the value located on\nany level of the config structure, in case the config contains JS objects\nas values for some keys.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});