import { Router } from "express";
import { getAllUserChats } from "../controllers/chats/chat-controllers.js";
import { checkChatAuth } from "../lib/redis/check-chat-auth.js";
import { checkAuthorization } from "../middlewares/check-authorization.js";

const routes: Router = Router();

routes.route("/").get(checkAuthorization(["all"]), getAllUserChats);

export default routes;
