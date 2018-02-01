import Route from "@ember/routing/route";
import RSVP from "rsvp";
import {inject} from "@ember/service";
import moment from "moment";

export default Route.extend({
	gqlAPI: inject("gql-api"),
	model(params) {
		let eventModel = {
			id: "",
			title: "",
			users: [],
			date: "",
			timeStart: "",
			timeEnd: "",
			room: "",
			oldDate: "",
		};
		let validator = {
			validTitle: true,
			validUsers: true,
			validRoom: true,
			validDate: true,
			validTimeStart: true,
			validTimeEnd: true,
		};
		return RSVP.hash({
			event: this.get("gqlAPI").getEventById({eventId: params.eventId}).then((event) => {
				eventModel.id = event.id;
				eventModel.title = event.title;
				eventModel.users = event.users;
				eventModel.room = event.room;
				eventModel.date = moment(event.dateStart);
				eventModel.oldDate = moment(event.dateStart);
				eventModel.timeStart = moment(event.dateStart).hour() + ":" + moment(event.dateStart).minute();
				eventModel.timeEnd = moment(event.dateEnd).hour() + ":" + moment(event.dateEnd).minute();
				return eventModel;
			}),
			validator: validator,
			allUsers: this.get("gqlAPI").getUsers(),
		});
	},
});
