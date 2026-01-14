import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  dodoCustomerSession,
  getProSubscriptonUrl,
} from "../controllers/payments/dodo-payments.js";

const routes: Router = Router();
routes
  .route("/upgrade")
  .post(checkAuthorization(["all"]), getProSubscriptonUrl);
routes
  .route("/management")
  .post(checkAuthorization(["all"]), dodoCustomerSession);

export default routes;
