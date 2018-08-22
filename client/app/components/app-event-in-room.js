import Component from "@ember/component";
import {inject} from "@ember/service";
import {htmlSafe} from "@ember/string";
import {observer} from "@ember/object";
import {set} from "@ember/object";
import moment from "moment";

export default Component.extend({
	store: inject(),
	timeScale: inject("time-scale"),
	router: inject(),

	init() {
		this._super(arguments);
	},

	didInsertElement() {
		this._super(...arguments);
		let rootEventsElement = this.$(".room-events-cells")[0];
		let widthRootElement = rootEventsElement.clientWidth;
		let arrayTimeValueLength = this.get("timeScale").getArrayTimeValue().length;
		let lengthCellTimeScale = widthRootElement/arrayTimeValueLength;
		let firstAndLastCell = lengthCellTimeScale/2;
		let widthOneMinut = lengthCellTimeScale/60;
		rootEventsElement.style.paddingLeft = firstAndLastCell + "px";
		rootEventsElement.style.paddingRight = firstAndLastCell + "px";
		this.set("lengthCellTimeScale", lengthCellTimeScale);
		this.set("widthOneMinut", widthOneMinut);
		this.set("mobileSwipe", false);
	},
	hideRootElement() {
		return new Promise((resolve) => {
			resolve(this.$(".room-events-cells")[0].classList.remove("height-events-row"));
		});
	},
	inicialize: observer("eventsInRoom", function() {
		this.hideRootElement().then(() => {
			this.initEvents(this.get("eventsInRoom")).then(() => {
				this.$(".room-events-cells")[0].classList.add("height-events-row");
			});
		});
	}),

	initEvents(events) {
		return new Promise((resolve) => {
			let freeEventsCells = this.get("timeScale").getArrayTimeValue();
			let startHour = this.get("timeScale").getSatrtValue();
			let endHour = this.get("timeScale").getEndValue();
			let startMinute = 0;
			let eventsCells = [];
			if (events && events.length) {
				let sortEvents = events.sortBy("dateStart");
				let widthOneMinut = this.get("widthOneMinut");

				sortEvents.forEach((event, index) => {
					set(event, "widthCell", htmlSafe("width:" + event.widthCell * widthOneMinut + "px"));
					if (eventsCells && !eventsCells.length || index && !moment(sortEvents[index - 1].dateEnd).isSame(moment(event.dateStart))) {
						let quantityFreeCellsBefore = moment(event.dateStart).milliseconds(0).diff(moment(event.dateStart).hour(startHour).minute(startMinute).milliseconds(0), "minute")/60;
						let fullFreeCells = Math.floor(quantityFreeCellsBefore);
						if (fullFreeCells) {
							let indexStartFree = freeEventsCells.indexOf(startHour);
							let endIndexFree = freeEventsCells.indexOf(moment(event.dateStart).hour());
							let setMinute = eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.minute : 0;
							let freeCells = this.initFreeEventsCells(indexStartFree, endIndexFree, setMinute);
							eventsCells = eventsCells.concat(freeCells);
						}
						if (moment(event.dateStart).minute()) {
							let firstPart = {};
							firstPart.timeStart = {
								hour: eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.hour : moment(event.dateStart).hour(),
								minute: eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.minute : 0,
							};
							firstPart.timeEnd = {
								hour: moment(event.dateStart).hour(),
								minute: moment(event.dateStart).minute(),
							};
							firstPart.isFree = true;
							firstPart.queryTimeStart = firstPart.timeStart.hour + ":" + firstPart.timeStart.minute;
							firstPart.queryTimeEnd = firstPart.timeEnd.hour + ":" + firstPart.timeEnd.minute;
							firstPart.widthCell = htmlSafe("width:" + (quantityFreeCellsBefore - fullFreeCells)* 60 * widthOneMinut + "px");
							eventsCells.addObject(firstPart);
						} else if (index && eventsCells[eventsCells.length - 1].timeEnd.minute &&
                      !moment(event.dateStart).isSame(eventsCells[eventsCells.length - 1].dateEnd)) {
							let firstPart = {};
							firstPart.timeStart = {
								hour: eventsCells[eventsCells.length - 1].timeEnd.hour,
								minute: 0,
							};
							firstPart.timeEnd = {
								hour: eventsCells[eventsCells.length - 1].timeEnd.hour,
								minute: eventsCells[eventsCells.length - 1].timeEnd.minute,
							};
							firstPart.isFree = true;
							firstPart.queryTimeStart = firstPart.timeStart.hour + ":" + firstPart.timeStart.minute;
							firstPart.queryTimeEnd = firstPart.timeEnd.hour + ":" + firstPart.timeEnd.minute;
							firstPart.widthCell = htmlSafe("width:" + firstPart.timeEnd.minute * widthOneMinut + "px");
							eventsCells.addObject(firstPart);
						}
						eventsCells.addObject(event);
					}
					if (index && moment(sortEvents[index - 1].dateEnd).isSame(moment(event.dateStart))) {
						eventsCells.addObject(event);
					}
					if (index === events.length - 1) {
						if (moment(event.dateEnd).minute()) {
							let lastPart = {};
							lastPart.timeStart = {
								hour: moment(event.dateEnd).hour(),
								minute: moment(event.dateEnd).minute(),
							};
							lastPart.timeEnd = {
								hour: moment(event.dateEnd).hour() + 1,
								minute: 0,
							};
							lastPart.isFree = true;
							lastPart.queryTimeStart = lastPart.timeStart.hour + ":" + lastPart.timeStart.minute;
							lastPart.queryTimeEnd = lastPart.timeEnd.hour + ":" + lastPart.timeEnd.minute;
							lastPart.widthCell = htmlSafe("width:" +(60 - lastPart.timeStart.minute) * widthOneMinut + "px");
							eventsCells.addObject(lastPart);
						}
						let quantityFreeCellsAfter = (moment(event.dateEnd).hour(endHour).minute(startMinute).milliseconds(0)).diff(moment(event.dateEnd).hour(eventsCells[eventsCells.length - 1].timeEnd.hour), "minute")/60;
						let fullFreeCells = Math.floor(quantityFreeCellsAfter);
						if (fullFreeCells) {
							let indexStartFree = freeEventsCells.indexOf(eventsCells[eventsCells.length - 1].timeEnd.hour);
							let endIndexFree = freeEventsCells.indexOf(endHour);
							let freeCells = this.initFreeEventsCells(indexStartFree, endIndexFree);
							eventsCells = eventsCells.concat(freeCells);
						}
					}
					startHour = moment(event.dateEnd).hour();
					startMinute = moment(event.dateEnd).minute();
				});
				!eventsCells.findBy("isFree", true) && this.noFreeCells();
				resolve(this.set("eventsCells", eventsCells));
			} else {
				resolve(this.set("eventsCells", this.initFreeEventsCells()));
			}
		});
	},

	noFreeCells() {
		Array.prototype.forEach.call(this.$(".app-event-in-room__room-description")[0].children, (item) => item.classList.add("grayColor"));
	},

	initFreeEventsCells(startPosition, endPosition, minute) {
		let timeGridCells = this.get("timeScale").getTimeGridCells();
		let arrayTimeValue = this.get("timeScale").getArrayTimeValue();
		let start = startPosition || "0";
		let end = endPosition || timeGridCells;
		let result = [];
		let setMinute = minute ? minute : 0;
		for (let i = +start; i < end; i++) {
			let itemCell = {
				timeStart: {
					hour: arrayTimeValue[i],
					minute: setMinute,
				},
				timeEnd: {
					hour: arrayTimeValue[i + 1],
					minute: setMinute,
				},
				queryTimeStart: arrayTimeValue[i]+ ":" + setMinute,
				queryTimeEnd: arrayTimeValue[i + 1]+ ":" + setMinute,
				widthCell: htmlSafe("width:" + this.get("lengthCellTimeScale") + "px"),
				isFree: true,
			};
			result.pushObject(itemCell);
		}
		return result;
	},

	actions: {
		mouseEnterCell() {
			let element = this.$(".room-title")[0];
			if (!element.classList.contains("blueColor")) {
				element.classList.add("blueColor");
			}
			return false;
		},

		mouseLeaveCell() {
			let element = this.$(".room-title")[0];
			if (element.classList.contains("blueColor")) {
				element.classList.remove("blueColor");
			}
			return false;
		},

		editEvent(id){
			this.get("router").transitionTo('edit', {queryParams: { eventId: id}});
			return true;
		},
		mouseEnterEdit(event){
			event.target.parentElement.style.pointerEvents = "none";
			return false;
		},
		mouseLeaveEdit(event){
			event.target.parentElement.style.pointerEvents = "all";
			return false;

		}
	},
});
