import Route from "@ember/routing/route";
import RSVP from "rsvp";
import {inject} from "@ember/service";

export default Route.extend({
	gqlAPI: inject("gql-api"),
	model() {
		return RSVP.hash( {
			rooms: this.get("gqlAPI").getRooms(),
		} );
	},
});
