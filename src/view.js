/**
 * @class Echo.View
 * Class implementing core rendering logic, which is widely used across the system.
 */
Echo.View = function(config) {
	this.config = config;
	this.config.cssPrefix = this.config.cssPrefix || "";
	this.renderers = config.renderers || {};
	this._clear();
};

// public interface

Echo.View.prototype.fork = function() {
	return new Echo.View(this.config);
};

Echo.View.prototype.get = function(name, ignorePrefix) {
	return this._elements[(ignorePrefix ? "" : this.config.cssPrefix) + name];
};

Echo.View.prototype.set = function(name, element) {
	this._elements[this.config.cssPrefix + name] = $(element);
};

Echo.View.prototype.remove = function(element) {
	var name = typeof element === "string"
		? this.config.cssPrefix + element
		: element.echo.name;
	this._elements[name].remove();
	delete this._elements[name];
};

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

		// exit if no target found
		if (!args.target) return false;

		var processor = args.recursive ? "recursive" : "element";
		return this._render[processor].call(this, args);
	}

	// render template
	if (args.template) {
		this._clear();
		var dom = this._render.template.call(this, args);
		this._rendered = true;
		return dom;
	}

	// unknown action
	return false;
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
	// TODO: save template somewhere to retrieve the original state here
	var dom = this._compileTemplate(args);
	this._applyRenderers($("." + this.config.cssPrefix + args.name, dom));
	var newNode = this.get(args.name);
	oldNode.replaceWith(newNode);
	return newNode;
};

Echo.View.prototype._render.template = function(args) {
	return this._applyRenderers(this._compileTemplate(args));
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
