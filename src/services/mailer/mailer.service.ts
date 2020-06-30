// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import hooks from "./mailer.hooks";
const Mailer = require("feathers-mailer");
const smtpTransport = require("nodemailer-smtp-transport");

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    mailer: ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/mailer",
    Mailer(
      smtpTransport({
        service: "gmail",
        auth: {
          user: "trickyc0d3r@gmail.com",
          pass: "vqqnpbviijvprdot",
        },
      })
    )
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("mailer");

  service.hooks(hooks);
}
