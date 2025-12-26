import type { Request, Response, NextFunction } from "express";
import { userRoleEnum } from "@repo/db";

const ROLES = [...userRoleEnum.enumValues, "all"] as const;
type UserRole = (typeof ROLES)[number];

export const checkAuthorization =
  (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    next();
  };
