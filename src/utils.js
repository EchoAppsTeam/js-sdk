(function() {

"use strict";

if (!window.Echo) window.Echo = {};
if (!Echo.Global) Echo.Global = {};

if (!Echo.Vars) Echo.Vars = {
	"regexps": {
		"matchLabel": /{Label:([^:}]+[^}]*)}/g,
		"matchData": /{Data:(([a-z]+\.)*[a-z]+)}/ig,
		"matchSelf": /{Self:(([a-z_]+\.)*[a-z_]+)}/ig,
		"mobileUA": /mobile|midp-|opera mini|iphone|ipad|blackberry|nokia|samsung|docomo|symbian|windows ce|windows phone|android|up\.browser|ipod|netfront|skyfire|palm|webos|audiovox/i,
		"parseUrl": /^((([^:\/\?#]+):)?\/\/)?([^\/\?#]*)?([^\?#]*)(\?([^#]*))?(#(.*))?/,
		"w3cdtf": /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/
	}
};

Echo.Utils = {};

Echo.Utils.addCss = function(cssCode, id) {
	Echo.Vars.css = Echo.Vars.css || {
		"index": 1,
		"processed": {}
	};
	if (id) {
		if (Echo.Vars.css.processed[id]) return false;
		Echo.Vars.css.processed[id] = true;
	}
	var currentCssCode = "";
	var oldStyle = Echo.Vars.css.anchor;
	if (oldStyle && oldStyle.length) {
		currentCssCode = oldStyle.html();
	}
	// IE limit is 4095 rules per style tag
	// so we limit it to 100000 characters
	// (2000 rules x 50 characters per rule)
	if (currentCssCode.length + cssCode.length > 100000) {
		Echo.Vars.css.index++;
		oldStyle = null;
		currentCssCode = "";
	}
	var newStyle = $('<style id="echo-css-' + Echo.Vars.css.index + '" type="text/css">' + currentCssCode + cssCode + '</style>');
	if (oldStyle && oldStyle.length) {
		// use replacing instead of adding css to existing element
		// because IE doesn't allow it
		oldStyle.replaceWith(newStyle);
	} else {
		if (Echo.Vars.css.anchor) {
			Echo.Vars.css.anchor.after(newStyle);
		} else {
			$(document.getElementsByTagName("head")[0] || document.documentElement).prepend(newStyle);
		}
	}
	Echo.Vars.css.anchor = newStyle;
	return true;
};

Echo.Utils.foldl = function(acc, object, callback) {
	var result;
	$.each(object, function(key, item) {
		result = callback(item, acc, key);
		if (result !== undefined) {
			acc = result;
		}
	});
	return acc;
};

Echo.Utils.getNestedValue = function(key, data, defaults, callback) {
	if (!key) return data;
	if (typeof key == "string") {
		key = key.split(/\./);
	}
	if (!key.length) return data;
	var found = true;
	var iteration = function(_key, _data) {
		if (callback) {
			callback(_data, _key);
		}
		if (typeof _data[_key] == "undefined") {
			found = false;
		} else {
			return _data[_key];
		}
	};
	// avoid foldl usage for plain keys
	var value = key.length == 1
		? iteration(key.pop(), data)
		: Echo.Utils.foldl(data, key, iteration);
	return found ? value : defaults;
};

Echo.Utils.setNestedValue = function(obj, key, value) {
	var keys = key.split(/\./);
	var field = keys.pop();
	var data = Echo.Utils.getNestedValue(keys, obj, undefined, function(acc, v) {
		if (typeof acc[v] == "undefined") {
			acc[v] = {};
		}
	});
	data[field] = value;
};

Echo.Utils.htmlize = function(text) {
	if (!text) return '';
	return $('<div>').text(text).html();
};

Echo.Utils.object2JSON = function(obj) {
	if (JSON && JSON.stringify) {
		return JSON.stringify(obj);
	}
	var encodeJSONLiteral = function(string) {
		var replacements = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};
		return string.replace(/[\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\\]/g,
			function (a) {
				return (replacements.hasOwnProperty(a))
					? replacements[a]
					: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			});
	}
	
	var out;
	switch (typeof obj) {
		case "number"  : out = isFinite(obj) ? obj : 'null'; break;
		case "string"  : out = '"' + encodeJSONLiteral(obj) + '"'; break;
		case "boolean" : out = obj.toString(); break;
		default :
			if (obj instanceof Array) {
				var container = $.map(obj, function(element) { return Echo.Utils.object2JSON(element); });
				out = '[' + container.join(",") + ']';
			} else if (obj instanceof Object) {
				var source = obj.exportProperties || obj;
				var container = Echo.Utils.foldl([], source, function(value, acc, property) {
					if (source instanceof Array) {
						property = value;
						value = obj[property];
					}
					acc.push('"' + property + '":' + Echo.Utils.object2JSON(value));
				});
				out = '{' + container.join(",") + '}';
			} else {
				out = 'null';
			}
	}
	return out;
};

Echo.Utils.htmlTextTruncate = function(text, limit, postfix, forceClosingTags) {
	
	if (!limit || text.length < limit) return text;
	
	var tags = [], count = 0, finalPos = 0;
	var list = "br hr input img area param base link meta option".split(" ");
	var standalone = Echo.Utils.foldl({}, list, function(value, acc, key) {
		acc[value] = true;
	});
	
	for (var i = 0; i < text.length; i++) {
		var symbol = text.charAt(i);
		if (symbol == "<") {
			var tail = text.indexOf(">", i);
			if (tail < 0) return text;
			var source = text.substring(i + 1, tail);
			var tag = {"name": "", "closing": false};
			if (source.charAt(0) == "/") {
				tag.closing = true;
				source = source.substring(1);
			}
			tag.name = source.match(/(\w)+/)[0];
			if (tag.closing) {
				var current = tags.pop();
				if (!current || current.name != tag.name) return text;
			} else if (!standalone[tag.name]) {
				tags.push(tag);
			}
			i = tail;
		} else if (symbol == "&" && text.substring(i).match(/^(\S)+;/)) {
			i = text.indexOf(";", i);
		} else {
			if (count == limit) {
				finalPos = i;
				break;
			}
			count++;
		}
	}
	if (finalPos || forceClosingTags) {
		if (finalPos) {
			text = text.substring(0, finalPos) + (postfix || "");
		}
		for (var i = tags.length - 1; i >= 0; i--) {
			text += "</" + tags[i].name + ">";
		}
	}
	return text;
};

Echo.Utils.mapClass2Object = function(e, ctl) {
	ctl = ctl || {};
	e.find("*").andSelf().each(function(i, el) {
		if (el.className) {
			var arr = el.className.split(/[ ]+/);
			$.each(arr, function(i, c) {
				ctl[c] = el;
			});
		}
	});
	return ctl;
};

Echo.Utils.stripTags = function(text) {
	return $('<div>').html(text).text();
};

Echo.Utils.parseUrl = function(url) {
	var parts = url.match(Echo.Vars.regexps.parseUrl);
	return parts ? {
		"scheme": parts[3],
		"domain": parts[4],
		"path": parts[5],
		"query": parts[7],
		"fragment": parts[9]
	} : undefined;
};

Echo.Utils.toDOM = function(template, prefix, renderer) {
	var content = $(template);
	var elements = Echo.Utils.mapClass2Object(content);
	var dom = {
		"set": function(name, element) {
			elements[prefix + name] = element;
		},
		"get": function(name, ignorePrefix) {
			var element = elements[(ignorePrefix ? "" : prefix) + name];
			return element && $(element);
		},
		"remove": function(element) {
			var name;
			if (typeof element == "string") {
				name = prefix + element;
			} else {
				name = element.echo.name;
			}
			$(elements[name]).remove();
			delete elements[name];
		},
		"content": content
	};
	var rendererFunction;
	if (typeof renderer == 'object') {
		rendererFunction = function(name, element, dom) {
			if (!renderer[name]) return;
			return renderer[name](element, dom);
		}
	} else {
		rendererFunction = renderer;
	}
	$.each(elements, function(id, element) {
		var pattern = id.match(prefix + "(.*)");
		var name = pattern ? pattern[1] : undefined;
		if (name && rendererFunction) {
			element = $(element);
			element.echo = element.echo || {};
			element.echo.name = id;
			var node = rendererFunction(name, element, dom);
			if (typeof node != "undefined") {
				element.empty().append(node);
			}
		}
	});
	return dom;
};

Echo.Utils.getVisibleColor = function(elem) {
	// calculate visible color of element (transparent is not visible)
	var color;
	do {
		color = elem.css('backgroundColor');
		if (color != '' && color != 'transparent' && !/rgba\(0, 0, 0, 0\)/.test(color) || $.nodeName(elem.get(0), 'body')) {
			break;
		}
	} while (elem = elem.parent());
	return color || 'transparent';
};

Echo.Utils.timestampFromW3CDTF = function(t) {
	var parts = ['year', 'month', 'day', 'hours', 'minutes', 'seconds'];
	var dt = {};
	var matches = t.match(Echo.Vars.regexps.w3cdtf);
	if (!matches) return;
	$.each(parts, function(i, p) {
		dt[p] = matches[i + 1];
	});
	return Date.UTC(dt['year'], dt['month'] - 1, dt['day'],
			dt['hours'], dt['minutes'], dt['seconds']) / 1000;
};

Echo.Utils.isMobileDevice = function() {
	return Echo.Vars.regexps.mobileUA.test(navigator.userAgent);
};

Echo.Utils.getUniqueString = function() {
	return (new Date()).valueOf() + Math.random().toString().substr(2);
};

Echo.Utils.inherit = function(child, parent) {
	var F = function() {};
	F.prototype = parent.prototype;
	child.prototype = new F;
	child.prototype.constructor = child;
	child.prototype.parentProto = parent.prototype;
	return child;
};

Echo.Utils.objectToQuery = function(obj) {
	var i = 0;
	return Echo.Utils.foldl("", obj, function(value, acc, key) {
		return acc += (
			(i++ ? "&" : "?") + key + "=" + value
		);
	});
};

})();
