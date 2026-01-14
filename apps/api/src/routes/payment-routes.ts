import { Router } from "express";

import DodoPayments from "dodopayments";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  getProSubscriptonUrl,
  handleDodoPaymentWebhook,
} from "../controllers/payments/dodo-payments.js";

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
});

const routes: Router = Router();
routes.route("/upgrade").get(checkAuthorization(["all"]), getProSubscriptonUrl);

// routes.route("/dodo-webhoook").post(handleDodoPaymentWebhook);

export default routes;
