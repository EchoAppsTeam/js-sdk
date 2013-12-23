Docs.initEventTracking = function() {
	Ext.getCmp("north-region").setHeight(80).items.first().setHeight(53);
	var cmps = Ext.ComponentQuery.query("#north-region docheader");
	Ext.each(cmps, function(cmp) {
		if (cmp.menu) {
			cmp.el.removeAllListeners().addListener("click", function() {
				cmp.menu.showBy(cmp.el, "tr-br?");
			});
			return false;
		}
	});
};
