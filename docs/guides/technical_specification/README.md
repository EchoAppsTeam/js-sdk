# Technical Specification

## Overview

This document contains technical limitations, browser support of the JS SDK and will soon include a more detailed accounting of the design principles and technology choices of the SDK.

## Limitations

### Quirks browser mode is not supported

Key components used in the SDK (such as Bootstrap UI Framework and Isotope library, which we use for Pinboard visualization plugin) do not support the quirks mode, so we decided to decline the quirks mode support as well. The SDK will still be functioning in quirks mode but some of the features will not be available and the UI components might not be rendered properly. More information about the quirks browser mode can be found [here](http://en.wikipedia.org/wiki/Quirks_mode).

## Browser support

More information is coming soon, please check back later...
