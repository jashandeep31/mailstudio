import { Router } from "express";
import { getChatTemplateHtml } from "../controllers/internal/get-chat-template-html.js";

const routes: Router = Router();

routes.route("/get-html-code/:chatId").get(getChatTemplateHtml);
export default routes;
