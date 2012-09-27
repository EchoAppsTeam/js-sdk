# Terminology and dev tips

## Overview

This guide contains the definition of the terms widely used across different JS SDK areas, various development tips and description of the SDK concepts.

## Terms

### Manifest

The unified structure which describes a certain application, control or a plugin is called a *manifest*. Each component type has a special "manifest" function ([Echo.Control.manifest](#!/api/Echo.Control-static-method-manifest), [Echo.Plugin.manifest](#!/api/Echo.Plugin-static-method-manifest), [Echo.App.manifest](#!/api/Echo.App-static-method-manifest)) to generate an empty *manifest* skeleton which can be filled in with the business logic. In addition to the "manifest" function, there is a set of "create" functions to turn static definition into the JS classes ([Echo.Control.create](#!/api/Echo.Control-static-method-create), [Echo.Plugin.create](#!/api/Echo.Plugin-static-method-create) and [Echo.App.create](#!/api/Echo.App-static-method-create)). More information about the use of the *manifest* can be found in the [Contol](#!/guide/how_to_develop_control), [Plugin](#!/guide/how_to_develop_plugin) or [App](#!/guide/how_to_develop_app) development guides.

### Control

*Control* is a JavaScript class with the pre-defined structure (generated out of the control manifest) which represents a certain set of discrete funcitonality. Control examples: [Stream control](#!/api/Echo.StreamServer.Controls.Stream), [Submit control](#!/api/Echo.StreamServer.Controls.Submit), [Auth control](#!/api/Echo.IdentityServer.Controls.Auth), etc. More information about the Controls development can be found in [the hands-on guide](#!/guide/how_to_develop_control).

### Plugin

*Plugin* is a JavaScript class with the pre-defined structure (generated out of the plugin manifest) which extends a certain part of a Control or an App. Plugin examples: [Reply](#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.Reply), [Edit](#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.Edit), [Like](#!/api/Echo.StreamServer.Controls.Stream.Item.Plugins.Like). More information about the Plugins development can be found in [the hands-on guide](#!/guide/how_to_develop_plugin).

### Application (aka App)

*Application* (or *App*) is a JavaScript class with the pre-defined structure (generated out of the app manifest) which combines multiple controls and plugins into a package to achieve a certain functionality. More information about the Apps development can be found in [the hands-on guide](#!/guide/how_to_develop_app).

### Renderer

The appearance of an application can be considered as a composition of its visual components, which are in fact DOM elements with its own structure. Function which produces specific component or modifies it is called *Renderer* and is in fact the minimal entity in terms of Echo component visual design.

## Creating a JavaScript closure for the components

Any Echo JS SDK component should be placed to a separate JS closure to provide a unique namespace for the component and avoid code intersection.

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Due to the fact that Echo JS SDK uses a separate jQuery instance (available as Echo.jQuery), we pass the Echo.jQuery reference as the anonymous function argument and accept is as jQuery variable. In addition to that we add the $ variable and link it to the same jQuery reference. So inside the JS closure both "jQuery" and "$" vars are available, like on a regular page with the jQuery lib included.

Also we add the directive to switch the JS code execution to the strict mode ("user strict"). It helps to avoid the mistakes (such as using the global vars in inappropriate places, etc) while developing the code + the code which works in the strict mode will be minified without any issues.

## Rendering engine

How the rendering works...
