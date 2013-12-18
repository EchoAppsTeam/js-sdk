Docs.initEventTracking = function() {
	Ext.getCmp('north-region').setHeight(80);
	Ext.getCmp('north-region').items.first().setHeight(53);
};

Docs.versions = [
	{"text": "Echo JS SDK 3.0", "href": "http://echoappsteam.github.io/js-sdk/docs/"},
	{"text": "Echo JS SDK 3.1", "href": "../../docs/[VERSION]"}
];

Ext.define("Docs.view.Header", {
	extend: "Ext.container.Container",
	alias: "widget.docheader",

	contentEl: "header-content",

	initComponent: function() {
		if (Docs.versions) {
			this.style = "cursor: pointer;",
			this.cls = "dropdown";

			this.menu = Ext.create("Ext.menu.Menu", {
				renderTo: Ext.getBody(),
				plain: true,
				items: Docs.versions
			});
		}

		this.callParent();
	},

	listeners: {
		afterrender: function(cmp) {
			if (this.menu) {
				cmp.el.addListener("click", function(cmp, el) {
					this.menu.showBy(this.el, "bl", [270, 0]);
				}, this);
			}
		}
	}
});
