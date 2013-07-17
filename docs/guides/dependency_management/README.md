# Dependency management in Echo JS SDK

Modern browsers optimize their work with web resources in the many different ways, working with HTTP connections is not the exception here. Browser is able to handle several connections simultaneously. This fact allows to decrease application initialization time significantly as a result decreasing page rendering time.

## Overview

As a result developer can design and build their application architecture better by dividing it into several modules without caring much that a big number of files will affect application performance or responsiveness. It was [shown](http://blog.getify.com/labjs-why-not-just-concat/) that parallel downloading of small files leads to better performance comparing with downloading of a single big concatenated file.

Usually Javascript files downloaded via &lt;script> tag block page rendering and parsing of other code. This mode is named synchronous loading. Asynchronous loading doesn’t block page activity which is obviously much better. Figures 1 and 2 below illustrate this difference between modes.

*Figure 1. Synchronous scripts loading*

<img src="guides/dependency_management/figure1.png" alt="Figure 1. Synchronous scripts loading" width="100%"><br><br>

*Figure 2. Asynchronous scripts loading using Echo.Loader.download method*

<img src="guides/dependency_management/figure2.png" alt="Figure 2. Asynchronous scripts loading using Echo.Loader.download method" width="100%"><br><br>

Both figures show that scripts are downloaded in parallel. Synchronous mode makes the DOM available in 771ms (figure 1) while asynchronous is about 3 times faster - DOM is available in 232ms (figure 2).

Echo.Loader.download method accepts a list of resources to load as a first argument. Resources here are not only Javascript files but CSS files also. This method loads files in parallel in the arbitrary order but executes them in the order they were specified. This logic allows to download resources as fast as possible preserving the dependencies execution order at the same time.

Properly designed application should be divided into modules. In the Echo JS SDK each module (or a number of dependent modules) is represented as a separate .js file. There is no need to put everything in one file because these separate modules can be loaded on a separate basis when they are needed.

Application might need some module functionality during its initialization or when some action happens, for example user clicks on some link.

## Specifying dependencies for an App

While developing an application (see the [“how to guide”](#!/guide/how_to_develop_app)) you may specify some modules the application is dependent on during its initialization. Here is the example how to do it:

	Comments.dependencies = [{
		"loaded": function() {
			return Echo.App.isDefined("Echo.StreamServer.Controls.Submit") &&
				Echo.App.isDefined("Echo.StreamServer.Controls.Stream");
		},
		"url": "{config:cdnBaseURL.sdk}/streamserver.pack.js"
	}];

This code describes a single dependency which will be loaded only if there are no Stream and Submit Apps on the page already. More details on what happens in this example can be found [here](#!/guide/how_to_develop_app-section-8).

## Specifying dependencies for a Plugin

Your plugin might also rely on some external resources required for its initialization. Echo JS SDK engine provides an ability to define these dependencies within the Plugin manifest. More information about the plugin dependencies definition can be found in the ["How to develop a Plugin" guide](#!/guide/how_to_develop_plugin-section-12).

## Specifying dependencies to load on demand

Some dependencies are needed only when some activity happens on the page like user clicking some button or reacting to server response. In this case there is no need of loading such resources during application initialization. More correct way to do it is to use Echo.Loader.download method mentioned above. Let’s look how to work with on-demand dependencies.


Imagine we develop the application dealing with user social activity. User should be able not only to post some comments but also to share his activity in some social networks. One of the services providing this type of functionality is [Janrain](http://janrain.com/). We don’t really want to load Janrain scripts every time we initialize our application because user might not share anything at all. Let’s look on some code downloading Janrain script on demand:

	SomeApp.renderers.shareButton = function(element) {
		element.click(function() {
			Echo.Loader.download([{
				“url”: “url_to_share_janrain_script”,
				“loaded”: function() {
					return !!SomeJanrainModule;
				}
			}], function() {
				// some sharing logic here
			});
		});
	};

In this example firstly we download Janrain module and then do our own business logic. This trick allows us to shorten application initialization time. Note that Echo.Loader.download method always remembers scripts it loaded before. So it won’t load the same script many times on repetitious calls but instead will execute specified callback immediately.
