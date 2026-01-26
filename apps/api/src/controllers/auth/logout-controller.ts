import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { env } from "../../lib/env.js";

/**
 * Will clear the user session
 */
export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const isProd = env.ENVOIRONMENT !== "development";

  res.clearCookie("session", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    domain: isProd ? ".mailstudio.dev" : undefined,
  });
  res.status(200).json({
    status: "success",
  });
  return;
});
