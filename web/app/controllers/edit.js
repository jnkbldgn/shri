import Controller from "@ember/controller";
import {inject} from "@ember/service";
import moment from "moment";

export default Controller.extend({
	timeScale: inject("time-scale"),
	gqlAPI: inject("gql-api"),
	validatorEvent: inject("validator-event"),
	queryParams: ["eventId"],
	eventId: null,
	showModalUpdate: false,
	showModalRemove: false,

	callBackModalUpdate() {
		let self = this;
		self.transitionToRoute("/");
	},
	callBackModalRemove() {
		this.get("gqlAPI").removeEvent({eventId: this.get("model.event.id")}).then(() => this.transitionToRoute("/"));
	},
	actions: {
		removeEvent() {
			let modalButtons = [
				{
					name: "Отмена",
					class: "button button-gray",
				},
				{
					name: "Удалить",
					class: "button button-gray",
					callBack: this.callBackModalRemove.bind(this),
				},
			];
			this.set("modalButtonsRemove", modalButtons);
			this.set("showModalRemove", true);
		},
		updateEvent() {
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
				eventId: this.get("model.event.id"),
				eventInput: {
					title: this.get("model.event.title"),
					dateStart: moment(this.get("model.event.date")).hour(timeStart.hour).minute(timeStart.minute).format("YYYY-MM-DDTHH:mm"),
					dateEnd: moment(this.get("model.event.date")).hour(timeEnd.hour).minute(timeEnd.minute).format("YYYY-MM-DDTHH:mm"),
				},
				oldDate: moment(this.get("model.event.oldDate")),
			};

			let roomId = this.get("model.event.room.id");
			let usersIds = this.get("model.event.users").map((user) => user.id);

			this.get("gqlAPI").updateEvent(params).then((event) => {
				let promises = [];
				event.users.forEach((user) => {
					let positionDuplicat = usersIds.indexOf(user.id);
					if (positionDuplicat >= 0) {
						usersIds.splice(positionDuplicat, 1);
					} else {
						promises.push(this.get("gqlAPI").removeUserFromEvent({id: event.id, userId: user.id}));
					}
				});
				if (usersIds.length) {
					usersIds.forEach((id) => promises.push(this.get("gqlAPI").addUserToEvent({id: event.id, userId: id})));
				}
				let modalButtons = [
					{
						name: "Хорошо",
						class: "button button-blue",
						callBack: this.callBackModalUpdate.bind(this),
					},
				];
				Promise.all(promises).then(() =>{
					if (roomId !== event.room.id) {
						this.get("gqlAPI").changeEventRoom({id: event.id, roomId: roomId}).then(event =>{
							this.set("newEvent", event);
							this.set("modalButtons", modalButtons);
							this.set("showModalUpdate", true);
						});
					} else {
						this.get("gqlAPI").getEventById(params).then(event => {
							this.set("newEvent", event);
							this.set("modalButtons", modalButtons);
							this.set("showModalUpdate", true);
						});
					}
				});
			});
		},
	},
});
