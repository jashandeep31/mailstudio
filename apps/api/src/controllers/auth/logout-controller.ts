import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";

/**
 * Will clear the user session
 */
export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: true,
    sameSite: "none", // or "lax" (must match)
    path: "/",
  });
  res.status(200).json({
    status: "success",
  });
  return;
});
