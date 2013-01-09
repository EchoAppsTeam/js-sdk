(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.GUI) return;

/**
 * @class Echo.GUI
 * Foundation class implementing core logic for GUI components.
 *
 * @constructor
 * @param {Object} config
 * GUI component configuration.
 */
Echo.GUI = function(config) {
	if (!config) return;

	config = $.extend(true,
		this._getDefaultConfig && this._getDefaultConfig(config),
		config
	);

	this.config = new Echo.Configuration(config);
	this.refresh();
};

/**
 * Method to re-define a specific field in the configuration.
 * 
 * @param {String|Object} key
 * Specifies the field key which should be changed.
 * You can pass the configuration hash in this parameter.
 * For example:
 * 	{
 * 		"property1": "value1",
 * 		"property2": "value2"
 * 	};
 *
 * @param {Mixed} [value]
 * The configuration field value.
 * This parameter can be omitted if you passed the
 * configuration field values as a hash.
 */
Echo.GUI.prototype.set = function(key, value) {
	var self = this;
	if (typeof key === "object") {
		$.each(key, function(k, value) {
			self.config.set(k, value);
		});
		self.refresh();
	} else {
		return self.config.set(key, value);
	}
};

/**
 * This method re-assemble the component HTML code and
 * append it to the target.
 */
Echo.GUI.prototype.refresh = function() {
	this._build();
};

/**
 * Hides the component and removes it's instance.
 */
Echo.GUI.prototype.destroy = function() {
	this.config.get("target") && this.config.get("target").empty();
	this.config.remove("target");
};

})(Echo.jQuery);
