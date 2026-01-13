import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { getPreSignedUrl } from "../controllers/utils/pre-signed-urls-controller.js";

const routes: Router = Router();
routes
  .route("/get-presigned-url")
  .post(checkAuthorization(["all"]), getPreSignedUrl);
export default routes;
