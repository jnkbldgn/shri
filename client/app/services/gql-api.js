import Service from "@ember/service";
import moment from "moment";
import ObjectQueryManager from "ember-apollo-client/mixins/object-query-manager";
// queries
import rooms from "../gql/queries/rooms";
import room from "../gql/queries/room";
import users from "../gql/queries/users";
import event from "../gql/queries/event";
import events from "../gql/queries/events";
import eventsRangDate from "../gql/queries/eventsRangDate";

// mutations
import createEvent from "../gql/mutations/createEvent";
import updateEvent from "../gql/mutations/updateEvent";
import addUserToEvent from "../gql/mutations/addUserToEvent";
import removeUserFromEvent from "../gql/mutations/removeUserFromEvent";
import changeEventRoom from "../gql/mutations/changeEventRoom";
import removeEvent from "../gql/mutations/removeEvent";

export default Service.extend(ObjectQueryManager, {

	// rooms queries
	getRooms() {
		return this.apollo.query({query: rooms}, "rooms")
			.then((rooms) => {
				return this.mapRooms(rooms);
			});
	},
	getRoomsFromRecomendation(params) {
		return this.apollo.query({query: rooms}, "rooms")
			.then((rooms) => {
				return rooms.filter(room => room.capacity >= params.capacity);
			});
	},
	getRoom(params) {
		let variables = {
			id: params.id,
		};
		return this.apollo.query({query: room, variables}, "room");
	},

	mapRooms(rooms) {
		let result = {};
		rooms.forEach((item) => {
			if (!result[item.floor]) {
				result[item.floor] = [];
			}
			result[item.floor].push(item);
		});
		return result;
	},

	// events queries

	getEventById(params) {
		let variables = {
			id: params.eventId,
		};
		return this.apollo.watchQuery({query: event, variables}, "event");
	},

	getEvents(){
		return this.apollo.watchQuery({query: events}, events);
	},

	getEventsRangDate(params) {
		let variables = {
			dateStart: moment(params.dateStart).format("YYYY-MM-DDTHH:mm"),
			dateEnd: moment(params.dateEnd).format("YYYY-MM-DDTHH:mm"),
		};
		return this.apollo.watchQuery({query: eventsRangDate, variables}, "eventsRangDate")
			.then((events) => this.eventsRangDateMap(events, params.eventId));
	},

	eventsRangDateMap(events, eventId) {
		let result = {};
		events.forEach((event) => {
			if (!result[event.room.id]) {
				result[event.room.id] = [];
			}
			if (!eventId || event.id !== eventId) {
				event.countUsers = event.users.length - 1;
				event.isFree = false;
				event.timeStart = {
					hour: moment(event.dateStart).hour(),
					minute: moment(event.dateStart).minute(),
				};
				event.timeEnd = {
					hour: moment(event.dateEnd).hour(),
					minute: moment(event.dateEnd).minute(),
				};
				let widthCell = moment(event.dateEnd).diff(event.dateStart, "minutes");
				event.widthCell = widthCell;
				result[event.room.id].push(event);
			}
		});
		return result;
	},


	// event mutations

	createEvent(params) {
		let variables = {
			eventInput: params.eventInput,
			usersIds: params.usersIds,
			roomId: params.roomId,
		};
		return this.apollo.mutate(
			{
				mutation: createEvent,
				variables,
				update: (store, {data: {createEvent}}) => {
					try {
						let variables = {
							dateStart: moment(createEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(createEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});

						data.eventsRangDate.addObject(createEvent);

						store.writeQuery({query: eventsRangDate, variables, data});
					} catch (e) {
						console.log("Not need observable query");
					}
				},
			}, "createEvent");
	},
	removeEvent(params) {
		let variables = {
			eventId: params.eventId,
		};
		return this.apollo.mutate(
			{
				mutation: removeEvent,
				variables,
				update: (store, {data: {removeEvent}}) => {
					try {
						let variables = {
							dateStart: moment(removeEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(removeEvent.dateStart).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});

						if (data && data.eventsRangDate && data.eventsRangDate) {
							data.eventsRangDate = data.eventsRangDate.filter((item) => item.id !== removeEvent.id);
							store.writeQuery({query: eventsRangDate, variables, data});
						}
					} catch (e) {
						console.log("Not need observable query");
					}
				},
			}, "createEvent");
	},

	updateEvent(params) {
		let variables = {
			input: params.eventInput,
			eventId: params.eventId,
		};
		let oldDate = params.oldDate;
		return this.apollo.mutate(
			{
				mutation: updateEvent,
				variables,
				update: (store, {data: {updateEvent}}) => {
					try {
						let variables = {
							dateStart: moment(updateEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(updateEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});
						let element = data.eventsRangDate.findBy("id", updateEvent.id);
						if (data && data.eventsRangDate && data.eventsRangDate.length && element) {
							element.title = updateEvent.title;
							element.dateStart = moment(updateEvent.dateStart).format("YYYY-MM-DDTHH:mm");
							element.dateEnd = moment(updateEvent.dateEnd).format("YYYY-MM-DDTHH:mm");
							store.writeQuery({query: eventsRangDate, variables, data});
						} else if (data && data.eventsRangDate) {
							data.eventsRangDate.addObject(updateEvent);
							store.writeQuery({query: eventsRangDate, variables, data});
						}
						if (!moment(oldDate).isSame(moment(updateEvent.dateStart), "day")) {
							let variables = {
								dateStart: moment(oldDate).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
								dateEnd: moment(oldDate).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
							};
							const data = store.readQuery({query: eventsRangDate, variables});
							data.eventsRangDate = data.eventsRangDate.filter((item) => item.id !== updateEvent.id);
							store.writeQuery({query: eventsRangDate, variables, data});
						}
					} catch (e) {
						if (!moment(oldDate).isSame(moment(updateEvent.dateStart), "day")) {
							let variables = {
								dateStart: moment(oldDate).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
								dateEnd: moment(oldDate).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
							};
							const data = store.readQuery({query: eventsRangDate, variables});
							data.eventsRangDate = data.eventsRangDate.filter((item) => item.id !== updateEvent.id);
							store.writeQuery({query: eventsRangDate, variables, data});
						}
					}
				},
			}, "updateEvent");
	},

	changeEventRoom(params) {
		let variables = {
			id: params.id,
			roomId: params.roomId,
		};
		return this.apollo.mutate(
			{
				mutation: changeEventRoom,
				variables,
				update: (store, {data: {changeEventRoom}}) => {
					try {
						let variables = {
							dateStart: moment(changeEventRoom.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(changeEventRoom.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});

						data.eventsRangDate.findBy("id", changeEventRoom.id).room = changeEventRoom.room;

						store.writeQuery({query: eventsRangDate, variables, data});
					} catch (e) {
						console.log("Not need observable query");
					}
				},
			}, "changeEventRoom");
	},

	removeUserFromEvent(params) {
		let variables = {
			id: params.id,
			userId: params.userId,
		};
		return this.apollo.mutate(
			{
				mutation: removeUserFromEvent,
				variables,
				update: (store, {data: {removeUserFromEvent}}) => {
					try {
						let variables = {
							dateStart: moment(removeUserFromEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(removeUserFromEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});

						data.eventsRangDate.findBy("id", removeUserFromEvent.id).users = removeUserFromEvent.users;

						store.writeQuery({query: eventsRangDate, variables, data});
					} catch (e) {
						console.log("Not need observable query");
					}
				},
			}, "removeUserFromEvent");
	},

	addUserToEvent(params) {
		let variables = {
			id: params.id,
			userId: params.userId,
		};
		return this.apollo.mutate(
			{
				mutation: addUserToEvent,
				variables,
				update: (store, {data: {addUserToEvent}}) => {
					try {
						let variables = {
							dateStart: moment(addUserToEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: moment(addUserToEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm"),
						};
						const data = store.readQuery({query: eventsRangDate, variables});

						data.eventsRangDate.findBy("id", addUserToEvent.id).users = addUserToEvent.users;

						store.writeQuery({query: eventsRangDate, variables, data});
					} catch (e) {
						console.log("Not need observable query");
					}
				},
			}, "addUserToEvent");
	},

	// users queries
	getUsers() {
		return this.apollo.query({query: users}, "users");
	},
});
