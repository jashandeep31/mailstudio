import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import {
  getUserTestMails,
  sendTemplateToTestMail,
} from "../controllers/user/test-mail-controller.js";

const routes: Router = Router();

routes.route("/test-mails").get(checkAuthorization(["all"]), getUserTestMails);
routes
  .route("/test-mails/send-template")
  .post(checkAuthorization(["all"]), sendTemplateToTestMail);

export default routes;
