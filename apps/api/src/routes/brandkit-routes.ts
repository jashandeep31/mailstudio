import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { createBrandKit } from "../controllers/brandkit/create-brandkit-controller.js";
import { getUserBrandKits } from "../controllers/brandkit/brandkit-controller.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]), getUserBrandKits)
  .post(checkAuthorization(["all"]));
routes.route("/test").get(checkAuthorization(["all"]), createBrandKit);
export default routes;
