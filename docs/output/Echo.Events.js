Ext.data.JsonP.Echo_Events({
  "tagname": "class",
  "files": [
    {
      "filename": "events.js",
      "href": "events.html#Echo-Events"
    }
  ],
  "aliases": {
  },
  "alternateClassNames": [

  ],
  "members": [
    {
      "name": "newContextId",
      "tagname": "method",
      "owner": "Echo.Events",
      "id": "static-method-newContextId",
      "meta": {
        "static": true
      }
    },
    {
      "name": "publish",
      "tagname": "method",
      "owner": "Echo.Events",
      "id": "static-method-publish",
      "meta": {
        "static": true
      }
    },
    {
      "name": "subscribe",
      "tagname": "method",
      "owner": "Echo.Events",
      "id": "static-method-subscribe",
      "meta": {
        "static": true
      }
    },
    {
      "name": "unsubscribe",
      "tagname": "method",
      "owner": "Echo.Events",
      "id": "static-method-unsubscribe",
      "meta": {
        "static": true
      }
    }
  ],
  "extends": null,
  "name": "Echo.Events",
  "package": [
    "environment.pack.js"
  ],
  "id": "class-Echo.Events",
  "short_doc": "Library for exchanging messages between the components on the page. ...",
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/events.html#Echo-Events' target='_blank'>events.js</a></div></pre><div class='doc-contents'><p>Library for exchanging messages between the components on the page. It also\nprovides the external interface for users to subscribe to certain events\n(like \"app was rendered\", \"user logged in\", etc).</p>\n\n<p>The contexts used in this library are complex identifiers constructed using the following rules:</p>\n\n<pre><code>&lt;contextId&gt; :: \"&lt;id&gt;\" or \"&lt;parentContextID&gt;/&lt;id&gt;\", where\n&lt;id&gt; :: some unique identifier assigned to component\n&lt;parentContextID&gt; :: \"&lt;contextID&gt;\"\n</code></pre>\n\n<p>Example:</p>\n\n<pre><code>// Subscribe to the event.\n<a href=\"#!/api/Echo.Events-static-method-subscribe\" rel=\"Echo.Events-static-method-subscribe\" class=\"docClass\">Echo.Events.subscribe</a>({\n    \"topic\": \"<a href=\"#!/api/Echo.UserSession-echo_event-onInvalidate\" rel=\"Echo.UserSession-echo_event-onInvalidate\" class=\"docClass\">Echo.UserSession.onInvalidate</a>\",\n    \"context\": \"global\",\n    \"handler\": control.refresh\n});\n\n// And then publish event:\n<a href=\"#!/api/Echo.Events-static-method-publish\" rel=\"Echo.Events-static-method-publish\" class=\"docClass\">Echo.Events.publish</a>({\n    \"topic\": \"<a href=\"#!/api/Echo.UserSession-echo_event-onInvalidate\" rel=\"Echo.UserSession-echo_event-onInvalidate\" class=\"docClass\">Echo.UserSession.onInvalidate</a>\",\n    \"data\": user.is(\"logged\") ? user.data : {}\n});\n</code></pre>\n\t\t\t<p>\n\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/environment.pack.js'>environment.pack.js</a> package(s).\n\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-newContextId' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Events'>Echo.Events</span><br/><a href='source/events.html#Echo-Events-static-method-newContextId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Events-static-method-newContextId' class='name expandable'>newContextId</a>( <span class='pre'>[parentContextId]</span> ) : String<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Generates a string which represents new unique context ID to be used for subscriptions. ...</div><div class='long'><p>Generates a string which represents new unique context ID to be used for subscriptions.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>parentContextId</span> : String (optional)<div class='sub-desc'><p>Optional parameter which specifies the parent object context ID.\nIf this parameter is defined, the nested context ID is generated.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Unique context identifier.</p>\n</div></li></ul></div></div></div><div id='static-method-publish' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Events'>Echo.Events</span><br/><a href='source/events.html#Echo-Events-static-method-publish' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Events-static-method-publish' class='name expandable'>publish</a>( <span class='pre'>params</span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function allowing to publish an event providing arbitrary data. ...</div><div class='long'><p>Function allowing to publish an event providing arbitrary data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Some data object.</p>\n\n</div></li><li><span class='pre'>bubble</span> : Boolean (optional)<div class='sub-desc'><p>Indicates whether a given event should be propagated into the parent contexts.</p>\n\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>propagation</span> : Boolean (optional)<div class='sub-desc'><p>Indicates whether a given event should be propagated into the child contexts\nAND executed for the current context.</p>\n\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the event should also be published to the \"global\" context or not.</p>\n\n<p>Defaults to: <code>true</code></p></div></li></ul></div></li></ul></div></div></div><div id='static-method-subscribe' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Events'>Echo.Events</span><br/><a href='source/events.html#Echo-Events-static-method-subscribe' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Events-static-method-subscribe' class='name expandable'>subscribe</a>( <span class='pre'>params</span> ) : String<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function allowing to subscribe to an event with a specific callback function\nand topic. ...</div><div class='long'><p>Function allowing to subscribe to an event with a specific callback function\nand topic.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>once</span> : Boolean (optional)<div class='sub-desc'><p>Specifies that provided handler should be executed exactly once (handler will\nbe unsubscribed right before its execution).</p>\n\n<p>Defaults to: <code>false</code></p></div></li><li><span class='pre'>handler</span> : Function<div class='sub-desc'><p>Callback function which will be called when event is published</p>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name (same as params.topic).</p>\n\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Arbitrary data object passed to the <a href=\"#!/api/Echo.Plugin.Events-method-publish\" rel=\"Echo.Plugin.Events-method-publish\" class=\"docClass\">publish</a> function.</p>\n\n</div></li></ul></div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Unique identifier for the current subscription which can be used for unsubscribing.</p>\n\n</div></li></ul></div></div></div><div id='static-method-unsubscribe' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.Events'>Echo.Events</span><br/><a href='source/events.html#Echo-Events-static-method-unsubscribe' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Events-static-method-unsubscribe' class='name expandable'>unsubscribe</a>( <span class='pre'>params</span> ) : Boolean<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Function allowing to unsubscribe from an event. ...</div><div class='long'><p>Function allowing to unsubscribe from an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>params</span> : Object<div class='sub-desc'><p>Configuration parameters object with the following fields:</p>\n\n<ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Event name.</p>\n\n</div></li><li><span class='pre'>context</span> : String (optional)<div class='sub-desc'><p>Unique identifier for inter-component communication.</p>\n\n</div></li><li><span class='pre'>handlerId</span> : String<div class='sub-desc'><p>Unique identifier from the <a href=\"#!/api/Echo.Plugin.Events-method-subscribe\" rel=\"Echo.Plugin.Events-method-subscribe\" class=\"docClass\">subscribe</a> function.</p>\n\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Unsubscription status.</p>\n\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});