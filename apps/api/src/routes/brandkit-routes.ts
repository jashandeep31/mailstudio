import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]))
  .post(checkAuthorization(["all"]));

export default routes;
