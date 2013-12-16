# Transition from v3.0.x to v3.1.0

## Overview

The Echo JS SDK v3.1.0 is a highly rebuilded version. PLugins and applications are not compitible between JS SDK v3.0.x and v3.1.0.
For examples of existing apps and plugins visit the [Examples Page](#!/example).

### Echo JS SDK v3.0.x to v3.1.0 changeset

- Yepnope loader was replaced by RequireJS.
Since that where is an isolated RequireJS instance - Echo.require.
- Echo.Control doesn't exist any more. A part of it's functionality is replaced into Echo.App.
As a result Stream, Submit, etc. are inherited from Echo.App.
- JS SDK structure was changed according to AMD methodology and new JS SDK conception.

## JS SDK initialization changes

JS SDK v3.1.0 has an enterence point- loader script. If you want to get access to JS SDK functionality you have to include loader script on you page. It can looks like this:

	<script src="http://cdn.echoenabled.com/sdk/v3/loader.js"></script>

Then loader script is included you can either use JS SDK functionality (e.g. Echo.require function to get SDK components) or initialize client widgets.
Since 3.1.0 JS SDK components are done like an AMD modules. All of them have their own unic module name, which are specified into documentation for each of JS SDK components.
If you want to use any custom component you have to specify absolute URL to it. It can looks this way:

	Echo.require(["http://any.custom.url/to/your/component.js"], function(Component) {
		…
	});	

Please, see ["How to initialize client widget"](#!/guide/how_to_initialize_client_widget) guide for more details. 
Also you can read [RequireJS documentation](http://requirejs.org/docs/api.html#usage) to get more information about its usage.

## Applications migration 

According to JS SDK 3.1.0 contract, you have to change application initialization - it sould be done using Echo.require. For example:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream(config);
	});

If you use any custom component you are to specify absolute path in Echo.requires parameter. For example:

	Echo.require(["//cdn.echoenabled.com/apps/echo/comments-sample/comments-sample.js"], function(Comments) {
		new Comments(config);
	});

Moreover, if you already have your own application where are a few quite simple steps to migrate from JS SDK v3.0.x to v3.1.0.

- You have to change your plugin wrapper from JavaScript closure to Echo.define call.
- All dependencies of your plugin should be replaced into Echo.define.
- You are to return constructed object in the end of the definition.

As a result it should looks like this:

	Echo.define(["jquery", "echo/app"], function($, App) {
		var Comments = App.definition("Echo.Apps.CommentsSample");
		…
		return App.create(Comments);
	});

To get more information please read ["How to develop an App"](#!/guide/how_to_develop_app) guide.
Also it can be good for you to read [how to define a module in RequireJS](http://requirejs.org/docs/api.html#define).

## Plugins migration

According to JS SDK 3.1.0 contract, you have to change plugins initialization. For example:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream({
			…
			"plugins": [{
				"component": "echo/streamserver/bundled-apps/stream/item/plugins/reply"
				"actionString": "Type your comment here..."
			}]
		});
	});

If you already have your own plugin you have to do the same three steps as for application migration

As a result it should looks like this:

	Echo.define(["jquery, echo/plugin"], function($, Plugin)  {
		var plugin = Plugin.definition("StreamSortingSelector", "Echo.StreamServer.BundledApps.Stream.ClientWidget");
		…
		return Plugin.create(plugin);
	});

If your plugin`s code is not loaded on a page yet, Echo JS SDK engine can take care of it for you, just add the "url" parameter with the plugin script URL. In this case the script will be downloaded and executed before the plugin initialization. For example:

	Echo.require([
		"echo/streamserver/bundled-apps/stream/client-widget"
	] , function(Stream) {
		new Stream({
			…
			"plugins": [{
				"url": "URL to my-custom-plugin",
				"component": "my-custom-plugin"
			}]
		});
	});

To get more information please read ["How to develop a Plugin"](#!/guide/how_to_develop_plugin) guide.
