# How to develop a control

Echo JS SDK alows to create JS Class called Echo Control which provides ability to quickly assembling app leveraging any data in the Echo platform. This page will guide you through the steps of custom control creation.

## Introduction

Control is a JavaScript class with the pre-defined structure (generated out of the control manifest) which represents a certain set of discrete funcitonality.

Let's imagine that we want to create the control for displaying a number of items that match the specified query.

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

So we've called the ["Echo.Control.manifest"](#!/api/Echo.Control-static-method-manifest) function, passed the name of the control as argument. We checked whether the control was already initialized or not, to avoid multiple control re-definitions in case the control script was included into the page source several times. After that we passed the manifest generated into the [Echo.Control.create](#!/api/Echo.Control-static-method-create) function to generate the control JS class out of the static manifest declaration.

At that point we can consider the control skeleton ready and start adding the business logic into it.

## Control init function

In most of cases we need to prepare control when other dependent components or actions are initialized. For this case we need to define init function which provide an ability to reflect control states according to existing control data. In our case data can be defined explicitly and in this case we do not make API request, in another case we need it. Let's try to define this function:

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
