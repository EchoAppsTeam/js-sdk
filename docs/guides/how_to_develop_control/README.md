# How to develop a control

Echo JS SDK provides the ability to package a certain set of the discrete functionality allows into a JavaScript class which is called the *Control* in the SDK terminology. This page will guide you through the steps of custom control creation.

## Introduction

Let's imagine that we want to create the control for displaying a number of items matching the specified query.

## Creating the control skeleton

First of all, let's prepare the JavaScript closure to allocate a separate namespace for our control's code. This step is common for all controls. You can find the detailed information on how to create the JS closure in the ["Terminology and dev tips" guide](#!/guide/terminology-section-3). So we have the following code as a starting point:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Now let's add the control definition. Echo JS SDK contains a special [Echo.Control](#!/api/Echo.Control) class to facilitate the control creation, we'll use some functions to add the control definition:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.Control.manifest("Echo.StreamServer.Controls.Counter");

	if (Echo.Control.isDefined(counter)) return;

	Echo.Control.create(counter);

	})(Echo.jQuery);

We called the ["Echo.Control.manifest"](#!/api/Echo.Control-static-method-manifest) function and passed the name of the control as an argument. We checked whether the control was already initialized or not, to avoid multiple control re-definitions in case the control script was included into the page source several times. After that we passed the manifest generated into the [Echo.Control.create](#!/api/Echo.Control-static-method-create) function to generate the control JS class out of the static manifest declaration.

At that point we can consider the control skeleton ready and start adding the business logic into it.

## Control init function

There are 2 possible scenarios of our control initialization:

- when there is no data available and we need to make an API call to get it

- when the data is here and we just need to render it (it's usually the case when we count the items which were already delivered to the client side or we request the data during another API call, for example by making a "mux" request)

In order to fulfill both use-cases we need to add the corresponding check into the control initialization function, for example as shown below:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.Control.manifest("Echo.StreamServer.Controls.Counter");

	if (Echo.Control.isDefined(counter)) return;

	counter.init = function() {
		// data can be defined explicitly
		// in this case we do not make API requests
		if ($.isEmptyObject(this.get("data"))) {
			this._request();
		} else {
			this.render();
			this.ready();
		}
	};

	Echo.Control.create(counter);

	})(Echo.jQuery);

## Control configuration

## Adding helper methods

## Control Installation

## Complete control source code

## More examples
