Ext.data.JsonP.Echo_UserSession({
  "tagname": "class",
  "name": "Echo.UserSession",
  "extends": null,
  "mixins": [

  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "singleton": true,
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
  "id": "class-Echo.UserSession",
  "members": {
    "cfg": [

    ],
    "property": [

    ],
    "method": [
      {
        "name": "constructor",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-constructor"
      },
      {
        "name": "any",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-any"
      },
      {
        "name": "get",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-get"
      },
      {
        "name": "has",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-has"
      },
      {
        "name": "is",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-is"
      },
      {
        "name": "logout",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-logout"
      },
      {
        "name": "set",
        "tagname": "method",
        "owner": "Echo.UserSession",
        "meta": {
        },
        "id": "method-set"
      }
    ],
    "event": [
      {
        "name": "onInit",
        "tagname": "event",
        "owner": "Echo.UserSession",
        "meta": {
          "echo_event": {
            "name": "Echo.UserSession.onInit",
            "description": "Triggered when the user is initialized on the page."
          }
        },
        "id": "event-onInit"
      },
      {
        "name": "onInvalidate",
        "tagname": "event",
        "owner": "Echo.UserSession",
        "meta": {
          "echo_event": {
            "name": "Echo.UserSession.onInvalidate",
            "description": "Triggered after user has logged in or logged out."
          }
        },
        "id": "event-onInvalidate"
      }
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
  "linenr": 3,
  "files": [
    {
      "filename": "user-session.js",
      "href": "user-session.html#Echo-UserSession"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/user-session.html#Echo-UserSession' target='_blank'>user-session.js</a></div></pre><div class='doc-contents'><p>Class implements the interface to work with the user object.\nThe <a href=\"#!/api/Echo.UserSession\" rel=\"Echo.UserSession\" class=\"docClass\">Echo.UserSession</a> class is used in pretty much all applications\n built in top of Echo JS SDK.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Echo.UserSession-method-constructor' class='name expandable'>Echo.UserSession</a>( <span class='pre'>Object config</span> ) : Object</div><div class='description'><div class='short'>Class constructor which accepts the object which represents the\nconfiguration as the argument. ...</div><div class='long'><p>Class constructor which accepts the object which represents the\nconfiguration as the argument. The class is a singleton, i.e. one\nuser instance is shared across the different apps on the page.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Class configuration, which is an object with the following fields:</p>\n<ul><li><span class='pre'>appkey</span> : Object<div class='sub-desc'><p>Echo application key to make user initialization request.</p>\n</div></li><li><span class='pre'>defaultAvatar</span> : Object (optional)<div class='sub-desc'><p>Default avatar URL which will be used for the user in case there is\nno avatar information defined in the user profile. Also used for\nanonymous users.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The reference to the <a href=\"#!/api/Echo.UserSession\" rel=\"Echo.UserSession\" class=\"docClass\">Echo.UserSession</a> class.</p>\n</div></li></ul></div></div></div><div id='method-any' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-any' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-any' class='name expandable'>any</a>( <span class='pre'>String key, Array values</span> )</div><div class='description'><div class='short'>Method to check if the value of a certain user object field belongs to the\narray of values. ...</div><div class='long'><p>Method to check if the value of a certain user object field belongs to the\narray of values.</p>\n\n<p>This function is very similar to the <a href=\"#!/api/Echo.UserSession-method-has\" rel=\"Echo.UserSession-method-has\" class=\"docClass\">Echo.UserSession.has</a> with the difference\nthat the value of the second argument should be <code>Array</code>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the name of the user object field.</p>\n</div></li><li><span class='pre'>values</span> : Array<div class='sub-desc'><p>Defines the set of values.</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-get' class='name expandable'>get</a>( <span class='pre'>String key, [Mixed defaults]</span> ) : Mixed</div><div class='description'><div class='short'>Method to access specific user object field. ...</div><div class='long'><p>Method to access specific user object field.</p>\n\n<p>This function returns the corresponding value of the given key or the\ndefault value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for which the value needs to be retrieved.</p>\n</div></li><li><span class='pre'>defaults</span> : Mixed (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the user object.\nNote: only the <code>undefined</code> JS statement triggers the default value usage.\nThe <code>false</code>, <code>null</code>, <code>0</code>, <code>[]</code> are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the user object.</p>\n</div></li></ul></div></div></div><div id='method-has' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-has' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-has' class='name expandable'>has</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Method to check if the user object has a given value defined for a certain\nfield. ...</div><div class='long'><p>Method to check if the user object has a given value defined for a certain\nfield.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the name of the user object field.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>Defines the desired string or integer value.</p>\n</div></li></ul></div></div></div><div id='method-is' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-is' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-is' class='name expandable'>is</a>( <span class='pre'>String key</span> )</div><div class='description'><div class='short'>Method for checking if the user object conforms a certain condition. ...</div><div class='long'><p>Method for checking if the user object conforms a certain condition.</p>\n\n<p>The argument of the function defines the condition which should be checked.\nThe list of built-in conditions is pre-defined. For instance, you can check\nif the used is logged in or not by passing the \"logged\" string as the function\nvalue.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the name of the condition to check.</p>\n</div></li></ul></div></div></div><div id='method-logout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-logout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-logout' class='name expandable'>logout</a>( <span class='pre'>Function callback</span> )</div><div class='description'><div class='short'>Method to log the user out. ...</div><div class='long'><p>Method to log the user out.</p>\n\n<p>This function is async, so you should pass the callback if you want\nto perform any additional operations after the logout event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>The callback executed as soon as the logout action was completed.\nThe callback is executed without arguments.</p>\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-method-set' class='name expandable'>set</a>( <span class='pre'>String key, Mixed value</span> )</div><div class='description'><div class='short'>Method to define specific user object field value. ...</div><div class='long'><p>Method to define specific user object field value.</p>\n\n<p>This function allows to define the value for the corresponding\nfield in the user object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onInit' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-event-onInit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-event-onInit' class='name expandable'>onInit</a>( <span class='pre'>String topic, Object data</span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered when the user is initialized on the page.<br><b>Full name</b>: <a href=\"#!/api/Echo.UserSession-event-onInit\" rel=\"Echo.UserSession-event-onInit\" class=\"docClass\">Echo.UserSession.onInit</a></p>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Name of the event to subscribe (ex: \"<a href=\"#!/api/Echo.UserSession-event-onInit\" rel=\"Echo.UserSession-event-onInit\" class=\"docClass\">Echo.UserSession.onInit</a>\").</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object which is returned by the users/whoami API endpoint or\nempty object for logout events.</p>\n<ul><li><span class='pre'>echo</span> : Object<div class='sub-desc'><p>Echo section contains three elements.</p>\n<ul><li><span class='pre'>roles</span> : Array<div class='sub-desc'><p>Array of roles.</p>\n</div></li><li><span class='pre'>state</span> : String<div class='sub-desc'><p>State of user.</p>\n</div></li><li><span class='pre'>marker</span> : Array<div class='sub-desc'><p>Markers act as hidden metadata for a user.</p>\n</div></li></ul></div></li><li><span class='pre'>poco</span> : Object<div class='sub-desc'><p>Contains user record representation in Portable Contacts format.</p>\n<ul><li><span class='pre'>entry</span> : Object<div class='sub-desc'><p>Portable contacts object.</p>\n<ul><li><span class='pre'>accounts</span> : Array<div class='sub-desc'><p>Array of user identities held in this contact.</p>\n</div></li><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Unique user identifier automatically assigned by the platform.</p>\n</div></li><li><span class='pre'>startIndex</span> : Number<div class='sub-desc'><p>The index of the first result returned in this response.</p>\n</div></li><li><span class='pre'>itemsPerPage</span> : Number<div class='sub-desc'><p>The number of results returned per page in this response.</p>\n</div></li><li><span class='pre'>totalResults</span> : Number<div class='sub-desc'><p>The total number of contacts found.</p>\n</div></li></ul></div></li></ul></div></li></ul></div></li></ul></div></div></div><div id='event-onInvalidate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.UserSession'>Echo.UserSession</span><br/><a href='source/user-session.html#Echo-UserSession-event-onInvalidate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.UserSession-event-onInvalidate' class='name expandable'>onInvalidate</a>( <span class='pre'>String topic, Object data</span> )</div><div class='description'><div class='short'> ...</div><div class='long'><p>Triggered after user has logged in or logged out.<br><b>Full name</b>: <a href=\"#!/api/Echo.UserSession-event-onInvalidate\" rel=\"Echo.UserSession-event-onInvalidate\" class=\"docClass\">Echo.UserSession.onInvalidate</a></p>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>topic</span> : String<div class='sub-desc'><p>Name of the event to subscribe (ex: \"<a href=\"#!/api/Echo.UserSession-event-onInvalidate\" rel=\"Echo.UserSession-event-onInvalidate\" class=\"docClass\">Echo.UserSession.onInvalidate</a>\").</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Object which is returned by the users/whoami API endpoint or empty\nobject for logout events.</p>\n<ul><li><span class='pre'>echo</span> : Object<div class='sub-desc'><p>Echo section contains three elements.</p>\n<ul><li><span class='pre'>roles</span> : Array<div class='sub-desc'><p>Array of roles.</p>\n</div></li><li><span class='pre'>state</span> : String<div class='sub-desc'><p>State of user.</p>\n</div></li><li><span class='pre'>marker</span> : Array<div class='sub-desc'><p>Markers act as hidden metadata for a user.</p>\n</div></li></ul></div></li><li><span class='pre'>poco</span> : Object<div class='sub-desc'><p>Contains user record representation in Portable Contacts format.</p>\n<ul><li><span class='pre'>entry</span> : Object<div class='sub-desc'><p>Portable contacts object.</p>\n<ul><li><span class='pre'>accounts</span> : Array<div class='sub-desc'><p>Array of user identities held in this contact.</p>\n</div></li><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Unique user identifier automatically assigned by the platform.</p>\n</div></li><li><span class='pre'>startIndex</span> : Number<div class='sub-desc'><p>The index of the first result returned in this response.</p>\n</div></li><li><span class='pre'>itemsPerPage</span> : Number<div class='sub-desc'><p>The number of results returned per page in this response.</p>\n</div></li><li><span class='pre'>totalResults</span> : Number<div class='sub-desc'><p>The total number of contacts found.</p>\n</div></li></ul></div></li></ul></div></li></ul></div></li></ul></div></div></div></div></div></div></div>"
});