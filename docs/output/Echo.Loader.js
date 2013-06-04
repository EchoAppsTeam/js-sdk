Ext.data.JsonP.Echo_Loader({
  "tagname": "class",
  "files": [
    {
      "filename": "loader.js",
      "href": "loader.html#Echo-Loader"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "config",
      "tagname": "property",
      "owner": "Echo.Loader",
      "id": "property-config",
      "meta": {
        "private": true
      }
    },
    {
      "name": "version",
      "tagname": "property",
      "owner": "Echo.Loader",
      "id": "property-version",
      "meta": {
        "private": true,
        "readonly": true
      }
    },
    {
      "name": "download",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-download",
      "meta": {
        "static": true
      }
    },
    {
      "name": "getURL",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-getURL",
      "meta": {
        "static": true
      }
    },
    {
      "name": "init",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-init",
      "meta": {
        "static": true
      }
    },
    {
      "name": "initApplication",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-initApplication",
      "meta": {
        "static": true
      }
    },
    {
      "name": "initEnvironment",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-initEnvironment",
      "meta": {
        "static": true
      }
    },
    {
      "name": "isDebug",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-isDebug",
      "meta": {
        "static": true
      }
    },
    {
      "name": "override",
      "tagname": "method",
      "owner": "Echo.Loader",
      "id": "static-method-override",
      "meta": {
        "static": true
      }
    }
  ],
  "extends": null,
  "name": "Echo.Loader",
  "package": [
    "loader.js"
  ],
  "id": "class-Echo.Loader",
  "short_doc": "Static class which implements common mechanics for resources loading,\nEcho environment establishing and Canvases init...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/loader.html#Echo-Loader' target='_blank'>loader.js</a></div></pre><div class='doc-contents'><p>Static class which implements common mechanics for resources loading,\nEcho environment establishing and Canvases initialization mechanics.</p>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/loader.js'>loader.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-property-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-property-config' class='name not-expandable'>config</a><span> : Object</span><span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-version' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-property-version' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-property-version' class='name expandable'>version</a><span> : String</span><span class=\"signature\"><span class='private' >private</span><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-download' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-download' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-download' class='name expandable'>download</a>( <span class='pre'>resources, [callback], [config]</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function to load the JavaScript or CSS stylesheet files in async mode. ...</div><div class='long'><p>Function to load the JavaScript or CSS stylesheet files in async mode.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>resources</span> : Array<div class='sub-desc'><p>Array of objects with the properties described below:</p>\n<ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>JavaScript or CSS stylesheet file URL.</p>\n</div></li><li><span class='pre'>loaded</span> : Function<div class='sub-desc'><p>Function used to check whether the script was loaded. This function must return\nthe boolean value which indicates whether the resource was already loaded on the\npage or not. If the resource has already been loaded - no download is performed\nand the callback is called immediately.</p>\n</div></li></ul></div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>Callback function which should be called as soon as all requested files\nwere downloaded.</p>\n</div></li><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Object with configuration parameters</p>\n<ul><li><span class='pre'>errorTimeout</span> : Number<div class='sub-desc'><p>Timeout loading of resources in milliseconds, use as yepnope.errorTimeout</p>\n</div></li></ul></div></li></ul></div></div></div><div id='static-method-getURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-getURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-getURL' class='name expandable'>getURL</a>( <span class='pre'>url, [devVersion]</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function to get normalized URL. ...</div><div class='long'><p>Function to get normalized URL.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>JavaScript or CSS stylesheet file URL.</p>\n</div></li><li><span class='pre'>devVersion</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether function should return dev version of the file or not,\n<em>false</em> value is useful when we want to get URL to image because\nimages don't have dev versions</p>\n<p>Defaults to: <code>true</code></p></div></li></ul></div></div></div><div id='static-method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-init' class='name expandable'>init</a>( <span class='pre'>[config]</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function to initialize canvases on the page. ...</div><div class='long'><p>Function to initialize canvases on the page.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Object which defines the initialization of config parameters</p>\n<ul><li><span class='pre'>canvases</span> : Mixed (optional)<div class='sub-desc'><p>Array of jQuery elements or a single jQuery element, which represents a\ncanvas target. If this param is omitted, Echo Loader will look for the\ncanvases in the DOM structure.</p>\n</div></li><li><span class='pre'>target</span> : Object (optional)<div class='sub-desc'><p>Target element where Echo Loader should look for the canvases if no\ncanvases were passed in the \"config.canvases\" field.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='static-method-initApplication' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-initApplication' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-initApplication' class='name expandable'>initApplication</a>( <span class='pre'>app</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function to initialize application on the page. ...</div><div class='long'><p>Function to initialize application on the page. The function performs the following actions:</p>\n\n<ul>\n<li>initializes Echo JavaScript environment (if it was not initialized yet)</li>\n<li>establishes the Backplane connection (if app.backplane is defined)</li>\n<li>establishes Echo User session on the page (if app.config.appkey is defined)</li>\n<li>downloads the application script</li>\n<li>calls the app JavaScript class constructor which handles further application initialization</li>\n</ul>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>app</span> : Object<div class='sub-desc'><p>Object which defines the base app configuration.</p>\n<ul><li><span class='pre'>component</span> : String<div class='sub-desc'><p>The name of the JavaScript app class which should be initialized.</p>\n</div></li><li><span class='pre'>script</span> : String<div class='sub-desc'><p>Appliction JavaScript class script URL.</p>\n</div></li><li><span class='pre'>scripts</span> : Object (optional)<div class='sub-desc'><p>Object which specifies the location (URL) of the production (minified) and development\n(non-minified) versions of the app JavaScript class code. The \"prod\" and \"dev\" keys\nshould be used in order to specify the production and development URLs respectively.</p>\n</div></li><li><span class='pre'>backplane</span> : Object (optional)<div class='sub-desc'><p>Object which contains the data to be passed into the Backplane.init call.</p>\n</div></li><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Parameters to be passed into the application constructor during its initialization.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='static-method-initEnvironment' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-initEnvironment' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-initEnvironment' class='name expandable'>initEnvironment</a>( <span class='pre'>[callback]</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function to initialize Echo environment on the page by downloading Backplane lib,\njQuery library with the necessary d...</div><div class='long'><p>Function to initialize Echo environment on the page by downloading Backplane lib,\njQuery library with the necessary dependencies and the base Echo classes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>Callback function which should be called as soon as Echo environment is ready.</p>\n</div></li></ul></div></div></div><div id='static-method-isDebug' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-isDebug' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-isDebug' class='name expandable'>isDebug</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Allows to identify if the debug mode is enabled for Echo environment\non the page (i.e whether the logs should be prin...</div><div class='long'><p>Allows to identify if the debug mode is enabled for Echo environment\non the page (i.e whether the logs should be printed in console,\nnon-minified versions of scripts should be used)</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-override' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Loader'>Echo.Loader</span><br/><a href='source/loader.html#Echo-Loader-static-method-override' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Loader-static-method-override' class='name expandable'>override</a>( <span class='pre'>canvasID, appID, config</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function which provides an ability to override config parameters of the\nspecific application within the canvas. ...</div><div class='long'><p>Function which provides an ability to override config parameters of the\nspecific application within the canvas.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>canvasID</span> : String<div class='sub-desc'><p>Canvas ID.</p>\n</div></li><li><span class='pre'>appID</span> : String<div class='sub-desc'><p>Application ID inside the canvas.</p>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Object with the application config overrides.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});