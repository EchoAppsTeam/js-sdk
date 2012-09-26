# How to develop an application

Echo JS SDK allows to create complex applications based on Echo Control. This page will guide you through the steps of custom Application creation.

## Introduction

Application is an object with the predefined structure which allows to work with Echo Controls as with single component.

Let's imagine that we want to create the application for posting and viewing comments on a website.

## Creating the Application skeleton

First of all, let's prepare the JavaScript closure to allocate a separate namespace for our application's code. This step is common for all apps, controls and plugins built on top of the JS SDK. You can find the detailed information on how to create the JS closure in the ["Terminology and dev tips" guide](#!/guide/terminology-section-3). So we have the following code as a starting point:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Now let's add the application definition. Echo JS SDK contains a special Echo.App class to facilitate the application creation, we'll use some functions to add the application definition:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var Comments = Echo.App.manifest("Echo.Apps.CommentsSample");

    if (Echo.App.isDefined("Echo.Apps.CommentsSample")) return;

	Echo.App.create(Comments);

	})(Echo.jQuery);

So we've called the "Echo.App.manifest" function, passed the name of the application. We checked whether the application was already initialized or not, to avoid multiple application re-definitions in case the application script was included into the application source several times. After that we passed the manifest generated into the Echo.App.create function to generate the application JS class out of the static manifest declaration.

At that point we can consider the application skeleton ready and start adding the business logic into it.

## Application configuration

Let's assume that we need a configuration parameter for our application to define where be position of submit form. Also we want to define a default value of the parameter in case it is omitted in the application configuration while installing it to a website. In order to do it we should add the "config" object to the application manifest with the name of the config field as a key and a default as its value, so the code of the application will look like:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var Comments = Echo.App.manifest("Echo.Apps.CommentsSample");

    if (Echo.App.isDefined("Echo.Apps.CommentsSample")) return;

    Comments.config = {
		"submitFormPosition": "top" // top | bottom
    };

	Echo.App.create(Comments);

	})(Echo.jQuery);

If we need more options in future, they can be appended as additional fields into the "config" hash.

Now everywhere in the application's code we'll be able to use the following call:

	@example
	this.config.get("submitFormPosition"); // assuming that "this" points to the application instance

to get the value of the "submitFormPosition" config parameter defined during the plugin installation or to access the default value otherwise. Note: the "this" var should point to the application instance.

## Application template

Ok, now it's time to create the application UI.

The first steps is to prepare a template which should be appended into page of website. Due to the fact that the template for our application depends on configuration of application, we'll create two template and will dynamically choose the template to use, for example as shown below:

	@example
	Comments.templates.topSubmitFormPosition =
		'<div class="{class:container}">' +
			'<div class="{class:auth}"></div>' +
			'<div class="{class:submit}"></div>' +
			'<div class="{class:stream}"></div>' +
		'</div>';

	Comments.templates.bottomSubmitFormPosition =
		'<div class="{class:container}">' +
			'<div class="{class:auth}"></div>' +
			'<div class="{class:stream}"></div>' +
			'<div class="{class:submit}"></div>' +
		'</div>';

	Comments.methods.template = function() {
		return this.templates[
			this.config.get("submitFormPosition") + "SubmitFormPosition"
		];
	};
