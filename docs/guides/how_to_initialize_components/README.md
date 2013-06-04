# How to initialize Echo components

## Initializing app or control

Every application or control is represented by a single JS class. In order to make it work, Echo JS SDK environment should be loaded on a page and the class should be initialized in a certain way depending on the component role.

### Initializing a component as a standalone application

If you need to initialize a control as a standalone app on a page, you should use unified apps init function called Echo.Loader.initApplication. The function is defined in the “loader.js” file, so you have to include it into the page source first (<span style="color: red;">only once per page!</span>). So the final code might look like:

	<script src=”http://cdn.echoenabled.com/sdk/v3/loader.js”></script>
	<script>
		Echo.Loader.initApplication({
			"script": "http://cdn.echoenabled.com/sdk/v3/streamserver.pack.js",
			"component": "Echo.StreamServer.Controls.Stream",
			"backplane": {
				"serverBaseURL": "http://api.echoenabled.com/v1",
				"busName": "your_bus_name"
			},
			"config": {
				"target": document.getElementById("stream"),
				"query": "your_search_query",
				"appkey": "your_appkey",
				"item": {"reTag": false},
				"plugins": [{
					"name": "Reply"
				}, {
					"name": "Moderation"
				}]
			}
		});
	</script>

More information regarding the Echo.Loader.initApplication function can be found [here](#!/api/Echo.Loader-static-method-initApplication).

### Initializing a component as an internal one of an app inherited from Echo.App

If you are building an app based on the Echo.App abstraction and you need to initialize an internal app inside it, the best approach would be to employ the [Echo.App.initComponent](#!/api/Echo.App-method-initComponent) function. In this case Echo.App abstraction will take care of the app management (passing some params, destroying it when the main app is destroyed, etc). In the example below an app initialization consists of 2 parts: component default configuration and the init call itself. Example code:

	// application config
	YourApplication.config = {
		...
		"components": {
			"Stream": {
				"query": "your_search_query",
				"plugins": [{
					"name": "Reply"
				}]
			}
		}
		…
	};

	…

	YourApplication.renderers.stream = function(element) {
		this.initComponent({
			"id": "Stream", // id in the "component" configuration object
			"component": "Echo.StreamServer.Controls.Stream",
				"config": {
					"target": element,
					"appkey": "your_appkey",
					"item": {"reTag": false},
					"plugins": [{
						"name": "Moderation"
					}]
				}
		});
	};

More information regarding the Echo.App.initComponent function can be found {@link Echo.App#initComponent here}.

### Initializing a component in other cases

If you want to init an app in some other cases, it’s possible to call component constructor directly, just make sure that Echo JS SDK environment was loaded on a page.

	new Echo.StreamServer.Controls.Stream({
		"target": document.getElementById("stream"),
		"query": "your_search_query",
		"appkey": "your_appkey",
		"item": {"reTag": false},
		"plugins": [{
			"name": "Reply"
		}, {
			"name": "Moderation"
		}]
	});

<span style="color: red;">Note: an app initialization via Echo.Loader.initApplication function is the preferred way and should be used in most cases.</span>

## Initializing plugins

Almost every app or control built using Echo JS SDK can be extended via [Plugins](#!/guide/how_to_develop_plugin). In order to init a plugin for a given app or control, you should place the object with the “name” field into the “plugins” array, for example as shown below:

	new Echo.StreamServer.Controls.Stream({
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"name": "Reply"
		}]
	});

If your plugin has configurable options, you should put them into the same object, so that the plugin code can access them. For example:

	new Echo.StreamServer.Controls.Stream({
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"name": "Reply",
			"actionString": "Type your comment here..."
		}]
	});

If your plugin’s code is not loaded on a page yet, Echo JS SDK engine can take care of it for you, just add the “url” parameter with the plugin script URL. In this case the script will be downloaded and executed before the plugin initialization. For example:

	new Echo.StreamServer.Controls.Stream({
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"name": "MyCustomPlugin",
			"url": "URL to MyCustomPlugin"
		}]
	});
