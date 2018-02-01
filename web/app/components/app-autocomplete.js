import Component from "@ember/component";

export default Component.extend({
	init() {
		this._super(...arguments);
	},
	didInsertElement() {
		this._super(arguments);
		this.$()[0].style.top = this.$()[0].parentElement.parentElement.offsetHeight + "px";
	},
	actions: {
		selectElement(item) {
			let actionSelect = this.get("selectItem");
			actionSelect(item);
			this.$()[0].previousElementSibling.blur();
			return false;
		},
	},
});
