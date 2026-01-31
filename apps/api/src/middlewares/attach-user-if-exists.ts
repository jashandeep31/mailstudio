import { NextFunction, Request, Response } from "express";
import {
  getUserFromCache,
  getUserFromDatabase,
  sessionSchema,
  setUserInCache,
} from "./check-authorization.js";

export const attachUserIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawSession = req.cookies?.session;
    if (!rawSession) return next();

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawSession);
    } catch {
      return next();
    }

    const parsedSession = sessionSchema.safeParse(parsedJson);
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
