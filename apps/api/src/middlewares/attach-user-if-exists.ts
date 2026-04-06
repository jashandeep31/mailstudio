import { NextFunction, Request, Response } from "express";
import {
  getUserFromCache,
  getUserFromDatabase,
  sessionSchema,
  setUserInCache,
} from "./check-authorization.js";
import { env } from "../lib/env.js";
import jwt from "jsonwebtoken";

export const attachUserIfExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.session;
    if (!token) return next();

    let parsedSession;
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        role: string;
      };
      parsedSession = sessionSchema.safeParse({
        id: decoded.id,
        role: decoded.role,
      });
    } catch {
      return next();
    }

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
