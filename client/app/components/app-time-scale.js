import Component from "@ember/component";
import {inject} from "@ember/service";

export default Component.extend({
	timeScale: inject("time-scale"),

	init() {
		this._super(...arguments);
		this.scaleValues = this.get("timeScale").getArrayTimeValue();
	},
});
