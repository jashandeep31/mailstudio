import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";

export const getUserMetadata = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication required", 400);
    const creditsWallet = await getCachedUserCreditWallet(req.user.id);
    res.status(200).json({
      data: {
        creditsWallet,
        user: {
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          id: req.user.id,
          role: req.user.role,
          avatar: req.user.avatar,
          planType: req.user.planType,
        },
      },
    });
  },
);
