import Service from "@ember/service";
import {inject} from "@ember/service";

export default Service.extend({
  gqlAPI: inject('gql-api'),
	timeScale: inject("time-scale"),

  getRooms(dateStart, dateEnd, users, eventId){
    let promises = [];
    let allRoomsPromise = this.get('gqlAPI').getRoomsFromRecomendation({capacity: users.length});
    let eventsInSelectTime = this.get('gqlAPI').getEventsRangDate({dateStart: moment(dateStart), dateEnd: moment(dateEnd)});
    let allEvents = this.get('gqlAPI').getEventsRangDate({dateStart: moment(dateStart).hour(this.get("timeScale").getSatrtValue()).minute(0),
                                                          dateEnd: moment(dateStart).hour(this.get("timeScale").getEndValue()).minute(0),
                                                          eventId});


  return Promise.all([allRoomsPromise, eventsInSelectTime, allEvents]).then(([rooms, eventsRange, events]) => {
      let result = [];
      let filterEvents

      rooms.forEach(room => {
        room.events = events[room.id];
      });
      let floorRecomendation = 0;
      users.forEach(user => floorRecomendation += user.homeFloor);
      floorRecomendation = Math.floor(floorRecomendation/users.length);

      rooms.forEach(room => {
        room.floorPriority = room.floor >= floorRecomendation ?
                                            room.floor  - floorRecomendation :
                                            floorRecomendation - room.floor;
        if (!room.events || !room.events.length) {
          this.setTime(room, dateStart, dateEnd);
          result.push(room)
        } else if(room.events.length){
          let isBusy = room.events.filter(event => {
            return  (moment(dateStart).isSame(moment(event.dateStart), "minutes")) ||
                    (moment(dateEnd).isSame(moment(event.dateEnd), "minutes")) ||
                    (moment(dateStart).isAfter(moment(event.dateStart)) && moment(dateStart).isBefore(moment(event.dateEnd))) ||
                    (moment(dateEnd).isAfter(moment(event.dateStart)) && moment(dateEnd).isBefore(moment(event.dateEnd))) ||
                    (moment(dateStart).isBefore(moment(event.dateStart)) && moment(dateEnd).isAfter(moment(event.dateEnd)));
          });
          if(!isBusy.length) {
            this.setTime(room, dateStart, dateEnd);
            result.push(room);
          }
        }
      });
      return (result.sortBy("floorPriority"));
    })
  },
  setTime(room, dateStart, dateEnd){
    room.timeStart = this.getTime(moment(dateStart).hour()+ ":" + moment(dateStart).minute());
    room.timeEnd = this.getTime(moment(dateEnd).hour()+ ":" + moment(dateEnd).minute());
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
  getTime(time) {
		if (!time) {
			return "";
		}
		let parts = time.split(":");
		parts[1] = +parts[1] >= 10 ? parts[1] : "0" + parts[1];
		parts[0] = +parts[0] >= 10 ? parts[0] : "0" + parts[0];

		return parts[0] + ":" + parts[1];
	},
})
