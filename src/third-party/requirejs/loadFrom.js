Echo.define({
	"load": function(name, require, onload, config) {
		var libUrl = name.split("]")[0].replace("[", ""),
			module = name.split("]")[1];
		require([libUrl], function() {
			require([module], function(value) {
				onload(value);
			});
		});
	}
});
