Ext.data.JsonP.how_to_use_template_placeholders({
  "guide": "<h1 id='how_to_use_template_placeholders-section-how-to-use-template-placeholders'>How to use template placeholders</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/how_to_use_template_placeholders-section-placeholder-structure'>Placeholder structure</a></li>\n<li><a href='#!/guide/how_to_use_template_placeholders-section-echo-utils-substitute'>Echo.Utils.substitute</a></li>\n<li><a href='#!/guide/how_to_use_template_placeholders-section-placeholders-usage-in-echo-app'>Placeholders usage in Echo.App</a></li>\n<li><a href='#!/guide/how_to_use_template_placeholders-section-placeholders-usage-in-echo-plugin'>Placeholders usage in Echo.Plugin</a></li>\n</ol>\n</div>\n\n<p>It’s often pretty convenient to use placeholders when you work with string values (such as HTML templates, CSS rules, etc). It helps to split the template and the data, which improves the quality of the code and makes the code more readable.</p>\n\n<p>In Echo SDK we use templates in different subsystems a lot. The goal of this guide is to describe the methods we use to work with templates and where the templates approach makes sense.</p>\n\n<h2 id='how_to_use_template_placeholders-section-placeholder-structure'>Placeholder structure</h2>\n\n<p>Here is a quick example of the template (code is taken from Echo Counter app):</p>\n\n<pre><code>counter.templates.main = \"&lt;span&gt;{data:count}&lt;/span&gt;\";\n</code></pre>\n\n<p>As you can see placeholders in Echo JS SDK consists of the placeholder type and value. The type and value are split using the colon and wrapped using the curly brackets. So the general placeholder structure looks like <code>{type:value}</code>.</p>\n\n<h2 id='how_to_use_template_placeholders-section-echo-utils-substitute'>Echo.Utils.substitute</h2>\n\n<p>In order to process the template and convert all the placeholders into their final values, the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function is used. This method accepts an object with the following keys as the argument:</p>\n\n<ul>\n<li>template - the template string</li>\n<li>data - object which contains the data which should be inserted into the template.</li>\n</ul>\n\n\n<p>More information can be found in the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function docs.</p>\n\n<p>Let’s have a look at the example:</p>\n\n<pre><code>var template = \"&lt;span&gt;{data:count}&lt;/span&gt;\";\nvar data = {\"count\": \"10\"};\nvar compiled = <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a>({\"template\": template, \"data\": data});\n</code></pre>\n\n<p>The result of the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function application will look like:</p>\n\n<pre><code>&lt;span&gt;10&lt;/span&gt;\n</code></pre>\n\n<p>As you can see the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> method replaced the placeholder with the respective value from the <code>data</code> object which we passed as a part of the function argument.</p>\n\n<p>The <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function can recognize only the <code>{data:...}</code> placeholder by default. It’s enough for most simple cases, but there is an option to define your own types of placeholders for the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function to work with. In order to do that you should pass the <code>instructions</code> key inside the object, for example:</p>\n\n<pre><code>var template = \"&lt;div&gt;{sqrt:9}&lt;/div&gt;\";\nvar compiled = <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a>({\n    \"template\": template,\n    \"instructions\": {\n        \"sqrt\": function(key) {\n            key = parseFloat(key);\n            return isNaN(key) ? \"\" : Math.sqrt(parseInt(key));\n        }\n    }\n});\n</code></pre>\n\n<p>As a result, the <code>compiled</code> variable will have the following value:</p>\n\n<pre><code>&lt;div&gt;3&lt;/div&gt;\n</code></pre>\n\n<h2 id='how_to_use_template_placeholders-section-placeholders-usage-in-echo-app'>Placeholders usage in Echo.App</h2>\n\n<p>While building your own app you can use the <a href=\"#!/api/Echo.App-method-substitute\" rel=\"Echo.App-method-substitute\" class=\"docClass\">Echo.App.substitute</a> function available inside the app methods. This method utilizes the <a href=\"#!/api/Echo.Utils-static-method-substitute\" rel=\"Echo.Utils-static-method-substitute\" class=\"docClass\">Echo.Utils.substitute</a> function with a few <a href=\"#!/api/Echo.App\" rel=\"Echo.App\" class=\"docClass\">Echo.App</a>-specific placeholders (or instructions).</p>\n\n<p>The list of the placeholders supported inside the app functions can be found below. In examples below we assume that we operate inside the <a href=\"#!/api/Echo.StreamServer.Controls.Stream.Item\" rel=\"Echo.StreamServer.Controls.Stream.Item\" class=\"docClass\">Echo.StreamServer.Controls.Stream.Item</a> class. Here is the list:</p>\n\n<ul>\n<li><p><code>{class:value}</code>\nThe placeholder will be replaced with the CSS class with the CSS prefix specific for the current app (based on the app name).</p>\n\n<p>For example, the following part of the template:</p>\n\n<pre><code>  &lt;div class=\"{class:avatar}\"&gt;&lt;/div&gt;\n</code></pre>\n\n<p>will be replaced with:</p>\n\n<pre><code>  &lt;div class=\"echo-streamserver-controls-stream-item-avatar\"&gt;&lt;/div&gt;\n</code></pre>\n\n<p>Note: the value of the <code>class</code> placeholder also serves as the name of the renderer which should be applied for this particular element. More information about the rendering engine can be found <a href=\"#!/guide/terminology-section-rendering-engine\">here</a>.</p></li>\n<li><p><code>{config:value}</code>\nThis placeholder is used to access the config of the given app. You can access the config field at any nested level using the \".\" to move to the next level. In the example below:</p>\n\n<pre><code>  {\n      // ...\n      \"cdnBaseURL\": {\"sdk\": \"http://cdn.echoenabled.com/sdk/v3/\"}\n      // ...\n  }\n</code></pre>\n\n<p>We can access the value of the <code>sdk</code> key by using the <code>{config:cdnBaseURL.sdk}</code> placeholder in template. So if we have a template which contains something like:</p>\n\n<pre><code>  {config:cdnBaseURL.sdk}/gui.pack.js\n</code></pre>\n\n<p>after the substitution the string will look like:</p>\n\n<pre><code>  http://cdn.echoenabled.com/sdk/v3/gui.pack.js\n</code></pre></li>\n<li><p><code>{data:value}</code>\nThe placeholder can be used to access the \"data\" attribute of a given app. The {data:...} placeholder also allows accessing the nested properties using the \".\" char to split the levels. For example, the following template:\n      <span class=\"{class:metadata-value}\">{data:actor.id}</span></p>\n\n<p>will be converted to:</p>\n\n<pre><code>  &lt;span class=\"echo-streamserver-controls-stream-item-metadata-value\"&gt;http://twitter.com/user&lt;/span&gt;\n</code></pre></li>\n<li><p><code>{label:value}</code>\nThe placeholder is used to access the labels defined for the given app. Example template string:</p>\n\n<pre><code>  {label:userID} http://example.com/some-id\n</code></pre>\n\n<p>after processing will look like the following string:</p>\n\n<pre><code>  User ID: http://example.com/some-id\n</code></pre></li>\n<li><p><code>{self:value}</code>\nThe placeholder is used to access the properties of a given app instance. Accessing the properties for the nesting level values is also supported (using \".\" char).</p>\n\n<p>For example the following string:</p>\n\n<pre><code>  &lt;div&gt;{self:depth}&lt;/div&gt;\n</code></pre>\n\n<p>will be converted to the one below:</p>\n\n<pre><code>  &lt;div&gt;0&lt;/div&gt;\n</code></pre></li>\n</ul>\n\n\n<p>You can use the placeholders described above in an app and plugin templates, CSS code (defined in the <code>css</code> field in the manifest) and inside the dependency URLs (defined within the <code>dependencies</code> array in the manifest). More examples can be found in the <a href=\"#!/guide/how_to_develop_app\">How to develop an App</a> guide.</p>\n\n<h2 id='how_to_use_template_placeholders-section-placeholders-usage-in-echo-plugin'>Placeholders usage in Echo.Plugin</h2>\n\n<p><a href=\"#!/api/Echo.Plugin\" rel=\"Echo.Plugin\" class=\"docClass\">Echo.Plugin</a> class also contains specific method (<a href=\"#!/api/Echo.Plugin-method-substitute\" rel=\"Echo.Plugin-method-substitute\" class=\"docClass\">Echo.Plugin.substitute</a>) to deal with the plugin-specific placeholders. In case of a plugin the method works with a given plugin data. Here is the list of supported placeholders:</p>\n\n<ul>\n<li><code>{plugin.class:value}</code></li>\n<li><code>{plugin.config:value}</code></li>\n<li><code>{plugin.data:value}</code></li>\n<li><code>{plugin.label:value}</code></li>\n<li><code>{plugin.self:value}</code></li>\n</ul>\n\n\n<p>The placeholders have the same semantics as the placeholders defined for <a href=\"#!/api/Echo.App\" rel=\"Echo.App\" class=\"docClass\">Echo.App</a>. <a href=\"#!/api/Echo.App\" rel=\"Echo.App\" class=\"docClass\">Echo.App</a>-specific placeholders are also available when you work with the templates inside the plugin (these placeholders will access the given app properties).</p>\n\n<p>More examples of the placeholders can be found in our <a href=\"#!/guide/how_to_develop_plugin\">documentation</a> and in the source code of the existing plugins.</p>\n",
  "title": "How to use template placeholders"
});