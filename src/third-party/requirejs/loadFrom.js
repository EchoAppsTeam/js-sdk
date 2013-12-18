Echo.define({
	"load": function(name, require, onload, config) {
		"use strict";
		var parts = name.split(/\[|\]/);
		require([parts[1]], function() {
			require([parts[2]], function(value) {
				onload(value);
			});
		});
	}
});
