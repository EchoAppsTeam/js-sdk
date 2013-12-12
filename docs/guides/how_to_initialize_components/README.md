# How to initialize Echo Clien Widget

## Initializing an app

Every application is represented by a single JS class. In order to make it work, Echo JS SDK environment should be loaded on a page and the class should be initialized in a certain way depending on the component role.

### Initializing a component as a standalone application

If you need to initialize a client widget as a standalone app on a page, you should use unified apps init function called Echo.initApplication. The function is defined in the "loader.js" file, so you have to include it into the page source first (<span style="color: red;">only once per page!</span>). So the final code might look like:

	<script src="http://cdn.echoenabled.com/sdk/v3/loader.js"></script>
	<script>
		Echo.initApplication("echo/streamserver/bundled-apps/stream/client-widget", {
			"backplane": {
				"serverBaseURL": "http://api.echoenabled.com/v1",
				"busName": "your_bus_name"
			},
			"target": document.getElementById("stream"),
			"query": "your_search_query",
			"appkey": "your_appkey",
			"item": {"reTag": false},
			"plugins": [{
				"url": "echo/streamserver/plugins/reply"
			}, {
				"url": "echo/streamserver/plugins/moderation"
			}]
		});
	</script>

<span style="color: red;">Check this link</span>
More information regarding the Echo.initApplication function can be found [here](#!/api/Echo.Loader-static-method-initApplication).

### Initializing a component as an internal one of an app inherited from Echo.App

If you are building an app based on the Echo.App abstraction and you need to initialize an internal app inside it, the best approach would be to employ the [Echo.App.initApp](#!/api/Echo.App-method-initApp) function. In this case Echo.App abstraction will take care of the app management (passing some params, destroying it when the main app is destroyed, etc). In the example below an app initialization consists of 2 parts: component default configuration and the init call itself. Example code:

	Echo.define("your-application", [
		"jquery",
		"echo/app",
		"echo/streamserver/bundled-apps/stream/client-widget"
	], function($, App, Stream) {

		// application config
		YourApplication.config = {
			...
			"components": {
				"Stream": {
					"query": "your_search_query",
					"plugins": [{
						"url": "echo/streamserver/plugins/reply"
					}]
				}
			}
			…
		};

		…

		YourApplication.renderers.stream = function(element) {
			this.initApp({
				"id": "Stream", // id in the "component" configuration object
				"component": Stream,
				"config": {
					"target": element,
					"appkey": "your_appkey",
					"item": {"reTag": false},
					"plugins": [{
						"url": "echo/streamserver/plugins/moderation"
					}]
				}
			});
		};
	});

More information regarding the Echo.App.initApp function can be found {@link Echo.App#initApp here}.

## Initializing plugins

Almost every app built using Echo JS SDK can be extended via
[Plugins](#!/guide/how_to_develop_plugin). In order to init a plugin for a given app, you should place the object with the "component" field into the "plugins" array, for example as shown below:

	Echo.initApplication("echo/streamserver/bundled-apps/stream/client-widget", {
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"component": "echo/streamserver/plugins/reply"
		}]
	});

If your plugin has configurable options, you should put them into the same object, so that the plugin code can access them. For example:

	Echo.initApplication("echo/streamserver/bundled-apps/stream/client-widget", {
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"component": "echo/streamserver/plugins/reply"
			"actionString": "Type your comment here..."
		}]
	});

If your plugin's code is not loaded on a page yet, Echo JS SDK engine can take care of it for you, just add the "url" parameter with the plugin script URL. In this case the script will be downloaded and executed before the plugin initialization. For example:

	Echo.initApplication("echo/streamserver/bundled-apps/stream/client-widget", {
		"target": document.getElementById("stream"),
		"appkey": "echo.jssdk.demo.aboutecho.com",
		"plugins": [{
			"component": "my-custom-plugin",
			"url": "URL to my-custom-plugin"
		}]
	});
