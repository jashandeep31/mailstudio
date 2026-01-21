import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { getPreSignedUrl } from "../controllers/utils/pre-signed-urls-controller.js";
import { getCategories } from "../controllers/utils/get-categories.js";

const routes: Router = Router();
routes
  .route("/get-presigned-url")
  .post(checkAuthorization(["all"]), getPreSignedUrl);
routes.route("/categories").get(getCategories);
export default routes;
