"use strict";



define("shri-2018/adapters/application", ["exports", "ember-data"], function (exports, _emberData) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.JSONAPIAdapter.extend({
		// namespace: 'api'
	});
});
define('shri-2018/app', ['exports', 'shri-2018/resolver', 'ember-load-initializers', 'shri-2018/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var App = Ember.Application.extend({
		modulePrefix: _environment.default.modulePrefix,
		podModulePrefix: _environment.default.podModulePrefix,
		Resolver: _resolver.default,
		moment: _environment.default.moment,
		autoprefixer: _environment.default.autoprefixer,
		apollo: _environment.default.apollo
	});

	(0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

	exports.default = App;
});
define("shri-2018/components/app-autocomplete", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		init: function init() {
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {
			this._super(arguments);
			this.$()[0].style.top = this.$()[0].parentElement.parentElement.offsetHeight + "px";
		},

		actions: {
			selectElement: function selectElement(item) {
				var actionSelect = this.get("selectItem");
				actionSelect(item);
				this.$()[0].previousElementSibling.blur();
				return false;
			}
		}
	});
});
define("shri-2018/components/app-calendar-home", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		init: function init() {
			this._super.apply(this, arguments);
			this.set("now", (0, _moment.default)());
		},

		selectValueDisplay: Ember.computed("selectDate", function () {
			return "" + (0, _moment.default)(this.get("selectDate")).format("DD MMM").replace(/.$/, "");
		}),
		prefixSelectValue: Ember.computed("selectDate", function () {
			return "" + ((0, _moment.default)(this.get("now")).isSame(this.get("selectDate"), "day") ? "Сегодня" : (0, _moment.default)(this.get("selectDate")).get("year"));
		}),
		actions: {
			nextDate: function nextDate() {
				var setSelectDateAction = this.get("setSelectDate");
				setSelectDateAction((0, _moment.default)(this.get("selectDate")).add(1, "day"));
				return false;
			},
			prevDate: function prevDate() {
				var setSelectDateAction = this.get("setSelectDate");
				setSelectDateAction((0, _moment.default)(this.get("selectDate")).subtract(1, "day"));
				return false;
			}
		}
	});
});
define("shri-2018/components/app-calendar-main", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var DAYS_WEEK_NAME = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

	exports.default = Ember.Component.extend({
		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);
			this.$()[0].previousElementSibling.addEventListener("click", this.toggleCalendar.bind(this));
			this.$()[0].parentElement.style.position = "relative";
		},
		init: function init() {
			this._super.apply(this, arguments);
			this.set("now", (0, _moment.default)());
			this.set("daysWeekName", DAYS_WEEK_NAME);
			this.inicialize();
		},
		inicialize: function inicialize() {
			var calendarObject = [];
			for (var i = 0; i < this.get("quatityMonth"); i++) {
				this.createMonth((0, _moment.default)().add(i, "month")).then(function (element) {
					calendarObject.pushObject(element);
				});
			}
			this.set("calendarObject", calendarObject);
		},
		createMonth: function createMonth(date) {
			return new Promise(function (resolve) {
				var lengthMonth = (0, _moment.default)(date).daysInMonth() + 1;
				var firstDayOfWeek = (0, _moment.default)(date).date(1).day() - 1 >= 0 ? (0, _moment.default)(date).date(1).day() - 1 : 6;
				var lastDayOfWeek = (0, _moment.default)(date).date(lengthMonth).day() - 1 >= 0 ? (0, _moment.default)(date).date(lengthMonth).day() - 1 : 6;
				var nowDate = (0, _moment.default)().date();
				resolve({ lengthMonth: lengthMonth, firstDayOfWeek: firstDayOfWeek, lastDayOfWeek: lastDayOfWeek, nowDate: nowDate, date: date });
			});
		},
		hideCalendar: function hideCalendar() {
			var calendar = this.$(".active-calendar");
			var input = this.$()[0].previousElementSibling;
			var selectDate = this.$(".select-date");
			selectDate && selectDate.length && selectDate.removeClass("select-date");
			calendar && calendar.length && calendar.removeClass("active-calendar");
			input && input.classList.remove("blueColor");
		},
		toggleCalendar: function toggleCalendar() {
			this.$(".app-calendar-main__months")[0].classList.toggle("active-calendar");
			this.$()[0].previousElementSibling.classList.toggle("blueColor");
			return false;
		},

		actions: {
			closeCalendar: function closeCalendar() {
				this.hideCalendar();
			},
			selectDateInCalendar: function selectDateInCalendar(dateNumber, date) {
				var select = (0, _moment.default)(date).date(dateNumber);
				var setSelectDateAction = this.get("setSelectDate");
				!(0, _moment.default)(this.get("selectDate")).isSame(select) && setSelectDateAction(select);
				return false;
			},
			activeDate: function activeDate(event) {
				var selectDate = this.$(".select-date");
				selectDate && selectDate.length && selectDate.removeClass("select-date");
				event.target.classList.add("select-date");
			}
		}
	});
});
define("shri-2018/components/app-event-in-room", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		store: Ember.inject.service(),
		timeScale: Ember.inject.service("time-scale"),
		router: Ember.inject.service(),

		init: function init() {
			this._super(arguments);
		},
		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);
			var rootEventsElement = this.$(".room-events-cells")[0];
			var widthRootElement = rootEventsElement.clientWidth;
			var arrayTimeValueLength = this.get("timeScale").getArrayTimeValue().length;
			var lengthCellTimeScale = widthRootElement / arrayTimeValueLength;
			var firstAndLastCell = lengthCellTimeScale / 2;
			var widthOneMinut = lengthCellTimeScale / 60;
			rootEventsElement.style.paddingLeft = firstAndLastCell + "px";
			rootEventsElement.style.paddingRight = firstAndLastCell + "px";
			this.set("lengthCellTimeScale", lengthCellTimeScale);
			this.set("widthOneMinut", widthOneMinut);
			this.set("mobileSwipe", false);
		},
		hideRootElement: function hideRootElement() {
			var _this = this;

			return new Promise(function (resolve) {
				resolve(_this.$(".room-events-cells")[0].classList.remove("height-events-row"));
			});
		},

		inicialize: Ember.observer("eventsInRoom", function () {
			var _this2 = this;

			this.hideRootElement().then(function () {
				_this2.initEvents(_this2.get("eventsInRoom")).then(function () {
					_this2.$(".room-events-cells")[0].classList.add("height-events-row");
				});
			});
		}),

		initEvents: function initEvents(events) {
			var _this3 = this;

			return new Promise(function (resolve) {
				var freeEventsCells = _this3.get("timeScale").getArrayTimeValue();
				var startHour = _this3.get("timeScale").getSatrtValue();
				var endHour = _this3.get("timeScale").getEndValue();
				var startMinute = 0;
				var eventsCells = [];
				if (events && events.length) {
					var sortEvents = events.sortBy("dateStart");
					var widthOneMinut = _this3.get("widthOneMinut");

					sortEvents.forEach(function (event, index) {
						Ember.set(event, "widthCell", Ember.String.htmlSafe("width:" + event.widthCell * widthOneMinut + "px"));
						if (eventsCells && !eventsCells.length || index && !(0, _moment.default)(sortEvents[index - 1].dateEnd).isSame((0, _moment.default)(event.dateStart))) {
							var quantityFreeCellsBefore = (0, _moment.default)(event.dateStart).milliseconds(0).diff((0, _moment.default)(event.dateStart).hour(startHour).minute(startMinute).milliseconds(0), "minute") / 60;
							var fullFreeCells = Math.floor(quantityFreeCellsBefore);
							if (fullFreeCells) {
								var indexStartFree = freeEventsCells.indexOf(startHour);
								var endIndexFree = freeEventsCells.indexOf((0, _moment.default)(event.dateStart).hour());
								var setMinute = eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.minute : 0;
								var freeCells = _this3.initFreeEventsCells(indexStartFree, endIndexFree, setMinute);
								eventsCells = eventsCells.concat(freeCells);
							}
							if ((0, _moment.default)(event.dateStart).minute()) {
								var firstPart = {};
								firstPart.timeStart = {
									hour: eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.hour : (0, _moment.default)(event.dateStart).hour(),
									minute: eventsCells.length ? eventsCells[eventsCells.length - 1].timeEnd.minute : 0
								};
								firstPart.timeEnd = {
									hour: (0, _moment.default)(event.dateStart).hour(),
									minute: (0, _moment.default)(event.dateStart).minute()
								};
								firstPart.isFree = true;
								firstPart.queryTimeStart = firstPart.timeStart.hour + ":" + firstPart.timeStart.minute;
								firstPart.queryTimeEnd = firstPart.timeEnd.hour + ":" + firstPart.timeEnd.minute;
								firstPart.widthCell = Ember.String.htmlSafe("width:" + (quantityFreeCellsBefore - fullFreeCells) * 60 * widthOneMinut + "px");
								eventsCells.addObject(firstPart);
							} else if (index && eventsCells[eventsCells.length - 1].timeEnd.minute && !(0, _moment.default)(event.dateStart).isSame(eventsCells[eventsCells.length - 1].dateEnd)) {
								var _firstPart = {};
								_firstPart.timeStart = {
									hour: eventsCells[eventsCells.length - 1].timeEnd.hour,
									minute: 0
								};
								_firstPart.timeEnd = {
									hour: eventsCells[eventsCells.length - 1].timeEnd.hour,
									minute: eventsCells[eventsCells.length - 1].timeEnd.minute
								};
								_firstPart.isFree = true;
								_firstPart.queryTimeStart = _firstPart.timeStart.hour + ":" + _firstPart.timeStart.minute;
								_firstPart.queryTimeEnd = _firstPart.timeEnd.hour + ":" + _firstPart.timeEnd.minute;
								_firstPart.widthCell = Ember.String.htmlSafe("width:" + _firstPart.timeEnd.minute * widthOneMinut + "px");
								eventsCells.addObject(_firstPart);
							}
							eventsCells.addObject(event);
						}
						if (index && (0, _moment.default)(sortEvents[index - 1].dateEnd).isSame((0, _moment.default)(event.dateStart))) {
							eventsCells.addObject(event);
						}
						if (index === events.length - 1) {
							if ((0, _moment.default)(event.dateEnd).minute()) {
								var lastPart = {};
								lastPart.timeStart = {
									hour: (0, _moment.default)(event.dateEnd).hour(),
									minute: (0, _moment.default)(event.dateEnd).minute()
								};
								lastPart.timeEnd = {
									hour: (0, _moment.default)(event.dateEnd).hour() + 1,
									minute: 0
								};
								lastPart.isFree = true;
								lastPart.queryTimeStart = lastPart.timeStart.hour + ":" + lastPart.timeStart.minute;
								lastPart.queryTimeEnd = lastPart.timeEnd.hour + ":" + lastPart.timeEnd.minute;
								lastPart.widthCell = Ember.String.htmlSafe("width:" + (60 - lastPart.timeStart.minute) * widthOneMinut + "px");
								eventsCells.addObject(lastPart);
							}
							var quantityFreeCellsAfter = (0, _moment.default)(event.dateEnd).hour(endHour).minute(startMinute).milliseconds(0).diff((0, _moment.default)(event.dateEnd).hour(eventsCells[eventsCells.length - 1].timeEnd.hour), "minute") / 60;
							var _fullFreeCells = Math.floor(quantityFreeCellsAfter);
							if (_fullFreeCells) {
								var _indexStartFree = freeEventsCells.indexOf(eventsCells[eventsCells.length - 1].timeEnd.hour);
								var _endIndexFree = freeEventsCells.indexOf(endHour);
								var _freeCells = _this3.initFreeEventsCells(_indexStartFree, _endIndexFree);
								eventsCells = eventsCells.concat(_freeCells);
							}
						}
						startHour = (0, _moment.default)(event.dateEnd).hour();
						startMinute = (0, _moment.default)(event.dateEnd).minute();
					});
					!eventsCells.findBy("isFree", true) && _this3.noFreeCells();
					resolve(_this3.set("eventsCells", eventsCells));
				} else {
					resolve(_this3.set("eventsCells", _this3.initFreeEventsCells()));
				}
			});
		},
		noFreeCells: function noFreeCells() {
			Array.prototype.forEach.call(this.$(".app-event-in-room__room-description")[0].children, function (item) {
				return item.classList.add("grayColor");
			});
		},
		initFreeEventsCells: function initFreeEventsCells(startPosition, endPosition, minute) {
			var timeGridCells = this.get("timeScale").getTimeGridCells();
			var arrayTimeValue = this.get("timeScale").getArrayTimeValue();
			var start = startPosition || "0";
			var end = endPosition || timeGridCells;
			var result = [];
			var setMinute = minute ? minute : 0;
			for (var i = +start; i < end; i++) {
				var itemCell = {
					timeStart: {
						hour: arrayTimeValue[i],
						minute: setMinute
					},
					timeEnd: {
						hour: arrayTimeValue[i + 1],
						minute: setMinute
					},
					queryTimeStart: arrayTimeValue[i] + ":" + setMinute,
					queryTimeEnd: arrayTimeValue[i + 1] + ":" + setMinute,
					widthCell: Ember.String.htmlSafe("width:" + this.get("lengthCellTimeScale") + "px"),
					isFree: true
				};
				result.pushObject(itemCell);
			}
			return result;
		},


		actions: {
			mouseEnterCell: function mouseEnterCell() {
				var element = this.$(".room-title")[0];
				if (!element.classList.contains("blueColor")) {
					element.classList.add("blueColor");
				}
				return false;
			},
			mouseLeaveCell: function mouseLeaveCell() {
				var element = this.$(".room-title")[0];
				if (element.classList.contains("blueColor")) {
					element.classList.remove("blueColor");
				}
				return false;
			},
			editEvent: function editEvent(id) {
				this.get("router").transitionTo('edit', { queryParams: { eventId: id } });
				return true;
			},
			mouseEnterEdit: function mouseEnterEdit(event) {
				event.target.parentElement.style.pointerEvents = "none";
				return false;
			},
			mouseLeaveEdit: function mouseLeaveEdit(event) {
				event.target.parentElement.style.pointerEvents = "all";
				return false;
			}
		}
	});
});
define("shri-2018/components/app-event", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		gqlAPI: Ember.inject.service("gql-api"),
		validatorEvent: Ember.inject.service("validator-event"),
		getRecomendationRooms: Ember.inject.service("get-recomendation-rooms"),
		init: function init() {
			var _this = this;

			this._super.apply(this, arguments);
			this.inputTitle = this.get("event.title");
			this.set("event.timeStart", this.getTime(this.get("event.timeStart")));
			this.set("event.timeEnd", this.getTime(this.get("event.timeEnd")));
			this.users = this.get("allUsers");
			this.inputUsers = this.get("event.users") ? this.get("event.users") : [];
			this.get("event.users").forEach(function (user) {
				return _this.selectUserInEvent(user);
			});
		},


		filterUsers: Ember.computed("filterValue", function () {
			var _this2 = this;

			if (!this.get("filterValue")) {
				return this.get("users");
			}
			return this.get("users").filter(function (item) {
				return item.login.indexOf(_this2.get("filterValue")) >= 0;
			});
		}),
		changeUsers: Ember.observer("event.users.length", function () {
			if (this.get("event.room") && this.get('event.users.length') > this.get("event.room.capacity")) {
				this.initRecommendationRooms();
			} else if (!this.get("event.room")) {
				this.initRecommendationRooms();
			}
		}),
		initRecommendationRooms: Ember.observer("event.date", "event.timeStart", "event.timeEnd", function () {
			var _this3 = this;

			if (this.get("event.room")) {
				this.set('event.room', null);
			}
			if (this.get("recomendationRooms")) {
				this.set("recomendationRooms", null);
			}
			var timeStart = {
				hour: this.get("event.timeStart").split(":")[0],
				minute: this.get("event.timeStart").split(":")[1]
			};
			var timeEnd = {
				hour: this.get("event.timeEnd").split(":")[0],
				minute: this.get("event.timeEnd").split(":")[1]
			};

			var validatorTime = this.get("validatorEvent").validTime(this.get("event.timeStart"), this.get("event.timeEnd"), { validTimeStart: true, validTimeEnd: true });

			if (validatorTime.validTimeStart && validatorTime.validTimeEnd) {
				var dateStart = moment(this.get("event.date")).hour(timeStart.hour).minute(timeStart.minute).second(0).milliseconds(0);
				var dateEnd = moment(this.get("event.date")).hour(timeEnd.hour).minute(timeEnd.minute).second(0).milliseconds(0);
				this.get('getRecomendationRooms').getRooms(dateStart, dateEnd, this.get("inputUsers"), this.get("event.id")).then(function (rooms) {
					console.log(rooms);
					_this3.set("recomendationRooms", rooms);
				});
			}
		}),
		inputDate: Ember.computed("event.date", function () {
			return this.get("event.date");
		}),
		getTime: function getTime(time) {
			if (!time) {
				return "";
			}
			var parts = time.split(":");
			parts[1] = +parts[1] >= 10 ? parts[1] : "0" + parts[1];
			parts[0] = +parts[0] >= 10 ? parts[0] : "0" + parts[0];

			return parts[0] + ":" + parts[1];
		},
		selectUserInEvent: function selectUserInEvent(user) {
			var users = this.get("users");
			this.set("users", users.filter(function (element) {
				return element.id !== user.id;
			}));
		},

		actions: {
			selectEventDate: function selectEventDate(date) {
				this.set("event.date", date);
			},
			selectUser: function selectUser(item) {
				var inputUsers = this.get("inputUsers") ? this.get("inputUsers") : [];
				inputUsers.addObject(item);
				this.selectUserInEvent(item);
				this.set("inputUsers", inputUsers);
				this.set("event.users", this.get("inputUsers"));
				//this.set('event.room', null);
				this.set("filterValue", null);
			},
			removeUser: function removeUser(item) {
				this.set("inputUsers", this.get("inputUsers").filter(function (user) {
					return user.id !== item.id;
				}));
				this.get("users").addObject(item);
				//this.set('event.room', null);
				this.set("event.users", this.get("inputUsers"));
			},
			changeEventRoom: function changeEventRoom() {
				this.set('event.room', null);
				this.initRecommendationRooms();
			},
			selectEventRoom: function selectEventRoom(item) {
				this.set("recomendationRooms", null);
				this.set("event.room", item);
				this.set("event.timeStart", item.timeStart);
				this.set("event.timeEnd", item.timeEnd);
				return false;
			}
		}
	});
});
define("shri-2018/components/app-header", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define("shri-2018/components/app-modal-dialog", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);
			this.rootElement = document.getElementsByClassName("ember-application")[0];
			this.parentElement = this.$()[0].parentElement;
		},

		insertModel: Ember.computed("actionVisible", function () {
			if (this.get("actionVisible") && this.get("rootElement")) {
				this.get("rootElement").appendChild(this.$()[0]);
				this.$()[0].classList.add("app-modal-dialog");
			}
			return this.get("actionVisible");
		}),
		close: function close() {
			this.$()[0].classList.remove("app-modal-dialog");
			this.get("parentElement").appendChild(this.$()[0]);
			this.set("actionVisible", false);
		},

		actions: {
			clickButton: function clickButton(callBack) {
				if (callBack) {
					callBack();
					this.close();
					return false;
				}
				this.close();
			}
		}
	});
});
define("shri-2018/components/app-rooms", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		store: Ember.inject.service(),
		gqlAPI: Ember.inject.service("gql-api"),
		timeScale: Ember.inject.service("time-scale"),

		init: function init() {
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);
			this.inicialize();
		},
		inicialize: function inicialize() {
			this.set("arrayTime", this.get("timeScale").getArrayTimeValue());
			this.getEvents();
		},

		getEvents: Ember.observer("selectDate", function () {
			var _this = this;

			var dateStart = (0, _moment.default)(this.get("selectDate")).hour(this.get("timeScale").getSatrtValue()).minute(0);
			var dateEnd = (0, _moment.default)(this.get("selectDate")).hour(this.get("timeScale").getEndValue()).minute(0);
			this.get("gqlAPI").getEventsRangDate({ dateStart: dateStart, dateEnd: dateEnd }).then(function (events) {
				_this.set("events", events);
				_this.set("eventsEmpty", []);
			});
		})

	});
});
define("shri-2018/components/app-time-scale", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		timeScale: Ember.inject.service("time-scale"),

		init: function init() {
			this._super.apply(this, arguments);
			this.scaleValues = this.get("timeScale").getArrayTimeValue();
		}
	});
});
define("shri-2018/components/app-timer", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		timeScale: Ember.inject.service(),

		didInsertElement: function didInsertElement() {
			this._super(arguments);
			var rootElementWidth = this.$()[0].clientWidth;
			var arrayTimeValueLength = this.get("timeScale").getArrayTimeValue().length;
			var lengthCellTimeScale = rootElementWidth / arrayTimeValueLength;
			var widthOneMinut = lengthCellTimeScale / 60;
			this.set("widthOneMinut", widthOneMinut);
			this.set("timer", setInterval(this.startTimer.bind(this), 60000));
			this.initPosition();
			this.checkVisible();
		},
		destroy: function destroy() {
			this._super(arguments);
			clearInterval(this.get("timer"));
		},
		init: function init() {
			this._super.apply(this, arguments);
			this.set("startTime", this.get("timeScale").getSatrtValue());
			this.set("endTime", this.get("timeScale").getEndValue());
		},
		startTimer: function startTimer() {
			this.checkVisible();
			this.setPosition();
		},

		checkVisible: Ember.observer("selectDate", function () {
			var element = this.$(".app-timer")[0];
			var visibleTimer = (0, _moment.default)().hour() >= this.get("startTime") && (0, _moment.default)().hour() !== this.get("endTime") && (0, _moment.default)(this.get("selectDate")).isSame((0, _moment.default)(), "day");
			this.set("visibleTimer", visibleTimer);
			if (visibleTimer) {
				element.classList.contains("timerHidden") && element.classList.remove("timerHidden");
			} else {
				!element.classList.contains("timerHidden") && element.classList.add("timerHidden");
			}
		}),
		initPosition: function initPosition() {
			var start = (0, _moment.default)().hour(this.get("startTime")).minute(0);
			var offset = (0, _moment.default)().diff(start, "minutes") * this.get("widthOneMinut");
			this.$(".app-timer")[0].style.left = offset + "px";
		},
		setPosition: function setPosition() {
			this.initPosition();
		}
	});
});
define("shri-2018/components/app-user-view", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		init: function init() {
			this._super(arguments);
		},

		actions: {
			closeElement: function closeElement(item) {
				var actionClose = this.get("closeButton");
				actionClose(item);
			}
		}
	});
});
define('shri-2018/components/ember-tether', ['exports', 'ember-tether/components/ember-tether'], function (exports, _emberTether) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberTether.default;
    }
  });
});
define('shri-2018/components/popover-on-component', ['exports', 'ember-tooltips/components/popover-on-component'], function (exports, _popoverOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _popoverOnComponent.default;
    }
  });
});
define('shri-2018/components/popover-on-element', ['exports', 'ember-tooltips/components/popover-on-element'], function (exports, _popoverOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _popoverOnElement.default;
    }
  });
});
define('shri-2018/components/tether-popover-on-component', ['exports', 'ember-tooltips/components/tether-popover-on-component'], function (exports, _tetherPopoverOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherPopoverOnComponent.default;
    }
  });
});
define('shri-2018/components/tether-popover-on-element', ['exports', 'ember-tooltips/components/tether-popover-on-element'], function (exports, _tetherPopoverOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherPopoverOnElement.default;
    }
  });
});
define('shri-2018/components/tether-tooltip-on-component', ['exports', 'ember-tooltips/components/tether-tooltip-on-component'], function (exports, _tetherTooltipOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherTooltipOnComponent.default;
    }
  });
});
define('shri-2018/components/tether-tooltip-on-element', ['exports', 'ember-tooltips/components/tether-tooltip-on-element'], function (exports, _tetherTooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tetherTooltipOnElement.default;
    }
  });
});
define('shri-2018/components/tooltip-on-component', ['exports', 'ember-tooltips/components/tooltip-on-component'], function (exports, _tooltipOnComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tooltipOnComponent.default;
    }
  });
});
define('shri-2018/components/tooltip-on-element', ['exports', 'shri-2018/config/environment', 'ember-tooltips/components/tooltip-on-element'], function (exports, _environment, _tooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var _didUpdateTimeoutLength = _environment.default.environment === 'test' ? 0 : 1000;

  exports.default = _tooltipOnElement.default.extend({ _didUpdateTimeoutLength: _didUpdateTimeoutLength });
});
define("shri-2018/controllers/create", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		timeScale: Ember.inject.service("time-scale"),
		gqlAPI: Ember.inject.service("gql-api"),
		validatorEvent: Ember.inject.service("validator-event"),
		queryParams: ["timeStart", "timeEnd", "date", "roomId"],
		timeStart: null,
		timeEnd: null,
		date: null,
		roomId: null,
		showModal: false,

		callBackModal: function callBackModal() {
			var self = this;
			self.transitionToRoute("/");
		},


		actions: {
			createEvent: function createEvent() {
				var _this = this;

				if (!this.get("validatorEvent").valid(this.get("model"))) {
					return false;
				}
				var timeStart = {
					hour: this.get("model.event.timeStart").split(":")[0],
					minute: this.get("model.event.timeStart").split(":")[1]
				};
				var timeEnd = {
					hour: this.get("model.event.timeEnd").split(":")[0],
					minute: this.get("model.event.timeEnd").split(":")[1]
				};
				var params = {
					eventInput: {
						title: this.get("model.event.title"),
						dateStart: (0, _moment.default)(this.get("model.event.date")).hour(timeStart.hour).minute(timeStart.minute).format("YYYY-MM-DDTHH:mm"),
						dateEnd: (0, _moment.default)(this.get("model.event.date")).hour(timeEnd.hour).minute(timeEnd.minute).format("YYYY-MM-DDTHH:mm")
					},
					roomId: this.get("model.event.room.id"),
					usersIds: this.get("model.event.users").map(function (user) {
						return user.id;
					})
				};
				this.get("gqlAPI").createEvent(params).then(function (event) {
					var newEvent = {
						title: event.title,
						dateStart: event.dateStart,
						dateEnd: event.dateEnd,
						room: event.room
					};
					var modalButtons = [{
						name: "Хорошо",
						class: "button button-blue",
						callBack: _this.callBackModal.bind(_this)
					}];
					_this.set("newEvent", newEvent);
					_this.set("modalButtons", modalButtons);
					_this.set("showModal", true);
				});
			}
		}
	});
});
define("shri-2018/controllers/edit", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		timeScale: Ember.inject.service("time-scale"),
		gqlAPI: Ember.inject.service("gql-api"),
		validatorEvent: Ember.inject.service("validator-event"),
		queryParams: ["eventId"],
		eventId: null,
		showModalUpdate: false,
		showModalRemove: false,

		callBackModalUpdate: function callBackModalUpdate() {
			var self = this;
			self.transitionToRoute("/");
		},
		callBackModalRemove: function callBackModalRemove() {
			var _this = this;

			this.get("gqlAPI").removeEvent({ eventId: this.get("model.event.id") }).then(function () {
				return _this.transitionToRoute("/");
			});
		},

		actions: {
			removeEvent: function removeEvent() {
				var modalButtons = [{
					name: "Отмена",
					class: "button button-gray"
				}, {
					name: "Удалить",
					class: "button button-gray",
					callBack: this.callBackModalRemove.bind(this)
				}];
				this.set("modalButtonsRemove", modalButtons);
				this.set("showModalRemove", true);
			},
			updateEvent: function updateEvent() {
				var _this2 = this;

				if (!this.get("validatorEvent").valid(this.get("model"))) {
					return false;
				}
				var timeStart = {
					hour: this.get("model.event.timeStart").split(":")[0],
					minute: this.get("model.event.timeStart").split(":")[1]
				};
				var timeEnd = {
					hour: this.get("model.event.timeEnd").split(":")[0],
					minute: this.get("model.event.timeEnd").split(":")[1]
				};
				var params = {
					eventId: this.get("model.event.id"),
					eventInput: {
						title: this.get("model.event.title"),
						dateStart: (0, _moment.default)(this.get("model.event.date")).hour(timeStart.hour).minute(timeStart.minute).format("YYYY-MM-DDTHH:mm"),
						dateEnd: (0, _moment.default)(this.get("model.event.date")).hour(timeEnd.hour).minute(timeEnd.minute).format("YYYY-MM-DDTHH:mm")
					},
					oldDate: (0, _moment.default)(this.get("model.event.oldDate"))
				};

				var roomId = this.get("model.event.room.id");
				var usersIds = this.get("model.event.users").map(function (user) {
					return user.id;
				});

				this.get("gqlAPI").updateEvent(params).then(function (event) {
					var promises = [];
					event.users.forEach(function (user) {
						var positionDuplicat = usersIds.indexOf(user.id);
						if (positionDuplicat >= 0) {
							usersIds.splice(positionDuplicat, 1);
						} else {
							promises.push(_this2.get("gqlAPI").removeUserFromEvent({ id: event.id, userId: user.id }));
						}
					});
					if (usersIds.length) {
						usersIds.forEach(function (id) {
							return promises.push(_this2.get("gqlAPI").addUserToEvent({ id: event.id, userId: id }));
						});
					}
					var modalButtons = [{
						name: "Хорошо",
						class: "button button-blue",
						callBack: _this2.callBackModalUpdate.bind(_this2)
					}];
					Promise.all(promises).then(function () {
						if (roomId !== event.room.id) {
							_this2.get("gqlAPI").changeEventRoom({ id: event.id, roomId: roomId }).then(function (event) {
								_this2.set("newEvent", event);
								_this2.set("modalButtons", modalButtons);
								_this2.set("showModalUpdate", true);
							});
						} else {
							_this2.get("gqlAPI").getEventById(params).then(function (event) {
								_this2.set("newEvent", event);
								_this2.set("modalButtons", modalButtons);
								_this2.set("showModalUpdate", true);
							});
						}
					});
				});
			}
		}
	});
});
define("shri-2018/controllers/index", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var SCROLL_CONTAINER = "scrollable-mobile";
	var SCROLL_CLASS = "scrollable-element";

	exports.default = Ember.Controller.extend({
		init: function init() {
			this._super.apply(this, arguments);
			this.selectDate = (0, _moment.default)();
			this.mobileSwipe = false;
		},

		actions: {
			setSelectDate: function setSelectDate(date) {
				var _this = this;

				return new Promise(function (resolve) {
					resolve(_this.set("selectDate", (0, _moment.default)(date)));
				});
			},
			getSelectDate: function getSelectDate() {
				if (!this.get("selectDate")) {
					this.set("selectDate", (0, _moment.default)());
				}

				return this.get("selectDate");
			},
			initTouchStart: function initTouchStart(event) {
				this.set('touchX', event.changedTouches[0].pageX);
				this.set('touchY', event.changedTouches[0].pageY);
			},
			initTouchMove: function initTouchMove(event) {

				if (document.getElementsByClassName(SCROLL_CLASS)) {
					this.set('leftTitle', Ember.String.htmlSafe("left:" + document.getElementById(SCROLL_CONTAINER).scrollLeft + "px"));
				}
				this.set('delta', this.get('touchX') - event.changedTouches[0].pageX);
				return true;
			},
			initTouchEnd: function initTouchEnd(event) {

				var swipeTo = '';
				if (this.get('delta') < -100) {
					swipeTo = 'left';
				} else if (this.get('delta') > 100) {
					swipeTo = 'right';
				}
				if (swipeTo === 'left') {
					var scrollElement = document.getElementById(SCROLL_CONTAINER);
					// if(!scrollElement.scrollLeft && scrollElement.classList.contains(SCROLL_CLASS)){
					// 	scrollElement.classList.remove(SCROLL_CLASS);
					// 	this.set('mobileSwipe', false);
					// }
					!scrollElement.scrollLeft && this.set('mobileSwipe', false);
				}

				if (swipeTo === 'right') {
					var _scrollElement = document.getElementById(SCROLL_CONTAINER);
					// if(!scrollElement.classList.contains(SCROLL_CLASS)){
					// 	scrollElement.classList.add(SCROLL_CLASS);
					// 	this.set('mobileSwipe', true);
					// }
					this.set('mobileSwipe', true);
				}
				return true;
			}
		}

	});
});
define("shri-2018/gql/mutations/addUserToEvent", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "addUserToEvent"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "id"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "userId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "addUserToEvent"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "id"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "userId"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "userId"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 296
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/mutations/changeEventRoom", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "changeEventRoom"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "id"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "roomId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "changeEventRoom"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "id"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "roomId"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "roomId"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 298
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/mutations/createEvent", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "createEvent"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "eventInput"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "EventInput"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "usersIds"
          }
        },
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "roomId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "createEvent"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "input"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "eventInput"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "usersIds"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "usersIds"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "roomId"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "roomId"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 353
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/mutations/removeEvent", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "removeEvent"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "eventId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "removeEvent"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "eventId"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 99
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/mutations/removeUserFromEvent", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "removeUserFromEvent"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "id"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "userId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "removeUserFromEvent"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "id"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "userId"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "userId"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 306
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/mutations/updateEvent", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": {
        "kind": "Name",
        "value": "updateEvent"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "eventId"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "input"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "EventInput"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "updateEvent"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "eventId"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "input"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "input"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 305
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/event", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "event"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "id"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "event"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "id"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 244
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/events", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "events"
      },
      "variableDefinitions": [],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "events"
          },
          "arguments": [],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 227
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/eventsRangDate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "eventsRangDate"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "dateStart"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Date"
            }
          }
        },
        "defaultValue": null
      }, {
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "dateEnd"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Date"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "eventsRangDate"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "dateStart"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "dateStart"
              }
            }
          }, {
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "dateEnd"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateStart"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "dateEnd"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "users"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "login"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "homeFloor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "avatarUrl"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "room"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": {
                "kind": "SelectionSet",
                "selections": [{
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "id"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "title"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "capacity"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }, {
                  "kind": "Field",
                  "alias": null,
                  "name": {
                    "kind": "Name",
                    "value": "floor"
                  },
                  "arguments": [],
                  "directives": [],
                  "selectionSet": null
                }]
              }
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 321
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/room", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "room"
      },
      "variableDefinitions": [{
        "kind": "VariableDefinition",
        "variable": {
          "kind": "Variable",
          "name": {
            "kind": "Name",
            "value": "id"
          }
        },
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          }
        },
        "defaultValue": null
      }],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "room"
          },
          "arguments": [{
            "kind": "Argument",
            "name": {
              "kind": "Name",
              "value": "id"
            },
            "value": {
              "kind": "Variable",
              "name": {
                "kind": "Name",
                "value": "id"
              }
            }
          }],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "floor"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "capacity"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 93
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/rooms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "rooms"
      },
      "variableDefinitions": [],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "rooms"
          },
          "arguments": [],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "title"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "capacity"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "floor"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 76
    }
  };
  exports.default = doc;
});
define("shri-2018/gql/queries/users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var doc = {
    "kind": "Document",
    "definitions": [{
      "kind": "OperationDefinition",
      "operation": "query",
      "name": {
        "kind": "Name",
        "value": "users"
      },
      "variableDefinitions": [],
      "directives": [],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [{
          "kind": "Field",
          "alias": null,
          "name": {
            "kind": "Name",
            "value": "users"
          },
          "arguments": [],
          "directives": [],
          "selectionSet": {
            "kind": "SelectionSet",
            "selections": [{
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "login"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "avatarUrl"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }, {
              "kind": "Field",
              "alias": null,
              "name": {
                "kind": "Name",
                "value": "homeFloor"
              },
              "arguments": [],
              "directives": [],
              "selectionSet": null
            }]
          }
        }]
      }
    }],
    "loc": {
      "start": 0,
      "end": 81
    }
  };
  exports.default = doc;
});
define('shri-2018/helpers/and', ['exports', 'ember-truth-helpers/helpers/and'], function (exports, _and) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _and.default;
    }
  });
  Object.defineProperty(exports, 'and', {
    enumerable: true,
    get: function () {
      return _and.and;
    }
  });
});
define("shri-2018/helpers/app-pluralize", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.appPluralize = appPluralize;

	var _slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

	var temlatesPlural = {
		"участник": ["участник", "участника", "участников"],
		"человек": ["человек", "человека", "человек"]
	};

	function appPluralize(_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    count = _ref2[0],
		    key = _ref2[1];

		var countString = count.toString();
		var countLength = countString.length;
		var temlateLength = temlatesPlural[key].length;
		var resultCount = count + " ";

		if (countString[countLength - 2] === "1") {
			return resultCount + temlatesPlural[key][temlateLength - 1];
		} else if (countString[countLength - 1] === "2" || countString[countLength - 1] === "3" || countString[countLength - 1] === "4") {
			return resultCount + temlatesPlural[key][temlateLength - 2];
		} else if (countString[countLength - 1] === "1") {
			return resultCount + temlatesPlural[key][0];
		} else {
			return resultCount + temlatesPlural[key][temlateLength - 1];
		}
	}

	exports.default = Ember.Helper.helper(appPluralize);
});
define('shri-2018/helpers/app-version', ['exports', 'shri-2018/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('shri-2018/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _append) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _append.default;
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function () {
      return _append.append;
    }
  });
});
define('shri-2018/helpers/array', ['exports', 'ember-composable-helpers/helpers/array'], function (exports, _array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _array.default;
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function () {
      return _array.array;
    }
  });
});
define('shri-2018/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _chunk) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _chunk.default;
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function () {
      return _chunk.chunk;
    }
  });
});
define('shri-2018/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _compact) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _compact.default;
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function () {
      return _compact.compact;
    }
  });
});
define('shri-2018/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _compute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _compute.default;
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function () {
      return _compute.compute;
    }
  });
});
define('shri-2018/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _contains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _contains.default;
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function () {
      return _contains.contains;
    }
  });
});
define('shri-2018/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _dec) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _dec.default;
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function () {
      return _dec.dec;
    }
  });
});
define('shri-2018/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _drop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _drop.default;
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function () {
      return _drop.drop;
    }
  });
});
define('shri-2018/helpers/eq', ['exports', 'ember-truth-helpers/helpers/equal'], function (exports, _equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _equal.default;
    }
  });
  Object.defineProperty(exports, 'equal', {
    enumerable: true,
    get: function () {
      return _equal.equal;
    }
  });
});
define('shri-2018/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _filterBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _filterBy.default;
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function () {
      return _filterBy.filterBy;
    }
  });
});
define('shri-2018/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _filter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _filter.default;
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function () {
      return _filter.filter;
    }
  });
});
define('shri-2018/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _findBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _findBy.default;
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function () {
      return _findBy.findBy;
    }
  });
});
define('shri-2018/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _flatten) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _flatten.default;
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function () {
      return _flatten.flatten;
    }
  });
});
define('shri-2018/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _groupBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _groupBy.default;
    }
  });
  Object.defineProperty(exports, 'groupBy', {
    enumerable: true,
    get: function () {
      return _groupBy.groupBy;
    }
  });
});
define('shri-2018/helpers/gt', ['exports', 'ember-truth-helpers/helpers/gt'], function (exports, _gt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _gt.default;
    }
  });
  Object.defineProperty(exports, 'gt', {
    enumerable: true,
    get: function () {
      return _gt.gt;
    }
  });
});
define('shri-2018/helpers/gte', ['exports', 'ember-truth-helpers/helpers/gte'], function (exports, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _gte.default;
    }
  });
  Object.defineProperty(exports, 'gte', {
    enumerable: true,
    get: function () {
      return _gte.gte;
    }
  });
});
define('shri-2018/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _hasNext) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hasNext.default;
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function () {
      return _hasNext.hasNext;
    }
  });
});
define('shri-2018/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _hasPrevious) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hasPrevious.default;
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function () {
      return _hasPrevious.hasPrevious;
    }
  });
});
define('shri-2018/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _inc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _inc.default;
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function () {
      return _inc.inc;
    }
  });
});
define('shri-2018/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _intersect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _intersect.default;
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function () {
      return _intersect.intersect;
    }
  });
});
define('shri-2018/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _invoke) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _invoke.default;
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function () {
      return _invoke.invoke;
    }
  });
});
define('shri-2018/helpers/is-after', ['exports', 'ember-moment/helpers/is-after'], function (exports, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isAfter.default;
    }
  });
});
define('shri-2018/helpers/is-array', ['exports', 'ember-truth-helpers/helpers/is-array'], function (exports, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isArray.default;
    }
  });
  Object.defineProperty(exports, 'isArray', {
    enumerable: true,
    get: function () {
      return _isArray.isArray;
    }
  });
});
define('shri-2018/helpers/is-before', ['exports', 'ember-moment/helpers/is-before'], function (exports, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBefore.default;
    }
  });
});
define('shri-2018/helpers/is-between', ['exports', 'ember-moment/helpers/is-between'], function (exports, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBetween.default;
    }
  });
});
define('shri-2018/helpers/is-empty', ['exports', 'ember-truth-helpers/helpers/is-empty'], function (exports, _isEmpty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEmpty.default;
    }
  });
});
define('shri-2018/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
define('shri-2018/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});
define('shri-2018/helpers/is-same-or-before', ['exports', 'ember-moment/helpers/is-same-or-before'], function (exports, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrBefore.default;
    }
  });
});
define('shri-2018/helpers/is-same', ['exports', 'ember-moment/helpers/is-same'], function (exports, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSame.default;
    }
  });
});
define('shri-2018/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _join) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _join.default;
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function () {
      return _join.join;
    }
  });
});
define('shri-2018/helpers/lt', ['exports', 'ember-truth-helpers/helpers/lt'], function (exports, _lt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _lt.default;
    }
  });
  Object.defineProperty(exports, 'lt', {
    enumerable: true,
    get: function () {
      return _lt.lt;
    }
  });
});
define('shri-2018/helpers/lte', ['exports', 'ember-truth-helpers/helpers/lte'], function (exports, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _lte.default;
    }
  });
  Object.defineProperty(exports, 'lte', {
    enumerable: true,
    get: function () {
      return _lte.lte;
    }
  });
});
define('shri-2018/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _mapBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mapBy.default;
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function () {
      return _mapBy.mapBy;
    }
  });
});
define('shri-2018/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _map) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _map.default;
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function () {
      return _map.map;
    }
  });
});
define('shri-2018/helpers/moment-add', ['exports', 'ember-moment/helpers/moment-add'], function (exports, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentAdd.default;
    }
  });
});
define('shri-2018/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentCalendar.default;
    }
  });
});
define('shri-2018/helpers/moment-diff', ['exports', 'ember-moment/helpers/moment-diff'], function (exports, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDiff.default;
    }
  });
});
define('shri-2018/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
define('shri-2018/helpers/moment-format', ['exports', 'ember-moment/helpers/moment-format'], function (exports, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFormat.default;
    }
  });
});
define('shri-2018/helpers/moment-from-now', ['exports', 'ember-moment/helpers/moment-from-now'], function (exports, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFromNow.default;
    }
  });
});
define('shri-2018/helpers/moment-from', ['exports', 'ember-moment/helpers/moment-from'], function (exports, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFrom.default;
    }
  });
});
define('shri-2018/helpers/moment-subtract', ['exports', 'ember-moment/helpers/moment-subtract'], function (exports, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentSubtract.default;
    }
  });
});
define('shri-2018/helpers/moment-to-date', ['exports', 'ember-moment/helpers/moment-to-date'], function (exports, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToDate.default;
    }
  });
});
define('shri-2018/helpers/moment-to-now', ['exports', 'ember-moment/helpers/moment-to-now'], function (exports, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToNow.default;
    }
  });
});
define('shri-2018/helpers/moment-to', ['exports', 'ember-moment/helpers/moment-to'], function (exports, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentTo.default;
    }
  });
});
define('shri-2018/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
define('shri-2018/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
define('shri-2018/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _next) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _next.default;
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function () {
      return _next.next;
    }
  });
});
define('shri-2018/helpers/not-eq', ['exports', 'ember-truth-helpers/helpers/not-equal'], function (exports, _notEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _notEqual.default;
    }
  });
  Object.defineProperty(exports, 'notEq', {
    enumerable: true,
    get: function () {
      return _notEqual.notEq;
    }
  });
});
define('shri-2018/helpers/not', ['exports', 'ember-truth-helpers/helpers/not'], function (exports, _not) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _not.default;
    }
  });
  Object.defineProperty(exports, 'not', {
    enumerable: true,
    get: function () {
      return _not.not;
    }
  });
});
define('shri-2018/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
define('shri-2018/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _objectAt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _objectAt.default;
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function () {
      return _objectAt.objectAt;
    }
  });
});
define('shri-2018/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _optional) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _optional.default;
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function () {
      return _optional.optional;
    }
  });
});
define('shri-2018/helpers/or', ['exports', 'ember-truth-helpers/helpers/or'], function (exports, _or) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _or.default;
    }
  });
  Object.defineProperty(exports, 'or', {
    enumerable: true,
    get: function () {
      return _or.or;
    }
  });
});
define('shri-2018/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _pipeAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pipeAction.default;
    }
  });
});
define('shri-2018/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _pipe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pipe.default;
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function () {
      return _pipe.pipe;
    }
  });
});
define('shri-2018/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('shri-2018/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _previous) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _previous.default;
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function () {
      return _previous.previous;
    }
  });
});
define('shri-2018/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _queue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _queue.default;
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function () {
      return _queue.queue;
    }
  });
});
define('shri-2018/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _range) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _range.default;
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function () {
      return _range.range;
    }
  });
});
define('shri-2018/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _reduce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _reduce.default;
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function () {
      return _reduce.reduce;
    }
  });
});
define('shri-2018/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _rejectBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _rejectBy.default;
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function () {
      return _rejectBy.rejectBy;
    }
  });
});
define('shri-2018/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _repeat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _repeat.default;
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function () {
      return _repeat.repeat;
    }
  });
});
define('shri-2018/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _reverse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _reverse.default;
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function () {
      return _reverse.reverse;
    }
  });
});
define('shri-2018/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _shuffle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _shuffle.default;
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function () {
      return _shuffle.shuffle;
    }
  });
});
define('shri-2018/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('shri-2018/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _slice) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _slice.default;
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function () {
      return _slice.slice;
    }
  });
});
define('shri-2018/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _sortBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sortBy.default;
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function () {
      return _sortBy.sortBy;
    }
  });
});
define('shri-2018/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _take) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _take.default;
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function () {
      return _take.take;
    }
  });
});
define('shri-2018/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _toggleAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggleAction.default;
    }
  });
});
define('shri-2018/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _toggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function () {
      return _toggle.toggle;
    }
  });
});
define('shri-2018/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _union) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _union.default;
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function () {
      return _union.union;
    }
  });
});
define('shri-2018/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
define('shri-2018/helpers/utc', ['exports', 'ember-moment/helpers/utc'], function (exports, _utc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _utc.default;
    }
  });
  Object.defineProperty(exports, 'utc', {
    enumerable: true,
    get: function () {
      return _utc.utc;
    }
  });
});
define('shri-2018/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _without) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _without.default;
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function () {
      return _without.without;
    }
  });
});
define('shri-2018/helpers/xor', ['exports', 'ember-truth-helpers/helpers/xor'], function (exports, _xor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _xor.default;
    }
  });
  Object.defineProperty(exports, 'xor', {
    enumerable: true,
    get: function () {
      return _xor.xor;
    }
  });
});
define('shri-2018/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'shri-2018/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('shri-2018/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('shri-2018/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('shri-2018/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('shri-2018/initializers/export-application-global', ['exports', 'shri-2018/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('shri-2018/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('shri-2018/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('shri-2018/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("shri-2018/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('shri-2018/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('shri-2018/router', ['exports', 'shri-2018/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var Router = Ember.Router.extend({
		location: _environment.default.locationType,
		rootURL: _environment.default.rootURL
	});

	Router.map(function () {
		this.route('create');
		this.route('edit');
	});

	exports.default = Router;
});
define("shri-2018/routes/application", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		moment: Ember.inject.service(),
		beforeModel: function beforeModel() {
			this.get("moment").setLocale("ru");
		}
	});
});
define("shri-2018/routes/create", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		gqlAPI: Ember.inject.service("gql-api"),
		model: function model(params) {
			var eventModel = {
				title: "",
				users: [],
				date: (0, _moment.default)(+params.date),
				timeStart: params.timeStart ? params.timeStart : "",
				timeEnd: params.timeEnd ? params.timeEnd : "",
				room: ""
			};
			var validator = {
				validTitle: true,
				validUsers: true,
				validRoom: true,
				validDate: true,
				validTimeStart: true,
				validTimeEnd: true
			};
			return Ember.RSVP.hash({
				event: params.roomId ? this.get("gqlAPI").getRoom({ id: params.roomId }).then(function (room) {
					eventModel.room = room;
					return eventModel;
				}) : eventModel,
				validator: validator,
				allUsers: this.get("gqlAPI").getUsers()
			});
		}
	});
});
define("shri-2018/routes/edit", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		gqlAPI: Ember.inject.service("gql-api"),
		model: function model(params) {
			var eventModel = {
				id: "",
				title: "",
				users: [],
				date: "",
				timeStart: "",
				timeEnd: "",
				room: "",
				oldDate: ""
			};
			var validator = {
				validTitle: true,
				validUsers: true,
				validRoom: true,
				validDate: true,
				validTimeStart: true,
				validTimeEnd: true
			};
			return Ember.RSVP.hash({
				event: this.get("gqlAPI").getEventById({ eventId: params.eventId }).then(function (event) {
					eventModel.id = event.id;
					eventModel.title = event.title;
					eventModel.users = event.users;
					eventModel.room = event.room;
					eventModel.date = (0, _moment.default)(event.dateStart);
					eventModel.oldDate = (0, _moment.default)(event.dateStart);
					eventModel.timeStart = (0, _moment.default)(event.dateStart).hour() + ":" + (0, _moment.default)(event.dateStart).minute();
					eventModel.timeEnd = (0, _moment.default)(event.dateEnd).hour() + ":" + (0, _moment.default)(event.dateEnd).minute();
					return eventModel;
				}),
				validator: validator,
				allUsers: this.get("gqlAPI").getUsers()
			});
		}
	});
});
define("shri-2018/routes/index", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		gqlAPI: Ember.inject.service("gql-api"),
		model: function model() {
			return Ember.RSVP.hash({
				rooms: this.get("gqlAPI").getRooms()
			});
		}
	});
});
define("shri-2018/serializers/application", ["exports", "ember-data"], function (exports, _emberData) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.JSONAPISerializer.extend({});
});
define('shri-2018/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('shri-2018/services/apollo', ['exports', 'ember-apollo-client/services/apollo'], function (exports, _apollo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _apollo.default;
    }
  });
});
define("shri-2018/services/get-recomendation-rooms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  exports.default = Ember.Service.extend({
    gqlAPI: Ember.inject.service('gql-api'),
    timeScale: Ember.inject.service("time-scale"),

    getRooms: function getRooms(dateStart, dateEnd, users, eventId) {
      var _this = this;

      var promises = [];
      var allRoomsPromise = this.get('gqlAPI').getRoomsFromRecomendation({ capacity: users.length });
      var eventsInSelectTime = this.get('gqlAPI').getEventsRangDate({ dateStart: moment(dateStart), dateEnd: moment(dateEnd) });
      var allEvents = this.get('gqlAPI').getEventsRangDate({ dateStart: moment(dateStart).hour(this.get("timeScale").getSatrtValue()).minute(0),
        dateEnd: moment(dateStart).hour(this.get("timeScale").getEndValue()).minute(0),
        eventId: eventId });

      return Promise.all([allRoomsPromise, eventsInSelectTime, allEvents]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            rooms = _ref2[0],
            eventsRange = _ref2[1],
            events = _ref2[2];

        var result = [];
        var filterEvents = void 0;

        rooms.forEach(function (room) {
          room.events = events[room.id];
        });
        var floorRecomendation = 0;
        users.forEach(function (user) {
          return floorRecomendation += user.homeFloor;
        });
        floorRecomendation = Math.floor(floorRecomendation / users.length);

        rooms.forEach(function (room) {
          room.floorPriority = room.floor >= floorRecomendation ? room.floor - floorRecomendation : floorRecomendation - room.floor;
          if (!room.events || !room.events.length) {
            _this.setTime(room, dateStart, dateEnd);
            result.push(room);
          } else if (room.events.length) {
            var isBusy = room.events.filter(function (event) {
              return moment(dateStart).isSame(moment(event.dateStart), "minutes") || moment(dateEnd).isSame(moment(event.dateEnd), "minutes") || moment(dateStart).isAfter(moment(event.dateStart)) && moment(dateStart).isBefore(moment(event.dateEnd)) || moment(dateEnd).isAfter(moment(event.dateStart)) && moment(dateEnd).isBefore(moment(event.dateEnd)) || moment(dateStart).isBefore(moment(event.dateStart)) && moment(dateEnd).isAfter(moment(event.dateEnd));
            });
            if (!isBusy.length) {
              _this.setTime(room, dateStart, dateEnd);
              result.push(room);
            }
          }
        });
        return result.sortBy("floorPriority");
      });
    },
    setTime: function setTime(room, dateStart, dateEnd) {
      room.timeStart = this.getTime(moment(dateStart).hour() + ":" + moment(dateStart).minute());
      room.timeEnd = this.getTime(moment(dateEnd).hour() + ":" + moment(dateEnd).minute());
    },
    mapRooms: function mapRooms(rooms) {
      var result = {};
      rooms.forEach(function (item) {
        if (!result[item.floor]) {
          result[item.floor] = [];
        }
        result[item.floor].push(item);
      });
      return result;
    },
    getTime: function getTime(time) {
      if (!time) {
        return "";
      }
      var parts = time.split(":");
      parts[1] = +parts[1] >= 10 ? parts[1] : "0" + parts[1];
      parts[0] = +parts[0] >= 10 ? parts[0] : "0" + parts[0];

      return parts[0] + ":" + parts[1];
    }
  });
});
define("shri-2018/services/gql-api", ["exports", "moment", "ember-apollo-client/mixins/object-query-manager", "shri-2018/gql/queries/rooms", "shri-2018/gql/queries/room", "shri-2018/gql/queries/users", "shri-2018/gql/queries/event", "shri-2018/gql/queries/events", "shri-2018/gql/queries/eventsRangDate", "shri-2018/gql/mutations/createEvent", "shri-2018/gql/mutations/updateEvent", "shri-2018/gql/mutations/addUserToEvent", "shri-2018/gql/mutations/removeUserFromEvent", "shri-2018/gql/mutations/changeEventRoom", "shri-2018/gql/mutations/removeEvent"], function (exports, _moment, _objectQueryManager, _rooms, _room, _users, _event, _events, _eventsRangDate, _createEvent2, _updateEvent2, _addUserToEvent2, _removeUserFromEvent2, _changeEventRoom2, _removeEvent2) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Service.extend(_objectQueryManager.default, {

		// rooms queries
		getRooms: function getRooms() {
			var _this = this;

			return this.apollo.query({ query: _rooms.default }, "rooms").then(function (rooms) {
				return _this.mapRooms(rooms);
			});
		},
		getRoomsFromRecomendation: function getRoomsFromRecomendation(params) {
			return this.apollo.query({ query: _rooms.default }, "rooms").then(function (rooms) {
				return rooms.filter(function (room) {
					return room.capacity >= params.capacity;
				});
			});
		},
		getRoom: function getRoom(params) {
			var variables = {
				id: params.id
			};
			return this.apollo.query({ query: _room.default, variables: variables }, "room");
		},
		mapRooms: function mapRooms(rooms) {
			var result = {};
			rooms.forEach(function (item) {
				if (!result[item.floor]) {
					result[item.floor] = [];
				}
				result[item.floor].push(item);
			});
			return result;
		},


		// events queries

		getEventById: function getEventById(params) {
			var variables = {
				id: params.eventId
			};
			return this.apollo.watchQuery({ query: _event.default, variables: variables }, "event");
		},
		getEvents: function getEvents() {
			return this.apollo.watchQuery({ query: _events.default }, _events.default);
		},
		getEventsRangDate: function getEventsRangDate(params) {
			var _this2 = this;

			var variables = {
				dateStart: (0, _moment.default)(params.dateStart).format("YYYY-MM-DDTHH:mm"),
				dateEnd: (0, _moment.default)(params.dateEnd).format("YYYY-MM-DDTHH:mm")
			};
			return this.apollo.watchQuery({ query: _eventsRangDate.default, variables: variables }, "eventsRangDate").then(function (events) {
				return _this2.eventsRangDateMap(events, params.eventId);
			});
		},
		eventsRangDateMap: function eventsRangDateMap(events, eventId) {
			var result = {};
			events.forEach(function (event) {
				if (!result[event.room.id]) {
					result[event.room.id] = [];
				}
				if (!eventId || event.id !== eventId) {
					event.countUsers = event.users.length - 1;
					event.isFree = false;
					event.timeStart = {
						hour: (0, _moment.default)(event.dateStart).hour(),
						minute: (0, _moment.default)(event.dateStart).minute()
					};
					event.timeEnd = {
						hour: (0, _moment.default)(event.dateEnd).hour(),
						minute: (0, _moment.default)(event.dateEnd).minute()
					};
					var widthCell = (0, _moment.default)(event.dateEnd).diff(event.dateStart, "minutes");
					event.widthCell = widthCell;
					result[event.room.id].push(event);
				}
			});
			return result;
		},


		// event mutations

		createEvent: function createEvent(params) {
			var variables = {
				eventInput: params.eventInput,
				usersIds: params.usersIds,
				roomId: params.roomId
			};
			return this.apollo.mutate({
				mutation: _createEvent2.default,
				variables: variables,
				update: function update(store, _ref) {
					var createEvent = _ref.data.createEvent;

					try {
						var _variables = {
							dateStart: (0, _moment.default)(createEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(createEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables });

						data.eventsRangDate.addObject(createEvent);

						store.writeQuery({ query: _eventsRangDate.default, variables: _variables, data: data });
					} catch (e) {
						console.log("Not need observable query");
					}
				}
			}, "createEvent");
		},
		removeEvent: function removeEvent(params) {
			var variables = {
				eventId: params.eventId
			};
			return this.apollo.mutate({
				mutation: _removeEvent2.default,
				variables: variables,
				update: function update(store, _ref2) {
					var removeEvent = _ref2.data.removeEvent;

					try {
						var _variables2 = {
							dateStart: (0, _moment.default)(removeEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(removeEvent.dateStart).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables2 });

						if (data && data.eventsRangDate && data.eventsRangDate) {
							data.eventsRangDate = data.eventsRangDate.filter(function (item) {
								return item.id !== removeEvent.id;
							});
							store.writeQuery({ query: _eventsRangDate.default, variables: _variables2, data: data });
						}
					} catch (e) {
						console.log("Not need observable query");
					}
				}
			}, "createEvent");
		},
		updateEvent: function updateEvent(params) {
			var variables = {
				input: params.eventInput,
				eventId: params.eventId
			};
			var oldDate = params.oldDate;
			return this.apollo.mutate({
				mutation: _updateEvent2.default,
				variables: variables,
				update: function update(store, _ref3) {
					var updateEvent = _ref3.data.updateEvent;

					try {
						var _variables3 = {
							dateStart: (0, _moment.default)(updateEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(updateEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables3 });
						var element = data.eventsRangDate.findBy("id", updateEvent.id);
						if (data && data.eventsRangDate && data.eventsRangDate.length && element) {
							element.title = updateEvent.title;
							element.dateStart = (0, _moment.default)(updateEvent.dateStart).format("YYYY-MM-DDTHH:mm");
							element.dateEnd = (0, _moment.default)(updateEvent.dateEnd).format("YYYY-MM-DDTHH:mm");
							store.writeQuery({ query: _eventsRangDate.default, variables: _variables3, data: data });
						} else if (data && data.eventsRangDate) {
							data.eventsRangDate.addObject(updateEvent);
							store.writeQuery({ query: _eventsRangDate.default, variables: _variables3, data: data });
						}
						if (!(0, _moment.default)(oldDate).isSame((0, _moment.default)(updateEvent.dateStart), "day")) {
							var _variables4 = {
								dateStart: (0, _moment.default)(oldDate).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
								dateEnd: (0, _moment.default)(oldDate).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
							};
							var _data = store.readQuery({ query: _eventsRangDate.default, variables: _variables4 });
							_data.eventsRangDate = _data.eventsRangDate.filter(function (item) {
								return item.id !== updateEvent.id;
							});
							store.writeQuery({ query: _eventsRangDate.default, variables: _variables4, data: _data });
						}
					} catch (e) {
						if (!(0, _moment.default)(oldDate).isSame((0, _moment.default)(updateEvent.dateStart), "day")) {
							var _variables5 = {
								dateStart: (0, _moment.default)(oldDate).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
								dateEnd: (0, _moment.default)(oldDate).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
							};
							var _data2 = store.readQuery({ query: _eventsRangDate.default, variables: _variables5 });
							_data2.eventsRangDate = _data2.eventsRangDate.filter(function (item) {
								return item.id !== updateEvent.id;
							});
							store.writeQuery({ query: _eventsRangDate.default, variables: _variables5, data: _data2 });
						}
					}
				}
			}, "updateEvent");
		},
		changeEventRoom: function changeEventRoom(params) {
			var variables = {
				id: params.id,
				roomId: params.roomId
			};
			return this.apollo.mutate({
				mutation: _changeEventRoom2.default,
				variables: variables,
				update: function update(store, _ref4) {
					var changeEventRoom = _ref4.data.changeEventRoom;

					try {
						var _variables6 = {
							dateStart: (0, _moment.default)(changeEventRoom.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(changeEventRoom.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables6 });

						data.eventsRangDate.findBy("id", changeEventRoom.id).room = changeEventRoom.room;

						store.writeQuery({ query: _eventsRangDate.default, variables: _variables6, data: data });
					} catch (e) {
						console.log("Not need observable query");
					}
				}
			}, "changeEventRoom");
		},
		removeUserFromEvent: function removeUserFromEvent(params) {
			var variables = {
				id: params.id,
				userId: params.userId
			};
			return this.apollo.mutate({
				mutation: _removeUserFromEvent2.default,
				variables: variables,
				update: function update(store, _ref5) {
					var removeUserFromEvent = _ref5.data.removeUserFromEvent;

					try {
						var _variables7 = {
							dateStart: (0, _moment.default)(removeUserFromEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(removeUserFromEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables7 });

						data.eventsRangDate.findBy("id", removeUserFromEvent.id).users = removeUserFromEvent.users;

						store.writeQuery({ query: _eventsRangDate.default, variables: _variables7, data: data });
					} catch (e) {
						console.log("Not need observable query");
					}
				}
			}, "removeUserFromEvent");
		},
		addUserToEvent: function addUserToEvent(params) {
			var variables = {
				id: params.id,
				userId: params.userId
			};
			return this.apollo.mutate({
				mutation: _addUserToEvent2.default,
				variables: variables,
				update: function update(store, _ref6) {
					var addUserToEvent = _ref6.data.addUserToEvent;

					try {
						var _variables8 = {
							dateStart: (0, _moment.default)(addUserToEvent.dateStart).hour(8).minute(0).format("YYYY-MM-DDTHH:mm"),
							dateEnd: (0, _moment.default)(addUserToEvent.dateEnd).hour(23).minute(0).format("YYYY-MM-DDTHH:mm")
						};
						var data = store.readQuery({ query: _eventsRangDate.default, variables: _variables8 });

						data.eventsRangDate.findBy("id", addUserToEvent.id).users = addUserToEvent.users;

						store.writeQuery({ query: _eventsRangDate.default, variables: _variables8, data: data });
					} catch (e) {
						console.log("Not need observable query");
					}
				}
			}, "addUserToEvent");
		},


		// users queries
		getUsers: function getUsers() {
			return this.apollo.query({ query: _users.default }, "users");
		}
	});
});
define('shri-2018/services/moment', ['exports', 'ember-moment/services/moment', 'shri-2018/config/environment'], function (exports, _moment, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _moment.default.extend({
    defaultFormat: get(_environment.default, 'moment.outputFormat')
  });
});
define("shri-2018/services/time-scale", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var START_VALUE = 8;
	var END_VALUE = 23;

	exports.default = Ember.Service.extend({
		getSatrtValue: function getSatrtValue() {
			return START_VALUE;
		},
		getEndValue: function getEndValue() {
			return END_VALUE;
		},
		getArrayTimeValue: function getArrayTimeValue() {
			if (!this.get("arrayTimeValue")) {
				var result = [];
				for (var i = START_VALUE; i <= END_VALUE; i++) {
					result.push(i);
				}
				this.set("arrayTimeValue", result);
			}
			return this.get("arrayTimeValue");
		},
		getTimeGridCells: function getTimeGridCells() {
			if (!this.get("timeGridCells")) {
				this.set("timeGridCells", END_VALUE - START_VALUE);
			}
			return this.get("timeGridCells");
		}
	});
});
define("shri-2018/services/validator-event", ["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Service.extend({
		timeScale: Ember.inject.service("time-scale"),

		valid: function valid(model) {
			Ember.set(model, "validator.validTitle", !!model.event.title);
			Ember.set(model, "validator.validUsers", !!model.event.users.length);
			Ember.set(model, "validator.validRoom", !!model.event.room);
			Ember.set(model, "validator.validDate", !!model.event.date);
			Ember.set(model, "validator.validTimeStart", !!model.event.timeStart);
			Ember.set(model, "validator.validTimeEnd", !!model.event.timeEnd);
			if (!!model.event.date && !!model.event.timeStart && !!model.event.timeEnd) {
				this.validTime(model.event.timeStart, model.event.timeEnd, model.validator);
			}

			return Ember.get(model, "validator.validTitle") && Ember.get(model, "validator.validUsers") && Ember.get(model, "validator.validRoom") && Ember.get(model, "validator.validDate") && Ember.get(model, "validator.validTimeStart") && Ember.get(model, "validator.validTimeEnd");
		},
		validTime: function validTime(timeStart, timeEnd, validator) {
			var starTimeParts = timeStart.split(":");
			var endTimeParts = timeEnd.split(":");
			if (!starTimeParts[1] || !starTimeParts[0] || starTimeParts[1].length !== 2 || starTimeParts[0].length !== 2) {
				Ember.set(validator, "validTimeStart", false);
			} else if (!endTimeParts[1] || !endTimeParts[0] || endTimeParts[1].length !== 2 || endTimeParts[0].length !== 2) {
				Ember.set(validator, "validTimeEnd", false);
			} else {
				var dateStart = (0, _moment.default)().hour(+starTimeParts[0]).minute(+starTimeParts[1]);
				var dateEnd = (0, _moment.default)().hour(+endTimeParts[0]).minute(+endTimeParts[1]);
				var minStartDate = (0, _moment.default)().hour(this.get("timeScale").getSatrtValue()).minute(0);
				var maxEndDate = (0, _moment.default)().hour(this.get("timeScale").getEndValue()).minute(0);
				if (+starTimeParts[0] > +endTimeParts[0]) {
					Ember.set(validator, "validTimeStart", false);
					Ember.set(validator, "validTimeEnd", false);
				} else if (dateStart.isBefore(minStartDate) || dateStart.isAfter(maxEndDate)) {
					Ember.set(validator, "validTimeStart", false);
				} else if (dateEnd.isBefore(minStartDate) || dateEnd.isAfter(maxEndDate)) {
					Ember.set(validator, "validTimeEnd", false);
				}
			}

			return validator;
		}
	});
});
define("shri-2018/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "UvRyTmeK", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"body\"],[7],[0,\"\\n    \"],[1,[18,\"outlet\"],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/application.hbs" } });
});
define("shri-2018/templates/components/app-autocomplete", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "i2PMDAN7", "block": "{\"symbols\":[\"item\"],\"statements\":[[6,\"div\"],[9,\"class\",\"app-autocomplete-root\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"items\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"app-autocomplete-item\"],[10,\"onmousedown\",[25,\"action\",[[19,0,[]],\"selectElement\",[19,1,[]]],null],null],[7],[0,\"\\n      \"],[1,[25,\"app-user-view\",null,[[\"user\",\"longView\"],[[19,1,[]],true]]],false],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-autocomplete.hbs" } });
});
define("shri-2018/templates/components/app-calendar-home", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "38yDJ3Nd", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"app-calendar\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-calendar__input\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"input-prev arrow-left\"],[3,\"action\",[[19,0,[]],\"prevDate\"]],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"input-value\"],[7],[1,[18,\"selectValueDisplay\"],false],[0,\" ⋅ \"],[1,[18,\"prefixSelectValue\"],false],[8],[0,\"\\n    \"],[1,[25,\"app-calendar-main\",null,[[\"quatityMonth\",\"setSelectDate\"],[3,[20,[\"setSelectDate\"]]]]],false],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"input-next arrow-right\"],[3,\"action\",[[19,0,[]],\"nextDate\"]],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-calendar-home.hbs" } });
});
define("shri-2018/templates/components/app-calendar-main", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "j8HKcx9e", "block": "{\"symbols\":[\"month\",\"index\",\"value\",\"value\",\"index\",\"value\",\"day\"],\"statements\":[[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"app-calendar-main__months\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-calendar-main__container\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"calendarObject\"]]],null,{\"statements\":[[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"month\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"month-name\"],[7],[0,\"\\n          \"],[1,[25,\"moment-format\",[[19,1,[\"date\"]],\"MMMM\"],null],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"month-header\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"daysWeekName\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"month-header__days-week-name\"],[7],[0,\"\\n              \"],[1,[19,7,[]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[7]},null],[0,\"      \"],[8],[0,\"\\n      \"],[6,\"div\"],[10,\"class\",[26,[\"month-days \",[25,\"if\",[[25,\"eq\",[[19,2,[]],0],null],\"now-month\"],null]]]],[7],[0,\"\\n\"],[4,\"each\",[[25,\"range\",[0,[19,1,[\"firstDayOfWeek\"]]],null]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"month-days__value empty\"],[7],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[4,\"each\",[[25,\"range\",[1,[19,1,[\"lengthMonth\"]]],null]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[10,\"class\",[26,[\"month-days__value \",[25,\"if\",[[25,\"eq\",[[19,4,[]],[19,1,[\"nowDate\"]]],null],\"now-day\"],null]]]],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"activeDate\"],null],null],[3,\"action\",[[19,0,[]],\"selectDateInCalendar\",[19,4,[]],[19,1,[\"date\"]]]],[7],[0,\"\\n            \"],[1,[19,4,[]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[4,5]},null],[4,\"each\",[[25,\"range\",[[19,1,[\"lastDayOfWeek\"]],[20,[\"daysWeekName\",\"length\"]]],null]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"month-days__value empty\"],[7],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n\"]],\"parameters\":[1,2]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-calendar-main__close element-close\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"closeCalendar\"],null],null],[7],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-calendar-main.hbs" } });
});
define("shri-2018/templates/components/app-event-in-room", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZnvnSRuZ", "block": "{\"symbols\":[\"cell\",\"index\",\"tooltip\"],\"statements\":[[6,\"div\"],[10,\"class\",[26,[\"app-event-in-room__room-description \",[25,\"if\",[[20,[\"mobileSwipe\"]],\"app-event-in-room__room-description__mobile-swipe\"],null]]]],[10,\"style\",[18,\"leftTitle\"],null],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"room-title\"],[7],[0,\"\\n    \"],[1,[18,\"title\"],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"room-capacity\"],[7],[0,\"\\n    \"],[1,[25,\"app-pluralize\",[[20,[\"capacity\"]],\"человек\"],null],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"app-event-in-room__room-events\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"room-events-cells\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"eventsCells\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[10,\"class\",[26,[\"event-cell \",[25,\"if\",[[19,1,[\"isFree\"]],\"free-cell\",\"busy-cell\"],null]]]],[10,\"id\",[26,[[25,\"unless\",[[19,1,[\"isFree\"]],[25,\"concat\",[\"event-\",[19,1,[\"id\"]]],null]],null]]]],[10,\"style\",[19,1,[\"widthCell\"]],null],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isFree\"]]],null,{\"statements\":[[4,\"link-to\",[\"create\",[25,\"query-params\",null,[[\"timeStart\",\"timeEnd\",\"date\",\"roomId\"],[[19,1,[\"queryTimeStart\"]],[19,1,[\"queryTimeEnd\"]],[20,[\"selectDate\"]],[20,[\"roomId\"]]]]]],null,{\"statements\":[[0,\"              \"],[6,\"span\"],[10,\"onmouseEnter\",[25,\"action\",[[19,0,[]],\"mouseEnterCell\"],null],null],[10,\"onmouseLeave\",[25,\"action\",[[19,0,[]],\"mouseLeaveCell\"],null],null],[7],[0,\"+\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n\"],[4,\"unless\",[[19,1,[\"isFree\"]]],null,{\"statements\":[[4,\"tooltip-on-element\",null,[[\"event\",\"side\",\"enableLazyRendering\",\"target\",\"class\"],[\"click\",\"bottom\",false,[25,\"concat\",[\"#event-\",[19,1,[\"id\"]]],null],\"tooltip-on-element__event-in-room\"]],{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n            \"],[1,[19,1,[\"title\"]],false],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"room-and-date\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"date\"],[7],[1,[25,\"moment-format\",[[19,1,[\"dateStart\"]],\"DD MMMM, HH:mm\"],null],false],[0,\" - \"],[1,[25,\"moment-format\",[[19,1,[\"dateEnd\"]],\"HH:mm\"],null],false],[8],[6,\"span\"],[9,\"class\",\"room\"],[7],[0,\" ⋅ \"],[1,[18,\"title\"],false],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"users\"],[7],[0,\"\\n              \"],[6,\"span\"],[7],[1,[25,\"app-user-view\",null,[[\"user\"],[[19,1,[\"users\",\"firstObject\"]]]]],false],[8],[0,\"\\n              \"],[6,\"span\"],[9,\"class\",\"users-info\"],[7],[4,\"if\",[[19,1,[\"countUsers\"]]],null,{\"statements\":[[0,\"  и \"],[1,[25,\"app-pluralize\",[[19,1,[\"countUsers\"]],\"участник\"],null],false]],\"parameters\":[]},null],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"event-edit element-edit\"],[10,\"onmouseup\",[25,\"action\",[[19,0,[]],\"mouseEnterEdit\"],null],null],[10,\"onmousedown\",[25,\"action\",[[19,0,[]],\"mouseLeaveEdit\"],null],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"editEvent\",[19,1,[\"id\"]]],null],null],[7],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null]],\"parameters\":[]},null]],\"parameters\":[1,2]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-event-in-room.hbs" } });
});
define("shri-2018/templates/components/app-event", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "baSoKASy", "block": "{\"symbols\":[\"room\",\"item\",\"&default\"],\"statements\":[[6,\"div\"],[9,\"class\",\"app-event__container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-event__header\"],[7],[0,\"\\n    \"],[11,3],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-event__body\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"body-row\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"event-thema row-cell\"],[7],[0,\"\\n        \"],[6,\"label\"],[9,\"for\",\"thema\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Тема\"],[8],[8],[0,\"\\n        \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"and\",[[25,\"not\",[[20,[\"event\",\"title\"]]],null],[25,\"not\",[[20,[\"validator\",\"validTitle\"]]],null]],null],\"error-valid\"],null]]]],[7],[0,\"\\n          \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"id\",\"placeholder\"],[\"element-input \",[20,[\"event\",\"title\"]],\"thema\",\"О чем будете говорить?\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"event-date-time row-cell\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"event-date\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"date\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Дата\"],[8],[6,\"span\"],[9,\"class\",\"only-mobile\"],[7],[0,\" и время\"],[8],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"element-input\"],[9,\"id\",\"date\"],[7],[1,[25,\"moment-format\",[[20,[\"inputDate\"]],\"DD MMMM, YYYY\"],null],false],[0,\" \"],[8],[0,\"\\n          \"],[1,[25,\"app-calendar-main\",null,[[\"quatityMonth\",\"setSelectDate\"],[1,[25,\"action\",[[19,0,[]],\"selectEventDate\"],null]]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"event-time-from\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"time-from\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Начало\"],[8],[8],[0,\"\\n          \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"not\",[[20,[\"validator\",\"validTimeStart\"]]],null],\"error-valid\"],null]]]],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"id\",\"maxlength\",\"type\"],[\"element-input\",[20,[\"event\",\"timeStart\"]],\"time-from\",\"5\",\"phone\"]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"dash\"],[7],[0,\"—\"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"event-time-to\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"time-to\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Конец\"],[8],[8],[0,\"\\n          \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"not\",[[20,[\"validator\",\"validTimeEnd\"]]],null],\"error-valid\"],null]]]],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"class\",\"value\",\"id\",\"max\",\"type\"],[\"element-input\",[20,[\"event\",\"timeEnd\"]],\"time-to\",\"5\",\"phone\"]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"body-row\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"event-users row-cell\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"app-autocomplete users-input\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"users\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Участники\"],[8],[8],[0,\"\\n          \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[25,\"and\",[[25,\"not\",[[20,[\"event\",\"users\",\"length\"]]],null],[25,\"not\",[[20,[\"validator\",\"validUsers\"]]],null]],null],\"error-valid\"],null]]]],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"class\",\"id\",\"placeholder\",\"value\"],[\"element-input app-autocomplete-input\",\"\",\"Например, Тор Одинович\",[20,[\"filterValue\"]]]]],false],[0,\"\\n\\n            \"],[1,[25,\"app-autocomplete\",null,[[\"class\",\"items\",\"selectItem\"],[\"app-autocomplete-list\",[20,[\"filterUsers\"]],[25,\"action\",[[19,0,[]],\"selectUser\"],null]]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"users-select\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"inputUsers\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"select-user-item\"],[7],[0,\"\\n              \"],[1,[25,\"app-user-view\",null,[[\"user\",\"dark\",\"close\",\"closeButton\"],[[19,2,[]],true,true,[25,\"action\",[[19,0,[]],\"removeUser\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"event\",\"room\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"event-rooms row-cell\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Ваша переговорка\"],[8],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"element-event select-room\"],[9,\"id\",\"\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"event-time\"],[7],[0,\"\\n              \"],[1,[20,[\"event\",\"timeStart\"]],false],[0,\" - \"],[1,[20,[\"event\",\"timeEnd\"]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"event-room\"],[7],[0,\"\\n              \"],[1,[20,[\"event\",\"room\",\"title\"]],false],[0,\", \"],[1,[20,[\"event\",\"room\",\"floor\"]],false],[0,\" этаж\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"element-close close-event\"],[3,\"action\",[[19,0,[]],\"changeEventRoom\"]],[7],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"recomendationRooms\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"event-rooms row-cell\"],[7],[0,\"\\n          \"],[6,\"label\"],[9,\"for\",\"\"],[7],[6,\"span\"],[9,\"class\",\"label-input\"],[7],[0,\"Рекомендованные переговорки\"],[8],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"recomendationRooms\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"element-event recomendation-room\"],[3,\"action\",[[19,0,[]],\"selectEventRoom\",[19,1,[]]]],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"event-time\"],[7],[0,\"\\n              \"],[1,[19,1,[\"timeStart\"]],false],[0,\" - \"],[1,[19,1,[\"timeEnd\"]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"event-room\"],[7],[0,\"\\n              \"],[1,[19,1,[\"title\"]],false],[0,\", \"],[1,[19,1,[\"floor\"]],false],[0,\" этаж\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-event.hbs" } });
});
define("shri-2018/templates/components/app-header", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DiOf0fId", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"header-mainLogo\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"index\"],null,{\"statements\":[[0,\"      \"],[6,\"img\"],[9,\"src\",\"../images/logo.svg\"],[9,\"alt\",\"Яндекс переговорки\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"header-createBtn\"],[7],[0,\"\\n    \"],[11,1],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-header.hbs" } });
});
define("shri-2018/templates/components/app-loader", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VOmmmRoV", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"app-loader\"],[7],[0,\"\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-loader.hbs" } });
});
define("shri-2018/templates/components/app-modal-dialog", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HpPSk5PR", "block": "{\"symbols\":[\"button\",\"&default\"],\"statements\":[[4,\"if\",[[20,[\"insertModel\"]]],null,{\"statements\":[[6,\"div\"],[9,\"class\",\"app-modal-dialog__dialog\"],[7],[0,\"\\n  \"],[11,2],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"dialog-buttons\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"buttons\",\"length\"]]],null,{\"statements\":[[4,\"each\",[[20,[\"buttons\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[10,\"class\",[19,1,[\"class\"]],null],[3,\"action\",[[19,0,[]],\"clickButton\",[19,1,[\"callBack\"]]]],[7],[0,\"\\n        \"],[1,[19,1,[\"name\"]],false],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"button button-blue\"],[3,\"action\",[[19,0,[]],\"clickButton\"]],[7],[0,\"\\n        Хорошо\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-modal-dialog.hbs" } });
});
define("shri-2018/templates/components/app-rooms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DsWWz6h8", "block": "{\"symbols\":[\"cellGrid\",\"floor\",\"items\",\"room\"],\"statements\":[[6,\"div\"],[9,\"class\",\"app-rooms-and-events\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-rooms-and-events__rooms\"],[7],[0,\"\\n\"],[4,\"each\",[[25,\"-each-in\",[[20,[\"rooms\"]]],null]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"rooms__floor\"],[7],[0,\"\\n        \"],[1,[19,2,[]],false],[0,\" этаж\\n      \"],[8],[0,\"\\n\"],[4,\"each\",[[19,3,[]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"app-event-in-room\",null,[[\"class\",\"title\",\"capacity\",\"eventsInRoom\",\"roomId\",\"selectDate\",\"mobileSwipe\",\"leftTitle\"],[\"rooms__info\",[19,4,[\"title\"]],[19,4,[\"capacity\"]],[25,\"unless\",[[25,\"get\",[[20,[\"events\"]],[19,4,[\"id\"]]],null],[20,[\"eventsEmpty\"]],[25,\"get\",[[20,[\"events\"]],[19,4,[\"id\"]]],null]],null],[19,4,[\"id\"]],[20,[\"selectDate\"]],[20,[\"mobileSwipe\"]],[20,[\"leftTitle\"]]]]],false],[0,\"\\n\"]],\"parameters\":[4]},null]],\"parameters\":[2,3]},null],[0,\"  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"app-rooms-and-events__time-grid\"],[7],[0,\"\\n    \"],[1,[25,\"app-timer\",null,[[\"class\",\"selectDate\"],[\"time-grid-timer\",[20,[\"selectDate\"]]]]],false],[0,\"\\n\"],[4,\"each\",[[20,[\"arrayTime\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"time-grid-cell\"],[7],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[1,[25,\"app-loader\",null,[[\"visible\"],[[20,[\"visibleLoader\"]]]]],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-rooms.hbs" } });
});
define("shri-2018/templates/components/app-time-scale", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "V/nTJ/l+", "block": "{\"symbols\":[\"value\",\"index\"],\"statements\":[[6,\"div\"],[9,\"class\",\"app-time-scale\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"scaleValues\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"app-time-scale__value\"],[7],[0,\"\\n      \"],[1,[19,1,[]],false],[4,\"unless\",[[19,2,[]]],null,{\"statements\":[[0,\":00\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-time-scale.hbs" } });
});
define("shri-2018/templates/components/app-timer", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "x3ThRWEa", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"app-timer\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-timer-value\"],[7],[0,\"\\n    \"],[1,[25,\"moment-format\",[[25,\"now\",null,[[\"interval\"],[60000]]],\"HH:mm\"],null],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"app-timer-line\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-timer.hbs" } });
});
define("shri-2018/templates/components/app-user-view", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "WAWrRJNU", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[10,\"class\",[26,[\"app-user-view \",[25,\"if\",[[20,[\"dark\"]],\"dark\"],null]]]],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"user-avatar\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"user\",\"avatarUrl\"]]],null,{\"statements\":[[0,\"    \"],[6,\"img\"],[10,\"src\",[20,[\"user\",\"avatarUrl\"]],null],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"user-login\"],[7],[0,\"\\n    \"],[1,[20,[\"user\",\"login\"]],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[25,\"and\",[[20,[\"user\",\"homeFloor\"]],[20,[\"longView\"]]],null]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"user-floor\"],[7],[0,\"\\n      ⋅ \"],[1,[20,[\"user\",\"homeFloor\"]],false],[0,\" этаж\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"close\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"element-close user-remove\"],[3,\"action\",[[19,0,[]],\"closeElement\",[20,[\"user\"]]]],[7],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/components/app-user-view.hbs" } });
});
define("shri-2018/templates/create", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tbVLygu9", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"app-header\"],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"app-create-event\"],[7],[0,\"\\n\"],[4,\"app-event\",null,[[\"event\",\"allUsers\",\"validator\"],[[20,[\"model\",\"event\"]],[20,[\"model\",\"allUsers\"]],[20,[\"model\",\"validator\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"name-event\"],[7],[0,\"\\n      Новая встреча\\n    \"],[8],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"close-event element-close\"]],{\"statements\":[],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[6,\"div\"],[9,\"class\",\"app-create-event__buttons-block button-block\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"button-container\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"button button-gray button-remove\"]],{\"statements\":[[0,\"        Отмена\\n\"]],\"parameters\":[]},null],[0,\"      \"],[6,\"div\"],[9,\"class\",\"button button-blue button-create\"],[3,\"action\",[[19,0,[]],\"createEvent\"]],[7],[0,\"\\n        Создать встречу\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"app-modal-dialog\",null,[[\"actionVisible\",\"buttons\"],[[20,[\"showModal\"]],[20,[\"modalButtons\"]]]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__image\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__header\"],[7],[0,\"Встреча создана!\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__date\"],[7],[0,\"\\n      \"],[1,[25,\"moment-format\",[[20,[\"newEvent\",\"dateStart\"]],\"DD MMM, YYYY HH:mm\"],null],false],[0,\" — \"],[1,[25,\"moment-format\",[[20,[\"newEvent\",\"dateEnd\"]],\"HH:mm\"],null],false],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__room\"],[7],[0,\"\\n      \"],[1,[20,[\"newEvent\",\"room\",\"title\"]],false],[0,\" \"],[1,[20,[\"newEvent\",\"room\",\"floor\"]],false],[0,\" этаж\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/create.hbs" } });
});
define("shri-2018/templates/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FzN0xXY7", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"app-header\"],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"app-edit-event\"],[7],[0,\"\\n\"],[4,\"app-event\",null,[[\"event\",\"allUsers\",\"validator\"],[[20,[\"model\",\"event\"]],[20,[\"model\",\"allUsers\"]],[20,[\"model\",\"validator\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"name-event\"],[7],[0,\"\\n      Редактирование встречи\\n    \"],[8],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"close-event element-close\"]],{\"statements\":[],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[6,\"div\"],[9,\"class\",\"app-edit-event__buttons-block button-block\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"button-container__mobile\"],[3,\"action\",[[19,0,[]],\"removeEvent\"]],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"button-remove__mobile\"],[7],[0,\"\\n        Удалить встречу\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"button-container\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"button button-gray\"]],{\"statements\":[[0,\"        Отмена\\n\"]],\"parameters\":[]},null],[0,\"      \"],[6,\"div\"],[9,\"class\",\"button button-gray button-remove\"],[3,\"action\",[[19,0,[]],\"removeEvent\"]],[7],[0,\"\\n        Удалить встречу\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"button button-gray button-save__mobile\"],[3,\"action\",[[19,0,[]],\"updateEvent\"]],[7],[0,\"\\n        Сохранить\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"app-modal-dialog\",null,[[\"actionVisible\",\"buttons\"],[[20,[\"showModalUpdate\"]],[20,[\"modalButtons\"]]]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__image\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__header\"],[7],[0,\"Встреча отредактирована\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__date\"],[7],[0,\"\\n      \"],[1,[25,\"moment-format\",[[20,[\"newEvent\",\"dateStart\"]],\"DD MMM, YYYY HH:mm\"],null],false],[0,\" — \"],[1,[25,\"moment-format\",[[20,[\"newEvent\",\"dateEnd\"]],\"HH:mm\"],null],false],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__room\"],[7],[0,\"\\n      \"],[1,[20,[\"newEvent\",\"room\",\"title\"]],false],[0,\" \"],[1,[20,[\"newEvent\",\"room\",\"floor\"]],false],[0,\" этаж\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"app-modal-dialog\",null,[[\"actionVisible\",\"buttons\"],[[20,[\"showModalRemove\"]],[20,[\"modalButtonsRemove\"]]]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__image-remove\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-dialog-create__header\"],[7],[0,\"Встреча будет \"],[6,\"br\"],[7],[8],[0,\" удалена безвозвратно\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/edit.hbs" } });
});
define("shri-2018/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rdXCOIMj", "block": "{\"symbols\":[],\"statements\":[[4,\"app-header\",null,null,{\"statements\":[[4,\"link-to\",[\"create\",[25,\"query-params\",null,[[\"date\",\"timeStart\",\"timeEnd\",\"roomId\"],[[20,[\"selectDate\"]],\"\",\"\",\"\"]]]],[[\"class\"],[\"button button-blue\"]],{\"statements\":[[0,\"    Создать встречу\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[1,[25,\"app-calendar-home\",null,[[\"class\",\"selectDate\",\"setSelectDate\"],[\"date-and-time-calendar-mobile\",[20,[\"selectDate\"]],[25,\"action\",[[19,0,[]],\"setSelectDate\"],null]]]],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"index\"],[10,\"ontouchstart\",[25,\"action\",[[19,0,[]],\"initTouchStart\"],null],null],[10,\"ontouchmove\",[25,\"action\",[[19,0,[]],\"initTouchMove\"],null],null],[10,\"ontouchend\",[25,\"action\",[[19,0,[]],\"initTouchEnd\"],null],null],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"id\",\"scrollable-mobile\"],[10,\"class\",[26,[\" \",[25,\"if\",[[20,[\"mobileSwipe\"]],\"scrollable-element\"],null]]]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"index__date-and-time\"],[7],[0,\"\\n      \"],[1,[25,\"app-calendar-home\",null,[[\"class\",\"selectDate\",\"setSelectDate\"],[\"date-and-time-calendar-desctop\",[20,[\"selectDate\"]],[25,\"action\",[[19,0,[]],\"setSelectDate\"],null]]]],false],[0,\"\\n      \"],[1,[25,\"app-time-scale\",null,[[\"class\"],[\"date-and-time-scaleTime\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"index__rooms-and-events\"],[7],[0,\"\\n      \"],[1,[25,\"app-rooms\",null,[[\"selectDate\",\"rooms\",\"mobileSwipe\",\"leftTitle\"],[[20,[\"selectDate\"]],[20,[\"model\",\"rooms\"]],[20,[\"mobileSwipe\"]],[20,[\"leftTitle\"]]]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "shri-2018/templates/index.hbs" } });
});
define('shri-2018/testem', ['module'], function (module) {
  'use strict';

  module.exports = {
    test_page: 'tests/index.html?hidepassed',
    disable_watching: true,
    launch_in_ci: ['Chrome'],
    launch_in_dev: ['Chrome'],
    browser_args: {
      Chrome: {
        mode: 'ci',
        args: ['--disable-gpu', '--headless', '--remote-debugging-port=0', '--window-size=1440,900']
      }
    }
  };
});


define('shri-2018/config/environment', [], function() {
  var prefix = 'shri-2018';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("shri-2018/app")["default"].create({"name":"shri-2018","version":"1.0.0+a2f38ba1"});
}
//# sourceMappingURL=shri-2018.map
