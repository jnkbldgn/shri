import Component from "@ember/component";
import {computed} from "@ember/object";

export default Component.extend({
	didInsertElement() {
		this._super(...arguments);
		this.rootElement = document.getElementsByClassName("ember-application")[0];
		this.parentElement = this.$()[0].parentElement;
	},
	insertModel: computed("actionVisible", function() {
		if (this.get("actionVisible") && this.get("rootElement")) {
			this.get("rootElement").appendChild(this.$()[0]);
			this.$()[0].classList.add("app-modal-dialog");
		}
		return this.get("actionVisible");
	}),
	close() {
		this.$()[0].classList.remove("app-modal-dialog");
		this.get("parentElement").appendChild(this.$()[0]);
		this.set("actionVisible", false);
	},
	actions: {
		clickButton(callBack) {
			if (callBack) {
				callBack();
				this.close();
				return false;
			}
			this.close();
		},
	},
});
