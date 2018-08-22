'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  console.log(defaults);
  let app = new EmberApp(defaults, {});
  return app.toTree();
};
