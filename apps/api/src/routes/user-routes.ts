import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  getUserTestMails,
  createTestMail,
  sendTemplateToTestMail,
  deleteTestMail,
  verifyTestMail,
} from "../controllers/user/test-mail-controller.js";
import { getUserPlan } from "../controllers/user/user-plan-controller.js";
import { getUserBillings } from "../controllers/user/user-billings-controller.js";
import { getUserMetadata } from "../controllers/user/user-metadata-controller.js";

const routes: Router = Router();

routes
  .route("/test-mails")
  .get(checkAuthorization(["all"]), getUserTestMails)
  .post(checkAuthorization(["all"]), createTestMail);
routes
  .route("/test-mails/verify")
  .post(checkAuthorization(["all"]), verifyTestMail);
routes
  .route("/test-mails/:id")
  .delete(checkAuthorization(["all"]), deleteTestMail);

routes.route("/plan").get(checkAuthorization(["all"]), getUserPlan);
routes.route("/metadata").get(checkAuthorization(["all"]), getUserMetadata);
routes.route("/billings").get(checkAuthorization(["all"]), getUserBillings);
routes
  .route("/test-mails/send-template")
  .post(checkAuthorization(["all"]), sendTemplateToTestMail);

export default routes;
