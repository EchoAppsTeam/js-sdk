# Echo JS SDK CHANGELOG:

## v3.0.2 - Oct 11, 2012

- the "Echo.StreamServer.Controls.Stream.Item.onReceive" event fired within
the Stream control, was renamed to the "Echo.StreamServer.Controls.Stream.onItemReceive".
Please rename the event if you use it somewhere in the code.

- the "liveUpdates" and "liveUpdatesTimeout" Stream control config options were
moved into the "liveUpdates" hash and became the "enabled" and "timeout" keys
respectively. The "liveUpdatesTimeoutMin" option was removed. More information
about the "liveUpdates" configuration option is available in our docs center:
http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-liveUpdates

- the "streamStateLabel" and "streamStateToggleBy" Stream control configuration
options were moved into the "state" hash and became the "label" and "toggleBy"
keys respectively. Documentation for the "state" option is available in our docs
center: http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-state

- the "Echo.Loader.download" function interface was updated. Now the function
accepts 3 arguments: resources to download, callback and the config. Previously
these arguments were specified as keys of the single object argument. Please update the "Echo.Loader.download" function calls in your code. Updated information about the function is available in our docs center: http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.Loader-static-method-download

- the "More" button of the Stream control is now included into the Live/Pause
trigger area, if the "state.toggleBy" config option is defined as "mouseover"
(which is also a default value)

- a new "state.layout" configuration option was added into the Stream configuration.
If the "layout" is defined as "full" - the "apply update" button appears above the
Stream items list when the new item reaches the Stream as a live update. The user
can click on the button to reveal updates. Documentation for the "state.layout"option
is available in ours docs center: http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-state

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
http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-itemsComparator


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
http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Submit-cfg-errorPopup.

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
http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-defaultAvatar

- the "getComponent" function was added to the "Echo.App" class to
provide the ability to access the component by its internal (for the
given App) name.

- fixed the CSS dependencies loading logic used in the Echo.Loader class.

## v3.0.0 - Sep 12, 2012

- Initial SDK release
