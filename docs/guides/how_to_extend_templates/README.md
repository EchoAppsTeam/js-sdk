# How to extend templates

When developing the plugins, which extend the functionality of the existing controls and applications it is often required to change the HTML templates. The plugins mechanism allows to modify the app or control templates using the Echo.Plugin.extendTemplate method. Due to the fact that the control view is being assembled during its initialization, the Echo.Plugin.extendTemplate method should be called within the plugin.init as shown below:

    plugin.init = function() {
        this.extendTemplate(action, anchor, html);
    };

More info about the plugin development can be found in the ["How to develop a Plugin"](#!/guide/how_to_develop_plugin) guide.

The Echo.Plugin.extendTemplate method has the following arguments:

- action - transformation action, the following options are available:
    - remove - the element removal
    - replace - the replacement of an element by another one
    - insertBefore - insertion of an element before the given element
    - insertAfter - insertion of an element after the given element
    - insertAsFirstChild - insertion of an element as the first child of the given element
    - insertAsLastChild - insertion of an element as the last child of the given element
- anchor - the name of the element which is transformed
- html - HTML templates to be used in the transformation, it can also be the function returning the HTML template

Let's consider the most common use cases of the templates transformation.

## Element removal

The code below illustrates the initialization of the plugin which removes an item avatar in the Stream control Item:

    plugin.init = function() {
        this.extendTemplate("remove", "avatar");
    };

The left side of the image below illustrates the Stream control, while the right side shows the Stream control where the avatars are disabled using the above described plugin:

![Stream control](guides/how_to_extend_templates/images/removal_before.png)&nbsp;&nbsp;&nbsp;![Stream control without avatars](guides/how_to_extend_templates/images/removal_after.png)

_Note_:  in case it is required to hide an item instead of its complete removal, it is better to accomplish this using CSS.
The following code can serve as an example:

    plugin.css = ".{class:avatar} { display: none; }";

## Insertion of a new element

The Echo.Plugin.extendTemplate method provides several options of the new item insertion:

- insertBefore - insertion of an element before the given element
- insertAfter - insertion of an element after the given element
- insertAsFirstChild - insertion of an element as the first child of the given element
- insertAsLastChild - insertion of an element as the last child of the given element

As an example illustrating the item insertion, we can use the plugin that displays the number of item likes underneath the item actor avatar:

    plugin.init = function() {
        this.extendTemplate("insertAfter", "avatar", plugin.template);
    };

    plugin.template =
        '<span class="{plugin.class:likesCount}"></span>' +
        '<i class="icon-thumbs-up"></i>';

    plugin.renderers.likesCount = function(element) {
        return element
            .empty()
            .append(this.component.get("data.object.accumulators.likesCount"));
    };

The left side of the image below illustrates the Stream control, while the right side shows the Stream control that displays the number of item likes underneath the item actor avatar:

![Stream control](guides/how_to_extend_templates/images/insertion_before.png)&nbsp;&nbsp;&nbsp;![Stream control with item likes count](guides/how_to_extend_templates/images/insertion_after.png)

## Element replacement

Let's consider the case when it is required to replace the existing element by the one defined within the plugin.  For example we need to change the default display of the comment author name section in the HTML template containing the author name and the date the comment was posted:

    plugin.labels = {
        "createdBy": "Created by: ",
        "on": "on"
    };

    plugin.init = function() {
        this.extendTemplate("replace", "authorName", plugin.template);
    };

    plugin.template =
        '<div class="{plugin.class:header} echo-primaryFont echo-primaryColor">' +
            '{plugin.label:createdBy} <span class="{plugin.class:author} echo-linkColor"></span>' +
            '{plugin.label:on} <span class="{plugin.class:publishedDate}"></span>' +
        '</div>';

    plugin.renderers.author = function(element) {
        return element
            .empty()
            .append(this.component.get("data.actor.title"));
    };

    plugin.renderers.publishedDate = function(element) {
        var published = this.component.get("data.object.published");
        element.empty();
        if (!published) return element;
        var date = new Date(Echo.Utils.timestampFromW3CDTF(published) * 1000);
        return element
            .append(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
    };

The left side of the image below illustrates the Stream control, while the right side shows the Stream control where the display of the comment author name section is customised:

![Stream control](guides/how_to_extend_templates/images/replacement_before.png)&nbsp;&nbsp;&nbsp;![Stream control with customized author name section](guides/how_to_extend_templates/images/replacement_after.png)

## Plugin template modification

For example there is a Stream control with the "Like" plugin:

![Stream control with "Like" plugin](guides/how_to_extend_templates/images/plugins_before.png)

It is required to add a caption above the list of users who liked this comment. This can be achieved by creating a new plugin which will insert an HTML element containing the desired inscription directly above the element set by the "Like" plugin. The "LikesCaption" plugin code is shown below: 

    plugin.labels = {
        "header": "Liked by: "
    };

    plugin.init = function() {
        this.extendTemplate("insertBefore", "plugin-Like-likedBy", plugin.template);
    };

    plugin.template =
        '<div class="{plugin.class:likesHeader}">{plugin.label:header}</div>';

    // css customization
    plugin.css =
        '.echo-streamserver-controls-facepile-suffixText { display: none; }' +
        '.{plugin.class:likesHeader} { margin-top: 10px; }';

As we can see in the code in order to access the "likedBy" element which was added by the "Like" plugin we use "plugin-Like-likedBy" construction which has the following format "_plugin_-_the_plugin_name_-_the_name_of_the_element_".
Please note that in order to access the elements of other plugins, your plugin should be placed in the "plugins" array after the plugins which contain the elements you want to access. Here is the example of the Stream control initialization for the provided use-case:

    Echo.Loader.initApplication({
        "script": "http://cdn.echoenabled.com/sdk/v3/streamserver.pack.js",
        "component": "Echo.StreamServer.Controls.Stream",
        "config": {
             // some config parameters...
             "plugins": [{
                  "name": "Like"
             }, {
                  "name": "LikesCaption"  // goes after "Like"
             }]
        }
    });

Here is the final view of the Stream Item including the "Like" and "LikesCaption" plugins:

![Stream control with "Like" and "LikesCaption" plugins](guides/how_to_extend_templates/images/plugins_after.png)

The Echo.Plugin.extendTemplate method is widely used across Echo standard plugins. In this guide we described the most common use-cases and Echo plugins code might be a good source of information for your specific use-cases. Feel free to use any plugin as a pattern for your own plugin.
