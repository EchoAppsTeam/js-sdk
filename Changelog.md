# Echo JS SDK CHANGELOG:

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
option is available in ours docs center:
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
option is available in ours docs center:
http://echoappsteam.github.com/js-sdk/docs/#!/api/Echo.StreamServer.Controls.Stream-cfg-defaultAvatar

- the "getComponent" function was added to the "Echo.App" class to
provide the ability to access the component by its internal (for the
given App) name.

- fixed the CSS dependencies loading logic used in the Echo.Loader class.

## v3.0.0 - Sep 12, 2012

- Initial SDK release