# Terminology and dev tips

## Overview

This guide contains the definition of the terms used throughout the JS SDK docs, various development tips and a description of core SDK concepts.

## Terms

### Definition

The unified structure which describes a certain application, application or a plugin is called a *definition*. Each component type has a special "definition" function (Echo.App.definition and Echo.Plugin.definition) to generate an empty *definition* skeleton which can be filled in with the business logic. In addition to the "definition" function, there is a set of "create" functions to turn static definition into the JS classes (Echo.App.create and Echo.Plugin.create). More information about the use of the *definition* can be found in the [Contol](#!/guide/how_to_develop_application), [Plugin](#!/guide/how_to_develop_plugin) or [App](#!/guide/how_to_develop_app) development guides.

### Application (aka App)

*Application* (or *App*) is a JavaScript class with the pre-defined structure (generated out of the app definition) which can represent a certain set of discrete functionality or combine multiple apps and plugins into a package to achieve a certain functionality. Application examples: {@link Echo.StreamServer.BundledApps.Stream.ClientWidget Stream application}, {@link Echo.StreamServer.BundledApps.Submit.ClientWidget Submit application}, {@link Echo.StreamServer.BundledApps.Auth.ClientWidget Auth application}, etc. More information about the App development can be found in [the hands-on guide](#!/guide/how_to_develop_app).

### Plugin

*Plugin* is a JavaScript class with the pre-defined structure (generated out of the plugin definition) which extends a certain part of an App. Plugin examples: {@link Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Reply Reply}, {@link Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Edit Edit}, {@link Echo.StreamServer.BundledApps.Stream.Item.ClientWidget.Plugins.Like Like}. More information about the Plugins development can be found in [the hands-on guide](#!/guide/how_to_develop_plugin).

### Renderer

The appearance of an application can be considered as a composition of its visual components, which are in fact DOM elements with its own structure. Function which produces specific component or modifies it is called *Renderer* and is in fact the minimal entity in terms of Echo component visual design.

## Creating a JavaScript closure for the components and jQuery plugins

Any Echo JS SDK component should be placed to a separate JS closure to provide a unique namespace for the component and avoid code intersection.

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component or jQuery plugin code goes here

	})(Echo.jQuery);

Due to the fact that Echo JS SDK uses a separate jQuery instance (available as Echo.jQuery), we pass the Echo.jQuery reference as the anonymous function argument and accept is as jQuery variable. In addition to that we add the $ variable and link it to the same jQuery reference. So inside the JS closure both "jQuery" and "$" vars are available, like on a regular page with the jQuery lib included.

Also we add the directive to switch the JS code execution to the strict mode (*"use strict"*). It helps to avoid the mistakes (such as using the global vars in inappropriate places, etc) while developing the code + the code which works in the strict mode will be minified without any issues.

## Rendering engine

Rendering is the process of transformation from declarative templates, css rules and renderer handlers to the complete DOM structures. Basically one has to create an Echo template (just a HTML structure with some meta placeholders actually), add a bunch of renderer functions and call the `render` method of Echo.View class.

### Echo HTML Templates

Echo HTML template is a HTML declarative structure with placeholders in curly brackets.

	var template =
		'<span class="{class:container}">' +
			'<span class="{class:avatar}">' +
				'<img src="{self:avatar}">'
			'</span>' +
			'<span class="{class:title}">{label:title} - {data:title}</span>' +
		'</span>';


There are several types of placeholders:

+ {class:KEY} - the placeholder will be replaced with the auto generated CSS class name + the KEY value
+ {label:KEY} - the placeholder to access the corresponding label text using the KEY as a key
+ {self:KEY}  - provides the ability to access the component field using the KEY as a key
+ {config:KEY} - the placeholder to access the config value using the KEY as a key
+ {data:KEY} - the placeholder to be replaced with a value from the object provided as an argument

### Echo CSS Templates

Echo CSS template is a CSS declarative structure with placeholders in curly brackets.

	var css = 
		'.{class:avatar} img { width: 16px; height: 16px; margin: 3px; }' +
		'.{class:container}, .{class:container} span { white-space: nowrap; }' +
		'.{class:title} { font-weight: bold; }';

### Echo Renderer functions

Echo renderer function is a javascript function with fixed interface which produces or modifies the particular DOM element.

	var renderer = function(element) {
		if (condition) {
			element.empty().append(title));
		} else {
			element.hide();
		}
		return element;
	};

## Minified scripts and debugging

All the files in the _http://cdn/echoenabled.com/sdk/v3/_ directory are minified using UglifyJS. Dev versions (non-minified) of these files are located in _/sdk/v3/dev/_ directory.
By default all dependencies specified in the source code will be downloaded minified but there is a way to specify which version to download. Here it is:

1. if page includes **/sdk/v3/dev/loader.js** then dev versions will be used else go to 2.
2. if URL contains **echo.debug:true** or **echo.debug:false** after # (known as fragment/anchor) then we save its value in the special **echo-debug** cookie and:

    &bull; use dev versions if **echo.debug:true**;
    &bull; use min versions if **echo.debug:false**;
    &bull; go to 3 otherwise.<br><br>

3. If cookie with the name **echo-debug** exists and its value is _true_ then we use dev versions.
