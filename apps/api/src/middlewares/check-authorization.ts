import type { Request, Response, NextFunction } from "express";
import { userRoleEnum } from "@repo/db";

import { z } from "zod";
const sessionSchema = z.object({
  email: z.string(),
  id: z.string(),
  role: z.enum(userRoleEnum.enumValues),
});

const ROLES = [...userRoleEnum.enumValues, "all"] as const;
type UserRole = (typeof ROLES)[number];

export const checkAuthorization =
  (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    console.log(`sfareas`);
    const session = req.cookies.session;
    if (!session) {
      res.status(400).json({
        error: "Please login with you creds",
      });
      return;
    }
    const parsedSession = sessionSchema.parse(JSON.parse(session));
    req["user"] = parsedSession;
    console.log(roles, parsedSession.role);

    if (roles.includes("all") || roles.includes(parsedSession.role)) {
      next();
      return;
    }

    res.status(400).json({
      error: "Please re-login or you have permission",
    });
    return;
  };
