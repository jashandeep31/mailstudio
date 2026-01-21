import { Router } from "express";
import { getMarketplaceTemplates } from "../controllers/markplace/get-templates.js";

const routes: Router = Router();
routes.route("/templates").get(getMarketplaceTemplates);
export default routes;
