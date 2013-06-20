Ext.data.JsonP.Echo_Plugin_Events({
  "tagname": "class",
  "files": [
    {
      "filename": "plugin.js",
      "href": "plugin.html#Echo-Plugin-Events"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "publish",
      "tagname": "method",
      "owner": "Echo.Plugin.Events",
      "id": "method-publish",
      "meta": {
      }
    },
    {
      "name": "subscribe",
      "tagname": "method",
      "owner": "Echo.Plugin.Events",
      "id": "method-subscribe",
      "meta": {
      }
    },
    {
      "name": "unsubscribe",
      "tagname": "method",
      "owner": "Echo.Plugin.Events",
      "id": "method-unsubscribe",
      "meta": {
      }
    }
  ],
  "extends": null,
  "name": "Echo.Plugin.Events",
  "private": true,
  "package": [
    "environment.pack.js"
  ],
  "id": "class-Echo.Plugin.Events",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/plugin.html#Echo-Plugin-Events' target='_blank'>plugin.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Echo Plugin interlayer for <a href=\"#!/api/Echo.Events\" rel=\"Echo.Events\" class=\"docClass\">Echo.Events</a> utilization</p>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-publish' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Events'>Echo.Plugin.Events</span><br/><a href='source/plugin.html#Echo-Plugin-Events-method-publish' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Events-method-publish' class='name expandable'>publish</a>( <span class='pre'>params</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Function allowing to publish an event providing arbitrary data. ...</div><div class='long'><p>Function allowing to publish an event providing arbitrary data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Some data object.</p>\n\n</div></li><li><span class='pre'>bubble</span> : Boolean (optional)<div class='sub-desc'><p>Indicates whether a given event should be propagated into the parent contexts.</p>\n\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>propagation</span> : Boolean (optional)<div class='sub-desc'><p>Indicates whether a given event should be propagated into the child contexts\nAND executed for the current context.</p>\n\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the event should also be published to the \"global\" context or not.</p>\n\n<p>Defaults to: <code>true</code></p></div></li></ul></div></li></ul></div></div></div><div id='method-subscribe' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Events'>Echo.Plugin.Events</span><br/><a href='source/plugin.html#Echo-Plugin-Events-method-subscribe' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Events-method-subscribe' class='name expandable'>subscribe</a>( <span class='pre'>params</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Function allowing to subscribe to an event with a specific callback function\nand topic. ...</div><div class='long'><p>Function allowing to subscribe to an event with a specific callback function\nand topic.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>once</span> : Boolean (optional)<div class='sub-desc'><p>Specifies that provided handler should be executed exactly once (handler will\nbe unsubscribed right before its execution).</p>\n\n<p>Defaults to: <code>false</code></p></div></li><li><span class='pre'>handler</span> : Function<div class='sub-desc'><p>Callback function which will be called when event is published</p>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name (same as params.topic).</p>\n\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Arbitrary data object passed to the <a href=\"#!/api/Echo.Plugin.Events-method-publish\" rel=\"Echo.Plugin.Events-method-publish\" class=\"docClass\">publish</a> function.</p>\n\n</div></li></ul></div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Unique identifier for the current subscription which can be used for unsubscribing.</p>\n\n</div></li></ul></div></div></div><div id='method-unsubscribe' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Plugin.Events'>Echo.Plugin.Events</span><br/><a href='source/plugin.html#Echo-Plugin-Events-method-unsubscribe' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin.Events-method-unsubscribe' class='name expandable'>unsubscribe</a>( <span class='pre'>params</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Function allowing to unsubscribe from an event. ...</div><div class='long'><p>Function allowing to unsubscribe from an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>handlerId</span> : String<div class='sub-desc'><p>Unique identifier from the <a href=\"#!/api/Echo.Plugin.Events-method-subscribe\" rel=\"Echo.Plugin.Events-method-subscribe\" class=\"docClass\">subscribe</a> function.</p>\n\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Unsubscription status.</p>\n\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
    "private": true
  }
});