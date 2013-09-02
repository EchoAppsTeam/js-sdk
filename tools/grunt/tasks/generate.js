module.exports = function(grunt) {

	var shared = require("../lib.js").init(grunt);
	var _ = grunt.utils._;
	// TODO: use deep clone from Lo-Dash when we upgrade to grunt 0.4 and remove this line
	_.mixin({ deepClone: function (p_object) { return JSON.parse(JSON.stringify(p_object)); } });

	grunt.registerInitTask("generate", "Collection of generators", function(target) {
		var done = this.async();
		if (!target) target = "config";
		if (target === "config") {
			generateConfig(done);
		}
	});

	function generateConfig(done) {
		var noValue = [];
		var merge = function(value, oldValue, keyString) {
			if (value === "") {
				// let's use the value from already existing config file if we have one
				if (!_.isUndefined(oldValue) && oldValue !== "[PLACEHOLDER]") {
					return oldValue;
				} else {
					noValue.push(keyString.substring(1));
					return "[PLACEHOLDER]";
				}
			} else if (_.isArray(value)) {
				if (_.isUndefined(oldValue)) oldValue = [];
				return _.map(value, function(v, i) {
					return merge(v, oldValue[i], keyString + "." + i);
				});
			} else if (_.isObject(value)) {
				if (_.isUndefined(oldValue)) oldValue = {};
				return _.reduce(value, function(acc, v, k) {
					acc[k] = merge(v, oldValue[k], keyString + "." + k);
					return acc;
				}, {});
			} else {
				return value;
			}
		};
		var sample = grunt.file.readJSON("config/environments/sample.json");
		_.each(shared.config("environments"), function(env) {
			var filename = "config/environments/" + env + ".json";
			var oldCfg = grunt.file.exists(filename) ? grunt.file.readJSON(filename) : {};
			var newCfg = _.deepClone(sample);

			// remove some fields which shouldn't be in the resulting config
			if (env === "development" || env === "test") {
				delete newCfg.release;
			}
			if (env === "staging") {
				delete newCfg.release.purger;
				delete newCfg.release.auth.cdn;
			}
			if (env === "production") {
				delete newCfg.release.auth.sandbox;
			}

			noValue = [];
			// merge in the values from already existing config file leaving
			// only new fields unfilled and removing obsolete fields
			newCfg = merge(newCfg, oldCfg, "");
			if (noValue.length) {
				grunt.log.writeln(filename.cyan + ": " + ("fill in the following fields:\n\t" + noValue.join("\n\t")).yellow);
			}
			grunt.file.write(filename, JSON.stringify(newCfg, null, "\t"));
		});
		done();
	}
};
