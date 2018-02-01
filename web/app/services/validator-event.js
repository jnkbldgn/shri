import Service from "@ember/service";
import {set} from "@ember/object";
import {get} from "@ember/object";
import moment from "moment";
import {inject} from "@ember/service";

export default Service.extend({
	timeScale: inject("time-scale"),

	valid(model) {
		set(model, "validator.validTitle", !!model.event.title);
		set(model, "validator.validUsers", !!model.event.users.length);
		set(model, "validator.validRoom", !!model.event.room);
		set(model, "validator.validDate", !!model.event.date);
		set(model, "validator.validTimeStart", !!model.event.timeStart);
		set(model, "validator.validTimeEnd", !!model.event.timeEnd);
		if (!!model.event.date && !!model.event.timeStart && !!model.event.timeEnd) {
			this.validTime(model.event.timeStart, model.event.timeEnd, model.validator);
		}


		return get(model, "validator.validTitle") &&
           get(model, "validator.validUsers") &&
           get(model, "validator.validRoom") &&
           get(model, "validator.validDate") &&
           get(model, "validator.validTimeStart") &&
           get(model, "validator.validTimeEnd");
	},
	validTime(timeStart, timeEnd, validator){
		let starTimeParts = timeStart.split(":");
		let endTimeParts = timeEnd.split(":");
		if((!starTimeParts[1] || !starTimeParts[0]) ||
			 (starTimeParts[1].length !==2 || starTimeParts[0].length !== 2)){
			set(validator, "validTimeStart", false);
		} else if ((!endTimeParts[1] || !endTimeParts[0]) ||
							 (endTimeParts[1].length !== 2 || endTimeParts[0].length !== 2)) {
			set(validator, "validTimeEnd", false);
		} else {
			let dateStart = moment().hour(+starTimeParts[0])
				.minute(+starTimeParts[1]);
			let dateEnd = moment().hour(+endTimeParts[0])
				.minute(+endTimeParts[1]);
			let minStartDate = moment().hour(this.get("timeScale")
				.getSatrtValue()).minute(0);
			let maxEndDate = moment().hour(this.get("timeScale")
				.getEndValue()).minute(0);
			if (+starTimeParts[0] > +endTimeParts[0]) {
				set(validator, "validTimeStart", false);
				set(validator, "validTimeEnd", false);
			} else if (dateStart.isBefore(minStartDate) ||
								dateStart.isAfter(maxEndDate)) {
				set(validator, "validTimeStart", false);
			} else if (dateEnd.isBefore(minStartDate) ||
								dateEnd.isAfter(maxEndDate)) {
				set(validator, "validTimeEnd", false);
			}
		}

		return validator;
	}
});
