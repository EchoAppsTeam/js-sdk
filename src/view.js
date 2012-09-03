/**
 * @class Echo.View
 * Class implementing core rendering logic, which is widely used across the system.
 *
 * @param config
 * Specifies class configuration parameters.
 *
 * @param {String} [config.template]
 * Note: in order to prevent elements overriding, make sure that the template
 * defined in the Echo.View constructor call contains elements with the unique CSS
 * class names (matching the CSS prefix).
 */
Echo.View = function(config) {
	this.config = config || {};
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
 * return {Boolean}
 */
Echo.View.prototype.rendered = function() {
	return !!this._rendered;
};

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

Echo.View.prototype.fork = function(config) {
	return new Echo.View(
		$.extend(true, this.config, config)
	);
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
	return this._applyRenderers(this._compileTemplate(args));
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
	return $("<div/>").html(template);
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
				element = $(element);
				element.echo = element.echo || {};
				element.echo.name = className;
				elements[name] = element;
			}
		});
	});
	return elements;
};
