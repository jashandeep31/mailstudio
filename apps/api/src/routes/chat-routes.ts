import { Router } from "express";
import {
  deleteUserChat,
  getAllUserChats,
  updateChat,
  getChatById,
} from "../controllers/chats/chat-controllers.js";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { deleteChatVersion } from "../controllers/chats/chat-version-controllers.js";
import { likeChat } from "../controllers/chats/like-chat-controller.js";

const routes: Router = Router();

routes
  .route("/")
  .get(checkAuthorization(["all"]), getAllUserChats)
  .post(checkAuthorization(["all"]), updateChat);

routes
  .route("/:chatId")
  .get(checkAuthorization(["all"]), getChatById)
  .delete(checkAuthorization(["all"]), deleteUserChat);

routes
  .route("/delete/version/:versionId")
  .delete(checkAuthorization(["all"]), deleteChatVersion);

routes.route("/like/").post(checkAuthorization(["all"]), likeChat);
export default routes;
