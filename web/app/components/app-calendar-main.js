import Component from "@ember/component";
import moment from "moment";
const DAYS_WEEK_NAME = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default Component.extend({

	didInsertElement() {
		this._super(...arguments);
		this.$()[0].previousElementSibling.addEventListener("click", this.toggleCalendar.bind(this));
		this.$()[0].parentElement.style.position = "relative";
	},

	init() {
		this._super(...arguments);
		this.set("now", moment());
		this.set("daysWeekName", DAYS_WEEK_NAME);
		this.inicialize();
	},
	inicialize() {
		let calendarObject = [];
		for (let i = 0; i < this.get("quatityMonth"); i++) {
			this.createMonth(moment().add(i, "month")).then((element) => {
				calendarObject.pushObject(element);
			});
		}
		this.set("calendarObject", calendarObject);
	},
	createMonth(date) {
		return new Promise((resolve) => {
			let lengthMonth = moment(date).daysInMonth() + 1;
			let firstDayOfWeek = moment(date).date(1).day() - 1 >= 0 ? moment(date).date(1).day() -1 : 6;
			let lastDayOfWeek = moment(date).date(lengthMonth).day() - 1 >=0 ? moment(date).date(lengthMonth).day() -1 : 6;
			let nowDate = moment().date();


			resolve({lengthMonth, firstDayOfWeek, lastDayOfWeek, nowDate, date});
		});
	},
	hideCalendar() {
		let calendar = this.$(".active-calendar");
		let input = this.$()[0].previousElementSibling;
		let selectDate = this.$(".select-date");
		selectDate && selectDate.length && selectDate.removeClass("select-date");
		calendar && calendar.length && calendar.removeClass("active-calendar");
		input && input.classList.remove("blueColor");
	},
	toggleCalendar() {
		this.$(".app-calendar-main__months")[0].classList.toggle("active-calendar");
		this.$()[0].previousElementSibling.classList.toggle("blueColor");
		return false;
	},
	actions: {
		closeCalendar() {
			this.hideCalendar();
		},
		selectDateInCalendar(dateNumber, date) {
			let select = moment(date).date(dateNumber);
			let setSelectDateAction = this.get("setSelectDate");
			!moment(this.get("selectDate")).isSame(select) && setSelectDateAction(select);
			return false;
		},
		activeDate(event) {
			let selectDate = this.$(".select-date");
			selectDate && selectDate.length && selectDate.removeClass("select-date");
			event.target.classList.add("select-date");
		},
	},
});
