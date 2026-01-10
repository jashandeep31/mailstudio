import { Router } from "express";
import {
  deleteUserChat,
  getAllUserChats,
  updateChat,
} from "../controllers/chats/chat-controllers.js";
import { checkChatAuth } from "../lib/redis/check-chat-auth.js";
import { checkAuthorization } from "../middlewares/check-authorization.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]), getAllUserChats)
  .post(checkAuthorization(["all"]), updateChat);
routes.route("/:chatId").delete(checkAuthorization(["all"]), deleteUserChat);

export default routes;
