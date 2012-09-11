(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.Utils.isComponentDefined("Echo.View")) return;

/**
 * @class Echo.View
 * Class implementing core rendering logic, which is widely used across the system.
 * In addition to the rendering facilities, this class maintains the list of elements within
 * the given view ("view elements collection") and provides the interface to access/update them.
 *
 * @constructor
 * Class constructor encapsulating templates rendering and renderers application mechanics.
 *
 * @param config
 * Specifies class configuration parameters.
 *
 * @param {String} [config.cssPrefix]
 * CSS class name prefix used by the Echo.View to detect whether a certain element
 * should be added into the view elements collection (if the element CSS class name
 * matches the prefix) and which renderer should be applied in case the element
 * satisfies the CSS prefix match condition.
 *
 * @param {Object} [config.renderers]
 * Object which specifies a set of renderers which should be applied during the template
 * rendering. The name of the element is used as a key, the renderer function as the value.
 *
 * @param {Object} [config.substitutions]
 * Object containing the list of extra instructions to be applied during template compilation.
 *
 * @param {Object} [config.data]
 * Object with the data to be inserted into the template into the {data:%KEY%} placeholder.
 * The {data:%KEY%} is a default placeholder supported by the Echo.View even if no
 * substitution rules were defined in the config via "substitutions" field.
 *
 * @param {String} [config.template]
 * Template which should be processed using a given substitution rules and
 * the set of renderers.
 * Note: in order to prevent elements overriding in the view elements collection,
 * make sure that the template defined in the Echo.View constructor call contains
 * elements with the unique CSS class names (matching the CSS prefix).
 */
Echo.View = function(config) {
	config = config || {};
	this.config = config;
	this.config.cssPrefix = this.config.cssPrefix || "";
	this.renderers = config.renderers || {};
	this._clear();
};

/**
 * Accessor function to get specific element in this view.
 *
 * This function returns the corresponding element if it exists in the view.
 *
 * @param {String} name
 * The name of the element in the view to be obtained.
 * The name equals to a CSS class name defined for the element minus the CSS prefix
 * defined in the Echo.View object config. For example, if an element has the
 * "echo-item-container" CSS class and the "echo-item-" CSS prefix was defined
 * during the object constructor call, the element will be available using
 * the "container" name. If element has more than one CSS class name matching
 * the CSS prefix - it will be available under multiple names.
 *
 * @return {Object}
 * The corresponding value found in the object.
 */
Echo.View.prototype.get = function(name) {
	return this._elements[this._key(name)];
};

/**
 * Setter method to add element into the view elements collection.
 *
 * @param {String} name
 * The name of the element which should be added into the view elements collection.
 * See (link #get) to get more information about this field format.
 *
 * @param {Object|String} element
 * The corresponding DOM or jQuery element which should be added into collection.
 * The element might also be a HTML markup string which will be transformed into the
 * jQuery element before assignment.
 */
Echo.View.prototype.set = function(name, element) {
	this._elements[this._key(name)] = $(element);
};

/**
 * Method to remove a specific element from the view elements collection.
 *
 * @param {String|Object} element
 * The name of the element or the element itself to be removed from the collection.
 * See (link #get) to get more information about this field format in case of string name.
 */
Echo.View.prototype.remove = function(element) {
	var name = typeof element === "string"
		? this._key(element)
		: element.echo.name;
	this._elements[name].remove();
	delete this._elements[name];
};

/**
 * Function which indicates whether the view was rendered or not.
 *
 * @return {Boolean}
 */
Echo.View.prototype.rendered = function() {
	return !!this._rendered;
};

/**
 * Function to transform the template into the DOM representation and apply renderers.
 *
 * @param args
 * Specifies rendering parameters.
 *
 * @param {Object} [args.renderers]
 * Object which specifies a set of renderers which should be applied during the template
 * rendering. The name of the element is used as a key, the renderer function as the value.
 *
 * @param {Object} [args.substitutions]
 * Object containing the list of extra instructions to be applied during template compilation.
 *
 * @param {Object} [args.data]
 * Object with the data to be inserted into the template into the {data:%KEY%} placeholder.
 * The {data:%KEY%} is a default placeholder supported by the Echo.View even if no
 * substitution rules were defined in the config via "substitutions" field.
 *
 * @param {String} [args.template]
 * Template which should be processed using a given substitution rules and
 * the set of renderers.
 *
 * @return {Object}
 * DOM (jQuery element) representation of the given template using the rules specified.
 */
Echo.View.prototype.render = function(args) {
	args = args || {};
	args.data = args.data || this.config.data || {};
	args.template = args.template || this.config.template;

	// merge renderers passed into the "render" function
	// and the ones defined in the view config during initialization
	$.extend(this.renderers, args.renderers);

	// render specific element (recursively if specified)
	if (args.name) {
		args.target = args.target || this.get(args.name);
		if (!args.target) return false;
		var processor = args.recursive ? "recursive" : "element";
		return this._render[processor].call(this, args);
	}

	// render template
	if (args.template) {
		this._clear();

		// save template to use it for
		// the recursive renderer application call
		this._template = typeof args.template === "string"
					? args.template
					: args.template.html();

		var dom = this._render.template.call(this, args);
		this._rendered = true;
		return dom;
	}

	// unknown action
	return false;
};

/**
 * Function which instantiates an Echo.View object with the confing of the current instance.
 * This function is helpful when you need to process the template using the rules and
 * renderers specified for the parent Echo.View class instance.
 *
 * @param [config]
 * Configuration overrides object. See Echo.View class constructor
 * to get more information about the config object fields and types.
 *
 * @return {Object}
 * New Echo.View class instance with the configuration params taken from the current instance.
 */
Echo.View.prototype.fork = function(config) {
	return new Echo.View($.extend(true, this.config, config));
};

// private functions

Echo.View.prototype._render = {};

Echo.View.prototype._render.element = function(args) {
	return this._hasRenderer(args.name)
		? this._getRenderer(args.name)(args.target, args.extra)
		// no renderer found - nothing to render,
		// return non-modified target in this case
		: args.target;
};

Echo.View.prototype._render.recursive = function(args) {
	var oldNode = this.get(args.name);

	// define original template
	args.template = this._template;

	var dom = this._compileTemplate(args);
	this._applyRenderers($("." + this._key(args.name), dom));
	var newNode = this.get(args.name);
	oldNode.replaceWith(newNode);
	return newNode;
};

Echo.View.prototype._render.template = function(args) {
	var dom = this._compileTemplate(args);
	if (dom.hasClass("echo-tmp-wrapper")) {
		dom = $(dom.html());
	}
	return this._applyRenderers(dom);
};

Echo.View.prototype._key = function(name) {
	return this.config.cssPrefix + name;
};

Echo.View.prototype._clear = function() {
	this._elements = {};
};

Echo.View.prototype._compileTemplate = function(args) {
	// do not process if template is not a string
	if (typeof args.template !== "string") {
		return args.template;
	}
	var template = Echo.Utils.substitute({
		"data": args.data,
		"template": args.template,
		"instructions": this.config.substitutions
	});
	return $('<div class="echo-tmp-wrapper"/>').html(template);
};

Echo.View.prototype._applyRenderers = function(dom) {
	var view = this;
	var elements = this._getRenderableElements(dom);
	$.each(elements, function(name, element) {
		if (view._hasRenderer(name)) {
			view.render({
				"name": name,
				"target": element
			});
		}
	});
	return dom;
};

Echo.View.prototype._getRenderer = function(name) {
	return this.renderers[name];
};

Echo.View.prototype._hasRenderer = function(name) {
	return !!this._getRenderer(name);
};

Echo.View.prototype._getRenderableElements = function(container) {
	var view = this, elements = {};
	var isRenderer = new RegExp(this.config.cssPrefix + "(.*)$");
	container.find("*").andSelf().each(function(i, element) {
		if (!element.className) {
			return;
		}
		var classes = element.className.split(/[ ]+/);
		$.each(classes, function(j, className) {
			var pattern = className.match(isRenderer);
			var name = pattern ? pattern[1] : undefined;
			if (name) {
				view.set(name, element);
				element = view.get(name);
				element.echo = element.echo || {};
				element.echo.name = className;
				elements[name] = element;
			}
		});
	});
	return elements;
};

})(Echo.jQuery);
