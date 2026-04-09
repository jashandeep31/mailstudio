import { NextFunction, Request, Response } from "express";
import {
  getUserFromCache,
  getUserFromDatabase,
  setUserInCache,
} from "./check-authorization.js";
import { verifySessionToken } from "../lib/jwt.js";

export const attachUserIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawSession = req.cookies?.session;
    if (!rawSession) return next();

    let decoded;
    try {
      decoded = verifySessionToken(rawSession);
    } catch {
      return next();
    }

    const userId = decoded.userId;

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
