import { NextFunction, Request, Response } from "express";
import {
  getUserFromCache,
  getUserFromDatabase,
  setUserInCache,
} from "./check-authorization.js";
import { verifySession } from "../lib/jwt.js";

export const attachUserIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies?.session;
    if (!sessionToken) return next();

    const payload = await verifySession(sessionToken);
    if (!payload) return next();

    const { userId } = payload;

    let userData = await getUserFromCache(userId);

    if (!userData) {
      userData = await getUserFromDatabase(userId);
      if (!userData) return next();
      await setUserInCache(userId, userData);
    }

    req.user = userData;

    return next();
  } catch (err) {
    return next();
  }
};
