(function() {

if (!window.Echo) window.Echo = {};

if (Echo.Loader) return;

Echo.Loader = {
	"config": {
		"cdnBaseURL": "http://cdn.echoenabled.com/"
	}
};

Echo.Loader.download = function(params) {
	var scripts = params.scripts, urls = [];
	var callback = params.callback || function() {};
	if (params.scripts && params.scripts.length) {
		for (var i = 0; i < scripts.length; i++) {
			var script = scripts[i];
			if (!script.loaded || !script.loaded()) {
				urls.push(script.url);
			}
		}
	}
	if (!urls.length) {
		callback();
		return false;
	}
	if (params.errorTimeout) {
		yepnope.errorTimeout = params.errorTimeout;
	}
	yepnope({
		"load": urls,
		"complete": callback
	});
};

})();
