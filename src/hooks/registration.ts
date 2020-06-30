// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
import crypto from "crypto";
import { Forbidden } from "@feathersjs/errors";

const gravatarUrl = "https://s.gravatar.com/avatar";
const qery = "s=90";

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { email, password } = context.data;
    if (!email && !password) {
      throw new Forbidden("Check credentials", {
        error_code: 1403,
        error_message: "No credentials at all",
      });
    }
    if (!email) {
      throw new Forbidden("Check credentials", {
        error_code: 1404,
        error_message: "No email",
      });
    }
    if (!password) {
      throw new Forbidden("Check credentials", {
        error_code: 1405,
        error_message: "No password",
      });
    }

    const hash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");
    const avatar = `${gravatarUrl}/${hash}?${qery}`;
    const userData = {
      email,
      password,
      avatar,
      createdAt: new Date().getTime(),
      verificationToken: crypto
        .createHash("md5")
        .update(
          `${{ email: email.toLowerCase(), createdAt: new Date().getTime() }}`
        )
        .digest("hex"),
      verified: false,
    };
    context.data = {
      ...userData,
    };

    return await context.service
      .find({
        query: {
          email,
        },
      })
      .then(({ data }) =>
        data.length
          ? (() => {
              throw new Forbidden("Check credentials", {
                error_code: 1400,
                error_message: "User already exist",
              });
            })()
          : context
      );
  };
};
