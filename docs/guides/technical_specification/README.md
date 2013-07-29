# Technical Specification

## Overview

This document contains technical limitations, browser support of the JS SDK and will soon include a more detailed accounting of the design principles and technology choices of the SDK.

## Limitations

### Quirks browser mode is not supported

Key components used in the SDK (such as Bootstrap UI Framework and Isotope library, which we use for Pinboard visualization plugin) do not support the quirks mode, so we decided to decline the quirks mode support as well. The SDK will still be functioning in quirks mode but some of the features will not be available and the UI components might not be rendered properly. More information about the quirks browser mode can be found [here](http://en.wikipedia.org/wiki/Quirks_mode).

## Fault tolerant jQuery support

Echo JS SDK uses its own instance of jQuery to isolate SDK code execution from the other code on the page and vice versa. It also helps to prevent jQuery version conflicts. This instance is namespaced as *Echo.jQuery*. Its version is regularly updated, usually within a few weeks since the jQuery official release date. The actual version used in production code can be found in the [SDK changelog](https://github.com/EchoAppsTeam/js-sdk/blob/master/Changelog.md).

At the moment Echo SDK includes only 2 jQuery plugins: *isotope* and *viewport*. Their code is wrapped using the method described [here](#!/guide/terminology-section-3) to use Echo instance of jQuery. Nothing on the page will be able to interact with these exact plugins unless it uses Echo.jQuery.

If third-party application built on top of this SDK utilizes some other jQuery plugins it should do one of the following:

  + use the plugin as is but make sure that some jQuery instance is used on the page;
  + put a copy of the plugin into its codebase and wrap it with the [Echo wrapper](#!/guide/terminology-section-3).


## Browser support

Echo JS SDK is tested against new non-beta versions of the browsers listed below (within 2 weeks of their respective official release dates):

+ Firefox (latest version) on Windows and Mac OS X
+ Safari (latest version) on Windows and Mac OS X
+ Chrome (latest version) on Windows and Mac OS X
+ Internet Explorer 8, 9 and 10 on Windows
+ Mobile Safari on iPad and iPhone
+ Native Browser on Android 4+ version
