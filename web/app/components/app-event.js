import Component from "@ember/component";
import {inject} from "@ember/service";
import {computed} from "@ember/object";
import {observer} from "@ember/object";

export default Component.extend({
	gqlAPI: inject("gql-api"),
	validatorEvent: inject("validator-event"),
	getRecomendationRooms: inject("get-recomendation-rooms"),
	init() {
		this._super(...arguments);
		this.inputTitle = this.get("event.title");
		this.set("event.timeStart", this.getTime(this.get("event.timeStart")));
		this.set("event.timeEnd", this.getTime(this.get("event.timeEnd")));
		this.users = this.get("allUsers");
		this.inputUsers = this.get("event.users") ? this.get("event.users") : [];
		this.get("event.users").forEach((user) => this.selectUserInEvent(user));
	},

	filterUsers: computed("filterValue", function() {
		if (!this.get("filterValue")) {
			return this.get("users");
		}
		return this.get("users").filter( (item) => item.login.indexOf(this.get("filterValue")) >= 0);
	}),
	changeUsers: observer( "event.users.length", function(){
		if (this.get("event.room") && this.get('event.users.length') > this.get("event.room.capacity")){
			this.initRecommendationRooms();
		} else if(!this.get("event.room")){
			this.initRecommendationRooms();
		}
	}),
	initRecommendationRooms: observer("event.date","event.timeStart","event.timeEnd", function(){
		if(this.get("event.room")){
			this.set('event.room', null)
		}
		if(this.get("recomendationRooms")){
			this.set("recomendationRooms", null);
		}
		let timeStart = {
			hour: this.get("event.timeStart").split(":")[0],
			minute: this.get("event.timeStart").split(":")[1],
		};
		let timeEnd = {
			hour: this.get("event.timeEnd").split(":")[0],
			minute: this.get("event.timeEnd").split(":")[1],
		};

		let validatorTime = this.get("validatorEvent").validTime(this.get("event.timeStart" ),
																														 this.get("event.timeEnd" ),
																														 {validTimeStart: true, validTimeEnd: true });

	 if(validatorTime.validTimeStart && validatorTime.validTimeEnd){
		 	let dateStart = moment(this.get("event.date")).hour(timeStart.hour).minute(timeStart.minute).second(0).milliseconds(0);
 			let dateEnd = moment(this.get("event.date")).hour(timeEnd.hour).minute(timeEnd.minute).second(0).milliseconds(0);
 			this.get('getRecomendationRooms').getRooms(dateStart, dateEnd, this.get("inputUsers"), this.get("event.id")).then(rooms => {
				console.log(rooms);
				this.set("recomendationRooms", rooms);
			});
 		}
	}),
	inputDate: computed("event.date", function() {
		return this.get("event.date");
	}),
	getTime(time) {
		if (!time) {
			return "";
		}
		let parts = time.split(":");
		parts[1] = +parts[1] >= 10 ? parts[1] : "0" + parts[1];
		parts[0] = +parts[0] >= 10 ? parts[0] : "0" + parts[0];

		return parts[0] + ":" + parts[1];
	},
	selectUserInEvent(user) {
		let users = this.get("users");
		this.set("users", users.filter((element) => element.id !== user.id));
	},
	actions: {
		selectEventDate(date) {
			this.set("event.date", date);
		},
		selectUser(item) {
			let inputUsers = this.get("inputUsers") ? this.get("inputUsers") : [];
			inputUsers.addObject(item);
			this.selectUserInEvent(item);
			this.set("inputUsers", inputUsers);
			this.set("event.users", this.get("inputUsers"));
			//this.set('event.room', null);
			this.set("filterValue", null);
		},
		removeUser(item) {
			this.set("inputUsers", this.get("inputUsers").filter( (user) => user.id !== item.id));
			this.get("users").addObject(item);
			//this.set('event.room', null);
			this.set("event.users", this.get("inputUsers"));
		},
		changeEventRoom(){
			this.set('event.room', null);
			this.initRecommendationRooms();
		},
		selectEventRoom(item){
			this.set("recomendationRooms", null);
			this.set("event.room", item);
			this.set("event.timeStart", item.timeStart);
			this.set("event.timeEnd", item.timeEnd);
			return false;
		}
	},
});
