Ext.data.JsonP.Echo_StreamServer_Controls_Submit_Plugins_JanrainSharing({
  "tagname": "class",
  "name": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
  "autodetected": {
  },
  "files": [
    {
      "filename": "janrain-sharing.js",
      "href": "janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing"
    }
  ],
  "extends": "Echo.Plugin",
  "package": [
    "streamserver/plugins.pack.js",
    "streamserver.pack.js"
  ],
  "members": [
    {
      "name": "activity",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "cfg-activity",
      "meta": {
        "deprecated": {
          "text": "<p>See <a href=\"http://developers.janrain.com/documentation/widgets/legacy-sign-in-widget/\" target=\"_blank\">Janrain notice</a></p>\n"
        }
      }
    },
    {
      "name": "alwaysShare",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "cfg-alwaysShare",
      "meta": {
      }
    },
    {
      "name": "appId",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "cfg-appId",
      "meta": {
        "required": true
      }
    },
    {
      "name": "sharingWidgetConfig",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "cfg-sharingWidgetConfig",
      "meta": {
      }
    },
    {
      "name": "xdReceiver",
      "tagname": "cfg",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "cfg-xdReceiver",
      "meta": {
        "deprecated": {
          "text": "<p>See <a href=\"http://developers.janrain.com/documentation/widgets/legacy-sign-in-widget/\" target=\"_blank\">Janrain notice</a></p>\n"
        }
      }
    },
    {
      "name": "disable",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-disable",
      "meta": {
      }
    },
    {
      "name": "enable",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-enable",
      "meta": {
      }
    },
    {
      "name": "enabled",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-enabled",
      "meta": {
      }
    },
    {
      "name": "extendTemplate",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-extendTemplate",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-get",
      "meta": {
      }
    },
    {
      "name": "init",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-init",
      "meta": {
      }
    },
    {
      "name": "invoke",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-invoke",
      "meta": {
      }
    },
    {
      "name": "log",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-log",
      "meta": {
      }
    },
    {
      "name": "parentRenderer",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-parentRenderer",
      "meta": {
      }
    },
    {
      "name": "remove",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-remove",
      "meta": {
      }
    },
    {
      "name": "requestDataRefresh",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-requestDataRefresh",
      "meta": {
      }
    },
    {
      "name": "set",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-set",
      "meta": {
      }
    },
    {
      "name": "substitute",
      "tagname": "method",
      "owner": "Echo.Plugin",
      "id": "method-substitute",
      "meta": {
      }
    },
    {
      "name": "share",
      "tagname": "echo_label",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "echo_label-share",
      "meta": {
      }
    },
    {
      "name": "sharePrompt",
      "tagname": "echo_label",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "echo_label-sharePrompt",
      "meta": {
        "deprecated": {
          "text": "\n"
        }
      }
    },
    {
      "name": "shareContainer",
      "tagname": "echo_renderer",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "echo_renderer-shareContainer",
      "meta": {
      }
    },
    {
      "name": "shareCheckbox",
      "tagname": "echo_renderer",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "echo_renderer-shareCheckbox",
      "meta": {
      }
    },
    {
      "name": "shareLabel",
      "tagname": "echo_renderer",
      "owner": "Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
      "id": "echo_renderer-shareLabel",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing",
  "short_doc": "Plugin provides the ability to load Janrain sharing dialog after\nthe item has been posted using the Echo Submit control. ...",
  "component": false,
  "superclasses": [
    "Echo.Plugin"
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
  "html": "<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='docClass'>Echo.Plugin</a><div class='subclass '><strong>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing' target='_blank'>janrain-sharing.js</a></div></pre><div class='doc-contents'><p>Plugin provides the ability to load Janrain sharing dialog after\nthe item has been posted using the Echo Submit control.</p>\n\n<pre><code>new <a href=\"#!/api/Echo.StreamServer.Controls.Submit\" rel=\"Echo.StreamServer.Controls.Submit\" class=\"docClass\">Echo.StreamServer.Controls.Submit</a>({\n    \"target\": document.getElementById(\"echo-submit\"),\n    \"appkey\": \"echo.jssdk.demo.aboutecho.com\",\n    \"plugins\": [{\n        \"name\": \"JanrainSharing\",\n        \"appId\": \"echo\"\n    }]\n});\n</code></pre>\n\n<p>The plugin implementation employs the\n<a href=\"http://developers.janrain.com/documentation/widgets/social-sharing-widget/users-guide/hosting-multiple-widgets/\" target=\"_blank\">Janrain recommendation</a>\nof hosting multiple widgets to make sure that the Janrain widget initialized\nwithin the plugin doesn't interfere with other Janrain Sharing widgets on the\nsame page. If you have other Janrain widgets installed on the page, please take\n<a href=\"http://developers.janrain.com/documentation/widgets/social-sharing-widget/users-guide/hosting-multiple-widgets/\" target=\"_blank\">the recommendation</a>\ninto account as well.</p>\n\n<p>More information regarding the plugins installation can be found\nin the <a href=\"#!/guide/how_to_initialize_components-section-initializing-plugins\">\"How to initialize Echo components\"</a> guide.</p>\n\t\t\t\t<p>\n\t\t\t\t\tAvailable from Echo CDN as a part of the <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/streamserver/plugins.pack.js'>streamserver/plugins.pack.js</a>, <a target='_blank' href='//cdn.echoenabled.com/sdk/v3/streamserver.pack.js'>streamserver.pack.js</a> package(s).\n\t\t\t\t</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-appId' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-appId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-appId' class='name expandable'>appId</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'>A string that identifies the application. ...</div><div class='long'><p>A string that identifies the application.\nAvailable from Janrain Dashboard home page under \"Application info\"\n(part of the app domain before rpxnow.com).\nFor example in https://echo.rpxnow.com appId is \"echo\"</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-activity' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-activity' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-activity' class='name expandable'>activity</a> : Object<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>Configures the sharing dialog. ...</div><div class='long'><p>Configures the sharing dialog.</p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This cfg has been <strong>deprecated</strong> </p>\n        <p>See <a href=\"http://developers.janrain.com/documentation/widgets/legacy-sign-in-widget/\" target=\"_blank\">Janrain notice</a></p>\n\n        </div>\n<ul><li><span class='pre'>sharePrompt</span> : String<div class='sub-desc'><p>Caption of the textarea in the sharing dialog.\nDefault value is the value of <a href=\"#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_label-sharePrompt\" rel=\"Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_label-sharePrompt\" class=\"docClass\">sharePrompt</a> label</p>\n</div></li><li><span class='pre'>shareContent</span> : String<div class='sub-desc'><p>Content of the message which will be shared.\nThe following pseudo-tags can be used:</p>\n\n<ul>\n<li>{content} - tag is replaced with the content of the item;</li>\n<li>{domain} - tag is replaced with the current page domain.</li>\n</ul>\n\n\n<p>If value of shareContent parameter is not provided then\nthe following message will be used:</p>\n\n<ul>\n<li>\"{content}\" for ordinary item;</li>\n<li>\"@{author} {content}\" if this is reply to tweet.</li>\n</ul>\n\n</div></li><li><span class='pre'>itemURL</span> : String<div class='sub-desc'><p>The url where the item was posted initially.</p>\n</div></li><li><span class='pre'>pageTitle</span> : String<div class='sub-desc'><p>The page title where this activity is taking place.\nThis information will be displayed in the Sharing dialog\nif at least one of the following providers is active:\nYahoo!, Facebook or LinkedIn. If this value is not provided\nthen the original page title will be used.</p>\n</div></li><li><span class='pre'>pageDescription</span> : String<div class='sub-desc'><p>The page description where this activity is taking place.\nThis information will be displayed in the Sharing dialog\nif at least one of the following providers is active:\nFacebook or LinkedIn.</p>\n</div></li><li><span class='pre'>pageImages</span> : Array<div class='sub-desc'><p>The list of up to five images. These images are displayed\nas thumbnails by Facebook and LinkedIn. Facebook uses all\nfive images. LinkedIn uses only the first image.</p>\n<ul><li><span class='pre'>src</span> : String<div class='sub-desc'><p>The absolute URL of the image.</p>\n</div></li><li><span class='pre'>href</span> : String<div class='sub-desc'><p>The absolute URL to which the image links.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='cfg-alwaysShare' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-alwaysShare' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-alwaysShare' class='name expandable'>alwaysShare</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Specifies if the \"Share this\" checkbox should be visible so that users\ncould decide themselves if they want to share ...</div><div class='long'><p>Specifies if the \"Share this\" checkbox should be visible so that users\ncould decide themselves if they want to share the posted content or not.\nIf this parameter value is set to <em>true</em> checkbox is hidden and\nsharing popup always appears.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-sharingWidgetConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-sharingWidgetConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-sharingWidgetConfig' class='name expandable'>sharingWidgetConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Container for the options specific to Janrain Sharing widget. ...</div><div class='long'><p>Container for the options specific to Janrain Sharing widget.\nFull list of available options can be found in the\n<a href=\"http://developers.janrain.com/documentation/widgets/social-sharing-widget/sharing-widget-js-api/settings/\" target=\"_blank\">Sharing widget documentation</a></p>\n\n<p>Example:\n    {\n        \"shortenUrl\": true\n        \"title\": \"Some page title\",\n        \"description\": \"Some page description\",\n        \"image\": \"http://example.com/image.png\"\n        // ...\n    }</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-xdReceiver' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-cfg-xdReceiver' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-cfg-xdReceiver' class='name expandable'>xdReceiver</a> : String<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>Full URL of the \"rpx_xdcomm.html\" file. ...</div><div class='long'><p>Full URL of the \"rpx_xdcomm.html\" file. This file should be downloaded\nfrom the JanRain application dashboard (the \"Deployment\" ->\n\"Social Sharing\" section) and placed in the root directory of your website.</p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This cfg has been <strong>deprecated</strong> </p>\n        <p>See <a href=\"http://developers.janrain.com/documentation/widgets/legacy-sign-in-widget/\" target=\"_blank\">Janrain notice</a></p>\n\n        </div>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-disable' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-disable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-disable' class='name expandable'>disable</a>( <span class='pre'>[global]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to disable the plugin. ...</div><div class='long'><p>Method to disable the plugin.\nThe plugin becomes disabled for the current control instance and\nthe update can also be reflected in the config (if the \"global\"\nflag is defined during the function invocation) to disable it\nfor other controls which use the same config parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if the plugin should be disabled in the config. By default\nthe function disables the plugin for the current control instance only.</p>\n</div></li></ul></div></div></div><div id='method-enable' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enable' class='name expandable'>enable</a>( <span class='pre'>[global]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to enable the plugin. ...</div><div class='long'><p>Method to enable the plugin.\nThe plugin becomes enabled for the current control instance and\nthe update can also be reflected in the config (if the \"global\"\nflag is defined during the function invocation) to enable it\nfor other controls which use the same config parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>global</span> : Boolean (optional)<div class='sub-desc'><p>Specifies if the plugin should be enabled in the config. By default\nthe function enables the plugin for the current control instance only.</p>\n</div></li></ul></div></div></div><div id='method-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-enabled' class='name expandable'>enabled</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Checks if the plugin is enabled. ...</div><div class='long'><p>Checks if the plugin is enabled.</p>\n</div></div></div><div id='method-extendTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-extendTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-extendTemplate' class='name expandable'>extendTemplate</a>( <span class='pre'>action, anchor, [html]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to extend the template of particular component. ...</div><div class='long'><p>Method to extend the template of particular component.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : String<div class='sub-desc'><p>The following actions are available:</p>\n\n<ul>\n<li>\"insertBefore\"</li>\n<li>\"insertAfter\"</li>\n<li>\"insertAsFirstChild\"</li>\n<li>\"insertAsLastChild\"</li>\n<li>\"replace\"</li>\n<li>\"remove\"</li>\n</ul>\n\n</div></li><li><span class='pre'>anchor</span> : String<div class='sub-desc'><p>Element name which is a subject of a transformation application.</p>\n</div></li><li><span class='pre'>html</span> : String|Function (optional)<div class='sub-desc'><p>The content of a transformation to be applied. Can be defined as a\nHTML string or a transformer function. This param is required for all\nactions except \"remove\".</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-get' class='name expandable'>get</a>( <span class='pre'>key, [defaults]</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Accessor method to get specific field. ...</div><div class='long'><p>Accessor method to get specific field.</p>\n\n<p>This function returns the corresponding value of the given key\nor the default value if specified in the second argument.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key for data extraction.</p>\n</div></li><li><span class='pre'>defaults</span> : Object (optional)<div class='sub-desc'><p>Default value if no corresponding key was found in the config.\nNote: only the 'undefined' JS statement triggers the default value usage.\nThe false, null, 0, [] are considered as a proper value.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The corresponding value found in the object.</p>\n</div></li></ul></div></div></div><div id='method-init' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-init' class='name expandable'>init</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Initializes the plugin. ...</div><div class='long'><p>Initializes the plugin.</p>\n</div></div></div><div id='method-invoke' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-invoke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-invoke' class='name expandable'>invoke</a>( <span class='pre'>mixed, context</span> ) : Mixed<span class=\"signature\"></span></div><div class='description'><div class='short'>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. ...</div><div class='long'><p>Function which checks if the value passed as a first argument is a function and executes\nit in the given context. If the first argument has different type, it's returned as is.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mixed</span> : Mixed<div class='sub-desc'><p>The value which should be checked and executed in case of a function type.</p>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'><p>Context in which the function should be executed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The result of the function call in case the first argument is a function\nor the first argument as is otherwise.</p>\n</div></li></ul></div></div></div><div id='method-log' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-log' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-log' class='name expandable'>log</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to log info/error message to the browser console in a unified format ...</div><div class='long'><p>Function to log info/error message to the browser console in a unified format</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Defines the properties of the message which should be displayed.</p>\n<ul><li><span class='pre'>message</span> : String<div class='sub-desc'><p>Text description of the message which should be logged.</p>\n</div></li><li><span class='pre'>component</span> : String (optional)<div class='sub-desc'><p>Name of the component which produced the message.</p>\n<p>Defaults to: <code>&quot;Echo SDK&quot;</code></p></div></li><li><span class='pre'>type</span> : String (optional)<div class='sub-desc'><p>Type/severity of the message.</p>\n<p>Defaults to: <code>&quot;info&quot;</code></p></div></li><li><span class='pre'>args</span> : String (optional)<div class='sub-desc'><p>Extra arguments to log.</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-parentRenderer' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-parentRenderer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-parentRenderer' class='name expandable'>parentRenderer</a>( <span class='pre'>name, args</span> ) : HTMLElement<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function. ...</div><div class='long'><p>Method to call the parent renderer function, which was extended using\nthe Echo.Control.extendRenderer function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Renderer name.</p>\n</div></li><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Arguments to be proxied to the parent renderer from the overriden one.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'><p>Result of parent renderer function call.</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-remove' class='name expandable'>remove</a>( <span class='pre'>key</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Method to remove a specific object field. ...</div><div class='long'><p>Method to remove a specific object field.</p>\n\n<p>This function allows to remove the value associated with the given key.\nIf the key contains a complex structure (such as objects or arrays),\nit will be removed as well.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Specifies the key which should be removed from the object.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Indicates that the value associated with the given key was removed.</p>\n</div></li></ul></div></div></div><div id='method-requestDataRefresh' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-requestDataRefresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-requestDataRefresh' class='name expandable'>requestDataRefresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Method publishes the internal event to make the current state invalid. ...</div><div class='long'><p>Method publishes the internal event to make the current state invalid.\nIt triggers the data refresh.</p>\n</div></div></div><div id='method-set' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-set' class='name expandable'>set</a>( <span class='pre'>key, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Setter method to define specific object value. ...</div><div class='long'><p>Setter method to define specific object value.</p>\n\n<p>This function allows to define the value for the corresponding object field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Defines the key where the given data should be stored.</p>\n</div></li><li><span class='pre'>value</span> : Mixed<div class='sub-desc'><p>The corresponding value which should be defined for the key.</p>\n</div></li></ul></div></div></div><div id='method-substitute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Echo.Plugin' rel='Echo.Plugin' class='defined-in docClass'>Echo.Plugin</a><br/><a href='source/plugin.html#Echo-Plugin-method-substitute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.Plugin-method-substitute' class='name expandable'>substitute</a>( <span class='pre'>args</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Templater function which compiles given template using the provided data. ...</div><div class='long'><p>Templater function which compiles given template using the provided data.\nFunction can be used widely for html templates processing or any other\naction requiring string interspersion.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : Object<div class='sub-desc'><p>Specifies substitution process, contains control parameters.</p>\n<ul><li><span class='pre'>template</span> : String<div class='sub-desc'><p>Template containing placeholders used for data interspersion.</p>\n</div></li><li><span class='pre'>data</span> : Object (optional)<div class='sub-desc'><p>Data used in the template compilation.</p>\n</div></li><li><span class='pre'>strict</span> : Boolean (optional)<div class='sub-desc'><p>Specifies whether the template should be replaced with the corresponding\nvalue, preserving replacement value type.</p>\n</div></li><li><span class='pre'>instructions</span> : Object (optional)<div class='sub-desc'><p>Object containing the list of extra instructions to be applied during\ntemplate compilation.</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Compiled string value.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-echo_template'>Templates</h3><div class='subsection'><div id='echo_template-share' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_template-share' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_template-share' class='name expandable'>share</a> : String<p>The following renderers are available for this template:<ul><li><a href=\"#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareCheckbox\">shareCheckbox</a></li>\n<li><a href=\"#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareContainer\">shareContainer</a></li>\n<li><a href=\"#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareLabel\">shareLabel</a></li></ul></p><span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-echo_renderer'>Renderers</h3><div class='subsection'><div id='echo_renderer-shareContainer' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_template-share' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareContainer' class='name expandable'>shareContainer</a>( <span class='pre'>element</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'></div><div class='long'><h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : HTMLElement<div class='sub-desc'>The jQuery wrapped DOM element</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'>The same element as in renderer parameters</div></li></ul></div></div></div><div id='echo_renderer-shareCheckbox' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_template-share' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareCheckbox' class='name expandable'>shareCheckbox</a>( <span class='pre'>element</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'></div><div class='long'><h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : HTMLElement<div class='sub-desc'>The jQuery wrapped DOM element</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'>The same element as in renderer parameters</div></li></ul></div></div></div><div id='echo_renderer-shareLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_template-share' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_renderer-shareLabel' class='name expandable'>shareLabel</a>( <span class='pre'>element</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'></div><div class='long'><h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : HTMLElement<div class='sub-desc'>The jQuery wrapped DOM element</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'>The same element as in renderer parameters</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-echo_label'>Labels</h3><div class='subsection'><div id='echo_label-share' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_label-share' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_label-share' class='name expandable'>share</a> : &quot;Share this comment&quot;<span class=\"signature\"></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='echo_label-sharePrompt' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing'>Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing</span><br/><a href='source/janrain-sharing.html#Echo-StreamServer-Controls-Submit-Plugins-JanrainSharing-echo_label-sharePrompt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing-echo_label-sharePrompt' class='name expandable'>sharePrompt</a> : &quot;Share your comment:&quot;<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This echo_label has been <strong>deprecated</strong> </p>\n        \n\n        </div>\n</div></div></div></div></div></div></div>",
  "meta": {
  }
});