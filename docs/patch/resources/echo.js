Docs.initEventTracking = function() {
	Ext.getCmp("north-region").setHeight(80).items.first().setHeight(53);
	var cmps = Ext.ComponentQuery.query("#north-region docheader");
	Ext.each(cmps, function(cmp) {
		if (cmp.menu) {
			cmp.el.removeAllListeners().addListener("click", function() {
				cmp.menu.showBy(cmp.el, "bl", [270, 0]);
			});
			return false;
		}
	});
};

Docs.otherProducts = [
	{"text": "Echo JS SDK 3.0", "href": "http://echoappsteam.github.io/js-sdk/docs/"},
	{"text": "Echo JS SDK 3.1", "href": "../../docs/[VERSION]"}
];
