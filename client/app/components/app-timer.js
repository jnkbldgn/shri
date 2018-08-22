import Component from "@ember/component";
import {observer} from "@ember/object";
import {inject} from "@ember/service";
import moment from "moment";

export default Component.extend({
	timeScale: inject(),

	didInsertElement() {
		this._super(arguments);
		let rootElementWidth = this.$()[0].clientWidth;
		let arrayTimeValueLength = this.get("timeScale").getArrayTimeValue().length;
		let lengthCellTimeScale = rootElementWidth/arrayTimeValueLength;
		let widthOneMinut = lengthCellTimeScale/60;
		this.set("widthOneMinut", widthOneMinut);
		this.set("timer", setInterval(this.startTimer.bind(this), 60000));
		this.initPosition();
		this.checkVisible();
	},
	destroy() {
		this._super(arguments);
		clearInterval(this.get("timer"));
	},
	init() {
		this._super(...arguments);
		this.set("startTime", this.get("timeScale").getSatrtValue());
		this.set("endTime", this.get("timeScale").getEndValue());
	},
	startTimer() {
		this.checkVisible();
		this.setPosition();
	},
	checkVisible: observer("selectDate", function() {
		let element = this.$(".app-timer")[0];
		let visibleTimer = moment().hour() >= this.get("startTime") &&
                        moment().hour() !== this.get("endTime") &&
                        moment(this.get("selectDate")).isSame(moment(), "day");
		this.set("visibleTimer", visibleTimer);
		if (visibleTimer) {
			element.classList.contains("timerHidden") && element.classList.remove("timerHidden");
		} else {
			!element.classList.contains("timerHidden") && element.classList.add("timerHidden");
		}
	}),
	initPosition() {
		let start = moment().hour(this.get("startTime")).minute(0);
		let offset = moment().diff(start, "minutes") * this.get("widthOneMinut");
		this.$(".app-timer")[0].style.left = offset + "px";
	},
	setPosition() {
		this.initPosition();
	},
});
