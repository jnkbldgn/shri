import Application from "@ember/application";
import Resolver from "./resolver";
import loadInitializers from "ember-load-initializers";
import config from "./config/environment";

const App = Application.extend({
	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver,
	moment: config.moment,
	autoprefixer: config.autoprefixer,
	apollo: config.apollo,
});

loadInitializers(App, config.modulePrefix);

export default App;
