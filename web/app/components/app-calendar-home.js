import Component from "@ember/component";
import {computed} from "@ember/object";
import moment from "moment";

export default Component.extend({

	init() {
		this._super(...arguments);
		this.set("now", moment());
	},
	selectValueDisplay: computed("selectDate", function() {
		return `${ moment(this.get("selectDate")).format("DD MMM").replace(/.$/, "") }`;
	}),
	prefixSelectValue: computed("selectDate", function() {
		return `${ moment(this.get("now")).isSame(this.get("selectDate"), "day") ?
			"Сегодня" : moment(this.get("selectDate")).get("year") }`;
	}),
	actions: {
		nextDate() {
			let setSelectDateAction = this.get("setSelectDate");
			setSelectDateAction(moment(this.get("selectDate")).add(1, "day"));
			return false;
		},
		prevDate() {
			let setSelectDateAction = this.get("setSelectDate");
			setSelectDateAction(moment(this.get("selectDate")).subtract(1, "day"));
			return false;
		},
	},
});
