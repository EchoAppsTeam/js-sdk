# Terminology and dev tips 

## Overview

This guide contains the definition of the terms widely used across different JS SDK areas.

## Terms

### Renderer

The appearance of an application can be considered as a composition of its visual components, which are in fact DOM elements with its own structure. Function which produces specific component or modifies it is called *Renderer* and is in fact the minimal entity in terms of Echo component visual design.

### Manifest

Manifest is ...

### Control

Control is ...

### Plugin

Plugin is an object with the predefined structure which extends the default functionality of an application or its components.

### Application (aka App)

Application is ...

### Loader

Loader is ...

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
