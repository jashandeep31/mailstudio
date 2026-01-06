import { Router } from "express";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { getUserTestMails } from "../controllers/user/test-mail-controller.js";

const routes: Router = Router();

routes.route("/test-mails").get(checkAuthorization(["all"]), getUserTestMails);

export default routes;
