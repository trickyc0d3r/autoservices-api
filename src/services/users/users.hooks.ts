import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";
import registration from "../../hooks/registration";
// Don't remove this comment. It's needed to format import lines nicely.
const verifyHooks = require("feathers-authentication-management").hooks;
const accountService = require("../authmanagement/notifier");

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const fields: any = [
  "email",
  "isVerified",
  "verifyToken",
  "verifyShortToken",
  "verifyExpires",
  "verifyChanges",
  "resetToken",
  "resetShortToken",
  "resetExpires",
];
import {
  disallow,
  iff,
  isProvider,
  preventChanges,
} from "feathers-hooks-common";

export default {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [
      verifyHooks.addVerification(),
      hashPassword("password"),
      registration(),
    ],
    update: [disallow("external")], //, hashPassword("password"), authenticate("jwt")],
    patch: [
      iff(
        isProvider("external"),
        preventChanges(fields),
        hashPassword("password"),
        authenticate("jwt")
      ),
    ],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [],
    get: [],
    create: [
      (context: any) => {
        accountService(context.app).notifier(
          "resendVerifySignup",
          context.result
        );
      },
      verifyHooks.removeVerification(),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
