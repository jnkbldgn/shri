import Controller from "@ember/controller";
import moment from "moment";
import {htmlSafe} from "@ember/string";

const SCROLL_CONTAINER = "scrollable-mobile";
const SCROLL_CLASS = "scrollable-element";

export default Controller.extend({
	init() {
		this._super(...arguments);
		this.selectDate = moment();
		this.mobileSwipe = false;

	},
	actions: {
		setSelectDate(date) {
			return new Promise((resolve) => {
				resolve(this.set("selectDate", moment(date)));
			});
		},
		getSelectDate() {
			if (!this.get("selectDate")) {
				this.set("selectDate", moment());
			}

			return this.get("selectDate");
		},

		initTouchStart(event){
			this.set('touchX', event.changedTouches[0].pageX);
			this.set('touchY', event.changedTouches[0].pageY);
		},
		initTouchMove(event){

			if(document.getElementsByClassName(SCROLL_CLASS)){
				this.set('leftTitle', htmlSafe("left:" + document.getElementById(SCROLL_CONTAINER).scrollLeft + "px"))
			}
			this.set('delta', this.get('touchX') - event.changedTouches[0].pageX);
			return true;
		},
		initTouchEnd(event){

			let swipeTo = ''
			if(this.get('delta') < -100){
				swipeTo = 'left';
			} else if(this.get('delta') > 100) {
				swipeTo = 'right';
			}
			if (swipeTo === 'left') {
				let scrollElement = document.getElementById(SCROLL_CONTAINER);
				// if(!scrollElement.scrollLeft && scrollElement.classList.contains(SCROLL_CLASS)){
				// 	scrollElement.classList.remove(SCROLL_CLASS);
				// 	this.set('mobileSwipe', false);
				// }
				!scrollElement.scrollLeft && this.set('mobileSwipe', false);
			}

			if (swipeTo === 'right') {
				let scrollElement = document.getElementById(SCROLL_CONTAINER);
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
