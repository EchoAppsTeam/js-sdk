# How to work with text labels

## Echo.Labels library

Any text part of Echo JS-SDK application interface is implemented with the help of
Echo.Labels library.
It provides basic machinery to create, modify and employ different language variables
across all components.

There are several use cases covered by Echo.Labels library, it should be used
for localization purposes, to create text part of particular interface
and to override existing language variables.

### Namespace

To make text labels utilization more comfortable we introduced namespaces
for the language variables across different components. Splitting the corresponding
values into separate logical blocks helps to address the necessary label
in a convenient way. Variables with the same name but belonging to different
namespaces will not interfere each other.

### Global storage

The library provides several type of text labels storage for different purposes.
Global storage and local instantiated Echo.Labels objects are used.

Global storage is the data array shared for all components. It combines default
and custom areas. When a text label is being addressed from the global storage
we look for it in custom area first and then in the default section if nothing was found.

There is no need to create global storage explicitly, it is created when
the Echo.Labels library is loaded. However each label which will be used later
in the application should be pushed to the storage using the static Echo.Labels.set method.
To access a particular language variable from the global storage the static accessor
Echo.Labels.get method should be used.

	// First let's add labels for MyApp into the global storage
	Echo.Labels.set({
		"label1": "Label 1",
		"label2": "Label 2"
	}, "MyLib.MyApp", true);
	
	Echo.Labels.get("label1", "MyLib.MyApp"); // => "Label 1"
	
	// Then add labels for another app
	Echo.Labels.set({
		"label1": "Another Label 1",
		"label2": "Another Label 2"
	}, "MyLib.MyApp2", true);
	
	Echo.Labels.get("label1", "MyLib.MyApp"); // => "Label 1"
	Echo.Labels.get("label1", "MyLib.MyApp2"); // => "Another Label 1"
	
	// So add a label into the custom area
	Echo.Labels.set({
		"label2": "Label 2 custom"
	}, "MyLib.MyApp");
	
	Echo.Labels.get("label1", "MyLib.MyApp"); // => "Label 1"
	Echo.Labels.get("label2", "MyLib.MyApp"); // => "Label 2 custom"
	
	// And also try to change the same label in the default area
	Echo.Labels.set({
		"label2": "Label 2 default"
	}, "MyLib.MyApp", true);
	
	Echo.Labels.get("label2", "MyLib.MyApp"); // => "Label 2 custom"

## Local storage

Another opportunity to utilize the library is to instantiate an Echo.Labels object.
Such objects help to override the language variables stored in the global storage.
Accessor method is implemented via cascade addressing, it will try to get the necessary
value from the local storage, then in the custom section of the global storage
and after all in the default area. Object can be instantiated in a general JavaScript way:

	var labels = new Echo.Labels({}, "MyNamespace");

Each object has its own namespace which can't be overridden. The
{@link Echo.Labels#set labels.set} and {@link Echo.Labels#get labels.get}
methods are used to set and access data. Strictly speaking
two different instances of Echo.Labels object will not share language variables
even if they will be created with the same namespace.

	// In addition to the previous example let's instantiate a new local storage
	var localLabels = new Echo.Labels({
		"label1": "Local Label 1"
	}, "MyLib.MyApp");

	localLabels.get("label1"); // => "Local Label 1"
	localLabels.get("label2"); // => "Label 2 custom"

	// Then try to create another instance of the local storage
	var localLabels2 = new Echo.Labels({
		"label1": "Another Local Label 1"
	}, "MyLib.MyApp");

	localLabels2.get("label1"); // => "Another Local Label 1"
	localLabels2.get("label2"); // => "Label 2 custom"

## Placeholders

Text labels might contain special placeholders for more flexible utilization.
The corresponding language variable should contain the necessary key surrounded
by curly braces. To fill the necessary values they should be passed to the accessor method.
If keys will not match then the placeholder will not be substituted and stay unchanged.

For example for the 'pageNumber' language variable containing the following text:
'Page {page} of {total}' we can call the accessor method this way:

	Echo.Labels.get("pageNumber", "common", {
		"page": 1,
		"total": 10
	});

It will return us the 'Page 1 of 10' string value.

## Library utilization

All apps and plugins built on top of JS SDK support text labels by default.
Most likely you will not face any difficulties trying to create some text part
of your interface. In some obvious use cases you even do not have to call Echo.Labels directly.

### Namespace

The [application](#!/guide/how_to_develop_app) name
is used as a basic namespace for text labels. For the
[plugin](#!/guide/how_to_develop_plugin) it will be
extended with the parent component name: `<ComponentName>.Plugins.<PluginName>`.

### Default Labels

When you are developing a new application or a plugin you can set
the language variables list in the manifest section.

	var Comments = Echo.App.manifest("Echo.Apps.CommentsSample");
	// ...
	Comments.labels = {
		"topComments": "Top Comments",
		"allComments": "All Comments"
	};

Echo.App which is the basic class for all applications and Echo.Plugin
for the plugins will do the backstage work to push the defined language variables into
global storage default section.

### Language variables as a part of configuration

Text labels can not only be set at the component level but also be added dynamically
for the corresponding instance. The same rules applies for the plugins and applications.

This example shows how to override language variables for this particular instance
of an application:

	<script type="text/javascript">
		Echo.Loader.initApplication({
			"script": "http://cdn.echoenabled.com/sdk/v3/streamserver.pack.js",
			"component": "Echo.StreamServer.Controls.Stream",
			"config": {
				// …
				"labels": {
					"live": "Live mode"
				}
			}
		});
	</script>

Text labels in the app can be redefined this way:

	var Comments = Echo.App.manifest("Echo.Apps.CommentsSample");
	// ...
	Comments.renderers.submit = function(element) {
		this.initComponent({
			"id": "Submit",
			"component": "Echo.StreamServer.Controls.Submit",
			"config": {
				"target": element,
				"infoMessages": {"enabled": false},
				"labels": {
					"post": "Post your comment"
				}
			}
		});
		return element;
	};

Next example shows how to override the 'editButton' label in the 'Edit' plugin:

	<script type="text/javascript">
		Echo.Loader.initApplication({
			"script": "http://cdn.echoenabled.com/apps/echo/comments-sample/comments-sample.js",
			"component": "Echo.Apps.CommentsSample",
			"config": {
				// ...
				"components": {
					"Stream": {
						// ...
						"plugins": [{
							"name": "Edit",
							"labels": {
								"editButton": "Modify"
							},
							// ...
						}]
					},
					// ...
				},
				// ...
			}
		});
	</script>

### Language variables in templates

Text labels defined either through the component manifest or via the configuration
explicitly can be used in the templates using the special `{label:...}` placeholders.
For example:

	var submit = Echo.Control.manifest("Echo.StreamServer.Controls.Submit");
	// ...
	submit.templates.formTitle = '<div>{label:title}</div>';

Plugin's language variables are available through the `{plugin.label:...}` placeholder:

	var reply = Echo.Plugin.manifest("Reply", "Echo.StreamServer.Controls.Stream.Item");
	// ...
	reply.templates.formTitle = "<div>{plugin.label:title}</div>";

If the `{label:...}` placeholder is used inside the plugin, the necessary value will be
addressed from the parent component or application.
