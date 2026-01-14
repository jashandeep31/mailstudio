import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  dodoCustomerSession,
  getProSubscriptonUrl,
} from "../controllers/payments/dodo-payments.js";

const routes: Router = Router();
routes.route("/upgrade").get(checkAuthorization(["all"]), getProSubscriptonUrl);
routes
  .route("/management")
  .get(checkAuthorization(["all"]), dodoCustomerSession);

export default routes;
