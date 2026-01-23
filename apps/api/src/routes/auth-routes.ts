import { Router } from "express";
import {
  googleAuthCallbackController,
  googleAuthController,
} from "../controllers/auth/google-auth.js";
import { logoutUser } from "../controllers/auth/logout-controller.js";

const routes: Router = Router();

routes.route("/auth/google").get(googleAuthController);
routes.route("/auth/google/callback").get(googleAuthCallbackController);
routes.route("/logout").get(logoutUser);
export default routes;
