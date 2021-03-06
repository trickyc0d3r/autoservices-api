import { Application } from '../declarations';
import users from './users/users.service';
import authmanagement from './authmanagement/authmanagement.service';
import mailer from './mailer/mailer.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(authmanagement);
  app.configure(mailer);
}
