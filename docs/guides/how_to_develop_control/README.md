# How to develop an application

## Overview

Echo JS SDK provides the ability to package a certain set of discrete functionality into a JavaScript class which is called an Application. Applications are typically core interaction patterns like a submit form, stream client etc. Applications are then used by Applications to deliver a complete user experience. This page will guide you through the steps of custom application creation. For more examples of applications please visit the [Examples Page](#!/example).

## Introduction

Let's imagine that we want to create the application for displaying a number of items matching the specified query.

## Creating the application skeleton

First of all, let's prepare the JavaScript closure to allocate a separate namespace for our application's code. This step is common for all applications. You can find the detailed information on how to create the JS closure in the ["Terminology and dev tips"](#!/guide/terminology-section-creating-a-javascript-closure-for-the-components-and-jquery-plugins) guide. So we have the following code as a starting point:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Now let's add the application definition. Echo JS SDK contains a special Echo.App class to facilitate the application creation, we'll use some functions to add the application definition:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.App.definition("Echo.StreamServer.BundledApps.Counter.ClientWidget");

	if (Echo.App.isDefined(counter)) return;

	Echo.App.create(counter);

	})(Echo.jQuery);

We called the Echo.App.definition function and passed the name of the application as an argument. We checked whether the application was already initialized or not, to avoid multiple application re-definitions in case the application script was included into the page source several times. After that we passed the definition generated into the Echo.App.create function to generate the application JS class out of the static definition declaration.

At that point we can consider the application skeleton ready and start adding the business logic into it.

## Application init function

There are 2 possible scenarios of our application initialization:

- when there is no data available and we need to make an API call to get it

- when the data is here and we just need to render it (it's usually the case when we count the items which were already delivered to the client side or we request the data during another API call, for example by making a "mux" request)

In order to fulfill both use-cases we need to add the corresponding check into the application initialization function, for example as shown below:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.App.definition("Echo.StreamServer.BundledApps.Counter.ClientWidget");

	if (Echo.App.isDefined(counter)) return;

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

	Echo.App.create(counter);

	})(Echo.jQuery);

So, if the data parameter is empty we should fetch it from the server through the Echo.StreamServer.API.Request class. Definition of the _request method will be described below. Else, if the data parameter is defined, we should {@link Echo.App#render "render"} application and call {@link Echo.App#ready "ready"} method to detect that application is ready. All functions that defined in the definition namespace have application context (this variable pointed to application instance) if it this is not described explicit.

## Application configuration

Most of applications should contain several configuration parameters that defines an application behavior, state etc. Also we want to define a default value of the parameters in case it is omitted in the application configuration while installing it. In order to do it we add the "config" object to the application definition with the name of the config field as a key and a default as its value, so the code of the application will look like:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.App.definition("Echo.StreamServer.BundledApps.Counter.ClientWidget");

	if (Echo.App.isDefined(counter)) return;

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

	counter.config = {
		"data": undefined,
		"liveUpdates": {
			"enabled": true,
			"timeout": 10
		},
		"infoMessages": {"layout": "compact"}
	};

	Echo.App.create(counter);

	})(Echo.jQuery);

If we need more options in future, they can be appended as additional fields into the "config" hash.
Let's describe config parameters:

- "data" defines a default value that used to display items count;
- "liveUpdates" defines a timeout that used by the Echo.StreamServer.API.Request class for the recurring server request for data. This parameter is described {@link Echo.StreamServer.BundledApps.Counter.ClientWidget#cfg-liveUpdates here};
- "infoMessages" defines messages layout for application. This parameter is described {@link Echo.App#cfg-infoMessages here}

Now everywhere in the application's code we'll be able to use the following call:

	this.config.get("liveUpdates"); // assuming that "this" points to the application instance

to get the value of the "liveUpdates" config parameter or any other defined during the application installation or to access the default value otherwise. Note: the "this" var should point to the application instance.

## Defining application template

Now we can define html template for the application UI. It should be a string value which may contains html elements (DOM structure) and placeholder. According to application initialization this value will be compiled by the Echo.App.substitute method. This method compiles placeholders to the string values.
There's two ways for the template defining:

- we can pass to the definition object value "template" which is function. This function can prepare a template string and should return it. Returned value will be compiled;
- we can pass a "templates" object that can contains a several templates by the "templates" object key. By default, if template value is omitted in the definition, will be used templates.main value;

In our case we need a simple template which contains a count items number. Let's put the template into application's code:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.App.definition("Echo.StreamServer.BundledApps.Counter.ClientWidget");

	if (Echo.App.isDefined(counter)) return;

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

	counter.config = {
		"data": undefined,
		"liveUpdates": {
			"enabled": true,
			"timeout": 10
		},
		"infoMessages": {"layout": "compact"}
	};

	counter.templates.main = "<span>{data:count}</span>";

	Echo.App.create(counter);

	})(Echo.jQuery);

Important note: as you can see, the template contains the placeholder "{data:count}". This placeholder will be processed by the template engine (due to "substitute" method describes above) before thw template is inserted into application UI. You can find the general description of the rendering engine in the ["Terminlogy and dev tips"](#!/guide/terminology) guide. In addition to the basic placeholders supported by the rendering engine, the base applications functionality also provides the ability to define the following placeholders:

- {class:KEY} - the placeholder will be replaced with the CSS class name + the KEY value
- {label:KEY} - the placeholder to access the corresponding label text using the KEY as a key
- {config:KEY} - the placeholder to access the config value using the KEY as a key
- {self:KEY} - provides the ability to access the application field using the KEY as a key

## Adding helper methods

Now we can define a helper functions which will be doing some actions. For example: for sending request to the server we should define helper function. There is a special place for the helper functions in the application definition: it's called the "methods" object. The method to sending request might look like:

	counter.methods._request = function() {
		var request = this.get("request");
		if (!request) {
			request = Echo.StreamServer.API.request({
				"endpoint": "count",
				"data": {
					"q": this.config.get("query"),
					"appkey": this.config.get("appkey")
				},
				"liveUpdatesTimeout": this.config.get("liveUpdates.timeout"),
				"recurring": this.config.get("liveUpdates.enabled"),
				"onError": $.proxy(this._error, this),
				"onData": $.proxy(this._update, this)
			});
			this.set("request", request);
		}
		request.send();
	};

Few important notes here:

- we added the underscore before the name of the function to indicate that this function is private and nobody should call it outside the application's code

- we try to get request object using the Echo.App.get method. This object should be instantiated from Echo.StreamServer.API.Request class to request the number of items. We use a static Echo.StreamServer.API.request method for that. After request object definition we store it in the internal variable using the Echo.App.set method.

- the "\_request" function will be available in the application's code as "this.\_request()", assuming that "this" points to the application instance

As you can see, in the request object definition we defining handlers "onError" and "onData" which executed by request object. This handlers we can define also through helper methods. "onData" event we should compare current count number with responsed count number and reflect it by displaying instead, and "onError" we have some cases to reflect it:

- if "errorCode" field of the responsed JSON object equals "more_than", then we should displaying it without any extra information such as error indication

- if we get another "errorCode" we can reflect it by the type of error (critical or not) and request type. This request options defined in the Echo.API.Transport class.

Let's try to defining these methods:

	counter.methods._update = function(data) {
		if ($.isEmptyObject(this.data) || this.data.count != data.count) {
			this.events.publish({
				"topic": "onUpdate",
				"data": {
					"data": data,
					"query": this.config.get("query"),
					"target": this.config.get("target").get(0)
				}
			});
			this.set("data", data);
			this.render();
			this.ready();
		}
	};

	counter.methods._error = function(data, options) {
		this.events.publish({
			"topic": "onError",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
		if (data.errorCode === "more_than") {
			this.set("data.count", data.errorMessage + "+");
			this.render();
		} else {
			if (typeof options.critical === "undefined" || options.critical || options.requestType === "initial") {
				this.showMessage({"type": "error", "data": data, "message": data.errorMessage});
			}
		}
		this.ready();
	};

We passed logic of these methods described below, nothing interest but publishing events. Each application instance has a internal object called "events" which is instance of Echo.Events class within own auto-defining context. It means that we can publish some events to informate other applications for some actions. We are published events according to request events.

## Application installation

In order to install the application, the following steps should be taken:

- the application script should bw delivired to the client side (for example, using the &lt;script&gt; tag inclusion)

- the application should be called by the application class using operator "new", such as below:

&nbsp;

	new Echo.StreamServer.BundledApps.Counter.ClientWidget({
		...
		"liveUpdates": {
			"timeout": 5
		}
		...
	});

## Complete application source code

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.App.definition("Echo.StreamServer.BundledApps.Counter.ClientWidget");

	if (Echo.App.isDefined(counter)) return;

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

	counter.config = {
		"data": undefined,
		"liveUpdates": {
			"enabled": true,
			"timeout": 10
		},
		"infoMessages": {"layout": "compact"}
	};

	counter.templates.main = "<span>{data:count}</span>";

	counter.methods._request = function() {
		var request = this.get("request");
		if (!request) {
			request = Echo.StreamServer.API.request({
				"endpoint": "count",
				"data": {
					"q": this.config.get("query"),
					"appkey": this.config.get("appkey")
				},
				"liveUpdatesTimeout": this.config.get("liveUpdates.timeout"),
				"recurring": this.config.get("liveUpdates.enabled"),
				"onError": $.proxy(this._error, this),
				"onData": $.proxy(this._update, this)
			});
			this.set("request", request);
		}
		request.send();
	};

	counter.methods._update = function(data) {
		if ($.isEmptyObject(this.data) || this.data.count != data.count) {
			this.events.publish({
				"topic": "onUpdate",
				"data": {
					"data": data,
					"query": this.config.get("query"),
					"target": this.config.get("target").get(0)
				}
			});
			this.set("data", data);
			this.render();
			this.ready();
		}
	};

	counter.methods._error = function(data, options) {
		this.events.publish({
			"topic": "onError",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
		if (data.errorCode === "more_than") {
			this.set("data.count", data.errorMessage + "+");
			this.render();
		} else {
			if (typeof options.critical === "undefined" || options.critical || options.requestType === "initial") {
				this.showMessage({"type": "error", "data": data, "message": data.errorMessage});
			}
		}
		this.ready();
	};

	Echo.App.create(counter);

	})(Echo.jQuery);

## Features that aren't described in this guide

If you look at the Echo.App.definition documentation you can see that we omitted some definition fields. It's enough to have only mentioned fields to be able to instantiate Counter application.

### Events

Each Echo component is an independent part of the system and can communicate with each other on subscribe-publish basis. One application can subscribe to the expected event and the other application can publish it and the event data will be delivered to the subscribed applications. This model is very similar to the DOM events model when you can add event listener and perform some actions when a certain event is fired. All the events are powered by the Echo.Events library.

There are lots of events going on during the application and application life. The list of the events for each component can be found on the respective page in the documentation. The application definition structure provides the interface to subscribe to the necessary events. The events subscriptions should be defined inside the "events" hash using the event name as a key and the event handler as a value, for example:

	app.events = {
		"Echo.StreamServer.BundledApps.Stream.ClientWidget.onDataReceive": function(topic, args) {
			// ... some actions ...
		}
	};

### Labels

The application definition provides a special location for the labels: it's the "labels" hash with the label key as the field name and the label text as a value. So the "labels" hash might look like:

	app.labels = {
		"someLabel": "Some label value"
	};

The label text will be available in the application's code using the following construction:

	this.labels.get("someLabel"); // assuming that "this" points to the application instance

### CSS rules

To make the UI look nice, we should add some CSS rules. There is a special placeholder for the CSS rules in the application definition. The field is called "css". The value of this field is a CSS string. Here are CSS rules for our application:

	app.css =
		'.{class:some_class_name} { some-rules; }' +
		'.{class:some_class_name} { some-rules; }';

Note that you can use the same placeholders inside the CSS definition string.

### Renderers

If you want to execute some action while element renderered, you can use renderers mechanism. Application definition specifies the location for the renderers, it's the "renderers" hash. The renderer for the some element may look like:

	app.renderers.someElement = function(element) {
		// some code goes here
	};

Renderer name should be call according to defined element in the template. So, if you have template like:

	app.template =
		'<div class="{class:someElement}"></div>' +
		'<div class="{class:someElement2}"></div>';

you can add renderers for these elements like:

	app.renderers.someElement = function(element) {
		// some code goes here
	};

	app.renderers.someElement2 = function(element) {
		// some code goes here
	};

## More examples

Each bundled Echo application uses the same mechanisms described in this guide. Bundled Echo applications are good examples which you can use as a pattern for your own applications:

- [Stream](http://cdn.echoenabled.com/sdk/v3/streamserver/bundled-apps/stream/client-widget.js)
- [FacePile](http://cdn.echoenabled.com/sdk/v3/streamserver/bundled-apps/facepile/client-widget.js)
- [Submit](http://cdn.echoenabled.com/sdk/v3/streamserver/bundled-apps/submit/client-widget.js)
- and [more](#!/example)
