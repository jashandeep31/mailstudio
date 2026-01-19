import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { createBrandKit } from "../controllers/brandkit/create-brandkit-controller.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]))
  .post(checkAuthorization(["all"]));
routes.route("/test").get(checkAuthorization(["all"]), createBrandKit);
export default routes;
