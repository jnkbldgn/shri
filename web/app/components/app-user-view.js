import Component from "@ember/component";

export default Component.extend({
	init() {
		this._super(arguments);
	},
	actions: {
		closeElement(item) {
			let actionClose = this.get("closeButton");
			actionClose(item);
		},
	},
});
