(function() {

// XXX
if (!Echo.AppServer) Echo.AppServer = {};

/**
 * @class Echo.AppServer.Controls.Configurator
 * @extends Echo.Control
 * @inheritdoc Echo.Control
 */
var configurator = Echo.Control.manifest("Echo.AppServer.Controls.Configurator");

var _pluginsByControl = {
	"Echo.StreamServer.Controls.Stream": ["InfiniteScroll", "PinboardVisualization"],
	"Echo.StreamServer.Controls.Stream.Item": ["Like", "Moderation", "PinboardVisualization", "Edit", "Reply", "ItemAccumulatorDisplay", "CommunityFlag", "MetadataManager", "TwitterIntents"]
};

configurator.vars = {
	"currentPageIndex": -1,
	"pages": [],
	"pageIndexByName": {}
};

configurator.config = {
};

configurator.templates.main =
	'<div class="{class:container} echo-primaryFont echo-primaryBackgroundColor">' +
		'<div class="{class:header}"></div>' +
		'<div class="{class:pages}"></div>' +
		'<div class="{class:footer}">' +
			'<button>Save</button>' +
		'</div>' +
	'</div>';

configurator.templates.formRow =
	'<div class="{class:form-row}">' +
		'<div class="{class:name}">{data:name}</div>' +
		'<div class="{class:description}">{data:description}</div>' +
		'<div class="{class:field}"></div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

configurator.init = function() {
	this.pages.push({"name": this.config.get("startPage")});
	this.dom.render();
};

configurator.renderers.header = function(element) {
	element.empty();
	var names = Echo.Utils.foldl([], this.pages, function(page, acc) {
		acc.push(page.name);
	});
	element.append("<span>" + names.join(" -> ") + "</span>");
	return element;
};

configurator.renderers.pages = function(element) {
	var self = this;
	element.empty();
	$.each(this.pages, function(i, page) {
		self._renderPage(page, self.data);
	});
	this.showCurrentPage();
	return element;
};

configurator.methods.showCurrentPage = function() {
	if (!this.currentPageIndex) {
		this.dom.get("pages").children().hide();
		this.pages[this.currentPageIndex].element.show();
	} else {
		var prev = this.pages[this.currentPageIndex - 1].element;
		var cur = this.pages[this.currentPageIndex].element;
		var width = prev.parent().width() + 20;
		prev.fadeOut({
			"duration": "fast",
			"complete": function() {
				cur.fadeIn({
					"duration": "fast"
				});
			}
		});
	}
};

// internal functions

configurator.methods._renderPage = function(page, data) {
	var index = this.pageIndexByName[page.name];
	if (typeof index !== "undefined") {
		this.currentPageIndex = index;
		this.showCurrentPage();
		return;
	}
	this.pageIndexByName[page.name] = ++this.currentPageIndex;
	var spec = $.extend(true, {}, Echo.Utils.getComponent(page.name).ConfigSpecification);
	var element = $(this.substitute('<div class="{class:page}"></div>')).hide();
	element.append(this._form(spec, data));
	page.element = element;
	this.dom.get("pages").append(element);
};

configurator.methods._form = function(config, data, depth) {
	var self = this;
	data = data || {};
	depth = depth || 0;
	var form = $(this.substitute('<div class="{class:form} {class:form-' + depth + '}"></div>'));
	$.each(config, function(i, spec) {
		var type;
		switch (spec.type) {
			case "Boolean":
				type = "checkbox";
				break;
			case "Number":
			case "String":
				if (spec.values) {
					type = "dropdown";
				} else {
					type = "text";
				}
				break;
			case "Array":
				type = "multiCheckbox";
				break;
			case "Object":
				type = "nestedForm";
				break;
			default:
				type = "nestedPage";
		}
		var value = typeof data[spec.name] === "undefined"
			? spec.defaultValue
			: data[spec.name];
		// XXXX
		spec.name = spec.title || spec.name;
		spec.description = spec.description || (spec.name + " " + spec.type);
		var row = $(self.substitute(self.templates.formRow, spec));
		if (type === "nestedForm") {
			row.addClass(self.cssPrefix + "form-row-group");
		}
		form.append(row);
		self["_" + type](row.find("." + self.cssPrefix + "field"), spec, value, depth);
	});
	return form;
};

configurator.methods._checkbox = function(element, spec, value) {
	var checkbox = $('<input type="checkbox">').attr("checked", value);
	element.prepend(checkbox);
	return checkbox;
};

configurator.methods._text = function(element, spec, value) {
	var text = $('<input type="text">').val(value);
	element.append(text);
	return text;
};

configurator.methods._dropdown = function(element, spec, value) {
	var dropdown = $('<select></select>');
	$.each(spec.values, function(i, v) {
		dropdown.append('<option value="' + v + '">' + v + '</option>');
	});
	dropdown.val(value);
	element.append(dropdown);
	return dropdown;
};

configurator.methods._multiCheckbox = function(element, spec, values) {
	var self = this;
	var group = $("<div>");
	$.each(spec.values, function(i, v) {
		var checked = $.isEmptyObject(values)
			? true
			: $.inArray(v, values) >= 0;
		var checkbox = $('<input type="checkbox">').attr("checked", checked);
		group.append(checkbox);
		group.append(self.substitute('<span class="{class:label}">' + v + '</span>'));
	});
	element.append(group);
	return group;
};

configurator.methods._nestedForm = function(element, spec, value, depth) {
	var form = this._form(spec.properties, value, depth + 1);
	element.append(form);
	return form;
};

configurator.methods._nestedPage = function(element, spec, value, depth) {
	var self = this;
	var link = $('<u>configure</u>').on("click", function() {
		var page = {"name": spec.type};
		self.pages.push(page);
		self.dom.render("header");
		self._renderPage(page, value);
		self.showCurrentPage();
	}).css("cursor", "pointer");
	element.append(link);
	return link;
};

configurator.css =
	'.{class:page} { border: 1px solid #808080; margin: 5px; }' +
	'.{class:form} { clear: both; }' +
	'.{class:form} input { margin: 0px; width: 120px; }' +
	'.{class:form-0} { margin-left: 0px; }' +
	'.{class:form-1} { margin-left: 20px; border: 1px solid #CCCCCC; border-right: 0px; border-bottom: 0px; }' +
	'.{class:form-row} { border-bottom: 1px solid #808080; padding: 5px 10px; }' +
	'.{class:form-row}:last-child { border-bottom: 0px; }' +
	'.{class:form-1} .{class:form-row} { border-color: #CCCCCC; }' +
	'.{class:form-row} .{class:name} { width: 25%; float: left; }' +
	'.{class:form-row} .{class:field} { width: 50%; float: left; }' +
	'.{class:form-row} .{class:description} { width: 25%; float: right; color: gray; }' +
	'.{class:form-row-group} { padding-right: 0px; padding-bottom: 0px; }' +
	'.{class:form-row-group} > .{class:field} { width: 100%; float: none; }' +
	'.{class:form-row-group} > .{class:description} { width: 75%; float: left; margin-bottom: 10px; }';

Echo.Control.create(configurator);

})();
