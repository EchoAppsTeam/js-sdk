Echo.define("echo/view", [
	"jquery",
	"echo/utils"
], function($, Utils) {

"use strict";

/**
 * @class Echo.View
 * Class implementing core rendering logic, which is widely used across the system.
 * In addition to the rendering facilities, this class maintains the list of elements within
 * the given view ("view elements collection") and provides the interface to access/update them.
 *
 *		var view = new Echo.View({
 *			"cssPrefix": "some-prefix-",
 *			"renderers": {
 *				"header": function(element) {
 *					// will return element as is
 *					return element;
 *				}
 *			},
 *			"template": '<div class="some-prefix-container">' +
 *				'<div class="some-prefix-header">{data:header}</div>' +
 *				'<div class="some-prefix-content">{data:content}</div>' +
 *			'</div>',
 *			"data": {
 *				"header": "Header text",
 *				"content": "Content text"
 *			}
 *		});
 *
 *		view.render(); // will render the corresponding template
 *		view.get("content"); // will return a jquery object with the className "some-prefix-content"
 *		view.get("header").text(); // will return "Header text"
 *		view.set("footer", $('<div class="some-prefix-footer">'));
 *
 *		// will place the "footer" element after "content" element in the view
 *		view.get("footer").insertAfter(view.get("content"));
 *
 *		var view2 = view.fork({
 *			"renderers": {
 *				"content": function(element) {
 *					return element.addClass("some-external-className");
 *				}
 *			}
 *		});
 *
 *		view2.render();
 *		view2 === view; // will return false
 *		view2.get("content").attr("class"); // will return "some-prefix-content some-external-className"
 *		view.get("content").attr("class"); // will return "some-prefix-content"
 *
 * @package apps.sdk.js
 * @module
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
 * @param {Function} [config.renderer]
 * Function to be applied for each element in the view elements collection.
 *
 * The "renderer" function must return the value of the "target" field of the incoming object.
 *
 * Additional notes:
 *
 * + if this parameter is defined, the "renderers" config field value will be ignored
 * + this function is for advanced use only, for most cases you should use the "renderers"
 * object instead
 *
 * @param {Object} config.renderer.args
 * Object which contains renderer specific information.
 *
 * @param {String} config.renderer.args.name
 * Name of the renderer specific for the current element
 *
 * @param {HTMLElement} config.renderer.args.target
 * Reference to jQuery object which represents the current element
 *
 * @param {Object} [config.renderer.args.extra]
 * The JS object with the set of extra parameters required to process
 * the current element
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
var View = function(config) {
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
View.prototype.get = function(name) {
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
View.prototype.set = function(name, element) {
	this._elements[this._key(name)] = $(element);
};

/**
 * Method to remove a specific element from the view elements collection.
 *
 * @param {String|Object} element
 * The name of the element or the element itself to be removed from the collection.
 * See (link #get) to get more information about this field format in case of string name.
 */
View.prototype.remove = function(element) {
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
View.prototype.rendered = function() {
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
View.prototype.render = function(args) {
	args = args || {};
	args.data = args.data || this.config.data || {};
	args.template = args.template || this.config.template;

	// merge renderers passed into the "render" function
	// and the ones defined in the view config during initialization
	if (args.renderers) {
		$.extend(this.renderers, args.renderers);
	}

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
View.prototype.fork = function(config) {
	return new View($.extend(true, {}, this.config, config));
};

// private functions

View.prototype._render = {};

View.prototype._render.element = function(args) {
	return this.config.renderer
		? this.config.renderer(args)
		: this._hasRenderer(args.name)
			? this._getRenderer(args.name)(args.target, args.extra)
			// no renderer found - nothing to render,
			// return non-modified target in this case
			: args.target;
};

View.prototype._render.recursive = function(args) {
	var oldNode = this.get(args.name);

	// define original template
	args.template = this._template;

	var dom = this._compileTemplate(args);
	this._applyRenderers($("." + this._key(args.name), dom));
	var newNode = this.get(args.name);
	oldNode.replaceWith(newNode);
	return newNode;
};

View.prototype._render.template = function(args) {
	var dom = this._compileTemplate(args);
	if (dom.hasClass("echo-tmp-wrapper")) {
		dom = $(dom.html());
	}
	return this._applyRenderers(dom);
};

View.prototype._key = function(name) {
	return this.config.cssPrefix + name;
};

View.prototype._clear = function() {
	this._elements = {};
};

View.prototype._compileTemplate = function(args) {
	// do not process if template is not a string
	if (typeof args.template !== "string") {
		return args.template;
	}
	var template = Utils.substitute({
		"data": args.data,
		"template": args.template,
		"instructions": this.config.substitutions
	});
	return $('<div class="echo-tmp-wrapper"/>').html(template);
};

View.prototype._applyRenderers = function(dom) {
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

View.prototype._getRenderer = function(name) {
	return this.renderers[name];
};

View.prototype._hasRenderer = function(name) {
	return this.config.renderer ? true : !!this._getRenderer(name);
};

View.prototype._getRenderableElements = function(container) {
	var view = this, elements = {};
	var isRenderer = new RegExp(this.config.cssPrefix + "(.*)$");
	container.find("*").addBack().each(function(i, element) {
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

// FIXME: __DEPRECATED__
// remove this after full require js compatible implementation
Utils.set(window, "Echo.View", View);

return View;

});
