import { catchAsync } from "../../lib/catch-async.js";
import { Response, Request } from "express";
import { handleSubscriptionActiveWebhook } from "./functions/subscription-active.js";
import { handlePaymentSuccessWebhook } from "./functions/payment-success.js";

export const handleDodoPaymentWebhook = catchAsync(
  async (req: Request, res: Response) => {
    // const event = dodoPaymentClient.webhooks.unwrap(req.body.toString(), {
    //   headers: {
    //     "webhook-id": req.headers["webhook-id"] as string,
    //     "webhook-signature": req.headers["webhook-signature"] as string,
    //     "webhook-timestamp": req.headers["webhook-timestamp"] as string,
    //   },
    // });
    const event = req.body;

    switch (event.type) {
      case "payment.succeeded":
        await handlePaymentSuccessWebhook({
          event,
          res,
        });
        break;
      case "subscription.active":
        console.log(`we are in the active subs case`);
        await handleSubscriptionActiveWebhook({
          event,
        });
        break;
      default:
        break;
    }
    res.status(200).json({ received: true });
    return;
  },
);
