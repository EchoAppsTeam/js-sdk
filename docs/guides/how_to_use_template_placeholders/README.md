# How to use template placeholders

It’s often pretty convenient to use placeholders when you work with string values (such as HTML templates, CSS rules, etc). It helps to split the template and the data, which improves the quality of the code and makes the code more readable.

In Echo SDK we use templates in different subsystems a lot. The goal of this guide is to describe the methods we use to work with templates and where the templates approach makes sense.

## Placeholder structure

Here is a quick example of the template (code is taken from Echo Counter app):

	counter.templates.main = "<span>{data:count}</span>";

As you can see placeholders in Echo JS SDK consists of the placeholder type and value. The type and value are split using the colon and wrapped using the curly brackets. So the general placeholder structure looks like `{type:value}`.

## Echo.Utils.substitute

In order to process the template and convert all the placeholders into their final values, the Echo.Utils.substitute function is used. This method accepts an object with the following keys as the argument:

  - template - the template string
  - data - object which contains the data which should be inserted into the template.

More information can be found in the Echo.Utils.substitute function docs.

Let’s have a look at the example:

	var template = "<span>{data:count}</span>";
	var data = {"count": "10"};
	var compiled = Echo.Utils.substitute({"template": template, "data": data});

The result of the Echo.Utils.substitute function application will look like:

	<span>10</span>

As you can see the Echo.Utils.substitute method replaced the placeholder with the respective value from the `data` object which we passed as a part of the function argument.

The Echo.Utils.substitute function can recognize only the `{data:...}` placeholder by default. It’s enough for most simple cases, but there is an option to define your own types of placeholders for the Echo.Utils.substitute function to work with. In order to do that you should pass the `instructions` key inside the object, for example:

	var template = "<div>{sqrt:9}</div>";
	var compiled = Echo.Utils.substitute({
		"template": template,
		"instructions": {
			"sqrt": function(key) {
				key = parseFloat(key);
				return isNaN(key) ? "" : Math.sqrt(parseInt(key));
			}
		}
	});

As a result, the `compiled` variable will have the following value:

	<div>3</div>


## Placeholders usage in Echo.App

While building your own app you can use the Echo.App.substitute function available inside the app methods. This method utilizes the Echo.Utils.substitute function with a few Echo.App-specific placeholders (or instructions).

The list of the placeholders supported inside the app functions can be found below. In examples below we assume that we operate inside the Echo.StreamServer.BundledApps.Stream.Item.ClientWidget class. Here is the list:

- `{class:value}`
  The placeholder will be replaced with the CSS class with the CSS prefix specific for the current app (based on the app name).

  For example, the following part of the template:

  		<div class="{class:avatar}"></div>

  will be replaced with:

  		<div class="echo-streamserver-bundledapps-stream-item-clientwidget-avatar"></div>

  Note: the value of the `class` placeholder also serves as the name of the renderer which should be applied for this particular element. More information about the rendering engine can be found [here](#!/guide/terminology-section-rendering-engine).


- `{config:value}`
  This placeholder is used to access the config of the given app. You can access the config field at any nested level using the "." to move to the next level. In the example below:

  		{
  			// ...
  			"cdnBaseURL": {"sdk": "http://cdn.echoenabled.com/sdk/v3/"}
  			// ...
  		}

  We can access the value of the `sdk` key by using the `{config:cdnBaseURL.sdk}` placeholder in template. So if we have a template which contains something like:

  		{config:cdnBaseURL.sdk}/gui.pack.js

  after the substitution the string will look like:

  		http://cdn.echoenabled.com/sdk/v3/gui.pack.js

- `{data:value}`
  The placeholder can be used to access the "data" attribute of a given app. The {data:...} placeholder also allows accessing the nested properties using the "." char to split the levels. For example, the following template:
  		<span class="{class:metadata-value}">{data:actor.id}</span>

  will be converted to:

  		<span class="echo-streamserver-bundledapps-stream-item-clientwidget-metadata-value">http://twitter.com/user</span>

- `{label:value}`
  The placeholder is used to access the labels defined for the given app. Example template string:

  		{label:userID} http://example.com/some-id

  after processing will look like the following string:

  		User ID: http://example.com/some-id

- `{self:value}`
  The placeholder is used to access the properties of a given app instance. Accessing the properties for the nesting level values is also supported (using "." char).

  For example the following string:

  		<div>{self:depth}</div>

  will be converted to the one below:

  		<div>0</div>

You can use the placeholders described above in an app and plugin templates, CSS code (defined in the `css` field in the definition) and inside the dependency URLs (defined within the `dependencies` array in the definition). More examples can be found in the [How to develop an App](#!/guide/how_to_develop_app) guide.

## Placeholders usage in Echo.Plugin

Echo.Plugin class also contains specific method (Echo.Plugin.substitute) to deal with the plugin-specific placeholders. In case of a plugin the method works with a given plugin data. Here is the list of supported placeholders:

- `{plugin.class:value}`
- `{plugin.config:value}`
- `{plugin.data:value}`
- `{plugin.label:value}`
- `{plugin.self:value}`

The placeholders have the same semantics as the placeholders defined for Echo.App. Echo.App-specific placeholders are also available when you work with the templates inside the plugin (these placeholders will access the given app properties).


More examples of the placeholders can be found in our [documentation](#!/guide/how_to_develop_plugin) and in the source code of the existing plugins.
