(function() {

if (!window.Echo) window.Echo = {};

if (Echo.Utils) return;

if (!Echo.Global) Echo.Global = {};

if (!Echo.Vars) Echo.Vars = {
	"regexps": {
		"templateSubstitution": /{([0-9a-z\.]+)(?:\:((?:[0-9a-z_-]+\.)*[0-9a-z_-]+))?}/ig,
		"mobileUA": /mobile|midp-|opera mini|iphone|ipad|blackberry|nokia|samsung|docomo|symbian|windows ce|windows phone|android|up\.browser|ipod|netfront|skyfire|palm|webos|audiovox/i,
		"parseURL": /^((([^:\/\?#]+):)?\/\/)?([^\/\?#]*)?([^\?#]*)(\?([^#]*))?(#(.*))?/,
		"w3cdtf": /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/
	}
};


/**
 * Static class implements common methods of data processing.
 * The Echo.Utils class is used in various places of Echo JS SDK components.
 */

Echo.Utils = {};

var _cssStyles = {
	"anchor": undefined,
	"index": 1,
	"processed": {}
};

/**
 * Method to add CSS styles on the page.
 *
 * This function adds CSS styles to the style tag which is placed in the head of the document.
 * The first argument is a string that contains CSS styles, the second one is the unique identity string of CSS styles to be added. 
 * If CSS styles with corresponding id were added before then this function returns false.
 *
 *     // style tag in the head of HTML document
 *     // <style>
 *     //     .example-class { font-size: 12px; }
 *     // </style>
 *
 *     Echo.Utils.addCSS(
 *         '.echo-class { font-size: 14px; } '
 *     , 'echo-class-id'); // will return true
 *     // and new CSS style will be added to style tag
 *     // <style>
 *     //     .example-class { font-size: 12px; }
 *     //     .echo-class { font-size: 14px; }
 *     // </style>
 *
 *     Echo.Utils.addCSS(
 *         '.echo-new-class { font-size: 16px; } '
 *     , 'echo-class-id'); // will return false because styles with id = 'echo-class-id' were added before
 *
 * @static
 * @param {String} cssCode Contains CSS styles to be added.
 * @param {String} id Unique identity string of CSS styles.
 * @return {Boolean} Returns true if CSS styles was successfully added, false - if CSS styles is already in the document.
 */
Echo.Utils.addCSS = function(cssCode, id) {
	if (id) {
		if (_cssStyles.processed[id]) return false;
		_cssStyles.processed[id] = true;
	}
	var currentCssCode = "";
	var oldStyle = _cssStyles.anchor;
	if (oldStyle && oldStyle.length) {
		currentCssCode = oldStyle.html();
	}
	// IE limit is 4095 rules per style tag
	// so we limit it to 100000 characters
	// (2000 rules x 50 characters per rule)
	if (currentCssCode.length + cssCode.length > 100000) {
		_cssStyles.index++;
		oldStyle = null;
		currentCssCode = "";
	}
	var newStyle = $('<style id="echo-css-' + _cssStyles.index + '" type="text/css">' + currentCssCode + cssCode + '</style>');
	if (oldStyle && oldStyle.length) {
		// use replacing instead of adding css to existing element
		// because IE doesn't allow it
		oldStyle.replaceWith(newStyle);
	} else {
		if (_cssStyles.anchor) {
			_cssStyles.anchor.after(newStyle);
		} else {
			$(document.getElementsByTagName("head")[0] || document.documentElement).prepend(newStyle);
		}
	}
	_cssStyles.anchor = newStyle;
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
 * if specified in the third argument. Use the dot as a delimiter of key parts to get nested field value.
 *
 *     var data = {
 *         "key1": "value1",
 *         "key2": {
 *             "key2-1": "value2-1"
 *         }
 *     };
 *
 *     Echo.Utils.getNestedValue(data, "key1"); // will return "value1"
 *     Echo.Utils.getNestedValue(data, "key2"); // will return object {"key2-1": "value2-1"}
 *     Echo.Utils.getNestedValue(data, "key2.key2-1"); // will return "value2-1"
 *
 * @static
 * @param {Object} obj The object from which the value is taken.
 * @param {String} key Defines the key for value extraction.
 * @param {Object} [defauts]  Default value if no corresponding key was found in the object.
 * @param {Function} [callback] The callback function executed for each object of corresponding part of the key.
 * @param {Object} callback.data The object of corresponding part of the key.
 * @param {String} callback.key Defines corresponding part of the key.
 * @return {Mixed} Returns the corresponding nested value found in the object.
*/
Echo.Utils.getNestedValue = function(obj, key, defaults, callback) {
	if (!key) return obj;
	if (typeof key === "string") {
		key = key.split(/\./);
	}
	if (!key.length) return obj;
	var found = true;
	var iteration = function(_key, _data) {
		if (callback) {
			callback(_data, _key);
		}
		if (typeof _data[_key] === "undefined") {
			found = false;
		} else {
			return _data[_key];
		}
	};
	// avoid foldl usage for plain keys
	var value = key.length == 1
		? iteration(key.pop(), obj)
		: Echo.Utils.foldl(obj, key, iteration);
	return found ? value : defaults;
};

/**
 * Method to define specific nested field value in the object.
 *
 * This function allows to define the value for the corresponding field in the object.
 * Use the dot as a delimiter of key parts to set nested field value.
 *
 *     var data = {
 *         "key1": "value1",
 *         "key2": {
 *             "key2-1": "value2-1"
 *         }
 *     };
 *
 *     Echo.Utils.setNestedValue(data, "key1", "new value"); // data["key1"] will be "new value"
 *     Echo.Utils.setNestedValue(data, "key1", {"key1-1": "value1-1"}); // data["key1"] will be {"key1-1":"value1-1"}
 * 
 * @static
 * @param {Object} obj The object for which the value is set.
 * @param {String} key Defines the key where the given value should be stored.
 * @param {Mixed} value The object data that should be inserted for the key.
 */
Echo.Utils.setNestedValue = function(obj, key, value) {
	var keys = key.split(/\./);
	var field = keys.pop();
	var data = Echo.Utils.getNestedValue(obj, keys, undefined, function(acc, v) {
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
 *     Echo.Utils.object2JSON(true); // will return true
 *     Echo.Utils.object2JSON(["value1", "value2"]); // will return '["value1","value2"]'
 *     Echo.Utils.object2JSON({"k1": "v1", "k2": "v2"}); // will return '{"k1":"v1","k2":"v2"}'
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
 *     Echo.Utils.htmlTextTruncate("<div>123456</div>", 5); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456</div>", 5, "12345"); // will return "<div>1234512345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456", 5, "", true); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>123456", 5, "", false); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>12345", 5, "", true); // will return "<div>12345</div>"
 *     Echo.Utils.htmlTextTruncate("<div>12345", 5, "", false); // will return "<div>12345"
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
 * Method to strip HTML tags from the string.
 *
 * This function returns a string with all HTML tags stripped from the given string.
 *
 *     Echo.Utils.stripTags("<div>Content</div>"); // will return "Content"
 *
 * @static
 * @param {String} text The string to be stripped.
 * @return {String} Returns the stripped string.
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
 *     Echo.Utils.parseURL(url); // will return {
 *                               //     "scheme": "http",
 *                               //     "domain": "domain.com",
 *                               //     "path": "/some/path/"
 *                               //     "query": "query_string",
 *                               //     "fragment": "hash_value"
 *                               // };
 *
 * @static
 * @param {String} url The URL to be parsed.
 * @return {Object} Returns the object containing the following parts of the URL as fields: scheme, domain, path, query, fragment.
 */
Echo.Utils.parseURL = function(url) {
	var parts = url.match(Echo.Vars.regexps.parseURL);
	return parts ? {
		"scheme": parts[3],
		"domain": parts[4],
		"path": parts[5],
		"query": parts[7],
		"fragment": parts[9]
	} : undefined;
};

/**
 * Method returning original visible color of the element.
 *
 * This function traverses the element parents recoursively to determine original visible color of the element.
 * This function returns 'transparent' string if background-color of the element and its parents is not specified.
 *
 *     // HTML template
 *     var template = '<div class="container">' +
 *                        '<div class="header" style="background-color: green;">header</div>' +
 *                        '<div class="content" style="background-color: red;">' +
 *                            '<div class="section1"></div>' +
 *                            '<div class="section2"></div>' +
 *                        '</div>' +
 *                        '<div class="footer">footer</div>' +
 *                    '</div>';
 *
 *     Echo.Utils.getVisibleColor( $(".header", template) ); // will return "rgb(0, 128, 0)"
 *     Echo.Utils.getVisibleColor( $(".section1", template) ); // will return "rgb(255, 0, 0)"
 *     Echo.Utils.getVisibleColor( $(".footer", template) ); // will return "transparent"
 * 
 * @static
 * @param {HTMLElement} element HTML element whose visible color is determined.
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
 * @return {Number} Returns UNIX timestamp.
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
 *     Echo.Utils.getUniqueString(); // will return something like "134086853327622290480640764643"
 *
 * @static
 * @return {String} Returns the unique random string.
 */
Echo.Utils.getUniqueString = function() {
	return (new Date()).valueOf() + Math.random().toString().substr(2);
};

/**
 * Method which allows to inherit the object from another object.
 *
 * This function performs prototype inheritance of the JS objects.
 *
 * @static
 * @param {Class} child Class which should be entended.
 * @param {Class} parent Class which should be used as a parent for the first class.
 * @return {Class} Returns the result class.
 */
Echo.Utils.inherit = function(child, parent) {
	var F = function() {};
	F.prototype = parent.prototype;
	var _proto = $.extend({}, child.prototype);
	child.prototype = new F;
	child.prototype.constructor = child;
	child.parent = parent.prototype;
	$.each(_proto, function(name, value) {
		child.prototype[name] = $.isFunction(parent.prototype[name]) && $.isFunction(value)
			? function () {
				var self = this;
				var tmp = this.base;
				var args = arguments;
				this.base = function() {
					var _args = arguments.length ? arguments : args;
					return parent.prototype[name].apply(self, _args);
				};
				var returnValue = value.apply(this, arguments);
				this.base = tmp;
				return returnValue;
			}
			: value;
	});
	return child;
};

/**
 * Method which transforms a given object to the GET string.
 *
 * This function returns the GET string which can be used for further URL constructions. The values of the corresponding keys are URL encoded.
 *
 * @static
 * @param {Object} data Object which should be transformed into the GET string.
 * @return {String} Returns the GET string.
 */
Echo.Utils.objectToQuery = function(data) {
	return $.map(data || {}, function(value, key) {
		return key + "=" + encodeURIComponent(Echo.Utils.object2JSON(value));
	}).join("&");
};

/**
 * Method to acquire a class reference by the JS class name.
 *
 * This function returns the reference to the corresponding JS class defined on the page.
 *
 * @static
 * @param {String} name Name of the component which we need to access.
 * @return {Boolean} Returns the reference to the necessary JS class.
 */
Echo.Utils.getComponent = function(name) {
	return Echo.Utils.getNestedValue(window, name);
};

/**
 * Method which allows to check whether a given component was defined on the page.
 *
 * This function returns the boolean value which represents whether a given component is defined on the page.
 *
 * @static
 * @param {String} name Component name which needs to be checked.
 * @return {Boolean} Returns the true/false if the component was or wasn't found respectively.
 */
Echo.Utils.isComponentDefined = function(name) {
	return !!Echo.Utils.getComponent(name);
};

/**
 * Method which loads image.
 *
 * This function returns image HTML element with source attribute that equals first argument.
 * If the image is not available then this function loads the default image that is passed as a second argument.
 *
 * @static
 * @param {String} image Defines the URL of the image to be loaded
 * @param {String} defaultImage Defines the URL of the default image
 * @return {HTMLElement} Returns image HTML element
 */
Echo.Utils.loadImage = function(image, defaultImage) {
	var url = image || defaultImage;
	var img = $("<img>", { "src": url });
	if (url !== defaultImage) {
		img.one({
			"error" : function() {
				$(this).attr("src", defaultImage);
			}
		});
	}
	return img;
};

/**
 * Creates the HTML <a> tag with the provided attribute names/values
 *
 * @static
 * @param {Object} data Hyperlink tag attribute key/value pairs, some of them are:
 * @param {String} [data.caption] Visible text for the hyperlink
 * @param {String} [data.href="javascript:void(0)"] Hyperlink URL
 * @param {String} [data.target] Target window
 * @param {Object} options Configurable options affecting hyperlink behaviour
 * @param {Boolean} [options.openInNewWindow=false] Specifies whether this should be opened in a separate window or not
 * @param {Boolean} [options.skipEscaping=false] Specifies whether href value should be htmlized or not
 * @return {String} HTML string for <a> tag
 */
Echo.Utils.hyperlink = function(data, options) {
	options = options || {};
	if (options.openInNewWindow && !data.target) {
		data.target = "_blank";
	}
	var caption = data.caption || "";
	delete data.caption;
	if (!options.skipEscaping) {
		data.href = Echo.Utils.htmlize(data.href);
	}
	data.href = data.href || "javascript:void(0)";
	var attributes = Echo.Utils.foldl([], data, function(value, acc, key) {
		acc.push(key + '="' + value + '"');
	});
	return "<a " + attributes.join(" ") + ">" + caption + "</a>";
};

/**
 * Function to log info/error message to the browser console in a unified format
 *
 * @static
 * @param {Object} data Defines the properties of the message which should be displayed
 * @param {String} data.message Text description of the message which should be logged
 * @param {String} [data.component="Echo SDK"] Name of the component which produced the message
 * @param {String} [data.type="info"] Type/severity of the message
 * @param {String} [data.args] Extra arguments to log
 */
Echo.Utils.log = function(data) {
	if (!window.console || !console.log || !data || !data.message) return;
	console.log(
		"[" + (data.component || "Echo SDK") + "]",
		(data.type || "info"), ":", data.message, " | args: ", data.args
	);
};

Echo.Utils.parallelCall = function(actions, callback) {
	if (!actions || !actions.length) {
		callback && callback();
		return;
	}
	var remaining = actions.length;
	$.map(actions, function(action) {
		action(function() {
			remaining--;
			if (!remaining) {
				callback && callback();
			}
		});
	});
};

Echo.Utils.sequentialCall = function(actions, callback) {
	if (!actions || !actions.length) {
		callback && callback();
		return;
	}
	actions.shift()(function() {
		Echo.Utils.sequentialCall(actions, callback);
	});
};

Echo.Utils.isPreIE9 = function() {
	return ($.browser.msie && $.browser.version < 9 && document.documentMode && document.documentMode < 9);
};

})();
