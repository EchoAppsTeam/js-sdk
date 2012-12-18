# How to develop a plugin

Echo JS SDK provides the ability to extend the functionality of any Echo Control or an Application using the Plugins approach. This page will guide you through the steps of custom plugins creation.

## Introduction

Plugin is an object with the predefined structure which extends the default functionality of an application or its components.

Let's imagine that we want to add the dropdown with the possible sorting options into the Stream control UI. As soon as the sorting order is selected, the Stream should be refreshed to reflect the user action.

## Creating the plugin skeleton

First of all, let's prepare the JavaScript closure to allocate a separate namespace for our plugin's code. This step is common for all plugins, controls and apps built on top of the JS SDK. You can find the detailed information on how to create the JS closure in the ["Terminology and dev tips" guide](#!/guide/terminology-section-3). So we have the following code as a starting point:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	// component code goes here

	})(Echo.jQuery);

Now let's add the plugin definition. Echo JS SDK contains a special [Echo.Plugin](#!/api/Echo.Plugin) class to facilitate the plugin creation, we'll use some functions to add the plugin definition:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var plugin = Echo.Plugin.manifest("StreamSortingSelector", "Echo.StreamServer.Controls.Stream");

	if (Echo.Plugin.isDefined(plugin)) return;

	Echo.Plugin.create(plugin);

	})(Echo.jQuery);

So we've called the ["Echo.Plugin.manifest"](#!/api/Echo.Plugin-static-method-manifest) function, passed the name of the plugin and the type of the control as arguments. We checked whether the plugin was already initialized or not, to avoid multiple plugin re-definitions in case the plugin script was included into the page source several times. After that we passed the manifest into the [Echo.Plugin.create](#!/api/Echo.Plugin-static-method-create) function to generate the plugin JS class out of the static declaration.

At that point we can consider the plugin skeleton ready and start adding the business logic into it.

## Plugin configuration

Let's assume that we need a configuration parameter for our plugin to define the list of the sorting options we want to expose in the dropdown. Also we want to define a default value of the parameter in case it is omitted in the plugin configuration while installing it into the necessary Stream control. In order to do it we add the "config" object to the plugin manifest with the name of the config field as a key and a default as its value, so the code of the plugin will look like:

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var plugin = Echo.Plugin.manifest("StreamSortingSelector", "Echo.StreamServer.Controls.Stream");

	if (Echo.Plugin.isDefined(plugin)) return;

	plugin.config = {
		"orders": [
			"reverseChronological",
			"chronological",
			"likesDescending",
			"flagsDescending",
			"repliesDescending"
		]
	};

	Echo.Plugin.create(plugin);

	})(Echo.jQuery);

If we need more options in future, they can be appended as additional fields into the "config" hash.

Now everywhere in the plugin's code we'll be able to use the following call:

	@example
	this.config.get("orders"); // assuming that "this" points to the plugin instance

to get the value of the "order" config parameter defined during the plugin installation or to access the default value otherwise. Note: the "this" var should point to the plugin instance.

## Adding helper methods

Before we add the dropdown we need to understand which option should be marked as "active". For these purposes let's define the function which will extract the sort order out of the search query defined for the Stream control. There is a special place for the helper functions in the plugin definition: it's called the "methods" object. The method to extract the sorting order might look like:

	@example
	plugin.methods._getSortOrder = function() {
		var stream = this.component;
		var regex = new RegExp("sortOrder:(" + this.config.get("orders").join("|") + ")");
		var result = stream.config.get("query").match(regex);
		return result && result[1];
	};

Few important notes here:

- we added the underscore before the name of the function to indicate that this function is private and nobody should call it outside the plugin's code

- we refer to the Stream control using the "this.component" field. The reference to the parent component is always available inside the plugin

- the "\_getSortOrder" function will be available in the plugin's code as "this.\_getSortOrder()", assuming that "this" points to the plugin instance

The function assembles the regular expression and parses the stream query using it to extract the value of the sorting order. The "_getSortOrder" function returns 'undefined' in case no "sortOrder" predicate was found in the search query.

It makes sense to add the related helper function to define the new sorting order for the Stream. The code of the function may look like:

	@example
	plugin.methods._setSortOrder = function(order) {
		var stream = this.component;
		var _query = stream.config.get("query");
		var _order = this._getSortOrder();
		var query = _order
			? _query.replace(new RegExp("sortOrder:" + _order), "sortOrder:" + order)
			: "sortOrder:" + order + " " + _query;
		stream.config.set("query", query);
		stream.refresh();
	};

The function looks a bit more complicated, but the main idea is to either replace the value of the "sortOrder" predicate or add the predicate with the necessary value to the beginning of the search query in case the "sortOrder" predicate was not defined. After the query update, the "refresh" function is called for the Stream control to fetch the data based on the new search query and rerender the UI.

## Labels

One more step before starting to work with the templates in order to add the dropdown: we need to define the labels which we are going to be used in the UI. Keeping the labels as a separate set has some benefits:

- ability for the publisher to update a certain label without touching the template

- followup from the previous point: ability to translate the UI to any foreign language without dealing with the code

The plugin manifest provides a special location for the labels: it's the "labels" hash with the label key as the field name and the label text as a value. We need the labels for the sort orders and one more label to add the text before the dropdown, so the "labels" hash might look like:

	@example
	plugin.labels = {
		"sortOrderSelection": "Sorting order:",
		"chronologicalSortOrder": "Chronological",
		"reverseChronologicalSortOrder": "Reverse chronological",
		"likesDescendingSortOrder": "Likes count",
		"flagsDescendingSortOrder": "Flags count",
		"repliesDescendingSortOrder": "Replies count"
	};

The label text will be available in the plugin's code using the following construction:

	@example
	this.labels.get("sortOrderSelection"); // assuming that "this" points to the plugin instance


## Extending control template

Ok, now it's time to add the dropdown itself into the Stream control UI.

The first steps is to prepare a template which should be appended into the Stream UI. Due to the fact that the template for our plugin is quite complex, we'll wrap the code to generate it into the function, for example as shown below:

	@example
	plugin.template = function() {
		var plugin = this;
		var current = this._getSortOrder() || "reverseChronological";
		var options = $.map(plugin.config.get("orders"), function(order) {
			return plugin.substitute({
				"template": '<option value="{data:order}" {data:selected}>{data:label}</option>',
				"data": {
					"order": order,
					"label": plugin.labels.get(order + "SortOrder"),
					"selected": current === order ? "selected" : ""
				}
			});
		}).join("");
		return '<div class="{plugin.class:wrapper}">' +
			'<span class="{plugin.class:label}">{plugin.label:sortOrderSelection}</span>' +
			'<select class="{plugin.class:selector}">' + options + '</select>' +
		'</div>';
	};

Here is what's going on in the function:

- we extract the current sort order and defaults to the "reverseChronological" one (which is a default sorting order for the "search" API endpoint) if it was not defined in the search query

- we assemble the list of options for the dropdown, based on the "options" config parameter value and the current sorting order

- the function returns the string with HTML representation of the dropdown.

Important note: as you can see, the final template contains the placeholders such as: "{plugin.class:wrapper}" and "{plugin.label:sortOrderSelection}". These placeholders will be processed by the templating engine before the template is inserted into the Stream UI. You can find the general description of the rendering engine in the ["Terminology and dev tips" guide](#!/guide/terminology). In addition to the basic placeholders supported by the rendering engine, the base plugins functionality also provides the ability to define the following placeholders:

- {plugin.class:KEY} - the placeholder will be replaced with the CSS class name + the KEY value
- {plugin.label:KEY} - the placeholder to access the corresponding label text using the KEY as a key
- {plugin.config:KEY} - the placeholder to access the config value using the KEY as a key
- {plugin.self:KEY} - provides the ability to access the plugin field using the KEY as a key

In our example, we instructed the rendering engine to append the "sortOrderSelection" label text and to insert the necessary CSS classes.

The second step to make the dropdown appear in the UI is to define the rules to append the template.

In order to specify the rules for the plugin template addition, we should call the ["extendTemplate"](#!/api/Echo.Plugin-method-extendTemplate) function of the plugin instance. Due to the fact that the final control view assembling is happening during its initialization, we need to call the function inside the "plugin.init" function as shown below:

	@example
	plugin.init = function() {
		this.extendTemplate("insertAsFirstChild", "header", plugin.template);
	};

So we passed the "insertAsFirstChild" directive as the first argument, the anchor element as the second one and the template (which might be represented as a function) as the third argument.

More information about the ["extendTemplate"](#!/api/Echo.Plugin-method-extendTemplate) function can be found [here](#!/api/Echo.Plugin-method-extendTemplate).

## Adding renderers

Now we have our dropdown in place, but we still don't have the logic to trigger the Stream refresh when the new sorting order is selected in the dropdown. It's a perfect task for the Renderers, so let's add one. Plugin manifest specifies the location for the renderers, it's the "renderers" hash. The renderer for the dropdowm may look like:

	@example
	plugin.renderers.selector = function(element) {
		var plugin = this, stream = plugin.component;
		return element.on("change", function() {
			plugin._setSortOrder($(this).val());
		});
	};

The code of the function is simple: we attach the "onchange" event to the dropdown and update the Stream sort order with the right value inside the callback.

Note: the "renderers" hash contains the renderers for the elements added within the plugin. If you want to access the renderers of the parent component (for example, to attach some additional logic), the renderers can be places inside the "renderers.component" hash, for example:

	@example
	plugin.component.renderers.state = function(element) {
		// ... some code ...
		this.parentRenderer("state", arguments);
		return element;
	};

In this example we've accessed the "state" renderer of the Stream control.

One more important note to keep in mind while overriding the existing renderers: you can control the order in which the renderer logic is executed, i.e. you can call the parent renderer and apply specific logic after that or you can add some manipulations and call the parent renderer. Calling the ["parentRenderer"](#!/api/Echo.Plugin-method-parentRenderer) function is extremely important when you extend some existing renderer to allow other plugins to execute their renderer extensions as well (in case multiple plugins extend the same renderer).

## CSS rules

To make the UI look nice, we should add some CSS rules. There is a special placeholder for the CSS rules in the plugin definition. The field is called "css". The value of this field is a CSS string. Here are CSS rules for our plugin:

	@example
	plugin.css =
		'.{plugin.class:label} { margin-right: 5px; }' +
		'.{plugin.class:wrapper} { float: left; }';

Note that you can use the same placeholders inside the CSS definition string.


That's all, the plugin is ready!

However there are few more handy things which can be used during the plugin development (see below).

## Plugin state management

There are cases where the plugin should not be active/inactive according to some condition, for example if any mandatory plugin params are missing in the config or the plugin was written for a given type of items in the stream (for Tweets or FaceBook items). In this case you can control the state of the plugin using the "enabled" function in the plugin definition. The function should be synchronous and return 'true' to enable or 'false' to disable the plugin. Example:

	@example
	plugin.enabled = function() {
		return !!this.config.get("myMandatoryParameter");
	};

Note: the function is executed within the plugin context, i.e. the "this" points to the current plugin instance.

## Events

Another important aspect is events.

Each Echo component is an independent part of the system and can communicate with each other on subscribe-publish basis. One application can subscribe to the expected event and the other application can publish it and the event data will be delivered to the subscribed applications. This model is very similar to the DOM events model when you can add event listener and perform some actions when a certain event is fired. All the events are powered by the [Echo.Events library](#!/api/Echo.Events).

There are lots of events going on during the control and plugin life. The list of the events for each component can be found on the respective page in the documentation. The plugin definition structure provides the interface to subscribe to the necessary events. The events subscriptions should be defined inside the "events" hash using the event name as a key and the event handler as a value, for example:

	@example
	plugin.events = {
		"Echo.StreamServer.Controls.Stream.onDataReceive": function(topic, args) {
			// ... some actions ...
		}
	};

## Dependencies

If the plugin depends on some other external component/library, it's possible to define the dependencies list for the plugin. In this case the engine will download the dependencies first and launch the plugin after that. The dependency is an object with the "url" and one of the "control", "plugin", "app" or "loaded" fields. In the "control", "plugin", "app" fields you should specify the component name. If the component you have specified is not loaded yet, resource you have specified in the "url" will be downloaded. If you need to specify more complex conditions to load resource, you can use the "loaded" field instead. The "loaded" field should be defined as a function which returns 'true' or 'false' and indicate whether the resource should be downloaded or not. Example:

	@example
	plugin.dependencies = [{
		"loaded": function() { return !!window.twttr; },
		"url": "http://platform.twitter.com/widgets.js"
	}];

You can define the CSS stylesheets as a dependency as well, in this case the "loaded" ("control", "plugin" or "app") parameter might be omitted.

## Plugin installation

In order to install the plugin into the necessary control, the following steps should be taken:

- the plugin script should be delivered to the client side (for example, using the &lt;script&gt; tag inclusion)

- the plugin should be added into the "plugins" array, for example as shown below:

&nbsp;
	@example
	new Echo.StreamServer.Controls.Stream({
		...
		"plugins": [{
			"name": "StreamSortingSelector",
			"orders": ["repliesDescending", "likesDescending", "chronological"]
		}],
		...
	});

Note: the plugin name should be specified as the "name" parameter value. Other plugin parameters should go in the same hash.

## Complete plugin source code

	@example
	(function(jQuery) {
	"use strict";

	var $ = jQuery;

	var plugin = Echo.Plugin.manifest("StreamSortingSelector", "Echo.StreamServer.Controls.Stream");

	if (Echo.Plugin.isDefined(plugin)) return;

	plugin.config = {
		"orders": [
			"reverseChronological",
			"chronological",
			"likesDescending",
			"flagsDescending",
			"repliesDescending"
		]
	};

	plugin.init = function() {
		this.extendTemplate("insertAsFirstChild", "header", plugin.template);
	};

	plugin.labels = {
		"sortOrderSelection": "Sorting order:",
		"chronologicalSortOrder": "Chronological",
		"reverseChronologicalSortOrder": "Reverse chronological",
		"likesDescendingSortOrder": "Likes count",
		"flagsDescendingSortOrder": "Flags count",
		"repliesDescendingSortOrder": "Replies count"
	};

	plugin.template = function() {
		var plugin = this;
		var current = this._getSortOrder() || "reverseChronological";
		var options = $.map(plugin.config.get("orders"), function(order) {
			return plugin.substitute({
				"template": '<option value="{data:order}" {data:selected}>{data:label}</option>',
				"data": {
					"order": order,
					"label": plugin.labels.get(order + "SortOrder"),
					"selected": current === order ? "selected" : ""
				}
			});
		}).join("");
		return '<div class="{plugin.class:wrapper}">' +
			'<span class="{plugin.class:label}">{plugin.label:sortOrderSelection}</span>' +
			'<select class="{plugin.class:selector}">' + options + '</select>' +
		'</div>';
	};

	plugin.renderers.selector = function(element) {
		var plugin = this, stream = plugin.component;
		return element.on("change", function() {
			plugin._setSortOrder($(this).val());
		});
	};

	plugin.methods._getSortOrder = function() {
		var stream = this.component;
		var regex = new RegExp("sortOrder:(" + this.config.get("orders").join("|") + ")");
		var result = stream.config.get("query").match(regex);
		return result && result[1];
	};

	plugin.methods._setSortOrder = function(order) {
		var stream = this.component;
		var _query = stream.config.get("query");
		var _order = this._getSortOrder();
		var query = _order
			? _query.replace(new RegExp("sortOrder:" + _order), "sortOrder:" + order)
			: "sortOrder:" + order + " " + _query;
		stream.config.set("query", query);
		stream.refresh();
	};

	plugin.css =
		'.{plugin.class:label} { margin-right: 5px; }' +
		'.{plugin.class:wrapper} { float: left; }';

	Echo.Plugin.create(plugin);

	})(Echo.jQuery);

## More examples

Each bundled Echo plugin uses the same mechanisms described in this guide. Bundled Echo plugins are good examples which you can use as a pattern for your own plugins:

- [CommunityFlag](http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/community-flag.js)
- [Edit](http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/edit.js)
- [Like](http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/like.js)
- [Reply](http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/reply.js)
- [JanrainSharing](http://cdn.echoenabled.com/sdk/v3/streamserver/plugins/janrain-sharing.js)
- and more (please look at Echo controls documentation pages)
