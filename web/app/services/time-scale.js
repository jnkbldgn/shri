import Service from "@ember/service";
const START_VALUE = 8;
const END_VALUE = 23;

export default Service.extend({

	getSatrtValue() {
		return START_VALUE;
	},
	getEndValue() {
		return END_VALUE;
	},
	getArrayTimeValue() {
		if (!this.get("arrayTimeValue")) {
			let result = [];
			for (let i = START_VALUE; i <= END_VALUE; i++) {
				result.push(i);
			}
			this.set("arrayTimeValue", result);
		}
		return this.get("arrayTimeValue");
	},

	getTimeGridCells() {
		if (!this.get("timeGridCells")) {
			this.set("timeGridCells", END_VALUE - START_VALUE);
		}
		return this.get("timeGridCells");
	},

});
