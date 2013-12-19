# How to initialize Echo Clien Widget

## Initializing an app

Every application is represented by a single AMD module. In order to make it work, Echo JS SDK Loader should be loaded on a page and the module should be initialized in a certain way depending on the component role.

### Initializing a component as a standalone application

If you need to initialize a client widget as a standalone app on a page, you should use Echo.require function (it`s a separate instance of RequireJS) to load an application and call component constructor in callback function. So the final code might look like:

	<script src="http://cdn.echoenabled.com/sdk/v3.1/loader.js"></script>
	<script>
		Echo.require([
			"echo/streamserver/bundled-apps/stream/client-widget"
		], function(Stream) {
			new Stream({
				"backplane": {
					"serverBaseURL": "http://api.echoenabled.com/v1",
					"busName": "your_bus_name"
				},
				"target": document.getElementById("stream"),
				"query": "your_search_query",
				"appkey": "your_appkey",
				"item": {"reTag": false},
				"plugins": [{
					"component": "echo/streamserver/bundled-apps/stream/item/plugins/reply"
				}, {
					"component": "echo/streamserver/bundled-apps/stream/item/plugins/moderation"
				}]
			});
		});
	</script>

More information regarding the Echo.require function can be found in RequireJS docs [here](http://requirejs.org/docs/api.html#jsfiles).

### Initializing a component as an internal one of an app inherited from Echo.App

If you are building an app based on the Echo.App abstraction and you need to initialize an internal app inside it, the best approach would be to employ the [Echo.App.initApp](#!/api/Echo.App-method-initApp) function. In this case Echo.App abstraction will take care of the app management (passing some params, destroying it when the main app is destroyed, etc). In the example below an app initialization consists of 3 parts: creating AMD module, component default configuration and the init call itself. Example code:

	Echo.define("your-application", [
		"jquery",
		"echo/app",
		"echo/streamserver/bundled-apps/stream/client-widget"
	], function($, App, Stream) {

		…

		// application config
		YourApplication.config = {
			...
			"components": {
				"Stream": {
					"query": "your_search_query",
					"plugins": [{
						"component": "echo/streamserver/bundled-apps/stream/item/plugins/reply"
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
						"component": "echo/streamserver/bundled-apps/stream/item/plugins/moderation"
					}]
				}
			});
		};
	});

More information regarding the Echo.App.initApp function can be found {@link Echo.App#initApp here}.

## Initializing plugins

Almost every app built using Echo JS SDK can be extended via [Plugins](#!/guide/how_to_develop_plugin). In order to init a plugin for a given app, you should place the object with the "component" field into the "plugins" array, for example as shown below:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream({
			"backplane": {
				"serverBaseURL": "http://api.echoenabled.com/v1",
				"busName": "your_bus_name"
			},
			"target": document.getElementById("stream"),
			"appkey": "echo.jssdk.demo.aboutecho.com",
			"plugins": [{
				"component": "echo/streamserver/bundled-apps/stream/item/plugins/reply"
			}]
		});
	});

If your plugin has configurable options, you should put them into the same object, so that the plugin code can access them. For example:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream({
			"backplane": {
				"serverBaseURL": "http://api.echoenabled.com/v1",
				"busName": "your_bus_name"
			},
			"target": document.getElementById("stream"),
			"appkey": "echo.jssdk.demo.aboutecho.com",
			"plugins": [{
				"component": "echo/streamserver/bundled-apps/stream/item/plugins/reply"
				"actionString": "Type your comment here..."
			}]
		});
	});

If your plugin`s code is not loaded on a page yet, Echo JS SDK engine can take care of it for you, just add the "url" parameter with the plugin script URL. In this case the script will be downloaded and executed before the plugin initialization. For example:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream({
			"backplane": {
				"serverBaseURL": "http://api.echoenabled.com/v1",
				"busName": "your_bus_name"
			},		"target": document.getElementById("stream"),
			"appkey": "echo.jssdk.demo.aboutecho.com",
			"plugins": [{
				"url": "URL to my-custom-plugin",
				"component": "my-custom-plugin"
			}]
		});
	});
