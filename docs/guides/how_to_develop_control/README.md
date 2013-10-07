# How to develop a control

## Overview

Echo JS SDK provides the ability to package a certain set of discrete functionality into a JavaScript class which is called a Control. Controls are typically core interaction patterns like a submit form, stream client etc. Controls are then used by Applications to deliver a complete user experience. This page will guide you through the steps of custom control creation. For more examples of controls please visit the [Examples Page](#!/example).

## Introduction

Let's imagine that we want to create the control for displaying a number of items matching the specified query.

## Creating the control skeleton

First of all, let's prepare the JavaScript closure to allocate a separate namespace for our control's code. This step is common for all controls. You can find the detailed information on how to create the JS closure in the ["Terminology and dev tips"](#!/guide/terminology-section-creating-a-javascript-closure-for-the-components-and-jquery-plugins) guide. So we have the following code as a starting point:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Now let's add the control definition. Echo JS SDK contains a special Echo.Control class to facilitate the control creation, we'll use some functions to add the control definition:

	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var counter = Echo.Control.manifest("Echo.StreamServer.Controls.Counter");

	if (Echo.Control.isDefined(counter)) return;

	Echo.Control.create(counter);

	})(Echo.jQuery);

We called the Echo.Control.manifest function and passed the name of the control as an argument. We checked whether the control was already initialized or not, to avoid multiple control re-definitions in case the control script was included into the page source several times. After that we passed the manifest generated into the Echo.Control.create function to generate the control JS class out of the static manifest declaration.

At that point we can consider the control skeleton ready and start adding the business logic into it.

## Control init function

There are 2 possible scenarios of our control initialization:

- when there is no data available and we need to make an API call to get it

- when the data is here and we just need to render it (it's usually the case when we count the items which were already delivered to the client side or we request the data during another API call, for example by making a "mux" request)

In order to fulfill both use-cases we need to add the corresponding check into the control initialization function, for example as shown below:

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

So, if the data parameter is empty we should fetch it from the server through the Echo.StreamServer.API.Request class. Definition of the _request method will be described below. Else, if the data parameter is defined, we should {@link Echo.Control#render "render"} control and call {@link Echo.Control#ready "ready"} method to detect that control is ready. All functions that defined in the manifest namespace have control context (this variable pointed to control instance) if it this is not described explicit.

## Control configuration

Most of controls should contain several configuration parameters that defines a control behavior, state etc. Also we want to define a default value of the parameters in case it is omitted in the control configuration while installing it. In order to do it we add the "config" object to the control manifest with the name of the config field as a key and a default as its value, so the code of the control will look like:

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

	counter.config = {
		"data": undefined,
		"liveUpdates": {
			"enabled": true,
			"timeout": 10
		},
		"infoMessages": {"layout": "compact"}
	};

	Echo.Control.create(counter);

	})(Echo.jQuery);

If we need more options in future, they can be appended as additional fields into the "config" hash.
Let's describe config parameters:

- "data" defines a default value that used to display items count;
- "liveUpdates" defines a timeout that used by the Echo.StreamServer.API.Request class for the recurring server request for data. This parameter is described {@link Echo.StreamServer.Controls.Counter#cfg-liveUpdates here};
- "infoMessages" defines messages layout for control. This parameter is described {@link Echo.Control#cfg-infoMessages here}

Now everywhere in the control's code we'll be able to use the following call:

	this.config.get("liveUpdates"); // assuming that "this" points to the control instance

to get the value of the "liveUpdates" config parameter or any other defined during the control installation or to access the default value otherwise. Note: the "this" var should point to the control instance.

## Defining control template

Now we can define html template for the control UI. It should be a string value which may contains html elements (DOM structure) and placeholder. According to control initialization this value will be compiled by the Echo.Control.substitute method. This method compiles placeholders to the string values.
There's two ways for the template defining:

- we can pass to the manifest object value "template" which is function. This function can prepare a template string and should return it. Returned value will be compiled;
- we can pass a "templates" object that can contains a several templates by the "templates" object key. By default, if template value is ommited in the manifest, will be used templates.main value;

In our case we need a simple template which contains a count items number. Let's put the template into control's code:

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

	counter.config = {
		"data": undefined,
		"liveUpdates": {
			"enabled": true,
			"timeout": 10
		},
		"infoMessages": {"layout": "compact"}
	};

	counter.templates.main = "<span>{data:count}</span>";

	Echo.Control.create(counter);

	})(Echo.jQuery);

Important note: as you can see, the template contains the placeholder "{data:count}". This placeholder will be processed by the template engine (due to "substitute" method describes above) before thw template is inserted into control UI. You can find the general description of the rendering engine in the ["Terminlogy and dev tips"](#!/guide/terminology) guide. In addition to the basic placeholders supported by the rendering engine, the base controls functionality also provides the ability to define the following placeholders:

- {class:KEY} - the placeholder will be replaced with the CSS class name + the KEY value
- {label:KEY} - the placeholder to access the corresponding label text using the KEY as a key
- {config:KEY} - the placeholder to access the config value using the KEY as a key
- {self:KEY} - provides the ability to access the control field using the KEY as a key

## Adding helper methods

Now we can define a helper functions which will be doing some actions. For example: for sending request to the server we should define helper function. There is a special place for the helper functions in the control definition: it's called the "methods" object. The method to sending request might look like:

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

- we added the underscore before the name of the function to indicate that this function is private and nobody should call it outside the control's code

- we try to get request object using the Echo.Control.get method. This object should be instantiated from Echo.StreamServer.API.Request class to request the number of items. We use a static Echo.StreamServer.API.request method for that. After request object definition we store it in the internal variable using the Echo.Control.set method.

- the "\_request" function will be available in the control's code as "this.\_request()", assuming that "this" points to the control instance

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

We passed logic of these methods described below, nothing interest but publishing events. Each control instance has a internal object called "events" which is instance of Echo.Events class within own auto-defining context. It means that we can publish some events to informate other applications for some actions. We are published events according to request events.

## Control installation

In order to install the control, the following steps should be taken:

- the control script should bw delivired to the client side (for example, using the &lt;script&gt; tag inclusion)

- the control should be called by the control class using operator "new", such as below:

&nbsp;

	new Echo.StreamServer.Controls.Counter({
		...
		"liveUpdates": {
			"timeout": 5
		}
		...
	});

## Complete control source code

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

	Echo.Control.create(counter);

	})(Echo.jQuery);

## Features that aren't described in this guide

If you look at the Echo.Control.manifest documentation you can see that we omitted some manifest fields. It's enough to have only mentioned fields to be able to instantiate Counter control.

### Events

Each Echo component is an independent part of the system and can communicate with each other on subscribe-publish basis. One application can subscribe to the expected event and the other application can publish it and the event data will be delivered to the subscribed applications. This model is very similar to the DOM events model when you can add event listener and perform some actions when a certain event is fired. All the events are powered by the Echo.Events library.

There are lots of events going on during the control and control life. The list of the events for each component can be found on the respective page in the documentation. The control definition structure provides the interface to subscribe to the necessary events. The events subscriptions should be defined inside the "events" hash using the event name as a key and the event handler as a value, for example:

	control.events = {
		"Echo.StreamServer.Controls.Stream.onDataReceive": function(topic, args) {
			// ... some actions ...
		}
	};

### Labels

The control manifest provides a special location for the labels: it's the "labels" hash with the label key as the field name and the label text as a value. So the "labels" hash might look like:

	control.labels = {
		"someLabel": "Some label value"
	};

The label text will be available in the control's code using the following construction:

	this.labels.get("someLabel"); // assuming that "this" points to the control instance

### CSS rules

To make the UI look nice, we should add some CSS rules. There is a special placeholder for the CSS rules in the control definition. The field is called "css". The value of this field is a CSS string. Here are CSS rules for our control:

	control.css =
		'.{class:some_class_name} { some-rules; }' +
		'.{class:some_class_name} { some-rules; }';

Note that you can use the same placeholders inside the CSS definition string.

### Renderers

If you want to execute some action while element renderered, you can use renderers mechanism. Control manifest specifies the location for the renderers, it's the "renderers" hash. The renderer for the some element may look like:

	control.renderers.someElement = function(element) {
		// some code goes here
	};

Renderer name should be call according to defined element in the template. So, if you have template like:

	control.template =
		'<div class="{class:someElement}"></div>' +
		'<div class="{class:someElement2}"></div>';

you can add renderers for these elements like:

	control.renderers.someElement = function(element) {
		// some code goes here
	};

	control.renderers.someElement2 = function(element) {
		// some code goes here
	};

## More examples

Each bundled Echo control uses the same mechanisms described in this guide. Bundled Echo controls are good examples which you can use as a pattern for your own controls:

- [Stream](http://cdn.echoenabled.com/sdk/v3/streamserver/controls/stream.js)
- [FacePile](http://cdn.echoenabled.com/sdk/v3/streamserver/controls/facepile.js)
- [Submit](http://cdn.echoenabled.com/sdk/v3/streamserver/controls/submit.js)
- and [more](#!/example)
