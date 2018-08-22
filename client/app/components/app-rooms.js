import Component from "@ember/component";
import {inject} from "@ember/service";
import {observer} from "@ember/object";
import moment from "moment";

export default Component.extend({
	store: inject(),
	gqlAPI: inject("gql-api"),
	timeScale: inject("time-scale"),

	init() {
		this._super(...arguments);
	},
	didInsertElement() {
		this._super(...arguments);
		this.inicialize();
	},
	inicialize() {
		this.set("arrayTime", this.get("timeScale").getArrayTimeValue());
		this.getEvents();
	},
	getEvents: observer("selectDate", function() {
		let dateStart = moment(this.get("selectDate")).hour(this.get("timeScale").getSatrtValue()).minute(0);
		let dateEnd = moment(this.get("selectDate")).hour(this.get("timeScale").getEndValue()).minute(0);
		this.get("gqlAPI").getEventsRangDate({dateStart, dateEnd})
			.then((events) => {
				this.set("events", events);
				this.set("eventsEmpty", []);
			});
	}),

});
