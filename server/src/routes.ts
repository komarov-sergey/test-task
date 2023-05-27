import Router from "koa-router";

import errorHandler from "./middleware/err";
import user from "./user/user.route";
import task from "./task/task.route";

export default new Router({ prefix: "/api" })
  .use(errorHandler)
  .use(["/user", "/users"], user.routes())
  .use(["/task", "/tasks"], task.routes())
  .get("/healthcheck", (ctx) => {
    ctx.response.status = 200;
  });
