import { Router } from "express";
import {
  getMarketplaceTemplateById,
  getMarketplaceTemplates,
} from "../controllers/markplace/get-templates.js";
import { purchaseTemplate } from "../controllers/markplace/purchase-template.js";
import { checkAuthorization } from "../middlewares/check-authorization.js";
import { attachUserIfExists } from "../middlewares/attach-user-if-exists.js";

const routes: Router = Router();
routes.route("/templates").get(getMarketplaceTemplates);
routes
  .route("/templates/:id")
  .get(attachUserIfExists, getMarketplaceTemplateById);
routes
  .route("/purchase-template")
  .post(checkAuthorization(["all"]), purchaseTemplate);
export default routes;
