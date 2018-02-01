import Route from "@ember/routing/route";
import moment from "moment";
import RSVP from "rsvp";
import {inject} from "@ember/service";

export default Route.extend({
	gqlAPI: inject("gql-api"),
	model(params) {
		let eventModel = {
			title: "",
			users: [],
			date: moment(+params.date),
			timeStart: params.timeStart ? params.timeStart : "",
			timeEnd: params.timeEnd ? params.timeEnd : "",
			room: "",
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
			event: params.roomId ? this.get("gqlAPI").getRoom({id: params.roomId}).then((room) => {
				eventModel.room = room;
				return eventModel;
			}) : eventModel,
			validator: validator,
			allUsers: this.get("gqlAPI").getUsers(),
		});
	},
});
