# High-level overview

## Mission

Echo JavaScript SDK aims to help developers to build real-time social apps on top of Echo Platform in an interoperable manner by providing the unified app structure and facilitating the most common aspects of apps development, such as Echo API interface, app configuration, dependencies, extensibility via plugins, general app deployment, etc.

## Terminology

This guide operates the terms described in the ["Terminology" guide](#!/guide/terminology), please refer to this guide to find more information about the JS SDK terms.

## Unified declarative components structure

In order to provide the interoperability between different components built by different developers, we introduced the notion of component manifest, which describes the main aspects of the component, such as templates, renderers, event, etc. This unified component definition helps with the plugins development as well, since any control or app built by any developer should follow the same rules. More information about the manifest format can be found in the hands-on guides:

- [How to develop a control](#!/guide/how_to_develop_control)
- [how to develop a plugin](#!/guide/how_to_develop_plugin)
- [How to develop an app](#!/guide/how_to_develop_app)

## Opensourced SDK code

The code of the Echo JS SDK is opensourced, so you can monitor and participate in the SDK development.

## UI framework

Echo JS SDK v3 uses [Twitter Bootstrap](http://twitter.github.com/bootstrap/) as the new UI framework. Employing an industry-standard UI framework with well defined UI rules, should help the apps look stylish and unified, yet provide a lot of room for the customizations.

## Tests infrastructure

Quality of the code is what we keep in mind every day while working with the code. In order to achieve the best quality, 100% of the JS SDK public interfaces and a huge amount of internal interfaces were covered by the tests. The SDK tests can be executed [here](http://echoappsteam.github.com/js-sdk/tests/).

## Documentation

The JS SDK code contains the inline documentation for all the public interfaces. The HTML representation of the inline documentation is also available in our [Documentation Center](http://echoappsteam.github.com/js-sdk/docs/).

## SDK building blocks

The SDK libraries can be divided into 2 main groups:

- core components
- server-specific controls and plugins


#### The first group is the core SDK libs which serves as a base for all other components:

### [Echo.API](#!/api/Echo.API.Request)

A separate transport layer to communicate with Echo API endpoints.

### [Echo.Configuration](#!/api/Echo.Configuration)

Class which implements the interface for convenient work with different configurations.

### [Echo.Events](#!/api/Echo.Events)

Library for exchanging messages between components on the page. It also provides external interface for users to subscribe to a certain events (like "app was rendered", "user logged in", etc).

### [Echo.Labels](#!/api/Echo.Labels)

Class implements the language variables mechanics across the components.

### [Echo.UserSession](#!/api/Echo.UserSession)

Class which implements the interface to work with the user object. The Echo.UserSession class is used in pretty much all applications built in top of Echo JS SDK.

### [Echo.Utils](#!/api/Echo.Utils)

Static class implements common methods of data processing. The Echo.Utils class is used in various places of Echo JS SDK components.

### [Echo.View](#!/api/Echo.View)

Class implementing core rendering logic, which is widely used across the system. In addition to the rendering facilities, this class maintains the list of elements within the given view ("view elements collection") and provides the interface to access/update them.

### [Echo.Loader](#!/api/Echo.Loader)

Class which contains the logic for downloading JS and CSS dependencies and works to retrieve app configuration from the AppServer and init an application(s).

### [Echo.Control](#!/api/Echo.Control)

Foundation class implementing core logic to create controls and manipulate with them. See the "control" definition in the ["Terminology" guide](#!/guide/terminology).

### [Echo.Plugin](#!/api/Echo.Plugin)

Foundation class implementing core logic to create plugins and manipulate with them. See the "plugin" definition in the ["Terminology" guide](#!/guide/terminology).

### [Echo.App](#!/api/Echo.App)

Foundation class implementing core logic to create applications. See the "application" definition in the ["Terminology" guide](#!/guide/terminology).

### Echo.jQuery

The separate jQuery instance used in all Echo JS SDK components.

#### The second group is the set of server-specific controls:

### [Echo.StreamServer.Controls.Stream](#!/api/Echo.StreamServer.Controls.Stream)

Echo Stream control which encapsulates interaction with the Echo Search API.

### [Echo.StreamServer.Controls.Submit](#!/api/Echo.StreamServer.Controls.Submit)

Echo Submit control which encapsulates interaction with the Echo Submit API.

### [Echo.StreamServer.Controls.Counter](#!/api/Echo.StreamServer.Controls.Counter)

Echo Counter class which encapsulates interaction with the Echo Count API

### [Echo.StreamServer.Controls.FacePile](#!/api/Echo.StreamServer.Controls.FacePile)

Echo FacePile control displays users (actors) returned in any activity stream.

### [Echo.IdentityServer.Controls.Auth](#!/api/Echo.IdentityServer.Controls.Auth)

Echo Auth control displays user login status and allows to sign in using different social identities.
