(function($) {
"use strict";

Echo.Tests.module("Echo.View", {
	"meta": {
		"className": "Echo.View",
		"functions": [
			"get",
			"set",
			"remove",
			"fork",
			"render",
			"rendered"
		]
	}
});

Echo.Tests.test("public interface", function() {
	// simple rendering
	var view = new Echo.View({"cssPrefix": "echo-"});

	QUnit.ok(!view.rendered(), "Checking if the \"rendered\" function detects that the view was not rendered yet");

	view.render({
		"data": {"footer": "Footer"},
		"template": templates.simple
	});

	QUnit.ok(!!view.get("container"),
		"Checking if we have elements available via \"get\" function after rendering");
	QUnit.equal(view.get("header").html(), "Header",
		"Checking if we have an access to the element content");
	QUnit.equal(view.get("footer").html(), "Footer",
		"Checking basic {data:KEY} substitution");

	// adding elements into the view elements collection
	view.set("avatar-raw", '<div class="echo-avatar-raw">Avatar Raw</div>');
	view.set("avatar-dom", $('<div class="echo-avatar-dom">Avatar DOM</div>'));

	QUnit.ok(!!view.get("avatar-raw") && !!view.get("avatar-dom"),
		"Checking if the newly added elements are available via \"get\" method");
	QUnit.equal(view.get("avatar-raw").html(), "Avatar Raw",
		"Checking if the avatar (avatar-raw) element contains an expected content");
	QUnit.equal(view.get("avatar-dom").html(), "Avatar DOM",
		"Checking if the avatar (avatar-dom) element contains an expected content");

	QUnit.ok(view.rendered(), "Checking if the \"rendered\" function detects that the view was rendered");

	// checking "remove" method
	view.remove("header");
	QUnit.ok(!view.get("header"),
		"Checking if the element was removed from the collection after the \"remove\" function call (with the string argument type)");

	view.remove(view.get("footer"));
	QUnit.ok(!view.get("footer"),
		"Checking if the element was removed from the collection after the \"remove\" function call (with the jQuery element argument type)");

	view.render({"template": templates.small});
	QUnit.ok(!view.get("container"),
		"Checking if no elements available after the second \"render\" function call with another template");
	QUnit.ok(!!view.get("wrapper"),
		"Checking if new elements are available after the second \"render\" function call with another template");
});

Echo.Tests.test("rendering with partial or incorrect config", function() {
	var view, result, dom;
	view = new Echo.View();
	QUnit.ok(!!view, "Checking if the Echo.View class can be instantiated with no config");
	result = view.render();
	QUnit.ok(!result, "Checking if the \"render\" call with no arguments doesn't throw an exception and returns 'false'");

	result = view.render({"template": ""});
	QUnit.ok(!result, "Checking if the \"render\" call with no the template defined as an empty string returns 'false'");

	dom = view.render({"template": "  "});
	QUnit.strictEqual(dom.html(), undefined,
		"Checking if the \"render\" call returns \"undefined\" of whitespaces only");

	// simple template rendering with no cssPrefix defined
	view = new Echo.View();
	view.render({
		"template": templates.simple
	});

	QUnit.ok(!!view.get("echo-container"),
		"[no cssPrefix] Checking if we have elements available via \"get\" function after rendering");
	QUnit.equal(view.get("echo-header").html(), "Header",
		"[no cssPrefix] Checking if we have an access to the element content");
	QUnit.equal(view.get("echo-footer").html(), "",
		"[no cssPrefix] Checking if the {data:KEY} pattern is replaced with the empty string in case no data is available");

	// rendering of the template with incorrect placeholders
	view = new Echo.View({"cssPrefix": "echo-"});
	dom = view.render({
		"template": templates.incorrect
	});

	QUnit.ok(!!dom, "Checking if rendering doesn't fail in case incorrect and unknown placeholderes defined in the template");
	QUnit.equal(view.get("header").html(), "{unknown:pattern}",
		"Checking if unknown placeholder remained untouched");
	QUnit.equal(view.get("body").html(), "{invalidtag:}",
		"Checking if invalid placeholder with unknown tag remained untouched");
	QUnit.equal(view.get("footer").html(), "{data:}",
		"Checking if invalid placeholder with known tag remained untouched");
});

Echo.Tests.test("different ways of specifying renderers", function() {
	var checks = function(prefix) {
		QUnit.equal(view.get("header").html(), "Header Renderer applied!",
			prefix + " Checking if the 'header' renderer was applied");
		QUnit.equal(view.get("body").html(), "Body Renderer applied!",
			prefix + " Checking if the 'body' renderer was applied");
		QUnit.equal(view.get("footer").html(), "Footer Renderer applied!",
			prefix + " Checking if the 'footer' renderer was applied");

		view.get("header").empty();
		view.render({"name": "header"});
		QUnit.equal(view.get("header").html(), "Header Renderer applied!",
			prefix + " Checking if the 'header' renderer was applied once again after 'header' element cleanup");
	};

	var view = new Echo.View({
		"cssPrefix": "echo-",
		"renderers": renderers
	});
	view.render({
		"template": templates.simple
	});
	checks("[via object in config]");

	view = new Echo.View({"cssPrefix": "echo-"});
	view.render({
		"template": templates.simple,
		"renderers": renderers
	});
	checks("[in 'render' call]");

	// same set of renderers applied via "renderer" function in config
	view = new Echo.View({
		"cssPrefix": "echo-",
		"renderer": function(args) {
			if (renderers[args.name]) {
				renderers[args.name](args.target, args.extra);
			}
			return args.target;
		}
	});
	view.render({
		"template": templates.simple
	});
	checks("[via 'renderer' function in config]");
});

Echo.Tests.test("custom substitutions", function() {
	var view = new Echo.View({
		"cssPrefix": "echo-",
		"substitutions": {
			"tag": function(key) {
				return key + " key replaced by the \"tag\" substitution!";
			},
			"anothertag": function(key) {
				return key + " key replaced by the \"anothertag\" substitution!";
			}
		}
	});
	view.render({
		"template": templates.substitutions
	});
	QUnit.equal(view.get("header").html(),
		"key1 key replaced by the \"tag\" substitution!",
		"[substitutions] Checking if the \"tag\" substitution was applied");
	QUnit.equal(view.get("body").html(),
		"key2 key replaced by the \"anothertag\" substitution!",
		"[substitutions] Checking if the \"anothertag\" substitution was applied");
	QUnit.equal(view.get("footer").html(),
		"{unknowntag:key3}",
		"[substitutions] Checking if unknown placeholder remained untouched");
});

Echo.Tests.test("working with forked view", function() {
	var view = new Echo.View({
		"cssPrefix": "echo-",
		"renderers": renderers
	});
	view.render({
		"template": templates.simple
	});
	// forking another view
	var _view = view.fork();
	_view.render({"template": templates.simple});
	QUnit.equal(view.get("header").html(), "Header Renderer applied!",
		"[fork with renderers] Checking if the header renderer was applied");
	QUnit.equal(view.get("body").html(), "Body Renderer applied!",
		"[fork with renderers] Checking if the body renderer was applied");
	QUnit.equal(view.get("footer").html(), "Footer Renderer applied!",
		"[fork with renderers] Checking if the footer renderer was applied");
	var view2 = view.fork({
		"renderers": {
			"header": null,
			"body": null,
			"someRenderableElement": function(element) {
				return element.html("Me someRenderableElement");
			}
		},
		"cssPrefix": "echo-new-"
	});
	QUnit.ok($.isFunction(view.renderers.header) && $.isFunction(view.renderers.body) && view.config.cssPrefix === "echo-",
		"Check that forked view with overridden config is not affected by the parent view instance");

	view2.render({
		"template":
			'<div class="echo-new-container">' +
				'<div class="echo-new-header"></div>' +
				'<div class="echo-new-body"></div>' +
				'<div class="echo-new-footer"></div>' +
				'<div class="echo-new-someRenderableElement"></div>' +
			'</div>'
	});

	QUnit.strictEqual(view2.get("header").html(), "",
		"[fork with new renderers object] Checking if the header renderer was overrided by new renderers object");
	QUnit.equal(view2.get("body").html(), "",
		"[fork with new renderers object] Checking if the body renderer was overrided by new renderers object");
	QUnit.equal(view2.get("footer").html(), "Footer Renderer applied!",
		"[fork with new renderers object, inherited renderer] Checking if the inherited footer renderer was applied");
	QUnit.equal(view2.get("someRenderableElement").html(), "Me someRenderableElement",
		"[fork with new renderers object] Checking if the someRenderable renderer was applied");
	QUnit.ok(view2.get("someRenderableElement").hasClass("echo-new-someRenderableElement"), "Check forked view cssPrefix field was overrided and applied");
});

var templates = {};

templates.simple =
	'<div class="echo-container">' +
		'<div class="echo-header">Header</div>' +
		'<div class="echo-body">Body</div>' +
		'<div class="echo-footer">{data:footer}</div>' +
	'</div>';

templates.small =
	'<div class="echo-wrapper"></div>';

templates.incorrect =
	'<div class="echo-container">' +
		'<div class="echo-header">{unknown:pattern}</div>' +
		'<div class="echo-body">{invalidtag:}</div>' +
		'<div class="echo-footer">{data:}</div>' +
	'</div>';

templates.substitutions =
	'<div class="echo-container">' +
		'<div class="echo-header">{tag:key1}</div>' +
		'<div class="echo-body">{anothertag:key2}</div>' +
		'<div class="echo-footer">{unknowntag:key3}</div>' +
	'</div>';

var renderers = {
	"header": function(element) {
		return element.empty().append("Header Renderer applied!");
	},
	"body": function(element) {
		return element.empty().append("Body Renderer applied!");
	},
	"footer": function(element) {
		return element.empty().append("Footer Renderer applied!");
	}
};

})(Echo.jQuery);
