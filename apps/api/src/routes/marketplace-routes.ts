import { Router } from "express";
import {
  getMarketplaceTemplateById,
  getMarketplaceTemplates,
} from "../controllers/markplace/get-templates.js";
import { purchaseTemplate } from "../controllers/markplace/purchase-template.js";

const routes: Router = Router();
routes.route("/templates").get(getMarketplaceTemplates);
routes.route("/templates/:id").get(getMarketplaceTemplateById);
routes.route("/purchase-template").post(purchaseTemplate);
export default routes;
