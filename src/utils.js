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


/**
 * Static class implements common methods of data processing.
 * The Echo.Utils class is used in various places of Echo JS SDK components.
 */

Echo.Utils = {};

/**
 * Method to add css styles on the page.
 *
 * This function adds css styles to the style tag which is placed in the head of the document.
 * The first argument is a string that contains css styles, the second one is the unique identity string of css styles to be added. 
 * If corresponding css styles is already placed in the document then method returns false. 
 *
 * @static
 * @param {String} cssCode Contains css styles to be added.
 * @param {String} id Unique identity string of css styles.
 * @return {Boolean} Returns true if css styles was successfully added, false - if css styles is already in the document.
 */
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

/**
 * Method implementing folding mechanism.
 *
 * This function iterates over each value of the object passing them to callback function.
 * The first argument is the object that is available in callback function to accumulate items.
 *
 *     var array = Echo.Utils.foldl([], [1, 2, 3], function(item, acc) {
 *         acc.push(item);
 *     }); // array will be [1, 2, 3];
 *     
 *     var hash = Echo.Utils.foldl({}, {"key1": "value1", "key2": "value2"}, function(item, acc, key) {
 *         if (key === "key2") return;
 *         acc[key] = item;
 *     }); // hash will be {"key1": "value1"};
 * 
 * @static
 * @param {Object} acc Defines the initial accumulator.
 * @param {Mixed} object The object to be folded.
 * @param {Function} callback The callback function executed for each item of the object to be folded.
 * @param {Object} callback.item The item of the object to iterate over.
 * @param {Object} callback.acc The object that accumulates items.
 * @param {String} [callback.key] Defines the key of iterated items.
 * @return {Object} The resulting object
 */
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

/**
 * Method to access specific nested field value in the object.
 *
 * This function returns the corresponding value of the given key or the default value
 * if specified in the third argument. Use the dot as a delimeter of key parts to get nested field value.
 *
 *     var data = {
 *         "key1": "value1",
 *         "key2": {
 *             "key2-1": "value2-1"
 *         }
 *     };
 *
 *     Echo.Utils.getNestedValue("key1", data); // will return "value1"
 *     Echo.Utils.getNestedValue("key2", data); // will return object {"key2-1": "value2-1"}
 *     Echo.Utils.getNestedValue("key2.key2-1", data); // will return "value2-1"
 *
 * @static
 * @param {String} key Defines the key for value extraction.
 * @param {Object} data The object for which the value is set.
 * @param {Object} [defauts]  Default value if no corresponding key was found in the object.
 * @param {Function} [callback] The callback function executed for each object of corresponding part of the key.
 * @param {Object} callback.data The object of corresponding part of the key.
 * @param {String} callback.key Defines corresponding part of the key.
 * @return {Mixed} Returns the corresponding nested value found in the object.
*/
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

/**
 * Method to define specific nested field value in the object.
 *
 * This function allows to define the value for the corresponding field in the object.
 * Use the dot as a delimeter of key parts to set nested field value.
 *
 *     var data = {
 *         "key1": "value1",
 *         "key2": {
 *             "key2-1": "value2-1"
 *         }
 *     };
 *
 *     Echo.Utils.setNestedValue(data, "key1", "new value"); // data["key1"] will be "new value"
 *     Echo.Utils.setNestedValue(data, "key1", {"key1-1": "value1-1"}); // data["key1"] will be {"key1-1": "value1-1"}
 * 
 * @static
 * @param {Object} obj The object data from which the value is taken.
 * @param {String} key Defines the key where the given value should be stored.
 * @param {Mixed} value The object data that should be inserted for the key.
 */
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

/**
 * Method to convert special characters to HTML entities.
 * 
 * Some characters have special significance in HTML and should be represented by HTML entities if they are to preserve their meanings.
 * This function returns a string with these conversions made.
 *
 *     Echo.Utils.htmlize("special characters: &<>"); // will return "special characters: &amp;&lt;&gt;"
 *
 * @static
 * @param {String} text The string to be converted.
 * @return {String} Returns the converted string.
 */
Echo.Utils.htmlize = function(text) {
	if (!text) return '';
	return $('<div>').text(text).html();
};

/**
 * Method to convert JavaScript value to JavaScript Object Notation (JSON) string.
 *
 * Methods converts JavaScript object to JSON string.
 * This function uses JSON.stringify() method if it is available in the browser.
 *
 *     Echo.Utils.object2JSON(null); // will return 'null'
 *     Echo.Utils.object2JSON(123); // will return '123'
 *     Echo.Utils.object2JSON(Number.POSITIVE_INFINITY); // will return 'null'
 *     Echo.Utils.object2JSON("string\n"); // will return '"string\n"'
 *     Echo.Utils.object2JSON(true) // will return true
 *     Echo.Utils.object2JSON(["value1", "value2"]) // will return '["value1","value2"]'
 *     Echo.Utils.object2JSON({"k1": "v1", "k2": "v2"}) // will return '{"k1":"v1","k2":"v2"}'
 *
 * @static
 * @param {Mixed} obj The value to be converted.
 * @return {String} Returns the string that contains JSON.
 */
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

/**
 * Method to truncate HTML text.
 *
 * This function truncates HTML contents preserving the right HTML structure and without truncate tags.
 *
 *     Echo.Utils.htmlTextTruncate("<div>123456</div>", 5); // will return "<div>123456</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456</div>", 5, "12345"); // will return "<div>1234512345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456", 5, "12345", true); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456", 5, "12345", false); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>12345", 5, "12345", true); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>12345", 5, "12345", false); // will return "<div>12345"
 * 
 * @static
 * @param {String} text The string to be truncated.
 * @param {Number} limit The length of returned string without HTML tags.
 * @param {String} postfix The string to be added to truncated string.
 * @param {Boolean} forceClosingTags This parameter takes affect only when no truncation was performed. Otherwise (when the content was truncated) the function restores HTML structure regardless the forseClosingTags parameter value.
 * @return {String} Returns the truncated string.
 */
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

/**
 * Method to map css classes to objects.
 *
 *     // HTML template
 *     var template =  '<div class="echo-class-container">' +
 *                        '<div class="echo-class-header">header</div>' +
 *                        '<div class="echo-class-content">content</div>' +
 *                     '</div>';
 *
 *     var hash = Echo.Utils.mapClass2Object(template);
 *    
 *     // hash['echo-class-header'].innerHTML will be "header"
 *
 * @static
 * @param {HTMLElement} element HTML element
 * @param {Object} [ctl] The object in which class to object map is stored
 * @return {Object} Returns the object 
 */
Echo.Utils.mapClass2Object = function(element, ctl) {
	ctl = ctl || {};
	element.find("*").andSelf().each(function(i, el) {
		if (el.className) {
			var arr = el.className.split(/[ ]+/);
			$.each(arr, function(i, c) {
				ctl[c] = el;
			});
		}
	});
	return ctl;
};

/**
 * Method to strip HTML tags from the string.
 *
 * This function returns a string with all HTML tags stripped from the given string.
 *
 *     Echo.Utils.stripTags("<div>Content</div>"); // will return "Content"
 *
 * @static
 * @param {String} text The string to be stripped.
 * @return {String} The stripped string.
 */
Echo.Utils.stripTags = function(text) {
	return $('<div>').html(text).text();
};

/**
 * Method to parse the URL and return its parts.
 *
 * This function parses a URL and returns a hash containing parts of the URL which are presented.
 * This function is not meant to validate the given URL, it only breaks it up into the parts.
 *
 *     var url = "http://domain.com/some/path/?query_string#hash_value";
 *     Echo.Utils.parseUrl(url); // will return {
 *                               //     "scheme": "http",
 *                               //     "domain": "domain.com",
 *                               //     "path": "some/path"
 *                               //     "query": "query_string",
 *                               //     "fragment": "hash_value"
 *                               // };
 *
 * @static
 * @param {String} url The URL to be parsed.
 * @return {Object} Returns the object containing the following parts of the URL as fields: scheme, domain, path, query, fragment.
 */
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

/**
 * Method to convert from HTML template to DOM element
 *
 * The first argument is HTML template to be converted to DOM element.
 * All descendants of root HTML element should have the same css prefix which is the second argument of this function.
 * Third argument can be either the object with rendering functions or simple rendering function.
 * The function returns the object with the following methods: set, get, remove, content.
 *
 *     // HTML template
 *     var template =  '<div class="echo-class-container">' +
 *                        '<div class="echo-class-header"></div>' +
 *                        '<div class="echo-class-content"></div>' +
 *                    '</div>';
 *     
 *     // the object containing rendering functions for descendants of root element
 *     var handlers = {
 *         'header': function(element) {
 *             element.val("some header");
 *         },
 *         'content': function(element) {
 *             element.val("some content");
 *         }
 *     };
 *     
 *     var container = Echo.Utils.toDOM(template, 'echo-class-', handlers);
 *     container.get("header").html(); // will return "some header"
 *     container.get("content").html(); // will return "some content"
 *     
 *     var footer_template = '<div class="echo-class-footer">some footer</div>';
 *     
 *     container.set("footer");
 *     container.get("footer").html(); // will return "some footer"
 *
 *     container.remove("content");
 *     container.get("content"); // will return undefined
 *
 * @static
 * @param {String} template Defines HTML template of the element.
 * @param {String} prefix Defines prefix of css classes of root element and its descendants.
 * @param {Mixed} renderer Defines rendering function or the object that contains rendering functions for root element and its descendants.
 * @return {Object} Returns the instance of class that is described above
 */
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

/**
 * Method returning visible color of the element.
 *
 * This function determines visible color of the element.
 * This function returns 'transparent' string if visible color is transparent.
 * 
 * @static
 * @param {HTMLElement} element HTML element.
 * @return {String} Returns visible color.
 */
Echo.Utils.getVisibleColor = function(element) {
	// calculate visible color of element (transparent is not visible)
	var color;
	do {
		color = element.css('backgroundColor');
		if (color != '' && color != 'transparent' && !/rgba\(0, 0, 0, 0\)/.test(color) || $.nodeName(element.get(0), 'body')) {
			break;
		}
	} while (element = element.parent());
	return color || 'transparent';
};

/**
 * Method to convert datetime value from W3C datetime format to timestamp.
 *
 *     Echo.Utils.timestampFromW3CDTF("1998-02-08T09:27:30Z"); // will return 886930050
 *
 * @static
 * @param {String} datetime the string which contains datetime value to be converted.
 * @return {Integer} Returns the timestamp divided by 1000.
 */
Echo.Utils.timestampFromW3CDTF = function(datetime) {
	var parts = ['year', 'month', 'day', 'hours', 'minutes', 'seconds'];
	var dt = {};
	var matches = datetime.match(Echo.Vars.regexps.w3cdtf);
	if (!matches) return;
	$.each(parts, function(i, p) {
		dt[p] = matches[i + 1];
	});
	return Date.UTC(dt['year'], dt['month'] - 1, dt['day'],
			dt['hours'], dt['minutes'], dt['seconds']) / 1000;
};

/**
 * Method to determine that mobile device is used.
 *
 * The function determines by navigator.userAgent that mobile device is used.
 *
 * @static
 * @return {Boolean} Returns true if mobile device is used, false if not.
 */
Echo.Utils.isMobileDevice = function() {
	return Echo.Vars.regexps.mobileUA.test(navigator.userAgent);
};

/**
 * Method returning unique random string.
 *
 * This function returns unique string is the number of milliseconds between midnight January 1, 1970 (GMT)
 * to current time plus random number.
 *
 * @static
 * @return {String} Returns the unique random string
 */
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
