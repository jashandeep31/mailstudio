import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  getUserTestMails,
  createTestMail,
  sendTemplateToTestMail,
} from "../controllers/user/test-mail-controller.js";
import { getUserPlan } from "../controllers/user/user-plan-controller.js";
import { getUserMetadata } from "../controllers/user/user-metadata-controller.js";

const routes: Router = Router();

routes.route("/test-mails").get(checkAuthorization(["all"]), getUserTestMails);
routes.route("/test-mails").post(checkAuthorization(["all"]), createTestMail);
routes.route("/plan").get(checkAuthorization(["all"]), getUserPlan);
routes.route("/metadata").get(checkAuthorization(["all"]), getUserMetadata);
routes
  .route("/test-mails/send-template")
  .post(checkAuthorization(["all"]), sendTemplateToTestMail);

export default routes;
