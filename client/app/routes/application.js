// import Ember from '@ember';
import Route from "@ember/routing/route";
import {inject} from "@ember/service";


export default Route.extend({
	moment: inject(),
	beforeModel() {
		this.get("moment").setLocale("ru");
	},
});
