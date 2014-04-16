# Echo JS SDK CHANGELOG:

##v3.0.19 - April 16, 2014

As a part of our ongoing efforts to make JS SDK better we decided to conduct **SDK components performance audit**. We completed a first iteration of the audit and the main highlight of this release is the set of changes performed as a result of the audit. We started with the memory consumption analysis and found a few issues which affect user experience:

* the main one is **incorrect Stream item data deallocation after its destruction**. For example if an item was removed from the Stream, some references to an item data (specifically to a target DOM element) were still kept which prevented data garbage-collection by the browser. We updated the code to destroy an item properly which helped us to avoid memory leaks.

* we also **updated [Echo.Event](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Events) library** to consume less memory. Since this component is widely used across many apps and plugins, this update should help a lot.

In addition to performance improvements, this release contains some modifications of the base [Echo.Control](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control) class. We **added a new config parameter called [refreshOnUserInvalidate](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-cfg-refreshOnUserInvalidate)**, which provides an ability to control an app behavior on user login/logout. Previously if a user logs in/out an app was rebuilt from scratch to reflect that. However we faced a few cases where a complete app rebuilding is unnecessary and even harmful. In order to provide maximum flexibility and leverage complete re-rendering where appropriate, we kept the original logic but now you can control if you want Echo.Control basic functionality to take care of an app refresh or if you want to manage it within an app yourself.

##v3.0.18 - April 8, 2014

This release contains a fix for Echo Loader library which is responsible for dependency management and resource loading across all Echo JS SDK based applications. Sometimes it failed to load dependencies in Firefox and Internet Explorer browsers properly. It was caused by a bug in the Yepnope library which is used internally for Echo Loader. The library is now patched and covered with tests.

##v3.0.17 - February 27, 2014

* **Canvas config loading machinery was updated** to avoid race conditions when a browser tries to retrieve config which was cached by a browser previously. We updated the logic to make sure that an execution order always remains the same.

* **WebSockets connection reestablishment logic** was improved to be more fault tolerant to socket connection closing delays. Previously it caused a delay (up to a few minutes) to switchover to Polling method. Now if the socket is not closed within 10 seconds, we drop the connection and switch to Polling immediately to avoid any delays in live update items appearance.

##v3.0.16 - January 14, 2014

* **StreamServer live updates connection logic was updated** and now if WebSockets are enabled, we try to establish a connection using WS first and fall back to Polling if our attempt failed or timed out (within 5 seconds). Previously both Polling and WebSockets were initialized in parallel and Polling got disabled when WS connection is established. This new connection logic is more efficient from both server-side and client-side standpoints.

* StreamServer live update **errors received via WebSockets connection were displayed within a Stream UI** (instead of the Stream items). The logic was updated to avoid live update errors rendering in the main UI.

* While making **"POST" requests via Echo.API machinery in IE**, a timeout handler was initialized in an incorrect place. As a result, an error callback was still fired even though a request was completed successfully. This problem was resolved to avoid error callbacks from being executed after successful operation completion. The most visible manifestation of this issue was an error popup displayed after successful item submission via a Submit form.

##v3.0.15 - November 18, 2013

* After switching the Canvas data extraction from CORS-based to JSONP-like method via YepNope library (which we use to load dependencies) in v3.0.14 release, we faced the problem that in some cases the Canvas data cached in the browser (along with the JSONP-wrapper code) became unavailable due to the specific way the YepNope handles it. So we decided to **utilize $.ajax jQuery function with the "script" transport behavior to retrieve the data from the Canvas config storage** to make sure that the cached resources are still available in JS code. This is an internal machinery update, so there are **no** performance or any other implications for the publishers and end users. We will switch back to the CORS approach as soon as it's fully supported by the Canvas config storage.

* We've slightly **updated the Stream app logic which handles live updates**. Under certain conditions (for example when a root item arrives with a child node while the stream is paused), the child nodes might not be displayed in the stream. The problem is now resolved so no items are dropped.

* The **machinery which takes care of switching to Polling method** in case a WebSockets connection is closed (either proactively by the server side or in case of connection problems) was updated to avoid massive simultaneous connections. Now when the SDK machinery detects that the WebSocket connection is closed - switching to Polling is taking place with a slight delay, random for all users (in a 5-15 seconds range). When switching to Polling, the SDK retrieves items starting from the WebSockets disconnect time, so no live updates are dropped while changing transport.

##v3.0.14 - October 28, 2013

* In order to **improve security**, we performed some updates to enable **HTTPS protocol for the endpoints which manipulate the Backplane channel ID**, specifically:

  * requests to “users/whoami” to get the user data;
  * all submit operations via Echo Submission Proxy (including “Likes”, “Flags” operations as well as posting new items via Submit form);
  * user logout request;
  * Backplane channel requests.

  It basically means that the mentioned endpoints will be requested using secure connection irrespective to the current page protocol.

* We discovered the situation where an **App with no Backplane configuration affected the user state** (switched it to anonymous state) and as a result the state was not updated even though other Apps had the Backplane information available. We made the logic more tolerant to that situation and we re-initialize the user in case the Backplane information became available on the page.

* We made the **"transport" configuration parameter value consistent across the whole API-related machinery**. Now it’s called "websockets" in all places. We renamed the corresponding Echo API transport class to WebSockets as well. Please make sure that the “websockets” (not “websocket”) value is used in your configs.

* The **missing docs for the ["onUpdate"](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Counter-echo_event-onUpdate) and ["onError"](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Counter-echo_event-onError)** events of the Echo Counter App **were added**.

* We **fixed the missing new item animation in the Stream App**. The problem was caused by the missing backwards compatibility for the *liveUpdates.timeout* configuration parameter for the Stream, FacePile and Counter applications. The backwards compatibility was restored, however please note that this parameter is deprecated and should be replaced with [liveUpdates.polling.timeout](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdates) parameter.

* The **"More" button was sometimes visible** in the Stream App even if there were **no more items** to display. The issue is now resolved.

* Because of the issue with cross-domain AJAX requests to get Canvas configs from the third-party vendor storage (in case the Canvas is requested from multiple domains), **we switched the way we extract the Canvas data to JSONP-like one** to ensure the consistent behavior across all [supported browsers](http://echoappsteam.github.io/js-sdk/docs/#!/guide/technical_specification-section-browser-support). This is an internal machinery update, so there are *no* performance or any other implications for the publishers and end users. We will switch back to the AJAX (CORS) method as soon as it's fully supported.

* **WebSockets re-subscribing logic in case of subscription termination signal** sent from the server side was updated. Previously we sent the “since” parameter along with the search query to re-initialize the view in StreamServer, but the view was not registered, because of the “since” parameter (which indicates that this is a live updates request). As a result, no new live updates reached the client side. The problem is now resolved. We have updated the code to prevent the “since” parameter from being sent while re-initializing the view.

##v3.0.13 - September 30, 2013

- We have updated the **Echo.Loader.initApplication function and added the delayed initialization support** for apps. This mode was originally implemented for the Canvases machinery only (in v3.0.11) and now we are extending the support to include the apps initialized via Echo.Loader.initApplication function. This new loading mode allows to delay the app loading until the app target becomes visible in the user's browser. This option is disabled by default. In order to enable this loading mode you should specify the "init" parameter in the config object passed to the Echo.Loader.initApplication function. More information about this mode can be found in our Documentation center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initApplication).

- In order to make the **client-side scripts caching more effective**, we've updated the Echo.Loader machinery to load JS SDK scripts from the latest stable version (for example, "v3.0.12") vs current ("v3") version. We've also updated the response headers for the resources served from our CDN to instruct browsers to cache stable location resources for a longer period of time, like 2-3 months vs 24 hours as defined right now. We believe that it should improve the client side performance by avoiding unnecessary requests to download resources (like scripts, images, CSS files, etc) from the CDN.

- The logic of the **user initialization in Echo.App and Echo.Control was updated** to provide an ability to override the "whoami" and "logout" URLs. This ability was added to provide the configuration flexibility in case the code should work with different (non-default) StreamServer cluster. The "whoami" and "logout" URLs are generated using the "apiBaseURL" and "submissionProxyURL" config parameters and passed into the Echo.UserSession. So, to override these URLs you can pass only "apiBaseURL" and "submissionProxyURL" into an App constructor.

- Another **update related to the user initialization was performed in the Echo.Canvas** class (responsible for the Canvas initialization). Due to the fact that apps inside the Canvas might not necessarily use Echo users machinery, we decided to avoid the user object from being initialized inside the Canvas. Thus, we removed the "data-canvas-appkey" attribute from the Canvas DOM element container. Also the "data-canvas-appkey" parameter was a bit confusing in a context of the Canvases, making the AppServer and StreamServer tightly coupled. Since the appkey parameter is now removed, the Canvases machinery becomes StreamServer-independent.

- The **JS exception was thrown in case of sending a request** using the "POST" method and the "JSONP" transport. We have fixed the issue in the Echo.API.Request class and prevent the JS exception from being thrown.

- We have **changed the default behavior of the Canvas loader machinery**. Now the loader is fetching the Canvas data from production storage by default. Previously the development location was a default one and you had to instruct the loader to use the production location when you go into production. Now it's the reverse: if you want to work with the Canvas in development mode, you can specify it using the ' data-canvas-mode="dev" ' HTML attribute in the Canvas \<div\> container or by switching the SDK engine to debug mode for your session by adding the "#!echo.debug:true" into the anchor part of the page URL as described [here](http://echoappsteam.github.io/js-sdk/docs/#!/guide/terminology-section-minified-scripts-and-debugging).

- Another **important Canvas loader machinery update: we provided the ability to load the same Canvas data from multiple domains using CORS** (cross-domain AJAX calls). Previously there was a limitation that allowed Canvas config to be loaded from a single domain only. This limitation was removed and now you can place the same Canvas on different domains (for example: dev, qa, prod).

- We have **updated the Echo.API.Request class and added extra validation for the "transport" key**. Now if the "transport" key is defined incorrectly, this value is ignored.

##v3.0.12 - September 18, 2013

This release is completely devoted to the **[WebSockets](http://en.wikipedia.org/wiki/WebSocket) support implementation in the JS SDK transport layer**. This will make live updates instant for client apps. This technology is relatively new, but it's already supported in [~73% browsers](http://caniuse.com/#feat=websockets) (and growing fast).

For now, WebSockets support is disabled by default so there should be no noticeable changes to your app unless the feature is explicitly turned on.

Currently WebSockets support is implemented for "search" API updates only [via the new "ws" API endpoint](http://wiki.aboutecho.com/w/page/68773610/StreamServer%20-%20WebSockets%20API).

You can enable the new transport for the Stream and FacePile apps. In order to enable WebSockets support, please include the "[liveUpdates](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdates)" object in the app config.

Example:

```javascript
   new Echo.StreamServer.Controls.Stream({
       ...
       "liveUpdates": {"transport": "websockets"},
       ...
   });
```

In the case where Websockets is not supported by the client browser, the SDK will revert to the current Short Polling mechanism.

**Important**: we are releasing the WebSockets support in **test mode**, so please contact us at solutions@aboutecho.com before enabling it for heavy-traffic production sites. We will perform capacity planning if needed and will monitor the server side behavior to make sure that you get the best experience and performance.

##v3.0.11 - September 10, 2013

* We introduced a **new Canvas loading mode** within the Echo.Loader class. This new mode **allows to delay the Canvas apps loading until the Canvas target becomes visible** in the user's browser. We encourage you to use this feature to gain better performance in case you have widgets located below the main content area viewport when the user opens a page (for example, comments widget underneath the article).
In order to enable this new loading mode you should specify the "data-canvas-init" Canvas target attribute as "when-visible". The default behavior (if no additional parameter is specified) remains the same: the Canvas is being initialized on the page as soon as is's found by the Echo.Loader after the Echo.Loader.init function call.

* We have **updated a few HTTP headers** (including "Cache-Control", "Expires" and "Content-Type") returned by Echo CDN while serving scripts to the client side. Having the updated headers in place allows to make the **browser caching more efficient, predictable and consistent**, to avoid the same resource downloading multiple times. This update contributes to the performance improvements performed within this release.

* We have **fixed the issue in the [YepNope](http://yepnopejs.com/) third-party loader library**, employed by JS SDK to download JS and CSS dependencies for apps. In some cases the loader fell into the endless loop trying to look for CSS stylesheets even when all the necessary resources are downloaded. The **fix contributes to the performance improvements** made within this release.

* We have **added the [safelyExecute](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-safelyExecute) function** into the Echo.Utils library. This method allows to execute another function in the try-catch block to avoid execution flow interruption by the code which might potentially throw an exception.
The main reason why the function was added into the code is to **avoid JS exceptions** (generated by jQuery) in case the Stream app tries to assemble the UI element using the user-generated content with an invalid HTML structure. Since the Stream app doesn't control an item content format, we make sure that it doesn't break the whole app. This safety measure was applied to the author name, item content, tags and markers elements within the Stream item UI.

* The **"[mux](http://wiki.aboutecho.com/w/page/32433803/API-method-mux)" API endpoint support was added** into the [Echo.Stream.Server.API.Request](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.API.Request) class. Now you have an ability to use our JS API to "multiplex" requests, i.e. to use a single API call to "wrap" several API endpoint requests. More information about the Echo.StreamServer.API.Request endpoints can be found in our Documentation center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.API.Request-cfg-endpoint).

* The **PinboardVisualization plugin docs were updated** to mention that the "reTag" config option of the Stream.Item control is not supported in case the plugin is active. More information about the "reTag" option can be found [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-reTag). The PinboardVisualization plugin documentaion is located in our Documentation center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.PinboardVisualization).

* The **"ready" callback was executed for the wrong app instance** in case a few apps of the same type were employed within another app. The JS SDK code was updated to make sure that the "ready" callback defined in an App config is always executed just once and always for the proper app instance.

* We have **fixed the issue with Canvases destroying**. Generally destroyment process executes "destroy" method for each Application inside the Canvas. It could have thrown an exception in case the Application didn't have this method. Now Application doesn't have to have "destroy" method to work properly but it's recommended.

* Echo **JS SDK tests infrastructure was reworked** which allows to write tests easier and in a more readable way. It helped to expand several tests for better coverage and to reveal a few minor corner-case bugs, which were also fixed. About 50% of the current tests were converted to the new infrastructure, the rest utilizes the old test engine. We'll convert more and more tests as we move forward to switch to the new test engine eventually. Converted tests mostly use mocks to avoid requests to the real server which increases tests stability and decreases completion time by 40% approximately.

##v3.0.10 - July 31, 2013

* We added **the ability to override an app config** using the [Echo.Loader.override](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-override) function in case of multiple installations of the same Canvas on a page. Now you can specify the unique id for each Canvas on the page and use this id for the Echo.Loader.override function call. More information can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-override).

* The **"mode" config parameter was added for the Canvas control** to trigger the type of storage which should be used to retrieve the Canvas configuration. More information about this parameter and available storage types (and their differences) can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs#!/api/Echo.Canvas-cfg-mode).

* We have **upgraded the Yepnope.js third-party library (which we use in the Echo.Loader to download the dependencies)** to the latest version. It should resolve the issue with missing loader anchor element in case some other dynamic loading libs exist on the page. More information about the YepNope library and its latest version can be found [here](https://github.com/SlexAxton/yepnope.js#current-released-version).

* In order to provide more flexibility for the CSS customizations, the **Echo.Canvas class now adds special CSS classes to its target element** and for each App Instance target element inside the Canvas. The CSS class starts with the "echo-canvas-" prefix and contains the ID of the Canvas/Instance and now you can target your CSS rules to a specific Canvas/Instance. You can use the Web Inspector tool in your browser to inspect the Canvas target element and find the necessary CSS base class names.

* We added the ability to define **multiple app script URLs** within the "[scripts](http://echoappsteam.github.io/js-sdk/docs#!/api/Echo.Loader-static-method-initApplication)" in case the script should be server from **different location on HTTP/HTTPS pages**. More information about the new format of the "scripts" parameter can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs#!/api/Echo.Loader-static-method-initApplication).

* Sometimes if the [Stream app](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream) is empty (no items posted yet), it fails to render the first submitted item received as a live update. We have fixed this issue and now all items (including the very first one) received within live updates are displayed in the Stream correctly.

* The **PinboardVisualisation plugin** logic was updated to disable the slide down animation for the Stream Item in order to let the Isotope library (used for the Pinboard-style visualization) work with the final state of the DOM element representing the Item, to avoid its incorrect positioning in the grid. Previously the slide animation disabling was a manual action (via Stream app config), now the plugin takes care of it automatically.

* We have **excluded the "hashtags" from the list of default Item content transformations on the client side within the Stream app**. Previously the "#" char was replaced with the tag icon in the item content by default. Now this transformation is removed from the default list and you can enable it using a special parameter ("item.contentTransformations") described in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-contentTransformations).

* Previously the **"safeHTML" search query predicate** (defined in the initial query via the ["query" parameter](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-query) to get the data from the StreamServer to render the Stream) was ignored during the API request to get additional replies for the item after clicking the "View more items" button. Now the same value of the "safeHTML" predicate is used across all additional requests used in the Stream app.

* We have **upgraded the jQuery library** to the latest v1.10.2 version. More information about the jQuery release is available in the [official Blog announcement here](http://blog.jquery.com/2013/07/03/jquery-1-10-2-and-2-0-3-released/).

* We have **upgraded the QUnit library** which we use as a testing framework to the latest v1.12.0 version. QUnit library release changelog is available [here](https://github.com/jquery/qunit/blob/v1.12.0/History.md).

##v3.0.9 - June 20, 2013

* [JanrainAuth plugin](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainAuth) for [Echo Submit Control](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit) is added to employ [Janrain Social Login Widget](http://janrain.com/products/engage/social-login/).
  Now there is no need to include the "FormAuth" plugin and configure Janrain app URL, you can just include the "JanrainAuth" plugin instead of the "FormAuth" one and pass the Janrain app ID. The plugin takes care about the rest. It is based on the most current Janrain Login Widget implementation so it is recommended to use "JanrainAuth" plugin in case of integration with Janrain authentication provider. Note: the "FormAuth" plugin is still available as a part of the Echo JS SDK package for more complex integration cases.

* [JanrainSharing plugin](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit.Plugins.JanrainSharing) for [Echo Submit Control](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit) is added to employ [Janrain Social Sharing Widget](http://janrain.com/products/engage/social-sharing/).
  As a part of the update we also added an ability to display the "Share this" checkbox near the "Post" button of the Submit form to let the user decide if the sharing popup should be opened or not. The visibility of the checkbox can be changed using the plugin configuration parameter. If the checkbox is not displayed, the sharing popup will appear automatically after a successful item submission.

* [JanrainSharing plugin](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.JanrainSharing) for [Echo Stream Control](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream) is added to employ [Janrain Social Sharing Widget](http://janrain.com/products/engage/social-sharing/).
  Long awaited feature was added into the Stream control: using the "JanrainSharing" plugin for the Stream, the "Share" button can be added into the Stream Item UI to provide the ability for the users to share items with their friends.

* [JanrainConnector plugin](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.IdentityServer.Controls.Auth.Plugins.JanrainConnector) for [Echo Auth Control](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.IdentityServer.Controls.Auth) is added to employ [Janrain Social Login Widget](http://janrain.com/products/engage/social-login/).
  This plugin provides the ability to enable the Janrain Social Login Widget functionality for the Echo Auth control.

* The error code was missing in the popup which appeared in case the server returned an error response after the item submission via Submit form. Now the error message received from the server side is properly displayed to provide additional information for the user about the reason for the failed submission attempt.

* The [maxBodyLines limits parameter](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item-cfg-limits) was handled by the Stream Item class a bit incorrectly which produced JavaScript errors in case the parameter was specified in the config. The issue was fixed to handle this parameter and truncate the Item content properly.

* The way Echo controls and plugins deal with certain fields was optimized to exclude parent widget configuration processing in every internal component. In addition to that the Stream Item config assembling was optimized to avoid unnecessary data structures copying before the Item instance initialization. This should improve the Stream performance especially for the cases when it's initialized from static data (via "data" config parameter).

* The "shown" callback was added to the Echo.GUI.Tabs class. The callback is being executed after the tab has been shown. More information about the callback can be found in the [Echo.GUI.Tabs documentation](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI.Tabs).

* Twitter Bootstrap was upgraded from 2.3.1 to 2.3.2 version. More information about the Bootstrap updates is available [here](http://blog.getbootstrap.com/2013/05/17/bootstrap-2-3-2-released/).

* jQuery was upgraded from 1.9.1 to 1.10.1 version. The corresponding jQuery release notes are available [here](http://blog.jquery.com/2013/05/24/jquery-1-10-0-and-2-0-1-released/) for version 1.10.0 and [here](http://blog.jquery.com/2013/05/30/jquery-1-10-1-and-2-0-2-released/) for version 1.10.1.

* The Item UI was improved in case the "PinboardVisualization" plugin is installed for the Stream control. We've fixed the problem with Items border rendering (the border was missing) and improved the Stream rendering on mobile devices.

* The following guides were added into our Documentation Center:
  - [How to use template placeholders](http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_use_template_placeholders)
  - [How to extend templates](http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_extend_templates)
  - [How to work with text labels](http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_work_with_labels)
  - [Dependency management in JS SDK](http://echoappsteam.github.io/js-sdk/docs/#!/guide/dependency_management)
  - [How to initialize Echo components](http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_initialize_components)

  The complete list of guides can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/guide).

## v3.0.8 - May 16, 2013

* The "ready" callback was not executed in case an incorrect appkey was specified during the **Echo.UserSession initialization**. As a result, Control or App initialization was stopped on the user creation step. Now the Echo.UserSession initialized with an invalid appkey is considered as an anonymous user (the "ready" callback is being executed).

* Internal logic of the **Echo.Control class** was updated to prevent the "data" configuration parameter from being pointlessly processed by the Echo.Configuration class during Control or App initialization. This improves the **performance of Controls/Apps** in case the "data" parameter is passed in the config. This update also improves the Stream control performance due to the fact that the "data" parameter is used to initialize the Item instances (Stream passes the data to the Item class via the "data" config parameter).

* We added the **"asyncItemsRendering" config option for the Stream control** to trigger the asynchronous items rendering. The option is disabled by default, so the Stream control acts exactly the same. This option is highly recommended for the Streams with the amount of items (roots + children) over 50 on a single Stream page or in case the items contain the UGC content such as images, videos, etc. More information about this option is available in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-asyncItemsRendering).

* The **"Echo.Canvas.onError" event** was added into the Echo.Canvas class to provide the ability to handle errors outside of the class if needed. More information about the error can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Canvas-event-onError).

* The **"Post" button** HTML element was changed from \<button> to \<div> to avoid problems when the **Submit control** is installed into the target inside the \<form> element (for example, the button click triggers the \<form> submission in Firefox browser).

* **Echo.API.Request** class logic was updated to use secure (HTTPS) protocol for Echo API endpoint requests in case the "secure" config parameter is set to false or undefined. More information about the "secure" option can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.API.Request-cfg-secure).

* **Stream and Counter controls** logic which handles the pre-defined data case (passed via the "data" config parameter) was updated to execute live update requests as we normally do for the regular case when the initial data is being requested from the server side.

* The **"getRelativeTime" function of the Echo.Control class** was updated to display the "Just now" text instead of "N seconds" in case the time passed into the function differs from the current time by less than 10 seconds. More info about this function can be found in our Documentation Center [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-method-getRelativeTime).

* The **"Echo.StreamServer.Controls.Submit.onPostComplete" and "Echo.StreamServer.Controls.Submit.onPostError" event contracts were extended** to include the server side API response as a part of the callback handler arguments. More information about the events can be found in our Documentation Center using the following links: [onPostComplete](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit-event-onPostComplete) event, [onPostError](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit-event-onPostError) event.

## v3.0.7 - Apr 11, 2013

* Sometimes when the item was updated, the **item timestamp field was missing** in the UI. The problem was fixed and as a part of the fix we removed the “age” field (which was no longer used) from the Echo.StreamServer.Controls.Stream.Item class instance. Since the field existed for internal usage only, it should not affect the code written on top of the SDK. Anyway if you used the “age” field references in your code, make sure that the corresponding code is rewritten accordingly.

* The Echo.Canvas abstraction was added to work with the application deployments. The abstraction is used primarily in the **Echo.Loader.initApplication** function at this moment to init applications, but it will also be widely used later for other app deployment scenarios. The corresponding code of the Echo.Loader class was refactored to work with the Echo.Canvas abstraction. Note: we do not recommend the Echo.Canvas abstraction usage directly for now, please use the Echo.Loader.initApplication function instead. More information about the Echo.Loader.initApplication function can be found [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initApplication).

* The **Twitter Bootstrap UI framework** was upgraded from 2.3.0 to 2.3.1 version. The framework changelog is available [here](https://github.com/twitter/bootstrap/blob/master/CHANGELOG.md).

* The **"PinboardVisualization" plugin** was handling the YouTube video URLs in the item content incorrectly, which prevented videos from appearing in the item UI. Now the URLs processing was updated and the videos should appear in the item UI properly.

* There was a mismatch between the “show user list” option names used in the **"CommunityFlag" plugin** code, the plugin default config object and docs. The [config and docs](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.CommunityFlag-cfg-showUserList) are now synced.

* Incorrect detection of the current user id in the **"Like" plugin** caused invalid label in the Stream item UI for the likes submitted by the current user. The user id detection is now fixed.

* The "itemURIPattern" configuration parameter was ignored by the **Submit control** during the item submission. Now the Submit control is passing the "itemURIPattern" parameter value into the API machinery which takes care of sending the data to the server side. More information about the "itemURIPattern" can be found [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit-cfg-itemURIPattern).

* We introduced the new parameter called "useSecureAPI" to all classes based on the Echo.Control or Echo.App class. This parameter is designed to specify the API request scheme (HTTP or HTTPS). More information about the “useSecureAPI” parameter can be found [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-cfg-useSecureAPI).

* The **“tags” and “markers” parameter values defined in the Submit control config were ignored** while building the UI for administrators/moderators. The issue was fixed and now the Submit control takes the config values into account.

* When the **Echo.API.Request** class was used directly (without any wrappers like Echo.StreamServer.API.Request, etc), the module was acting incorrectly in case of errors, since the part of the logic existed in the wrappers only. The necessary logic was moved into the base class now to handle the error responses better.

* Under a certain condition the **“onShow” callback in the Echo.GUI.Modal class instance was called twice**. The Echo.GUI.Modal logic was updated to suppress the excessive callback function execution.

* Sometimes the **Echo.Loader.download** function callback was executed before the resources downloading was complete (in case the next scripts chunk downloading had started before the previous chunk was loaded). The issue is originally coming from the [YepNope](http://yepnopejs.com/) loader we use for loading the resources (the corresponding ticket in their [bugtracker](https://github.com/SlexAxton/yepnope.js/issues/113)). We added the logic to avoid the described situation.

* The **HTTP protocol was used by the Echo.Loader class** to download Echo environment scripts on HTTPS pages which caused security warnings in a browser. Now the Echo.Loader detects the page protocol and requests the dependencies using either HTTP or HTTPS.

* The **“TwitterIntents” plugin was renamed to “TweetDisplay”**. The “TwitterIntents” plugin is still available, but it was marked as deprecated and will be removed during the next (v3.0.8) SDK release. If you use this plugin, **please update the plugin name** in your installations. The tweets appearance was also updated to comply with the latest Twitter display requirements.

* The **“select” event has been added into the Echo.GUI.Tabs** class. The event is triggered when the user clicks on the non-disabled, but inactive (not selected) tab. More info about the “select” event can be found [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI.Tabs-cfg-select).

## v3.0.6 - Feb 20, 2013

* **the quirks browser mode is no longer supported**, more information is available [here](http://echoappsteam.github.io/js-sdk/docs/#!/guide/technical_specification-section-limitations).

* several additional **configuration parameters were added to Echo.GUI.Tabs** component. More information about the Tabs library can be found [in our documentation center](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI.Tabs).

* new **setState method was added into Echo.GUI.Button** component, more information is available [here](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI.Button-method-setState).

* a **few bugs were fixed in the Echo.GUI.Modal** component which caused malfunctioning in some cases.

* we have added the **ability to set nested entries for Echo.GUI.Dropdown** component. **Separate icons can be specified** for the dropdown itself as well as for each entry. For more information please visit [our documentation center](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI.Dropdown).

* the **Bootstrap transitions plugin was included** into the Echo.GUI package. More information about this plugin can be found [here](http://twitter.github.com/bootstrap/javascript.html#transitions).

* **Twitter Bootstrap was upgraded** from 2.2.2 to 2.3.0 version. More information about the Bootstrap updates is available [here](http://blog.getbootstrap.com/2013/02/07/bootstrap-2-3-released/).

* **jQuery was upgraded** from 1.9.0 to 1.9.1 version. The corresponding jQuery release notes are available [here](http://blog.jquery.com/2013/02/04/jquery-1-9-1-released/).

* the SDK code was updated to comply with the latest **jQuery trends** in terms of **checking feature support in the browser** vs checking the browser and its version.

* the **Echo.Loader.download** function is now checking the case when **no resources for downloading have been passed**. In this case the callback is now fired immediately.

* the **input fields of the Submit form** instantiated inside the Reply plugin **were misaligned** when used in conjunction with the PinboardVisualization plugin. We performed some CSS updates to fix the problem.

* the **Stream control UI links** such as item controls or the “Re” tag links **changed their styles** when the “gui.pack.css” was included into the page source. Extra CSS rules were added to prevent this.

* the **logic of the static manifest declarations merging** (in case of inheritance) was updated to check the situation when the function is defined in child manifest and undefined in parent manifest, which caused the problems while calling the parent function.

* the **PinboardVisualization plugin is no longer available in quirks browser mode** due to the fact that the Isotope library used for visualization mechanics doesn’t support the quirks mode at all. The plugin will automatically be disabled if the page works in quirks mode.

## v3.0.5 - Jan 30, 2013

* We’ve **moved Echo Bootstrap plugin wrappers into the Echo.GUI scope**. The $.echoButton and $.echoModal functions have been removed and you should use Echo.GUI.Button and Echo.GUI.Modal classes instead. In addition to the Button and Modal wrappers we also released a few other wrappers which should help you to work with Bootstrap components. The Echo.GUI classes description can be found in the documentation center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.GUI)

* All the Twitter Bootstrap JS files with the Echo.GUI components are now packed into the “gui.pack.js” file. All the CSS rules (Bootstrap and Echo.GUI components) are packed into the “gui.pack.css”. Please make sure to include these files into dependencies if your plugins or apps use Bootstrap components.

* **jQuery was upgraded from 1.8.2 to 1.9.0 version.** This jQuery upgrade is not fully backwards-compatible by itself. You can find the details about the jQuery 1.9 release with the list of the things which were changed or deprecated here:

  [http://jquery.com/upgrade-guide/1.9/](http://jquery.com/upgrade-guide/1.9/)

* The **“PinboardVisualization” plugin was moved** out of the main StreamServer JS package (streamserver.pack.js) in order to reduce the size of the package. Now the following plugin script should be included directly into the page source to load the “PinboardVisualization” Stream plugin:
  http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/pinboard-visualization.js

  More information about the “PinboardVisualization” plugin can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Plugins.PinboardVisulization)

* The **events produced by the "Edit" plugin** contained incomplete event names, the "Plugins.Edit" part was missing. The event names generation was fixed and now the proper events are being fired by the "Edit" plugin. If you use subscriptions to the “Edit” plugin events, please update the corresponding code to subscribe using the new event names. More information about the "Edit" plugin itself and the events produced can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit.Plugins.Edit](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit.Plugins.Edit)

* The **“appkey” validation was moved** from the base Echo.Control to the specific controls which require “appkey” as a mandatory parameter. Now if your app or control doesn’t require an “appkey” (doesn’t interact with StreamServer or IdentityServer directly), the “appkey” can be omitted in the configuration. For you convenience if you need to check the “appkey”, we added the “checkAppKey” function into the Echo.Control class, so your control or application will have access to this function using the “this” property of the class instance. More information about the “checkAppKey” function can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-method-checkAppKey](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-method-checkAppKey)

* The internal logic of the base **Echo.Control class was updated** to consume less memory while creating a JS class from the manifest declaration. In addition to that the logic of the JS class generation was updated to allow multi-level inheritance based on the manifests overrides.

* The **Echo.Loader.initApplication function was added** to provide the unified way of apps initialization on the page. The function performs initial preparations and initializes the app instance. More information about the function can be found in our docs center:  

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initApplication](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initApplication)

* **Twitter Bootstrap was upgraded** from 2.2.1 to 2.2.2 version. Bootstrap release notes can be found [here](http://blog.getbootstrap.com/2012/12/08/bootstrap-2-2-2-released/).
* **QUnit library was upgraded** from 1.10.0 to 1.11.0 version. The QUnit lib changelog can be found [here](https://github.com/jquery/qunit/blob/v1.11.0/History.md).

* **Isotope library** ([http://isotope.metafizzy.co](http://isotope.metafizzy.co)) which is used to power the PinboardVisualization mechanics **was upgraded** from 1.5.21 to 1.5.25 version.

* The **dependencies definition was simplified**. We’ve added an ability to specify the plugin/app/control name instead of the "loaded" function as a part of the dependency object. The “loaded” function was also preserved. You can see the examples here:

  [http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_develop_app-section-dependencies](http://echoappsteam.github.io/js-sdk/docs/#!/guide/how_to_develop_app-section-dependencies)

* The internal mechanics of the **Echo.Utils.timestampFromW3CDTF method was slightly updated**. Now this method can convert any string representation of a date supported by the browser. If the ISO representation is not supported (e.g. in IE8, in IE9 in quirks mode, in Safari on a date with reduced precision) then the Echo.Utils.timestampFromW3CDTF will parse that date string as it did before.

* The **child nodes rendering logic was updated** (in case the PinboardVisualization plugin is enabled for the Stream). By design only root nodes can be the source of the media content, thus all HTML tags are stripped out from the child nodes. More details about the PinboardVisualization plugin can be found in our docs:

  [http://wiki.aboutecho.com/w/page/30181308/Echo%20Application%20-%20Echo%20Stream%20Client#Plugins.PinboardVisualization](http://wiki.aboutecho.com/w/page/30181308/Echo%20Application%20-%20Echo%20Stream%20Client#Plugins.PinboardVisualization)

* The **Echo.Utils.htmlTextTruncate function behavior was changed**. Now if the truncation hits the middle of the word, the word itself is preserved and truncation starts right after this word to improve the text readability.

* The **YepNope library** ([www.yepnopejs.com](http://www.yepnopejs.com)) which we use to download dependencies for controls, apps and plugins was moved under the local Echo scope to avoid conflicts in case another version of the loader exists on the page.

* The **Echo.Configuration class logic was updated** to prevent incoming data damaging during the operations with the config instance. In some cases when you assign the data to the config field, the incoming object was also modified. Now the Echo.Configuration class instance works with the copy of the incoming data, thus leaving incoming data untouched.

* The logic of the **Echo.App class was updated** in order to proxy the configuration parameters into the internal applications initialized using the "initComponent" function. Now the Echo.App class tries to populate the current instance configuration based on the default manifest config keys and the parent object config values.

* The contract of the **Echo.Plugin.isDefined function was updated**. In addition to the plugin manifest definition, the function can also accept the full name of the plugin to check if the plugin was already defined. Now the Echo.App.isDefined, Echo.Plugin.isDefined and Echo.Control.isDefined has the same contract.

* The **Echo.Loader.initEnvironment function became public**. The function helps to initialize Echo JS environment on the page by downloading the necessary scripts. More information about the function can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initEnvironment](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-initEnvironment)

* The internal logic of the **Echo.Loader.download function was updated** to handle the various cases of multiple resource loading, nested execution of the same function from the callback, same resource multiple loading, etc. More information about the Echo.Loader.download function can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-download](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-download)

* We’ve **changed the avatars display rules** in our components. Prior to this change we supported square avatars only and this could result in distortion of non-square images. This limitation is now removed and the avatar is shrinked proportionally, so the image is displayed without any deformation.

  The Echo.Utils.loadImage and Echo.Control.placeImage methods were also modified. The Echo.Control.placeImage method now positions and shrinks the avatar correctly inside the given container. We recommend you to use that method when you need to insert images of different sizes and proportions into container with fixed dimensions.

  A detailed description of these functions can be found in our documentation center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-loadImage](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-loadImage)
  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-method-placeImage](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-loadImage)

* The context generation machinery became a part of the Echo.Events library interface. You can call the **Echo.Events.newContextId function to generate a new unique context ID string**. The function also supports generation of the nested contexts (the parent context should be passed as a first argument). More information about the function can be found in our docs center:

  [http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Events-static-method-newContextId](http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Events-static-method-newContextId)


## v3.0.4 - Nov 29, 2012

- The most important update which we performed within this release is the minification of the JS
 scripts using the UglifyJS software before pushing them to our CDN.
 Now all files from http://cdn.echoenabled.com/sdk/v3/ directory are served minified by default,
 which allowed us to reduce the size of the scripts to 26-84% of the original versions (min+gzip compared to dev+gzip)
 and as a result, reduce the scripts download time. The dev versions (non-minified) of these files are located in /sdk/v3/dev/
 directory (note the "dev" path). The downside of the minification might be the fact that it's inconvenient to debug JS code
 on the site where the app was installed if you don't have access to the source code to switch the minified scripts to development
 versions (for example - any customer's site). Through the instrumentality of SDK dependencies management architecture we were able
 to overcome this problem and added the ability to specify which version you want to download without changing the source code.
 The loader mechanism can recognize certain flags which you can pass through the URL fragment/anchor.
 The value of the flag is saved in a cookie and the loader will use it later to download the corresponding
 minified or development version of the particular script. If there is no cookie defined - the minified versions
 will be used by default. More information about the specifics of the minified -> development scripts switch mechanics can be found in our docs center here:
http://echoappsteam.github.io/js-sdk/docs/#!/guide/terminology-section-minified-scripts-and-debugging

- URL placeholders such as {sdk} and {apps} were removed from the code. Now URLs should use the "cdnBaseURL"
configuration parameter of the Echo.Control class. This parameter was introduced in the SDK v3.0.3 release.
See more information about it  in our documentation center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-cfg-cdnBaseURL
Note that Echo.Loader.getURL function was modified to handle relative URLs to SDK resources. More details here:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-getURL .
So if you use these placeholders you should perform some changes using the following rules:
    - Inside the component templates or dependency URLs you should use the {config:cdnBaseURL.sdk} and {config:cdnBaseURL.apps} placeholders instead of {sdk} and {apps} respectively.
    - In other cases you can use Echo.Loader.getURL function providing it with a relative URL to resource. URL is relative to http://cdn.echoenabled.com/sdk/v3/ folder.<br><br>

- The Echo.Cookie class was added to SDK libraries suite. It provides the number of setter
and accessor operations which allow to work with cookies (get/set/remove). The class is used to
power the minified vs development script modes switch state, but you can start using it to work
with cookies in your code. It's available by including the http://cdn.echoenabled.com/sdk/v3/loader.js file.
Documentation for the Echo.Cookie class is available in our documentation center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Cookie

- New items animation machinery was introduced in the Stream control. Powered by native CSS 3
transitions new items come into the stream as live updates fading out more smoothly.
Previously the jQuery plugin was used to power the fading out effect. For the browsers without
the CSS 3 transitions support (IE < 10) the background color of the item is changed from the "flash"
color to the original one without the animation.

- The contract of "set", "get" and "remove" functions of the Echo.Utils library was slightly updated.
Now the "set" and "remove" functions return the boolean result of the operation (true/false).
The "get" function now returns the default value in case the key or the source object is
missing (used to return the source object before).
More information about the above mentioned functions can be found in our documentation center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-set
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-get
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-remove

- A couple of issues were fixed in the $.echoModal class. Now the closing modal form action should not
cause errors in IE browsers. Also the issue with the redundant iframe content loading after closing the
modal form was fixed.

- A new "hasCSS" method was added into the Echo.Utils library to check whether the given set of the CSS styles
was already added into the page. The function was employed in the internal factory class which assembles
the JS class using the manifest declaration. It prevent the same CSS rules from being processed for each instance.
This modification contributes to the SDK performance improvement.
More information about the Echo.Utils.hasCSS function can be found in our doc center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-hasCSS

- The Echo.Utils.timestampFromW3CDTF function internal machinery was updated to use the natively supported
Date JS class functions first before switching to the home-grown implementations (for the browsers which doesn't
recognize the W3CDTF format in some cases). This helped us to improve the function performance and gave a complete
W3CDTF date and time format compliance.

- The relative time calculation logic was extracted from the Echo.StreamServer.Controls.Stream.Item control and placed to
the Echo.Control class to provide an ability for any control/plugin/app to use it.
More information about the newly added "getRelativeTime" method can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-static-method-getRelativeTime

- The internal machinery which generates the JS class from the manifest was updated to define the set of
default language vars once during the JS class generation rather than adding the same set of labels every
time during the class instance initialization.

- The "available" static method of the Echo.API.Transports.XDomainRequest object was extended to check
the certain conditions when XDomainRequest can not be used. The XDomainRequest can not be used when:
    - the method other than GET or POST is used for the request
    - the request protocol doesn't match the caller page protocol (for example, the XDomainRequest can not be
executed if the URL with HTTP protocol is requested within the HTTPS page and vice versa)<br><br>

- The problem with the PinboardVisualization plugin on high-velocity stream was fixed. In some case,
when we receive duplicate items from the server, the activity application mechanism wasn't working correctly and
the animation queue got stuck. The issue is now fixed and tested with both slow and high velocity streams.
Also we updated the Isotope library (which powers the PinboardVisualization rendering mechanics) from 1.5.19 to 1.5.21 version,
which should slightly improve the rendering performance and stability for the streams with the PinboardVisualization enabled.

## v3.0.3 - Nov 13, 2012

- We employed the Bootstrap Modal dialog to display popups. The previously used jQuery Fancybox
was removed from the code base, since it's no longer required. If you use the $.fancybox calls
in your code, please update them employing the $.echoModal library. Example of the library usage
can be found in the Echo.IdentityServer.Control.Auth and Echo.StreamServer.Controls.Submit applications.

- The Bootstrap libraries assembling procedure was updated. Now the Bootstrap lib is represented
as one JS file instead of 2-3 JS and CSS files. The CSS code and extra JS wrappers were packaged
into a single JS file. The CSS rules required for the Bootstrap component are inserted into the page
using the standard Echo.Utils.addCSS function. It helped to reduce the amount of resources required
to load the SDK which reduces the SDK loading time. Please check the "dependencies" section of your App,
Control and Plugin manifests and remove the Bootstrap CSS files usage required for Echo Bootstrap components.

- The interface of the Echo.StreamServer.Controls.Stream.onDataReceive event was updated. Now the "onDataReceive"
handlers are called with the new parameter "type" instead of "initial". This parameter specifies
the origin of data request and provides the ability to identify event producers more precise. More information
about the event and its new interface can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-event-onDataReceive

- The contract of the Echo.Utils.loadImage was updated. Now the function accepts one argument with
the object type. The "onload" and "onerror" callbacks were added as well to provide better flexibility
for the function users. More information about the function and its new contract can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-loadImage

- The Echo.Utils.parseURL function contract was slightly updated. Now an empty string is returned as a value
for the keys which represent the part which was not found in the URL, the "undefined" value was returned
previously in such cases. If you use this function in your code, please make check it and update accordingly.
More information about the Echo.Utils.parseURL function can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Utils-static-method-parseURL

- The Twitter Bootstrap UI framework was upgraded from 2.1.1 to 2.2.1 version.

- A new "title" configuration parameter was added for the Echo.IdentityServer.Controls.Auth control
to provide an ability to set the auth modal dialog title. More information about the new parameter
can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.IdentityServer.Controls.Auth-cfg-identityManager

- The "destroy" method called for the dependent control (i.e. when it was initialized within another control)
didn't clean up the target element, the target was cleared only in case the "destroy" was called for the top
level control. Now the target is cleared properly for the dependent controls when the "destroy" method is being called.

- Now the "templates.main" field in the Control or App manifest might be either a string or a function which generates
the template. It provides more flexibility for the templates generation based on the required conditions.

- The empty stream message was displayed incorrectly in case the PinboardVisualization plugin was enabled for the Stream
control. Now the PinboardVisualization plugin doesn't affect the info messages displayed in the Stream control.

- A new "removePersonalItemsAllowed" configuration parameter was added for the Moderation plugin to provide users
with the ability to delete their own items. More information about the new parameter can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.Moderation-cfg-removePersonalItemsAllowed

- The Echo.Utils.htmlize and Echo.Utils.stripTags functions logic was slightly updated. Now the functions process
the argument value only if it's a string type argument and return incoming argument value as is otherwise.

- The Echo.Utils.set function logic was optimized to work with plain keys, i.e. keys without nesting levels
(example of the plain keys: "key1", "key2"; example of the keys with the nesting levels: "key1.key2", "key3.key4.key5").
If the plain key is passed into the function, the part of machinery is not activated to speed up and simplify the process.

- The Echo.API lib and the respective StreamServer, IdentityServer, etc libs were improved by adding the condition
into the JS closure to exit the function in case the given class was already defined on the page.

- The logic of the Echo.API lib was updated to provide an ability to make cross domain AJAX requests using
the POST method. The HTTP method can be defined using the "method" parameter of the Echo.API object instance
creation. More information about the Echo.API lib can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.API.Request-cfg-method

- A new "settings" configuration parameter was added for the Echo.API library to provide an access to transport
object configuration. More information about the new configuration parameter can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.API.Request-cfg-settings

- A new "cdnBaseURL" configuration parameter was added for all Apps and Controls. The intention is to collect
different CDN base URLs used in the products built on top of the JS SDK in one single place for consistency purposes.
In addition to the new configuration parameter we updated the dependencies management mechanisms and provided
the ability to use the configuration parameters in the resource URLs. Now the "{config:someKey}" is available
for the URLs defined in the "dependencies" object of the App, Control or Plugin manifest. The idea is to use
the newly added "cdnBaseURL" configuration parameter values in the URLs to give more flexibility for the publishers
and developers to define the location of the resources and avoid the need to update the code itself in case
the base URL is changed. More information about the "cdnBaseURL" parameter can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Control-cfg-cdnBaseURL

- The internal machinery of the Echo.Utils.htmlTextTruncate function was updated to cache the generated
list of tags used inside the function to prevent the same set of tags generation each time the function is being called.

- The Echo.Utils.log function calls were added into several places where the function execution is stopped
due to the wrong incoming parameters. This should be very useful while developing the applications built on top
of the SDK v3. We will add more annotations like this as we move forward.

- The jQuery Easing plugin which was a dependency for the FancyBox plugin was removed, since it's no longer required
(since the FancyBox was replaced with the Bootstrap Modal).

## v3.0.2 - Oct 11, 2012

- the "Echo.StreamServer.Controls.Stream.Item.onReceive" event fired within
the Stream control, was renamed to the "Echo.StreamServer.Controls.Stream.onItemReceive".
Please rename the event if you use it somewhere in the code.

- the "liveUpdates" and "liveUpdatesTimeout" Stream control config options were
moved into the "liveUpdates" hash and became the "enabled" and "timeout" keys
respectively. The "liveUpdatesTimeoutMin" option was removed. More information
about the "liveUpdates" configuration option is available in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdates

- the "streamStateLabel" and "streamStateToggleBy" Stream control configuration
options were moved into the "state" hash and became the "label" and "toggleBy"
keys respectively. Documentation for the "state" option is available in our docs
center: http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-state

- the "Echo.Loader.download" function interface was updated. Now the function
accepts 3 arguments: resources to download, callback and the config. Previously
these arguments were specified as keys of the single object argument. Please update the "Echo.Loader.download"
function calls in your code. Updated information about the function is available in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.Loader-static-method-download

- the "More" button of the Stream control is now included into the Live/Pause
trigger area, if the "state.toggleBy" config option is defined as "mouseover"
(which is also a default value)

- a new "state.layout" configuration option was added into the Stream configuration.
If the "layout" is defined as "full" - the "apply update" button appears above the
Stream items list when the new item reaches the Stream as a live update. The user
can click on the button to reveal updates. Documentation for the "state.layout"option
is available in ours docs center: http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-state

- the animation of the new items (received as live updates in the Stream control) was
changed. Now the whole item container and its contents slide in together from the top
as a whole/complete thing

- now the publisher-defined and default configs are merged recursively to let the config
object contain the whole set of controls with the actual values

- the useless "whoami" request calls (when Backplane was not initialized on the page) within
the UserSession object are prevented

- the docs center was also updated. The "High-level overview", "Terminology and dev tips",
"How to develop a control", "How to develop a plugin" and the "How to develop an app" guides
were added. We’ll be working on ongoing basis to put more content into the guides

- now all entries (which represent Echo items) will be normalized before
the "Echo.StreamServer.Controls.Stream.onDataReceive" event publishing from
within the Stream control. Also it is now published for each live update in addititon
to initial data loading and "more" data loading

- new "itemsComparator" configuration parameter was added for the Stream control to provide
an ability to sort the items in a custom order. More information about the configuration
parameter can be found in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-itemsComparator


## v3.0.1 - Sep 26, 2012

- the "Echo.Product" class was renamed to "Echo.App".

- the "empty" type used inside the "Echo.Control.showMessage" function
argument was renamed to "info" to be control-agnostic.

- the "Echo.Utils.objectToQuery" function was removed from the public
interface and became the Echo.API library internal facility.

- the "Echo.App.isDefined" and the "Echo.Control.isDefined" functions
were added to check if the app or the control class was defined. These
functions replaced the "Echo.Utils.isComponentDefined" calls in the
control and app scripts.

- the "Echo.Utils.getNestedValue", "Echo.Utils.setNestedValue" and the
"Echo.Utils.removeNestedValue" functions were renamed to the
"Echo.Utils.get", "Echo.Utils.set" and the "Echo.Utils.remove"
respectively.

- the "errorPopup" configuration parameter was added to the
Echo.StreamServer.Controls.Submit control to provide an ability to
define the necessary dimensions for the error message popup raised by
the Submit form in case of error. Documentation for the "errorPopup"
option is available in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit-cfg-errorPopup.

- jQuery library was upgraded from 1.8.1 to 1.8.2 version.

- QUnit library powering the tests infrastructure was upgraded from
1.3.0 to 1.10.0 version.

- the controls are now disabled correctly after the tests were
finished. Previously the controls on the page were producing useless
live update requests.

- new "Echo.Utils.remove" function added to remove a given field in a
given object at any nested level.

- missing dependencies added to the "CommunityFlag", "Edit", "Reply"
and "Like" plugins.

- fixed the race-condition issue in the "TwitterIntents" plugin (IE 7
and 8 were affected).

- implemented CORS support on the transport layer for IE 7 and 8.

- "connection_failure" error is now handled correctly during API
recurring requests.

- fixed the issue which prevents the values like false, null,
undefined, 0 or "" from being defined as the Echo.UserSession instance
field value.

- the "defaultAvatar" option was added to the Stream, Submit, Auth and
FacePile controls. Now you can define the avatar URL to be used as a
default one in the control UI. Documentation for the "defaultAvatar"
option is available in our docs center:
http://echoappsteam.github.io/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-defaultAvatar

- the "getComponent" function was added to the "Echo.App" class to
provide the ability to access the component by its internal (for the
given App) name.

- fixed the CSS dependencies loading logic used in the Echo.Loader class.

## v3.0.0 - Sep 12, 2012

- Initial SDK release
