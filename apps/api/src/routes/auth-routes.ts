import { Router } from "express";
import {
  googleAuthCallbackController,
  googleAuthController,
} from "../controllers/auth/google-auth.js";

const routes: Router = Router();

routes.route("/auth/google").get(googleAuthController);
routes.route("/auth/google/callback").get(googleAuthCallbackController);

export default routes;
