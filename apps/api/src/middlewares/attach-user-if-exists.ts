import { NextFunction, Request, Response } from "express";
import {
  getUserFromCache,
  getUserFromDatabase,
  sessionSchema,
  setUserInCache,
} from "./check-authorization.js";
import { verifyToken } from "../lib/jwt.js";

export const attachUserIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.session;
    if (!token) return next();

    const payload = await verifyToken(token);
    if (!payload) return next();

    const parsedSession = sessionSchema.safeParse(payload);
    if (!parsedSession.success) return next();

    const userId = parsedSession.data.id;

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
