import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { createBrandKit } from "../controllers/brandkit/create-brandkit-controller.js";
import {
  getUserBrandKitById,
  getUserBrandKits,
} from "../controllers/brandkit/brandkit-controller.js";
import { updateBrandKit } from "../controllers/brandkit/update-brandkit-controller.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]), getUserBrandKits)
  .post(checkAuthorization(["all"]));
routes.route("/:id").get(checkAuthorization(["all"]), getUserBrandKitById);
routes.route("/update").put(checkAuthorization(["all"]), updateBrandKit);
export default routes;
