import { Response, Router, Request } from "express";

import DodoPayments from "dodopayments";

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
});

const routes: Router = Router();

routes.route("/test").get(async (req: Request, res: Response) => {
  const session = await client.checkoutSessions.create({
    product_cart: [{ product_id: "pdt_0NW3JXP572Os6xSYT6Hio", quantity: 1 }],
    subscription_data: {},
    customer: {
      email: "subscriber@example.com",
      name: "Jane Doe",
    },
    return_url: "https://example.com/success",
  });
  console.log(session.checkout_url);
  res.status(200).json({
    url: session.checkout_url,
  });
});

routes.route("/dodo-webhoook").post(async (req: Request, res: Response) => {
  console.log(req.body);
  return;
});

export default routes;
