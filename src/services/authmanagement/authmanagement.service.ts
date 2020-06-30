// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
import hooks from './authmanagement.hooks'
const notifier = require('./notifier');

export default function (app:any) {

  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app)));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');

  service.hooks(hooks);
};