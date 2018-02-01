import Controller from "@ember/controller";
import {inject} from "@ember/service";
import moment from "moment";

export default Controller.extend({
	timeScale: inject("time-scale"),
	gqlAPI: inject("gql-api"),
	validatorEvent: inject("validator-event"),
	queryParams: ["timeStart", "timeEnd", "date", "roomId"],
	timeStart: null,
	timeEnd: null,
	date: null,
	roomId: null,
	showModal: false,

	callBackModal() {
		let self = this;
		self.transitionToRoute("/");
	},

	actions: {
		createEvent() {
			if (!this.get("validatorEvent").valid(this.get("model"))) {
				return false;
			}
			let timeStart = {
				hour: this.get("model.event.timeStart").split(":")[0],
				minute: this.get("model.event.timeStart").split(":")[1],
			};
			let timeEnd = {
				hour: this.get("model.event.timeEnd").split(":")[0],
				minute: this.get("model.event.timeEnd").split(":")[1],
			};
			let params = {
				eventInput: {
					title: this.get("model.event.title"),
					dateStart: moment(this.get("model.event.date")).hour(timeStart.hour).minute(timeStart.minute).format("YYYY-MM-DDTHH:mm"),
					dateEnd: moment(this.get("model.event.date")).hour(timeEnd.hour).minute(timeEnd.minute).format("YYYY-MM-DDTHH:mm"),
				},
				roomId: this.get("model.event.room.id"),
				usersIds: this.get("model.event.users").map((user) => user.id),
			};
			this.get("gqlAPI").createEvent(params).then((event) => {
				let newEvent = {
					title: event.title,
					dateStart: event.dateStart,
					dateEnd: event.dateEnd,
					room: event.room,
				};
				let modalButtons = [{
					name: "Хорошо",
					class: "button button-blue",
					callBack: this.callBackModal.bind(this),
				}];
				this.set("newEvent", newEvent);
				this.set("modalButtons", modalButtons);
				this.set("showModal", true);
			});
		},
	},
});
